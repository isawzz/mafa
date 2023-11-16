
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
function addToolX(cropper, d) {
	//let dButtons = cropper.dButtons;
	let img = cropper.img;

	function createCropTool() {
		let rg = mRadioGroup(d, {}, 'rSizes', 'Select crop area: '); mClass(rg, 'input');
		let handler = cropper.setSize;
		mRadio('manual', [0, 0], 'rSizes', rg, {}, handler, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, handler, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, handler, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, handler, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, handler, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, handler, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
		}
		mDom(rg, { fz: 14, margin: 12 }, { html: '(or use mouse to select)' });
		return rg;
	}
	function createSquareTool() {
		let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
		let handler = x => squareTo(cropper, x);
		mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
		for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
			mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
		}
		return rg;
	}
	let rgCrop = createCropTool();
	let rgResize = createSquareTool();
}
function collectCats(klist) {
	let cats = [];
	for (const k of klist) {
		M.superdi[k].cats.map(x => addIf(cats, x));
	}
	return cats;
}
function collectionAddEmpty(ev){ //val,inp){
	if (ev.key != 'Enter') return;
	console.log('onupdate',ev.target,ev.target.value); 
	let val = ev.target.value;
	addIf(M.collections,val);
	M.collections.sort()
	//M.collections.push(val);
	M.byCollection[val] = [];
	initCollection(val);
}
function cropTo(tool, wnew, hnew) {
	//calc center
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
	let xnew = x + (wnew - w) / 2;
	let ynew = y + (hnew - h) / 2;
	redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function filenameToObject(fname, path, cats) {
	let parts = fname.split('.');
	if (parts.length != 2) console.log('file', path, fname, 'wrong name');
	let [k, ext] = parts;
	let o = { key: k, ext: ext, cats: cats, path: `${path}/${fname}`, img: fname, friendly: k.replace(/[^a-zA-Z]/g, '') };
	return o;
}
function filterImages(ev) {
	//s can be interpreted as cat or part of key
	//erstmal nur als cat
	//wenn da nix ist, dann als part of key
	let s = ev.target.value.toLowerCase().trim();
	if (isEmpty(s)) return;
	//let list = M.masterKeys.filter(x=>M.superdibyCat[s];

	let di = {};
	for (const k of M.masterKeys) {
		di[k] = true;
	}
	let list = isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];

	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k of M.masterKeys) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.includes(s)) list.push(k);
		}
		if (isEmpty(list)) return; //list = Object.keys(M.superdi);
	}
	M.keys = list;
	M.index = 0;
	showImageBatch(0);

}
//#region fleetingMessage
function clearFleetingMessage() {
	if (isdef(dFleetingMessage)) {
		dFleetingMessage.remove();
		dFleetingMessage = null;
	}
}
function showFleetingMessage(msg, dParent, styles = {}, ms = 3000, msDelay = 0, fade = true) {
	clearFleetingMessage();

	dFleetingMessage = mDiv(dParent);
	if (msDelay) {
		TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), msDelay);
	} else {
		TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), 10);
	}
}
function mFleetingMessage(msg, styles, ms, fade) {
	if (isString(msg)) {
		dFleetingMessage.innerHTML = msg;
		mStyle(dFleetingMessage, styles);
	} else {
		mAppend(dFleetingMessage, msg);
	}
	if (fade) Animation1 = mAnimate(dFleetingMessage, 'opacity', [1, .4, 0], null, ms, 'ease-in', 0, 'both');
	return dFleetingMessage;
}
//#endregion
function formatDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

	return `${day}_${month}_${year}`;
}
function generateEventId(tsDay, tsCreated) { return `${rLetter()}_${tsDay}_${tsCreated}`; }
function getMouseCoordinates(event) {
	const image = event.target; //const image = document.getElementById('your-image-id'); // Replace with the actual ID of your image element
	//const imageRect = image.getBoundingClientRect();
	const offsetX = event.clientX +
		(window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft) -
		12; //imageRect.left;
	const offsetY = event.clientY +
		(window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop) -
		124; //imageRect.top;

	return { x: offsetX, y: offsetY };
}
async function imgAsync(dParent,styles,opts) {
	let path = opts.src;
	delete opts.src;
	
  return new Promise((resolve, reject) => {
		const img = mDom(dParent,styles,opts);
    // const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = path;
  });
}
function imgToDataUrl(img){
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	return dataUrl;
}
function isSameDate(date1, date2) {
	return date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate();
}
async function loadCollections() {
	if (nundef(M.emos)) {
		let type = detectSessionType();
		let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
		let emos = await mGetYaml('../assets/m.yaml');
		let amanda = await mGetFiles(server, '../assets/img/amanda')
		let airport = await mGetFiles(server, '../assets/img/airport');
		let animals = await mGetAnimals(server);

		let di = animals;
		for (const k in emos) {
			let o = emos[k];
			let onew = { key: k, friendly: k };
			addKeys(o, onew);
			if (isdef(o.img)) { onew.path = '../assets/img/emo/' + o.img; onew.ext = stringAfter(o.img, '.'); }
			di[k] = onew;
		}
		for (const fname of amanda) {
			let o = filenameToObject(fname, '../assets/img/amanda', ['art', 'amanda']);
			if (isdef(di[o.key])) console.log('ACHTUNG!!! duplicate', o.key)
			di[o.key] = o;
		}
		for (const fname of airport) {
			let o = filenameToObject(fname, '../assets/img/airport', ['wallpaper', 'airport']);
			if (isdef(di[o.key])) console.log('ACHTUNG!!! duplicate', o.key)
			di[o.key] = o;
		}
		let superdi = sortKeysAlphabetically(di);

		M.superdi = {};
		for (const k in superdi) {
			let o = {};
			addKeys(superdi[k], o);
			M.superdi[k] = o;
		}

		//downloadAsYaml(M.superdi,'superdi');

		//indexing superdi!
		let bycat = {}, byfriendly = {};
		for (const k in superdi) {
			let o = superdi[k];
			lookupAddIfToList(byfriendly, [o.friendly], o.key);
			o.cats.map(x => lookupAddIfToList(bycat, [x], o.key));
		}

		M.byCat = sortKeysAlphabetically(bycat);
		M.byFriendly = sortKeysAlphabetically(byfriendly);
		M.names = Object.keys(M.byFriendly);
		M.categories = Object.keys(M.byCat);

		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}
	return M;
}
function mCropper(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	//console.log('w', worig, 'h', horig);
	//console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;

	function addCropTool(dParent, img, setSizeFunc) {
		let d = dParent;
		let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
		mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
		return rg;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
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
			setRect(left, top, width, height);
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
			setRect(left, top, width, height);
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
			setRect(left, top, width, height);
		}
	}
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		//console.log('x,y,w,h', x, y, w, h);
		let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
		img.src = imgDataUrl;
		img.width = w;
		img.height = h;
		mStyle(dParent, { w: w, h: h });
		setRect(0, 0, w, h);
		return imgDataUrl;
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('new rect',left,top,width,height,width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		//console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}


	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	var tool = addCropTool(dButtons, img, setSize);
	var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		button: button,
		crop: cropImage,
		elem: cropBox,
		messageBox: messageBox,
		img: img,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		tool: tool,
	}
}
function mCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });

	let sz = 16;
	const centerBox = mDom(cropBox, { bg: 'red', w: sz, h: sz, rounding: '50%', position: 'absolute' });
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	let isResizing = null;
	let resizeStartW;
	let resizeStartH;
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		[resizeStartW, resizeStartH] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)];
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0, 0, newWidth, newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		let [wnew, hnew] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)]
		redrawImage(img, dParent, 0, 0, resizeStartW, resizeStartH, wnew, hnew, () => setRect(0, 0, wnew, hnew))
	}

	function addCropTool(dParent, img, setSizeFunc) {
		let d = dParent;
		let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
		mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
		let [w, h] = [img.offsetWidth, img.offsetHeight];
		if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w / .7];
			let [w2, h2] = [h * .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else {
			//card portrait kann man auch machen: take das das nicht passt
			let [w1, h1] = [w, w * .7];
			let [w2, h2] = [h / .7, h];
			if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
			else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		}
		mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
		return rg;
	}
	function startCrop(e) {
		e.preventDefault();
		isCropping = true;
		cropStartX = e.clientX - dParent.offsetLeft;
		cropStartY = e.clientY - dParent.offsetTop;
		document.addEventListener('mousemove', crop); //cropCenter);
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
			setRect(left, top, width, height);
		}
	}
	//#region unused
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
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
			setRect(left, top, width, height);
		}
	}
	//#endregion
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		//messageBox.innerHTML = `size: ${width} x ${height}`;
		messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('________\nsetRect',left,top,width,height,'\ncenter',width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		//console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}

	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);

	setRect(0, 0, worig, horig);
	cropBox.addEventListener('mousedown', startCrop);
	var tool = addCropTool(dButtons, img, setSize);
	var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		button: button,
		crop: cropImage,
		elem: cropBox,
		messageBox: messageBox,
		img: img,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		tool: tool,
	}
}
function mCropResizePan(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black', cursor: 'move' });

	let sz = 16;
	const centerBox = mDom(cropBox, { bg: 'red', w: sz, h: sz, rounding: '50%', position: 'absolute' });
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });

	//#region resize
	let isResizing = null;
	let resizeStartW;
	let resizeStartH;
	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		[resizeStartW, resizeStartH] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)];
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0, 0, newWidth, newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		let [wnew, hnew] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)]
		redrawImage(img, dParent, 0, 0, resizeStartW, resizeStartH, wnew, hnew, () => setRect(0, 0, wnew, hnew))
	}
	function resizeTo(wnew, hnew) {
		if (hnew == 0) hnew = img.height;
		if (wnew == 0) {
			let aspectRatio = img.width / img.height;
			wnew = aspectRatio * hnew;
		}
		redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
	}
	//#endregion resize

	//#region crop
	let isCropping = false;
	let cropStartX;
	let cropStartY;
	function startCrop(ev) {
		ev.preventDefault();
		isCropping = true;
		// cropStartX = ev.clientX - dParent.offsetLeft;
		// cropStartY = ev.clientY - dParent.offsetTop;
		let pt = getMouseCoordinates(ev); //get_mouse_pos(ev,dParent); //getMouseCoordinates(ev);
		[cropStartX, cropStartY] = [pt.x, pt.y - 24];
		//console.log('pt', pt, cropStartX, cropStartY);
		document.addEventListener('mousemove', crop); //cropCenter);
		document.addEventListener('mouseup', stopCrop);
	}
	function crop(ev) {
		ev.preventDefault();
		if (isCropping) {
			evNoBubble(ev);
			// const mouseX = ev.clientX - dParent.offsetLeft;
			// const mouseY = ev.clientY - dParent.offsetTop;
			let pt = getMouseCoordinates(ev); //get_mouse_pos(ev,dParent); //getMouseCoordinates(ev);
			let [mouseX, mouseY] = [pt.x, pt.y];
			//console.log('pt', pt, mouseX, mouseY);
			const width = Math.abs(mouseX - cropStartX);
			const height = Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
		}
	}
	//#region unused
	function cropX(e) {
		e.preventDefault();
		if (isCropping) {
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			const width = Math.abs(mouseX - cropStartX);
			const height = 300; //Math.abs(mouseY - cropStartY);
			const left = Math.min(mouseX, cropStartX);
			const top = 0; //Math.min(mouseY, cropStartY);
			setRect(left, top, width, height);
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
			setRect(left, top, width, height);
		}
	}
	//#endregion
	function stopCrop() {
		isCropping = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
	}
	function cropImage() {
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))
	}
	function cropTo(wnew, hnew) {
		//calc center
		let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		let xnew = x + (wnew - w) / 2;
		let ynew = y + (hnew - h) / 2;
		redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
	}
	//#endregion crop

	//#region pan
	let isPanning = false;
	let panStartX;
	let panStartY;
	let cboxX;
	let cboxY;
	function startPan(e) {
		e.preventDefault(); evNoBubble(e);
		isPanning = true;
		panStartX = e.clientX - dParent.offsetLeft;
		panStartY = e.clientY - dParent.offsetTop;
		cboxX = parseInt(cropBox.style.left)
		cboxY = parseInt(cropBox.style.top)

		document.addEventListener('mousemove', pan); //cropCenter);
		document.addEventListener('mouseup', stopPan);
	}
	function pan(e) {
		e.preventDefault();
		if (isPanning) {
			evNoBubble(e);
			const mouseX = e.clientX - dParent.offsetLeft;
			const mouseY = e.clientY - dParent.offsetTop;
			let diffX = panStartX - mouseX;
			let diffY = panStartY - mouseY;
			const left = cboxX - diffX
			const top = cboxY - diffY
			setRect(left, top, parseInt(cropBox.style.width), parseInt(cropBox.style.height));
		}
	}
	function stopPan() {
		isPanning = false;
		document.removeEventListener('mousemove', crop);
		document.removeEventListener('mouseup', stopCrop);
		// let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
		// redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))
	}
	//#endregion pan

	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		//messageBox.innerHTML = `size: ${width} x ${height}`;
		messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('________\nsetRect',left,top,width,height,'\ncenter',width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		//console.log('old rect', x, y, w, h, cx, cy);

		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];


		setRect(xnew, ynew, wnew, hnew);

	}

	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);
	cropBox.addEventListener('mousedown', startCrop);
	messageBox.addEventListener('mousedown', startPan);

	setRect(0, 0, worig, horig);
	//console.log('DIMS', worig, horig)
	//var tool = addToolX(dButtons, img, setSize);
	//var button = mButton('Crop', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		//button: button,
		cropBox: cropBox,
		dParent: dParent,
		elem: cropBox,
		img: img,
		messageBox: messageBox,
		//tool: tool,
		crop: cropImage,
		getRect: getRect,
		hide: hide_cropbox,
		resizeTo: resizeTo,
		setRect: setRect,
		setSize: setSize,
		show: show_cropbox,

	}
}
function mDatalist(dParent, list, opts = {}) {
	//the variant w/ update and matches is in CODE.js!
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, filter: 'contains' }, opts); 

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {w:200}, { tag: 'input', className: 'input', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }

	inp.setAttribute('list', optid);

	if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate); 
	inp.onmousedown = () => inp.value = ''

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
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
function measureHeight(d) { let d2 = mDiv(d, { opacity: 0 }, null, 'HALLO'); return d2.clientHeight; }
function mFlexLine(d, bg = 'white', fg = 'contrast') {
	mStyle(d, { bg: bg, fg: fg, display: 'flex', valign: 'center', hmin: measureHeight(d) });
	mDiv(d, { fg: 'transparent' }, null, '|')
}
async function mGetAnimals(server = 'http://localhost:3000') {
	let dir = "../assets/img/animals";
	let dirs = await mGetFiles(server, dir);
	let di = {};
	for (const subdir of dirs) {
		let path = `${dir}/${subdir}`;
		let files = await mGetFiles(server, path);
		for (const fname of files) {
			let o = filenameToObject(fname, path, ['animals', subdir]);
			di[o.key] = o;
		}
	}
	return di;
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
	//console.log('json', json)
	return json;
}
function mResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black' });
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });

	let isResizing = null;

	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		if (!isResizing) return;
		e.preventDefault(); evNoBubble(e);
		let newWidth, newHeight;
		if (isResizing == 'w') {
			newWidth = e.clientX;
			newHeight = img.height;
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
		} else if (isResizing == 'wh') {
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, cropBox, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		resizeImage(img, parseInt(cropBox.style.height))
	}
	function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
	function setRect(left, top, width, height) {
		mStyle(cropBox, { left: left, top: top, w: width, h: height });
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		//console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];
		let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
		setRect(xnew, ynew, wnew, hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0, 0, worig, horig);
	wHandle.addEventListener('mousedown', startResize);
	hHandle.addEventListener('mousedown', startResize);
	whHandle.addEventListener('mousedown', startResize);
	//var tool = addResizeTool(dButtons,img,setSize);
	// var button = mButton('Resize', cropImage, tool, { w: 120, maleft: 12 }, 'input');

	return {
		//button: button,
		//crop: cropImage,
		elem: cropBox,
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		setSize: setSize,
		//tool: tool,
	}
}
function redrawImage(img, dParent, x, y, wold, hold, w, h, callback) {
	//console.log('ausschnitt:', x, y, wold, hold);
	let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, x, y, wold, hold, 0, 0, w, h);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

	img.onload = () => {
		img.onload = null;
		img.width = w;
		img.height = h;
		mStyle(img, { w: w, h: h });
		mStyle(dParent, { w: w, h: h });
		callback(); //setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;

}
async function resizeImage(img, newHeight) {
	return new Promise((resolve, reject) => {
		//console.log('resizing...')
		const aspectRatio = img.width / img.height;
		const newWidth = aspectRatio * newHeight;
		const canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const resizedDataURL = canvas.toDataURL('image/png');
		img.onload = function () {
			img.onload = null;

			let data = { message: 'hallo' };
			resolve(data);
		};
		img.onerror = function (error) { console.log('error', error); reject(error); };
		img.src = resizedDataURL;
	});
}
function resizeTo(tool, wnew, hnew) {
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	if (hnew == 0) hnew = img.height;
	if (wnew == 0) {
		let aspectRatio = img.width / img.height;
		wnew = aspectRatio * hnew;
	}
	redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function showImage(key, dParent, styles = {}) {
	let o = M.superdi[key];
	try {
		addKeys({ bg: rColor() }, styles);
		mClear(dParent);
		let [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
		let [sz, fz] = [.9 * w, .8 * h];
		let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', overflow: 'hidden' });
		mCenterCenterFlex(d1)
		let el = null;
		if (isdef(o.img)) {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
			// let img = mDom(d1, { cursor: 'pointer', w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
			// img.onclick = async () => { await onclickAdd(); ondropPreviewImage(o.path, key); };

		}
		else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
		else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
		else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });

		assertion(el, 'PROBLEM mit' + key);
		mStyle(el, { cursor: 'pointer' })
		el.onclick = onclickItem;
		el.setAttribute('key', key)
		//console.log('dParent',key,el)



	} catch {
		console.log('ERROR showImage:', key, o)
	}

}
function mNavbar(pageTitle, titles, icons, funcNames, iconFuncNames) {
	if (nundef(funcNames)) {
		//standard is that funcs are named: onclick${title}
		funcNames = titles.map(x => `onclick${capitalize(x)}`);
	}

	function activate(ev){
		let links = document.getElementsByClassName('nav-link');
		//console.log('links',links)
		let inner = ev.target.innerHTML;
		for(const el of links){
			if (el.innerHTML == inner) mClass(el, 'active');
			else mClassRemove(el,'active');
		}
	}
	function disable(){
		let links = Array.from(document.getElementsByClassName('nav-link'));
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			//console.log('el',el)
			if (isdef(el)) mClass(el, 'disabled');
		}
	}
	function enable(){
		let links = document.getElementsByClassName('nav-link');
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			if (isdef(el)) {
				mClass(el, 'active');
				el.style.pointerEvents = 'auto'
			}
		}
	}
	
	let html = `
    <nav class="navbar navbar-expand navbar-light bg-light">
      <a class="navbar-brand a" href="#">${pageTitle}</a>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">`;
	for (let i = 0; i < titles.length; i++) {
		html += `
				<li class="nav-item">
					<a class="nav-link a" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>
				</li>
			`;
	}
	html += `
			</ul>
			</div>
		</nav>
		`;
	//let inner = document.body.innerHTML;
	var ui = mInsertFirst(document.body, mCreateFrom(html));
	//document.body.insertAdjacentElement(0,mCreateFrom(html)); //innerHTML += html + inner;
	return {activate:activate,disable:disable,enable:enable,ui:ui};
}
function showImageBatch(inc = 0) {
	let [keys, index, x] = [M.keys, M.index, M.rows * M.cols];

	if (isEmpty(keys)) showFleetingMessage('nothing has been added to this collection yet!', 'dMessage', { margin: 10 }, 5000)

	if (keys.length <= x) inc = 0;
	index += x * inc; if (index >= keys.length) index = 0; else if (index < 0) index += keys.length;

	let list = arrTakeFromTo(keys, index, index + x);
	M.index = index;
	//console.log('show', list.length, 'images from i=' + index)


	for (let i = 0; i < list.length; i++) {
		mStyle(M.cells[i], { opacity: 1 })
		showImage(list[i], M.cells[i], { w: 128, h: 128 });
	}
	for (let i = list.length; i < x; i++) {
		mStyle(M.cells[i], { opacity: 0 })
	}
}
function showTitle(title, buttons = []) {
	mClear(dTitle);
	mDom(dTitle, {}, { tag: 'h1', html: title });
	for (const b of buttons) {
		mButton(b.caption, b.handler, dTitle, { w: 70, margin: 0 }, 'input');
	}
}
function sortKeysAlphabetically(dinew) {
	let keys = Object.keys(dinew); keys.sort();
	let difinal = {};
	for (const k of keys) {
		difinal[k] = dinew[k];
	}
	return difinal;
}
function squareTo(tool, sznew = 128) {
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
	if (sznew == 0) sznew = h;
	//console.log('cropBox dims', x, y, w, h)
	let sz = Math.max(w, h)
	//console.log('sz', sz)
	let [x1, y1] = [x - (sz - w) / 2, y - (sz - h) / 2];
	redrawImage(img, dParent, x1, y1, sz, sz, sznew, sznew, () => tool.setRect(0, 0, sznew, sznew))
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
async function uploadAll(data, path, mode) {
	//a ... append text/json
	//w ... override text/json
	//wi ... override image (in this case data param should be img!!!)
	//ay ... append as yaml mit addKeys (existing keys ignored!)
	//wy ... append as yaml mit copyKeys (existing keys overwritten!)
	//oy ... override yaml
	//as ... addKeys to session object
	//ws ... copyKeys to session object
	//ac ... addKeys to config object and save config
	//wc ... copyKeys to config object and save config
	//_ac ... addKeys to config object without saving!!!
	//_wc ... copyKeys to config object without saving!!!
	//c ... just save config file and reload
	let o;
	if (mode == 'wi') {
		//data interpreted as img!!!!
		let dataUrl = imgToDataUrl(data);
		o = { data: { image: dataUrl }, path: path, mode: 'wi' };

	} else o = { path: path, data: o, mode: mode };
	let resp = await uploadJson('save', o)
	console.log('response', resp);

}

async function uploadImg(img, unique, cat, name) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			const formData = new FormData();
			formData.append('image', blob, unique + '.png');
			formData.append('category', cat);
			formData.append('name', name);
			let type = detectSessionType();
			let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
			server += '/upload';

			try {
				const response = await fetch(server, { //'http://localhost:3000/upload', {
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
async function uploadImg2(img, path) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	const dataUrl = canvas.toDataURL('image/png');
	//console.log(dataUrl);
	let o = { data: {image:dataUrl}, path: valf(path,'out.png'), mode: 'wi' };

	return await uploadJson('save',o);
	let type = detectSessionType();
	let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
	server += `/save`;
	const response = await fetch(server, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors',
		body: JSON.stringify(o)
	});
	return await response.json();
}
async function uploadJson(route, o) {
	let type = detectSessionType();
	let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
	server += `/${route}`;

	try {
		const response = await fetch(server, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			mode: 'cors',
			body: JSON.stringify(o)
		});

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			return 'ERROR 1';
		}
	} catch (error) {
		return 'ERROR 2';
	}
}


