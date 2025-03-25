// utils imports
import { hexToRgb, rgbaToRgb } from "./utils/colorConverter";

import { createFigmaNode } from "./utils/createNodeElements/baseNode";
import { resizeFrameToFitChildren } from "./utils/resizeFrame";
import {
  loadFontsFromNestedObject,
  loadAllDefaultStyles,
} from "./utils/checkAndLoadFonts";

// types imports
import { svgType } from "./types/svg";

// constants imports
import {
  REPLACED_ATTRIBUTES,
  IGNORED_ATTRIBUTES,
  IGNORED_NODES_IN_EXTRACT,
  MAX_NODES,
} from "./constants";

const displacement = 100;
const iconsDisplacement = 50;
let selectedUserAssets: svgType[] = [];
let vectorAssets: VectorNode[] = [];

figma.showUI(__html__, { width: 500, height: 300 });

// Send selection updates to UI
figma.on("selectionchange", () => {
  const totalSelected = figma.currentPage.selection.length;

  if (totalSelected > MAX_NODES) {
    figma.notify(`You have selected ${totalSelected} nodes, but only ${MAX_NODES} can be processed at a time, Please reduce the selection to ${MAX_NODES} nodes or less
      and try again.`);

    // deselect all nodes
    figma.currentPage.selection = [];
  } else {
    vectorAssets = [];
    const selectedNodes = figma.currentPage.selection.map((node: BaseNode) => {
      console.log("node", node);

      const extract = extractNodeData(node);
      console.log("extract", extract);
      console.log("vectorAssets", vectorAssets);

      return extract;
    });

    console.log("selectedNodes", selectedNodes);

    if (selectedNodes.length > 0) {
      // Send the selected nodes to the UI
      figma.ui.postMessage({
        type: "selection-update",
        nodes: [...selectedNodes],
      });
    }
  }
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === "create-rectangles") {
    // Find the rightmost position of existing elements
    let maxX = 0;
    for (const node of figma.currentPage.children) {
      if ("x" in node) {
        maxX = Math.max(maxX, node.x + node.width);
      }
    }

    const numberOfRectangles = msg.count; // Get number from UI
    const color = hexToRgb(msg.color); // Get color from UI

    const nodes: SceneNode[] = [];
    for (let i = 0; i < numberOfRectangles; i++) {
      const rect = figma.createRectangle();
      rect.x = maxX + displacement + i * 150;
      rect.fills = [{ type: "SOLID", color: color }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }

    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
  } else if (msg.type === "cancel") {
    figma.closePlugin();
  } else if (msg.type === "modify-selection") {
    const nodes = figma.currentPage.selection;
    if (nodes.length === 0) {
      figma.notify("Select at least one object to modify.");
    } else {
      await processNodes([...nodes]);
    }
  } else if (msg.type === "import-assets") {
    const nodes = figma.currentPage.selection;

    if (nodes.length === 0) {
      figma.notify("Select at least one object to import.");
    } else {
      for (const node of nodes) {
        node.exportAsync({ format: "SVG" }).then((svg) => {
          console.log("svg", svg);
          figma.ui.postMessage({ type: "svg-data", svg: svg });
        });
      }
      figma.notify("Asset imported successfully.");
    }
  } else if (msg.type === "export-assets") {
    if (msg.selectedElements.length === 0) {
      figma.notify("Select at least one object to export.");
    } else {
      const selectedElements: svgType[] = msg.selectedElements;
      for (const elem of selectedElements) {
        // Find the rightmost position of existing elements
        let maxX = 0;
        for (const node of figma.currentPage.children) {
          if ("x" in node) {
            maxX = Math.max(maxX, node.x + node.width);
          }
        }

        console.log("elem", elem);
        const svgData = elem.uint8Array;
        // Create a new SVG node
        const newNode = figma.createNodeFromSvg(
          String.fromCharCode(...svgData)
        );
        newNode.x = maxX + displacement + iconsDisplacement;
        figma.currentPage.appendChild(newNode);
      }

      figma.notify("New assets added to the canvas");
    }
  } else if (msg.type === "generate-ui") {
    console.log("msg", msg);
    const nodes: SceneNode = msg.jsonData;

    if (msg.selectedElements.length > 0) {
      selectedUserAssets = msg.selectedElements;
    }

    if (!nodes) {
      figma.notify("Unable to generate UI. Please try again.");
      return;
    } else {
      console.log("processingNodes", nodes);

      try {
        await processNodes([nodes]);
      } catch (error) {
        console.error("Could not process nodes:", error);
        figma.notify("Could not process selected nodes. Please try again.");
      }
    }
  }
};

function extractNodeData(
  node: BaseNode,
  parentNodeFlow: Boolean = false
): Record<string, any> {
  const nodeData: Record<string, any> = {}; // Empty object to store extracted properties
  // Loop through all properties of the node
  // for (const key of Object.getOwnPropertyNames(node)) {
  for (const key in node) {
    try {
      const value = node[key as keyof BaseNode];

      if (key === "type" && value === "VECTOR") {
        // append vector to vectorAssets
        vectorAssets.push(node as VectorNode);
      }
      if (REPLACED_ATTRIBUTES.includes(key) || IGNORED_ATTRIBUTES.includes(key))
        continue; // Skip ignored properties

      // Skip non-serializable properties
      if (typeof value !== "symbol") {
        nodeData[key] = value;
      }
    } catch (e) {
      console.warn(`Error extracting property "${key}":`, e);
    }
  }

  console.log("nodeData", nodeData);
  console.log(parentNodeFlow);
  // If the node has children, extract their properties recursively
  if (
    !parentNodeFlow &&
    "children" in node &&
    Array.isArray((node as any).children)
  ) {
    nodeData.children = (node as any).children.map(
      (child: BaseNode) => extractNodeData(child, false) // Explicitly pass `false`
    );
  }

  return nodeData;
}

function parseDimension(
  value: string | undefined,
  parentSize?: number
): number {
  if (!value) {
    return 100;
  } // Default size
  else if (value.includes("%")) {
    return (parseFloat(value) / 100) * (parentSize || 100);
  } else if (value.includes("px")) {
    return parseInt(value.replace("px", ""));
  } else return 100; // Default size
}

// Function to apply user assets to the placeholders
// async function applyImage(node, imageUrl) {
//   const image = await fetch(imageUrl).then(res => res.arrayBuffer());
//   const imageHash = figma.createImage(new Uint8Array(image)).hash;
//   node.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash }];
// }

const processNodes = async (nodes: SceneNode[]) => {
  console.log("yes we are processing nodes");
  try {
    await Promise.all(
      nodes.map(async (node) => {
        const isParentNodeVisible = node.visible;

        console.log("node", node);
        console.log("isParentNodeVisible", isParentNodeVisible);

        // Hide the node
        node.visible = false;

        console.log("visible", node);

        // Generate UI (make sure this function does not rely on `node` after it's removed)
        await generateUI(node, isParentNodeVisible);

        // Deselect node
        figma.currentPage.selection = [];

        // // Remove node safely
        // if (node.parent) {
        //   node.remove();
        // }
      })
    );
  } catch (error) {
    console.error("Failed to process nodes:", error);
    figma.notify("Failed to process selected nodes. Please try again.");
  }
};

// figma.loadFontAsync({ family: "Inter", style: "Regular" }).then(() => {
const generateUI = async (jsonData: BaseNode, isParentNodeVisible: boolean) => {
  try {
    console.log("here we are");
    await loadAllDefaultStyles("Inter");
    console.log("default font loaded");
    const availableFonts = await figma.listAvailableFontsAsync();
    await loadFontsFromNestedObject(jsonData, availableFonts);

    console.log("isParent", jsonData.parent);
    const baseElement = await createFigmaNode(
      jsonData,
      figma.currentPage,
      isParentNodeVisible,
      vectorAssets
    );

    console.log("parentElement", baseElement);

    if (!jsonData) {
      figma.notify("Unable to generate UI. Please try again.");
      return;
    }
    if (!baseElement) {
      figma.notify("Unable to generate UI. Please try again.");
      return;
    }

    // Find the rightmost position of existing elements
    let maxX = 0;
    for (const node of figma.currentPage.children) {
      if ("x" in node) {
        maxX = Math.max(maxX, node.x + node.width);
      }
    }

    baseElement.x = maxX + displacement;

    // resize frame to fit all children
    // if (jsonData.type === "FRAME" || jsonData.type === "GROUP") {
    //   resizeFrameToFitChildren(baseElement as FrameNode);
    // }

    // Zoom into the root frame
    figma.viewport.scrollAndZoomIntoView([baseElement]);

    figma.notify("Design created successfully!");

    // Reset the selected user assets
    selectedUserAssets = [];

    // figma.closePlugin();
  } catch (error) {
    console.error("Failed to create design:", error);
    figma.notify("Failed to create design. Please try again.");
    figma.closePlugin();
  }
};
