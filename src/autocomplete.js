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
        label: "CENTERX",
        type: "variable",
        info: "middle X of the game screen",
      },
      {
        label: "CENTERY",
        type: "variable",
        info: "middle Y of the game screen",
      },
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
        detail: "(x, y, width, height, color = 0)",
      },
      {
        label: "rectfill",
        type: "function",
        apply: "rectfill(",
        detail: "(x, y, width, height, color = 0)",
      },
      {
        label: "circ",
        type: "function",
        apply: "circ(",
        detail: "(x, y, radius, color = 0)",
      },
      {
        label: "circfill",
        type: "function",
        apply: "circfill(",
        detail: "(x, y, radius, color = 0)",
      },
      {
        label: "oval",
        type: "function",
        apply: "oval(",
        detail: "(x, y, rx, ry, color = 0)",
      },
      {
        label: "ovalfill",
        type: "function",
        apply: "ovalfill(",
        detail: "(x, y, rx, ry, color = 0)",
      },
      {
        label: "poly",
        type: "function",
        apply: "poly([",
        detail: "(points, color = 0)",
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
        label: "linestyle",
        type: "function",
        apply: "linestyle(",
        detail: "(lineWidth, lineJoin, lineDash)",
      },
      {
        label: "text",
        type: "function",
        apply: "text(",
        detail: "(x, y, text, color = 0, size = null, font = 'monospace')",
      },
      {
        label: "textalign",
        type: "function",
        apply: "textalign(",
        detail: "(align = 'left', baseline = 'top')",
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
        label: "blendmode",
        type: "function",
        apply: "blendmode(",
        detail: "(mode)",
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
        label: "rand",
        type: "function",
        apply: "rand()",
        detail: "",
      },
      {
        label: "randi",
        type: "function",
        apply: "randi()",
        detail: "(min = 1, max = 100)",
      },
      {
        label: "clamp",
        type: "function",
        apply: "clamp(",
        detail: "(value, min, max)",
      },
      {
        label: "lerp",
        type: "function",
        apply: "lerp(",
        detail: "(a, b, t)",
        info: "Calculates a linear (interpolation) value from 'a' to 'b' over 't'.",
      },
      {
        label: "deg2rad",
        type: "function",
        apply: "deg2rad(",
        detail: "(degrees)",
      },
      {
        label: "rad2deg",
        type: "function",
        apply: "rad2deg(",
        detail: "(radians)",
      },
      {
        label: "sin",
        type: "function",
        apply: "sin(",
        detail: "(radians)",
      },
      {
        label: "cos",
        type: "function",
        apply: "cos(",
        detail: "(radians)",
      },
      {
        label: "abs",
        type: "function",
        apply: "abs(",
        detail: "(value)",
      },
      {
        label: "collision",
        type: "function",
        apply: "collision(",
        detail: "(x1, y1, w1, h1, x2, y2, w2, h2)",
      },
    ],
  };
}
