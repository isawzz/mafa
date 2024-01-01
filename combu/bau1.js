async function edgeDetect(k, src, border, idx) {

	let path = `../assets/games/nations/cards/${src}`; //.jpg`;
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);

	//only consider images in landscape form
	if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }

	//als erstes brauch ich einen canvas!
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });

	ctx.drawImage(img, 0, 0, w, h);

	//fuer start suche: #D8BEAF rgb(215,189,174), D5BFB2 rgb(214,192,179), D3BDAF = rgb(208,189,174)

	let corner = findSimPixXY(ctx, 5, 50, 5, 40, { r: 215, g: 189, b: 174 }, 10);
	let corner2 = findSimPixLineHor(ctx, 5, 90, 5, 60, { r: 215, g: 189, b: 174 },10, 10);
	console.log('corner', corner, corner2);
	drawPixFrame(ctx, corner.x, corner.y, 'yellow', 15);
	drawPixFrame(ctx, corner2.x, corner2.y, 'green', 15);
	img.style.display = 'none'; return;


	let [x, y, cgoal] = [corner2.x, corner2.y, {r:167,g:158,b:151}]; //colorRGB('#a18b81', true)];
	drawPix(ctx, x, y, 'red', 5);

	let result = findSimPixXSequence(ctx,x,w,y,[{r:167,g:158,b:151},{r:167,g:158,b:151}])

	let sim = findSimPixX(ctx, x, w, y, cgoal, 15);
	if (sim.x) {
		drawPix(ctx, sim.x, y, 'green', 5);
		let sim2 = findSimPixX(ctx, sim.x + 5, w, y, cgoal,15);
		if (sim2.x) drawPix(ctx, sim2.x, y, 'green', 5);


	} else console.log('NOT FOUND!!!')
	img.style.display = 'none';

}
function findSimPixXSequence(ctx,x1,x2,y,clist,delta){
	let [x,y,i]	=[x1,y,0];
	let ok = true;
	let results=[];
	while(x<=x2 && i<clist.length){
		let p = isPixSim2(ctx, x, y, clist[i], delta); 
		if (p) {results.push({ x: x, y:y, color: p, csim:clist[i] }); i++; }
		x++;
	}
  if (results.length == clist.length) return results; else return null;
}
function findSimPixX(ctx, x1, x2, y, cgoal, delta = 10) {
	for (let x = x1; x < x2; x++) {
		let p = isPixSim2(ctx, x, y, cgoal, delta); if (p) return { x: x, color: p };
	}
	return { x: null, color: null }
}
function findSimPixXY(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			let p = isPixSim2(ctx, x, y, cgoal, delta); if (p) return { x: x, y: y, color: p };
		}
	}
	return { x: null, color: null }
}
function findSimPixLineHor(ctx, x1, x2, y1, y2, cgoal, minlen = 10, delta = 10) {
	let p;
	for (let y = y1; y < y2; y++) {
		for (let xStart = x1; xStart < x2; xStart++) {
			let found = true;
			for (let x = xStart; x < xStart + minlen; x++) {
				p = isPixSim2(ctx, x, y, cgoal, delta); if (!p) { found = false; break; }
			}
			if (found) return { x: xStart, y: y, color: p };
		}
	}
	return { x: null, color: null }
}
async function rest() {
	//first detect #A18B81 along top to bottom starting at 10% ending at 10%
	let [cgoal, x1, x2, y1, y2] = ['#a18b81', 0, w, 0, h];//w/2,w,Math.round(h/2),Math.round(h*2/3)]; //w*.1,w*.9,h*.1,h*.9];
	let vlines = {}, p;
	for (let x = x1; x < x2; x++) {
		for (let y = y1; y < y2; y++) {
			if (p = isPixSim2(ctx, x, y, cgoal)) {
				assertion(nundef(vlines[x]), `duplicate ${x}`)
				vlines[x] = { x1: x, y1: y, color: p };
				// console.log('BINGO!',x,y)
				break;
			}
		}
	}

	// console.log(vlines)
	let max = 0;
	for (const x in vlines) {
		let o = vlines[x];
		o.linedown = getPixLineAtX(ctx, x, o.y1, h);
		o.avg = getPixAvg(o.linedown);
		// //geh alle y's ab y1 hinunter und schau ob bedingung erfuellt ist fuer x,x+1
		// let y=o.y1+1;
		// while(isPixSim2(ctx,x,y,cgoal)||isPixSim2(ctx,x+1,y,cgoal)) y++;
		// o.y2=y;
		// o.other = getPixHex(ctx,x,y);
		// if (y-o.y1>max) max=o;
	}
	// console.log(vlines,colorRGB(cgoal,true));
	// Object.values(vlines).map(o=>console.log(`${o.x1}: ${o.avg.r} ${o.avg.g} ${o.avg.b}`));

	//sort vlines by closeness to goal number
	let goal = colorRGB(cgoal, true);
	let arr = Object.values(vlines);

	console.log(colorRGB(cgoal, true));
	console.log('_______orig', arr.map(x => x.x1))
	//arr.map(el=>console.log(el.x1,el.avg.r,el.avg.g,el.avg.b))

	let arrSorted = sortByFunc(arr, el => Math.abs(el.avg.r - goal.r));//+Math.abs(el.avg.g-goal.g)+Math.abs(el.avg.b-goal.b));
	console.log('_______sorted', arrSorted.map(x => x.x1))
	// arrSorted.map(el=>console.log(el.x1,el.avg.r,el.avg.g,el.avg.b))

	//markiere die lines
	drawPix(ctx, arrSorted[0].x1, arrSorted[0].y1, 'red', 5)
	drawPix(ctx, arrSorted[1].x1, arrSorted[1].y1, 'red', 5)


	mStyle(img, { display: 'none' })
}


































