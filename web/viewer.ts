declare var cv: any; // Inform TypeScript that `cv` will be in the global scope

const video = document.getElementById('videoInput') as HTMLVideoElement;
const canvasOutput = document.getElementById('outputCanvas') as HTMLCanvasElement;
const statusMessage = document.getElementById('status-message') as HTMLParagraphElement;

/**
 * Main function to start video processing after OpenCV.js is ready.
 */
function startVideoProcessing() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
            video.srcObject = stream;
            video.play();
        })
        .catch(err => {
            console.error("ERROR: Camera access denied or not available.", err);
            statusMessage.textContent = "Camera access denied. Please allow camera access and refresh.";
        });

    const FPS = 30;
    const cap = new cv.VideoCapture(video);

    const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    const dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    const gray = new cv.Mat();

    function processFrame() {
        try {
            const begin = Date.now();
            cap.read(src);
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            cv.Canny(gray, dst, 60, 120, 3, false); // Adjusted Canny thresholds for better visuals
            cv.imshow(canvasOutput, dst);
            const delay = 1000/FPS - (Date.now() - begin);
            setTimeout(processFrame, delay);
        } catch (err) {
            console.error("An error occurred during processing: ", err);
        }
    }

    video.addEventListener('loadeddata', () => {
        canvasOutput.width = video.videoWidth;
        canvasOutput.height = video.videoHeight;
        statusMessage.textContent = "Processing...";
        setTimeout(processFrame, 0);
    });
}

/**
 * Official and reliable way to wait for OpenCV.js to be ready.
 */
function checkOpenCvReady() {
  if (cv.onRuntimeInitialized) {
    statusMessage.textContent = "OpenCV is ready. Starting camera...";
    startVideoProcessing();
  } else {
    setTimeout(checkOpenCvReady, 50);
  }
}

// Start the check
checkOpenCvReady();
