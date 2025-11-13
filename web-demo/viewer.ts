declare var cv: any; // Inform TypeScript that `cv` will be in the global scope

const video = document.getElementById('videoInput') as HTMLVideoElement;
const canvasOutput = document.getElementById('outputCanvas') as HTMLCanvasElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;

let stream: MediaStream | null = null;
let processingInterval: number | null = null;

/**
 * Start the camera and begin processing
 */
function startCamera() {
    console.log("Starting camera...");

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            video.play();
            processVideo();
        })
        .catch(err => {
            console.error("ERROR: Camera access denied or not available.", err);
            alert("Camera access denied. Please allow camera access in your browser settings and refresh the page.");
        });
}

/**
 * Stop the camera and processing
 */
function stopCamera() {
    console.log("Stopping camera...");
    
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stream = null;
    }
    
    if (processingInterval) {
        clearInterval(processingInterval);
        processingInterval = null;
    }
    
    // Clear the canvas
    const ctx = canvasOutput.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvasOutput.width, canvasOutput.height);
    }
}

/**
 * Process video frames for edge detection
 */
function processVideo() {
    const FPS = 30;
    const cap = new cv.VideoCapture(video);

    // Allocate Mat objects once and reuse them in the loop
    const src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    const dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    const gray = new cv.Mat();

    function processFrame() {
        try {
            if (!stream) return; // Stop processing if stream is null

            const begin = Date.now();

            // Capture a frame from the video feed
            cap.read(src);
            
            // Perform Canny edge detection
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            cv.Canny(gray, dst, 50, 100, 3, false);
            
            // Display the result on the canvas
            cv.imshow(canvasOutput, dst);

            // Schedule the next frame processing
            const delay = Math.max(0, 1000/FPS - (Date.now() - begin));
            processingInterval = window.setTimeout(processFrame, delay);

        } catch (err) {
            console.error("An error occurred during processing: ", err);
        }
    }

    // Match canvas dimensions to the video once it's ready
    video.addEventListener('loadeddata', () => {
        console.log("Video data loaded, starting processing loop.");
        canvasOutput.width = video.videoWidth;
        canvasOutput.height = video.videoHeight;
        processFrame();
    });
}

// Add event listeners to buttons
startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);

/**
 * This is the official and most reliable way to wait for OpenCV.js to be ready.
 * It checks for the `cv.onRuntimeInitialized` property and calls our main function once it's set.
 */
function checkOpenCvReady() {
  if (cv.onRuntimeInitialized) {
    console.log("OpenCV Runtime is initialized.");
    // Auto-start camera when OpenCV is ready
    startCamera();
  } else {
    setTimeout(checkOpenCvReady, 50); // Wait 50ms and check again
  }
}

// Start the check
checkOpenCvReady();

/**
 * This is the official and most reliable way to wait for OpenCV.js to be ready.
 * It checks for the `cv.onRuntimeInitialized` property and calls our main function once it's set.
 */
function checkOpenCvReady() {
  if (cv.onRuntimeInitialized) {
    console.log("OpenCV Runtime is initialized.");
    startVideoProcessing();
  } else {
    setTimeout(checkOpenCvReady, 50); // Wait 50ms and check again
  }
}

// Start the check
checkOpenCvReady();
