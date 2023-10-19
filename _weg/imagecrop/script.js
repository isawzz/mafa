const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const uploadButton = document.getElementById('uploadButton');
const topLeftResizeHandle = document.querySelector('.resize-handle.top-left');
const bottomRightResizeHandle = document.querySelector('.resize-handle.bottom-right');

let isResizing = false;
let resizeStartX;
let resizeStartY;
let initialWidth;
let initialHeight;

topLeftResizeHandle.addEventListener('mousedown', startResize);
bottomRightResizeHandle.addEventListener('mousedown', startResize);

function startResize(e) {
    isResizing = true;
    resizeStartX = e.clientX;
    resizeStartY = e.clientY;
    initialWidth = previewImage.offsetWidth;
    initialHeight = previewImage.offsetHeight;
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
}

function resize(e) {
    if (isResizing) {
        const width = initialWidth + (e.clientX - resizeStartX);
        const height = initialHeight + (e.clientY - resizeStartY);
        previewImage.style.width = `${width}px`;
        previewImage.style.height = `${height}px`;
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
}

uploadButton.addEventListener('click', uploadImage);

function uploadImage() {
    // ... (same as previous code)
}
