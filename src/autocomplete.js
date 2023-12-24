// autocomplete suggestions
export default function customCompletions(context) {
  let word = context.matchBefore(/\w*/);
  if (word.from == word.to && !context.explicit) return null;
  return {
    from: word.from,
    options: [
      // global constants
      { label: "CANVAS", type: "constant", info: "game canvas HTML element" },
      { label: "WIDTH", type: "constant", info: "width of the game screen" },
      { label: "HEIGHT", type: "constant", info: "height of the game screen" },
      {
        label: "TAPPED",
        type: "variable",
        info: "true when the game screen is tapped",
      },
      { label: "TAPX", type: "constant", info: "position X of the tap" },
      { label: "TAPY", type: "constant", info: "position Y of the tap" },
      {
        label: "TICKS",
        type: "variable",
        info: "number of updates since the game started",
      },
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
        label: "rect",
        type: "function",
        apply: "rect(",
        detail: "(x, y, width, height, color = 0, lineWidth = 1)",
      },
      {
        label: "clear",
        type: "function",
        apply: "clear(",
        detail: "(color = null)",
        info: "clear the game screen",
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
        detail: "(sound = 0)",
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
