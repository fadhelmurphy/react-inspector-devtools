import { btnOnClickHandler } from './inspector';

export default class Overlay {
  constructor() {
    this.createElements();
    this.appendElements();
    this.applyStyles();
  }

  createElements() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "fdl-inspector-wrapper";
    this.shadowRoot = this.wrapper.attachShadow({ mode: "open" });

    this.overlay = document.createElement("div");
    this.overlay.className = "overlay";

    this.tooltip = document.createElement("div");
    this.tooltip.className = "tooltip";
    this.tooltip.style.display = "none";

    this.button = document.createElement("button");
    this.button.className = "btn-fdl-react-inspector";
    this.button.innerText = "Activate";
    this.button.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 5px;
      width: 100px;
      height: 40px;
      font-size: 16px;
      cursor: pointer;
      z-index: 10000;
    `;
    this.button.addEventListener("click", btnOnClickHandler);
  }

  appendElements() {
    this.shadowRoot.appendChild(this.overlay);
    this.shadowRoot.appendChild(this.tooltip);
    this.shadowRoot.appendChild(this.button);
    document.body.appendChild(this.wrapper);
  }

  applyStyles() {
    const style = document.createElement("style");
    style.textContent = `
      .overlay {
        position: fixed;
        border: 2px solid rgb(8 126 164);
        background-color: rgb(8 126 164 / 20%);
        pointer-events: none;
        z-index: 9999;
        bottom: 0;
        left: 0;
        width: 100%;
        font-size: 14px;
        font-family: Arial, sans-serif;
        text-align: center;
        padding: 4px;
        box-sizing: border-box;
        transition: all 0.1s ease-in;
      }
      .tooltip {
        font-family: Arial, Helvetica, sans-serif;
        position: fixed;
        background-color: rgb(8 126 164 / 60%);
        color: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        font-size: 12px;    
        width: min-content;
        word-wrap: break-word;
        text-wrap: wrap;
        pointer-events: none;
        padding: 5px 8px;
        border-radius: 4px;
        text-align: left;
        transition: all 0.1s ease-in;
        z-index: 2147483647;
      }
      .tooltip p {
        margin: 0;
        margin-bottom: 1rem;
      }
      .tooltip .tip {
        font-size: 11px;
        opacity: 0.7;
      }
    `;
    this.shadowRoot.appendChild(style);
  }

  inspect(elements, text, props, imagePath) {
    if (!elements.length) return;
    const { left, bottom, width, height } = elements[0].getBoundingClientRect();
    this.overlay.style.left = `${left}px`;
    this.overlay.style.bottom = `${window.innerHeight - bottom}px`;
    this.overlay.style.width = `${width}px`;
    this.overlay.style.height = `${height}px`;
    this.updateTooltipContent(text, props, imagePath);
  }

  updateTooltipContent(text, props, imagePath) {
    this.tooltip.innerHTML = `
      ${text ? `<p>Path: ${text}</p>` : ``}
      ${props ? `<p>Props: ${props}</p>` : ``}
      ${imagePath ? `<p>Image Path: ${imagePath}</p>` : ``}
      ${text ? `<p class="tip">Click to go to the file</p>` : ``}
    `;
  }

  showTooltip(x, y) {
    this.tooltip.style.display = "block";
    const { offsetWidth: tooltipWidth, offsetHeight: tooltipHeight } =
      this.tooltip;

    const spaceBelow = window.innerHeight - y - 10;
    const spaceAbove = y - 10;
    const spaceRight = window.innerWidth - x - 10;
    const spaceLeft = x - 10;

    if (spaceRight >= tooltipWidth && y + tooltipHeight <= window.innerHeight) {
      this.tooltip.style.left = `${x + 10}px`;
      this.tooltip.style.top = `${y}px`;
    } else if (
      spaceLeft >= tooltipWidth &&
      y + tooltipHeight <= window.innerHeight
    ) {
      this.tooltip.style.left = `${x - tooltipWidth - 10}px`;
      this.tooltip.style.top = `${y}px`;
    } else if (spaceBelow >= tooltipHeight) {
      this.tooltip.style.left = `${x}px`;
      this.tooltip.style.top = `${y + 10}px`;
    } else if (spaceAbove >= tooltipHeight) {
      this.tooltip.style.left = `${x}px`;
      this.tooltip.style.top = `${y - tooltipHeight - 10}px`;
    } else {
      this.tooltip.style.left = `${x + 10}px`;
      this.tooltip.style.top = `${Math.min(
        y,
        window.innerHeight - tooltipHeight - 10
      )}px`;
    }
  }

  hideTooltip() {
    this.tooltip.style.display = "none";
  }

  remove() {
    if (this.wrapper) {
      this.overlay.style.opacity = "0";
      this.overlay.style.transform = "scale(0.95)";
      setTimeout(() => {
        document.body.removeChild(this.wrapper);
      }, 100);
    }
  }
}

