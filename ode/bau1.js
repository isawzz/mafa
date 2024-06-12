

async function simpleOnDroppedUrl(url, sisi) {
	let m = await imgMeasure(url); console.log('simpleOnDroppedUrl!!! sz', m);
	let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 400];
	let dPopup = mDom(document.body, { position: 'fixed', top: 40, left: 0, wmin: sz + 80, hmin: sz + 80, bg: 'pink' });
	let d = mDom(dPopup, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);

	let zoom = 1;


	mStyle(img, { h: sz });
	
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];
	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;
	let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });
	
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
	mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
	mButton('zoom out', () => imgZoomOut(img, dc, sz,wOrig, hOrig), db1, { w: 70 }, 'input');
	mButton('zoom in', () => imgZoomIn(img, dc, sz), db1, { w: 70 }, 'input');
	
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
























