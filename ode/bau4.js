
function showImageInBatch1(key, dParent, styles = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (isdef(o.img)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = onclickCollItemLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = onclickCollItem;
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = () => { UI.draggedItem = o; };
	return d1;
}

async function showTable(id) {
	let me = getUname();
	let table = await mGetRoute('table', { id });  //console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	let func = DA.funcs[table.game];
	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2><span style="font-family:emoNoto"${getGameProp('friendly').toUpperCase()}: ${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d);
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d);
	func.stats(table);
	let minTableSize = 400;
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);
	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }
	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);
	await updateTestButtonsPlayers(table);
	func.activate(table, items);
}
function showImageCard(key,dParent,styles={},opts={}){
	let d=mDom(dParent,styles,opts);
	let o = M.superdi[key];
	console.log(o);
	let d1=showImage1(key,d);
}
function showImage1(key, dParent, styles = {}, useSymbol = false) {
	let o = M.superdi[key];
	assertion(o,`showImage:key not found ${key}`);
	let [w, h] = mSizeSuccession(styles); console.log(w,h)
	let [sz, fz] = [.9 * w, .8 * h];
	addKeys({ position: 'relative', w, h, padding: 11, box: true },styles)
	let d1 = mDiv(dParent, styles);//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'contain', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
	assertion(el, 'PROBLEM mit' + key);
	return d1;
}

function clearMain() { staticTitle(); clearEvents(); mClear('dMain'); mClear('dTitle'); clearMessage(); }

async function correctUsersDeleteKeyImageKey() {
  for (const name in Serverdata.users) {
    let u = Serverdata.users[name];
    delete u.key;
    delete u.imageKey;
    await postUserChange(u, true);
  }
}
async function instructionStandard(table, instruction) {
  let myTurn = isMyTurn(table);

  if (!myTurn) staticTitle(table); else animatedTitle();

  if (nundef(instruction)) return;

  let styleInstruction = { display: 'flex', 'justify-content': 'center', 'align-items': 'center' };
  let dinst = mBy('dInstruction'); mClear(dinst);

  let html;
  if (myTurn) {
    styleInstruction.maleft = -30;
    html = `
        ${get_waiting_html()}
        <span style="color:red;font-weight:bold;max-height:25px">You</span>
        &nbsp;${instruction};
        `;
  } else { html = `waiting for: ${getTurnPlayers(table)}` }

  mDom(dinst, styleInstruction, { html });

}
function lastWord(s) { return arrLast(toWords(s)); }

function mimali(c, m) {
  let seasonColors = 'winter_blue midnightblue light_azure capri spring_frost light_green deep_green summer_sky yellow_pantone orange pale_fallen_leaves timberwolf'.split(' ');
  let c2 = seasonColors[m - 1];
  let colors = paletteMix(c, c2, 6).slice(); //paletteShadesBi(c,36*m);
  let wheel = [];
  for (const x of colors) {
    let pal1 = paletteShades(x); //console.log(pal1.length)
    for (const i of range(7)) wheel.push(pal1[i + 2]);
  }
  return wheel;
}
function mixColors(c1, c2, c2Weight01) {
  let [color1, color2] = [colorFrom(c1), colorFrom(c2)]
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  const r = Math.floor(r1 * (1 - c2Weight01) + r2 * c2Weight01);
  const g = Math.floor(g1 * (1 - c2Weight01) + g2 * c2Weight01);
  const b = Math.floor(b1 * (1 - c2Weight01) + b2 * c2Weight01);
  const hex = colorRgbArgsToHex79(r, g, b);
  return hex;
}
function scaleAnimation(elem) {
  elem = toElem(elem);
  let ani = elem.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.3)' },
  ], {
    duration: 1000,
    easing: 'ease-in-out',
    iterations: 2,
    direction: 'alternate'
  });
  return ani;
}
function someOtherPlayerName(table) {
  return rChoose(arrWithout(table.playerNames, getUname()));
}

