// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createPolygonNode(element: BaseNode) {
  const polygon = figma.createPolygon();

  applyBackgroundFill(element, polygon);

  return polygon;
}

export { createPolygonNode };
