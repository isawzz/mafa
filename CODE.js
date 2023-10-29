//#region combu
function createImageIndex(){
	let byKey={},byFriendly={},byCat={};
	console.log(M.emos.abacus)
	for(const k in M.emos){
		let o=M.emos[k];
		let onew = {friendly:k};
		addKeys(o,onew);
		if (isdef(o.img)) onew.path = '../assets/img/emo/'+o.img;
		byKey[k]=onew;
		lookupAddIfToList(byFriendly,[k],onew);
		o.cats.map(x=>lookupAddIfToList(byCat,[x],onew));
	}
	for(const k in M.collections){
		let o=M.collections[k];
		let onew = {friendly:o.name,cats:[o.cat],img:k+'.'+k.ext};
		onew.path = `../y/${k}.${o.ext}`;
		byKey[k]=onew;
		lookupAddIfToList(byFriendly,[o.name],onew);
		lookupAddIfToList(byCat,[o.cat],onew);
	}
	return [byKey,byFriendly,byCat];
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
			formData.append('name',name);

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
function createRg(dParent, img, handler, title, ){
	let rg = mRadioGroup(d, {}, 'rSizes', 'Crop to: '); mClass(rg, 'input')
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
	mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}
function addCropTool(dParent,img,setSizeFunc) {
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
		let [w1,h1]=[w,w/.7];
		let [w2,h2]=[h*.7,h];
		if (w1<w2) mRadio(`${w1} x ${h1} (card)`, [w1,h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (card)`, [w2,h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	}
	if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	else {
		//card portrait kann man auch machen: take das das nicht passt
		let [w1,h1]=[w,w*.7];
		let [w2,h2]=[h/.7,h];
		if (w1<w2) mRadio(`${w1} x ${h1} (landscape)`, [w1,h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
		else mRadio(`${w2} x ${h2} (landscape)`, [w2,h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	}
	mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}
function addResizeTool(dParent,img) {
	let setSizeFunc = async arr=>{
		await resizeImage(img,arr[1]);
		console.log('new size',img.offsetWidth,img.offsetHeight);
	}
	let d = dParent;

	//let rg = mDom(d,{},{className:'input',type:'numeric',value:img.offsetHeight});
	mDom(d, {}, { html: 'Resize:' }); 
	let rg = mDom(d, {}, { tag: 'input', value:img.offsetHeight, name: 'imgheight', type: 'text', className: 'input', placeholder: "<enter height>" });

	// let rg = mRadioGroup(d, {}, 'rSizes', 'Resize to: '); mClass(rg, 'input');

	// mRadio('manual', [0, 0], 'rSizes', rg, {}, setSizeFunc, 'rSizes', true)
	// let [w, h] = [img.offsetWidth, img.offsetHeight];
	// if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// else {
	// 	//card portrait kann man auch machen: take das das nicht passt
	// 	let [w1,h1]=[w,w/.7];
	// 	let [w2,h2]=[h*.7,h];
	// 	if (w1<w2) mRadio(`${w1} x ${h1} (card)`, [w1,h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// 	else mRadio(`${w2} x ${h2} (card)`, [w2,h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// }
	// if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// else {
	// 	//card portrait kann man auch machen: take das das nicht passt
	// 	let [w1,h1]=[w,w*.7];
	// 	let [w2,h2]=[h/.7,h];
	// 	if (w1<w2) mRadio(`${w1} x ${h1} (landscape)`, [w1,h1], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// 	else mRadio(`${w2} x ${h2} (landscape)`, [w2,h2], 'rSizes', rg, {}, setSizeFunc, 'rSizes', false)
	// }
	//mDom(rg, { fz: 12, margin: 12 }, { html: '(click & drag image to crop)' });
	return rg;
}
function resizePreviewImage(dParent,img) {
	const bottomRightResizeHandle = mDom(dParent,{},{className:"resize-handle bottom-right"}); 

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
			bottomRightResizeHandle.style.left = `${width}px`;
			bottomRightResizeHandle.style.top = `${height}px`;
			dParent.style.width = `${width}px`;
			dParent.style.height = `${height}px`;

		}
	}

	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}
	bottomRightResizeHandle.addEventListener('mousedown', startResize);


}

function redrawImage1(img,dParent,x,y,w,h,callback){
	console.log('ausschnitt:', x, y, w, h);
	let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

	img.onload=()=>{
		img.onload = null;
		img.width = w;
		img.height = h;
		mStyle(img,{w:w,h:h});
		mStyle(dParent, { w: w, h: h });
		callback(); //setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;

}
function redrawImage2(img,dParent,wold,hold,w,h,callback){
	// let [wold,hold]=['width','height'].map(x=>parseInt(dParent.style[x])); //img.width,img.height];
	console.log('old dims',wold,hold)
	console.log('new dims:', w,h);
	let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, wold, hold, 0, 0, w, h);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

	img.onload=()=>{
		img.onload = null;
		img.width = w;
		img.height = h;
		mStyle(dParent, { w: w, h: h });
		callback(); //setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;

}
function __redrawImage(img,x,y,w,h,w2,h2,callback=null) {
	// let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
	console.log('___\nausschnitt:', x, y, w, h);
	console.log('dest rect:',0,0,w2,h2)
	let canvas = mDom(null, {}, { tag: 'canvas', width: w2, height: h2 });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, x, y, w, h, 0, 0, w2, h2);
	const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
	img.onload=()=>{
		img.onload = null;
		img.width = w2;
		img.height = h2;
		if (callback) callback();
		mStyle(img.parentNode, { w: w2, h: h2 });
		mStyle(img.parentNode.parentNode, { w: w2, h: h2 });
		//setRect(0, 0, w, h);
	}
	img.src = imgDataUrl;
	return imgDataUrl;
}


function miCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, {bg:'#ffffff80',fg:'black'});

	let sz = 25;
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
		isResizing = e.target == wHandle ? 'w' :  e.target == hHandle ? 'h':'wh';
		[resizeStartW,resizeStartH] = [parseInt(cropBox.style.width),parseInt(cropBox.style.height)];
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
		} else if (isResizing == 'wh'){
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0,0,newWidth,newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		let [wnew,hnew]=[parseInt(cropBox.style.width),parseInt(cropBox.style.height)]
		redrawImage(img,dParent,0,0,resizeStartW,resizeStartH,wnew,hnew,()=>setRect(0,0,wnew,hnew))
		// redrawImage2(img,dParent,resizeStartW,resizeStartH,wnew,hnew,()=>setRect(0,0,wnew,hnew))
		//resizeImage(img, parseInt(cropBox.style.height))
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
		// redrawImage(img,x,y,w,h,w,h,()=>{
		// 	setRect(0,0,w,h);
		// 	mStyle('dMain',{display:'flex'})
		// 	mStyle(dParent, { w: w, h: h, display:'inline' });
		// });
		//redrawImage1(img,dParent,x,y,w,h,()=>setRect(0,0,w,h))
		redrawImage(img,dParent,x,y,w,h,w,h,()=>setRect(0,0,w,h))

		// console.log('ausschnitt:', x, y, w, h);
		// let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
		// const ctx = canvas.getContext('2d');
		// ctx.drawImage(img, x, y, w, h, 0, 0, w, h);
		// const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed

		// img.onload=()=>{
		// 	img.onload = null;
		// 	img.width = w;
		// 	img.height = h;
		// 	mStyle(dParent, { w: w, h: h });
		// 	setRect(0, 0, w, h);
		// }
		// img.src = imgDataUrl;
		// return imgDataUrl;
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
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

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

function miCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, {bg:'#ffffff80',fg:'black'});
	const centerBox = mDom(cropBox, { bg: 'red', w: 10, h: 10, rounding: '50%', position: 'absolute' });
	let isCropping = false;
	let cropStartX;
	let cropStartY;

	//resizer code
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	let isResizing = null;
	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' :  e.target == hHandle ? 'h':'wh';
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
		} else if (isResizing == 'wh'){
			newHeight = e.clientY;
			let aspectRatio = img.width / img.height;
			newWidth = aspectRatio * newHeight;
		}
		[img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
		setRect(0,0,newWidth,newHeight);
		//messageBox.innerHTML = `size: ${Math.round(newWidth)} x ${Math.round(newHeight)}`;
	}
	function stopResize() {
		isResizing = null;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
		resizeImage(img, parseInt(cropBox.style.height))
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
		console.log('x,y,w,h', x, y, w, h);
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
		//messageBox.innerHTML = `size: ${width} x ${height}`;
		messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
		mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
		//console.log('new rect',left,top,width,height,width/2,height/2);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew, hnew) {
		if (isList(wnew)) [wnew, hnew] = wnew;
		console.log('sz', wnew, hnew);
		if (wnew == 0 || hnew == 0) {
			setRect(0, 0, worig, horig);
			return;
		}
		let [x, y, w, h] = getRect();
		let [cx, cy] = [x + w / 2, y + h / 2];

		console.log('old rect', x, y, w, h, cx, cy);

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
function miResizer(dParent, img, dButtons){ //}, cropBox, messageBox) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight];
	//console.log('w', worig, 'h', horig);
	//console.log('dParent', dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox, {bg:'#ffffff80',fg:'black'});
	let sz = 25;
	const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
	const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
	const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });

	let isResizing = null;
	let maintainAspectRatio = false;

	function startResize(e) {
		e.preventDefault(); evNoBubble(e);
		isResizing = e.target == wHandle ? 'w' :  e.target == hHandle ? 'h':'wh';
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
			if (maintainAspectRatio) {
				let aspectRatio = img.height / img.width;
				newHeight = aspectRatio * newWidth;
			}
		} else if (isResizing == 'h') {
			newWidth = img.width;
			newHeight = e.clientY;
			if (maintainAspectRatio) {
				let aspectRatio = img.width / img.height;
				newWidth = aspectRatio * newHeight;
			}
		} else if (isResizing == 'wh'){
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
		console.log('sz', wnew, hnew);
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
function miResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight]; 
	console.log('w', worig, 'h', horig);
	console.log('dParent',dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	let sz=25;
	const wHandle = mDom(cropBox,{cursor:'ew-resize',bg:'red',w:sz,h:sz,left:'100%',top:'50%',rounding:'50%',position:'absolute'});
	const hHandle = mDom(cropBox,{cursor:'ns-resize',bg:'red',w:sz,h:sz,left:'50%',top:'100%',rounding:'50%',position:'absolute'});

	let isResizingW = false;
	let isResizingH = false;

	function startResizeW(e) {
		e.preventDefault();evNoBubble(e);
		isResizingW = true;
		document.addEventListener('mousemove', resizeW);
		document.addEventListener('mouseup', stopResizeW);
	}
	function resizeW(e) {
		e.preventDefault();evNoBubble(e);
		if (isResizingW) {

			let x=e.clientX;//,y=e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.height / img.width;
			const newWidth = width;
			const newHeight = aspectRatio * newWidth;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeW() {
		isResizingW = false;
		document.removeEventListener('mousemove', resizeW);
		document.removeEventListener('mouseup', stopResizeW);
		resizeImage(img,parseInt(cropBox.style.height))
		// cropImage();
	}
	function startResizeH(e) {
		e.preventDefault();evNoBubble(e);
		isResizingH = true;
		document.addEventListener('mousemove', resizeH);
		document.addEventListener('mouseup', stopResizeH);
	}
	function resizeH(e) {
		e.preventDefault();evNoBubble(e);
		if (isResizingH) {

			let y=e.clientY;

			const height = y; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.width / img.height;
			const newHeight = height;
			const newWidth = aspectRatio * newHeight;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeH() {
		isResizingH = false;
		document.removeEventListener('mousemove', resizeH);
		document.removeEventListener('mouseup', stopResizeH);
		resizeImage(img,parseInt(cropBox.style.height))
		// cropImage();
	}
	function getRect(){ return ['left','top','width','height'].map(x=>parseInt(cropBox.style[x]));}
	function setRect(left,top,width,height){
		mStyle(cropBox,{left:left,top:top,w:width,h:height});
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew,hnew){
		if (isList(wnew)) [wnew,hnew]=wnew;
		console.log('sz',wnew,hnew);
		if (wnew == 0 || hnew == 0){
			setRect(0,0,worig,horig);
			return;
		}
		let [x,y,w,h]=getRect(); 
		let [cx,cy] = [x+w/2,y+h/2];
		let [xnew,ynew]=[cx-(wnew/2),cy-(hnew/2)];
		setRect(xnew,ynew,wnew,hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0,0,worig,horig);
	wHandle.addEventListener('mousedown', startResizeW);
	hHandle.addEventListener('mousedown', startResizeH);
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

function miResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight]; 
	console.log('w', worig, 'h', horig);
	console.log('dParent',dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	let sz=25;
	const wHandle = mDom(cropBox,{cursor:'ew-resize',bg:'red',w:sz,h:sz,left:'100%',top:'50%',rounding:'50%',position:'absolute'});
	const hHandle = mDom(cropBox,{cursor:'ns-resize',bg:'red',w:sz,h:sz,left:'50%',top:'100%',rounding:'50%',position:'absolute'});

	let isResizingW = false;
	let isResizingH = false;

	function startResizeW(e) {
		e.preventDefault();evNoBubble(e);
		isResizingW = true;
		document.addEventListener('mousemove', resizeW);
		document.addEventListener('mouseup', stopResizeW);
	}
	function resizeW(e) {
		e.preventDefault();evNoBubble(e);
		if (isResizingW) {

			let x=e.clientX;//,y=e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.height / img.width;
			const newWidth = width;
			const newHeight = aspectRatio * newWidth;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeW() {
		isResizingW = false;
		document.removeEventListener('mousemove', resizeW);
		document.removeEventListener('mouseup', stopResizeW);
		resizeImage(img,parseInt(cropBox.style.height))
		// cropImage();
	}
	function startResizeH(e) {
		e.preventDefault();evNoBubble(e);
		isResizingH = true;
		document.addEventListener('mousemove', resizeH);
		document.addEventListener('mouseup', stopResizeH);
	}
	function resizeH(e) {
		e.preventDefault();evNoBubble(e);
		if (isResizingH) {

			let y=e.clientY;

			const height = y; //initialWidth + (e.clientX - resizeStartX);
			const aspectRatio = img.width / img.height;
			const newHeight = height;
			const newWidth = aspectRatio * newHeight;

			img.style.width = `${newWidth}px`;
			dParent.style.width = `${newWidth}px`;
			cropBox.style.width = `${newWidth}px`;

			img.style.height = `${newHeight}px`;
			dParent.style.height = `${newHeight}px`;
			cropBox.style.height = `${newHeight}px`;
		}
	}
	function stopResizeH() {
		isResizingH = false;
		document.removeEventListener('mousemove', resizeH);
		document.removeEventListener('mouseup', stopResizeH);
		resizeImage(img,parseInt(cropBox.style.height))
		// cropImage();
	}
	function getRect(){ return ['left','top','width','height'].map(x=>parseInt(cropBox.style[x]));}
	function setRect(left,top,width,height){
		mStyle(cropBox,{left:left,top:top,w:width,h:height});
		messageBox.innerHTML = `size: ${width} x ${height}`;
	}
	function setSize(wnew,hnew){
		if (isList(wnew)) [wnew,hnew]=wnew;
		console.log('sz',wnew,hnew);
		if (wnew == 0 || hnew == 0){
			setRect(0,0,worig,horig);
			return;
		}
		let [x,y,w,h]=getRect(); 
		let [cx,cy] = [x+w/2,y+h/2];
		let [xnew,ynew]=[cx-(wnew/2),cy-(hnew/2)];
		setRect(xnew,ynew,wnew,hnew);
	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }

	setRect(0,0,worig,horig);
	wHandle.addEventListener('mousedown', startResizeW);
	hHandle.addEventListener('mousedown', startResizeH);
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

function mCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight]; 
	console.log('w', worig, 'h', horig);
	console.log('dParent',dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	const centerBox = mDom(cropBox,{bg:'red',w:10,h:10,rounding:'50%',position:'absolute'});
	const bottomRightResizeHandle = mDom(cropBox,{left:worig,top:horig},{className:"resize-handle bottom-right"}); 

	let isCropping = false;
	let cropStartX;
	let cropStartY;

	let isResizing = false;

	function startResize(e) {
		e.preventDefault();evNoBubble(e);
		stopCrop();
		isResizing = true;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		e.preventDefault();evNoBubble(e);
		if (isResizing) {
			let x=e.clientX,y=e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const height = y; //initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
			bottomRightResizeHandle.style.left = `${width}px`;
			bottomRightResizeHandle.style.top = `${height}px`;
			dParent.style.width = `${width}px`;
			dParent.style.height = `${height}px`;
			cropBox.style.width = `${width}px`;
			cropBox.style.height = `${height}px`;

		}
	}
	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}

	function startCrop(e) {
		e.preventDefault();
		stopResize();
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
			setRect(left,top,width,height);
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
			setRect(left,top,width,height);
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
        setRect(left,top,width,height);
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
	function finalize() {
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
	function getRect(){ return ['left','top','width','height'].map(x=>parseInt(cropBox.style[x]));}
	function setRect(left,top,width,height){
		cropBox.style.width = `${width}px`;
		cropBox.style.height = `${height}px`;
		cropBox.style.left = `${left}px`;
		cropBox.style.top = `${top}px`;
		messageBox.innerHTML = `size: ${width} x ${height}`;
		//let [cx,cy] = [(left+width)/2,(top+height)/2];
		mStyle(centerBox,{left:width/2-5,top:height/2-5});
		//cropBox.innerHTML = `size: ${width} x ${height}`;
		//mach roten punkt im center

		//console.log('new rect',left,top,width,height,width/2,height/2);


	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew,hnew){
		if (isList(wnew)) [wnew,hnew]=wnew;
		console.log('sz',wnew,hnew);
		if (wnew == 0 || hnew == 0){
			setRect(0,0,worig,horig);
			return;
		}
		let [x,y,w,h]=getRect(); 
		let [cx,cy] = [x+w/2,y+h/2];

		console.log('old rect',x,y,w,h,cx,cy);

		let [xnew,ynew]=[cx-(wnew/2),cy-(hnew/2)];


		setRect(xnew,ynew,wnew,hnew);

	}
	setRect(0,0,worig,horig);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);
	cropBox.addEventListener('mousedown', startCrop);
	//addTool();

	return {
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		cropResize: finalize,
		// restart:restart,
		setSize: setSize,
		elem: cropBox,
	}
}
async function onDropPreviewImage(url) {
	let dParent = UI.dDrop;
	let dButtons = UI.dButtons;
	dParent.innerHTML = '';
	dButtons.innerHTML = '';
	let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
	img.onload = async () => {
		img.onload = null;
		//await resizeImage(img, 300);
		UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
		UI.url = url;
		UI.cropper = mCropper(dParent, img, dButtons);

		let d = dButtons;
		UI.cropTool = addCropTool(dButtons,img,UI.cropper.setSize);

		resizePreviewImage(dParent,img);

		//UI.resizeTool = addResizeTool(dButtons,img,resizeImage);
		mDom(d, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
		mButton('Crop', UI.cropper.crop, d, { w: 120, maleft: 12 }, 'input');
		// mButton('Restart', UI.cropper.restart, dButtons, { w: 120, maleft: 12 }, 'input');
		mButton('Restart', () => onDropPreviewImage(url), d, { w: 120, maleft: 12 }, 'input');
		//mDom(d, { h: 10 })
		//mDom(d,{},{html:'click & drag image to crop'});


	}
}
function mCropper(dParent, img) {
	let [w, h] = [img.offsetWidth, img.offsetHeight]; //img.offsetY,img.offsetX,
	console.log('w', w, 'h', h);
	console.log('dParent',dParent)
	mStyle(dParent, { w: w, h: h, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: w, h: h }, { className: 'crop-box' });
	//const cropBox = mDom(dParent, { w: w, h: h }, { className: 'crop-box' });
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

	function cropImage_orig() {
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
		mStyle(img,{position:'absolute',top:0,left:0,w:cropWidth,h:cropHeight});
		mStyle(cropBox, { display:'none' }); //top: 0, left: img.offsetLeft });
		return croppedImageDataUrl;
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
		elem: cropBox,
	}
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
async function loadSrcAndComplete(path, dParent, dButtons) {
  return new Promise(async(resolve, reject) => {
		dParent.innerHTML = '';
		let img = UI.imgElem = mDom(dParent, { box:true }, { tag: 'img'});
		//let img = UI.imgElem = mDom(dParent, { position: 'absolute', left: 0, box:true }, { tag: 'img', className: 'previewImage' });
    img.onload = () => {
			img.onload = null;
			const aspectRatio = img.width / img.height;
			const h = 300;
			const w = aspectRatio * h;
			//mStyle(img,{left: 0, h:h, w:w})
			UI.cropper = mCropper(dParent, img);
			mButton('Crop',UI.cropper.crop,dButtons,{w:120},'input');
      resolve(img);
    };

    img.onerror = (error) => {
      // Handle loading errors, if necessary
      reject(error);
    };

    img.src = path;
		//await resizeImage(img,300);
		//UI.cropper = mCropper(UI.dDrop, imgElem);
    //resolve(img);
  });
}

function loadImage(path, dParent, dButtons) {
	dParent.innerHTML = '';
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
			dButtons.innerHTML = '';
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Crop', onclick: UI.cropper.crop, className: 'input' })
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Show Cropper', onclick: UI.cropper.show, className: 'input' })
			mDom(dButtons, { w: 120, maright: 10 }, { tag: 'button', html: 'Hide Cropper', onclick: UI.cropper.hide, className: 'input' })
		}

	};
	return img;

}

function uploadImg(imgElem, cat, name, ev) {
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
function uploadImg(imgElem, cat, name, ev) {
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

function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, edit: true, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'datalistInput', placeholder: "<enter value>" });
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


function _myDatalist(dParent, list, opts = {}) {
	//what is the list we are working with?
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, edit: true, matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) }, opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'datalistInput', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	// //#region create
	// // function create(dParent) {
	// 	let id = getUID('dl');
	// 	let optid = 'opt' + id;
	// 	//console.log('id', id)
	// 	let html = `
	// 		<input list="${optid}" class='datalistInput' id="${id}" placeholder="<enter value>">
	// 		<datalist id="${optid}" class='datalist'></datalist>
	// 		`;
	// 	let d = mDiv(toElem(dParent));
	// 	d.innerHTML = html;
	// // 	return d;
	// // }
	// //#endregion
	var elem = d;//create(toElem(dParent));
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	inp.setAttribute('list', optid);
	console.log('datalist', elem, inp, datalist)
	function update() {
		let val = valf(inp.value, '');
		//fuege val alphabetisch in liste ein (opt.alpha)
		addIfAlpha(mylist, val);
		//populate
		populate();
		inp.value = ''; //clear input
	}
	function populate(val) {
		val = valf(inp.value, ''); val = val.toLowerCase();
		datalist.innerHTML = '';
		console.log('datalist', datalist)
		let filteredList = mylist.filter(x => opts.matches(x, val));
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	populate();

	if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	//if (opts.alpha) inp.addEventListener('input', this.populate);

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		populate: populate,

	}
}
function _mDatalist(dParent, list, allowEdit = true) {
	let id = getUID('dl');
	let optid = 'opt' + id;
	console.log('id', id)
	let html = `
		<input list="${optid}" class='datalistInput' id="${id}" placeholder="<enter value>">
		<datalist id="${optid}" class='datalist'></datalist>
		`;
	let d = mDom(toElem(dParent));
	d.innerHTML = html;
	const inp = document.getElementById(id);
	const datalist = document.getElementById(optid);
	for (const w of list) { //} ['a', 'd', 'f', 's']) {
		mDom(datalist, {}, { tag: 'option', value: w });
	}
	if (allowEdit) {
		inp.addEventListener('keyup', ev => {
			if (ev.key === 'Enter') {
				let inp = ev.target;
				let dl = mBy('opt' + inp.id);
				let val = inp.value.toLowerCase();
				inp.value = '';
				const option = document.createElement('option');
				option.value = val;
				let i = 0;
				for (const el of arrChildren(dl)) {
					let v = el.value;
					//console.log('v', v);
					if (v == val) { break; } //console.log('found val', v); break; }
					else if (v > val) { mInsertAt(dl, option, i); break; }
					else if (el == dl.lastChild) mAppend(dl, option);
					i++;
				}
			}
		});
	}
	return d;
}
function _mDatalist(dParent, list, allowEdit = true) {
	let id = getUID('dl');
	let optid = 'opt' + id;
	console.log('id', id)
	let d = mDom(toElem(dParent));

	// let html = `
	// 	<input list="${optid}" class='datalistInput' id="${id}" placeholder="<enter value>">
	// 	<datalist id="${optid}" class='datalist'></datalist>
	// 	`;
	// d.innerHTML = html;
	// const inp = document.getElementById(id);
	// const datalist = document.getElementById(optid);

	const inp = mDom(d, {}, { tag: 'input', className: 'datalistInput', id: id, placeholder: "<enter value>" });
	const datalist = mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	inp.setAttribute('list', optid);

	console.log(inp, datalist); //return;

	for (const w of list) { //} ['a', 'd', 'f', 's']) {
		mDom(datalist, {}, { tag: 'option', value: w });
	}

	// return d;
	if (allowEdit) {
		inp.addEventListener('keyup', ev => {
			if (ev.key === 'Enter') {
				let inp = ev.target;
				let dl = mBy('opt' + inp.id);
				// console.log(inp,dl); return;
				let val = inp.value.toLowerCase();
				inp.value = '';
				const option = document.createElement('option');
				option.value = val;
				let i = 0;
				for (const el of arrChildren(dl)) {
					let v = el.value;
					//console.log('v', v);
					if (v == val) { break; } //console.log('found val', v); break; }
					else if (v > val) { mInsertAt(dl, option, i); break; }
					else if (el == dl.lastChild) mAppend(dl, option);
					i++;
				}
			}
		});
	}
	return d;
}

//#endregion combu

//#region test0
async function imgToDataUrl(src, h) {
	async function imageToDataURLAsync(src, h) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
			img.onload = function () {
				// Calculate new width and height while preserving aspect ratio
				const aspectRatio = img.width / img.height;
				const newHeight = h;
				const newWidth = aspectRatio * newHeight;
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

	try {
		const dataUrl = await imageToDataURLAsync(src, h);
		console.log('Image converted!'); // to dataUrl:', dataUrl);
		// Use the dataUrl as needed (e.g., display it in an image tag or send it to the server)
		return dataUrl;
	} catch (error) {
		console.error('Error converting image to dataUrl:', error);
		return null;
	}
}
function uploadImgSync(imgElem, cat, name) {
	const canvas = document.createElement('canvas');
	canvas.width = imgElem.width;
	canvas.height = imgElem.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(imgElem, 0, 0, canvas.width, canvas.height);
	canvas.toBlob((blob) => {
		const formData = new FormData();
		formData.append('image', blob, name + '.png');
		formData.append('category', cat);
		let url = `http://localhost:3000/upload`;
		fetch(url, {
			method: 'POST',
			mode: 'cors',
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

async function _resizeImage(img, newHeight) { //WORKS!
	return new Promise((resolve, reject) => {
		const aspectRatio = img.width / img.height;
		const newWidth = aspectRatio * newHeight;
		const canvas = document.createElement('canvas');
		canvas.width = newWidth;
		canvas.height = newHeight;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, newWidth, newHeight);
		const resizedDataURL = canvas.toDataURL('image/png');
		img.onload = function () { resolve(); };
		img.onerror = function (error) { reject(error); };
		img.src = resizedDataURL;
	});
}
async function _resizeImage(imageElement, imageSrc, newHeight) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = function () {
			const aspectRatio = img.width / img.height;
			const newWidth = aspectRatio * newHeight;

			// Create a canvas to draw the resized image
			const canvas = document.createElement('canvas');
			canvas.width = newWidth;
			canvas.height = newHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, newWidth, newHeight);

			// Convert the canvas content to data URL
			const resizedDataURL = canvas.toDataURL('image/png');

			// Set the image source to trigger the 'onload' event
			img.src = resizedDataURL;
			img.onload = function () {
				// Set the resized image data URL as the source of the image element
				imageElement.src = resizedDataURL;
				resolve();
			};
		};

		img.onerror = function (error) {
			reject(error);
		};

		// Set the image source to trigger the 'onload' event
		img.src = imageSrc;
	});
}

async function loadImageAndResize(img, src, h) {
	try {
		const imageUrl = src; // Replace with the path to your PNG image
		const targetHeight = h; // Desired height for the resized image
		await resizeImage(img, imageUrl, targetHeight);
		console.log('Image resized successfully.');
	} catch (error) {
		console.error('Error resizing image:', error);
	}
}

//***************** */
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


async function uploadImageToServer(dataUrl) {
  try {
    // Convert dataUrl to Blob (binary data)
    //dataUrl = 'data:image/png;base64,'+dataUrl;
    console.log('data',dataUrl.substring(0,100))
    const blobData = await fetch(dataUrl).then(response => response.blob());

    // Create FormData object and append the Blob data
    const formData = new FormData();
    formData.append('image', blobData, 'image.png'); // 'image' is the field name on the server

    // Send POST request to the server
    const response = await fetch('http://localhost:3000/save', {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', },
      body: formData,
    });

    // Handle the server response as needed
    const result = await response.json();
    console.log('Server Response:', result);
  } catch (error) {
    console.error('Error uploading image:', error);
  }
}

async function _uploadDataUrl(dataUrl) {
  console.log(dataUrl);
  const response = await fetch('http://localhost:3000/save', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify({ dataUrl }),
  });

  const result = await response.text();
  console.log(result);
}



//#************************************************************************************
function createImageFromDataURL(dataUrl) {
  const img = new Image();
  img.src = dataUrl;
  return img;
}

async function test1() {
  test0();
  //jetzt lade das file hoch zu nodejs
  imageToDataURLWithResizeHeight('../test0/ball1.png', 300, test1_weiter);
}
function test1_weiter(x) {
  console.log('habs gemacht!', x);


}
async function test0() {
  let d = mBy('dTest');
  mDom(d, { h: 200 }, { tag: 'img', src: '../test0/ball1.png' });
}

function imageToDataURLWithResizeHeight(src, h, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
  img.onload = function () {
    // Calculate new width and height while preserving aspect ratio
    const aspectRatio = img.width / img.height;
    const newHeight = h;
    const newWidth = aspectRatio * newHeight;

    const canvas = mDom('dTest', {}, { tag: 'canvas', id: 'canvas1' }); // document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, newWidth, newHeight);
    const dataUrl = canvas.toDataURL('image/png');
    callback(dataUrl);
  };
  img.src = src;
}

function imageToDataURL(src, callback) {
  const img = new Image();
  img.crossOrigin = "Anonymous"; // Enable cross-origin resource sharing (CORS) for the image
  img.onload = function () {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);
    const dataUrl = canvas.toDataURL('image/png');
    callback(dataUrl);
  };
  img.src = src;
}

function imageToDataURL_(file, callback) {
  const reader = new FileReader();
  reader.onloadend = function () {
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const dataUrl = canvas.toDataURL('image/png');
      callback(dataUrl);
    };
    img.src = reader.result;
  };
  reader.readAsDataURL(file);
}



//********************************************* */
async function test1() {
  //mBy('button1').addEventListener('click',saveCanvas)
  //window.onbeforeunload = function() {    return "Dude, are you sure you want to leave? Think of the kittens!";  }

  //console.log('test1.....')
  html2canvas(document.querySelector("#dTest")).then(canvas => {
    canvas.id = 'canvas1';
    document.body.appendChild(canvas);
  });

  let x = localStorage.getItem('hallo');
  if (isdef(x)) console.log(JSON.parse(x));
  // if (nundef(x))  test1(); else console.log(JSON.parse(x));
  localStorage.removeItem('hallo');
}

function onclickButton(ev) {
  // DA.TOTO=setInterval(function(){
  //   window.location.reload();
  //   window.stop();
  // },100)
  ev.preventDefault();
  let elem = mBy('canvas1');
  console.log('elem', elem);
  saveCanvas(ev);
  return false;
}

async function saveCanvas(ev) {
  ev.preventDefault();
  const canvas = document.getElementById('canvas1');
  const dataURL = canvas.toDataURL('image/png');
  const response = await fetch('http://localhost:3000/save', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ dataURL }),
  });

  const result = await response.json();
  console.log(result);
  localStorage.setItem('hallo', JSON.stringify(result));
}



