<script lang="ts" setup>
const placeholderText = `我真的想 Mika 想得要发疯了🤤我躺在床上会想下江小春🤤，我洗澡会想砂狼白子🤤，我出门会想空崎日奈🤤，我走路会想静山真白🤤，我坐车会想Saya🤤，我上学会想伊织🤤，我玩手机会想睦月🤤，我盯着视频里的星野看🤤，我盯着圣三一茶会里的百合園圣娅看🤤，看我真的觉得自己像中邪了一样，我对千世的念想似乎都是千世的了🤤，我好孤独啊！真的好孤独啊！你知道吗？每到深夜，我浑身滚烫滚烫，我发病了我要疯狂。美游🤤我的桃井🤤🤤我的白洲梓🤤天童爱丽丝🤤我的伊吕波🤤​`;
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">排版 / Typography</e-h1>
  <div class="flex flex-col gap-4 pl-4 pr-4">
    <e-h1>一级标题 / H1</e-h1>
    <e-h2>二级标题 / H2</e-h2>
    <e-h3>三级标题 / H3</e-h3>
    <e-text
      bold
      :color="{
        from: 'pink',
        to: 'black',
        deg: 45,
      }"
    >
      <template #prefix> Prefix </template>
      {{ placeholderText }}
      <template #suffix> Suffix </template>
    </e-text>
    <span>
      Inline Text
      <EText inline disabled underline>
        {{ placeholderText }}
      </EText>
    </span>
    <EText delete italic color="success-6" sub>
      {{ placeholderText }}
    </EText>
    <EBlockquote>
      {{ placeholderText }}
    </EBlockquote>
  </div>
</template>

<style lang="scss" scoped></style>
