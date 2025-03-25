// constants imports
import { DEFAULT_STYLES } from "../constants";

// Helper function to check if the font exists
function fontExists(font: FontName, availableFonts: Font[]): boolean {
  return availableFonts.some(
    (f) => f.fontName.family === font.family && f.fontName.style === font.style
  );
}

// Run the function inside the plugin
async function loadFontsFromNestedObject(
  obj: BaseNode,
  availableFonts: Font[]
) {
  try {
    // Fetch available fonts only once if not already provided
    if (availableFonts.length === 0) {
      availableFonts = await figma.listAvailableFontsAsync();
    }

    if (
      "fontName" in obj &&
      obj.fontName &&
      obj.fontName !== undefined &&
      obj.fontName !== null &&
      typeof obj.fontName !== "symbol"
    ) {
      const fontToLoad: FontName = obj.fontName;
      if (fontExists(fontToLoad, availableFonts)) {
        await figma.loadFontAsync(fontToLoad);
      } else {
        console.warn(
          `Font not found: ${fontToLoad.family} - ${fontToLoad.style}`
        );
      }
    }

    // Recursively check children if they exist
    if ("children" in obj && Array.isArray(obj.children)) {
      for (const child of obj.children) {
        try {
          await loadFontsFromNestedObject(child, availableFonts); // Recursive call inside try
        } catch (e) {
          console.log(`Error loading fonts for a child:${child.name}`, e);
          // Continue with other children even if one fails
        }
      }
    }
  } catch (e) {
    console.log("An error occurred while loading fonts:", e);
  }
}

async function loadAllDefaultStyles(fontName: string) {
  const availableFonts = await figma.listAvailableFontsAsync();

  console.log("loading default styles");
  try {
    for (const style of DEFAULT_STYLES) {
      try {
        const fontToLoad: FontName = { family: fontName, style };
        if (fontExists(fontToLoad, availableFonts)) {
          await figma.loadFontAsync({ family: fontName, style });
          console.log(`Loaded font: ${fontName} - ${style}`);
        } else {
          console.warn(`Font not found: ${fontName} - ${style}`);
        }
      } catch (e) {
        console.warn(`Failed to load ${fontName} - ${style}:`, e);
      }
    }
  } catch (e) {
    console.log("An error occurred while loading default styles:", e);
  }
}

export { loadFontsFromNestedObject, fontExists, loadAllDefaultStyles };
