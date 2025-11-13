# Architecture Overview

## System Components

### 1. Android Application (Kotlin)
The main Android application is built using Kotlin and follows Android best practices:

- **MainActivity.kt**: Main entry point handling UI, camera initialization, and image processing pipeline
- **CameraX Integration**: Uses modern CameraX APIs for robust camera handling
- **View Binding**: Utilizes Android's View Binding for type-safe view access
- **Permission Management**: Handles camera permissions dynamically

### 2. Native Processing (C++)
Performance-critical image processing is implemented in C++ using OpenCV:

- **native-lib.cpp**: Implements Canny edge detection algorithm
- **JNI Interface**: Bridges Kotlin and C++ code
- **Memory Optimization**: Reuses Mat objects to minimize allocations

### 3. OpenCV Library
Computer vision algorithms are provided by OpenCV 4.9.0:

- **Canny Edge Detection**: Primary algorithm for edge detection
- **Color Space Conversion**: Converts between different color formats
- **Image Processing**: Various image manipulation functions

## Data Flow

1. Camera captures video frames using CameraX
2. Frames are processed through ImageAnalysis use case
3. Y-plane data is extracted from each frame
4. Data is passed to native C++ function via JNI
5. OpenCV applies Canny edge detection algorithm
6. Processed image is converted to RGBA format
7. Result is displayed in the upper half of the screen
8. Original feed is displayed in the lower half

## Project Structure

```
app/
├── src/main/
│   ├── java/com/example/edgedetectionapp/
│   │   ├── MainActivity.kt
│   │   └── gl/
│   ├── cpp/
│   │   ├── native-lib.cpp
│   │   └── opencv/
│   ├── res/
│   │   ├── layout/
│   │   ├── values/
│   │   └── mipmap/
│   └── AndroidManifest.xml
├── build.gradle.kts
└── CMakeLists.txt
```

## Performance Considerations

### Memory Management
- Native C++ implementation minimizes garbage collection
- Pre-allocated Mat objects reused for each frame
- Direct buffer access avoids unnecessary copying

### Processing Efficiency
- Y-plane extraction reduces data transfer
- Fixed resolution (640x480) balances quality and performance
- CameraX's STRATEGY_KEEP_ONLY_LATEST prevents frame queuing

### Concurrency
- Single-thread executor for image analysis
- UI updates scheduled on main thread
- Asynchronous camera initialization