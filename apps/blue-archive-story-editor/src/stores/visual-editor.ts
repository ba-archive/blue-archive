import { acceptHMRUpdate, defineStore } from 'pinia'
import type { BackgroundNode, BgmNode, CharacterNode, DialogNode, NaNode, StoryNode, StoryNodeT, WaitNode } from '~/types/visual-editor'
import { StoryNodeType } from '~/types/visual-editor'
import { saveStoryWork, updateStoryWork } from '~/api/index'
import type { StoryWork } from '~/types/story-gallery'

export const useVisualEditorStore = defineStore(
  'visualEditor',
  () => {
    const storyId = ref<string | null>(null)
    const storyTitle = ref('')
    const storyDescription = ref('')
    const storyCover = ref('')
    const storyReleased = ref(false)

    const storyNodes = ref<StoryNode[]>([])
    const storyIndex = ref(0)

    async function saveStory() {
      let story: StoryWork
      const data = {
        title: storyTitle.value,
        cover: storyCover.value,
        description: storyDescription.value,
        story: { content: storyNodes.value },
        released: storyReleased.value,
      }
      if (storyId.value)
        story = await updateStoryWork(storyId.value, data)
      else
        story = await saveStoryWork(data)

      storyId.value = story.id
    }

    function getLastCharacters() {
    // todo use id not index
      for (let i = storyNodes.value.length - 1; i > 0; i--) {
        const node = storyNodes.value[i]
        if (node.type === StoryNodeType.CharacterNode)
          return JSON.parse(JSON.stringify(node.characters))
      }
      return [null, null, null, null, null]
    }

    // declare function newNode<T extends StoryNodeType>(type: T): StoryNodeT<T>;
    function newNode<T extends StoryNodeType>(type: T): StoryNodeT<T> {
      const newStoryIndex = storyIndex.value + 1
      if (type === StoryNodeType.DialogNode) {
        const temp: DialogNode = {
          id: newStoryIndex,
          type: StoryNodeType.DialogNode,
          dialog: {
            speaker: 0,
            text: '',
          },
          next: null,
        }
        storyNodes.value.push(temp)
        storyIndex.value += 1
        return temp as StoryNodeT<T>
      }
      else if (type === StoryNodeType.BackgroundNode) {
        const temp: BackgroundNode = {
          id: newStoryIndex,
          type: StoryNodeType.BackgroundNode,
          backgroundId: 0,
          next: null,
        }
        storyNodes.value.push(temp)
        storyIndex.value += 1
        return temp as StoryNodeT<T>
      }
      else if (type === StoryNodeType.NaNode) {
        const temp: NaNode = {
          id: newStoryIndex,
          type: StoryNodeType.NaNode,
          speaker: 0,
          text: '',
          next: null,
        }
        storyNodes.value.push(temp)
        storyIndex.value += 1
        return temp as StoryNodeT<T>
      }
      else if (type === StoryNodeType.BgmNode) {
        const temp: BgmNode = {
          id: newStoryIndex,
          type: StoryNodeType.BgmNode,
          bgmId: 0,
          next: null,
        }
        storyNodes.value.push(temp)
        storyIndex.value += 1
        return temp as StoryNodeT<T>
      }
      else if (type === StoryNodeType.CharacterNode) {
        const temp: CharacterNode = {
          id: newStoryIndex,
          type: StoryNodeType.CharacterNode,
          characters: getLastCharacters(),
          next: null,
        }
        storyNodes.value.push(temp)
        storyIndex.value += 1
        return temp as StoryNodeT<T>
      }
      else if (type === StoryNodeType.WaitNode) {
        const temp: WaitNode = {
          id: newStoryIndex,
          type: StoryNodeType.WaitNode,
          milliSecond: 0,
          next: null,
        }
        storyNodes.value.push(temp)
        storyIndex.value += 1
        return temp as StoryNodeT<T>
      }
      else {
        throw new Error('unrecognized node')
      }
    }

    function getNodeIndex(id: number) {
      for (let i = 0; i < storyNodes.value.length; i++) {
        if (storyNodes.value[i].id === id)
          return i
      }

      return -1
    }
    function getLastNode(id: number) {
      for (let i = 0; i < storyNodes.value.length; i++) {
        if (storyNodes.value[i].next === id)
          return i
      }

      return -1
    }

    /** 添加在前 */
    function addNode(id: number, newNode: StoryNode) {
      const nodeIndex = getNodeIndex(id)
      const lastNodeIndex = getLastNode(id)
      if (nodeIndex === -1)
        return false
      if (lastNodeIndex !== -1)
        storyNodes.value[lastNodeIndex].next = newNode.id
      newNode.next = storyNodes.value[nodeIndex].next
      storyNodes.value.splice(nodeIndex, 0, newNode)
      return true
    }

    /** 添加在后 */
    function addNodeAfter(id: number, newNode: StoryNode) {
      const nodeIndex = getNodeIndex(id)
      const nextNodeIndex = storyNodes.value[nodeIndex].next || -1
      if (nodeIndex === -1)
        return false
      storyNodes.value[nodeIndex].next = newNode.id
      newNode.next = nextNodeIndex
      storyNodes.value.splice(nodeIndex + 1, 0, newNode)
      return true
    }

    function removeNode(id: number) {
      let lastNodeIndex = -1
      let nodeIndex = -1
      for (let i = 0; i < storyNodes.value.length; i++) {
        if (storyNodes.value[i].id === id)
          nodeIndex = i
        if (storyNodes.value[i].next === id)
          lastNodeIndex = i
        if (lastNodeIndex !== -1 && nodeIndex !== -1)
          break
      }
      if (lastNodeIndex !== -1)
        storyNodes.value[lastNodeIndex].next = storyNodes.value[nodeIndex].next
      if (nodeIndex !== -1) {
        const removed = storyNodes.value[nodeIndex]
        storyNodes.value.splice(nodeIndex, 1)
        return removed
      }
      return null
    }

    function moveNode(fromId: number, toId: number) {
    // todo use id not index
      const fromIndex = getNodeIndex(fromId)
      const toIndex = getNodeIndex(toId)
      if (fromId === toId)
        return true
      if (fromIndex === -1 || toIndex === -1)
        return false

      const removed = removeNode(fromId)
      if (!removed)
        return false
      if (fromIndex < toIndex)
        return addNodeAfter(toId, removed)

      if (fromIndex > toIndex)
        return addNode(toId, removed)
    }

    return {
      storyReleased,
      storyTitle,
      storyDescription,
      storyCover,
      storyNodes,
      saveStory,
      newNode,
      removeNode,
      getNode: getNodeIndex,
      addNode,
      moveNode,
      addNodeAfter,
    }
  },
  {
    persist: true,
  },
)

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useAppStore as any, import.meta.hot))
