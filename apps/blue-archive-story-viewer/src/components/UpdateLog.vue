<script setup lang="ts">
import { h } from 'vue';
import { Contributor, UpdateLog } from '../types/UpdateNews';

const updateLogs: UpdateLog[] = [
  {
    date: '2023-06-04',
    contents: [
      {
        type: 'student',
        students: [
          { name: '瑠美', id: 10069 },
          { name: '弥奈', id: 10070 },
          { name: '白子', id: 10010 },
        ],
      },
    ],
  },
  {
    date: '2023-05-12',
    contents: [
      {
        type: 'student',
        students: [{ name: '玲纱', id: 10068 }],
      },
      {
        type: 'fix',
        content: '修复了伊甸条约目录中错误的链接',
      },
      {
        type: 'fix',
        content: '修复了选项按钮缺失点击音效的问题',
      },
    ],
  },
  {
    date: '2023-05-07',
    contents: [
      {
        type: 'student',
        students: [
          { name: '爱丽丝（女仆装）', id: 10066 },
          { name: '时（兔女郎）', id: 10067 },
          { name: '柚子（女仆装）', id: 26009 },
          { name: '野宫', id: 13004 },
          { name: '野宫（泳装）', id: 10044 },
        ],
      },
      {
        type: 'main',
        content: 'Vol.3 伊甸条约 第一章',
      },
      {
        type: 'fix',
        content: '修复特定分辨率移动设备上播放器宽度异常的问题',
      },
      {
        type: 'feat',
        content: '主线播放页面在播放完成后会显示导航按钮',
      },
    ],
  },
  {
    date: '2023-04-16',
    contents: [
      {
        type: 'student',
        students: [
          { name: '桑上 果穗', id: 10065 },
          { name: '下江 小春', id: 10020 },
          { name: '鬼方 佳代子（正月）', id: 10064 },
        ],
      },
      {
        type: 'fix',
        content: '修复剧情黑屏问题',
      },
      {
        type: 'feat',
        content: '剧情支持2倍超分辨率',
      },
      {
        type: 'feat',
        content: '设置面板中支持重置整个应用',
      },
    ],
  },
  {
    date: '2023-03-24',
    contents: [
      {
        type: 'student',
        students: [{ name: '伊草 遥香（正月）', id: 20025 }],
      },
    ],
  },
  {
    date: '2023-03-22',
    contents: [
      {
        type: 'student',
        students: [{ name: '浅黄 睦月（正月）', id: 10032 }],
      },
      {
        type: 'feat',
        content: '提供设置面板，在遇到显示错误的时候可以清空缓存了',
      },
      {
        type: 'feat',
        content: '增加小雪剧情的繁体中文翻译',
      },
      {
        type: 'feat',
        content: 'momotalk 的阅读状态可以保持',
      },
      {
        type: 'feat',
        content: 'momotalk 的好感剧情入口不会在作出回答前出现',
      },
      {
        type: 'feat',
        content: 'momotalk 对话内容完全支持日、英、中文',
      },
      {
        type: 'fix',
        content: '优化手机端 Safari 体验',
      },
      {
        type: 'fix',
        content: '一些显示 bug 修复',
      },
    ],
  },
  {
    date: '2023-03-09',
    contents: [
      {
        type: 'student',
        students: [{ name: '黑崎 小雪', id: 10063 }],
      },
    ],
  },
  {
    date: '2023-03-06',
    contents: [
      {
        type: 'test',
        content: '序章和体香好感剧情 1 播放',
      },
    ],
  },
  {
    date: '2023-02-22',
    contents: [
      {
        type: 'feat',
        content: '完善时的弹性装甲过滤逻辑',
      },
      {
        type: 'student',
        students: [
          { name: '飞鸟马 时', id: 10062 },
          { name: '桐藤 渚', id: 20024 },
        ],
      },
    ],
  },
];

