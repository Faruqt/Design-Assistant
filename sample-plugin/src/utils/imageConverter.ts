export async function convertSvgToRasterizedFill(
  svgUint8Array: Uint8Array,
  rect: RectangleNode
) {
  try {
    // Step 1: Convert SVG string into a vector node

    // Convert Uint8Array to string
    const svgString = String.fromCharCode(...svgUint8Array);

    const svgNode = figma.createNodeFromSvg(
      '<svg width="100" height="100"><rect width="100" height="100" fill="red"/></svg>'
    );

    // Append to the page to ensure visibility
    figma.currentPage.appendChild(svgNode);

    // Step 2: Rasterize the vector node to a PNG (export)
    svgNode.exportAsync({ format: "PNG" }).then((pngBytes) => {
      // Step 3: Clean up by removing the temporary SVG node
      svgNode.remove();

      // Step 4: Create a Figma image from the exported PNG
      const image = figma.createImage(pngBytes);

      rect.fills = [
        { type: "IMAGE", scaleMode: "FILL", imageHash: image.hash },
      ];
    });
  } catch (error) {
    console.error("Error in convertSvgToRasterizedFill:", error);
    throw error; // Re-throw to handle it in the caller function
  }
}

export function convertUint8ArrayToSvgString(uint8Array: Uint8Array) {
  return String.fromCharCode(...uint8Array);
}
