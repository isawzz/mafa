onload = start

async function start() { test0(); }

async function test0() {
	let emos = M.emos = await mGetYaml('../assets/m.yaml');
	let cats = M.cats = collectCats(emos); cats.sort(); //console.log('cats', cats); 

	let d = mDom('dMain');
	mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, onDropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => event.preventDefault() });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })
	mDom(dForm, { w: 120 }, { tag: 'input', type: 'submit', className: 'input' })
	dForm.onsubmit = ev => { 
		return false; } //ev.preventDefault(); onclickUpload(ev); }

	// dForm.onsubmit = function(ev) {
	// 	console.log('haaaaaaaaaaaaaaaallloo')
	//   ev.preventDefault(); // Prevent form submission and page reload

	//   // // Get form data as JSON
	//   // var formData = new FormData(myForm);
	//   // var formDataJSON = {};
	//   // formData.forEach(function(value, key) {
	//   //     formDataJSON[key] = value;
	//   // });

	//   // Send form data via AJAX
	//   var xhr = new XMLHttpRequest();
	//   xhr.open('POST', 'your-api-endpoint', true);
	//   xhr.setRequestHeader('Content-Type', 'application/json');
	//   xhr.onreadystatechange = function() {
	//       if (xhr.readyState === 4 && xhr.status === 200) {
	//           // Handle the AJAX response here
	//           console.log(xhr.responseText);
	//       }
	//   };
	//   xhr.send(JSON.stringify(formDataJSON));
	// };


	//mClass(dDrop, 'previewContainer');
	UI.dDrop = dDrop;
	UI.dForm = dForm;
	UI.dButtons = mDom(dForm, { display: 'inline-block' });
	UI.imgCat = dl.inpElem;
	UI.imgName = inpName;

}

function loadImage(path, dParent, dButtons) {
	dParent.innerHTML = '';
	let img = UI.imgElem = mDom(dParent, { position: 'absolute', left: 0, box: true }, { tag: 'img', src: path, height: 300, className: 'previewImage' });

	img.onload = () => {
		const containerHeight = 300;
		const aspectRatio = img.width / img.height;
		const newWidth = containerHeight * aspectRatio;
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = newWidth;
		canvas.height = containerHeight;
		ctx.drawImage(img, 0, 0, newWidth, containerHeight);
		const imgData = canvas.toDataURL('image/png');
		img.src = imgData;
		img.onload = () => {
			img.onload = null;
			UI.cropper = mCropper(dParent, img);
			dButtons.innerHTML = '';
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Crop', onclick: UI.cropper.crop, className: 'input' })
			// mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Show Cropper', onclick: UI.cropper.show, className: 'input' })
			// mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Hide Cropper', onclick: UI.cropper.hide, className: 'input' })
		}
	};
	return img;
}
function onclickUpload(ev) {
	ev.preventDefault();
	evNoBubble(ev);
	//UI.dForm.addEventListener('submit',ev=>ev.preventDefault())
	let img = UI.dDrop.firstChild; console.log('img', img)
	let cat = UI.imgCat.value;
	let name = UI.imgName.value;

	if (isEmpty(cat)) cat = 'other';
	if (isEmpty(name)) name = 'img_' + new Date().getTime();
	console.log('cat', cat, 'name', name);

	//return;

	uploadImg(img, cat, name, ev)
}
function onDropPreviewImage(url) {
	UI.img = loadImage(url, UI.dDrop, UI.dButtons);

}

function uploadImg(imgElem, cat, name) {
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
			return false;
		})
		.catch(error => {
			console.error('Error uploading image:', error);
		});
		return false;
	});
	return false;
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







