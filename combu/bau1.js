function drawPix(ctx, x, y, color = 'red', sz = 5) {
	ctx.fillStyle = color;
	ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
	ctx.strokeStyle = color;
	ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
}
function findDarkBars(ctx, w, h, cgoal, diffleft, diffright) {
	let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 100 && i < colors.length) {
		let color = colors[i++];
		let o = nextBar(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	console.log('result',res);
	let diff = 243;

	let cand = res.filter(o=>o.val>=40 && o.val<=500); // res[0].val<40?res.slice(1):res;
	let [kleinere, groessere] = findMidlines(cand,diff); //res.slice(1,res.length-2), diff); //erste und letzte weg!

	let topmost, bottommost;
	for (const l3 of res) {
		let distleft = kleinere.val - l3.val; //Math.abs(kleinere.val - l3.val);
		let distright = l3.val-groessere.val;
		//console.log(l3.val, l3.color, distleft, distright)
		if (isWithinDelta(distleft, diffleft, 2)) {
			//console.log('found left', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(distright, diffright, 2)) {
			//console.log('found right', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? w : bottommost.val]
	//let lyellow = res[0];
	//let lblue = res.find(l => l.color == 'blue');
	//console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
	//24 ist der untere abstand!

}
function findDarkLines(ctx, w, h, cgoal) {
	let [_, restlist] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let y, num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue','crimson','seagreen','skyblue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (i < colors.length) {
		let color = colors[i++];
		let o = nextLine(ctx, restlist, color);
		if (!o.line) {console.log('o',o); break;}
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		if (num>112) res.push(o)
	}
	console.log('result',res);
	let diff = 261, diff2 = 22;

	//discard lines under 100

	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		if (isWithinDelta(kleinere.val - l3.val, diff2, 2)) {
			//console.log('found oberstes', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(l3.val-groessere.val, diff2, 2)) {
			//console.log('found unterstes', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? h : bottommost.val]
	// let lyellow = res[0];
	// let lblue = res.find(l => l.color == 'blue');
	// console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
	//24 ist der untere abstand!

}
function findMidlines(res, diff) {
	let mid1, mid2;
	for (const l1 of res) {
		for (const l2 of res) {
			if (isWithinDelta(Math.abs(l1.val - l2.val), diff, 2)) {
				//console.log('found!', diff, l1.color, l2.color);
				mid1 = l1; mid2 = l2;
			}
		}
		if (isdef(mid1)) break;
	}
	let kleinere = mid1.val < mid2.val ? mid1 : mid2;
	let groessere = mid1 == kleinere ? mid2 : mid1;
	return [kleinere, groessere];
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
function findLeftLine(ct, w, h, cgoal, xStart=0) {

	let [restlist, _] = findPointsBoth(ct, xStart, xStart+40, 0, h, cgoal, 20);
	let o = nextBar(ct, restlist, 'red');
	return o.val;
}
function findRightLine(ct, w, h, cgoal) {
	let [restlist, _] = findPointsBoth(ct, w - 40, w, 0, h, cgoal, 20);
	let o = nextBar(ct, restlist, 'orange');
	return o.val;
}
function findTopLine(ct, w, h, cgoal) {
	let [_, restlist] = findPointsBoth(ct, 0, w, 0, 40, cgoal, 20);
	let o = nextLine(ct, restlist, 'blue');
	return o.val;
}
function findBottomLine(ct, w, h, cgoal) {
	let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
	let o = nextLine(ct, restlist, 'green');
	return o.val;
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
function getBar(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.x, val, 2) && (isLightBefore(ctx, p.x, p.y) || isLightAfter(ctx, p.x, p.y)));
	//console.log('val', vfreq); console.log('line', res.length);
	return res;
}
function getLine(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.y, val, 2) && (isLightBeforeV(ctx, p.x, p.y) || isLightAfterV(ctx, p.x, p.y)));
	let ls=sortBy(res,'x');

	//look for lingest stretch of consecutive x values -> this is the real line!
	let segments = [],seg=[];
	let i=-1; let lastx=-1;
	while(++i<ls.length){
		let el=ls[i];
		if (lastx>=0 && el.x>lastx+1){
			segments.push(seg);seg=[];
		}else{
			if (el.x != lastx)	seg.push(el);
		}
		lastx=el.x;
	}
	segments.push(seg);

	//find longest segment
	//console.log('segments',segments);
	let len=0,best=null;
	for(const s of segments){if (s.length>len){len=s.length;best=s}}

	return best;
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
async function natCardsFinalProcessing(){
	let path='y/nat/cards1/';
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml'); 
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	for(const k in M.natCards){
		let card = M.natCards[k];
		let [age,type]=[card.age,card.Type];
		if (type == 'event' || age == 0) continue;
		let img = await imgAsync(dParentBad, {}, { src: path+k+'.png', tag: 'img' });
		let cv=await rotateAndWriteAge(img,card);

		await imgToServer(cv, `y/nat/cards/${k}.png`);
		//break;


	}

	async function rotateAndWriteAge(img,card) {
		//zuerst rotate canvas!
		let [w,h]=[img.width,img.height];
		mDom('dExtra', { h: 4 })
		let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
		let ctx2 = cv2.getContext('2d');
		ctx2.translate(h, 0)
		ctx2.rotate(90 * Math.PI / 180);
		ctx2.drawImage(img, 0, 0, w, h);
	
		mDom('dExtra', { h: 4 })
		let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
		let ctx3 = cv3.getContext('2d');
		ctx3.drawImage(cv2, 0, 0);
	
		let x = cv3.width / 2;
		let y = cv3.height; // - 10; // Adjust 10 as needed for padding
		ctx3.fillStyle = 'white';
		ctx3.font = '20px Arial';
		ctx3.textAlign = 'center';
		let text = card.Stage;
		ctx3.fillText(text, x, y);
	
		return cv3;
	
	}
	
}
async function natCardsManual() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	let di = {second_boer_war:'right',opium_war:'right',balkan_wars:'right', antikythera_mechanism:'left',uluru:null,mount_kailash:null,terracotta_army: 'top', uraniborg: 'left', great_barrier_reef: 'right', hawaii:'left' };
	let list=Object.keys(di);
	list=['second_boer_war','opium_war','balkan_wars']; // all done!
	for (const k of list) {
		let card = M.natCards[k];
		let path = `../assets/games/nations/cards/${card.Path}`;
		let type = card.Type;
		let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
		let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
		let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
		let [wCanvas, hCanvas] = [wImg, hImg];
		let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
		let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
		ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

		console.log('____________', k)
		let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
		mDom(dParentGood, { h: 10 });
		let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
		let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
		ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

		let noside = di[k];

		let xStart = type == 'war'?20:0;

		let left = noside == 'left' ? 0 : findLeftLine(ctx1, wCanvas, hCanvas, cgoal,xStart); console.log('left', left)
		let right = noside == 'right' ? wCanvas : findRightLine(ctx1, wCanvas, hCanvas, cgoal); console.log('right', right)
		let top = noside == 'top' ? 0 : findTopLine(ctx1, wCanvas, hCanvas, cgoal); console.log('top', top)
		let bot = noside == 'bottom'||type=='war' ? hCanvas : findBottomLine(ctx1, wCanvas, hCanvas, cgoal); console.log('bot', bot)
		let [x1, x2, y1, y2, dx, dy, factw, facth] = [left, right, top, bot, 8, 8, 2, 2];

		if (k == 'hawaii') {dx=16; factw=1.2}
		else if (k.includes('antiky')) {dx=16; factw=1.1; dy=10;}
		ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - factw * dx, h - facth * dy);
		let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'maroon', wonder: 'sienna' };
		ctx.strokeStyle = diColors[card.Type];
		ctx.lineWidth = 28;
		ctx.strokeRect(0, 0, w, h);
		await imgToServer(canvas, `y/nat/${type}/${k}.png`);

	}
	function findLeftLine(ct, w, h, cgoal, xStart=0) {

		let [restlist, _] = findPointsBoth(ct, xStart, xStart+40, 0, h, cgoal, 20);
		let o = nextBar(ct, restlist, 'red');
		return o.val;
	}
	function findRightLine(ct, w, h, cgoal) {
		let [restlist, _] = findPointsBoth(ct, w - 40, w, 0, h, cgoal, 20);
		let o = nextBar(ct, restlist, 'orange');
		return o.val;
	}
	function findTopLine(ct, w, h, cgoal) {
		let [_, restlist] = findPointsBoth(ct, 0, w, 0, 40, cgoal, 20);
		let o = nextLine(ct, restlist, 'blue');
		return o.val;
	}
	function findBottomLine(ct, w, h, cgoal) {
		let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
		let o = nextLine(ct, restlist, 'green');
		return o.val;
	}
}
async function natCardsSaveType(type) {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	list = Object.keys(M.natCards).filter(ck => M.natCards[ck].Type == type && M.natCards[ck].age > 0)
	//list = ['anna_komnene'];// elephant anna_komnene abu_bakr aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	// list = ['abu_bakr', 'great_northern_war','hoplite','aeneid','university','archer','solomons_temple','hanging_gardens'];// aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	mDom(dParentBad, { h: 10 });
	let dims = {
		advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
		building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
		golden_age: { diffleft: 91, diffright: 148 },
		wonder: { diffleft: 91, diffright: 148 },
		war: { diffleft: 91, diffright: 148 },
		hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
		urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) {
		if (['second_boer_war','opium_war','balkan_wars','antikythera_mechanism','uluru','mount_kailash','hawaii','great_barrier_reef','uraniborg', 'terracotta', 'pyramids', 'hagia', 'kremlin', 'potemkin'].some(x => k.includes(x))) continue;
		console.log('____________', k)
		let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
		let card = M.natCards[k];
		let path = `../assets/games/nations/cards/${card.Path}`;
		//let type = card.Type;
		let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
		let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
		let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
		let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
		let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
		ctx1.drawImage(img, 0, 0, wImg, hImg);
		mDom(dParentGood, { h: 10 });
		let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
		let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
		ctx11.drawImage(img, 0, 0, wImg, hImg);

		let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
		let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wImg, hImg, cgoal, diffleft, diffright);
		console.log(x1, x2, x3, x4);
		console.log(l, m1, m2, r)

		let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wImg, hImg, cgoal);
		console.log(y1, y2, y3, y4);
		console.log(a, b, c, d)
		//continue;

		let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
		let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
		ctx2.drawImage(img, -x1, -y1);

		//ah nein, zuerst muss ich ja das reduzierte bild zeichnen!
		let loff = 5, toff = 5;
		if (nundef(a)) {
			toff = 2 + 24 - y2;
		}
		if (nundef(l)) {
			loff = 2 + diffleft - x2;
		}
		console.log('loff', loff, 'toff', toff)

		ctx.drawImage(cv2, loff, toff);
		let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
		ctx.strokeStyle = diColors[card.Type];
		ctx.lineWidth = 28;
		ctx.strokeRect(0, 0, w, h);

		await imgToServer(canvas, `y/nat/${type}/${k}.png`);

	}
}
async function natCardsTester() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let list = rChoose(Object.keys(M.natCards).filter(ck => M.natCards[ck].Type != 'event'), 6);
	list = Object.keys(M.natCards).filter(ck => M.natCards[ck].Type == 'battle' && M.natCards[ck].age > 0)
	//list = ['second_boer_war']; // brewery aqueduct
	// elephant anna_komnene abu_bakr aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	// list = ['abu_bakr', 'great_northern_war','hoplite','aeneid','university','archer','solomons_temple','hanging_gardens'];// aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	mDom(dParentBad, { h: 10 });
	let dims = {
		advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
		building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
		golden_age: { diffleft: 91, diffright: 148 },
		wonder: { diffleft: 91, diffright: 148 },
		war: { diffleft: 91, diffright: 148 },
		hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
		urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) {
		if (['second_boer_war','opium_war','balkan_wars','antiky','uluru','mount_kailash','hawaii','great_barrier_reef','uraniborg', 'terracotta', 'pyramids', 'hagia', 'kremlin', 'potemkin'].some(x => k.includes(x))) continue;
		console.log('____________', k)
		let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
		let card = M.natCards[k];
		let path = `../assets/games/nations/cards/${card.Path}`;
		let type = card.Type;
		let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
		let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
		let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
		let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
		let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
		ctx1.drawImage(img, 0, 0, wImg, hImg);
		mDom(dParentGood, { h: 10 });
		let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
		let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
		ctx11.drawImage(img, 0, 0, wImg, hImg);

		let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
		let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wImg, hImg, cgoal, diffleft, diffright);
		console.log(x1, x2, x3, x4);
		console.log(l, m1, m2, r)

		let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wImg, hImg, cgoal);
		console.log(y1, y2, y3, y4);
		console.log(a, b, c, d)
		// continue;

		let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
		let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
		ctx2.drawImage(img, -x1, -y1);

		//ah nein, zuerst muss ich ja das reduzierte bild zeichnen!
		let loff = 5, toff = 5;
		if (nundef(a)) {
			toff = 2 + 24 - y2;
		}
		if (nundef(l)) {
			loff = 2 + diffleft - x2;
		}
		console.log('loff', loff, 'toff', toff)

		ctx.drawImage(cv2, loff, toff);
		let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
		ctx.strokeStyle = diColors[card.Type];
		ctx.lineWidth = 28;
		ctx.strokeRect(0, 0, w, h);



	}
}
async function natCardsKleinereCard() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	// brewery aqueduct
	// elephant anna_komnene abu_bakr aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	// list = ['abu_bakr', 'great_northern_war','hoplite','aeneid','university','archer','solomons_temple','hanging_gardens'];// aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	let dims = {
		advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
		building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
		golden_age: { diffleft: 91, diffright: 148 },
		wonder: { diffleft: 91, diffright: 148 },
		war: { diffleft: 91, diffright: 148 },
		hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
		urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	let k = 'pyramids'; //nur hagia,kremlin und potemkin!
	let card = M.natCards[k];
	let path = `../assets/games/nations/cards/${card.Path}`;
	let type = card.Type;
	let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
	let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
	let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
	let [wCanvas, hCanvas] = [wImg, hImg];
	let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
	ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	console.log('____________', k)
	let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
	mDom(dParentGood, { h: 10 });
	let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
	ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	let [x1, x2, y1, y2, dx, dy] = [14, 313, 15, 205, 8, 8];

	ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
	ctx.strokeStyle = diColors[card.Type];
	ctx.lineWidth = 28;
	ctx.strokeRect(0, 0, w, h);
	await imgToServer(canvas, `y/nat/${type}/${k}.png`);

	// let [restlist, _] = findPointsBoth(ctx1, 0, w, 0, h, cgoal, 20);
	// let num = 201;
	// let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	// let res = [];

	// while (num > 100 && i < colors.length) {
	// 	let color = colors[i++];
	// 	let o = nextBar(ctx1, restlist, color);
	// 	restlist = o.rest;
	// 	num = o.line.length;
	// 	//console.log('y',o.val,'num',num,'restlist',o.rest.length);
	// 	res.push(o)
	// }
	// console.log('result',res);
	// //24,474,
}
async function natCardsWrongFormatAberIntact() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	// brewery aqueduct
	// elephant anna_komnene abu_bakr aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	// list = ['abu_bakr', 'great_northern_war','hoplite','aeneid','university','archer','solomons_temple','hanging_gardens'];// aeneid hanging_gardens solomons_temple archer university hoplite great_northern_war
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
	let dims = {
		advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
		building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
		golden_age: { diffleft: 91, diffright: 148 },
		wonder: { diffleft: 91, diffright: 148 },
		war: { diffleft: 91, diffright: 148 },
		hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
		urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	let k = 'kremlin'; //nur hagia,kremlin und potemkin!
	let card = M.natCards[k];
	let path = `../assets/games/nations/cards/${card.Path}`;
	let type = card.Type;
	let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
	let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
	let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
	let [wCanvas, hCanvas] = [wImg, hImg];
	let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
	ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	console.log('____________', k)
	let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
	mDom(dParentGood, { h: 10 });
	let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
	ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	let [x1, x2, y1, y2, dx, dy] = [24, 474, 20, 308, 8, 8];

	ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
	ctx.strokeStyle = diColors[card.Type];
	ctx.lineWidth = 28;
	ctx.strokeRect(0, 0, w, h);
	await imgToServer(canvas, `y/nat/${type}/${k}.png`);

	// let [_, restlist] = findPointsBoth(ctx1, 0, w, 0, h, cgoal, 20);
	// let num = 201;
	// let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	// let res = [];

	// while (num > 100 && i < colors.length) {
	// 	let color = colors[i++];
	// 	let o = nextLine(ctx1, restlist, color);
	// 	restlist = o.rest;
	// 	num = o.line.length;
	// 	//console.log('y',o.val,'num',num,'restlist',o.rest.length);
	// 	res.push(o)
	// }
	// console.log('result',res);
	// //24,474,
}
function nextBar(ctx, rest, color) {
	list = rest;
	let val = findMostFrequentVal(list, 'x');
	rest = list.filter(p => !isWithinDelta(p.x, val, 2));
	let line = getBar(ctx, list, val);
	line.map(p => drawPix(ctx, p.x, p.y, color));
	return { val, line, rest, color };
}
function nextLine(ctx, rest, color) {
	list = rest;
	let val = findMostFrequentVal(list, 'y');
	rest = list.filter(p => !isWithinDelta(p.y, val, 2));
	let line = getLine(ctx, list, val);
	//console.log('line',line)
	if (line) line.map(p => drawPix(ctx, p.x, p.y, color));
	return { val, line, rest, color };
}
async function rotateAndWriteAge(img,card) {
	//zuerst rotate canvas!
	let [w,h]=[img.width,img.height];
	mDom('dExtra', { h: 4 })
	let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
	let ctx2 = cv2.getContext('2d');
	ctx2.translate(h, 0)
	ctx2.rotate(90 * Math.PI / 180);
	ctx2.drawImage(img, 0, 0, w, h);

	mDom('dExtra', { h: 4 })
	let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
	let ctx3 = cv3.getContext('2d');
	ctx3.drawImage(cv2, 0, 0);

	let x = cv3.width / 2;
	let y = cv3.height; // - 10; // Adjust 10 as needed for padding
	ctx3.fillStyle = 'white';
	ctx3.font = '20px Arial';
	ctx3.textAlign = 'center';
	let text = card.Stage;
	ctx3.fillText(text, x, y);

	return cv3;

}
