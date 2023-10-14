<template>
  <div class="flex-vertical">
    <article class="flex-vertical">
      <h2 class="color-transition">关于本站 / About this site</h2>
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
          <strong>ONLY PUBLICLY AVAILABLE</strong> story content.
        </p>
        <p>
          如您有任何疑问、意见或建议，或对本站收录的内容存在疑义，欢迎随时通过邮件向我们
          <a href="mailto:mail@blue-archive.io">询问或提出</a
          >。<strong>我们不是官方，无法也不能对游戏内容进行解释和解答。</strong>若您有条件体验游戏内容，我们强烈建议您
          <a href="https://bluearchive-cn.com/" rel="noreferrer" target="_blank"
            >下载游戏并体验</a
          >。
        </p>
        <p>
          If you have any questions, suggestions, or concerns, or if you have
          doubts about the content we have collected, please feel free to
          <a href="mailto:mail@blue-archive.io">send us an email.</a>
          <strong>
            We are not affiliated with Blue Archive in any form, so please be
            aware that we cannot and will not answer questions regarding any
            in-game contents.
          </strong>
          If you have interest in further exploring the in-game contents, we do
          strongly recommend you
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
      <section class="contributor flex-vertical">
        <h2 class="contributor">贡献者 / Contributors</h2>
        <contributor-list />
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import { h } from "vue";
import { Contributor } from "@/types/UpdateNews";

