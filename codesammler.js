

//#region integrate 21.mai 24 bau3.js
//#region theme setting
async function onclickSettTheme() { await showThemes(); }
async function onclickSettAddYourTheme() {
  let name = await mGather(iDiv(UI.settAddYourTheme));
  //console.log(`should add theme for user ${getUname()} under name ${name}`);
  let o = {};
  for (const s of ['color', 'bgImage', 'bgBlend', 'fg']) {
    if (isdef(U[s])) o[s] = U[s];
  }
  o.name = name;
  let themes = lookup(Serverdata.config, ['themes']);
  let key = isdef(themes[name]) ? rUniqueId(6, 'th') : name;
  Serverdata.config.themes[key] = o;
  await mPostRoute('postConfig', Serverdata.config);
}

async function showThemes() {
  let d = mBy('dSettingsColor'); mClear(d);
  let d1 = mDom(d, { gap: 12, padding: 10 }); mFlexWrap(d1);
  let themes = lookup(Serverdata.config, ['themes']);
  let bgImage, bgSize, bgRepeat, bgBlend, name, color, fg;
  for (const key in themes) {
    let th = themes[key];
    if (isdef(th.bgImage)) {
      //find bgSize and bgRepeat for bgImage
      bgImage = th.bgImage;
      bgRepeat = (bgImage.includes('marble')||bgImage.includes('wall')) ? 'no-repeat' : 'repeat';
      bgSize = (bgImage.includes('marble')||bgImage.includes('wall')) ? 'cover' : '';
      bgBlend = isdef(th.bgBlend) ? th.bgBlend : (bgImage.includes('ttrans') ? 'normal' : bgImage.includes('marble_') ? 'luminosity' : 'multiply');
    }
    color = th.color;
    if (isdef(th.fg)) fg = th.fg;
    name = th.name;

    let [realBg,bgContrast,bgNav,fgNew,fgContrast] = calculateGoodColors(color,fg)

    let styles = {w:300,h:200,bg:realBg,fg:fgNew,border:`solid 1px ${getCSSVariable('--fgButton')}`};
    if (isdef(bgImage)) addKeys({bgImage,bgSize,bgRepeat},styles);
    if (isdef(bgBlend)) addKeys({bgBlend},styles);
    let dsample = mDom(d1,styles,{theme:key});
    let dnav = mDom(dsample,{bg:bgNav,padding:10},{html:name.toUpperCase()});
    let dmain = mDom(dsample,{padding:10,fg:'black',className:'section'},{html:getMotto()});
    dsample.onclick = onclickThemeSample;
  }
}
async function onclickThemeSample(ev){
  let key = evToAttr(ev,'theme');
  console.log('key',key)
  let theme = jsCopyExceptKeys(Serverdata.config.themes[key],['name']);
  console.log('theme',theme);

  copyKeys(theme,U);
  await postUserChange();
  setTheme();
}
function getMotto(){
  let list = [
    `Let's play!`, 'Enjoy this beautiful space!', 'First vacation day!', 'No place like home!',
    'You are free!', 'Nothing to do here!', `Don't worry, be happy!`, `Good times ahead!`,
    'Right here, right now', 'Life is a dream', 'Dream away!', 'Airport forever'
  ];
  return rChoose(list);
}
//#endregion

