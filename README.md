# Real-Time Edge Detection

This repository contains two implementations of real-time edge detection:

1. **Android Application**: A native Android app using Kotlin, OpenCV, and CameraX
2. **Web Demo**: A browser-based implementation using OpenCV.js

<p align="center">
  <img src="real%20time%20edge%20detection%20photo.jpg" alt="Edge Detection Demo" width="600" />
</p>

<p align="center">
  <a href="real%20time%20edge%20detection%20video.mp4">View Android Demo Video</a> | 
  <a href="web-demo-working.mp4">View Web Demo Video</a>
</p>

## Android Application

An Android application that performs real-time edge detection on camera feed using OpenCV and CameraX. The app displays the original camera feed in the bottom half of the screen and the processed edge-detected image in the top half.

### Android Features

- **Real-time Edge Detection**: Processes camera feed in real-time using OpenCV's Canny edge detection algorithm
- **Dual View Display**: Shows both original camera feed and edge-detected output simultaneously
- **High Performance**: Native C++ implementation for optimal performance
- **CameraX Integration**: Uses modern CameraX APIs for robust camera handling
- **Photo & Video Support**: Capable of processing both still photos and video streams

## Technologies Used

- **Kotlin**: Primary language for Android development
- **OpenCV**: Computer vision library for edge detection algorithms
- **CameraX**: Android Jetpack library for camera operations
- **Native C++**: Performance-critical image processing implemented in C++
- **JNI**: Java Native Interface for communication between Kotlin and C++

## How It Works

1. The app captures video frames from the device camera using CameraX
2. Each frame is processed through a native C++ function that applies OpenCV's Canny edge detection algorithm
3. The processed image is converted to RGBA format and displayed in the top half of the screen
4. The original camera feed is displayed in the bottom half of the screen

### Core Algorithm

The edge detection is performed using OpenCV's Canny algorithm in the native C++ code:

```
// Apply Canny edge detection
cv::Canny(y_mat, edges_mat, 80, 100);

// Convert the grayscale edge image to a color image to be displayed
cv::cvtColor(edges_mat, output_mat, cv::COLOR_GRAY2RGBA);
```

## Prerequisites

- Android Studio with NDK support
- Android device or emulator with camera capability
- Minimum SDK level: 24 (Android 7.0)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Naman477/Real-Time-Edge-Detection-.git
   ```

2. Open the project in Android Studio

3. Build and run the application on your device or emulator

## Permissions

The app requires the following permissions:
- `CAMERA`: To access the device camera for capturing images

## Project Structure

```
app/
├── src/main/java/
│   └── com/example/edgedetectionapp/
│       ├── MainActivity.kt          # Main activity handling UI and camera
│       └── gl/                      # OpenGL rendering components
├── src/main/cpp/
│   ├── native-lib.cpp              # Native C++ edge detection implementation
│   └── opencv/                     # OpenCV libraries
└── src/main/res/
    ├── layout/
    │   └── activity_main.xml       # Main layout file
    └── values/
        └── strings.xml             # App name and other string resources
```

## Key Components

### MainActivity.kt
- Handles camera initialization using CameraX
- Manages permissions for camera access
- Sets up the image analysis use case for real-time processing
- Displays both original and processed images

### native-lib.cpp
- Implements the Canny edge detection algorithm using OpenCV
- Processes Y-plane data from camera frames
- Converts processed images to RGBA format for display

### activity_main.xml
- Defines the dual-view layout with ConstraintLayout
- Contains ImageView for processed image and PreviewView for camera feed
- Uses Guideline to split the screen evenly

## Performance Considerations

- Native C++ implementation ensures optimal performance for image processing
- CameraX's STRATEGY_KEEP_ONLY_LATEST prevents frame queuing
- Explicit resolution setting (640x480) improves emulator compatibility

## Customization

You can adjust the edge detection sensitivity by modifying the threshold values in [native-lib.cpp](app/src/main/cpp/native-lib.cpp):

```
cv::Canny(y_mat, edges_mat, 80, 100);  // Lower values = more sensitive detection
```

## Troubleshooting

1. **Camera not working**: Ensure camera permissions are granted and the app is not running in an emulator without camera support
2. **Blank screen**: Check that the device meets the minimum SDK requirements
3. **Poor performance**: Try reducing the target resolution in [MainActivity.kt](app/src/main/java/com/example/edgedetectionapp/MainActivity.kt)

## Future Enhancements

### Android App
- [ ] Add adjustable edge detection parameters through UI controls
- [ ] Implement additional OpenCV filters (Sobel, Laplacian, etc.)
- [ ] Add photo capture functionality with edge detection
- [ ] Include video recording of processed feed
- [ ] Support for front camera selection
- [ ] Real-time parameter adjustment sliders

### Web Demo
- [ ] Add parameter controls for edge detection sensitivity
- [ ] Implement additional edge detection algorithms
- [ ] Add image capture functionality
- [ ] Support for file upload processing
- [ ] Mobile optimization improvements

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Web Demo

The repository also includes a web-based demo in the [web-demo](web-demo) directory that implements the same edge detection algorithm using OpenCV.js.

### Web Demo Features

- **Browser-based**: Runs entirely in the browser with no server required
- **Interactive Controls**: Start/stop buttons for camera control
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern UI**: Gradient backgrounds and smooth animations

### Web Demo Video

<p align="center">
  <video src="web-demo-working.mp4" width="600" controls></video>
</p>

## Acknowledgments

- OpenCV community for the computer vision library
- Android CameraX team for the camera handling framework
- OpenCV.js team for the browser implementation