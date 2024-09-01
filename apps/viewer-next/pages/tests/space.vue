<script lang="ts" setup>
const text = "The quick red fox jumps over the lazy brown dog";
const textList = text.split(" ");
</script>
<template>
  <e-h1 align="center" class="self-center mt-4">间距 / Space</e-h1>
  <e-h2>基础用法</e-h2>
  <e-space margin="10px">
    <template #divider>
      <e-divider vertical/>
    </template>
    <e-space direction="vertical" size="mini">
      <e-tag brand fill v-for="item in textList" :key="item">{{ item }}</e-tag>
    </e-space>
    <e-space vertical size="small">
      <template #divider>
        <e-divider solid/>
      </template>
      <e-space size="mini">
        <e-tag brand fill v-for="item in textList" :key="item">{{ item }}</e-tag>
      </e-space>
      <e-space size="small">
        <e-tag brand fill v-for="item in textList" :key="item">{{ item }}</e-tag>
      </e-space>
      <e-space size="medium">
        <e-tag brand fill v-for="item in textList" :key="item">{{ item }}</e-tag>
      </e-space>
      <e-space size="large" divider="|" align="baseline">
        <e-tag brand fill v-for="item in textList" :key="item">{{ item }}</e-tag>
      </e-space>
    </e-space>
  </e-space>
</template>
