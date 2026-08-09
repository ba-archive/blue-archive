/* player 是播放器不是玩家 */
import axios, { type AxiosProgressEvent } from "axios";
import { tryit } from "radash";
import {
  RawStoryUnit,
  Section,
  StoryAbstract,
  StoryBriefing,
  StoryContent,
} from "@/types/StoryJson";
// 故事目录
import { stories as mainStories } from "@index/mainStoryIndex";
import { stories as otherStories } from "@index/otherStoryIndex";
import { stories as eventStories } from "@index/eventStoryIndex";
import { getAllFlattenedStoryIndex } from "@util/getAllFlattenedStoryIndex";

export type QueryType =
  | "main"
  | "favor"
  | "event"
  | "group"
  | "mini"
  | "other"
  | "ai"
  | "summary";
export type QueryProps = {
  directoryId?: number | string;
  storyId: number | string;
};
export type StorySummaryRaw = {
  id: number;
  abstracts: StoryAbstract[];
};

const catalogByType: Partial<Record<QueryType, StoryBriefing[]>> = {
  main: mainStories,
  other: otherStories,
  event: eventStories,
};

export function getQueryUrl(
  type: QueryType,
  { directoryId, storyId }: QueryProps
) {
  const baseUrl = "/story";
  const defaultDirectoryId = directoryId ?? storyId.toString().slice(0, 5);
  let queryUrl = "";
  // 这边之后可以改成后端查询
  switch (type) {
    case "main":
    case "other":
      queryUrl = `${baseUrl}/${type}/${storyId}.json`;
      break;
    case "favor":
    case "event":
    case "group":
    case "mini":
      queryUrl = `${baseUrl}/${type}/${defaultDirectoryId}/${storyId}.json`;
      break;
    case "ai":
      queryUrl = `${baseUrl}/ai/favor/${defaultDirectoryId}/${
        storyId.toString().slice(0, 5) +
        storyId.toString().slice(5).padStart(2, "0")
      }.json`;
      break;
    case "summary":
      queryUrl = `${baseUrl}/favor/${defaultDirectoryId}/index.json`;
      break;
  }
  return queryUrl;
}

export async function getStoryJson(
  type: QueryType,
  { directoryId, storyId }: QueryProps,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void,
  retryAfterFetchError: boolean = true
): Promise<{ story: StoryContent | StorySummaryRaw; isAiTranslated: boolean }> {
  const queryUrl = getQueryUrl(type, { directoryId, storyId });

  const [err, story] = await tryit(() =>
    axios.get(queryUrl, { onDownloadProgress })
  )();

  if (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        if (retryAfterFetchError) {
          return getStoryJson(
            type === "favor" ? "ai" : type, // 只有好感剧情有AI翻译版本
            { directoryId, storyId },
            onDownloadProgress,
            false
          );
        }
      }
    }
    throw err;
  }

  if (typeof story.data === "string") {
    // 后端返回了404默认页面，尝试请求AI翻译版本
    if (retryAfterFetchError && type === "favor") {
      return getStoryJson(
        "ai",
        { directoryId, storyId },
        onDownloadProgress,
        false
      );
    }
  }

  if (!story) throw new Error("No story data received");
  return { story: story.data, isAiTranslated: "ai" === type };
}

function createAfterBattleMarker(groupId: number): RawStoryUnit {
  return {
    GroupId: groupId,
    SelectionGroup: 0,
    BGMId: 0,
    Sound: "",
    Transition: 0,
    BGName: 0,
    BGEffect: 0,
    PopupFileName: "",
    ScriptKr: "#all;hide\n#afterbattle",
    TextJp: "",
    VoiceJp: "",
  };
}

/** Loads a chapter and merges the after-battle continuation with a #afterbattle marker. */
export async function loadPreparedStory(
  type: QueryType,
  props: QueryProps,
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void
): Promise<{ story: StoryContent; isAiTranslated: boolean }> {
  const mainResult = await getStoryJson(type, props, onDownloadProgress);
  const main = mainResult.story as StoryContent;
  const section = findStorySection(type, props.storyId);
  const afterBattle = findAfterBattleSection(section, type);
  if (!afterBattle) {
    return { story: main, isAiTranslated: mainResult.isAiTranslated };
  }

  const afterResult = await getStoryJson(type, {
    directoryId: props.directoryId,
    storyId: afterBattle.story_id,
  });
  const after = afterResult.story as StoryContent;
  return {
    story: {
      ...main,
      content: [
        ...main.content,
        createAfterBattleMarker(main.GroupId),
        ...after.content,
      ],
    },
    isAiTranslated: mainResult.isAiTranslated || afterResult.isAiTranslated,
  };
}

export function findStorySection(
  type: QueryType,
  storyId: string | number
): Section | undefined {
  const catalog = catalogByType[type];
  if (!catalog) return undefined;
  return getAllFlattenedStoryIndex(catalog).find(
    section => section.story_id.toString() === storyId.toString()
  );
}

/** Chapters shown in the catalog (after-battle parts are merged into the pre-battle chapter). */
export function filterVisibleSections(sections: Section[]): Section[] {
  return sections.filter(section => !section.is_after_battle);
}

export function findAfterBattleSection(
  section: Section | undefined,
  type: QueryType
): Section | undefined {
  if (!section?.next) return undefined;
  const next = findStorySection(type, section.next);
  return next?.is_after_battle ? next : undefined;
}

export function getLogicalNextSection(
  section: Section | undefined,
  type: QueryType
): Section | undefined {
  if (!section) return undefined;
  const afterBattle = findAfterBattleSection(section, type);
  if (afterBattle?.next) {
    return findStorySection(type, afterBattle.next);
  }
  if (section.next) {
    return findStorySection(type, section.next);
  }
  return undefined;
}

export function getReleasedStories(type: QueryType = "main"): StoryBriefing[] {
  const catalog = catalogByType[type];
  if (!catalog) return [];
  return catalog
    .filter(story => [undefined, true].includes(story?.released))
    .map(arc => ({
      ...arc,
      sections: filterVisibleSections(arc.sections),
    }));
}

export async function getStorySummary(
  type: QueryType,
  { directoryId, storyId }: QueryProps
): Promise<StoryAbstract | Section | undefined> {
  switch (type) {
    case "favor":
      const storySummary = (
        await getStoryJson("summary", { directoryId, storyId })
      ).story as StorySummaryRaw;
      if (!storySummary || !storySummary.abstracts.length)
        throw new Error("No story summary received");
      return storySummary.abstracts.find(
        abstract => abstract.groupId.toString() === storyId.toString()
      );
    case "main":
      const mainStoryIndexFlattened = getAllFlattenedStoryIndex(mainStories);
      return mainStoryIndexFlattened.find(
        story => story.story_id.toString() === storyId.toString()
      );
    case "event":
      const eventStoryIndexFlattened = getAllFlattenedStoryIndex(eventStories);
      return eventStoryIndexFlattened.find(
        story => story.story_id.toString() === storyId.toString()
      );
    case "other":
      const otherStoryIndexFlattened = getAllFlattenedStoryIndex(otherStories);
      return otherStoryIndexFlattened.find(
        story => story.story_id.toString() === storyId.toString()
      );
  }
}
