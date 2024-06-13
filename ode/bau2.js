
async function onclickSaveCropData() {
	let o = UI.zoomo;
	let pd = UI.panData;
	console.log(o,pd); return;
	let [d,img,wOrig,hOrig,sz,fa,famin]=[o.d,o.img,o.wOrig,o.hOrig,o.sz,o.fa,o.famin];
	if (fa>=1) {console.log('cant zoom in more!!!',fa); return;}
	fa*=1.5;if (fa>1)fa=1; UI.fa=fa;
	showImgCentered(d,img,wOrig,hOrig,sz,fa,famin);

}


function showImgCentered(d,img,wOrig,hOrig,sz,fa,famin){
	UI.zoomo={d,img,wOrig,hOrig,sz,fa,famin};
  let wsc=wOrig*fa, hsc=hOrig*fa; console.log('fa',fa);

	let [xwo,ywo]=[(sz-wsc)/2,(sz-hsc)/2]

  showImagePartial(d, img, 0,0,wOrig,hOrig,xwo,ywo,wsc,hsc, sz, sz, wOrig,hOrig); //, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);
	let szCrop = sz-100;
  let dc = mDom(d, { position: 'absolute', left: (sz-szCrop) / 2, top: (sz-szCrop) / 2, w: szCrop, h: szCrop, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
}
async function onclickZoomIn() {
	let o = UI.zoomo;
	let [d,img,wOrig,hOrig,sz,fa,famin]=[o.d,o.img,o.wOrig,o.hOrig,o.sz,o.fa,o.famin];
	if (fa>=1) {console.log('cant zoom in more!!!',fa); return;}
	fa*=1.5;if (fa>1)fa=1; UI.fa=fa;
	showImgCentered(d,img,wOrig,hOrig,sz,fa,famin);

}
async function onclickZoomOut() {
	let o = UI.zoomo;
	let [d,img,wOrig,hOrig,sz,fa,famin]=[o.d,o.img,o.wOrig,o.hOrig,o.sz,o.fa,o.famin];
	if (fa*wOrig<=sz && fa*hOrig<=sz) {console.log('cant zoom out more!!!',wOrig,hOrig,fa, fa*wOrig,fa*hOrig,sz); return;}
	fa*=0.5;if (fa<famin) fa = famin; UI.fa=fa;
	showImgCentered(d,img,wOrig,hOrig,sz,fa,famin);

}

function showImagePartial(dParent, image, x, y, w, h, left, top, wShow, hShow, wCanvas, hCanvas) {

	mClear(dParent)
	let canvas = mDom(dParent, {}, { tag: 'canvas' }); //console.log('left', left, 'top', top)
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = wCanvas;
	canvas.height = hCanvas;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, left, top, wShow, hShow);
}
function startPanning(ev) {
	console.log('_________startPanning!')
	const panData = {};
	function panStart(ev) {
		evNoBubble(ev);
		assertion(nundef(panData.panning), panData)
		let dc = panData.dCrop = ev.target;
		panData.cropStartSize = { w: mGetStyle(dc, 'w'), h: mGetStyle(dc, 'h') }
		panData.cropStartPos = { l: mGetStyle(dc, 'left'), t: mGetStyle(dc, 'top') }
		panData.elParent = panData.dCrop.parentNode;
		panData.img = panData.elParent.querySelector('img, canvas');//console.log('img',panData.img);
		panData.panning = true;
		panData.counter = -1;
		panData.mouseStart = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		panData.posStart = { x: mGetStyle(dc, 'left'), y: mGetStyle(dc, 'top') };
		addEventListener('mouseup', panEnd);
		panData.elParent.addEventListener('mousemove', panMove);
		console.log('panStart!', panData.mouseStart);
	}
	function panMove(ev) {
		evNoBubble(ev);
		if (!panData.panning || ++panData.counter % 3) return;
		panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		let [x, y] = [panData.posStart.x, panData.posStart.y];
		let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
		[dx, dy] = [Math.round(dx / 10) * 10, Math.round(dy / 10) * 10];
		adjustComplex(panData)
	}
	function panEnd(ev) {
		assertion(panData.panning == true);
		let d = evToClass(ev, 'imgWrapper');
		if (d == panData.elParent) {
			evNoBubble(ev);
			panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
			console.log('SUCCESS!', panData.mouse)
		}
		removeEventListener('mouseup', panEnd);
		panData.elParent.removeEventListener('mousemove', panMove);
		panData.panning = false;
		console.log('* THE END *', panData)
		UI.panData = panData;
	}
	panStart(ev);
}



















function _showImagePart1(dParent, image, x, y, wShow, hShow) {

	mClear(dParent)
	let canvas = mDom(dParent, {}, { tag: 'canvas' });
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = w;
	canvas.height = h;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
}
async function _onclickZoomOut() {
	let o = UI.zoomo;
	let [d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig] = [o.d, o.img, o.xi, o.yi, o.wi, o.hi, o.dx, o.dy, o.wCrop, o.hCrop, o.wCanvas, o.hCanvas, o.wOrig, o.hOrig];
	let fa = o.fa;

	if (wi >= wOrig || hi >= hOrig) { console.log(`can't zoom out`); return; }

	//wenn komplett zoomed out will ich das img voll sehen koennen auch wenn es NICHT das dc covered
	let [w, h] = [wCrop, hCrop];
}
async function _onclickZoomIn() {
	let o = UI.zoomo;
	let [d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig] = [o.d, o.img, o.xi, o.yi, o.wi, o.hi, o.dx, o.dy, o.wCrop, o.hCrop, o.wCanvas, o.hCanvas, o.wOrig, o.hOrig];
	let fa = o.fa;
	if (wi <= wCrop || hi <= hCrop) { console.log(`can't zoom in`); return; }

	console.log('fa',fa)
	fa=Math.min(1,fa+.1);
	let [wshow,hshow]=[wOrig*fa,hOrig*fa];
	[xi, yi, wi, hi, wCrop, hCrop] = [0, 0, wOrig, hOrig, wOrig * fa, hOrig * fa];

	//if (fa)
	
	showImagePartial(d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);

}
function mist(){	
	let [d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig] = [o.d, o.img, o.xi, o.yi, o.wi, o.hi, o.dx, o.dy, o.wCrop, o.hCrop, o.wCanvas, o.hCanvas, o.wOrig, o.hOrig];
	let fa = o.fa;
	if (wi <= wCrop || hi <= hCrop) { console.log(`can't zoom in`); return; }

	console.log('fa',fa)
	fa=Math.min(1,fa+.1);
	let [wshow,hshow]=[wOrig*fa,hOrig*fa];
	[xi, yi, wi, hi, wCrop, hCrop] = [0, 0, wOrig, hOrig, wOrig * fa, hOrig * fa];

	//if (fa)
	
	showImagePartial(d, img, xi, yi, wi, hi, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);

}
















