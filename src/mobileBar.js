import { toggleComment, undo, redo, indentMore } from "@codemirror/commands";
import { openSearchPanel } from "@codemirror/search";

export default function mobileBar(editorView) {
  let blurTimeout = 0;
  const parent = editorView.dom.parentNode;
  const commands = [
    {
      name: "indent",
      label: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5" /></svg>`,
      callback: indentMore,
    },
    {
      name: "toggle comment",
      label: "//",
      callback: toggleComment,
    },
    {
      name: "undo",
      label: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" /></svg>`,
      callback: undo,
    },
    {
      name: "redo",
      label: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" /></svg>`,
      callback: redo,
    },
    {
      name: "search (and replace)",
      label: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>`,
      callback: openSearchPanel,
      focus: false,
    },
  ];

  const buttons = document.createElement("div");
  buttons.classList.add("mobile-buttons");
  buttons.style.display = "none";

  for (const cmd of commands) {
    const button = document.createElement("button");
    const focus = null == cmd.focus ? true : cmd.focus;

    button.innerHTML = cmd.label;
    button.setAttribute("name", cmd.name);
    button.setAttribute("aria-label", cmd.name);
    button.setAttribute("data-focus", focus ? "true" : "false");

    button.addEventListener("click", (evt) => {
      evt.preventDefault();
      cmd.callback(editorView);
      if (focus) editorView.contentDOM.focus();
    });

    buttons.appendChild(button);
  }

  parent.appendChild(buttons);

  editorView.contentDOM.addEventListener("focus", (evt) => {
    evt.preventDefault();
    buttons.style.display = "";
    if (blurTimeout) clearTimeout(blurTimeout);
  });

  editorView.contentDOM.addEventListener("blur", (evt) => {
    evt.preventDefault();
    blurTimeout = setTimeout(hideMobileBar, 100);
  });

  function hideMobileBar() {
    buttons.style.display = "none";
  }
}
