import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { javascript, javascriptLanguage } from "@codemirror/lang-javascript";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { show, hide, $ } from "./utils";
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
const code = $(".code");
const game = $(".game");
const playButton = $("#play");
const stopButton = $("#stop");
const iframe = $("#frame");
const smallScreen = innerWidth < 1024;
const isMobile = navigator.userAgent.match(/android|iphone|ipad/i) !== null;
let library = null;

fetch("floppy.js")
  .then((response) => response.text())
  .then((source) => {
    library = source;
    if (!smallScreen) {
      runCode();
    } else {
      show(playButton);
      hide(game);
    }
  });

playButton.addEventListener("click", () => {
  hide(code);
  show(game);
  hide(playButton);
  show(stopButton);
  runCode();
});

stopButton.addEventListener("click", stopGame);
document.addEventListener("backbutton", stopGame);
function stopGame(evt) {
  evt.preventDefault();
  show(code);
  hide(game);
  show(playButton);
  hide(stopButton);
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
  parent: $(".code"),
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
