
async function onclickZoomOut(o){
	let [dc,wOrig,hOrig,img,src,wCrop,hCrop,sz,pad,dpad,d]=[o.dc,o.wOrig,o.hOrig,o.img,o.src,o.wCrop,o.hCrop,o.sz,o.pad,o.dpad,o.d];

	//was genau will ich da?
	//wenn komplett zoomed out will ich das img voll sehen koennen auch wenn es NICHT das dc covered
	let [w,h]=[wCrop,hCrop];

	if (wOrig == hOrig){

	}


}

function showImagePartial(dParent,image, x, y, w, h, left,top,wShow, hShow) {

	mClear(dParent)
	let canvas = mDom(dParent,{},{tag:'canvas'});
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = wShow;
	canvas.height = hShow;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, 10, 10, wShow, hShow);
}

function showImagePart1(dParent,image, x, y, wShow, hShow) {

	mClear(dParent)
	let canvas = mDom(dParent,{},{tag:'canvas'});
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = w;
	canvas.height = h;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
}













