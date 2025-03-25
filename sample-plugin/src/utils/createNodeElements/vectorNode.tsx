// utils imports
import { applyBackgroundFill } from "../applyBackgroundFill";

async function createVectorNode(element: VectorNode): Promise<VectorNode> {
  const vector = figma.createVector();

  if (element?.vectorPaths) {
    vector.vectorPaths = element.vectorPaths;
  }

  if (element?.vectorNetwork) {
    await vector.setVectorNetworkAsync(element.vectorNetwork);
  }

  applyBackgroundFill(element, vector);

  return vector;
}

function cloneVectorNode(
  originalVector: VectorNode,
  vectorAssets: VectorNode[]
): VectorNode {
  console.log("vectorAssets", vectorAssets);
  console.log("originalVector", originalVector);
  // check and get the original vector if in the vectorAssets array
  const vectorElement = vectorAssets.find(
    (vector) => vector.id === originalVector.id
  );

  console.log("vectorElement", vectorElement);

  const clonedVector = vectorElement
    ? vectorElement.clone()
    : figma.createVector();

  return clonedVector;
}

export { createVectorNode, cloneVectorNode };
