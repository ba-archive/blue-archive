/* player 是播放器不是玩家 */
import axios, { type AxiosProgressEvent } from "axios";
import { tryit } from "radash";
import { StoryAbstract, StoryContent, Section } from "@/types/StoryJson";
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
