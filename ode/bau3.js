
async function simpleOnDroppedUrl(url, sisi) {
	//console.log(url,sisi); //return;
	let m = await imgMeasure(url); console.log('simpleOnDroppedUrl!!! sz', m);
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















function simpleSidebar(wmin) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;

	let stylesTitles={matop:10,bg:'#ffffff80',fg:'black'};

	//mDom(d,stylesTitles,{html:'Collection:'});
	UI.simpleNew = mCommand(d, 'simpleNew', 'New'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Selection:'})
	UI.simpleSelectAll = mCommand(d, 'simpleSelectAll', 'Select All'); mNewline(d, gap);
	UI.simpleSelectPage = mCommand(d, 'simpleSelectPage', 'Select Page'); mNewline(d, gap);
	UI.simpleClearSelections = mCommand(d, 'simpleClearSelections', 'Clear Selection'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Item:'})
	UI.setAvatar = mCommand(d, 'setAvatar', 'Set Avatar'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Items:'})
	UI.simpleRemove = mCommand(d, 'simpleRemove', 'Remove'); mNewline(d, gap);

	// UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	// UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	// UI.addSelected = mCommand(d, 'addSelected', 'Add Selected'); mNewline(d, gap);
	// UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	simpleDisableListCommands();
	simpleDisableItemCommands();
	// UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	// UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	// UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
}
function simpleDisableListCommands() {
	for (const cmd of [UI.simpleClearSelections, UI.deleteSelected, UI.addSelected, UI.simpleRemove, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd.key);
	}
}
function simpleDisableItemCommands() {
	for (const cmd of [UI.setAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd.key);
	}
}
function simpleEnableItemCommands() {
	for (const cmd of [UI.setAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
}
function simpleEnableListCommands() {
	for (const cmd of [UI.simpleClearSelections, UI.addSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
	if (isEmpty(UI.selectedImages)) return;
	for (const cmd of [UI.deleteSelected, UI.simpleRemove,]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
}

