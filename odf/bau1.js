async function ondropImage(url, dDrop) {
	let item = UI.draggedItem;
	console.log(dDrop, item); //return;
	UI.draggedItem = null;
	let coll = UI.collSecondary;

	if (isdef(item)) return await droppedItemOnColl(item,coll);

	//now this is the case when item is NOT defined!

}

async function droppedItemOnColl(item, coll) {
	//user dragged from an item on the page
	assertion(isdef(item.key), 'NO KEY!!!!!');
	await collAddItem(coll, item.key, item);
	//reloadCollection with the new item in it!
	collOpenSecondary(4,3);
	showImageBatch(coll,-1); //await onclickPrev();
	//show in cell
	// let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
	// let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!
	// console.log('free cell', cell);
	// if (isdef(cell)) {
	// 	mStyle(cell, { opacity: 1 });
	// 	mClass(cell, 'magnifiable')
	// 	console.log('item', item)
	// 	showImageInBatch(item.key, cell);
	// }

}

async function restOnDropShowImage(evDrop, evReader) {
	//console.log('evReader',evReader); return;
	let [url, dropTarget, dDrop, item] = [evReader.target.result, evDrop.target, evToAttrElem(evDrop, 'allowDrop').elem, UI.draggedItem];

	console.log(dropTarget, dDrop, item); //return;
	UI.draggedItem = null;

	let coll = UI.collSecondary;

	if (isdef(item)) {
		//user dragged from an item on the page
		assertion(isdef(item.key), 'NO KEY!!!!!');
		await collAddItem(coll, item.key, item);

		let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!
		let img = await collShowImageInCell(cell, url);// console.log('cell img loaded!!!!') //show in cell


		// let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
		// console.log('free cell', cell);
		// if (isdef(cell)) {
		// 	mStyle(cell, { opacity: 1 });
		// 	mClass(cell, 'magnifiable')
		// 	console.log('item', item)
		// 	showImageInBatch(item.key, cell);
		// }
	} else {
		let cell = collFindEmptyCell(coll);//find an empty cell to put the picture in!

		let img = await collShowImageInCell(cell, url);// console.log('cell img loaded!!!!')
		//add an edit button to image
		mButton('edit', async => { imgEditor1(url); }, cell, { position: 'absolute' });
		return;

		let friendly = await mPromptGadgetFor(cell, 'name', () => clearCell(cell)); console.log('the name is', friendly);
		if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

		let cats = await mPromptGadgetFor(cell, 'categories', () => clearCell(cell)); cats = extractWords(cats); assertion(isList(cats), `cats not a list!!!!!!! ${cats}`); console.log('the categories are', cats);
		if (isEmpty(friendly)) return; // {mClear(cell);mStyle(cell,{opacity:0}); return;}

		let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; console.log('filename', filename);

		let dataUrl = await cropOrExpandImageAndGetDataUrl(url);
		let o = { image: dataUrl, coll: coll.name, path: filename };
		// let resp = await mPostRoute('postImage', o);	console.log('resp', resp); //sollte path enthalten!

		//jetzt hab ich das complete item und kann es zu coll adden!
		let key = stringBefore(filename, '.');
		let imgPath = `../assets/img/${coll.name}/${filename}`;
		let item = { friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };
		// resp = await collAddItem(coll,key,item);

		console.log('!!!would save image to', filename, 'and add item', item, 'to m.yaml');
	}
}


















