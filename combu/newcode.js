//=>integrate with allfhuge.js
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
function collectCats(di) {
	let cats = [];
	for (const k in di) di[k].cats.map(x => addIf(cats, x));
	return cats;
}
function mCropper(dParent, img) {
	let [w, h] = [img.offsetWidth, img.offsetHeight]; 
	console.log('w', w, 'h', h);
	console.log('dParent',dParent)
	mStyle(dParent, { w: w, h: h, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: w, h: h }, { className: 'crop-box' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	cropBox.addEventListener('mousedown', startCrop);

	function restart(){
		stopCrop();
		mStyle(cropBox,{left:0,top:0,w:w,h:h});
	}
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
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			cropBox.style.width = `${width}px`;
			cropBox.style.left = `${left}px`;
			cropBox.style.height = `${height}px`; //erlaubt nur width cropping!
			cropBox.style.top = `${top}px`;
		}
	}
	function cropX(e) {
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
	function cropCenter(e) {
    e.preventDefault();
    if (isCropping) {
        const mouseX = e.clientX - dParent.offsetLeft;
        const mouseY = e.clientY - dParent.offsetTop;
        const radiusX = Math.abs(mouseX - cropStartX);
        const radiusY = Math.abs(mouseY - cropStartY);
        const centerX = cropStartX; // (mouseX + cropStartX) / 2;
        const centerY = cropStartY; //(mouseY + cropStartY) / 2;
        
        const width = radiusX * 2;
        const height = radiusY * 2;
        const left = centerX - radiusX;
        const top = centerY - radiusY;
        
        cropBox.style.width = `${width}px`;
        cropBox.style.height = `${height}px`;
        cropBox.style.left = `${left}px`;
        cropBox.style.top = `${top}px`;
    }
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x,y,w,h]=['left','top','width','height'].map(x=>parseInt(cropBox.style[x]));
		console.log('x,y,w,h',x,y,w,h);
		let canvas = mDom(null,{},{tag:'canvas',width:w,height:h});
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(img,{position:'absolute',top:0,left:0,w:w,h:h});
		mStyle(cropBox, { display:'none' }); //top: 0, left: img.offsetLeft });
		return imgDataUrl;
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		cropX: cropX,
		cropCenter:cropCenter,
		restart:restart,
		elem: cropBox,
	}
}
function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, edit: true, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'input', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;

	inp.setAttribute('list', optid);
	// console.log('datalist',elem,inp,datalist)

	function update() {
		let val = valf(inp.value, '');
		if (isEmpty(val)) return;
		if (mylist.includes(val)) return;
		mylist.push(val);
		if (opts.alpha) mylist.sort();
		let i = mylist.indexOf(val);
		//if (opts.alpha) addIfAlpha(mylist,val); else addIf(mylist,val);
		inp.value = ''; //clear input
		if (opts.filter == 'contains') { let el = mDom(datalist, {}, { tag: 'option', value: val }); mInsertAt(datalist, el, i) }
		else populate();
	}
	function populate() {
		//if (isdef(datalist.firstChild) && opts.filter == 'contains') return;
		let val = valf(inp.value, ''); val = val.toLowerCase();
		datalist.innerHTML = '';
		//console.log('datalist',datalist)
		let filteredList = isEmpty(val) ? mylist : mylist.filter(x => opts.matches(x, val));
		//console.log('filtered',filteredList)
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	populate();

	if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	if (isdef(opts.matches)) inp.addEventListener('input', populate);

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		populate: populate,

	}
}
function mDropZone(dropZone, onDrop) {
	//const dropZone = document.getElementById('dropZone');

	dropZone.addEventListener('dragover', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #007bff';
	});

	dropZone.addEventListener('dragleave', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
	});

	dropZone.addEventListener('drop', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
		const files = event.dataTransfer.files;

		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = ev => {
				onDrop(ev.target.result);
				// const img = new Image();
				// img.src = ev.target.result;
				// img.height = 300;
				// img.alt = 'Dropped Image';
				// mClass(img,'previewImage');
				// dropZone.innerHTML = '';
				// dropZone.appendChild(img);
				// UI.cropper = createCropper(dropZone, img);
				// mStyle(img,{top:0,left:0})
				// console.log('cropper',UI.cropper)
			};

			reader.readAsDataURL(files[0]);
		}
	});
	return dropZone;
}
async function mGetFiles(server, dir) {
	let data = await mGetJsonCors(`${server}/filenames?directory=${dir}`);
	return data.files;
}
async function mGetJsonCors(url) {
	let res = await fetch(url, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	});
	let json = await res.json();
	console.log('json', json)
	return json;
}
async function resizeImage(img, newHeight) {
	return new Promise((resolve, reject) => {
		console.log('resizing...')
		const aspectRatio = img.width / img.height;
		const newWidth = aspectRatio * newHeight;
		const canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const resizedDataURL = canvas.toDataURL('image/png');
		img.onload = function () { let data = { message: 'hallo' }; console.log('data', data); resolve(data); };
		img.onerror = function (error) { console.log('error', error); reject(error); };
		img.src = resizedDataURL;
	});
}
async function srcToDataUrl(src, h) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
		img.onload = function () {
			// Calculate new width and height while preserving aspect ratio
			let aspectRatio, newWidth, newHeight;
			if (isdef(h)) {
				aspectRatio = img.width / img.height;
				newHeight = h;
				newWidth = aspectRatio * newHeight;
			} else {
				newHeight = img.height;
				newWidth = img.width;
			}
			const canvas = document.createElement('canvas');
			canvas.width = newWidth;
			canvas.height = newHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, newWidth, newHeight);
			const dataUrl = canvas.toDataURL('image/png');
			resolve(dataUrl);
		};
		img.onerror = function (error) {
			reject(error);
		};
		img.src = src;
	});
}
async function uploadImg(img, cat, name) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			const formData = new FormData();
			formData.append('image', blob, name + '.png');
			formData.append('category', cat);

			try {
				const response = await fetch('http://localhost:3000/upload', {
					method: 'POST',
					mode: 'cors',
					body: formData
				});

				if (response.ok) {
					const data = await response.json();
					//console.log('Image uploaded successfully:', data);
					resolve(data);
				} else {
					// Handle non-ok response status
					//console.error('Error uploading image:', response.statusText);
					reject(response.statusText);
				}


				// const data = await response.json();
				// console.log('Image uploaded successfully:', data);
				// resolve(data);
			} catch (error) {
				console.error('Error uploading image:', error);
				reject(error);
			}
		});
	});
}