//#endregion

//#region nodejs
app.post('/upload', //WORKS!!!!!!!
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files;
        //console.log(files);
				console.log(Object.keys(req).join('\n'));
				console.log('____________ BODY')
				console.log(Object.keys(req.body).join('\n'));
				console.log('____________ FILES');
				console.log(Object.keys(req.files).join('\n'));

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, '..','y', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)


app.get('/submit', (req, res) => {
  const base64data = req.query.data;
  const decodedData = Buffer.from(base64data, 'base64');//.toString('utf-8');
  console.log('Decoded Base64 Data:', decodedData);
	   // Specify the file path where you want to save the image
		 const filePath = path.join(__dirname, '..', 'y', 'image.png');

		 // Write the decoded data to the file
		 fs.writeFile(filePath, decodedData, 'base64', (err) => {
			 if (err) {
				 console.error(err);
				 res.status(500).json({ error: 'Error saving file' });
			 } else {
				 console.log('File saved successfully');
				 res.json({ message: 'Data processed and saved as image.png' });
			 }
		 });
	// const filePath = path.join(__dirname, 'saved_image.png');

	// fs.writeFile(filePath, base64Data, 'base64', (err) => {
	// 	if (err) {
	// 		res.status(500).json({ message: 'Error saving file' });
	// 	} else {
	// 		res.json({ message: 'File saved successfully' });
	// 	}
	// });
  // res.json({ message: 'Received and processed base64 data successfully' });
});

