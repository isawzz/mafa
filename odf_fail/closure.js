async function _switchToOtherUser(name1,name2) {
  let uname = await mGetRoute('otherUser',{name1,name2});
  await switchToUser(uname);
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
function arrClear(arr) { arr.length = 0; return arr; }
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
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
function checkInterrupt() {
  return TO.SLEEPTIMEOUT;
  return V[vid] 
  let vmain = V.main;
  let old=DA.vmain;
  return isdef(old) && (nundef(vmain) || vmain.items[0]!=old.items[0]);
}
function checkToInput(ev, inp, grid) {
  let checklist = Array.from(grid.querySelectorAll('input[type="checkbox"]')); //chks=items.map(x=>iDiv(x).firstChild);
  let names = checklist.filter(x => x.checked).map(x => x.name);
  sortCheckboxes(grid);
  names.sort();
  inp.value = names.join(', ') + ', ';
}
function cLandscape(dParent, styles = {}, opts = {}) {
  if (nundef(styles.w)) styles.w = 100;
  if (nundef(styles.h)) styles.h = styles.w * .65;
  return cBlank(dParent, styles, opts);
}
function clearBodyDiv(styles = {}, opts = {}) { document.body.innerHTML = ''; return mDom(document.body, styles, opts) }
function clearCell(cell) { mClear(cell); mStyle(cell, { opacity: 0 }); }
function clearEvents() { 
  for (const k in TO) {clearTimeout(TO[k]);TO[k]=null;} 
  for (const k in ANIM) {if (isdef(ANIM[k])) ANIM[k].cancel();ANIM[k]=null;} 
}
function clearMain() { DA.counter = 0; clearEvents(); mClear('dMain'); mClear('dTitle'); }
function clearParent(ev) { mClear(ev.target.parentNode); }
async function clickFirstTable() {
  let table = Serverdata.tables.find(x => x.status == 'started' && x.playerNames.includes(getUname()));
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
async function collectFromPrevious(gamename){
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
    let val = get_checked_radios(fs)[0];
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
    if (['div', 'isSelected'].includes(k)) continue;
    unew[k] = jsCopy(pl[k]);
  }
  for (const k in unew[gamename]) {
    if (lookup(uold, [gamename, k]) != unew[gamename][k]) {
      let res = await postUserChange(unew);
      copyKeys(res,DA.allPlayers[name]);
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
  let bg = mGetStyle('dNav', 'bg');
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
function colorContrast(dDrop, list = ['white', 'black']) {
  let bg = mGetStyle(dDrop, 'bg'); return bestContrastingColor(bg, list);
}
function colorHexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function conslog(s){console.log(s,window[s])}
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
function create_set_card(fen, dParent, card_styles) {
  let myinfo = info_from_fen(fen);
  let info = { shape: 'circle', color: BLUE, num: 1, shading: 'solid', background: 'white', text: 'none' };
  copyKeys(myinfo, info);
  let card = draw_set_card(dParent, info, card_styles);
  card.fen = fen;
  return card;
}
function createConfirmationModal(dParent,question) {
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
      let rect = {x: 100, y: 100, width: 50, height: 50}; // Initial rectangle properties
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
      let keys = ['playmode','score','level','name','color','key'];
      let osorted={};
      for (const k of keys) {osorted[k]=o[k];      }
      pdict[name]=osorted;
    }else  pdict[name] = o;
  }
  assertion(playerNames[0] == me, `_addTable: owner should be ${me} and first in ${playerNames.join(',')}`);
  console.log('creating table with',pdict); //das geht
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
async function cropOrExpandImageAndGetDataUrl_trial1_W(imageSrc) {
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
      const dx = (canvas.width - scaledWidth) / 2;
      const dy = (canvas.height - scaledHeight) / 2;
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
function deepMergeOverrideLists(target,source) {
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
function draw_set_card(dParent, info, card_styles) {
  let card = cLandscape(dParent, card_styles);
  card.info = info;
  let d = iDiv(card);
  mCenterCenterFlex(d);
  let sz = card.sz / 2.8;
  let bg, shape = info.shape, text;
  switch (info.shading) {
    case 'solid': bg = info.color; break;
    case 'gradient': bg = `linear-gradient(${info.color}, silver)`; break;
    case 'empty': bg = `repeating-linear-gradient(
      45deg,
      ${info.color},
      ${info.color} 10px,
      silver 10px,
      silver 20px
    )`; break;
  }
  mStyle(d, { bg: info.background });
  switch (info.text) {
    case 'none': text = null; break;
    case 'letter': text = randomLetter(); break;
    case 'number': text = '' + randomDigit(); break;
  }
  let styles = { w: sz, h: sz, margin: sz / 10 };
  for (let i = 0; i < info.num; i++) {
    let d1 = drawShape(shape, d, styles);
    if (info.shading == 'gradient') { d1.style.backgroundColor = info.color; mClass(d1, 'polka-dot'); } else mStyle(d1, { bg: bg });
    if (shape == 'circle') console.log('circle', d1);
    if (isdef(text)) { mCenterCenterFlex(d1); mText(text, d1, { fz: sz / 1.75, fg: 'black', family: 'impact' }); }
  }
  return card;
}
function draw_set_card_test(dParent) {
  let card = cLandscape(dParent, { w: 120 });
  let d = iDiv(card, { h: '100%' });
  mCenterCenterFlex(d);
  let sz = card.sz / 4;
  let bg = 'indigo'; //`linear-gradient(${RED},black`
  let styles = { w: sz, h: sz, bg, margin: 4 }; // sz / 10, border: `solid 3px ${GREEN}` };
  let d1 = drawShape('circle', d, styles); //mCenterCenterFlex(d1); mText('A', d1, { fz: sz / 4, fg: 'white' });
  drawShape('circle', d, styles);
  drawShape('circle', d, styles);
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
function enableImageDrop(element, onDropCallback) {
  const originalBorderStyle = element.style.border;
  element.addEventListener('dragover', function(event) {
    event.preventDefault();
  });
  element.addEventListener('dragenter', function(event) {
    element.style.border = '2px solid red';
  });
  element.addEventListener('drop', function(event) {
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
  element.addEventListener('dragleave', function(event) {
    element.style.border = originalBorderStyle;
  });
}
function enableImageDrop_trial1_W(elem, onDropCallback) {
  const originalBorderStyle = elem.style.border; 
  elem.addEventListener('dragover', function (event) { event.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
  elem.addEventListener('dragenter', function (event) { elem.style.border = '2px solid red'; }); // Highlight the border on drag enter
  elem.addEventListener('dragleave', function (event) { elem.style.border = originalBorderStyle; }); // Restore the original border if the item is dragged out without dropping
  elem.addEventListener('drop', function (event) {
    event.preventDefault(); 
    elem.style.border = originalBorderStyle; 
    const files = event.dataTransfer.files; 
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) { // Check if the dropped file is an image
        onDropCallback(file); 
      }
    }
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
function formatLegend(key){
  return key.includes('per') ? stringBefore(key, '_') + '/' + stringAfterLast(key, '_') 
  : key.includes('_')? replaceAll(key,'_',' '): key;
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
function get_number_card(ckey, h = 100, w = null, backcolor = BLUE, ov = .3) {
  let info = {};
  let color = stringAfter(ckey, '_');
  let num = stringBefore(ckey, '_');
  info.key = ckey;
  info.cardtype = 'num';
  let [r, s] = [info.rank, info.suit] = [Number(num), color];
  info.val = r; 
  info.color = backcolor;
  let sz = info.sz = info.h = h;
  w = info.w = valf(w, sz * .7);
  let d = mDom(null, { h: h, w: w, rounding: 4, bg: 'white', border: 'silver' }, { className: 'card' });
  let [sm, lg] = [sz / 8, sz / 4]
  let styles = { fg: color, h: sm, fz: sm, hline: sm, weight: 'bold' };
  for (const pos of ['tl', 'tr']) {
    let d1 = mDiv(d, styles, null, num);
    mPlace(d1, pos, 2, 2);
  }
  for (const pos of ['bl', 'br']) {
    let d1 = mDiv(d, styles, null, num);
    d1.style.transform = 'rotate(180deg)';
    mPlace(d1, pos, 2, 2);
  }
  let dbig = mDiv(d, { matop: (h - lg) / 2, family: 'algerian', fg: color, fz: lg, h: lg, w: w, hline: lg, align: 'center' }, null, num);
  let res = {};
  copyKeys(info, res);
  copyKeys({ w: info.w, h: info.h, faceUp: true, div: d }, res);
  if (isdef(ov)) res.ov = ov;
  return res;
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
function getButtonId(key) { return 'b' + capitalize(key); }
function getCheckedNames(dParent) {
  let checks = Array.from(dParent.querySelectorAll('input[type="checkbox"]')); //dParent.getElementsByTagName('input'));
  let res = [];
  for (const ch of checks) {
    if (ch.checked) res.push(ch.name);
  }
  return res;
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
function getDivId(key) { return 'd' + capitalize(key); }
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
function getGameColor(gamename) { return Serverdata.config.games[gamename].color; }
function getGameFriendly(game) { return Serverdata.config.games[game].friendly; }
function getGameOption(prop) { return lookup(Clientdata, ['table', 'options', prop]); }
function getGamePlayerOptions(gamename) { return Serverdata.config.games[gamename].ploptions; }
function getGameProp(prop) { return Serverdata.config.games[Clientdata.table.game][prop]; }
function getIdKey(elem) { let id = mBy(elem).id; return id.substring(1).toLowerCase(); }
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
function getPixRgb(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return { r: red, g: green, b: blue };
}
function getPlayerProp(prop,name) { let pl = Clientdata.table.fen.players[name??getUname()]; return pl[prop]; }
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
function getRadioValue(prop){
  let fs = mBy(`d_${prop}`);
  let val = get_checked_radios(fs)[0]; 
  return isNumber(val) ? Number(val) : val;
}
function getServerurl() {
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
function getThemeBg() { let style = window.getComputedStyle(document.body); let bg = valf(style.backgroundColor, style.background); return colorHex(bg); }
function getThemeDark() { return getCSSVariable('--bgNav'); } //  let bg=getThemeBg();return colorIdealText(bg);}
function getThemeFg() { return getCSSVariable('--fgButtonHover'); } //  let bg=getThemeBg();return colorIdealText(bg);}
function getTurnPlayers(fen) {
  return fen.turn.join(', ');
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
function gFg(g, color, thickness) { g.setAttribute('stroke', color); if (thickness) g.setAttribute('stroke-width', thickness); }
function gG() { return gCreate('g'); }
function gHex(w, h) { let pts = size2hex(w, h); return gPoly(pts); }
function gLine(x1, y1, x2, y2) { let r = gCreate('line'); r.setAttribute('x1', x1); r.setAttribute('y1', y1); r.setAttribute('x2', x2); r.setAttribute('y2', y2); return r; }
function gPoly(pts) { let r = gCreate('polygon'); if (pts) r.setAttribute('points', pts); return r; }
function gPos(g, x, y) { g.style.transform = `translate(${x}px, ${y}px)`; }
function gRect(w, h) { let r = gCreate('rect'); r.setAttribute('width', w); r.setAttribute('height', h); r.setAttribute('x', -w / 2); r.setAttribute('y', -h / 2); return r; }
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
function gSet_attributes() {
  const all_attrs = {
    shape: ['circle', 'triangle', 'square'],
    color: [RED, BLUE, GREEN],
    num: [1, 2, 3],
    shading: ['solid', 'empty', 'gradient'],
    background: ['white', 'grey', 'black'],
    text: ['none', 'letter', 'number'],
  };
  return all_attrs;
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
function hourglassUpdate() {
}
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
function INTERRUPT() {
  DA.merged = get_now(); 
  if (isdef(TO.SLEEPTIMEOUT)) { clearEvents(); } 
  DA.Tprev = T; T = null;
  delete DA.stopAutobot;
}
function intersectionOfArrays() {
  let arrs = arguments[0]; console.log('arrs', arrs);
  if (!arrs.every(Array.isArray)) arrs = Array.from(arguments);
  return arrs.reduce((acc, array) => acc.filter(element => array.includes(element)));
}
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; } return isLetter(s[0]); }
function isBetween(n, a, b) { return n >= a && n <= b }
function isDead(table){return arrLast(H)!=table;}
function isExpressionSeparator(ch) { return ',-.!?;:'.includes(ch); }
function isGrayColor(color, diff = 60) {
  const rgb = colorHexToRgb(color);
  return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
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
function isMergeableObject(val) {
  var nonNullObject = val && typeof val === 'object'
  return nonNullObject
    && Object.prototype.toString.call(val) !== '[object RegExp]'
    && Object.prototype.toString.call(val) !== '[object Date]'
}
function isMyTurn(fen) {  return fen.turn.includes(getUname())}
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
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }
function isWordSeparator(ch) { return ' ,-.!?;:'.includes(ch); }
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
function loadPlayerColors() {
  let [hstep, hmin, hmax] = [20, 0, 359];
  let [lstep, lmin, lmax] = [20, 50, 60];
  let [sstep, smin, smax] = [30, 70, 100];
  let [whites, blacks, all] = [[], [], []];
  for (let h = hmin; h < hmax; h += hstep) {
    for (let l = lmin; l <= lmax; l += lstep) {
      for (let s = smin; s <= smax; s += sstep) {
        let o = { h: h, s: s, l: l };
        let c = hslToHexCOOL(o);
        o.c = c;
        all.push(o);
        let fg = idealTextColor(c);
        if (fg == 'white') whites.push(c); else blacks.push(c);
      }
    }
  }
  DA.allColors = all;
  blacks.push('#FFDD33')
  let plColors = whites.concat(blacks);
  shuffle(plColors);
  let userColors = {
    "afia": "#69c963",
    "ally": "#6660f3",
    "amanda": "#339940FF",
    "annabel": "#ADA0EEFF",
    "bob": "#033993",
    "buddy": "midnightblue",
    "felix": BLUE,
    "guest": "dodgerblue",
    "gul": "#6fccc3",
    "lauren": BLUEGREEN,
    "leo": "#C19450FF",
    "mac": ORANGE,
    "minnow": "#F28DB2",
    "mimi": "#76AEEBFF",
    "nasi": "#EC4169FF",
    "nimble": "#6E52CCFF",
    "sarah": "deeppink",
    "sheeba": "gold",
    "valerie": "lightgreen"
  };
  for (const plname in userColors) {
    let uc = userColors[plname];
    uc = colorHex(uc);
    let already = firstCond(all, x => x.c.toLowerCase() == uc.substring(0, 7).toLowerCase());
    if (already) console.log('_present', uc);
  }
  ensureColorDict();
  ensureColorNames();
  let allColors = Object.values(ColorDi).map(x => x.c);
  let list = Object.values(userColors).concat(plColors.concat(allColors).concat(Object.values(ColorNames)));
  list = list.filter(x => colorLum(x) < .85);
  list = list.filter(x => !isGrayColor(x));
  let s = new Set(list);
  list = Array.from(s);
  let hsllist = list.map(x => colorHSL(x, true));
  sortByMultipleProperties(hsllist, 'h', 'l');
  list = hsllist.map(x => colorHex(x));
  list = arrRemoveDuplicates(list);
  M.playerColors = list;
  return list;
}
function logItems() { Object.keys(Items).sort().forEach(k => console.log('Items', Items[k])); }
function make_set_deck(n_or_attr_list) {
  let all_attrs = gSet_attributes();
  let keys = get_keys(all_attrs);
  let n = isNumber(n_or_attr_list) ? n_or_attr_list : n_or_attr_list.length;
  let attrs = isNumber(n_or_attr_list) ? arrTake(keys, n) : n_or_attr_list;
  let list = ['0', '1', '2'];
  let i = 1;
  while (i < n) {
    let [l1, l2, l3] = [jsCopy(list), jsCopy(list), jsCopy(list)];
    l1 = l1.map(x => '0' + x); l2 = l2.map(x => '1' + x); l3 = l3.map(x => '2' + x);
    list = l1.concat(l2).concat(l3);
    i++;
  }
  return list;
}
function makeArrayWithParts(keys) {
  let arr = []; keys[0].split('_').map(x => arr.push([]));
  for (const key of keys) {
    let parts = key.split('_');
    for (let i = 0; i < parts.length; i++) arr[i].push(parts[i]);
  }
  return arr;
}
function makeSVG(tag, attrs) {
  var el = "<" + tag;
  for (var k in attrs)
    el += " " + k + "=\"" + attrs[k] + "\"";
  return el + "/>";
}
function mButtonX(dParent, handler, sz = 30, offset = 0, color = 'white') {
  mIfNotRelative(dParent);
  let bx = mDom(dParent, { position: 'absolute', top: -2 + offset, right: -5 + offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
  bx.onclick = ev => { evNoBubble(ev); handler(ev); } 
  let o = M.superdi.xmark;
  el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: color, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
}
function mCheckbox(dg, name, value) {
  let di = mDom(dg, { display: 'inline-block' });
  let chk = mDom(di, {}, { tag: 'input', type: 'checkbox', id: getUID('c'), name: name });
  if (isdef(value)) chk.checked = value;
  let label = mDom(di, {}, { tag: 'label', html: name, for: chk.id });
  return di;
}
function mCommand(dParent, key, html, open, close) {
  if (nundef(html)) html = capitalize(key);
  if (nundef(open)) open = window[`onclick${capitalize(key)}`];
  if (nundef(close)) close = () => { console.log('close', key) }
  let d = mDom(dParent, { display: 'inline-block' }, { key: key });
  let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })
  return { dParent, elem: d, div: a, key, open, close };
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
function mergeOverrideArrays(base, drueber) {
  return deepmerge(base, drueber, { arrayMerge: overwriteMerge });
}
function mExists(d) { return isdef(toElem(d)); }
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
function mimali(c, n) {
  function whh(c1, c2) { return generateArrayColors(colorHex(c1), colorHex(c2), 10); }
  function genc(c, hinc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, hsl.s * 100, hsl.l * 100); }
  function cinc(c, hinc, sinc, linc) { let hsl = colorHSL(c, true); return colorHSLBuild((hsl.h + hinc) % 360, clamp(hsl.s * 100 + sinc, 0, 100), clamp(hsl.l * 100 + linc, 0, 100)); }
  function arrd(c, hinc, sinc, linc, n) { let r = []; for (let i = 0; i < n; i++) { r.push(cinc(c, hinc * i, sinc * i, linc * i)); } return r; }
  function light(c, lper = 75) { let hsl = colorHSL(c, true); return colorHSLBuild(hsl.h, hsl.s * 100, lper); }
  function sat(c, sper = 100) { let hsl = colorHSL(c, true); return colorHSLBuild(sper, hsl.s * 100, hsl.l * 100); }
  function hue(c, hdeg) { let hsl = colorHSL(c, true); return colorHSLBuild(hdeg, hsl.s * 100, hsl.l * 100); }
  c = light(c, 75);
  let diff = Math.round(360 / n)
  wheel = arrd(c, diff, 0, 0, n);
  return wheel;
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
function mRemoveIfExists(d){ d=toElem(d);if (isdef(d)) d.remove();}
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
    if (isdef(_STYLE_PARAMS[k])) key = _STYLE_PARAMS[k];
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
  let overrideList = [];
  overrideList.push({ keys: ['fen', 'players', name, 'playmode'], val: 'bot' });
  let res = await sendMergeTable({ id, name, overrideList });
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
async function onclickColor(ev) {
  let c = ev.target.style.background;
  c = colorHex(c);
  setColors(c);
  U.color = c;
  await postUserChange();
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
  let overrideList = [];
  overrideList.push({ keys: ['fen', 'players', name, 'playmode'], val: 'human' });
  let res = await sendMergeTable({ id, name, overrideList });
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
  let bg = mGetStyle('dNav', 'bg');
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
async function onclickTable(id) {  await showTable(id); }
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
async function onsockMerged(x){
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
function presentExtraWorker(item, dParent, styles = {}) {
  let sz = styles.sz;
  addKeys({ paright: 10, bg: 'white', rounding: '50%', hmargin: 8, h: 30, position: 'relative' }, styles)
  let d = mDom(dParent, styles); mFlex(d);
  let img = mDom(d, { h: '100%' }, { tag: 'img', src: '../assets/games/nations/templates/worker.png' })
  let img2 = mDom(d, { h: sz * 2 / 3, w: sz * 2 / 3, position: 'absolute', top: '17%', left: '40%' }, { tag: 'img', src: `../assets/games/nations/templates/${item.o.res}.png` });
  return d;
}
function presentImageCropper(url) {
  let d = mDom('dMain', { position: 'absolute', h: 500, w: 500, bg: 'navy' });
  let img = mDom(d, { w: 300, h: 300, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: url });
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
function resizeTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  if (hnew == 0) hnew = img.height;
  if (wnew == 0) {
    let aspectRatio = img.width / img.height;
    wnew = aspectRatio * hnew;
  }
  redrawImage(img, dParent, 0, 0, img.width, img.height, wnew, hnew, () => setRect(0, 0, wnew, hnew))
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
function rWord(n = 6) { return rLetters(n).join(''); }
function rWords(n = 1) {
  let words = getColorNames().map(x => x.toLowerCase());
  let arr = rChoose(words, n);
  return arr;
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
  dInstruction.innerHTML = (isMyTurn(fen) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
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
function selPrep(fen, autosubmit = false) {
  Clientdata.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: autosubmit };
  Clientdata.fen = fen;
}
async function sendMergeTable(o) { 
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
  let table =  await mPostRoute('mergeTable', o); 
  await showTable(table);
}
async function setActivate(vid) {
  let view = V[vid]; 
  let items = view.items;
    view.sets = setFindAllSets(items);
    [view.bNoSet, view.bHint] = setShowButtons(items);
    setActivateCards(items);
    let use_level = getGameOption('use_level'); if (use_level == 'no') { view.bHint.remove(); return; }
    let level = getPlayerProp('level',view.name);
    let noset = isEmpty(view.sets);
    view.numHints = level <= 3 ? noset ? 1 : 2 : level <= 5 ? 1 : 0;
    if (level > 5) { view.bHint.remove(); }
    else if (level == 1) { view.autoHints = noset ? 1 : 2; view.hintTimes = [noset ? 10000 : 2000, 5000]; }
    else if (level == 2) { view.autoHints = noset ? 1 : 2; view.hintTimes = [noset ? 10000 : 3000, 8000]; }
    else if (level == 3) { view.autoHints = 1; view.hintTimes = [noset ? 10000 : 4000]; }
    else if (level == 4) { view.autoHints = 1; view.hintTimes = [noset ? 10000 : 8000]; }
    let i = 0;
    while (i < view.autoHints) {
      await mSleep(view.hintTimes[i]);
      if (DA.stopAutobot == true) { console.log(`autoHint ${i}`); return; }
      await setOnclickHint(items);
      i++;
    }
}
function setActivateCards(items) {
  for (const item of items) {
    let d = iDiv(item);
    d.onclick = () => setOnclickCard(item, items, true);
    mStyle(d, { cursor: 'pointer' })
  }
}
async function setBotMove(table) {
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
}
function setCheckIfSet(keys) {
  let arr = makeArrayWithParts(keys);
  let isSet = arr.every(x => arrAllSameOrDifferent(x));
  return isSet;
}
function setColors(c) {
  let hsl = colorHSL(c, true);
  let [hue, diff, wheel, p] = [hsl.h, 30, [], 20];
  let hstart = (hue + diff);
  for (i = hstart; i <= hstart + 235; i += 20) {
    let h = i % 360;
    let c1 = colorFromHSL(h, 100, 75);
    wheel.push(c1);
  }
  let cc = idealTextColor(c);
  let pal = colorPalette(c); pal.unshift('black'); pal.push('white');
  let palc = colorPalette(cc);
  function light(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 + i]; }
  function dark(i = 3) { if (i < 0) i = 0; if (i > 5) i = 5; return pal[5 - i]; }
  function simil(i = 3) { return cc == 'white' ? dark(i) : light(i); }
  function contrast(i = 3) { return cc == 'white' ? light(i) : dark(i); }
  setCssVar('--bgBody', c);
  setCssVar('--bgButton', 'transparent')
  setCssVar('--bgButtonActive', light(3))
  setCssVar('--bgNav', simil(2))
  setCssVar('--bgLighter', light())
  setCssVar('--bgDarker', dark())
  setCssVar('--fgButton', contrast(3))
  setCssVar('--fgButtonActive', cc == 'black' ? dark(2) : c)
  setCssVar('--fgButtonDisabled', 'silver')
  setCssVar('--fgButtonHover', contrast(5))
  setCssVar('--fgTitle', contrast(4))
  setCssVar('--fgSubtitle', contrast(3))
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
function setgame() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.deck = setCreateDeck();
    fen.cards = deckDeal(fen.deck, table.options.numCards);
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames); 
    delete table.players;
    return fen;
  }
  function checkGameover(table) { return table.playerNames.some(x => x.score == table.options.winning_score); }
  async function activate(vid) { await setActivate(vid); } 
  async function botMove(vid) { await setBotMove(vid); } 
  async function presentTable(dParent, table, name, sz) { return await setPresentTable(dParent, table, name, sz); }
  async function presentPlayer(vid) { return await setPresentPlayer(vid); }
  async function presentStats(dParent,vid) { return await setPresentStats(dParent,vid); }
  return { setup, checkGameover, activate, botMove, presentTable, presentPlayer, presentStats };
}
function setGameover(table) {
  table.status = 'over';
  table.winners = getPlayersWithMaxScore(table.fen);
}
function setHintHide(vid) { let view = V[vid]; mClass(view.bHint, 'disabled'); } //mStyle(view.bHint,{display:'hidden'}); } //view.bHint.remove();}
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
  let overrideList = [];
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
      overrideList.push({ keys: ['fen', 'cards'], val: table.fen.cards });
      overrideList.push({ keys: ['fen', 'deck'], val: table.fen.deck });
      pl.score++;
      pl.incScore = 1;
    } else {
      pl.score--;
      pl.incScore = -1;
    }
    overrideList.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
    if (pl.playmode == 'bot') {
      await mSleep(500);
      if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
    }
    let res = await sendMergeTable({ id: table.id, name: me, overrideList }); // console.log('res', res)
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
  let overrideList = [];
  if (isEmpty(T.sets)) { 
    pl.score++;
    pl.incScore = 1;
    let newCards = deckDeal(fen.deck, 1); 
    if (!isEmpty(newCards)) {
      fen.cards.push(newCards[0]);
      overrideList.push({ keys: ['fen', 'cards'], val: table.fen.cards });
      overrideList.push({ keys: ['fen', 'deck'], val: table.fen.deck });
    } else {
      setGameover(table);
      overrideList.push({ keys: ['status'], val: table.status });
      overrideList.push({ keys: ['winners'], val: table.winners });
      console.log(`table status is now ${table.status}`);
      assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
    }
  } else {
    pl.score--;
    pl.incScore = -1;
  }
  overrideList.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
  if (pl.playmode == 'bot') {
    await mSleep(500);
    if (checkInterrupt(items)) { console.log('!!!onclick noset!!!'); return; }
  }
  let res = await sendMergeTable({ id: table.id, name: me, overrideList });
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
      measure_fieldset(fs);
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
function setPlayersToMulti(){
  for(const name in DA.allPlayers){
    DA.allPlayers[name].playmode='human';
    let el=document.querySelector(`div[username="${name}"]`);
    let img = el.getElementsByTagName('img')[0];
    mStyle(img,{round:true});
  }
  setRadioValue('playmode','human');
}
function setPlayersToSolo(){
  for(const name in DA.allPlayers){
    if (name==getUname()) continue;
    DA.allPlayers[name].playmode='bot';
    let el=document.querySelector(`div[username="${name}"]`);
    let img = el.getElementsByTagName('img')[0];
    mStyle(img,{rounding:2});
  }
  let popup=mBy('dPlayerOptions');
  if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
  setRadioValue('playmode','bot');
}
async function setPresentPlayer(vid){
  let view = V[vid];
  let [table, name, dOben]=[view.table,view.name,view.dOben];
  mDom(dOben,{},{html:name});
}
async function setPresentStats(dParent,vid){
  let view = V[vid];
  view.dStats=dParent;
  setStats(view.table, view.name, dParent, 'rowflex', false);
}
function setPresentTable(dParent, table, name, sz) {
  const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; //'#4b0082' //'#8e44ed' }; //'blueviolet' }; //'#8e44ad' };
  setLoadPatterns('dPage', colors);
  let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.fen.players, table.fen.turn];
  let cards = fen.cards;
  let dp = mDom(dParent, { w100: true }); mCenterFlex(dp);
  let dBoard = mGrid(cards.length / 3, 3, dp, { gap: isdef(sz) ? sz / 8 : 14 });
  let items = [];
  for (const c of cards) {
    let d = setDrawCard(c, dBoard, colors, isdef(sz) ? sz : TESTING ? 80 : 100);
    let item = mItem({ div: d }, { key: c });
    items.push(item);
  }
  return { dBoard, items, div:dParent, table, name, sz };
}
function setRadioValue(prop,val){
  let input = mBy(`i_${prop}_${val}`);
  input.checked = true;
}
function setScoresSameOrHigher(told,tnew){
  if (nundef(told)) return true;
  let [plold,plnew]=[told.fen.players,tnew.fen.players];
  for(const name in plnew){
    if (plold[name].score+plold[name].incScore != plnew[name].score) return false;
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
function setStats(table, name, dParent, layout, showTurn = true) {
  let [fen, me] = [table.fen, name];
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
function setTableToStarted(table) {
  table.status = 'started';
  table.step = 0;
  table.fen = DA.funcs[table.game].setup(table); 
  return table;
}
async function showCalendarApp() {
  if (!U) { console.log('you have to be logged in to use this menu!!!'); return; }
  showTitle('Calendar');
  let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
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
async function showColors() {
  showTitle('Set Color Theme');
  let sz = 30;
  let d = mDom('dMain', { wmax: (sz + 4) * 15, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
    dc.onclick = onclickColor;
    mStyle(dc, { cursor: 'pointer' });
  }
}
async function showDashboard() {
  let me = getUname();
  mDom('dMain', { fg: getThemeFg() }, { html: `hi, ${me}! this is your dashboard` });
  if (me == 'guest') mDom('dMain',{align:'center',className:'section'},{html:'click username in upper left corner to log in'})
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
      measure_fieldset(fs);
    }
  }
  let inpsolo=mBy(`i_gamemode_solo`);//console.log('HALLO',inpsolo)
  let inpmulti=mBy(`i_gamemode_multi`);
  if (isdef(inpsolo)) inpsolo.onclick = setPlayersToSolo;
  if (isdef(inpmulti)) inpmulti.onclick = setPlayersToMulti;
}
function showGameover(table) {
  let winners = table.winners;
  let msg = winners.length > 1 ? `GAME OVER - The winners are ${winners.join(', ')}!!!` : `GAME OVER - The winner is ${winners[0]}!!!`;
  let d = mBy('ribbon'); if (isdef(d)) d.remove();
  let bg = `linear-gradient(270deg, #fffffd, #00000080)`
  d = mDom(dTitle, { bg, mabottom: 10, align: 'center', padding: 10, fz: 40, w100: true }, { html: msg, id: 'ribbon' });
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
  gamelist = ['setgame']
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
  mStyle(d, { h: 21, bg: 'red', fg: 'yellow' }); //getThemeFg()});
  d.innerHTML = msg;
  clearTimeout(TO.message);
  TO.message = setTimeout(() => mStyle('dMessage', { h: 0 }), ms)
}
function showNavbar() {
  let nav = mMenu('dNav');
  let commands = {};
  commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
  commands.colors = menuCommand(nav.l, 'nav', 'colors', null, showColors, clearMain);
  commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, collClear);
  commands.play = menuCommand(nav.l, 'nav', 'play', 'Tables', onclickPlay, clearMain);
  commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
  nav.commands = commands;
  return nav;
}
async function showTable(table) {
  if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
  if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
  Clientdata.table = table;
  let me = getUname();
  console.log('table', table, get_now()); table.ts=get_now();
  H.push(table); 
  showTitle(`${table.friendly}`);
  let func = DA.funcs[table.game];
  mClear('dMain'); 
  let d = mDom('dMain',{w100:true,box:true,padding:12}); //, bg: '#00000080' }); mCenterFlex(d)
  [dOben, dOpenTable, dRechts] = tableLayoutMR(d);
  let vid='main';
  V[vid] = func.presentTable(dOpenTable,table,me,100);
  func.presentStats(dOben,vid);
  mRise(d);
}
async function showTables(from) {
  Clientdata.table = null;
  if (TESTING) testUpdateTestButtons();
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
    if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: get_waiting_html(24) }); //'my turn!'});
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
function showTitle(title) {
  mClear('dTitle');
  return mDom('dTitle', { maleft: 20 }, { tag: 'h1', html: title, classes: 'title' });
}
function showUser() {
  mClear(dUser);
  mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  let d;
  d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: getUname(), className: 'activeLink' });
  setColors(U.color)
  d.onclick = onclickUser;
}
function showUserImage(uname, d, sz = 40) {
  let u = Serverdata.users[uname];
  return showim1(u.key, d, { 'object-position': 'center top', 'object-fit': 'cover', h: sz, w: sz, round: true, border: `${u.color} 2px solid` });
}
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
function stopAutobot() {
  if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
  DA.stopAutobot = true;
}
async function switchToMainMenu(name){return await switchToMenu(UI.nav,name);}
async function switchToMenu(menu, key) {
  menuCloseCurrent(menu);
  Clientdata.curMenu = key; 
  await menuOpen(menu, key);
}
async function switchToOtherUser() {
  let uname = await mGetRoute('otherUser',arguments);
  await switchToUser(uname);
}
async function switchToTables(){return await switchToMainMenu('play');}
async function switchToUser(uname) {
  if (!isEmpty(uname)) uname = normalizeString(uname);
  if (isEmpty(uname)) uname = 'guest';
  sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
  U = await getUser(uname);
  Clientdata.curUser = uname;
  localStorage.setItem('username', uname);
  iDiv(UI.user).innerHTML = uname;
  setColors(U.color);
  if (uname == 'guest') { 
    await switchToMenu(UI.nav, 'home'); 
    menuDisable(UI.nav, 'plan'); 
  }  else {
    menuEnable(UI.nav, 'plan');
    let t = Clientdata.table;
    let cur = Clientdata.curMenu; 
    if (cur == 'play' && isdef(t) && t.playerNames.includes(uname) && t.status == 'started') await showTable(t.id);
    else await switchToMenu(UI.nav, valf(cur, 'home'));
  }
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
  let d=mGrid(1,2,dParent);
  let [dMiddle, dRechts] = [mDom(d),mDom(d)]; 
  let dOben = mDom(dMiddle, {mabottom:10}, {id:'dOben'});
  let dOpenTable = mDom(dMiddle, {}, {id:'dOpenTable'});
  return [dOben,dOpenTable,dRechts];
}
function tabtitleUpdate() {
}
function toggle_select(item, funcs) {
  let params = [...arguments];
  let ifunc = (valf(item.ifunc, 0) + 1) % funcs.length; let f = funcs[ifunc]; f(item, ...params.slice(2));
}
function toggleSelectionOfPicture(elem, selkey, selectedPics, className = 'framedPicture') {
  if (selectedPics.includes(selkey)) {
    removeInPlace(selectedPics, selkey); collUnselect(elem);
  } else {
    selectedPics.push(selkey); collSelect(elem);
  }
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
  let dTitle = mDiv(container, { w: 760, padding: gap, fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' }, { className: 'title' });
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
    let c = colorHex(mGetStyle('dNav', 'bg')); //info.seedColor; //info.wheel[m-1];
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
  let dOuter = mDom(dParent); dOuter.setAttribute('inert',true); //console.log(dOuter)
  if (layout == 'rowflex') mStyle(dOuter,{display:'flex',justify:'center'});
  else if (layout == 'col') mStyle(dOuter,{display:'flex',dir:'column'});
  addKeys({ rounding: 10, bg: '#00000050', margin: 4, box: true, 'border-style': 'solid', 'border-width': 4 }, styles);
  let n = fen.plorder.indexOf(me);
  let order = arrCycle(fen.plorder, n<0?0:n );
  let items = {};
  for (const name of order) {
    let pl = fen.players[name];
    styles['border-color'] = name == me?colorDarker(pl.color):pl.color;
    let d = mDom(dOuter, styles, { id: name2id(name) })
    let img = showUserImage(name, d, 40);mStyle(img,{box:true})
    items[name] = { div: d, img, name };
  }
  return items;
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
