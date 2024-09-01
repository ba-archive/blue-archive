<script setup lang="ts">
function handleClickReport($event: Event) {
  console.log("button clicked");
}
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">按钮 / Button</e-h1>
  <div class="grid grid-cols-2 gap-4 pl-4 pr-4 items-start mt-4">
    <div
      class="flex flex-col justify-between p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)] min-h-[325px]"
    >
      <e-h2>微型按钮 / Button Size: mini</e-h2>
      <e-h3>Primary</e-h3>
      <e-space>
        <e-button size="mini" primary>微型按钮</e-button>
        <e-button size="mini" primary danger>微型按钮</e-button>
        <e-button size="mini" primary success>微型按钮</e-button>
        <e-button size="mini" primary warning>微型按钮</e-button>
        <e-button
          size="mini"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>

      <e-space :size="14">
        <e-button size="mini" primary bordered>微型按钮</e-button>
        <e-button size="mini" primary danger bordered>微型按钮</e-button>
        <e-button size="mini" primary success bordered>微型按钮</e-button>
        <e-button size="mini" primary warning bordered>微型按钮</e-button>
        <e-button
          size="mini"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-h3>Secondary</e-h3>
      <e-space>
        <e-button size="mini" secondary>微型按钮</e-button>
        <e-button size="mini" secondary danger>微型按钮</e-button>
        <e-button size="mini" secondary success>微型按钮</e-button>
        <e-button size="mini" secondary warning>微型按钮</e-button>
        <e-button
          size="mini"
          id="mini-gradient"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="mini" secondary bordered>微型按钮</e-button>
        <e-button size="mini" secondary danger bordered>微型按钮</e-button>
        <e-button size="mini" secondary success bordered>微型按钮</e-button>
        <e-button size="mini" secondary warning bordered>微型按钮</e-button>
        <e-button
          size="mini"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-button size="mini" primary wide>很长的微型按钮</e-button>
    </div>
    <div
      class="flex flex-col p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)] min-h-[325px]"
    >
      <e-h2>小型按钮 / Button Size: small</e-h2>
      <e-h3>Primary</e-h3>
      <e-space>
        <e-button size="small" primary>小型按钮</e-button>
        <e-button size="small" primary danger>小型按钮</e-button>
        <e-button size="small" primary success>小型按钮</e-button>
        <e-button size="small" primary warning>小型按钮</e-button>
        <e-button
          size="small"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >小型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="small" primary bordered>小型按钮</e-button>
        <e-button size="small" primary danger bordered>小型按钮</e-button>
        <e-button size="small" primary success bordered>小型按钮</e-button>
        <e-button size="small" primary warning bordered>小型按钮</e-button>
        <e-button
          size="small"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >小型按钮
        </e-button>
      </e-space>
      <e-h3>Secondary</e-h3>
      <e-space>
        <e-button size="small" secondary>小型按钮</e-button>
        <e-button size="small" secondary danger>小型按钮</e-button>
        <e-button size="small" secondary success>小型按钮</e-button>
        <e-button size="small" secondary warning>小型按钮</e-button>
        <e-button
          size="small"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >小型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="small" secondary bordered>小型按钮</e-button>
        <e-button size="small" secondary danger bordered>小型按钮</e-button>
        <e-button size="small" secondary success bordered>小型按钮</e-button>
        <e-button size="small" secondary warning bordered>小型按钮</e-button>
        <e-button
          size="small"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >小型按钮
        </e-button>
      </e-space>
      <e-button size="small" primary wide>很长的小型按钮</e-button>
    </div>
    <div
      class="flex flex-col justify-between p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)] min-h-[344px]"
    >
      <e-h2>中型按钮 / Button Size: medium</e-h2>
      <e-h3>Primary</e-h3>
      <e-space>
        <e-button size="medium" primary>中型按钮</e-button>
        <e-button size="medium" primary danger>中型按钮</e-button>
        <e-button size="medium" primary success>中型按钮</e-button>
        <e-button size="medium" primary warning>中型按钮</e-button>
        <e-button
          size="medium"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >中型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="medium" primary bordered>中型按钮</e-button>
        <e-button size="medium" primary danger bordered>中型按钮</e-button>
        <e-button size="medium" primary success bordered>中型按钮</e-button>
        <e-button size="medium" primary warning bordered>中型按钮</e-button>
        <e-button
          size="medium"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >中型按钮
        </e-button>
      </e-space>
      <e-h3>Secondary</e-h3>
      <e-space>
        <e-button size="medium" secondary>中型按钮</e-button>
        <e-button size="medium" secondary danger>中型按钮</e-button>
        <e-button size="medium" secondary success>中型按钮</e-button>
        <e-button size="medium" secondary warning>中型按钮</e-button>
        <e-button
          size="medium"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >中型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="medium" secondary bordered>中型按钮</e-button>
        <e-button size="medium" secondary danger bordered>中型按钮</e-button>
        <e-button size="medium" secondary success bordered>中型按钮</e-button>
        <e-button size="medium" secondary warning bordered>中型按钮</e-button>
        <e-button
          size="medium"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >中型按钮
        </e-button>
      </e-space>
      <e-button size="medium" primary wide>很长的中型按钮</e-button>
    </div>
    <div
      class="flex flex-col p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)] min-h-[344px]"
    >
      <e-h2>大型按钮 / Button Size: large</e-h2>
      <e-h3>Primary</e-h3>
      <e-space>
        <e-button size="large" primary>大型按钮</e-button>
        <e-button size="large" primary danger>大型按钮</e-button>
        <e-button size="large" primary success>大型按钮</e-button>
        <e-button size="large" primary warning>大型按钮</e-button>
        <e-button
          size="large"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >大型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="large" primary bordered>大型按钮</e-button>
        <e-button size="large" primary danger bordered>大型按钮</e-button>
        <e-button size="large" primary success bordered>大型按钮</e-button>
        <e-button size="large" primary warning bordered>大型按钮</e-button>
        <e-button
          size="large"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >大型按钮
        </e-button>
      </e-space>
      <e-h3>Secondary</e-h3>
      <e-space>
        <e-button size="large" secondary>大型按钮</e-button>
        <e-button size="large" secondary danger>大型按钮</e-button>
        <e-button size="large" secondary success>大型按钮</e-button>
        <e-button size="large" secondary warning>大型按钮</e-button>
        <e-button
          size="large"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >大型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="large" secondary bordered>大型按钮</e-button>
        <e-button size="large" secondary danger bordered>大型按钮</e-button>
        <e-button size="large" secondary success bordered>大型按钮</e-button>
        <e-button size="large" secondary warning bordered>大型按钮</e-button>
        <e-button
          size="large"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >大型按钮
        </e-button>
      </e-space>
      <e-button size="large" primary wide>很长的大型按钮</e-button>
    </div>
    <div
      class="flex flex-col p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)] bg-[var(--arona-blue-2)]"
    >
      <e-h2>桃信 / Button: momotalk</e-h2>
      <e-space>
        <e-button momotalk>默认状态</e-button>
      </e-space>
      <e-space>
        <e-button momotalk active>选中状态</e-button>
      </e-space>
      <e-button momotalk wide>很长的 MomoTalk 按钮</e-button>
    </div>
    <div
      class="flex flex-col p-2 gap-4 rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
    >
      <e-h2>禁用按钮 / Button: disabled</e-h2>
      <e-h3>Primary</e-h3>
      <e-space>
        <e-button size="mini" primary disabled>微型按钮</e-button>
        <e-button size="mini" primary danger disabled>微型按钮</e-button>
        <e-button size="mini" primary success disabled>微型按钮</e-button>
        <e-button size="mini" primary warning disabled>微型按钮</e-button>
        <e-button
          size="mini"
          disabled
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="mini" primary bordered disabled>微型按钮</e-button>
        <e-button size="mini" primary danger bordered disabled
          >微型按钮
        </e-button>
        <e-button size="mini" primary success bordered disabled
          >微型按钮
        </e-button>
        <e-button size="mini" primary warning bordered disabled
          >微型按钮
        </e-button>
        <e-button
          disabled
          size="mini"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-h3>Secondary</e-h3>
      <e-space>
        <e-button size="mini" secondary disabled>微型按钮</e-button>
        <e-button size="mini" secondary danger disabled>微型按钮</e-button>
        <e-button size="mini" secondary success disabled>微型按钮</e-button>
        <e-button size="mini" secondary warning disabled>微型按钮</e-button>
        <e-button
          disabled
          size="mini"
          id="mini-gradient"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-space :size="14">
        <e-button size="mini" secondary bordered disabled>微型按钮</e-button>
        <e-button size="mini" secondary danger bordered disabled
          >微型按钮
        </e-button>
        <e-button size="mini" secondary success bordered disabled
          >微型按钮
        </e-button>
        <e-button size="mini" secondary warning bordered disabled
          >微型按钮
        </e-button>
        <e-button
          disabled
          size="mini"
          @click="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型按钮
        </e-button>
      </e-space>
      <e-button size="mini" primary wide disabled>很长的微型按钮</e-button>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
