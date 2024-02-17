onload = start;

async function start() { test16(); }

async function test16() {
	await prelims();

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;

	await switchToMenu(UI.nav,'collections');
	//await onclickNewCollection('favs')

	//await collDelete('favs');
	await collRename('owls','owl');
	//await onclickDeleteCollection('favs');
	//await switchToUser();

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
