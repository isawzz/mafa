async function natModCard(name, color, idx, dims) { //}, rot, ybound, xbound, yextra, xendbd) {
	let path = `../assets/games/nations/cards/${name}`; //.jpg`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height];
	if (w>h) return natModCardLandscape(dParent,img,name,color,idx,dims,w,h); 
	else return natModCardPortrait(dParent,img,name,color,idx,dims,w,h); 
}
function natModCardLandscape(dParent,img,name,color,idx,dims,w,h){
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, w, h);

	let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
	let y1, y2, x1, x2, prevy, prevx;
	let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
	console.log('resY', resy,prevy)

	let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims); //return;
	console.log('resX', resx)
	//let resx=[xstart,x1,x2,xend,isRotated,prevx]=calcBoundsX(ctx, 80, w, 243);

	//console.log('bounds X',resx)

	// console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
	console.log('wsmall', wsmall, 'hsmall', hsmall)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart, w, h);

	//let border=10;
	//let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
	// let cv2 = mDom('dMain', { 'box-shadow':`inset 0 0 10px 20px red`,border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	// let cv2 = mDom('dMain', { box:true, border:'10px solid yellow', rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
	let ct2 = cv2.getContext('2d');
	ct2.drawImage(img, -xstart, -ystart, w, h);
	//drawRoundedRect(ct2,0,0,wsmall,hsmall,12,color,null,20);
	ct2.strokeStyle = color;
	ct2.lineWidth = 20;
	ct2.rect(0, 0, wsmall, hsmall);
	ct2.stroke();

	return cv2;

	//next: draw rotated!

}
function natModCardPortrait(dParent,img,name,color,idx,dims,w,h){
	console.log('w',w,'h',h);
	//strategie:
	//1. nimm 1 model card und mach die ideal measures
	//2. aus model card mach auch eine empty vorlage (das kann ich eigentlich ruhig haendisch machen!)
	//3. eine liegende die ganz erwischt wurde
	//1. measure the inner pic
	//2. 
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, w, h);
	return null;

	let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
	let y1, y2, x1, x2, prevy, prevx;
	let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
	console.log('resY', resy)

	let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims); //return;
	console.log('resX', resx)
	//let resx=[xstart,x1,x2,xend,isRotated,prevx]=calcBoundsX(ctx, 80, w, 243);

	//console.log('bounds X',resx)

	// console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
	console.log('wsmall', wsmall, 'hsmall', hsmall)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart, w, h);

	//let border=10;
	//let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
	// let cv2 = mDom('dMain', { 'box-shadow':`inset 0 0 10px 20px red`,border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	// let cv2 = mDom('dMain', { box:true, border:'10px solid yellow', rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
	let ct2 = cv2.getContext('2d');
	ct2.drawImage(img, -xstart, -ystart, w, h);
	//drawRoundedRect(ct2,0,0,wsmall,hsmall,12,color,null,20);
	ct2.strokeStyle = color;
	ct2.lineWidth = 20;
	ct2.rect(0, 0, wsmall, hsmall);
	ct2.stroke();

	return cv2;

	//next: draw rotated!

}













