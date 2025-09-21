import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const blue = "#60a5fa";
const orange = "#eda35e";
const purple = "#c678dd";
const red = "#e06c75";
const stone = "#7d8799";
const darkBackground = "#1f1f1f";
const highlightBackground = "#2a2a2a";
const selection = "#2b598f";
const activeLineSelection = "#d7d4f0";

const markdownThemeBase = EditorView.theme(
  {
    "&": {
      color: "white",
      backgroundColor: darkBackground,
    },
    ".cm-content": {
      caretColor: "white",
    },
    "&.cm-focused .cm-cursor": {
      borderLeftColor: "white",
    },
    "&.cm-focused .cm-selectionBackground, ::selection": {
      backgroundColor: selection,
    },
    ".cm-activeLine": {
      backgroundColor: highlightBackground,
    },
    ".cm-activeLine ::selection": {
      backgroundColor: activeLineSelection,
    },
    ".cm-gutters": {
      backgroundColor: darkBackground,
      color: stone,
      border: "none",
    },
  },
  { dark: true }
);

const markdownHighlightStyle = HighlightStyle.define([
  { tag: tags.heading, color: blue, fontWeight: "bold" },
  { tag: tags.strong, color: orange, fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strikethrough, textDecoration: "line-through" },

  { tag: tags.link, color: red, textDecoration: "underline" },
  { tag: tags.url, color: stone },
  { tag: tags.quote, color: stone, fontStyle: "italic" },

  { tag: [tags.monospace], color: orange },

  { tag: tags.list, color: stone },
  { tag: tags.quote, color: stone },

  { tag: tags.meta, color: purple },
  { tag: tags.comment, color: stone, fontStyle: "italic" },

  { tag: tags.atom, color: orange },
  { tag: tags.number, color: orange },
  { tag: tags.string, color: red },
  { tag: [tags.typeName, tags.className], color: blue },
  { tag: tags.propertyName, color: blue },
  { tag: tags.operator, color: purple },
  { tag: tags.definitionKeyword, color: purple },
  { tag: tags.variableName, color: red },
  { tag: tags.bracket, color: "#abb2bf" },
]);

export const defaultTheme = [
  markdownThemeBase,
  syntaxHighlighting(markdownHighlightStyle),
];
