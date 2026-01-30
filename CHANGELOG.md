# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-14

### Added
- Initial release of Real-Time Edge Detection application
- Real-time edge detection using OpenCV's Canny algorithm
- Dual-view display showing both original camera feed and processed image
- CameraX integration for robust camera handling
- Native C++ implementation for optimal performance
- Permission management for camera access
- Responsive UI with ConstraintLayout

### Technical Details
- Kotlin implementation for Android components
- C++ native implementation for image processing
- OpenCV 4.9.0 for computer vision algorithms
- CameraX 1.3.1 for camera operations
- View Binding for type-safe view access
- CMake build system for native code

### Features
- Real-time processing of camera feed
- Simultaneous display of original and processed images
- Adjustable edge detection parameters
- Support for both front and back cameras
- Optimized memory usage through object reuse
- Cross-platform compatibility (Android 7.0+)