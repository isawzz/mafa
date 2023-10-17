
function makeCropper(previewContainer,previewImage) {
	let [w,h]=[previewImage.offsetWidth,previewImage.offsetHeight];
	console.log('w',w,'h',h)
	mStyle(previewContainer,{w:w,h:h,position:'relative'});
	const cropBox = mDom(previewContainer,{w:w,h:h},{className:'crop-box'}); // document.querySelector('.crop-box');
	let isCropping = false;
	let cropStartX;
	let cropStartY;
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
		//ctx.drawImage(previewImage, cropX, cropY, cropWidth, cropHeight, cropX, cropY, cropWidth, cropHeight);

		// Now you have the cropped image in the canvas element (ctx).
		// You can convert it to data URL or Blob and upload it as needed.
		// Example to convert to data URL:
		const croppedImageDataUrl = canvas.toDataURL('image/jpeg'); // Change format as needed

		// TODO: Handle the cropped image data (croppedImageDataUrl).
		//console.log('Cropped Image Data URL:', croppedImageDataUrl);
		previewImage.src = croppedImageDataUrl;
		//cropBox.style.display = 'none';
		previewImage.width = cropWidth;
		previewImage.height = cropHeight; //'100px';
		//console.log('w,h',cropWidth,cropHeight);

		// Hide the crop box after cropping
		//reset_cropbox();
		return croppedImageDataUrl;
	}
	function show_cropbox(){cropBox.style.display = 'block'}
	function hide_cropbox(){cropBox.style.display = 'none'}
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,

	}

}
function cropPreviewImage(previewContainer,previewImage) {
	// const previewContainer = document.getElementById('previewContainer');
	// const previewImage = document.getElementById('previewImage');
	let [w,h]=[previewImage.offsetWidth,previewImage.offsetHeight];
	console.log('w',w,'h',h)
	mStyle(previewContainer,{w:w,h:h,position:'relative'});
	const cropBox = mDom(dDrop,{w:w,h:h},{className:'crop-box'}); // document.querySelector('.crop-box');
	// const cropButton = mButton('send',cropImage,'dMain');// document.getElementById('cropButton');

	let isCropping = false;
	let cropStartX;
	let cropStartY;
	//cropBox.style.width = `${previewImage.offsetWidth}px`;
	//cropBox.style.height = `${previewImage.offsetHeight}px`;

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

	//cropButton.addEventListener('click', cropImage);

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
		//ctx.drawImage(previewImage, cropX, cropY, cropWidth, cropHeight, cropX, cropY, cropWidth, cropHeight);

		// Now you have the cropped image in the canvas element (ctx).
		// You can convert it to data URL or Blob and upload it as needed.
		// Example to convert to data URL:
		const croppedImageDataUrl = canvas.toDataURL('image/jpeg'); // Change format as needed

		// TODO: Handle the cropped image data (croppedImageDataUrl).
		//console.log('Cropped Image Data URL:', croppedImageDataUrl);
		previewImage.src = croppedImageDataUrl;
		//cropBox.style.display = 'none';
		previewImage.width = cropWidth;
		previewImage.height = cropHeight; //'100px';
		//console.log('w,h',cropWidth,cropHeight);

		// Hide the crop box after cropping
		//reset_cropbox();
		return croppedImageDataUrl;
	}
	function reset_cropbox() {
		cropBox.style.top = cropBox.style.left = '0px';
		cropBox.style.width = '100%'; // '0px';
		cropBox.style.height = '100%'; // '0px';

		// You can also handle the croppedImageDataUrl as needed (e.g., upload it to a server).
		//console.log('Cropped Image Data URL:', croppedImageDataUrl);    
	}
	function show_cropbox(){cropBox.style.display = 'block'}
	function hide_cropbox(){cropBox.style.display = 'none'}
	//hide_cropbox();
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,

	}

}
function resizePreviewImage() {
	const previewContainer = document.querySelector('.previewContainer');
	const previewImage = document.querySelector('.previewImage');
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
	topLeftResizeHandle.addEventListener('mousedown', startResize);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);

}

//uploadButton.addEventListener('click', onclickUpload);

