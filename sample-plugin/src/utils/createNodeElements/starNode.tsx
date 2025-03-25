// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";

function createStarNode(element: BaseNode) {
  const star = figma.createStar();

  applyBackgroundFill(element, star);

  return star;
}

export { createStarNode };
