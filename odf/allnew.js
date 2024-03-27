async function __getUser(uname, cachedOk = false) {
  let res = lookup(Serverdata, ['users', uname]);
  if (!res || !cachedOk) res = await mGetRoute('user', { uname });
  if (!res) { res = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
  Serverdata.users[uname] = res;
  return res;
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
function drawPix(ctx, x, y, color = 'red', sz = 5) {
  ctx.fillStyle = color;
  ctx.fillRect(x - sz / 2, y - sz / 2, sz, sz)
}
function drawPixFrame(ctx, x, y, color = 'red', sz = 5) {
  ctx.strokeStyle = color;
  ctx.strokeRect(x - sz / 2, y - sz / 2, sz, sz)
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
    // console.log('time found!',time,text)
    return [time, text];
  } else {
    return ['', input];
  }
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
function getActivePlayer(fen) {
  if (fen.playerNames.includes(U.name)) return U.name; else return fen.turn[0];
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
function getIdKey(elem) { let id = mBy(elem).id; return id.substring(1).toLowerCase(); }
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
function getPixRgb(ctx, x, y) {
  var pix = ctx.getImageData(x, y, 1, 1).data;
  var red = pix[0]; var green = pix[1]; var blue = pix[2];
  return { r: red, g: green, b: blue };
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
function getUname() { assertion(Clientdata.curUser == U.name, `getUname!!!!!!!${Clientdata.curUser} != ${U.name}`); return Clientdata.curUser; } //U ? U.name : 'guest' }
async function getUser(uname, cachedOk = false) {
  let res = lookup(Serverdata, ['users', uname]);
  if (!res || !cachedOk) res = await mGetRoute('user', { uname });
  if (!res) { 
    let key=isdef(M.superdi[uname])?uname:rChoose(Object.keys(M.superdi))
    res = await postUserChange({ name: uname, color: rChoose(M.playerColors), key }); 
  }
  Serverdata.users[uname] = res;
  return res;
}
function hourglassUpdate() {
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
function instructionUpdate() {
}
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; } return isLetter(s[0]); }
function isBetween(n, a, b) { return n >= a && n <= b }
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
function isMyTurn(fen) {
  return fen.turn.includes(U.name)
}
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
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
function isWithinDelta(n, goal, delta) { return isBetween(n, goal - delta, goal + delta) }
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
function mButtonX(dParent, handler, sz = 30, offset = 0, color = 'white') {
  mIfNotRelative(dParent);
  //let popup = isdef(id) ? mBy(id) : dParent;
  //if (nundef(id)) id = dParent.id;
  let bx = mDom(dParent, { position: 'absolute', top: -2 + offset, right: -5 + offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
  bx.onclick = ev => { evNoBubble(ev); handler(ev); } //popup.remove() };
  let o = M.superdi.xmark;
  el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: color, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
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
function mDummyFocus() {
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  mBy('dummy').focus();
}
function measureElement(el) {
  let info = window.getComputedStyle(el, null);
  return { w: info.width, h: info.height };
}
function measureHeightOfTextStyle(dParent, styles = {}) {
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
async function natCardsFinalProcessing() {
  let path = 'y/nat/cards1/';
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  for (const k in M.natCards) {
    let card = M.natCards[k];
    let [age, type] = [card.age, card.Type];
    if (type == 'event' || age == 0) continue;
    let img = await imgAsync(dParentBad, {}, { src: path + k + '.png', tag: 'img' });
    let cv = await rotateAndWriteAge(img, card);
    await imgToServer(cv, `assets/games/nations/cards/${k}.png`);
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
    let text = diStage[card.age];
    ctx3.fillText(text, x, y);
    return cv3;
  }
}
async function natCardsKleinereCard() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  let k = 'pyramids'; //nur hagia,kremlin und potemkin!
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
  let [x1, x2, y1, y2, dx, dy] = [14, 313, 15, 205, 8, 8];
  ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
  let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
  ctx.strokeStyle = diColors[card.Type];
  ctx.lineWidth = 28;
  ctx.strokeRect(0, 0, w, h);
  await imgToServer(canvas, `y/nat/${type}/${k}.png`);
}
async function natCardsManual() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let di = { second_boer_war: 'right', opium_war: 'right', balkan_wars: 'right', antikythera_mechanism: 'left', uluru: null, mount_kailash: null, terracotta_army: 'top', uraniborg: 'left', great_barrier_reef: 'right', hawaii: 'left' };
  let list = Object.keys(di);
  list = ['second_boer_war', 'opium_war', 'balkan_wars']; // all done!
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
    let xStart = type == 'war' ? 20 : 0;
    let left = noside == 'left' ? 0 : findLeftLine(ctx1, wCanvas, hCanvas, cgoal, xStart); console.log('left', left)
    let right = noside == 'right' ? wCanvas : findRightLine(ctx1, wCanvas, hCanvas, cgoal); console.log('right', right)
    let top = noside == 'top' ? 0 : findTopLine(ctx1, wCanvas, hCanvas, cgoal); console.log('top', top)
    let bot = noside == 'bottom' || type == 'war' ? hCanvas : findBottomLine(ctx1, wCanvas, hCanvas, cgoal); console.log('bot', bot)
    let [x1, x2, y1, y2, dx, dy, factw, facth] = [left, right, top, bot, 8, 8, 2, 2];
    if (k == 'hawaii') { dx = 16; factw = 1.2 }
    else if (k.includes('antiky')) { dx = 16; factw = 1.1; dy = 10; }
    ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - factw * dx, h - facth * dy);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'maroon', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
    await imgToServer(canvas, `y/nat/${type}/${k}.png`);
  }
  function findLeftLine(ct, w, h, cgoal, xStart = 0) {
    let [restlist, _] = findPointsBoth(ct, xStart, xStart + 40, 0, h, cgoal, 20);
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
async function natCardsSaveType(type) {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  list = Object.keys(M.natCards).filter(ck => M.natCards[ck].Type == type && M.natCards[ck].age > 0)
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  mDom(dParentBad, { h: 10 });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  for (const k of list) {
    if (['second_boer_war', 'opium_war', 'balkan_wars', 'antikythera_mechanism', 'uluru', 'mount_kailash', 'hawaii', 'great_barrier_reef', 'uraniborg', 'terracotta', 'pyramids', 'hagia', 'kremlin', 'potemkin'].some(x => k.includes(x))) continue;
    console.log('____________', k)
    let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
    let card = M.natCards[k];
    let path = `../assets/games/nations/cards/${card.Path}`;
    let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
    let [wImg, hImg] = [img.width, img.height];
    let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
    let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
    ctx1.drawImage(img, 0, 0, wImg, hImg);
    mDom(dParentGood, { h: 10 });
    let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
    ctx11.drawImage(img, 0, 0, wImg, hImg);
    let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
    let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wImg, hImg, cgoal, diffleft, diffright);
    console.log(x1, x2, x3, x4);
    console.log(l, m1, m2, r)
    let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wImg, hImg, cgoal);
    console.log(y1, y2, y3, y4);
    console.log(a, b, c, d)
    let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
    let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
    ctx2.drawImage(img, -x1, -y1);
    let loff = 5, toff = 5;
    if (nundef(a)) {
      toff = 2 + 24 - y2;
    }
    if (nundef(l)) {
      loff = 2 + diffleft - x2;
    }
    console.log('loff', loff, 'toff', toff)
    ctx.drawImage(cv2, loff, toff);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
    await imgToServer(canvas, `y/nat/${type}/${k}.png`);
  }
}
async function natCardsTester() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let list = rChoose(Object.keys(M.natCards).filter(ck => M.natCards[ck].Type != 'event'), 6);
  list = Object.keys(M.natCards).filter(ck => M.natCards[ck].Type == 'battle' && M.natCards[ck].age > 0)
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  mDom(dParentBad, { h: 10 });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  for (const k of list) {
    if (['second_boer_war', 'opium_war', 'balkan_wars', 'antiky', 'uluru', 'mount_kailash', 'hawaii', 'great_barrier_reef', 'uraniborg', 'terracotta', 'pyramids', 'hagia', 'kremlin', 'potemkin'].some(x => k.includes(x))) continue;
    console.log('____________', k)
    let [canvas, ctx, w, h] = await natGetEmptyCardCanvas(dParentGood);
    let card = M.natCards[k];
    let path = `../assets/games/nations/cards/${card.Path}`;
    let type = card.Type;
    let img = await imgAsync(dParentBad, {}, { src: path, tag: 'img' })
    let [wImg, hImg] = [img.width, img.height];
    let [cgoal, clight, lighting] = type == 'event' ? ['#6C4F64', '#E7BB97', false] : ['#59544E', '#DBCEBE', true];
    let cv1 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx1 = cv1.getContext('2d', { willReadFrequently: true });
    ctx1.drawImage(img, 0, 0, wImg, hImg);
    mDom(dParentGood, { h: 10 });
    let cv11 = mDom(dParentBad, {}, { tag: 'canvas', width: wImg, height: hImg });
    let ctx11 = cv11.getContext('2d', { willReadFrequently: true });
    ctx11.drawImage(img, 0, 0, wImg, hImg);
    let [diffleft, diffright] = isdef(dims[type]) ? [dims[type].diffleft, dims[type].diffright] : [91, 148];
    let [x1, x2, x3, x4, l, m1, m2, r] = findDarkBars(ctx1, wImg, hImg, cgoal, diffleft, diffright);
    console.log(x1, x2, x3, x4);
    console.log(l, m1, m2, r)
    let [y1, y2, y3, y4, a, b, c, d] = findDarkLines(ctx11, wImg, hImg, cgoal);
    console.log(y1, y2, y3, y4);
    console.log(a, b, c, d)
    let cv2 = mDom(dParentGood, {}, { tag: 'canvas', width: x4 - x1, height: y4 - y1 });
    let ctx2 = cv2.getContext('2d', { willReadFrequently: true });
    ctx2.drawImage(img, -x1, -y1);
    let loff = 5, toff = 5;
    if (nundef(a)) {
      toff = 2 + 24 - y2;
    }
    if (nundef(l)) {
      loff = 2 + diffleft - x2;
    }
    console.log('loff', loff, 'toff', toff)
    ctx.drawImage(cv2, loff, toff);
    let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
    ctx.strokeStyle = diColors[card.Type];
    ctx.lineWidth = 28;
    ctx.strokeRect(0, 0, w, h);
  }
}
async function natCardsWrongFormatAberIntact() {
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  let dParentGood = toElem('dExtra');
  let dParentBad = toElem('dTitle');
  DA.eimg = await imgAsync(dParentBad, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
  let dims = {
    advisor: { diffleft: 91, diffright: 148, dx: 150, y: 75, xmin: 80, top: 91, bot: 151 },
    building: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 },
    golden_age: { diffleft: 91, diffright: 148 },
    wonder: { diffleft: 91, diffright: 148 },
    war: { diffleft: 91, diffright: 148 },
    hippodrome: { dx: 250, y: 230, xmin: 180, top: 176, bot: 67 },
    urban_center: { dx: 245, y: 230, xmin: 180, top: 176, bot: 67 },
    military: { diffleft: 176, diffright: 63, dx: 250, y: 240, xmin: 180, top: 176, bot: 67 }
  };
  let k = 'kremlin'; //nur hagia,kremlin und potemkin!
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
  let [x1, x2, y1, y2, dx, dy] = [24, 474, 20, 308, 8, 8];
  ctx.drawImage(cv1, x1, y1, x2 - x1, y2 - y1, dx, dy, w - 2 * dx, h - 2 * dy);
  let diColors = { advisor: 'orange', battle: 'grey', building: 'deepskyblue', colony: 'green', event: 'purple', golden_age: 'gold', military: 'red', war: 'black', natural: 'brown', wonder: 'sienna' };
  ctx.strokeStyle = diColors[card.Type];
  ctx.lineWidth = 28;
  ctx.strokeRect(0, 0, w, h);
  await imgToServer(canvas, `y/nat/${type}/${k}.png`);
}
async function natCivsToLandscape() {
  async function imgSaveAsLandscape(src, width, name, viewParent, imgParent, sendToServer, downloadAtClient) {
    if (isdef(mBy('img1'))) mBy('img1').remove();
    let img = mDom(imgParent, { position: 'absolute', top: '100vh', h: width }, { tag: 'img', id: 'img1' });
    await loadImageAsync(src, img);
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
    ctx.drawImage(img, 0, 0, img.width, img.height)
    if (downloadAtClient) downloadCanvas(canvas);
    if (sendToServer) {
      let dataUrl = canvas.toDataURL('image/png');
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
function natCreate(owner, players) {
  if (isList(players)) {
    let list = players;
    players = {};
    list.map(x => players[x] = {});
  }
  if (nundef(players[owner])) players[owner] = {};
  let fen = { owner: owner, players: players }
  let playerNames = fen.playerNames = Object.keys(players);
  let numPlayers = fen.numPlayers = playerNames.length;
  fen.age = 1;
  fen.events = [];
  fen.progressCards = [];
  for (const k in M.natCards) {
    let c = M.natCards[k];
    if (c.age != fen.age) continue;
    if (c.Type == 'event') fen.events.push(k); else fen.progressCards.push(k);
  }
  arrShuffle(fen.progressCards);
  fen.progressCards = arrTake(fen.progressCards, 42);
  arrShuffle(fen.events);
  fen.market = [];
  for (let i = 0; i < 21; i++) {
    let k = fen.progressCards.shift();
    fen.market.push(k);
  }
  let civs = rChoose(M.civNames, numPlayers);
  let i = 0;
  for (const name in fen.players) {
    let pl = fen.players[name];
    pl.name = name;
    assertion(isdef(Serverdata.users[name]), `unknown user ${name}`);
    addKeys(Serverdata.users[name], pl);
    if (nundef(pl.civ)) pl.civ = civs[i++];
    if (nundef(pl.level)) pl.level = rChoose(M.levels);
    let civ = M.civs[pl.civ];
    addKeys(civ.res, pl);
    pl.book = 0;
    pl.cards = jsCopy(civ.cards);
    pl.extraWorkers = jsCopy(civ.workers);
  }
  let plorder = fen.plorder = jsCopy(playerNames); arrShuffle(plorder);
  fen.round = 1;
  fen.phase = 'growth'; // growth newEvent action production turnOrder war events  
  fen.turn = jsCopy(fen.playerNames);
  return fen;
}
async function natCreateGame() {
  let id = generateTableId();
  let fen = natCreate(U.name, ['felix', 'amanda']); //{felix:{level:'emperor'},lili:{civ:'rome'},lauren:{civ:'mongolia'}});
  let s = JSON.stringify(fen);
  let res = await mPostRoute('postTable', { status:'started', id: id, fen: fen, game: 'nations', friendly: generateTableName(fen.numPlayers) });
}
async function natDetectBB(card, dParent) {
  dParent = toElem(dParent);
  let path = `../assets/games/nations/cards/${card.Path}`;
  let img = await imgAsync(dParent, {}, { src: path, tag: 'img' })
  let [w, h] = [img.width, img.height];
  if (h > w) { img.remove(); console.log(`NOT in landscape! ${k} ${src}`); return; }
  let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  let edgecolor = card.Type == 'event' ? '#6C4F64' : '#59544E'; //'#544744';
  let lightcolor = card.Type == 'event' ? '#E7BB97' : '#DBCEBE';
  let [rect, tmiss, bmiss, lmiss, rmiss] = calcBoundingBox(ctx, w, h, edgecolor, lightcolor);
  let cv1 = mDom(dParent, {}, { tag: 'canvas', width: rect.w, height: rect.h });
  let ct1 = cv1.getContext('2d', { willReadFrequently: true });
  ct1.drawImage(img, -rect.left, -rect.top);
  return [rect, cv1, ct1, tmiss, bmiss, lmiss, rmiss];
}
async function natGameView(fen, plname) {
  clear_timeouts();
  natTitle();
  await natPresent(fen, plname);
  if (!fen.turn.includes(plname)) {
    return;
  }
  selPrep(fen);
  natPreAction()
}
async function natGetEmptyCardCanvas(dParent) {
  dParent = toElem(dParent);
  if (nundef(DA.eimg)) {
    DA.eimg = await imgAsync(dParent, {}, { src: '../assets/games/nations/empty_inner_card.png', tag: 'img' });
    mDom(dParent, { h: 10 });
  }
  let eimg = DA.eimg;
  let [w, h] = [eimg.width, eimg.height];
  let canvas = mDom(dParent, {}, { tag: 'canvas', width: w, height: h });
  let ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(eimg, 0, 0, w, h);
  return [canvas, ctx, w, h];
}
async function natLoadAssets() {
  if (isdef(M.natCards)) return;
  M.natCards = await mGetYaml('../assets/games/nations/cards.yaml');
  M.civs = await mGetYaml('../assets/games/nations/civs.yaml');
  M.civNames = Object.keys(M.civs);
  M.levels = ['chieftain', 'prince', 'king', 'emperor'];
}
async function natLoadCardInfo() {
  async function natCollectTypes(type) {
    let text = await mGetText(`../assets/games/nations/${type}.csv`);
    let list = csv2list(text, hasHeadings = true);
    console.log('list', list.length);
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
      fname += key;
      fname += '.jpg';
      card.Path = fname;
      card.Type = type;
      card.key = key;
      if (isdef(age)) card.age = age; else console.log('no age', key)
      if (isdef(di[key])) console.log('duplicate', key)
      di[key] = card;
      newlist.push(card)
    }
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
}
async function natModCard(name, color, idx, dims) {
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
  let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims);
  console.log('resX', resx)
  let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
  console.log('wsmall', wsmall, 'hsmall', hsmall)
  let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
  let ct1 = cv1.getContext('2d');
  ct1.drawImage(img, -xstart, -ystart, w, h);
  let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
  let ct2 = cv2.getContext('2d');
  ct2.drawImage(img, -xstart, -ystart, w, h);
  ct2.strokeStyle = color;
  ct2.lineWidth = 20;
  ct2.rect(0, 0, wsmall, hsmall);
  ct2.stroke();
  return cv2;
}
function natModCardPortrait(dParent, img, name, color, idx, dims, w, h) {
  console.log('w', w, 'h', h);
  let canvas = mDom(dParent, {}, { tag: 'canvas', id: 'canvas' + idx, width: w, height: h });
  let ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  return null;
  let [xstart, ystart, xend, yend, isRotated] = [0, 0, w, h, false];
  let y1, y2, x1, x2, prevy, prevx;
  let resy = [ystart, y1, y2, yend, isRotated, prevy] = calcBoundsY(ctx, dims.dx, h, 261);
  console.log('resY', resy)
  let resx = [xstart, x1, x2, xend, prevx, rot] = allDarkPoints(ctx, w, dims);
  console.log('resX', resx)
  let [wsmall, hsmall] = [xend - xstart, yend - ystart + 1];
  console.log('wsmall', wsmall, 'hsmall', hsmall)
  let cv1 = mDom(dParent, { border: 'red' }, { tag: 'canvas', id: 'cv1', width: wsmall, height: hsmall });
  let ct1 = cv1.getContext('2d');
  ct1.drawImage(img, -xstart, -ystart, w, h);
  let cv2 = mDom('dMain', {}, { tag: 'canvas', id: `cv${name}`, width: wsmall, height: hsmall });
  let ct2 = cv2.getContext('2d');
  ct2.drawImage(img, -xstart, -ystart, w, h);
  ct2.strokeStyle = color;
  ct2.lineWidth = 20;
  ct2.rect(0, 0, wsmall, hsmall);
  ct2.stroke();
  return cv2;
}
function natPreAction() {
  let [fen, phase] = [Clientdata.fen, Clientdata.fen.phase];
  mDom('dTitleLeft', { bg: mGetStyle(dTitle, 'bg'), fg: 'contrast' }, { html: `Age ${fen.age}.${fen.round}: <b style='color:orange'>${phase}</b> (${U.name})` })
  switch (phase) {
    case 'growth': selectAddItems(natSelItemsGrowth(fen), natSelectedGrowth, 'g'); break;// 'must select your growth'); break; 
  }
}
async function natPresent(fen, plname) {
  mClear('dMain');
  let dParent = mDiv('dMain');
  let [owner, players, age, round, phase] = [fen.owner, fen.players, fen.age, fen.round, fen.phase]
  let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dParent);
  mStyle(dOpenTable, { w: 862 })
  let pl = players[plname];
  natPresentMarket(dOpenTable, fen.market, 163);
  mDom(dOpenTable, { h: 10, w: '100%' })
  await natPresentCiv(dOpenTable, pl, .98);
  natStats(fen, plname, dOben)
}
async function natPresentCiv(dParent, pl, fact) {
  let [w, h] = [800 * fact, 420 * fact];
  let dciv = mDom(dParent, { w: w, h: h, maleft: 56, bg: 'red', position: 'relative' });
  let iciv = await loadImageAsync(`../assets/games/nations/civs/civ_${pl.civ}.png`, mDom(dciv, { w: w, h: h, position: 'absolute' }, { tag: 'img' }));
  M.civCells = [];
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 7; j++) {
      let r = getCivSpot(pl.civ, i, j, fact);
      let [dx, dy, dw, dh] = [10, 10, 15, 20].map(x => x * fact)
      let d = mDom(dciv, { box: true, w: r.w + dw, h: r.h + dh, left: r.x - dx, top: r.y - dy, position: 'absolute', overflow: 'hidden' });
      mCenterCenterFlex(d);
      M.civCells.push(d);
    }
  }
}
function natPresentMarket(dParent, market, h) {
  let d1 = mDiv(dParent); mFlex(d1);
  let [rows, cols] = [3, market.length / 3];
  let fact = 1.565; let w = h / fact;
  let dcost = mGrid(rows, 1, d1, { 'align-self': 'start' });
  for (let cost = 3; cost >= 1; cost--) {
    let d2 = mDom(dcost, { display: 'flex', 'justify-content': 'center', 'flex-flow': 'column', box: true, margin: 2, h: h, overflow: 'hidden' }, {});
    for (let i = 0; i < cost; i++) mDom(d2, { h: 40 }, { tag: 'img', src: `../assets/games/nations/templates/gold.png` });
  }
  let grid = mGrid(rows, cols, d1, { 'align-self': 'start' });
  let cells = [];
  for (let i = 0; i < rows * cols; i++) {
    let d = mDom(grid, { box: true, vmargin: 2, hmargin: 5, h: h, w: w, overflow: 'hidden' });
    mCenterCenterFlex(d);
    cells.push(d);
  }
  let n = rows * cols;
  for (let i = 0; i < n; i++) {
    let k = market[i];
    if (k == '_') continue;
    let img = mDom(cells[i], { h: h, w: w }, { tag: 'img', src: `../assets/games/nations/cards/${k}.png` });
    img.setAttribute('key', k)
  }
}
function natSelectedGrowth(ev) {
  let [A, fen] = [Clientdata.A, Clientdata.fen];
  let id = evToId(ev)
  A.selected = A.di[id];
  console.log('selects', A.selected);
  sendMyMove(A.selected.key)
}
function natSelItemsGrowth() {
  let fen = Clientdata.fen; let pl = fen.players[U.name]; assertion(pl, `PLAYER DOES NOT EXIST ${U.name}`);
  let items = [], i = 0;
  for (const cmd of ['gold', 'food', 'stone', 'book']) {
    let item = { o: M.superdi[cmd], a: cmd, key: cmd, friendly: cmd, path: null, index: i }; // src: `../assets/games/nations/templates/${cmd}.${cmd=='book'?'svg':'png'}`, index: i };
    i++;
    items.push(item);
  }
  let w = pl.extraWorkers;
  if (!isEmpty(w)) {
    let wWoDuplicates = arrRemoveDuplicates(w);
    for (const w1 of wWoDuplicates) {
      let item = uiTypeExtraWorker(w1); items.push(item); item.index = i++;
    }
  }
  return items;
}
function natStats(fen, pl, dParent) {
  let player_stat_items = uiTypePlayerStats(fen, pl, dParent, {}, { wmin: 260, bg: 'beige', fg: 'contrast' })
  for (const plname in fen.players) {
    let pl1 = fen.players[plname];
    let item = player_stat_items[plname];
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
    playerStatCount('military', pl1.military, d);
    playerStatCount('stability', pl1.stability, d);
    playerStatCount('gold', pl1.gold, d);
    playerStatCount('food', pl1.food, d);
    playerStatCount('stone', pl1.stone, d);
    playerStatCount('book', pl1.book, d);
    playerStatCount('VP', pl1.vp, d);
    playerStatCount('worker', pl1.workers, d);
    mDom(d, { h: 6, w: '100%' });
    mDom(d, { family: 'algerian' }, { html: `${pl1.civ}` })
    if (fen.turn.includes(plname)) {
      show_hourglass(plname, d, 30, { left: -3, top: 0 }); //'calc( 50% - 36px )' });
    }
    mDom(d, { position: 'absolute', top: 0 }, { html: pl1.level })
  }
}
function natTitle() {
  mClear(dTitle);
  mStyle(dTitle, { display: 'flex', 'justify-content': 'space-between', 'align-items': 'center', box: true, h: 42, w: '100%' })
  mDom(dTitle, { display: 'flex', 'justify-content': 'space-evenly', 'align-items': 'center', paleft: 10 }, { id: 'dTitleLeft' })
  mDom(dTitle, {}, { id: 'dTitleMiddle' })
  mDom(dTitle, { display: 'flex', 'justify-content': 'end', 'align-items': 'center', box: true, wmin: 200 }, { id: 'dTitleRight' })
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
async function postUserChange(data) {
  data = valf(data, U)
  return Serverdata.users[data.name] = await mPostRoute('postUser', data);
}
async function _prelims() {
  if (nundef(M.superdi)) {
    Serverdata = await mGetRoute('session'); //session ist: users,config,
    Info = await mGetYaml('../assets/info.yaml');
    await loadCollections();
    loadPlayerColors();
    showNavbar();
    sockInit();
    dTitle = mDom('dTitle'); mFlexV(dTitle); mStyle(dTitle, { gap: 14, hpadding: 14 })
    await switchToUser(localStorage.getItem('username'));  //danach ist U IMMER gesetzt!!!!
    await switchToMenu('home')
  }
}
function presentExtraWorker(item, dParent, styles = {}) {
  let sz = styles.sz;
  addKeys({ paright: 10, bg: 'white', rounding: '50%', hmargin: 8, h: 30, position: 'relative' }, styles)
  let d = mDom(dParent, styles); mFlex(d);
  let img = mDom(d, { h: '100%' }, { tag: 'img', src: '../assets/games/nations/templates/worker.png' })
  let img2 = mDom(d, { h: sz * 2 / 3, w: sz * 2 / 3, position: 'absolute', top: '17%', left: '40%' }, { tag: 'img', src: `../assets/games/nations/templates/${item.o.res}.png` });
  return d;
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
function selPrep(fen, autosubmit = false) {
  Clientdata.A = { level: 0, di: {}, ll: [], items: [], selected: [], tree: null, breadcrumbs: [], sib: [], command: null, autosubmit: autosubmit };
  Clientdata.fen = fen;
}
function sendMyMove(key) {
  let name = U.name;
  let table = Clientdata.fen.id;
  sockPostMove(table, name, key);
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
    Socket.emit('message', { user: U.name, msg: ev.target.value });
    ev.target.value = '';
  });
}
function showImage(key, dParent, styles = {}, useSymbol=false) {
  let o = M.superdi[key];
  // if (nundef(o)){
  //   if (isDict(key)) {o=key;key=o.key;}
  //   else if (key.includes('.')) {o={img:key,key:stringBefore(stringAfterLast(key,'/'),'.')}; key=o.key;}
  // }

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
  let hline=valf(styles.hline*fz,fz);
  let d1 = mDiv(dParent, { position: 'relative', h: fz, overflow: 'hidden' });
  mCenterCenterFlex(d1)
  let el = null;

  if (!useSymbol && isdef(o.img)) el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: hline, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: hline, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: hline, family: 'pictoGame', bg: valf(styles.bg,'beige'), fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.img))     el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.img}` });
  assertion(el, 'PROBLEM mit' + key);
  mStyle(el, { cursor: 'pointer' })
  return d1;
}
function showMessage(msg, ms = 3000) {
  let d = mBy('dMessage');
  mStyle(d, { h: 21, bg: 'red', fg: 'yellow' }); //getThemeFg()});
  d.innerHTML = msg;
  clearTimeout(TO.message);
  TO.message = setTimeout(() => mStyle('dMessage', { h: 0 }), ms)
}
function showTitle(title) {
  mClear('dTitle');
  return mDom('dTitle', { maleft: 20 }, { tag: 'h1', html: title, classes: 'title' });
}
function showUser() {
  mClear(dUser);
  mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  let d;
  d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'activeLink' });
  setColors(U.color)
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
function sockInit() {
  let server = getServerurl();
  Socket = io(server);
  Socket.on('deleteTable', onsockDeleteTable); //x => console.log('::SOCK table:', x));
  Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
  Socket.on('event', onsockEvent);
  Socket.on('message', showChatMessage);
  Socket.on('table', onsockTable); //x => console.log('::SOCK table:', x));
  //Socket.on('newTable', onsockNewTable); //x => console.log('::SOCK table:', x));
  Socket.on('superdi', onsockSuperdi);
  Socket.on('turnUpdate', onsockTurnUpdate); //x => console.log('::SOCK table:', x));
  // Socket.on('userChange', x => console.log('::SOCK userChange:', x));
  // Socket.on('update', x => console.log('::SOCK update:', x));
}
function sockPostMove(id, name, move) {
  Socket.emit('move', { id, name, move });
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
function squareTo(tool, sznew = 128) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  if (sznew == 0) sznew = h;
  let sz = Math.max(w, h)
  let [x1, y1] = [x - (sz - w) / 2, y - (sz - h) / 2];
  redrawImage(img, dParent, x1, y1, sz, sz, sznew, sznew, () => tool.setRect(0, 0, sznew, sznew))
}
async function start() { test73_game(); }
async function switchToTable(id) {
  let res = Clientdata.table = await mGetRoute('table', { id });
  await showTable(res, getUname())
}
function tabtitleUpdate() {
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
    //console.log('!!!!!!!!!!!!!!!!',c)
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
function uiTypeExtraWorker(w) {
  let [res, n] = [stringBefore(w, ':'), Number(stringAfter(w, ':'))];
  let s = `worker (cost:${res} ${n})`
  let present = presentExtraWorker;
  let select = selectExtraWorker;
  return { itemtype: 'worker', a: s, key: `worker_${res}`, o: { res: res, n: n }, friendly: s, present, select }
}
function uiTypePlayerStats(fen, pl, dParent, outerStyles = {}, innerStyles = {}) {
  addKeys({ dir: 'column', display: 'flex' }, outerStyles);
  mStyle(dParent, outerStyles);
  let items = {};
  let styles = jsCopy(innerStyles);
  addKeys({ rounding: 10, bg: '#00000050', margin: 4, padding: 4, patop: 12, box: true, 'border-style': 'solid', 'border-width': 6 }, styles);
  let show_first = pl.name;
  let order = arrCycle(fen.plorder, fen.plorder.indexOf(show_first));
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
