<script setup lang="ts">
const src = "https://blue-archive.io/favicon/apple-touch-icon.png";
const fallbackSrc = "https://blue-archive.io/assets/arona_icon-FqVudqPo.webp";
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">头像 / Avatar</e-h1>
  <div class="flex flex-col gap-4 pl-4 pr-4 items-start">
    <div
      class="flex flex-col justify-between p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
    >
      <div flex gap-4>
        <e-avatar size="mini" background="plana-pink-6" :src="src" />
        <e-avatar size="small" background="plana-pink-6" :src="src" />
        <e-avatar size="medium" background="plana-pink-6" :src="src" />
        <e-avatar size="large" background="plana-pink-6" :src="src" />
        <e-avatar size="xlarge" background="plana-pink-6" :src="src" />
        <e-avatar
          :src="src"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
        >
          <e-text color="#000" type="body" level="2">A</e-text>
        </e-avatar>
      </div>
      <div flex gap-4>
        <e-avatar size="mini" bordered :src="src" />
        <e-avatar size="small" bordered :src="src" />
        <e-avatar size="medium" bordered :src="src" />
        <e-avatar size="large" bordered :src="src" />
        <e-avatar size="xlarge" bordered :src="src" />
        <e-avatar
          bordered
          :src="src"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
        />
      </div>
      <div flex gap-4>
        <e-avatar size="mini" background="plana-pink-6" squared :src="src" />
        <e-avatar size="small" background="plana-pink-6" squared :src="src" />
        <e-avatar size="medium" background="plana-pink-6" squared :src="src" />
        <e-avatar size="large" background="plana-pink-6" squared :src="src" />
        <e-avatar size="xlarge" background="plana-pink-6" squared :src="src" />
        <e-avatar
          squared
          :src="src"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
        />
      </div>
      <e-h3>自定义border</e-h3>
      <div flex gap-4>
        <e-avatar size="mini" bordered border-width="2px" squared :src="src" />
        <e-avatar
          size="small"
          bordered
          border-width="2"
          border-color="plana-pink-6"
          squared
          :src="src"
        />
        <e-avatar
          size="medium"
          bordered
          :border-width="2"
          border-color="success-6"
          squared
          :src="src"
        />
        <e-avatar
          size="large"
          bordered
          border-width="2px"
          border-color="warning-6"
          squared
          :src="src"
        />
        <e-avatar
          size="xlarge"
          bordered
          border-width="2px"
          border-color="danger-6"
          squared
          :src="src"
        />
        <e-avatar
          squared
          :src="src"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
        />
      </div>
      <e-h3>Fallback</e-h3>
      <e-avatar
        size="medium"
        src="undefined"
        background="arona-blue-6"
        :fallback-src="fallbackSrc"
      />
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
