
//#region excurs: image editor in body
async function test15_WORKS() {
	//#region hide
	let src = await serverdataConfigUrl();

	let m = await imgMeasure(src); console.log('sz', m);  //return;

	let sz = 300;
	// let d = clearBodyDiv({ bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	let dParent = clearBodyDiv();
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });

	let img = m.img;
	mStyle(m.img, { h: sz });

	mAppend(d, m.img);

	let scale = sz / m.h;
	console.log('new dims', m.img.width, m.img.height, scale);

	mIfNotRelative(d);
	//#endregion
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	let dc = mDom(d, { position: 'absolute', left: cx - radx, top: cy - rady, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' }); //,{className:'no_events'}); 

	dc.onmousedown = startPanning;
	UI.dims = { wOrig: m.w, hOrig: m.h, scale0: scale, wScale: scale, hScale: scale, w0: w, h0: h, w: w, h: h };

	mDom(dParent, { w: 1, h: 1 })

	mButton('restart', () => {
		[UI.dims.w, UI.dims.h] = imgReset(img, dc, sz, w, h);

	}, dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => {
		[UI.dims.w, UI.dims.h] = imgSquish(img, dc, sz);

	}, dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => {
		[UI.dims.w, UI.dims.h] = imgExpand(img, dc, sz);
	}, dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => {
		imgCrop(img, dc, UI.dims.wOrig, UI.dims.hOrig);
	}, dParent, { fz: 30, padding: 10, maleft: 10 });

	//let imgAbstract=await imgAbstractAsync(src);	console.log(imgAbstract.height); return;
}


async function test14() {
	let dParent = clearBodyDiv();
	let [img, scale] = await imgScaledToHeightInDiv(url, dParent);

}
async function test13() {
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //`../assets/img/animals/bird/bird13.png`; // Serverdata.config.url; //console.log('url',url)
	let dParent = clearBodyDiv();
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	let sz = 300;
	let img = await imgAsync(d, { h: sz }, { tag: 'img', src: url });

	mIfNotRelative(d);

	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	let dc = mDom(d, { position: 'absolute', left: cx - radx, top: cy - rady, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' }); //,{className:'no_events'}); 

	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })

	mButton('restart', () => imgReset(img, dc, sz, w, h), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => imgCrop(img, dc), dParent, { fz: 30, padding: 10, maleft: 10 });

}
async function _test15() {
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //`../assets/img/animals/bird/bird13.png`; // Serverdata.config.url; //console.log('url',url)
	let dParent = clearBodyDiv();
	let sz = 300;

	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	let cv = await showUrlInCanvasInDiv(d, url, sz);
	let [w, h] = [cv.width, cv.height]; console.log('sz', w, h,)

	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	let dc = mDom(d, { position: 'absolute', left: cx - radx, top: cy - rady, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' }); //,{className:'no_events'}); 

	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })

	mButton('restart', () => imgReset(cv, dc, sz, w, h), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(cv, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(cv, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => imgCrop(cv, dc), dParent, { fz: 30, padding: 10, maleft: 10 });

}
async function _test14() {
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //`../assets/img/animals/bird/bird13.png`; // Serverdata.config.url; //console.log('url',url)
	let dParent = clearBodyDiv();
	let sz = 300;

	let d1 = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	let img1 = await imgAsync(d1, { h: sz }, { tag: 'img', src: url });
	let src = img1.src;
	//img.remove();
	mDom(dParent, { h: 1 })
	//mStyle(img,{w:img.width,h:img.height}); nuetzt nix!

	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	let [w, h] = [img1.width, img1.height]; console.log('sz', w, h,)
	let cv = mDom(d, { w: w, h: h }, { tag: 'canvas', width: w, height: h });
	let ctx = cv.getContext('2d');
	ctx.drawImage(img1, 0, 0, w, h);



	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	let dc = mDom(d, { position: 'absolute', left: cx - radx, top: cy - rady, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' }); //,{className:'no_events'}); 

	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })

	mButton('restart', () => imgReset(cv, dc, sz, w, h), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(cv, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(cv, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => imgCrop(cv, dc), dParent, { fz: 30, padding: 10, maleft: 10 });

}

//*********** */
async function test12() {
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //console.log('url',url)
	let d = clearBodyDiv({ bg: 'pink', padding: 0, margin: 0, wmin: 128, hmin: 128, display: 'inline-block', align: 'center' });
	let canvas = await createInteractiveCanvas(url);
	console.log('canvas', canvas)
	mAppend(d, canvas);
	return;
	const ctx = canvas.getContext('2d');
	const [w, h] = [canvas.width, canvas.height]
	let isDragging = false;
	let rect = { x: 100, y: 100, width: 50, height: 50 }; // Initial rectangle properties
	let dragOffsetX, dragOffsetY;

	// Function to check if the mouse position is inside the rectangle
	function isMouseInRect(x, y) {
		return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
		ctx.drawImage(img, 0, 0, w, h); // Redraw image
		ctx.fillStyle = 'red';
		ctx.fillRect(rect.x, rect.y, rect.width, rect.height); // Draw the rectangle
	}

	canvas.addEventListener('mousedown', (event) => {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		if (isMouseInRect(x, y)) {
			isDragging = true;
			dragOffsetX = x - rect.x;
			dragOffsetY = y - rect.y;
		}
	});

	canvas.addEventListener('mousemove', (event) => {
		if (isDragging) {
			const rect = canvas.getBoundingClientRect();
			const x = event.clientX - rect.left;
			const y = event.clientY - rect.top;
			rect.x = x - dragOffsetX;
			rect.y = y - dragOffsetY;
			draw(); // Redraw the canvas with the rectangle in the new position
		}
	});

	canvas.addEventListener('mouseup', () => {
		isDragging = false;
	});

	draw(); // Initial draw

	// Add click event listener to draw on canvas
	// canvas.addEventListener('click', (event) => {
	// 	const rect = canvas.getBoundingClientRect();
	// 	const x = event.clientX - rect.left;
	// 	const y = event.clientY - rect.top;

	// 	// Draw a red circle of radius 5 at the click position
	// 	const ctx = canvas.getContext('2d');
	// 	ctx.fillStyle = 'red';
	// 	ctx.beginPath();
	// 	ctx.arc(x, y, 5, 0, Math.PI * 2);
	// 	ctx.fill();

	// 	// Calculate the distance to the nearest border
	// 	const distanceToBorder = Math.min(x, y, canvas.width - x, canvas.height - y)-1;
	// 	const sideLength = Math.min(300, distanceToBorder*2);

	// 	// Draw a square centered on the click position
	// 	// Adjust the starting point to keep the square centered
	// 	ctx.beginPath();
	// 	ctx.rect(x - sideLength / 2, y - sideLength / 2, sideLength, sideLength);
	// 	ctx.stroke();
	// });

	//let canvas = await showUrlResizedToMin(d,url,300); //console.log(canvas);
	// let canvas=await showUrlInCanvasInDiv(d,url);
	// let fg=colorContrast(d,['red','white','silver'])
	// mDom(d,{fg:fg},{html:'click where you want the center to be',className:'blink'})
	// canvas.onclick = onclickCanvasSetNewCenterOverlay;
}

async function test11_showUrl() {
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //console.log('url',url)
	let d = clearBodyDiv({ bg: 'pink', padding: 12, margin: 12, wmin: 128, hmin: 128, display: 'inline-block' });
	ondropShowImage(url, d);

}
async function test10_enableDrop() {
	let d = clearBodyDiv({ bg: 'pink', padding: 12, margin: 12, wmin: 128, hmin: 128, display: 'inline-block' });
	enableImageDrop(d, ondropShowImage); //x=>console.log('result',x));

}
async function test9_imgEdit() {
	Serverdata = await mGetRoute('session'); console.log(Serverdata); //session ist: users,config,

	let url = Serverdata.config.url; console.log('url', url)

	//drop url onto d
	let d = clearBodyDiv({ w: 400, h: 300, bg: 'pink', margin: 12 });
	mDropZone1(d, ondropShowImage);
	//await ondropShowImage(url,d); //works!
}
async function test8_saveUrl() {

	let d = clearBodyDiv({ w: 400, h: 300, bg: 'pink', margin: 12 });

	//dragdrop img from source
	mDropZone1(d, ondropSaveUrl);


}
//#endregion

async function test7() {
	await prelims();

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	await switchToMenu(UI.nav,'collections');
	onclickNewCollection('owls')
	//await switchToUser();

}
async function test6(){
	//prelimsfast kann man auch so machen: load m.yaml, mach die schleiffe

	//await prelims('slow');
	await prelims('fast');
	// await prelims('new');
	console.log('M',M)


}
async function test5_performance(){
	//await prelims();
	await prelims('slow');

	//fuer alle values in byCollection, add key to superdi.coll
	//coll in superdi wird eine list!
	let dinew={};
	for(const coll in M.byCollection){
		for(const k of M.byCollection[coll]) {
			let o=M.superdi[k];
			let onew=dinew[k]={};
			if (nundef(o.coll)) o.coll = coll;
			for(const prop in o){
				if (prop == 'coll') {lookupAddIfToList(onew,['colls'],o.coll); continue;}
				if (prop == 'img'){
					if (isdef(o.path)) onew.img = o.path;
					else if (!o.img.includes('/')) {console.log('img prop is NOT a path',o); return;}
					continue;
				}
				if (prop == 'path' && nundef(o.img)) {console.log('path without img',o); return;}
				if (['ext','key','path'].includes(prop)) continue;
				onew[prop]=o[prop];
			}
		}
	}

	//add c52 mit svg to dinew
	//add civs to dinew! =>nations_progress,nations_civs,nations_events
	//sort dinew by key!!!!
	//=>ich hab einfach nur ein superdi und sonst nichts!

	let m={superdi:dinew};

	//downloadAsYaml(m,'superdi');
	return;

	//hier werden diColl,diFriendly und diCat generiert!!!!!
	let t1 = performance.now();
	let t5 = performance.now();
	console.log(`test time:${Math.round(t5 - t1)}`);

	console.log(dinew);
}
async function test4() {
	await prelims();

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	await switchToMenu(UI.nav,'collections');
	onclickNewCollection('hallo')
	//await switchToUser();

}
async function test3_modal(){
	await prelims();

	onclickUser();
}
async function test2_modal(){
	let gadget = UI.gadget; //mModalInput('username',{right:0,top:50});
	let res = await mPrompt(gadget);
	console.log('username is',res)

}
async function test1_modal(){

	let d=document.body;
	mClear(d);
	let d1=mDom(d,{position:'absolute',top:0,left:0,bg:'silver',w:300,h:200});
	openDialog(d1)

	//let res = await mModal('Enter username');
}
async function test0() {
	await prelims();

	showNavbar();

	//jetzt brauch ich einen user!!!!
	//await switchToUser('felix')



}
