
async function simpleFinishEditing(canvas, dPopup, ta, inpFriendly, inpCats, sisi) {
	const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
	if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
	let friendly = inpFriendly.value;
	let cats = extractWords(valf(inpCats.value, ''));
	let filename = (isdef(M.superdi[friendly]) ? 'i' + getTimestamp() : friendly) + '.png'; //console.log('filename', filename);
	let o = { image: dataUrl, coll: sisi.name, path: filename };
	let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
	let key = stringBefore(filename, '.');
	let imgPath = `../assets/img/${sisi.name}/${filename}`;

	let details = ta.value.trim(), odetails;
	if (!isEmpty(details)) {
		//console.log('details',details);
		let odetails = {};
		try { odetails = jsyaml.load(details); } catch { odetails[key] = details; }
		console.log('yaml object', odetails);
	}

	let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [sisi.name] };
	// if (isDict(odetails)) item.details = odetails;
	dPopup.remove();
	await simpleOnDroppedItem(item, sisi);
}
async function simpleFinishEditing(canvas, dPopup, inpFriendly, inpCats, sisi) {
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
function savePanZoomCanvas(canvas) {
	if (canvas) {
		const dataURL = canvas.toDataURL('image/png');
		const link = document.createElement('a');
		link.href = dataURL;
		link.download = 'canvas-image.png';
		link.click();
	}
}















