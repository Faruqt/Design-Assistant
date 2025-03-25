interface FigmaNodeStyle {
  background?: string;
  color?: string;
  "font-size"?: number;
  "border-radius"?: number;
  "align-items"?: string;
}

interface OldFigmaNodeElement {
  type: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: FigmaNodeStyle;
  childelements?: FigmaNodeChildElement[];
}

interface FigmaNodeChildElement {
  type: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style?: FigmaNodeStyle;
  content?: string;
  src?: string;
  imagePlaceholder?: string;
  children?: OldFigmaNodeElement[];
}

interface FigmaNodeData {
  frame: { width: number; height: number; background: string };
  elements: OldFigmaNodeElement[];
}

interface BoundingSize {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface StrokesObject {
  blendMode: BlendMode;
  color: RGBA;
  type: PaintType;
}

interface FillOverrideTable {
  [key: string]: {
    [key: string]: Paint[];
  };
}

interface FigmaNodeElement {
  name: string;
  type: string;
  background?: string[];
  fills: Paint[];
  fillOverrideTable?: FillOverrideTable;
  fillGeometry?: VectorPaths;
  blendMode?: BlendMode;
  clipsContent?: boolean;
  boundVariables?: {
    [key: string]: VariableAlias;
  };
  effects?: Effect[];
  strokes: Paint[];
  strokeWeight: number;
  strokeCap: StrokeCap;
  strokeAlign: StrokeAlign;
  expanded?: boolean;
  dashPattern?: number[];
  layoutMode?: LayoutMode;
  layoutWrap?: LayoutWrap;
  layoutAlign?: LayoutAlign;
  layoutGrow?: number;
  layoutSizingHorizontal?: LayoutSizingHorizontal;
  layoutSizingVertical?: LayoutSizingVertical;
  itemSpacing?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  maskType?: MaskType;
  isMask?: boolean;
  horizontalPadding?: number;
  verticalPadding?: number;
  relativeTransform?: Transform;
  counterAxisAlignContent?: CounterAxisAlignContent;
  counterAxisAlignItems?: CounterAxisAlignItems;
  primaryAxisAlignItems?: PrimaryAxisAlignItems;
  primaryAxisSizingMode?: PrimaryAxisSizingMode;
  counterAxisSizingMode?: CounterAxisSizingMode;
  cornerRadius?: number;
  cornerSmoothing?: number;
  rotation?: number;
  lineTypes?: string[];
  lineIndentations?: number[];
  characters?: string;
  backgroundColor?: RGBA;
  vectorNetwork?: VectorNetwork;
  vectorPaths?: VectorPath[];
  absoluteBoundingBox: BoundingSize;
  absoluteRenderBounds: BoundingSize;
  absoluteTransform: Transform;
  constraints: {
    vertical: ConstraintType;
    horizontal: ConstraintType;
  };
  children: FigmaNodeElement[];
  fontName?: FontName;
  fontPostScriptName?: string;
  fontSize?: number;
  fontStyle?: FontStyle;
  fontFamilyStyle?: string;
  fontWeight?: number;
  paragraphIndent?: number;
  paragraphSpacing?: number;
  letterSpacing?: LetterSpacing;
  lineHeight?: LineHeight;
  lineHeightPercent?: number;
  lineHeightPercentFontSize?: number;
  lineHeightUnit?: string;
  textAlignHorizontal?: TextAlignHorizontal;
  textAlignVertical?: TextAlignVertical;
  textDecoration?: string;
  textAutoResize?: TextAutoResize;
  textTruncation?: TextTruncation;
  textCase?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  visible: boolean;
  isNodeVisible: boolean;
  opacity: number;
  style?: {
    fontFamily?: string;
    fontPostScriptName?: string;
    fontSize?: number;
    fontStyle?: FontStyle;
    fontFamilyStyle?: string;
    fontWeight?: number;
    paragraphIndent?: number;
    paragraphSpacing?: number;
    letterSpacing?: LetterSpacing;
    lineHeightPx?: LineHeight;
    lineHeightPercent?: number;
    lineHeightPercentFontSize?: number;
    lineHeightUnit?: string;
    textAlignHorizontal?: TextAlignHorizontal;
    textAlignVertical?: TextAlignVertical;
    textDecoration?: string;
    textAutoResize?: TextAutoResize;
    textTruncation?: TextTruncation;
    textCase?: string;
    fills?: string[];
    strokes?: string[];
    strokeWeight?: number;
    strokeAlign?: string;
    cornerRadius?: number;
    backgroundColor?: RGBA;
  };
}

type TextAlignVertical = "TOP" | "CENTER" | "BOTTOM";
type TextAlignHorizontal = "LEFT" | "CENTER" | "RIGHT" | "JUSTIFIED";
type FontStyle = "Regular" | "Bold" | "Italic" | "Bold Italic";
type LayoutMode = "NONE" | "HORIZONTAL" | "VERTICAL";
type StrokeAlign = "CENTER" | "INSIDE" | "OUTSIDE";
type CounterAxisAlignItems = "CENTER" | "MIN" | "MAX" | "BASELINE";
type PrimaryAxisAlignItems = "CENTER" | "MIN" | "MAX" | "SPACE_BETWEEN";
type PrimaryAxisSizingMode = "FIXED" | "AUTO";
type CounterAxisSizingMode = "FIXED" | "AUTO";
type LayoutAlign = "MIN" | "CENTER" | "MAX" | "STRETCH" | "INHERIT";
type LayoutSizingHorizontal = "FIXED" | "HUG" | "FILL";
type LayoutSizingVertical = "FIXED" | "HUG" | "FILL";
type LayoutWrap = "NO_WRAP" | "WRAP";
type CounterAxisAlignContent = "AUTO" | "SPACE_BETWEEN";
type TextAutoResize = "NONE" | "WIDTH_AND_HEIGHT" | "HEIGHT" | "TRUNCATE";
type TextTruncation = "DISABLED" | "ENDING";
type PaintType = Paint["type"];
type ScaleMode = "FILL" | "FIT" | "CROP" | "TILE";

export {
  FigmaNodeData,
  OldFigmaNodeElement,
  FigmaNodeChildElement,
  FigmaNodeStyle,
  FigmaNodeElement,
  TextAlignVertical,
  TextAlignHorizontal,
  FontStyle,
};
