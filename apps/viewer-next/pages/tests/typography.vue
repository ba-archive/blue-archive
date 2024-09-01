<script lang="ts" setup>
const placeholderText = `我真的想 Mika 想得要发疯了🤤我躺在床上会想下江小春🤤，我洗澡会想砂狼白子🤤，我出门会想空崎日奈🤤，我走路会想静山真白🤤，我坐车会想Saya🤤，我上学会想伊织🤤，我玩手机会想睦月🤤，我盯着视频里的星野看🤤，我盯着圣三一茶会里的百合園圣娅看🤤，看我真的觉得自己像中邪了一样，我对千世的念想似乎都是千世的了🤤，我好孤独啊！真的好孤独啊！你知道吗？每到深夜，我浑身滚烫滚烫，我发病了我要疯狂。美游🤤我的桃井🤤🤤我的白洲梓🤤天童爱丽丝🤤我的伊吕波🤤​`;
const placeholderEn = `I really went mad about Mika🤤I lie in bed and think of Shimoe Koharu🤤, I take a bath and think of Sunaookami Shiroko🤤, I go out and think of Sorasaki Hina🤤, I walk and think of Shizuyama Mashiro🤤, I take a car and think of Saya🤤, I go to school and think of Iori🤤, I play with my phone and think of Mutsuki🤤, I stare at Hoshino in the video🤤, I stare at Yurizono Seia in the Trinity Tea Party🤤, I feel like I'm possessed, I seem to be all about Chise🤤, I'm so lonely! Really lonely! Do you know? Every late night, I'm burning all over, I'm sick, I'm going crazy. Miyu🤤My Momoi🤤🤤My Shirasu Azusa🤤Tendo Arisu🤤My Iroha🤤`;
</script>

<template>
  <e-h1 align="center" class="self-center mt-4">排版 / Typography</e-h1>
  <e-space vertical :padding="[0, 16, 0, 16]" >
    <e-h1>一级标题 / Heading Level 1</e-h1>
    <e-h2>二级标题 / Heading Level 2</e-h2>
    <e-h3>三级标题 / Heading Level 3</e-h3>
    <e-text
      bold
      :color="{
        from: 'var(--plana-pink-6)',
        to: 'var(--arona-blue-6)',
        deg: 'to right',
      }"
    >
      <template #prefix> Prefix </template>
      {{ placeholderText }}
      <template #suffix> Suffix </template>
    </e-text>
    <span>
      行内文本 + 禁用
      <EText inline disabled underline italic>
        {{ placeholderText }}
      </EText>
    </span>
    <EText brand sub> 自定义颜色 {{ placeholderEn }} </EText>
    <EBlockquote delete color="success-6"> blockquote {{ placeholderText }} </EBlockquote>
    <n-ol>
      <n-li brand>Ordered List 1</n-li>
      <n-li tertiary>Ordered List 2</n-li>
    </n-ol>
    <n-ol>
      <n-li secondary>Ordered List 1</n-li>
      <n-li bold success>Ordered List 2</n-li>
    </n-ol>
    <n-ul>
      <n-li danger bold>无序列表 1</n-li>
      <n-li warning>无序列表 2</n-li>
      <n-li :color="{
        from: 'var(--plana-pink-6)',
        to: 'var(--arona-blue-6)',
        deg: 'to right',
      }">{{ placeholderText }}</n-li>
    </n-ul>
    <e-link to="/tests/typography">链接 / Link</e-link>
    <e-link to="/tests/tags" nav>导航链接 / Navigation Link </e-link>
    <e-link to="/tests/typography" nav bold>活跃导航链接 / Navigation Link Active</e-link>
  </e-space>
</template>

<style lang="scss" scoped></style>
