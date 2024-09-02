<script lang="ts" setup>
function handleClickReport($event: Event) {
  console.log($event);
}
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">标签 / Tag</e-h1>
  <div class="flex flex-col gap-4 pl-4 pr-4 items-start">
    <e-h2>普通标签</e-h2>
    <div
      class="flex flex-col p-2 gap-4 bg-[var(--arona-blue-2)] rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
    >
      <e-space>
        <e-tag size="mini" clickable fill bordered>微型标签</e-tag>
        <e-tag size="mini" clickable gray fill bordered>微型标签</e-tag>
        <e-tag size="mini" clickable brand fill bordered>微型标签</e-tag>
        <e-tag size="mini" clickable brand fill bordered disabled
          >微型标签
        </e-tag>
        <e-tag
          size="mini"
          id="mini-gradient"
          clickable
          @update:active="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >微型标签
        </e-tag>
      </e-space>
      <e-space>
        <e-tag size="small" clickable fill bordered>小号标签</e-tag>
        <e-tag size="small" clickable gray fill bordered>小号标签</e-tag>
        <e-tag size="small" clickable brand fill bordered>小号标签</e-tag>
        <e-tag size="small" clickable brand fill bordered disabled
          >小号标签
        </e-tag>
        <e-tag
          size="small"
          id="small-gradient"
          clickable
          @update:active="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >小号标签
        </e-tag>
      </e-space>
      <e-space>
        <e-tag size="medium" clickable fill bordered>中号标签</e-tag>
        <e-tag size="medium" clickable gray fill bordered>中号标签</e-tag>
        <e-tag size="medium" clickable brand fill bordered>中号标签</e-tag>
        <e-tag size="medium" clickable brand fill bordered disabled
          >中号标签
        </e-tag>
        <e-tag
          size="medium"
          id="medium-gradient"
          clickable
          @update:active="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >中号标签
        </e-tag>
      </e-space>
      <e-space>
        <e-tag size="large" clickable fill bordered>大号标签</e-tag>
        <e-tag size="large" clickable gray fill bordered>大号标签</e-tag>
        <e-tag size="large" clickable brand fill bordered>大号标签</e-tag>
        <e-tag size="large" clickable brand fill bordered disabled
          >大号标签
        </e-tag>
        <e-tag
          size="large"
          id="large-gradient"
          clickable
          @update:active="handleClickReport"
          :background="{
            from: 'var(--plana-pink-6)',
            to: 'var(--arona-blue-6)',
            deg: 45,
          }"
          :text-props="{
            color: '#fff',
          }"
          >大号标签
        </e-tag>
      </e-space>
    </div>
    <e-h2>特殊标签</e-h2>
    <div
      class="flex flex-col p-2 gap-4 bg-[var(--arona-blue-2)] rounded-md border-1 border-solid border-[var(--arona-blue-6)]"
    >
      <e-space>
        <e-tag size="mini" clickable selector disabled>学院选择</e-tag>
        <e-tag size="mini" clickable selector>学院选择</e-tag>
        <e-tag size="mini" clickable striker :text-props="{ bold: true }">STRIKER</e-tag>
        <e-tag size="mini" clickable special :text-props="{ bold: true }">SPECIAL</e-tag>
        <e-tag size="mini" clickable explosion :text-props="{ bold: true }">爆发</e-tag>
        <e-tag size="mini" clickable pierce :text-props="{ bold: true }">贯通</e-tag>
        <e-tag size="mini" clickable unarmed :text-props="{ bold: true }">神秘</e-tag>
        <e-tag size="mini" clickable vibrate :text-props="{ bold: true }">振动</e-tag>
      </e-space>
      <e-space>
        <e-tag size="small" clickable selector disabled>学院选择</e-tag>
        <e-tag size="small" clickable selector>学院选择</e-tag>
        <e-tag size="small" clickable striker :text-props="{ bold: true }"
          >STRIKER
        </e-tag>
        <e-tag size="small" clickable special :text-props="{ bold: true }">SPECIAL</e-tag>
        <e-tag size="small" clickable explosion :text-props="{ bold: true }">爆发</e-tag>
        <e-tag size="small" clickable pierce :text-props="{ bold: true }">贯通</e-tag>
        <e-tag size="small" clickable unarmed :text-props="{ bold: true }">神秘</e-tag>
        <e-tag size="small" clickable vibrate :text-props="{ bold: true }">振动</e-tag>
      </e-space>
      <e-space>
        <e-tag size="medium" clickable selector disabled>学院选择</e-tag>
        <e-tag size="medium" clickable selector>学院选择</e-tag>
        <e-tag size="medium" clickable striker :text-props="{ bold: true }">STRIKER</e-tag>
        <e-tag size="medium" clickable special :text-props="{ bold: true }">SPECIAL</e-tag>
        <e-tag size="medium" clickable explosion :text-props="{ bold: true }">爆发</e-tag>
        <e-tag size="medium" clickable pierce :text-props="{ bold: true }">贯通</e-tag>
        <e-tag size="medium" clickable unarmed :text-props="{ bold: true }">神秘</e-tag>
        <e-tag size="medium" clickable vibrate :text-props="{ bold: true }">振动</e-tag>
      </e-space>
      <e-space>
        <e-tag size="large" clickable selector disabled>学院选择</e-tag>
        <e-tag size="large" clickable selector>学院选择</e-tag>
        <e-tag size="large" clickable striker :text-props="{ bold: true }">STRIKER</e-tag>
        <e-tag size="large" clickable special :text-props="{ bold: true }">SPECIAL</e-tag>
        <e-tag size="large" clickable explosion :text-props="{ bold: true }">爆发</e-tag>
        <e-tag size="large" clickable pierce :text-props="{ bold: true }">贯通</e-tag>
        <e-tag size="large" clickable unarmed :text-props="{ bold: true }">神秘</e-tag>
        <e-tag size="large" clickable vibrate :text-props="{ bold: true }">振动</e-tag>
      </e-space>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
