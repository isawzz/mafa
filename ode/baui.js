async function simpleOnDroppedItem(itemOrKey, key, sisi) {
	//console.log(itemOrKey)
	if (nundef(sisi)) sisi = UI.simple;
	let item;
	if (isString(itemOrKey)) { key = itemOrKey; item = M.superdi[key]; } else { item = itemOrKey; }
	//console.log('===>',key, item)
	assertion(isdef(key), 'NO KEY!!!!!');

	lookupAddIfToList(item, ['colls'], sisi.name);

	let o = M.superdi[key]; //console.log(key, item, o, sisi)
	//assertion(nundef(o) || o == item, "DISPARITY!!!!!!!!!!!!!!!!!!!!!")
	// let list = item.colls;
	if (isdef(o)) { //} && list.includes(sisi.name)) { 
		//check if any changes to o in item
		console.log(`HA! ${key} already there`);
		let changed = false;
		for (const k in item) {
			let val = item[k];
			if (isLiteral(val) && o[k] != item[k]) { changed = true; break; }
			else if (isList(val) && !sameList(val, o[k])) { changed = true; break; }
		}
		if (!changed) return;
	}// dropped item into same collection!!!
	console.log(`........But changed!!!`);
	//addIf(item.colls, sisi.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	simpleInit(sisi.name, sisi)
}

async function updateSuperdi(di, key) {
	console.log('send postUpdateSuperdi', { di })
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
}

function getImageData(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous'; // To avoid CORS issues
		img.src = src;

		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = img.width;
			canvas.height = img.height;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			let data = canvas.toDataURL('image/png');
			resolve(data);
			// const imageData = ctx.getImageData(0, 0, img.width, img.height);
			// resolve(imageData);
		};

		img.onerror = (err) => {
			reject(new Error('Failed to load image'));
		};
	});
}
async function simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi) {
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;

	let [name, imgname] = findUniqueSuperdiKey(friendly);

	console.log('key name will be', name, imgname);
	//console.log('NIX PASSIERT!!!! key name will be',name,imgname); return;
	let key = name, filename = name + '.png';
	//name ist unique! oder ich hab noch das slot fuer img oder photo available
	//let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	filename = resp.filename;
	let imgPath = `../assets/img/${sisi.name}/${filename}`;
	let cats = extractWords(valf(inpCats.value, ''));
	let item = isdef(M.superdi[key])?jsCopy(M.superdi[key]): { key, friendly, cats, colls: [] };
	//addIf(item.colls, sisi.name);
	item[valf(imgname, 'img')] = imgPath;

	dPopup.remove();
	//console.log('NOT saving item',item); return;
	//console.log('saving',item)
	await simpleOnDroppedItem(item, key, sisi);
}

function findUniqueSuperdiKey(friendly) {
	console.log('friendly', friendly)
	let name = friendly;
	let i = 1;
	let imgname = null;
	while (true) {
		let o = M.superdi[name];
		if (nundef(o)) { break; }
		console.log(o.colls.includes('emo'))
		if (isdef(o.img) && isdef(o.photo) || ['emo', 'fa6', 'icon'].every(x => !o.colls.includes(x))) { name = friendly + (i++); continue; }
		else if (isdef(o.img)) { imgname = 'photo'; break; }
		else { imgname = 'img'; break; }
	}
	return [name, imgname];
}




function calcRows(fontSize, fontFamily, content, maxWidth) {

	// // Example usage:
	// const ta = document.createElement('textarea'); // or any other reference element
	// const fontSize = 16;
	// const fontFamily = 'Arial';
	// const content = 'This is a sample content to test the number of rows needed to fit this text within the given maximum width.';
	// const maxWidth = 200;

	// console.log(calcRows(fontSize, fontFamily, content, maxWidth));

	// Create an off-screen canvas to measure text width
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	// Set the font properties on the context
	ctx.font = `${fontSize}px ${fontFamily}`;

	// Split the content into words
	const words = content.split(' ');
	let line = '';
	let rows = 0;

	// Measure each word
	for (let i = 0; i < words.length; i++) {
		const testLine = line + words[i] + ' ';
		const metrics = ctx.measureText(testLine);
		const testWidth = metrics.width;

		if (testWidth > maxWidth && i > 0) {
			// When the line is too wide, count the line and start a new line
			rows++;
			line = words[i] + ' ';
		} else {
			// Continue adding words to the current line
			line = testLine;
		}
	}

	// Count the last line
	if (line.length > 0) {
		rows++;
	}

	return rows;
}


function detailsForKey(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o)
	return o;
}
function detailsPresentDict(o) {
	let di = {};
	for (const key in o) {
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(key)) continue;
		let val = o[key];
		if (!isLiteral(val)) continue;
		di[key] = val;
	}
	return di;

}