const contributors: Contributor[] = [
  {
    name: '黑猫汐',
    role: '校对',
    avatar: '/image/contributor/amahashio.webp',
    link: 'https://github.com/AmahaShio',
  },
  {
    name: '小陈菌',
    role: 'CI/CD',
    avatar: '/image/contributor/ciisaichan.webp',
    link: 'https://github.com/ciisaichan',
  },
  {
    name: 'Coya',
    role: 'UI',
    avatar: '/image/contributor/coya.webp',
  },
  {
    name: '第一个mt',
    role: '前端',
    avatar: '/image/contributor/diyigemt.webp',
    link: 'https://github.com/diyigemt',
  },
  {
    name: '发椿',
    role: '翻译',
    avatar: '/image/contributor/fachun.webp',
  },
  {
    name: '飞龙project',
    role: 'CI/CD',
    avatar: '/image/contributor/feilongproject.webp',
    link: 'https://github.com/feilongproject',
  },
  {
    name: 'Icarus',
    role: '运维',
    avatar: '/image/contributor/icarus.webp',
  },
  {
    name: '海星xd',
    role: '前端',
    avatar: '/image/contributor/kaiseixd.webp',
    link: 'https://github.com/kaiseixd',
  },
  {
    name: '吉光',
    role: '前端',
    avatar: '/image/contributor/luckyray-fan.webp',
    link: 'https://github.com/luckyray-fan',
  },
  {
    name: 'Mark Chen',
    role: '前端/美术/CI/CD',
    avatar: '/image/contributor/mark9804.webp',
    link: 'https://github.com/Mark9804',
  },
  {
    name: '茗门',
    role: '后端',
    avatar: '/image/contributor/mingmen.webp',
  },
  {
    name: 'Misaka18655',
    role: '翻译',
    avatar: '/image/contributor/misaka18655.webp',
  },
  {
    name: 'Z_DK',
    role: '前端',
    avatar: '/image/contributor/nencao.webp',
    link: 'https://github.com/NENCAO',
  },
  {
    name: 'Notype',
    role: '前端/CI/CD',
    avatar: '/image/contributor/notnotype.webp',
    link: 'https://github.com/notnotype',
  },
  {
    name: '偶然幻想',
    role: '前端',
    avatar: '/image/contributor/ourandream.webp',
    link: 'https://github.com/ourandream',
  },
  {
    name: 'HeartUnderBlade',
    role: 'CI/CD',
    avatar: '/image/contributor/pfjhyyj.webp',
    link: 'https://github.com/pfjhyyj',
  },
  {
    name: 'scn',
    role: '翻译',
    avatar: '/image/contributor/scn.webp',
  },
  {
    name: 'Setsuna',
    role: '前端',
    avatar: '/image/contributor/shinonomesetsuna.webp',
    link: 'https://github.com/ShinonomeSetsuna',
  },
  {
    name: '星空若曦',
    role: '校对',
    avatar: '/image/contributor/xingkongruoxi.webp',
  },
  {
    name: 'Tiramisu',
    role: '翻译（繁中）',
    avatar: '/image/contributor/tiramisu.webp',
    link: 'https://github.com/noddy55168',
  },
  {
    name: '_Aisle',
    role: '前端',
    avatar: '/image/contributor/mizukiaaaaaisle.webp',
    link: 'https://github.com/MizukiAAAAAisle',
  },
  {
    name: 'たかなしち',
    role: '翻译',
    avatar: '/image/contributor/takanasichi.webp',
  },
  {
    name: 'flamingo',
    role: '翻译',
    avatar: '/image/contributor/flamingo.webp',
  },
  {
    name: '碧蓝档案资讯站',
    role: '制作协力',
    avatar: '/image/contributor/zixunzhan.webp',
    link: 'https://space.bilibili.com/37507923',
  },
  {
    name: '飞小RAN',
    role: '制作协力',
    avatar: '/image/contributor/xiaofeitm233.webp',
    link: 'https://github.com/xiaofeiTM233',
  },
  {
    name: 'JK伯爵',
    role: '文案',
    avatar: '/image/contributor/jkbojue.webp',
  },
  {
    name: 'mekliy',
    role: '文案',
    avatar: '/image/contributor/mekliy.webp',
  },
  {
    name: '矮人',
    role: '策划',
    avatar: '/image/contributor/airen.webp',
  },
  {
    name: '雷电',
    role: 'PM',
    avatar: '/image/contributor/leidian.webp',
  },
  {
    name: 'Unique、',
    role: '美术',
    avatar: '/image/contributor/unique.webp',
  },
  {
    name: '米袋',
    role: 'Unity',
    avatar: '/image/contributor/giantricebag.webp',
    link: 'https://github.com/GiantRiceBag',
  },
  {
    name: 'Violenza',
    role: 'Unity',
    avatar: '/image/contributor/violenza.webp',
  },
  {
    name: '莫末陌寞',
    role: 'Unity',
    avatar: '/image/contributor/momomomo.webp',
  },
  {
    name: '香蕉',
    role: 'Unity',
    avatar: '/image/contributor/banana.webp',
  },
  {
    name: 'PAoc',
    role: '3D建模',
    avatar: '/image/contributor/paoc.webp',
  },
  {
    name: '电獭',
    role: '后端、架构',
    avatar: '/image/contributor/dianta.webp',
  },
  {
    name: '星之韻律',
    role: '后端',
    avatar: '/image/contributor/xingzhiyunlv.webp',
  },
];

