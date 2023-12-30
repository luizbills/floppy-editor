import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import demo from "./demo";
import template from "./template";
import customCompletions from "./autocomplete";
import mobileBar from "./mobileBar";

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
const isMobile = navigator.userAgent.match(/android|iphone|ipad/i) !== null;

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

stopButton.addEventListener("click", stopGame);
document.addEventListener("backbutton", stopGame);
function stopGame(evt) {
  evt.preventDefault();
  code.style.display = "block";
  game.style.display = "none";
  iframe.srcdoc = "";
}

function runCode() {
  if (!library) return;
  const code = codeEditor.state.doc.toString();
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
    // Ctrl+S to run the code
    keymap.of([
      indentWithTab,
      {
        key: "Ctrl-s",
        run() {
          runCode();
          return true;
        },
      },
    ]),
    oneDark,
    javascript(),
    javascriptLanguage.data.of({
      autocomplete: customCompletions,
    }),
    EditorView.theme({
      "&": { height: "100%" },
      ".cm-scroller": { overflow: "auto" },
    }),
    EditorView.lineWrapping,
    ...desktopExtensions,
  ],
});

window.codeEditor = new EditorView({
  state,
  parent: document.querySelector(".code"),
});

// autosave
const autosave = 5000; // 5 seconds
setInterval(() => {
  localStorage.setItem("floppy_code", codeEditor.state.doc.toString());
}, autosave);

function loadFromStorage() {
  return localStorage.getItem("floppy_code");
}

function resetStorage() {
  localStorage.clear();
}

if ("serviceWorker" in navigator) {
  if (
    "127.0.0.1" !== location.hostname ||
    location.search.includes("debug_sw")
  ) {
    navigator.serviceWorker.register("sw.js");
  }
}

if (isMobile) {
  mobileBar(codeEditor);
}
