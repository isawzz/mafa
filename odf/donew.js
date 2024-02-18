function adjustCropper(img, dc, sz) {
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });

}
function adjustCropperBySimple(dc, x, y, dx, dy) { mStyle(dc, { left: x + dx, top: y + dy }); }

function adjustCropperBy(dc, x, y, dx, dy, wImg, hImg, szIdeal) {
	// let [w,h]=[img.width,img.height];	console.log('sz',w,h,)
	// let [cx,cy,radx,rady,rad]=[w/2,h/2,sz/2,sz/2,sz/2];
	console.log('_________\ndx', dx, 'dy', dy)
	//let [x,y]=[mGetStyle(dc,'left'),mGetStyle(dc,'top')]

	if (nundef(wImg)) {
		//no change in cropper size!
		mStyle(dc, { left: x + dx, top: y + dy }); //,w:sz,h:sz});
		return;
	}

	console.log('image sz', wImg, hImg)
	let [l, t, w, h] = [mGetStyle(dc, 'left'), mGetStyle(dc, 'top'), mGetStyle(dc, 'w'), mGetStyle(dc, 'h')]; console.log('dims', l, t, w, h);
	let [cx, cy] = [l + w / 2, t + h / 2];
	//let curDist=Math.min(l,t,wImg-(l+w),hImg-(t+h));	console.log('curDist',curDist)
	let [cxNew, cyNew] = [cx + dx, cy + dy]; console.log('new center', cxNew, cyNew)
	//min distance of cropper center to any image boundary
	let newDist = Math.min(cxNew, cyNew, wImg - cxNew, hImg - cyNew); console.log('newDist', newDist)
	//size of cropper should be:
	let wNew = Math.min(szIdeal, newDist * 2);
	let hNew = Math.min(szIdeal, newDist * 2);
	let xNew = cxNew - wNew / 2;
	let yNew = cyNew - hNew / 2;
	//dist is the min distance the cropper is currently 

	mStyle(dc, { left: xNew, top: yNew, w: wNew, h: hNew }); //,w:sz,h:sz});


}
function adjustComplex(panData) {
	//initial pos of cropper:
	let [x0, y0] = [panData.posStart.x, panData.posStart.y];

	//how much moved the mouse:
	let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];

	//image size: (constant)
	let [wImg, hImg] = [panData.img.width, panData.img.height];

	//ideal size: (since cropping square initial width of cropper suffices):
	let ideal = panData.cropStartSize.w;

	//cropper initial center:
	let [cx0, cy0] = [panData.cropStartPos.l + ideal / 2, panData.cropStartPos.t + ideal / 2];

	//theoretically, cropper initial center should be moved by dx,dy
	let [cx, cy] = [cx0 + dx, cy0 + dy];
	//cx = clamp(cx, 0, wImg); cy = clamp(cy, 0, hImg); console.log('center', cx, cy)
	cx = clamp(cx, ideal / 2, wImg - ideal / 2); cy = clamp(cy, ideal / 2, hImg - ideal / 2); //console.log('center', cx, cy)

	//where should the new left of the cropper be? at least 0, at most wImg, ideally:cx-ideal/2
	let lNew = clamp(cx - ideal / 2, 0, wImg); //console.log('lNew is', lNew);
	let tNew = clamp(cy - ideal / 2, 0, hImg); //console.log('tNew is', tNew);
	let rNew = clamp(cx + ideal / 2, 0, wImg); //console.log('rNew is', rNew);
	let bNew = clamp(cy + ideal / 2, 0, hImg); //console.log('bNew is', bNew);

	//what will the new size be once I have lNew and tNew?
	let wNew = Math.min(Math.abs(cx - lNew) * 2, Math.abs(rNew - cx) * 2);
	let hNew = Math.min(Math.abs(cy - tNew) * 2, Math.abs(bNew - cy) * 2); //console.log('wNew,hNew', wNew, hNew)

	mStyle(panData.dCrop, { left: cx - wNew / 2, top: cy - hNew / 2, w: wNew, h: hNew });
}
function clearBodyDiv(styles = {}, opts = {}) { document.body.innerHTML = ''; return mDom(document.body, styles, opts) }
function clearCell(cell) { mClear(cell); mStyle(cell, { opacity: 0 }); }
function clearMain() { clear_timeouts(); mClear('dMain'); mClear('dTitle'); }
function clearParent(ev) { mClear(ev.target.parentNode); }
function closeLeftSidebar() { mClear('dLeft'); mStyle('dLeft', { w: 0, wmin: 0 }) }
async function collAddItem(coll, key, item) {
	console.log('adding', key, item, 'to collection', coll);
	if (nundef(M.superdi[key])) {
		//need to add to superdi and save superdi!
		M.superdi[key] = item;
		let res = await mPostRoute('postNewItem', { key: key, item: item });
		console.log('<=server:', res);
	} else {
		addIf(item.colls, coll.name);
		console.log('item collections are', item.colls);
		let res = await mPostRoute('postUpdateItem', { key: key, item: item });
		console.log('<=server:', res);
	}
	for (const cat of item.cats) lookupAddIfToList(M.byCat, [cat], key);
	for (const coll of item.colls) lookupAddIfToList(M.byCollection, [coll], key);
	lookupAddIfToList(M.byFriendly, [item.friendly], key)
	M.categories = Object.keys(M.byCat); M.categories.sort();
	M.collections = Object.keys(M.byCollection); M.collections.sort();
	M.names = Object.keys(M.byFriendly); M.names.sort();



}
function collCancelEditing(d) { d.remove(); }
function collClear() { closeLeftSidebar(); clearMain(); }
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }
function collCloseSecondary() {
	let d = iDiv(UI.collSecondary);
	mClear(d);
	mStyle(d, { w: 0, wmin: 0 });
	UI.collSecondary.isOpen = false;

}
async function collDelete(collname) {
	if (collLockedOrDoesNotExist(name)) return;
	console.log('delete collection', keys)
	collPreReload(name);
	for (const k of keys) {
		let item = M.superdi[k];
		console.log('item', item)
		let colls = item.colls;
		console.log('colls',colls)
		if (colls.includes(collname) && colls.length == 1) {
			await collDeleteKey(k);			
		}else{
			//this pic cannot be deleted! also: the key cannot be deleted!!!
			console.log('not deleting',path,'!!!!!!!!!!!!')
		}
		//jetzt muss 
		
	}
	collPostReload(); //	delete M.byCollection[collname];


}
async function collDeleteKey(key){
	let item = M.superdi[key];
	assertion(isdef(item.img) && isdef(item.key),`superdi[${key}] cannot be deleted!!!!`);
	let path = item.img;
	let res = await mPostRoute('deleteImage', { path: item.img });
	console.log('res', res);

	//das mach ich jetzt anders
	res = await mPostRoute('deleteItem', { key: key });
	//wie wird M geladen? prelims?
	await loadAssets();

	//collections muessen neu initiated werden!

}
function collFilterImages(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	let s = ev.target.value.toLowerCase().trim();
	console.log('filter on', s)
	if (isEmpty(s)) return;
	let di = {};
	for (const k of coll.masterKeys) { di[k] = true; }
	let list = isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
	if (nundef(list) || isEmpty(list)) {
		list = [];
		for (const k of coll.masterKeys) {
			let o = M.superdi[k];
			if (k.includes(s) || o.friendly.includes(s)) list.push(k);
		}
		//if (isEmpty(list)) return;
	}
	coll.keys = list;
	coll.index = 0; coll.pageIndex = 0;
	showImageBatch(coll, 0, false);
}
function collFindEmptyCell(coll) {
	let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
	//console.log('free cell', cell);
	if (nundef(cell)) {
		coll.index++;
		coll.cells.map(x => { mClear(x); mStyle(x, { opacity: 0 }); });
		cell = coll.cells[0];
	}
	return cell;
}
async function collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll) {
	// crop image to cropper
	//const canvas = document.createElement('canvas');
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); console.log('dims', dims);

	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	console.log('scale', wScale, hScale, wOrig, hOrig, img.width, img.height)

	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');

	//ctx.fillStyle='yellow';	ctx.fillRect(0,0,dims.w,dims.h);

	// ctx.drawImage(img,dims.left,dims.top,img.width*scale,img.height*scale,0,0,dims.w,dims.h)
	//ctx.drawImage(img, 50, 50, 300, 300, 0, 0, 300, 300);
	//ctx.clearRect(0,0,dims.w,dims.h);

	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)

	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!

	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	//if (isEmpty(inpCats.value)) inpCats.value='animal'

	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	console.log('cats', cats)
	//paste dataUrl into cell
	let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; console.log('filename', filename);
	let o = { image: dataUrl, coll: coll.name, path: filename };
	let resp = await mPostRoute('postImage', o); console.log('resp', resp); //sollte path enthalten!

	//jetzt hab ich das complete item und kann es zu coll adden!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${coll.name}/${filename}`;
	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };


	dPopup.remove();
	await collOnDroppedItem(item, coll);
	//resp = await collAddItem(coll,key,item);

	//console.log('!!!would save image to', filename, 'and add item', item, 'to m.yaml');

}
function collInitCollection(name, coll) {
	let list = [];
	if (name == 'all' || isEmpty(name)) {
		list = Object.keys(M.superdi);
	} else if (isdef(M.byCollection[name])) {
		list = M.byCollection[name];
	} else list = []; //return;
	if (coll == UI.collPrimary) localStorage.setItem('collection', name)
	let dMenu = coll.dMenu;
	mClear(dMenu);
	let d = mDom(dMenu); mFlexV(d);
	mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });
	let colls = M.collections;
	// mDom(dMenu, {}, { html: '' });


	let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
	dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
	dlColl.inpElem.value = name;


	coll.masterKeys = list;
	let cats = collectCats(list);
	cats.sort();
	d = mDom(dMenu); mFlexV(d);
	let wLabel = coll.cols < 6 ? 117 : 'auto';
	mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { html: 'Filter:' });
	// mDom(d, {  }, { html: '<h2>Filter:</h2>' });
	let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>" });
	dlCat.inpElem.oninput = collFilterImages;

	//let wButtons=coll.w<650?'100%':'auto'; // mDom(dMenu,{h:1,w100:true})
	d = mDom(dMenu, { gap: 10, align: 'right' });
	if (coll.cols < 6) mStyle(d, { w100: true }); //?true:false
	if (coll == UI.collSecondary) mButton('done', collCloseSecondary, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	mButton('prev', onclickPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	mButton('next', onclickNext, d, { w: 70, margin: 0, maleft: 10 }, 'input');
	coll.keys = list;
	coll.index = 0; coll.pageIndex = 0;
	showImageBatch(coll);
	//showDiv(dMenu); return;
}
function collLockedOrDoesNotExist(collname){
	if ('all amanda animals big emo fa6 icon nations users'.includes(collname)) {
		console.log(`!!!!!CANNOT delete this collection ${collname}`);
		return true;
	}
	let keys = M.byCollection[collname];
	if (nundef(keys)) {
		console.log(`!!!!!collection does not exists ${collname}`);
		return true;
	}
	return false;
}
async function collOnDropImage(url, dDrop) {
	let item = UI.draggedItem;
	//console.log(dDrop, item); //return;
	UI.draggedItem = null;
	let coll = UI.collSecondary;

	if (isdef(item)) return await collOnDroppedItem(item, coll);

	//now this is the case when item is NOT defined!
	let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!
	// let img = await collShowImageInCell(cell, url); // ist zwar gut aber ich will gleich den editor!
	// NO! mButton('edit', async => { imgEditor1(url); }, cell, { position: 'absolute' }); //add an edit button to image

	//await imgEditor(cell,url);
	let m = await imgMeasure(url); console.log('sz', m);

	let dPopup = mDom(document.body, { position: 'fixed', top: 0, left: 0, wmin: 400, hmin: 400, bg: 'pink' });

	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 300];
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
	let k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`);
	while (isdef(k)) { iDefault++; k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`); }
	defaultName = `${coll.name}${iDefault}`;
	inpFriendly.value = defaultName;

	mDom(dinp, { h: 1 });

	mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
	let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });


	let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
	mButton('cancel', () => collCancelEditing(dPopup), db2, { w: 70 }, 'input');
	mButton('OK', () => collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll), db2, { w: 70 }, 'input');

}
async function collOnDroppedItem(item, coll) {
	//user dragged from an item on the page
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	collOpenSecondary(4, 3);
	showImageBatch(coll, -1);
}
function collOpenPrimary(rows, cols) { collPresent(UI.collPrimary, rows, cols); UI.collPrimary.isOpen = true; }
function collOpenSecondary(rows, cols) {
	let coll = UI.collSecondary;
	let d = iDiv(coll);
	mStyle(d, { wmin: 450, border: 'white' });
	collPresent(coll, rows, cols);
	coll.isOpen = true;
	coll.dInstruction.innerHTML = '* drag images into the shaded area *'
	let grid = coll.grid;
	mStyle(grid, { bg: '#00000030' })
	enableImageDrop(grid, collOnDropImage);
}
function collPresent(coll, rows, cols) {
	let d1 = iDiv(coll);

	mClear(d1);
	let w = coll.w = 140 * cols;
	mStyle(d1, { wmax: w, w: w })
	let dMenu = coll.dMenu = mDom(d1, { padding: 12, wmax: w, w: w }, { className: 'title' });
	mFlexVWrap(dMenu);
	mStyle(dMenu, { gap: 10 });

	// mDom(d1,{w100:true,h:1});
	let fg = getThemeFg();
	let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: fg }, { html: '* press Control key when hovering to magnify image! *' })
	// mDom(d1,{w100:true,h:1});

	//coll = uiTypeCollection(5,6,)
	coll.rows = rows; coll.cols = cols;
	coll.grid = mGrid(coll.rows, coll.cols, d1, { maleft:10, 'align-self': 'start' });
	coll.cells = [];
	let bg = mGetStyle('dNav', 'bg');
	for (let i = 0; i < coll.rows * coll.cols; i++) {
		let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
		mCenterCenterFlex(d);
		coll.cells.push(d);
	}
	mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });

	coll.dPageIndex = mDom(d1, { fg: fg, padding: 10, align: 'right' });//,{html:`${coll.pageIndex+1}`})

	collInitCollection(coll.name, coll);
}
function collPreReload(name){if (name == UI.collSecondary.name) { collCloseSecondary(); UI.collSecondary.name = null; }}
function collPostReload(){
	if (UI.collPrimary.isOpen) { collInitCollection(UI.collPrimary.name, UI.collPrimary); }
	if (UI.collSecondary.isOpen) { collInitCollection(UI.collSecondary.name, UI.collSecondary); }

}
async function collRename(oldname,newname){
	if (collLockedOrDoesNotExist(oldname)) return;
	console.log('rename collection', oldname,'to',newname)
	collPreReload(oldname);
	let needToRenameDir=false;
	for(const k of M.byCollection[oldname]){
		let item = M.superdi[k];
		let path = item.img;
		if (isString(path) && path.includes(`img/${oldname}/`)){
			item.img = `../assets/img/${newname}/${stringAfterLast(path,'/')}`;
			needToRenameDir=true;
		}
		removeInPlace(item.colls,oldname)
		item.colls.push(newname);
		let res = await mPostRoute('postUpdateItem',{key:k,item:item});
		console.log(res)
	}
	if (needToRenameDir) await mPostRoute('renameImgDir',{oldname,newname});
	await loadAssets();
	if (UI.collPrimary.name==oldname)UI.collPrimary.name=newname;
	if (UI.collSecondary.name==oldname)UI.collSecondary.name=newname;
	collPostReload(); 
}
async function collShowImageInCell(cell, src) {
	mStyle(cell, { opacity: 1 });
	mClass(cell, 'magnifiable');

	//will ich jetzt awaitable!
	let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
	await loadImageAsync(src, img);

	return img;

}
function colorContrast(dDrop, list = ['white', 'black']) {
	let bg = mGetStyle(dDrop, 'bg'); return bestContrastingColor(bg, list);
}
async function cropOrExpandImageAndGetDataUrl_trial1_W(imageSrc) {
	return new Promise((resolve, reject) => {
		// Create an image object
		const img = new Image();
		img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
		img.onload = () => {
			// Canvas setup
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = 300;
			canvas.height = 300;

			// Determine scaling needed to "cover" 300x300
			const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Calculate the center position
			const dx = (canvas.width - scaledWidth) / 2;
			const dy = (canvas.height - scaledHeight) / 2;

			// Draw the image centered and covering
			ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

			// Get the data URL of the canvas
			const dataUrl = canvas.toDataURL();
			resolve(dataUrl);
		};
		img.onerror = (error) => reject(error);

		// Set the source of the image
		img.src = imageSrc;
	});
}
async function cropOrExpandImageAndGetDataUrl(imageSrc, x, y) {
	return new Promise((resolve, reject) => {
		// Create an image object
		const img = new Image();
		img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
		img.onload = () => {
			// Canvas setup
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = 300;
			canvas.height = 300;

			// Determine scaling needed to "cover" 300x300
			const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Calculate the center position
			const dx = isdef(x) ? x * scale : (canvas.width - scaledWidth) / 2;
			const dy = isdef(y) ? y * scale : (canvas.height - scaledHeight) / 2;

			// Draw the image centered and covering
			ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);

			// Get the data URL of the canvas
			const dataUrl = canvas.toDataURL();
			resolve(dataUrl);
		};
		img.onerror = (error) => reject(error);

		// Set the source of the image
		img.src = imageSrc;
	});
}
function createScaledCanvasFromImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => {
			// Calculate the scale to ensure the smaller side is 300px
			const scale = 300 / Math.min(img.width, img.height);
			const scaledWidth = img.width * scale;
			const scaledHeight = img.height * scale;

			// Create a canvas and set its width and height
			const canvas = document.createElement('canvas');
			canvas.width = scaledWidth;
			canvas.height = scaledHeight;

			// Draw the image onto the canvas with the new size
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);

			// Resolve the promise with the canvas
			resolve(canvas);
		};
		img.onerror = reject;
		img.src = src;
	});
}
function deleteKeyFromLocalSuperdi(k){
	delete M.superdi[k];

	let fri=item.friendly;
	//remove the key from M.byFriendly, if M.byFriendly[item.friendly] empty also delete it from names and byFriendly
	let lst=M.byFriendly[fri];
	removeInPlace(lst,k); if (isEmpty(lst)) {delete M.byFriendly[fri];removeInPlace(M.names,fri);}

	//for each cat: remove the key from M.byCat, if M.byFriendly[item.friendly] empty also delete it from names and byFriendly
	for(const cat of item.cats){
		let lst=M.byCat[cat];
		removeInPlace(lst,k); if (isEmpty(lst)) {delete M.byCat[cat];removeInPlace(M.categories,cat);}
	}
}
function enableImageDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDropCallback(evReader.target.result, elem);
			};
			reader.readAsDataURL(files[0]);
		}
	});
}
function enableImageDrop_trial1_W(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border; // Store the original border style to restore it later

	elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	// Restore the original border and call the callback function when an image is dropped
	elem.addEventListener('drop', function (event) {
		event.preventDefault(); // Prevent the browser's default file open behavior
		elem.style.border = originalBorderStyle; // Restore the original border style

		const files = event.dataTransfer.files; // Get the files that were dropped
		if (files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) { // Check if the dropped file is an image
				onDropCallback(file); // Call the provided callback function with the image file
			}
		}
	});
}
function extractWords(s) { let parts = splitAtAnyOf(s, ' ,-'); return parts; }
function getMouseCoordinatesRelativeToElement(ev, elem) {
	// Get the bounding rectangle of the element
	if (nundef(elem)) elem = ev.target;
	const rect = elem.getBoundingClientRect();

	// Calculate the click's coordinates relative to the element
	const x = ev.clientX - rect.left;
	const y = ev.clientY - rect.top;

	return { x, y };
}
async function imgAsIsInDiv(url, dParent) {
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	let sz = 300;
	let img = await imgAsync(d, {}, { tag: 'img', src: url });
	let [w, h] = [img.width, img.height]; console.log('sz', w, h);
	let scale = sz / img.height;
	return [img, scale];
}
async function imgCrop(img, dc, wOrig, hOrig) {
	// crop image to cropper
	//const canvas = document.createElement('canvas');
	let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); console.log('dims', dims);

	let wScale = img.width / wOrig;
	let hScale = img.height / hOrig;
	console.log('scale', wScale, hScale, wOrig, hOrig, img.width, img.height)

	let d1 = mDom(document.body, { margin: 10 });
	let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
	const ctx = canvas.getContext('2d');

	//ctx.fillStyle='yellow';	ctx.fillRect(0,0,dims.w,dims.h);

	// ctx.drawImage(img,dims.left,dims.top,img.width*scale,img.height*scale,0,0,dims.w,dims.h)
	//ctx.drawImage(img, 50, 50, 300, 300, 0, 0, 300, 300);
	//ctx.clearRect(0,0,dims.w,dims.h);

	ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
}
function imgExpand(img, dc, sz) { img.width += 20; adjustCropper(img, dc, sz); return [img.width, img.height]; }
function imgReset(img, dc, sz, w, h) { img.width = w; img.height = h; adjustCropper(img, dc, sz); return [w, h]; }
function imgSquish(img, dc, sz) { let w = mGetStyle(dc, 'w'); if (img.width == w) return; else { img.width = Math.max(img.width - 20, w); adjustCropper(img, dc, sz); return [img.width, img.height]; } }
async function imgMeasure(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
		img.onload = () => {
			resolve({ img: img, w: img.width, h: img.height });
		};
		img.onerror = (error) => {
			reject(error);
		};
		img.src = src;
	});
}
async function imgScaledToHeightInDiv(url, dParent, sz = 300) {
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });

	let img = await imgAsync(d, {}, { tag: 'img', src: url });
	let [w, h] = [img.width, img.height]; console.log('orig', w, h);
	let scale = sz / img.height;
	img.width *= scale;
	img.height *= scale;
	mStyle(img, { w: img.width, h: img.height })
	return [img, scale];
}
function keyDownHandler(ev) {
	if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
	if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
		//console.log('control key down!!')
		IsControlKeyDown = true;
		let hoveredElements = document.querySelectorAll(":hover");
		let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
		//console.log('magnifiable',cand);
		if (isdef(cand)) mMagnify(cand);
	}
}
function keyUpHandler(ev) {
	if (ev.key == 'Control') {
		//console.log('control key release!')
		IsControlKeyDown = false;
		mMagnifyOff();
	}
}
async function loadAssets() {
	M = await mGetYaml('../assets/m.yaml');
	//superdi hat nations coll (cards) aber nicht civs
	let [di, byColl, byFriendly, byCat] = [M.superdi, {}, {}, {}];
	for (const k in di) {
		let o = di[k];
		//console.log('k',o)
		for (const cat of o.cats) lookupAddIfToList(byCat, [cat], k);
		for (const coll of o.colls) lookupAddIfToList(byColl, [coll], k);
		lookupAddIfToList(byFriendly, [o.friendly], k)
	}
	M.byCat = byCat;
	M.byCollection = byColl;
	M.byFriendly = byFriendly;
	M.categories = Object.keys(byCat); M.categories.sort();
	M.collections = Object.keys(byColl); M.collections.sort();
	M.names = Object.keys(byFriendly); M.names.sort();
}
function mCommand(dParent, key, html, open, close) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(open)) open = window[`onclick${capitalize(key)}`];
	if (nundef(close)) close = () => { console.log('close', key) }
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })

	return { dParent, elem: d, div: a, key, open, close };
}
function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, filter: 'contains' }, opts);
	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, { w: 180, maleft: 4 }, { tag: 'input', className: 'input', placeholder: valf(opts.placeholder, '') });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
	inp.setAttribute('list', optid);
	if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate);
	inp.onmousedown = () => inp.value = ''
	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
	}
}
function mDropZone1(dropZone, onDrop) {
	//newer version: enableImageDrop
	dropZone.addEventListener('dragover', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #007bff';
	});
	dropZone.addEventListener('dragleave', function (event) {
		event.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
	});
	dropZone.addEventListener('drop', function (evDrop) {
		evDrop.preventDefault();
		dropZone.style.border = '2px dashed #ccc';
		const files = evDrop.dataTransfer.files;
		if (files.length > 0) {
			const reader = new FileReader();
			reader.onload = evReader => {
				onDrop(evReader.target.result, dropZone);
			};
			reader.readAsDataURL(files[0]);
		}
	});
	return dropZone;
}
function menuCommand(dParent, menuKey, key, html, open, close) {
	let cmd = mCommand(dParent, key, html, open, close);
	let a = iDiv(cmd);
	a.setAttribute('key', `${menuKey}_${key}`);
	a.onclick = onclickMenu;
	cmd.menuKey = menuKey;
	return cmd;
}
function menuCloseCurrent(menu) {
	let curKey = lookup(menu, ['cur']);
	//console.log('current',menu,curKey)
	if (curKey) {
		let cur = menu.commands[curKey];
		mClassRemove(iDiv(cur), 'activeLink'); //unselect cur command
		cur.close();

	}
}
function menuDisable(menu, key) { mClass(iDiv(menu.commands[key]), 'disabled') }
function menuEnable(menu, key) { mClassRemove(iDiv(menu.commands[key]), 'disabled') }
function menuOpen(menu, key) {
	let cmd = menu.commands[key];	//console.log('clicked',menu,cmd);
	menu.cur = key;
	mClass(iDiv(cmd), 'activeLink')
	cmd.open();
}
function mGadget(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true,h100:true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	//addKeys({ position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true },styles)
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
function mLMR(dParent) {
	dParent = toElem(dParent);
	let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
	let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
	let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
	return [d, l, m, r];
}
function mMagnify(elem, scale = 5) {
	elem.classList.add(`topmost`);
	MAGNIFIER_IMAGE = elem;

	const rect = elem.getBoundingClientRect();

	let [w, h] = [rect.width * scale, rect.height * scale];
	let [cx, cy] = [rect.width / 2 + rect.left, rect.height / 2 + rect.top];
	let [l, t, r, b] = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];

	// console.log(l,t,r,b);

	let originX = 'center';
	let originY = 'center';
	let [tx, ty] = [0, 0];
	if (l < 0) { tx = -l / scale; } //originX = 'left'; 
	if (t < 0) { ty = -t / scale; } //originY = 'top'; 
	if (r > window.innerWidth) { tx = -(r - window.innerWidth) / scale; } //originX = 'right'; 
	if (b > window.innerHeight) { ty = -(b - window.innerHeight) / scale; } //originY = 'bottom'; 

	elem.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`;
	elem.style.transformOrigin = `${originX} ${originY}`;
}
function mMagnifyOff() {
	if (!MAGNIFIER_IMAGE) return;
	let elem = MAGNIFIER_IMAGE;
	MAGNIFIER_IMAGE = null;
	elem.classList.remove(`topmost`); //magnify4`); 
	elem.style.transform = null;
}
function mMenu(dParent, key) { let [d, l, m, r] = mLMR(dParent); return { dParent, elem: d, l, m, r, key, cur: null }; }
async function mPrompt(gadget) {
	return new Promise((resolve, reject) => {
		//console.log('form', gadget.form);
		gadget.dialog.showModal();
		//gadget.inp.focus();
		gadget.form.onsubmit = (event) => {
			event.preventDefault(); // Prevent the default form submission
			resolve(gadget.inp.value);
			gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}
async function mPromptGadgetFor(cell, placeholderName, onCancel) {
	let rect = getRect(cell); //,document.body);
	console.log('rect', rect)
	let gadget = mGadget(placeholderName, { padding: 0, position: 'absolute', left: rect.l, top: rect.t + rect.h });
	console.log('gadget', gadget);

	if (isdef(onCancel)) {
		let dia = gadget.dialog;
		mButton('Cancel', onCancel, dia);
		dia.oncancel = onCancel;
	}
	let res = await mPrompt(gadget);
	return res;

}
async function mSleep(ms = 1000) {
	return new Promise(
		(res, rej) => {
			if (ms <= 3000) {
				setTimeout(res, ms);
			} else {
				console.log('param should be less than 3001');
			}
		});
}
async function onclickCollections() {

	let dPanes = mDom('dMain'); mFlex(dPanes);
	let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
	let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);

	collSidebar();

	let collName = localStorage.getItem('collection');
	if (nundef(collName) || !M.collections.includes(collName)) collName = 'animals'

	UI.collPrimary = { div: dPrimary, name: collName }; //{name:'amanda'};
	UI.collSecondary = { div: dSecondary, name: null };
	collOpenPrimary(4, 4);
}
function onclickCommand(ev) {
	let key = evToAttr(ev, 'key');
	//console.log('click command',key)
	assertion(isdef(UI[key]), `command ${key} not in UI!!!`)
	let cmd = UI[key];
	cmd.open();
}
function onclickMenu(ev) {
	let keys = evToAttr(ev, 'key');
	let [menuKey, cmdKey] = keys.split('_');
	let menu = UI[menuKey];
	menuCloseCurrent(menu);
	menuOpen(menu, cmdKey);
}
async function onclickNext(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	showImageBatch(coll, 1);
}
async function onclickPrev(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	showImageBatch(coll, -1);
}
async function onclickUser() {
	let gadget = UI.gadgetUsername;
	let uname = await mPrompt(gadget);
	//console.log('username is',uname)
	await switchToUser(uname);
}
async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
}
async function ondropShowImage(url, dDrop) {
	mClear(dDrop);
	let img = await imgAsync(dDrop, { hmax: 300 }, { src: url });

	console.log('img dims', img.width, img.height); //works!!!

	mStyle(dDrop, { w: img.width, h: img.height + 30, align: 'center' });
	mDom(dDrop, { fg: colorContrast(dDrop, ['blue', 'lime', 'yellow']) }, { className: 'blink', html: 'DONE! now click on where you think the image should be centered!' })
	console.log('DONE! now click on where you think the image should be centered!')

	img.onclick = storeMouseCoords;
}
async function postImage(img, path) {
	let dataUrl = imgToDataUrl(img);
	let o = { image: dataUrl, path: path };
	let resp = await mPostRoute('postImage', o);
	console.log('resp', resp); //sollte path enthalten!
}
function presentImageCropper(url) {
	let d = mDom('dMain', { position: 'absolute', h: 500, w: 500, bg: 'navy' });
	let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
}
async function showColors() {
	showTitle('Set Color Theme');
	let sz = 30;
	let d = mDom('dMain', { wmax: (sz + 4) * 15, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);
	for (const c of list) {
		let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
		dc.onclick = onclickColor;
		mStyle(dc, { cursor: 'pointer' });
	}
}
async function showDashboard() {
	mDom('dMain', { fg: getThemeFg() }, { html: `hi, ${U.name}! this is your dashboard` })
}
function showDiv(d) { mStyle(d, { bg: rColor() }); console.log(d, mGetStyle(d, 'w')); }
function showImageBatch(coll, inc = 0, alertEmpty = false) {
	let [keys, index, pageIndex, numCells] = [coll.keys, coll.index, coll.pageIndex, coll.rows * coll.cols];
	if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
	if (keys.length <= numCells) inc = 0;

	let newPageIndex = coll.pageIndex + inc;
	let numItems = keys.length;
	let maxPage = Math.floor(numItems / numCells); //console.log('maxPage', maxPage, numItems, numCells)
	if (newPageIndex > maxPage) newPageIndex = 0;
	if (newPageIndex < 0) newPageIndex = maxPage;
	//bei pageIndex0 show 0-numCells
	//bei pageIndex1 show numCells-2*numCells
	//index += numCells * inc; if (index >= keys.length) index = 0; else if (index < 0) index += keys.length;
	index = numCells * newPageIndex;


	let list = arrTakeFromTo(keys, index, index + numCells);
	coll.index = index; coll.pageIndex = newPageIndex;
	for (let i = 0; i < list.length; i++) {
		let d = coll.cells[i];
		mStyle(d, { opacity: 1 });
		mClass(d, 'magnifiable')
		showImageInBatch(list[i], d);
	}
	for (let i = list.length; i < numCells; i++) {
		mStyle(coll.cells[i], { opacity: 0 })
	}
	coll.dPageIndex.innerHTML = `page ${coll.pageIndex + 1}/${maxPage + 1}`;
}
function showImageInBatch(key, dParent, styles = {}) {
	let o = M.superdi[key]; o.key = key; //console.log('o',o)
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (isdef(o.img)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	el.ondragstart = () => UI.draggedItem = o;
	let label = mDom(d1, { fz: 11 }, { html: key, className: 'ellipsis' }); //,w:'100%'
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = onclickItem;
	d1.setAttribute('key', key)
}
function showNavbar() {
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
	commands.colors = menuCommand(nav.l, 'nav', 'colors', null, showColors, clearMain);
	commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, collClear);
	commands.play = menuCommand(nav.l, 'nav', 'play', null, showTables, clearMain);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
	nav.commands = commands;
	// console.log(commands)
	return nav;
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

		// adjustCropperBySimple(panData.dCrop, x, y, dx, dy, panData.img.width, panData.img.height, panData.cropStartSize.w, panData.cropStartSize.h);
		adjustComplex(panData)

		// console.log(panData.mouse);
	}
	function panEnd(ev) {
		//evNoBubble(ev);
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
	}
	panStart(ev);
}
async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	menuOpen(menu, key);
}
async function switchToUser(uname) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? U.name : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	Clientdata.lastUser = uname;
	localStorage.setItem('username', uname);

	iDiv(UI.user).innerHTML = uname;
	setColors(U.color);

	if (uname == 'guest') { await switchToMenu(UI.nav, 'home'); menuDisable(UI.nav, 'plan'); }
	else {
		menuEnable(UI.nav, 'plan');
		let t = Clientdata.table;
		let cur = UI.nav.cur; //console.log('current menu is', cur);
		if (cur == 'play' && isdef(t) && t.fen.playerNames.includes(uname)) await showTable(t, uname);
		else await switchToMenu(UI.nav, valf(cur, 'home'));
	}
}
