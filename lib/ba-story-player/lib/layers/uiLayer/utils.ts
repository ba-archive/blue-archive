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
    about: "关于",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  en: {
    log: "LOG",
    summary: "Summary",
    close: "Close",
    setting: "Setting",
    volume: "Volume",
    about: "About us",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  jp: {
    log: "ログ",
    summary: "あらすじ",
    close: "閉じる",
    setting: "設定",
    volume: "ボリューム",
    about: "情報",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  kr: {
    log: "로그",
    summary: "요약",
    close: "닫기",
    setting: "설치",
    volume: "볼륨",
    about: "우리에 대해",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  tw: {
    log: "對話記錄",
    summary: "概要",
    close: "關閉",
    setting: "設定",
    volume: "音量",
    about: "關於",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
  th: {
    log: "บันทึกการสนทนา",
    summary: "สรุป",
    close: "ปิด",
    setting: "การตั้งค่า",
    volume: "ระดับเสียง",
    about: "เกี่ยวกับเรา",
    "about-inside":
      "Blue Archive unofficial WebGL story player<br><a href='https://github.com/ba-archive/blue-archive' target='_blank'>https://github.com/ba-archive/blue-archive</a>",
  },
};
/* eslint-enable max-len */

export function getUiI18n(key: string, language: Language) {
  return Reflect.get(Reflect.get(dict, language.toLowerCase()), key) || key;
}