//#endregion

//#region mist
function ___mCropResizer(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight]; 
	console.log('w', worig, 'h', horig);
	console.log('dParent',dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	const centerBox = mDom(cropBox,{bg:'red',w:10,h:10,rounding:'50%',position:'absolute'});
	const bottomRightResizeHandle = mDom(cropBox,{left:worig,top:horig},{className:"resize-handle bottom-right"}); 

	let isCropping = false;
	let cropStartX;
	let cropStartY;

	let isResizing = false;

	function startResize(e) {
		e.preventDefault();evNoBubble(e);
		stopCrop();
		isResizing = true;
		document.addEventListener('mousemove', resize);
		document.addEventListener('mouseup', stopResize);
	}
	function resize(e) {
		e.preventDefault();evNoBubble(e);
		if (isResizing) {
			let x=e.clientX,y=e.clientY;

			const width = x; //initialWidth + (e.clientX - resizeStartX);
			const height = y; //initialHeight + (e.clientY - resizeStartY);
			img.style.width = `${width}px`;
			img.style.height = `${height}px`;
			bottomRightResizeHandle.style.left = `${width}px`;
			bottomRightResizeHandle.style.top = `${height}px`;
			dParent.style.width = `${width}px`;
			dParent.style.height = `${height}px`;
			cropBox.style.width = `${width}px`;
			cropBox.style.height = `${height}px`;

		}
	}
	function stopResize() {
		isResizing = false;
		document.removeEventListener('mousemove', resize);
		document.removeEventListener('mouseup', stopResize);
	}

	function startCrop(e) {
		e.preventDefault();
		stopResize();
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
			setRect(left,top,width,height);
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
			setRect(left,top,width,height);
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
        setRect(left,top,width,height);
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
	function finalize() {
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
	function getRect(){ return ['left','top','width','height'].map(x=>parseInt(cropBox.style[x]));}
	function setRect(left,top,width,height){
		cropBox.style.width = `${width}px`;
		cropBox.style.height = `${height}px`;
		cropBox.style.left = `${left}px`;
		cropBox.style.top = `${top}px`;
		messageBox.innerHTML = `size: ${width} x ${height}`;
		//let [cx,cy] = [(left+width)/2,(top+height)/2];
		mStyle(centerBox,{left:width/2-5,top:height/2-5});
		//cropBox.innerHTML = `size: ${width} x ${height}`;
		//mach roten punkt im center

		//console.log('new rect',left,top,width,height,width/2,height/2);


	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew,hnew){
		if (isList(wnew)) [wnew,hnew]=wnew;
		console.log('sz',wnew,hnew);
		if (wnew == 0 || hnew == 0){
			setRect(0,0,worig,horig);
			return;
		}
		let [x,y,w,h]=getRect(); 
		let [cx,cy] = [x+w/2,y+h/2];

		console.log('old rect',x,y,w,h,cx,cy);

		let [xnew,ynew]=[cx-(wnew/2),cy-(hnew/2)];


		setRect(xnew,ynew,wnew,hnew);

	}
	setRect(0,0,worig,horig);
	bottomRightResizeHandle.addEventListener('mousedown', startResize);
	cropBox.addEventListener('mousedown', startCrop);
	//addTool();

	return {
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		cropResize: finalize,
		// restart:restart,
		setSize: setSize,
		elem: cropBox,
	}
}
function mCropper(dParent, img, dButtons) {
	let [worig, horig] = [img.offsetWidth, img.offsetHeight]; 
	console.log('w', worig, 'h', horig);
	console.log('dParent',dParent)
	mStyle(dParent, { w: worig, h: horig, position: 'relative' });
	const cropBox = mDom(dParent, { position:'absolute',left:0, top:0, w: worig, h: horig }, { className: 'crop-box' });
	const messageBox = mDom(cropBox);
	const centerBox = mDom(cropBox,{bg:'red',w:10,h:10,rounding:'50%',position:'absolute'});
	let isCropping = false;
	let cropStartX;
	let cropStartY;


	function __restart(){
		stopCrop();
		mStyle(cropBox,{left:0,top:0,w:worig,h:horig});
		cropBox.innerHTML = `size: ${worig} x ${horig}`;
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
			setRect(left,top,width,height);
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
			setRect(left,top,width,height);
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
        setRect(left,top,width,height);
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
	function getRect(){ return ['left','top','width','height'].map(x=>parseInt(cropBox.style[x]));}
	function setRect(left,top,width,height){
		cropBox.style.width = `${width}px`;
		cropBox.style.height = `${height}px`;
		cropBox.style.left = `${left}px`;
		cropBox.style.top = `${top}px`;
		messageBox.innerHTML = `size: ${width} x ${height}`;
		//let [cx,cy] = [(left+width)/2,(top+height)/2];
		mStyle(centerBox,{left:width/2-5,top:height/2-5});
		//cropBox.innerHTML = `size: ${width} x ${height}`;
		//mach roten punkt im center

		console.log('new rect',left,top,width,height,width/2,height/2);


	}
	function show_cropbox() { cropBox.style.display = 'block' }
	function hide_cropbox() { cropBox.style.display = 'none' }
	function setSize(wnew,hnew){
		if (isList(wnew)) [wnew,hnew]=wnew;
		console.log('sz',wnew,hnew);
		if (wnew == 0 || hnew == 0){
			setRect(0,0,worig,horig);
			return;
		}
		let [x,y,w,h]=getRect(); 
		let [cx,cy] = [x+w/2,y+h/2];

		console.log('old rect',x,y,w,h,cx,cy);

		let [xnew,ynew]=[cx-(wnew/2),cy-(hnew/2)];


		setRect(xnew,ynew,wnew,hnew);

	}
	setRect(0,0,worig,horig);
	cropBox.addEventListener('mousedown', startCrop);
	//addTool();

	return {
		getRect: getRect,
		hide: hide_cropbox,
		show: show_cropbox,
		crop: cropImage,
		// restart:restart,
		setSize: setSize,
		elem: cropBox,
	}
}
function resizePreviewImage(dParent,img) {
	// const dParent = document.querySelector('.dParent');
	// const img = document.querySelector('.img');
	//const uploadButton = document.getElementById('uploadButton');
	//<div class="resize-handle top-left"></div>
	// <div class="resize-handle bottom-right"></div>
	const topLeftResizeHandle = mDom(dParent,{},{className:"resize-handle top-left"}); //document.querySelector('.resize-handle.top-left');
	const bottomRightResizeHandle = mDom(dParent,{},{className:"resize-handle bottom-right"}); //document.querySelector('.resize-handle.bottom-right');

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
async function _saveCanvas(ev) {
  ev.preventDefault();
  const canvas = document.getElementById('canvas1');
  const base64data = canvas.toDataURL('image/png');
  const encodedBase64 = encodeURIComponent(base64data);
  const queryString = `?data=${encodedBase64}`;
  const response = await fetch(`http://localhost:3000/submit${queryString}`, {
    method: 'GET',
    mode: 'cors',
  });

  const result = await response.text();
  console.log(result);
  localStorage.setItem('hallo',JSON.stringify(result));
  return false;
}



async function test0(){
  try {
    const element = document.getElementById('dTest'); // Replace 'your-element-id' with the actual ID of your HTML element
    const base64data = await htmlElementToBase64(element);
    console.log('Base64 Data URL:', base64data);
    // Do something with the base64 data URL
  } catch (error) {
    console.error('Error:', error);
  }
}

function htmlElementToBase64(element) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const rect = element.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const styles = window.getComputedStyle(element);
    const oldOverflow = styles.overflow;
    const oldPosition = styles.position;
    
    // Override styles to ensure the element is rendered correctly on the canvas
    element.style.overflow = 'visible';
    element.style.position = 'static';
    
    const elementClone = element.cloneNode(true);
    
    // Remove any potential IDs to prevent duplicates in the document
    elementClone.removeAttribute('id');
    
    const cloneContainer = document.createElement('div');
    cloneContainer.appendChild(elementClone);
    
    // Draw the element on the canvas
    const svg = new Blob([cloneContainer.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svg);
    console.log('url',url);
    const img = document.getElementById('result'); //new Image();
    img.src = url;
    return url;
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      // Get the base64 data URL from the canvas
      const base64data = canvas.toDataURL('image/png');
      // Revert overridden styles
      element.style.overflow = oldOverflow;
      element.style.position = oldPosition;
      // Clean up
      URL.revokeObjectURL(url);
      resolve(base64data);
    };
    
    img.onerror = (error) => {
      // Revert overridden styles
      element.style.overflow = oldOverflow;
      element.style.position = oldPosition;
      // Clean up
      URL.revokeObjectURL(url);
      reject(error);
    };
    
  });
}


//#endregion

//#region factory
function fetchFilenamesLocalhost(dir) {
	const directory = dir;
	if (!directory) {
		alert('Please enter a directory name.');
		return;
	}

	// Fetch filenames based on the user-entered directory
	fetch(`http://localhost:3000/filenames?directory=${directory}`, {
		method: 'GET',
		headers: { 'Content-Type': 'application/json' },
		mode: 'cors' // Set CORS mode to enable cross-origin requests
	})
		.then(response => response.json())
		.then(data => {
			return data;
		})
		.catch(error => console.error('Error:', error));
}
function fromOpenai() {
	const filenamesList = document.getElementById('filenames-list');
	const directoryInput = document.getElementById('directory-input');
	const fetchButton = document.getElementById('fetch-button');

	// Function to fetch filenames from the server and display them in the list
	const fetchFilenames = () => {
		const directory = directoryInput.value;
		if (!directory) {
			alert('Please enter a directory name.');
			return;
		}

		// Fetch filenames based on the user-entered directory
		fetch(`http://localhost:3000/filenames?directory=${directory}`)
			.then(response => response.json())
			.then(data => {
				filenamesList.innerHTML = ''; // Clear previous list
				data.files.forEach(filename => {
					const listItem = document.createElement('li');
					listItem.textContent = filename;
					filenamesList.appendChild(listItem);
				});
			})
			.catch(error => console.error('Error:', error));
	};

	fetchButton.addEventListener('click', fetchFilenames);

}
//#endregion
