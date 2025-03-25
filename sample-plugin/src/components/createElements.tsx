import React from "react";

const CreateElement = () => {
  const [count, setCount] = React.useState(5);
  const [color, setColor] = React.useState("#ff0000");

  const generateRectangles = () => {
    parent.postMessage(
      {
        pluginMessage: { type: "create-rectangles", count, color },
      },
      "*"
    );
  };

  return (
    <div>
      <h3>Create Rectangles</h3>
      <label>Number of Rectangles:</label>
      <input
        type="number"
        value={count}
        min="1"
        onChange={(e) => setCount(parseInt(e.target.value))}
      />
      <button onClick={generateRectangles}>Generate</button>

      <h3>Select a Color</h3>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
    </div>
  );
};

export default CreateElement;
