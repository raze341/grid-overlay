/**
 * Grid canvas overlay utility
 * Draws a customizable grid overlay
 */

(function (global) {
  "use strict";

  // ========================================
  // HELPER FUNCTIONS
  // ========================================
  const throttled = (fn) => {
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
  };

  /**
   * Align pixel to device pixel grid for crisp rendering
   * @param {number} pixel - Pixel coordinate
   * @param {number} lineWidth - Line width
   * @returns {number} Aligned pixel value
   */
  const snapToPixel = (pixel, lineWidth) => {
    const dpr = window.devicePixelRatio || 1;
    const halfWidth = lineWidth !== 0 ? Math.max(lineWidth / 2, 0.5) : 0;
    return Math.round((pixel - halfWidth) * dpr) / dpr + halfWidth;
  };

  // ========================================
  // DEFAULT OPTIONS
  // ========================================

  const DEFAULT_OPTIONS = {
    cellWidth: 20,
    cellHeight: 20,
    lineWidth: 1,
    lineColor: "lightgray",
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: undefined,
  };

  // ========================================
  // GRID CLASS
  // ========================================
  class Grid {
    constructor(element, userOptions = {}) {
      if (!element || !(element instanceof HTMLCanvasElement)) {
        throw new Error("Grid requires a valid canvas element");
      }

      const context = this.initCanvas(element);
      const canvas = context.canvas;

      this.canvas = canvas;
      this.ctx = context;
      this.options = { ...DEFAULT_OPTIONS, ...userOptions };
      this.observer = null;

      if (this.options.responsive) {
        this.createResizeObserver();
      } else {
        this.resizeCanvas();
      }
    }

    /**
     * Initialize canvas with proper sizing
     * @param {HTMLCanvasElement} canvas
     * @returns {CanvasRenderingContext2D}
     */
    initCanvas(canvas) {
      // Setup canvas styles
      canvas.style.display = "block";
      canvas.style.boxSizing = "border-box";

      const context = canvas.getContext("2d");
      return context;
    }

    /**
     * Get aspect ratio for canvas sizing
     * @returns {number|undefined}
     */
    getAspectRatio() {
      if (!this.options.maintainAspectRatio) {
        return undefined;
      }
      return this.options.aspectRatio;
    }

    /**
     * Calculate container size accounting for padding and borders
     * @returns {{width: number, height: number}}
     */
    getContainerSize() {
      const container = this.canvas.parentElement;

      if (!container) {
        return {
          width: this.canvas.clientWidth || 0,
          height: this.canvas.clientHeight || 0,
        };
      }

      const rect = container.getBoundingClientRect();
      const style = getComputedStyle(container);

      const paddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

      const borderX =
        parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);
      const borderY =
        parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

      const availableWidth = rect.width - paddingX - borderX;
      const availableHeight = rect.height - paddingY - borderY;

      return {
        width: Math.max(0, availableWidth),
        height: Math.max(0, availableHeight),
      };
    }

    /**
     * Calculate available size with aspect ratio constraint
     * @returns {{width: number, height: number}}
     */
    getAvailableSize() {
      const aspectRatio = this.getAspectRatio();
      const containerSize = this.getContainerSize();

      if (!aspectRatio) {
        return containerSize;
      }

      let canvasWidth = containerSize.width;
      let canvasHeight = Math.round(canvasWidth / aspectRatio);

      const maintainHeight =
        this.width !== undefined || this.height !== undefined;
      if (
        maintainHeight &&
        containerSize.height &&
        canvasHeight > containerSize.height
      ) {
        canvasHeight = containerSize.height;
        canvasWidth = Math.round(canvasHeight * aspectRatio);
      }

      return { width: canvasWidth, height: canvasHeight };
    }

    /**
     * Resize canvas to fit container
     */
    resizeCanvas() {
      const newSize = this.getAvailableSize();
      this.width = newSize.width;
      this.height = newSize.height;

      this.scaleCanvas();
      this.drawGrid();
    }

    /**
     * Scale canvas for device pixel ratio
     */
    scaleCanvas() {
      const { canvas, ctx, width, height } = this;
      const dpr = window.devicePixelRatio || 1;

      const canvasWidth = Math.round(width * dpr);
      const canvasHeight = Math.round(height * dpr);

      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    }

    /**
     * Draw grid overlay
     */
    drawGrid() {
      const { cellWidth, cellHeight, lineColor, lineWidth } = this.options;
      const { ctx, width, height } = this;

      ctx.save();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.beginPath();
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      // Horizontal lines
      for (let y = 0; y <= height; y += cellHeight) {
        const sy = snapToPixel(y, lineWidth);
        ctx.moveTo(0, sy);
        ctx.lineTo(width, sy);
      }

      // Vertical lines
      for (let x = 0; x <= width; x += cellWidth) {
        const sx = snapToPixel(x, lineWidth);
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, height);
      }

      ctx.stroke();
      ctx.restore();
    }

    /**
     * Create resize observer for responsive behavior
     */
    createResizeObserver() {
      const container = this.canvas.parentElement;
      if (!container) {
        return;
      }

      const handleResize = throttled(() => {
        this.resizeCanvas();
      });

      this.observer = new ResizeObserver(([entry]) => {
        if (!entry || !entry.contentRect) return;
        const { width, height } = entry.contentRect;
        console.log({ width, height });

        if (width === 0 && height === 0) {
          return;
        }
        handleResize();
      });

      this.observer.observe(container);
    }

    /**
     * Disconnect resize observer
     */
    releaseResizeObserver() {
      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    }

    /**
     * Cleanup and destroy grid instance
     */
    destroy() {
      this.releaseResizeObserver();

      // Clear canvas
      if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      // Clear references
      this.canvas = null;
      this.ctx = null;
    }
  }

  // Export to global scope
  global.Grid = Grid;
})(typeof window !== "undefined" ? window : this);