//#region color functions neu
function colorBlendMode(c1, c2, blendMode) {
  function blendColorDodge(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    const dodge = (a, b) => (b === 255) ? 255 : Math.min(255, ((a << 8) / (255 - b)));

    let r = dodge(r1, r2);
    let g = dodge(g1, g2);
    let b = dodge(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendColor(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
    let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

    // Use the blend hue, but keep the base saturation and lightness
    let cfinal = colorHsl01ArgsToRgbArray(h2, s1, l1);
    return colorRgbArgsToHex79(...cfinal);
  }
  function blendDarken(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let r = Math.min(r1, r2);
    let g = Math.min(g1, g2);
    let b = Math.min(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendLighten(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let r = Math.max(r1, r2);
    let g = Math.max(g1, g2);
    let b = Math.max(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendLuminosity(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
    let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

    // Set the luminosity of the base color to the luminosity of the blend color
    let [r, g, b] = colorHsl01ArgsToRgbArray(h1, s1, l2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendMultiply(color1, color2) {
    let [r1, g1, b1] = colorHexToRgbArray(color1);
    let [r2, g2, b2] = colorHexToRgbArray(color2);

    // Multiply each channel and divide by 255 to scale back to color space
    let r = (r1 * r2) / 255;
    let g = (g1 * g2) / 255;
    let b = (b1 * b2) / 255;

    return colorRgbArgsToHex79(Math.round(r), Math.round(g), Math.round(b));
  }
  function blendNormal(baseColor, blendColor) {
    return blendColor; // The blend color simply replaces the base color
  }
  function blendOverlay(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    const overlayCalculate = (a, b) => (a <= 128) ? (2 * a * b / 255) : (255 - 2 * (255 - a) * (255 - b) / 255);

    let r = overlayCalculate(r1, r2);
    let g = overlayCalculate(g1, g2);
    let b = overlayCalculate(b1, b2);

    return colorRgbArgsToHex79(r, g, b);
  }
  function blendSaturation(baseColor, blendColor) {
    let [r1, g1, b1] = colorHexToRgbArray(baseColor);
    let [r2, g2, b2] = colorHexToRgbArray(blendColor);

    let [h1, s1, l1] = colorRgbArgsToHsl01Array(r1, g1, b1);
    let [h2, s2, l2] = colorRgbArgsToHsl01Array(r2, g2, b2);

    // Use the base hue and lightness, blend saturation
    let cfinal = colorHsl01ArgsToRgbArray(h1, s2, l1);
    return colorRgbArgsToHex79(...cfinal);
  }
  function blendScreen(color1, color2) {
    let [r1, g1, b1] = colorHexToRgbArray(color1);
    let [r2, g2, b2] = colorHexToRgbArray(color2);

    // Apply the screen blend mode formula
    let r = 255 - (((255 - r1) * (255 - r2)) / 255);
    let g = 255 - (((255 - g1) * (255 - g2)) / 255);
    let b = 255 - (((255 - b1) * (255 - b2)) / 255);

    return colorRgbArgsToHex79(r, g, b);
  }

  //console.log('blendMode',blendMode);
  let di = {
    darken: blendDarken, lighten: blendLighten, color: blendColor, colorDodge: blendColorDodge, luminosity: blendLuminosity, multiply: blendMultiply, normal: blendNormal, overlay: blendOverlay,
    saturation: blendSaturation, screen: blendScreen
  };
  let func = di[blendMode]; if (nundef(di)) { console.log('blendMode', blendMode); return c1; }
  //console.log(func);
  c1hex = colorFrom(c1);
  c2hex = colorFrom(c2);
  let res = func(c1hex, c2hex);
  //console.log('blend',c1hex,c2hex,'=>',res);
  return res;
}
function colorContrastPickFromList(color, colorlist = ['white', 'black']) {
	let contrast = 0;
	let result = null;
	let rgb = colorHexToRgbArray(colorFrom(color));
	for (c1 of colorlist) {
    let x = colorHexToRgbArray(colorFrom(c1));
		let c = colorGetContrast(rgb, x);
		if (c > contrast) { contrast = c; result = c1; }
	}
	return result;
}
function colorContrastFromElem(elem, list = ['white', 'black']) {
  let bg = mGetStyle(elem, 'bg'); 
  return colorContrastPickFromList(bg, list);
}
function colorsFromBFA(bg, fg, alpha) {
  if (fg == 'contrast') {
    if (bg != 'inherit') bg = colorFrom(bg, alpha);
    fg = colorIdealText(bg);
  } else if (bg == 'contrast') {
    fg = colorFrom(fg);
    bg = colorIdealText(fg);
  } else {
    if (isdef(bg) && bg != 'inherit') bg = colorFrom(bg, alpha);
    if (isdef(fg) && fg != 'inherit') fg = colorFrom(fg);
  }
  return [bg, fg];
}
function colorGetContrast(c1,c2) {
  function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  }
	let rgb1 = colorHexToRgbArray(colorFrom(c1));
	let rgb2 = colorHexToRgbArray(colorFrom(c2));
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
	var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
	var brightest = Math.max(lum1, lum2);
	var darkest = Math.min(lum1, lum2);
	return (brightest + 0.05)
		/ (darkest + 0.05);
}
function colorGetLum(c){ return colorGetLum01(c)*100; }
function colorGetLum01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[2];
}
function colorGetHue(c){ return colorGetHue01(c)*360; }
function colorGetHue01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[0];
}
function colorGetSat(c){ return colorGetSat01(c)*100; }
function colorGetSat01(c){
	let hex=colorFrom(c);
	let hsl=colorHexToHsl01Array(hex); //console.log('hsl',hsl);
	return hsl[1];
}
function colorIdealText(bg, grayPreferred = false, nThreshold = 105) {
  let rgb = colorHexToRgbObject(colorFrom(bg));
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function colorPalette(color, type = 'shade') {  return colorShades(colorFrom(color));}
function colorPaletteFromImage(img) {
  if (nundef(ColorThiefObject)) ColorThiefObject = new ColorThief();
  return ColorThiefObject.getPalette(img).map(x=>colorFrom(x));
}
function colorPaletteFromUrl(path) {
  let img = mCreateFrom(`<img src='${path}' />`);
  let pal = colorPaletteFromImage(img);
  return pal;
}
function colorShades(color) {
  let res = [];
  for (let frac = -0.8; frac <= 0.8; frac += 0.2) {
    let c = colorCalculator(frac, color, undefined, true);
    res.push(c);
  }
  return res;
}
function colorTrans(cAny, alpha = 0.5) { return colorFrom(cAny, alpha); }

function colorTransPalette(n = 9) {
  let c = colorHex('white');
  let pal = [c];
  let [iw, ib] = [Math.floor(n / 2) - 1, Math.floor((n - 1) / 2) - 1];
  let [incw, incb] = [1 / (iw + 1), 1 / (ib + 1)];
  for (let i = 1; i < iw; i++) {
    let alpha = i * incw;
    pal.push(colorTrans(c, alpha));
  }
  pal.push('transparent');
  c = colorHex('black');
  for (let i = 1; i < ib; i++) {
    let alpha = i * incb;
    pal.push(colorTrans(c, alpha));
  }
  pal.push(c);

  return pal;
}
//#endregion


function calculateGoodColors(bg, fg) {
	let fgIsLight = isdef(fg) ? colorIdealText(fg) == 'black' : colorIdealText(bg) == 'white';
	let bgIsDark = colorIdealText(bg) == 'white';
	if (nundef(fg)) fg = colorIdealText(bg);
	let bgNav = bg;
	fg = colorToHex79(fg);
	if (fgIsLight) {
		if (isEmpty(U.bgImage)) { bgNav = '#00000040'; }
		else if (bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorDark(bg, 50), .8); }
	} else {
		if (isEmpty(U.bgImage)) { bgNav = '#ffffff40'; }
		else if (!bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorLight(bg, 50), .8); }
	}
	let t = U.bgImage;
	let realBg = bg;
	if (bgNav == realBg) bgNav = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let bgContrast = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let fgContrast = fgIsLight ? '#ffffff80' : '#00000080'; 
	return [realBg, bgContrast, bgNav, fg, fgContrast];
}
async function gameoverScore(table) {
	table.winners = getPlayersWithMaxScore(table);
	table.status = 'over';
	table.turn = [];
	let id = table.id;
	let name = getUname();
	let step = table.step;
	let stepIfValid = step + 1;
	let o = { id, name, step, stepIfValid, table };
	let res = await mPostRoute('table', o); //console.log(res);

}
function modifyStat(name,prop,val){
	//for this to work need to provide opts.id to playerStatCount!
	let id = `stat_${name}_${prop}`;
	console.log('id',id)
	let ui=mBy(id);
	console.log('ui',ui)
	if (isdef(ui)) ui.innerHTML = val;
}
function playerStatCount(key, n, dParent, styles = {}, opts = {}) {
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	let o = M.superdi[key];
	if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%', fg: 'grey' }, true);
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span ${isdef(opts.id)?`id='${opts.id}'`:''} style="font-weight:bold;color:inherit">${n}</span>`;
	return d;
}
function showValidMoves(table) {
	if (nundef(table.moves)) { console.log('no moves yet!'); return; }
	console.log('________', table.step)
	for (const m of table.moves) {
		console.log(`${m.step} ${m.name}: ${m.move.map(x => x.substring(0, 5)).join(',')} (${m.change})=>${m.score}`);
	}
}


function mByAttr(key, val) {
  // Build the attribute selector string
  const selector = val ? `[${key}="${val}"]` : `[${key}]`;

  // Use querySelectorAll to find matching elements
	let list = Array.from(document.querySelectorAll(selector));
	return (list.length == 1)? list[0]:list;
}
function mRadio(label, val, name, dParent, styles = {}, onchangeHandler, group_id, is_on) {
	let cursor = styles.cursor; delete styles.cursor;
	let d = mDiv(dParent, styles, group_id + '_' + val);
	let id = isdef(group_id) ? `i_${group_id}_${val}` : getUID();
	let type = isdef(group_id) ? 'radio' : 'checkbox';
	let checked = isdef(is_on) ? is_on : false;
	let inp = mCreateFrom(`<input class='radio' id='${id}' type="${type}" name="${name}" value="${val}">`);
	if (checked) inp.checked = true;
	let text = mCreateFrom(`<label for='${inp.id}'>${label}</label>`);
	if (isdef(cursor)) { inp.style.cursor = text.style.cursor = cursor; }
	mAppend(d, inp);
	mAppend(d, text);
	if (isdef(onchangeHandler)) {
		inp.onchange = ev => {
			ev.cancelBubble = true;
			if (onchangeHandler == 'toggle') {
			} else if (isdef(onchangeHandler)) {
				onchangeHandler(ev.target.checked,name,val);
			}
		};
	}
	return d;
}
function setPlayersToMulti() {
	for (const name in DA.allPlayers) {
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'human');
		updateUserImageToBotHuman(name,'human');
	}
	setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
	for (const name in DA.allPlayers) {
		if (name == getUname()) continue;
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'bot');
		updateUserImageToBotHuman(name,'bot');
	}
	let popup = mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode', 'bot');
}
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	//VALID TABLES SOLLEN NICHT UNBEDINGT DEN MOVE UNTERBRECHEN! es kann auch nur ein UI update sein!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game]; //showValidMoves(table);

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d); 
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); 
	
	func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function updateUserImageToBotHuman(playername,value){
	function doit(checked,name,val){
		let du=mByAttr('username',playername);
		//console.log('checked',checked,name,val,du); return;
		let img = du.getElementsByTagName('img')[0]; //du.firstChild;
		if (checked==true) if (val == 'human') mStyle(img,{round:true}); else mStyle(img,{rounding:2});
	}
	if (isdef(value)) doit(true,0,value); else return doit;
}

//#endregion

//#region integrate 18.mai 24 baui.js


//#region bau3, bau4

function isSameTableOpen(id){return T && T.id == id;}
async function onsockMerged(x) {
	if (!isSameTableOpen(x.id)) return;
	await showTable(x);
}
async function onsockTable(x) {
	let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];
	let menu = getMenu();
	let me = getUname();
	if (turn.includes(me) && menu == 'play') {Tid = id;await switchToMainMenu('table');}
	else if (menu == 'table') await showTable(id);
	else if (menu == 'play') await showTables();
}
async function onsockTables(x) { //passiert nur bei deleteTable!
	let menu = getMenu();
	if (menu == 'play') await showTables('onsockTables');
	else if (menu == 'table') {
		assertion(isdef(T),"menu table but no table!!!")
		let id = T.id;
		let exists = x.find(t => t.id == id);
		if (nundef(exists)) {Tid=T=null; await switchToMenu(UI.nav, 'play');}
	}
}
async function onsockPending(id) { 
	if (!isSameTableOpen(id)) return;
	await showTable(id);
}
async function sendMergeTable(o, cond = 'merge') {
	if (nundef(o)) {
		let table = Cliendata.table;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	} else if (nundef(o.name)) {
		let table = o;
		let name = getUname();
		let id = table.id;
		o = { name, id, table };
	}
	let table = await mPostRoute(`${cond}Table`, o);
	if (!isDict(table)) { console.log('from server', table); } //INVALID!!!
	else await showTable(table);
}
async function sendRaceError(table, name, errors = 1) {
	let data = {
		id: table.id,
		name,
		errors,
		olist: [
			{ keys: ['players', name, 'score'], val: table.players[name].score - errors },
			{ keys: ['players', name, 'errors'], val: valf(table.players[name].errors, 0) + errors }
		]
	}
	let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
	let step = table.step + 1;
	olist.push({ keys: ['step'], val: step });
	olist.push({ keys: ['players', name, 'score'], val: table.players[name].score + score });
	let data = { id: table.id, name, step, olist };
	let res = await sendMergeTable(data, 'race');
}

async function onclickTable(id) {
	Tid = id;
	await switchToMainMenu('table');
	//await showTable(id);
}
async function onclickTableMenu() {
	let id = getTid();
	if (nundef(id)){
		let me = getUname();
		let table = Serverdata.tables.find(x => x.status == 'started' && x.turn.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open' && x.playerNames.includes(me));
		if (nundef(table)) table = Serverdata.tables.find(x => x.status != 'open');
		if (isdef(table)) id=table.id;
	}
  //console.log('id',id)
	if (isdef(id)) {Tid=null;await showTable(id); } else await switchToMainMenu('play');
}
async function switchToMainMenu(name) { return await switchToMenu(UI.nav, name); }

async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	Menu = {key}; localStorage.setItem('menu',key);
	await menuOpen(menu, key);
}
async function switchToOtherUser() {
	let uname = await mGetRoute('otherUser', arguments);
	await switchToUser(uname);
}
async function switchToTables() { return await switchToMainMenu('play'); }

async function switchToUser(uname,menu) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	menu = valf(menu,getMenu(),localStorage.getItem('menu'),'home');
  switchToMainMenu(menu);
}



//#endregion


//#region showTables NEW
async function showTables(from) {
	await updateTestButtonsLogin();
	let me = getUname();
	let tables = Serverdata.tables = await mGetRoute('tables');
	tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
	sortBy(tables, 'prior');
	let dParent = mBy('dTableList');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
	tables.map(x => x.game_friendly = capitalize(getGameFriendly(x.game)));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = UI.tables = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'playerNames'], 'tables', false);
	mTableCommandify(t.rowitems.filter(ri => ri.o.status != 'open'), {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});
	mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });
	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		let id = ri.o.id;
		if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: getWaitingHtml(24) });
		if (ri.o.status == 'open') {
			let playerNames = ri.o.playerNames;
			if (playerNames.includes(me)) {
				if (ri.o.owner != me) {
					let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
				}
			} else {
				let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
			}
		}
		if (ri.o.owner != me) continue;
		let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
		if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }
	}
}
function showGames(ms = 500) {
	let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
	mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
	let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
	let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
	gamelist = ['button96']; //'button99','button98','button97','setgame']
	for (const gname of gamelist) {
		let g = getGameConfig(gname);
		let [sym, bg, color, id] = [M.superdi[g.logo], g.color, null, getUID()];
		let d1 = mDiv(d, { cursor: 'pointer', rounding: 10, margin: 10, padding: 0, patop: 10, w: 140, height: 100, bg: bg, position: 'relative' }, g.id);
		d1.setAttribute('gamename', gname);
		d1.onclick = onclickGameMenuItem;
		mCenterFlex(d1);
		let o = M.superdi[g.logo];
		let el = mDom(d1, { matop: 0, mabottom: 6, fz: 65, hline: 65, family: 'emoNoto', fg: 'white', display: 'inline-block' }, { html: o.text });
		mLinebreak(d1);
		mDiv(d1, { fz: 18, align: 'center' }, null, g.friendly);
	}
}

//#endregion

//#region game menu
function allPlToPlayer(name){
	let allPl = DA.allPlayers[name];
	return jsCopyExceptKeys(allPl,['div','isSelected']);
}
function collectPlayers() {
	let players = {};
	for (const name of DA.playerList) {		players[name] = allPlToPlayer(name);}
	return players;
}
function createGamePlayer(name, gamename, opts = {}) {
	let pl = userToPlayer(name, gamename);
	copyKeys(opts, pl);
	return pl;
}
function createOpenTable(gamename, players, options) {
	let me = getUname();
	let playerNames = [me];
	assertion(me in players, "_createOpenTable without owner!!!!!")
	for (const name in players) { addIf(playerNames, name); }

	let table = {
		status: 'open',
		id: generateTableId(),
		fen: null,
		game: gamename,
		owner: playerNames[0],
		friendly: generateTableName(),
		players,
		playerNames: playerNames,
		options
	};
	return table;
}
function highlightPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }

async function saveDataFromPlayerOptionsUI(gamename) {
	let id = 'dPlayerOptions';
	let lastAllPl = DA.lastAllPlayerItem;
	let dold = mBy(id);
	if (isdef(dold)) { await saveAndUpdatePlayerOptions(lastAllPl, gamename); dold.remove(); }
}
async function saveAndUpdatePlayerOptions(allPl, gamename) {
	let name = allPl.name;
	let poss = getGamePlayerOptionsAsDict(gamename);
	if (nundef(poss)) return;

	let opts = {};
	for (const p in poss) { allPl[p] = getRadioValue(p); if (p != 'playmode') opts[p] = allPl[p]; }

	let id = 'dPlayerOptions'; mRemoveIfExists(id); //dont need UI anymore

	let oldOpts = valf(getUserOptionsForGame(name, gamename), {});

	let changed = false;
	for (const p in poss) {
		if (p == 'playmode') continue;
		if (oldOpts[p] != opts[p]) { changed = true; break; }
	}

	if (changed) {
		let games = valf(Serverdata.users[name].games, {});
		games[gamename] = opts;
		await postUserChange({ name, games })
	}
}
async function setPlayerPlaying(allPlItem, gamename) {
	let [name, da] = [allPlItem.name, allPlItem.div];
	addIf(DA.playerList, name);
	highlightPlayerItem(allPlItem);

	await saveDataFromPlayerOptionsUI(gamename);

	let id = 'dPlayerOptions';
	DA.lastAllPlayerItem = allPlItem;

	let poss = getGamePlayerOptions(gamename);
	if (nundef(poss)) return;

	//console.log('item', allPlItem)

	let dParent = mBy('dGameMenu');
	let bg = getUserColor(name);
	let rounding = 6;
	let d1 = mDom(dParent, { bg: colorLight(bg, 50), border: `solid 2px ${bg}`, rounding, display: 'inline-block', hpadding: 3, rounding }, { id });
	mDom(d1, {}, { html: `${name}` }); //title
	d = mDom(d1, {}); mCenterFlex(d);
	mCenterCenter(d);
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(d, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, false); }
			let userval = lookup(DA.allPlayers, [name, p]);
			let chi = fs.children;
			for (const ch of chi) {
				let id = ch.id;
				if (nundef(id)) continue;
				let radioval = stringAfterLast(id, '_');
				if (isNumber(radioval)) radioval = Number(radioval);
				if (userval == radioval) ch.firstChild.checked = true;
				else if (nundef(userval) && `${radioval}` == arrLast(list)) ch.firstChild.checked = true;
			}
			measureFieldset(fs);
		}
	}
	let r = getRectInt(da, mBy('dGameMenu'));
	let rp = getRectInt(d1);
	let [y, w, h] = [r.y - rp.h - 4, rp.w, rp.h];
	let x = r.x - rp.w / 2 + r.w / 2;
	if (x < 0) x = r.x - 22;
	if (x > window.innerWidth - w - 100) x = r.x - w + r.w + 14;
	mIfNotRelative(dParent);
	mPos(d1, x, y);
	mButtonX(d1, ev => saveAndUpdatePlayerOptions(allPlItem, gamename), 18, 3, 'dimgray');
}
async function showGameOptions(dParent, gamename) {
	let poss = getGameOptions(gamename);
	if (nundef(poss)) return;
	for (const p in poss) {
		let key = p;
		let val = poss[p];
		if (isString(val)) {
			let list = val.split(',');
			let legend = formatLegend(key);
			let fs = mRadioGroup(dParent, {}, `d_${key}`, legend);
			for (const v of list) { mRadio(v, isNumber(v) ? Number(v) : v, key, fs, { cursor: 'pointer' }, null, key, true); }
			measureFieldset(fs);
		}
	}
	let inpsolo = mBy(`i_gamemode_solo`);//console.log('HALLO',inpsolo)
	let inpmulti = mBy(`i_gamemode_multi`);
	if (isdef(inpsolo)) inpsolo.onclick = setPlayersToSolo;
	if (isdef(inpmulti)) inpmulti.onclick = setPlayersToMulti;
}
async function showGamePlayers(dParent, users) {
	let me = getUname();
	mStyle(dParent, { wrap: true });
	let userlist = ['amanda', 'felix', 'mimi'];
	for (const name in users) addIf(userlist, name);
	for (const name of userlist) {
		let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
		let img = showUserImage(name, d, 40);
		let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
		d.setAttribute('username', name)
		d.onclick = onclickGameMenuPlayer;

		let item = userToPlayer(name, DA.gamename); item.div = d; item.isSelected = false;

		DA.allPlayers[name] = item;
	}
	await clickOnPlayer(me);
}
function userToPlayer(name, gamename, playmode = 'human') {
	//assumes Serverdata.users is up-to-date!!!
	let user = Serverdata.users[name];
	let pl = jsCopyExceptKeys(user, ['games']);
	let options = valf(getUserOptionsForGame(name, gamename), {});
	addKeys(options, pl);

	pl.playmode = playmode;

	//for all the player options in this game, if this user does not have the corresponding options,
	//copy the default value from game options	
	let poss = getGamePlayerOptions(gamename);
	//console.log('poss', poss);
	for (const p in poss) {
		if (isdef(pl[p])) continue;
		let val = poss[p];
		let defval = arrLast(val.split(','));
		if (isNumber(defval)) defval = Number(defval);
		pl[p] = defval;
		//console.log('default for',p,'is',defval);
	}
	return pl;
}


//#endregion

function amIHuman(table){  return isPlayerHuman(table,getUname());}
function calcHeightLeftUnder(div) {
  let hwin = window.innerHeight;
  let r = getRect(div);
  let top = r.b; //console.log('top',top)
  let h = hwin - top;
  return h;
}
function get_waiting_html(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function isPlayerHuman(table,name){return table.players[name].playmode != 'bot';}
function mFlexLine(d,startEndCenter='center'){mStyle(d,{display: 'flex','justify-content': startEndCenter,'align-items': 'center'});}
function mSwitch(dParent,styles={},opts={}) {
  addKeys({id:'dSwitch',val:''},opts);
  let inpid=`inp${opts.id}`
  let html = `
      <label class="switch">
        <input id='${inpid}' type="checkbox" ${opts.val}>
        <span class="slider round"></span>
      </label>
    `;
  opts.html=html
  let d=mDom(dParent,styles,opts);
  return {div:d,inp:mBy(inpid)};
}
async function onchangeBotSwitch(ev) {
  let elem = ev.target;
  assertion(T,"NO TABLE!!!!!!!!!!!!!!!")
  let name=getUname();
  let id = T.id;
  let playmode = (elem.checked) ? 'bot':'human';
  let olist = [{keys: ['players', name, 'playmode'], val: playmode}];
  let res=await mPostRoute(`olist`, {id,name,olist}); console.log(res)
}
async function resetUsers() {
  for (const name in Serverdata.users) {
    let uold = Serverdata.users[name];
    let unew = {};
    let list = ['name', 'key', 'color', 'bgImage', 'bgBlend', 'bgRepeat', 'bgSize'];
    for (const s of list) unew[s] = uold[s];
    //let unew = {name,color:uold.color,key:uold.key};
    await postUserChange(unew, true);
  }
  console.log(Serverdata.users);
}
//#endregion
async function ondropSaveUrl(url) {
	console.log('save dropped url to config:', url);
	Serverdata.config = mPostRoute('postConfig', { url: url });
}
app.post('/postConfig', (req, res) => {
	console.log('<== post config')
	let newConfig = req.body;
	let oldConfig = Session.config;
	Session.config = deepMerge(oldConfig, newConfig);
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	res.json(Session.config);
});





