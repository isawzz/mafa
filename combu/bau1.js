function drawPix(ctx, x, y, color = 'red', sz = 5) {
	ctx.fillStyle = color;
	ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
	ctx.strokeStyle = color;
	ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
}
function findEdgeHor(ctx,x1,x2,h,cgoal,lighting=true){
	let [list, _] = findPoints(ctx, x1, x2, 0, h, cgoal, 20); 
	if (lighting) list = list.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
	let vfreq = findMostFrequentVal(list, 'x'); 
	return list.filter(o => o.x == vfreq);
}
function findEdgeVert(ctx,y1,y2,w,cgoal,lighting=true){
	let [_, list] = findPoints(ctx, 0, w, y1, y2, cgoal, 20); 
	let vfreq = findMostFrequentVal(list, 'y'); 
	return list.filter(o => o.y == vfreq);
}
function findEdgesApart(list, dx, dy, prop) {
	list.map(o => o.nei = findPointAtDistance(o, dx, dy, list, 10))
	//console.log(list)
	list = list.filter(o => o.nei)

	let vfreq = findMostFrequentVal(list, prop); console.log(prop, vfreq)
	let good = list.filter(o => isWithinDelta(o[prop], vfreq, 3));
	let rest = list.filter(o => !isWithinDelta(o[prop], vfreq, 3));
	vfreq = findMostFrequentVal(rest, prop); console.log(prop, vfreq)
	let good2 = list.filter(o => o[prop] == vfreq);
	list = good.concat(good2);
	return list;
}
function findMostFrequentVal(arr,prop,delta=0) {
	if (!Array.isArray(arr) || arr.length === 0) {
		return null; 
	}
	let frequencyMap = new Map();
	for (let i = 0; i < arr.length; i++) {
		const val = arr[i][prop];
		frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
	}
	let mostFrequentY;
	let maxFrequency = 0;
	for (let [val, frequency] of frequencyMap) {
		if (frequency > maxFrequency) {
			mostFrequentY = val;
			maxFrequency = frequency;
		}
	}
	return mostFrequentY;
}
function findPoints(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	let p;
	let resy = [], resx = [];
	cgoal = colorRGB(cgoal, true);
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			p = isPixDark(ctx, x, y, cgoal, delta);
			if (p) {
				let l = isLightBeforeV(ctx, x, y);
				let d = isLightAfterV(ctx, x, y);
				if (l || d) resy.push({ x, y })
				l = isLightBefore(ctx, x, y);
				d = isLightAfter(ctx, x, y);
				if (l || d) resx.push({ x, y })
			}
		}
	}

	return [resx, resy];
}
function findPointsBoth(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	let p;
	let resy = [], resx = [];
	cgoal = colorRGB(cgoal, true);
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			p = isPixDark(ctx, x, y, cgoal, delta);
			if (p) {
				let l = isLightBeforeV(ctx, x, y);
				let d = isLightAfterV(ctx, x, y);
				if (l && d) resy.push({ x, y })
				l = isLightBefore(ctx, x, y);
				d = isLightAfter(ctx, x, y);
				if (l && d) resx.push({ x, y })
			}
		}
	}

	return [resx, resy];
}
function findPointAtDistance(pt, dx, dy, list, delta = 0) {
	for (const p1 of list) {
		if (isWithinDelta(Math.abs(pt.x - p1.x), dx, delta) && isWithinDelta(Math.abs(pt.y - p1.y), dy, delta)) return p1;
	}
	return null;
}
function findRectSample(ctx, x1, x2, y1, y2, cgoal, sz = 4, lightCounts = false) {
	let p;
	cgoal = colorRGB(cgoal, true);
	for (let yStart = y1; yStart <= y2; yStart += sz) {
		for (let xStart = x1; xStart <= x2; xStart += sz) {
			let found = true;
			for (let x = xStart; x < xStart + sz; x++) {
				for (let y = yStart; y < yStart + sz; y++) {
					p = isPix(ctx, x, y, cgoal, 20); 
					if (lightCounts && isPix(ctx, x, y, 'white', 10)) p = true;
					if (!p) { found = false; break; }
				}
				if (!found) break;
			}
			if (found) return true; 
		}
	}
	return false; 
}
function getPixRgb(ctx, x, y) {
	var pix = ctx.getImageData(x, y, 1, 1).data;
	var red = pix[0]; var green = pix[1]; var blue = pix[2];
	return { r: red, g: green, b: blue };
}
async function imgAsync(dParent, styles, opts) {
	let path = opts.src;
	delete opts.src;
	addKeys({ tag: 'img' }, opts); //if forget

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
function isBetween(n, a, b) { return n >= a && n <= b }
function isLightAfter(ctx, x, y) {
	for (let p = x + 1; p < x + 4; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightBefore(ctx, x, y) {
	for (let p = x - 4; p < x - 1; p++) if (isPixLight(ctx, p, y)) return true;
	return false;
}
function isLightAfterV(ctx, x, y) {
	for (let p = y + 1; p < y + 5; p++) if (isPixLight(ctx, x, p)) return true;
	return false;
}
function isLightBeforeV(ctx, x, y) {
	for (let p = y - 4; p < y - 1; p++) if (isPixLight(ctx, x, p)) return true;
	return false;
}
function isPix(ctx, x, y, color, delta=10) {
	let rgb = isString(color) ? colorRGB(color, true) : color;
	let p = getPixRgb(ctx, x, y);
	let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
	return found?p:null;
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
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }

async function natDetectBB(card,dParent){
	dParent = toElem(dParent);
	let path = `../assets/games/nations/cards/${card.Path}`;
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img' })
	let [w, h] = [img.width, img.height]; //console.log('w', w, 'h', h);
	//return 
	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);

	//event: 6C4F64
	// let edgecolor=type=='event'?'#382428':'#59544E'; //'#544744';
	let edgecolor=card.Type=='event'?'#6C4F64':'#59544E'; //'#544744';
	let lightcolor=card.Type=='event'?'#E7BB97':'#DBCEBE';
	let [rect,tmiss,bmiss,lmiss,rmiss]=calcBoundingBox(ctx,w,h,edgecolor,lightcolor);

	let cv1 = mDom(dParent, {}, { tag: 'canvas', width: rect.w, height: rect.h });
	let ct1 = cv1.getContext('2d', { willReadFrequently: true });
	ct1.drawImage(img,-rect.left,-rect.top);

	//jetzt hol ich mir das empty sample
	// img.remove();canvas.remove();

	return [rect,cv1,ct1,tmiss,bmiss,lmiss,rmiss];
}
async function natGetEmptyCardCanvas(dParent){
	dParent = toElem(dParent);
	if (nundef(DA.eimg)){
		DA.eimg = await imgAsync(dParent, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
		mDom(dParent,{h:10});
		//console.log('w', DA.eimg.width, 'h', DA.eimg.height);
	}
	let eimg = DA.eimg;
	let [w, h] = [eimg.width, eimg.height];
	let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(eimg, 0, 0, w, h);
	return [canvas,ctx,w,h];
}
