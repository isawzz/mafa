
function addEditable(dParent, styles = {}, opts = {}) {
	//let html= `<p contenteditable="true">hallo</p>`; let x=mDom(dParent,{},{html:html});
	addKeys({ tag: 'input', classes: 'plain' }, opts)
	addKeys({ wmax: '90%', box: true }, styles);
	let x = mDom(dParent, styles, opts); // { tag: 'input', classes: 'plain' });
	x.focus();
	x.addEventListener('keyup', ev => {
		if (ev.key == 'Enter') {
			mBy('dummy').focus();
			// let text=x.value;
			// let d=mDiv(dParent,{},null,x.value);
			// x.remove();
			if (isdef(opts.onEnter)) opts.onEnter(ev)
		}
	}); //console.log('HALLO'); });
	//mPlace(x,'cc'); //(x,0,20)
	return x;
}
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
function collectionAddEmpty(ev) { //val,inp){
	if (ev.key != 'Enter') return;
	console.log('onupdate', ev.target, ev.target.value);
	let val = ev.target.value;
	addIf(M.collections, val);
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
function generateEventId(tsDay, tsCreated) { return `${rLetter()}_${tsDay}_${tsCreated}`; }
function getConfig() { return lookup(Serverdata.config, Array.from(arguments)); }
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
function getSession() { return lookup(Serverdata.session, Array.from(arguments)); }
async function imgAsync(dParent, styles, opts) {
	let path = opts.src;
	delete opts.src;

	return new Promise((resolve, reject) => {
		const img = mDom(dParent, styles, opts);
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
function imgToDataUrl(img) {
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	return dataUrl;
}
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; return true; } }
function isSameDate(date1, date2) {
	return date1.getFullYear() === date2.getFullYear() &&
		date1.getMonth() === date2.getMonth() &&
		date1.getDate() === date2.getDate();
}
async function loadCollections() {
	M = {};
	M.superdi = await mGetYaml('../assets/superdi.yaml');

	M.byCollection = {};
	M.byCat = {};
	M.byFriendly = {};
	M.collections = ['all'];
	M.categories = [];
	M.names = [];
	for (const k in M.superdi) {
		let o = M.superdi[k];
		if (isdef(o.coll)) { lookupAddIfToList(M.byCollection, [o.coll], o.key); addIf(M.collections, o.coll); }
		o.cats.map(x => { lookupAddIfToList(M.byCat, [x], o.key); addIf(M.categories, x); });
		if (isdef(o.friendly)) { lookupAddIfToList(M.byFriendly, [o.friendly], o.key); addIf(M.names, o.friendly); }
	}
	M.collections.sort();
	M.categories.sort();
	M.names.sort();

	await updateCollections();

}
async function loadCollectionsFromDirs() {
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
function loadPlayerColors() {
	let [hstep, hmin, hmax] = [20, 0, 359]; //[20,30,60];
	let [lstep, lmin, lmax] = [20, 50, 60]; //[20,30,60];
	let [sstep, smin, smax] = [30, 70, 100]; //[20,60,100]; 
	let [whites, blacks, all] = [[], [], []];
	for (let h = hmin; h < hmax; h += hstep) {
		for (let l = lmin; l <= lmax; l += lstep) {
			for (let s = smin; s <= smax; s += sstep) {
				let o = { h: h, s: s, l: l };
				let c = hslToHexCOOL(o);
				//let c2=colorFromHSL(h,100,50); //rColor(50,1,15)
				o.c = c;
				all.push(o);
				let fg = idealTextColor(c);
				if (fg == 'white') whites.push(c); else blacks.push(c);
			}
		}
	}
	DA.allColors = all;
	blacks.push('#FFDD33')
	//console.log('num', whites.length, blacks.length)

	let plColors = whites.concat(blacks);
	shuffle(plColors);

	let userColors = {
		"afia": "#69c963",
		"ally": "#6660f3",
		"amanda": "#339940FF",
		"annabel": "#ADA0EEFF",
		"bob": "#033993",
		"buddy": "midnightblue",
		"felix": BLUE,
		"guest": "dodgerblue",
		"gul": "#6fccc3",
		"lauren": BLUEGREEN,
		"leo": "#C19450FF",
		"mac": ORANGE,
		"minnow": "#F28DB2",
		"mimi": "#76AEEBFF",
		"nasi": "#EC4169FF",
		"nimble": "#6E52CCFF",
		"sarah": "deeppink",
		"sheeba": "gold",
		"valerie": "lightgreen"
	};

	for (const plname in userColors) {
		let uc = userColors[plname];
		uc = colorHex(uc);
		let already = firstCond(all, x => x.c.toLowerCase() == uc.substring(0, 7).toLowerCase());
		if (already) console.log('present', uc);
	}

	ensureColorDict();
	ensureColorNames();

	let allColors = Object.values(ColorDi).map(x => x.c);
	let list = Object.values(userColors).concat(plColors.concat(allColors).concat(Object.values(ColorNames)));
	//console.log('colors', list.length)
	list = list.filter(x => colorLum(x) < .85);
	list = list.filter(x => !isGrayColor(x));
	let s = new Set(list);
	//console.log('list was', list.length, 'set is', Array.from(s).length)
	list = Array.from(s);
	let hsllist = list.map(x => colorHSL(x, true));
	sortByMultipleProperties(hsllist, 'h', 'l');
	list = hsllist.map(x => colorHex(x));
	//console.log('list', list.length)
	list = arrRemoveDuplicates(list);
	//console.log('list', list.length)
	M.playerColors = list;
	return list;
}
function mButtonX(dParent, sz = 30, offset=0, id=null) {
	mIfNotRelative(dParent);
	let popup = isdef(id) ? mBy(id) : dParent;
	if (nundef(id)) id = dParent.id;
	let bx = mDom(dParent, { position: 'absolute', top: -2+offset, right: -5+offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
	bx.onclick = ev => { evNoBubble(ev); popup.remove() };
	let o = M.superdi.xmark;
	el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: 'dimgray', display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
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
	mDom(d, { w: 200 }, { tag: 'input', className: 'input', placeholder: "<enter value>" });
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
async function mGetRoute(route, o) {
	let type = detectSessionType();
	let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
	server += `/${route}?`;
	for (const k in o) { server += `${k}=${o[k]}&`; }
	const response = await fetch(server, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors',
	});
	return tryJSONParse(await response.text());
	// try {

	// 	if (response.ok) {
	// 		const data = await response.json();
	// 		if (isdef(data.session)) Session = data.session;
	// 		if (isdef(data.config)) Config = data.config;
	// 		return data;
	// 	} else {
	// 		return 'ERROR 1';
	// 	}
	// } catch (error) {
	// 	return 'ERROR 2';
	// }
}
function mNavbar(dParent, styles, pageTitle, titles, funcNames) {
	//da wollt ich noch icons und iconfuncs dazutun!
	if (nundef(funcNames)) {
		//standard is that funcs are named: onclick${title}
		funcNames = titles.map(x => `onclick${capitalize(x)}`);
	}
	function activate(ev) {
		//currently selected menu button
		delete DA.calendar; mClear('dMain'); mClear(dTitle)

		let links = document.getElementsByClassName('nav-link');
		//console.log('links',links)
		let inner = isString(ev) ? ev : ev.target.innerHTML;
		for (const el of links) {
			if (el.innerHTML == inner) mClass(el, 'active');
			else mClassRemove(el, 'active');
		}
	}
	function disable() {
		let links = Array.from(document.getElementsByClassName('nav-link'));
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			if (isdef(el)) mClass(el, 'disabled');
		}
	}
	function enable() {
		let links = document.getElementsByClassName('nav-link');
		for (const w of arguments) {
			let el = links.find(x => x.innerHTML == w);
			if (isdef(el)) mClassRemove(el, 'disabled');
			//if (isdef(el)) { mClass(el, 'active'); el.style.pointerEvents = 'auto' }
		}
	}

	function isThemeLight() { return !U || U.theme == 'light' ? true : false; }
	function extra1() {
		//console.log('dParent',dParent)
		let ui = mDom(dParent, { display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'space-between' });
		mStyle(ui, { 'flex-flow': 'row nowrap' });
		mClass(dParent, 'nav');
		let d1 = mDom(ui, { display: 'flex', 'align-items': 'center', gap: 12 });
		let title = mDom(d1, { fz: 20 }, { html: pageTitle, classes: 'title' });
		let d2 = mDom(d1);
		for (let i = 0; i < titles.length; i++) {
			let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
		}
		return ui;
	}
	var ui = extra1();
	return { activate: activate, disable: disable, enable: enable, ui: ui };
}
function mOnEnter(elem, setter) {
	elem.addEventListener('keydown', ev => {
		if (ev.key == 'Enter') {
			ev.preventDefault();
			mBy('dummy').focus();
			if (setter) setter(ev);
		}
	});

}
async function mPrompt(dParent = 'dUser', placeholder = '<username>', cond = isAlphanumeric) {
	return new Promise((resolve, reject) => {
		mClear(dParent)
		// let d = mInput('dUser', {position:'absolute',top:30,right:0,w:100}, 'inpPrompt', placeholder, 'input', 1);
		let d = mInput(dParent, { w: 100 }, 'inpPrompt', placeholder, 'input', 1);
		d.focus();
		//d.onblur = ev => resolve(null);
		d.onkeyup = ev => {
			if (ev.key == 'Enter') {
				let val = ev.target.value;
				ev.target.remove();
				if (cond(val)) {
					resolve(val.toLowerCase().trim());
				} else {
					console.log('invalid input!');
					resolve(null);
				}
			} else if (ev.key == 'Escape') {
				//console.log('esc!')
				resolve(null);
			}
		};
	});
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
function resizeTo(tool, wnew, hnew) {
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	if (hnew == 0) hnew = img.height;
	if (wnew == 0) {
		let aspectRatio = img.width / img.height;
		wnew = aspectRatio * hnew;
	}
	redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
async function serverUpdate(route, o) { Serverdata = await uploadJson(route, o); }
function setColors(c) {
	let hsl = colorHSL(c, true);
	let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
	let hstart = (hue + diff); //das ist also 223
	for (i = hstart; i <= hstart + 235; i += 20) {
		let h = i % 360;
		let c1 = colorFromHSL(h, 100, 75);
		wheel.push(c1);
	}
	//console.log('wheel', wheel); showWheel(wheel, c); // hat 12 colors

	let cc = idealTextColor(c);
	let pal = colorPalette(c); pal.unshift('black'); pal.push('white');
	let palc = colorPalette(cc);
	//console.log('pal',pal); //hat 11 colors von black zu white, pal[5] ist die gewaehlte
	// 0 1 2 3 4 5 6 7 8 9 10
	function light(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 + i]; }
	function dark(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 - i]; }
	function simil(i = 3) { return cc == 'white' ? dark(i) : light(i); }
	function contrast(i = 3) { return cc == 'white' ? light(i) : dark(i); }

	//let list=	

	//muss immer dann wenn U geaendert wird called werden!
	setCssVar('--bgBody', c);
	setCssVar('--bgButton', 'transparent')
	setCssVar('--bgButtonActive', light(3))
	setCssVar('--bgNav', simil(2))
	setCssVar('--bgLighter', light())
	setCssVar('--bgDarker', dark())

	setCssVar('--fgButton', contrast(3))
	setCssVar('--fgButtonActive', cc == 'black' ? dark(2) : c)
	setCssVar('--fgButtonDisabled', 'silver')
	setCssVar('--fgButtonHover', contrast(5))
	// setCssVar('--bgDocument', rColor())
	// setCssVar('--fgDocument', rColor())
	setCssVar('--fgTitle', contrast(4))
	setCssVar('--fgSubtitle', contrast(3))
}
function showWheel(list, bg) {
	mClear('dMessage');
	let dw1 = mDom('dMessage', { display: 'flex', 'flex-wrap': 'wrap', gap: 5, bg: bg, matop: 5, padding: 5 });
	for (const x of list) { mDom(dw1, { w: 90, h: 50, bg: x, fg: idealTextColor(x.substring(0, 7)) }, { html: x }); }
	return dw1;
}
function showImage(key, dParent, styles = {}) {
	let o = M.superdi[key];
	if (nundef(o)) { console.log('showImage:key not found', key); return; }
	let [w, h] = [valf(styles.w, styles.sz), valf(styles.h, styles.sz)];
	if (nundef(w)) {
		//size according to parent, parent is taken as outer div!			
		mClear(dParent);
		[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
		//console.log('w,h', w, h, dParent, styles)
	} else {
		addKeys({ w: w, h: h }, styles)
		dParent = mDom(dParent, styles);
	}
	let [sz, fz, fg] = [.9 * w, .8 * h, valf(styles.fg, rColor())];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', overflow: 'hidden' });
	mCenterCenterFlex(d1)
	let el = null;
	if (isdef(o.img)) {
		el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	mStyle(el, { cursor: 'pointer' })
	return d1;
}
function showImageInBatch(key, dParent, styles = {}) {
	let o = M.superdi[key];
	try {
		addKeys({ bg: rColor() }, styles);
		mClear(dParent);
		[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
		// console.log('w,h', w, h, dParent, styles)
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
		else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
		assertion(el, 'PROBLEM mit' + key);
		mStyle(el, { cursor: 'pointer' })
		el.onclick = onclickItem;
		el.setAttribute('key', key)
		//console.log('dParent',key,el)
	} catch {
		console.log('ERROR showImage:', key, o)
	}

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
		showImageInBatch(list[i], M.cells[i]); //, { w: 128, h: 128 });
	}
	for (let i = list.length; i < x; i++) {
		mStyle(M.cells[i], { opacity: 0 })
	}
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
function showTitle(title, buttons = []) {
	mClear(dTitle);
	mDom(dTitle, {}, { tag: 'h1', html: title, classes: 'title' });
	for (const b of buttons) {
		mButton(b.caption, b.handler, dTitle, { w: 70, margin: 0 }, 'input');
	}
}
function sortByMultipleProperties(list) {
	let props = Array.from(arguments).slice(1); //arrTakeFrom(arguments,1);
	//console.log('props',props)
	return list.sort((a, b) => {

		for (const p of props) {
			if (a[p] < b[p]) return -1;
			if (a[p] > b[p]) return 1;
		}

		// If all properties are equal, no change in order
		return 0;
	});
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
function tryJSONParse(astext) {
	try {
		const data = JSON.parse(astext);
		return data;
	} catch {
		console.log('text', astext)
		return { message: 'ERROR', text: astext }
	}
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
async function uploadImg(img, unique, coll, name) {
	return new Promise((resolve, reject) => {
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

		canvas.toBlob(async (blob) => {
			const formData = new FormData();
			formData.append('image', blob, unique + '.png');
			formData.append('collection', coll);
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
	let o = { data: { image: dataUrl }, path: valf(path, 'out.png'), mode: 'wi' };

	return await uploadJson('save', o);
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
async function userLoad(uname) {
	UI.nav.activate('no')
	if (nundef(uname)) uname = localStorage.getItem('username');
	//U = null;
	//uname = null;
	if (isdef(uname) && (!U || U.name != uname)) {
		//what if the current U has unsaved data??? TODO
		let data = lookup(Serverdata.session, ['users', uname]) ?? lookup(Serverdata.config, ['users', uname]);
		if (!data) {
			console.log('adding new user!!!', uname);
			data = { name: uname, color: rChoose(M.playerColors) };
			await serverUpdate('newuser', data);
		}
		assertion(data, "WTK??? userLoad!!!!!!!!!!!!!!!! " + uname);
		localStorage.setItem('username', uname);
		U = data;
		U.data = await mGetYaml(`../y/users/${uname}.yaml`);
	}
	mClear(dUser);
	mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })

	let d;
	if (U) {
		d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'active' });
		setColors(U.color)
	} else {
		let styles = { family: 'fa6', fg: 'grey', fz: 25, cursor: 'pointer' };
		d = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
	}
	d.onclick = onclickUser;
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

