// utils imports
import { rgbaToRgb } from "./colorConverter";

// constants imports
import { GRADIENT_PAINT_TYPES } from "../constants";

function applyBackgroundFill(element: BaseNode, node: BaseNode) {
  if ("fills" in node) {
    let elementFills: Paint[] = [];

    if ("fills" in element && Array.isArray(element.fills)) {
      for (const fill of element.fills) {
        const elementFill = updateFillsArray(fill);
        if (elementFill) {
          // if fill is in the array, ignore it
          // check color is not equal to any other color

          isDuplicate(elementFills, elementFill)
            ? null
            : elementFills.push(elementFill);
        }
      }
    }

    // if (element?.fillOverrideTable) {
    //   const fillOverrideTable = element.fillOverrideTable;
    //   for (const segmentId in fillOverrideTable) {
    //     const overideFills = fillOverrideTable[segmentId]?.fills;

    //     for (const fill of overideFills) {
    //       const elementFill = updateFillsArray(fill);
    //       if (elementFill) {
    //         isDuplicate(elementFills, elementFill)
    //           ? null
    //           : elementFills.push(elementFill);
    //       }
    //     }
    //   }
    // }

    if (
      "vectorNetwork" in node &&
      "vectorNetwork" in element &&
      element?.vectorNetwork &&
      element.vectorNetwork?.regions &&
      element.vectorNetwork.regions.length > 0
    ) {
      element.vectorNetwork.regions.forEach((region) => {
        if ("fills" in region && Array.isArray(region.fills)) {
          for (const fill of region.fills) {
            const elementFill = updateFillsArray(fill);

            if (elementFill) {
              // Find index of an existing fill with the same properties
              const existingIndex = elementFills.findIndex((existingFill) =>
                objectsAreEqual(existingFill, elementFill)
              );

              // If the fill already exists, remove it
              if (existingIndex !== -1) {
                elementFills.splice(existingIndex, 1); // Remove the old fill
              }

              // Add the new fill
              elementFills.push(elementFill);
            }
          }
        }
      });
    }

    console.log("elementFills", elementFills);

    if (elementFills.length > 0) {
      node.fills = elementFills;
    } else if (
      "backgrounds" in element &&
      element?.backgrounds &&
      element.backgrounds &&
      "backgrounds" in node
    ) {
      node.backgrounds = element.backgrounds;
    } else if ("hasMissingFont" in element && element.hasMissingFont) {
      // check parent color so the element can be visible
      if (
        "parent" in node &&
        node.parent &&
        "fills" in node.parent &&
        node.parent.fills &&
        Array.isArray(node.parent.fills)
      ) {
        const parentFill = node.parent.fills[0];
        if (parentFill && "color" in parentFill) {
          //  apply opposite color to the element
          node.fills = [
            {
              type: "SOLID",
              color: {
                r: 1 - parentFill.color.r,
                g: 1 - parentFill.color.g,
                b: 1 - parentFill.color.b,
              },
            },
          ];
        }
      }
    } else {
      node.fills = [];
    }
  }
}

function checkIfColorIsNan(color: RGB) {
  if (isNaN(color.r) || isNaN(color.g) || isNaN(color.b)) {
    return false;
  }

  return true;
}

function updateFillsArray(fill: Paint) {
  if (fill.type === "SOLID") {
    const rgbColor = rgbaToRgb(fill.color);
    const fillStatus = checkIfColorIsNan(rgbColor);
    if (fillStatus) {
      const fillObject: {
        type: "SOLID";
        color: { r: number; g: number; b: number };
      } = {
        type: fill.type,
        color: rgbColor,
      };

      addOptionalFillAttributes(fill, fillObject);

      return fillObject;
    }
  } else if (
    fill.type !== "IMAGE" &&
    fill.type !== "VIDEO" &&
    GRADIENT_PAINT_TYPES.includes(fill.type)
  ) {
    const fillObject: {
      type: GradientPaint["type"];
      gradientTransform: Transform;
      gradientStops: ColorStop[];
    } = {
      type: fill.type,
      gradientTransform: fill.gradientTransform,
      gradientStops: [...fill.gradientStops],
    };

    addOptionalFillAttributes(fill, fillObject);

    return fillObject;
  } else if (fill.type === "IMAGE") {
    const fillObject: {
      type: "IMAGE";
      scaleMode: ImagePaint["scaleMode"];
      imageHash: string | null;
    } = {
      type: fill.type,
      scaleMode: fill.scaleMode,
      imageHash: fill.imageHash,
    };

    addOptionalFillAttributes(fill, fillObject);

    return fillObject;
  } else if (fill.type === "VIDEO") {
    const fillObject: {
      type: "VIDEO";
      scaleMode: VideoPaint["scaleMode"];
      videoHash: string | null;
    } = {
      type: fill.type,
      scaleMode: fill.scaleMode,
      videoHash: fill.videoHash,
    };

    addOptionalFillAttributes(fill, fillObject);

    return fillObject;
  }
}

function addOptionalFillAttributes(fill: Paint, fillObject: any) {
  if (fill.visible !== undefined) {
    fillObject["visible"] = fill.visible;
  }

  if (fill.opacity !== undefined) {
    fillObject["opacity"] = fill.opacity;
  }

  if (fill.blendMode !== undefined) {
    fillObject["blendMode"] = fill.blendMode;
  }

  if (fill.type === "IMAGE" && fill.imageTransform !== undefined) {
    fillObject["imageTransform"] = fill.imageTransform;
  }
  if (fill.type === "VIDEO" && fill.videoTransform !== undefined) {
    fillObject["videoTransform"] = fill.videoTransform;
  }
  if (fill.type === "IMAGE" && fill.rotation !== undefined) {
    fillObject["rotation"] = fill.rotation;
  }
  if (fill.type === "IMAGE" && fill.filters !== undefined) {
    fillObject["filters"] = fill.filters;
  }
  if (fill.type === "IMAGE" && fill.scalingFactor !== undefined) {
    fillObject["scalingFactor"] = fill.scalingFactor;
  }

  return fillObject;
}

function objectsAreEqual(obj1: any, obj2: any): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function isDuplicate(arr: Paint[], newObj: Paint): boolean {
  return arr.some((item) => objectsAreEqual(item, newObj));
}

function removeDuplicateFills(fills: Paint[]): Paint[] {
  return fills.filter(
    (fill, index, self) =>
      index ===
      self.findIndex((f) => JSON.stringify(f) === JSON.stringify(fill))
  );
}

export { applyBackgroundFill };
