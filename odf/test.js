async function test32_userpics(){
	await prelims(); 

	let users = await mGetRoute('users');
	console.log('users',users);

	let d=mDom('dMain',{display:'flex',gap:6})
	for(const name in users) showUserImage(name,d,40);
}
async function test31_dirpics(){
	await prelims(); 
	await showDirPics(`../assets/img/amanda`,'dMain')
}
async function test30_userdirpics(){
	await prelims(); 
	let imgs=await mGetFiles('../assets/img/users');
	//console.log(imgs); return;
	for(const fname of imgs){
		let src=`../assets/img/users/${fname}`;
		let sz=100;
		let styles = {'object-position': 'center top','object-fit':'cover',h:sz,w:sz,round:true,border:`${rColor()} 2px solid`}
		let img=mDom('dMain',styles,{tag:'img',src}); 

	}
}
async function test29_userpic(){
	await prelims(); 

	let users = await mGetRoute('users');
	console.log('users',users);
	for(const name in users) showUserImage(name,'dMain',40);
}
async function test28_userpic(){
	await prelims(); //return;
	switchToUser('max');

	let users = await mGetRoute('users');
	console.log('users',users);
	showUserImage('amanda','dMain',40);
}
async function test27_userpic(){
	await prelims(); //return;
	switchToUser('max');

	let users = await mGetRoute('users');
	console.log('users',users);

	let u=users.felix; //rChoose(users);	console.log('pick user',u)
	showim1(u.key,'dMain',{round:true,border:`${u.color} 3px solid`});

}
async function test26_userpic(){

	await prelims(); //return;

	switchToUser('max');

	let users = await mGetRoute('users');
	console.log('users',users);

	//let u=rChoose(users);	console.log('pick user',u)

	let src=M.superdi.felix.img;
	let img=mDom('dMain',{round:true,border:'white 3px solid'},{tag:'img',src}); return;

	for(const uname in users){
		let u=users[uname];
		assertion(isdef(u.key),`user ${u.name} has no key!!!!!!!!!!!!!`);
		let d1=mDom('dMain');
		showim(u.key,d1,{sz:100,round:true})
		break;
	}

}
async function test25() {
	await prelims();

	//await natCreateGame();
	await switchToMenu(UI.nav, 'play');
	showGameMenu('bluff')
  //await showTables(); 

	//console.log('events',Serverdata.events,Serverdata)
	//await onclickNewCollection('critters');
}
async function test24(){
	await prelims();
	await switchToMenu(UI.nav, 'collections');

	let cell = UI.collPrimary.cells[0]; //console.log('cell',cell)
	let d=cell.firstChild; //console.log('d',d)
	await clickOnItem(d,d.getAttribute('key'));
	await onclickEditCategories();
}
async function test23_grid() {
	let d = clearBodyDiv();

	let dg = mDom(d, { display: 'flex', wrap: true, dir:'column', wmax:200, hmax: 400 });
	let n = 25;
	let list = generateRandomWords(n); list.sort();
	// let olist = list.map(x => ({ w: x, sz: measureWord(x) }));
	// sortByDescending(olist, 'sz');
	// let sz = olist[0].sz; console.log(sz);

	let szmax=0;
	for (const i of range(n)) {
		let w = list[i];
		let di = mDom(dg); //,{w: sz.w + 60, h: sz.h});
		let chk = mDom(di, {}, { tag: 'input', type: 'checkbox',id:`chk${i}` });
		let label = mDom(di, { }, { tag:'label',html: w,for:chk.id });
		//let size=getBounds(di)
		//if (size>szmax) szmax=size;
	}
	let chks=arrChildren(dg);

	let olist = list.map((x,i) => ({ name: x, el: chks[i], w:mGetStyle(chks[i],'w'), h:mGetStyle(chks[i],'h')})); //;measureElement(chks[i]) }));
	sortByDescending(olist,'w')
	console.log('olist[0]',olist[0]);
	let sz = olist[0].w;
	olist.map(x=>mStyle(x.el,{w:sz+20}));
	// let d1=olist[0].el;
	// console.log(d1)
	// console.log('d1',measureElement(d1))
	//chks.map(x=>mStyle(x,{w:szmax+50}));


}
async function test22_openMockCatList() {
	let dParent = clearBodyDiv({ bg: rColor(), fg: 'contrast', hmax: 500, wmax: 200, pabottom: 10, box: true });
	let d1 = mDom(dParent, {}, { html: 'title' })
	let lst = generateRandomWords(4); //arrRepeat(30, 'hallo');
	let ui = uiTypeCheckList(lst, dParent);
	mButton('done', onclickCatListDone, dParent, { classes: 'input', margin: 10 }); //da muss noch ein button dazu
}
async function test21_catsausmisten() {
	await prelims();
	for (const k in M.superdi) {
		let o = M.superdi[k];
		let rem = [];
		for (const w of o.cats) {
			if (['hair', 'exists', 'allnew', 'fa6', 'other'].some(x => w.includes(x))) rem.push(w);
			else if (w == 'all') rem.push(w);
		}
		rem.map(x => removeInPlace(o.cats, x));
	}
	downloadAsYaml(M, 'mnew1');
}
async function test20() {
	await prelims();
	await switchToMenu(UI.nav, 'collections');
}
async function test19() {
	await prelims();
	await switchToMenu(UI.nav, 'collections');
	//await onclickNewCollection('owl');

	// let olddir = 'owls';
	// let newdir='owww';
	// let filename = 'sweetie.png';
	// await mPostRoute('moveImage',{olddir,newdir,filename});


}
async function test18() {
	await prelims();

	await switchToMenu(UI.nav, 'collections');

	//await onclickNewCollection('owl');
	//await mSleep(2000)
	//await onclickRenameCollection();
	//await onclickUser();
	//	let uname = await mGather(iDiv(UI.user),{},{content:'username',align:'br'});

}
async function test17_confusing() {
	function mConfusingField(dParent) {
		let f = mDom(dParent, { bg: 'pink', padding: 50 }, { tag: 'form' });
		let d = mDom(f);

		let d1 = mDom(d, {}, { className: 'label-container', html: `<div popover>Extra</div>` });
		mDom(d1, {}, { for: 'confusing', tag: 'label', html: 'Confusing Field' });
		let b = mDom(d1, {}, { tag: 'button', id: 'btn', type: 'button', className: 'information', html: 'i' });


		// d1.innerHTML += `<div popover id='info' anchor='btn'>Extra</div>`;	let dpop = d1.lastChild;	console.log('dpop',dpop)


		b.setAttribute('popovertarget', 'info')
		let dpop = d1.firstChild;
		dpop.id = 'info';
		dpop.setAttribute('anchor', 'btn')
		//mStyle(dpop,{inset:'unset',bottom:'anchor(top)',left:'anchor(right)'})

		// let dpop=mDom(d1,{},{});
		// dpop.popover = true; //setAttribute('popover','Extra')

		let inp = mDom(d, {}, { tag: 'input', id: 'confusing', type: 'text' });
		return { d, dpop, b, inp }
	}
	let d = clearBodyDiv({ margin: 50, bg: 'red' });
	let ui = mConfusingField(d);
	await mSleep(500);
	console.log('clicking!')
	ui.b.click();
	await mSleep(2000);
	console.log('clicking!')
	ui.b.click();
	console.log(ui)
}
async function test16() {
	await prelims();

	await switchToMenu(UI.nav, 'collections');
	await onclickNewCollection('owl')

	//await collDelete('favs'); //ok, besser als: //await onclickDeleteCollection('favs');
	//await collRename('owls','owl'); //ok
	//await switchToUser(); //ok

}
async function test15() {
	let src = await serverdataConfigUrl();
	let m = await imgMeasure(src); //console.log('sz',m);  
	let [img, wOrig, hOrig, sz, dParent] = [m.img, m.w, m.h, 300, clearBodyDiv()];
	let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
	mIfNotRelative(d);
	mStyle(img, { h: sz });
	mAppend(d, img);
	let [w0, h0] = [img.width, img.height];

	let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
	dc.onmousedown = startPanning;

	mDom(dParent, { w: 1, h: 1 })
	mButton('restart', () => imgReset(img, dc, sz, w0, h0), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('squish', () => imgSquish(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('expand', () => imgExpand(img, dc, sz), dParent, { fz: 30, padding: 10, maleft: 10 });
	mButton('ok', () => imgCrop(img, dc, wOrig, hOrig), dParent, { fz: 30, padding: 10, maleft: 10 });

}

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

//#region old tests
async function test100_odf(){
  Serverdata = await mGetRoute('session'); //session ist: users,config,
  Info = await mGetYaml('../assets/info.yaml');
  await loadCollections();
  loadPlayerColors();
  sockInit();
  console.log('M',M,'\nServerdata',Serverdata,'\nClientdata',Clientdata,'\nDA',DA,Session,TO,window.TO)
}
async function test69_event() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml'); return;
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let di = {second_boer_war:'right',opium_war:'right',balkan_wars:'right', antikythera_mechanism:'left',uluru:null,mount_kailash:null,terracotta_army: 'top', uraniborg: 'left', great_barrier_reef: 'right', hawaii:'left' };
  let list=Object.keys(di);
  list=['second_boer_war','opium_war','balkan_wars']; // all done!
  for (const k of list) {
    let card = M.natCards[k];
    let path = `../assets/games/nations/cards/${card.Path}`;
    let type = card.Type;
    let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
    let [wImg, hImg] = [img.width, img.height]; 
    let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
    let [wCanvas, hCanvas] = [wImg, hImg];
    let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
    let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
    ctx1.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
    console.log('____________', k)
    let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
    mDom(dParentGood, { h: 10 });
    let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wCanvas, height: hCanvas });
    let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
    ctx11.drawImage(img, 0, 0, wImg, hImg, 0, 0, wCanvas, hCanvas);
    let noside = di[k];
    let xStart = type == 'war'?20:0;
    let left = noside == 'left' ? 0 : findLeftLine(ctx1, wCanvas, hCanvas, cgoal,xStart); console.log('left', left)
    let right = noside == 'right' ? wCanvas : findRightLine(ctx1, wCanvas, hCanvas, cgoal); console.log('right', right)
    let top = noside == 'top' ? 0 : findTopLine(ctx1, wCanvas, hCanvas, cgoal); console.log('top', top)
    let bot = noside == 'bottom'||type=='war' ? hCanvas : findBottomLine(ctx1, wCanvas, hCanvas, cgoal); console.log('bot', bot)
    let [x1, x2, y1, y2, dx, dy, factw, facth] = [left, right, top, bot, 8, 8, 2, 2];
    if (k == 'hawaii') {dx=16; factw=1.2}
    else if (k.includes('antiky')) {dx=16; factw=1.1; dy=10;}
    ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - factw * dx, h - facth * dy);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'maroon', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
    await imgToServer(canvas, `y/nat/${type}/${k}.png`);
  }
  function findLeftLine(ct, w, h, cgoal, xStart=0) {
    let [restlist, _] = findPointsBoth(ct, xStart, xStart+40, 0, h, cgoal, 20);
    let o = nextBar(ct, restlist, 'red');
    return o.val;
  }
  function findRightLine(ct, w, h, cgoal) {
    let [restlist, _] = findPointsBoth(ct, w - 40, w, 0, h, cgoal, 20);
    let o = nextBar(ct, restlist, 'orange');
    return o.val;
  }
  function findTopLine(ct, w, h, cgoal) {
    let [_, restlist] = findPointsBoth(ct, 0, w, 0, 40, cgoal, 20);
    let o = nextLine(ct, restlist, 'blue');
    return o.val;
  }
  function findBottomLine(ct, w, h, cgoal) {
    let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
    let o = nextLine(ct, restlist, 'green');
    return o.val;
  }
}
async function test70_game(){
 await prelims();
 onclickNATIONS();
}
async function test71_civDetect(){
  let orange=`#F17D2D`;
  let blue=`#0F9AD7`;
  let green=`#429F47`; // `#6CAA3F`
  let red=`#BA1B35`;
  let brown=`#996142`; // `#BC6A33`
  M.civs=['america','arabia','china','egypt','ethiopia','greece','india','japan','korea','mali','mongolia','persia','poland','portugal','rome','venice','vikings'];
  let player=M.player = {civ:'persia'}; //rChoose(M.civs)};
  let dciv=mDom('dMain');
  let img=await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, {position:'absolute'}, { tag: 'img' }));
  let [wImg, hImg] = [img.width, img.height]; 
  let dParentBad = toElem('dTitle');
  let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
  let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
  ctx1.drawImage(img, 0, 0, wImg, hImg);
  let rAdvisor={x:11,y:27,w:87,h:136}; //von persia
  let yUnten=rAdvisor.y+rAdvisor.h+5;
  let rColony1={x:10,y:193,w:87,h:137}; //von japan
  let rColony2={x:122,y:192,w:87,h:136}; //von india
  let rBuilding1={x:132,y:26,w:87,h:136}; //von portugal
  let rColonyUpPersia={x:122,y:26,w:87,h:136}; //von portugal
  console.log('rColonyUpPersia',rColonyUpPersia);
  let rBuilding1Persia={x:243,y:26,w:87,h:136}; //von persia
  console.log('rBuilding1Persia',rBuilding1Persia);
  let xBuilding2=rBuilding1.x+rBuilding1.w+5;
  let rBuilding2={x:243,y:28,w:87,h:136};
  let dxBuildings=rBuilding2.x-(rBuilding1.x+rBuilding1.w);
  console.log('dx buildings',dxBuildings)
  let rWic={x:700,y:26,w:87,h:136}; //calculated
  let rLastWonder={x:700,y:193,w:87,h:136};
  let rWonder={x:674,y:193,w:87,h:136};
  let dxWonders=26;
}
async function test72_civSpots(){
  await prelims();
  onclickNATIONS();
}
async function test73_game(){
  await prelims(); if (!U) {console.log('no user!');await switchToUser('felix')}
  await natLoadAssets(); 
  mButton('START',natCreateGame,'dMain');
}
async function test74_svgImage(){
  let d=mBy('dMain');
  let img = mDom(d,{h:200},{tag:'img',src:'../assets/games/nations/templates/book.svg'});
}
async function test75_login(){
  await prelims();
  console.log('user is',U.name)
  await switchToUser(U.name == 'felix'?'amanda':'felix');
  console.log('user now:',U.name)
}
async function test76_simplestuff(){
  await prelims();
  await switchToUser('mac');
  await switchToMenu('plan');
}
async function test77_showTables(){
  await prelims();
  await natLoadAssets(); 
  await natCreateGame();
  await showTables(); return;
}
async function test78_allcommands(){
  await prelims();
}
//#endregion