function simpleSidebar(wmin) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	let stylesTitles = { matop: 10, bg: '#ffffff80', fg: 'black' };

	let cmds = {};
	//mDom(d,stylesTitles,{html:'Collection:'});
	cmds.simpleNew = mCommand(d, 'simpleNew', 'New'); mNewline(d, gap);

	mDom(d, stylesTitles, { html: 'Selection:' })
	cmds.simpleSelectAll = mCommand(d, 'simpleSelectAll', 'Select All'); mNewline(d, gap);
	cmds.simpleSelectPage = mCommand(d, 'simpleSelectPage', 'Select Page'); mNewline(d, gap);
	cmds.simpleClearSelections = mCommand(d, 'simpleClearSelections', 'Clear Selection', { fSel: x => x >= 1 }); mNewline(d, gap);

	mDom(d, stylesTitles, { html: 'Item:' })
	cmds.setAvatar = mCommand(d, 'setAvatar', 'Set Avatar', { fSel: x => x == 1 }); mNewline(d, gap);
	cmds.editDetails = mCommand(d, 'editDetails', 'Edit Details', { fSel: x => x == 1 }); mNewline(d, gap);

	mDom(d, stylesTitles, { html: 'Items:' })
	cmds.addSelected = mCommand(d, 'addSelected', 'Add To', { fSel: x => (x >= 1) }); mNewline(d, gap);
	cmds.simpleRemove = mCommand(d, 'simpleRemove', 'Remove', { fSel: x => (!simpleLocked() && x >= 1) }); mNewline(d, gap);

	// UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	// UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	// UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	// UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	// UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	// UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
	// simpleDisableListCommands();
	// simpleDisableItemCommands();
	copyKeys(cmds, UI.commands);
	simpleCheckCommands();
}

function createPanZoomCanvas(parentElement, src, wCanvas, hCanvas) {
	const canvas = document.createElement('canvas');
	canvas.width = wCanvas;
	canvas.height = hCanvas;
	parentElement.appendChild(canvas);
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
		// Calculate the scale to fit the smaller side of the image to the canvas
		const scaleX = canvas.width / image.width;
		const scaleY = canvas.height / image.height;
		scale = Math.min(scaleX, scaleY);

		// Center the image initially
		originX = (canvas.width - image.width * scale) / 2;
		originY = (canvas.height - image.height * scale) / 2;

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
		const zoom = Math.exp(e.deltaY * -0.0005);
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
async function simpleOnDroppedUrl(src, sisi) {

	let sz = 400;
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz, hmin: sz, bg: 'pink' });
	let dParent = mDom(dPopup);

	let d = mDom(dParent, { w: sz, h: sz, border: 'red', margin: 10 });
	let canvas = createPanZoomCanvas(d, src, sz, sz);
	//mStyle(canvas,{border:'red'}); mLinebreak(dParent)

	let instr = mDom(dPopup, { align: 'center', mabot: 10 }, { html: `- panzoom image to your liking -` })

	let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
	mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
	let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
	let defaultName = '';
	let iDefault = 1;
	let k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = sisi.masterKeys.find(x => x == `${sisi.name}${iDefault}`); }
	defaultName = `${sisi.name}${iDefault}`;
	inpFriendly.value = defaultName;
	mDom(dinp, { h: 1 });
	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });

	// mLinebreak(dinp);
	// let ta = mDom(dinp,{w:sz},{tag:'textarea',rows:10,value:''})

	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('Cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('Save', () => simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
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

function isExactly(n, num = 1) { return n == num; }
function isAtLeast(n, num = 1) { return n >= num; }
async function onclickAddSelected() {
	let keys = UI.selectedImages;
	let cmd = UI.commands.addSelected;
	let collist = M.collections.filter(x => !simpleLocked(x)).map(x => ({ name: x, value: false }));
	let result = await mGather(iDiv(cmd), {}, { content: collist, type: 'checkList' });
	if (!result || isEmpty(result)) { console.log('nothing added'); simpleClearSelections(); return; }

	//console.log('result',result,keys); //return;
	assertion(isList(result), 'uiCadgetTypeChecklist result is NOT a list!!!')
	let di = {}, changed = false;
	for (const key of keys) {
		let o = M.superdi[key];
		for (const collname of result) {
			if (o.colls.includes(collname)) continue;
			changed = true;
			o.colls.push(collname);
			di[key] = o;
		}
	}
	if (!changed) { console.log('nothing added'); simpleClearSelections(); return; }
	console.log('items changed:', Object.keys(di));
	await updateSuperdi(di);
	simpleInit();
}
function simpleCheckCommands() {
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let n = UI.selectedImages.length;
	for (const k in UI.commands) {
		let cmd = UI.commands[k];
		if (nundef(cmd) || nundef(iDiv(cmd))) continue;

		//console.log(cmd)
		//let x = cmd.fSel(n);console.log('k',k,cmd,x)
		if (nundef(cmd.fSel) || cmd.fSel(n)) cmdEnable(k); else cmdDisable(k);
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





















