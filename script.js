async function startVideo() {
    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const infoDiv = document.getElementById('info');
        infoDiv.innerHTML = `Camera: ${stream.getVideoTracks()[0].label || 'Unknown'}<br>`;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            resizeVideo(video);
            updateScreenInfo();
        };
        window.addEventListener('resize', () => {
            resizeVideo(video);
            updateScreenInfo();
        });
        video.addEventListener('click', captureFrame);
    } catch (error) {
        console.error('Error accessing the camera', error);
    }
}

function resizeVideo(video) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const videoRatio = video.videoWidth / video.videoHeight;
    const windowRatio = windowWidth / windowHeight;

    if (video.videoWidth > 0 && video.videoHeight > 0) {
        if (windowRatio > videoRatio) {
            // Window is wider than the video aspect ratio
            video.style.width = '100%';
            video.style.height = 'auto';
            video.style.top = `${(windowHeight - (windowWidth / videoRatio)) / 2}px`;
            video.style.left = '0';
            video.style.transform = 'translateY(0)';
        } else {
            // Window is taller than the video aspect ratio
            video.style.width = 'auto';
            video.style.height = '100%';
            video.style.top = '0';
            video.style.left = `${(windowWidth - (windowHeight * videoRatio)) / 2}px`;
            video.style.transform = 'translateX(0)';
        }
    }
}

function updateScreenInfo() {
    const infoDiv = document.getElementById('info');
    infoDiv.innerHTML += `Screen ratio: ${window.innerWidth} x ${window.innerHeight}`;
}

function captureFrame() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const videoRect = video.getBoundingClientRect();

    canvas.width = videoRect.width;
    canvas.height = videoRect.height;

    const context = canvas.getContext('2d');

    // Calculate the scaling factor and offset to ensure we only capture the visible area
    const scaleX = video.videoWidth / videoRect.width;
    const scaleY = video.videoHeight / videoRect.height;
    const scale = Math.max(scaleX, scaleY);

    const offsetX = (video.videoWidth - videoRect.width * scale) / 2;
    const offsetY = (video.videoHeight - videoRect.height * scale) / 2;

    context.drawImage(
        video,
        offsetX, offsetY, video.videoWidth - 2 * offsetX, video.videoHeight - 2 * offsetY,
        0, 0, canvas.width, canvas.height
    );

    // Convert canvas to data URL and open it in a new tab
    const dataUrl = canvas.toDataURL('image/png');
    const newTab = window.open();
    newTab.document.body.innerHTML = `<img src="${dataUrl}" alt="Captured Frame">`;
}

document.addEventListener('DOMContentLoaded', startVideo);
