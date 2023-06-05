import { Section, StoryBriefing } from '../types/StoryJson';

export function getAllFlattenedStoryIndex(
  storyIndex: StoryBriefing[] | Section[] | undefined
) {
  const res: Section[] = [];
  if (!storyIndex) return res;
  for (const story of storyIndex) {
    if ((story as StoryBriefing)?.sections) {
      res.push(...getAllFlattenedStoryIndex((story as StoryBriefing).sections));
    } else {
      res.push(story as Section);
    }
  }
  return res;
}
