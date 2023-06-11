import gsap from "gsap";

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
