onload = start;

async function start() { test13(); }


async function test13() {
	Serverdata = await mGetRoute('session'); //console.log(Serverdata); 
	let url = Serverdata.config.url; //`../assets/img/animals/bird/bird13.png`; // Serverdata.config.url; //console.log('url',url)
	let dParent = clearBodyDiv();
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	let sz = 300;
	let img = await imgAsync(d, { h: sz }, { tag: 'img', src: url });
	//mStyle(img,{w:img.width,h:img.height}); nuetzt nix!
	
	mIfNotRelative(d);

	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	let dc = mDom(d, { position: 'absolute', left: cx - radx, top: cy - rady, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' }); //,{className:'no_events'}); 

	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })

	mButton('restart', () => imgReset(img, dc, sz, w,h), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => imgCrop(img, dc), dParent, { fz: 30, padding: 10, maleft: 10 });

}
function adjustCropper(img, dc, sz) {
	let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
	let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
	mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });

}
function adjustCropperBySimple(dc, x, y, dx, dy) { mStyle(dc, { left: x + dx, top: y + dy }); }

function adjustCropperBy(dc, x, y, dx, dy, wImg, hImg, szIdeal) {
	// let [w,h]=[img.width,img.height];	console.log('sz',w,h,)
	// let [cx,cy,radx,rady,rad]=[w/2,h/2,sz/2,sz/2,sz/2];
	console.log('_________\ndx', dx, 'dy', dy)
	//let [x,y]=[mGetStyle(dc,'left'),mGetStyle(dc,'top')]

	if (nundef(wImg)) {
		//no change in cropper size!
		mStyle(dc, { left: x + dx, top: y + dy }); //,w:sz,h:sz});
		return;
	}

	console.log('image sz', wImg, hImg)
	let [l, t, w, h] = [mGetStyle(dc, 'left'), mGetStyle(dc, 'top'), mGetStyle(dc, 'w'), mGetStyle(dc, 'h')]; console.log('dims', l, t, w, h);
	let [cx, cy] = [l + w / 2, t + h / 2];
	//let curDist=Math.min(l,t,wImg-(l+w),hImg-(t+h));	console.log('curDist',curDist)
	let [cxNew, cyNew] = [cx + dx, cy + dy]; console.log('new center', cxNew, cyNew)
	//min distance of cropper center to any image boundary
	let newDist = Math.min(cxNew, cyNew, wImg - cxNew, hImg - cyNew); console.log('newDist', newDist)
	//size of cropper should be:
	let wNew = Math.min(szIdeal, newDist * 2);
	let hNew = Math.min(szIdeal, newDist * 2);
	let xNew = cxNew - wNew / 2;
	let yNew = cyNew - hNew / 2;
	//dist is the min distance the cropper is currently 

	mStyle(dc, { left: xNew, top: yNew, w: wNew, h: hNew }); //,w:sz,h:sz});


}
function adjustComplex(panData) {
	//initial pos of cropper:
	let [x0, y0] = [panData.posStart.x, panData.posStart.y];

	//how much moved the mouse:
	let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];

	//image size: (constant)
	let [wImg, hImg] = [panData.img.width, panData.img.height];

	//ideal size: (since cropping square initial width of cropper suffices):
	let ideal = panData.cropStartSize.w;

	//cropper initial center:
	let [cx0, cy0] = [panData.cropStartPos.l + ideal / 2, panData.cropStartPos.t + ideal / 2];

	//theoretically, cropper initial center should be moved by dx,dy
	let [cx, cy] = [cx0 + dx, cy0 + dy];
	//cx = clamp(cx, 0, wImg); cy = clamp(cy, 0, hImg); console.log('center', cx, cy)
	cx = clamp(cx, ideal/2, wImg-ideal/2); cy = clamp(cy, ideal/2, hImg-ideal/2); //console.log('center', cx, cy)

	//where should the new left of the cropper be? at least 0, at most wImg, ideally:cx-ideal/2
	let lNew = clamp(cx - ideal / 2, 0, wImg); //console.log('lNew is', lNew);
	let tNew = clamp(cy - ideal / 2, 0, hImg); //console.log('tNew is', tNew);
	let rNew = clamp(cx + ideal / 2, 0, wImg); //console.log('rNew is', rNew);
	let bNew = clamp(cy + ideal / 2, 0, hImg); //console.log('bNew is', bNew);

	//what will the new size be once I have lNew and tNew?
	let wNew = Math.min(Math.abs(cx - lNew) * 2, Math.abs(rNew - cx) * 2);
	let hNew = Math.min(Math.abs(cy - tNew) * 2, Math.abs(bNew - cy) * 2); //console.log('wNew,hNew', wNew, hNew)

	mStyle(panData.dCrop, { left: cx - wNew / 2, top: cy - hNew / 2, w: wNew, h: hNew });
}
async function imgCrop(img,dc){
	// crop image to cropper
	//const canvas = document.createElement('canvas');
	let dims = mGetStyles(dc,['left','top','w','h']); console.log('dims',dims);
	let d1=mDom(document.body);
	let canvas=mDom(d1,{},{tag:'canvas',width:dims.w,height:dims.h});
	const ctx = canvas.getContext('2d');
	//ctx.fillStyle='red';
	ctx.fillStyle='yellow';
	ctx.fillRect(0,0,dims.w,dims.h);
	//ctx.drawImage(img,dims.left,dims.top,img.width,img.height,0,0,dims.width,dims.height)
	ctx.drawImage(img, 50, 50, 300, 300, 0, 0, 300, 300);
	//ctx.clearRect(0,0,dims.w,dims.h);
}
function hahaha(){
	let w = canvas.width = mGetStyle(dc,'w');
	let h = canvas.height = mGetStyle(dc,'h');
	const ctx = canvas.getContext('2d');
	ctx.drawImage(img, 0,0,w,h); //mGetStyle(dc,'left'), mGetStyle(dc,'top'), w,h);
	
	// store dataUrl
	const dataUrl = canvas.toDataURL();
	
	// resize to cell size, dialogs, then send
	//now remove image and reload from dataUrl with 128x128
	let d=dc.parentNode;
	mClear(d);
	mAppend(d,canvas);
	//img = await imgAsync(d,{w:128,h:128},{src:dataUrl});

}
function imgReset(img,dc,sz,w,h){img.width=w;img.height=h;adjustCropper(img,dc,sz);}
function imgExpand(img, dc, sz) { img.width += 20; adjustCropper(img, dc, sz); }
function imgSquish(img, dc, sz) { img.width -= 20; adjustCropper(img, dc, sz); }
function startPanning(ev) {
	console.log('_________startPanning!')
	const panData = {};
	function panStart(ev) {
		evNoBubble(ev);
		assertion(nundef(panData.panning), panData)
		let dc = panData.dCrop = ev.target;
		panData.cropStartSize = { w: mGetStyle(dc, 'w'), h: mGetStyle(dc, 'h') }
		panData.cropStartPos = { l: mGetStyle(dc, 'left'), t: mGetStyle(dc, 'top') }
		panData.elParent = panData.dCrop.parentNode;
		panData.img = panData.elParent.querySelector('img, canvas');//console.log('img',panData.img);
		panData.panning = true;
		panData.counter = -1;
		panData.mouseStart = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		panData.posStart = { x: mGetStyle(dc, 'left'), y: mGetStyle(dc, 'top') };
		addEventListener('mouseup', panEnd);
		panData.elParent.addEventListener('mousemove', panMove);
		console.log('panStart!', panData.mouseStart);
	}
	function panMove(ev) {
		evNoBubble(ev);
		if (!panData.panning || ++panData.counter % 3) return;
		panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
		let [x, y] = [panData.posStart.x, panData.posStart.y];
		let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
		[dx, dy] = [Math.round(dx / 10) * 10, Math.round(dy / 10) * 10];

		// adjustCropperBySimple(panData.dCrop, x, y, dx, dy, panData.img.width, panData.img.height, panData.cropStartSize.w, panData.cropStartSize.h);
		adjustComplex(panData)

		// console.log(panData.mouse);
	}
	function panEnd(ev) {
		//evNoBubble(ev);
		assertion(panData.panning == true);
		let d = evToClass(ev, 'imgWrapper');
		if (d == panData.elParent) {
			evNoBubble(ev);
			panData.mouse = getMouseCoordinatesRelativeToElement(ev, panData.elParent);
			console.log('SUCCESS!', panData.mouse)
		}
		removeEventListener('mouseup', panEnd);
		panData.elParent.removeEventListener('mousemove', panMove);
		panData.panning = false;
		console.log('* THE END *', panData)
	}
	panStart(ev);
}
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


async function prelims() {
	let t1 = performance.now();

	Serverdata = await mGetRoute('session'); //session ist: users,config,

	let t2 = performance.now();

	await loadAssets();

	let t4 = performance.now();

	sockInit();

	UI.nav = showNavbar();
	UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
	UI.gadgetUsername = mGadget('username', { right: 0, top: 30 });

	await switchToUser(localStorage.getItem('username'));

	let t5 = performance.now();

	//downloadAsYaml(M,'mnew'); 
	// for (s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)
	// console.log(`session:${Math.round(t2 - t1)} \nload:${Math.round(t3 - t2)} \nfast load:${Math.round(t4 - t3)} \nsock+rest:${Math.round(t5 - t4)}`)
	console.log(`total prelims time:${Math.round(t5 - t1)}`);

}
