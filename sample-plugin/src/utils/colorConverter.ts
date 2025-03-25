export function hexToRgb(hex: string) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { r, g, b };
}

export function rgbaToRgb(rgba: RGB | RGBA) {
  const modifier = "a" in rgba ? rgba.a + (1 - rgba.a) : 1;

  const r = rgba.r * modifier;
  const g = rgba.g * modifier;
  const b = rgba.b * modifier;

  return { r, g, b };
}
