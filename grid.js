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
    constructor(userOptions = {}) {
      this.canvas = document.createElement("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.options = { ...DEFAULT_OPTIONS, ...userOptions };

      this.setup();
      // this.resize();
      this.observer = this.createObserver();
    }

    resize() {
      this.scale();
      this.draw();
    }

    setup() {
      this.canvas.style.position = "fixed";
      this.canvas.style.inset = 0;
      this.canvas.style.display = "block";
      this.canvas.style.boxSizing = "border-box";
      this.canvas.style.pointerEvents = "none";
      this.canvas.style.height = "100%";
      this.canvas.style.width = "100%";

      document.body.appendChild(this.canvas);
    }

    scale() {
      const canvas = this.canvas;
      const ctx = this.ctx;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      // canvas.style.width = `${rect.width}px`;
      // canvas.style.height = `${rect.height}px`;

      ctx.scale(dpr, dpr);
    }

    draw() {
      const { step, lineColor, lineWidth } = this.options;
      const canvas = this.canvas;
      const ctx = this.ctx;
      const rect = canvas.getBoundingClientRect();

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      for (let y = 0; y <= rect.height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
      }

      for (let x = 0; x <= rect.width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
      }

      ctx.stroke();

      ctx.restore();
    }

    destroy() {
      this.releaseObserver();
      this.canvas.remove();
    }

    createObserver() {
      const handleResize = throttled(() => {
        this.resize();
      });

      const observer = new ResizeObserver(() => {
        handleResize();
      });

      observer.observe(document.documentElement);
      return observer;
    }

    releaseObserver() {
      if (this.observer) {
        this.observer.disconnect();
      }
    }
  }

  global.Grid = Grid;
})(typeof window !== "undefined" ? window : this);
