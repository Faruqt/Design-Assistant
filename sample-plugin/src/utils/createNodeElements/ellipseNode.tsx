// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createEllipseNode(element: EllipseNode) {
  const ellipse = figma.createEllipse();

  applyBackgroundFill(element, ellipse);

  return ellipse;
}

export { createEllipseNode };
