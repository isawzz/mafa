async function addDirToCollections(dir, coll, cat) {
  let filenames = await mGetFiles(dir);
  //console.log(filenames)
  addIf(M.collections, coll);
  addIf(M.categories, cat);
  for (const name of filenames) {
    let img = name;
    let path = `../assets/${dir}/${name}`;
    let k = stringBefore(name, '.');
    let friendly = k;
    // if (['leo','viola','wolf'].includes(k)) continue;
    if (isdef(M.superdi[k])) {
      k = `${coll}_${k}`;
      //console.log('duplicate:',k)
    }
    //assertion(nundef(M.superdi[k]),`username is already in superdi!!!!!! ${k}`);
    M.superdi[k] = { key: k, friendly: friendly, cats: [cat], ext: stringAfter(name, '.'), img: `${name}`, path: path };
    addIf(M.names, friendly);
    lookupAddIfToList(M.byCat, [cat], k);
    lookupAddIfToList(M.byFriendly, [friendly], k);
    lookupAddIfToList(M.byCollection, [coll], k);
  }

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
function colorHexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function cropTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  let xnew = x + (wnew - w) / 2;
  let ynew = y + (hnew - h) / 2;
  redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
async function deleteEvent(id) {
  let result = await simpleUpload('postEvent', { id });
  delete Items[id];
  mBy(id).remove();
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
  // Regular expression to match a number between 0 and 23 followed by 'h' or ':' and the word up to the next whitespace
  const regex = /\b([0-9]|1[0-9]|2[0-3])[h:]\S*\b/g;

  // Match the pattern in the input string
  const match = input.match(regex);

  if (match) {
    // Remove the matched word from the input string
    const result = input.replace(regex, '').trim();
    // Return the removed word (including the full word up to the next whitespace) and the modified string
    return [match[0], result];
  } else {
    // Return an empty string and the original input if no match is found
    return ['', input];
  }
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
function getBrowser() {
  var userAgent = navigator.userAgent;

  // Detect Chrome
  if (userAgent.match(/chrome|chromium|crios/i)) {
    return "Chrome";
  }
  // Detect Firefox
  else if (userAgent.match(/firefox|fxios/i)) {
    return "Firefox";
  }
  // Detect Safari
  else if (userAgent.match(/safari/i)) {
    return "Safari";
  }
  // Detect Internet Explorer
  else if (userAgent.match(/msie|trident/i)) {
    return "Internet Explorer";
  }
  // Detect Edge
  else if (userAgent.match(/edg/i)) {
    return "Edge";
  }
  // Other browser
  else {
    return "Other";
  }
}
function getButtonId(key) { return 'b' + capitalize(key); }
function getDivId(key) { return 'd' + capitalize(key); }
function getIdKey(elem) { let id = mBy(elem).id; return id.substring(1).toLowerCase(); }
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
function getEventValue(o) {
  if (isEmpty(o.time)) return o.text;
  return o.time + ' ' + stringBefore(o.text, '\n');
}
function getServerurl() {
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
function getUname() { assertion(Clientdata.lastUser == U.name,`getUname!!!!!!!${Clientdata.lastUser} != ${U.name}`); return Clientdata.lastUser; } //U ? U.name : 'guest' }
function imgBackground(d, src) {
  //d.style.backgroundImage = `../assets/games/nations/civs/civ_${pl1.civ}.png`;
  d.style.backgroundImage = `url('${src}')`; //../assets/games/nations/civs/civ_${pl1.civ}.png')`;
  d.style.backgroundSize = 'cover';
}
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
  return resp; //console.log('resp', resp);

}
function initCollection(name) {
  let list = [];
  if (name == 'all' || isEmpty(name)) {
    list = Object.keys(M.superdi);
  } else if (isdef(M.byCollection[name])) {
    list = M.byCollection[name];
  } else return;
  localStorage.setItem('collection', name)
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
  const rgb = colorHexToRgb(color);
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
async function loadImageAsync(src, img) {
  return new Promise((resolve, reject) => {
    //const img = new Image();
    img.onload = async () => {
      //if (isdef(callback)) await callback(img,...params);
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
  return { w: info.width, h: info.height };
}
function measureHeight(dParent, styles = {}) {
  let d = mDom(dParent, styles, { html: 'Hql' });
  let s = measureElement(d);
  d.remove();
  return firstNumber(s.h);
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
  //console.log('json', json)
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
  let ui = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
  mClass(dParent, 'nav');
  let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
  let [dl, dr] = [mDom(ui, stflex), mDom(ui, stflex)];

  function activate(ev) {
    close();
    let links = document.getElementsByClassName('nav-link');
    let inner = isDict(ev) ? ev.target.innerHTML:ev;
    let el = Array.from(links).find(x => x.innerHTML == inner);
    //console.log('activate', ev, el)
    if (el) mClass(el, 'activeLink');
  }
  function close() {
    closeApps();
    let links = document.getElementsByClassName('nav-link');
    for (const el of links) { mClassRemove(el, 'activeLink'); }
  }
  function disable() {
    let links = Array.from(document.getElementsByClassName('nav-link'));
    for (const w of arguments) {
      let el = Array.from(links).find(x => x.innerHTML == w);
      if (isdef(el)) mClass(el, 'disabled');
    }
  }
  function enable() {
    let links = document.getElementsByClassName('nav-link');
    for (const w of arguments) {
      let el = Array.from(links).find(x => x.innerHTML == w);
      if (isdef(el)) mClassRemove(el, 'disabled');
    }
  }
  return { activate, close, disable, enable, ui, dleft: dl, dright: dr };
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
          console.log('not a valid input => null');
          resolve(null);
        }
      } else if (ev.key == 'Escape') {
        resolve(null);
      }
    };
  });
}
async function natCivsToLandscape() {
  async function imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
    if (isdef(mBy('img1'))) mBy('img1').remove();
    let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
    await loadImageAsync(src, img); //hier ist img loaded!!!
    await onloadCiv(img, ...arguments);
  }
  async function onloadCiv(img, src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
    let d = viewParent;
    console.log('d', d)
    console.log('img', img)
    mClear(d);
    let canvas = mDom(d, { border: 'red' }, { tag: 'canvas', id: 'canvas', width: img.height, height: img.width });
    let ctx = canvas.getContext('2d');
    ctx.translate(img.height, 0)
    ctx.rotate(90 * Math.PI / 180);

    // ctx.fillStyle='yellow';ctx.fillRect(1,1,w,h);
    ctx.drawImage(img, 0, 0, img.width, img.height)
    if (downloadAtClient) downloadCanvas(canvas);
    if (sendToServer) {
      let dataUrl = canvas.toDataURL('image/png');
      //let dataUrl = imgToDataUrl(canvas);
      let unique = `civ_${name}`; //_${rName()}`;
      let path = `assets/games/nations/civs/${unique}.png`;
      let o = { image: dataUrl, name: name, unique: unique, coll: 'nations', path: path, ext: 'png' };
      console.log('dataUrl');
      let resp = await mPostRoute('postImage', o);
      console.log('resp', resp);
    }
  }
  let dbody = document.body; dbody.innerHTML = '';
  let d = mDom(dbody, { bg: 'skyblue', hmin: '100vh' }, { id: 'd1' });
  // let dhidden = mDom(dbody);

  let civlist = ['america', 'arabia', 'china', 'egypt', 'ethiopia', 'greece', 'india', 'japan', 'korea', 'mali', 'mongolia', 'persia', 'poland', 'portugal', 'rome', 'venice', 'vikings'];
  for (const civ of ['vikings']) {
    let src = `../assets/games/nations/civs_old/${civ}.jpg`;
    let width = 800;
    let name = civ;
    let viewParent = d;
    let imgParent = dbody;
    let sendToServer = true;
    let downloadAtClient = false;
    await imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient);
  }
}
async function natLoadCardInfo() {
  async function natCollectTypes(type) {
    let text = await mGetText(`../assets/games/nations/${type}.csv`);
    let list = csv2list(text, hasHeadings = true);
    console.log('list', list.length);
    //let card = rChoose(list);
    //console.log('card',card);
    let diStage = { I: 1, II: 2, III: 3, IV: 4, 'II II': 4 };
    let di = {}, newlist = [];
    for (const card of list) {
      if (type == 'event' && (isdef(card['Name of Event 1']) || isdef(card['Name of Event 2']))) {
        let name1 = card['Name of Event 1'];
        let name2 = card['Name of Event 2'];
        card.Name = isdef(name1) ? name1 : isdef(name2) ? name2 : null;
      }
      if (nundef(card.Name)) { console.log('no', card.Name); continue; }
      let name = card.Name;
      if (name.endsWith(' I')) { name = name.substring(0, name.length - 2); card.Name = name; console.log('name', name); }

      let key = normalizeString(card.Name.toLowerCase());

      let age = valf(diStage[card.Stage], 0);
      let fname = isdef(card.Stage) ? `age${age}_` : '';
      fname += key; //normalizeString(card.Name.toLowerCase());
      fname += '.jpg';
      //console.log('n',fname);
      card.Path = fname;
      card.Type = type;
      card.key = key;
      if (isdef(age)) card.age = age; else console.log('no age', key)
      if (isdef(di[key])) console.log('duplicate', key)
      di[key] = card;
      newlist.push(card)
    }
    //if (download) downloadAsYaml(list,'cards');
    return newlist;

  }

  let listOfTypes = ['advisor', 'battle', 'building', 'colony', 'military', 'natural', 'war', 'wonder', 'event'];
  let list = [];
  for (const type of listOfTypes) {
    list = list.concat(await natCollectTypes(type));
  }
  let realList = []
  for (const c of list) {
    if (isEmpty(c.Name)) console.log('no name', c); else realList.push(c);

  }
  console.log('final', realList.map(x => x.Name));
  let final = list2dict(realList, 'key');
  downloadAsYaml(final, 'nationsCards')
  //advisors:battles:32
}
async function natModCard(name, color, idx, dims) { //}, rot, ybound, xbound, yextra, xendbd) {
  let path = `../assets/games/nations/cards/${name}`; //.jpg`;
  let dParent = toElem('dExtra');
  let img = await imgAsync(dParent, {}, { src: path, tag: 'img', id: 'img' + idx })
  let [w, h] = [img.width, img.height];
  if (w > h) return natModCardLandscape(dParent, img, name, color, idx, dims, w, h);
  else return natModCardPortrait(dParent, img, name, color, idx, dims, w, h);
}
function natModCardLandscape(dParent, img, name, color, idx, dims, w, h) {
  let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);

  let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
  let y1, y2, x1, x2, prevy, prevx;
  let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
  console.log('resY', resy, prevy)

  let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims); //return;
  console.log('resX', resx)
  //let resx=[xstart,x1,x2,xend,isRotated,prevx]=calcBoundsX(ctx, 80, w, 243);

  //console.log('bounds X',resx)

  // console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
  let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
  console.log('wsmall', wsmall, 'hsmall', hsmall)
  let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
  let ct1 = cv1.getContext('2d');
  ct1.drawImage(img, -xstart, -ystart, w, h);

  //let border=10;
  //let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
  // let cv2 = mDom('dMain', { 'box-shadow':`inset 0 0 10px 20px red`,border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
  // let cv2 = mDom('dMain', { box:true, border:'10px solid yellow', rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
  let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
  let ct2 = cv2.getContext('2d');
  ct2.drawImage(img, -xstart, -ystart, w, h);
  //drawRoundedRect(ct2,0,0,wsmall,hsmall,12,color,null,20);
  ct2.strokeStyle = color;
  ct2.lineWidth = 20;
  ct2.rect(0, 0, wsmall, hsmall);
  ct2.stroke();

  return cv2;

  //next: draw rotated!

}
function natModCardPortrait(dParent, img, name, color, idx, dims, w, h) {
  console.log('w', w, 'h', h);
  //strategie:
  //1. nimm 1 model card und mach die ideal measures
  //2. aus model card mach auch eine empty vorlage (das kann ich eigentlich ruhig haendisch machen!)
  //3. eine liegende die ganz erwischt wurde
  //1. measure the inner pic
  //2. 
  let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return null;

  let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
  let y1, y2, x1, x2, prevy, prevx;
  let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
  console.log('resY', resy)

  let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims); //return;
  console.log('resX', resx)
  //let resx=[xstart,x1,x2,xend,isRotated,prevx]=calcBoundsX(ctx, 80, w, 243);

  //console.log('bounds X',resx)

  // console.log('xstart=' + xstart, 'xend=' + xend, 'ystart=' + ystart, 'yend=' + yend, 'w=' + w, 'h=' + h)
  let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
  console.log('wsmall', wsmall, 'hsmall', hsmall)
  let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
  let ct1 = cv1.getContext('2d');
  ct1.drawImage(img, -xstart, -ystart, w, h);

  //let border=10;
  //let [w2, h2] = [wsmall + 2 * border, hsmall + 2 * border]
  // let cv2 = mDom('dMain', { 'box-shadow':`inset 0 0 10px 20px red`,border: `${color} solid 10px`, rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
  // let cv2 = mDom('dMain', { box:true, border:'10px solid yellow', rounding: 16 }, { tag: 'canvas', id: 'cv2', width: wsmall, height: hsmall });
  let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
  let ct2 = cv2.getContext('2d');
  ct2.drawImage(img, -xstart, -ystart, w, h);
  //drawRoundedRect(ct2,0,0,wsmall,hsmall,12,color,null,20);
  ct2.strokeStyle = color;
  ct2.lineWidth = 20;
  ct2.rect(0, 0, wsmall, hsmall);
  ct2.stroke();

  return cv2;

  //next: draw rotated!

}
async function onclickAdd() {
  showTitle('Add to Collections');
  let colls = M.collections;
  let d = mDom('dMain', { margin: 10 }); mFlexWrap(d);
  let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop, ondropPreviewImage);
  let dForm = mDom(d, { padding: 12 }, { tag: 'form', onsubmit: ev => { ev.preventDefault(); return false; } });
  mDom(dForm, {}, { html: 'Collection:' }); let dl = mDatalist(dForm, colls);
  mDom(dForm, { h: 10 })
  mDom(dForm, {}, { html: 'Name:' });
  let inpName = mDom(dForm, {}, { tag: 'input', name: 'imgname', type: 'text', value: '', className: 'input', placeholder: "<enter value>", autocomplete: "off" });
  mDom(dForm, { h: 10 })
  UI.dTool = mDom(dForm)
  UI.dDrop = dDrop; mClass(dDrop, 'previewContainer');
  UI.dForm = dForm;
  UI.dButtons = mDom(dTitle, { display: 'inline-block' });
  UI.imgColl = dl.inpElem;
  UI.imgName = inpName;
}
async function onclickCollections() {
  showTitle('Collection:');
  dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  //showSidebar(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  initCollection(valf(localStorage.getItem('collection'), 'animals'));
}
async function onclickColor(ev) {
  let c = ev.target.style.background;
  c = colorHex(c);
  setColors(c);
  U.color = c;
  await postUserChange();
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
function onclickDay(d, styles) {
  let tsDay = d.id; //evToId(ev);
  let tsCreated = Date.now();
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? U.name : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let x = uiTypeEvent(d, o, styles); //addEditable(d, { w: '100%' }, { id: id, onEnter: ()=>onEventEdited(id,mBy(id).value), onclick: onclickExistingEvent });
  x.inp.focus();
}
function onclickExistingEvent(ev) { evNoBubble(ev); showEventOpen(evToId(ev)); }
async function onclickItem(ev) {
  evNoBubble(ev);
  let o = evToAttr(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  //console.log('click',ev.target,o.val,o.elem);
  //let elem = ev.target;
  //let key = ev.target.getAttribute('key');
  if (nundef(key)) { console.log('no key'); return; }
  if (nundef(Items[key])) {
    //console.log('found Item',key)
    let o = M.superdi[key];
    Items[key] = { selected: false };
    addKeys(o, Items[key]);
  }
  Items[key].div = elem; //elem.parentNode;
  if (nundef(M.selectedImages)) M.selectedImages = [];
  toggleSelectionOfPicture(Items[key], M.selectedImages);
}
async function onclickNext() { showImageBatch(1); }
async function onclickPrev() { showImageBatch(-1); }
async function onclickPlan() { showCalendarApp(); }
async function onclickTest() { console.log('nations!!!!'); }
async function onclickUpload() {
  let img = UI.img;
  let name = valnwhite(UI.imgName.value, rUID('img'));
  let unique = isdef(M.superdi[name]) ? rUID('img') : name;
  unique = normalizeString(unique);
  let coll = valnwhite(UI.imgColl.value, 'other');
  let dataUrl = imgToDataUrl(img);
  let o = { image: dataUrl, name: name, unique: unique, coll: coll, path: unique + '.png', ext: 'png' };
  let resp = await mPostRoute('postImage', o);
  console.log('resp', resp)
  await updateCollections();
}
async function onclickUser() {
  let uname = await mPrompt();
  await switchToUser(uname);
}
async function onclickView() {
  showTitle('Collection:');
  dMenu = mDom(dTitle, { h: '100%' }); mFlexV(dMenu); mStyle(dMenu, { gap: 14 });
  let d1 = mDiv('dMain'); mFlex(d1);
  //showSidebar(d1);
  M.rows = 5; M.cols = 7;
  M.grid = mGrid(M.rows, M.cols, d1, { 'align-self': 'start' });
  M.cells = [];
  let bg = mGetStyle('dNav', 'bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, fg: 'contrast', box: true, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  initCollection(valf(localStorage.getItem('collection'), 'animals'));
}
async function ondropPreviewImage(url, key) {
  if (isdef(key)) {
    let o = M.superdi[key];
    UI.imgColl.value = o.cats[0];
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
async function onEventEdited(id, text, time) {
  console.log(id, text, time)
  let e = Items[id];
  //console.log('e',e,'text',text);
  if (nundef(time)) {
    [time, text] = extractTime(text);
  }
  e.time = time;
  e.text = text;
  //console.log('time',time,'text',text);
  let result = await simpleUpload('postEvent', e);
  //console.log('result',result)
  Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
  //console.log('mBy(id)',mBy(id))
  mBy(id).firstChild.value = getEventValue(e); // e.time + ' ' + stringBefore(e.text, '\n');
  closePopup();
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
function rWord(n = 6) { return rLetters(n).join(''); }
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
async function switchToMenu(menu) { 
  console.log('====>switchToMenu',menu)
  Clientdata.lastMenu = menu; 
  await mOnclick(menu);
  // UI.nav.activate(menu); 
  // if (isdef(menu)) await window[`onclick${capitalize(menu)}`](); //eval(`onclick${capitalize(menu)}()`);}
} 
async function switchToTable(id){
	let res = Clientdata.table = await mGetRoute('table',{id});
	//console.log('res',res)
	await showTable(res,getUname())

}
async function switchToUser(uname) {
  if (!isEmpty(uname)) uname = normalizeString(uname);
  if (isEmpty(uname)) uname = 'guest';

  sockPostUserChange(U ? U.name : '', uname); //das ist nur fuer die client id!
  U = await getUser(uname);
  Clientdata.lastUser = uname;
  localStorage.setItem('username', uname);
  showUser(uname);
  
  let menu = Clientdata.lastMenu;

  if (uname == 'guest'){await switchToMenu();UI.nav.disable('plan'); }
  else {
    UI.nav.enable('plan');
    //wenn err in play war und eine table offen ist und der user ein player, soll er zu dieser table switchen!
    let t=Clientdata.table;
    if (menu == 'play' && isdef(t) && t.fen.playerNames.includes(uname)) await showTable(t,uname);
    else await switchToMenu(menu);
    //let t=Clientdata.table;
    
  }

}
function toggleAdd(key, sym, dParent, styles) {
  addKeys({ fz: 20, rounding: '50%', padding: 5, fg: rColor() }, styles);
  let info = valfHtml(sym);
  let b;
  if (info) {
    let stButton = copyKeys({ overflow: 'hidden', box: true, family: info.family, cursor: 'pointer' }, styles);
    b = mDom(dParent, stButton, { id: getButtonId(key), html: info.html, className: 'hop1' });
  } else {
    b = mButton(sym, 'dToolbar')
  }
  b.onclick = toggleClick;
  let d = mBy(getDivId(key));
  if (nundef(DA.toggle)) DA.toggle = {};
  let t = DA.toggle[key] = { key: key, button: b, div: d, state: 0, states: [...arguments].slice(4) };
  toggleShow(t);
  return t;
}
function toggleClick(ev) {
  let t = toggleGet(ev);
  let i = t.state = (t.state + 1) % t.states.length;
  toggleShow(t);
}
function toggleShow(t, state) {
  if (nundef(state)) state = t.states[t.state];
  let d = iDiv(t); mStyle(d, state);
  let percent = 100 * t.state / (t.states.length - 1);
  //console.log('percent open',percent)
  mStyle(t.button, { bg: colorMix('lime', 'red', percent) });
}
function toggleGet(ev) { let key = getIdKey(evToId(ev)); let toggle = DA.toggle[key]; return toggle; }

function tryJSONParse(astext) {
  try {
    const data = JSON.parse(astext);
    return data;
  } catch {
    console.log('text', astext)
    return { message: 'ERROR', text: astext }
  }
}
function uiTypePlayerStats(fen, pl, dParent, outerStyles = {}, innerStyles = {}) {
  //let player_stat_items = UI.player_stat_items = ui_player_info(dParent); 
  addKeys({ dir: 'column', display: 'flex' }, outerStyles);
  // if (nundef(outerStyles.display)) outerStyles.display = 'flex';
  mStyle(dParent, outerStyles);
  let items = {};
  let styles = jsCopy(innerStyles);
  addKeys({ rounding: 10, bg: '#00000050', margin: 4, padding: 4, patop: 12, box: true, 'border-style': 'solid', 'border-width': 6 }, styles);

  let show_first = pl.name;
  let order = arrCycle(fen.plorder, fen.plorder.indexOf(show_first));
  //console.log('order',order)

  for (const name of order) {
    let pl = fen.players[name];
    let imgPath = `../assets/img/users/${pl.icon}.jpg`;
    styles['border-color'] = pl.color;
    let d = mDom(dParent, styles, { id: name2id(name) })
    let picstyle = { w: 50, h: 50, box: true };
    let ucolor = pl.color;
    if (pl.playmode == 'bot') {
      copyKeys({ rounding: 0, border: `double 6px ${ucolor}` }, picstyle);
    } else {
      copyKeys({ rounding: '50%', border: `solid 2px white` }, picstyle);
    }
    let img = mImage(imgPath, d, picstyle, 'img_person');
    items[name] = { div: d, name: name };
  }
  return items;
}
function uiTypeCalendar(dParent) {
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
  let h = measureHeight(dParent, { fz: fz });
  //console.log('h',h);
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
    () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 0) setDate(12, y - 1); else setDate(m, y);
    },
    dButtons, { w: 70, margin: 0 }, 'input');
  mButton('Next',
    () => {
      let m = currentDate.getMonth();
      let y = currentDate.getFullYear();
      if (m == 11) setDate(1, y + 1); else setDate(m + 2, y);
    }, dButtons, { w: 70, margin: 0 }, 'input');
  var dMonth, dYear;
  function getDayDiv(dt) {
    if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) return null;
    let i = dt.getDate() + info.dayOffset;
    if (i < 1 || i > info.numDays) return null;
    let ui = dDays[i];
    if (ui.style.opacity === 0) return null;
    return ui.children[0]; // { div: udDays[i], events: [] };
  }
  function setDate(m, y) {
    currentDate.setMonth(m - 1);
    currentDate.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
    mClear(dGrid);
    dDays.length = 0;
    let c = colorHex(mGetStyle('dNav', 'bg')); //info.seedColor; //info.wheel[m-1];
    console.log('!!!!!!!!!!!!!!!!',c)
    let dayColors = mimali(c, 43).map(x => colorHex(x))
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      mStyle(cell, { bg: dayColors[i], fg: 'contrast' })
      dDays[i] = cell;
    }
    populate(currentDate);
    refreshEvents();
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
    //console.log('events', events)
    for (const k in events) {
      let o = events[k];
      let dt = new Date(Number(o.day));
      let dDay = getDayDiv(dt);
      if (!dDay) continue; //this event is not visible in current view
      uiTypeEvent(dDay, o, eventStyles);
    }
    mDummyFocus();
  }
  setDate(currentDate.getMonth() + 1, currentDate.getFullYear()); //valf(month1, currentDate.getMonth() + 1), valf(year1, currentDate.getFullYear()));
  //populate();
  return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDayDiv, refreshEvents, setDate, populate }
}
function uiTypeEvent(dParent, o, styles = {}) {
  //console.log('styles.hmin',styles.hmin)
  //console.log(dParent,o)
  Items[o.id] = o;
  let id = o.id;
  //console.log('styles',styles)
  let ui = mDom(dParent, styles, { id: id }); //, className:'no_events'}); //onclick:ev=>evNoBubble(ev) }); 
  //mStyle(ui,{cursor:'normal','pointer-events':'none',overflow:'hidden',display:'flex',gap:2,padding:2,'align-items':'center'}); //,'justify-items':'center'})
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
  // let b2=mDom(ui,stButton,{html:String.fromCharCode('0x' + M.superdi.window_close.fa)});
  // b2.onclick = ev => { evNoBubble(ev); deleteEvent(o.id); }
  // mStyle(inp,{w:wtotal-2*wbutton});
  return { ui: ui, inp: inp, id: id };
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
  //ich moecht eigentlich dass die users und die nations cards in collections drin sind!
  await addDirToCollections('img/users', 'users', 'user');
  await addDirToCollections('games/nations/cards', 'nations', 'card');
  await addDirToCollections('games/nations/templates', 'nations', 'symbol');

  // let usernames = await mGetFiles('img/users');
  // console.log(usernames)
  // addIf(M.collections, 'users');
  // addIf(M.categories, 'user');
  // for(const name of usernames){
  //   let img=name;
  //   let path=`../assets/img/users/${name}`;
  //   let k=stringBefore(name,'.');
  //   if (['leo','viola','wolf'].includes(k)) continue;
  //   assertion(nundef(M.superdi[k]),`username is already in superdi!!!!!! ${k}`);
  //   M.superdi[k] = { key: k, friendly: k, cats: ['user'], ext: stringAfter(name,'.'), img: `${name}`, path: path };
  //   addIf(M.names, k);
  //   lookupAddIfToList(M.byCat, ['user'], k);
  //   lookupAddIfToList(M.byFriendly, [k], k);
  //   lookupAddIfToList(M.byCollection, ['users'], k);
  // }

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
