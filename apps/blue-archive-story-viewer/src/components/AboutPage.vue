<template>
  <div class="flex-vertical">
    <article class="flex-vertical">
      <h2>关于本站 / About this site</h2>
      <section class="flex-vertical">
        <p>
          本站为
          <strong>无任何盈利意图、形式和行为</strong>
          的同人站点，旨在为《蔚蓝档案（又译：碧蓝档案）》的玩家提供
          <strong>已公开</strong> 剧情的查找和重温方式。
        </p>
        <p>
          We are a <strong>non-profit, non-commercial</strong> fan site for the
          game "Blue Archive (ブルーアーカイブ)". We aim to provide a way for
          players to search and revisit
          <strong>ONLY PUBLICLY AVAILABLE</strong> story contents.
        </p>
        <p>
          如您有任何疑问、意见或建议，或对本站收录的内容存在疑义，欢迎随时通过邮件向我们
          <a href="mailto:mail@blue-archive.io">询问或提出</a
          >。<strong>我们不是官方，无法也不能对游戏内容进行解释和解答。</strong>若您有条件体验游戏内容，我们强烈建议您
          <a href="https://bluearchive.jp/" rel="noreferrer" target="_blank"
            >下载游戏并体验</a
          >。
        </p>
        <p>
          If you have any questions, suggestions or concerns, or if you have
          doubts about the content we have collected, please feel free to
          <a href="mailto:mail@blue-archive.io">send us an email.</a>
          <strong>
            We are not affiliated with Blue Archive in any forms, so please be
            aware that we cannot and will not answer questions regarding any
            in-game contents.
          </strong>
          If you have interests in further exploring the in-game contents, we do
          strongly recommend you to
          <a
            href="https://bluearchive.nexon.com/"
            rel="noreferrer"
            target="_blank"
            >download the game and have a try.</a
          >
        </p>
      </section>
      <section class="copyright">
        <p>
          本站与ブルーアーカイブ、Yostar、Nexon 以及 Nexon Games
          没有任何形式关联。<br />
          本网站中使用的所有游戏作品、信息和素材均为各自作者的财产和版权。
        </p>
        <p>
          This site is not affiliated in any forms with Blue Archive, Yostar,
          Nexon and Nexon Games.<br />All game artwork, information and assets
          used in this site are the property and copyright of the respective
          authors.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
//
</script>

<style scoped lang="scss">
article {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: min(50rem, 90%);

  section {
    gap: 1rem;
    width: 100%;
  }
}

h2 {
  transition: color 0.375s ease-in-out;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.copyright {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 2rem;
  border-top: dashed 1px gray;
  padding-top: 0.25rem;
  color: gray;
  font-size: 0.8rem;

  a {
    color: gray;
  }
}
</style>
