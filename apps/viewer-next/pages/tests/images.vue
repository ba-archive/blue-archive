<script lang="ts" setup>
const src = "https://s2.loli.net/2024/09/07/gvVuD6aqFNroPLe.jpg";
const width = ref(100);
const height = ref(100);
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">图片 / Image</e-h1>
  <e-space vertical size="large" margin="16">
    <e-space vertical>
      <e-h2>基本用法</e-h2>
      <e-space>
        <e-space size="small" align="baseline">
          宽度 <e-input-number v-model="width" :min="16" :max="1024" /> px
        </e-space>
        <e-space size="small" align="baseline">
          高度 <e-input-number v-model="height" :min="16" :max="1024" /> px
        </e-space>
      </e-space>
      <e-space>
        <e-image :src="src" :width="width" :height="height" />
        <e-image
          :src="src"
          :width="width"
          :height="height"
          border-radius="1rem"
          caption="自定义圆角"
        />
        <e-image
          src="https://example.com/image.jpg"
          :width="width"
          :height="height"
          caption="错误状态"
        />
        <e-image :src="src" :width="width" :height="height">
          <template #caption>
            <e-text
              :color="{
                from: 'var(--arona-blue-6)',
                to: 'var(--arona-blue-2)',
                deg: '45deg',
              }"
              >自定义描述</e-text
            >
          </template>
        </e-image>
      </e-space>
    </e-space>
    <e-space vertical>
      <e-h2>点击预览</e-h2>
      <e-image
        enable-preview
        :src="src"
        :width="width"
        :height="height"
        caption="点击预览"
      />
    </e-space>
    <e-space vertical>
      <e-h2>Object Fit</e-h2>
      <e-space>
        <div
          class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
        >
          <e-image
            :src="src"
            width="128"
            :height="height"
            fit="contain"
            caption="contain"
          />
        </div>
        <div
          class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
        >
          <e-image
            :src="src"
            width="128"
            :height="height"
            fit="cover"
            caption="cover"
          />
        </div>
        <div
          class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
        >
          <e-image
            :src="src"
            width="128"
            :height="height"
            fit="fill"
            caption="fill"
          />
        </div>
        <div
          class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
        >
          <e-image
            :src="src"
            width="128"
            :height="height"
            fit="none"
            caption="none"
          />
        </div>
        <div
          class="flex flex-col rounded border border-1 border-solid border-[var(--arona-blue-6)]"
        >
          <e-image
            :src="src"
            width="128"
            :height="height"
            fit="scale-down"
            caption="scale-down"
          />
        </div>
      </e-space>
    </e-space>
  </e-space>
</template>
