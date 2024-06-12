
function mCommand(dParent, key, html, opts = {}) {
	if (nundef(html)) html = capitalize(key);
	let close = valf(opts.close, () => { console.log('close', key) });
	let save = valf(opts.save, false);
	let open = valf(opts.open, window[`onclick${capitalize(key)}`]);
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { id: `${key}`, key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })
	let cmd = { dParent, elem: d, div: a, key, open, close, save };
	addKeys(opts,cmd);
	return cmd;
}
function showNavbar() {
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, menuCloseHome);
	commands.settings = menuCommand(nav.l, 'nav', 'settings', null, settingsOpen, menuCloseSettings);
	commands.simple = menuCommand(nav.l, 'nav', 'simple', null, onclickSimple, menuCloseSimple);
	//commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, menuCloseColl);
	commands.play = menuCommand(nav.l, 'nav', 'play', 'Games', onclickPlay, menuCloseGames);
	commands.table = menuCommand(nav.l, 'nav', 'table', 'Table', onclickTableMenu, menuCloseTable);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, menuCloseCalendar);
	nav.commands = commands;
	return nav;
}
function collFilterImages(coll, s) {
	let di = {};
	for (const k of coll.masterKeys) { di[k] = true; }
	let list = isEmpty(s) ? Object.keys(di) : isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k of coll.masterKeys) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.toLowerCase().includes(s)) list.push(k);
		}
	}
	return list;
}
function createBatchGridCells(d,w,h,styles={},opts={}){
	let gap = valf(styles.gap,4);
	if (nundef(styles.w)) styles.w=128;
	if (nundef(styles.h)) styles.h=styles.w;
	if (nundef(styles.margin)) styles.margin=gap;
	let sz = styles.w+styles.margin;
	let cols = Math.floor((w-20)/sz);
	let rows = Math.floor((h-20)/sz);
	let dGrid = mGrid(rows,cols,d,{margin:'auto',gap})
	let cells = [];
	for (let i = 0; i < rows * cols; i++) {
		let d = mDom(dGrid, styles,opts);
		mCenterCenterFlex(d);
		cells.push(d);
	}
	return {dGrid,cells,rows,cols};
}
function enableDataDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border;
	elem.addEventListener('dragover', ev=> { ev.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', ev=> { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('drop', ev=>  {
		ev.preventDefault();
		elem.style.border = originalBorderStyle;
		onDropCallback(ev,elem); 
	});
}
function mAdjustPage(wmargin){
	let r = getRect('dBuffer'); 
	let r2 = getRect('dExtra');
	let [w,h]=[window.innerWidth-wmargin,window.innerHeight - (r.h+r2.h)];
	mStyle('dMain',{w,h});
	mStyle('dPage',{w,h});
}
function mDom100(dParent,styles={},opts={}){copyKeys({w100:true,h100:true,box:true},styles);return mDom(dParent,styles,opts);}
function mClearAllSelections(){
	let arr = Array.from(document.getElementsByClassName('framedPicture'));//find all visible uis for selected images
	arr.forEach(mUnselect);
	UI.selectedImages = [];

}
function mSelect(elem) { mClass(elem, 'framedPicture'); }
function mUnselect(elem) { mClassRemove(elem, 'framedPicture'); }
function rBgFor(){for(const d of Array.from(arguments)){mStyle(d,{bg:rColor()})}}
function showDetailsAndMagnify(elem) {
	let key = elem.firstChild.getAttribute('key')
	if (nundef(key)) { mMagnify(elem); return; }
	MAGNIFIER_IMAGE = elem;
	let d = mPopup(null, {}, { id: 'hallo' });
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o)
	let title = fromNormalized(valf(o.name, o.friendly));
	mDom(d, {}, { tag: 'h1', html: title });
	mDom(d, {}, { tag: 'img', src: valf(o.photo, o.img) });
	for (const k in o) {
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(k)) continue;
		let val = o[k];
		if (!isLiteral(val)) continue;
		mDom(d, {}, { html: `${k}:${val}` })
	}
}
async function updateSuperdi(di, key) {
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
}

//#region new functions
function clearMain() { staticTitle(); clearEvents(); mClear('dMain'); mClear('dTitle'); clearMessage(); }

