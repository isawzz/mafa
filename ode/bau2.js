
function enableImageDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border;
	elem.addEventListener('dragover', ev=> { ev.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', ev=> { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
	//elem.addEventListener('dragleave', ev=>{ elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping

	elem.addEventListener('drop', ev=>  {
		ev.preventDefault();
		elem.style.border = originalBorderStyle;
		onDropCallback(ev,elem); return;
		const files = ev.dataTransfer.files;

		console.log('files',files.length);
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
async function simpleOnDroppedItem(item, sisi) {
	let key = item.key;
	assertion(isdef(key), 'NO KEY!!!!!');
	let o=M.superdi[key];
	assertion(nundef(o) || o == item,"DISPARITY!!!!!!!!!!!!!!!!!!!!!")
	let list = item.colls;
	if (isdef(o) && list.includes(sisi.name)) {console.log(`HA! ${key} already there`); return; }// dropped item into same collection!!!
	lookupAddIfToList(item,['colls'],sisi.name);
	addIf(item.colls,sisi.name);
	let di = {}; di[key] = item;
	await updateSuperdi(di);
	simpleInit(sisi.name,sisi)
	//simpleShowImageBatch(sisi, 0);
}



