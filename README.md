# Grid Overlay

A lightweight, feature-rich canvas grid overlay utility with container-aware sizing, aspect ratio support, and crisp rendering on all displays.

## Features

- 🎯 **Flexible Grid Cells** - Support for both square and non-square grid cells
- 📐 **Aspect Ratio Control** - Maintain canvas proportions automatically
- 🔄 **Responsive by Default** - Auto-resize with container changes
- ✨ **Pixel-Perfect Rendering** - Crisp lines on all displays including Retina/4K
- 🎨 **Customizable Appearance** - Full control over colors, sizes, and styles
- 🪶 **Lightweight** - ~3KB minified
- 🚀 **Zero Dependencies** - Pure vanilla JavaScript

## Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/raze341/grid-overlay@v2.0.1/grid.js"></script>
```

### Download

Download `grid.js` and include it in your project:

```html
<script src="path/to/grid.js"></script>
```

## Quick Start

```html
<div id="container" style="width: 800px; height: 600px;">
  <canvas id="myCanvas"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/gh/raze341/grid-overlay@v2.0.1/grid.js"></script>
<script>
  const canvas = document.getElementById('myCanvas');
  const grid = new Grid(canvas);
</script>
```

## Usage Examples

### Basic Grid

```javascript
const canvas = document.getElementById('myCanvas');
const grid = new Grid(canvas);
```

### Custom Cell Size

```javascript
const grid = new Grid(canvas, {
  cellWidth: 30,
  cellHeight: 30,
  lineColor: '#e0e0e0',
  lineWidth: 1
});
```

### Non-Square Grid Cells

```javascript
const grid = new Grid(canvas, {
  cellWidth: 40,   // Wider cells
  cellHeight: 20   // Shorter cells
});
```

### Maintain Aspect Ratio

```javascript
const grid = new Grid(canvas, {
  maintainAspectRatio: true,
  aspectRatio: 16 / 9  // Widescreen ratio
});
```

### Non-Responsive (Manual Control)

```javascript
const grid = new Grid(canvas, {
  responsive: false
});

// Manually trigger resize when needed
window.addEventListener('resize', () => {
  grid.resize();
});
```

### Update Grid Dynamically

```javascript
// Change grid appearance on the fly
grid.updateOptions({
  cellWidth: 50,
  cellHeight: 50,
  lineColor: 'rgba(255, 0, 0, 0.3)',
  lineWidth: 2
});
```

### Full Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Grid Overlay Example</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: system-ui, sans-serif;
    }
    
    #container {
      width: 100%;
      max-width: 1200px;
      height: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 2px solid #ccc;
      box-sizing: border-box;
      background: #f9f9f9;
    }
    
    canvas {
      background: white;
    }
  </style>
</head>
<body>
  <h1>Grid Overlay Demo</h1>
  
  <div id="container">
    <canvas id="grid"></canvas>
  </div>

  <script src="https://cdn.jsdelivr.net/gh/raze341/grid-overlay@v2.0.1/grid.js"></script>
  <script>
    const canvas = document.getElementById('grid');
    const grid = new Grid(canvas, {
      cellWidth: 25,
      cellHeight: 25,
      lineColor: 'rgba(0, 0, 0, 0.1)',
      lineWidth: 1,
      maintainAspectRatio: true,
      aspectRatio: 16 / 9
    });
  </script>
</body>
</html>
```

## API Reference

### Constructor

```javascript
new Grid(canvas, options)
```

**Parameters:**

- `canvas` (HTMLCanvasElement) - **Required**. The canvas element to draw the grid on.
- `options` (Object) - Optional. Configuration options (see below).

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cellWidth` | Number | `20` | Grid cell width in pixels |
| `cellHeight` | Number | `20` | Grid cell height in pixels |
| `lineWidth` | Number | `1` | Line thickness in pixels |
| `lineColor` | String | `'lightgray'` | Line color (any CSS color value) |
| `responsive` | Boolean | `true` | Enable automatic resizing on container changes |
| `maintainAspectRatio` | Boolean | `false` | Lock canvas to a specific aspect ratio |
| `aspectRatio` | Number | `undefined` | Aspect ratio as width/height (e.g., `16/9`, `4/3`) |

### Methods

#### `resize()`

Manually trigger a resize. Useful when `responsive: false`.

```javascript
grid.resize();
```

#### `destroy()`

Clean up resources and disconnect observers.

```javascript
grid.destroy();
```

## Browser Support

- Chrome/Edge 64+
- Firefox 69+
- Safari 13.1+
- Any browser with ResizeObserver support

## Performance

Grid Overlay is optimized for performance:

- Uses `requestAnimationFrame` for smooth resizing
- Throttles resize events to prevent excessive redraws
- Leverages device pixel ratio for crisp rendering
- Minimal DOM manipulation

## Troubleshooting

### Blurry lines

This is automatically handled, but ensure you're not applying CSS transforms that cause blur:

```css
/* Avoid */
canvas {
  transform: scale(1.5);
}
```

### Grid not resizing

If using `responsive: false`, you must call `resize()` manually:

```javascript
const grid = new Grid(canvas, { responsive: false });

window.addEventListener('resize', () => {
  grid.resize();
});
```

## License

MIT License - see LICENSE file for details
