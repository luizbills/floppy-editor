import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { esLint, javascript } from "@codemirror/lang-javascript";
import { linter, lintGutter } from "@codemirror/lint";
import { indentWithTab } from "@codemirror/commands";
import * as eslint from "eslint-linter-browserify";
import demo from "./demo";
import template from "./template";

const code = document.querySelector(".code");
const game = document.querySelector(".game");
const playButton = document.querySelector(".play");
const stopButton = document.querySelector(".stop");
const iframe = document.querySelector("#frame");

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
  if (update.docChanged) {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
      updateTimeout = 0;
    }
    updateTimeout = setTimeout(runCode, delay);
  }
}

// eslint configuration
const config = {
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
  },
  env: {
    browser: true,
    node: false,
  },
  rules: {},
};

const state = EditorState.create({
  doc: demo,
  extensions: [
    basicSetup,
    keymap.of([indentWithTab]),
    javascript(),
    lintGutter(),
    linter(esLint(new eslint.Linter(), config)),
    EditorView.updateListener.of(previewChanges),
  ],
});

const editor = new EditorView({
  state,
  parent: document.querySelector(".code"),
});

runCode();
