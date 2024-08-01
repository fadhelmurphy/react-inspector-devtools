import Overlay from './Overlay';
import { checkDevtoolsGlobalHook, findFiberByHostInstance } from '../utils/devtools';
import { getEditorLink } from '../utils/editor';

const DEFAULT_OPEN_IN_EDITOR_URL = "vscode://file/{path}:{line}:{column}";
let overlay = null;
let inspecting = false;
let openInEditorUrl = DEFAULT_OPEN_IN_EDITOR_URL;
const mousePos = { x: 0, y: 0 };
let openInEditorMethod = "url";

export const startInspectorMode = () => {
  if (!checkDevtoolsGlobalHook()) return;
  inspecting = true;
  overlay = overlay || new Overlay();
  const button = overlay?.shadowRoot.querySelector(".btn-fdl-react-inspector");
  const element = document.elementFromPoint(mousePos.x, mousePos.y);
  if (element) {
    const { name, props, image } = getInspectName(element);
    overlay.inspect([element], name, props, image);
  }
  if (button) {
    button.style.display = "block";
    button.innerText = "Deactivate";
  }
  window.addEventListener("pointerover", handleElementPointerOver, true);
  window.addEventListener("click", handleInspectorClick, true);
};

export const exitInspectorMode = () => {
  inspecting = false;
  const button = overlay?.shadowRoot.querySelector(".btn-fdl-react-inspector");
  button.style.display = "none";
  button.innerText = "Activate";
  if (overlay) overlay.remove();
  overlay = null;
  window.removeEventListener("pointerover", handleElementPointerOver, true);
  window.removeEventListener("click", handleInspectorClick, true);
};

const getInspectName = (element) => {
  if (!checkDevtoolsGlobalHook()) return;
  const fiberNode = findFiberByHostInstance(element);
  if (!fiberNode) return "Source code could not be identified.";
  const { children = null, ...props } = fiberNode?.return?.memoizedProps ?? null;
  const imgPath = fiberNode.type === "img" ? props?.src : null;
  const debugSource = fiberNode?._debugSource;
  const openInEditorLink = debugSource && openInEditorUrl ? getEditorLink(openInEditorUrl, debugSource) : null;

  const { fileName, columnNumber, lineNumber } = fiberNode?._debugSource ?? {};
  const path = (fileName || "").split("/");
  const filePath = fileName
    ? `${path.at(-3) || ""}/${path.at(-2) || ""}/${path.at(-1)}:${
        lineNumber || 0
      }:${columnNumber || 0}`
    : null;

  const propsText = props ? JSON.stringify(props) : null;
  return { name: filePath, props: propsText, image: imgPath, openInEditorLink };
};

export const handleInspectorClick = async (e) => {
  if (!checkDevtoolsGlobalHook()) return;

  const button = overlay?.shadowRoot.querySelector(".btn-fdl-react-inspector");

  // Use composedPath to find the actual clicked target within the shadow DOM
  const path = e.composedPath();
  if (button && path.includes(button)) {
    return button.addEventListener("click", btnOnClickHandler);
  }
  e.preventDefault();
  e.stopPropagation();
  const element = e.target;
  const { openInEditorLink } = getInspectName(element);
  if (openInEditorMethod === "fetch") {
    await fetch(openInEditorLink);
  } else {
    window.open(openInEditorLink, "_blank");
  }
};

export const handleElementPointerOver = (e) => {
  if (!overlay || !inspecting) return;
  const element = e.target;
  const { name, props, image } = getInspectName(element);
  overlay.inspect([element], name, props, image);
  overlay.showTooltip(mousePos.x, mousePos.y);
};

export const btnOnClickHandler = () => {
  inspecting ? exitInspectorMode() : startInspectorMode();
};

export const init = () => {

  window.addEventListener("message", ({ data }) => {
    if (data === "inspect") {
      const button = document.querySelector(".btn-fdl-react-inspector");
      if (!checkDevtoolsGlobalHook()) {
        alert(
          "This page is not available to use the React Inspector. Make sure React Developer Tools is installed and enabled."
        );
        return;
      }
      if (inspecting) {
        exitInspectorMode();
        if (button) button.innerText = "Activate";
      } else {
        startInspectorMode();
        if (button) button.innerText = "Deactivate";
      }
    }
  
    if (data.type === "options" && data.openInEditorUrl) {
      openInEditorUrl = data.openInEditorUrl;
      openInEditorMethod = data.openInEditorMethod;
    }
  });
  document.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && inspecting) {
      exitInspectorMode();
    } else if (e.ctrlKey && e.key === "i") {
      inspecting ? exitInspectorMode() : startInspectorMode();
    }
  });
};


export const inspect = (elements, name, props, image) => {
  if (!overlay) return;
  overlay.inspect(elements, name, props, image);
};

