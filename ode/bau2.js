
function adjustCropper1(img, dc, sz) {
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });
}

function showImagePart(dParent,src,x,y,w,h){
	mClear(dParent);
	let [w,h]=[mGetStyle(dParent,'w'),mGetStyle(dParent,'h')];
	let canvas = mDom(dParent,{w,h,fill:'blue'},{tag:'canvas',width:w,height:h});
	return;

}
function showImagePart(image, x, y, w, h) {
	const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = w;
	canvas.height = h;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, 0, 0, w, h);
}

function imgZoomOut(img, dc, sz,wOrig,hOrig) { 
	let w = mGetStyle(dc, 'w'); 
	let h = mGetStyle(dc, 'h'); 
	console.log('__image',img.width,img.height);
	console.log('sz',sz,'orig',wOrig,hOrig)
	console.log(w,h)

	return;

	if (img.width == w || img.height == h) return; 
	else { 
		img.width = Math.max(img.width - 20, w); 
		img.width = Math.max(img.width - 20, w); 
		adjustCropper1(img, dc, sz); 
		return [img.width, img.height]; 
	} 
}








