async function startVideo() {
    try {
        const video = document.getElementById('video');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            resizeVideo(video);
        };
        window.addEventListener('resize', () => resizeVideo(video));
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
            const offset = (windowHeight - (windowWidth / videoRatio)) / 2;
            video.style.top = `${offset}px`;
            video.style.left = '0';
            video.style.transform = 'translateY(0)'; // Reset centering
        } else {
            // Window is taller than the video aspect ratio
            video.style.width = 'auto';
            video.style.height = '100%';
            const offset = (windowWidth - (windowHeight * videoRatio)) / 2;
            video.style.top = '0';
            video.style.left = `${offset}px`;
            video.style.transform = 'translateX(0)'; // Reset centering
        }
    }
}

function captureFrame() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const videoRect = video.getBoundingClientRect();

    canvas.width = videoRect.width;
    canvas.height = videoRect.height;

    const context = canvas.getContext('2d');
    context.drawImage(video, videoRect.left, videoRect.top, videoRect.width, videoRect.height, 0, 0, videoRect.width, videoRect.height);

    // Convert canvas to data URL and open it in a new tab
    const dataUrl = canvas.toDataURL('image/png');
    const newTab = window.open();
    newTab.document.body.innerHTML = `<img src="${dataUrl}" alt="Captured Frame">`;
}

document.addEventListener('DOMContentLoaded', startVideo);
