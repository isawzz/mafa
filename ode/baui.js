
function createPanZoomCanvas(parentElement, src, wCanvas, hCanvas) {
	// Create canvas and button elements
	const canvas = document.createElement('canvas');
	// const saveButton = document.createElement('button');
	// saveButton.textContent = 'Save Image';

	// Set canvas dimensions
	canvas.width = wCanvas;
	canvas.height = hCanvas;

	// Append elements to the parent element
	parentElement.appendChild(canvas);
	//parentElement.appendChild(saveButton);

	const ctx = canvas.getContext('2d');
	let image = new Image();
	image.src = src;

	// Variables for panning and zooming
	let scale = 1;
	let originX = 0;
	let originY = 0;
	let startX = 0;
	let startY = 0;
	let isDragging = false;

	image.onload = () => {
		// Center the image initially
		originX = (canvas.width - image.width) / 2;
		originY = (canvas.height - image.height) / 2;
		draw();
	};

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.save();
		ctx.translate(originX, originY);
		ctx.scale(scale, scale);
		ctx.drawImage(image, 0, 0);
		ctx.restore();
	}

	// Mouse events for panning
	canvas.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.clientX - originX;
		startY = e.clientY - originY;
		canvas.style.cursor = 'grabbing';
	});

	canvas.addEventListener('mousemove', (e) => {
		if (isDragging) {
			originX = e.clientX - startX;
			originY = e.clientY - startY;
			draw();
		}
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	canvas.addEventListener('mouseout', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// Mouse wheel event for zooming
	canvas.addEventListener('wheel', (e) => {
		e.preventDefault();
		const zoom = Math.exp(e.deltaY * -0.001);
		scale *= zoom;

		// Zoom relative to the mouse pointer
		const mouseX = e.clientX - canvas.offsetLeft;
		const mouseY = e.clientY - canvas.offsetTop;
		originX = mouseX - (mouseX - originX) * zoom;
		originY = mouseY - (mouseY - originY) * zoom;

		draw();
	});

	// Touch events for mobile support
	let touchStartX = 0;
	let touchStartY = 0;

	canvas.addEventListener('touchstart', (e) => {
		if (e.touches.length === 1) {
			isDragging = true;
			touchStartX = e.touches[0].clientX - originX;
			touchStartY = e.touches[0].clientY - originY;
			canvas.style.cursor = 'grabbing';
		}
	});

	canvas.addEventListener('touchmove', (e) => {
		if (e.touches.length === 1 && isDragging) {
			originX = e.touches[0].clientX - touchStartX;
			originY = e.touches[0].clientY - touchStartY;
			draw();
		}
	});

	canvas.addEventListener('touchend', () => {
		isDragging = false;
		canvas.style.cursor = 'grab';
	});

	// // Save button event
	// saveButton.addEventListener('click', () => {
	// 	const dataURL = canvas.toDataURL('image/png');
	// 	const link = document.createElement('a');
	// 	link.href = dataURL;
	// 	link.download = 'canvas-image.png';
	// 	link.click();
	// });

	return canvas;
}
function savePanZoomCanvas(canvas) {
	if (canvas) {
		const dataURL = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'canvas-image.png';
		link.click();
	}
}

//#region 13.6.24 alles bau1 bau2 bau3 bau4
async function onclickAddSelected() {
	let keys = UI.selectedImages;
	let collist = M.collections.filter(x => !simpleLocked(x)).map(x => ({ name: x, value: false }));
	let result = await mGather(iDiv(UI.addSelected), {}, { content: collist, type: 'checkList' });
	if (!result) { console.log('CANCELLED!!!'); simpleClearSelections(); return; }
	console.log('result',result); return;
	result = result.split('@');
	result = result.filter(x => !isEmptyOrWhiteSpace(x))
	if (isEmpty(result)) { console.log('nothing added'); collClearSelections(); return; }
	let di = {}, changed = false;
	for (const kc of selist) {
		let key = stringBefore(kc, '@');
		let o = M.superdi[key];
		for (const collname of result) {
			if (o.colls.includes(collname)) continue;
			changed = true;
			o.colls.push(collname);
			di[key] = o;
		}
	}
	if (!changed) { console.log('nothing added'); collClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	collPostReload();

}


async function onclickSaveCropData() {
	let o = UI.zoomo;
	let pd = UI.panData;
	console.log(o,pd); return;
	let [d,img,wOrig,hOrig,sz,fa,famin]=[o.d,o.img,o.wOrig,o.hOrig,o.sz,o.fa,o.famin];
	if (fa>=1) {console.log('cant zoom in more!!!',fa); return;}
	fa*=1.5;if (fa>1)fa=1; UI.fa=fa;
	showImgCentered(d,img,wOrig,hOrig,sz,fa,famin);

}
function showImgCentered(d,img,wOrig,hOrig,sz,fa,famin){
	UI.zoomo={d,img,wOrig,hOrig,sz,fa,famin};
  let wsc=wOrig*fa, hsc=hOrig*fa; console.log('fa',fa);

	let [xwo,ywo]=[(sz-wsc)/2,(sz-hsc)/2]

  showImagePartial(d, img, 0,0,wOrig,hOrig,xwo,ywo,wsc,hsc, sz, sz, wOrig,hOrig); //, dx, dy, wCrop, hCrop, wCanvas, hCanvas, wOrig, hOrig);
	let szCrop = sz-100;
  let dc = mDom(d, { position: 'absolute', left: (sz-szCrop) / 2, top: (sz-szCrop) / 2, w: szCrop, h: szCrop, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
}
async function onclickZoomIn() {
	let o = UI.zoomo;
	let [d,img,wOrig,hOrig,sz,fa,famin]=[o.d,o.img,o.wOrig,o.hOrig,o.sz,o.fa,o.famin];
	if (fa>=1) {console.log('cant zoom in more!!!',fa); return;}
	fa*=1.5;if (fa>1)fa=1; UI.fa=fa;
	showImgCentered(d,img,wOrig,hOrig,sz,fa,famin);

}
async function onclickZoomOut() {
	let o = UI.zoomo;
	let [d,img,wOrig,hOrig,sz,fa,famin]=[o.d,o.img,o.wOrig,o.hOrig,o.sz,o.fa,o.famin];
	if (fa*wOrig<=sz && fa*hOrig<=sz) {console.log('cant zoom out more!!!',wOrig,hOrig,fa, fa*wOrig,fa*hOrig,sz); return;}
	fa*=0.5;if (fa<famin) fa = famin; UI.fa=fa;
	showImgCentered(d,img,wOrig,hOrig,sz,fa,famin);

}

function showImagePartial(dParent, image, x, y, w, h, left, top, wShow, hShow, wCanvas, hCanvas) {

	mClear(dParent)
	let canvas = mDom(dParent, {}, { tag: 'canvas' }); //console.log('left', left, 'top', top)
	//const canvas = document.getElementById('canvas');
	const ctx = canvas.getContext('2d');

	// Set canvas size to the specified width and height
	canvas.width = wCanvas;
	canvas.height = hCanvas;

	// Draw the specified part of the image onto the canvas
	ctx.drawImage(image, x, y, w, h, left, top, wShow, hShow);
}
function startPanning(ev) {
	console.log('_________startPanning!')
	const panData = {};
	function panStart(ev) {
		evNoBubble(ev);
		assertion(nundef(panData.panning), panData)
		let dc = panData.dCrop = ev.target;
		panData.cropStartSize = { w: mGetStyle(dc, 'w'), h: mGetStyle(dc, 'h') }
		panData.cropStartPos = { l: mGetStyle(dc, 'left'), t: mGetStyle(dc, 'top') }
		panData.elParent = panData.dCrop.parentNode;
		panData.img = panData.elParent.querySelector('img, canvas');//console.log('img',panData.img);
		panData.panning = true;
		panData.counter = -1;
		panData.mouseStart = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		panData.posStart = { x: mGetStyle(dc, 'left'), y: mGetStyle(dc, 'top') };
		addEventListener('mouseup', panEnd);
		panData.elParent.addEventListener('mousemove', panMove);
		console.log('panStart!', panData.mouseStart);
	}
	function panMove(ev) {
		evNoBubble(ev);
		if (!panData.panning || ++panData.counter % 3) return;
		panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		let [x, y] = [panData.posStart.x, panData.posStart.y];
		let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
		[dx, dy] = [Math.round(dx / 10) * 10, Math.round(dy / 10) * 10];
		adjustComplex(panData)
	}
	function panEnd(ev) {
		assertion(panData.panning == true);
		let d = evToClass(ev, 'imgWrapper');
		if (d == panData.elParent) {
			evNoBubble(ev);
			panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
			console.log('SUCCESS!', panData.mouse)
		}
		removeEventListener('mouseup', panEnd);
		panData.elParent.removeEventListener('mousemove', panMove);
		panData.panning = false;
		console.log('* THE END *', panData)
		UI.panData = panData;
	}
	panStart(ev);
}

function isExactly(n,num=1){return n == num;}
function isAtLeast(n,num=1){return n >= num;}
function simpleSidebar(wmin) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	let stylesTitles={matop:10,bg:'#ffffff80',fg:'black'};

	let cmds = {};
	//mDom(d,stylesTitles,{html:'Collection:'});
	cmds.simpleNew = mCommand(d, 'simpleNew', 'New'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Selection:'})
	cmds.simpleSelectAll = mCommand(d, 'simpleSelectAll', 'Select All'); mNewline(d, gap);
	cmds.simpleSelectPage = mCommand(d, 'simpleSelectPage', 'Select Page'); mNewline(d, gap);
	cmds.simpleClearSelections = mCommand(d, 'simpleClearSelections', 'Clear Selection',{fSel:x=>x>=1}); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Item:'})
	cmds.setAvatar = mCommand(d, 'setAvatar', 'Set Avatar',{fSel:x=>x==1}); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Items:'})
	cmds.addSelected = mCommand(d, 'addSelected', 'Add To',{fSel:x=>(x>=1)}); mNewline(d, gap);
	cmds.simpleRemove = mCommand(d, 'simpleRemove', 'Remove',{fSel:x=>(!simpleLocked() && x>=1)}); mNewline(d, gap);

	// UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	// UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	// UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	// UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	// UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	// UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
	// simpleDisableListCommands();
	// simpleDisableItemCommands();
	copyKeys(cmds,UI.commands);
	simpleCheckCommands();
}
function simpleCheckCommands(){
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let n = UI.selectedImages.length; 
	for(const k in UI.commands){
		let cmd = UI.commands[k];
		if (nundef(cmd) || nundef(iDiv(cmd))) continue;

		//console.log(cmd)
		//let x = cmd.fSel(n);console.log('k',k,cmd,x)
		if (nundef(cmd.fSel) || cmd.fSel(n)) cmdEnable(k); else cmdDisable(k);
	}
}



function adjustCropper1(img, dc, sz) {
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });
}

function showImagePart(dParent,src,x,y,wi,hi){
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


//#endregion

//region fishgame
async function showTable(id) {
	let me = getUname();
	let table = await mGetRoute('table', { id });  //console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	let func = DA.funcs[table.game];
	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); 
	d.innerHTML = `<h2>${getGameProp('friendly').toUpperCase()}: ${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d);
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d);
	func.stats(table);
	let minTableSize = 400;
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);
	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }
	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);
	await updateTestButtonsPlayers(table);
	func.activate(table, items);
}

function fishgame() {

	function setup(table) {
		let fen = {};
		fen.deck = rChoose(M.byCollection.animals, 170); //range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
			pl.cards = deckDeal(fen.deck, 5);
		}
		//fen.cards = [1, 2, 3];
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	function present(table) {
		let fen = table.fen;
		let d = mBy('dTable');
		d.style = '';
		d.className = '';

		mStyle(d, { hmin: 500, w: '90%', margin: 20 }); //, bg:'#ffffffaa'}); // bgImage:`url('../assets/textures/marble_water.jpg')` });
		d.innerHTML = ' ';

		let me = getUname();
		let pl = table.players[me];

		let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
		for (const c of pl.cards) {
			//let d1=mDom(dCards, {w:100,h:100,bg:U.color})
			showImageCard(c, dCards, { bg: U.color }); //, {sz:100,border:})
		}
		//mach eine animal card
		//wie geht das?
		//console.log(M.byCat.animal)



		//mBy('dTable').remove(); 
		//let dTable = 
	}
	function restPresent(table) {
		let dTable = mBy(dTable); mClassRemove(dTable, 'wood');
		mStyle('dTable', { padding: 25, w: 400, h: 400, rounding: 0 }); //, bgImage:'../assets/textures/' });
		let d = mDom('dTable', { gap: 10, padding: 0 }); mCenterFlex(d);
		let items = [];
		for (const card of fen.cards) {
			let item = cNumber(card);
			mAppend(d, iDiv(item));
			items.push(item);
		}
		return items;
	}
	async function activate(table, items) {
		return;
		await instructionStandard(table); //browser tab and instruction if any

		if (!isMyTurn(table)) { return; } //console.log('table.turn',table.turn); 

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//check end condition
		if (isEmpty(table.fen.cards)) return gameoverScore(table);

		//bot move activation: in solo mode OR if user is a bot
		if (amIHuman(table) && table.options.gamemode == 'multi') return;

		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return; //console.log('bot name',name)

		await botMove(name, table, items);
	}
	async function botMove(name, table, items) {
		let ms = rChoose(range(2000, 5000));

		TO.bot = setTimeout(async () => {
			let item = rChoose(items);
			toggleItemSelection(item);
			TO.bot1 = setTimeout(async () => await evalMove(name, table, item.key), 500);

		}, rNumber(ms, ms + 2000));

	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		try { await mSleep(200); } catch (err) { return; }
		await evalMove(getUname(), table, item.key);
	}
	async function evalMove(name, table, key) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let step = table.step;

		let best = arrMinMax(table.fen.cards).min;
		let succeed = key == best;
		if (succeed) {
			table.players[name].score += 1;

			//calc how to replace cards from set
			let fen = table.fen;
			let newCards = deckDeal(fen.deck, 1);
			if (newCards.length > 0) arrReplace1(fen.cards, key, newCards[0]); else removeInPlace(fen.cards, key);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: key, change: succeed ? '+1' : '-1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (succeed) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o);
	}
	return { setup, present, stats, activate };

}
function showImageCard(key, dParent, styles = {}, opts = {}) {
	let d = mDom(dParent, styles, opts);
	let o = M.superdi[key];
	console.log(o);
	let d1 = showImage1(key, d);
}
function showImage1(key, dParent, styles = {}, useSymbol = false) {
	let o = M.superdi[key];
	assertion(o, `showImage:key not found ${key}`);
	let [w, h] = mSizeSuccession(styles); console.log(w, h)
	let [sz, fz] = [.9 * w, .8 * h];
	addKeys({ position: 'relative', w, h, padding: 11, box: true }, styles)
	let d1 = mDiv(dParent, styles);//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'contain', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	assertion(el, 'PROBLEM mit' + key);
	return d1;
}

//#endregion





