async function correctUsersDeleteKeyImageKey() {
	for (const name in Serverdata.users) {
		let u = Serverdata.users[name];
		delete u.key;
		delete u.imageKey;
		await postUserChange(u, true);
	}
}
function enableImageDrop(element, onDropCallback) {
	const originalBorderStyle = element.style.border;
	element.addEventListener('dragover', function (event) {
		event.preventDefault();
	});
	element.addEventListener('dragenter', function (event) {
		element.style.border = '2px solid red';
	});
	element.addEventListener('drop', function (event) {
		event.preventDefault();
		element.style.border = originalBorderStyle;
		const files = event.dataTransfer.files;
		if (files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) { // Check if the dropped file is an image
				onDropCallback(file);
			}
		}
	});
	element.addEventListener('dragleave', function (event) {
		element.style.border = originalBorderStyle;
	});
}
function fromNormalized(s) {
	let x = replaceAll(s, '_', ' ');
	let words = toWords(x).map(x => capitalize(x)).join(' ');
	return words;
}
async function instructionStandard(table, instruction) {
	let myTurn = isMyTurn(table);

	if (!myTurn) staticTitle(table); else animatedTitle();

	if (nundef(instruction)) return;

	let styleInstruction = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
	let dinst = mBy('dInstruction'); mClear(dinst);

	let html;
	if (myTurn) {
		styleInstruction.maleft = -30;
		html = `
        ${get_waiting_html()}
        <span style="color:red;font-weight:bold;max-height:25px">You</span>
        &nbsp;${instruction};
        `;
	} else { html = `waiting for: ${getTurnPlayers(table)}` }

	mDom(dinst, styleInstruction, { html });

}
function keyDownHandler(ev) {
	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		IsControlKeyDown = true;
		let hoveredElements = document.querySelectorAll(":hover");
		let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
		if (isdef(cand)) showDetailsAndMagnify(cand);
	}
}
function keyUpHandler(ev) {
	if (ev.key == 'Control') {
		IsControlKeyDown = false;
		mMagnifyOff();
		if (isdef(mBy('hallo'))) mBy('hallo').remove();
	}
}
function lastWord(s) { return arrLast(toWords(s)); }

function mimali(c, m) {
	let seasonColors = 'winter_blue midnightblue light_azure capri spring_frost light_green deep_green summer_sky yellow_pantone orange pale_fallen_leaves timberwolf'.split(' ');
	let c2 = seasonColors[m - 1];
	let colors = paletteMix(c, c2, 6).slice(); //paletteShadesBi(c,36*m);
	let wheel = [];
	for (const x of colors) {
		let pal1 = paletteShades(x); //console.log(pal1.length)
		for (const i of range(7)) wheel.push(pal1[i + 2]);
	}
	return wheel;
}
function mixColors(c1, c2, c2Weight01) {
	let [color1, color2] = [colorFrom(c1), colorFrom(c2)]
	const hex1 = color1.substring(1);
	const hex2 = color2.substring(1);
	const r1 = parseInt(hex1.substring(0, 2), 16);
	const g1 = parseInt(hex1.substring(2, 4), 16);
	const b1 = parseInt(hex1.substring(4, 6), 16);
	const r2 = parseInt(hex2.substring(0, 2), 16);
	const g2 = parseInt(hex2.substring(2, 4), 16);
	const b2 = parseInt(hex2.substring(4, 6), 16);
	const r = Math.floor(r1 * (1 - c2Weight01) + r2 * c2Weight01);
	const g = Math.floor(g1 * (1 - c2Weight01) + g2 * c2Weight01);
	const b = Math.floor(b1 * (1 - c2Weight01) + b2 * c2Weight01);
	const hex = colorRgbArgsToHex79(r, g, b);
	return hex;
}
function scaleAnimation(elem) {
	elem = toElem(elem);
	let ani = elem.animate([
		{ transform: 'scale(1)' },
		{ transform: 'scale(1.3)' },
	], {
		duration: 1000,
		easing: 'ease-in-out',
		iterations: 2,
		direction: 'alternate'
	});
	return ani;
}
function someOtherPlayerName(table) {
	return rChoose(arrWithout(table.playerNames, getUname()));
}

function strSameCaseInsensitive(s1, s2) { return s1.toLowerCase() == s2.toLowerCase(); }
function sortDictionary(di) {
	let keys = Object.keys(di);
	keys.sort();
	let newdi = {};
	for (const k of keys) {
		newdi[k] = di[k];
	}
	return newdi;
}
//#endregion



