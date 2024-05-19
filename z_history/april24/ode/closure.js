function _INTERRUPT() {
  clearEvents();
}
function addAREA(id, o) {
  if (AREAS[id]) {
    error('AREAS ' + id + ' exists already!!! ');
    error(o);
    return;
  }
  AREAS[id] = o;
}
function addDummy(dParent, place) {
  let b = mButton('', null, dParent, { opacity: 0, h: 0, w: 0, padding: 0, margin: 0, outline: 'none', border: 'none', bg: 'transparent' });
  if (isdef(place)) mPlace(b, place);
  b.id = 'dummy';
}
function addEditable(dParent, styles = {}, opts = {}) {
  addKeys({ tag: 'input', classes: 'plain' }, opts)
  addKeys({ wmax: '90%', box: true }, styles);
  let x = mDom(dParent, styles, opts);
  x.focus();
  x.addEventListener('keyup', ev => {
    if (ev.key == 'Enter') {
      mDummyFocus();
      if (isdef(opts.onEnter)) opts.onEnter(ev)
    }
  });
  return x;
}
function addIf(arr, el) { if (!arr.includes(el)) arr.push(el); }
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function addPeepToCrowd() {
  const peep = removeRandomFromArray(availablePeeps)
  const walk = getRandomFromArray(walks)({
    peep,
    props: resetPeep({
      peep,
      stage,
    })
  }).eventCallback('onComplete', () => {
    removePeepFromCrowd(peep)
    addPeepToCrowd()
  })
  peep.walk = walk
  crowd.push(peep)
  crowd.sort((a, b) => a.anchorY - b.anchorY)
  return peep
}
function addToolX(cropper, d) {
  let img = cropper.img;
  function createCropTool() {
    let rg = mRadioGroup(d, {}, 'rSizes', 'Select crop area: '); mClass(rg, 'input');
    let handler = cropper.setSize;
    mRadio('manual', [0, 0], 'rSizes', rg, {}, handler, 'rSizes', true)
    let [w, h] = [img.offsetWidth, img.offsetHeight];
    if (w >= 128 && h >= 128) mRadio('128 x 128 (emo)', [128, 128], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 200 && h >= 200) mRadio('200 x 200 (small)', [200, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 300 && h >= 300) mRadio('300 x 300 (medium)', [300, 300], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 400 && h >= 400) mRadio('400 x 400 (large)', [400, 400], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 500 && h >= 500) mRadio('500 x 500 (xlarge)', [500, 500], 'rSizes', rg, {}, handler, 'rSizes', false)
    if (w >= 140 && h >= 200) mRadio('140 x 200 (card)', [140, 200], 'rSizes', rg, {}, handler, 'rSizes', false)
    else {
      let [w1, h1] = [w, w / .7];
      let [w2, h2] = [h * .7, h];
      if (w1 < w2) mRadio(`${w1} x ${h1} (card)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
      else mRadio(`${w2} x ${h2} (card)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
    }
    if (w >= 200 && h >= 140) mRadio('200 x 140 (landscape)', [200, 140], 'rSizes', rg, {}, handler, 'rSizes', false)
    else {
      let [w1, h1] = [w, w * .7];
      let [w2, h2] = [h / .7, h];
      if (w1 < w2) mRadio(`${w1} x ${h1} (landscape)`, [w1, h1], 'rSizes', rg, {}, handler, 'rSizes', false)
      else mRadio(`${w2} x ${h2} (landscape)`, [w2, h2], 'rSizes', rg, {}, handler, 'rSizes', false)
    }
    mDom(rg, { fz: 14, margin: 12 }, { html: '(or use mouse to select)' });
    return rg;
  }
  function createSquareTool() {
    let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
    let handler = x => squareTo(cropper, x);
    mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
    for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
      mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
    }
    return rg;
  }
  let rgCrop = createCropTool();
  let rgResize = createSquareTool();
}
function adjustComplex(panData) {
  let [x0, y0] = [panData.posStart.x, panData.posStart.y];
  let [dx, dy] = [panData.mouse.x - panData.mouseStart.x, panData.mouse.y - panData.mouseStart.y];
  let [wImg, hImg] = [panData.img.width, panData.img.height];
  let ideal = panData.cropStartSize.w;
  let [cx0, cy0] = [panData.cropStartPos.l + ideal / 2, panData.cropStartPos.t + ideal / 2];
  let [cx, cy] = [cx0 + dx, cy0 + dy];
  cx = clamp(cx, ideal / 2, wImg - ideal / 2); cy = clamp(cy, ideal / 2, hImg - ideal / 2);
  let lNew = clamp(cx - ideal / 2, 0, wImg);
  let tNew = clamp(cy - ideal / 2, 0, hImg);
  let rNew = clamp(cx + ideal / 2, 0, wImg);
  let bNew = clamp(cy + ideal / 2, 0, hImg);
  let wNew = Math.min(Math.abs(cx - lNew) * 2, Math.abs(rNew - cx) * 2);
  let hNew = Math.min(Math.abs(cy - tNew) * 2, Math.abs(bNew - cy) * 2);
  mStyle(panData.dCrop, { left: cx - wNew / 2, top: cy - hNew / 2, w: wNew, h: hNew });
}
function adjustCropper(img, dc, sz) {
  let [w, h] = [img.width, img.height]; console.log('sz', w, h,)
  let [cx, cy, radx, rady, rad] = [w / 2, h / 2, sz / 2, sz / 2, sz / 2];
  mStyle(dc, { left: cx - radx, top: cy - rady, w: sz, h: sz });
}
function adjustCropperBy(dc, x, y, dx, dy, wImg, hImg, szIdeal) {
  console.log('_________\ndx', dx, 'dy', dy)
  if (nundef(wImg)) {
    mStyle(dc, { left: x + dx, top: y + dy }); //,w:sz,h:sz});
    return;
  }
  console.log('image sz', wImg, hImg)
  let [l, t, w, h] = [mGetStyle(dc, 'left'), mGetStyle(dc, 'top'), mGetStyle(dc, 'w'), mGetStyle(dc, 'h')]; console.log('dims', l, t, w, h);
  let [cx, cy] = [l + w / 2, t + h / 2];
  let [cxNew, cyNew] = [cx + dx, cy + dy]; console.log('new center', cxNew, cyNew)
  let newDist = Math.min(cxNew, cyNew, wImg - cxNew, hImg - cyNew); console.log('newDist', newDist)
  let wNew = Math.min(szIdeal, newDist * 2);
  let hNew = Math.min(szIdeal, newDist * 2);
  let xNew = cxNew - wNew / 2;
  let yNew = cyNew - hNew / 2;
  mStyle(dc, { left: xNew, top: yNew, w: wNew, h: hNew }); //,w:sz,h:sz});
}
function adjustCropperBySimple(dc, x, y, dx, dy) { mStyle(dc, { left: x + dx, top: y + dy }); }
function agColoredShape(g, shape, w, h, color) {
  SHAPEFUNCS[shape](g, w, h);
  gBg(g, color);
}
function allCondDict(d, func) {
  let res = [];
  for (const k in d) { if (func(d[k])) res.push(k); }
  return res;
}
function allNumbers(s) {
  let m = s.match(/\-.\d+|\-\d+|\.\d+|\d+\.\d+|\d+\b|\d+(?=\w)/g);
  if (m) return m.map(v => +v); else return null;
}
function alphaToHex(a01) {
  a01 = Math.round(a01 * 100) / 100;
  var alpha = Math.round(a01 * 255);
  var hex = (alpha + 0x10000).toString(16).slice(-2).toUpperCase();
  //var perc = Math.round(zero1 * 100);
  return hex;
}
function animate(elem, aniclass, timeoutms) {
  mClass(elem, aniclass);
  TOMan.TO.anim = setTimeout(() => mRemoveClass(elem, aniclass), timeoutms);
}
function annotate(sp) {
  for (const k in sp) {
    let node = sp[k];
    node.pool = [];
    let pool = makePool(node);
    for (const oid in pool) {
      let o = pool[oid];
      if (!evalCond(o, node)) continue;
      if (nundef(o.RSG)) o.RSG = {};
      let rsg = o.RSG;
      rsg[k] = true;
      node.pool.push(oid);
    }
  }
}
function arrAllSameOrDifferent(arr) {
  if (arr.length === 0) {
    return true;
  }
  const allSame = arr.every(element => element === arr[0]);
  if (allSame) {
    return true;
  }
  const uniqueElements = new Set(arr);
  const allDifferent = uniqueElements.size === arr.length;
  return allDifferent;
}
function arrAverage(arr, prop) {
  let n = arr.length; if (!n) return 0;
  let sum = arrSum(arr, prop);
  return sum / n;
}
function arrChildren(elem) { return [...toElem(elem).children]; }
function arrClear(arr) { arr.length = 0; return arr; }
function arrCycle(arr, count) { return arrRotate(arr, count); }
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrMax(arr, f) { return arrMinMax(arr, f).max; }
function arrMinMax(arr, func) {
  if (nundef(func)) func = x => x;
  else if (isString(func)) { let val = func; func = x => x[val]; }
  let min = func(arr[0]), max = func(arr[0]), imin = 0, imax = 0;
  for (let i = 1, len = arr.length; i < len; i++) {
    let v = func(arr[i]);
    if (v < min) {
      min = v; imin = i;
    } else if (v > max) {
      max = v; imax = i;
    }
  }
  return { min: min, imin: imin, max: max, imax: imax, elmin: arr[imin], elmax: arr[imax] };
}
function arrMinus(arr, b) { if (isList(b)) return arr.filter(x => !b.includes(x)); else return arr.filter(x => x != b); }
function arrRange(from = 1, to = 10, step = 1) { let res = []; for (let i = from; i <= to; i += step)res.push(i); return res; }
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
function arrRemovip(arr, el) {
  let i = arr.indexOf(el);
  if (i > -1) arr.splice(i, 1);
  return i;
}
function arrReplace1(arr, elweg, eldazu) {
  let i = arr.indexOf(elweg);
  arr[i] = eldazu;
  return arr;
}
function arrRotate(arr, count) {
  var unshift = Array.prototype.unshift,
    splice = Array.prototype.splice;
  var len = arr.length >>> 0, count = count >> 0;
  let arr1 = jsCopy(arr);
  unshift.apply(arr1, splice.call(arr1, count % len, len));
  return arr1;
}
function arrShuffle(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function arrSum(arr, props) {
  if (nundef(props)) return arr.reduce((a, b) => a + b);
  if (!isList(props)) props = [props];
  return arr.reduce((a, b) => a + (lookup(b, props) || 0), 0);
}
function arrTake(arr, n = 0, from = 0) {
  if (isDict(arr)) {
    let keys = Object.keys(arr);
    return n > 0 ? keys.slice(from, from + n).map(x => (arr[x])) : keys.slice(from).map(x => (arr[x]));
  } else return n > 0 ? arr.slice(from, from + n) : arr.slice(from);
}
function arrTakeFromTo(arr, a, b) { return takeFromTo(arr, a, b); }
function arrTakeWhile(arr, func) {
  let res = [];
  for (const a of arr) {
    if (func(a)) res.push(a); else break;
  }
  return res;
}
function arrWithout(arr, b) { return arrMinus(arr, b); }
function assertion(cond) {
  if (!cond) {
    let args = [...arguments];
    for (const a of args) {
      console.log('\n', a);
    }
    throw new Error('TERMINATING!!!')
  }
}
function bestContrastingColor(color, colorlist = ['white', 'black']) {
  let contrast = 0;
  let result = null;
  let rgb = colorRGB(color, true);
  rgb = [rgb.r, rgb.g, rgb.b];
  for (c1 of colorlist) {
    let x = colorRGB(c1, true)
    x = [x.r, x.g, x.b];
    let c = getContrast(rgb, x);
    if (c > contrast) { contrast = c; result = c1; }
  }
  return result;
}
function buyProgressCard(ev) {
  let o = evToAttrElem(ev, 'key');
  console.log('player buys', o.val);
  o.elem.remove();
  let spot = M.selectedCivSpot
  if (isdef(spot)) {
    spot.innerHTML = '';
    let [w, h] = [mGetStyle(spot, 'w'), mGetStyle(spot, 'h')];
    mAppend(spot, o.elem);
    mStyle(o.elem, { h: h, w: w });
    o.elem.onclick = () => selectCivSpot(spot)
    mClassRemove(M.selectedCivSpot, 'shadow');
    M.selectedCivSpot = null;
  }
}
function calcBotLevel(table) {
  let humanPlayers = dict2list(table.fen.players).filter(x => x.playmode == 'human');
  if (isEmpty(humanPlayers) || getGameOption('use_level') == 'no') return null;
  let level = arrAverage(humanPlayers, 'level');
  return level;
}
function calcBotSpeed(table) {
  let speed = 2000 + Math.round(Math.random() * 2000);
  let botLevel = calcBotLevel(table);
  return botLevel ? botLevel == 1 ? speed : speed * 4 / botLevel : speed;
}
function canAct() { return (aiActivated || uiActivated) && !auxOpen; }
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function cardRect(ctx, x, y, color) {
  let dark = '#635651';
  let light = '#D9C7BD';
  delta = 20;
  let ybar = y + 33;
  let o = findNextBar(ctx, x, x + 100, ybar, ybar + 20, color, 10);
  if (nundef(o)) o = findNextBar(ctx, x, x + 100, ybar, ybar + 20, color, 15);
  console.log('bar', o);
  let xnew = o.x;
  let o1 = findNextBar(ctx, xnew, xnew + 20, ybar, ybar + 20, dark, delta);
  if (nundef(o1)) o1 = findNextBar(ctx, xnew, xnew + 20, ybar, ybar + 20, dark, delta + 10);
  console.log('dark', o1)
  let xx = o1.x + 30;
  let o2 = findNextBar(ctx, xx, xx + 100, ybar, ybar + 20, color, delta);
  console.log('bar', o2)
  let xline = x + 33;
  let o3 = findNextLine(ctx, xline, xline + 20, y, y + 100, color)
  if (nundef(o3)) o3 = findNextLine(ctx, xline, xline + 20, y, y + 100, color, delta)
  console.log('line', o3)
  let ynew = o3.y;
  let o4 = findNextLine(ctx, xline, xline + 20, ynew, ynew + 20, dark, delta)
  if (nundef(o4)) o4 = findNextLine(ctx, xline, xline + 20, ynew, ynew + 20, dark, delta + 10)
  console.log('line', o4)
  ynew = o4.y + 80;
  let o5 = findNextLine(ctx, xline, xline + 20, ynew, ynew + 100, color)
  console.log('line', o5)
  return { x: o1.x, y: o4.y, w: o2.x - o1.x, h: o5.y - o4.y };
}
function cBlank(dParent, styles = {}, opts = {}) {
  if (nundef(styles.h)) styles.h = valf(styles.sz, 100);
  if (nundef(styles.w)) styles.w = styles.h * .7;
  if (nundef(styles.bg)) styles.bg = 'white';
  styles.position = 'relative';
  if (nundef(styles.rounding)) styles.rounding = Math.min(styles.w, styles.h) * .05;
  addKeys({ className: 'card' }, opts);
  let d = mDom(dParent, styles, opts);
  opts.type = 'card';
  addKeys(styles, opts);
  let item = mItem(d ? { div: d } : {}, opts);
  return item;
}
function checkInterrupt(items) {
  return isdef(T) && items[0] == T.items[0] && isdef(DA.Tprev) && T.items[0] == DA.Tprev.items[0];
}
function checkToInput(ev, inp, grid) {
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
  let names = checklist.filter(x => x.checked).map(x => x.name);
  sortCheckboxes(grid);
  names.sort();
  inp.value = names.join(', ') + ', ';
}
function choose(arr, n, excepti) { return rChoose(arr, n, null, excepti); }
function chooseRandom(arr) { return rChoose(arr); }
function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
function cLandscape(dParent, styles = {}, opts = {}) {
  if (nundef(styles.w)) styles.w = 100;
  if (nundef(styles.h)) styles.h = styles.w * .65;
  return cBlank(dParent, styles, opts);
}
function clearBodyDiv(styles = {}, opts = {}) { document.body.innerHTML = ''; return mDom(document.body, styles, opts) }
function clearBodyReset100(styles = {}, opts = {}) { 
  let body=document.body;
  body.setAttribute('style','');
  body.innerHTML = ''; 
  copyKeys({w:'100vw',h:'100vh',position:'relative'},styles)
  let d=mDom(document.body, styles, opts) 
  return d;
}
function clearCell(cell) { mClear(cell); mStyle(cell, { opacity: 0 }); }
function clearElement(elem) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (window.jQuery == undefined) { elem.innerHTML = ''; return elem; }
  while (elem.firstChild) {
    $(elem.firstChild).remove();
  }
  return elem;
}
function clearEvents() {
  for (const k in TO) { clearTimeout(TO[k]); TO[k] = null; }
  for (const k in ANIM) { if (isdef(ANIM[k])) ANIM[k].cancel(); ANIM[k] = null; }
}
function clearFleetingMessage() {
  if (isdef(dFleetingMessage)) {
    dFleetingMessage.remove();
    dFleetingMessage = null;
  }
}
function clearParent(ev) { mClear(ev.target.parentNode); }
function clearTimeouts() {
  onclick = null;
  clearTimeout(TOMain);
  clearTimeout(TOFleetingMessage);
  clearTimeout(TOTrial);
  if (isdef(TOList)) { for (const k in TOList) { TOList[k].map(x => clearTimeout(x)); } }
}
function clearZones() {
  for (const k in Zones) {
    clearElement(Zones[k].dData);
  }
}
async function clickFirstTable() {
  // let table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(getUname()));
  let table = Serverdata.tables.find(x => x.status != 'open' && x.playerNames.includes(getUname()));
  if (table) { await onclickTable(table.id); return Clientdata.table; }
}
function clickOnElemWithAttr(prop, val) {
  let d = document.querySelectorAll(`[${prop}="${val}"]`)[0];
  if (isdef(d)) d.click();
  return d;
}
async function clickOnGame(gamename) { await showGameMenu(gamename); }
async function clickOnItem(elem, key) {
  if (nundef(UI.selectedImages)) UI.selectedImages = [];
  let collname = elem.getAttribute('collname');
  let selist = UI.selectedImages;
  let selkey = collGenSelkey(key, collname);
  toggleSelectionOfPicture(elem, selkey, UI.selectedImages);
  if (isEmpty(selist)) { collDisableListCommands(); collDisableItemCommands(); }
  else if (selist.length == 1) { collEnableListCommands(); collEnableItemCommands(); }
  else { collDisableItemCommands(); collEnableListCommands(); }
}
async function clickOnPlayer(name) { return await showGameMenuPlayerDialog(name); }
function cloneIfNecessary(value, optionsArgument) {
  var clone = optionsArgument && optionsArgument.clone === true
  return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}
function closeApps() {
  if (isdef(DA.calendar)) { closePopup(); delete DA.calendar; }
  mClear('dMain');
  mClear(dTitle);
}
function closeLeftSidebar() { mClear('dLeft'); mStyle('dLeft', { w: 0, wmin: 0 }) }
function closePopup(name = 'dPopup') { if (isdef(mBy(name))) mBy(name).remove(); }
function cmdDisable(cmd) { mClass(iDiv(cmd), 'disabled') }
function cmdEnable(cmd) { mClassRemove(iDiv(cmd), 'disabled') }
function cNumber(ckey, styles = {}, opts = {}) {
  addKeys({ border: 'silver', h: 100 }, styles);
  addKeys({ backcolor: BLUE, ov: .3, key: ckey, type: 'num' }, opts);
  let c = cPortrait(null, styles, opts);
  let sym = c.rank = stringBefore(ckey, '_');
  let color = c.suit = c.val = stringAfter(ckey, '_');
  let sz = c.h;
  let [sm, lg, w, h] = [sz / 8, sz / 4, c.w, c.h];
  let styleSmall = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
  cPrintSym(c, sym, styleSmall, 'tl')
  cPrintSym(c, sym, styleSmall, 'tr')
  styleSmall.transform = 'rotate(180deg)';
  cPrintSym(c, sym, styleSmall, 'bl')
  cPrintSym(c, sym, styleSmall, 'br')
  let styleBig = { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }
  styleBig = { display: 'inline', family: 'algerian', fg: color, fz: lg, hline: lg }
  cPrintSym(c, sym, styleBig, 'cc')
  return c;
}
async function codebaseExtendFromProject(project) {
  let globlist = await codeParseFile('../basejs/allghuge.js');
  let funclist = await codeParseFile('../basejs/allfhuge.js');
  let list = globlist.concat(funclist);
  let bykey = list2dict(list, 'key');
  let bytype = {};
  for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }
  let htmlFile = `../${project}/index.html`;
  let html = await route_path_text(htmlFile);
  html = removeCommentLines(html, '<!--', '-->');
  let dirhtml = `../${project}`;
  let files = extractFilesFromHtml(html, htmlFile);
  files = files.filter(x => !x.includes('../all'));
  console.log('files', files)
  let [globtext, functext, functextold] = await codebaseFromFiles(files, bykey, bytype, list);
  return [globtext, functext, functextold];
}
async function codebaseFromFiles(files, bykey, bytype, list) {
  let olist = [];
  for (const path of files) {
    let opath = await codeParseFile(path);
    olist = olist.concat(opath);
  }
  let mytype = {}, mykey = {};
  for (const o of olist) { mykey[o.key] = o; }
  for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }
  let dupltext = '';
  for (const k in mykey) {
    let onew = mykey[k];
    let oold = bykey[k];
    if (isdef(oold) && onew.code == oold.code) {
      console.log('override w/ SAME code', k);
    } else if (isdef(oold)) {
      console.log('override w/ DIFFERENT code', k);
      oold.oldcode = oold.code;
      oold.code = onew.code;
      dupltext += oold.oldcode + '\n' + oold.code + '\n';
    } else {
      bykey[k] = onew;
      lookupAddIfToList(bytype, [onew.type], onew);
      list.push(onew);
    }
  }
  let globtext = '', functext = '', functextold = '';
  for (const type of ['const', 'var', 'class']) {
    if (nundef(bytype[type])) continue;
    for (const o of bytype[type]) { if (!isEmptyOrWhiteSpace(o.code)) globtext += o.code + '\n'; }
  }
  let sortedFuncKeys = sortCaseInsensitive(bytype.function.map(x => x.key)).filter(x => !['step', 'Number'].includes(x));
  sortedFuncKeys.map(x => functext += isEmptyOrWhiteSpace(bykey[x].code) ? '' : (bykey[x].code + '\n'));
  sortedFuncKeys.map(x => functextold += (isdef(bykey[x].oldcode) ? bykey[x].oldcode : bykey[x].code) + '\n');
  return [globtext, functext, functextold]
}
function codeParseBlock(lines, i) {
  let l = lines[i];
  let type = l[0] == 'a' ? ithWord(l, 1) : ithWord(l, 0);
  let key = l[0] == 'a' ? ithWord(l, 2, true) : ithWord(l, 1, true);
  let code = l + '\n'; i++; l = lines[i];
  while (i < lines.length && !(['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x)) && !l.startsWith('}'))) {
    if (!(l.trim().startsWith('//') || isEmptyOrWhiteSpace(l))) code += l + '\n';
    i++; l = lines[i];
  }
  code = replaceAllSpecialChars(code, '\t', '  ');
  code = code.trim();
  return [{ key: key, type: type, code: code }, i];
}
function codeParseBlocks(text) {
  let lines = text.split('\r\n');
  lines = lines.map(x => removeTrailingComments(x));
  let i = 0, o = null, res = [];
  while (i < lines.length) {
    let l = lines[i];
    if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
      [o, iLineAfterBlock] = codeParseBlock(lines, i);
      i = iLineAfterBlock;
      res.push(o)
    } else i++;
  }
  return res;
}
async function codeParseFile(path) {
  let text = await route_path_text(path);
  let olist = codeParseBlocks(text);
  return olist;
}
function coin(percent = 50) { return Math.random() * 100 < percent; }
async function collAddItem(coll, key, item) {
  if (nundef(M.superdi[key])) {
    M.superdi[key] = item;
    let res = await mPostRoute('postNewItem', { key: key, item: item });
  } else {
    addIf(item.colls, coll.name);
    let res = await mPostRoute('postUpdateItem', { key: key, item: item });
  }
  for (const cat of item.cats) lookupAddIfToList(M.byCat, [cat], key);
  for (const coll of item.colls) lookupAddIfToList(M.byCollection, [coll], key);
  lookupAddIfToList(M.byFriendly, [item.friendly], key)
  M.categories = Object.keys(M.byCat); M.categories.sort();
  M.collections = Object.keys(M.byCollection); M.collections.sort();
  M.names = Object.keys(M.byFriendly); M.names.sort();
}
function collCancelEditing(d) { d.remove(); }
function collClear() { closeLeftSidebar(); clearMain(); }
function collClearSelections() {
  let arr = Array.from(document.getElementsByClassName('framedPicture'));//find all visible uis for selected images
  arr.forEach(collUnselect);
  UI.selectedImages = [];
  collDisableListCommands();
  collDisableItemCommands();
}
function collClosePrimary() { let d = iDiv(UI.collPrimary); mClear(d); UI.collPrimary.isOpen = false; }
function collCloseSecondary() {
  let d = iDiv(UI.collSecondary);
  mClear(d);
  mStyle(d, { w: 0, wmin: 0, border: 'transparent' });
  UI.collSecondary.isOpen = false;
  cmdEnable(UI.asSecondary);
}
async function collDelete(collname) {
  if (collLocked(collname) || !collExists(collname)) return;
  let keys = M.byCollection[collname];
  collPreReload(collname);
  let di = {}, deletedKeys = [];
  for (const k of keys) {
    await collDeleteOrRemove(k, collname, di, deletedKeys);
  }
  let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys, collname, deletedCollection: true });
  await loadAssets();
  collPostReload();
}
async function collDeleteOrRemove(k, collname, di, deletedKeys) {
  let item = M.superdi[k];
  let colls = item.colls;
  assertion(colls.includes(collname), `item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
  if (colls.length == 1) {
    console.log('deleting', k, '!!!!!!!!!!!!');
    deletedKeys.push(k);
  } else if (isdef(item.img) && item.img.includes(`/${collname}/`)) {
    removeInPlace(item.colls, collname);
    let olddir = collname;
    let newdir = item.colls[0];
    let filename = stringAfterLast(item.img, '/');
    item.img = item.img.replace(olddir, newdir);
    let resp = await mPostRoute('moveImage', { olddir, newdir, filename });
    if (isdef(resp.newpath)) item.img = resp.newpath;
    console.log('moveImage:', resp)
    di[k] = item;
  } else {
    removeInPlace(item.colls, collname);
    di[k] = item;
  }
}
function collDisableItemCommands() {
  for (const cmd of [UI.asAvatar, UI.editCollItem]) {
    if (nundef(cmd)) continue;
    cmdDisable(cmd);
  }
}
function collDisableListCommands() {
  for (const cmd of [UI.collClearSelections, UI.deleteSelected, UI.addSelected, UI.removeSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
    if (nundef(cmd)) continue;
    cmdDisable(cmd);
  }
}
function collectCats(klist) {
  let cats = [];
  for (const k of klist) {
    M.superdi[k].cats.map(x => addIf(cats, x));
  }
  return cats;
}
async function collectFromPrevious(gamename) {
  let id = 'dPlayerOptions';
  let lastpl = DA.lastPlayerItem;
  let dold = mBy(id);
  if (isdef(dold)) { await collectPlayerOptions(lastpl, gamename); dold.remove(); }
}
function collectOptions() {
  let poss = Serverdata.config.games[DA.gamename].options;
  let options = DA.options = {};
  if (nundef(poss)) return options;
  for (const p in poss) {
    let fs = mBy(`d_${p}`);
    let val = getCheckedRadios(fs)[0];
    options[p] = isNumber(val) ? Number(val) : val;
  }
  return options;
}
async function collectPlayerOptions(pl, gamename) {
  let name = pl.name;
  let options = valf(pl[gamename], {});
  let poss = Serverdata.config.games[gamename].ploptions;
  if (nundef(poss)) return options;
  for (const p in poss) {
    options[p] = getRadioValue(p);
  }
  pl[gamename] = options;
  let id = 'dPlayerOptions'; mRemoveIfExists(id);//mRemove(d);
  let uold = Serverdata.users[pl.name];
  let unew = {};
  for (const k in pl) {
    if (['div', 'isSelected', 'playmode'].includes(k)) continue;
    unew[k] = jsCopy(pl[k]);
  }
  for (const k in unew[gamename]) {
    if (lookup(uold, [gamename, k]) != unew[gamename][k]) {
      let res = await postUserChange(unew);
      copyKeys(res, DA.allPlayers[name]);
      return;
    }
  }
}
function collectPlayers() {
  let players = {};
  if (isList(DA.playerList)) {
    for (const name of DA.playerList) {
      players[name] = DA.allPlayers[name];
    }
  }
  if (TESTING == 'felixAmanda') {
    if (nundef(players.felix)) players.felix = createGamePlayer('felix', DA.gamename)
    if (nundef(players.amanda)) players.amanda = createGamePlayer('amanda', DA.gamename)
  }
  return players;
}
function collEnableItemCommands() {
  for (const cmd of [UI.asAvatar, UI.editCollItem]) {
    if (nundef(cmd)) continue;
    cmdEnable(cmd);
  }
}
function collEnableListCommands() {
  for (const cmd of [UI.collClearSelections, UI.addSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
    if (nundef(cmd)) continue;
    cmdEnable(cmd);
  }
  let selist = UI.selectedImages;
  let colls = selist.filter(x => !collLocked(stringAfter(x, '@')));
  if (isEmpty(colls)) return;
  for (const cmd of [UI.deleteSelected, UI.removeSelected,]) {
    if (nundef(cmd)) continue;
    cmdEnable(cmd);
  }
}
function collExists(collname) { return isdef(M.byCollection[collname]); }
function collFilterImages(coll, s) {
  let di = {};
  for (const k of coll.masterKeys) { di[k] = true; }
  let list = isEmpty(s) ? Object.keys(di) : isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
  if (nundef(list) || isEmpty(list)) {
    list = [];
    for (const k of coll.masterKeys) {
      let o = M.superdi[k];
      if (k.includes(s) || o.friendly.toLowerCase().includes(s)) list.push(k);
    }
  }
  return list;
}
function collFindEmptyCell(coll) {
  let cell = coll.cells.find(x => mGetStyle(x, 'opacity') == 0);
  if (nundef(cell)) {
    coll.index++;
    coll.cells.map(x => { mClear(x); mStyle(x, { opacity: 0 }); });
    cell = coll.cells[0];
  }
  return cell;
}
async function collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll) {
  let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); //console.log('dims', dims);
  let wScale = img.width / wOrig;
  let hScale = img.height / hOrig;
  let d1 = mDom(document.body, { margin: 10 });
  let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
  const dataUrl = canvas.toDataURL('image/png'); //davon jetzt die dataUrl!
  if (isEmpty(inpFriendly.value)) inpFriendly.value = 'pic'
  let friendly = inpFriendly.value;
  let cats = extractWords(valf(inpCats.value, ''));
  let filename = (isdef(M.superdi[friendly]) ? 'i' + get_timestamp() : friendly) + '.png'; //console.log('filename', filename);
  let o = { image: dataUrl, coll: coll.name, path: filename };
  let resp = await mPostRoute('postImage', o); //console.log('resp', resp); //sollte path enthalten!
  let key = stringBefore(filename, '.');
  let imgPath = `../assets/img/${coll.name}/${filename}`;
  let item = { key: key, friendly: friendly, img: imgPath, cats: cats, colls: [coll.name] };
  dPopup.remove();
  await collOnDroppedItem(item, coll);
}
function collFromElement(elem) {
  let id = findAttributeInAncestors(elem, 'id'); //console.log('ancestor is',id);//find Ancestor with id collPrimary or collSecondary
  let coll = id == 'collPrimary' ? UI.collPrimary : id == 'collSecondary' ? UI.collSecondary : null;
  return coll;
}
function collGenSelkey(key, collname) { return `${key}@${collname}`; }
function collInitCollection(name, coll) {
  let isReload = isdef(coll.index) && coll.name == name;
  if (!isReload) {
    coll.index = 0; coll.pageIndex = 1; coll.name = name; coll.filter = null;
  }
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else list = [];
  if (coll == UI.collPrimary) localStorage.setItem('collection', name)
  let dMenu = coll.dMenu;
  mClear(dMenu);
  let d = mDom(dMenu); mFlexV(d);
  mDom(d, { fz: 24, weight: 'bold' }, { html: 'Collection:' });
  let colls = M.collections;
  let dlColl = mDatalist(d, colls, { placeholder: "<select from list>" });
  dlColl.inpElem.oninput = ev => collInitCollection(ev.target.value, coll);
  dlColl.inpElem.value = name;
  list = sortByFunc(list, x => M.superdi[x].friendly);
  coll.masterKeys = list;
  coll.keys = coll.filter ? collFilterImages(coll, coll.filter) : list;
  let cats = collectCats(coll.keys);
  cats.sort();
  d = mDom(dMenu); mFlexV(d);
  let wLabel = coll.cols < 6 ? 117 : 'auto';
  mDom(d, { fz: 24, weight: 'bold', w: wLabel, align: 'right' }, { edit: true, html: 'Filter:' });
  let dlCat = mDatalist(d, cats, { edit: false, placeholder: "<enter value>", value: coll.filter });
  dlCat.inpElem.oninput = oninputCollFilter;
  d = mDom(dMenu, { gap: 10, align: 'right' });
  if (coll.cols < 6) mStyle(d, { w100: true });
  if (coll == UI.collSecondary) mButton('done', onclickCollDone, d, { w: 70, margin: 0, maleft: 10 }, 'input');
  mButton('prev', onclickCollPrev, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bPrev');
  mButton('next', onclickCollNext, d, { w: 70, margin: 0, maleft: 10 }, 'input', 'bNext');
  collClearSelections();
  showImageBatch(coll);
}
function collKeyCollnameFromElem(elem) { return { key: elem.getAttribute('key'), collname: elem.getAttribute('collname') }; }
function collKeyCollnameFromSelkey(selkey) { return { key: stringBefore(selkey, '@'), collname: stringAfter(selkey, '@') }; }
function collLocked(collname) {
  if (getUname() != '____unsafe' && ['all', 'amanda', 'animals', 'big', 'emo', 'fa6', 'icon', 'nations', 'users'].includes(collname)) {
    return true;
  }
  return false;
}
async function collOnDropImage(url, dDrop) {
  let item = UI.draggedItem;
  UI.draggedItem = null;
  let coll = UI.collSecondary;
  if (isdef(item)) return await collOnDroppedItem(item, coll);
  else return await collOnDroppedUrl(url, coll);
}
async function collOnDroppedItem(item, coll) {
  assertion(isdef(item.key), 'NO KEY!!!!!');
  await collAddItem(coll, item.key, item);
  collOpenSecondary(4, 3);
  showImageBatch(coll, -1);
}
async function collOnDroppedUrl(url, coll) {
  let m = await imgMeasure(url); console.log('sz', m);
  let dPopup = mDom(document.body, { position: 'fixed', top: 0, left: 0, wmin: 400, hmin: 400, bg: 'pink' });
  let [img, wOrig, hOrig, sz] = [m.img, m.w, m.h, 300];
  let d = mDom(dPopup, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
  mIfNotRelative(d);
  mStyle(img, { h: sz });
  mAppend(d, img);
  let [w0, h0] = [img.width, img.height];
  let dc = mDom(d, { position: 'absolute', left: (w0 - sz) / 2, top: (h0 - sz) / 2, w: sz, h: sz, box: true, border: 'red', cursor: 'grab' });
  dc.onmousedown = startPanning;
  let db1 = mDom(dPopup, { bg: 'red', padding: 10, display: 'flex', gap: 10, 'justify-content': 'center' });
  mButton('restart', () => imgReset(img, dc, sz, w0, h0), db1, { w: 70 }, 'input');
  mButton('squish', () => imgSquish(img, dc, sz), db1, { w: 70 }, 'input');
  mButton('expand', () => imgExpand(img, dc, sz), db1, { w: 70 }, 'input');
  let dinp = mDom(dPopup, { padding: 10, align: 'right', display: 'inline-block' })
  mDom(dinp, { display: 'inline-block' }, { html: 'Name: ' });
  let inpFriendly = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'friendly', tag: 'input', type: 'text', placeholder: `<enter name>` });
  let defaultName = '';
  let iDefault = 1;
  let k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`);
  while (isdef(k)) { iDefault++; k = coll.masterKeys.find(x => x == `${coll.name}${iDefault}`); }
  defaultName = `${coll.name}${iDefault}`;
  inpFriendly.value = defaultName;
  mDom(dinp, { h: 1 });
  mDom(dinp, { display: 'inline-block' }, { html: 'Categories: ' })
  let inpCats = mDom(dinp, { outline: 'none', w: 200 }, { className: 'input', name: 'cats', tag: 'input', type: 'text', placeholder: `<enter categories>` });
  let db2 = mDom(dPopup, { padding: 10, display: 'flex', gap: 10, 'justify-content': 'end' });
  mButton('cancel', () => collCancelEditing(dPopup), db2, { w: 70 }, 'input');
  mButton('OK', () => collFinishEditing(img, dc, wOrig, hOrig, dPopup, inpFriendly, inpCats, coll), db2, { w: 70 }, 'input');
}
function collOpenPrimary(rows, cols) { collPresent(UI.collPrimary, rows, cols); UI.collPrimary.isOpen = true; }
function collOpenSecondary(rows, cols) {
  let coll = UI.collSecondary;
  let d = iDiv(coll);
  mStyle(d, { wmin: 450, border: 'white' });
  collPresent(coll, rows, cols);
  coll.isOpen = true;
  coll.dInstruction.innerHTML = '* drag images into the shaded area *'
  let grid = coll.grid;
  mStyle(grid, { bg: '#00000030' })
  enableImageOrItemDrop(grid, collOnDropImage);
  cmdDisable(UI.asSecondary);
}
function collPostReload() {
  if (UI.collPrimary.isOpen) { collInitCollection(UI.collPrimary.name, UI.collPrimary); }
  if (UI.collSecondary.isOpen) { collInitCollection(UI.collSecondary.name, UI.collSecondary); }
  collClearSelections();
}
function collPreReload(name) { if (name == UI.collSecondary.name) { collCloseSecondary(); UI.collSecondary.name = null; } }
function collPresent(coll, rows, cols) {
  let d1 = iDiv(coll);
  if (nundef(rows)) rows = coll.rows;
  if (nundef(cols)) cols = coll.cols;
  mClear(d1);
  let w = coll.w = 140 * cols;
  mStyle(d1, { wmax: w, w: w })
  let dMenu = coll.dMenu = mDom(d1, { padding: 12, wmax: w, w: w }, { className: 'title' });
  mFlexVWrap(dMenu);
  mStyle(dMenu, { gap: 10 });
  let fg = getThemeFg();
  let dInstruction = coll.dInstruction = mDom(d1, { align: 'center', fg: fg }, { html: '* press Control key when hovering to magnify image! *' })
  coll.rows = rows; coll.cols = cols;
  coll.grid = mGrid(coll.rows, coll.cols, d1, { maleft: 10, 'align-self': 'start' });
  coll.cells = [];
  let bg = getNavBg();
  for (let i = 0; i < coll.rows * coll.cols; i++) {
    let d = mDom(coll.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    coll.cells.push(d);
  }
  mStyle(dInstruction, { w: mGetStyle(coll.grid, 'w') });
  coll.dPageIndex = mDom(d1, { fg: fg, padding: 10, align: 'right' });
  collInitCollection(coll.name, coll);
}
async function collRename(oldname, newname) {
  if (collLocked(oldname) || !collExists(oldname) || !isAlphanumeric(newname)) {
    showMessage(`Cannot rename collection ${oldname} to ${newname}`);
    return;
  }
  console.log('rename collection', oldname, 'to', newname)
  collPreReload(oldname);
  let needToRenameDir = false;
  let di = {};
  for (const k of M.byCollection[oldname]) {
    let item = M.superdi[k];
    let path = item.img;
    if (isString(path) && path.includes(`img/${oldname}/`)) {
      item.img = `../assets/img/${newname}/${stringAfterLast(path, '/')}`;
      needToRenameDir = true;
    }
    removeInPlace(item.colls, oldname)
    item.colls.push(newname);
    di[k] = item;
  }
  if (needToRenameDir) {
    let resp = await mPostRoute('renameImgDir', { oldname, newname });
    console.log('response from server', resp)
  }
  let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] }); console.log('response from server', res)
  await loadAssets();
  if (UI.collPrimary.name == oldname) UI.collPrimary.name = newname;
  if (UI.collSecondary.name == oldname) UI.collSecondary.name = newname;
  collPostReload();
}
function collSelect(elem) { mClass(elem, 'framedPicture'); }
async function collShowImageInCell(cell, src) {
  mStyle(cell, { opacity: 1 });
  mClass(cell, 'magnifiable');
  let img = mDom(cell, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img' });
  await loadImageAsync(src, img);
  return img;
}
function collSidebar() {
  let wmin = 170;
  mStyle('dLeft', { wmin: wmin, });
  let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
  let gap = 5;
  UI.collSelectAll = mCommand(d, 'collSelectAll', 'Select All'); mNewline(d, gap);
  UI.collSelectPage = mCommand(d, 'collSelectPage', 'Select Page'); mNewline(d, gap);
  UI.collClearSelections = mCommand(d, 'collClearSelections', 'Clear Selection'); mNewline(d, gap);
  UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
  UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
  UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
  UI.addSelected = mCommand(d, 'addSelected', 'Add Selected'); mNewline(d, gap);
  UI.removeSelected = mCommand(d, 'removeSelected', 'Remove Selected'); mNewline(d, gap);
  UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
  collDisableListCommands();
  UI.newCollection = mCommand(d, 'newCollection', 'New Collection'); mNewline(d, gap);
  UI.asSecondary = mCommand(d, 'asSecondary', 'Open DragDrop'); mNewline(d, gap);
  UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
  UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
  UI.asAvatar = mCommand(d, 'asAvatar', 'Set Avatar'); mNewline(d, gap);
}
function collUnselect(elem) { mClassRemove(elem, 'framedPicture'); }
function conslog(s) { console.log(s, window[s]) }
function contains(s, sSub) { return s.toLowerCase().includes(sSub.toLowerCase()); }
function copyKeys(ofrom, oto, except = {}, only = null) {
  let keys = isdef(only) ? only : Object.keys(ofrom);
  for (const k of keys) {
    if (isdef(except[k])) continue;
    oto[k] = ofrom[k];
  }
  return oto;
}
function correctFuncName(specType) {
  switch (specType) {
    case 'list': specType = 'liste'; break;
    case 'dict': specType = 'dicti'; break;
    case undefined: specType = 'panel'; break;
  }
  return specType;
}
function cPortrait(dParent, styles = {}, opts = {}) {
  if (nundef(styles.h)) styles.h = 100;
  if (nundef(styles.w)) styles.w = styles.h * .7;
  return cBlank(dParent, styles, opts);
}
function cPrintSym(card, sym, styles, pos) {
  let d = iDiv(card);
  let opts = {};
  if (isNumber(sym)) {
    opts.html = sym;
  } else if (sym.includes('/')) {
    opts.tag = 'img';
    opts.src = sym;
  }
  let d1 = mDom(d, styles, opts);
  mPlace(d1, pos, pos[0] == 'c' ? 0 : 2, pos[1] == 'c' ? 0 : 2);
}
function createConfirmationModal(dParent, question) {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  const questionText = document.createElement("p");
  questionText.textContent = question;
  modalContent.appendChild(questionText);
  const yesButton = document.createElement("button");
  yesButton.textContent = "Yes";
  yesButton.addEventListener("click", () => {
    modal.style.display = "none"; // Close the modal
  });
  modalContent.appendChild(yesButton);
  const noButton = document.createElement("button");
  noButton.textContent = "No";
  noButton.addEventListener("click", () => {
    modal.style.display = "none"; // Close the modal
  });
  modalContent.appendChild(noButton);
  modal.appendChild(modalContent);
  dParent.appendChild(modal);
}
function createGamePlayer(name, gamename, opts = {}) {
  let pl = jsCopy(Serverdata.users[name]);
  let plopts = valf(pl[gamename], {}); delete pl[gamename];
  copyKeys(opts, plopts);
  let defopts = Serverdata.config.games[gamename].ploptions;
  for (const k in defopts) {
    let val = plopts[k];
    if (nundef(val)) {
      let vals = defopts[k].split(',').map(x => x.trim());
      val = arrLast(vals);
      if (isNumeric(val)) val = Number(val);
      plopts[k] = val;
    }
  }
  copyKeys(plopts, pl);
  return pl;
}
function createInteractiveCanvas(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 300 / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      let isDragging = false;
      let rect = { x: 100, y: 100, width: 50, height: 50 }; // Initial rectangle properties
      let dragOffsetX, dragOffsetY;
      function isMouseInRect(x, y) {
        return x > rect.x && x < rect.x + rect.width && y > rect.y && y < rect.y + rect.height;
      }
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
        ctx.fillStyle = 'red';
        ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
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
          draw();
        }
      });
      canvas.addEventListener('mouseup', () => {
        isDragging = false;
      });
      draw();
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
function createOpenTable(gamename, players, options) {
  let me = getUname();
  let playerNames = [me];
  assertion(me in players, "createOpenTable without owner!!!!!")
  for (const name in players) { addIf(playerNames, name); }
  let pdict = {};
  for (const name of playerNames) {
    let o = {};
    let pl = players[name];
    for (const k in pl) {
      if (k == gamename) { addKeys(pl[gamename], o); }
      else if (!['div', 'isSelected'].includes(k)) o[k] = pl[k];
    }
    if (TESTING && gamename == 'setgame') {
      let keys = ['playmode', 'score', 'level', 'name', 'color', 'key'];
      let osorted = {};
      for (const k of keys) { osorted[k] = o[k]; }
      pdict[name] = osorted;
    } else pdict[name] = o;
  }
  assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);
  let t = {
    status: 'open',
    id: generateTableId(),
    fen: null,
    game: gamename,
    owner: playerNames[0],
    friendly: generateTableName(),
    players: pdict,
    playerNames: playerNames,
    options
  };
  return t;
}
function createScaledCanvasFromImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 300 / Math.min(img.width, img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const canvas = document.createElement('canvas');
      canvas.width = scaledWidth;
      canvas.height = scaledHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      resolve(canvas);
    };
    img.onerror = reject;
    img.src = src;
  });
}
async function cropOrExpandImageAndGetDataUrl(imageSrc, x, y) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 300;
      canvas.height = 300;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;
      const dx = isdef(x) ? x * scale : (canvas.width - scaledWidth) / 2;
      const dy = isdef(y) ? y * scale : (canvas.height - scaledHeight) / 2;
      ctx.drawImage(img, dx, dy, scaledWidth, scaledHeight);
      const dataUrl = canvas.toDataURL();
      resolve(dataUrl);
    };
    img.onerror = (error) => reject(error);
    img.src = imageSrc;
  });
}
function cropTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  let xnew = x + (wnew - w) / 2;
  let ynew = y + (hnew - h) / 2;
  redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function cRound(dParent, styles = {}, opts = {}) {
  styles.w = valf(styles.w, 100);
  styles.h = valf(styles.h, 100);
  styles.rounding = '50%';
  return cBlank(dParent, styles, opts);
}
function deckDeal(deck, n) { return deck.splice(0, n); }
function deepmerge(target, source, optionsArgument) {
  var array = Array.isArray(source);
  var options = optionsArgument || { arrayMerge: defaultArrayMerge }
  var arrayMerge = options.arrayMerge || defaultArrayMerge
  if (array) {
    return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
  } else {
    return mergeObject(target, source, optionsArgument)
  }
}
function deepMerge(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return mergeArrays(target, source);
  } else if (isObject(target) && isObject(source)) {
    const output = Object.assign({}, target);
    Object.keys(source).forEach(key => {
      if (isObject(source[key]) || Array.isArray(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
    return output;
  }
  return source;
}
function deepMergeConcatLists(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  } else if (isObject(target) && isObject(source)) {
    const output = Object.assign({}, target);
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMergeConcatLists(target[key], source[key]);
        }
      } else if (Array.isArray(source[key])) {
        output[key] = target[key] ? deepMergeConcatLists(target[key], source[key]) : source[key];
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
    return output;
  }
  return source;
}
function deepMergeIndex(target, source) {
  if (typeof target !== 'object' || typeof source !== 'object') {
    throw new Error('Both arguments must be objects');
  }
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (target.hasOwnProperty(key)) {
        if (typeof target[key] === 'object' && typeof source[key] === 'object') {
          target[key] = deepMergeIndex(target[key], source[key]);
        } else {
          target[key] = source[key];
        }
      } else {
        target[key] = source[key];
      }
    }
  }
  return target;
}
function deepmergeOverride(base, drueber) { return mergeOverrideArrays(base, drueber); }
function deepMergeOverrideLists(target, source) {
  let output = Object.assign({}, source);
  if (isObject(source) && isObject(target)) {
    Object.keys(target).forEach(key => {
      if (isObject(target[key])) {
        if (!(key in source))
          Object.assign(output, { [key]: target[key] });
        else
          output[key] = deepMergeOverrideLists(source[key], target[key]);
      } else {
        Object.assign(output, { [key]: target[key] });
      }
    });
  }
  return output;
}
function defaultArrayMerge(target, source, optionsArgument) {
  var destination = target.slice()
  source.forEach(function (e, i) {
    if (typeof destination[i] === 'undefined') {
      destination[i] = cloneIfNecessary(e, optionsArgument)
    } else if (isMergeableObject(e)) {
      destination[i] = deepmerge(target[i], e, optionsArgument)
    } else if (target.indexOf(e) === -1) {
      destination.push(cloneIfNecessary(e, optionsArgument))
    }
  })
  return destination
}
async function deleteEvent(id) {
  let result = await simpleUpload('postEvent', { id });
  delete Items[id];
  mBy(id).remove();
}
function deleteKeyFromLocalSuperdi(k) {
  delete M.superdi[k];
  let fri = item.friendly;
  let lst = M.byFriendly[fri];
  removeInPlace(lst, k); if (isEmpty(lst)) { delete M.byFriendly[fri]; removeInPlace(M.names, fri); }
  for (const cat of item.cats) {
    let lst = M.byCat[cat];
    removeInPlace(lst, k); if (isEmpty(lst)) { delete M.byCat[cat]; removeInPlace(M.categories, cat); }
  }
}
function detectSessionType() {
  let loc = window.location.href;
  DA.sessionType =
    loc.includes('vidulus') ? 'vps' :
      loc.includes('telecave') ? 'telecave' : loc.includes('8080') ? 'php'
        : loc.includes(':40') ? 'nodejs'
          : loc.includes(':60') ? 'flask' : 'live';
  return DA.sessionType;
}
function dict2list(d, keyName = 'id') {
  let res = [];
  for (const key in d) {
    let val = d[key];
    let o;
    if (isDict(val)) { o = jsCopy(val); } else { o = { value: val }; }
    o[keyName] = key;
    res.push(o);
  }
  return res;
}
function doYourThing(inp, grid) {
  let words = extractWords(inp.value, ' ').map(x => x.toLowerCase());
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
  let allNames = checklist.map(x => x.name);
  let names = checklist.filter(x => x.checked).map(x => x.name);
  for (const w of words) {
    if (!allNames.includes(w)) {
      let div = mCheckbox(grid, w);
      let chk = div.firstChild;
      chk.checked = true;
      chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
      needToSortChildren = true;
    } else {
      let chk = checklist.find(x => x.name == w);
      if (!chk.checked) chk.checked = true;
    }
  }
  for (const name of names) {
    if (!words.includes(name)) {
      let chk = checklist.find(x => x.name == name);
      chk.checked = false;
    }
  }
  sortCheckboxes(grid);
  words.sort();
  inp.value = words.join(', ') + ', ';
}
function drag(ev) {
  let elem = ev.target;
  dragStartOffset = getRelCoords(ev, $(elem));
  draggedElement = elem;
}
function draw() {
  background(51);
  for (let i = 0; i < tree.length; i++) {
    tree[i].show();
    if (jittering) tree[i].jitter();
  }
  for (let i = 0; i < leaves.length; i++) {
    let l = leaves[i].current;
    noStroke();
    fill(0, 255, 100, 100);
    ellipse(l.x, l.y, 8, 8);
    if (jittering) leaves[i].current.y += random(0, 2);
  }
}
function drawPix(ctx, x, y, color = 'red', sz = 5) {
  ctx.fillStyle = color;
  ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
  ctx.strokeStyle = color;
  ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawShape(key, dParent, styles, classes, sizing) {
  if (nundef(styles)) styles = { w: 96, h: 96, bg: 'random' };
  if (nundef(sizing)) sizing = { hgrow: true, wgrow: true };
  let d = mDiv(dParent, styles, null, null, classes, sizing);
  if (key == 'circle' || key == 'ellipse') mStyle(d, { rounding: '50%' });
  else mStyle(d, { 'clip-path': PolyClips[key] });
  return d;
}
function drop(ev) {
  ev.preventDefault();
  let targetElem = findDragTarget(ev);
  targetElem.appendChild(draggedElement);
  setDropPosition(ev, draggedElement, targetElem, isdef(draggedElement.dropPosition) ? draggedElement.dropPosition : dropPosition);
}
function empty(arr) {
  let result = arr === undefined || !arr || (isString(arr) && (arr == 'undefined' || arr == '')) || (Array.isArray(arr) && arr.length == 0) || emptyDict(arr);
  testHelpers(typeof arr, result ? 'EMPTY' : arr);
  return result;
}
function emptyDict(obj) {
  let test = Object.entries(obj).length === 0 && obj.constructor === Object;
  return test;
}
function emptyTarget(val) {
  return Array.isArray(val) ? [] : {}
}
function enableImageDrop(element, onDropCallback) {
  const originalBorderStyle = element.style.border;
  element.addEventListener('dragover', function (event) {
    event.preventDefault();
  });
  element.addEventListener('dragenter', function (event) {
    element.style.border = '2px solid red';
  });
  element.addEventListener('drop', function (event) {
    event.preventDefault();
    element.style.border = originalBorderStyle;
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) { // Check if the dropped file is an image
        onDropCallback(file);
      }
    }
  });
  element.addEventListener('dragleave', function (event) {
    element.style.border = originalBorderStyle;
  });
}
function enableImageOrItemDrop(elem, onDropCallback) {
  const originalBorderStyle = elem.style.border;
  elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
  elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
  elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping
  elem.addEventListener('drop', function (event) {
    event.preventDefault();
    elem.style.border = originalBorderStyle;
    if (isdef(UI.draggedItem)) {
      onDropCallback(null, elem);
      return;
    }
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDropCallback(evReader.target.result, elem);
      };
      reader.readAsDataURL(files[0]);
    }
  });
}
async function encryptData(data) {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const publicKey = await crypto.subtle.importKey(
    'jwk',
    { kty: 'RSA', e: 'AQAB', n: 'your_public_key_here' },
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );
  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'RSA-OAEP' },
    publicKey,
    dataBuffer
  );
  return new Uint8Array(encryptedBuffer).toString();
}
function endsWith(s, sSub) { let i = s.indexOf(sSub); return i >= 0 && i == s.length - sSub.length; }
function ensureColorDict() {
  if (isdef(ColorDi)) return;
  ColorDi = {};
  let names = getColorNames();
  let hexes = getColorHexes();
  for (let i = 0; i < names.length; i++) {
    ColorDi[names[i].toLowerCase()] = { c: '#' + hexes[i] };
  }
  const newcolors = {
    black: { c: '#000000', D: 'schwarz' },
    blue: { c: '#0000ff', D: 'blau' },
    BLUE: { c: '#4363d8', E: 'blue', D: 'blau' },
    BLUEGREEN: { c: '#004054', E: 'bluegreen', D: 'blaugrün' },
    BROWN: { c: '#96613d', E: 'brown', D: 'braun' },
    deepyellow: { c: '#ffed01', E: 'yellow', D: 'gelb' },
    FIREBRICK: { c: '#800000', E: 'darkred', D: 'rotbraun' },
    gold: { c: 'gold', D: 'golden' },
    green: { c: 'green', D: 'grün' },
    GREEN: { c: '#3cb44b', E: 'green', D: 'grün' },
    grey: { c: 'grey', D: 'grau' },
    lightblue: { c: 'lightblue', D: 'hellblau' },
    LIGHTBLUE: { c: '#42d4f4', E: 'lightblue', D: 'hellblau' },
    lightgreen: { c: 'lightgreen', D: 'hellgrün' },
    LIGHTGREEN: { c: '#afff45', E: 'lightgreen', D: 'hellgrün' },
    lightyellow: { c: '#fff620', E: 'lightyellow', D: 'gelb' },
    NEONORANGE: { c: '#ff6700', E: 'neonorange', D: 'neonorange' },
    NEONYELLOW: { c: '#efff04', E: 'neonyellow', D: 'neongelb' },
    olive: { c: 'olive', D: 'oliv' },
    OLIVE: { c: '#808000', E: 'olive', D: 'oliv' },
    orange: { c: 'orange', D: 'orange' },
    ORANGE: { c: '#f58231', E: 'orange', D: 'orange' },
    PINK: { c: 'deeppink', D: 'rosa' },
    pink: { c: 'pink', D: 'rosa' },
    purple: { c: 'purple', D: 'lila' },
    PURPLE: { c: '#911eb4', E: 'purple', D: 'lila' },
    red: { c: 'red', D: 'rot' },
    RED: { c: '#e6194B', E: 'red', D: 'rot' },
    skyblue: { c: 'skyblue', D: 'himmelblau' },
    SKYBLUE: { c: 'deepskyblue', D: 'himmelblau' },
    teal: { c: '#469990', D: 'blaugrün' },
    TEAL: { c: '#469990', E: 'teal', D: 'blaugrün' },
    transparent: { c: '#00000000', E: 'transparent', D: 'transparent' },
    violet: { c: 'violet', E: 'violet', D: 'violett' },
    VIOLET: { c: 'indigo', E: 'violet', D: 'violett' },
    white: { c: 'white', D: 'weiss' },
    yellow: { c: 'yellow', D: 'gelb' },
    yelloworange: { c: '#ffc300', E: 'yellow', D: 'gelb' },
    YELLOW: { c: '#ffe119', E: 'yellow', D: 'gelb' },
  };
  for (const k in newcolors) {
    let cnew = newcolors[k];
    if (cnew.c[0] != '#' && isdef(ColorDi[cnew.c])) cnew.c = ColorDi[cnew.c].c;
    ColorDi[k] = cnew;
  }
}
function ensureColorNames() {
  if (isdef(ColorNames)) return;
  ColorNames = {};
  let names = getColorNames();
  let hexes = getColorHexes();
  for (let i = 0; i < names.length; i++) {
    ColorNames[names[i].toLowerCase()] = '#' + hexes[i];
  }
}
function enterInterruptState() {
  clearTimeouts();
  if (isdef(G.instance)) G.instance.clear();
  auxOpen = true;
}
function error(msg) {
  let fname = getFunctionsNameThatCalledThisFunction();
  console.log(fname, 'ERROR!!!!! ', msg);
}
function evalCond(o, condKey, condVal) {
  let func = FUNCTIONS[condKey];
  if (isString(func)) func = window[func];
  if (nundef(func)) {
    if (nundef(o[condKey])) return null;
    if (isList(condVal)) {
      for (const v of condVal) if (o[condKey] == v) return true;
      return null;
    } else {
      return isdef(o[condKey]) ? o[condKey] == condVal : null;
    }
  }
  return func(o, condVal);
}
function evalConds(o, conds) {
  for (const [f, v] of Object.entries(conds)) {
    if (!evalCond(o, f, v)) return false;
  }
  return true;
}
function evNoBubble(ev) { ev.preventDefault(); ev.cancelBubble = true; }
function evToAttr(ev, attr) {
  let elem = ev.target;
  let val = null;
  while (nundef(val) && isdef(elem)) {
    val = elem.getAttribute(attr);
    if (isdef(val)) return val;
    elem = elem.parentNode;
  }
  return null;
}
function evToAttrElem(ev, attr) {
  let elem = ev.target;
  let val = null;
  while (nundef(val) && isdef(elem)) {
    val = elem.getAttribute(attr);
    if (isdef(val)) return { val, elem };
    elem = elem.parentNode;
  }
  return null;
}
function evToClass(ev, className) {
  let elem = findParentWithClass(ev.target, className);
  return elem;
}
function evToId(ev) {
  let elem = findParentWithId(ev.target);
  return elem.id;
}
function exitToAddon(callback) {
  AD.callback = callback;
  enterInterruptState(); auxOpen = false;
  AD.run();
}
function extendRect(r4) { r4.l = r4.x; r4.t = r4.y; r4.r = r4.x + r4.w; r4.b = r4.t + r4.h; }
function extractFilesFromHtml(html, htmlfile, ext = 'js') {
  let prefix = ext == 'js' ? 'script src="' : 'link rel="stylesheet" href="';
  let dirhtml = stringBeforeLast(htmlfile, '/');
  let project = stringAfter(dirhtml, '/'); if (project.includes('/')) project = stringBefore(project, '/');
  let parts = html.split(prefix);
  parts.shift();
  let files = parts.map(x => stringBefore(x, '"'));
  files = files.filter(x => !x.includes('alibs/') && !x.includes('assets/'));
  let files2 = [];
  for (const f of files) {
    if (f.startsWith(dirhtml)) { files2.push(f); continue; }
    if (f.startsWith('./')) { files2.push(dirhtml + f.substring(1)); continue; }
    if (f.startsWith('../') && stringCount(dirhtml, '../') == 1) {
      files2.push(f); continue;
    }
    if (!f.includes('/')) { files2.push(dirhtml + '/' + f); continue; }
    if (isLetter(f[0])) { files2.push(dirhtml + '/' + f); continue; }
    console.log('PROBLEM!', f)
  }
  files = files2;
  return files;
}
function extractTime(input) {
  const regex = /\b([0-9]|1[0-9]|2[0-3])[h:]*\S*\b/g;
  const match = input.match(regex);
  if (match) {
    let time = match[0];
    let text = input.replace(time, '').trim();
    return [time, text];
  } else {
    return ['', input];
  }
}
function extractWords(s, allowed) {
  let specialChars = toLetters(' ,-.!?;:');
  if (isdef(allowed)) specialChars = arrMinus(specialChars, toLetters(allowed));
  let parts = splitAtAnyOf(s, specialChars.join('')).map(x => x.trim());
  return parts.filter(x => !isEmpty(x));
}
function findAttributeInAncestors(elem, attr) {
  let val;
  while (elem && nundef(val = elem.getAttribute(attr))) { elem = elem.parentNode; }
  return val;
}
function findBottomLine(ct, w, h, cgoal) {
  let [_, restlist] = findPointsBoth(ct, 0, w, h - 30, h, cgoal, 20);
  let o = nextLine(ct, restlist, 'green');
  return o.val;
}
function findDarkBars(ctx, w, h, cgoal, diffleft, diffright) {
  let [restlist, _] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
  let num = 201;
  let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
  let res = [];
  while (num > 100 && i < colors.length) {
    let color = colors[i++];
    let o = nextBar(ctx, restlist, color);
    restlist = o.rest;
    num = o.line.length;
    res.push(o)
  }
  console.log('result', res);
  let diff = 243;
  let cand = res.filter(o => o.val >= 40 && o.val <= 500);
  let [kleinere, groessere] = findMidlines(cand, diff);
  let topmost, bottommost;
  for (const l3 of res) {
    let distleft = kleinere.val - l3.val;
    let distright = l3.val - groessere.val;
    if (isWithinDelta(distleft, diffleft, 2)) {
      topmost = l3;
    }
    if (isWithinDelta(distright, diffright, 2)) {
      bottommost = l3;
    }
  }
  let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? w : bottommost.val]
  return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
}
function findDarkLines(ctx, w, h, cgoal) {
  let [_, restlist] = findPoints(ctx, 0, w, 0, h, cgoal, 20);
  let y, num = 201;
  let colors = ['yellow', 'orange', 'red', 'pink', 'violet', 'blue', 'crimson', 'seagreen', 'skyblue', 'teal', 'green', 'sienna', 'grey', 'black'], i = 0;
  let res = [];
  while (i < colors.length) {
    let color = colors[i++];
    let o = nextLine(ctx, restlist, color);
    if (!o.line) { console.log('o', o); break; }
    restlist = o.rest;
    num = o.line.length;
    if (num > 112) res.push(o)
  }
  console.log('result', res);
  let diff = 261, diff2 = 22;
  let [kleinere, groessere] = findMidlines(res, diff);
  let topmost, bottommost;
  for (const l3 of res) {
    if (isWithinDelta(kleinere.val - l3.val, diff2, 2)) {
      topmost = l3;
    }
    if (isWithinDelta(l3.val - groessere.val, diff2, 2)) {
      bottommost = l3;
    }
  }
  let [ytop, ybottom] = [nundef(topmost) ? 0 : topmost.val, nundef(bottommost) ? h : bottommost.val]
  return [ytop, kleinere.val, groessere.val, ybottom, topmost, kleinere, groessere, bottommost];
}
function findDragTarget(ev) {
  let targetElem = ev.target;
  while (!targetElem.ondragover) targetElem = targetElem.parentNode;
  return targetElem;
}
function findEdgeHor(ctx, x1, x2, h, cgoal, lighting = true) {
  let [list, _] = findPoints(ctx, x1, x2, 0, h, cgoal, 20);
  if (lighting) list = list.filter(o => isLightAfter(ctx, o.x, o.y) && isLightBefore(ctx, o.x, o.y));
  let vfreq = findMostFrequentVal(list, 'x');
  return list.filter(o => o.x == vfreq);
}
function findEdgesApart(list, dx, dy, prop) {
  list.map(o => o.nei = findPointAtDistance(o, dx, dy, list, 10))
  list = list.filter(o => o.nei)
  let vfreq = findMostFrequentVal(list, prop); console.log(prop, vfreq)
  let good = list.filter(o => isWithinDelta(o[prop], vfreq, 3));
  let rest = list.filter(o => !isWithinDelta(o[prop], vfreq, 3));
  vfreq = findMostFrequentVal(rest, prop); console.log(prop, vfreq)
  let good2 = list.filter(o => o[prop] == vfreq);
  list = good.concat(good2);
  return list;
}
function findEdgeVert(ctx, y1, y2, w, cgoal, lighting = true) {
  let [_, list] = findPoints(ctx, 0, w, y1, y2, cgoal, 20);
  let vfreq = findMostFrequentVal(list, 'y');
  return list.filter(o => o.y == vfreq);
}
function findLeftLine(ct, w, h, cgoal, xStart = 0) {
  let [restlist, _] = findPointsBoth(ct, xStart, xStart + 40, 0, h, cgoal, 20);
  let o = nextBar(ct, restlist, 'red');
  return o.val;
}
function findMidlines(res, diff) {
  let mid1, mid2;
  for (const l1 of res) {
    for (const l2 of res) {
      if (isWithinDelta(Math.abs(l1.val - l2.val), diff, 2)) {
        mid1 = l1; mid2 = l2;
      }
    }
    if (isdef(mid1)) break;
  }
  let kleinere = mid1.val < mid2.val ? mid1 : mid2;
  let groessere = mid1 == kleinere ? mid2 : mid1;
  return [kleinere, groessere];
}
function findMostFrequentVal(arr, prop, delta = 0) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  let frequencyMap = new Map();
  for (let i = 0; i < arr.length; i++) {
    const val = arr[i][prop];
    frequencyMap.set(val, (frequencyMap.get(val) || 0) + 1);
  }
  let mostFrequentY;
  let maxFrequency = 0;
  for (let [val, frequency] of frequencyMap) {
    if (frequency > maxFrequency) {
      mostFrequentY = val;
      maxFrequency = frequency;
    }
  }
  return mostFrequentY;
}
function findNextBar(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  for (let x = x1; x < x2; x++) {
    for (let y = y1; y < y2; y++) {
      let c = isPix(ctx, x, y, cgoal, delta);
      if (c) {
        drawPixFrame(ctx, x - 1, y - 1, 'red', 3)
        let len = 1, yy = y + 1; xx = x;
        while (yy < y2) {
          let p = getPixRgb(ctx, xx, yy);
          let c1 = isPix(ctx, xx, yy, cgoal, delta + 10);
          yy++;
          if (c1) len++;
        }
        return { c, x, y, len };
      }
    }
  }
}
function findNextLine(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      let c = isPix(ctx, x, y, cgoal, delta);
      if (c) {
        drawPixFrame(ctx, x - 1, y - 1, 'red', 3)
        let len = 1, xx = x + 1; yy = y;
        while (xx < x2) {
          let p = getPixRgb(ctx, xx, yy);
          let c1 = isPix(ctx, xx, yy, cgoal, delta + 10);
          xx++;
          if (c1) len++;
        }
        return { c, x, y, len };
      }
    }
  }
}
function findParentWithClass(elem, className) { while (elem && !mHasClass(elem, className)) { elem = elem.parentNode; } return elem; }
function findParentWithId(elem) { while (elem && !(elem.id)) { elem = elem.parentNode; } return elem; }
function findPointAtDistance(pt, dx, dy, list, delta = 0) {
  for (const p1 of list) {
    if (isWithinDelta(Math.abs(pt.x - p1.x), dx, delta) && isWithinDelta(Math.abs(pt.y - p1.y), dy, delta)) return p1;
  }
  return null;
}
function findPoints(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  let p;
  let resy = [], resx = [];
  cgoal = colorRGB(cgoal, true);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      p = isPixDark(ctx, x, y, cgoal, delta);
      if (p) {
        let l = isLightBeforeV(ctx, x, y);
        let d = isLightAfterV(ctx, x, y);
        if (l || d) resy.push({ x, y })
        l = isLightBefore(ctx, x, y);
        d = isLightAfter(ctx, x, y);
        if (l || d) resx.push({ x, y })
      }
    }
  }
  return [resx, resy];
}
function findPointsBoth(ctx, x1, x2, y1, y2, cgoal, delta = 10) {
  let p;
  let resy = [], resx = [];
  cgoal = colorRGB(cgoal, true);
  for (let y = y1; y < y2; y++) {
    for (let x = x1; x < x2; x++) {
      p = isPixDark(ctx, x, y, cgoal, delta);
      if (p) {
        let l = isLightBeforeV(ctx, x, y);
        let d = isLightAfterV(ctx, x, y);
        if (l && d) resy.push({ x, y })
        l = isLightBefore(ctx, x, y);
        d = isLightAfter(ctx, x, y);
        if (l && d) resx.push({ x, y })
      }
    }
  }
  return [resx, resy];
}
function findRectSample(ctx, x1, x2, y1, y2, cgoal, sz = 4, lightCounts = false) {
  let p;
  cgoal = colorRGB(cgoal, true);
  for (let yStart = y1; yStart <= y2; yStart += sz) {
    for (let xStart = x1; xStart <= x2; xStart += sz) {
      let found = true;
      for (let x = xStart; x < xStart + sz; x++) {
        for (let y = yStart; y < yStart + sz; y++) {
          p = isPix(ctx, x, y, cgoal, 20);
          if (lightCounts && isPix(ctx, x, y, 'white', 10)) p = true;
          if (!p) { found = false; break; }
        }
        if (!found) break;
      }
      if (found) return true;
    }
  }
  return false;
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
function first(arr) {
  return arr.length > 0 ? arr[0] : null;
}
function firstCond(arr, func) {
  if (nundef(arr)) return null;
  for (const a of arr) {
    if (func(a)) return a;
  }
  return null;
}
function firstCondDictKeys(dict, func) {
  for (const k in dict) { if (func(k)) return k; }
  return null;
}
function firstNumber(s) {
  if (s) {
    let m = s.match(/-?\d+/);
    if (m) {
      let sh = m.shift();
      if (sh) { return Number(sh); }
    }
  }
  return null;
}
function fisherYates(arr) {
  if (arr.length == 2 && coin()) { return arr; }
  var rnd, temp;
  let last = arr[0];
  for (var i = arr.length - 1; i; i--) {
    rnd = Math.random() * i | 0;
    temp = arr[i];
    arr[i] = arr[rnd];
    arr[rnd] = temp;
  }
  return arr;
}
function fleetingMessage(msg, d, styles, ms, fade) {
  if (isString(msg)) {
    dFleetingMessage.innerHTML = msg;
    mStyle(dFleetingMessage, styles);
  } else {
    mAppend(dFleetingMessage, msg);
  }
  if (fade) Animation1 = mAnimate(dFleetingMessage, 'opacity', [1, .4, 0], null, ms, 'ease-in', 0, 'both');
  return dFleetingMessage;
}
function formatLegend(key) {
  return key.includes('per') ? stringBefore(key, '_') + '/' + stringAfterLast(key, '_')
    : key.includes('_') ? replaceAll(key, '_', ' ') : key;
}
function gBg(g, color) { g.setAttribute('fill', color); }
function gCanvas(area, w, h, color, originInCenter = true) {
  let dParent = mBy(area);
  let div = stage3_prepContainer(dParent);
  div.style.width = w + 'px';
  div.style.height = h + 'px';
  let svg = gSvg();
  let style = `margin:0;padding:0;position:absolute;top:0px;left:0px;width:100%;height:100%;`
  svg.setAttribute('style', style);
  mColor(svg, color);
  div.appendChild(svg);
  let g = gG();
  if (originInCenter) g.style.transform = "translate(50%, 50%)";
  svg.appendChild(g);
  return g;
}
function gCreate(tag) { return document.createElementNS('http:/' + '/www.w3.org/2000/svg', tag); }
function geht(sp) {
  POOLS.augData = makeDefaultPool(sData);
  annotate(sp);
  dynSpec = sp;
  let pool = POOLS.augData;
  for (const oid in pool) {
    let o = pool[oid];
    if (nundef(o.RSG)) continue;
    let info = mergeIncludingPrototype(oid, o);
    INFO[oid] = info;
  }
}
function gEllipse(w, h) { let r = gCreate('ellipse'); r.setAttribute('rx', w / 2); r.setAttribute('ry', h / 2); return r; }
function generateArrayColors(startColor, endColor, numSteps) {
  const colors = [];
  let step = 0;
  while (step < numSteps) {
    const currentColor = mixColors(startColor, endColor, step / numSteps);
    colors.push(currentColor);
    step++;
  }
  return colors;
}
function generateEventId(tsDay, tsCreated) { return `${rLetter()}_${tsDay}_${tsCreated}`; }
function generateRandomWords(n, unique = false) {
  const sampleWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'victoria plum', 'watermelon', 'xigua', 'yuzu', 'zucchini'];
  let randomWords = [];
  for (let i = 0; i < n; i++) {
    const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
    randomWords.push(randomWord);
  }
  return randomWords;
}
function generateTableId() { return rUniqueId(20); }
function generateTableName(n) {
  let existing = Serverdata.tables.map(x => x.friendly);
  while (true) {
    let cap = rChoose(M.capital);
    let parts = cap.split(' ');
    if (parts.length == 2) cap = stringBefore(cap, ' '); else cap = stringBefore(cap, '-');
    cap = cap.trim();
    let arr = ['battle of ', 'rally of ', 'showdown in ', 'summit of ', 'joust of ', 'tournament of ', 'rendezvous in ', 'soirée in ', 'festival of '];//,'encounter in ']; //['battle of ', 'war of ']
    let s = (n == 2 ? 'duel of ' : rChoose(arr)) + cap;
    if (!existing.includes(s)) return s;
  }
}
function getBar(ctx, list, val) {
  let res = list.filter(p => isWithinDelta(p.x, val, 2) && (isLightBefore(ctx, p.x, p.y) || isLightAfter(ctx, p.x, p.y)));
  return res;
}
function getBg(d) { let style = window.getComputedStyle(toElem(d)); let bg = valf(style.backgroundColor, style.background); return colorHex(bg); }
function getBrowser() {
  var userAgent = navigator.userAgent;
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Chrome";
  }
  else if (userAgent.match(/firefox|fxios/i)) {
    return "Firefox";
  }
  else if (userAgent.match(/safari/i)) {
    return "Safari";
  }
  else if (userAgent.match(/msie|trident/i)) {
    return "Internet Explorer";
  }
  else if (userAgent.match(/edg/i)) {
    return "Edge";
  }
  else {
    return "Other";
  }
}
function getButtonCaptionName(name) { return `bTest${name}`; }
function getButtonCaptionNames(table) { return isdef(table) ? table.playerNames : ['felix', 'gul', 'amanda', 'lauren', 'mimi']; }
function getButtonId(key) { return 'b' + capitalize(key); }
function getCheckedNames(dParent) {
  let checks = Array.from(dParent.querySelectorAll('input[type="checkbox"]')); //dParent.getElementsByTagName('input'));
  let res = [];
  for (const ch of checks) {
    if (ch.checked) res.push(ch.name);
  }
  return res;
}
function getCheckedRadios(rg) {
  let inputs = rg.getElementsByTagName('INPUT');
  let list = [];
  for (const ch of inputs) {
    if (ch.checked) list.push(ch.value);
  }
  return list;
}
function getCivSpot(civ, row, col, fact = 1) {
  let rAdvisor = { x: 11, y: 27, w: 87, h: 136 }; //von persia
  let rColony1 = { x: 10, y: 193, w: 87, h: 137 }; //von japan
  let rColony2 = { x: 122, y: 192, w: 87, h: 136 }; //von india
  let rColonyUpPersia = { x: 122, y: 26, w: 87, h: 136 }; //von portugal
  let rBuilding1 = { x: 132, y: 26, w: 87, h: 136 }; //von portugal
  let rBuilding1Persia = { x: 243, y: 26, w: 87, h: 136 }; //von persia
  let rBuilding2 = { x: 243, y: 28, w: 87, h: 136 };
  let dxBuildings = rBuilding2.x - (rBuilding1.x + rBuilding1.w);
  let rWic = { x: 700, y: 26, w: 87, h: 136 }; //calculated
  let rLastWonder = { x: 700, y: 193, w: 87, h: 136 };
  let rWonder = { x: 674, y: 193, w: 87, h: 136 };
  let dxWonders = 25;
  for (const r of [rAdvisor, rColony1, rColony2, rColonyUpPersia, rBuilding1, rBuilding1Persia, rBuilding2, rWic, rLastWonder, rWonder]) {
    r.x *= fact; r.y *= fact; r.w *= fact; r.h *= fact;
  }
  dxBuildings *= fact;
  dxWonders *= fact;
  if (row == 0 && col == 0) return rAdvisor;
  if (row == 0 && col == 1 && civ == 'persia') return rColonyUpPersia;
  if (row == 0 && col == 1) return rBuilding1;
  if (row == 0 && col == 2 && civ == 'persia') return rBuilding1Persia;
  if (row == 0 && col == 2) return rBuilding2;
  if (row == 0 && col == 6) return rWic;
  let r, dist;
  if (row == 0) {
    r = rBuilding2;
    dist = dxBuildings + r.w
    return { x: r.x + dist * (col - 2), y: r.y, w: r.w, h: r.h };
  }
  if (row == 1 && col == 0) return rColony1;
  if (row == 1 && col == 1 && civ != 'china' && civ != 'poland') return rColony2;
  if (row == 1 && col == 6) return rLastWonder;
  r = rLastWonder;
  dist = dxWonders + r.w;
  return { x: r.x - dist * (6 - col), y: r.y, w: r.w, h: r.h };
}
function getColorHexes(x) {
  return [
    'f0f8ff',
    'faebd7',
    '00ffff',
    '7fffd4',
    'f0ffff',
    'f5f5dc',
    'ffe4c4',
    '000000',
    'ffebcd',
    '0000ff',
    '8a2be2',
    'a52a2a',
    'deb887',
    '5f9ea0',
    '7fff00',
    'd2691e',
    'ff7f50',
    '6495ed',
    'fff8dc',
    'dc143c',
    '00ffff',
    '00008b',
    '008b8b',
    'b8860b',
    'a9a9a9',
    'a9a9a9',
    '006400',
    'bdb76b',
    '8b008b',
    '556b2f',
    'ff8c00',
    '9932cc',
    '8b0000',
    'e9967a',
    '8fbc8f',
    '483d8b',
    '2f4f4f',
    '2f4f4f',
    '00ced1',
    '9400d3',
    'ff1493',
    '00bfff',
    '696969',
    '696969',
    '1e90ff',
    'b22222',
    'fffaf0',
    '228b22',
    'ff00ff',
    'dcdcdc',
    'f8f8ff',
    'ffd700',
    'daa520',
    '808080',
    '808080',
    '008000',
    'adff2f',
    'f0fff0',
    'ff69b4',
    'cd5c5c',
    '4b0082',
    'fffff0',
    'f0e68c',
    'e6e6fa',
    'fff0f5',
    '7cfc00',
    'fffacd',
    'add8e6',
    'f08080',
    'e0ffff',
    'fafad2',
    'd3d3d3',
    'd3d3d3',
    '90ee90',
    'ffb6c1',
    'ffa07a',
    '20b2aa',
    '87cefa',
    '778899',
    '778899',
    'b0c4de',
    'ffffe0',
    '00ff00',
    '32cd32',
    'faf0e6',
    'ff00ff',
    '800000',
    '66cdaa',
    '0000cd',
    'ba55d3',
    '9370db',
    '3cb371',
    '7b68ee',
    '00fa9a',
    '48d1cc',
    'c71585',
    '191970',
    'f5fffa',
    'ffe4e1',
    'ffe4b5',
    'ffdead',
    '000080',
    'fdf5e6',
    '808000',
    '6b8e23',
    'ffa500',
    'ff4500',
    'da70d6',
    'eee8aa',
    '98fb98',
    'afeeee',
    'db7093',
    'ffefd5',
    'ffdab9',
    'cd853f',
    'ffc0cb',
    'dda0dd',
    'b0e0e6',
    '800080',
    '663399',
    'ff0000',
    'bc8f8f',
    '4169e1',
    '8b4513',
    'fa8072',
    'f4a460',
    '2e8b57',
    'fff5ee',
    'a0522d',
    'c0c0c0',
    '87ceeb',
    '6a5acd',
    '708090',
    '708090',
    'fffafa',
    '00ff7f',
    '4682b4',
    'd2b48c',
    '008080',
    'd8bfd8',
    'ff6347',
    '40e0d0',
    'ee82ee',
    'f5deb3',
    'ffffff',
    'f5f5f5',
    'ffff00',
    '9acd32'
  ];
}
function getColorNames() {
  return [
    'AliceBlue',
    'AntiqueWhite',
    'Aqua',
    'Aquamarine',
    'Azure',
    'Beige',
    'Bisque',
    'Black',
    'BlanchedAlmond',
    'Blue',
    'BlueViolet',
    'Brown',
    'BurlyWood',
    'CadetBlue',
    'Chartreuse',
    'Chocolate',
    'Coral',
    'CornflowerBlue',
    'Cornsilk',
    'Crimson',
    'Cyan',
    'DarkBlue',
    'DarkCyan',
    'DarkGoldenRod',
    'DarkGray',
    'DarkGrey',
    'DarkGreen',
    'DarkKhaki',
    'DarkMagenta',
    'DarkOliveGreen',
    'DarkOrange',
    'DarkOrchid',
    'DarkRed',
    'DarkSalmon',
    'DarkSeaGreen',
    'DarkSlateBlue',
    'DarkSlateGray',
    'DarkSlateGrey',
    'DarkTurquoise',
    'DarkViolet',
    'DeepPink',
    'DeepSkyBlue',
    'DimGray',
    'DimGrey',
    'DodgerBlue',
    'FireBrick',
    'FloralWhite',
    'ForestGreen',
    'Fuchsia',
    'Gainsboro',
    'GhostWhite',
    'Gold',
    'GoldenRod',
    'Gray',
    'Grey',
    'Green',
    'GreenYellow',
    'HoneyDew',
    'HotPink',
    'IndianRed',
    'Indigo',
    'Ivory',
    'Khaki',
    'Lavender',
    'LavenderBlush',
    'LawnGreen',
    'LemonChiffon',
    'LightBlue',
    'LightCoral',
    'LightCyan',
    'LightGoldenRodYellow',
    'LightGray',
    'LightGrey',
    'LightGreen',
    'LightPink',
    'LightSalmon',
    'LightSeaGreen',
    'LightSkyBlue',
    'LightSlateGray',
    'LightSlateGrey',
    'LightSteelBlue',
    'LightYellow',
    'Lime',
    'LimeGreen',
    'Linen',
    'Magenta',
    'Maroon',
    'MediumAquaMarine',
    'MediumBlue',
    'MediumOrchid',
    'MediumPurple',
    'MediumSeaGreen',
    'MediumSlateBlue',
    'MediumSpringGreen',
    'MediumTurquoise',
    'MediumVioletRed',
    'MidnightBlue',
    'MintCream',
    'MistyRose',
    'Moccasin',
    'NavajoWhite',
    'Navy',
    'OldLace',
    'Olive',
    'OliveDrab',
    'Orange',
    'OrangeRed',
    'Orchid',
    'PaleGoldenRod',
    'PaleGreen',
    'PaleTurquoise',
    'PaleVioletRed',
    'PapayaWhip',
    'PeachPuff',
    'Peru',
    'Pink',
    'Plum',
    'PowderBlue',
    'Purple',
    'RebeccaPurple',
    'Red',
    'RosyBrown',
    'RoyalBlue',
    'SaddleBrown',
    'Salmon',
    'SandyBrown',
    'SeaGreen',
    'SeaShell',
    'Sienna',
    'Silver',
    'SkyBlue',
    'SlateBlue',
    'SlateGray',
    'SlateGrey',
    'Snow',
    'SpringGreen',
    'SteelBlue',
    'Tan',
    'Teal',
    'Thistle',
    'Tomato',
    'Turquoise',
    'Violet',
    'Wheat',
    'White',
    'WhiteSmoke',
    'Yellow',
    'YellowGreen'
  ];
}
function getContrast(rgb1, rgb2) {
  var lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
  var lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
  var brightest = Math.max(lum1, lum2);
  var darkest = Math.min(lum1, lum2);
  return (brightest + 0.05)
    / (darkest + 0.05);
}
function getCssVar(varname) { return getComputedStyle(document.body).getPropertyValue(varname); }
function getCSSVariable(varname) { return getCssVar(varname); }
function getDivId(key) { return 'd' + capitalize(key); }
function getDynId(loc, oid) { return loc + '@' + oid; }
async function getEvent(id, cachedOk = true) {
  let res = lookup(Serverdata, ['events', id]);
  if (!cachedOk) Serverdata.events[id] = await mGetRoute('event', { id });
  return res;
}
async function getEvents(cachedOk = false) {
  if (!cachedOk) Serverdata.events = await mGetRoute('events');
  return Serverdata.events;
}
function getEventValue(o) {
  if (isEmpty(o.time)) return o.text;
  return o.time + ' ' + stringBefore(o.text, '\n');
}
function getFunctionsNameThatCalledThisFunction() {
  let c1 = getFunctionsNameThatCalledThisFunction.caller;
  if (nundef(c1)) return 'no caller!';
  let c2 = c1.caller;
  if (nundef(c2)) return 'no caller!';
  return c2.name;
}
function getGameColor(gamename) { return Serverdata.config.games[gamename].color; }
function getGameFriendly(game) { return Serverdata.config.games[game].friendly; }
function getGameOption(prop) { return lookup(Clientdata, ['table', 'options', prop]); }
function getGamePlayerOptions(gamename) { return Serverdata.config.games[gamename].ploptions; }
function getGameProp(prop) { return Serverdata.config.games[Clientdata.table.game][prop]; }
function getGameValues() {
  let user = U.id;
  let game = G.id;
  let level = G.level;
  let settings = { numColors: 1, numRepeat: 1, numPics: 1, numSteps: 1, colors: ColorList };
  settings = mergeOverride(settings, DB.settings);
  if (isdef(U.settings)) settings = mergeOverride(settings, U.settings);
  if (isdef(DB.games[game])) settings = mergeOverride(settings, DB.games[game]);
  let next = lookup(DB.games, [game, 'levels', level]); if (next) settings = mergeOverride(settings, next);
  next = lookup(U, ['games', game]); if (next) settings = mergeOverride(settings, next);
  next = lookup(U, ['games', game, 'levels', level]); if (next) settings = mergeOverride(settings, next);
  delete settings.levels;
  Speech.setLanguage(settings.language);
  return settings;
}
function getIdKey(elem) { let id = mBy(elem).id; return id.substring(1).toLowerCase(); }
function getItem(k) { return infoToItem(Syms[k]); }
function getLevelColor(n) {
  const levelColors = [LIGHTBLUE, BLUE, GREEN, YELLOW, 'orange', RED, '#222',
    GREEN, BLUE, PURPLE, YELLOW2, 'deepskyblue', 'deeppink', //** MAXLEVEL 10 */
    TEAL, ORANGE, 'seagreen', FIREBRICK, OLIVE, '#ffd8b1', '#000075', '#a9a9a9', '#ffffff', '#000000', 'gold', 'orangered', 'skyblue', 'pink', 'palegreen', '#e6194B'];
  return levelColors[n - 1];
}
function getLine(ctx, list, val) {
  let res = list.filter(p => isWithinDelta(p.y, val, 2) && (isLightBeforeV(ctx, p.x, p.y) || isLightAfterV(ctx, p.x, p.y)));
  let ls = sortBy(res, 'x');
  let segments = [], seg = [];
  let i = -1; let lastx = -1;
  while (++i < ls.length) {
    let el = ls[i];
    if (lastx >= 0 && el.x > lastx + 1) {
      segments.push(seg); seg = [];
    } else {
      if (el.x != lastx) seg.push(el);
    }
    lastx = el.x;
  }
  segments.push(seg);
  let len = 0, best = null;
  for (const s of segments) { if (s.length > len) { len = s.length; best = s } }
  return best;
}
function getMouseCoordinates(event) {
  const image = event.target;
  const offsetX = event.clientX +
    (window.scrollX !== undefined ? window.scrollX : (document.documentElement || document.body.parentNode || document.body).scrollLeft) -
    12;
  const offsetY = event.clientY +
    (window.scrollY !== undefined ? window.scrollY : (document.documentElement || document.body.parentNode || document.body).scrollTop) -
    124;
  return { x: offsetX, y: offsetY };
}
function getMouseCoordinatesRelativeToElement(ev, elem) {
  if (nundef(elem)) elem = ev.target;
  const rect = elem.getBoundingClientRect();
  const x = ev.clientX - rect.left;
  const y = ev.clientY - rect.top;
  return { x, y };
}
function getNow() { return Date.now(); }
function getO(n, R) { let oid = n.oid; if (isdef(oid)) return R.getO(oid); else return null; }
function getParams(areaName, oSpec, oid) {
  let params = oSpec.params ? oSpec.params : {};
  let panels = oSpec.panels ? oSpec.panels : [];
  let num = panels.length;
  let or = params.orientation ? params.orientation == 'h' ? 'rows'
    : 'columns' : DEF_ORIENTATION;
  let split = params.split ? params.split : DEF_SPLIT;
  let bg = oSpec.color ? oSpec.color : randomColor();
  let fg = bg ? colorIdealText(bg) : null;
  let id = oSpec.id ? oSpec.id : areaName;
  if (oid) { id = getDynId(id, oid); }
  let parent = mBy(areaName);
  if (oSpec.id) {
    parent.id = id;
    addAREA(id, oSpec);
    parent.innerHTML = id;
  }
  if (bg) { mColor(parent, bg, fg); }
  return [num, or, split, bg, fg, id, panels, parent];
}
function getPixRgb(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return { r: red, g: green, b: blue };
}
function getPlayerProp(prop) { let pl = Clientdata.table.fen.players[getUname()]; return pl[prop]; }
function getPlayersWithMaxScore(fen) {
  let list = dict2list(fen.players, 'name');
  list = sortByDescending(list, 'score');
  maxlist = arrTakeWhile(list, x => x.score == list[0].score);
  return maxlist.map(x => x.name);
}
function getPlaymode(idOrTable, name) {
  if (isDict(idOrTable)) {
    let table = idOrTable;
    return isdef(table.fen) ? table.fen.players[name].playmode : 'no fen';
  } else if (Clientdata.table) {
    return Clientdata.table.id == idOrTable ? Clientdata.table.fen.players[name].playmode : 'wrong table';
  } else return 'NO table!';
}
function getRadioValue(prop) {
  let fs = mBy(`d_${prop}`);
  if (nundef(fs)) return null;
  let val = getCheckedRadios(fs)[0];
  return isNumber(val) ? Number(val) : val;
}
function getRandomFromArray(array) { return (array[randomIndex(array) | 0]) }
function getRect(elem, relto) {
  if (isString(elem)) elem = document.getElementById(elem);
  let res = elem.getBoundingClientRect();
  if (isdef(relto)) {
    let b2 = relto.getBoundingClientRect();
    let b1 = res;
    res = {
      x: b1.x - b2.x,
      y: b1.y - b2.y,
      left: b1.left - b2.left,
      top: b1.top - b2.top,
      right: b1.right - b2.right,
      bottom: b1.bottom - b2.bottom,
      width: b1.width,
      height: b1.height
    };
  }
  let r = { x: res.left, y: res.top, w: res.width, h: res.height };
  addKeys({ l: r.x, t: r.y, r: r.x + r.w, b: r.y + r.h }, r);
  return r;
}
function getRectInt(elem, relto) {
  if (isString(elem)) elem = document.getElementById(elem);
  let res = elem.getBoundingClientRect();
  if (isdef(relto)) {
    let b2 = relto.getBoundingClientRect();
    let b1 = res;
    res = {
      x: b1.x - b2.x,
      y: b1.y - b2.y,
      left: b1.left - b2.left,
      top: b1.top - b2.top,
      right: b1.right - b2.right,
      bottom: b1.bottom - b2.bottom,
      width: b1.width,
      height: b1.height
    };
  }
  let r4 = { x: Math.round(res.left), y: Math.round(res.top), w: Math.round(res.width), h: Math.round(res.height) };
  extendRect(r4);
  return r4;
}
function getRelCoords(ev, elem) {
  let x = ev.pageX - elem.offset().left;
  let y = ev.pageY - elem.offset().top;
  return { x: x, y: y };
}
function getServerurl() {
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
function getStyleProp(elem, prop) { return getComputedStyle(elem).getPropertyValue(prop); }
function getThemeDark() { return getCSSVariable('--bgNav'); } 
function getThemeFg() { return getCSSVariable('--fgButtonHover'); } 
function getTimestamp() { return Date.now(); }
function getTurnPlayers(fen) {
  return fen.turn.join(', ');
}
function getTypeOf(param) {
  let type = typeof param;
  if (type == 'string') {
    return 'string';
  }
  if (type == 'object') {
    type = param.constructor.name;
    if (startsWith(type, 'SVG')) type = stringBefore(stringAfter(type, 'SVG'), 'Element').toLowerCase();
    else if (startsWith(type, 'HTML')) type = stringBefore(stringAfter(type, 'HTML'), 'Element').toLowerCase();
  }
  let lType = type.toLowerCase();
  if (lType.includes('event')) type = 'event';
  return type;
}
function getUID(pref = '') {
  UIDCounter += 1;
  return pref + '_' + UIDCounter;
}
function getUname() { assertion(Clientdata.curUser == U.name, `getUname!!!!!!!${Clientdata.curUser} != ${U.name}`); return Clientdata.curUser; }
async function getUser(name, cachedOk = false) {
  let res = lookup(Serverdata, ['users', name]);
  if (!res || !cachedOk) res = await mGetRoute('user', { name });
  if (!res) {
    let key = isdef(M.superdi[name]) ? name : rChoose(Object.keys(M.superdi))
    res = await postUserChange({ name, color: rChoose(M.playerColors), key });
  }
  Serverdata.users[name] = res;
  return res;
}
function getUserColor(uname) { return Serverdata.users[uname].color; }
function getWaitingHtml(sz = 30) { return `<img src="../assets/icons/active_player.gif" height="${sz}" style="margin:0px ${sz / 3}px" />`; }
function gFg(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gHex(w, h) { let pts = size2hex(w, h); return gPoly(pts); }
function gLine(x1, y1, x2, y2) { let r = gCreate('line'); r.setAttribute('x1', x1); r.setAttribute('y1', y1); r.setAttribute('x2', x2); r.setAttribute('y2', y2); return r; }
function gPoly(pts) { let r = gCreate('polygon'); if (pts) r.setAttribute('points', pts); return r; }
function gPos(g, x, y) { g.style.transform = `translate(${x}px, ${y}px)`; }
function gRect(w, h) { let r = gCreate('rect'); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('x', -w / 2); r.setAttribute('y', -h / 2); return r; }
function gRounding(r, rounding) {
  r.setAttribute('rx', rounding);
  r.setAttribute('ry', rounding);
}
function gSet() {
  function set_fen() {
    let items = Session.items;
    let fen = items.map(x => x.fen).join(',');
    return fen;
  }
  function set_prompt(g, fen) {
    let [n, rows, cols] = [g.num_attrs, g.rows, g.cols];
    let all_attrs = gSet_attributes();
    let attrs_in_play = arrTake(get_keys(all_attrs), n);
    let deck = g.deck = make_set_deck(n);
    shuffle(deck);
    let goal = Goal = { set: make_goal_set(deck, g.prob_different), cards: [] };
    let dCards = stdRowsColsContainer(dTable, cols, styles = { bg: 'transparent' });
    let card_styles = { w: cols > 4 ? 130 : 160 };
    let items = g.items = [];
    let deck_rest = arrWithout(deck, goal.set);
    let fens = choose(deck_rest, rows * cols - 3);
    let all_fens = goal.set.concat(fens);
    shuffle(all_fens);
    if (isdef(fen)) { all_fens = fen.split(','); }
    for (const f of all_fens) {
      let item = create_set_card(f, dCards, card_styles);
      let d = iDiv(item);
      mStyle(d, { cursor: 'pointer' });
      d.onclick = set_interact;
      if (Goal.set.includes(item.fen)) Goal.cards.push(item);
      items.push(item);
    }
    g.selected = [];
    return items;
  }
  function set_interact(ev) {
    ev.cancelBubble = true;
    if (!canAct()) { console.log('no act'); return; }
    let id = evToId(ev);
    if (isdef(Items[id])) {
      let item = Items[id];
      toggleSelectionOfPicture(item, Session.selected);
      if (Session.selected.length == 3) {
        let correct = check_complete_set(Session.selected.map(x => x.fen));
        if (correct) {
          Selected = { isCorrect: true, feedbackUI: Session.selected.map(x => iDiv(x)) };
        } else {
          Selected = { isCorrect: false, correctUis: Goal.cards.map(x => iDiv(x)), feedbackUI: null, animation: 'onPulse1' };
        }
        set_eval();
      }
    }
  }
  function set_eval() {
    if (!canAct()) return;
    uiActivated = false; clear_timeouts();
    IsAnswerCorrect = Selected.isCorrect;
    race_set_fen();
    race_update_my_score(IsAnswerCorrect ? 1 : 0);
    let delay = show_feedback(IsAnswerCorrect);
    setTimeout(() => {
      in_game_open_prompt_off();
      clear_table_events();
      race_send_move();
    }, delay);
  }
  return {
    prompt: set_prompt,
    fen: set_fen,
  }
}
function gShape(shape, w = 20, h = 20, color = 'green', rounding) {
  let el = gG();
  if (nundef(shape)) shape = 'rect';
  if (shape != 'line') agColoredShape(el, shape, w, h, color);
  else gStroke(el, color, w);
  if (isdef(rounding) && shape == 'rect') {
    let r = el.children[0];
    gRounding(r, rounding);
  }
  return el;
}
function gSize(g, w, h, shape = null, iChild = 0) {
  let el = (getTypeOf(g) != 'g') ? g : g.children[iChild];
  let t = getTypeOf(el);
  switch (t) {
    case 'rect': el.setAttribute('width', w); el.setAttribute('height', h); el.setAttribute('x', -w / 2); el.setAttribute('y', -h / 2); break;
    case 'ellipse': el.setAttribute('rx', w / 2); el.setAttribute('ry', h / 2); break;
    default:
      if (shape) {
        switch (shape) {
          case 'hex': let pts = size2hex(w, h); el.setAttribute('points', pts); break;
        }
      }
  }
  return el;
}
function gStroke(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gSvg() { return gCreate('svg'); }
function hFunc(content, funcname, arg1, arg2, arg3) {
  let html = `<a style='color:blue' href="javascript:${funcname}('${arg1}','${arg2}','${arg3}');">${content}</a>`;
  return html;
}
function hide(elem) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (nundef(elem)) return;
  if (isSvg(elem)) {
    elem.setAttribute('style', 'visibility:hidden;display:none');
  } else {
    elem.style.display = 'none';
  }
}
function hourglassUpdate() {
}
function iAdd(item, liveprops = {}, addprops = {}) {
  let id, l;
  if (isString(item)) { id = item; item = valf(Items[id], {}); }
  let el = valf(liveprops.div, liveprops.ui, iDiv(item), null);
  id = valnwhite(addprops.id, item.id, (el ? el.id : getUID()), getUID());
  item.id = id; if (nundef(Items[id])) Items[id] = item; if (el) el.id = id;
  if (nundef(item.live)) item.live = {};
  l = item.live;
  for (const k in liveprops) {
    let val = liveprops[k];
    if (nundef(val)) { continue; }
    l[k] = val;
    if (isdef(val.id) && val.id != id) { lookupAddIfToList(val, ['memberOf'], id); }
  }
  if (isdef(addprops)) copyKeys(addprops, item);
  return item;
}
function idealTextColor(bg, grayPreferred = false, nThreshold = 105) {
  if (bg.substring(0, 1) != '#') bg = colorNameToHexString(bg);
  rgb = hex2RgbObject(bg);
  r = rgb.r;
  g = rgb.g;
  b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function iDiv(i) { return isdef(i.live) ? i.live.div : valf(i.div, i.ui, i); } //isdef(i.div) ? i.div : i; }
async function imgAsIsInDiv(url, dParent) {
  let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
  let sz = 300;
  let img = await imgAsync(d, {}, { tag: 'img', src: url });
  let [w, h] = [img.width, img.height]; console.log('sz', w, h);
  let scale = sz / img.height;
  return [img, scale];
}
async function imgAsync(dParent, styles, opts) {
  let path = opts.src;
  delete opts.src;
  addKeys({ tag: 'img' }, opts); //if forget
  return new Promise((resolve, reject) => {
    const img = mDom(dParent, styles, opts);
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = path;
  });
}
function imgBackground(d, src) {
  d.style.backgroundImage = `url('${src}')`; //../assets/games/nations/civs/civ_${pl1.civ}.png')`;
  d.style.backgroundSize = 'cover';
}
async function imgCrop(img, dc, wOrig, hOrig) {
  let dims = mGetStyles(dc, ['left', 'top', 'w', 'h']); console.log('dims', dims);
  let wScale = img.width / wOrig;
  let hScale = img.height / hOrig;
  console.log('scale', wScale, hScale, wOrig, hOrig, img.width, img.height)
  let d1 = mDom(document.body, { margin: 10 });
  let canvas = mDom(d1, {}, { tag: 'canvas', width: dims.w, height: dims.h });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, dims.left / wScale, dims.top / hScale, (dims.w) / wScale, img.height / hScale, 0, 0, dims.w, dims.h)
}
function imgExpand(img, dc, sz) { img.width += 20; adjustCropper(img, dc, sz); return [img.width, img.height]; }
async function imgMeasure(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // CORS permission for cross-origin images
    img.onload = () => {
      resolve({ img: img, w: img.width, h: img.height });
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = src;
  });
}
function imgReset(img, dc, sz, w, h) { img.width = w; img.height = h; adjustCropper(img, dc, sz); return [w, h]; }
async function imgScaledToHeightInDiv(url, dParent, sz = 300) {
  let d = mDom(dParent, { bg: 'pink', wmin: 128, hmin: 128, display: 'inline-block', align: 'center', margin: 10 }, { className: 'imgWrapper' });
  let img = await imgAsync(d, {}, { tag: 'img', src: url });
  let [w, h] = [img.width, img.height]; console.log('orig', w, h);
  let scale = sz / img.height;
  img.width *= scale;
  img.height *= scale;
  mStyle(img, { w: img.width, h: img.height })
  return [img, scale];
}
function imgSquish(img, dc, sz) { let w = mGetStyle(dc, 'w'); if (img.width == w) return; else { img.width = Math.max(img.width - 20, w); adjustCropper(img, dc, sz); return [img.width, img.height]; } }
function imgToDataUrl(img) {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/png');
  return dataUrl;
}
async function imgToServer(canvas, path) {
  let dataUrl = canvas.toDataURL('image/png');
  let o = { image: dataUrl, path: path };
  console.log('...postImage o', o)
  let resp = await mPostRoute('postImage', o);
  return resp;
}
function infoToItem(x) { let item = { info: x, key: x.key }; item.id = iRegister(item); return item; }
function initCodingUI() {
  mStyle('dMain', { bg: 'silver' });
  [dTable, dSidebar] = mCols100('dMain', '1fr auto', 0);
  let [dtitle, dta] = mRows100(dTable, 'auto 1fr', 2);
  mDiv(dtitle, { padding: 10, fg: 'white', fz: 24 }, null, 'OUTPUT:');
  AU.ta = mTextArea100(dta, { fz: 20, padding: 10, family: 'opensans' });
}
function initCrowd() {
  while (availablePeeps.length) {
    addPeepToCrowd().walk.progress(Math.random())
  }
}
function inpToChecklist(ev, grid) {
  let key = ev.key;
  let inp = ev.target;
  if (key == 'Backspace') {
    let s = inp.value;
    let cursorPos = inp.selectionStart;
    let ch = cursorPos == 0 ? null : inp.value[cursorPos - 1];
    if (!ch || isWhiteSpace(ch)) {
      doYourThing(inp, grid);
    }
    console.log('Backspace', ch);
    return;
  }
  if (key == 'Enter') ev.preventDefault();
  if (isExpressionSeparator(key) || key == 'Enter') doYourThing(inp, grid);
}
function instructionUpdate() {
}
function intersection(arr1, arr2) {
  let res = [];
  for (const a of arr1) {
    if (arr2.includes(a)) {
      addIf(res, a);
    }
  }
  return res;
}
function intersectionOfArrays() {
  let arrs = arguments[0]; console.log('arrs', arrs);
  if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
  return arrs.reduce((acc, array) => acc.filter(element => array.includes(element)));
}
function iRegister(item, id) { let uid = isdef(id) ? id : getUID(); Items[uid] = item; return uid; }
function isAlphaNum(s) { query = /^[a-zA-Z0-9]+$/; return query.test(s); }
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; } return isLetter(s[0]); }
function isBetween(n, a, b) { return n >= a && n <= b }
function isdef(x) { return x !== null && x !== undefined; }
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isDigit(s) { return /^[0-9]$/i.test(s); }
function isEmpty(arr) {
  return arr === undefined || !arr
    || (isString(arr) && (arr == 'undefined' || arr == ''))
    || (Array.isArray(arr) && arr.length == 0)
    || Object.entries(arr).length === 0;
}
function isEmptyOrWhiteSpace(s) { return isEmpty(s.trim()); }
function isExpressionSeparator(ch) { return ',-.!?;:'.includes(ch); }
function isGrayColor(color, diff = 60) {
  const rgb = colorHexToRgb(color);
  return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
function isLetter(s) { return /^[a-zA-Z]$/i.test(s); }
function isLightAfter(ctx, x, y) {
  for (let p = x + 1; p < x + 4; p++) if (isPixLight(ctx, p, y)) return true;
  return false;
}
function isLightAfterV(ctx, x, y) {
  for (let p = y + 1; p < y + 5; p++) if (isPixLight(ctx, x, p)) return true;
  return false;
}
function isLightBefore(ctx, x, y) {
  for (let p = x - 4; p < x - 1; p++) if (isPixLight(ctx, p, y)) return true;
  return false;
}
function isLightBeforeV(ctx, x, y) {
  for (let p = y - 4; p < y - 1; p++) if (isPixLight(ctx, x, p)) return true;
  return false;
}
function isList(arr) { return Array.isArray(arr); }
function isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}
function isMyTurn(fen) { return fen.turn.includes(getUname()) }
function isNumber(x) { return x !== ' ' && x !== true && x !== false && isdef(x) && (x == 0 || !isNaN(+x)); }
function isNumeric(x) { return !isNaN(+x); }
function isObject(item) { return item && typeof item === 'object' && !Array.isArray(item); }
function isPix(ctx, x, y, color, delta = 10) {
  let rgb = isString(color) ? colorRGB(color, true) : color;
  let p = getPixRgb(ctx, x, y);
  let found = isWithinDelta(p.r, rgb.r, delta) && isWithinDelta(p.g, rgb.g, delta) && isWithinDelta(p.b, rgb.b, delta);
  return found ? p : null;
}
function isPixDark(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return green < 100 && blue < 100;
}
function isPixLight(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return red + green + blue > 520;
}
function isPointOutsideOf(form, x, y) { const r = form.getBoundingClientRect(); return (x < r.left || x > r.right || y < r.top || y > r.bottom); }
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
function isSet(x) { return (isDict(x) && (x.set || x._set)); }
function isString(param) { return typeof param == 'string'; }
function isSvg(elem) { return startsWith(elem.constructor.name, 'SVG'); }
function isTimeForAddon() {
  if (nundef(ADS)) return false;
  if (isEmpty(U.avAddons)) return false;
  if (isdef(AD) && AD.running && AD.checkEndCondition()) {
    console.log('END!')
    AD.die();
    U.addons[AD.key].open = false;
    AD = null;
  }
  if (isdef(AD)) return AD.isTimeForAddon();
  let open = allCondDict(U.addons, x => x.open == true);
  if (isEmpty(open)) {
    console.log('open is empty! choosing a random addon!')
    let k = chooseRandom(U.avAddons);
    AD = new ADS[k].cl(k, ADS[k], {});
  } else if (open.length == 1) {
    let k = open[0];
    AD = new ADS[k].cl(k, ADS[k], U.addons[k]);
  } else {
    let k = chooseRandom(open);
    AD = new ADS[k].cl(k, ADS[k], U.addons[k]);
  }
  return AD.isTimeForAddon();
}
function isWhiteSpace(s) { let white = new RegExp(/^\s$/); return white.test(s.charAt(0)); }
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }
function isWordSeparator(ch) { return ' ,-.!?;:'.includes(ch); }
function ithWord(s, n, allow_) {
  let ws = toWords(s, allow_);
  return ws[Math.min(n, ws.length - 1)];
}
function jsCopy(o) { return JSON.parse(JSON.stringify(o)); }
function keyDownHandler(ev) {
  if (IsControlKeyDown && MAGNIFIER_IMAGE) return;
  if (!MAGNIFIER_IMAGE && ev.key == 'Control') {
    IsControlKeyDown = true;
    let hoveredElements = document.querySelectorAll(":hover");
    let cand = Array.from(hoveredElements).find(x => mHasClass(x, 'magnifiable'));
    if (isdef(cand)) mMagnify(cand);
  }
}
function keyUpHandler(ev) {
  if (ev.key == 'Control') {
    IsControlKeyDown = false;
    mMagnifyOff();
  }
}
function last(arr) {
  return arr.length > 0 ? arr[arr.length - 1] : null;
}
function lastOfLanguage(key, language) {
  let y = symbolDict[key];
  let w = y[language];
  let last = stringAfterLast(w, '|');
  return last.trim();
}
function list2dict(arr, keyprop = 'id', uniqueKeys = true) {
  let di = {};
  for (const a of arr) {
    let key = typeof (a) == 'object' ? a[keyprop] : a;
    if (uniqueKeys) lookupSet(di, [key], a);
    else lookupAddToList(di, [key], a);
  }
  return di;
}
function liste(areaName, oSpec, oid, o) {
  let [num, or, split, bg, fg, id, panels, parent] = getParams(areaName, oSpec, oid);
  parent.style.display = 'inline-grid';
  return parent;
}
async function loadAndMakeInteractive(imageUrl) {
  try {
    const canvas = await createInteractiveCanvas(imageUrl);
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}
async function loadAndScaleImage(imageUrl) {
  try {
    const canvas = await createScaledCanvasFromImage(imageUrl);
    document.body.appendChild(canvas);
  } catch (error) {
    console.error("Error loading image:", error);
  }
}
async function loadAssets() {
  M = await mGetYaml('../y/m.yaml');
  let [di, byColl, byFriendly, byCat] = [M.superdi, {}, {}, {}];
  for (const k in di) {
    let o = di[k];
    for (const cat of o.cats) lookupAddIfToList(byCat, [cat], k);
    for (const coll of o.colls) lookupAddIfToList(byColl, [coll], k);
    lookupAddIfToList(byFriendly, [o.friendly], k)
  }
  M.byCat = byCat;
  M.byCollection = byColl;
  M.byFriendly = byFriendly;
  M.categories = Object.keys(byCat); M.categories.sort();
  M.collections = Object.keys(byColl); M.collections.sort();
  M.names = Object.keys(byFriendly); M.names.sort();
  let textures = await mGetFiles(`../assets/textures`);
  M.textures = textures.map(x=>`../assets/textures/${x}`); //console.log('textures',M.textures)
}
async function loadImageAsync(src, img) {
  return new Promise((resolve, reject) => {
    img.onload = async () => {
      resolve(img);
    };
    img.onerror = (error) => {
      reject(error);
    };
    img.src = src;
  });
}
function logItems() { Object.keys(Items).sort().forEach(k => console.log('Items', Items[k])); }
function lookup(dict, keys) {
  let d = dict;
  let ilast = keys.length - 1;
  let i = 0;
  for (const k of keys) {
    if (k === undefined) break;
    let e = d[k];
    if (e === undefined || e === null) return null;
    d = d[k];
    if (i == ilast) return d;
    i += 1;
  }
  return d;
}
function lookupAddIfToList(dict, keys, val) {
  let lst = lookup(dict, keys);
  if (isList(lst) && lst.includes(val)) return;
  lookupAddToList(dict, keys, val);
}
function lookupAddToList(dict, keys, val) {
  let d = dict;
  let ilast = keys.length - 1;
  let i = 0;
  for (const k of keys) {
    if (i == ilast) {
      if (nundef(k)) {
        console.assert(false, 'lookupAddToList: last key indefined!' + keys.join(' '));
        return null;
      } else if (isList(d[k])) {
        d[k].push(val);
      } else {
        d[k] = [val];
      }
      return d[k];
    }
    if (nundef(k)) continue;
    if (d[k] === undefined) d[k] = {};
    d = d[k];
    i += 1;
  }
  return d;
}
function lookupSet(dict, keys, val) {
  let d = dict;
  let ilast = keys.length - 1;
  let i = 0;
  for (const k of keys) {
    if (nundef(k)) continue;
    if (d[k] === undefined) d[k] = (i == ilast ? val : {});
    if (nundef(d[k])) d[k] = (i == ilast ? val : {});
    d = d[k];
    if (i == ilast) return d;
    i += 1;
  }
  return d;
}
function lookupSetOverride(dict, keys, val) {
  let d = dict;
  let ilast = keys.length - 1;
  let i = 0;
  for (const k of keys) {
    if (i == ilast) {
      if (nundef(k)) {
        return null;
      } else {
        d[k] = val;
      }
      return d[k];
    }
    if (nundef(k)) continue;
    if (nundef(d[k])) d[k] = {};
    d = d[k];
    i += 1;
  }
  return d;
}
function luminance(r, g, b) {
  var a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
function makeArrayWithParts(keys) {
  let arr = []; keys[0].split('_').map(x => arr.push([]));
  for (const key of keys) {
    let parts = key.split('_');
    for (let i = 0; i < parts.length; i++) arr[i].push(parts[i]);
  }
  return arr;
}
function makeDefaultPool(fromData) {
  if (nundef(fromData) || isEmpty(fromData.table) && isEmpty(fromData.players)) return {};
  if (nundef(fromData.table)) fromData.table = {};
  let data = jsCopy(fromData.table);
  for (const k in fromData.players) {
    data[k] = jsCopy(fromData.players[k]);
  }
  return data;
}
function makePool(cond, source, R) {
  if (nundef(cond)) return [];
  else if (cond == 'all') return source;
  let pool = [];
  for (const oid of source) {
    let o = R.getO(oid);
    if (!evalConds(o, cond)) continue;
    pool.push(oid);
  }
  return pool;
}
function makeSVG(tag, attrs) {
  var el = "<" + tag;
  for (var k in attrs)
    el += " " + k + "=\"" + attrs[k] + "\"";
  return el + "/>";
}
function makeUnitString(nOrString, unit = 'px', defaultVal = '100%') {
  if (nundef(nOrString)) return defaultVal;
  if (isNumber(nOrString)) nOrString = '' + nOrString + unit;
  return nOrString;
}
function mAnimate(elem, prop, valist, callback, msDuration = 1000, easing = 'cubic-bezier(1,-0.03,.86,.68)', delay = 0, forwards = 'none') {
  let kflist = [];
  for (const perc in valist) {
    let o = {};
    let val = valist[perc];
    o[prop] = isString(val) || prop == 'opacity' ? val : '' + val + 'px';
    kflist.push(o);
  }
  let opts = { duration: msDuration, fill: forwards, easing: easing, delay: delay };
  let a = toElem(elem).animate(kflist, opts);
  if (isdef(callback)) { a.onfinish = callback; }
  return a;
}
function mAppend(d, child) { toElem(d).appendChild(child); return child; }
function mButton(caption, handler, dParent, styles, classes, id) {
  let x = mCreate('button');
  x.innerHTML = caption;
  if (isdef(handler)) x.onclick = handler;
  if (isdef(dParent)) toElem(dParent).appendChild(x);
  if (isdef(styles)) mStyle(x, styles);
  if (isdef(classes)) mClass(x, classes);
  if (isdef(id)) x.id = id;
  return x;
}
function mButtonX(dParent, handler, sz = 30, offset = 0, color = 'white') {
  mIfNotRelative(dParent);
  let bx = mDom(dParent, { position: 'absolute', top: -2 + offset, right: -5 + offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
  bx.onclick = ev => { evNoBubble(ev); handler(ev); }
  let o = M.superdi.xmark;
  el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: color, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
}
function mBy(id) { return document.getElementById(id); }
function mCenterCenter(d, gap) { mCenterCenterFlex(d, gap); }
function mCenterCenterFlex(d, gap) { mCenterFlex(d, true, true, true, gap); }
function mCenterFlex(d, hCenter = true, vCenter = false, wrap = true, gap = null) {
  let styles = { display: 'flex' };
  if (hCenter) styles['justify-content'] = 'center';
  styles['align-content'] = vCenter ? 'center' : 'flex-start';
  if (wrap) styles['flex-wrap'] = 'wrap';
  if (gap) styles.gap = gap;
  mStyle(d, styles);
}
function mCheckbox(dg, name, value) {
  let di = mDom(dg, { display: 'inline-block' });
  let chk = mDom(di, {}, { tag: 'input', type: 'checkbox', id: getUID('c'), name: name });
  if (isdef(value)) chk.checked = value;
  let label = mDom(di, {}, { tag: 'label', html: name, for: chk.id });
  return di;
}
function mClass(d) {
  d = toElem(d);
  if (arguments.length == 2) {
    let arg = arguments[1];
    if (isString(arg) && arg.indexOf(' ') > 0) { arg = [toWords(arg)]; }
    else if (isString(arg)) arg = [arg];
    if (isList(arg)) {
      for (let i = 0; i < arg.length; i++) {
        d.classList.add(arg[i]);
      }
    }
  } else for (let i = 1; i < arguments.length; i++) d.classList.add(arguments[i]);
}
function mClassRemove(d) { d = toElem(d); for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mClear(d) {
  toElem(d).innerHTML = '';
}
function mColFlex(dParent, chflex = [1, 5, 1], bgs) {
  let styles = { opacity: 1, display: 'flex', aitems: 'stretch', 'flex-flow': 'nowrap' };
  mStyle(dParent, styles);
  let res = [];
  for (let i = 0; i < chflex.length; i++) {
    let bg = isdef(bgs) ? bgs[i] : null;
    let d1 = mDiv(dParent, { flex: chflex[i], bg: bg });
    res.push(d1);
  }
  return res;
}
function mColor(d, bg, fg) { return mStyle(d, { 'background-color': bg, 'color': fg }); }
function mCols100(dParent, spec, gap = 4) {
  let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
  grid.style.gridTemplateColumns = spec;
  let res = [];
  for (const i of range(stringCount(spec, ' ') + 1)) {
    let d = mDiv(grid, { h: '100%', w: '100%', box: true })
    res.push(d);
  }
  return res;
}
function mCommand(dParent, key, html, open, close) {
  if (nundef(html)) html = capitalize(key);
  if (nundef(open)) open = window[`onclick${capitalize(key)}`];
  if (nundef(close)) close = () => { console.log('close', key) }
  let d = mDom(dParent, { display: 'inline-block' }, { key: key });
  let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })
  return { dParent, elem: d, div: a, key, open, close };
}
function mCreate(tag, styles, id) { let d = document.createElement(tag); if (isdef(id)) d.id = id; if (isdef(styles)) mStyle(d, styles); return d; }
function mCreateFrom(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}
function mCropResizePan(dParent, img, dButtons) {
  let [worig, horig] = [img.offsetWidth, img.offsetHeight];
  mStyle(dParent, { w: worig, h: horig, position: 'relative' });
  const cropBox = mDom(dParent, { position: 'absolute', left: 0, top: 0, w: worig, h: horig }, { className: 'crop-box' });
  const messageBox = mDom(cropBox, { bg: '#ffffff80', fg: 'black', cursor: 'move' });
  let sz = 16;
  const centerBox = mDom(cropBox, { bg: 'red', w: sz, h: sz, rounding: '50%', position: 'absolute' });
  const wHandle = mDom(cropBox, { cursor: 'ew-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, top: '50%', rounding: '50%', position: 'absolute' });
  const hHandle = mDom(cropBox, { cursor: 'ns-resize', bg: 'red', w: sz, h: sz, left: '50%', bottom: -sz / 2, rounding: '50%', position: 'absolute' });
  const whHandle = mDom(cropBox, { cursor: 'nwse-resize', bg: 'red', w: sz, h: sz, right: -sz / 2, bottom: -sz / 2, rounding: '50%', position: 'absolute' });
  let isResizing = null;
  let resizeStartW;
  let resizeStartH;
  function startResize(e) {
    e.preventDefault(); evNoBubble(e);
    isResizing = e.target == wHandle ? 'w' : e.target == hHandle ? 'h' : 'wh';
    [resizeStartW, resizeStartH] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)];
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  }
  function resize(e) {
    if (!isResizing) return;
    e.preventDefault(); evNoBubble(e);
    let newWidth, newHeight;
    if (isResizing == 'w') {
      newWidth = e.clientX;
      newHeight = img.height;
    } else if (isResizing == 'h') {
      newWidth = img.width;
      newHeight = e.clientY;
    } else if (isResizing == 'wh') {
      newHeight = e.clientY;
      let aspectRatio = img.width / img.height;
      newWidth = aspectRatio * newHeight;
    }
    [img, dParent].map(x => mStyle(x, { w: newWidth, h: newHeight }));
    setRect(0, 0, newWidth, newHeight);
  }
  function stopResize() {
    isResizing = null;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    let [wnew, hnew] = [parseInt(cropBox.style.width), parseInt(cropBox.style.height)]
    redrawImage(img, dParent, 0, 0, resizeStartW, resizeStartH, wnew, hnew, () => setRect(0, 0, wnew, hnew))
  }
  function resizeTo(wnew, hnew) {
    if (hnew == 0) hnew = img.height;
    if (wnew == 0) {
      let aspectRatio = img.width / img.height;
      wnew = aspectRatio * hnew;
    }
    redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
  }
  let isCropping = false;
  let cropStartX;
  let cropStartY;
  function startCrop(ev) {
    ev.preventDefault();
    isCropping = true;
    let pt = getMouseCoordinates(ev);
    [cropStartX, cropStartY] = [pt.x, pt.y - 24];
    document.addEventListener('mousemove', crop); //cropCenter);
    document.addEventListener('mouseup', stopCrop);
  }
  function crop(ev) {
    ev.preventDefault();
    if (isCropping) {
      evNoBubble(ev);
      let pt = getMouseCoordinates(ev);
      let [mouseX, mouseY] = [pt.x, pt.y];
      const width = Math.abs(mouseX - cropStartX);
      const height = Math.abs(mouseY - cropStartY);
      const left = Math.min(mouseX, cropStartX);
      const top = Math.min(mouseY, cropStartY);
      setRect(left, top, width, height);
    }
  }
  function cropX(e) {
    e.preventDefault();
    if (isCropping) {
      const mouseX = e.clientX - dParent.offsetLeft;
      const mouseY = e.clientY - dParent.offsetTop;
      const width = Math.abs(mouseX - cropStartX);
      const height = 300;
      const left = Math.min(mouseX, cropStartX);
      const top = 0;
      setRect(left, top, width, height);
    }
  }
  function cropCenter(e) {
    e.preventDefault();
    if (isCropping) {
      const mouseX = e.clientX - dParent.offsetLeft;
      const mouseY = e.clientY - dParent.offsetTop;
      const radiusX = Math.abs(mouseX - cropStartX);
      const radiusY = Math.abs(mouseY - cropStartY);
      const centerX = cropStartX;
      const centerY = cropStartY;
      const width = radiusX * 2;
      const height = radiusY * 2;
      const left = centerX - radiusX;
      const top = centerY - radiusY;
      setRect(left, top, width, height);
    }
  }
  function stopCrop() {
    isCropping = false;
    document.removeEventListener('mousemove', crop);
    document.removeEventListener('mouseup', stopCrop);
  }
  function cropImage() {
    let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
    redrawImage(img, dParent, x, y, w, h, w, h, () => setRect(0, 0, w, h))
  }
  function cropTo(wnew, hnew) {
    let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
    let xnew = x + (wnew - w) / 2;
    let ynew = y + (hnew - h) / 2;
    redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
  }
  let isPanning = false;
  let panStartX;
  let panStartY;
  let cboxX;
  let cboxY;
  function startPan(e) {
    e.preventDefault(); evNoBubble(e);
    isPanning = true;
    panStartX = e.clientX - dParent.offsetLeft;
    panStartY = e.clientY - dParent.offsetTop;
    cboxX = parseInt(cropBox.style.left)
    cboxY = parseInt(cropBox.style.top)
    document.addEventListener('mousemove', pan); //cropCenter);
    document.addEventListener('mouseup', stopPan);
  }
  function pan(e) {
    e.preventDefault();
    if (isPanning) {
      evNoBubble(e);
      const mouseX = e.clientX - dParent.offsetLeft;
      const mouseY = e.clientY - dParent.offsetTop;
      let diffX = panStartX - mouseX;
      let diffY = panStartY - mouseY;
      const left = cboxX - diffX
      const top = cboxY - diffY
      setRect(left, top, parseInt(cropBox.style.width), parseInt(cropBox.style.height));
    }
  }
  function stopPan() {
    isPanning = false;
    document.removeEventListener('mousemove', crop);
    document.removeEventListener('mouseup', stopCrop);
  }
  function getRect() { return ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x])); }
  function setRect(left, top, width, height) {
    mStyle(cropBox, { left: left, top: top, w: width, h: height });
    messageBox.innerHTML = `size: ${Math.round(width)} x ${Math.round(height)}`;
    mStyle(centerBox, { left: width / 2 - 5, top: height / 2 - 5 });
  }
  function show_cropbox() { cropBox.style.display = 'block' }
  function hide_cropbox() { cropBox.style.display = 'none' }
  function setSize(wnew, hnew) {
    if (isList(wnew)) [wnew, hnew] = wnew;
    if (wnew == 0 || hnew == 0) {
      setRect(0, 0, worig, horig);
      return;
    }
    let [x, y, w, h] = getRect();
    let [cx, cy] = [x + w / 2, y + h / 2];
    let [xnew, ynew] = [cx - (wnew / 2), cy - (hnew / 2)];
    setRect(xnew, ynew, wnew, hnew);
  }
  wHandle.addEventListener('mousedown', startResize);
  hHandle.addEventListener('mousedown', startResize);
  whHandle.addEventListener('mousedown', startResize);
  cropBox.addEventListener('mousedown', startCrop);
  messageBox.addEventListener('mousedown', startPan);
  setRect(0, 0, worig, horig);
  return {
    cropBox: cropBox,
    dParent: dParent,
    elem: cropBox,
    img: img,
    messageBox: messageBox,
    crop: cropImage,
    getRect: getRect,
    hide: hide_cropbox,
    resizeTo: resizeTo,
    setRect: setRect,
    setSize: setSize,
    show: show_cropbox,
  }
}
function mDatalist(dParent, list, opts = {}) {
  var mylist = list;
  var opts = opts;
  addKeys({ alpha: true, filter: 'contains' }, opts);
  let d = mDiv(toElem(dParent));
  let optid = getUID('dl');
  let inp = mDom(d, { w: 180, maleft: 4 }, { tag: 'input', className: 'input', placeholder: valf(opts.placeholder, '') });
  if (isdef(opts.value)) inp.value = opts.value;
  let datalist = mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  var elem = d;
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.onupdate) {
    inp.addEventListener('keyup', opts.onupdate);
  } else if (isdef(opts.edit)) {
    inp.onmousedown = () => inp.value = '';
  } else {
    inp.onblur = () => {
      const isValueSelected = list.includes(inp.value);
      if (!isValueSelected) {
        inp.value = inp.getAttribute('prev_value'); // Restore the previous value if no selection is made
      }
    }
    inp.onmousedown = () => { inp.setAttribute('prev_value', inp.value); inp.value = ''; }
  }
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}
function mDataTable(reclist, dParent, rowstylefunc, headers, id, showheaders = true) {
  if (nundef(headers)) headers = get_keys(reclist[0]);
  let t = mTable(dParent, headers, showheaders);
  if (isdef(id)) t.id = `t${id}`;
  let rowitems = [];
  let i = 0;
  for (const u of reclist) {
    let rid = isdef(id) ? `r${id}_${i}` : null;
    r = mTableRow(t, u, headers, rid);
    if (isdef(rowstylefunc)) mStyle(r.div, rowstylefunc(u));
    rowitems.push({ div: r.div, colitems: r.colitems, o: u, id: rid, index: i });
    i++;
  }
  return { div: t, rowitems: rowitems };
}
function mDiv(dParent, styles, id, inner, classes, sizing) {
  dParent = toElem(dParent);
  let d = mCreate('div');
  if (dParent) mAppend(dParent, d);
  if (isdef(styles)) mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  if (isdef(id)) d.id = id;
  if (isdef(inner)) d.innerHTML = inner;
  if (isdef(sizing)) { setRect(d, sizing); }
  return d;
}
function mDom(dParent, styles = {}, opts = {}) {
  let tag = valf(opts.tag, 'div');
  let d = document.createElement(tag);
  if (isdef(dParent)) mAppend(dParent, d);
  if (tag == 'textarea') styles.wrap = 'hard';
  const aliases = {
    classes: 'className',
    inner: 'innerHTML',
    html: 'innerHTML',
    w: 'width',
    h: 'height',
  };
  for (const opt in opts) {
    let name = valf(aliases[opt], opt), val = opts[opt];
    if (['style', 'tag', 'innerHTML', 'className', 'checked', 'value'].includes(name) || name.startsWith('on')) d[name] = val;
    else d.setAttribute(name, val);
  }
  mStyle(d, styles);
  return d;
}
function mDropZone(dropZone, onDrop) {
  dropZone.setAttribute('allowDrop', true)
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = ev => {
        onDrop(ev.target.result);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function mDropZone1(dropZone, onDrop) {
  dropZone.addEventListener('dragover', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #007bff';
  });
  dropZone.addEventListener('dragleave', function (event) {
    event.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
  });
  dropZone.addEventListener('drop', function (evDrop) {
    evDrop.preventDefault();
    dropZone.style.border = '2px dashed #ccc';
    const files = evDrop.dataTransfer.files;
    if (files.length > 0) {
      const reader = new FileReader();
      reader.onload = evReader => {
        onDrop(evReader.target.result, dropZone);
      };
      reader.readAsDataURL(files[0]);
    }
  });
  return dropZone;
}
function mDummyFocus() {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  mBy('dummy').focus();
}
function measureElement(el) {
  let info = window.getComputedStyle(el, null);
  return { w: info.width, h: info.height };
}
function measureFieldset(fs) {
  let legend = fs.firstChild;
  let r = getRect(legend);
  let labels = fs.getElementsByTagName('label');
  let wmax = 0;
  for (const l of labels) {
    let r1 = getRect(l);
    wmax = Math.max(wmax, r1.w);
  }
  let wt = r.w;
  let wo = wmax + 24;
  let diff = wt - wo;
  if (diff >= 10) {
    for (const l of labels) { let d = l.parentNode; mStyle(d, { maleft: diff / 2 }); }
  }
  let wneeded = Math.max(wt, wo) + 10;
  mStyle(fs, { wmin: wneeded });
  for (const l of labels) { let d = l.parentNode; mStyle(l, { display: 'inline-block', wmin: 50 }); mStyle(d, { wmin: wneeded - 40 }); }
}
function measureHeight(elem) { return mGetStyle(elem, 'h') }
function measureHeightOfTextStyle(dParent, styles = {}) {
  let d = mDom(dParent, styles, { html: 'Hql' });
  let s = measureElement(d);
  d.remove();
  return firstNumber(s.h);
}
function measureWidth(elem) { return mGetStyle(elem, 'w') }
function menuCloseCurrent(menu) {
  let curKey = lookup(menu, ['cur']);
  if (curKey) {
    let cur = menu.commands[curKey];
    mClassRemove(iDiv(cur), 'activeLink'); //unselect cur command
    cur.close();
  }
}
function menuCommand(dParent, menuKey, key, html, open, close) {
  let cmd = mCommand(dParent, key, html, open, close);
  let a = iDiv(cmd);
  a.setAttribute('key', `${menuKey}_${key}`);
  a.onclick = onclickMenu;
  cmd.menuKey = menuKey;
  return cmd;
}
function menuDisable(menu, key) { mClass(iDiv(menu.commands[key]), 'disabled') }
function menuEnable(menu, key) { mClassRemove(iDiv(menu.commands[key]), 'disabled') }
async function menuOpen(menu, key) {
  let cmd = menu.commands[key];
  menu.cur = key;
  mClass(iDiv(cmd), 'activeLink'); //console.log('cmd',cmd)
  await cmd.open();
}
function mergeArrays(target, source) {
  function getKey(item) { return item.key || item.id || item.name; }
  const merged = Array.from(target);
  const keyMap = {};
  target.forEach((item, index) => {
    const itemKey = getKey(item);
    if (itemKey) keyMap[itemKey] = index;
  });
  source.forEach((item) => {
    const itemKey = getKey(item);
    if (itemKey && keyMap[itemKey] !== undefined) {
      merged[keyMap[itemKey]] = deepMerge(target[keyMap[itemKey]], item);
    } else {
      merged.push(item);
    }
  });
  return merged;
}
function mergeDynSetNodes(o) {
  let merged = {};
  let interpool = null;
  for (const nodeId in o.RSG) {
    let node = jsCopy(dynSpec[nodeId]);
    let pool = node.pool;
    if (pool) {
      if (!interpool) interpool = pool;
      else interpool = intersection(interpool, pool);
    }
    merged = deepmerge(merged, node);
  }
  merged.pool = interpool;
  return merged;
}
function mergeIncludingPrototype(oid, o) {
  let merged = mergeDynSetNodes(o);
  merged.oid = oid;
  let t = merged.type;
  let info;
  if (t && PROTO[t]) {
    info = deepmerge(merged, jsCopy(PROTO[t]));
  } else info = merged;
  return info;
}
function mergeObject(target, source, optionsArgument) {
  var destination = {}
  if (isMergeableObject(target)) {
    Object.keys(target).forEach(function (key) {
      destination[key] = cloneIfNecessary(target[key], optionsArgument)
    })
  }
  Object.keys(source).forEach(function (key) {
    if (!isMergeableObject(source[key]) || !target[key]) {
      destination[key] = cloneIfNecessary(source[key], optionsArgument)
    } else {
      destination[key] = deepmerge(target[key], source[key], optionsArgument)
    }
  })
  return destination;
}
function mergeOverride(base, drueber) { return _deepMerge(base, drueber, { arrayMerge: _overwriteMerge }); }
function mergeOverrideArrays(base, drueber) {
  return deepmerge(base, drueber, { arrayMerge: overwriteMerge });
}
function mExists(d) { return isdef(toElem(d)); }
function mFlex(d, or = 'h') {
  d = toElem(d);
  d.style.display = 'flex';
  d.style.flexFlow = (or == 'v' ? 'column' : 'row') + ' ' + (or == 'w' ? 'wrap' : 'nowrap');
}
function mFlexV(d) { mStyle(d, { display: 'flex', 'align-items': 'center' }); }
function mFlexVWrap(d) { mStyle(d, { display: 'flex', 'align-items': 'center', 'flex-flow': 'row wrap' }); }
function mFlexWrap(d) { mFlex(d, 'w'); }
function mGadget(name, styles = {}, opts = {}) {
  let d = document.body;
  let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
  addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
  let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
  let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  return { name, dialog, form, inp }
}
async function mGather(dAnchor, styles = {}, opts = {}) {
  return new Promise((resolve, _) => {
    let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];
    let d = document.body;
    let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });
    let rect = dAnchor.getBoundingClientRect();
    let [v, h] = [align[0], align[1]];
    let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
    let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };
    let formStyles = { position: 'absolute' };
    addKeys(vPos, formStyles);
    addKeys(hPos, formStyles);
    let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
    dialog.addEventListener('mouseup', ev => {
      if (isPointOutsideOf(form, ev.clientX, ev.clientY)) {
        resolve(null);
        dialog.remove();
      }
    });
    dialog.addEventListener('keydown', ev => { if (ev.key === 'Escape') { dialog.remove(); resolve(null); } });
    let evalFunc;
    if (type == 'multi') evalFunc = uiGadgetTypeMulti(form, content, styles, opts);
    else if (type == 'text') evalFunc = uiGadgetTypeText(form, content, styles, opts);
    else if (type == 'yesno') evalFunc = uiGadgetTypeYesNo(form, content, styles, opts);
    else if (type == 'select') evalFunc = uiGadgetTypeSelect(form, content, styles, opts);
    else if (type == 'checklist') evalFunc = uiGadgetTypeCheckList(form, content, styles, opts);
    else if (type == 'checklistinput') evalFunc = uiGadgetTypeCheckListInput(form, content, styles, opts);
    dialog.showModal();
    form.onsubmit = (ev) => {
      ev.preventDefault();
      let val = evalFunc();
      dialog.remove();
      resolve(val);
    };
  });
}
async function mGetFiles(dir) {
  let server = getServerurl();
  let data = await mGetJsonCors(`${server}/filenames?directory=${dir}`);
  return data.files;
}
async function mGetJsonCors(url) {
  let res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors' // Set CORS mode to enable cross-origin requests
  });
  let json = await res.json();
  return json;
}
async function mGetRoute(route, o = {}) {
  let server = getServerurl();
  server += `/${route}?`;
  for (const k in o) { server += `${k}=${o[k]}&`; }
  const response = await fetch(server, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
  });
  return tryJSONParse(await response.text());
}
function mGetStyle(elem, prop) {
  let val;
  elem = toElem(elem);
  if (prop == 'bg') { val = getStyleProp(elem, 'background-color'); if (isEmpty(val)) return getStyleProp(elem, 'background'); }
  else if (isdef(STYLE_PARAMS[prop])) { val = getStyleProp(elem, STYLE_PARAMS[prop]); }
  else {
    switch (prop) {
      case 'vmargin': val = stringBefore(elem.style.margin, ' '); break;
      case 'hmargin': val = stringAfter(elem.style.margin, ' '); break;
      case 'vpadding': val = stringBefore(elem.style.padding, ' '); break;
      case 'hpadding': val = stringAfter(elem.style.padding, ' '); break;
      case 'box': val = elem.style.boxSizing; break;
      case 'dir': val = elem.style.flexDirection; break;
    }
  }
  if (nundef(val)) val = getStyleProp(elem, prop);
  if (val.endsWith('px')) return firstNumber(val); else return val;
}
function mGetStyles(elem, proplist) {
  let res = {};
  for (const p of proplist) { res[p] = mGetStyle(elem, p) }
  return res;
}
async function mGetYaml(path = '../base/assets/m.txt') {
  let res = await fetch(path);
  let text = await res.text();
  let di = jsyaml.load(text);
  return di;
}
function mGrid(rows, cols, dParent, styles = {}) {
  addKeys({ display: 'inline-grid', gridCols: 'repeat(' + cols + ',1fr)' }, styles);
  if (rows) styles.gridRows = 'repeat(' + rows + ',auto)';
  else styles.overy = 'auto';
  let d = mDiv(dParent, styles);
  return d;
}
function mGridFromElements(dParent, elems, maxHeight, numColumns) {
  dParent.innerHTML = '';
  let cols = `repeat(${numColumns}, 1fr)`; //'repeat(auto-fill, minmax(0, 1fr))';
  let grid = mDom(dParent, { display: 'inline-grid', gridCols: cols, gap: 10, padding: 4, overy: 'auto', hmax: maxHeight })
  elems.forEach(x => mAppend(grid, x));
  return grid;
}
function mGridFromItems(dParent, items, maxHeight, numColumns) { return mGridFromElements(dParent, items.map(x => iDiv(x)), maxHeight, numColumns); }
function mHasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  else {
    let x = !!el.className;
    return isString(x) && !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  }
}
function mIfNotRelative(d) { d=toElem(d);if (isEmpty(d.style.position)) d.style.position = 'relative'; }

