<script lang="ts" setup>
const valueString = ref('我能吞下玻璃而不伤身体')
const valueNumber = ref(0)
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">输入框 / Input</e-h1>
  <e-space vertical size="large" margin="16">
    <e-space vertical size="medium" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] p-4 bg-[var(--arona-blue-1)]">
      <e-h2>基本用法</e-h2>
      <e-h3>默认状态</e-h3>
      <e-text>v-model：{{ valueString }}</e-text>
      <e-input width="300" v-model="valueString" placeholder="请输入内容">
        <template #prefix>
          前缀
        </template>
        <template #suffix>
          后缀
        </template>
      </e-input>
      <e-h3>禁用状态</e-h3>
      <e-input disabled width="300px" v-model="valueString" placeholder="请输入内容">
        <template #prefix>
          前缀
        </template>
        <template #suffix>
          后缀
        </template>
      </e-input>
    </e-space>
    <e-space vertical size="medium" class="rounded-md border-1 border-solid border-[var(--arona-blue-6)] p-4 bg-[var(--arona-blue-1)]">
      <e-h2>数字输入框 / InputNumber</e-h2>
      <e-text no-select>v-model：{{ valueNumber }}</e-text>
      <e-input-number width="100" v-model="valueNumber" :min="1" :max="100" :step="1" />
      <e-h3 no-select>禁用状态</e-h3>
      <e-input-number disabled width="100" v-model="valueNumber" :min="1" :max="100" :step="1" />
    </e-space>
  </e-space>
</template>

<style scoped lang="scss"></style>