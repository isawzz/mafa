onload = start;

async function start() { test5(); }

async function test5() {
	let img = mDom('dTest', { display: 'none' }, { id: 'img1', tag: 'img', src: '../test0/ball1.png' });
	let dataUrl = await srcToDataUrl(img.src);
	console.log('result', dataUrl)
	img.src = dataUrl;
	mStyle(img, { display: 'inline' })
}

async function onclickResize() {
	let img = mBy('img1');
	let result = await resizeImage(img, 250);
	console.log('resizeImage result', result)
}
async function onclickUpload(ev) {
	ev.preventDefault();
	let img = mBy('img1');
	let result = await uploadImg(img, rName(4), rUID('img', 4));
	console.log('uploadImg result', result)
}

async function test4() {
	let dButtons = mDom('dTest');
	let img = mDom('dTest', {}, { id: 'img1', tag: 'img', src: '../test0/ball1.png' });
	//let bResize = mButton('resize', async () => await resizeImage(img, 250), dButtons)
	// let bUpload = mButton('upload', async () => await uploadImg(img, rName(4), rUID('img', 4)), dButtons)
	let bResize = mButton('resize', onclickResize, dButtons)
	let bUpload = mButton('upload', onclickUpload, dButtons)
}

async function test3() {
	let dButtons = mDom('dTest');
	let img = mDom('dTest', {}, { tag: 'img', src: '../test0/ball1.png' });
	let bResize = mButton('resize', async () => await resizeImage(img, 250), dButtons)
	let bUpload = mButton('upload', () => uploadImg(img, rName(4), rUID('img', 4)), dButtons)
	// onclick=async()=>await resizeImage(img,250);
	// ondblclick=()=>uploadImg(img,rName(4),rUID('img',4));
	//uploadImg(img,'hallo','geh')

}


async function test2() {

	// Call the async function
	let dataUrl = await srcToDataUrl('../test0/ball1.png', 100);
	let img = mDom('dTest', {}, { id: 'img1', tag: 'img', src: dataUrl });
	onclick = ev => uploadImgSync(img, 'animal', 'hallo', ev);
	//await uploadImageToServer(dataUrl);
}


