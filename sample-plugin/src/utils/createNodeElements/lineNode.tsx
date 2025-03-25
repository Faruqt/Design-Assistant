// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

function createLineNode(element: LineNode) {
  const line = figma.createLine();

  applyBackgroundFill(element, line);

  return line;
}

export { createLineNode };
