/**
 * Grid canvas overlay utility
 * Draws a customizable grid overlay
 */

(function (global) {
  "use strict";

  function throttled(fn) {
    let running = false;
    let lastArgs;

    return function (...args) {
      lastArgs = args;
      if (!running) {
        running = true;
        requestAnimationFrame(() => {
          running = false;
          fn.apply(this, lastArgs);
        });
      }
    };
  }

  const DEFAULT_OPTIONS = {
    step: 20,
    lineWidth: 1,
    lineColor: "lightgray",
  };

  class Grid {
    constructor(canvas, userOptions = {}) {
      if (!canvas || !(canvas instanceof HTMLCanvasElement)) {
        throw new Error("Grid requires a valid canvas element");
      }

      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.options = { ...DEFAULT_OPTIONS, ...userOptions };
      this.observer = null;

      this.setup();
      this.resize();
      this.createResizeObserver();
    }

    getAvailableSize() {
      const container = this.canvas.parentElement;

      if (!container) {
        return {
          width: this.canvas.clientWidth || 0,
          height: this.canvas.clientHeight || 0,
        };
      }

      const rect = container.getBoundingClientRect();
      const style = getComputedStyle(container);

      const padding = {
        top: parseFloat(style.paddingTop) || 0,
        left: parseFloat(style.paddingLeft) || 0,
        bottom: parseFloat(style.paddingBottom) || 0,
        right: parseFloat(style.paddingRight) || 0,
      };

      const border = {
        top: parseFloat(style.borderTopWidth) || 0,
        left: parseFloat(style.borderLeftWidth) || 0,
        bottom: parseFloat(style.borderBottomWidth) || 0,
        right: parseFloat(style.borderRightWidth) || 0,
      };

      const availableWidth =
        rect.width - padding.left - padding.right - border.left - border.right;
      const availableHeight =
        rect.height - padding.top - padding.bottom - border.top - border.bottom;

      return {
        width: Math.max(0, availableWidth),
        height: Math.max(0, availableHeight),
      };
    }

    resize() {
      const newSize = this.getAvailableSize();
      this.width = newSize.width;
      this.height = newSize.height;
      this.scale();
      this.draw();
    }

    setup() {
      this.canvas.style.display = "block";
      this.canvas.style.boxSizing = "border-box";
      this.canvas.style.pointerEvents = "none";
    }

    scale() {
      const canvas = this.canvas;
      const ctx = this.ctx;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(this.width * dpr);
      canvas.height = Math.round(this.height * dpr);

      canvas.style.width = `${this.width}px`;
      canvas.style.height = `${this.height}px`;

      ctx.scale(dpr, dpr);
    }

    draw() {
      const { step, lineColor, lineWidth } = this.options;
      const ctx = this.ctx;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      for (let y = 0; y <= this.height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(this.width, y);
      }

      for (let x = 0; x <= this.width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.height);
      }

      ctx.stroke();
      ctx.restore();
    }

    createResizeObserver() {
      const container = this.canvas.parentElement;

      const handleResize = throttled(() => {
        this.resize();
      });

      this.observer = new ResizeObserver(() => {
        handleResize();
      });

      this.observer.observe(container);
    }

    releaseResizeObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }

    destroy() {
      this.releaseResizeObserver();
    }
  }

  global.Grid = Grid;
})(typeof window !== "undefined" ? window : this);
