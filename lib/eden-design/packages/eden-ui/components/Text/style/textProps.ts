export const textSizeMap = [
  {
    textSize: "body-3",
    fontSize: "14px",
    lineHeight: "22px",
  },
  {
    textSize: "body-2",
    fontSize: "16px",
    lineHeight: "24px",
  },
  {
    textSize: "body-1",
    fontSize: "18px",
    lineHeight: "26px",
  },
  {
    textSize: "title-3",
    fontSize: "20px",
    lineHeight: "28px",
  },
  {
    textSize: "title-2",
    fontSize: "24px",
    lineHeight: "32px",
  },
  {
    textSize: "title-1",
    fontSize: "28px",
    lineHeight: "36px",
  },
  {
    textSize: "display-3",
    fontSize: "32px",
    lineHeight: "40px",
  },
  {
    textSize: "display-2",
    fontSize: "48px",
    lineHeight: "56px",
  },
  {
    textSize: "display-1",
    fontSize: "64px",
    lineHeight: "76px",
  },
];

export const elementTagRules = [
  {
    tagName: "h1",
    matches: {
      size: ["display-1", "title-1"],
    },
  },
  {
    tagName: "h2",
    matches: {
      size: ["display-2", "title-2"],
    },
  },
  {
    tagName: "h3",
    matches: {
      size: ["display-3", "title-3"],
    },
  },
  {
    tagName: "p",
    matches: {
      size: ["body-3", "body-2", "body-1"],
    },
  },
  {
    tagName: "span",
    matches: {
      inline: true,
    },
  },
  {
    tagName: "span",
    matches: {
      span: true,
    },
  },
  {
    tagName: "blockquote",
    matches: {
      blockquote: true,
    },
  },
  {
    tagName: "em",
    matches: {
      italic: true,
    },
  },
  {
    tagName: "sub",
    matches: {
      subscript: true,
    },
  },
  {
    tagName: "sup",
    matches: {
      superscript: true,
    },
  },
];
