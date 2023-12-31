function findDarkBars(ctx, w, h, cgoal,diffleft, diffright) {
	let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 200 && i < colors.length) {
		let color = colors[i++];
		let o = nextBar(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	//console.log('result',res);
	let diff = 243; 
	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		let distleft =Math.abs(kleinere.val - l3.val);
		let distright =Math.abs(groessere.val - l3.val);
		console.log(l3.val,l3.color,distleft,distright)
		if (isWithinDelta(Math.abs(kleinere.val - l3.val), diffleft, 2)) {
			//console.log('found left', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(Math.abs(groessere.val - l3.val), diffright, 2)) {
			//console.log('found right', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? w : bottommost.val]
	//let lyellow = res[0];
	//let lblue = res.find(l => l.color == 'blue');
	//console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom,topmost,kleinere,groessere,bottommost];
	//24 ist der untere abstand!

}
function findDarkLines(ctx, w, h, cgoal) {
	let [_, restlist] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
	let y, num = 201;
	let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
	let res = [];

	while (num > 200 && i < colors.length) {
		let color = colors[i++];
		let o = nextLine(ctx, restlist, color);
		restlist = o.rest;
		num = o.line.length;
		//console.log('y',o.val,'num',num,'restlist',o.rest.length);
		res.push(o)
	}
	//console.log('result',res);
	let diff = 261, diff2 = 24;
	let [kleinere, groessere] = findMidlines(res, diff);

	let topmost, bottommost;
	for (const l3 of res) {
		if (isWithinDelta(Math.abs(kleinere.val - l3.val), diff2, 2)) {
			//console.log('found oberstes', l3.color); 
			topmost = l3;
		}
		if (isWithinDelta(Math.abs(groessere.val - l3.val), diff2, 2)) {
			//console.log('found unterstes', l3.color); 
			bottommost = l3;
		}
	}
	let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? h : bottommost.val]
	// let lyellow = res[0];
	// let lblue = res.find(l => l.color == 'blue');
	// console.log('unterer abstand', Math.abs(lyellow.val - lblue.val));
	return [ytop, kleinere.val, groessere.val, ybottom];
	//24 ist der untere abstand!

}
function findMidlines(res, diff) {
	let mid1, mid2;
	for (const l1 of res) {
		for (const l2 of res) {
			if (isWithinDelta(Math.abs(l1.val - l2.val), diff, 2)) {
				console.log('found!', diff, l1.color, l2.color);
				mid1 = l1; mid2 = l2;
			} 
		}
		if (isdef(mid1)) break;
	}
	let kleinere = mid1.val < mid2.val ? mid1 : mid2;
	let groessere = mid1 == kleinere ? mid2 : mid1;
	return [kleinere, groessere];
}
function getBar(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.x, val, 2) && (isLightBefore(ctx, p.x, p.y) || isLightAfter(ctx, p.x, p.y)));
	//console.log('val', vfreq); console.log('line', res.length);
	return res;
}
function getLine(ctx, list, val) {
	let res = list.filter(p => isWithinDelta(p.y, val, 2) && (isLightBeforeV(ctx, p.x, p.y) || isLightAfterV(ctx, p.x, p.y)));
	//console.log('val', vfreq); console.log('line', res.length);
	return res;
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
	line.map(p => drawPix(ctx, p.x, p.y, color));
	return { val, line, rest, color };
}
