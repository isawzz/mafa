const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const cropBox = document.querySelector('.crop-box');
const cropButton = document.getElementById('cropButton');

let isCropping = false;
let cropStartX;
let cropStartY;
cropBox.style.width = `${previewImage.offsetWidth}px`;
cropBox.style.height = `${previewImage.offsetHeight}px`;

cropBox.addEventListener('mousedown', startCrop);

function startCrop(e) {
    //console.log('HALLO!!!')
    e.preventDefault();
    isCropping = true;
    cropStartX = e.clientX - previewContainer.offsetLeft;
    cropStartY = e.clientY - previewContainer.offsetTop;
    document.addEventListener('mousemove', crop);
    document.addEventListener('mouseup', stopCrop);
}

function crop(e) {
    e.preventDefault();
    if (isCropping) {

        //console.log('yes')
        const mouseX = e.clientX - previewContainer.offsetLeft;
        const mouseY = e.clientY - previewContainer.offsetTop;

        const width = Math.abs(mouseX - cropStartX);
        const height = 300; //Math.abs(mouseY - cropStartY);
        const left = Math.min(mouseX, cropStartX);
        const top = 0; //Math.min(mouseY, cropStartY);

        cropBox.style.width = `${width}px`;
        cropBox.style.left = `${left}px`;
        cropBox.style.height = `${height}px`; //erlaubt nur width cropping!
        cropBox.style.top = `${top}px`;
    }
}

function stopCrop() {
    isCropping = false;
    document.removeEventListener('mousemove', crop);
    document.removeEventListener('mouseup', stopCrop);
}

cropButton.addEventListener('click', cropImage);

function cropImage() {
    const cropX = parseInt(cropBox.style.left);
    const cropY = parseInt(cropBox.style.top);
    const cropWidth = parseInt(cropBox.style.width);
    const cropHeight = parseInt(cropBox.style.height);

    const canvas = document.createElement('canvas');

    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(previewImage, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

    // Now you have the cropped image in the canvas element (ctx).
    // You can convert it to data URL or Blob and upload it as needed.
    // Example to convert to data URL:
    const croppedImageDataUrl = canvas.toDataURL('image/jpeg'); // Change format as needed

    // TODO: Handle the cropped image data (croppedImageDataUrl).
    //console.log('Cropped Image Data URL:', croppedImageDataUrl);
    previewImage.src = croppedImageDataUrl;
    cropBox.style.display = 'none';
    previewImage.width = cropWidth;
    previewImage.height = cropHeight; //'100px';
    //console.log('w,h',cropWidth,cropHeight);

    // Hide the crop box after cropping
    //reset_cropbox();
}
function reset_cropbox() {
    cropBox.style.top = cropBox.style.left = '0px';
    cropBox.style.width = '100%'; // '0px';
    cropBox.style.height = '100%'; // '0px';

    // You can also handle the croppedImageDataUrl as needed (e.g., upload it to a server).
    //console.log('Cropped Image Data URL:', croppedImageDataUrl);    
}
