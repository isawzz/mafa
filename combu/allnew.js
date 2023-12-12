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
function AhexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
function closeApps() {
  if (isdef(DA.calendar)) { closePopup(); delete DA.calendar; }
  mClear('dMain');
  mClear(dTitle);
}
function closePopup(name = 'dPopup') { if (isdef(mBy(name))) mBy(name).remove(); }
function collectCats(klist) {
  let cats = [];
  for (const k of klist) {
    M.superdi[k].cats.map(x => addIf(cats, x));
  }
  return cats;
}
function collectionAddEmpty(ev) {
  if (ev.key != 'Enter') return;
  console.log('onupdate', ev.target, ev.target.value);
  let val = ev.target.value;
  addIf(M.collections, val);
  M.collections.sort()
  M.byCollection[val] = [];
  initCollection(val);
}
function cropTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  let xnew = x + (wnew - w) / 2;
  let ynew = y + (hnew - h) / 2;
  redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
function filterImages(ev) {
  let s = ev.target.value.toLowerCase().trim();
  if (isEmpty(s)) return;
  let di = {};
  for (const k of M.masterKeys) {
    di[k] = true;
  }
  let list = isdef(M.byCat[s]) ? M.byCat[s].filter(x => isdef(di[x])) : [];
  if (nundef(list) || isEmpty(list)) {
    list = [];
    for (const k of M.masterKeys) {
      let o = M.superdi[k];
      if (k.includes(s) || o.friendly.includes(s)) list.push(k);
    }
    if (isEmpty(list)) return;
  }
  M.keys = list;
  M.index = 0;
  showImageBatch(0);
}
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
function getServerurl() {
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
function initCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection',name)
  mClear(dMenu);
  let dParent = dMenu;
  let colls = M.collections;
  mDom(dParent, {}, { html: '' });
  let dlColl = mDatalist(dParent, colls, { onupdate: collectionAddEmpty });
  dlColl.inpElem.oninput = ev => initCollection(ev.target.value);
  dlColl.inpElem.value = name;
  initFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
function initFilter(list) {
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  mDom(dMenu, {}, { html: 'Filter:' });
  let dlCat = mDatalist(dMenu, cats, { edit: false });
  dlCat.inpElem.oninput = filterImages;
}
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; return true; } }
function isGrayColor(color, diff = 60) {
  const rgb = AhexToRgb(color);
  return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
async function loadCollections() {
  M = {};
  M.superdi = await mGetYaml('../assets/superdi.yaml');
  M.byCollection = {};
  M.byCat = {};
  M.byFriendly = {};
  M.collections = ['all'];
  M.categories = [];
  M.names = [];
  for (const k in M.superdi) {
    let o = M.superdi[k];
    if (isdef(o.coll)) { lookupAddIfToList(M.byCollection, [o.coll], o.key); addIf(M.collections, o.coll); }
    o.cats.map(x => { lookupAddIfToList(M.byCat, [x], o.key); addIf(M.categories, x); });
    if (isdef(o.friendly)) { lookupAddIfToList(M.byFriendly, [o.friendly], o.key); addIf(M.names, o.friendly); }
  }
  M.collections.sort();
  M.categories.sort();
  M.names.sort();
  await updateCollections();
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
    if (already) console.log('present', uc);
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
function mButtonX(dParent, sz = 30, offset = 0, id = null) {
  mIfNotRelative(dParent);
  let popup = isdef(id) ? mBy(id) : dParent;
  if (nundef(id)) id = dParent.id;
  let bx = mDom(dParent, { position: 'absolute', top: -2 + offset, right: -5 + offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
  bx.onclick = ev => { evNoBubble(ev); popup.remove() };
  let o = M.superdi.xmark;
  el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: 'dimgray', display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
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
  mDom(d, { w: 200 }, { tag: 'input', className: 'input', placeholder: "<enter value>" });
  mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });
  var elem = d;
  var inp = elem.firstChild;
  var datalist = elem.lastChild;
  for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }
  inp.setAttribute('list', optid);
  if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate);
  inp.onmousedown = () => inp.value = ''
  return {
    list: mylist,
    elem: elem,
    inpElem: inp,
    listElem: datalist,
    opts: opts,
  }
}
function mDropZone(dropZone, onDrop) {
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
function mDummyFocus() {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  mBy('dummy').focus();
}
function measureElement(el) {
  let info = window.getComputedStyle(el, null);
	return {w:info.width,h:info.height};
}
function measureHeight(dParent,styles={}){
	let d=mDom(dParent,styles,{html:'Hql'});
	let s=measureElement(d);
	d.remove();
	return firstNumber(s.h);
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
function mNavbar(dParent, styles, pageTitle, titles, funcNames) {
  if (nundef(funcNames)) {
    funcNames = titles.map(x => `onclick${capitalize(x)}`);
  }
  function activate(ev) {
    closeApps();
    let links = document.getElementsByClassName('nav-link');
    let inner = isString(ev) ? ev : ev.target.innerHTML;
    for (const el of links) {
      if (el.innerHTML == inner) mClass(el, 'active');
      else mClassRemove(el, 'active');
    }
  }
  function disable() {
    let links = Array.from(document.getElementsByClassName('nav-link'));
    for (const w of arguments) {
      let el = links.find(x => x.innerHTML == w);
      if (isdef(el)) mClass(el, 'disabled');
    }
  }
  function enable() {
    let links = document.getElementsByClassName('nav-link');
    for (const w of arguments) {
      let el = links.find(x => x.innerHTML == w);
      if (isdef(el)) mClassRemove(el, 'disabled');
    }
  }
  function isThemeLight() { return !U || U.theme == 'light' ? true : false; }
  function extra1() {
    let ui = mDom(dParent, { display: 'flex', 'flex-wrap': 'wrap', 'align-items': 'center', 'justify-content': 'space-between' });
    mStyle(ui, { 'flex-flow': 'row nowrap' });
    mClass(dParent, 'nav');
    let d1 = mDom(ui, { display: 'flex', 'align-items': 'center', gap: 12 });
    let title = mDom(d1, { fz: 20 }, { html: pageTitle, classes: 'title' });
    let d2 = mDom(d1);
    for (let i = 0; i < titles.length; i++) {
      let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
    }
    return ui;
  }
  var ui = extra1();
  return { activate: activate, disable: disable, enable: enable, ui: ui };
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
async function mPrompt(dParent = 'dUser', placeholder = '<username>', cond = isAlphanumeric) {
  return new Promise((resolve, reject) => {
    mClear(dParent)
    let d = mInput(dParent, { w: 100 }, 'inpPrompt', placeholder, 'input', 1);
    d.focus();
    d.onkeyup = ev => {
      if (ev.key == 'Enter') {
        let val = ev.target.value;
        ev.target.remove();
        if (cond(val)) {
          resolve(val.toLowerCase().trim());
        } else {
          console.log('invalid input!');
          resolve(null);
        }
      } else if (ev.key == 'Escape') {
        resolve(null);
      }
    };
  });
}
async function onclickAdd() {
  showTitle('Add to Collections');
  let colls = M.collections;
  let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
  let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);
  let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { ev.preventDefault(); return false; } });
  mDom(dForm, {}, { html: 'Collection:' }); let dl = mDatalist(dForm, colls);
  mDom(dForm, { h: 10 })
  mDom(dForm, {}, { html: 'Name:' }); let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', value: '', className: 'input', placeholder: "<enter value>" });
  mDom(dForm, { h: 10 })
  UI.dTool = mDom(dForm)
  UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
  UI.dForm = dForm;
  UI.dButtons = mDom(dTitle, { display: 'inline-block' });
  UI.imgCat = dl.inpElem;
  UI.imgName = inpName;
}
async function onclickColor(ev) {
  let c = ev.target.style.background;
  c = colorHex(c);
  setColors(c);
  if (U) {
    U.color = c;
    await postUserChange();
  }
}
async function onclickColors() {
  showTitle('Set Color Theme');
  let d = mDom('dMain', { hpadding: 20, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  let i = 0;
  let w = Math.min(50, (window.innerWidth - 150) / 15);
  for (const c of list) {
    let dc = mDom(d, { w: w, h: 50, bg: c, fg: idealTextColor(c) });
    dc.onclick = onclickColor;
    mStyle(dc, { cursor: 'pointer' });
    i++; if (i % 15 == 0) mDom(d, { w: '100%', h: 0 });
  }
}
function onclickExistingEvent(ev) { evNoBubble(ev);showEventOpen(evToId(ev)); }
async function onclickItem(ev) {
  let elem = ev.target;
  let key = ev.target.getAttribute('key');
  if (nundef(Items[key])) {
    let o = M.superdi[key];
    Items[key] = { selected: false };
    addKeys(o, Items[key]);
  }
  Items[key].div = elem.parentNode;
  if (nundef(M.selectedImages)) M.selectedImages = [];
  toggleSelectionOfPicture(Items[key], M.selectedImages);
}
async function onclickNext() { showImageBatch(1); }
async function onclickPrev() { showImageBatch(-1); }
async function onclickSchedule() { showCalendarApp(); }
async function onclickUpload() {
  let img = UI.img;
  let name = valnwhite(UI.imgName.value, rUID('img'));
  let unique = isdef(M.superdi[name]) ? rUID('img') : name;
  let cat = valnwhite(UI.imgCat.value, 'other');
  let data = await uploadImg(img, unique, cat, name);
  await updateCollections();
}
async function onclickUser() {
  let uname = await mPrompt();
  console.log('onclickUser:', uname);
  if (isdef(uname) && (!U || U.name != uname)) { await switchToUser(uname); }
  await showUser(uname);
}
async function onclickView() {
  showTitle('Collection:');
  dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  showSidebar(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  initCollection(valf(localStorage.getItem('collection'),'animals'));
}
async function ondropPreviewImage(url, key) {
  if (isdef(key)) {
    let o = M.superdi[key];
    UI.imgCat.value = o.cats[0];
    UI.imgName.value = o.friendly;
  }
  let dParent = UI.dDrop;
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
async function prelims() {
  if (nundef(M.superdi)) {
    Serverdata = await mGetRoute('session');
    await loadCollections();
    loadPlayerColors();
    let nav = UI.nav = mNavbar('dNav', {}, 'COMBU', ['add', 'play', 'schedule', 'view', 'colors']);
    nav.disable('play');
    dTitle = mDom('dPageTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
    dUser = mDom(nav.ui, {}, { id: 'dUser' });
    U = getUser(localStorage.getItem('username'));
    await showUser(U ? U.name : null);
    let server = getServerurl();
    Socket = io(server);
    Socket.on('message', showChatMessage);
    Socket.on('disconnect', x => console.log('>>disconnect:', x));
    Socket.on('update', x => console.log('>>update:', x));
    let dChat = mDom('dChat');
    UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
    UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
    mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
  }
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
function showCalendarApp() {
  if (!U) { console.log('you have to be logged in to use this menu!!!'); return; }
  showTitle('Calendar');
  let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
  let x = DA.calendar = uiTypeCalendar(d1);
}
function showChatMessage() {
  for (const arg of [...arguments]) {
    console.log('arg', arg);
    let d = mBy('dChatWindow');
    if (d) mDom(d, {}, { html: arg })
  }
}
function showImageBatch(inc = 0) {
  let [keys, index, x] = [M.keys, M.index, M.rows * M.cols];
  if (isEmpty(keys)) showFleetingMessage('nothing has been added to this collection yet!', 'dMessage', { margin: 10 }, 5000)
  if (keys.length <= x) inc = 0;
  index += x * inc; if (index >= keys.length) index = 0; else if (index < 0) index += keys.length;
  let list = arrTakeFromTo(keys, index, index + x);
  M.index = index;
  for (let i = 0; i < list.length; i++) {
    mStyle(M.cells[i], { opacity: 1 })
    showImageInBatch(list[i], M.cells[i]);
  }
  for (let i = list.length; i < x; i++) {
    mStyle(M.cells[i], { opacity: 0 })
  }
}
function showImageInBatch(key, dParent, styles = {}) {
  let o = M.superdi[key];
  try {
    addKeys({ bg: rColor() }, styles);
    mClear(dParent);
    [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
    let [sz, fz] = [.9 * w, .8 * h];
    let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', overflow: 'hidden' });
    mCenterCenterFlex(d1)
    let el = null;
    if (isdef(o.img)) {
      el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
    }
    else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
    else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
    else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
    else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
    assertion(el, 'PROBLEM mit' + key);
    mStyle(el, { cursor: 'pointer' })
    el.onclick = onclickItem;
    el.setAttribute('key', key)
  } catch {
    console.log('ERROR showImage:', key, o)
  }
}
function showSidebar(dParent) {
  dSidebar = mDom(dParent, { 'align-self': 'stretch', hmin: '100vh' }, { id: 'dSidebar' });
  dLeiste = mDiv(dParent);
  mStyle(dLeiste, { wmin: 70, hmin: '100vh', display: 'flex', 'flex-flow': 'column wrap' });
}
function showTitle(title, buttons = []) {
  mClear(dTitle);
  mDom(dTitle, {}, { tag: 'h1', html: title, classes: 'title' });
  for (const b of buttons) {
    mButton(b.caption, b.handler, dTitle, { w: 70, margin: 0 }, 'input');
  }
}
async function showUser(uname) {
  UI.nav.activate('no')
  mClear(dUser);
  mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  let d;
  if (U) {
    d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'active' });
    setColors(U.color)
  } else {
    let styles = { family: 'fa6', fg: 'grey', fz: 25, cursor: 'pointer' };
    d = mDom(dUser, styles, { html: String.fromCharCode('0x' + M.superdi.user.fa6) })
  }
  d.onclick = onclickUser;
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
function squareTo(tool, sznew = 128) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  if (sznew == 0) sznew = h;
  let sz = Math.max(w, h)
  let [x1, y1] = [x - (sz - w) / 2, y - (sz - h) / 2];
  redrawImage(img, dParent, x1, y1, sz, sz, sznew, sznew, () => tool.setRect(0, 0, sznew, sznew))
}
async function switchToUser(uname) {
  U = await getUser(uname);
  localStorage.setItem('username', uname);
}
async function test40_socketio() {
  await prelims();
  console.log('Serverdata', Serverdata)
  let server = getServerurl();
  Socket = io(server);
  Socket.on('message', showChatMessage);
  Socket.on('disconnect', x => console.log('>>disconnect:', x));
  Socket.on('update', x => console.log('>>update:', x));
  let dChat = mDom('dChat');
  UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
  UI.chatWindow = mDom(dChat, { hmax: 300 }, { id: 'dChatWindow' });
  mOnEnter(UI.chatInput, ev => Socket.emit('message', ev.target.value));
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
async function updateCollections() {
  let imgs = await mGetYaml('../y/m2.yaml');
  for (const k in imgs) {
    if (isdef(M.superdi[k])) continue;
    let o = imgs[k];
    M.superdi[k] = { key: k, friendly: o.name, cats: [o.cat], ext: o.ext, img: `${k}.${o.ext}`, path: `../y/img/${k}.${o.ext}` };
    addIf(M.collections, o.coll);
    addIf(M.categories, o.cat);
    addIf(M.names, o.name);
    lookupAddIfToList(M.byCat, [o.cat], k);
    lookupAddIfToList(M.byFriendly, [o.name], k);
    lookupAddIfToList(M.byCollection, [o.coll], k);
  }
  M.categories.sort();
  M.names.sort();
  M.collections.sort();
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
