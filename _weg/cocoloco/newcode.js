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
	console.log('w', w, 'h', h)
	mStyle(dParent, { w: w, h: h, position: 'relative' });
	const cropBox = mDom(dParent, { w: w, h: h }, { className: 'crop-box' });
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
		mStyle(cropBox, { top: 0, left: 0 });
		return croppedImageDataUrl;
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	return {
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
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
function uploadImage(imgElem, cat, name, ev) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		formData.append('name', name);
		let url = `http://localhost:3000/upload`; //TODO: SERVERNAME!!!
		fetch(url, {
			method: 'POST',
			mode: 'cors',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				ev.preventDefault();
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}
function uploadImage(imgElem, cat, name, ev) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);

	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		formData.append('name', name);
		let url = `http://localhost:3000/upload`; //TODO: SERVERNAME!!!

		// Send form data via AJAX
		// var xhr = new XMLHttpRequest();
		// xhr.open('POST', url, true);
		// xhr.setRequestHeader('Content-Type', 'application/json');
		// xhr.withCredentials = false; //das ist cors
		// xhr.onreadystatechange = function () {
		// 	if (xhr.readyState === 4 && xhr.status === 200) {
		// 		// Handle the AJAX response here
		// 		console.log(xhr.responseText);
		// 	}
		// };
		// xhr.send(JSON.stringify(formData));

		// Send form data via fetch
		fetch(url, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			mode: 'cors',
			body: formData
		})
			.then(response => response.json())
			.then(data => {
				ev.preventDefault();
				console.log('Image uploaded successfully:', data);
			})
			.catch(error => {
				console.error('Error uploading image:', error);
			});
	});
}