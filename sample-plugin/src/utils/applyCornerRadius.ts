// types imports
import { FigmaNodeElement } from "../types/figmaNodes";

function applyCornerRadius(element: BaseNode, node: BaseNode) {
  if (
    node.type === "RECTANGLE" ||
    node.type === "FRAME" ||
    node.type === "COMPONENT" ||
    node.type === "INSTANCE" ||
    node.type === "VECTOR"
  ) {
    if (
      "cornerRadius" in element &&
      "cornerRadius" in node &&
      typeof element.cornerRadius === "number"
    ) {
      node.cornerRadius = element.cornerRadius;
    } else if (
      "topLeftRadius" in node ||
      "topRightRadius" in node ||
      "bottomLeftRadius" in node ||
      "bottomRightRadius" in node
    ) {
      if (
        "topLeftRadius" in node &&
        "topLeftRadius" in element &&
        typeof element.topLeftRadius === "number"
      ) {
        node.topLeftRadius = element.topLeftRadius;
      }
      if (
        "topRightRadius" in node &&
        "topRightRadius" in element &&
        typeof element.topRightRadius === "number"
      ) {
        node.topRightRadius = element.topRightRadius;
      }
      if (
        "bottomLeftRadius" in node &&
        "bottomLeftRadius" in element &&
        typeof element.bottomLeftRadius === "number"
      ) {
        node.bottomLeftRadius = element.bottomLeftRadius;
      }
      if (
        "bottomRightRadius" in node &&
        "bottomRightRadius" in element &&
        typeof element.bottomRightRadius === "number"
      ) {
        node.bottomRightRadius = element.bottomRightRadius;
      }
    } else {
      // retrieve the corner radius values from vectorNetwork vertices attribute
      retrieveCornerRadiusFromVectorNetwork(element, node);
    }
  }
}

function retrieveCornerRadiusFromVectorNetwork(
  element: BaseNode,
  node: BaseNode
) {
  if (
    "vectorNetwork" in element &&
    element.vectorNetwork &&
    element.vectorNetwork.vertices &&
    "topLeftRadius" in node &&
    "topRightRadius" in node &&
    "bottomLeftRadius" in node &&
    "bottomRightRadius" in node
  ) {
    const points = element.vectorNetwork.vertices;

    // Find the min/max values
    const minX = Math.min(...points.map((p) => p.x));
    const maxX = Math.max(...points.map((p) => p.x));
    const minY = Math.min(...points.map((p) => p.y));
    const maxY = Math.max(...points.map((p) => p.y));

    // Calculate the corner radius
    const topLeft = points.find((p) => p.x === minX && p.y === minY);
    const topRight = points.find((p) => p.x === maxX && p.y === minY);
    const bottomLeft = points.find((p) => p.x === minX && p.y === maxY);
    const bottomRight = points.find((p) => p.x === maxX && p.y === maxY);

    // Set the corner radius
    if (topLeft && typeof topLeft.cornerRadius === "number")
      node.topLeftRadius = topLeft.cornerRadius;
    if (topRight && typeof topRight.cornerRadius === "number")
      node.topRightRadius = topRight.cornerRadius || 0;
    if (bottomLeft && typeof bottomLeft.cornerRadius === "number")
      node.bottomLeftRadius = bottomLeft.cornerRadius;
    if (bottomRight && typeof bottomRight.cornerRadius === "number")
      node.bottomRightRadius = bottomRight.cornerRadius;
  }
}

export { applyCornerRadius };