// make vue-tsc happy
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const contributorList: any = h(
  'div',
  {
    id: 'update-log-contributor-wall',
  },
  contributors
    .sort((a, b) =>
      a.name.localeCompare(b.name, 'zh-Hans-CN', { sensitivity: 'accent' })
    )
    .map(contributor => {
      return h(
        contributor.link ? 'a' : 'div',
        {
          href: contributor?.link,
          class: 'contributor__avatar',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        [
          h('img', {
            src: contributor.avatar,
            alt: contributor.name,
            title: `${contributor.name} - ${contributor.role}`,
          }),
        ]
      );
    })
);
</script>

<template>
  <div id="contributor-container" class="flex-vertical" v-once>
    <h2 class="update-log__title">更新日志</h2>
    <!-- eslint-disable vue/require-v-for-key -->
    <div class="update-log__block" v-for="log in updateLogs">
      <h3>{{ log.date }}</h3>
      <ul>
        <li v-for="content in log.contents">
          <span v-if="!['student', 'main'].includes(content.type)">
            <span class="update-type">{{ content.type }}: </span>
            <span class="update-content">{{ content.content }}</span>
          </span>
          <span v-else>
            <span class="update-type">{{ content.type }}: </span>
            <span class="update-content" v-if="'student' === content.type">
              添加
              <span class="router-link" v-for="student in content.students">
                <router-link :to="`/archive/${student.id}/momotalk`">{{
                  student.name
                }}</router-link>
              </span>
              的个人剧情
            </span>
            <span class="update-content" v-else>
              主线新增
              <router-link to="/mainStory">{{ content.content }}</router-link>
            </span>
          </span>
        </li>
      </ul>
    </div>
    <!--eslint-enable vue/require-v-for-key-->

    <h3>贡献者：（以名称排序）</h3>
    <contributor-list />
  </div>
</template>

<style scoped lang="scss">
#contributor-container {
  align-items: flex-start;
  align-self: center;
  transition: color 0.375s ease-in-out;
  padding-bottom: 2rem;
  width: min(50rem, 90%);
  color: var(--color-text-main);

  h2 {
    align-self: center;
    margin-top: 2rem;
    margin-bottom: 0.5rem;
  }
}

.update-log__title {
  margin-bottom: 2rem;
}

.update-log__block {
  ul {
    margin-bottom: 1rem;
    padding-left: 1rem;
  }

  .update-content {
    a {
      transition: color 0.375s ease-in-out;
      color: var(--color-pallete-arona-blue);
      text-decoration: underline;
    }
    .router-link:not(:last-child)::after {
      content: '、';
    }
  }
}

@media screen and (max-width: 768px) {
  #contributor-container {
    justify-content: flex-start;
  }

  .roadmap {
    max-width: 90%;
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
