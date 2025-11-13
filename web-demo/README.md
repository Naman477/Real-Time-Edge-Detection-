# Web-Based Edge Detection Demo

A web-based real-time edge detection application using OpenCV.js. This demo processes your camera feed in real-time using the Canny edge detection algorithm.

## Features

- Real-time edge detection using OpenCV.js
- Interactive controls to start/stop camera
- Responsive design that works on desktop and mobile
- No server required - runs entirely in the browser
- Modern UI with gradient backgrounds and smooth animations

## How It Works

1. The application accesses your camera (with your permission)
2. Each video frame is processed using OpenCV's Canny edge detection algorithm
3. The processed image is displayed in real-time on the canvas

## Technologies Used

- **OpenCV.js**: JavaScript version of OpenCV for computer vision
- **TypeScript**: Typed superset of JavaScript for better code quality
- **HTML5**: Modern web standards for media capture
- **CSS3**: Advanced styling with gradients and animations

## Setup

1. Clone or download this repository
2. Open `index.html` in a modern web browser
3. Allow camera access when prompted
4. View the edge detection in real-time!

## Browser Compatibility

This demo requires a modern browser with the following features:
- getUserMedia API for camera access
- Canvas API for image rendering
- WebGL support for OpenCV.js

Tested browsers:
- Chrome 70+
- Firefox 60+
- Safari 12+
- Edge 79+

## Customization

You can adjust the edge detection parameters in [viewer.ts](viewer.ts):

```typescript
cv.Canny(gray, dst, 50, 100, 3, false);
```

The parameters are:
- `gray`: Input grayscale image
- `dst`: Output edge image
- `50`: First threshold for hysteresis procedure
- `100`: Second threshold for hysteresis procedure
- `3`: Aperture size for Sobel operator
- `false`: L2 gradient flag

## Project Structure

```
web-demo/
├── index.html          # Main HTML file
├── style.css           # Styling
├── viewer.ts           # Main TypeScript code
├── viewer.js           # Compiled JavaScript (generated)
└── tsconfig.json       # TypeScript configuration
```

## Development

To modify the TypeScript code:

1. Make changes to [viewer.ts](viewer.ts)
2. Compile with: `tsc viewer.ts`
3. Open `index.html` to test

## Security Notes

- All processing happens locally in your browser
- No video data is sent to any server
- Camera access is only used for real-time processing
- You can revoke camera permissions at any time in your browser settings

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.