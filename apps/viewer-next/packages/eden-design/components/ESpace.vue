<script setup lang="tsx">
import type { SpaceProps } from "./types/EdenSpace/SpaceProps";
import { computed, Fragment, useSlots } from "vue";
import { getAllElements } from "../_utils/vueUtils";

const props = withDefaults(defineProps<SpaceProps>(), {
  align: "start",
  direction: "horizontal",
  size: "medium",
  wrap: false,
});

const sizeMap = {
  mini: 4,
  small: 8,
  medium: 16,
  large: 32,
};

const DEFAULT_SIZE = 16;

const spaceSize = computed(() => {
  if (typeof props.size === "number") {
    return props.size + "px";
  }

  if (!(props.size in sizeMap)) {
    console.warn(
      `EdenSpace: Invalid size prop: "${props.size}". Falling back to default size.`
    );
    return DEFAULT_SIZE + "px";
  }

  return sizeMap[props.size as keyof typeof sizeMap] + "px";
});

function getMarginOrPaddingSize(
  size: SpaceProps["margin"] | SpaceProps["padding"]
) {
  if (!size) return null;
  if (typeof size === "string") {
    return (
      size + `${/^(\d+)(px|rem|em|d?vw|d?vh)$/.test(size + "") ? "" : "px"}`
    );
  }

  if (typeof size === "number") {
    return size + "px";
  }

  if (Array.isArray(size)) {
    return size.map(size => size + "px").join(" ");
  }
}

const marginSize = computed(() => {
  return getMarginOrPaddingSize(props.margin);
});

const paddingSize = computed(() => {
  return getMarginOrPaddingSize(props.padding);
});

const spaceClass = computed(() => {
  return [
    {
      "flex-col": props.direction === "vertical" || props.vertical,
      "flex-wrap": props.wrap,
      "items-center": props.align === "center",
      "items-end": props.align === "end",
      "items-start": props.align === "start",
      "items-baseline": props.align === "baseline",
    },
  ];
});

const spaceStyles = computed(() => {
  return {
    gap: spaceSize.value,
    margin: marginSize.value || "",
    padding: paddingSize.value || "",
  };
});

const slots = useSlots();

const SpaceElement = () => {
  const children = getAllElements(slots.default?.(), true);

  return (
    <Fragment>
      {children.map((child, index) => {
        const shouldRenderDivider =
          (slots.divider || props.divider) && index > 0;
        return (
          <Fragment key={child.key ?? `item-${index}`}>
            {shouldRenderDivider &&
              (!!props.divider ? (
                <span role="separator" class="eden-ui eden-ui__space--built-in-divider select-none">
                  {props.divider}
                </span>
              ) : (
                slots.divider?.()
              ))}
            <div>{child}</div>
          </Fragment>
        );
      })}
    </Fragment>
  );
};
</script>

<template>
  <div
    class="eden-ui eden-ui__space flex"
    :class="spaceClass"
    :style="spaceStyles"
  >
    <SpaceElement />
  </div>
</template>

<style scoped lang="scss">
.eden-ui__space {
  width: 100%;
}
</style>

<style lang="scss">
@import "~/packages/eden-design/components/index.scss";

.eden-ui__space--built-in-divider {
  display: inline-block;
  color: $border-3;
}
</style>
