
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

function simpleLocked(collname) {
	return getUname() != '_unsafe' && ['all', 'amanda', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname);
}























