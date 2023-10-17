onload = start

async function start() { test0(); }

async function test0() {
	let emos = M.emos = await mGetYaml('../assets/m.yaml');
	let cats = M.cats = collectCats(emos); cats.sort(); //console.log('cats', cats); 

	let d = mDom('dMain');
	mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => event.preventDefault() });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })
	mDom(dForm, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })

	//mClass(dDrop, 'previewContainer');
	UI.dDrop = dDrop;
	UI.dForm = dForm;
	UI.imgCat = dl.inpElem;
	UI.imgName = inpName;

	UI.img = loadImage('../combu/katzen.png', dDrop, dForm);
}
function loadImage(path, dParent, dButtons) {

	//let dParent = UI.dDrop;

	// let img = new Image();	img.src = path;
	let img = UI.imgElem = mDom(dParent, { position: 'absolute', left: 0, box:true }, { tag: 'img', src: path, height: 300, className: 'previewImage' });
	

	img.onload = () => {
		img.onload = null;
		let image = img;
		const containerHeight = 300; //document.getElementById('container').clientHeight; // Get container height
		const aspectRatio = image.width / image.height; // Calculate aspect ratio

		// Calculate new width based on container height
		const newWidth = containerHeight * aspectRatio;

		// Create a canvas element
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		// Set canvas dimensions to resized image dimensions
		canvas.width = newWidth;
		canvas.height = containerHeight;

		// Draw the resized image on the canvas
		ctx.drawImage(image, 0, 0, newWidth, containerHeight);

		const imgData = canvas.toDataURL('image/png');
		image.src = imgData;
		image.onload = () => {
			image.onload = null;
			// mAppend(dParent, image); //canvas);
			// document.getElementById('container').appendChild(canvas);
			UI.cropper = cropPreviewImage(dParent, image);
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Crop', onclick: UI.cropper.crop, className: 'input' })
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Show Cropper', onclick: UI.cropper.show, className: 'input' })
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Hide Cropper', onclick: UI.cropper.hide, className: 'input' })
		}

	};
	return img;

}
function _loadImage(path, dParent, dButtons) {

	//console.log('img',UI.imgElem)
	UI.imgElem = mDom(dParent, { position: 'absolute', left: 0 }, { tag: 'img', src: path, height: 300, className: 'previewImage' });
	//mDom(dParent,{},{className:"resize-handle top-left"});
	//mDom(dParent,{},{className:"resize-handle bottom-right"});
	//resizePreviewImage();
	UI.imgElem.onload = () => {
		let img = UI.imgElem;
		img.onload = null;
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		img.width = w;
		img.height = h;
		mStyle(img, { w: w, h: h });
		UI.cropper = cropPreviewImage(dParent, img);
		mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Show Cropper', onclick: UI.cropper.show, className: 'input' })
		mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Crop', onclick: UI.cropper.crop, className: 'input' })
	}

	//mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Cancel', onclick: onclickUpload, className: 'input' })


}
function onclickUpload(ev) {
	let img = UI.dDrop.firstChild; console.log('img', img)
	let cat = UI.imgCat.value;
	let name = UI.imgName.value;

	if (isEmpty(cat)) cat = 'other';
	if (isEmpty(name)) name = 'img_' + new Date().getTime();
	console.log('cat', cat, 'name', name);

	//let img = 
	uploadImage(img, cat, name)
}

function uploadImage(imgElem, cat, name) {
	// Create a canvas element
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;

	// Get 2D rendering context
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

	// Convert canvas content to Blob
	canvas.toBlob((blob) => {
		// Create a FormData object and append the Blob
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		formData.append('name', name);

		//#region copied
		// var resp = await fetch(url, {
		// 	method: 'POST',
		// 	mode: 'cors',
		// 	headers: h,
		// 	body: formData,
		// });
		//#endregion


		// Send the FormData to the server using fetch
		let url = `http://localhost:3000/upload`;
		fetch(url, { //'/upload', {
			method: 'POST',
			mode: 'cors',
			// headers: h,
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}





function arrInsertAt(arr, x, i) {
	arr.splice(i, 0, x);
	return arr;
}
function addIfAlpha(arr, val) {
	console.log('arr', arr, 'val', val)
	let i = 0;
	for (const v of arr) {
		if (v == val) { break; } //console.log('found val', v); break; }
		else if (v > val) { arrInsertAt(arr, val, i); break; }
		else if (i == arr.length - 1) arr.push(val);
		i++;
	}
	console.log('i', i, 'len', arr.length, arr)
	return i;
}



function mForm(dParent, listOfInputs = [], styles = {}, opts = {}) {
	dParent = toElem(dParent);
	addKeys({ tag: 'form' }, opts);
	let dForm = mDom(dParent, styles, opts);
	for (const o of listOfInputs) {
		if (isString(o)) {
			let dLabel = mDom(dForm, {}, { tag: 'span', html: o + ':' });
			mDom(dForm, {}, { tag: 'br' });
			let dInput = mDom(dForm, {}, { tag: 'input', name: o, type: 'text' });
			mDom(dForm, {}, { tag: 'br' });
			mDom(dForm, {}, { tag: 'br' });
		} else {
			addKeys({ tag: 'input', type: 'text', html: valf(o.label, 'value') }, o);
			if (isdef(o.label)) {
				let dLabel = mDom(dForm, {}, { tag: 'span', html: o.label + ':' });
				mDom(dForm, {}, { tag: 'br' });
			}
			if (o.tag == 'select') {
				let d = mSelect(dForm, o.options);
			} else {
				let d = mDom(dForm, {}, { tag: 'input', name: o.html, type: o.type });
			}
			mDom(dForm, {}, { tag: 'br' });
			mDom(dForm, {}, { tag: 'br' });
		}
	}
	return dForm;
}







