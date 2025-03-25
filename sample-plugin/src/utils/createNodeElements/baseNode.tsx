// utils imports
import { createTextNode } from "./textNode";
import { createRectangleNode } from "./rectangleNode";
import { createVectorNode, cloneVectorNode } from "./vectorNode";
import { createStarNode } from "./starNode";
import { createEllipseNode } from "./ellipseNode";
import { createPolygonNode } from "./polygonNode";
import { createFrameNode } from "./frameNode";
import { createLineNode } from "./lineNode";
import { createInstanceNode } from "./instanceNode";
import { createComponentNode } from "./componentNode";
import { applyBackgroundFill } from "../applyBackgroundFill";
import { applyStrokes } from "../applyStrokes";
import { applyCornerRadius } from "../applyCornerRadius";
import { setUserAssetsOrPlaceHolder } from "./imageNode";

// types imports
import { svgType } from "../../types/svg";

// constants imports
import { ELEMENTS_WITH_CHILDREN } from "../../constants";

async function createFigmaNode(
  element: BaseNode,
  parentNode?: BaseNode & ChildrenMixin,
  isParentNodeVisible?: boolean,
  vectorAssets?: VectorNode[],
  selectedUserAssets?: svgType[]
) {
  let node: BaseNode | null = null;

  console.log("firstVectorAssets", vectorAssets);

  if (element.type === "TEXT") {
    node = createTextNode(element);
  } else if (element.type === "RECTANGLE") {
    node = createRectangleNode(element);
  } else if (element.type === "VECTOR") {
    // vectors are cloned to avoid several fills or order issues
    if (vectorAssets) {
      node = cloneVectorNode(element, vectorAssets);
    }
    // node = await createVectorNode(element);
  } else if (element.type === "LINE") {
    node = createLineNode(element);
  } else if (element.type === "INSTANCE") {
    if (parentNode && parentNode.type === "COMPONENT") {
      if (element.children.length > 0) {
        node = createFrameNode(element);
      } else {
        node = createInstanceNode(element, parentNode);
      }
    } else {
      if (element.children.length > 0) {
        node = createFrameNode(element);
      } else {
        const componentNode = createComponentNode(element);
        node = createInstanceNode(element, componentNode);
      }
    }
  } else if (element.type === "ELLIPSE") {
    node = createEllipseNode(element);
  } else if (element.type === "POLYGON") {
    node = createPolygonNode(element);
  } else if (element.type === "STAR") {
    node = createStarNode(element);
  } else if (element.type === "FRAME") {
    node = createFrameNode(element);
  } else if (element.type === "COMPONENT") {
    node = createComponentNode(element);
  } else if (element.type === "GROUP") {
    const childNodePairs: { node: BaseNode; element: BaseNode }[] = [];

    for (const child of element.children) {
      const childNode = await createFigmaNode(
        child,
        parentNode,
        isParentNodeVisible,
        vectorAssets || []
      );
      if (childNode) {
        childNodePairs.push({ node: childNode, element: child });
      }
    }

    if (childNodePairs.length === 0) return null;

    console.log("childNodePairs.length", childNodePairs.length);

    console.log("parentNode", parentNode);

    // Extract nodes for grouping
    const childNodes = childNodePairs.map((pair) => pair.node);

    console.log("childNodes", childNodes);

    node = figma.group(childNodes, parentNode ?? figma.currentPage);

    applyBackgroundFill(element, node);
  }

  if (node) {
    node.name = element.name;

    if ("visible" in node && "visible" in element) {
      // If isParentNodeVisible is null, default to the element's own visibility
      const shouldBeVisible = isParentNodeVisible ?? element.visible;

      node.visible = shouldBeVisible;
    }

    applyNodeProperties(node, element);

    if (
      "children" in element &&
      "children" in node &&
      ELEMENTS_WITH_CHILDREN.includes(element.type)
    ) {
      for (const child of element.children) {
        await createFigmaNode(child, node, node.visible, vectorAssets);
      }
    }

    // if node type is a frame and it has children and the element layout mode is not none
    // reset the layout mode
    if (
      node.type === "FRAME" &&
      node.children.length > 0 &&
      node.layoutMode === "NONE" &&
      "layoutMode" in element &&
      element.layoutMode !== "NONE"
    ) {
      node.layoutMode = element.layoutMode ?? "NONE";
    }

    if (
      "layoutWrap" in node &&
      "layoutWrap" in element &&
      "layoutMode" in element &&
      element.layoutMode === "HORIZONTAL"
    ) {
      console.log("layoutWrap", element.layoutWrap);
      console.log("layoutWrap", element.layoutMode);
      node.layoutWrap = element.layoutWrap;
    }

    if (parentNode && "appendChild" in parentNode) {
      if (parentNode.type === "INSTANCE") {
        // Step 1: Append the node to the parent of the instance
        const parentOfParentNode = parentNode.parent;

        // Step 2: Detach the instance (becomes a FrameNode)
        const detachedFrame = parentNode.detachInstance();
        if (parentOfParentNode) {
          parentOfParentNode.appendChild(detachedFrame);
        }

        // Step 3: Append the node to the detached frame
        detachedFrame.appendChild(node);
      } else {
        parentNode.appendChild(node);
      }
    }
  }

  return node;
}

