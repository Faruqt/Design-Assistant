// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createComponentNode(element: BaseNode) {
  const component = figma.createComponent();

  applyBackgroundFill(element, component);

  return component;
}

export { createComponentNode };
