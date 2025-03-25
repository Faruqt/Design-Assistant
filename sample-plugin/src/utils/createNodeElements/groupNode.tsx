// // utils imports
// import { applyBackgroundFill } from "../applyBackgroundFill";

// // types imports
// import { FigmaNodeElement } from "../../types/figmaNodes";

// async function createGroupNode(
//   element: FigmaNodeElement,
//   parentNode?: BaseNode
// ) {
//   const childNodePairs: { node: BaseNode; element: FigmaNodeElement }[] = [];

//   for (const child of element.children) {
//     const childNode = await createFigmaNode(child, parentNode);
//     if (childNode) {
//       childNodePairs.push({ node: childNode, element: child });
//     }
//   }

//   if (childNodePairs.length === 0) return null;

//   // console.log("parentNode", parentNode ?? "figma.currentPage");

//   // Extract nodes for grouping
//   const childNodes = childNodePairs.map((pair) => pair.node);

//   const group = figma.group(childNodes, parentNode ?? figma.currentPage);

//   console.log("groupNoder", group);

//   // ✅ Restore original layout properties for Frames inside the group, because grouping resets them to "FIXED"
//   for (const { node: childNode, element: childElement } of childNodePairs) {
//     if (childNode.type === "FRAME" && "layoutMode" in childNode) {
//       console.log(`Before grouping: ${childNode.name}`);
//       console.log(
//         " - layoutSizingHorizontal:",
//         childNode.layoutSizingHorizontal
//       );
//       console.log(" - layoutSizingVertical:", childNode.layoutSizingVertical);
//       console.log(
//         " - childElementlayoutSizingVertical:",
//         childElement.layoutSizingVertical
//       );
//       console.log(
//         " - childElementlayoutSizingVertical:",
//         childElement.layoutSizingHorizontal
//       );

//       childNode.layoutSizingHorizontal = "HUG"; // or use childElement's original value if stored
//       childNode.layoutSizingVertical = "HUG"; // or use childElement's original value if stored

//       console.log(`After grouping: ${childNode.name}`);
//       console.log(
//         " - layoutSizingHorizontal:",
//         childNode.layoutSizingHorizontal
//       );
//       console.log(" - layoutSizingVertical:", childNode.layoutSizingVertical);
//     }
//   }

//   console.log("groupNode", group);

//   applyBackgroundFill(element, group);

//   return group;
// }
