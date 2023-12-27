import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import demo from "./demo";
import template from "./template";
import customCompletions from "./autocomplete";

const url = new URL(location);
if (url.searchParams.get("reset") !== null) {
  resetStorage();
  window.location = location.origin;
}

const code = document.querySelector(".code");
const game = document.querySelector(".game");
const playButton = document.querySelector(".play");
const stopButton = document.querySelector(".stop");
const iframe = document.querySelector("#frame");
const smallScreen = innerWidth < 1024;

playButton.addEventListener("click", () => {
  runCode();
  code.style.display = "none";
  game.style.display = "block";
});

stopButton.addEventListener("click", () => {
  code.style.display = "block";
  game.style.display = "none";
  iframe.srcdoc = "";
});

function runCode() {
  const code = editor.state.doc.toString();
  const content = template.replace(/{code}/, code);
  iframe.srcdoc = content;
}

let updateTimeout = 0;
const delay = 1000;
function previewChanges(update) {
  if (smallScreen) return;
  if (update.docChanged) {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
      updateTimeout = 0;
    }
    updateTimeout = setTimeout(runCode, delay);
  }
}

const state = EditorState.create({
  doc: loadFromStorage() || demo(),
  extensions: [
    basicSetup,
    keymap.of([indentWithTab]),
    oneDark,
    javascript(),
    javascriptLanguage.data.of({
      autocomplete: customCompletions,
    }),
    EditorView.updateListener.of(previewChanges),
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    }),
  ],
});

const editor = new EditorView({
  state,
  parent: document.querySelector(".code"),
});

if (!smallScreen) runCode();

// autosave
const autosave = 5000; // 5 seconds
setInterval(() => {
  localStorage.setItem("floppy_code", editor.state.doc.toString());
}, autosave);

function loadFromStorage() {
  return localStorage.getItem("floppy_code");
}

function resetStorage() {
  localStorage.clear();
}
