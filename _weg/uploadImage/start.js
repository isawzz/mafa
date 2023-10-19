var dropArea = document.getElementById('dropArea');
var responseDiv = document.getElementById('response');
var imgData = null;

function loadImage(src) {
	return new Promise(function (resolve, reject) {
		var img = new Image();
		img.onload = function () {
			resolve(img);
		};
		img.onerror = function () {
			reject(new Error('Failed to load image'));
		};
		img.src = src;
	});

}

function resizeImage(img, h = 300) {

	// Create a canvas element
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	// Calculate new width and height while maintaining the aspect ratio
	var aspectRatio = img.width / img.height;
	var newHeight = h;
	var newWidth = newHeight * aspectRatio;

	// Set canvas dimensions to the new size
	canvas.width = newWidth;
	canvas.height = newHeight;

	// Draw the image onto the canvas with the new dimensions
	ctx.drawImage(img, 0, 0, newWidth, newHeight);
	return canvas.toDataURL('image/jpeg'); // You can change the format if needed
}
async function readerOnLoad(ev) {
	let reader = ev.target;
	var img = await loadImage(reader.result);
	var resizedImageData = resizeImage(img, 300);
	return resizedImageData;
}
function onClickUpload() {
	// Create a FormData object and append the resized image data
	var formData = new FormData();
	formData.append('uploadedFile', resizedImageData);

	// Send the FormData object via fetch without reloading the page
	fetch('http://localhost:3000/upload', {
		method: 'POST',
		body: formData
	})
		.then(response => response.text())
		.then(data => {
			responseDiv.innerText = data;
		})
		.catch(error => {
			console.error('Error:', error);
		});
}
function displayDroppedImageResized(ev) {
	let reader = ev.target;
	var imgElement = document.createElement('img');
	imgElement.src = reader.result;
	imgElement.style.maxWidth = '100%';
	dropArea.innerHTML = '';
	dropArea.appendChild(imgElement);
}
function displayDroppedImage(ev) {
	let reader = ev.target;
	var img = document.createElement('img');
	img.src = reader.result;
	img.style.maxWidth = '100%';

	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');
	var aspectRatio = img.width / img.height;
	var newHeight = 300;
	var newWidth = newHeight * aspectRatio;
	canvas.width = newWidth;
	canvas.height = newHeight;
	ctx.drawImage(img, 0, 0, newWidth, newHeight);


	dropArea.innerHTML = '';
	dropArea.appendChild(img);

	console.log('img',img);
	imgData = resizeImage(img, 300);
	console.log('SUCCESS!!!');
	//console.log('imgData',imgData)

}
function onDragOver(ev) { event.preventDefault(); dropArea.style.borderColor = 'blue'; }
function onDragLeave(ev) { dropArea.style.borderColor = '#ccc'; }
async function onDrop(ev) {
	console.log('hallooooooooooooooo')
	event.preventDefault();
	dropArea.style.borderColor = '#ccc';
	var files = event.dataTransfer.files;
	if (files.length > 0) {
		var reader = new FileReader();
		reader.onload = displayDroppedImage;
		reader.readAsDataURL(files[0]);
	}
}


function uploadImage() {
	// Create a FormData object and append the resized image data
	var formData = new FormData();
	formData.append('uploadedFile', resizedImageData);

	// Send the FormData object via fetch without reloading the page
	fetch('http://localhost:3000/upload', {
		method: 'POST',
		body: formData
	})
		.then(response => response.text())
		.then(data => {
			responseDiv.innerText = data;
		})
		.catch(error => {
			console.error('Error:', error);
		});
	//var imgData = async ev=>await readerOnLoad(ev);
	// reader.onload = displayDroppedImage;
}

dropArea.addEventListener('dragover', onDragOver);
dropArea.addEventListener('dragleave', onDragLeave);
dropArea.addEventListener('drop', onDrop);