//#region simple
function menuCloseSimple() { closeLeftSidebar(); clearMain(); } //	window.onresize = null;}

async function onclickSimple() {
	let name = valf(localStorage.getItem('sisi'),'tierspiel'); //console.log(name);
	simpleSidebar(150);
	mAdjustPage(150);
	let div = mDom100('dMain'); 
	let sisi = UI.simple = {name,div};
	let [w,h,bg,fg]=[sisi.w,sisi.h,sisi.bg,sisi.fg] = [mGetStyle(div,'w'),mGetStyle(div,'h'),getNavBg(),getThemeFg()];

	let d1=mDom(div);mCenterFlex(d1)
	let dMenu = sisi.dMenu = mDom(d1, { gap: 10, padding: 12 }, { className: 'title' });mFlexVWrap(dMenu);
	let dInstruction = sisi.dInstruction = mDom(d1, { w100:true, align: 'center', fg }, { html: '* press Control key when hovering to magnify image! *' })

	let dBatch = sisi.dBatch = mDom(d1);
	let cellStyles = { bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' };
	let o = createBatchGridCells(dBatch,w*.9,h*.9,cellStyles);
	addKeys(o,sisi);

	mStyle(dInstruction, { w: mGetStyle(sisi.dGrid, 'w') });

	mLinebreak(d1)
	sisi.dPageIndex = mDom(d1,{fg});

	simpleInit(name, sisi);
	
	sisi.isOpen = true;
	sisi.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = sisi.dGrid;
	mStyle(grid, { bg: '#00000030' })
	enableDataDrop(grid, simpleOnDropImage)
	//rBgFor(sisi.div,sisi.dMenu,sisi.dBatch,sisi.dGrid); //damit man sieht was der macht mit div sizing
}
async function onclickSimpleClearSelections(ev) { simpleClearSelections(); }

async function onclickSimpleNew(name) {
	if (nundef(name)) name = await mGather(iDiv(UI.simpleCommands.simpleNew));
	if (!name) return;
	name = normalizeString(name);
	if (isEmpty(name)) {
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (M.collections.includes(name)) {
		showMessage(`collection ${name} already exists!`);
	}
	M.collections.push(name); M.collections.sort();
	if (name != UI.simple) simpleInit(name,UI.simple);
}
async function onclickSimpleRemove() {
	let selist = UI.selectedImages;
	let di = {};
	for (const key of selist) {
		let collname = UI.simple.name;
		if (simpleLocked(collname)) continue;
		let item = M.superdi[key];
		removeInPlace(item.colls, collname);
		di[key] = item;
	}
	if (isEmpty(di)) {
		showMessage(`ERROR: cannot delete selected items!!!`);
		simpleClearSelections();
		return;
	}
	await updateSuperdi(di);
	simpleInit()
}
async function onclickSimpleSelectAll(ev) {
	let sisi = UI.simple;
	for (const cell of sisi.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		mSelect(d);
	}
	for (const k of sisi.keys) { addIf(UI.selectedImages, k); }
	simpleCheckCommands();
}
async function onclickSimpleSelectPage(ev) {
	let sisi = UI.simple;
	for (const cell of sisi.cells) {
		let d = cell.firstChild;
		if (nundef(d)) break;
		mSelect(d);
		let o = sisi.items[d.id];
		addIf(UI.selectedImages, o.key);
	}
	simpleCheckCommands();
}
async function onclickSetAvatar(ev) { await simpleSetAvatar(UI.selectedImages[0]); }

function simpleClearSelections() {
	mClearAllSelections();
	simpleCheckCommands();
}
async function simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi) {
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); //console.log('dims', dims);
	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${sisi.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [sisi.name] };
	dPopup.remove();
	await simpleOnDroppedItem(item, sisi);
}
function simpleInit(name, sisi) {
	if (nundef(name) && isdef(UI.simple)) {sisi=UI.simple;name=sisi.name;}
	let isReload = isdef(sisi.index) && sisi.name == name;
	if (!isReload) { sisi.index = 0; sisi.pageIndex = 1; sisi.name = name; sisi.filter = null; }

	let list = [];
	if (name == 'all' || isEmpty(name)) { list = Object.keys(M.superdi); }
	else if (isdef(M.byCollection[name])) { list = M.byCollection[name]; }
	else list = [];
	
	localStorage.setItem('sisi', name)

	let dMenu = sisi.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });

	let collNames = M.collections; 
	let dlColl = mDatalist(d, collNames, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => {console.log(sisi.name,ev.target.value);simpleInit(ev.target.value, sisi);}
	dlColl.inpElem.value = name;

	list = sortByFunc(list, x => M.superdi[x].friendly);
	sisi.masterKeys = list;
	sisi.keys = sisi.filter ? collFilterImages(sisi, sisi.filter) : list;
	
	let cats = collectCats(sisi.keys);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = sisi.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: sisi.filter });
	dlCat.inpElem.oninput = ev =>{
		let coll = UI.simple;
		let s = ev.target.value.toLowerCase().trim();
		let list = collFilterImages(coll, s);
		coll.keys = list;
		coll.filter = s;
		coll.index = 0; coll.pageIndex = 1; simpleClearSelections();
		simpleShowImageBatch(coll, 0, false);
	};
	
	d = mDom(dMenu, { gap: 10, align: 'right' });
	mButton('prev', ()=>simpleShowImageBatch(sisi,-1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
	mButton('next', ()=>simpleShowImageBatch(sisi,1), d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
	simpleClearSelections();
	simpleShowImageBatch(sisi);
}
function simpleLocked(collname) {
	if (nundef(collname)) collname = lookup(UI,['simple','name']);
	if (!collname) return true;
	return getUname() != '_unsafe' && ['all', 'amanda', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname);
}
async function simpleOnclickItem(ev) {
	let id=evToId(ev);
	let item = UI.simple.items[id]; if (nundef(item)) return;
	let selkey = item.key;
	toggleSelectionOfPicture(iDiv(item), selkey, UI.selectedImages);
	simpleCheckCommands();
}
async function simpleOnclickLabel(ev) {
	evNoBubble(ev);
	let id=evToId(ev); console.log('id',id)
	let o = lookup(UI.simple,['items',id]);
	if (!o) return;
	console.log('clicked label of',o);
	let [key,elem,collname]=[o.key,o.name,iDiv(o)];

	let newfriendly = await mGather(ev.target);
	if (!newfriendly) return;
	if (isEmpty(newfriendly)) {
		showMessage(`ERROR: name invalid: ${newfriendly}`);
		return;
	}
	console.log('rename friendly to', newfriendly)
	let item = M.superdi[key];
	item.friendly = newfriendly;

	let di = {};
	di[key] = item;
	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)
	await loadAssets();
	ev.target.innerHTML = newfriendly;
}
async function simpleOnDropImage(ev,elem) {
	let dt=ev.dataTransfer;
	console.log('dropped',ev.dataTransfer); 

	console.log('types',dt.types); 
	//console.log('items',dt.items); 
	console.log('files',dt.files); 

	if (dt.types.includes('itemkey')) {
		let data = ev.dataTransfer.getData('itemkey');

		console.log('itemkey',data)
		await simpleOnDroppedItem(data);
	}else {
		const files = ev.dataTransfer.files;
		console.log('drop',ev.dataTransfer);
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = async (evReader) => {
				let data = evReader.target.result;
				await simpleOnDroppedUrl(data, UI.simple);
				//onDropCallback(, files[0].name, elem);
			};
			reader.readAsDataURL(files[0]);
		}

	}
	//console.log('dropped',ev.dataTransfer); 

	return;
	if (isString(file) && isdef(M.superdi[file])){
		console.log('YEAH!!!!!!!!!!!! ein key',file)
		await simpleOnDroppedItem(M.superdi[file], UI.simple)
	}else if (isDict(file) && isdef(M.allImages[file.name])) {
		assertion(false,"DROP IMAGE FROM KEY ist aber file instead!!!!!!!!!!!!!!!!")
		//hab ein eigenes item gedropped!!!!
		//muss ueberhaupt kein item adden!
		//nur in die neue collection integrieren!
		console.log('NOOOOOOOOO!!!!!!!!!!!! ein eigenes img',M.allImages[file.name])
	}else {
		assertion(!isDict(file),'MUSS VON WO ANDERS KOMMEN!!!!!')
		console.log('from somewhere else!!!!',file);

		//await simpleOnDroppedUrl(data, UI.simple);
	}
	// return 
}
async function simpleOnDroppedItem(itemOrKey, sisi) {
	console.log(itemOrKey)
	if (nundef(sisi)) sisi = UI.simple;
	let item,key;
	if (isString(itemOrKey)){key=itemOrKey;item=M.superdi[key];}else{item=itemOrKey;key=item.key;}
	console.log(item,key)
	assertion(isdef(key), 'NO KEY!!!!!');
	let o=M.superdi[key]; console.log(key,item,o,sisi)
	assertion(nundef(o) || o == item,"DISPARITY!!!!!!!!!!!!!!!!!!!!!")
	let list = item.colls;
	if (isdef(o) && list.includes(sisi.name)) {console.log(`HA! ${key} already there`); return; }// dropped item into same collection!!!
	lookupAddIfToList(item,['colls'],sisi.name);
	addIf(item.colls,sisi.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	simpleInit(sisi.name,sisi)
}
async function simpleOnDroppedUrl(url, sisi) {
	//console.log(url,sisi); //return;
	let m = await imgMeasure(url); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz+80, hmin: sz+80, bg: 'pink' });
	let d = mDom(dPopup, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	mStyle(img, { h: sz });
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
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
	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => dPopup.remove(), db2, { w: 70 }, 'input');
	mButton('OK', () => simpleFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, sisi), db2, { w: 70 }, 'input');
}
async function simpleSetAvatar(key){
	U.imgKey = key;
	let res = await postUserChange(U);
	//console.log('res', res)
}
function simpleShowImageBatch(sisi, inc = 0, alertEmpty = false) {
	let [keys, index, numCells] = [sisi.keys, sisi.index, sisi.rows * sisi.cols];
	if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
	if (keys.length <= numCells) inc = 0;
	let newPageIndex = sisi.pageIndex + inc;
	let numItems = keys.length;
	let maxPage = Math.max(1, Math.ceil(numItems / numCells));
	if (newPageIndex > maxPage) newPageIndex = 1;
	if (newPageIndex < 1) newPageIndex = maxPage;
	index = numCells * (newPageIndex - 1);
	let list = arrTakeFromTo(keys, index, index + numCells);
	sisi.index = index; sisi.pageIndex = newPageIndex;
	sisi.items = {};
	let name = sisi.name;
	for (let i = 0; i < list.length; i++) {
		let key = list[i];
		let d = sisi.cells[i];
		mStyle(d, { opacity: 1 });
		mClass(d, 'magnifiable')
		let id = getUID();
		let d1 = simpleShowImageInBatch(key, d, {}, {prefer:sisi.name == 'emo'?'img':'photo'});
		d1.id = id;
		let item = {div:d1,key,name,id,index:i,page:newPageIndex};
		sisi.items[id]=item;
		// d1.setAttribute('collname', sisi.name);
		// let selkey = collGenSelkey(key, sisi.name);
		if (isList(UI.selectedImages) && UI.selectedImages.includes(key)) mSelect(d1);
	}
	for (let i = list.length; i < numCells; i++) {
		mStyle(sisi.cells[i], { opacity: 0 })
	}
	sisi.dPageIndex.innerHTML = `page ${sisi.pageIndex}/${maxPage}`;
	let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
	if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
	else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function simpleShowImageInBatch(key, dParent, styles = {}, opts = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	let src = (opts.prefer == 'photo' && isdef(o.photo)) ? o.photo : valf(o.img, null);
	if (isdef(src)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = simpleOnclickLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = simpleOnclickItem;
	//console.log('.......key',key)
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = ev => { ev.dataTransfer.setData('itemkey', key); }
	// d1.ondragstart = ev => { 
	// 	ev.dataTransfer.setData('text/uri-list', draggableImage.src);
        
	// 	// The "text/html" format is useful for dragging the image as HTML
	// 	ev.dataTransfer.setData('text/html', `<img src="${draggableImage.src}" alt="Draggable Image">`);
	// 	ev.dataTransfer.setData('hallo','mySpecialData');
	// 	// // Optionally, you can set a custom drag image
	// 	// const dragIcon = new Image();
	// 	// dragIcon.src = 'path/to/drag-icon.png'; // Optional custom drag icon
	// 	// ev.dataTransfer.setDragImage(dragIcon, 10, 10); // Adjust x and y offset as needed

	// 	UI.draggedItem = o; 
	// };
	return d1;
}

//#endregion
