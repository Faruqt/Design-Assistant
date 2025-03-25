// async function createFigmaNodes(
//   parent: FrameNode,
//   element: FigmaNodeElement | FigmaNodeChildElement
// ) {
//   let node: FrameNode | TextNode | RectangleNode;

//   if (element.type === "text") {
//     node = createTextNode(element);
//     parent.appendChild(node);
//   } else if (element.type === "button") {
//     node = createButtonNode(element, selectedUserAssets);
//     parent.appendChild(node);
//   } else if (element.type === "image") {
//     // apply the user-uploaded asset
//     console.log("selectedUserAssets", selectedUserAssets);
//     console.log("elementz", element);
//     setUserAssetsOrPlaceHolder(
//       element as FigmaNodeElement,
//       parent,
//       selectedUserAssets
//     );
//     console.log("element", element);
//   } else if (element.type === "section" || element.type === "container") {
//     const frame = figma.createFrame();
//     frame.resize(element.size.width, element.size.height);
//     frame.x = element.position.x;
//     frame.y = element.position.y;

//     // inherit the background color from the parent if not specified
//     frame.fills = element.style?.background
//       ? [{ type: "SOLID", color: hexToRgb(element.style.background) }]
//       : [];

//     if ("childelements" in element) {
//       element.childelements?.forEach((child) => createFigmaNodes(frame, child));
//     } else if ("children" in element) {
//       element.children?.forEach((child) => createFigmaNodes(frame, child));
//     }

//     parent.appendChild(frame);
//   }
// }