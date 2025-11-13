# Project Structure

This document provides an overview of the complete project structure, including both the Android application and the web demo.

## Repository Overview

```
Real-Time-Edge-Detection/
├── app/                    # Android application source code
├── web-demo/               # Web-based demo implementation
├── docs/                   # Documentation files
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
├── README.md               # Main project documentation
├── CHANGELOG.md            # Version history
├── CONTRIBUTING.md         # Contribution guidelines
├── build.gradle.kts        # Top-level Gradle build file
├── gradle.properties       # Gradle properties
├── gradlew                 # Gradle wrapper script
├── gradlew.bat             # Gradle wrapper batch script
├── settings.gradle.kts     # Gradle settings
├── real time edge detection photo.jpg  # Demo image
└── real time edge detection video.mp4  # Demo video
```

## Android Application Structure

```
app/
├── src/
│   └── main/
│       ├── java/com/example/edgedetectionapp/
│       │   ├── MainActivity.kt          # Main activity handling UI and camera
│       │   └── gl/                      # OpenGL rendering components
│       ├── cpp/
│       │   ├── native-lib.cpp           # Native C++ edge detection implementation
│       │   └── opencv/                  # OpenCV libraries
│       ├── res/
│       │   ├── layout/
│       │   │   └── activity_main.xml    # Main layout file
│       │   ├── values/
│       │   │   └── strings.xml          # App name and other string resources
│       │   └── mipmap/                  # App icons
│       └── AndroidManifest.xml          # Application manifest
├── build.gradle.kts                     # Module-level Gradle build file
└── CMakeLists.txt                       # CMake build configuration for native code
```

## Web Demo Structure

```
web-demo/
├── index.html              # Main HTML file with UI
├── style.css               # Styling with modern gradients
├── viewer.ts               # Main TypeScript code for edge detection
├── viewer.js               # Compiled JavaScript (generated)
├── tsconfig.json           # TypeScript configuration
└── README.md               # Web demo documentation
```

## Documentation Structure

```
docs/
├── ARCHITECTURE.md         # System architecture overview
├── ALGORITHM.md            # Detailed explanation of edge detection algorithm
├── PROJECT_STRUCTURE.md    # This file
└── images/                 # Documentation images (if any)
```

## Key Files and Their Purposes

### Android Application Files

- [app/src/main/java/com/example/edgedetectionapp/MainActivity.kt](../app/src/main/java/com/example/edgedetectionapp/MainActivity.kt): Main entry point that handles UI, camera initialization, and image processing pipeline
- [app/src/main/cpp/native-lib.cpp](../app/src/main/cpp/native-lib.cpp): Native C++ implementation of the Canny edge detection algorithm
- [app/src/main/res/layout/activity_main.xml](../app/src/main/res/layout/activity_main.xml): Layout definition with dual-view display
- [app/build.gradle.kts](../app/build.gradle.kts): Gradle build configuration for the app module
- [CMakeLists.txt](../app/CMakeLists.txt): CMake configuration for building native code

### Web Demo Files

- [web-demo/index.html](../web-demo/index.html): Main HTML file with modern UI and controls
- [web-demo/style.css](../web-demo/style.css): Styling with gradients and responsive design
- [web-demo/viewer.ts](../web-demo/viewer.ts): TypeScript implementation of edge detection using OpenCV.js
- [web-demo/README.md](../web-demo/README.md): Documentation specific to the web demo

### Documentation Files

- [README.md](../README.md): Main project documentation
- [docs/ARCHITECTURE.md](ARCHITECTURE.md): Detailed system architecture
- [docs/ALGORITHM.md](ALGORITHM.md): In-depth explanation of the Canny edge detection algorithm
- [CHANGELOG.md](../CHANGELOG.md): Version history and changes
- [CONTRIBUTING.md](../CONTRIBUTING.md): Guidelines for contributing to the project

## Build and Deployment

### Android Application

The Android application uses Gradle for building:

```bash
# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# Install on connected device
./gradlew installDebug
```

### Web Demo

The web demo requires TypeScript compilation:

```bash
# Compile TypeScript to JavaScript
tsc viewer.ts

# Open index.html in a browser
```

No server is required for the web demo - it runs entirely in the browser.

## Dependencies

### Android Application

- Kotlin 1.8+
- OpenCV 4.9.0
- CameraX 1.3.1
- Android SDK 24+

### Web Demo

- OpenCV.js 4.9.0
- Modern browser with WebAssembly support

## Directory Conventions

- **app/**: Contains all Android application source code
- **web-demo/**: Contains the browser-based implementation
- **docs/**: Comprehensive project documentation
- **Root files**: Project configuration, licensing, and main documentation

This structure follows standard conventions for Android projects while also accommodating the web-based demo implementation.