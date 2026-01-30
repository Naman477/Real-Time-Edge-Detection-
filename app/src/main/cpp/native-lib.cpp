#include <jni.h>
#include <opencv2/core.hpp>
#include <opencv2/imgproc.hpp>

extern "C" JNIEXPORT void JNICALL
Java_com_example_edgedetectionapp_MainActivity_nativeProcessFrame(
        JNIEnv *env,
        jobject /* this */,
        jint width,
        jint height,
        jobject y_plane,
        jint y_row_stride,
        jlong output_mat_addr) {

    // Get the data from the JNI buffer
    auto y_buffer = static_cast<uint8_t *>(env->GetDirectBufferAddress(y_plane));

    // Create a new OpenCV Mat from the camera frame data
    cv::Mat y_mat(height, width, CV_8UC1, y_buffer, y_row_stride);
    cv::Mat edges_mat;

    // Apply Canny edge detection
    cv::Canny(y_mat, edges_mat, 80, 100);

    // Get the output Mat object
    cv::Mat &output_mat = *(cv::Mat *) output_mat_addr;

    // Convert the grayscale edge image to a color image to be displayed
    cv::cvtColor(edges_mat, output_mat, cv::COLOR_GRAY2RGBA);
}