function mInput(dParent, styles, id, placeholder, classtr = 'input', tabindex = null, value = '', selectOnClick = false, type = "text") {
  let html = `<input type="${type}" autocomplete="off" ${selectOnClick ? 'onclick="this.select();"' : ''} id=${id} class="${classtr}" placeholder="${valf(placeholder, '')}" tabindex="${tabindex}" value="${value}">`;
  let d = mAppend(dParent, mCreateFrom(html));
  if (isdef(styles)) mStyle(d, styles);
  return d;
}
function mItem(liveprops = {}, opts = {}) {
  let id = valf(opts.id, getUID());
  let item = opts;
  item.live = liveprops;
  item.id = id;
  let d = iDiv(item); if (isdef(d)) d.id = id;
  Items[id] = item;
  return item;
}
function mixColors(color1, color2, weight) {
  const hex1 = color1.substring(1);
  const hex2 = color2.substring(1);
  const r1 = parseInt(hex1.substring(0, 2), 16);
  const g1 = parseInt(hex1.substring(2, 4), 16);
  const b1 = parseInt(hex1.substring(4, 6), 16);
  const r2 = parseInt(hex2.substring(0, 2), 16);
  const g2 = parseInt(hex2.substring(2, 4), 16);
  const b2 = parseInt(hex2.substring(4, 6), 16);
  const r = Math.floor(r1 * (1 - weight) + r2 * weight);
  const g = Math.floor(g1 * (1 - weight) + g2 * weight);
  const b = Math.floor(b1 * (1 - weight) + b2 * weight);
  const hex = colorHex({ r: r, g: g, b: b }); // '#' + r.toString(16) + g.toString(16) + b.toString(16);
  return hex;
}
function mLinebreak(dParent, gap) {
  dParent = toElem(dParent);
  let d;
  let display = getComputedStyle(dParent).display;
  if (display == 'flex') {
    d = mDiv(dParent, { fz: 2, 'flex-basis': '100%', h: 0, w: '100%' }, null, ' &nbsp; ');
  } else {
    d = mDiv(dParent, {}, null, '<br>');
  }
  if (isdef(gap)) { d.style.minHeight = gap + 'px'; d.innerHTML = ' &nbsp; '; d.style.opacity = .2; }
  return d;
}
function mLMR(dParent) {
  dParent = toElem(dParent);
  let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
  let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
  let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
  return [d, l, m, r];
}
function mMagnify(elem, scale = 5) {
  elem.classList.add(`topmost`);
  MAGNIFIER_IMAGE = elem;
  const rect = elem.getBoundingClientRect();
  let [w, h] = [rect.width * scale, rect.height * scale];
  let [cx, cy] = [rect.width / 2 + rect.left, rect.height / 2 + rect.top];
  let [l, t, r, b] = [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
  let originX = 'center';
  let originY = 'center';
  let [tx, ty] = [0, 0];
  if (l < 0) { tx = -l / scale; }
  if (t < 0) { ty = -t / scale; }
  if (r > window.innerWidth) { tx = -(r - window.innerWidth) / scale; }
  if (b > window.innerHeight) { ty = -(b - window.innerHeight) / scale; }
  elem.style.transform = `scale(${scale}) translate(${tx}px,${ty}px)`;
  elem.style.transformOrigin = `${originX} ${originY}`;
}
function mMagnifyOff() {
  if (!MAGNIFIER_IMAGE) return;
  let elem = MAGNIFIER_IMAGE;
  MAGNIFIER_IMAGE = null;
  elem.classList.remove(`topmost`); //magnify4`); 
  elem.style.transform = null;
}
function mMenu(dParent, key) { let [d, l, m, r] = mLMR(dParent); return { dParent, elem: d, l, m, r, key, cur: null }; }
function mNewline(d, gap = 1) { mDom(d, { h: gap }); }
async function mOnclick(menu) {
  UI.nav.activate(menu);
  if (isdef(menu)) await window[`onclick${capitalize(menu)}`](); //eval(`onclick${capitalize(menu)}()`);}
}
function mOnEnter(elem, setter) {
  elem.addEventListener('keydown', ev => {
    if (ev.key == 'Enter') {
      ev.preventDefault();
      mDummyFocus();
      if (setter) setter(ev);
    }
  });
}
function mPlace(elem, pos, offx, offy) {
  elem = toElem(elem);
  pos = pos.toLowerCase();
  let dParent = elem.parentNode; mIfNotRelative(dParent);
  let vert = valf(offx, 0);
  let hor = isdef(offy) ? offy : vert;
  if (pos[0] == 'c' || pos[1] == 'c') {
    let dpp = dParent.parentNode;
    let opac = mGetStyle(dParent, 'opacity'); console.log('opac', opac);
    if (nundef(dpp)) { mAppend(document.body, dParent); mStyle(dParent, { opacity: 0 }) }
    let rParent = getRect(dParent);
    let [wParent, hParent] = [rParent.w, rParent.h];
    let rElem = getRect(elem);
    let [wElem, hElem] = [rElem.w, rElem.h];
    if (nundef(dpp)) { dParent.remove(); mStyle(dParent, { opacity: valf(opac, 1) }) }
    switch (pos) {
      case 'cc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert + (hParent - hElem) / 2 }); break;
      case 'tc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert }); break;
      case 'bc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, bottom: vert }); break;
      case 'cl': mStyle(elem, { position: 'absolute', left: hor, top: vert + (hParent - hElem) / 2 }); break;
      case 'cr': mStyle(elem, { position: 'absolute', right: hor, top: vert + (hParent - hElem) / 2 }); break;
    }
    return;
  }
  let di = { t: 'top', b: 'bottom', r: 'right', l: 'left' };
  elem.style.position = 'absolute';
  elem.style[di[pos[0]]] = hor + 'px'; elem.style[di[pos[1]]] = vert + 'px';
}
function mPos(d, x, y, unit = 'px') { mStyle(d, { left: x, top: y, position: 'absolute' }, unit); }
async function mPostRoute(route, o = {}) {
  let server = getServerurl();
  server += `/${route}`;
  const response = await fetch(server, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(o)
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return 'ERROR 1';
  }
}
async function mPrompt(gadget) {
  return new Promise((resolve, reject) => {
    gadget.dialog.showModal();
    gadget.form.onsubmit = (ev) => {
      ev.preventDefault();
      resolve(gadget.inp.value);
      gadget.inp.value = '';
      gadget.dialog.close();
    };
  });
}
function mRadio(label, val, name, dParent, styles = {}, handler, group_id, is_on) {
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
  if (isdef(handler)) {
    inp.onclick = ev => {
      ev.cancelBubble = true;
      if (handler == 'toggle') {
      } else if (isdef(handler)) {
        handler(val);
      }
    };
  }
  return d;
}
function mRadioGroup(dParent, styles, id, legend, legendstyles) {
  let f = mCreate('fieldset');
  f.id = id;
  if (isdef(styles)) mStyle(f, styles);
  if (isdef(legend)) {
    let l = mCreate('legend');
    l.innerHTML = legend;
    mAppend(f, l);
    if (isdef(legendstyles)) { mStyle(l, legendstyles); }
  }
  mAppend(dParent, f);
  return f;
}
function mRemove(elem) {
  elem = toElem(elem); if (nundef(elem)) return;
  var a = elem.attributes, i, l, n;
  if (a) {
    for (i = a.length - 1; i >= 0; i -= 1) {
      n = a[i].name;
      if (typeof elem[n] === 'function') {
        elem[n] = null;
      }
    }
  }
  a = elem.childNodes;
  if (a) {
    l = a.length;
    for (i = a.length - 1; i >= 0; i -= 1) {
      mRemove(elem.childNodes[i]);
    }
  }
  elem.remove();
}
function mRemoveClass(d) { for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mRemoveIfExists(d) { d = toElem(d); if (isdef(d)) d.remove(); }
function mRise(d, ms = 800) {
  toElem(d).animate([{ opacity: 0, transform: 'translateY(50px)' }, { opacity: 1, transform: 'translateY(0px)' },], { fill: 'both', duration: ms, easing: 'ease' });
}
function mRows100(dParent, spec, gap = 4) {
  let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
  grid.style.gridTemplateRows = spec;
  let res = [];
  for (const i of range(stringCount(spec, ' ') + 1)) {
    let d = mDiv(grid, { h: '100%', w: '100%', box: true })
    res.push(d);
  }
  return res;
}
function mShield(dParent, styles = { bg: '#00000020' }, id = null, classnames = null, hideonclick = false) {
  dParent = toElem(dParent);
  let d = mDiv(dParent, styles, id, classnames);
  lookupAddIfToList(DA, ['shields'], d);
  mIfNotRelative(dParent);
  mStyle(d, { position: 'absolute', left: 0, top: 0, w: '100%', h: '100%' });
  if (hideonclick) d.onclick = ev => { evNoBubble(ev); d.remove(); };
  else d.onclick = ev => { evNoBubble(ev); };
  mClass(d, 'topmost');
  return d;
}
async function mSleep(ms = 1000) {
  return new Promise(
    (res, rej) => {
      if (ms > 10000) { ms = 10000; }
      if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
      TO.SLEEPTIMEOUT = setTimeout(res, ms);
    });
}
function mStyle(elem, styles = {}, unit = 'px') {
  elem = toElem(elem);
  let style = styles = jsCopy(styles);
  if (isdef(styles.w100)) style.w = '100%';
  if (isdef(styles.h100)) style.h = '100%';
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
  }
  if (isdef(styles.vpadding) || isdef(styles.hpadding)) {
    styles.padding = valf(styles.vpadding, 0) + unit + ' ' + valf(styles.hpadding, 0) + unit;
  }
  if (isdef(styles.vmargin) || isdef(styles.hmargin)) {
    styles.margin = valf(styles.vmargin, 0) + unit + ' ' + valf(styles.hmargin, 0) + unit;
  }
  if (isdef(styles.upperRounding) || isdef(styles.lowerRounding)) {
    let rtop = '' + valf(styles.upperRounding, 0) + unit;
    let rbot = '' + valf(styles.lowerRounding, 0) + unit;
    styles['border-radius'] = rtop + ' ' + rtop + ' ' + rbot + ' ' + rbot;
  }
  if (isdef(styles.box)) styles['box-sizing'] = 'border-box';
  if (isdef(styles.round)) { elem.style.setProperty('border-radius', '50%'); }
  for (const k in styles) {
    if (['round', 'box'].includes(k)) continue;
    let val = styles[k];
    let key = k;
    if (isdef(STYLE_PARAMS[k])) key = STYLE_PARAMS[k];
    else if (k == 'font' && !isString(val)) {
      let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
      let ff = f.family;
      let fv = f.variant;
      let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
      let fs = isdef(f.italic) ? 'italic' : f.style;
      if (nundef(fz) || nundef(ff)) return null;
      let s = fz + ' ' + ff;
      if (isdef(fw)) s = fw + ' ' + s;
      if (isdef(fv)) s = fv + ' ' + s;
      if (isdef(fs)) s = fs + ' ' + s;
      elem.style.setProperty(k, s);
      continue;
    } else if (k.includes('class')) {
      mClass(elem, styles[k]);
    } else if (k == 'border') {
      if (isNumber(val)) val = `solid ${val}px ${isdef(styles.fg) ? styles.fg : '#ffffff80'}`;
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    } else if (k == 'ajcenter') {
      elem.style.setProperty('justify-content', 'center');
      elem.style.setProperty('align-items', 'center');
    } else if (k == 'layout') {
      if (val[0] == 'f') {
        val = val.slice(1);
        elem.style.setProperty('display', 'flex');
        elem.style.setProperty('flex-wrap', 'wrap');
        let hor, vert;
        if (val.length == 1) hor = vert = 'center';
        else {
          let di = { c: 'center', s: 'start', e: 'end' };
          hor = di[val[1]];
          vert = di[val[2]];
        }
        let justStyle = val[0] == 'v' ? vert : hor;
        let alignStyle = val[0] == 'v' ? hor : vert;
        elem.style.setProperty('justify-content', justStyle);
        elem.style.setProperty('align-items', alignStyle);
        switch (val[0]) {
          case 'v': elem.style.setProperty('flex-direction', 'column'); break;
          case 'h': elem.style.setProperty('flex-direction', 'row'); break;
        }
      } else if (val[0] == 'g') {
        val = val.slice(1);
        elem.style.setProperty('display', 'grid');
        let n = allNumbers(val);
        let cols = n[0];
        let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
        elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
        elem.style.setProperty('place-content', 'center');
      }
    } else if (k == 'layflex') {
      elem.style.setProperty('display', 'flex');
      elem.style.setProperty('flex', '0 1 auto');
      elem.style.setProperty('flex-wrap', 'wrap');
      if (val == 'v') { elem.style.setProperty('writing-mode', 'vertical-lr'); }
    } else if (k == 'laygrid') {
      elem.style.setProperty('display', 'grid');
      let n = allNumbers(val);
      let cols = n[0];
      let w = n.length > 1 ? '' + n[1] + 'px' : 'auto';
      elem.style.setProperty('grid-template-columns', `repeat(${cols}, ${w})`);
      elem.style.setProperty('place-content', 'center');
    }
    if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
    else if (key == 'background-color') elem.style.background = bg;
    else if (key == 'color') elem.style.color = fg;
    else if (key == 'opacity') elem.style.opacity = val;
    else if (key == 'wrap') { if (val == 'hard') elem.setAttribute('wrap', 'hard'); else elem.style.flexWrap = 'wrap'; }
    else if (k.startsWith('dir')) {
      isCol = val[0] == 'c';
      elem.style.setProperty('flex-direction', 'column');
    } else if (key == 'flex') {
      if (isNumber(val)) val = '' + val + ' 1 0%';
      elem.style.setProperty(key, makeUnitString(val, unit));
    } else {
      elem.style.setProperty(key, makeUnitString(val, unit));
    }
  }
}
function mStyleX(elem, styles, unit = 'px') {
  const paramDict = {
    bg: 'background-color',
    fg: 'color',
    align: 'text-align',
    matop: 'margin-top',
    maleft: 'margin-left',
    mabottom: 'margin-bottom',
    maright: 'margin-right',
    patop: 'padding-top',
    paleft: 'padding-left',
    pabottom: 'padding-bottom',
    paright: 'padding-right',
    rounding: 'border-radius',
    w: 'width',
    h: 'height',
    fontSize: 'font-size',
    fz: 'font-size',
    family: 'font-family',
    weight: 'font-weight',
  };
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = getExtendedColors(styles.bg, styles.fg);
  }
  if (isdef(styles.vmargin) && isdef(styles.hmargin)) {
    styles.margin = vmargin + unit + ' ' + hmargin + unit;
  }
  if (isdef(styles.vpadding) && isdef(styles.hpadding)) {
    styles.padding = vpadding + unit + ' ' + hpadding + unit;
  }
  for (const k in styles) {
    let val = styles[k];
    let key = k;
    if (isdef(paramDict[k])) key = paramDict[k];
    else if (k == 'font' && !isString(val)) {
      let fz = f.size; if (isNumber(fz)) fz = '' + fz + 'px';
      let ff = f.family;
      let fv = f.variant;
      let fw = isdef(f.bold) ? 'bold' : isdef(f.light) ? 'light' : f.weight;
      let fs = isdef(f.italic) ? 'italic' : f.style;
      if (nundef(fz) || nundef(ff)) return null;
      let s = fz + ' ' + ff;
      if (isdef(fw)) s = fw + ' ' + s;
      if (isdef(fv)) s = fv + ' ' + s;
      if (isdef(fs)) s = fs + ' ' + s;
      elem.style.setProperty(k, s);
      continue;
    } else if (k == 'border') {
      if (val.indexOf(' ') < 0) val = 'solid 1px ' + val;
    }
    if (key == 'font-weight') { elem.style.setProperty(key, val); continue; }
    else if (key == 'background-color') elem.style.background = bg;
    else if (key == 'color') elem.style.color = fg;
    else {
      elem.style.setProperty(key, makeUnitString(val, unit));
    }
  }
}
function mSym(key, dParent, styles = {}, pos, classes) {
  let info = Syms[key];
  styles.display = 'inline-block';
  let family = info.family;
  styles.family = family;
  let sizes;
  if (isdef(styles.sz)) { sizes = mSymSizeToBox(info, styles.sz, styles.sz); }
  else if (isdef(styles.w) && isdef(styles.h)) { sizes = mSymSizeToBox(info, styles.w, styles.h); }
  else if (isdef(styles.fz)) { sizes = mSymSizeToFz(info, styles.fz); }
  else if (isdef(styles.h)) { sizes = mSymSizeToH(info, styles.h); }
  else if (isdef(styles.w)) { sizes = mSymSizeToW(info, styles.w); }
  else { sizes = mSymSizeToFz(info, 25); }
  styles.fz = sizes.fz;
  styles.w = sizes.w;
  styles.h = sizes.h;
  styles.align = 'center';
  if (isdef(styles.bg) && info.family != 'emoNoto') { styles.fg = styles.bg; delete styles.bg; }
  let x = mDiv(dParent, styles, null, info.text);
  if (isdef(classes)) mClass(x, classes);
  if (isdef(pos)) { mPlace(x, pos); }
  return x;
}
function mSymSizeToBox(info, w, h) {
  let fw = w / info.w;
  let fh = h / info.h;
  let f = Math.min(fw, fh);
  return { fz: 100 * f, w: info.w * f, h: info.h * f };
}
function mSymSizeToFz(info, fz) { let f = fz / 100; return { fz: fz, w: info.w * f, h: info.h * f }; }
function mSymSizeToH(info, h) { let f = h / info.h; return { fz: 100 * f, w: info.w * f, h: h }; }
function mSymSizeToW(info, w) { let f = w / info.w; return { fz: 100 * f, w: w, h: info.h * f }; }
function mTable(dParent, headers, showheaders, styles = { mabottom: 0 }, className = 'table') {
  let d = mDiv(dParent);
  let t = mCreate('table');
  mAppend(d, t);
  if (isdef(className)) mClass(t, className);
  if (isdef(styles)) mStyle(t, styles);
  if (showheaders) {
    let code = `<tr>`;
    for (const h of headers) {
      code += `<th>${h}</th>`
    }
    code += `</tr>`;
    t.innerHTML = code;
  }
  return t;
}
function mTableCol(r, val) {
  let col = mCreate('td');
  mAppend(r, col);
  if (isdef(val)) col.innerHTML = val;
  return col;
}
function mTableCommandify(rowitems, di) {
  for (const item of rowitems) {
    for (const index in di) {
      let colitem = item.colitems[index];
      colitem.div.innerHTML = di[index](item, colitem.val);
    }
  }
}
function mTableRow(t, o, headers, id) {
  let elem = mCreate('tr');
  if (isdef(id)) elem.id = id;
  mAppend(t, elem);
  let colitems = [];
  for (const k of headers) {
    let val = isdef(o[k]) ? isDict(o[k]) ? JSON.stringify(o[k]) : isList(o[k]) ? o[k].join(', ') : o[k] : '';
    let col = mTableCol(elem, val);
    colitems.push({ div: col, key: k, val: val });
  }
  return { div: elem, colitems: colitems };
}
function mTableStylify(rowitems, di) {
  for (const item of rowitems) {
    for (const index in di) {
      let colitem = item.colitems[index];
      mStyle(colitem.div, di[index]);
    }
  }
}
function mText(text, dParent, styles, classes) {
  if (!isString(text)) text = text.toString();
  let d = mDiv(dParent);
  if (!isEmpty(text)) { d.innerHTML = text; }
  if (isdef(styles)) mStyle(d, styles);
  if (isdef(classes)) mClass(d, classes);
  return d;
}
function mTextArea100(dParent, styles = {}) {
  mCenterCenterFlex(dParent)
  let html = `<textarea style="width:100%;height:100%;box-sizing:border-box" wrap="hard"></textarea>`;
  let t = mCreateFrom(html);
  mStyle(t, styles);
  mAppend(dParent, t);
  return t;
}
function name2id(name) { return 'd_' + name.split(' ').join('_'); }
function nextBar(ctx, rest, color) {
  list = rest;
  let val = findMostFrequentVal(list, 'x');
  rest = list.filter(p => !isWithinDelta(p.x, val, 2));
  let line = getBar(ctx, list, val);
  line.map(p => drawPix(ctx, p.x, p.y, color));
  return { val, line, rest, color };
}
function nextLine(ctx, rest, color) {
  list = rest;
  let val = findMostFrequentVal(list, 'y');
  rest = list.filter(p => !isWithinDelta(p.y, val, 2));
  let line = getLine(ctx, list, val);
  if (line) line.map(p => drawPix(ctx, p.x, p.y, color));
  return { val, line, rest, color };
}
function normalizeString(s, sep = '_') {
  s = s.toLowerCase().trim();
  let res = '';
  for (let i = 0; i < s.length; i++) { if (isAlphaNum(s[i])) res += s[i]; else res += sep; }
  return res;
}
function nundef(x) { return x === null || x === undefined; }
async function onclickAddCategory() {
  let selist = UI.selectedImages;
  let keys = selist.map(x => stringBefore(x, '@'));
  let catlist = M.categories.map(x => ({ name: x, value: false }));
  let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklist' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.split('@');
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(cats)) { console.log('nothing added'); collClearSelections(); return; }
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    for (const cat of cats) {
      if (o.cats.includes(cat)) continue;
      changed = true;
      o.cats.push(cat);
      di[key] = o;
    }
  }
  if (!changed) { console.log('nothing added'); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickAddSelected() {
  let selist = UI.selectedImages;
  let keys = selist.map(x => stringBefore(x, '@'));
  let collist = M.collections.filter(x => !collLocked(x)).map(x => ({ name: x, value: false }));
  let colls = await mGather(iDiv(UI.addSelected), {}, { content: collist, type: 'checklist' });
  if (!colls) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  colls = colls.split('@');
  colls = colls.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(colls)) { console.log('nothing added'); collClearSelections(); return; }
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    for (const collname of colls) {
      if (o.colls.includes(collname)) continue;
      changed = true;
      o.colls.push(collname);
      di[key] = o;
    }
  }
  if (!changed) { console.log('nothing added'); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickAsAvatar(ev) {
  let item = UI.selectedImages[0];
  console.log('item', item)
  let o = collKeyCollnameFromSelkey(item);
  let key = o.key;
  let m = M.superdi[key];
  U.key = key;
  let res = await postUserChange(U);
  console.log('res', res)
}
async function onclickAsSecondary(ev) {
  name = UI.collPrimary.name;
  if (name == 'all' || collLocked(name)) {
    showMessage(`ERROR! collection ${name} cannot be altered!`);
    return;
  }
  if (nundef(M.byCollection[name])) {
    showMessage(`ERROR! collection ${name} not found!`);
    return;
  }
  UI.collSecondary.name = name;
  UI.collPrimary.name = 'all';
  collOpenSecondary(4, 3);
  collOpenPrimary(4, 3);
}
async function onclickBot() {
  let name = getUname();
  let table = Clientdata.table;
  let plmode = table.fen.players[name].playmode;
  if (plmode == 'bot') return;
  let id = table.id;
  let olist = [];
  olist.push({ keys: ['fen', 'players', name, 'playmode'], val: 'bot' });
  let res = await sendMergeTable({ id, name, olist });
}
async function onclickCatListDone(ui) { ui.setAttribute('proceed', getCheckedNames(ui).join('@')); }
function onclickClear(inp, grid) {
  inp.value = '';
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]'));
  checklist.map(x => x.checked = false);
  sortCheckboxes(grid);
}
async function onclickClearPlayers() {
  let me = getUname();
  DA.playerList = [me];
  for (const name in DA.allPlayers) {
    if (name != me) unselectPlayerItem(DA.allPlayers[name]);
  }
  assertion(!isEmpty(DA.playerList), "uname removed from playerList!!!!!!!!!!!!!!!")
  DA.lastName = me;
  mRemoveIfExists('dPlayerOptions')
}
async function onclickCollClearSelections(ev) {
  let colls = [UI.collPrimary];
  if (UI.collSecondary.isOpen) colls.push(UI.collSecondary);
  for (const coll of colls) {
    for (const cell of coll.cells) {
      let d = cell.firstChild;
      collUnselect(d);
    }
  }
  UI.selectedImages = [];
  collDisableListCommands();
}
function onclickCollDone() {
  collCloseSecondary();
  UI.collPrimary.name = UI.collSecondary.name;
  collOpenPrimary(5, 7);
}
async function onclickCollections() {
  let dPanes = mDom('dMain'); mFlex(dPanes);
  let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
  let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);
  collSidebar();
  let collName = localStorage.getItem('collection');
  if (nundef(collName) || !M.collections.includes(collName)) collName = 'animals'
  UI.collPrimary = { div: dPrimary, name: collName };
  UI.collSecondary = { div: dSecondary, name: null };
  collOpenPrimary(5, 7);
}
async function onclickCollItem(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
  await clickOnItem(elem, key);
}
async function onclickCollItemLabel(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
  let collname = elem.getAttribute('collname');
  console.log('clicked', key, collname);
  let newfriendly = await mGather(ev.target);
  if (!newfriendly) return;
  if (isEmpty(newfriendly)) {
    showMessage(`ERROR: name invalid: ${newfriendly}`);
    return;
  }
  console.log('rename friendly to', newfriendly)
  let item = M.superdi[key];
  item.friendly = newfriendly;
  let resp = await mPostRoute('postUpdateItem', { key: key, item: item });
  console.log(resp);
  ev.target.innerHTML = newfriendly;
}
async function onclickCollNext(ev) {
  let coll = collFromElement(ev.target.parentNode)
  showImageBatch(coll, 1);
}
async function onclickCollPrev(ev) {
  let coll = collFromElement(ev.target.parentNode)
  showImageBatch(coll, -1);
}
async function onclickCollSelectAll(ev) {
  let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;
  for (const cell of coll.cells) {
    let d = cell.firstChild;
    if (nundef(d)) break;
    collSelect(d);
  }
  for (const k of coll.keys) {
    addIf(UI.selectedImages, collGenSelkey(k, coll.name));
  }
  collEnableListCommands();
}
async function onclickCollSelectPage(ev) {
  let coll = UI.collSecondary.isOpen ? UI.collSecondary : UI.collPrimary;
  for (const cell of coll.cells) {
    let d = cell.firstChild;
    if (nundef(d)) break;
    collSelect(d);
    let o = collKeyCollnameFromElem(d);
    addIf(UI.selectedImages, collGenSelkey(o.key, o.collname));
  }
  collEnableListCommands();
}
async function onclickCommand(ev) {
  let key = evToAttr(ev, 'key');
  assertion(isdef(UI[key]), `command ${key} not in UI!!!`)
  let cmd = UI[key];
  await cmd.open();
}
function onclickDay(d, styles) {
  let tsDay = d.id;
  let tsCreated = Date.now();
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? getUname() : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let x = uiTypeEvent(d, o, styles);
  x.inp.focus();
}
async function onclickDeleteCollection(name) {
  if (nundef(name) && UI.collSecondary.isOpen) name = UI.collSecondary.name;
  if (nundef(name)) name = await mGather(iDiv(UI.deleteCollection), 'name');
  if (!name) return;
  let proceed = await mGather(iDiv(UI.deleteCollection), {}, { type: 'yesno', content: `delete collection ${name}?` });
  if (proceed) await collDelete(name);
  if (UI.collSecondary.isOpen && UI.collSecondary.name == name) collCloseSecondary();
  if (UI.collPrimary.name == name) { UI.collPrimary.name = 'all'; collOpenPrimary(); }
}
async function onclickDeleteSelected() {
  let selist = UI.selectedImages;
  let di = {}, deletedKeys = {};
  for (const k of selist) {
    let o = collKeyCollnameFromSelkey(k);
    let key = o.key;
    let collname = o.collname;
    if (collLocked(collname)) continue;
    if (nundef(deletedKeys[collname])) deletedKeys[collname] = [];
    await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);
  }
  if (isEmpty(di) && Object.keys(deletedKeys).every(x => isEmpty(deletedKeys[x]))) {
    showMessage(`ERROR: cannot delete selected items!!!`);
    collClearSelections();
    return;
  }
  console.log('deletedKeys dict: ', deletedKeys);
  for (const k in deletedKeys) {
    let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: deletedKeys[k], collname: k });
    console.log('postUpdateSuperdi', k, res)
    di = {};
  }
  await loadAssets();
  collPostReload();
}
async function onclickDeleteTable(id) {
  let res = await mPostRoute('deleteTable', { id });
}
async function onclickEditCategories() {
  let selist = UI.selectedImages;
  let keys = selist.map(x => stringBefore(x, '@'));
  let arrs = keys.map(x => M.superdi[x].cats);
  let lst = unionOfArrays(arrs);
  let catlist = M.categories.map(x => ({ name: x, value: lst.includes(x) }));
  sortByDescending(catlist, 'value');
  let cats = await mGather(iDiv(UI.editCategories), {}, { content: catlist, type: 'checklistinput' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    if (sameList(cats, o.cats)) continue;
    changed = true;
    o.cats = cats;
    di[key] = o;
  }
  if (!changed) { console.log('categories unchanged!', cats); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickEditCollItem() {
  let selist = UI.selectedImages;
  let key = selist.map(x => stringBefore(x, '@'))[0];
  let item = M.superdi[key];
  let catlist = M.categories.map(x => ({ name: x, value: item.cats.includes(x) }));
  sortByDescending(catlist, 'value');
  let cats = await mGather(iDiv(UI.addCategory), {}, { content: catlist, type: 'checklistinput' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.split('@');
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x));
  if (sameList(item.cats, cats)) { console.log('no change'); collClearSelections(); return; }
  console.log(`cats of item ${key} set to`, cats);
  item.cats = cats;
  let di = {}; di[key] = item;
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
function onclickExistingEvent(ev) { evNoBubble(ev); showEventOpen(evToId(ev)); }
async function onclickGameMenuItem(ev) {
  let gamename = evToAttr(ev, 'gamename');
  await showGameMenu(gamename);
}
async function onclickGameMenuPlayer(ev) {
  let name = evToAttr(ev, 'username'); //console.log('name',name); return;
  let shift = ev.shiftKey;
  await showGameMenuPlayerDialog(name, shift);
}
async function onclickHome() { UI.nav.activate(); await showDashboard(); }
async function onclickHuman() {
  let name = getUname();
  let table = Clientdata.table;
  let plmode = table.fen.players[name].playmode;
  if (plmode == 'human') return;
  let id = table.id;
  let olist = [];
  olist.push({ keys: ['fen', 'players', name, 'playmode'], val: 'human' });
  let res = await sendMergeTable({ id, name, olist });
}
async function onclickJoinTable(id) {
  let table = Serverdata.tables.find(x => x.id == id);
  let me = getUname();
  assertion(table.status == 'open', 'too late to join! game has already started!')
  assertion(!table.playerNames.includes(me), `${me} already joined!!!`);
  table.players[me] = createGamePlayer(me, table.game);
  table.playerNames.push(me);
  let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
}
async function onclickLeaveTable(id) {
  let table = Serverdata.tables.find(x => x.id == id);
  let me = getUname();
  assertion(table.status == 'open', 'too late to leave! game has already started!')
  assertion(table.playerNames.includes(me), `${me} NOT in joined players!!!!`);
  delete table.players[me];
  removeInPlace(table.playerNames, me);
  let res = await mPostRoute('postTable', { id, players: table.players, playerNames: table.playerNames });
}
function onclickMenu(ev) {
  let keys = evToAttr(ev, 'key');
  let [menuKey, cmdKey] = keys.split('_');
  let menu = UI[menuKey];
  switchToMenu(menu, cmdKey);
}
async function onclickNATIONS() {
  if (nundef(M.natCards)) M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  M.civs = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
  let player = M.player = { civ: rChoose(M.civs) };
  M.ages = { 1: { events: [], progress: [] }, 2: { events: [], progress: [] }, 3: { events: [], progress: [] }, 4: { events: [], progress: [] } };
  for (const k in M.natCards) {
    let c = M.natCards[k];
    if (c.age == 0) continue;
    let age = c.age == 0 ? 1 : c.age;
    if (c.Type == 'event') M.ages[age].events.push(k); else M.ages[age].progress.push(k);
  }
  M.age = 1;
  M.events = M.ages[M.age].events;
  M.progress = M.ages[M.age].progress;
  arrShuffle(M.progress);
  arrShuffle(M.events);
  let d1 = mDiv('dMain'); mFlex(d1);
  UI.coll.rows = 3; UI.coll.cols = 7;
  let bg = getNavBg();
  let h = 180;
  let dcost = M.costGrid = mGrid(UI.coll.rows, 1, d1, { 'align-self': 'start' });
  for (let cost = 3; cost >= 1; cost--) {
    let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});
    for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
  }
  UI.coll.grid = mGrid(UI.coll.rows, UI.coll.cols, d1, { 'align-self': 'start' });
  UI.coll.cells = [];
  for (let i = 0; i < UI.coll.rows * UI.coll.cols; i++) {
    let d = mDom(UI.coll.grid, { box: true, margin: 2, h: h, overflow: 'hidden' });
    mCenterCenterFlex(d);
    UI.coll.cells.push(d);
  }
  let n = UI.coll.rows * UI.coll.cols;
  M.market = [];
  for (let i = 0; i < n; i++) {
    let k = M.progress.shift();
    M.market.push(k);
    let card = M.natCards[k];
    let img = mDom(UI.coll.cells[i], { h: h, w: 115 }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
    img.setAttribute('key', k)
    img.onclick = buyProgressCard;
  }
  mDom('dMain', { h: 20 })
  let dciv = mDom('dMain', { w: 800, h: 420, maleft: 52, bg: 'red', position: 'relative' });
  let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${player.civ}.png`, mDom(dciv, { position: 'absolute' }, { tag: 'img' }));
  M.civCells = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 7; j++) {
      let r = getCivSpot(player.civ, i, j);
      let [dx, dy, dw, dh] = [10, 10, 15, 20]
      let d = mDom(dciv, { box: true, w: r.w + dw, h: r.h + dh, left: r.x - dx, top: r.y - dy, position: 'absolute', overflow: 'hidden' });
      mCenterCenterFlex(d);
      M.civCells.push(d);
      d.onclick = () => selectCivSpot(d);
    }
  }
}
async function onclickNewCollection(name) {
  if (nundef(name)) name = await mGather(iDiv(UI.newCollection));
  if (!name) return;
  if (isEmpty(name)) {
    showMessage(`ERROR! you need to enter a valid name!!!!`);
    return;
  }
  if (collLocked(name)) {
    showMessage(`collection ${name} is Read-Only!`);
    return;
  }
  M.collections.push(name); M.collections.sort();
  UI.collSecondary.name = name;
  collOpenSecondary(4, 3);
  collOpenPrimary(4, 3);
}
async function onclickOpenToJoinGame() {
  let options = collectOptions();
  let players = collectPlayers();
  mRemove('dGameMenu');
  let t = createOpenTable(DA.gamename, players, options);
  let res = await mPostRoute('postTable', t);
}
async function onclickPlan() { await showCalendarApp(); }
async function onclickPlay() {
  await showTables('onclickPlay');
  showGames();
}
async function onclickRemoveCategory() {
  let selist = UI.selectedImages;
  let keys = selist.map(x => stringBefore(x, '@'));
  let arrs = keys.map(x => M.superdi[x].cats);
  let lst = unionOfArrays(arrs); lst.sort();
  let catlist = lst.map(x => ({ name: x, value: false }));
  let cats = await mGather(iDiv(UI.removeCategory), {}, { content: catlist, type: 'checklist' });
  if (!cats) { console.log('CANCELLED!!!'); collClearSelections(); return; }
  cats = cats.split('@');
  cats = cats.filter(x => !isEmptyOrWhiteSpace(x))
  if (isEmpty(cats)) { console.log('nothing removed'); collClearSelections(); return; }
  let remolist = cats;
  console.log('remove cats', remolist);
  let di = {}, changed = false;
  for (const kc of selist) {
    let key = stringBefore(kc, '@');
    let o = M.superdi[key];
    for (const cat of cats) {
      if (!o.cats.includes(cat)) continue;
      changed = true;
      removeInPlace(o.cats, cat);
      di[key] = o;
    }
  }
  if (!changed) { console.log('ERROR: none of selected elements has cat in', remolist); collClearSelections(); return; }
  console.log('items changed:', Object.keys(di));
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickRemoveSelected() {
  let selist = UI.selectedImages;
  let di = {};
  for (const k of selist) {
    let o = collKeyCollnameFromSelkey(k);
    let key = o.key;
    let collname = o.collname;
    if (collLocked(collname)) continue;
    let item = M.superdi[key];
    removeInPlace(item.colls, collname);
    di[key] = item;
  }
  if (isEmpty(di)) {
    showMessage(`ERROR: cannot delete selected items!!!`);
    collClearSelections();
    return;
  }
  let res = await mPostRoute('postUpdateSuperdi', { di });
  console.log('postUpdateSuperdi', res)
  await loadAssets();
  collPostReload();
}
async function onclickRenameCollection(oldname, newname) {
  if (nundef(oldname)) oldname = UI.collSecondary.isOpen ? UI.collSecondary.name : UI.collPrimary.name;
  if (nundef(newname)) {
    let di = await mGather(iDiv(UI.renameCollection), {}, { content: { oldname: valf(oldname, ''), newname: '' }, type: 'multi' });
    if (!di) return;
    [oldname, newname] = [di.oldname, di.newname];
  }
  newname = newname.toLowerCase();
  if (isEmpty(newname)) {
    showMessage(`ERROR! you need to enter a valid new name!!!!`);
    return;
  }
  if (!isAlphanumeric(newname)) {
    showMessage(`ERROR! ${newname} needs to be alphanumeric starting with a letter!`);
    return;
  }
  if (collLocked(oldname)) {
    showMessage(`ERROR: Collection ${oldname} is Read-Only!`);
    return;
  }
  if (!collExists(oldname)) {
    showMessage(`ERROR: Collection ${oldname} not found!`);
    return;
  }
  if (isdef(M.byCollection[newname])) {
    showMessage(`ERROR! Collection ${newname} already exists!!!!`);
    return;
  }
  await collRename(oldname, newname);
}
async function onclickStartGame() {
  await collectFromPrevious(DA.gamename);
  let options = collectOptions();
  let players = collectPlayers();
  await startGame(DA.gamename, players, options);
}
async function onclickStartTable(id) {
  let table = Serverdata.tables.find(x => x.id == id); assertion(isdef(table), `table with id ${id} not in Serverdata!`);
  table = setTableToStarted(table);
  let res = await mPostRoute('postTable', table);
}
async function onclickTable(id) {
  await showTable(id)
}
async function onclickTest() { console.log('nations!!!!'); }
async function onclickUser() {
  let uname = await mGather(iDiv(UI.user), { w: 100, margin: 0 }, { content: 'username', align: 'br', placeholder: ' <username> ' });
  if (!uname) return;
  await switchToUser(uname);
}
async function ondropPreviewImage(dParent, url, key) {
  if (isdef(key)) {
    let o = M.superdi[key];
    UI.imgColl.value = o.cats[0];
    UI.imgName.value = o.friendly;
  }
  assertion(dParent == UI.dDrop, `problem bei ondropPreviewImage parent:${dParent}, dDrop:${UI.dDrop}`)
  dParent = UI.dDrop;
  let dButtons = UI.dButtons;
  let dTool = UI.dTool;
  dParent.innerHTML = '';
  dButtons.innerHTML = '';
  dTool.innerHTML = '';
  let img = UI.img = mDom(dParent, {}, { tag: 'img', src: url });
  img.onload = async () => {
    img.onload = null;
    UI.img_orig = new Image(img.offsetWidth, img.offsetHeight);
    UI.url = url;
    let tool = UI.cropper = mCropResizePan(dParent, img);
    addToolX(tool, dTool)
    mDom(dButtons, { w: 120 }, { tag: 'button', html: 'Upload', onclick: onclickUpload, className: 'input' })
    mButton('Restart', () => ondropPreviewImage(url), dButtons, { w: 120, maleft: 12 }, 'input');
  }
}
async function ondropSaveUrl(url) {
  console.log('save dropped url to config:', url);
  Serverdata.config = mPostRoute('postConfig', { url: url });
}
async function ondropShowImage(url, dDrop) {
  mClear(dDrop);
  let img = await imgAsync(dDrop, { hmax: 300 }, { src: url });
  console.log('img dims', img.width, img.height); //works!!!
  mStyle(dDrop, { w: img.width, h: img.height + 30, align: 'center' });
  mDom(dDrop, { fg: colorContrast(dDrop, ['blue', 'lime', 'yellow']) }, { className: 'blink', html: 'DONE! now click on where you think the image should be centered!' })
  console.log('DONE! now click on where you think the image should be centered!')
  img.onclick = storeMouseCoords;
}
async function onEventEdited(id, text, time) {
  console.log('onEventEdited', id, text, time)
  let e = Items[id];
  if (nundef(time)) {
    [time, text] = extractTime(text);
  }
  e.time = time;
  e.text = text;
  let result = await simpleUpload('postUpdateEvent', e);
  console.log('result', result)
  Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
  mBy(id).firstChild.value = getEventValue(e);
  closePopup();
}
async function oninputCollFilter(ev) {
  let id = evToId(ev);
  let coll = UI[id];
  let s = ev.target.value.toLowerCase().trim();
  let list = collFilterImages(coll, s);
  coll.keys = list;
  coll.filter = s;
  coll.index = 0; coll.pageIndex = 1; collClearSelections();
  showImageBatch(coll, 0, false);
}
async function onsockEvent(x) {
  console.log('SOCK::event', x)
  Serverdata.events[x.id] = x;
}
async function onsockMerged(x) {
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == x.id;
  if (!isSameTableOpen) return;
  await showTable(x);
}
async function onsockSuperdi(x) {
  console.log('SOCK::superdi', x)
}
async function onsockTable(x) {
  let [msg, id, turn, isNew] = [x.msg, x.id, x.turn, x.isNew];
  if (Clientdata.curMenu != 'play') return; //wenn ich nicht in menu play bin mach garnichts
  let me = getUname();
  let isSameTableOpen = lookup(Clientdata, ['table', 'id']) == id;
  if (isSameTableOpen || isNew && turn.includes(me) && !Clientdata.table) return await showTable(id);
  if (!Clientdata.table) return await showTables('onsockTable');
}
async function onsockTables(x) {
  if (Clientdata.curMenu == 'play' && !Clientdata.table) await showTables('onsockTables');
  else if (Clientdata.curMenu == 'play') {
    let id = Clientdata.table.id;
    let exists = x.find(t => t.id == id);
    if (nundef(exists)) await switchToMenu(UI.nav, 'play');
  }
}
function openGameMenuFor(gamename) { clickOnElemWithAttr('gamename', gamename); }
function openPopup(name = 'dPopup') {
  closePopup();
  let popup = document.createElement('div');
  popup.id = name;
  let defStyle = { padding: 25, bg: 'white', fg: 'black', zIndex: 1000, rounding: 12, position: 'fixed', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', wmin: 300, hmin: 100, border: '1px solid #ccc', };
  mStyle(popup, defStyle);
  mButtonX(popup, 25, 4);
  document.body.appendChild(popup);
  return popup;
}
function overwriteMerge(destinationArray, sourceArray, options) { return sourceArray }
function playerStatCount(key, n, dParent, styles = {}) {
  let sz = valf(styles.sz, 16);
  addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
  let d = mDiv(dParent, styles);
  let o = M.superdi[key];
  if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%', fg: 'grey' }); //mSym(key, d, { h: sz, 'line-height': sz, w: '100%' });
  else mText(key, d, { h: sz, fz: sz, w: '100%' });
  d.innerHTML += `<span style="font-weight:bold;color:inherit">${n}</span>`;
  return d;
}
function polyPointsFrom(w, h, x, y, pointArr) {
  x -= w / 2;
  y -= h / 2;
  let pts = pointArr.map(p => [p.X * w + x, p.Y * h + y]);
  let newpts = [];
  for (const p of pts) {
    newp = { X: p[0], Y: Math.round(p[1]) };
    newpts.push(newp);
  }
  pts = newpts;
  let sPoints = pts.map(p => '' + p.X + ',' + p.Y).join(' ');
  return sPoints;
}
async function postEventChange(data) {
  return Serverdata.events[data.id] = await mPostRoute('postEvent', data);
}
async function postImage(img, path) {
  let dataUrl = imgToDataUrl(img);
  let o = { image: dataUrl, path: path };
  let resp = await mPostRoute('postImage', o);
  console.log('resp', resp); //sollte path enthalten!
}
async function postUserChange(data) {
  data = valf(data, U)
  return Serverdata.users[data.name] = await mPostRoute('postUser', data);
}
function posXY(d1, dParent, x, y, unit = 'px', position = 'absolute') {
  if (nundef(position)) position = 'absolute';
  if (dParent && !dParent.style.position) dParent.style.setProperty('position', 'relative');
  d1.style.setProperty('position', position);
  if (isdef(x)) d1.style.setProperty('left', makeUnitString(x, unit));
  if (isdef(y)) d1.style.setProperty('top', makeUnitString(y, unit));
}
function present() {
  if (Settings.perspective == 'me') presentFor(me);
  else presentAll();
}
function presentAll() {
  clearZones();
  for (const pl of T.players) {
    let zone = Zones[pl.id];
    pl.hand.showDeck(zone.dData, 'right', 0, false);
  }
  showTrick();
}
function presentExtraWorker(item, dParent, styles = {}) {
  let sz = styles.sz;
  addKeys({ paright: 10, bg: 'white', rounding: '50%', hmargin: 8, h: 30, position: 'relative' }, styles)
  let d = mDom(dParent, styles); mFlex(d);
  let img = mDom(d, { h: '100%' }, { tag: 'img', src: '../assets/games/nations/templates/worker.png' })
  let img2 = mDom(d, { h: sz * 2 / 3, w: sz * 2 / 3, position: 'absolute', top: '17%', left: '40%' }, { tag: 'img', src: `../assets/games/nations/templates/${item.o.res}.png` });
  return d;
}
function presentFor(me) {
  clearElement(dTable);
  let others = arrWithout(T.players, [me]);
  for (const pl of others) {
    pl.hand.showDeck(dTable, 'right', 0, false);
  }
  mLinebreak(dTable);
  T.trick.showDeck(dTable, 'right', 20, true);
  mLinebreak(dTable);
  me.hand.showDeck(dTable, 'right', 0, false);
  showFleetingMessage('click to play a card!');
}
function presentImageCropper(url) {
  let d = mDom('dMain', { position: 'absolute', h: 500, w: 500, bg: 'navy' });
  let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
}
function proceed(nextLevel) {
  if (nundef(nextLevel)) nextLevel = currentLevel;
  if (nextLevel > MAXLEVEL) {
    let iGame = gameSequence.indexOf(currentGame) + 1;
    if (iGame == gameSequence.length) {
      soundGoodBye();
      mClass(document.body, 'aniSlowlyDisappear');
      show(dLevelComplete);
      dLevelComplete.innerHTML = 'CONGRATULATIONS! You are done!';
    } else {
      let nextGame = gameSequence[iGame];
      setGoal(nextGame);
    }
  } else if (LevelChange) startLevel(nextLevel);
  else startRound();
}
function pSBC(p, c0, c1, l) {
  let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof c1 == 'string';
  if (typeof p != 'number' || p < -1 || p > 1 || typeof c0 != 'string' || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
  h = c0.length > 9;
  h = a ? (c1.length > 9 ? true : c1 == 'c' ? !h : false) : h;
  f = pSBCr(c0);
  P = p < 0;
  t = c1 && c1 != 'c' ? pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 };
  p = P ? p * -1 : p;
  P = 1 - p;
  if (!f || !t) return null;
  if (l) { r = m(P * f.r + p * t.r); g = m(P * f.g + p * t.g); b = m(P * f.b + p * t.b); }
  else { r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5); g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5); b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5); }
  a = f.a;
  t = t.a;
  f = a >= 0 || t >= 0;
  a = f ? (a < 0 ? t : t < 0 ? a : a * P + t * p) : 0;
  if (h) return 'rgb' + (f ? 'a(' : '(') + r + ',' + g + ',' + b + (f ? ',' + m(a * 1000) / 1000 : '') + ')';
  else return '#' + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2);
}
function pSBCr(d) {
  let i = parseInt, m = Math.round, a = typeof c1 == 'string';
  let n = d.length,
    x = {};
  if (n > 9) {
    ([r, g, b, a] = d = d.split(',')), (n = d.length);
    if (n < 3 || n > 4) return null;
    (x.r = parseInt(r[3] == 'a' ? r.slice(5) : r.slice(4))), (x.g = parseInt(g)), (x.b = parseInt(b)), (x.a = a ? parseFloat(a) : -1);
  } else {
    if (n == 8 || n == 6 || n < 4) return null;
    if (n < 6) d = '#' + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : '');
    d = parseInt(d.slice(1), 16);
    if (n == 9 || n == 5) (x.r = (d >> 24) & 255), (x.g = (d >> 16) & 255), (x.b = (d >> 8) & 255), (x.a = m((d & 255) / 0.255) / 1000);
    else (x.r = d >> 16), (x.g = (d >> 8) & 255), (x.b = d & 255), (x.a = -1);
  }
  return x;
}
function randomColor() { return rColor(); }
function randomIndex(array) { return randomRange(0, array.length) | 0 }
function randomNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomRange(min, max) { return min + Math.random() * (max - min) }
function range(f, t, st = 1) {
  if (nundef(t)) {
    t = f - 1;
    f = 0;
  }
  let arr = [];
  for (let i = f; i <= t; i += st) {
    arr.push(i);
  }
  return arr;
}
function rChoose(arr, n = 1, func = null, exceptIndices = null) {
  if (isDict(arr)) arr = dict2list(arr, 'key');
  let indices = arrRange(0, arr.length - 1);
  if (isdef(exceptIndices)) {
    for (const i of exceptIndices) removeInPlace(indices, i);
  }
  if (isdef(func)) indices = indices.filter(x => func(arr[x]));
  if (n == 1) {
    let idx = Math.floor(Math.random() * indices.length);
    return arr[indices[idx]];
  }
  arrShuffle(indices);
  return indices.slice(0, n).map(x => arr[x]);
}
function rColor(brightPerOrAlpha01 = 1, alpha01 = 1, hueVari = 60) {
  let c;
  if (brightPerOrAlpha01 <= 1) {
    c = '#';
    for (let i = 0; i < 6; i++) { c += rChoose(['f', 'c', '9', '6', '3', '0']); }
    alpha01 = brightPerOrAlpha01;
  } else {
    let hue = rHue(hueVari);
    let sat = 100;
    let b = isNumber(brightPerOrAlpha01) ? brightPerOrAlpha01 : brightPerOrAlpha01 == 'dark' ? 25 : brightPerOrAlpha01 == 'light' ? 75 : 50;
    c = colorFromHSL(hue, sat, b);
  }
  return alpha01 < 1 ? colorTrans(c, alpha01) : c;
}
function redrawImage(img, dParent, x, y, wold, hold, w, h, callback) {
  let canvas = mDom(null, {}, { tag: 'canvas', width: w, height: h });
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, x, y, wold, hold, 0, 0, w, h);
  const imgDataUrl = canvas.toDataURL('image/png'); // Change format as needed
  img.onload = () => {
    img.onload = null;
    img.width = w;
    img.height = h;
    mStyle(img, { w: w, h: h });
    mStyle(dParent, { w: w, h: h });
    callback();
  }
  img.src = imgDataUrl;
  return imgDataUrl;
}
function reload() {
  console.log('reload!!!')
  if (radio_contacts.checked == true) get_contacts();
  else if (radio_chat.checked == true) get_chats();
  else if (radio_games.checked == true) get_games();
  else if (radio_play.checked == true) get_play();
}
function removeCommentLines(text, cstart, cend) {
  let lines = text.split('\n');
  let inComment = false, res = '';
  for (const line of lines) {
    let lt = line.trim();
    if (lt.startsWith(cstart) && lt.endsWith(cend)) { continue; }
    if (lt.startsWith(cstart)) { inComment = true; continue; }
    if (lt.endsWith(cend)) { inComment = false; continue; }
    res += line + '\n';
  }
  return res;
}
function removeDuplicates(keys, prop) {
  let di = {};
  let res = [];
  let items = keys.map(x => Syms[x]);
  for (const item of items) {
    if (isdef(di[item.best])) { continue; }
    res.push(item);
    di[item.key] = true;
  }
  return res.map(x => x.key);
}
function removeFromArray(array, i) { return array.splice(i, 1)[0] }
function removeInPlace(arr, el) {
  arrRemovip(arr, el);
}
function removeItemFromArray(array, item) { return removeFromArray(array, array.indexOf(item)) }
function removePeepFromCrowd(peep) {
  removeItemFromArray(crowd, peep)
  availablePeeps.push(peep)
}
function removeRandomFromArray(array) { return removeFromArray(array, randomIndex(array)) }
function removeTrailingComments(line) {
  let icomm = line.indexOf('//');
  let ch = line[icomm - 1];
  if (icomm <= 0 || ch == "'" || ':"`'.includes(ch)) return line;
  if ([':', '"', "'", '`'].some(x => line.indexOf(x) >= 0 && line.indexOf(x) < icomm)) return line;
  return line.substring(0, icomm);
}
function replaceAll(str, sSub, sBy) {
  let regex = new RegExp(sSub, 'g');
  return str.replace(regex, sBy);
}
function replaceAllSpecialChars(str, sSub, sBy) { return str.split(sSub).join(sBy); }
function resetPeep({ stage, peep }) {
  const direction = Math.random() > 0.5 ? 1 : -1
  const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random())
  const startY = stage.height - peep.height + offsetY
  let startX
  let endX
  if (direction === 1) {
    startX = -peep.width
    endX = stage.width
    peep.scaleX = 1
  } else {
    startX = stage.width + peep.width
    endX = 0
    peep.scaleX = -1
  }
  peep.x = startX
  peep.y = startY
  peep.anchorY = startY
  return {
    startX,
    startY,
    endX
  }
}
function resetRound() {
  clearTimeouts();
  clearFleetingMessage();
  clearEvents();
}
function resize() {
  stage.width = Canvas.clientWidth
  stage.height = Canvas.clientHeight
  Canvas.width = stage.width * devicePixelRatio
  Canvas.height = stage.height * devicePixelRatio
  crowd.forEach((peep) => {
    peep.walk.kill()
  })
  crowd.length = 0
  availablePeeps.length = 0
  availablePeeps.push(...allPeeps)
  initCrowd()
}
function resizeTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  if (hnew == 0) hnew = img.height;
  if (wnew == 0) {
    let aspectRatio = img.width / img.height;
    wnew = aspectRatio * hnew;
  }
  redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function rHue(vari = 36) { return (rNumber(0, vari) * Math.round(360 / vari)) % 360; }
function rLetter(except) { return rLetters(1, except)[0]; }
function rLetters(n, except = []) {
  let all = 'abcdefghijklmnopqrstuvwxyz';
  for (const l of except) all = all.replace(l, '');
  return rChoose(toLetters(all), n);
}
function rNumber(min = 0, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function root(areaName) {
  setTableSize(areaName, 400, 300);
  UIROOT = jsCopy(SPEC.staticSpec.root);
  for (const k in AREAS) delete AREAS[k];
  PROTO = {};
  INFO = {};
  staticArea(areaName, UIROOT);
  addAREA('root', UIROOT);
}
async function rotateAndWriteAge(img, card) {
  let diStage = { 0: 'I', 1: 'I', 2: 'II', 3: 'III', 4: 'II II' };
  let [w, h] = [img.width, img.height];
  mDom('dExtra', { h: 4 })
  let cv2 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
  let ctx2 = cv2.getContext('2d');
  ctx2.translate(h, 0)
  ctx2.rotate(90 * Math.PI / 180);
  ctx2.drawImage(img, 0, 0, w, h);
  mDom('dExtra', { h: 4 })
  let cv3 = mDom('dExtra', {}, { tag: 'canvas', width: h, height: w });
  let ctx3 = cv3.getContext('2d');
  ctx3.drawImage(cv2, 0, 0);
  let x = cv3.width / 2;
  let y = cv3.height;
  ctx3.fillStyle = 'white';
  ctx3.font = '20px Arial';
  ctx3.textAlign = 'center';
  let text = diStage(card.age);
  ctx3.fillText(text, x, y);
  return cv3;
}
function rUniqueId(n = 10) { return rChoose(toLetters('0123456789abcdefghijklmnopqABCDEFGHIJKLMNOPQRSTUVWXYZ_'), n).join(''); }
function rWord(n = 6) { return rLetters(n).join(''); }
function rWords(n = 1) {
  let words = getColorNames().map(x => x.toLowerCase());
  let arr = rChoose(words, n);
  return arr;
}
function sameList(l1, l2) {
  if (l1.length != l2.length) return false;
  for (const s of l1) {
    if (!l2.includes(s)) return false;
  }
  return true;
}
function scaleAnimation(element) {
  let ani = element.animate([
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
function selectAddItems(items, callback = null, instruction = null) {
  let [A, fen] = [Clientdata.A, Clientdata.fen];
  A.level++; A.items = items; A.callback = callback; A.selected = []; A.di = {};
  let dInstruction = mBy('dSelections0');
  mClass(dInstruction, 'instruction');
  mCenterCenterFlex(dInstruction);
  mStyle(dInstruction, { 'align-content': 'center', 'justify-content': 'center' })
  dInstruction.innerHTML = (isMyTurn(fen) ? `${getWaitingHtml()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
  let buttonstyle = { maleft: 25, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
  for (const item of A.items) {
    let type = item.itemtype = isdef(item.itemtype) ? item.itemtype : is_card(item) ? 'card' : isdef(M.superdi[item.key]) ? 'sym' : isdef(item.o) ? 'container' : isdef(item.src) ? 'img' : 'string';
    let [el, o, d1, fz, fg] = [null, item.o, dInstruction, 30, 'grey'];
    if (type == 'sym') {
      if (isdef(o.img)) { el = mDom(d1, { h: fz, hmargin: 8, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` }); }
      else if (isdef(o.text)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
      else if (isdef(o.fa6)) el = mDom(d1, { hmargin: 8, fz: fz - 2, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
      else if (isdef(o.fa)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
      else if (isdef(o.ga)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
    } else if (isdef(item.present)) {
      el = item.present(item, d1, { sz: fz, fg: fg });
    } else assertion(false, `WRONG ITEM TYPE ${type}`)
    mStyle(el, { cursor: 'pointer' })
    el.id = getUID(); A.di[el.id] = item;
    el.onclick = callback;
  }
}
function selectCivSpot(d) {
  if (isdef(M.selectedCivSpot)) mClassRemove(M.selectedCivSpot, 'shadow');
  M.selectedCivSpot = d;
  mClass(d, 'shadow')
}
function selectExtraWorker(item) {
}
function selectPlayerItem(item) { mStyle(iDiv(item), { bg: getUserColor(item.name), fg: 'white', border: `white` }); }
function selectText(el) {
  if (el instanceof HTMLTextAreaElement) { el.select(); return; }
  var sel, range;
  if (window.getSelection && document.createRange) {
    sel = window.getSelection();
    if (sel.toString() == '') {
      window.setTimeout(function () {
        range = document.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
      }, 1);
    }
  } else if (document.selection) {
    sel = document.selection.createRange();
    if (sel.text == '') {
      range = document.body.createTextRange();
      range.moveToElementText(el);
      range.select();
    }
  }
}
function selPrep(fen, autosubmit = false) {
  Clientdata.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: autosubmit };
  Clientdata.fen = fen;
}
async function setActivate(items) {
  try {
    T.sets = setFindAllSets(items);
    [T.bNoSet, T.bHint] = setShowButtons(items);
    setActivateCards(items);
    let use_level = getGameOption('use_level'); if (use_level == 'no') { T.bHint.remove(); return; }
    let level = getPlayerProp('level');
    let noset = isEmpty(T.sets);
    T.numHints = level <= 3 ? noset ? 1 : 2 : level <= 5 ? 1 : 0;
    if (level > 5) { T.bHint.remove(); }
    else if (level == 1) { T.autoHints = noset ? 1 : 2; T.hintTimes = [noset ? 10000 : 2000, 5000]; }
    else if (level == 2) { T.autoHints = noset ? 1 : 2; T.hintTimes = [noset ? 10000 : 3000, 8000]; }
    else if (level == 3) { T.autoHints = 1; T.hintTimes = [noset ? 10000 : 4000]; }
    else if (level == 4) { T.autoHints = 1; T.hintTimes = [noset ? 10000 : 8000]; }
    let i = 0;
    while (i < T.autoHints) {
      await mSleep(T.hintTimes[i]);
      if (checkInterrupt(items)) { console.log(`autoHint ${i}`); return; }
      if (DA.stopAutobot == true) { console.log(`autoHint ${i}`); return; }
      await setOnclickHint(items);
      i++;
    }
  } catch { console.log('human: please reload!') }
}
function setActivateCards(items) {
  for (const item of items) {
    let d = iDiv(item);
    d.onclick = () => setOnclickCard(item, items, true);
    mStyle(d, { cursor: 'pointer' })
  }
}
async function setBotMove(table) {
  try {
    let items = T.items;
    [T.bNoSet, T.bHint] = setShowButtons(items); T.bHint.remove();
    mShield(dOpenTable, { bg: '#00000010' });
    let speed = calcBotSpeed(table); console.log('speed', speed);
    T.sets = setFindAllSets(items);
    if (isEmpty(T.sets)) {
      speed *= 3;
      await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep noset'); return; }
      await setOnclickNoSet(items);
    } else {
      let list = rChoose(T.sets);
      await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep 1'); return; }
      await setOnclickCard(list[0], items);
      await mSleep(speed); if (checkInterrupt(items)) { console.log('!!sleep 2'); return; }
      await setOnclickCard(list[1], items);
      await mSleep(speed); if (checkInterrupt(items)) { console.log('!!!sleep 3'); return; }
      await setOnclickCard(list[2], items);
    }
    console.log('* END OF AUTOMOVE *');
  } catch { console.log('please reload!') }
}
function setCheckIfSet(keys) {
  let arr = makeArrayWithParts(keys);
  let isSet = arr.every(x => arrAllSameOrDifferent(x));
  return isSet;
}
function setCreateDeck() {
  let deck = [];
  ['red', 'purple', 'green'].forEach(color => {
    ['diamond', 'squiggle', 'oval'].forEach(shape => {
      [1, 2, 3].forEach(num => {
        ['solid', 'striped', 'open'].forEach(fill => {
          deck.push(`${color}_${shape}_${num}_${fill}`);
        });
      });
    });
  });
  arrShuffle(deck);
  return deck;
}
function setCssVar(varname, val) { document.body.style.setProperty(varname, val); }
function setDrawCard(card, dParent, colors, sz = 100) {
  const paths = {
    diamond: "M25 0 L50 50 L25 100 L0 50 Z",
    squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
    oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
  }
  let [color, shape, num, fill] = card.split('_');
  var attr = {
    d: paths[shape],
    fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
    stroke: colors[color],
    'stroke-width': 2,
  };
  let h = sz, w = sz / .65;
  let ws = w / 4;
  let hs = 2 * ws;
  let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
  mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
  let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
  for (const i of range(num)) {
    let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
  }
  return d0;
}
function setDropPosition(ev, elem, targetElem, dropPos) {
  if (dropPos == 'mouse') {
    var elm = $(targetElem);
    x = ev.pageX - elm.offset().left - dragStartOffset.x;
    y = ev.pageY - elm.offset().top - dragStartOffset.y;
    posXY(elem, targetElem, x, y);
  } else if (dropPos == 'none') {
    return;
  } else if (dropPos == 'center') {
    elem.style.position = elem.style.left = elem.style.top = '';
    elem.classList.add('centeredTL');
  } else if (dropPos == 'centerCentered') {
    elem.style.position = elem.style.left = elem.style.top = '';
    elem.classList.add('centerCentered');
  } else {
    dropPos(ev, elem, targetElem);
  }
}
function setFindAllSets(items) {
  let result = [];
  for (var x = 0; x < items.length; x++) {
    for (var y = x + 1; y < items.length; y++) {
      for (var z = y + 1; z < items.length; z++) {
        assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
        let list = [items[x], items[y], items[z]];
        let keys = list.map(x => x.key);
        if (setCheckIfSet(keys)) result.push(list);
      }
    }
  }
  if (isEmpty(result)) console.log('no set!')
  return result;
}
function setGameover(table) {
  table.status = 'over';
  table.winners = getPlayersWithMaxScore(table.fen);
}
function setGoal(index) {
  if (nundef(index)) {
    let rnd = G.numPics < 2 ? 0 : randomNumber(0, G.numPics - 2);
    if (G.numPics >= 2 && rnd == lastPosition && coin(70)) rnd = G.numPics - 1;
    index = rnd;
  }
  lastPosition = index;
  Goal = Pictures[index];
}
function setHintHide() { mClass(T.bHint, 'disabled'); } //mStyle(T.bHint,{display:'hidden'}); } //T.bHint.remove();}
function setKeys({ allowDuplicates, nMin = 25, lang, key, keySets, filterFunc, param, confidence, sortByFunc } = {}) {
  let keys = jsCopy(keySets[key]);
  if (isdef(nMin)) {
    let diff = nMin - keys.length;
    let additionalSet = diff > 0 ? nMin > 100 ? firstCondDictKeys(keySets, k => k != key && keySets[k].length > diff) : 'best100' : null;
    if (additionalSet) KeySets[additionalSet].map(x => addIf(keys, x));
  }
  let primary = [];
  let spare = [];
  for (const k of keys) {
    let info = Syms[k];
    info.best = info[lang];
    if (nundef(info.best)) {
      let ersatzLang = (lang == 'D' ? 'D' : 'E');
      let klang = 'best' + ersatzLang;
      if (nundef(info[klang])) info[klang] = lastOfLanguage(k, ersatzLang);
    }
    let isMatch = true;
    if (isdef(filterFunc)) isMatch = isMatch && filterFunc(param, k, info.best);
    if (isdef(confidence)) isMatch = info[klang + 'Conf'] >= confidence;
    if (isMatch) { primary.push(k); } else { spare.push(k); }
  }
  if (isdef(nMin)) {
    let len = primary.length;
    let nMissing = nMin - len;
    if (nMissing > 0) { let list = choose(spare, nMissing); spare = arrMinus(spare, list); primary = primary.concat(list); }
  }
  if (isdef(sortByFunc)) { sortBy(primary, sortByFunc); }
  if (isdef(nMin)) console.assert(primary.length >= nMin);
  if (nundef(allowDuplicates)) {
    primary = removeDuplicates(primary);
  }
  return primary;
}
function setLanguage(x) { currentLanguage = x; startLevel(); }
function setLoadPatterns(dParent, colors) {
  dParent = toElem(dParent);
  let id = "setpatterns";
  if (isdef(mBy(id))) { return; }
  let html = `
    <svg id="setpatterns" width="0" height="0">
      <!--  Define the patterns for the different fill colors  -->
      <pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
      </pattern>
      <pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
      </pattern>
      <pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
        <path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
      </pattern>
    </svg>
    `;
  let el = mCreateFrom(html);
  mAppend(dParent, el)
}
async function setOnclickCard(item, items, direct = false) {
  if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
  else if (direct) stopAutobot();
  else if (!direct && item.isSelected) { console.log('already clicked!'); return; }
  else if (DA.stopAutobot == true) { assertion(!direct, 'direct and autobot true'); return; }
  toggleItemSelection(item);
  let selitems = items.filter(x => x.isSelected);
  let [keys, m] = [selitems.map(x => x.key), selitems.length];
  let olist = [];
  if (m == 3) {
    clearEvents();
    mShield(dOpenTable, { bg: '#00000000' }); //disable ui
    let [me, table] = [getUname(), Clientdata.table];
    let [fen, pl] = [table.fen, table.fen.players[me]];
    let isSet = setCheckIfSet(keys);
    if (isSet) {
      assertion(fen.cards.length >= table.options.numCards || isEmpty(fen.deck), `LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
      let toomany = Math.max(0, fen.cards.length - table.options.numCards);
      let need = Math.max(0, 3 - toomany);
      let newCards = deckDeal(fen.deck, need);
      for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
      olist.push({ keys: ['fen', 'cards'], val: table.fen.cards });
      olist.push({ keys: ['fen', 'deck'], val: table.fen.deck });
      pl.score++;
      pl.incScore = 1;
    } else {
      pl.score--;
      pl.incScore = -1;
    }
    olist.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
    if (pl.playmode == 'bot') {
      await mSleep(500);
      if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
    }
    let res = await sendMergeTable({ id: table.id, name: me, olist }); // console.log('res', res)
  }
}
async function setOnclickHint(items, direct = false) {
  assertion(T.numHints > 0, 'NO Hints left!!!!');
  if (direct) stopAutobot();
  T.numHints -= 1;
  if (isEmpty(T.sets)) {
    let elem = T.bNoSet;
    T.numHints = 0; setHintHide();
    ANIM.button = scaleAnimation(elem);
    return;
  } else if (nundef(T.hintSet)) {
    T.hintSet = rChoose(T.sets);
  } else {
    let sofar = T.items.filter(x => x.isSelected);
    if (sofar.length >= 2) {
      return;
    }
  }
  let item = T.hintSet.find(x => !x.isSelected);
  if (!T.numHints) setHintHide();
  await setOnclickCard(item, T.items, direct);
}
async function setOnclickNoSet(items, direct = false) {
  if (direct) stopAutobot();
  mShield(dOpenTable, { bg: '#00000000' }); //disable ui
  let b = T.bNoSet; mClass(b, 'framedPicture')
  let [me, table] = [getUname(), Clientdata.table];
  let [fen, pl] = [table.fen, table.fen.players[me]];
  let olist = [];
  if (isEmpty(T.sets)) {
    pl.score++;
    pl.incScore = 1;
    let newCards = deckDeal(fen.deck, 1);
    if (!isEmpty(newCards)) {
      fen.cards.push(newCards[0]);
      olist.push({ keys: ['fen', 'cards'], val: table.fen.cards });
      olist.push({ keys: ['fen', 'deck'], val: table.fen.deck });
    } else {
      setGameover(table);
      olist.push({ keys: ['status'], val: table.status });
      olist.push({ keys: ['winners'], val: table.winners });
      console.log(`table status is now ${table.status}`);
      assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
    }
  } else {
    pl.score--;
    pl.incScore = -1;
  }
  olist.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
  if (pl.playmode == 'bot') {
    await mSleep(500);
    if (checkInterrupt(items)) { console.log('!!!onclick noset!!!'); return; }
  }
  let res = await sendMergeTable({ id: table.id, name: me, olist });
}
async function setPlayerNotPlaying(item, gamename) {
  await collectFromPrevious(gamename);
  removeInPlace(DA.playerList, item.name);
  mRemoveIfExists('dPlayerOptions');
  unselectPlayerItem(item);
}
async function setPlayerPlaying(item, gamename) {
  let [name, da] = [item.name, item.div];
  addIf(DA.playerList, name);
  selectPlayerItem(item);
  await collectFromPrevious(gamename);
  let id = 'dPlayerOptions';
  DA.lastPlayerItem = item;
  let poss = getGamePlayerOptions(gamename);
  if (nundef(poss)) return;
  let dParent = mBy('dGameMenu'); //mBy('dMain'); //mBy('dGameMenu'); //document.body;
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
      let userval = lookup(DA.allPlayers, [name, gamename, p]);
      let radio;
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
  mButtonX(d1, ev => collectPlayerOptions(item, gamename), 18, 3, 'dimgray');
}
function setPlayersToMulti() {
  for (const name in DA.allPlayers) {
    //DA.allPlayers[name][DA.gamename].playmode = 'human';
    lookupSetOverride(DA.allPlayers, [name, DA.gamename, 'playmode'], 'human');
    let el = document.querySelector(`div[username="${name}"]`);
    let img = el.getElementsByTagName('img')[0];
    mStyle(img, { round: true });
  }
  setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
  for (const name in DA.allPlayers) {
    if (name == getUname()) continue;
    // DA.allPlayers[name][DA.gamename].playmode = 'bot';
    lookupSetOverride(DA.allPlayers, [name, DA.gamename, 'playmode'], 'bot');
    let el = document.querySelector(`div[username="${name}"]`);
    let img = el.getElementsByTagName('img')[0];
    mStyle(img, { rounding: 2 });
  }
  let popup = mBy('dPlayerOptions');
  if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
  setRadioValue('playmode', 'bot');
}
async function setPresent(dParent, table) {
  const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; //'#4b0082' //'#8e44ed' }; //'blueviolet' }; //'#8e44ad' };
  setLoadPatterns('dPage', colors);
  mClear(dParent);
  let d = mDom(dParent, { margin: 10 }); //, bg: '#00000080' }); mCenterFlex(d)
  [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(d);
  let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.fen.players, table.fen.turn];
  let cards = fen.cards;
  let dp = mDom(dOpenTable, { w100: true }); mCenterFlex(dp);
  let dBoard = T.dBoard = mGrid(cards.length / 3, 3, dp, { gap: 14 });
  let items = [];
  for (const c of cards) {
    let d = setDrawCard(c, dBoard, colors, TESTING ? 80 : 100);
    let item = mItem({ div: d }, { key: c });
    items.push(item);
  }
  setStats(table, dOben, 'rowflex', false);
  return items;
}
function setRadioValue(prop, val) {
  let input = mBy(`i_${prop}_${val}`);
  if (nundef(input)) return;
  input.checked = true;
}
function setRect(elem, options) {
  let r = getRect(elem);
  elem.rect = r;
  elem.setAttribute('rect', `${r.w} ${r.h} ${r.t} ${r.l} ${r.b} ${r.r}`);
  if (isDict(options)) {
    if (options.hgrow) mStyle(elem, { hmin: r.h });
    else if (options.hfix) mStyle(elem, { h: r.h });
    else if (options.hshrink) mStyle(elem, { hmax: r.h });
    if (options.wgrow) mStyle(elem, { wmin: r.w });
    else if (options.wfix) mStyle(elem, { w: r.w });
    else if (options.wshrink) mStyle(elem, { wmax: r.w });
  }
  return r;
}
function setScoresSameOrHigher(told, tnew) {
  if (nundef(told)) return true;
  let [plold, plnew] = [told.fen.players, tnew.fen.players];
  for (const name in plnew) {
    if (plold[name].score + plold[name].incScore != plnew[name].score) return false;
    plnew[name].incScore = 0;
  }
  return true;
}
function setShowButtons(items) {
  let buttons = mDom(dOpenTable, { w100: true, gap: 10, matop: 20 }); mCenterCenterFlex(buttons);
  let bno = mButton('NO Set', () => setOnclickNoSet(items, true), buttons, { w: 80 }, 'input');
  let bhint = mButton('Hint', () => setOnclickHint(items, true), buttons, { w: 80 }, 'input');
  return [bno, bhint];
}
function setStats(table, dParent, layout, showTurn = true) {
  let [fen, me] = [table.fen, getUname()];
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, me, dParent, layout, style)
  let uselevel = getGameOption('use_level');
  let botLevel = Math.floor(calcBotLevel(table));
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') {
      let c = getLevelColor(botLevel);
      mStyle(item.img, { rounding: 0, border: `${c} ${botLevel}px solid` });
    }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
    if (uselevel != 'yes') continue;
    mDom(d, { fz: 11, round: true, hpadding: 3, fg: 'contrast', bg: getLevelColor(pl.level), position: 'absolute', top: 1, right: 2 }, { html: pl.level })
  }
}
function setTableSize(w, h, unit = 'px') {
  let d = mBy('areaTable');
  mStyle(d, { 'min-width': w, 'min-height': h }, unit);
}
function setTableToStarted(table) {
  table.status = 'started';
  table.step = 0;
  table.fen = DA.funcs[table.game].setup(table);
  return table;
}
function setup() {
  axiom = system.axiom;
  rules = system.rules;
  factor = valf(system.factor, 1);
  angle = radians(valf(system.angle, 60));
  sentence = axiom;
  let button = createButton("generate"); button.mousePressed(generate);
  button = createButton("animate"); button.mousePressed(() => interval_id = setInterval(generate, 500));
  createCanvas(400, 400);
  background(51);
  createP(axiom);
  turtle();
}
function show(elem, isInline = false) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (isSvg(elem)) {
    elem.setAttribute('style', 'visibility:visible');
  } else {
    elem.style.display = isInline ? 'inline-block' : null;
  }
  return elem;
}
async function showCalendarApp() {
  if (!U) { console.log('you have to be logged in to use this menu!!!'); return; }
  showTitle('Calendar');
  let d1 = mDiv('dMain', { w: 800, h: 800,margin:20 }); //, bg: 'white' })
  let x = DA.calendar = await uiTypeCalendar(d1);
}
function showChatMessage(o) {
  let d = mBy('dChatWindow'); if (nundef(d)) return;
  if (o.user == getUname()) mDom(d, { align: 'right' }, { html: `${o.msg}` })
  else mDom(d, { align: 'left' }, { html: `${o.user}: ${o.msg}` })
}
function showChatWindow() {
  let dChat = mDom('dRight', { padding: 10, fg: 'white', box: true }, { id: 'dChat', html: 'Chatbox' });
  UI.chatInput = mInput(dChat, { w: 260 }, 'inpChat', '<your message>', 'input', 1);
  UI.chatWindow = mDom(dChat, {}, { id: 'dChatWindow' });
  mOnEnter(UI.chatInput, ev => {
    let inp = ev.target;
    Socket.emit('message', { user: getUname(), msg: ev.target.value });
    ev.target.value = '';
  });
}
async function showDashboard() {
  let me = getUname();
  showTitle('dashboard')
  mDom('dMain', { fg: getThemeFg(),margin:20 }, { html: `hi, ${me}! this is your dashboard` });
  if (me == 'guest') mDom('dMain', { align: 'center', className: 'section' }, { html: 'click username in upper left corner to log in' })
}
function showDeck(keys, dParent, splay, w, h) {
  let d = mDiv(dParent);
  mStyleX(d, { display: 'block', position: 'relative', bg: 'green', padding: 25 });
  let gap = 10;
  let ovPercent = 20;
  let overlap = w * ovPercent / 100;
  let x = y = gap;
  for (let i = 0; i < keys.length; i++) {
    let k = keys[i];
    let c = zInno(k, d);
    mAppend(d, c.div);
    mStyleX(c.div, { position: 'absolute', left: x, top: y });
    c.row = 0;
    c.col = i;
    x += overlap;
    Pictures.push(c);
  }
  d.style.width = (x - overlap + w) + 'px';
  console.log(Pictures[0])
  console.log(Pictures[0].div)
  d.style.height = firstNumber(Pictures[0].div.style.height) + 'px';
}
async function showDirPics(dir, dParent) {
  let imgs = await mGetFiles(dir);
  for (const fname of imgs) {
    let src = `${dir}/${fname}`;
    let sz = 200;
    let styles = { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${rColor()} 2px solid` }
    let img = mDom(dParent, styles, { tag: 'img', src });
  }
}
function showDiv(d) { mStyle(d, { bg: rColor() }); console.log(d, mGetStyle(d, 'w')); }
function showEventOpen(id) {
  let e = Items[id];
  if (!e) return;
  let date = new Date(Number(e.day));
  let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];
  let time = e.time;
  let popup = openPopup();
  let d = mBy(id);
  let [x, y, w, h, wp, hp] = [d.offsetLeft, d.offsetTop, d.offsetWidth, d.offsetHeight, 300, 180];
  let [left, top] = [Math.max(10, x + w / 2 - wp / 2), Math.min(window.innerHeight - hp - 60, y + h / 2 - hp / 2)]
  mStyle(popup, { left: left, top: top, w: wp, h: hp });
  let dd = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 3, pabottom: 4 }, { html: `date: ${day}.${month}.${year}` });
  let dt = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 20, pabottom: 4 }, { html: `time:` });
  let inpt = mDom(popup, { fz: '80%', maleft: 3, mabottom: 4, w: 60 }, { tag: 'input', value: e.time });
  mOnEnter(inpt);
  console.log('event text:', e.text)
  let ta = mDom(popup, { rounding: 4, matop: 7, box: true, w: '100%', vpadding: 4, hpadding: 10, }, { tag: 'textarea', rows: 7, value: e.text });
  let line = mDom(popup, { matop: 6, w: '100%' }); //,'align-items':'space-between'});
  let buttons = mDom(line, { display: 'inline-block' });
  let bsend = mButton('Save', () => onEventEdited(id, ta.value, inpt.value), buttons);
  mButton('Cancel', () => closePopup(), buttons, { hmargin: 10 })
  mButton('Delete', () => { deleteEvent(id); closePopup(); }, buttons, { fg: 'red' })
  mDom(line, { fz: '90%', maright: 5, float: 'right', }, { html: `by ${e.user}` });
}
function showFleetingMessage(msg, dParent, styles = {}, ms = 3000, msDelay = 0, fade = true) {
  clearFleetingMessage();
  dFleetingMessage = mDiv(dParent);
  if (msDelay) {
    TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), msDelay);
  } else {
    TOFleetingMessage = setTimeout(() => fleetingMessage(msg, dFleetingMessage, styles, ms, fade), 10);
  }
}
async function showGameMenu(gamename) {
  let users = Serverdata.users = await mGetRoute('users');//console.log('users',users);
  mRemoveIfExists('dGameMenu');
  let dMenu = mDom('dMain', {}, { className: 'section', id: 'dGameMenu' });
  mDom(dMenu, { maleft: 12 }, { html: `<h2>game options</h2>` });
  let style = { display: 'flex', justify: 'center', w: '100%', gap: 10, matop: 6 };
  let dPlayers = mDiv(dMenu, style, 'dMenuPlayers'); //mCenterFlex(dPlayers);
  let dOptions = mDiv(dMenu, style, 'dMenuOptions'); //mCenterFlex(dOptions);
  let dButtons = mDiv(dMenu, style, 'dMenuButtons');
  DA.gamename = gamename;
  DA.gameOptions = {};
  DA.playerList = [];
  DA.allPlayers = {};
  DA.lastName = null;
  await showGamePlayers(dPlayers, users);
  await showGameOptions(dOptions, gamename);
  let astart = mButton('Start', onclickStartGame, dButtons, {}, ['button', 'input']);
  let ajoin = mButton('Open to Join', onclickOpenToJoinGame, dButtons, {}, ['button', 'input']);
  let acancel = mButton('Cancel', () => mClear(dMenu), dButtons, {}, ['button', 'input']);
  let bclear = mButton('Clear Players', onclickClearPlayers, dButtons, {}, ['button', 'input']);
}
async function showGameMenuPlayerDialog(name, shift = false) {
  let item = DA.allPlayers[name];
  let gamename = DA.gamename;
  let da = iDiv(item);
  if (!DA.playerList.includes(name)) await setPlayerPlaying(item, gamename);
  else await setPlayerNotPlaying(item, gamename);
}
async function showGameOptions(dParent, game) {
  let poss = Serverdata.config.games[game].options;
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
  mStyle(dParent, { wrap: true })
  for (const name in users) {
    let d = mDom(dParent, { align: 'center', padding: 2, cursor: 'pointer', border: `transparent` });
    d.setAttribute('username', name)
    let img = showUserImage(name, d, 40);
    let label = mDom(d, { matop: -4, fz: 12, hline: 12 }, { html: name });
    let item = jsCopy(users[name]);
    item.div = d;
    item.isSelected = false;
    DA.allPlayers[name] = item;
    d.onclick = onclickGameMenuPlayer;
  }
  await clickOnPlayer(me);
}
function showGames(ms = 500) {
  let dParent = mBy('dGameList'); if (isdef(dParent)) { mClear(dParent); } else dParent = mDom('dMain', {}, { className: 'section', id: 'dGameList' });
  mText(`<h2>start new game</h2>`, dParent, { maleft: 12 });
  let d = mDiv(dParent, { fg: 'white' }, 'game_menu'); mFlexWrap(d);
  let gamelist = 'accuse aristo bluff ferro nations spotit wise'; if (DA.TEST0) gamelist += ' a_game'; gamelist = toWords(gamelist);
  gamelist = ['button96']; //'button99','button98','button97','setgame']
  for (const gname of gamelist) {
    let g = Serverdata.config.games[gname];
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
function showim(key, dParent, styles = {}, imgFit = 'fill', useSymbol = false) {
  let o = M.superdi[key];
  let h = valf(styles.h, styles.sz, 100);
  let w = valf(styles.w, styles.sz, 'auto');
  let fz = h * .9;
  let hline = fz;
  addKeys({ w, h, fz, hline }, styles);
  let d1 = mDom(dParent, styles);
  let el;
  if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': imgFit, 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': imgFit, 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  return el;
}
function showim1(key, d, styles = {}, opts = {}) {
  let src = M.superdi[key].img;
  let img = mDom(d, styles, { tag: 'img', src });
  return img;
}
function showImage(key, dParent, styles = {}, useSymbol = false) {
  let o = M.superdi[key];
  if (nundef(o)) { console.log('showImage:key not found', key); return; }
  let [w, h] = [valf(styles.w, styles.sz), valf(styles.h, styles.sz)];
  if (nundef(w)) {
    mClear(dParent);
    [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  } else {
    addKeys({ w: w, h: h }, styles)
    dParent = mDom(dParent, styles);
  }
  let [sz, fz, fg] = [.9 * w, .8 * h, valf(styles.fg, rColor())];
  let hline = valf(styles.hline * fz, fz);
  let d1 = mDiv(dParent, { position: 'relative', h: fz, overflow: 'hidden' });
  mCenterCenterFlex(d1)
  let el = null;
  if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg, 'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  assertion(el, 'PROBLEM mit' + key);
  mStyle(el, { cursor: 'pointer' })
  return d1;
}
function showImageBatch(coll, inc = 0, alertEmpty = false) {
  let [keys, index, numCells] = [coll.keys, coll.index, coll.rows * coll.cols];
  if (isEmpty(keys) && alertEmpty) showMessage('nothing has been added to this collection yet!');
  if (keys.length <= numCells) inc = 0;
  let newPageIndex = coll.pageIndex + inc;
  let numItems = keys.length;
  let maxPage = Math.max(1, Math.ceil(numItems / numCells));
  if (newPageIndex > maxPage) newPageIndex = 1;
  if (newPageIndex < 1) newPageIndex = maxPage;
  index = numCells * (newPageIndex - 1);
  let list = arrTakeFromTo(keys, index, index + numCells);
  coll.index = index; coll.pageIndex = newPageIndex;
  for (let i = 0; i < list.length; i++) {
    let d = coll.cells[i];
    mStyle(d, { opacity: 1 });
    mClass(d, 'magnifiable')
    let d1 = showImageInBatch(list[i], d);
    d1.setAttribute('collname', coll.name);
    let selkey = collGenSelkey(list[i], coll.name);
    if (isList(UI.selectedImages) && UI.selectedImages.includes(selkey)) collSelect(d1);
  }
  for (let i = list.length; i < numCells; i++) {
    mStyle(coll.cells[i], { opacity: 0 })
  }
  coll.dPageIndex.innerHTML = `page ${coll.pageIndex}/${maxPage}`;
  let [dNext, dPrev] = [mBy('bNext'), mBy('bPrev')];
  if (maxPage == 1) { mClass(dPrev, 'disabled'); mClass(dNext, 'disabled'); }
  else { mClassRemove(dPrev, 'disabled'); mClassRemove(dNext, 'disabled'); }
}
function showImageInBatch(key, dParent, styles = {}) {
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
function showMessage(msg, ms = 3000) {
  let d = mBy('dMessage');
  mStyle(d, { h: 21, bg: 'red', fg: 'yellow' }); 
  d.innerHTML = msg;
  clearTimeout(TO.message);
  TO.message = setTimeout(() => mStyle('dMessage', { h: 0 }), ms)
}
function showNavbar() {
  let nav = mMenu('dNav');
  let commands = {};
  commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
  commands.settings = menuCommand(nav.l, 'nav', 'settings', null, showColors, settingsClose);
  commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, collClear);
  commands.play = menuCommand(nav.l, 'nav', 'play', 'Tables', onclickPlay, clearMain);
  commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
  nav.commands = commands;
  return nav;
}
async function showTables(from) {
  // mClear('dMain');
  Clientdata.table = null;
  if (TESTING) {
    let dT=mDom('dMain');
    let dTB=testUpdateTestButtons(dT);//console.log(dTB);
    mStyle(dT,{h:getRect(dTB).h})
  }
  let me = getUname();
  let tables = Serverdata.tables = await mGetRoute('tables');
  tables.map(x => x.prior = x.status == 'open' ? 0 : x.turn.includes(me) ? 1 : x.playerNames.includes(me) ? 2 : 3);
  sortBy(tables, 'prior');
  let dParent = mBy('dTableList');
  if (isdef(dParent)) { mClear(dParent); }
  else dParent = mDom('dMain', {}, { className: 'section', id: 'dTableList' });
  if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }
  tables.map(x => x.game_friendly = capitalize(Serverdata.config.games[x.game].friendly));
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
    if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: getWaitingHtml(24) }); //'my turn!'});
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
function showTitle(title,dParent='dTitle') {
  mClear(dParent);
  return mDom(dParent, { maleft: 20 }, { tag: 'h1', html: title, classes: 'title' });
}
function showTrick() {
  let dZone = Zones.table.dData;
  let d = mDiv(dZone);
  mStyleX(d, { display: 'flex', position: 'relative' });
  let zIndex = 1;
  for (let i = 0; i < T.trick.length; i++) {
    let c = T.trick[i];
    let direction = i == 0 ? { x: 0, y: -1 } : { x: 0, y: 1 };
    let displ = 10;
    let offset = { x: -35 + direction.x * displ, y: direction.y * displ };
    let d1 = c.div;
    mAppend(d, d1);
    mStyleX(d1, { position: 'absolute', left: offset.x, top: offset.y, z: zIndex });
    zIndex += 1;
  }
}
function showUserImage(uname, d, sz = 40) {
  let u = Serverdata.users[uname];
  return showim1(u.key, d, { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${u.color} 2px solid` });
}
function shuffle(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
async function simpleUpload(route, o) {
  let server = getServerurl();
  server += `/${route}`;
  const response = await fetch(server, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    mode: 'cors',
    body: JSON.stringify(o)
  });
  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return 'ERROR 1';
  }
}
function size2hex(w = 100, h = 0, x = 0, y = 0) {
  let hexPoints = [{ X: 0.5, Y: 0 }, { X: 1, Y: 0.25 }, { X: 1, Y: 0.75 }, { X: 0.5, Y: 1 }, { X: 0, Y: 0.75 }, { X: 0, Y: 0.25 }];
  if (h == 0) {
    h = (2 * w) / 1.73;
  }
  return polyPointsFrom(w, h, x, y, hexPoints);
}
function sleep() { return new Promise(r => setTimeout(r, m)) }
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('merged', onsockMerged);
  Socket.on('table', onsockTable);
  Socket.on('tables', onsockTables);
  Socket.on('superdi', onsockSuperdi);
}
function sockPostUserChange(oldname, newname) {
  Socket.emit('userChange', { oldname, newname });
}
function sortBy(arr, key) { arr.sort((a, b) => (a[key] < b[key] ? -1 : 1)); return arr; }
function sortByDescending(arr, key) { arr.sort((a, b) => (a[key] > b[key] ? -1 : 1)); return arr; }
function sortByFunc(arr, func) { arr.sort((a, b) => (func(a) < func(b) ? -1 : 1)); return arr; }
function sortByMultipleProperties(list) {
  let props = Array.from(arguments).slice(1);
  return list.sort((a, b) => {
    for (const p of props) {
      if (a[p] < b[p]) return -1;
      if (a[p] > b[p]) return 1;
    }
    return 0;
  });
}
function sortCaseInsensitive(list) {
  list.sort((a, b) => { return a.toLowerCase().localeCompare(b.toLowerCase()); });
  return list;
}
function sortCheckboxes(grid) {
  let divs = arrChildren(grid);
  divs.map(x => x.remove());
  let chyes = divs.filter(x => x.firstChild.checked == true);
  let chno = divs.filter(x => !chyes.includes(x));
  chyes = sortByFunc(chyes, x => x.firstChild.name);
  chno = sortByFunc(chno, x => x.firstChild.name);
  for (const d of chyes) { mAppend(grid, d) }
  for (const d of chno) { mAppend(grid, d) }
}
function splitAtAnyOf(s, sep) {
  let arr = [], w = '';
  for (let i = 0; i < s.length; i++) {
    let ch = s[i];
    if (sep.includes(ch)) {
      if (!isEmpty(w)) arr.push(w);
      w = '';
    } else {
      w += ch;
    }
  }
  if (!isEmpty(w)) arr.push(w);
  return arr;
}
function squareTo(tool, sznew = 128) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  if (sznew == 0) sznew = h;
  let sz = Math.max(w, h)
  let [x1, y1] = [x - (sz - w) / 2, y - (sz - h) / 2];
  redrawImage(img, dParent, x1, y1, sz, sz, sznew, sznew, () => tool.setRect(0, 0, sznew, sznew))
}
async function startGame(gamename, players, options) {
  let table = createOpenTable(gamename, players, options);
  table = setTableToStarted(table);
  let res = await mPostRoute('postTable', table);
}
function startLevel() {
  Speech.setLanguage(Settings.language);
  getGameValues(Username, G.id, G.level);
  G.instance.startLevel();
  if (G.keys.length < G.numPics) { updateKeySettings(G.numPics + 5); }
  startRound();
}
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
    adjustComplex(panData)
  }
  function panEnd(ev) {
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
function startRound() {
  if (G.addonActive != true && isTimeForAddon()) {
    G.addonActive = true;
    exitToAddon(startRound); return;
  } else G.addonActive = false;
  resetRound();
  uiActivated = false;
  G.instance.startRound();
  TOMain = setTimeout(() => prompt(), 300);
}
function startsWith(s, sSub) {
  return s.substring(0, sSub.length) == sSub;
}
function staticArea(areaName, oSpec) {
  func = correctFuncName(oSpec.type);
  oSpec.ui = window[func](areaName, oSpec);
}
function stdRowsColsContainer(dParent, cols, styles = {}) {
  addKeys({
    margin: 'auto',
    padding: 10,
    gap: 10,
    display: 'grid',
    bg: 'green',
    'grid-template-columns': `repeat(${cols}, 1fr)`
  }, styles);
  return mDiv(dParent, styles);
}
function stopAutobot() {
  if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
  DA.stopAutobot = true;
}
function stringAfter(sFull, sSub) {
  let idx = sFull.indexOf(sSub);
  if (idx < 0) return '';
  return sFull.substring(idx + sSub.length);
}
function stringAfterLast(sFull, sSub) {
  let parts = sFull.split(sSub);
  return arrLast(parts);
}
function stringBefore(sFull, sSub) {
  let idx = sFull.indexOf(sSub);
  if (idx < 0) return sFull;
  return sFull.substring(0, idx);
}
function stringBeforeLast(sFull, sSub) {
  let parts = sFull.split(sSub);
  return sFull.substring(0, sFull.length - arrLast(parts).length - 1);
}
function stringBetween(sFull, sStart, sEnd) {
  return stringBefore(stringAfter(sFull, sStart), isdef(sEnd) ? sEnd : sStart);
}
function stringCount(s, sSub, caseInsensitive = true) {
  let n = 0;
  for (let i = 0; i < s.length; i++) {
    if (s.slice(i).startsWith(sSub)) n++;
  }
  return n;
  let m = new RegExp(sSub, 'g' + (caseInsensitive ? 'i' : ''));
  let s1 = s.match(m);
  return s1 ? s1.length : 0;
}
async function switchToMainMenu(name) { return await switchToMenu(UI.nav, name); }
async function switchToMenu(menu, key) {
  menuCloseCurrent(menu);
  Clientdata.curMenu = key;
  await menuOpen(menu, key);
}
async function switchToOtherUser() {
  let uname = await mGetRoute('otherUser', arguments);
  await switchToUser(uname);
}
async function switchToTables() { return await switchToMainMenu('play'); }
async function switchToUser(uname) {
  if (!isEmpty(uname)) uname = normalizeString(uname);
  if (isEmpty(uname)) uname = 'guest';
  sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
  U = await getUser(uname);
  Clientdata.curUser = uname;
  localStorage.setItem('username', uname);
  iDiv(UI.user).innerHTML = uname;
  setColors(U.color,U.texture,U.blend);
  if (uname == 'guest') {
    await switchToMenu(UI.nav, 'home');
    menuDisable(UI.nav, 'plan');
  } else {
    menuEnable(UI.nav, 'plan');
    let t = Clientdata.table;
    let cur = Clientdata.curMenu;
    if (cur == 'play' && isdef(t) && t.playerNames.includes(uname) && t.status == 'started') await showTable(t.id);
    else await switchToMenu(UI.nav, valf(cur, 'home'));
  }
}
function tableLayoutMR(dParent, m = 7, r = 1) {
  let ui = UI; ui.players = {};
  clearElement(dParent);
  let bg = 'transparent';
  let [dMiddle, dRechts] = [ui.dMiddle, ui.dRechts] = mColFlex(dParent, [m, r], [bg, bg]);
  mCenterFlex(dMiddle, false);
  let dOben = ui.dOben = mDiv(dMiddle, { w: '100%', display: 'block' }, 'dOben');
  let dSelections = ui.dSelections = mDiv(dOben, {}, 'dSelections');
  for (let i = 0; i <= 5; i++) { ui[`dSelections${i}`] = mDiv(dSelections, {}, `dSelections${i}`); }
  let dActions = ui.dActions = mDiv(dOben, { w: '100%' });
  for (let i = 0; i <= 5; i++) { ui[`dActions${i}`] = mDiv(dActions, { w: '100%' }, `dActions${i}`); }
  ui.dError = mDiv(dOben, { w: '100%', bg: 'red', fg: 'yellow', hpadding: 12, box: true }, 'dError');
  let dSubmitOrRestart = ui.dSubmitOrRestart = mDiv(dOben, { w: '100%' });
  let dOpenTable = ui.dOpenTable = mDiv(dMiddle, { w: '100%', padding: 10 }); mFlexWrap(dOpenTable);
  return [dOben, dOpenTable, dMiddle, dRechts];
}
function tabtitleUpdate() {
}
function takeFromTo(ad, from, to) {
  if (isDict(ad)) {
    let keys = Object.keys(ad);
    return keys.slice(from, to).map(x => (ad[x]));
  } else return ad.slice(from, to);
}
function test1(map) {
  var baseballIcon = L.icon({
    iconUrl: '../leaf94/baseball-marker.png',
    iconSize: [32, 37],
    iconAnchor: [16, 37],
    popupAnchor: [0, -28]
  });
  function onEachFeature(feature, layer) {
    var popupContent = '<p>I started out as a GeoJSON ' +
      feature.geometry.type + ", but now I'm a Leaflet vector!</p>";
    if (feature.properties && feature.properties.popupContent) {
      popupContent += feature.properties.popupContent;
    }
    layer.bindPopup(popupContent);
  }
  var bicycleRentalLayer = L.geoJSON([bicycleRental, campus], {
    style: function (feature) {
      return feature.properties && feature.properties.style;
    },
    onEachFeature: onEachFeature,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: 8,
        fillColor: '#ff7800',
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      });
    }
  }).addTo(map);
  var freeBusLayer = L.geoJSON(freeBus, {
    filter: function (feature, layer) {
      if (feature.properties) {
        return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
      }
      return false;
    },
    onEachFeature: onEachFeature
  }).addTo(map);
  var coorsLayer = L.geoJSON(coorsField, {
    pointToLayer: function (feature, latlng) {
      return L.marker(latlng, { icon: baseballIcon });
    },
    onEachFeature: onEachFeature
  }).addTo(map);
}
function testHelpers() {
  if (activatedTests.includes('helpers')) {
    console.log(...arguments);
  }
}
async function testOnclickBot(ev) {
  for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI.bTestBot, { bg: 'red', fg: 'white' });
  await onclickBot();
}
async function testOnclickCaption(ev) {
  let x = ev.target.innerHTML;
  let b = UI[getButtonCaptionName(name)];
  for (const name of getButtonCaptionNames(Clientdata.table)) {
    let b = UI[getButtonCaptionName(name)];
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI[getButtonCaptionName(x)], { bg: 'red', fg: 'white' });
  await switchToUser(x);
}
async function testOnclickDeck0() {
  let tnew = jsCopy(Clientdata.table);
  tnew.fen.deck = [];
  let res = await sendMergeTable({ name: getUname(), id: tnew.id, table: tnew });
  console.log('res', res.fen.deck)
}
async function testOnclickHuman(ev) {
  for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI.bTestHuman, { bg: 'red', fg: 'white' });
  await onclickHuman();
}
async function testOnclickHybrid(ev) {
  for (const b of [UI.bTestBot, UI.bTestHuman, UI.bTestHybrid]) {
    if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
  }
  mStyle(UI.bTestHybrid, { bg: 'red', fg: 'white' });
  await onclickHybrid();
}
async function testOnclickPlaymode(ev) {
  let b = UI.bPlaymode;
  let caption = b.innerHTML;
  if (caption.includes('human')) await onclickHuman();
  else await onclickBot();
}
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toggleItemSelection(item, classSelected='framedPicture', selectedItems=null) {
  if (nundef(item)) return;
  let ui = iDiv(item);
  item.isSelected = nundef(item.isSelected) ? true : !item.isSelected;
  if (item.isSelected) mClass(ui, classSelected); else mRemoveClass(ui, classSelected);
  if (isdef(selectedItems)) {
    if (item.isSelected) {
      console.assert(!selectedItems.includes(item), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
      selectedItems.push(item);
    } else {
      console.assert(selectedItems.includes(item), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
      removeInPlace(selectedItems, item);
    }
  }
}
function toggleSelectionOfPicture(elem, selkey, selectedPics, className = 'framedPicture') {
  if (selectedPics.includes(selkey)) {
    removeInPlace(selectedPics, selkey); collUnselect(elem);
  } else {
    selectedPics.push(selkey); collSelect(elem);
  }
}
function toLetters(s) { return [...s]; }
function toWords(s, allow_ = false) {
  let arr = allow_ ? s.split(/[\W]+/) : s.split(/[\W|_]+/);
  return arr.filter(x => !isEmpty(x));
}
function trim(str) {
  return str.replace(/^\s+|\s+$/gm, '');
}
function tryJSONParse(astext) {
  try {
    const data = JSON.parse(astext);
    return data;
  } catch {
    console.log('text', astext)
    return { message: 'ERROR', text: astext }
  }
}
function turtle() {
  background(51);
  stroke(255);
  translate(width / 2, height);
  for (let i = 0; i < sentence.length; i++) {
    let x = sentence.charAt(i);
    if ('ABF'.includes(x)) { line(0, 0, 0, -len); translate(0, -len); }
    else if (x == '+') rotate(angle);
    else if (x == '-') rotate(-angle);
    else if (x == '[') push();
    else if (x == ']') pop();
  }
}
function uid() {
  UID += 1;
  return 'a' + UID;
}
function uiGadgetTypeCheckList(form, content, styles, opts) {
  addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
  let dOuter = mDom(form, styles)
  let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});
  let ui = uiTypeCheckList(content, dParent, styles, opts);
  mButton('done', () => onclickCatListDone(form), dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu
  return () => form.getAttribute('proceed');
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {
  addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
  let dOuter = mDom(form, styles)
  let dParent = mDom(dOuter, { pabottom: 10, box: true });
  let ui = uiTypeCheckListInput(content, dParent, styles, opts);
  return () => DA.formResult;
}
function uiGadgetTypeMulti(form, dict, styles = {}, opts = {}) {
  let inputs = [];
  for (const k in dict) {
    let [content, val] = [k, dict[k]];
    let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', value: val, placeholder: `<enter ${content}>` });
    inputs.push({ name: content, inp: inp });
    mNewline(form)
  }
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  return () => {
    let di = {};
    inputs.map(x => di[x.name] = x.inp.value);
    return di;
  };
}
function uiGadgetTypeSelect(form, dict, styles = {}, opts = {}) {
  let select = DA.select = mDom(form, styles, { className: 'input', tag: 'select' });
  if (isList(dict)) dict = list2dict(dict);
  mDom(select, {}, { tag: 'option', html: '' });
  for (const k in dict) {
    let [content, val] = [k, dict[k]];
    mDom(select, {}, { tag: 'option', html: content, value: val });
  }
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  select.addEventListener('change', () => form.submit());
  return () => { console.log('selected', DA.select, DA.select.value); return DA.select.value; }
}
function uiGadgetTypeText(form, content, styles = {}, opts = {}) {
  let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
  mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
  return () => inp.value;
}
function uiGadgetTypeYesNo(form, content, styles = {}, opts = {}) {
  addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
  let dOuter = mDom(form, styles)
  let dq = mDom(dOuter, { mabottom: 7 }, { html: capitalize(content) });
  let db = mDom(dOuter, { w100: true, box: true, display: 'flex', 'justify-content': 'space-between', gap: 10 })
  let bYes = mDom(db, { w: 70, classes: 'input' }, { html: 'Yes', tag: 'button', onclick: () => form.setAttribute('proceed', 'yes') })
  let bNo = mDom(db, { w: 70, classes: 'input' }, { html: 'No', tag: 'button', onclick: () => form.setAttribute('proceed', 'no') })
  return () => form.getAttribute('proceed') == 'yes';
}
async function uiTypeCalendar(dParent) {
  const [wcell, hcell, gap] = [120, 100, 10];
  let outerStyles = {
    rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
    paleft: gap / 2, w: wcell, hmin: hcell,
    bg: 'black', fg: 'white', cursor: 'pointer'
  }
  let innerStyles = { box: true, padding: 0, align: 'center', bg: 'beige', rounding: 4 };//, w: '95%', hmin: `calc( 100% - 24px )` }; //cellWidth - 28 };
  innerStyles.w = wcell - 11.75;
  innerStyles.hmin = `calc( 100% - 23px )`;//hcell-32
  let fz = 12;
  let h = measureHeightOfTextStyle(dParent, { fz: fz }); console.log('h', h)
  let eventStyles = { fz: fz, hmin: h, w: '100%' };
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dParent = toElem(dParent);
  var container = mDiv(dParent, {}, 'dCalendar');
  var currentDate = new Date();
  var today = new Date();
  let dTitle = mDiv(container, { w: 890, vpadding: gap, fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' }, { className: 'title' });
  var dWeekdays = mGrid(1, 7, container, { gap: gap });
  var dDays = [];
  var info = {};
  for (const w of weekdays) { mDiv(dWeekdays, { w: wcell }, null, w, 'subtitle') };
  var dGrid = mGrid(6, 7, container, { gap: gap });
  var dDate = mDiv(dTitle, { display: 'flex', gap: gap }, 'dDate', '', 'title');
  var dButtons = mDiv(dTitle, { display: 'flex', gap: gap });
  mButton('Prev',
    async () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 0) setDate(12, y - 1); else await setDate(m, y);
    },
    dButtons, { w: 70, margin: 0 }, 'input');
  mButton('Next',
    async () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 11) setDate(1, y + 1); else await setDate(m + 2, y);
    }, dButtons, { w: 70, margin: 0 }, 'input');
  var dMonth, dYear;
  function getDayDiv(dt) {
    if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) return null;
    let i = dt.getDate() + info.dayOffset;
    if (i < 1 || i > info.numDays) return null;
    let ui = dDays[i];
    if (ui.style.opacity === 0) return null;
    return ui.children[0];
  }
  async function setDate(m, y) {
    currentDate.setMonth(m - 1);
    currentDate.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
    mClear(dGrid);
    dDays.length = 0;
    let c = getNavBg();
    let dayColors = mimali(c, 43).map(x => colorHex(x))
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      mStyle(cell, { bg: dayColors[i], fg: 'contrast' })
      dDays[i] = cell;
    }
    populate(currentDate);
    await refreshEvents();
    return { container, date: currentDate, dDate, dGrid, dMonth, dYear, setDate, populate };
  }
  function populate() {
    let dt = currentDate;
    const day = info.day = dt.getDate();
    const month = info.month = dt.getMonth();
    const year = info.year = dt.getFullYear();
    const firstDayOfMonth = info.firstDay = new Date(year, month, 1);
    const daysInMonth = info.numDays = new Date(year, month + 1, 0).getDate();
    const dateString = info.dayString = firstDayOfMonth.toLocaleDateString('en-us', {
      weekday: 'long',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);
    info.dayOffset = paddingDays - 1;
    for (const i of range(42)) {
      if (i < paddingDays || i >= paddingDays + daysInMonth) { mStyle(dDays[i], { opacity: 0 }); }
    }
    for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = dDays[i - 1];
      let date = new Date(year, month, i - paddingDays);
      daySquare.innerText = i - paddingDays + (isSameDate(date, today) ? ' TODAY' : '');
      let d = mDom(daySquare, innerStyles, { id: date.getTime() });
      daySquare.onclick = ev => { evNoBubble(ev); onclickDay(d, eventStyles); }
    }
  }
  async function refreshEvents() {
    let events = await getEvents();
    console.log('refreshing events', events)
    for (const k in events) {
      let o = events[k];
      let dt = new Date(Number(o.day));
      let dDay = getDayDiv(dt);
      if (!dDay) continue;
      uiTypeEvent(dDay, o, eventStyles);
    }
    mDummyFocus();
  }
  await setDate(currentDate.getMonth() + 1, currentDate.getFullYear());
  return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDayDiv, refreshEvents, setDate, populate }
}
function uiTypeCheckList(lst, dParent, styles = {}, opts = {}) {
  let d = mDom(dParent, { overy: 'auto' }); //hier drin kommt die liste!
  lst.forEach((o, index) => {
    let [text, value] = [o.name, o.value];
    let dcheck = mDom(d, {}, { tag: 'input', type: 'checkbox', name: text, value: text, id: `ch_${index}`, checked: value });
    let dlabel = mDom(d, {}, { tag: 'label', for: dcheck.id, html: text });
    mNewline(d, 0);
  });
  let r = getRect(d);
  let rp = getRect(dParent);
  let hParent = rp.h;
  if (hParent == 0) hParent = mGetStyle(dParent, 'max-height');
  let p = mGetStyle(dParent, 'pabottom'); //console.log('pb',p,mGetStyle(dParent,'padding'))
  let h = hParent - r.y;
  mStyle(d, { hmax: h });//,pabottom:10,box:true});
  return d;
}
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {
  mStyle(dParent, { w: 1000 })
  let dg = mDom(dParent);
  let list = lst;
  let items = [];
  for (const o of list) {
    let div = mCheckbox(dg, o.name, o.value);
    items.push({ nam: o.name, div, w: mGetStyle(div, 'w'), h: mGetStyle(div, 'h') });
  }
  let wmax = arrMax(items, 'w'); //console.log('wmax',wmax); //measure max width of items
  let cols = 3;
  let wgrid = wmax * cols + 100;
  dg.remove();
  dg = mDom(dParent);
  let inp = mDom(dg, { w100: true, box: true, mabottom: 10 }, { className: 'input', tag: 'input', type: 'text' });
  let db = mDom(dg, { w100: true, box: true, align: 'right', mabottom: 4 });
  mButton('cancel', () => DA.formResult = null, db, {}, 'input');
  mButton('clear', ev => { ev.preventDefault(); onclickClear(inp, grid) }, db, { maleft: 10 }, 'input');
  mButton('done', () => DA.formResult = extractWords(inp.value, ' '), db, { maleft: 10 }, 'input');
  mStyle(dg, { w: wgrid, box: true, padding: 10 }); //, w: wgrid })
  let grid = mGrid(null, cols, dg, { w100: true, gap: 10, matop: 4, hmax: 500 });
  items.map(x => mAppend(grid, iDiv(x)));
  let chks = Array.from(dg.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
  for (const chk of chks) {
    chk.addEventListener('click', ev => checkToInput(ev, inp, grid))
  }
  inp.value = list.filter(x => x.value).map(x => x.name).join(', ');
  inp.addEventListener('keypress', ev => inpToChecklist(ev, grid));
  return { dg, inp, grid };
}
function uiTypeEvent(dParent, o, styles = {}) {
  Items[o.id] = o;
  let id = o.id;
  let ui = mDom(dParent, styles, { id: id }); //, className:'no_events'}); //onclick:ev=>evNoBubble(ev) }); 
  mStyle(ui, { overflow: 'hidden', display: 'flex', gap: 2, padding: 2, 'align-items': 'center' }); //,'justify-items':'center'})
  let [wtotal, wbutton, h] = [mGetStyle(dParent, 'w'), 17, styles.hmin];
  let fz = 15;
  let stInput = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, h: h, border: 'solid 1px silver', box: true, margin: 0, padding: 0 };
  let inp = mDom(ui, stInput, { html: o.text, tag: 'input', className: 'no_outline', onclick: ev => { evNoBubble(ev) } }); //;selectText(ev.target);}});
  inp.value = getEventValue(o);
  inp.addEventListener('keyup', ev => { if (ev.key == 'Enter') { mDummyFocus(); onEventEdited(id, inp.value); } });
  fz = 14;
  let stButton = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, box: true, fg: 'silver', bg: 'white', family: 'pictoFa', display: 'flex' };
  let b = mDom(ui, stButton, { html: String.fromCharCode('0x' + M.superdi.pen_square.fa) });
  ui.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev); }
  mStyle(inp, { w: wtotal - wbutton });
  return { ui: ui, inp: inp, id: id };
}
function uiTypeExtraWorker(w) {
  let [res, n] = [stringBefore(w, ':'), Number(stringAfter(w, ':'))];
  let s = `worker (cost:${res} ${n})`
  let present = presentExtraWorker;
  let select = selectExtraWorker;
  return { itemtype: 'worker', a: s, key: `worker_${res}`, o: { res: res, n: n }, friendly: s, present, select }
}
function uiTypePlayerStats(fen, me, dParent, layout, styles = {}) {
  let dOuter = mDom(dParent); dOuter.setAttribute('inert', true); //console.log(dOuter)
  if (layout == 'rowflex') mStyle(dOuter, { display: 'flex', justify: 'center' });
  else if (layout == 'col') mStyle(dOuter, { display: 'flex', dir: 'column' });
  addKeys({ rounding: 10, bg: '#00000050', margin: 4, box: true, 'border-style': 'solid', 'border-width': 4 }, styles);
  let show_first = me;
  let order = arrCycle(fen.plorder, fen.plorder.indexOf(show_first));
  let items = {};
  for (const name of order) {
    let pl = fen.players[name];
    styles['border-color'] = name == me ? colorLighter(pl.color) : pl.color;
    let d = mDom(dOuter, styles, { id: name2id(name) })
    let img = showUserImage(name, d, 40); mStyle(img, { box: true })
    items[name] = { div: d, img, name };
  }
  return items;
}
function uiTypeRadios(lst, d, styles = {}, opts = {}) {
  let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
  let handler = x => squareTo(cropper, x);
  mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
  for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
    mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
  }
  return rg;
}
function unionOfArrays() {
  let arrs = arguments[0];
  if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
  const flattenedArray = arrs.flat();
  return [...new Set(flattenedArray)];
}
function unselectPlayerItem(item) { mStyle(iDiv(item), { bg: 'transparent', fg: 'black', border: `transparent` }); }
async function updateClientData() {
}
function updateKeySettings(nMin) {
  if (nundef(G)) return;
  G.keys = setKeys({ nMin, lang: Settings.language, keysets: KeySets, key: Settings.vocab });
}
async function uploadImg(img, unique, coll, name) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('image', blob, unique + '.png');
      formData.append('collection', coll);
      formData.append('name', name);
      let server = getServerurl();
      server += '/upload';
      try {
        const response = await fetch(server, {
          method: 'POST',
          mode: 'cors',
          body: formData
        });
        if (response.ok) {
          const data = await response.json();
          resolve(data);
        } else {
          reject(response.statusText);
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        reject(error);
      }
    });
  });
}
function valf() {
  for (const arg of arguments) if (isdef(arg)) return arg;
  return null;
}
function valnwhite() {
  for (const arg of arguments) {
    if (nundef(arg) || isEmpty(arg) || isWhiteSpace(arg)) {
      continue;
    }
    return arg;
  }
  return null;
}
function where(o) {
  let fname = getFunctionsNameThatCalledThisFunction();
}
function without(arr, elementToRemove) {
  return arr.filter(function (el) {
    return el !== elementToRemove;
  });
}
function animatedTitle(msg = 'DU BIST DRAN!!!!!') {
  TO.titleInterval = setInterval(() => {
    let corner = CORNERS[WhichCorner++ % CORNERS.length];
    document.title = `${corner} ${msg}`; //'⌞&amp;21543;    U+231E \0xE2Fo\u0027o Bar';
  }, 1000);
}
function calcScoreSum(table){
  let res=0;
  for(const name in table.fen.players){
    res+=table.fen.players[name].score;
  }
  return res;
}
function clearMain() { clearEvents(); mClear('dMain'); mClear('dTitle'); mClear('dExtra') }
function disableButton(b){mClass(b,'disabled')}
function disableUI(){mShield('dGameDiv');}
function selectAddItems(T, items, callback = null, instruction = null) {
  if (nundef(T.A)) T.A = { level: 0, di: {} };
  let [A, fen] = [Clientdata.A, Clientdata.fen];
  A.level++; A.items = items; A.callback = callback; A.selected = []; A.di = {};
  let dInstruction = mBy('dSelections0');
  mClass(dInstruction, 'instruction');
  mCenterCenterFlex(dInstruction);
  mStyle(dInstruction, { 'align-content': 'center', 'justify-content': 'center' })
  dInstruction.innerHTML = (isMyTurn(fen) ? `${getWaitingHtml()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
  let buttonstyle = { maleft: 25, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
  for (const item of A.items) {
    let type = item.itemtype = isdef(item.itemtype) ? item.itemtype : is_card(item) ? 'card' : isdef(M.superdi[item.key]) ? 'sym' : isdef(item.o) ? 'container' : isdef(item.src) ? 'img' : 'string';
    let [el, o, d1, fz, fg] = [null, item.o, dInstruction, 30, 'grey'];
    if (type == 'sym') {
      if (isdef(o.img)) { el = mDom(d1, { h: fz, hmargin: 8, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` }); }
      else if (isdef(o.text)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
      else if (isdef(o.fa6)) el = mDom(d1, { hmargin: 8, fz: fz - 2, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
      else if (isdef(o.fa)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
      else if (isdef(o.ga)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
    } else if (isdef(item.present)) {
      el = item.present(item, d1, { sz: fz, fg: fg });
    } else assertion(false, `WRONG ITEM TYPE ${type}`)
    mStyle(el, { cursor: 'pointer' })
    el.id = getUID(); A.di[el.id] = item;
    el.onclick = callback;
  }
}
async function sendMergeTable(o,cond='merge') { 
  if (nundef(o)) {
    let table = Cliendata.table;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }else if (nundef(o.name)){
    let table = o;
    let name = getUname();
    let id = table.id;
    o={name,id,table};
  }
  let table =  await mPostRoute(`${cond}Table`, o); 
  if (!isDict(table)) {console.log('from server',table); return;}
  await showTable(table);
}
async function sendRaceError(table,name,errors=1){
  let data = {
    id: table.id,
    name,
    errors,
    olist: [
      { keys: ['fen', 'players', name, 'score'], val: table.fen.players[name].score - errors },
      { keys: ['fen', 'players', name, 'errors'], val: valf(table.fen.players[name].errors, 0) + errors }
    ]
  }
  let res = await sendMergeTable(data, 'race');
}
async function sendRaceStepScore(table, name, score = 1, olist = []) {
  let step = table.step + 1;
  olist.push({ keys: ['step'], val: step });
  olist.push({ keys: ['fen', 'players', name, 'score'], val: table.fen.players[name].score + score });
  let data = { id: table.id, name, step, olist };
  let res = await sendMergeTable(data, 'race');
}
function showGameover(table,dParent='dGameover') {
  let winners = table.winners;
  let msg = winners.length > 1 ? `GAME OVER - The winners are ${winners.join(', ')}!!!` : `GAME OVER - The winner is ${winners[0]}!!!`;
  showRibbon(dParent,msg);
}
function showRibbon(dParent,msg){
  let d = mBy('ribbon'); if (isdef(d)) d.remove();
  let bg = `linear-gradient(270deg, #fffffd, #00000080)`
  d = mDom(dParent, { bg, mabottom: 10, align: 'center', padding: 10, fz: 40, w100: true }, { html: msg, id: 'ribbon' });
}
function staticTitle(table) {
  clearInterval(TO.titleInterval);
  let url = window.location.href;
  let loc = url.includes('vidulus') ? 'remote' : 'local';
  let game = isdef(Z) ? stringAfter(table.friendly, 'of ') : '♠ GAMES ♠';
  document.title = `(${loc}) ${game}`;
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
  let d=mGrid(1,2,dParent);
  let [dMiddle, dRechts] = [mDom(d),mDom(d)]; 
  let dOben = mDom(dMiddle, {mabottom:10}, {id:'dOben'});
  let dOpenTable = mDom(dMiddle, {}, {id:'dOpenTable'});
  return [dOben,dOpenTable,dRechts];
}
function testUpdateTestButtons(dParent,styles={}) {
  let table = Clientdata.table;
  let id = 'dTestButtons'; mRemoveIfExists(id); 
  mIfNotRelative(dParent);
  addKeys({display:'flex',gap:10,vpadding:2,position:'absolute',right:8,top:0},styles);
  let dBotHuman = mDom(dParent, styles, { id });
  let me = getUname();
  let names = isdef(table) ? [] : ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, testOnclickCaption, dBotHuman);
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }
  if (nundef(table)) return dBotHuman;;
  let playmode = getPlaymode(table, me);
  if (nundef(playmode)) return dBotHuman;;
  let [playmodeKey,sz,bg,matop,patop] = [playmode == 'human'?'skullcap':'robot',25,'transparent',2,0];
  showImage(playmodeKey, dBotHuman, { fg:'white', sz, round: true, bg, matop, patop });// , 'line-height': sz });
  let caption = `Make me ${playmode == 'bot' ? 'human' : 'bot'}`;
  UI.bPlaymode = mButton(caption, testOnclickPlaymode, dBotHuman, {w:130});
  return dBotHuman;
}
