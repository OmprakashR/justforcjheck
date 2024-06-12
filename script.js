const video = document.getElementById('video');
const captureButton = document.getElementById('capture');
const fullscreenButton = document.getElementById('fullscreen');
const captureArea = document.getElementById('capture-area');

// Get access to the user's camera with high resolution
navigator.mediaDevices.getUserMedia({
    video: {
        width: { ideal: 1920 },
        height: { ideal: 1080 }
    }
})
    .then(stream => {
        video.srcObject = stream;
    })
    .catch(err => {
        console.error('Error accessing camera: ', err);
    });

// Enter fullscreen mode
fullscreenButton.addEventListener('click', () => {
    if (captureArea.requestFullscreen) {
        captureArea.requestFullscreen();
    } else if (captureArea.mozRequestFullScreen) { // Firefox
        captureArea.mozRequestFullScreen();
    } else if (captureArea.webkitRequestFullscreen) { // Chrome, Safari and Opera
        captureArea.webkitRequestFullscreen();
    } else if (captureArea.msRequestFullscreen) { // IE/Edge
        captureArea.msRequestFullscreen();
    }
});

// Capture image from the screen
captureButton.addEventListener('click', () => {
    html2canvas(captureArea, {
        scale: 2, // Increase the scale for higher resolution
        useCORS: true, // Enable CORS for external images
        width: captureArea.scrollWidth, // Set the width of the canvas
        height: captureArea.scrollHeight // Set the height of the canvas
    }).then(canvas => {
        // Convert the canvas content to a data URL (base64 encoded image)
        const imageDataURL = canvas.toDataURL('image/png', 1.0); // 1.0 for maximum quality

        // Create an image element to display the captured image
        const img = document.createElement('img');
        img.src = imageDataURL;
        console.log(img.src);
        document.body.appendChild(img);
    }).catch(err => {
        console.error('Error capturing screenshot: ', err);
    });
});
