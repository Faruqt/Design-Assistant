// utils imports
import { rgbaToRgb } from "../colorConverter";
import { convertUint8ArrayToSvgString } from "../imageConverter";

// types imports
import { FigmaNodeElement } from "../../types/figmaNodes";
import { svgType } from "../../types/svg";

export function embedSvgInsideRectangle(
  svgString: string,
  rect: RectangleNode,
  parent: FrameNode
) {
  const svgNode = figma.createNodeFromSvg(svgString);

  // Position the SVG inside the rectangle
  svgNode.x = rect.x;
  svgNode.y = rect.y;

  // Group the SVG and rectangle together (optional)
  const group = figma.group([rect, svgNode], parent);

  return group;
}

function createImageNodeDirectly(svgString: string, element: FigmaNodeElement) {
  const svgNode = figma.createNodeFromSvg(svgString);

  // Position the SVG inside the rectangle
  svgNode.x = element.absoluteBoundingBox.x;
  svgNode.y = element.absoluteBoundingBox.y;
  svgNode.resize(element.absoluteBoundingBox.width, element.absoluteBoundingBox.height);

  return svgNode;
}

function createImageNodeInRectangle(
  element: FigmaNodeElement,
  parent: FrameNode,
  assets?: svgType[]
) {
  const rect = figma.createRectangle();
  rect.resize(element.absoluteBoundingBox.width, element.absoluteBoundingBox.height);
  rect.x = element.absoluteBoundingBox.x;
  rect.y = element.absoluteBoundingBox.y;
  rect.cornerRadius = (element.style && element.style["cornerRadius"]) || 0;

  console.log("here man");
  console.log("assets", assets);

  if (assets && assets.length > 0) {
    if ("imagePlaceholder" in element) {
      const asset = element.imagePlaceholder === "logo" ? assets[0] : assets[1];
      if (asset) {
        const svgString = convertUint8ArrayToSvgString(asset.uint8Array);

        embedSvgInsideRectangle(svgString, rect, parent);
      }
    }
  } else {
    // apply the default image
    const styleBackground =
      (element.style && element.style.backgroundColor) || {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
      }
    rect.fills = [{ type: "SOLID", color: rgbaToRgb(styleBackground) }];
  }

  parent.appendChild(rect);
}

function setUserAssetsOrPlaceHolder(
  element: FigmaNodeElement,
  parent: FrameNode,
  selectedUserAssets: svgType[]
) {
  if ("imagePlaceholder" in element) {
    console.log("image placeholder");

    // check the id of the image
    const asset = selectedUserAssets.find(
      (asset) => asset.id === element.imagePlaceholder
    );
    console.log("id", element.imagePlaceholder);
    console.log("asset", asset);
    if (asset) {
      const svgString = convertUint8ArrayToSvgString(asset.uint8Array);
      const node = createImageNodeDirectly(svgString, element);
      parent.appendChild(node);
    } else {
      createImageNodeInRectangle(element, parent);
    }
  } else {
    console.log("no image placeholder");
    createImageNodeInRectangle(element, parent);
  }
}

export {
  createImageNodeInRectangle,
  createImageNodeDirectly,
  setUserAssetsOrPlaceHolder,
};
