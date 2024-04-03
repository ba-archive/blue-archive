<script setup lang="ts">
import type { Asset, ResourceTree } from '../../types/resource'

const props = defineProps<{
  resourceTree: ResourceTree
}>()

// 树状结构资源，保存状态
interface ResourceTreeStateType {
  name: string
  children: (ResourceTreeStateType | Asset)[]
  arrow: 'expanded' | 'collapsed' | 'none'
}
const resourceTreeState = ref<ResourceTreeStateType>((() => {
  const result: any = cloneJSON(props.resourceTree)
  const dfsStack = [result]
  while (dfsStack.length) {
    const current = dfsStack.pop()!
    if (isResourceTreeState(current)) {
      current.arrow = 'collapsed'
      for (let i = current.children.length - 1; i >= 0; i--)
        dfsStack.push(current.children[i])
    }
  }
  return result
})())

// 展平后的资源，方便 v-for 展示。保存状态
interface ListItemState {
  name: string
  asset?: Asset // 如果为空则为目录
  indentLevel?: number
  originData: ResourceTreeStateType | Asset
}

function isResourceTreeState(obj: ResourceTreeStateType | Asset): obj is ResourceTreeStateType {
  return Object.prototype.hasOwnProperty.call(obj, 'children')
}

const itemList = ref<ListItemState[]>([])

// 根据 `resourceTreeState` 展平树状结构至 `listItem`
function buildItemList() {
  itemList.value.length = 0
  const dfsStack: [(ResourceTreeStateType | Asset), number][] = [[resourceTreeState.value, 0]]
  while (dfsStack.length) {
    const [current, depth] = dfsStack.pop()!
    if (isResourceTreeState(current)) {
      itemList.value.push({
        name: current.name,
        indentLevel: depth,
        originData: current,
      })
      if (current.arrow === 'expanded') {
        for (let i = current.children.length - 1; i >= 0; i--)
          dfsStack.push([current.children[i], depth + 1])
      }
    }
    else {
      itemList.value.push({
        name: current.name,
        asset: current,
        indentLevel: depth,
        originData: current,
      })
    }
  }
  return itemList
}
watch(() => [props.resourceTree, itemList], buildItemList, { immediate: true })
function handleFileItemClick() {
  buildItemList()
}
</script>

<script lang="ts">
export default {
  name: 'ResourceExplorer',
}
</script>

<template>
  <div class="resource-explorer">
    <ul>
      <li v-for="(item, index) in itemList" :key="index">
        <FileItem
          v-if="isResourceTreeState(item.originData)"
          v-model:arrow="item.originData.arrow"
          :title="item.name"
          :indent-level="item.indentLevel"
          @click="handleFileItemClick"
        />
        <FileItem
          v-else
          arrow="none"
          :title="item.name"
          :indent-level="item.indentLevel"
          @click="handleFileItemClick"
        />
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped></style>

<preview lang="md">
  # Preview ResourceExplorer Component

  <script setup lang=ts>
    import testResourceTree from '../../../scripts/RealResourceTree.json'
  </script>

  <template>
    <slot :resourceTree="testResourceTree"></slot>
  </template>
</preview>
