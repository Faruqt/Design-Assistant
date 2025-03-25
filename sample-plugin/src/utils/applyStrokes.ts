// utils imports
import { rgbaToRgb } from "./colorConverter";

// types imports
import { FigmaNodeElement } from "../types/figmaNodes";

// constants imports
import { GRADIENT_PAINT_TYPES } from "../constants";

function applyStrokes(element: BaseNode, node: BaseNode) {
  if ("strokes" in node) {
    const elementStrokes: Paint[] = [];

    if (
      "strokeWeight" in node &&
      "strokeWeight" in element &&
      element?.strokeWeight
    ) {
      node.strokeWeight = element.strokeWeight;
    }

    if (
      "strokeAlign" in node &&
      "strokeAlign" in element &&
      element?.strokeAlign
    ) {
      node.strokeAlign = element.strokeAlign;
    }

    if ("strokeCap" in node && "strokeCap" in element && element?.strokeCap) {
      node.strokeCap = element.strokeCap;
    }

    if ("strokes" in element && Array.isArray(element.strokes)) {
      for (const stroke of element.strokes) {
        const elementStroke = updateStrokesArray(stroke);
        if (elementStroke) {
          elementStrokes.push(elementStroke);
        }
      }
    }

    if (elementStrokes.length > 0) {
      node.strokes = elementStrokes;
    } else {
      node.strokes = [];
    }
  }
}

function checkIfColorIsNan(color: RGB) {
  if (isNaN(color.r) || isNaN(color.g) || isNaN(color.b)) {
    return false;
  }

  return true;
}

function updateStrokesArray(stroke: Paint) {
  if (stroke.type === "SOLID") {
    const rgbColor = rgbaToRgb(stroke.color);
    const strokeStatus = checkIfColorIsNan(rgbColor);
    if (strokeStatus) {
      const strokeObject: {
        type: "SOLID";
        color: { r: number; g: number; b: number };
      } = {
        type: stroke.type,
        color: rgbColor,
      };

      addOptionalStrokeAttributes(stroke, strokeObject);

      return strokeObject;
    }
  } else if (
    stroke.type !== "IMAGE" &&
    stroke.type !== "VIDEO" &&
    GRADIENT_PAINT_TYPES.includes(stroke.type)
  ) {
    const strokeObject: {
      type: GradientPaint["type"];
      gradientTransform: Transform;
      gradientStops: ColorStop[];
    } = {
      type: stroke.type,
      gradientTransform: stroke.gradientTransform,
      gradientStops: [...stroke.gradientStops],
    };

    addOptionalStrokeAttributes(stroke, strokeObject);

    return strokeObject;
  } else if (stroke.type === "IMAGE") {
    const strokeObject: {
      type: "IMAGE";
      scaleMode: ImagePaint["scaleMode"];
      imageHash: string | null;
    } = {
      type: stroke.type,
      scaleMode: stroke.scaleMode,
      imageHash: stroke.imageHash,
    };

    addOptionalStrokeAttributes(stroke, strokeObject);

    return strokeObject;
  } else if (stroke.type === "VIDEO") {
    const strokeObject: {
      type: "VIDEO";
      scaleMode: VideoPaint["scaleMode"];
      videoHash: string | null;
    } = {
      type: stroke.type,
      scaleMode: stroke.scaleMode,
      videoHash: stroke.videoHash,
    };

    addOptionalStrokeAttributes(stroke, strokeObject);

    return strokeObject;
  }
}

function addOptionalStrokeAttributes(stroke: Paint, strokeObject: any) {
  if (stroke.visible !== undefined) {
    strokeObject["visible"] = stroke.visible;
  }

  if (stroke.opacity !== undefined) {
    strokeObject["opacity"] = stroke.opacity;
  }

  if (stroke.blendMode !== undefined) {
    strokeObject["blendMode"] = stroke.blendMode;
  }

  if (stroke.type === "IMAGE" && stroke.imageTransform !== undefined) {
    strokeObject["imageTransform"] = stroke.imageTransform;
  }
  if (stroke.type === "VIDEO" && stroke.videoTransform !== undefined) {
    strokeObject["videoTransform"] = stroke.videoTransform;
  }
  if (stroke.type === "IMAGE" && stroke.rotation !== undefined) {
    strokeObject["rotation"] = stroke.rotation;
  }
  if (stroke.type === "IMAGE" && stroke.filters !== undefined) {
    strokeObject["filters"] = stroke.filters;
  }
  if (stroke.type === "IMAGE" && stroke.scalingFactor !== undefined) {
    strokeObject["scalingFactor"] = stroke.scalingFactor;
  }

  return strokeObject;
}

export { applyStrokes };