const contributors: Contributor[] = [
  {
    name: "黑猫汐",
    role: "校对",
    avatar: "/image/contributor/amahashio.webp",
    link: "https://github.com/AmahaShio",
  },
  {
    name: "小陈菌",
    role: "CI/CD",
    avatar: "/image/contributor/ciisaichan.webp",
    link: "https://github.com/ciisaichan",
  },
  {
    name: "Coya",
    role: "UI",
    avatar: "/image/contributor/coya.webp",
  },
  {
    name: "第一个mt",
    role: "前端",
    avatar: "/image/contributor/diyigemt.webp",
    link: "https://github.com/diyigemt",
  },
  {
    name: "发椿",
    role: "翻译",
    avatar: "/image/contributor/fachun.webp",
  },
  {
    name: "飞龙project",
    role: "CI/CD",
    avatar: "/image/contributor/feilongproject.webp",
    link: "https://github.com/feilongproject",
  },
  {
    name: "Icarus",
    role: "运维",
    avatar: "/image/contributor/icarus.webp",
  },
  {
    name: "海星xd",
    role: "前端",
    avatar: "/image/contributor/kaiseixd.webp",
    link: "https://github.com/kaiseixd",
  },
  {
    name: "吉光",
    role: "前端",
    avatar: "/image/contributor/luckyray-fan.webp",
    link: "https://github.com/luckyray-fan",
  },
  {
    name: "Mark Chen",
    role: "前端/美术/CI/CD",
    avatar: "/image/contributor/mark9804.webp",
    link: "https://github.com/Mark9804",
  },
  {
    name: "茗门",
    role: "后端",
    avatar: "/image/contributor/mingmen.webp",
  },
  {
    name: "Misaka18655",
    role: "翻译",
    avatar: "/image/contributor/misaka18655.webp",
  },
  {
    name: "Z_DK",
    role: "前端",
    avatar: "/image/contributor/nencao.webp",
    link: "https://github.com/NENCAO",
  },
  {
    name: "Notype",
    role: "前端/CI/CD",
    avatar: "/image/contributor/notnotype.webp",
    link: "https://github.com/notnotype",
  },
  {
    name: "偶然幻想",
    role: "前端",
    avatar: "/image/contributor/ourandream.webp",
    link: "https://github.com/ourandream",
  },
  {
    name: "HeartUnderBlade",
    role: "CI/CD",
    avatar: "/image/contributor/pfjhyyj.webp",
    link: "https://github.com/pfjhyyj",
  },
  {
    name: "scn",
    role: "翻译",
    avatar: "/image/contributor/scn.webp",
  },
  {
    name: "Setsuna",
    role: "前端",
    avatar: "/image/contributor/shinonomesetsuna.webp",
    link: "https://github.com/ShinonomeSetsuna",
  },
  {
    name: "星空若曦",
    role: "校对",
    avatar: "/image/contributor/xingkongruoxi.webp",
  },
  {
    name: "Tiramisu",
    role: "翻译（繁中）",
    avatar: "/image/contributor/tiramisu.webp",
    link: "https://github.com/noddy55168",
  },
  {
    name: "_Aisle",
    role: "前端",
    avatar: "/image/contributor/mizukiaaaaaisle.webp",
    link: "https://github.com/MizukiAAAAAisle",
  },
  {
    name: "たかなしち",
    role: "翻译",
    avatar: "/image/contributor/takanasichi.webp",
  },
  {
    name: "flamingo",
    role: "翻译",
    avatar: "/image/contributor/flamingo.webp",
  },
  {
    name: "碧蓝档案资讯站",
    role: "制作协力",
    avatar: "/image/contributor/zixunzhan.webp",
    link: "https://space.bilibili.com/37507923",
  },
  {
    name: "飞小RAN",
    role: "制作协力",
    avatar: "/image/contributor/xiaofeitm233.webp",
    link: "https://github.com/xiaofeiTM233",
  },
  {
    name: "J.K.伯爵",
    role: "文案",
    avatar: "/image/contributor/jkbojue.webp",
  },
  {
    name: "mekliy",
    role: "文案",
    avatar: "/image/contributor/mekliy.webp",
  },
  {
    name: "矮人",
    role: "策划",
    avatar: "/image/contributor/airen.webp",
  },
  {
    name: "雷电",
    role: "PM",
    avatar: "/image/contributor/leidian.webp",
  },
  {
    name: "Unique、",
    role: "美术",
    avatar: "/image/contributor/unique.webp",
  },
  {
    name: "米袋",
    role: "Unity",
    avatar: "/image/contributor/giantricebag.webp",
    link: "https://github.com/GiantRiceBag",
  },
  {
    name: "Violenza",
    role: "Unity",
    avatar: "/image/contributor/violenza.webp",
  },
  {
    name: "莫末陌寞",
    role: "Unity",
    avatar: "/image/contributor/momomomo.webp",
  },
  {
    name: "香蕉",
    role: "Unity",
    avatar: "/image/contributor/banana.webp",
  },
  {
    name: "PAoc",
    role: "3D建模",
    avatar: "/image/contributor/paoc.webp",
  },
  {
    name: "电獭",
    role: "后端、架构",
    avatar: "/image/contributor/dianta.webp",
  },
  {
    name: "星之韻律",
    role: "后端",
    avatar: "/image/contributor/xingzhiyunlv.webp",
  },
  {
    name: "花奈",
    role: "前端",
    avatar: "/image/contributor/huanai.webp",
  },
  {
    name: "奶油英雄",
    role: "AI算法-NLP",
    avatar: "/image/contributor/naiyouyingxiong.webp",
  },
  {
    name: "Dyin",
    role: "PV",
    avatar: "/image/contributor/dyin.webp",
  },
  {
    name: "阿彬",
    role: "PV",
    avatar: "/image/contributor/abin.webp",
  },
  {
    name: "水哥不sd",
    role: "PV",
    avatar: "/image/contributor/shuigebusd.webp",
  },
  {
    name: "En_Sound",
    role: "音乐",
    avatar: "/image/contributor/ensound.webp",
  },
  {
    name: "小白",
    role: "音乐",
    avatar: "/image/contributor/xiaobai.webp",
  },
  {
    name: "释逸",
    role: "原画",
    avatar: "/image/contributor/shiyi.webp",
  },
];

// make vue-tsc happy
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const contributorList: any = h(
  "div",
  {
    id: "update-log-contributor-wall",
  },
  contributors
    .sort((a, b) =>
      a.name.localeCompare(b.name, "zh-Hans-CN", { sensitivity: "accent" })
    )
    .map(contributor => {
      return h(
        contributor.link ? "a" : "div",
        {
          href: contributor?.link,
          class: "contributor__avatar",
          target: "_blank",
          rel: "noopener noreferrer",
        },
        [
          h("img", {
            src: contributor.avatar,
            alt: contributor.name,
            title: `${contributor.name} - ${contributor.role}`,
          }),
        ]
      );
    })
);
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

    &.contributor {
      margin-bottom: 2rem;
    }
  }
}

p {
  text-align: justify;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;

  &.contributor {
    margin-bottom: 0;
  }
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

<style lang="scss">
#update-log-contributor-wall {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;

  .contributor__avatar {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      border-radius: 50%;
      width: 4rem;
      height: 4rem;
    }
  }
}
</style>
