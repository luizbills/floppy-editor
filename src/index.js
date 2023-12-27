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

const desktopExtensions = [];
const code = document.querySelector(".code");
const game = document.querySelector(".game");
const playButton = document.querySelector(".play");
const stopButton = document.querySelector(".stop");
const iframe = document.querySelector("#frame");
const smallScreen = innerWidth < 1024;
let library = null;

playButton.style.display = "none";

fetch("floppy.js")
  .then((response) => response.text())
  .then((source) => {
    library = source;
    playButton.style.display = "";
    if (!smallScreen) runCode();
  });

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
  if (!library) return;
  const code = editor.state.doc.toString();
  let content = template.replace(/{game}/, code);
  content = content.replace(/{library}/, library);
  iframe.srcdoc = content;
}

if (!smallScreen) {
  let updateTimeout = 0;
  const delay = 1000;
  function previewChanges(update) {
    if (update.docChanged) {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
        updateTimeout = 0;
      }
      updateTimeout = setTimeout(runCode, delay);
    }
  }
  desktopExtensions.push(EditorView.updateListener.of(previewChanges));
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
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    }),
    ...desktopExtensions,
  ],
});

const editor = new EditorView({
  state,
  parent: document.querySelector(".code"),
});

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

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
