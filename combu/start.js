
function resizeTo(tool, wnew, hnew) {
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	if (hnew == 0) hnew = img.height;
	if (wnew == 0) {
		let aspectRatio = img.width / img.height;
		wnew = aspectRatio * hnew;
	}
	redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function cropTo(tool, wnew, hnew) {
	//calc center
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
	let xnew = x + (wnew - w) / 2;
	let ynew = y + (hnew - h) / 2;
	redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function squareTo(tool, sznew=128) {
	let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
	let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
	if (sznew == 0) sznew = h;
	console.log('cropBox dims',x,y,w,h)
	let sz = Math.max(w,h)
	console.log('sz',sz)
	let [x1,y1]=[x-(sz-w)/2,y-(sz-h)/2];
	redrawImage(img, dParent, x1, y1, sz,sz, sznew, sznew, () => tool.setRect(0, 0, sznew, sznew))
}
function redrawImage(img,dParent,x,y,wold,hold,w,h,callback){
	console.log('ausschnitt:', x, y, wold, hold);
	let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, x, y, wold, hold, 0, 0, w, h);
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




onload = start

async function start() { test0(); }

async function test0() {
	let emos = M.emos = await mGetYaml('../assets/m.yaml');
	let cats = M.cats = collectCats(emos); cats.sort(); //console.log('cats', cats); 

	let d = mDom('dMain');
	mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, onDropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { console.log('H!'); ev.preventDefault(); return false; } });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })

	UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
	UI.dForm = dForm;
	UI.dButtons = mDom(dForm, { display: 'inline-block' });
	UI.imgCat = dl.inpElem;
	UI.imgName = inpName;

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
		let tool = UI.cropper = mCropResizePan(dParent, img);
		addToolX(tool,dButtons)
		// UI.cropTool = addCropTool(dButtons,img,UI.cropper.setSize);
		//resizePreviewImage(dParent,img);

		mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
		mButton('Restart', () => onDropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
	}
}
async function onclickUpload() {
	console.log('onclickUpload');
	let img = UI.img;
	let data = await uploadImg(img, rName(5), rUID('img'));
	console.log('uploaded', data)
}

