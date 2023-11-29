function mFlexLine(d, bg = 'white', fg = 'contrast') {
  //console.log('h',d.clientHeight,d.innerHTML,d.offsetHeight);
  mStyle(d, { bg: bg, fg: fg, display: 'flex', valign: 'center', hmin: measureHeight(d) });
  mDiv(d, { fg: 'transparent' }, null, '|')
}
function measureHeight(d) {
  let d2 = mDiv(d, { opacity: 0 }, null, 'HALLO');
  return d2.clientHeight;
}
function addEditable(dParent, styles = {}, opts = {}) {
  //let html= `<p contenteditable="true">hallo</p>`; let x=mDom(dParent,{},{html:html});
  addKeys({ tag: 'input', classes: 'plain' }, opts)
  addKeys({ wmax: '90%', box: true }, styles);
  let x = mDom(dParent, styles, opts); // { tag: 'input', classes: 'plain' });
  x.focus();
  x.addEventListener('keyup', ev => {
    if (ev.key == 'Enter') {
      mBy('dummy').focus();
      // let text=x.value;
      // let d=mDiv(dParent,{},null,x.value);
      // x.remove();
      if (isdef(opts.onEnter)) opts.onEnter(ev)
    }
  }); //console.log('HALLO'); });
  //mPlace(x,'cc'); //(x,0,20)
  return x;
}

async function userLoad(uname) {
	UI.nav.activate('no')
	if (nundef(uname)) uname = localStorage.getItem('username');
	//U = null;
	//uname = null;
	if (isdef(uname) && (!U || U.name != uname)) {
		//what if the current U has unsaved data??? TODO
		let data = lookup(Serverdata.session, ['users', uname]) ?? lookup(Serverdata.config, ['users', uname]);
		if (!data) {
			console.log('adding new user!!!', uname);
			data = { name: uname, color: rChoose(M.playerColors) };
			o = { data: data, path: `users.${uname}`, mode: 'cs' }; //['users',uname]
			Serverdata = await uploadJson('save', o);
		}
		assertion(data, "WTK??? userLoad!!!!!!!!!!!!!!!! " + uname);
		U = data;
	}
	mClear(dUser);
	mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })

	let d;
	if (U) {
		d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'active' });
		setColors(U.color)
		//let d1 = showImage('gear', dUser, { sz: 25 });	d1.onclick = onclickGear;
	} else {
		let styles = { family: 'fa6', fg: 'grey', fz: 25, cursor: 'pointer' };
		d = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
	}
	d.onclick = onclickUser;
}
async function onclickColors() {
	showTitle('Set Color Theme');
	//showColors('dMain', M.playerColors, onclickColor);
	let d = mDom('dMain', { hpadding:20, display: 'flex', gap: '2px 4px', wrap: true });

	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);

	//3x3x3x5 colors sind es + 15 grays
	let i = 0;
	for (const c of list) {
		let dc = mDom(d, { w: 50, h: 50, bg: c, fg: idealTextColor(c) });
		dc.onclick = onclickColor; 
		mStyle(dc, { cursor: 'pointer' }); 
		i++; if (i % 15 == 0) mDom(d, { w: '100%', h: 0 });
	}
}
async function onclickColor(ev) {
	let c = ev.target.style.background;
	c = colorHex(c);
	//console.log('color', c)
	setColors(c);
	//muss die color senden! aber was wenn kein user da ist?
	if (U){
		U.color = c;
		//console.log('u',U);
		let data = { name: U.name, color: U.color };
		o = { data: data, path: `users.${U.name}`, mode: 'cs' }; 
		Serverdata = await uploadJson('save', o);
		// await userLoad(U.name);
	}
}
function setColors(c) {
	let hsl = colorHSL(c, true);
	let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
	let hstart = (hue + diff); //das ist also 223
	for (i = hstart; i <= hstart + 235; i += 20) {
		let h = i % 360;
		let c1 = colorFromHSL(h, 100, 75);
		wheel.push(c1);
	}
	//console.log('wheel', wheel); showWheel(wheel, c); // hat 12 colors

	let cc = idealTextColor(c);	
	let pal = colorPalette(c); pal.unshift('black'); pal.push('white');
	let palc = colorPalette(cc);
	//console.log('pal',pal); //hat 11 colors von black zu white, pal[5] ist die gewaehlte
	// 0 1 2 3 4 5 6 7 8 9 10
	function light(i=3){if (i<0)i=0;if (i>5)i=5;return pal[5+i];}
	function dark(i=3){if (i<0)i=0;if (i>5)i=5;return pal[5-i];}
	function simil(i=3){return cc=='white'?dark(i):light(i);} 
	function contrast(i=3){return cc=='white'?light(i):dark(i);} 

	//let list=	

	//muss immer dann wenn U geaendert wird called werden!
	setCssVar('--bgBody', c);
	setCssVar('--bgButton','transparent')
	setCssVar('--bgButtonActive',light(3))
	setCssVar('--bgNav',simil(2))
	setCssVar('--bgLighter',light())
	setCssVar('--bgDarker',dark())

	setCssVar('--fgButton',contrast(3))
	setCssVar('--fgButtonActive', cc=='black'?dark(2):c)
	setCssVar('--fgButtonDisabled','silver')
	setCssVar('--fgButtonHover',contrast(5))
	// setCssVar('--bgDocument', rColor())
	// setCssVar('--fgDocument', rColor())
	setCssVar('--fgTitle', contrast(4))
	setCssVar('--fgSubtitle', contrast(3))

	//if (isdef(DA.calendar)) DA.calendar.setColors()
}














