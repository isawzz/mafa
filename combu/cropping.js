
function cropPreviewImage(dParent,img) {
	let [w,h]=[img.offsetWidth,img.offsetHeight];
	console.log('w',w,'h',h)
	mStyle(dParent,{w:w,h:h,position:'relative'});
	const cropBox = mDom(dDrop,{w:w,h:h},{className:'crop-box'});
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	cropBox.addEventListener('mousedown', startCrop);

	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop);
		document.addEventListener('mouseup', stopCrop);
	}

	function crop(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
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

	function cropImage() {
		const cropX = parseInt(cropBox.style.left);
		const cropY = parseInt(cropBox.style.top);
		const cropWidth = parseInt(cropBox.style.width);
		const cropHeight = parseInt(cropBox.style.height);

		const canvas = document.createElement('canvas');
		canvas.width = cropWidth;
		canvas.height = cropHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
		const croppedImageDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = croppedImageDataUrl;
		img.width = cropWidth;
		img.height = cropHeight; 
		mStyle(cropBox,{top:0,left:0});
		return croppedImageDataUrl;
	}
	function show_cropbox(){cropBox.style.display = 'block'}
	function hide_cropbox(){cropBox.style.display = 'none'}
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		elem: cropBox,
	}
}
function resizePreviewImage() {
	const dParent = document.querySelector('.dParent');
	const img = document.querySelector('.img');
	//const uploadButton = document.getElementById('uploadButton');
	const topLeftResizeHandle = document.querySelector('.resize-handle.top-left');
	const bottomRightResizeHandle = document.querySelector('.resize-handle.bottom-right');

	let isResizing = false;
	let resizeStartX;
	let resizeStartY;
	let initialWidth;
	let initialHeight;

	function startResize(e) {
		isResizing = true;
		resizeStartX = e.clientX;
		resizeStartY = e.clientY;
		initialWidth = img.offsetWidth;
		initialHeight = img.offsetHeight;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}

	function resize(e) {
		if (isResizing) {
			const width = initialWidth + (e.clientX - resizeStartX);
			const height = initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
		}
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}
	topLeftResizeHandle.addEventListener('mousedown', startResize);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);

}

