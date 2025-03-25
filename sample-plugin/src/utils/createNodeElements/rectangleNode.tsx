// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createRectangleNode(element: RectangleNode) {
  const rectangle = figma.createRectangle();

  applyBackgroundFill(element, rectangle);

  return rectangle;
}

export { createRectangleNode };
