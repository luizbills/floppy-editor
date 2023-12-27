// autocomplete suggestions
export default function customCompletions(context) {
  let word = context.matchBefore(/\w*/);
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      // global constants
      { label: "CANVAS", type: "constant", info: "game canvas HTML element" },
      {
        label: "PARENT",
        type: "constant",
        info: "the parent element of the game canvas",
      },
      { label: "WIDTH", type: "variable", info: "width of the game screen" },
      { label: "HEIGHT", type: "variable", info: "height of the game screen" },
      {
        label: "TAPPED",
        type: "variable",
        info: "true when the game screen is tapped",
      },
      {
        label: "TAPPING",
        type: "variable",
        info: "true when the game screen is holding the mouse/touch",
      },
      { label: "TAPX", type: "variable", info: "position X of the tap" },
      { label: "TAPY", type: "variable", info: "position Y of the tap" },
      {
        label: "ELAPSED",
        type: "variable",
        info: "seconds since the game started",
      },
      { label: "FPS", type: "variable", info: "frames per second" },
      {
        label: "CANVAS.ctx",
        type: "constant",
        info: "canvas rendering 2d context",
      },
      // global functions
      {
        label: "clear",
        type: "function",
        apply: "clear(",
        detail: "(color = null)",
        info: "clear the game screen",
      },
      {
        label: "rect",
        type: "function",
        apply: "rect(",
        detail: "(x, y, width, height, color = 0, lineWidth = 1)",
      },
      {
        label: "rectfill",
        type: "function",
        apply: "rectfill(",
        detail: "(x, y, width, height, color = 0)",
      },
      {
        label: "circle",
        type: "function",
        apply: "circle(",
        detail: "(x, y, radius, color = 0, lineWidth = 1)",
      },
      {
        label: "circlefill",
        type: "function",
        apply: "circlefill(",
        detail: "(x, y, radius, color = 0)",
      },
      {
        label: "oval",
        type: "function",
        apply: "oval(",
        detail: "(x, y, rx, ry, color = 0, lineWidth = 1)",
      },
      {
        label: "ovalfill",
        type: "function",
        apply: "ovalfill(",
        detail: "(x, y, rx, ry, color = 0)",
      },
      {
        label: "triangle",
        type: "function",
        apply: "triangle(",
        detail: "(x1, y1, x2, y2, x3, y3, color = 0, lineWidth = 1)",
      },
      {
        label: "trianglefill",
        type: "function",
        apply: "trianglefill(",
        detail: "(x1, y1, x2, y2, x3, y3, color = 0)",
      },
      {
        label: "poly",
        type: "function",
        apply: "poly([",
        detail: "(points, color = 0, lineWidth = 1)",
      },
      {
        label: "polyfill",
        type: "function",
        apply: "polyfill([",
        detail: "(points, color = 0)",
      },
      {
        label: "line",
        type: "function",
        apply: "line(",
        detail: "(x, y, rx, ry, color = 0)",
      },
      {
        label: "text",
        type: "function",
        apply: "text(",
        detail: "(x, y, text, color = 0, size = null, font = 'monospace')",
      },
      {
        label: "image",
        type: "function",
        apply: "image(",
        detail: "(x, y, image)",
      },
      {
        label: "paint",
        type: "function",
        apply: "paint(",
        detail: "(width, height, draw)",
        info: "Creates a offscreen canvas to draw on it",
      },
      {
        label: "transform",
        type: "function",
        apply: "transform(",
        detail: "(translateX, translateY, scale = 1, angle = 0)",
      },
      {
        label: "push",
        type: "function",
        apply: "push()",
        detail: "",
        info: "save the rendering context",
      },
      {
        label: "pop",
        type: "function",
        apply: "pop()",
        detail: "",
        info: "restore the rendering context",
      },
      {
        label: "sfx",
        type: "function",
        apply: "sfx(0)",
        detail: "(sound = 0, volume = 1, pitch = 0, randomness = 0)",
      },
      {
        label: "math.rand",
        type: "function",
        apply: "math.rand()",
        detail: "",
      },
      {
        label: "math.randi",
        type: "function",
        apply: "math.randi()",
        detail: "(min = 1, max = 100)",
      },
      {
        label: "math.clamp",
        type: "function",
        apply: "math.clamp(",
        detail: "(value, min, max)",
      },
      {
        label: "math.lerp",
        type: "function",
        apply: "math.lerp(",
        detail: "(a, b, t)",
        info: "Calculates a linear (interpolation) value from 'a' to 'b' over 't'.",
      },
      {
        label: "math.deg2rad",
        type: "function",
        apply: "math.deg2rad(",
        detail: "(degrees)",
      },
      {
        label: "math.rad2deg",
        type: "function",
        apply: "math.rad2deg(",
        detail: "(radians)",
      },
      {
        label: "math.sin",
        type: "function",
        apply: "math.sin(",
        detail: "(radians)",
      },
      {
        label: "math.cos",
        type: "function",
        apply: "math.cos(",
        detail: "(radians)",
      },
    ],
  };
}
