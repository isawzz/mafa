async function imgToPortrait(src, width, dParent, sendToServer=false,path=null,downloadAtClient=false){ //}, path, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(document.body, { position: 'absolute', top: '70vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src,img); //hier ist img loaded!!!
	//return img; 
	dParent = toElem(dParent);
	mClear(dParent);
	let canvas = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(0, img.width);
	ctx.rotate(-90 * Math.PI / 180);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)
	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		let o = { image: dataUrl, path: path };
		let resp = await mPostRoute('postImage', o);
		return resp; //console.log('resp', resp);
	}
	return 'image NOT sent to server!'
}
async function imgSaveAsLandscape(src, width, path, viewParent, imgParent, sendToServer, downloadAtClient) {
	if (isdef(mBy('img1'))) mBy('img1').remove();
	let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
	await loadImageAsync(src,img); //hier ist img loaded!!!
	mClear(viewParent);
	let canvas = mDom(viewParent, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
	let ctx = canvas.getContext('2d');
	ctx.translate(img.height, 0)
	ctx.rotate(90 * Math.PI / 180);
	// ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
	ctx.drawImage(img, 0, 0, img.width, img.height)
	if (downloadAtClient) downloadCanvas(canvas);
	if (sendToServer) {
		let dataUrl = canvas.toDataURL('image/png');
		let o = { image: dataUrl, path: path };
		let resp = await mPostRoute('postImage', o);
		return resp; //console.log('resp', resp);
	}
	return 'image NOT sent to server!'
}
async function natCivsToLandscape() {
	async function civSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
		let path = `assets/games/nations/civs/civ_${name}.png`;
		return imgSaveAsLandscape(src,width,path,viewParent,imgParent,sendToServer,downloadAtClient);
	}

	let dbody = document.body; dbody.innerHTML = '';
	let viewParent = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });
	// let dhidden = mDom(dbody);
	let civlist=['america','arabia','china','egypt','ethiopia','greece','india','japan','korea','mali','mongolia','persia','poland','portugal','rome','venice','vikings'];
	for (const civ of ['vikings']) {
		let src = `../assets/games/nations/civs_old/${civ}.jpg`;
		let width = 800;
		let name = civ;
		let viewParent = viewParent;
		let imgParent = dbody;
		let sendToServer = true;
		let downloadAtClient = false;
		await civSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
		// let img = await imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
    // await onloadCiv(img, src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);

	}
}











