

function findNextBar(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	for (let x = x1; x < x2; x++) {
		for (let y = y1; y < y2; y++) {
			let c = isPix(ctx, x, y, cgoal, delta);
			if (c) {
				//console.log('____pix',c,'goal',cgoal,delta);
				//drawPix(ctx,x,y,'red',1)
				drawPixFrame(ctx, x - 1, y - 1, 'red', 3)
				let len = 1, yy = y + 1; xx = x; //+1;
				while (yy < y2) {
					let p = getPixRgb(ctx, xx, yy);
					let c1 = isPix(ctx, xx, yy, cgoal, delta + 10);
					//console.log('p',p,c1)
					yy++;
					if (c1) len++;
				}
				return { c, x, y, len };
			}
		}
	}
}
function findNextLine(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
	for (let y = y1; y < y2; y++) {
		for (let x = x1; x < x2; x++) {
			let c = isPix(ctx, x, y, cgoal, delta);
			if (c) {
				//console.log('____pix',c,'goal',cgoal,delta);
				//drawPix(ctx,x,y,'red',1)
				drawPixFrame(ctx, x - 1, y - 1, 'red', 3)
				let len = 1, xx = x + 1; yy = y; //+1;
				while (xx < x2) {
					let p = getPixRgb(ctx, xx, yy);
					let c1 = isPix(ctx, xx, yy, cgoal, delta + 10);
					//console.log('p',p,c1)
					xx++;
					if (c1) len++;
				}
				return { c, x, y, len };
			}
		}
	}
}













async function onclickNATIONS() {

	if (nundef(M.natCards)) M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');

	//showTitle('NATIONS!!!');
	M.civs = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];

	let player = M.player = { civ: rChoose(M.civs) };

	//brauche events in ages,progress in ages
	M.ages = { 1: { events: [], progress: [] }, 2: { events: [], progress: [] }, 3: { events: [], progress: [] }, 4: { events: [], progress: [] } };
	for (const k in M.natCards) {
		let c = M.natCards[k];
		if (c.age == 0) continue;
		let age = c.age == 0 ? 1 : c.age;
		if (c.Type == 'event') M.ages[age].events.push(k); else M.ages[age].progress.push(k);
	}
	//set age=1
	M.age = 1;
	M.events = M.ages[M.age].events;
	M.progress = M.ages[M.age].progress;
	arrShuffle(M.progress);
	arrShuffle(M.events);

	//cardgrid
	let d1 = mDiv('dMain'); mFlex(d1);
	M.rows = 3; M.cols = 7;
	let bg = mGetStyle('dNav', 'bg');
	let h = 180;

	let dcost = M.costGrid = mGrid(M.rows, 1, d1, { 'align-self': 'start' });
	for (let cost = 3; cost >= 1; cost--) {
		let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});

		for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
	}
	// mDom(dcost, { bg: 'pink', fg:'contrast', box: true, margin: 2, h: h,w:20, overflow: 'hidden' },{html:2});
	// mDom(dcost, { bg: 'pink', fg:'contrast', box: true, margin: 2, h: h,w:20, overflow: 'hidden' },{html:1});

	M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
	M.cells = [];
	for (let i = 0; i < M.rows * M.cols; i++) {
		let d = mDom(M.grid, { box: true, margin: 2, h: h, overflow: 'hidden' });
		mCenterCenterFlex(d);
		M.cells.push(d);
	}
	let n = M.rows * M.cols;
	M.market = [];
	for (let i = 0; i < n; i++) {
		let k = M.progress.shift();
		M.market.push(k);
		let card = M.natCards[k];
		let img = mDom(M.cells[i], { h: h, w: 115 }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
		img.setAttribute('key', k)
		img.onclick = buyProgressCard;
	}

	mDom('dMain', { h: 20 })

	let dciv = mDom('dMain', { w: 800, h: 420, maleft: 52, bg: 'red', position: 'relative' });
	let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, { position: 'absolute' }, { tag: 'img' }));

	//add spots to civ
	M.civCells = [];
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 7; j++) {
			let r = getCivSpot(player.civ, i, j);
			let [dx,dy,dw,dh]=[10,10,15,20]
			let d = mDom(dciv, { box: true, w: r.w+dw, h: r.h+dh, left: r.x-dx, top: r.y-dy, position: 'absolute', overflow: 'hidden' });
			mCenterCenterFlex(d);
			M.civCells.push(d);
			d.onclick = () => selectCivSpot(d);
		}
	}
}
function buyProgressCard(ev) {
	let o = evToAttr(ev, 'key');
	console.log('player buys',o.val);
	o.elem.remove();
	let spot = M.selectedCivSpot
	if (isdef(spot)) {
		spot.innerHTML = '';
		let [w,h]=[mGetStyle(spot,'w'),mGetStyle(spot,'h')];
		mAppend(spot, o.elem);
		mStyle(o.elem, { h: h,w:w });
		//o.elem.setAttribute('pointer-events', 'none');
		o.elem.onclick = () => selectCivSpot(spot)
		mClassRemove(M.selectedCivSpot,'shadow');
		M.selectedCivSpot = null;
	}
}
function selectCivSpot(d) {
	if (isdef(M.selectedCivSpot)) mClassRemove(M.selectedCivSpot,'shadow');
	M.selectedCivSpot = d;
	mClass(d,'shadow')
	//console.log('civ spot is',M.selectedCivSpot)
}