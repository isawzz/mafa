async function test68_manually() {
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
	let di = { terracotta_army: 'top', uraniborg: 'left', great_barrier_reef: 'right' };

	let k = 'great_barrier_reef';
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
	let left = noside == 'left' ? 0 : findLeftLine(ctx1, wCanvas, hCanvas, cgoal); console.log('left', left)
	let right = noside == 'right' ? wCanvas : findRightLine(ctx1, wCanvas, hCanvas, cgoal); console.log('right', right)
	let top = noside == 'top' ? 0 : findTopLine(ctx1, wCanvas, hCanvas, cgoal); console.log('top', top)
	let bot = noside == 'bottom' ? hCanvas : findBottomLine(ctx1, wCanvas, hCanvas, cgoal); console.log('bot', bot)
	let [x1, x2, y1, y2, dx, dy] = [left, right, top, bot, 8, 8];

	ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
	ctx.strokeStyle = diColors[card.Type];
	ctx.lineWidth = 28;
	ctx.strokeRect(0, 0, w, h);
	await imgToServer(canvas, `y/nat/${type}/${k}.png`);

	function findLeftLine(ct, w, h, cgoal) {
		let [restlist, _] = findPointsBoth(ct, 0, 40, 0, h, cgoal, 20);
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
	// //24,474,
}
async function test67_kleine_karte() {
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
async function test66_hagia() {
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
async function test65_brewery() {
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
	let k = 'hagia_sophia';
	let card = M.natCards[k];
	let path = `../assets/games/nations/cards/${card.Path}`;
	let type = card.Type;
	let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
	let [wImg, hImg] = [img.width, img.height]; //console.log('w', w, 'h', h);
	let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
	// let [wCanvas,hCanvas]=[521,338]; wCanvas*=1.025;hCanvas*=1.065; //brewery
	let [wCanvas, hCanvas] = [wImg, hImg]; //wCanvas*=1.279;//hCanvas*=.985;
	let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
	ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	console.log('____________', k)
	let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
	mDom(dParentGood, { h: 10 });
	let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
	ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	//[wImg, hImg]=[wCanvas,hCanvas];
	let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
	let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wCanvas, hCanvas, cgoal, diffleft, diffright);
	console.log(x1, x2, x3, x4);
	console.log(l, m1, m2, r)

	let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wCanvas, hCanvas, cgoal);
	console.log(y1, y2, y3, y4);
	console.log(a, b, c, d)
	// // continue;

	let myimg = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
	let cimg = myimg.getContext('2d', { willReadFrequently: true });
	cimg.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);

	let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
	let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
	ctx2.drawImage(myimg, -x1, -y1);

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
async function test64_finalize(type) {
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
async function test63_segments() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let k = 'abu_bakr'; // solomons_temple
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	let card = M.natCards[k];
	let path = `../assets/games/nations/cards/${card.Path}`;
	let type = card.Type;
	let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
	let [wImg, hImg] = [img.width, img.height];
	let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
	let cv1 = mDom(dParentGood, {}, { tag: 'canvas', width: wImg, height: hImg });
	let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
	ctx1.drawImage(img, 0, 0, wImg, hImg);
	let [_, ypoints] = findPoints(ctx1, 0, wImg, 0, hImg, cgoal, 20);
	//ypoints.map(p=>drawPix(ctx1,p.x,p.y,'red'))
	let oline = nextLine(ctx1, ypoints, 'green')
	console.log('oline', oline)
}
async function test62_points() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let k = 'abu_bakr'; // solomons_temple
	let dParentGood = toElem('dExtra');
	let dParentBad = toElem('dPageTitle');
	let card = M.natCards[k];
	let path = `../assets/games/nations/cards/${card.Path}`;
	let type = card.Type;
	let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
	let [wImg, hImg] = [img.width, img.height];
	let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
	let cv1 = mDom(dParentGood, {}, { tag: 'canvas', width: wImg, height: hImg });
	let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
	ctx1.drawImage(img, 0, 0, wImg, hImg);
	let [_, ypoints] = findPoints(ctx1, 0, wImg, 0, hImg, cgoal, 20);
	ypoints.map(p => drawPix(ctx1, p.x, p.y, 'red'))

}
async function test61_lines() {
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
async function test60_empty() {
	M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let list = rChoose(Object.keys(M.natCards), 6);
	//list = ['university','aeneid','hanging_gardens','solomons_temple'];//,'','','','','','','',''];
	for (const k of list) {

		await doit(k)
	}
}
async function test59_empty() {
	let src = 'age1_hanging_gardens.jpg', idx = 0;
	let path = `../assets/games/nations/cards/${src}`;
	path = '../assets/games/nations/empty_inner_card.png';
	let dParent = toElem('dExtra');
	let img = await imgAsync(dParent, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' })
	mDom(dParent, { h: 10 })
	let [w, h] = [img.width, img.height]; console.log('w', w, 'h', h);
	let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
	let ctx = canvas.getContext('2d', { willReadFrequently: true });
	ctx.drawImage(img, 0, 0, w, h);
	//img.remove();

	//jetzt paste hanging gardens drauf!
	let k = 'hanging_gardens'
	path = `../assets/games/nations/cards/age1_hanging_gardens.jpg`;
	let [rect, cv] = natDetectBoundingBox('hanging_gardens', src, border, idx, type)

}
async function test58_edgedetect() {
	let type = 'military';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = M.nationsCards = await mGetYaml('../assets/games/nations/cards.yaml');
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	//bottom edge missing: handging_gardens, bottom&right: bread_and_games
	//left: antikythera_mechanism, 
	list = ['antikythera_mechanism'];//,'hanging_gardens', 'bread_and_games']; //'solomons_temple']; // 'immortal']; //

	// list = rChoose(Object.keys(natCards),6); //['archer']; 
	//list = Object.keys(natCards).filter(x=>natCards[x].Type != 'event');
	//list = rChoose(list,4); //['archer']; 
	// list.push('trireme');
	let result = [];
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let src = c.Path;
		let color = diColors[c.Type];
		let res = await natDetectBoundingBox(k, src, color, i++, c.Type);
		if (!res) console.log('NOT FOUND', k); else console.log(res)
		let o = { key: k, src: src, color: color, path: `y/nat/${type}/${k}.png` }; addKeys(res, o); result.push(o);
		// await imgToServer(o.cv,o.path);
	}
	//console.log('result',result[0]);
}
async function test57_military() {
	let type = 'military';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	console.log('list', list);
	let result = [];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, building: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
		, hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
		military: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];
		let dim = valf(dims[k], dims[type]);
		let canvas = await natModCard(path, color, i++, dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path', path);
		continue;

		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) { }//await imgToServer(canvas,realPath);
		else {
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			// await imgToServer(cv,realPath);
		}
		//break;
	}
}
async function saveYamlDictInAlphaOrder(path) {
	if (nundef(path)) path = '../assets/games/nations/cards.yaml';
	let di = await mGetYaml(path);
	console.log('di', di)
	let dinew = {};
	let keys = Object.keys(di);
	keys.sort();
	for (const k of keys) { dinew[k] = di[k] }
	downloadAsYaml(dinew, 'dinew');
}
async function test56_portrait_buildings() {
	//das betrifft NUR den ziggurat
	let type = 'building';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	console.log('list', list);
	let result = [];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	//list = ['adobe'];
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, building: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
		, hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];
		let img = await imgAsync('dExtra', {}, { src: `../assets/games/nations/cards/${path}`, tag: 'img', id: `im${k}` });
		if (img.width > img.height) { img.remove(); continue; }
		let cv = imgRotate90('dExtra', img);
		let realPath = `y/nat/${type}/${k}.png`;
		await imgToServer(cv, realPath);
	}
}
async function test55_buildings() {
	let type = 'building';
	let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == type);
	console.log('list', list);
	let result = [];
	//list =['brewery']; // 'urban_center'];//'university']; //, 'urban_center'];
	//list = ['department_store','coffee_house','hippodrome']; //,]; //['aqueduct','shantytown','coal_mine'];//['coal_mine']; // 
	let dims = {
		advisor: { dx: 150, y: 75, xmin: 80, top: 91, bot: 151 }, building: { dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
		, hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 }, urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 }
	};
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		if (k == 'brewery') continue;
		console.log('___________', k)
		let c = natCards[k];
		if (c.age == 0) { console.log('age 0', c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];
		let dim = valf(dims[k], dims[type]);
		let canvas = await natModCard(path, color, i++, dim);
		//result.push({cv:canvas,card:c,path:`y/nat/${type}/${k}.png`});
		console.log('path', path);
		let realPath = `y/nat/${type}/${k}.png`;
		if (canvas) { }//await imgToServer(canvas,realPath);
		else {
			let img = await imgAsync('dExtra', {}, { src: path, tag: 'img', id: `im${k}` });
			let cv = imgRotate90(img);
			// await imgToServer(cv,realPath);
		}
		//break;
	}
}
async function test54_redo_cards() {

	let di = await natLoadCardInfo();
	console.log('list', di);
	//let di = list2dict(list,'key');
	//downloadAsYaml(di,'cards.yaml');
	return;
}
async function test53_advisors() {
	let diColors = { advisor: 'orange', battle: 'grey', building: 'blue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'brown' };
	let natCards = await mGetYaml('../assets/games/nations/cards.yaml');
	console.log('Nations Cards', natCards);
	let i = 0;
	let list = Object.keys(natCards).filter(x => natCards[x].Type == 'advisor');
	console.log('list', list);
	let result = [];
	//return;
	for (const k of list) { //in natCards){ //of arrTake(Object.keys(natCards),20)){ //in natCards){
		console.log('___________', k)
		let c = natCards[k];
		//if (c.Type != 'advisor') continue;
		//if (c.age == 0) {console.log('age 0',c.key); continue; }
		let path = c.Path;
		let color = diColors[c.Type];//if (nundef(color)) console.log('no color for',k,c)
		let canvas = await natModCard(path, color, i++);
		result.push({ cv: canvas, card: c, path: `y/advisor/${k}.png` });
		console.log('path', path)
		//await imgToServer(canvas,'combu/img/advisor/'+path);

		//break;
	}
	//console.log('cvs',cvs);
	//let adv=arrLast(result);console.log(adv);
	for (const adv of result) {
		await imgToServer(adv.cv, adv.path);
	}
	//console.log(arrLast(cvs));

}
async function test52_cards() {
	let list1 = ['adobe', 'aeneid', 'antikythera_mechanism', 'aqueduct', 'archer', 'archimedes', 'armenia', 'augustus'];//,'babylonia','battle_of_cannae','battle_of_issus','battle_of_kadesh','battle_of_thermophylae'];
	let list2 = ['skyblue', 'gold', 'gold', 'skyblue', 'red', 'orange', 'green', 'orange'];
	let listrot = [0, -90, 90, 90, 90, 90, 90, 90];
	let listyBound = [true, false, true, true, true, true, true];
	let listxBound = [true, true, false, true, true, true, true];
	let listyExtra = [false, false, true, false, true, false, true];
	let listxend = [true, true, true, true, true, true, false];

	for (let i = 0; i < list1.length - 1; i++) {

		await present(`age1_${list1[i]}`, list2[i], i, listrot[i], listyBound[i], listxBound[i], listyExtra[i], listxend[i]);
		//break;
	}
}
async function test51_cards(name) {
	//do this for each card:
	if (isdef(mBy('img1'))) mBy('img1').remove();
	//let name = `age1_aeneid`;
	let path = `../assets/games/nations/cards/${name}.jpg`;

	let img = await imgAsync(document.body, { position: 'absolute', top: '70vh', h: 200 }, { src: path, tag: 'img', id: 'img1' })
	console.log('img', img)

	let dir = 'portrait';
	let rotate = img.width > img.height;
	let dView = 'dMain';

	let dParent = toElem(dView);
	mClear(dParent);
	let [w, h] = rotate ? [img.height, img.width] : [img.width, img.height];
	// let canvas = mDom(dParent, { border: '10px solid yellow', box:true }, { tag: 'canvas', id: 'canvas',width: w, height: h });
	let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas', width: w - 4, height: h - 6 });

	let ctx = canvas.getContext('2d');
	if (rotate) {
		ctx.translate(0, img.width);
		ctx.rotate(-90 * Math.PI / 180);
		ctx.translate(-4, 14)
		ctx.drawImage(img, 0, 0, img.width, img.height)
		ctx.beginPath();
		ctx.lineWidth = "10";
		ctx.strokeStyle = "gold";
		ctx.rect(15, -4, 290, 180);
		ctx.stroke();

		// ctx.fillStyle = 'blue';
		// ctx.strokeStyle = 'red';
		// ctx.linewidth = 15;
		// console.log(w,h)
		// ctx.fillRect(0,0,h,w);
		// ctx.strokeRect(0,0,h-15,w-15)
	} else {
		ctx.drawImage(img, 0, 0, img.width, img.height)
	}

	//await imgToServer(canvas,`combu/${name}.png`);
	//await mSleep(1000);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);


	//let cv = imgAsCanvas(img,'dMain');
}
async function test50_imgToLandscape() {
	let path = `../assets/games/nations/cards/age1_aeneid.jpg`;
	// let resp = await imgToPortrait(path, 200, 'dMain', true, `combu/age1_aeneid.jpg`);	console.log('resp',resp)
	let resp = await imgToPortrait(path, 200, 'dMain'); console.log('resp', resp);


}
async function test49_schircheCard() {
	let path = '../assets/games/nations/cards/age1_aeneid.jpg';
	//let img = mDom('dMain',{},{tag:'img',src:path});
	let img = await loadImageAsync(path, mDom('dMain', {}, { tag: 'img' }));
	console.log('img', img);


}
async function test47_oneCard() {
	await prelims();
	showTitle('NATIONS!!!');
	let age = 1, name = 'axeman';
	await loadImageAsync(`../assets/games/nations/cards/age${age}_${name}.jpg`, mDom('dMain', {}, { tag: 'img' }));

	let miltext = await mGetText('../assets/games/nations/military.csv');
	let list = csv2list(miltext, hasHeadings = true);
	console.log('list', list);

	let info = list.find(x => x.Name.toLowerCase() == name);
	console.log('info', info)

}
async function test46() {
	//just show a civ
	await prelims();
	await onclickNATIONS();

}
//#region nations tests (above here!)
function test45() {
	function weiterStart() {

		let [d, img] = [mBy('d1'), mBy('img1')];
		let canvas = mDom('d1', { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width }); let ctx = canvas.getContext('2d');
		ctx.fillStyle = 'yellow';
	
		let [w, h] = [200, 400]
	
		ctx.translate(img.height, 0)
		ctx.rotate(90 * Math.PI / 180);
	
		//ctx.fillRect(1,1,w,h);
		ctx.drawImage(img, 0, 0, img.width, img.height)
	
		downloadCanvas(canvas);
	}
	let dbody = document.body; dbody.innerHTML = '';
	let d = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });

	let src = '../assets/img/emo/abacus.png'; //"../assets/games/nations/civs/japan.jpg"; //

	let img = mDom(dbody, { position: 'absolute', top: 500, h: 800 }, { tag: 'img', src: src, id: 'img1' });
	img.src = "../assets/games/nations/civs/japan.jpg";
	img.onload = weiterStart;
}
async function test44() {
	let dbody = document.body;
	dbody.innerHTML = '';
	let d = mDom(dbody, { bg: 'skyblue' });
	let src = "../assets/games/nations/civs/japan.jpg"; //'../assets/img/emo/abacus.png'; //

	d.innerHTML = 'HALLO'; //return;
	let img = mDom(d, { visibility: 'hidden', position: 'absolute' }, { tag: 'img', src: src });
	let canvas = mDom(d, {}, { tag: 'canvas', id: 'canvas' })
	let link = mDom(dbody, {}, { tag: 'a', id: 'download', html: 'download', onclick: () => downloadCanvas(canvas) })

	img.onload = () => {
		rotateImage(img, 90);
	}
	//let canvas = mDom(d,{},{tag:'canvas',width:'100%',height:'100%'});
}
async function test43() {
	await prelims();

	//onclickPlay
	showTitle('Nations');
	//let d = mDom('dMain', { hpadding: 20, display: 'flex', gap: '2px 4px', wrap: true });
	for (const civ of ['korea']) {
		await saveCiv(civ);
	}
}
async function test42_toolbar() {
	await prelims();
	await onclickAdd();
	UI.imgName.value = 'dadadha das ist gut';
	UI.imgColl.value = 'all';
}
async function test41_allNewApp() {
	await prelims();
	await onclickSchedule();
}
async function test40_socketio() {
  await prelims();
  console.log('Serverdata', Serverdata)
  let server = getServerurl();
  Socket = io(server);
  Socket.on('message', showChatMessage);
  Socket.on('disconnect', x => console.log('>>disconnect:', x));
  Socket.on('update', x => console.log('>>update:', x));
  let dChat = mDom('dChat');
  UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
  UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
  mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
}
async function test40_socketio() {

	await prelims();

	console.log('Serverdata',Serverdata)
	let server = getServerurl();
	Socket = io(server);
	Socket.on('message', showChatMessage);
	Socket.on('disconnect', x => console.log('>>disconnect:', x));
	Socket.on('update', x => console.log('>>update:', x));

	let dChat = mDom('dChat');
	UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
	UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
	mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));

}
async function test39_calendar() {
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();
}
async function test38_newprelims() {
	if (nundef(M.superdi)) {
		Serverdata = await mGetRoute('session');
		await loadCollections();
		loadPlayerColors();

		let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
		nav.disable('play');

		dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })

		dUser = mDom(nav.ui, {}, { id: 'dUser' });

		await switchToUser(localStorage.getItem('username'));
	}
}
async function YES_test37_allesNeu() {
	Serverdata = await mGetRoute('config');
	console.log('Serverdata', Serverdata);

	//change something in Serverdata
	//repost Serverdata
	Serverdata.users.max = { name: 'max', color: 'orange' };
	Serverdata = await mPostRoute('postConfig', Serverdata);
	console.log('updated', Serverdata.users.max);
}
async function test36_loadAllEvents(){
	await prelims();
}
async function test35_light() {
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();

	//wie krieg ich das erste event?
	let evs = getEvents();
	if (nundef(evs)) return;
	console.log('events', evs)
	let n = Object.values(evs).length;
	console.log('events for', U.name, evs, n)
	if (n < 2) return;
	let e = Object.values(evs)[1];
	console.log('e', e)
	showEventOpen(e.id);
	// Example usage
	//onclick=openPopup;
	//let d=mPopup('Hallo','dMain',{})
	//M.playerColors.map(x=>console.log(x,colorHSL(x,true).l * 100,colorLum(x,true)))
}
async function test34_colorjs_YES() {
	await prelims();
	UI.nav.activate('schedule'); onclickSchedule();
}
async function test33_colorjs(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();



	let c,hsl,c1,c2,c3,c4,c5,hsl1,hsl2,hsl3;
	c=U.color;
	hsl=colorHSL(c,true);

	//console.log(colorHex('yellow'))
	function wh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	let wheel = wh(c,'yellow').concat(wh('yellow','red')); //generateArrayColors(c, '#ffff00', 10); //arrRepeat(12,'orange');
	//wheel = wh('yellow','red')

	function whh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
	function genc(c,hinc){	let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,hsl.s*100,hsl.l*100);}
	function cinc(c,hinc,sinc,linc){let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,clamp(hsl.s*100+sinc,0,100),clamp(hsl.l*100+linc,0,100));}
	function arrd(c,hinc,sinc,linc,n){let r=[];for(let i=0;i<n;i++){r.push(cinc(c,hinc*i,sinc*i,linc*i));}return r;}

	function light(c,lper=75){let hsl=colorHSL(c,true);return colorHSLBuild(hsl.h,hsl.s*100,lper);}
	function sat(c,sper=100){let hsl=colorHSL(c,true);return colorHSLBuild(sper,hsl.s*100,hsl.l*100);}
	function hue(c,hdeg){let hsl=colorHSL(c,true);return colorHSLBuild(hdeg,hsl.s*100,hsl.l*100);}

	c=light(c,75);
	c=cinc(c,30,0,0);
	wheel=arrd(c,30,0,0,12);
	console.log(wheel);

	hsl=colorHSL(c,true);
	console.log('hsl',hsl);
	c1=colorHSLBuild(hsl.h,hsl.s*100,hsl.l*100);
	hsl1=colorHSL(c1,true);
	console.log('hsl1',hsl1);
	c2=genc(c1,30); console.log('c2 raw',c2)
	hsl2=colorHSL(c2,true);
	console.log('hsl2',hsl2);

	c3=cinc(c2,30,10,20);
	hsl3=colorHSL(c3,true);
	console.log('hsl3',hsl3);

	//console.log(genc('red',0));
	//return;
	//console.log('wheel',wheel)
	showWheel(wheel, 'white'); // hat 12 colors
}
async function test32_colorjs(){
	await prelims();
	UI.nav.activate('schedule');
	onclickSchedule();

	let wheel = arrRepeat(12,'orange');

	var rainbow = new Rainbow();

	let c1=U.color; //BLUEGREEN;
	console.log('color',c1);
	let c2=getMatchingColor(c1,90);
	let c3=getMatchingColor(c2,90);
	c3=getComplementaryColor(c1);


	//return;

	rainbow.setSpectrum(c1,c3); //rColor(75),rColor(75)); //'red','green'); //'#ffffff', '#3E296B');
	rainbow.setNumberRange(1, 12); 
	//rainbow.colourAt(number); // based on the numbers from your array, this would return the color you want
	wheel=[];
	for(let i=0;i<12;i++) wheel.push('#'+rainbow.colourAt(i));
	//shuffle(wheel)
	console.log('wheel',wheel)

	// wheel = generateGradientColor(colorToNumber('red'),colorToNumber('blue'),5); //rColor(75,.5), rColor(75,.5), 12);
	// console.log('wheel',wheel)
	// wheel=wheel.map(x=>numberToColor(x));
	// console.log('wheel',wheel)
	showWheel(wheel, 'white'); // hat 12 colors
}
async function test31_colorjs(){
	await prelims();
	UI.nav.activate('colors');
	onclickColors();
}
async function test30_palette(){
	let pal = getPalette('red');
	console.log('pal',pal);
	for(const c of pal){
		mDom('dMain',{w:50,h:50,bg:c},{html:c})
	}
	//nimm pal[4]=orig color, pal[2]=dark, pal[6] und pal[7]
	//buildPaletteA('dMain',['violet']);
}
async function test29_user(){
	//localStorage.setItem('username','felix');
	await prelims();
}
async function test28_allColors() {
	await prelims();
	showColors(M.playerColors,onclickColor)
}
function test26_rColors() {
	loadPlayerColors();
	let d = mBy('dMain'); mFlexWrap(d);
	for (const c of plColors) { mDom(d, { w: 90, h: 25, bg: c, fg: 'white' }, { html: colorFrom(c) }); }
}
async function test24_newPrelims(){
	if (nundef(M.superdi)) {
		Config = await mGetYaml('../y/config.yaml');
		M = {};
		M.superdi = await mGetYaml('../assets/superdi.yaml');

		M.byCollection={};
		M.byCat={};
		M.byFriendly={};
		M.collections = ['all'];
		M.categories = [];
		M.names = [];
		for(const k in M.superdi){
			let o = M.superdi[k];
			if (isdef(o.coll)) {lookupAddIfToList(M.byCollection,[o.coll],o.key);addIf(M.collections,o.coll);}
			o.cats.map(x=>{lookupAddIfToList(M.byCat,[x],o.key);addIf(M.categories,x);});
			if (isdef(o.friendly)) {lookupAddIfToList(M.byFriendly,[o.friendly],o.key);	addIf(M.names,o.friendly);}
		}
		M.collections.sort();
		M.categories.sort();
		M.names.sort();

		await updateCollections();

		//console.log('M', M, 'Config', Config);
		let nav = UI.nav = mNavbar('COMBU', ['add', 'play', 'schedule', 'view'], ['user']);
		//console.log('nav',nav)
		nav.disable('play');
		dTitle = mDom(document.body); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
		mInsert(document.body, dTitle, 1);

	}

}
async function test23_integratefa6(){
	await prelims();
	let difa = await mGetYaml('../assets/fa6.yaml');
	for(const k in difa){
		let onew=difa[k];
		let o=M.superdi[k];
		if (nundef(o)) M.superdi[k]=onew;
		else {
			for(const c of onew.cats) addIf(o.cats,c);
			addKeys(onew,o);
		}
	}

	let keys = Object.keys(M.superdi);
	keys.sort();
	let difinal={}
	for(const k of keys){
		difinal[k]=M.superdi[k]
	}
	downloadAsYaml(difinal,'mhuge');

}
async function YES_test22_coolHackFa() {
	await prelims();
	let text = await mGetText('../basejs/alibs/fa/all.css');
	//console.log('text', text.substring(0, 200));

	let lines = text.split('\n');
	//console.log('lines', lines.length);
	let di = {}, codes = {};
	let count = 0;

	let byUni = {};
	for (const k in M.superdi) {
		let o = M.superdi[k];
		if (nundef(o.fa) && nundef(o.ga)) continue;
		let key = (o.fa ?? o.ga).toLowerCase();
		byUni[key] = o;
	}

	//let unicodes = Object.values(M.superdi).filter(x=>isdef(x.fa)||isdef(x.ga)).map(x=>(x.fa??x.ga).toLowerCase());
	//console.log('unicodes',unicodes);
	for (let i = 1; i < lines.length; i++) {
		let l = lines[i];
		let lprev = lines[i - 1];
		if (l.includes('content')) {
			let key = stringAfter(lprev, '.fa-');
			key = stringBefore(key, ':');
			if (key.length == 1) continue;
			let code = stringAfter(l, 'content: "\\');
			code = stringBefore(code, '"')
			if (isdef(codes[code])) continue;
			//if (nundef(byUni[code])) { console.log('new', code) }
			codes[code] = key;
			let o = di[key] = { key: key, code: code, family: 'fa6' };

			//drawFa6(o);

			//if (++count % 9 == 0) mDom('dMain',{},{html:'<br>'});
			if (key == 'level-up-alt' || key == 'turn-up') break;
		}
	}
	//console.log(Object.keys(di))

	let dinew = {};
	let [allnew,same,codeexists,keyexists]=[{},{},{},{}];
	for (const k in di) {
		let k1 = replaceAll(k, '-', '_');
		let o = M.superdi[k1];
		let onew = di[k];
		let code = onew.code;
		//if (k == 'user') {			console.log('user',di[k],M.superdi[k]); return;		}
		if (nundef(o) && nundef(byUni[code])) {
			//console.log('new key w/ new code:', onew);
			allnew[k1]={key:k1,friendly:k,cats:['symbol'],coll:'fa6',fa6:code}
		} else if (nundef(o)) {
			//console.log('code exists in superdi w/ different key', k, code);
			o=byUni[code];
			codeexists[k1]={key:k1,friendly:o.friendly,cats:o.cats,coll:'fa6',fa6:code}
		} else if (isdef(o) && isdef(byUni[code])) {
			//console.log('in superdi w/ same code', k1, code)
			same[k1]={key:k1,friendly:o.friendly,cats:o.cats,coll:'fa6',fa6:code}
		} else if (isdef(o)) {
			let ocode = isdef(o.fa) || isdef(o.ga) ? (o.fa ?? o.ga).toLowerCase() : '';
			keyexists[k1]={key:k1,friendly:o.friendly,cats:o.cats,coll:o.coll,fa6:code}
			//console.log('in superdi w/ diff code', k1, code, ocode)
		}
		//drawFa6(onew); drawFaga(byUni[onew.code]); mDom('dMain')
		//dinew[k1] = di[k];
	}
	console.log('new',Object.keys(allnew))
	console.log('same',Object.keys(same))
	console.log('code exists',Object.keys(codeexists))
	console.log('key exists',Object.keys(keyexists))

	dinew.allnew = allnew;
	dinew.same = same;
	dinew.codeexists = codeexists;
	dinew.keyexists = keyexists;

	//mach besseres friendly!
	let di2={};
	for(const k in dinew){
		let di=dinew[k];
		for(const k1 in di){
			let o=di[k1];
			o.cats.push(k);
			addIf(o.cats,'fa6');

			if (k1.includes('arrow') || (k1.includes('down')||k1.includes('up')) && (k1.includes('left')||k1.includes('right'))) o.friendly='arrow';
			else if (k1.includes('plant')) o.friendly='plant';
			else if (k1.includes('_')) o.friendly = stringBefore(k1,'_');

			di2[k1] = o;
		}
	}
	//mach ein fakeys???

	//console.log(Object.keys(dinew))
	//downloadAsYaml(di2,'fa6')

}
async function test21_user() {
	await prelims();
	let nav = UI.nav.ui;
	console.log('nav', nav)

	html = `
		<li class="nav-item">
			<a class="nav-link a" href="#" onclick="onclickUser()">
				<i class="fa fa-user">
			</a>
		</li>
	`;

	html = `
			<a class="nav-link a" href="#" onclick="onclickUser()">
				<i class="fa fa-user">
			</a>
	`;

	html = `
			<a href="#" onclick="onclickUser()">
				<i class="fa fa-user">
			</a>
	`;
	html = `
				<i class="nav-item nav-link fa fa-user fa-2x">
	`;

	//mDom(nav,{'align-self':'end',fg:'grey'},{html:html}); //`<i class="fa fa-user">`});

	//let fa = mDom(nav,{'align-self':'end',fg:'grey',fz:20,cursor:'pointer'},{tag:'i',className:'nav-item nav-link fa fa-user'}); 

	let styles = { 'align-self': 'end', fg: 'grey', fz: 20, cursor: 'pointer' };
	addKeys({ family: 'fa6' }, styles)
	let fa = mDom(nav, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa) })

	console.log('fa', fa)
}
async function test20_sidebar() {
	onclickView(); //calls showSidebar TODO!
}
async function YES_test19_BEST(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = await imgAsync(d,{},{tag:'img',src:path});
	let dataUrl = imgToDataUrl(img);
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
	console.log('response',resp)
}
async function test18_nochBesser(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';

	let img = await loadImageAsync(path);
	mAppend(d,img);

	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
}
async function test17_awaitOnload(){
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = await loadImageAsync(path);
	mAppend(d,img);
	//let img = mDom(d,{},{tag:'img'});
	let resp = await ximage(img,path);
	console.log('response',resp);
}
async function __ximage(img,path){
	const canvas = document.createElement('canvas');
	canvas.width = img.width;
	canvas.height = img.height;
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	const dataUrl = canvas.toDataURL('image/png');
	let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
	let resp = await uploadJson('save',o)
	return resp;
}
async function test16_uploadBase64(){ //geht nachdem added app.use(bodyParser.json({ limit: '200mb' })); //works!!!
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = mDom(d,{},{tag:'img',src:path});
	img.onload = async ()=>console.log(await uploadImg2(img,path));
}
async function test15_simpleImageUpload(){ //geht jetzt!
	let d=mBy('dMain');
	let path = '../y/img/minoutest.png';
	let img = mDom(d,{},{tag:'img',src:path});
	img.onload = async()=>{
		// uploadImg2(img);
		const canvas = document.createElement('canvas');
		canvas.width = img.width;
		canvas.height = img.height;
		const ctx = canvas.getContext('2d');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
		const dataUrl = canvas.toDataURL('image/png');
		let o = { data: {image:dataUrl}, path: path, mode: 'wi' };
		let resp = await uploadJson('save',o)
		console.log('response',resp);
	}
}
async function test14_uploadBase64(){ //YEAH!!!!
	let d=mBy('dMain');
	let img = mDom(d,{},{tag:'img',src:'../assets/img/emo/unicorn.png'});
	img.onload = async ()=>console.log(await uploadImg2(img));
}
async function YES_test13_save(){
	let o = {path:'',data:{text:'I am TOMAS',pos:22},mode:'ac'};
	let resp = await uploadJson('save',o)
	console.log('response',resp);

}
async function YES_test12_save(){
	//a ... append text/json
	//ay ... append as yaml mit addKeys (existing keys ignored!)
	//wy ... append as yaml mit copyKeys (existing keys overwritten!)
	//w ... override text/json
	//wi ... override image
	//oy ... override yaml
	//as ... addKeys to session object
	//ws ... copyKeys to session object
	//ac ... addKeys to config object and save config
	//wc ... copyKeys to config object and save config
	//_ac ... addKeys to config object without saving!!!
	//_wc ... copyKeys to config object without saving!!!
	//c ... just save config file and reload
	let o = {path:'../combu/test.txt',data:{text:'I am Sam',pos:22},mode:'a'};
	let resp = await uploadJson('save',o)
	console.log('response',resp);

}
async function test11_altviewer(){
	await prelims();

	showTitle('Collection:'); 
	dMenu = mDom(dTitle,{h:'100%'});mFlexV(dMenu); mStyle(dMenu, { gap: 14 });

	mClear('dMain');
	M.rows = 5; M.cols = 8;
	M.grid = mGrid(M.rows, M.cols, 'dMain');
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: 'sienna', box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}

	initCollection('all');
}
async function YES_test10_showMessage(){
	showFleetingMessage('HALLO!!!!','dMessage',{bg:'pink'})
}
async function YES_test9_correctMHuge(){
	M = await mGetYaml('../assets/mhuge.yaml');
	for(const k in M.superdi){
		let o=M.superdi[k];
		if (isdef(o.text)) o.coll = 'emo';
		else if (isdef(o.ga) || isdef(o.fa)) o.coll = 'icon';
		else if (isdef(o.path) && o.path.includes('amanda')) o.coll = 'amanda';
		else if (isdef(o.path) && o.path.includes('airport')) o.coll = 'big';
		else if (isdef(o.path) && o.path.includes('animal')) o.coll = 'animals';
		else if (isdef(o.path) && o.path.includes('emo')) o.coll = 'emo';
		else console.log('OTHER!!!!!!',k);
	}
	M.collections = ['amanda','animals','big','emo','icon'];
	//downloadAsYaml(M,'mhuge');
}
async function test8_addDrop(){
	await onclickAdd();
	ondropPreviewImage('../y/bubblebath.png')
}
async function NO_test7_calendar(){
	await prelims();

	showTitle('Add to Collections');

	mClear('dMain');

	let d1 = mDiv('dMain', { w: 800, h: 800, bg: 'white' });
	Config.events = [
		
	]
  let x = DA.calendar = uiTypeCalendar(d1);

}
async function test6_showAll() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}
	dTitle.innerHTML = 'View Collections';
	mClear('dMain');

	M.rows = 5; M.cols = 8;
	M.grid = mGrid(M.rows, M.cols, 'dMain');
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { bg: 'sienna', box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}

	M.keys = Object.keys(M.superdi);
	M.index = 0;
	M.grid.onclick = () => showNextBatch();
	showNextBatch();
}
async function test5_showImage() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}

	dTitle.innerHTML = 'View Collections';
	mClear('dMain')
	let cat = rChoose(M.categories);
	mDom('dMain', {}, { tag: 'h2', html: `Collection: ${cat}` })
	for (const k of M.byCat[cat]) {
		console.log('k', M.superdi[k]);
		showImage(k, 'dMain')
	}
}
async function test4_checkpath() {
	if (nundef(M.emos)) {
		M = await mGetYaml('../assets/mhuge.yaml');
		console.log('M', M);
		mNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}
	for (const k in M.superdi) {
		let o = M.superdi[k];

		if (isdef(o.img)) {
			if (!o.path.endsWith(o.ext)) console.log('path corrupt:', k, o.path);
			else if (stringCount(o.path, '.') != 3) console.log('path contains not exactly 3!!!', k, o.path);
			// else console.log('ok',k);

		}
	}
}
async function YES_test3_createMHuge() {
	M = await loadCollections();
	downloadAsYaml(M, 'mhuge')
}
async function test2_theRealM() {
	await loadCollections();
	console.log(M)
	//downloadAsYaml(M,'mhuge');
}
async function test1_showCollection() {
	await loadCollections();
	let [emos, cats] = [M.emos, M.categories];
	dTitle.innerHTML = 'View Collections';
	mClear('dMain')
}
async function test0_addToCollection() {
	await loadCollections();
	let [emos, cats] = [M.emos, M.categories];
	dTitle.innerHTML = 'Add to Collection';
	mClear('dMain')
	let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);

	let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { console.log('H!'); ev.preventDefault(); return false; } });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', value: '', className: 'input', placeholder: "<enter value>" });
	mDom(dForm, { h: 10 })

	UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
	UI.dForm = dForm;
	UI.dButtons = mDom(dForm, { display: 'inline-block' });
	UI.imgColl = dl.inpElem;
	UI.imgName = inpName;

}
