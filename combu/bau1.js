
function imgRotate90(dParent,img){

	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	// ctx.translate(img.height, 0)
	ctx.translate(0, img.width);
	ctx.rotate(-90 * Math.PI / 180);

	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	return canvas;


}

function allDarkPoints(ctx, w, dims) {
	let [y, xmin, top, bot] = [dims.y, dims.xmin, dims.top, dims.bot];
	let xlist = [];
	let n = 243; xmin = 120; //y -= 5;
	for (let x = 0; x < w; x++) { if (isPixDark(ctx, x, y)) { xlist.push(x); } }
	//console.log('list', xlist);
	//xlist.map(x => { drawPix(ctx, x, y, 'red', 2) });
	let diffs = [];
	for (let i = 0; i < xlist.length - 1; i++) {
		if (xlist[i] < xmin) continue;
		// if (isLightBefore(ctx, xlist[i], y)) { console.log('YES!', xlist[i]) } else { console.log('NO', xlist[i]); continue; }
		if (!isLightBefore(ctx, xlist[i], y)) continue;
		for (let j = i + 1; j < xlist.length; j++) {
			let pix = xlist[j];
			// if (isLightAfter(ctx, pix, y)) { console.log('YES!', pix) } else { console.log('NO', pix); continue; }
			if (!isLightAfter(ctx, pix, y)) continue;
			let d = xlist[j] - xlist[i];
			diffs.push({ i: i, j: j, d: d })
			//console.log('d', xlist[i], xlist[j], d)
			if (d >= n - 2 && d <= n + 2) { //} 243){
				//console.log('X BINGO!!!!!!!!!!!!!!!!!!!', xlist[i], xlist[y], y)
				let doben = xlist[i] - xlist[i - 1]; console.log('doben=' + doben)
				let dunten = arrLast(xlist) - xlist[j]; console.log('dunten=' + dunten)

				let test90 = pixTest90(ctx, y, xlist[i] - top, xlist[j] + bot);
				rot = test90 ? 90 : -90;
				xstart = test90 ? xlist[i] - top : xlist[i] - bot;
				xend = test90 ? xlist[j] + bot : xlist[j] + top;

				drawPix(ctx, xlist[i], y, 'green')
				drawPix(ctx, xlist[j], y, 'green')
				return [xstart, xlist[i], xlist[j], xend, xlist, rot]
			}
		}
	}
	console.log('diffs', diffs)
	return [0, 0, w, w, xlist, 0];
}
function calcBoundsY(ctx, x, h, n = 261) {
	let ystart = -1, yend = -1, y, countlines = 0, prevy = [], ymin = 0, hbound = h - 20;
	let isRotated = false;
	let y1, y2;
	let gotit = false;

	for (y = ymin; y < h; y++) {
		if (gotit) {
			let wt = isPixWhiteOrTransparent(ctx, x, y);

			if (wt) return [ystart, y1, y2, y - 1, isRotated, prevy];
		}
		if (isPixDark(ctx, x, y)) {
			if (isDarkLine(ctx, x, y, h, y < h / 2, y > h / 2)) {

				if (gotit) {
					console.log('====>y', y)
					return [ystart, y1, y2, y, isRotated];
				}

				ctx.fillStyle = 'black';
				yother = null;
				for (const py of prevy) {
					let dy = y - py;
					// console.log('dy', dy)
					if (dy > n - 3 && dy < n + 3) {
						gotit = true;
						isRotated = true;
						y1 = yother = py;
						y2 = y;
						console.log('BINGO!!!! zweites middle ding');
						ctx.fillStyle = 'red';
					}
				}
				prevy.push(y);
				// console.log('______', countlines++, y);
				ctx.fillRect(x - 2, y - 2, 5, 5);
				if (yother) {
					ctx.fillRect(x - 2, yother - 2, 5, 5);
					let i1 = prevy.indexOf(y1);
					console.log('i1', i1)
					ystart = i1 > 0 ? prevy[i1 - 1] : 0;
				}

				// if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; }
				y += 5;
			}
		}
	}
	return [ystart, y1, y2, h, isRotated, prevy];
}
function drawPix(ctx, x, y, color = 'red', sz = 5) {
	ctx.fillStyle = color;
	ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function isDarkLine(ctx, x, y, h, before = true, after = true) {
	let almost1 = false, almost2 = false;
	let d = 3;
	if (before) {
		for (let yy = Math.max(0, y - d); yy < y; yy++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, yy, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost1 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost1 = true;
	if (after) {
		for (let yy = y + 1; yy < Math.min(y + 5, h); yy++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, yy, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost2 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost2 = true;
	return almost1 && almost2;
}
function isDarkBar(ctx, x, y, w, before = true, after = true) {
	let almost1 = false, almost2 = false;
	let d = 3;
	if (before) {
		for (let xx = Math.max(0, x - d); xx < x; xx++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(xx, y, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost1 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost1 = true;
	if (after) {
		for (let xx = x + 1; xx < Math.min(x + 5, w); xx++) { //Math.min(y+5,h);yy++)	{
			let p = ctx.getImageData(x, xx, 1, 1).data;
			if (p[0] + p[1] + p[2] > 520) almost2 = true;
			// console.log(p[0],p[1],p[2]);
		}
	} else almost2 = true;
	return almost1 && almost2;
}
function isLightAfter(ctx, x, y) {
	for (let p = x + 1; p < x + 4; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightBefore(ctx, x, y) {
	for (let p = x - 4; p < x - 1; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isPixDark(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return green < 100 && blue < 100;
}
function isPixLight(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return red + green + blue > 520;
}
function isPixWhiteOrTransparent(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	//console.log('pix',red,green,blue,red + green + blue > 3*250)
	return red + green + blue > 3 * 250;
}
function pixShow(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	console.log('pix', x, y, red, green, blue, red + green + blue, isPixDark(ctx, x, y));
	if (isPixDark(ctx, x, y)) {
		drawPix(ctx, x, y);
		return true;
	}
	return false;
}
function pixTest90(ctx, y, x1, x2) {
	let x1ja = false, x2ja = false;
	// for (let x = x1 - 2; x <= x1 + 2; x++) if (isPixDark(ctx, x, y) && isLightAfter(ctx,x,y)) x1ja = true;
	for (let x = x1 - 2; x <= x1 + 2; x++) if (x == 0 || isPixDark(ctx, x, y)) x1ja = true;
	for (let x = x2 - 2; x <= x2 + 2; x++) if (isPixDark(ctx, x, y)) x2ja = true;
	return x1ja && x2ja; // isPixDark(ctx,x1,y) && isPixDark(ctx,x2,y)
}






































function mist() {

	//return;
	let dir = 'portrait';
	let rotate = img.width > img.height;
	//let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	//jetzt kommt der echte canvas!
	[iw, ih, cw, ch] = [xend - xstart, yend - ystart, yend - ystart, xend - xstart];
	let cv1 = mDom(dParent, { maleft: 20, border: 'green' }, { tag: 'canvas', id: 'cv1', width: cw, height: ch });
	let ct1 = cv1.getContext('2d');
	if (rotate) {
		if (rot == 90) { ct1.translate(cv1.width, 0); } else { ct1.translate(0, ch); }
		ct1.rotate(rot * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
	}
	//ctx.translate()
	ct1.drawImage(img, xstart, ystart, cv1.height, cv1.width, 0, 0, yend - ystart - 20, cv1.width);





}
async function ___present(name, color, idx, rot) {
	let path = `../assets/games/nations/cards/${name}.jpg`;
	let [hImg, wImg, border, diff] = [200, 300, 10, 10];
	let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	let dir = 'portrait';
	let rotate = img.width > img.height;
	let dView = 'dMain';

	let dParent = toElem(dView);
	//mClear(dParent);
	let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w - diff, height: h - diff });
	let ctx = canvas.getContext('2d');
	ctx.lineWidth = border;
	ctx.strokeStyle = color;
	console.log('rot', rot)
	if (rot == 90) cvRot90(img, canvas, ctx, w, h, border, diff);
	else if (rot == -90) cvRot270(img, canvas, ctx, w, h, border, diff);
	//await imgToServer(canvas,`combu/${name}.png`);
	//await mSleep(1000);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
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

async function __present(name, color, idx, rot) {
	//do this for each card:
	//if (isdef(mBy('img1'))) mBy('img1').remove();
	//let name = `age1_aeneid`;
	let path = `../assets/games/nations/cards/${name}.jpg`;

	let hImg = 200, wImg = 310;
	let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	console.log('img', img)

	let dir = 'portrait';
	let rotate = img.width > img.height;
	let dView = 'dMain';

	let dParent = toElem(dView);
	//mClear(dParent);
	let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	// let canvas = mDom(dParent, { border: '10px solid yellow', box:true }, { tag: 'canvas', id: 'canvas',width: w, height: h });
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w - 4, height: h - 6 });

	let ctx = canvas.getContext('2d');
	console.log('rot', rot)
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
		ctx.translate(canvas.width, 0); //-canvas.height/2) //img.width);
		ctx.rotate(rot * Math.PI / 180); //ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-8, 6) //erstes:- verschiebt nacht oben, zweites: + verschiebt nach links
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = color;
		ctx.rect(12, 5, img.width - 15, img.height - 20) //15, -4, 290, 180);
		// ctx.rect(15, -4, 290, 180);
		ctx.stroke();
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}

	//await imgToServer(canvas,`combu/${name}.png`);
	//await mSleep(1000);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);


	//let cv = imgAsCanvas(img,'dMain');
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





async function onclickNATIONS() {
	//show civ japan
	showTitle('NATIONS!!!');
	await loadImageAsync('../assets/games/nations/civs/civ_japan.png', mDom('dMain', {}, { tag: 'img' }));



}



















