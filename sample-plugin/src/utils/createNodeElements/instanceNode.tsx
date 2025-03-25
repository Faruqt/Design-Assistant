// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createInstanceNode(element: InstanceNode, component: ComponentNode) {
  const instance = component.createInstance();

  applyBackgroundFill(element, instance);

  return instance;
}

export { createInstanceNode };
