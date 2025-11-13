# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

cmake_minimum_required(VERSION 3.22.1)

project("edgedetectionapp")

# Set the OpenCV_DIR variable to the path containing OpenCVConfig.cmake
# This path is based on the screenshot you provided.
set(OpenCV_DIR ${CMAKE_SOURCE_DIR}/opencv/sdk/native/jni)

# Find the OpenCV package
find_package(OpenCV REQUIRED)

# Include the OpenCV headers
include_directories(${OpenCV_INCLUDE_DIRS})

add_library(${CMAKE_PROJECT_NAME} SHARED
        native-lib.cpp)

target_link_libraries(${CMAKE_PROJECT_NAME}
        android
        log
        ${OpenCV_LIBS})