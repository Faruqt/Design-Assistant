// utils imports
import { rgbaToRgb } from "../colorConverter";
import { createTextNode } from "./textNode";
import { setUserAssetsOrPlaceHolder } from "./imageNode";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";
import { svgType } from "../../types/svg";

function createButtonNode(
  element: FigmaNodeElement,
  selectedUserAssets: svgType[] = []
) {
  const button = figma.createFrame();

  button.cornerRadius = (element.style && element.style["cornerRadius"]) || 0;
  if (element.style && element.style.backgroundColor) {
    button.fills = [
      { type: "SOLID", color: rgbaToRgb(element.style.backgroundColor) },
    ];
  }

  if (element.children && element.children.length > 0) {
    for (const child of element.children) {
      // if (child.type === "text") {
      //   const buttonText = createTextNode(child as TextNode);
      //   button.appendChild(buttonText);
      // }
      // else if (child.type === "image") {
      //   setUserAssetsOrPlaceHolder(child, button, selectedUserAssets);
      // }
    }
  }

  return button;
}

export { createButtonNode };
