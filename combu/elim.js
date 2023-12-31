function arrInsertAt(arr, x, i) {
	arr.splice(i, 0, x);
	return arr;
}
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
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
function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      onEventEdited(o, inp);
    }
  });
  return d1;
}
function cvRot90(img, canvas, ctx, w, h, border, diff) {
	let rot = 90
	ctx.translate(canvas.width, 0); //-canvas.height/2) //img.width);
	ctx.rotate(rot * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
	// ctx.translate(-8, 6) //erstes:- verschiebt nacht oben, zweites: + verschiebt nach links
	ctx.drawImage(img, 0, 0, img.width, img.height)
	ctx.beginPath();
	//ctx.rect(12, 5, canvas.height, canvas.width) //15, -4, 290, 180);
	// ctx.rect(15, -4, 290, 180);
	ctx.stroke();
}
function cvRot270(img, canvas, ctx, w, h, border, diff) {
	let rot = -90
	if (rot == -90) {
		ctx.translate(0, img.width);
		ctx.rotate(-90 * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-4, 15)
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = color;
		ctx.rect(15, -4, 290, 180);
		ctx.stroke();
	} else if (rot == 90) {
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}



	//let cv = imgAsCanvas(img,'dMain');
}
function downloadCanvas(canvas) {
	//var canvas = document.getElementById('myCanvas');
	var dataURL = canvas.toDataURL('image/png');

	// Create a temporary link element
	var link = document.createElement('a');
	link.href = dataURL;
	link.download = 'canvas_image.png';

	// Append the link to the body and simulate a click
	document.body.appendChild(link);
	link.click();

	// Remove the link from the body
	document.body.removeChild(link);
}
function drawFa6(o) {
	let fz = 50;
	let d = mDom('dMain', { w: 120, h: 80, margin: 4, align: 'center', display: 'inline-block' });
	let el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor() }, { html: String.fromCharCode('0x' + o.fa6) });
	let t = mDom(d, { fz: 11 }, { html: o.key });

}
function drawFaga(o) {
	let fz = 50;
	let [code, family] = isdef(o.fa) ? [o.fa, 'pictoFa'] : [o.ga, 'pictoGame'];
	//console.log('family:',family)
	let d = mDom('dMain', { w: 120, h: 80, margin: 4, align: 'center', display: 'inline-block' });
	let el = mDom(d, { fz: fz, hline: fz, family: family, bg: 'transparent', fg: rColor() }, { html: String.fromCharCode('0x' + code) });
	let t = mDom(d, { fz: 11 }, { html: o.key });

}
function drawRoundedRect(ctx, x, y, width, height, radius) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + width, y, x + width, y + height, radius);
	ctx.arcTo(x + width, y + height, x, y + height, radius);
	ctx.arcTo(x, y + height, x, y, radius);
	ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();

	// Fill and stroke the rounded rectangle
	ctx.fill();
	ctx.stroke();
}
function drawRoundedRect(ctx, x, y, width, height, radius, stroke, fill, thickness) {
	if (stroke) ctx.strokeStyle = stroke;
	if (fill) ctx.fillStyle = fill;
	if (thickness) ctx.lineWidth = thickness;
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.moveTo(x + width - radius, y);
	ctx.arcTo(x + width, y, x + width, y + radius, radius);
	ctx.moveTo(x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	// ctx.arcTo(x + width, y + height, x, y + height, radius);
	// ctx.arcTo(x, y + height, x, y, radius);
	// ctx.arcTo(x, y, x + width, y, radius);
	ctx.closePath();

	// Fill and stroke the rounded rectangle
	if (fill) ctx.fill();
	if (stroke) ctx.stroke();
}
function filenameToObject(fname, path, cats) {
	let parts = fname.split('.');
	if (parts.length != 2) console.log('file', path, fname, 'wrong name');
	let [k, ext] = parts;
	let o = { key: k, ext: ext, cats: cats, path: `${path}/${fname}`, img: fname, friendly: k.replace(/[^a-zA-Z]/g, '') };
	return o;
}
function focusNextSiblingOrSubmitOnEnter(ev, id) {
	if (ev.key === 'Enter') {
		ev.preventDefault();
		let el = mBy(id); let tag = el.tagName.toLowerCase();
		if (tag == 'input') el.focus();
		else if (tag == 'form') {
			el.submit();
		}
	}
}
function formatDate(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-based
	const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year

	return `${day}_${month}_${year}`;
}
function getConfig() { return lookup(Serverdata.config, Array.from(arguments)); }
function getSession() { return lookup(Serverdata.session, Array.from(arguments)); }
async function loadCollectionsFromDirs() {
	if (nundef(M.emos)) {
		let server = getServerurl();
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
async function loadUserdata(uname) {
  let data = await mGetRoute('user', uname);
  console.log('data',data)
  if (!data) { data = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
  else Serverdata.users[uname] = data;
  return data;
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
async function mSleep(ms = 1000) {
	return new Promise(
		(res, rej) => {
			if (ms <= 3000) {
				setTimeout(res, ms);
			} else {
				console.log('param should be less than 3001');
			}
		});
}
function mTooltip(elem, content) {
	mIfNotRelative(elem);
	let d = mDom(elem, { display: 'none', rounding: 6, padding: 2, h: 60, wmin: 120, bg: 'dimgrey', fg: 'white', position: 'absolute', bottom: 22 }, { html: content });

	elem.onmouseover = () => d.style.display = 'block';
	elem.onmouseout = () => d.style.display = 'none';

}
async function onclickNATIONS() {
	//show civ japan
	showTitle('NATIONS!!!');
	await loadImageAsync('../assets/games/nations/civs/civ_japan.png', mDom('dMain', {}, { tag: 'img' }));



}
async function postUserChange(data) {
	data = valf(data, U)
	return Serverdata.users[data.name] = await mPostRoute('postUser', data);
}
function removeChildrenFromIndex(element, startIndex) {
	// Ensure the element is valid
	if (!element || !element.children || startIndex < 0) {
		console.error('Invalid arguments');
		return;
	}

	// Remove children starting from the specified index
	while (element.children.length > startIndex) {
		element.removeChild(element.children[startIndex]);
	}
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
function rotateImage(img, degree) {
	let canvas = mBy('canvas')
	var ctx = canvas.getContext('2d');
	var cw, ch, cx, cy;
	//var cw = img.width/2, ch = img.height/2, cx = 0, cy = 0;

	//   Calculate new canvas size and x/y coorditates for image
	switch (degree) {
		case 90:
			cw = img.height / 2;
			ch = img.width / 2;
			cx = 100; //(img.width/2);
			cy = 100; //(img.height/2) * (-1);
			break;
		case 180:
			cx = img.width * (-1);
			cy = img.height * (-1);
			break;
		case 270:
			cw = img.height;
			ch = img.width;
			cx = img.width * (-1);
			break;
	}

	//  Rotate image            
	canvas.setAttribute('width', cw);
	canvas.setAttribute('height', ch);

	degree = 20;
	cw = img.height / 2;
	ch = img.width / 2;
	cx = 100; //(img.width/2);
	cy = 100; //(img.height/2) * (-1);
	//ctx.rotate(degree * Math.PI / 180);
	//cContext.drawImage(img, cx, cy);
	//console.log('dim',cx,cy,cw,ch);
	ctx.fillStyle = 'red';
	ctx.fillRect
	//ctx.drawImage(img, cx, cy,cw,ch);

	//downloadCanvas(canvas);
	//document.getElementById('download').setAttribute('href',canvas.toDataURL())
}
async function saveCiv(name, sz = 800) {

	let dParent = mBy('dMain');
	let img = mDom(dParent, {}, { tag: 'img', src: `../assets/games/nations/civs/${name}.jpg`, height: sz });
	img.style.transform = `rotate(90deg) translateY(-${sz}px)`;
	img.style.transformOrigin = 'top left';

	img.onload = async () => {
		const canvas = document.createElement('canvas');
		mAppend(dParent, canvas);
		console.log('w,h', img.width, img.height);
		canvas.width = img.height;
		canvas.height = img.width;
		const ctx = canvas.getContext('2d');

		// ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset the transformation matrix
		// ctx.translate(0, 800); // Apply the translation
		// ctx.rotate((90 * Math.PI) / 180); // Apply the rotation
		ctx.drawImage(img, 0, 0, 800, 400); // Draw the image


		//ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		return dataUrl;

	};

	return;

	img.onload = async () => {

		let dataUrl = imgToDataUrl(img);
		let unique = `civ_${name}_${rName()}`;
		let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: unique + '.png', ext: 'png' };
		console.log('dataUrl');
		let resp = await mPostRoute('postImage', o);
		console.log('resp', resp)
	};

}
async function serverUpdate(route, o) { Serverdata = await uploadJson(route, o); }
function showWheel(list, bg) {
	mClear('dMessage');
	let dw1 = mDom('dMessage', { display: 'flex', 'flex-wrap': 'wrap', gap: 5, bg: bg, matop: 5, padding: 5 });
	for (const x of list) { mDom(dw1, { w: 90, h: 50, bg: x, fg: idealTextColor(x.substring(0, 7)) }, { html: x }); }
	return dw1;
}
function showSidebar(dParent) {

	dSidebar = mDom(dParent, { 'align-self': 'stretch', hmin: '100vh' }, { id: 'dSidebar' });
	dLeiste = mDiv(dParent);
	mStyle(dLeiste, { wmin: 70, hmin: '100vh', display: 'flex', 'flex-flow': 'column wrap' });
	//da kommen jetzt die tools drauf!

	//wenn ich eines selecte kann ich edit,remove,delete,edit categories,edit name,add to collection machen
	//wenn ich mehrere selecte kann ich remove,delete,add category,add to collection machen

	//soll jetzt ein user sich ausweisen muessen? ja mindestens einloggen!

}
function sortKeysAlphabetically(dinew) {
	let keys = Object.keys(dinew); keys.sort();
	let difinal = {};
	for (const k of keys) {
		difinal[k] = dinew[k];
	}
	return difinal;
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
async function uploadAll(data, path, mode = 'w') {
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
	//c ... ac
	//s ... as
	//ss ... save session
	let o;
	if (mode == 'wi') {
		//data interpreted as img!!!!
		let dataUrl = imgToDataUrl(data);
		o = { data: { image: dataUrl }, path: path, mode: 'wi' };

	} else o = { path: path, data: o, mode: mode };
	let resp = await uploadJson('save', o)
	console.log('response', resp);

}
async function uploadImg2(img, path) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

	const dataUrl = canvas.toDataURL('image/png');
	//console.log(dataUrl);
	let o = { data: { image: dataUrl }, path: valf(path, 'out.png'), mode: 'wi' };

	return await uploadJson('save', o);
	let server = getServerurl();
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
	let server = getServerurl();
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
//#region colors
function sortByHue(colors) {
	const hslColors = colors.map(AhexToHSL);
	hslColors.sort((a, b) => a.hue - b.hue);
	const sortedHexColors = hslColors.map(AhslToHex);
	return sortedHexColors;
}
function isGrayColor(color, diff = 60) {
	const rgb = AhexToRgb(color);
	//return rgb.r === rgb.g && rgb.g === rgb.b;

	return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
function AhexToHSL(hex) {
	const rgb = AhexToRgb(hex);
	const hsl = ArgbToHsl(rgb.r, rgb.g, rgb.b);
	return hsl;
}
function AhslToHex(hsl) {
	const rgb = AhslToRgb(hsl.hue, hsl.saturation, hsl.lightness);
	return ArgbToHex(rgb.r, rgb.g, rgb.b);
}
function AhexToRgb(hex) {
	// Remove the hash character if present
	hex = hex.replace(/^#/, '');

	// Parse the hex values to RGB
	const bigint = parseInt(hex, 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;

	return { r, g, b };
}
function ArgbToHsl(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	let h, s, l = (max + min) / 2;

	if (max === min) {
		h = s = 0;
	} else {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
	}

	return { hue: h, saturation: s, lightness: l };
}
function AhslToRgb(h, s, l) {
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p, q, t) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}
function ArgbToHex(r, g, b) {
	return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
}

//#endregion

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

























