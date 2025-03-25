// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createFrameNode(element: FrameNode | InstanceNode) {
  const node = figma.createFrame();

  applyBackgroundFill(element, node);

  return node;
}

export { createFrameNode };
