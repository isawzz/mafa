

async function onclickAsSecondary(name) {

	if (name == 'all' || collLocked(name)){
		showMessage(`ERROR! collection ${name} cannot be altered!`);
		return;
	}
	if (nundef(M.byCollection[name])){
		showMessage(`ERROR! collection ${name} not found!`);
		return;
	}

	UI.collSecondary.name = name; 
	UI.collPrimary.name = 'all'; 
	collOpenSecondary(4, 3);
	collOpenPrimary(4, 3);
}

async function onclickRemoveSelected() {
	let selist = UI.selectedImages;

	//console.log('delete', selist);
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		let collname = o.collname;

		// *** SAFETY CHECK!!!!! ***
		if (collLocked(collname)) continue;

		let item=M.superdi[kye];
		removeInPlace(item.colls,collname);
		di[key]=item;
	}

	//let empty=Object.keys(deletedKeys).every(x=>isEmpty(deletedKeys[x]));
	//console.log('empty?',di); //empty,di,deletedKeys)
	if (isEmpty(di)){
		showMessage(`ERROR: cannot delete selected items!!!`);
		collClearSelections();
		return;

	}

	let res = await mPostRoute('postUpdateSuperdi', { di });
	console.log('postUpdateSuperdi', res)

	await loadAssets();
	collPostReload();
}














