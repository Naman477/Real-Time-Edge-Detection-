# Edge Detection Algorithm

## Canny Edge Detection

The application uses the Canny edge detection algorithm, which is a multi-stage algorithm that detects a wide range of edges in images. It was developed by John F. Canny in 1986.

### Stages of Canny Edge Detection

1. **Noise Reduction**: Since edge detection is susceptible to noise, the first step is to remove noise using a Gaussian filter.

2. **Finding Intensity Gradient**: The smoothed image is then filtered with a Sobel kernel in both horizontal and vertical directions to get the first derivative in both directions. From these two images, we can find the edge gradient and direction for each pixel.

3. **Non-maximum Suppression**: After getting the gradient magnitude and direction, a full scan of the image is done to remove any unwanted pixels which may not constitute the edge. For this, we check every pixel for being a local maximum in its neighborhood in the direction of the gradient.

4. **Hysteresis Thresholding**: This stage decides which are all edges are really edges and which are not. For this, we need two threshold values, minVal and maxVal. Any edges with intensity gradient more than maxVal are sure to be edges and those below minVal are sure to be non-edges. Those who lie between these two thresholds are classified as edges or non-edges based on their connectivity.

### Implementation Details

In our implementation, we use OpenCV's `cv::Canny()` function:

```cpp
cv::Canny(y_mat, edges_mat, 80, 100);
```

Where:
- `y_mat`: Input single-channel grayscale image
- `edges_mat`: Output edge map
- `80`: First threshold for the hysteresis procedure
- `100`: Second threshold for the hysteresis procedure

### Parameter Tuning

The two thresholds (80 and 100) can be adjusted to achieve different sensitivity levels:
- **Lower values**: More sensitive detection, may detect more noise as edges
- **Higher values**: Less sensitive detection, may miss faint edges

The ratio between the thresholds is also important:
- Typically, the higher threshold is 2-3 times the lower threshold
- This ratio affects the edge linking process in hysteresis thresholding

### Color Space Conversion

After edge detection, we convert the grayscale edge image to RGBA format for display:

```cpp
cv::cvtColor(edges_mat, output_mat, cv::COLOR_GRAY2RGBA);
```

This conversion is necessary because the Android ImageView expects a color image for display.