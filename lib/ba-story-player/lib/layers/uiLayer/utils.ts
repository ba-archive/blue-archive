import gsap from "gsap";
import { Language } from "@/types/store";

// 按钮激活动画
function effectBtnMouseDown(duration = 0.15, scale = 0.94) {
  return (ev: Event) => {
    gsap.to(ev.currentTarget, {
      duration: duration,
      scale: scale,
      ease: "power3.out",
      force3D: true,
    });
  };
}

// 按钮失活动画
function effectBtnMouseUp(duration = 0.3, scale = 1) {
  return (ev: Event) => {
    gsap.to(ev.currentTarget, {
      duration: duration,
      scale: scale,
      force3D: true,
    });
  };
}

/**
 * 按钮动画
 * @args 控制动画参数
 *  args.durationDown: 按下去的动画时间
 *  args.scaleDown: 按下按钮，按钮的 scale 变化量
 *  args.durationUp: 松开按钮的动画时间
 *  args.scaleUp: 松开按钮的 scale 变化量
 */
function buttonAnimation(
  elem: {
    cssSelector?: string;
    elem?: Element;
    elems?: Element[];
  },
  args: {
    scaleDown: number;
    durationDown: number;
    scaleUp: number;
    durationUp: number;
  } = { durationDown: 0.15, scaleDown: 0.95, durationUp: 0.3, scaleUp: 1 }
) {
  let elems;
  if (elem.cssSelector) {
    elems = document.querySelectorAll(elem.cssSelector);
  } else if (elem.elem) {
    elems = [elem.elem];
  } else if (elem.elems) {
    elems = elem.elems;
  } else {
    return;
  }
  elems.forEach(elem => {
    elem.addEventListener(
      "mousedown",
      effectBtnMouseDown(args.durationUp, args.scaleDown)
    );
    elem.addEventListener(
      "touchstart",
      effectBtnMouseDown(args.durationUp, args.scaleDown)
    );
    elem.addEventListener(
      "mouseup",
      effectBtnMouseUp(args.durationUp, args.scaleUp)
    );
    elem.addEventListener(
      "touchend",
      effectBtnMouseUp(args.durationUp, args.scaleUp)
    );
    elem.addEventListener(
      "mouseleave",
      effectBtnMouseUp(args.durationUp, args.scaleUp)
    );
  });
}

export { buttonAnimation, effectBtnMouseDown, effectBtnMouseUp };
// i18n
/* eslint-disable max-len */
const dict = {
  cn: {
    log: "对话记录",
    summary: "概要",
    close: "关闭",
    setting: "设置",
    volume: "音量",
    "volume-bg": "背景",
    "volume-fx": "音效",
    "volume-voice": "语音",
    about: "关于",
    playing: "播放",
    "playing-speed": "播放速度",
    "playing-speed-fast": "快",
    "playing-speed-normal": "中",
    "playing-speed-slow": "慢",
    "playing-custom-setting": "自定义",
    "playing-custom-setting-millisecond": "每个字停顿\n毫秒",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  en: {
    log: "LOG",
    summary: "Summary",
    close: "Close",
    setting: "Setting",
    volume: "Volume",
    "volume-bg": "backgound",
    "volume-fx": "effect",
    "volume-voice": "voice",
    about: "About us",
    playing: "Player",
    "playing-speed": "Play Speed",
    "playing-speed-fast": "Fast",
    "playing-speed-normal": "Normal",
    "playing-speed-slow": "Slow",
    "playing-custom-setting": "Custom",
    "playing-custom-setting-millisecond":
      "Each word pauses for \n milliseconds",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  jp: {
    log: "ログ",
    summary: "あらすじ",
    close: "閉じる",
    setting: "設定",
    volume: "ボリューム",
    "volume-bg": "背景",
    "volume-fx": "音效",
    "volume-voice": "语音",
    about: "情報",
    playing: "再生",
    "playing-speed": "播放速度",
    "playing-speed-fast": "快",
    "playing-speed-normal": "中",
    "playing-speed-slow": "慢",
    "playing-custom-setting": "自定义",
    "playing-custom-setting-millisecond": "每个字停顿\n毫秒",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  kr: {
    log: "로그",
    summary: "요약",
    close: "닫기",
    setting: "설치",
    volume: "볼륨",
    "volume-bg": "배경",
    "volume-fx": "효과",
    "volume-voice": "음성",
    about: "우리에 대해",
    playing: "재생",
    "playing-speed": "재생 속도",
    "playing-speed-fast": "빠르다",
    "playing-speed-normal": "정상",
    "playing-speed-slow": "느린",
    "playing-custom-setting": "사용자 지정",
    "playing-custom-setting-millisecond": "단어당 \n ms 중지",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  tw: {
    log: "對話記錄",
    summary: "概要",
    close: "關閉",
    setting: "設定",
    volume: "音量",
    "volume-bg": "背景",
    "volume-fx": "音效",
    "volume-voice": "語音",
    about: "關於",
    playing: "播放",
    "playing-speed": "播放速度",
    "playing-speed-fast": "快",
    "playing-speed-normal": "中",
    "playing-speed-slow": "慢",
    "playing-custom-setting": "自定義",
    "playing-custom-setting-millisecond": "每個字停頓 \n 毫秒",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  th: {
    log: "บันทึกการสนทนา",
    summary: "สรุป",
    close: "ปิด",
    setting: "การตั้งค่า",
    volume: "ระดับเสียง",
    "volume-bg": "พื้นหลัง",
    "volume-fx": "เอฟเฟกต์เสียง",
    "volume-voice": "เสียงพูด",
    about: "เกี่ยวกับเรา",
    playing: "เล่น",
    "playing-speed": "ความเร็วในการเล่น",
    "playing-speed-fast": "รวดเร็ว",
    "playing-speed-normal": "ปกติ",
    "playing-speed-slow": "ช้า",
    "playing-custom-setting": "การปรับแต่ง",
    "playing-custom-setting-millisecond": "หยุดชั่วคราว \n มิลลิวินาทีต่อคำ",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
};

export function closestNumber(number: number, arr: number[]) {
  let index = 0;
  let abs = Number.MAX_VALUE;
  arr.forEach((num, _index) => {
    const tmp = Math.abs(number - num);
    if (tmp < abs) {
      abs = tmp;
      index = _index;
    }
  });
  return arr[index];
}

/* eslint-enable max-len */
export function getUiI18n<key extends keyof (typeof dict)["cn"]>(
  key: T,
  language: Language
): string {
  return Reflect.get(Reflect.get(dict, language.toLowerCase()), key) || key;
}
