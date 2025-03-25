import React from "react";
import { createRoot } from "react-dom/client";

// css imports
import "./ui.css";

// components imports
import CreateElement from "./components/createElements";
import ModifySelection from "./components/modifySelection";
import ImportAssets from "./components/importAssets";

try {
  const App = () => {
    return (
      <div className="p-1">
        <h1>Plugin UI</h1>
        <hr className="my-1"></hr>

        {/* <CreateElement /> */}
        {/* <ModifySelection /> */}
        <ImportAssets />

        <hr className="my-1"></hr>
        <h3>Close Plugin</h3>
        <button
          onClick={() =>
            parent.postMessage({ pluginMessage: { type: "cancel" } }, "*")
          }
          className="mt-2 bg-rose-500 text-white p-1"
        >
          Close
        </button>
      </div>
    );
  };

  // Wait for the document to fully load
  document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("root");

    if (container) {
      createRoot(container).render(<App />);
    } else {
      console.error("Root element not found!");
    }
  });
} catch (error) {
  console.error("UI failed to initialize:", error);
}
