declare var cv: any; // Inform TypeScript that `cv` will be in the global scope

const video = document.getElementById('videoInput') as HTMLVideoElement;
const canvasOutput = document.getElementById('outputCanvas') as HTMLCanvasElement;
const startBtn = document.getElementById('startBtn') as HTMLButtonElement;
const stopBtn = document.getElementById('stopBtn') as HTMLButtonElement;

let stream: MediaStream | null = null;
let processingInterval: number | null = null;
let isOpenCvReady = false;
let isProcessing = false;

// Expose onOpenCvReady to global scope early
(window as any).onOpenCvReady = function() {
    console.log("OpenCV Runtime is initialized.");
    isOpenCvReady = true;
    console.log("OpenCV ready. Click 'Start Camera' to begin.");
};

/**
 * Start the camera and begin processing
 */
function startCamera() {
    console.log("Starting camera...");
    
    // Check if OpenCV is ready
    if (!isOpenCvReady) {
        console.log("OpenCV not ready yet, showing alert");
        alert("OpenCV is still loading. Please wait a moment and try again.");
        return;
    }
    
    // If already processing, don't start again
    if (isProcessing) {
        console.log("Already processing, ignoring start request");
        return;
    }

    navigator.mediaDevices.getUserMedia({ 
        video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: "environment" // Try to use back camera if available
        }, 
        audio: false 
    })
        .then(mediaStream => {
            stream = mediaStream;
            video.srcObject = stream;
            video.play();
            
            // Set up processing when video is ready
            video.addEventListener('loadeddata', () => {
                console.log("Video data loaded, setting canvas dimensions");
                canvasOutput.width = video.videoWidth || 640;
                canvasOutput.height = video.videoHeight || 480;
                processVideo();
            }, { once: true });
        })
        .catch(err => {
            console.error("ERROR: Camera access denied or not available.", err);
            // Try again without facingMode constraint
            navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: { ideal: 640 }, 
                    height: { ideal: 480 }
                }, 
                audio: false 
            })
            .then(mediaStream => {
                stream = mediaStream;
                video.srcObject = stream;
                video.play();
                
                video.addEventListener('loadeddata', () => {
                    console.log("Video data loaded, setting canvas dimensions");
                    canvasOutput.width = video.videoWidth || 640;
                    canvasOutput.height = video.videoHeight || 480;
                    processVideo();
                }, { once: true });
            })
            .catch(err => {
                console.error("ERROR: Camera access denied or not available (fallback failed).", err);
                alert("Camera access denied. Please allow camera access in your browser settings and refresh the page.");
            });
        });
}

/**
 * Stop the camera and processing
 */
function stopCamera() {
    console.log("Stopping camera...");
    isProcessing = false;
    
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stream = null;
    }
    
    if (processingInterval) {
        clearInterval(processingInterval);
        processingInterval = null;
    }
    
    // Clear the canvas with black
    const ctx = canvasOutput.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvasOutput.width, canvasOutput.height);
    }
}

/**
 * Process video frames for edge detection using OpenCV.js
 * This approach uses canvas-based image processing instead of VideoCapture
 */
function processVideo() {
    if (!isOpenCvReady || !stream) {
        console.log("Not ready for processing, waiting...");
        setTimeout(processVideo, 100);
        return;
    }
    
    const FPS = 30;
    
    // Use video dimensions or fallback to 640x480
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    
    console.log(`Initializing processing with dimensions: ${videoWidth}x${videoHeight}`);
    
    try {
        // Ensure OpenCV is fully ready
        if (typeof cv === 'undefined') {
            console.log("OpenCV not ready yet, waiting...");
            setTimeout(processVideo, 100);
            return;
        }
        
        // Create canvas context for capturing video frames
        const canvasElement = document.createElement('canvas');
        const canvasCtx = canvasElement.getContext('2d');
        if (!canvasCtx) {
            console.error("Could not create canvas context");
            return;
        }
        
        // Set canvas dimensions
        canvasElement.width = videoWidth;
        canvasElement.height = videoHeight;
        
        // Allocate Mat objects once and reuse them in the loop
        const src = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
        const dst = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
        const gray = new cv.Mat();
        
        isProcessing = true;
        
        function processFrame() {
            try {
                // Check if we should still be processing
                if (!isProcessing || !stream) {
                    console.log("Processing stopped");
                    return;
                }
                
                // Check if video is actually playing
                if (video.paused || video.ended) {
                    console.log("Video not playing, waiting...");
                    processingInterval = window.setTimeout(processFrame, 100);
                    return;
                }
                
                const begin = Date.now();
                
                // Draw video frame to canvas (with null check)
                if (canvasCtx) {
                    canvasCtx.drawImage(video, 0, 0, videoWidth, videoHeight);
                    
                    // Get image data from canvas
                    const imageData = canvasCtx.getImageData(0, 0, videoWidth, videoHeight);
                    
                    // Put image data into OpenCV Mat
                    src.data.set(imageData.data);
                    
                    // Perform Canny edge detection
                    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
                    cv.Canny(gray, dst, 50, 100, 3, false);
                    
                    // Display the result on the canvas
                    cv.imshow(canvasOutput, dst);
                }
                
                // Schedule the next frame processing
                const delay = Math.max(0, 1000/FPS - (Date.now() - begin));
                processingInterval = window.setTimeout(processFrame, delay);
                
            } catch (err) {
                console.error("An error occurred during frame processing: ", err);
                // Continue processing next frame despite errors
                processingInterval = window.setTimeout(processFrame, 1000/FPS);
            }
        }
        
        console.log("Starting processing loop.");
        processFrame();
        
    } catch (err) {
        console.error("An error occurred during processing initialization: ", err);
        // Try again in a moment
        setTimeout(processVideo, 1000);
    }
}

// Add event listeners to buttons
startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);

// Log when script is loaded
console.log("Viewer script loaded and ready");