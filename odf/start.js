onload = start;

async function start() { test18(); }

async function test18() {
	await prelims();

	//await switchToMenu(UI.nav,'collections');

	//await onclickNewCollection('owl');
	//await mSleep(2000)
	//await onclickDeleteCollection();
}


async function test17_confusing(){
	function mConfusingField(dParent){
		let f=mDom(dParent,{bg:'pink',padding:50},{tag:'form'});
		let d=mDom(f);
		
		let d1=mDom(d,{},{className:'label-container',html:`<div popover>Extra</div>`});
		mDom(d1,{},{for:'confusing',tag:'label',html:'Confusing Field'});
		let b=mDom(d1,{},{tag:'button',id:'btn',type:'button',className:'information',html:'i'});
	
	
		// d1.innerHTML += `<div popover id='info' anchor='btn'>Extra</div>`;	let dpop = d1.lastChild;	console.log('dpop',dpop)
	
	
		b.setAttribute('popovertarget','info')
		let dpop = d1.firstChild;
		dpop.id='info';
		dpop.setAttribute('anchor','btn')
		//mStyle(dpop,{inset:'unset',bottom:'anchor(top)',left:'anchor(right)'})
	
		// let dpop=mDom(d1,{},{});
		// dpop.popover = true; //setAttribute('popover','Extra')
	
		let inp=mDom(d,{},{tag:'input',id:'confusing',type:'text'});
		return {d,dpop,b,inp}
	}
	let d=clearBodyDiv({margin:50,bg:'red'});
	let ui=mConfusingField(d);
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

	await switchToMenu(UI.nav,'collections');
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


async function prelims() {
	let t1 = performance.now();

	Serverdata = await mGetRoute('session'); //session ist: users,config,

	let t2 = performance.now();

	await loadAssets();

	let t4 = performance.now();

	sockInit();

	UI.nav = showNavbar();
	UI.user = mCommand(UI.nav.r, 'user', null, onclickUser); iDiv(UI.user).classList.add('activeLink');
	//UI.gadgetUsername = mGadget('username', { right: 0, top: 30 });

	await switchToUser(localStorage.getItem('username'));

	let t5 = performance.now();

	//downloadAsYaml(M,'mnew'); 
	// for (s of 'Clientdata DA Items M Serverdata Session Socket TO U UI Z'.split(' ')) conslog(s)
	// console.log(`session:${Math.round(t2 - t1)} \nload:${Math.round(t3 - t2)} \nfast load:${Math.round(t4 - t3)} \nsock+rest:${Math.round(t5 - t4)}`)
	console.log(`total prelims time:${Math.round(t5 - t1)}`);

	window.onkeydown = keyDownHandler;
	window.onkeyup = keyUpHandler;



}
