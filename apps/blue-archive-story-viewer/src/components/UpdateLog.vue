<script setup lang="ts">
import { UpdateLog } from "@/types/UpdateNews";

const updateLogs: UpdateLog[] = [
  {
    date: "2024-10-07",
    contents: [
      {
        type: "student",
        students: [
          { name: "鹿山 俪舒", id: 10104 },
        ],
      },
    ],
  },
  {
    date: "2024-10-03",
    contents: [
      {
        type: "student",
        students: [
          { name: "龙华 妃咲", id: 20039 },
        ],
      },
    ],
  },
  {
    date: "2024-09-21",
    contents: [
      {
        type: "student",
        students: [
          { name: "和乐 千世（泳装）", id: 10047 },
        ],
      },
    ],
  },
  {
    date: "2024-09-03",
    contents: [
      {
        type: "student",
        students: [
          { name: "池仓 玛利娜(旗袍)", id: 10103 },
          { name: "佐城 巴(旗袍)", id: 20038 },
        ],
      },
    ],
  },
  {
    date: "2024-08-07",
    contents: [
      {
        type: "student",
        students: [
          { name: "空崎 日奈（爱用品）", id: 10004 },
          { name: "尾刃 康娜（泳装）", id: 10096 },
          { name: "风仓 萌绘（泳装）", id: 10097 },
          { name: "小鸟游 星野（临战）", id: 10098 },
          { name: "白子＊恐怖", id: 10100 },
          { name: "锭前 纱织（泳装）", id: 10101 },
          { name: "槌永 日和（泳装）", id: 10102 },
          { name: "白洲 梓", id: 10019 },
          { name: "和乐 千世（爱用品）", id: 13001 },
          { name: "合欢垣 吹雪（泳装）", id: 20037 },
          { name: "中务 桐乃（泳装）", id: 26012 },
          { name: "秤 亚津子（泳装）", id: 26013 },
        ],
      },
    ],
  },
  {
  date: "2024-06-09",
    contents: [
      {
        type: "student",
        students: [
          { name: "黑见 芹香（泳装）", id: 20036 },
        ],
      },
    ],
  },
  {
    date: "2024-06-02",
    contents: [
      {
        type: "student",
        students: [
          { name: "才羽 桃井（女仆）", id: 10094 },
          { name: "才羽 绿（女仆）", id: 10095 },
        ],
      },
    ],
  },
  {
    date: "2024-05-26",
    contents: [
      {
        type: "student",
        students: [{ name: "天童 爱丽丝（女仆）", id: 10066 }],
      },
    ],
  },
  {
    date: "2024-05-12",
    contents: [
      {
        type: "student",
        students: [
          { name: "夜樱 绮罗罗", id: 10093 },
          { name: "和乐 千世", id: 13001 },
          { name: "生盐 诺亚", id: 10052 },
        ],
      },
    ],
  },
  {
    date: "2024-05-03",
    contents: [
      {
        type: "student",
        students: [
          { name: "杏山 和纱（乐队）", id: 10091 },
          { name: "栗村 爱莉（乐队）", id: 16015 },
          { name: "伊原木 喜美（乐队）", id: 10092 },
        ],
      },
      {
        type: "fix",
        content: "修复了剧情播放开始时有概率卡死的问题",
      },
    ],
  },
  {
    date: "2024-04-21",
    contents: [
      {
        type: "student",
        students: [{ name: "柚鸟 夏", id: 10029 }],
      },
    ],
  },
  {
    date: "2024-04-14",
    contents: [
      {
        type: "student",
        students: [{ name: "桐藤 渚", id: 20024 }],
      },
    ],
  },
  {
    date: "2024-04-04",
    contents: [
      {
        type: "student",
        students: [
          { name: "里滨 海夏", id: 10090 },
          { name: "春日 椿（向导）", id: 20035 },
        ],
      },
    ],
  },
  {
    date: "2024-03-16",
    contents: [
      {
        type: "student",
        students: [{ name: "鳄渊 明里（正月）", id: 20034 }],
      },
    ],
  },
  {
    date: "2024-03-10",
    contents: [
      {
        type: "student",
        students: [
          { name: "鬼方 佳代子（礼服）", id: 10088 },
          { name: "陆八魔 阿露（礼服）", id: 10089 },
        ],
      },
    ],
  },
  {
    date: "2024-02-14",
    contents: [
      {
        type: "student",
        students: [
          { name: "空崎 日奈（礼服）", id: 10086 },
          { name: "天雨 亚子（礼服）", id: 10087 },
          { name: "丹花 伊吹", id: 16014 },
          { name: "羽沼 真琴", id: 20033 },
        ],
      },
    ],
  },
  {
    date: "2023-12-31",
    contents: [
      {
        type: "student",
        students: [
          { name: "音濑 小玉（露营）", id: 10084 },
          { name: "小钩 晴（露营）", id: 10085 },
        ],
      },
      {
        type: "feat",
        content: "在移动端点击阿罗娜头像时，可以回到主页",
      },
    ],
  },
  {
    date: "2023-12-10",
    contents: [
      {
        type: "student",
        students: [
          { name: "和泉元 艾米（泳装）", id: 20032 },
          { name: "小钩 晴", id: 23003 },
        ],
      },
      {
        type: "fix",
        content: "修复了部分设备上注音会遮盖文字的问题",
      },
      {
        type: "fix",
        content: "修复了小屏幕设备上剧情信息排版异常的问题",
      },
      {
        type: "feat",
        content: "“设置”页面中新增“默认以全屏模式开始播放”选项",
      },
    ],
  },
  {
    date: "2023-12-03",
    contents: [
      {
        type: "feat",
        content: "新增猫鬼黑影总力战介绍",
      },
    ],
  },
  {
    date: "2023-11-26",
    contents: [
      {
        type: "student",
        students: [
          { name: "不破 莲华", id: 10082 },
          { name: "桐生 桔梗", id: 10083 },
        ],
      },
    ],
  },
  {
    date: "2023-11-12",
    contents: [
      {
        type: "student",
        students: [{ name: "勘解由小路 紫蓠", id: 10081 }],
      },
    ],
  },
  {
    date: "2023-10-29",
    contents: [
      {
        type: "student",
        students: [
          { name: "御坂美琴", id: 10079 },
          { name: "食蜂操祈", id: 10080 },
          { name: "佐天泪子", id: 26011 },
        ],
      },
      {
        type: "fix",
        content: "修复了部分情况下播放无法继续的问题",
      },
      {
        type: "fix",
        content: "部分学生剧情 live2d 特效错误的问题",
      },
    ],
  },
  {
    date: "2023-10-22",
    contents: [
      {
        type: "student",
        students: [
          { name: "奥空 绫音（泳装）", id: 26007 },
          { name: "阿慈谷 日富美（泳装）", id: 20005 },
        ],
      },
      {
        type: "feat",
        content: "改善部分小型平板设备的观看体验",
      },
      {
        type: "feat",
        content: "在学生选择界面的键盘输入会被自动识别为搜索学生",
      },
      {
        type: "fix",
        content: "修复在部分条件下，亮色/暗色切换按钮状态错误的问题",
      },
      {
        type: "fix",
        content: "修复在部分条件下，前一个剧情的特效会保留到其他剧情中的问题",
      },
      {
        type: "perf",
        content: "优化了点击进入剧情时的加载速度",
      },
    ],
  },
  {
    date: "2023-10-15",
    contents: [
      {
        type: "student",
        students: [
          {
            name: "间宵 时雨（温泉）",
            id: 20031,
          },
        ],
      },
      {
        type: "feat",
        content: "添加了自动检测更新的机制。",
      },
      {
        type: "feat",
        content: "在播放剧情时，可以自主调节文字展示速度。",
      },
      {
        type: "feat",
        content: "在播放剧情时，可以通过在播放器界面下滑滚轮的方式播放下一句",
      },
    ],
  },
  {
    date: "2023-10-08",
    contents: [
      {
        type: "feat",
        content: "在播放剧情时，可以通过在播放器界面下滑滚轮的方式进入下一句。",
      },
      {
        type: "fix",
        content: "修复了水宫子 live2d 没有语音的问题",
      },
    ],
  },
  {
    date: "2023-10-01",
    contents: [
      {
        type: "student",
        students: [
          {
            name: "仲正 一花",
            id: 10077,
          },
          {
            name: "鬼怒川 霞",
            id: 10078,
          },
        ],
      },
      {
        type: "style",
        content: "优化剧情播放界面",
      },
    ],
  },
  {
    date: "2023-09-24",
    contents: [
      {
        type: "student",
        students: [
          {
            name: "白石 咏叶",
            id: 23004,
          },
          {
            name: "古关 忧",
            id: 10035,
          },
        ],
      },
      {
        type: "fix",
        content: "修复了部分情况下剧情播放黑屏的问题",
      },
    ],
  },
  {
    date: "2023-09-17",
    contents: [
      {
        type: "student",
        students: [
          {
            name: "黑馆 晴奈（体操服）",
            id: 20030,
          },
          {
            name: "一之濑 明日奈（兔女郎）",
            id: 10028,
          },
        ],
      },
    ],
  },
  {
    date: "2023-09-10",
    contents: [
      {
        type: "student",
        students: [{ name: "丰见 小鸟（应援团）", id: 10076 }],
      },
      {
        type: "student",
        students: [{ name: "狮子堂 泉", id: 10009 }],
      },
      {
        type: "feat",
        content: "新增小春幸存者游戏",
      },
    ],
  },
  {
    date: "2023-08-27",
    contents: [
      {
        type: "feat",
        content: "可以在“设置”界面中选择跳过 MomoTalk 动画",
      },
      {
        type: "feat",
        content: "剧情播放时可以调节音量",
      },
      {
        type: "student",
        students: [
          { name: "姫木 梅露", id: 10075 },
          { name: "秋泉 红叶", id: 13013 },
        ],
      },
    ],
  },
  {
    date: "2023-08-21",
    contents: [
      {
        type: "student",
        students: [
          { name: "水羽 三森（泳装）", id: 20029 },
          { name: "久田 泉奈（泳装）", id: 10046 },
        ],
      },
    ],
  },
  {
    date: "2023-08-13",
    contents: [
      {
        type: "student",
        students: [
          { name: "早濑 优香", id: 13010 },
          { name: "久田 泉奈", id: 10014 },
        ],
      },
      {
        type: "fix",
        content: "对话记录滚动到底时，对话框不再被关闭",
      },
      {
        type: "fix",
        content: "修复了 BGM 异常停止的问题",
      },
      {
        type: "fix",
        content: "修复了加载完成后异常黑屏无法播放的问题",
      },
    ],
  },
  {
    date: "2023-08-05",
    contents: [
      {
        type: "main",
        content: "Vol.3 伊甸条约 第二章",
      },
      {
        type: "fix",
        content: "对话记录滚动到底时，对话框不再被关闭",
      },
      {
        type: "fix",
        content: "修复了 BGM 异常停止的问题",
      },
      {
        type: "fix",
        content: "修复了加载完成后异常黑屏无法播放的问题",
      },
    ],
  },
  {
    date: "2023-08-02",
    contents: [
      {
        type: "student",
        students: [{ name: "浦和 花子（泳装）", id: 10074 }],
      },
    ],
  },
  {
    date: "2023-07-30",
    contents: [
      {
        type: "student",
        students: [
          { name: "下江 小春（泳装）", id: 16013 },
          { name: "古关 忧（泳装）", id: 10073 },
          { name: "若叶 日向（泳装）", id: 20028 },
        ],
      },
    ],
  },
  {
    date: "2023-07-23",
    contents: [
      {
        type: "student",
        students: [
          { name: "砂狼 白子（泳装）", id: 20027 },
          { name: "圣园 未花", id: 10059 },
          { name: "早濑 优香（体操服）", id: 10053 },
        ],
      },
      {
        type: "fix",
        content: "修复了伊甸条约第一章第七话开头的 zoom 异常问题",
      },
    ],
  },
  {
    date: "2023-07-16",
    contents: [
      {
        type: "feat",
        content: "新增“任务剧情”",
      },
    ],
  },
  {
    date: "2023-07-02",
    contents: [
      {
        type: "feat",
        content: "在学生列表中，支持使用拼音搜索学生",
      },
      {
        type: "fix",
        content: "修正了剧情播放时，点击log跳转后有概率出现影分身的问题",
      },
      {
        type: "fix",
        content:
          "修正了 Vol. 3《伊甸条约》第一章第四话和第五话无法正常播放的问题",
      },
      {
        type: "fix",
        content: "修正了剧情播放时，点击log跳转后人物位置有概率出现异常的问题",
      },
      {
        type: "fix",
        content: "在移动端，菜单弹出时将不再重置暗色模式状态",
      },
      {
        type: "fix",
        content: "修复了瑠美 live2d 转场表现异常的问题",
      },
      {
        type: "student",
        students: [{ name: "空崎 日奈（泳装）", id: 10022 }],
      },
    ],
  },
  {
    date: "2023-06-27",
    contents: [
      {
        type: "fix",
        content: "修复了咲（泳装）剧情中，无法正确播放语音的问题",
      },
      {
        type: "fix",
        content: "修复了特定浏览器无法正确弹出对话log和剧情概要的问题",
      },
    ],
  },
  {
    date: "2023-06-25",
    contents: [
      {
        type: "student",
        students: [
          { name: "月雪 宫子（泳装）", id: 10071 },
          { name: "空井 咲（泳装）", id: 10072 },
          { name: "霞泽 美游（泳装）", id: 26010 },
        ],
      },
      {
        type: "fix",
        content:
          "修复了 Firefox 浏览器和 Safari 浏览器在展示对话log和剧情概要时动画异常缓慢的问题",
      },
    ],
  },
  {
    date: "2023-06-18",
    contents: [
      {
        type: "student",
        students: [{ name: "空崎 日奈", id: 10004 }],
      },
      {
        type: "chore",
        content: "优化了 404 错误的界面展示和引导文字",
      },
    ],
  },
  {
    date: "2023-06-14",
    contents: [
      {
        type: "fix",
        content: "修复了部分剧情无法正常播放的问题",
      },
      {
        type: "fix",
        content: "修复了在部分 iOS 设备上进入全屏时选项位置偏移的问题",
      },
    ],
  },
  {
    date: "2023-06-11",
    contents: [
      {
        type: "student",
        students: [{ name: "安守 实里", id: 20026 }],
      },
      {
        type: "fix",
        content: "修复黑幕转场动画表现异常的问题",
      },
    ],
  },
  {
    date: "2023-06-04",
    contents: [
      {
        type: "student",
        students: [
          { name: "朱城 瑠美", id: 10069 },
          { name: "近卫 弥奈", id: 10070 },
          { name: "砂狼 白子", id: 10010 },
        ],
      },
    ],
  },
  {
    date: "2023-05-12",
    contents: [
      {
        type: "student",
        students: [{ name: "玲纱", id: 10068 }],
      },
      {
        type: "fix",
        content: "修复了伊甸条约目录中错误的链接",
      },
      {
        type: "fix",
        content: "修复了选项按钮缺失点击音效的问题",
      },
    ],
  },
  {
    date: "2023-05-07",
    contents: [
      {
        type: "student",
        students: [
          { name: "爱丽丝（女仆装）", id: 10066 },
          { name: "时（兔女郎）", id: 10067 },
          { name: "柚子（女仆装）", id: 26009 },
          { name: "野宫", id: 13004 },
          { name: "野宫（泳装）", id: 10044 },
        ],
      },
      {
        type: "main",
        content: "Vol.3 伊甸条约 第一章",
      },
      {
        type: "fix",
        content: "修复特定分辨率移动设备上播放器宽度异常的问题",
      },
      {
        type: "feat",
        content: "主线播放页面在播放完成后会显示导航按钮",
      },
    ],
  },
  {
    date: "2023-04-16",
    contents: [
      {
        type: "student",
        students: [
          { name: "桑上 果穗", id: 10065 },
          { name: "下江 小春", id: 10020 },
          { name: "鬼方 佳代子（正月）", id: 10064 },
        ],
      },
      {
        type: "fix",
        content: "修复剧情黑屏问题",
      },
      {
        type: "feat",
        content: "剧情支持2倍超分辨率",
      },
      {
        type: "feat",
        content: "设置面板中支持重置整个应用",
      },
    ],
  },
  {
    date: "2023-03-24",
    contents: [
      {
        type: "student",
        students: [{ name: "伊草 遥香（正月）", id: 20025 }],
      },
    ],
  },
  {
    date: "2023-03-22",
    contents: [
      {
        type: "student",
        students: [{ name: "浅黄 睦月（正月）", id: 10032 }],
      },
      {
        type: "feat",
        content: "提供设置面板，在遇到显示错误的时候可以清空缓存了",
      },
      {
        type: "feat",
        content: "增加小雪剧情的繁体中文翻译",
      },
      {
        type: "feat",
        content: "momotalk 的阅读状态可以保持",
      },
      {
        type: "feat",
        content: "momotalk 的好感剧情入口不会在作出回答前出现",
      },
      {
        type: "feat",
        content: "momotalk 对话内容完全支持日、英、中文",
      },
      {
        type: "fix",
        content: "优化手机端 Safari 体验",
      },
      {
        type: "fix",
        content: "一些显示 bug 修复",
      },
    ],
  },
  {
    date: "2023-03-09",
    contents: [
      {
        type: "student",
        students: [{ name: "黑崎 小雪", id: 10063 }],
      },
    ],
  },
  {
    date: "2023-03-06",
    contents: [
      {
        type: "test",
        content: "序章和体香好感剧情 1 播放",
      },
    ],
  },
  {
    date: "2023-02-22",
    contents: [
      {
        type: "feat",
        content: "完善时的弹性装甲过滤逻辑",
      },
      {
        type: "student",
        students: [
          { name: "飞鸟马 时", id: 10062 },
          { name: "桐藤 渚", id: 20024 },
        ],
      },
    ],
  },
  {
    date: "2023-02-11",
    contents: [
      {
        type: "student",
        students: [{ name: "歌住 樱子", id: 10061 }],
      },
    ],
  },
  {
    date: "2022-02-03",
    contents: [
      {
        type: "feat",
        content: "momotalk 会自动定位到最后一条消息",
      },
      {
        type: "fix",
        content:
          "修复了连续出现两个选项时，重新选择倒数第二个选项会让整段对话看起来卡死的问题",
      },
    ],
  },
  {
    date: "2023-01-29",
    contents: [
      {
        type: "feat",
        content: "支持按攻击类型过滤",
      },
    ],
  },
  {
    date: "2023-01-26",
    contents: [
      {
        type: "student",
        students: [
          { name: "圣园 未花", id: 10059 },
          { name: "尾刃 康娜", id: 20023 },
          { name: "下仓 惠", id: 10060 },
        ],
      },
    ],
  },
  {
    date: "2023-01-22",
    contents: [
      {
        type: "feat",
        content: "网站上线，提供 MomoTalk 查看功能。",
      },
    ],
  },
];
</script>

<template>
  <div id="update-log-container" class="flex-vertical color-transition" v-once>
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
  </div>
</template>

<style scoped lang="scss">
#update-log-container {
  align-items: flex-start;
  align-self: center;
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
      content: "、";
    }
  }
}

@media screen and (max-width: 768px) {
  #update-log-container {
    justify-content: flex-start;
  }

  .roadmap {
    max-width: 90%;
  }
}
</style>
