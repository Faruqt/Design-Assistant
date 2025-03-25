import React, { useState, useEffect } from "react";

const ModifySelection = () => {
  const [color, setColor] = React.useState("#ff0000");
  const [selectedNodes, setSelectedNodes] = useState<BaseNode[]>([]);

  // Listen for messages from the plugin
  useEffect(() => {
    window.onmessage = (event) => {
      const { type, nodes } = event.data.pluginMessage;
      if (type === "selection-update") {
        setSelectedNodes([...nodes]);
      }
      console.log("nodes", nodes);
    };
  }, []);

  // Send a message to Figma to change color
  const changeColor = () => {
    console.log("changeColor", color);
    parent.postMessage(
      { pluginMessage: { type: "modify-selection", color } },
      "*"
    );
  };

  const downloadNodes = () => {
    const data = JSON.stringify(selectedNodes, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "figma_nodes.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Selected Elements</h2>
      {selectedNodes.length > 0 ? (
        <ul>
          {selectedNodes.map((node) => (
            <li key={node.id}>
              {node.name} ({node.type})
            </li>
          ))}

          <h3>Select a Color</h3>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <button
            id="download"
            onClick={downloadNodes}
            className="mt-2 bg-blue-500 text-white p-1"
          >
            Download Nodes JSON
          </button>
        </ul>
      ) : (
        <p>No elements selected.</p>
      )}
      <button onClick={changeColor} className="mt-2 bg-blue-500 text-white p-1">
        Modify Selection
      </button>
    </div>
  );
};

export default ModifySelection;
