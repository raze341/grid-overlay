# Grid Overlay

A lightweight canvas grid overlay utility with container-aware sizing and automatic resize handling.

## Features

- 🎯 Automatic container dimension detection (respects padding and borders)
- 📐 High DPI display support (retina-ready)
- 🔄 Built-in ResizeObserver with throttling
- 🎨 Fully customizable appearance

## Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/raze341/grid-overlay@v2.0.0/grid.js"></script>
```

### Download

Download `grid.js` and include it in your project:

```html
<script src="path/to/grid.js"></script>
```

## Usage

### Basic Example

```html
<div id="container" style="width: 800px; height: 600px;">
  <canvas id="myCanvas"></canvas>
</div>

<script src="https://cdn.jsdelivr.net/gh/raze341/grid-overlay@v2.0.0/grid.js"></script>
<script>
  const canvas = document.getElementById('myCanvas');
  const grid = new Grid(canvas);
</script>
```

### Custom Options

```javascript
const canvas = document.getElementById('myCanvas');
const grid = new Grid(canvas, {
  step: 30,           // Grid cell size in pixels
  lineWidth: 1,       // Line thickness
  lineColor: '#ddd'   // Line color (any CSS color)
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
    #container {
      width: 100vw;
      height: 100vh;
      padding: 20px;
      box-sizing: border-box;
      background: #f5f5f5;
    }
  </style>
</head>
<body>
  <div id="container">
    <canvas id="grid"></canvas>
  </div>

  <script src="https://cdn.jsdelivr.net/gh/raze341/grid-overlay@v2.0.0/grid.js"></script>
  <script>
    const canvas = document.getElementById('grid');
    const grid = new Grid(canvas, {
      step: 25,
      lineColor: 'rgba(0, 0, 0, 0.1)',
      lineWidth: 0.5
    });
  </script>
</body>
</html>
```

## API

### Constructor

```javascript
new Grid(canvas, options)
```

**Parameters:**

- `canvas` (HTMLCanvasElement) - Required. The canvas element to draw on.
- `options` (Object) - Optional. Configuration options.

**Options:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `step` | Number | `20` | Grid cell size in pixels |
| `lineWidth` | Number | `1` | Line thickness |
| `lineColor` | String | `'lightgray'` | Line color (CSS color value) |

### Methods

#### `destroy()`

Disconnects the ResizeObserver and cleans up resources.

```javascript
grid.destroy();
```

## Browser Support

- Chrome/Edge 64+
- Firefox 69+
- Safari 13.1+
- Any browser with ResizeObserver support

## License

MIT License - see LICENSE file for details