function applyNodeProperties(node: BaseNode, element: BaseNode) {
  applyStrokes(element, node);

  if (
    "relativeTransform" in node &&
    "relativeTransform" in element &&
    element?.relativeTransform
  ) {
    node.relativeTransform = element.relativeTransform;
  }

  if ("maskType" in node && "maskType" in element && element?.maskType) {
    node.maskType = element.maskType;
  }

  if ("isMask" in node && "isMask" in element) {
    node.isMask = element.isMask ?? false;
  }
  if (
    "dashPattern" in node &&
    "dashPattern" in element &&
    element?.dashPattern
  ) {
    node.dashPattern = element.dashPattern;
  }

  if ("layoutMode" in node && "layoutMode" in element && element?.layoutMode) {
    // if node is a frame and layout mode is not none and the element has children
    // disable layout mode temporarily
    if (
      node.type === "FRAME" &&
      element.layoutMode !== "NONE" &&
      element.children.length > 0
    ) {
      node.layoutMode = "NONE";
    } else {
      node.layoutMode = element.layoutMode;
    }
  }

  if ("layoutMode" in element && "layoutMode" in node) {
    console.log("element.layoutMode", element.layoutMode);
    console.log("node.layoutMode", node.layoutMode);
  }

  if (
    "layoutAlign" in node &&
    "layoutAlign" in element &&
    element?.layoutAlign
  ) {
    node.layoutAlign = element.layoutAlign;
  }

  if ("layoutGrow" in node && "layoutGrow" in element && element?.layoutGrow) {
    node.layoutGrow = element.layoutGrow;
  }

  if (
    "itemSpacing" in node &&
    "itemSpacing" in element &&
    element?.itemSpacing
  ) {
    node.itemSpacing = element.itemSpacing;
  }

  if (
    "paddingLeft" in node &&
    "paddingLeft" in element &&
    element?.paddingLeft
  ) {
    node.paddingLeft = element.paddingLeft;
  }

  if (
    "paddingRight" in node &&
    "paddingRight" in element &&
    element?.paddingRight
  ) {
    node.paddingRight = element.paddingRight;
  }

  if ("paddingTop" in node && "paddingTop" in element && element?.paddingTop) {
    node.paddingTop = element.paddingTop;
  }

  if (
    "paddingBottom" in node &&
    "paddingBottom" in element &&
    element?.paddingBottom
  ) {
    node.paddingBottom = element.paddingBottom;
  }

  if ("opacity" in node && "opacity" in element && element?.opacity) {
    node.opacity = element.opacity;
  }

  if (
    "absoluteBoundingBox" in element &&
    element.absoluteBoundingBox &&
    "resize" in node &&
    "width" in element.absoluteBoundingBox &&
    "height" in element.absoluteBoundingBox
  ) {
    const width = element.width || element.absoluteBoundingBox.width;
    const height = element.height || element.absoluteBoundingBox.height;

    console.log("node, resize", width, height);
    console.log("node", node.name);
    console.log("node", node.type);
    if (node.type === "LINE") {
      node.resize(width, 0); // Ensure height is always 0
    } else {
      console.log("node.resize", width, height);
      node.resize(width < 1 ? 1 : width, height < 1 ? 1 : height);
    }
  }

  if ("layoutSizingHorizontal" in node) {
    if (
      "layoutMode" in node &&
      node.layoutMode !== "NONE" &&
      "layoutSizingHorizontal" in element &&
      element?.layoutSizingHorizontal
    ) {
      node.layoutSizingHorizontal = element.layoutSizingHorizontal ?? "HUG";
    }
  }

  if ("layoutSizingVertical" in node) {
    if (
      "layoutMode" in node &&
      node.layoutMode !== "NONE" &&
      "layoutSizingVertical" in element &&
      element?.layoutSizingVertical
    ) {
      node.layoutSizingVertical = element.layoutSizingVertical ?? "HUG";
    }
  }

  if (
    "counterAxisAlignContent" in node &&
    "counterAxisAlignContent" in element &&
    element?.counterAxisAlignContent
  ) {
    // if ("constraints" in node) {
    //   node.constraints = element?.constraints || {
    //     horizontal: "SCALE",
    //     vertical: "SCALE",
    //   };
    // }

    node.counterAxisAlignContent = element.counterAxisAlignContent;
  }

  if (
    "counterAxisSpacing" in node &&
    "counterAxisSpacing" in element &&
    element?.counterAxisSpacing
  ) {
    node.counterAxisSpacing = element.counterAxisSpacing;
  }

  if (
    "counterAxisAlignItems" in node &&
    "counterAxisAlignItems" in element &&
    element?.counterAxisAlignItems
  ) {
    node.counterAxisAlignItems = element.counterAxisAlignItems || "MIN";
  }

  if (
    "primaryAxisAlignItems" in node &&
    "primaryAxisAlignItems" in element &&
    element?.primaryAxisAlignItems
  ) {
    node.primaryAxisAlignItems = element.primaryAxisAlignItems || "MIN";
  }

  if (
    "primaryAxisSizingMode" in node &&
    "primaryAxisSizingMode" in element &&
    element?.primaryAxisSizingMode
  ) {
    node.primaryAxisSizingMode = element.primaryAxisSizingMode ?? "AUTO";
  }

  if (
    "counterAxisSizingMode" in node &&
    "counterAxisSizingMode" in element &&
    element?.counterAxisSizingMode
  ) {
    node.counterAxisSizingMode = element.counterAxisSizingMode ?? "AUTO";
  }

  if ("effects" in node && "effects" in element && element?.effects) {
    node.effects = element.effects;
  }

  // TODO - Update this
  if (
    "boundVariables" in node &&
    "boundVariables" in element &&
    element?.boundVariables
  ) {
    console.log(element.boundVariables);
  }

  if ("blendMode" in node && "blendMode" in element && element?.blendMode) {
    node.blendMode = element.blendMode;
  }

  if (
    "cornerSmoothing" in node &&
    "cornerSmoothing" in element &&
    element?.cornerSmoothing
  ) {
    node.cornerSmoothing = element.cornerSmoothing;
  }

  if ("rotation" in node && "rotation" in element && element?.rotation) {
    node.rotation = element.rotation;
  }

  if ("expanded" in node && "expanded" in element) {
    node.expanded = element.expanded ?? false;
  }

  if ("lineTypes" in node && "lineTypes" in element && element?.lineTypes) {
    node.lineTypes = element.lineTypes;
  }

  if (
    "lineIndentations" in node &&
    "lineIndentations" in element &&
    element?.lineIndentations
  ) {
    node.lineIndentations = element.lineIndentations;
  }

  if ("clipsContent" in node && "clipsContent" in element)
    node.clipsContent = element.clipsContent ?? false;

  if (
    "absoluteTransform" in node &&
    "absoluteTransform" in element &&
    element?.absoluteTransform
  ) {
    node.setPluginData(
      "absoluteTransform",
      JSON.stringify(element.absoluteTransform)
    );
  }

  applyCornerRadius(element, node);
}

export { createFigmaNode };
