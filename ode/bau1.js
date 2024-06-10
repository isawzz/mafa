

async function simpleOnDropImage(data,file,elem) {
	console.log('dropped',file,typeof file); 
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
		assertion(isDict(file),'MUSS VON WO ANDERS KOMMEN!!!!!')
		console.log('from somewhere else!!!!',file);
		await simpleOnDroppedUrl(data, sisi);
	}
	// return 
}

function enableImageDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border;
	elem.addEventListener('dragover', ev=> { ev.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', ev=> { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	//elem.addEventListener('dragleave', ev=>{ elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	elem.addEventListener('drop', ev=>  {
		ev.preventDefault();
		elem.style.border = originalBorderStyle;
		let data = ev.dataTransfer.getData('itemKey');
		if (isdef(data)) onDropCallback(data,data,elem);
		else{
			const files = ev.dataTransfer.files;
			console.log('drop',ev.dataTransfer);
			if (files.length > 0) {
				const reader = new FileReader();
				reader.onload = evReader => {
					onDropCallback(evReader.target.result, files[0].name, elem);
				};
				reader.readAsDataURL(files[0]);
			}
		}
	});
}



async function onclickSimpleRemove() {
	let selist = UI.selectedImages;
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		let collname = o.collname;
		if (collLocked(collname)) continue;
		let item = M.superdi[key];
		removeInPlace(item.colls, collname);
		di[key] = item;
	}
	if (isEmpty(di)) {
		showMessage(`ERROR: cannot delete selected items!!!`);
		collClearSelections();
		return;
	}
	await updateSuperdi(di);
}
async function onclickSimpleNew(name) {
	if (nundef(name)) name = await mGather(iDiv(UI.simpleNew));
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
























