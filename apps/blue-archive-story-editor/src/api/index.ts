import { instance } from './request'
import type { StoryWorkCreate, StoryWorkUpdate } from '~/schemas'
import type { StoryWork } from '~/types/story-gallery'

export async function getStoryWorks(): Promise<StoryWork[]> {
  const resp = await instance.get('/story-works/')
  return resp.data
}

export async function getStoryWorksMyWork(): Promise<StoryWork[]> {
  const resp = await instance.get('/story-works/my-works')
  return resp.data
}

export async function saveStoryWork(obj: StoryWorkCreate): Promise<StoryWork> {
  const resp = await instance.post('/story-works/', obj)
  return resp.data
}

export async function updateStoryWork(id: string, obj: StoryWorkUpdate): Promise<StoryWork> {
  const resp = await instance.put(`/story-works/${id}`, obj)
  return resp.data
}
