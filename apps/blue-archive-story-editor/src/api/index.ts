import { instance } from './request'
import type { StoryWork } from '~/types/story-gallery'

export async function getStoryWorks(): Promise<StoryWork[]> {
  const resp = await instance.get('/story-works/')
  const data = resp.data
  return data
}
