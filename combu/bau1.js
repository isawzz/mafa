async function present(name, color, idx, rot, ybound, xbound,yextra,xendbd) {
	let path = `../assets/games/nations/cards/${name}.jpg`;
	let [hImg, wImg, border, diff] = [rot?200:300, rot?300:200, 10, 10];
	// let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	let dParent = toElem('dExtra');

	let img = await imgAsync(dParent, { h: hImg, w: wImg }, { height: hImg, width: wImg, src: path, tag: 'img', id: 'img' + idx })
	//mClear(dParent);
	let [w, h] = [img.width, img.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, w, h);//ctx.drawImage(img, -13,-2,w,h);

	let [xstart, ystart, xend, yend] = calcRealBoundaries(ctx, w, h, ybound,xbound,yextra,xendbd);
	console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let [wsmall, hsmall] = [xend - xstart + 1, yend - ystart +1];
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart, w, h);

	//let border=10;
	//let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
	let cv2 = mDom('dMain', { border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
	let ct2 = cv2.getContext('2d');
	ct2.drawImage(img, -xstart, -ystart, w, h);



}
function calcRealBoundaries(ctx, w, h, ybound = true, xbound = true,yextra=false,xendbd=true) {
	var x = 150; // replace with the desired x-coordinate
	let ystart = -1, yend = -1, y;
	let hbound = ybound?h-20:h-35;
	let wbound = xbound?w-20:w-35;
	let ymin=yextra?10:0;
	if (yextra) hbound+=10;
	let countlines=0;
	let prevy=[];

	console.log('ymin',ymin)
	for (y = ymin; y < h; y++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) { 

			let almost1=false,almost2=false;

			//almost1 wird gebraucht wenn
			for(let yy=Math.max(0,y-3);yy<y;yy++){ //Math.min(y+5,h);yy++)	{
				let p=ctx.getImageData(x, yy, 1, 1).data;
				if (p[0]+p[1]+p[2] > 520) almost1=true;
				// console.log(p[0],p[1],p[2]);
			}
			for(let yy=y+1;yy<Math.min(y+5,h);yy++){ //Math.min(y+5,h);yy++)	{
				let p=ctx.getImageData(x, yy, 1, 1).data;
				if (p[0]+p[1]+p[2] > 520) almost2=true;
				// console.log(p[0],p[1],p[2]);
			}

			if (almost1 && almost2) {
				ctx.fillStyle = 'black'
				for(const py of prevy){
					let dy=y-py;
					console.log('dy',dy)
					if (dy>152 && dy<158) {console.log('BINGO!!!! zweites middle ding'); ctx.fillStyle='red';} 
				}
				prevy.push(y); 
				console.log('______',countlines++,y);
				ctx.fillRect(x-2,y-2,5,5);
				if (ystart < 0) ystart = y; else if (y > hbound) { yend = y; break; } 
				y+=10;
			}
		}
	}
	if (!ybound) ystart = 0;
	if (yextra) yend = h;

	y = 100; // replace with the desired x-coordinate
	let xstart = -1, xend = -1;
	for (x = 0; x < w; x++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;
		var red = pix[0]; var green = pix[1]; var blue = pix[2];
		if (green < 100 && blue < 100) if (xstart < 0) xstart = x; else if (x > wbound) { xend = x; break; }
	}
	if (!xbound) xstart = 0;
	if (!xendbd) xend = w;
	// console.log('fromto:',xstart,xend);
	return [xstart + 2, ystart + 2, xend - 1, yend - 2];
}
function weiterImagePresent(name, color, idx, rot) {

	// Get the pixel color at coordinates (x, y)
	var x = 100; // replace with the desired x-coordinate
	let ystart = -1, yend = -1, y;
	for (y = 0; y < h; y++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;

		//console.log('pixelData',y, pix[0], pix[1], pix[2]); //Array.from(pixelData).map(x=>console.log(x));
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) if (ystart < 0) ystart = y; else if (y > 170) { yend = y; break; }


		// Display the color in the console
		//console.log('Pixel color at (' + x + ',' + y + '): RGB(' + red + ',' + green + ',' + blue + ')');
	}
	console.log('fromto:', ystart, yend)

	y = 100; // replace with the desired x-coordinate
	let xstart = -1, xend = -1;
	for (x = 0; x < w; x++) {
		var pix = ctx.getImageData(x, y, 1, 1).data;

		//console.log('pixelData',y, pix[0], pix[1], pix[2]); //Array.from(pixelData).map(x=>console.log(x));
		var red = pix[0]; var green = pix[1]; var blue = pix[2];

		if (green < 100 && blue < 100) if (xstart < 0) xstart = x; else if (x > 280) { xend = x; break; }


		// Display the color in the console
		//console.log('Pixel color at (' + x + ',' + y + '): RGB(' + red + ',' + green + ',' + blue + ')');
	}
	console.log('fromto:', xstart, xend);

	//ohne rotation!
	// [w,h]=[xend-xstart,yend-ystart];
	// console.log('xstart='+xstart,'xend='+xend,'ystart='+ystart,'yend='+yend,'w='+w,'h='+h)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: w, height: h });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, -xstart, -ystart); //, w,h); //, 0,0,w,h); //,w,h);

}
function toCanvasDraw(img, xstart, xend, ystart, yend) {
	//ohne rotation!
	[w, h] = [xend - xstart, yend - ystart];
	console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
	let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: w, height: h });
	let ct1 = cv1.getContext('2d');
	ct1.drawImage(img, xstart, ystart, w, h, 0, 0, w, h); //,w,h);

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






async function onclickNATIONS() {
	//show civ japan
	showTitle('NATIONS!!!');
	await loadImageAsync('../assets/games/nations/civs/civ_japan.png', mDom('dMain', {}, { tag: 'img' }));



}



















