"use strict";
function onOpenCvReady() {
    // This function is called from the HTML after OpenCV.js is loaded.
    console.log("OpenCV is ready.");
    let video = document.getElementById('videoInput');
    let outputCanvas = document.getElementById('outputCanvas');
    let context = outputCanvas.getContext('2d');
    // Request access to the webcam
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function (stream) {
        video.srcObject = stream;
        video.play();
    })
        .catch(function (err) {
        console.log("An error occurred: " + err);
    });
    // Create the OpenCV Mat objects that we will reuse in the processing loop
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let gray = new cv.Mat();
    const FPS = 30;
    function processVideo() {
        if (!context)
            return; // Add this null check
        let begin = Date.now();
        // Start processing.
        context.drawImage(video, 0, 0, outputCanvas.width, outputCanvas.height);
        src.data.set(context.getImageData(0, 0, outputCanvas.width, outputCanvas.height).data);
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.Canny(gray, dst, 50, 100, 3, false);
        cv.imshow('outputCanvas', dst); // Display the result
        // Schedule the next frame processing.
        let delay = 1000 / FPS - (Date.now() - begin);
        setTimeout(processVideo, delay);
    }
    // Schedule the first frame processing once the video is playing
    video.addEventListener('canplay', () => {
        // Set the canvas size to match the video feed
        outputCanvas.width = video.videoWidth;
        outputCanvas.height = video.videoHeight;
        setTimeout(processVideo, 0);
    });
}
