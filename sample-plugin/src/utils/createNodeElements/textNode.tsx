// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// constants imports
import { DEFAULT_STYLES } from "../../constants";

function createTextNode(element: TextNode) {
  const text = figma.createText();
  text.characters = element?.characters || "";

  applyStyle(element, text);

  applyBackgroundFill(element, text);

  return text;
}

function applyStyle(element: TextNode, text: TextNode) {
  if (element?.fontSize) {
    text.fontSize = element.fontSize;
  }

  if (element?.textAlignVertical) {
    text.textAlignVertical = element.textAlignVertical;
  }

  if (element?.textAlignHorizontal) {
    text.textAlignHorizontal = element.textAlignHorizontal;
  }

  if (element?.fontName && typeof element.fontName !== "symbol") {
    if ("hasMissingFont" in element && element.hasMissingFont) {
      text.fontName = {
        family: "Inter",
        style: DEFAULT_STYLES.includes(element.fontName.style)
          ? element.fontName.style
          : "Extra Light",
      };
    } else {
      console.log(element.fontName.style);
      console.log(DEFAULT_STYLES.includes(element.fontName.style));
      text.fontName = {
        family: element.fontName.family,
        style: DEFAULT_STYLES.includes(element.fontName.style)
          ? element.fontName.style
          : "Extra Light",
      };
    }
  }

  if (element?.letterSpacing) {
    text.letterSpacing = element.letterSpacing;
  }

  if (element?.lineHeight) {
    text.lineHeight = element.lineHeight;
  }
}

export { createTextNode };
