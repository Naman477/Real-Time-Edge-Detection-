"use strict";
const video = document.getElementById('videoInput');
const canvasOutput = document.getElementById('outputCanvas');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const screenshotBtn = document.getElementById('screenshotBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const startPrompt = document.getElementById('startPrompt');
const threshold1Input = document.getElementById('threshold1');
const threshold2Input = document.getElementById('threshold2');
const val1Display = document.getElementById('val1');
const val2Display = document.getElementById('val2');
let stream = null;
let processingInterval = null;
let isOpenCvReady = false;
let isProcessing = false;
// Default thresholds
let threshold1 = 50;
let threshold2 = 100;
// Update threshold values from inputs
threshold1Input.addEventListener('input', (e) => {
    threshold1 = parseInt(e.target.value);
    val1Display.textContent = threshold1.toString();
});
threshold2Input.addEventListener('input', (e) => {
    threshold2 = parseInt(e.target.value);
    val2Display.textContent = threshold2.toString();
});
window.onOpenCvReady = function () {
    console.log("OpenCV Runtime is initialized.");
    isOpenCvReady = true;
    loadingOverlay.style.display = 'none'; // Hide if stuck
};
function toggleUIState(processing) {
    if (processing) {
        startPrompt.style.display = 'none';
        stopBtn.disabled = false;
        screenshotBtn.disabled = false;
        threshold1Input.disabled = false;
        threshold2Input.disabled = false;
    }
    else {
        startPrompt.style.display = 'block';
        stopBtn.disabled = true;
        screenshotBtn.disabled = true;
        // Keep sliders enabled so user can adjust before starting
    }
}
async function startCamera() {
    if (!isOpenCvReady) {
        loadingOverlay.style.display = 'flex';
        // Wait a bit just in case
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (!isOpenCvReady) {
            alert("OpenCV is loading... please wait.");
            loadingOverlay.style.display = 'none';
            return;
        }
        loadingOverlay.style.display = 'none';
    }
    if (isProcessing)
        return;
    try {
        const constraints = {
            video: {
                width: { ideal: 640 },
                height: { ideal: 480 },
                facingMode: "environment"
            },
            audio: false
        };
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        await video.play();
        waitingForVideoLoad();
    }
    catch (err) {
        console.error("Camera Error:", err);
        alert("Could not access camera. Please allow permissions.");
    }
}
function waitingForVideoLoad() {
    if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        startProcessing();
    }
    else {
        video.addEventListener('loadeddata', () => startProcessing(), { once: true });
    }
}
function startProcessing() {
    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    canvasOutput.width = videoWidth;
    canvasOutput.height = videoHeight;
    isProcessing = true;
    toggleUIState(true);
    const src = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC4);
    const dst = new cv.Mat(videoHeight, videoWidth, cv.CV_8UC1);
    const gray = new cv.Mat();
    // Create an offscreen canvas for better performance
    const offCanvas = document.createElement('canvas');
    offCanvas.width = videoWidth;
    offCanvas.height = videoHeight;
    const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });
    if (!offCtx)
        return;
    const FPS = 30;
    function processFrame() {
        if (!isProcessing || !stream) {
            src.delete();
            dst.delete();
            gray.delete();
            return;
        }
        try {
            const begin = Date.now();
            offCtx.drawImage(video, 0, 0, videoWidth, videoHeight);
            const imageData = offCtx.getImageData(0, 0, videoWidth, videoHeight);
            src.data.set(imageData.data);
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
            cv.Canny(gray, dst, threshold1, threshold2, 3, false);
            cv.imshow(canvasOutput, dst);
            const delay = Math.max(0, 1000 / FPS - (Date.now() - begin));
            processingInterval = window.setTimeout(processFrame, delay);
        }
        catch (err) {
            console.error(err);
        }
    }
    processFrame();
}
function stopCamera() {
    isProcessing = false;
    toggleUIState(false);
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
    }
    if (processingInterval) {
        clearTimeout(processingInterval);
        processingInterval = null;
    }
    // Clear canvas
    const ctx = canvasOutput.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvasOutput.width, canvasOutput.height);
    }
}
function takeScreenshot() {
    if (!isProcessing)
        return;
    // Create a temporary link
    const link = document.createElement('a');
    link.download = `edge-detection-${Date.now()}.png`;
    link.href = canvasOutput.toDataURL('image/png');
    link.click();
}
startBtn.addEventListener('click', startCamera);
stopBtn.addEventListener('click', stopCamera);
screenshotBtn.addEventListener('click', takeScreenshot);
//# sourceMappingURL=viewer.js.map