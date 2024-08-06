<script setup lang="ts">
import { TextProps } from "../types/Text";
import { textSizeMap, elementTagRules } from "../style/textProps";
import { computed, h, useSlots } from "vue";

const props = withDefaults(defineProps<TextProps>(), {
  size: "body-2",
  level: 5,
});

const textStyle = computed(() => {
  const sizeProps = textSizeMap
    .filter(item => item.textSize === props.size)
    .pop();
  return {
    fontSize: sizeProps?.fontSize,
    lineHeight: sizeProps?.lineHeight,
    textDecoration: [
      !!props.underline && "underline",
      !!props.stroke && "line-through",
    ].join(" "),
    color:
      props.color && "string" === typeof props.color
        ? props.color
        : `var(--color-text-${props.level}, #242424)`,
  };
});

function getGradientDegree(degree: number | string | undefined) {
  switch (typeof degree) {
    case "number":
      return `${degree}deg`;
    case "string":
      return degree;
    default:
      return "0deg";
  }
}

const gradientStyle = computed(() => {
  if ("object" === typeof props.color) {
    return {
      backgroundImage: `linear-gradient(${getGradientDegree(props.color.deg)},${
        props.color.from
      }, ${props.color.to})`,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    };
  }
});

function getElementTag(textProps = props) {
  const matches = elementTagRules.filter(el =>
    Object.keys(el.matches).every(key =>
      key === "size"
        ? el.matches[key]?.includes(textProps[key])
        : el.matches[key] === textProps[key]
    )
  );
  return matches && matches.length > 0 ? matches.pop()?.tagName ?? "p" : "p";
}

const possibleSlots = useSlots();

function renderTextNode(nodeProps = props, slots = possibleSlots) {
  return h(
    getElementTag(nodeProps),
    {
      class: [
        "eden-ui__text",
        {
          "is-title": nodeProps.title || nodeProps.size.startsWith("display"),
          "no-select": nodeProps.noSelect,
          bold: nodeProps.bold,
          blockquote: nodeProps.blockquote,
          disabled: nodeProps.disabled,
          strong: nodeProps.strong,
          italic: nodeProps.italic,
          subscript: nodeProps.subscript,
          superscript: nodeProps.superscript,
        },
      ],
      style: [textStyle.value, gradientStyle.value],
    },
    [
      !!slots.prefix && slots.prefix(),
      !!slots.default && slots.default(),
      !!slots.suffix && slots.suffix(),
    ]
  );
}

const EdenTextElement = computed(() => renderTextNode(props, possibleSlots));
</script>

<template>
  <EdenTextElement />
</template>

<style lang="scss">
h1,
h2,
h3 {
  &.eden-ui__text {
    margin: 0;
  }
}
.eden-ui__text {
  width: fit-content;
  display: flex;
  align-items: center;

  &.is-title {
    font-family: var(--eden-title-font, sans-serif);
    font-weight: var(--eden-title-font-weight, 700);
  }

  &.bold {
    font-weight: var(--eden-title-font-weight, 700);
  }

  &.no-select {
    user-select: none;
  }

  &.disabled {
    cursor: not-allowed;
    color: var(--color-text-2, #bdbdbd);
  }

  &.strong {
    font-weight: bold;
  }

  &.italic {
    font-style: italic;
  }

  &.blockquote {
    border-left: 0.25rem solid var(--color-text-2);
    padding-left: 1rem;
  }
}
</style>
