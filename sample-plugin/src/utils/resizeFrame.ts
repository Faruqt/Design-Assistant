const resizeFrameToFitChildren = (frame: FrameNode) => {
  if (frame.children.length > 0) {
    const visibleChildren = frame.children.filter((child) => child.visible);

    if (visibleChildren.length === 0) return;

    let frameWidth = frame.width;
    let frameHeight = frame.height;

    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    for (const child of visibleChildren) {
      let childRight = child.x + child.width;
      let childBottom = child.y + child.height;

      if (frame.clipsContent) {
        // If clipped, ensure the child is at least partially inside
        let adjustedX = Math.max(0, child.x); // Keep at least 0
        let adjustedY = Math.max(0, child.y);
        let adjustedRight = Math.min(frameWidth, childRight); // Prevent exceeding width
        let adjustedBottom = Math.min(frameHeight, childBottom);

        // Ignore children completely outside
        if (adjustedRight <= 0 || adjustedBottom <= 0) continue;

        // Use adjusted values
        minX = Math.min(minX, adjustedX);
        maxX = Math.max(maxX, adjustedRight);
        minY = Math.min(minY, adjustedY);
        maxY = Math.max(maxY, adjustedBottom);
      } else {
        // Normal case (no clipping)
        minX = Math.min(minX, child.x);
        maxX = Math.max(maxX, childRight);
        minY = Math.min(minY, child.y);
        maxY = Math.max(maxY, childBottom);
      }
    }

    if (minX === Infinity || minY === Infinity) return; // No valid children to resize to

    const newWidth = maxX - minX;
    const newHeight = maxY - minY;

    frame.resize(
      newWidth < 1 ? 1 : Math.round(newWidth),
      newHeight < 1 ? 1 : Math.round(newHeight)
    );
  }
};

export { resizeFrameToFitChildren };
