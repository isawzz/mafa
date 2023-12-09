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
function AhexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}
function allNumbers(s) {
  let m = s.match(/\-.\d+|\-\d+|\.\d+|\d+\.\d+|\d+\b|\d+(?=\w)/g);
  if (m) return m.map(v => +v); else return null;
}
function alphaToHex(zero1) {
  zero1 = Math.round(zero1 * 100) / 100;
  var alpha = Math.round(zero1 * 255);
  var hex = (alpha + 0x10000)
    .toString(16)
    .slice(-2)
    .toUpperCase();
  var perc = Math.round(zero1 * 100);
  return hex;
}
function animate(elem, aniclass, timeoutms) {
  mClass(elem, aniclass);
  TOMan.TO.anim = setTimeout(() => mRemoveClass(elem, aniclass), timeoutms);
}
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrRange(from = 1, to = 10, step = 1) { let res = []; for (let i = from; i <= to; i += step)res.push(i); return res; }
function arrRemoveDuplicates(arr) { return Array.from(new Set(arr)); }
function arrRemovip(arr, el) {
  let i = arr.indexOf(el);
  if (i > -1) arr.splice(i, 1);
  return i;
}
function arrShuffle(arr) { if (isEmpty(arr)) return []; else return fisherYates(arr); }
function arrTakeFromTo(arr, a, b) { return takeFromTo(arr, a, b); }
function assertion(cond) {
  if (!cond) {
    let args = [...arguments];
    for (const a of args) {
      console.log('\n', a);
    }
    throw new Error('TERMINATING!!!')
  }
}
function calendarOpenDay(date, d, ev) {
  if (isdef(ev) && ev.target != d) return;
  console.log('open event on', typeof date, date)
  let d1 = addEditable(d, { w: 50 }, {
    onEnter: ev => {
      let inp = ev.target;
      let o = { date: date.getTime(), text: inp.value, title: firstWord(inp.value) };
      onEventEdited(o, inp);
    }
  });
  return d1;
}
function capitalize(s) {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function clamp(x, min, max) { return Math.min(Math.max(x, min), max); }
function clearElement(elem) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (window.jQuery == undefined) { elem.innerHTML = ''; return elem; }
  while (elem.firstChild) {
    $(elem.firstChild).remove();
  }
  return elem;
}
function clearFleetingMessage() {
  if (isdef(dFleetingMessage)) {
    dFleetingMessage.remove();
    dFleetingMessage = null;
  }
}
function closeApps(){
  if (isdef(DA.calendar)) {closePopup(); delete DA.calendar; }
  mClear('dMain'); 
  mClear(dTitle);
}
function closePopup(name='dPopup'){if (isdef(mBy(name))) mBy(name).remove();}
function coin(percent = 50) { return Math.random() * 100 < percent; }
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
function colorFrom(cAny, a, allowHsl = false) {
  if (isString(cAny)) {
    if (cAny[0] == '#') {
      if (a == undefined) return cAny;
      cAny = cAny.substring(0, 7);
      return cAny + (a == 1 ? '' : alphaToHex(a));
    } else if (isdef(ColorDi) && lookup(ColorDi, [cAny])) {
      let c = ColorDi[cAny].c;
      if (a == undefined) return c;
      c = c.substring(0, 7);
      return c + (a == 1 ? '' : alphaToHex(a));
    } else if (cAny.startsWith('rand')) {
      let spec = capitalize(cAny.substring(4));
      if (isdef(window['color' + spec])) {
        c = window['color' + spec]();
      } else c = rColor();
      if (a == undefined) return c;
      return c + (a == 1 ? '' : alphaToHex(a));
    } else if (cAny.startsWith('linear')) {
      return cAny;
    } else if (cAny[0] == 'r' && cAny[1] == 'g') {
      if (a == undefined) return cAny;
      if (cAny[3] == 'a') {
        if (a < 1) {
          return stringBeforeLast(cAny, ',') + ',' + a + ')';
        } else {
          let parts = cAny.split(',');
          let r = firstNumber(parts[0]);
          return 'rgb(' + r + ',' + parts[1] + ',' + parts[2] + ')';
        }
      } else {
        if (a < 1) {
          return 'rgba' + cAny.substring(3, cAny.length - 1) + ',' + a + ')';
        } else {
          return cAny;
        }
      }
    } else if (cAny[0] == 'h' && cAny[1] == 's') {
      if (allowHsl) {
        if (a == undefined) return cAny;
        if (cAny[3] == 'a') {
          if (a < 1) {
            return stringBeforeLast(cAny, ',') + ',' + a + ')';
          } else {
            let parts = cAny.split(',');
            let r = firstNumber(parts[0]);
            return 'hsl(' + r + ',' + parts[1] + ',' + parts[2] + ')';
          }
        } else {
          return a == 1 ? cAny : 'hsla' + cAny.substring(3, cAny.length - 1) + ',' + a + ')';
        }
      } else {
        if (cAny[3] == 'a') {
          cAny = HSLAToRGBA(cAny);
        } else {
          cAny = HSLToRGB(cAny);
        }
        return colorFrom(cAny, a, false);
      }
    } else {
      ensureColorDict();
      let c = ColorDi[cAny];
      if (nundef(c)) {
        if (cAny.startsWith('rand')) {
          let spec = cAny.substring(4);
          if (isdef(window['color' + spec])) {
            c = window['color' + spec](res);
          } else c = rColor();
        } else {
          console.log('color not available:', cAny);
          throw new Error('color not found: ' + cAny)
          return '#00000000';
        }
      } else c = c.c;
      if (a == undefined) return c;
      c = c.substring(0, 7);
      return c + (a == 1 ? '' : alphaToHex(a));
    }
  } else if (Array.isArray(cAny)) {
    if (cAny.length == 3 && isNumber(cAny[0])) {
      let r = cAny[0];
      let g = cAny[1];
      let b = cAny[2];
      return a == undefined || a == 1 ? `rgb(${r},${g},${b})` : `rgba(${r},${g},${b},${a})`;
    } else {
      return rChoose(cAny);
    }
  } else if (typeof cAny == 'object') {
    if ('h' in cAny) {
      let hslString = '';
      if (a == undefined || a == 1) {
        hslString = `hsl(${cAny.h},${Math.round(cAny.s <= 1.0 ? cAny.s * 100 : cAny.s)}%,${Math.round(cAny.l <= 1.0 ? cAny.l * 100 : cAny.l)}%)`;
      } else {
        hslString = `hsla(${cAny.h},${Math.round(cAny.s <= 1.0 ? cAny.s * 100 : cAny.s)}%,${Math.round(cAny.l <= 1.0 ? cAny.l * 100 : cAny.l)}%,${a})`;
      }
      if (allowHsl) {
        return hslString;
      } else {
        return colorFrom(hslString, a, allowHsl);
      }
    } else if ('r' in cAny) {
      if (a !== undefined && a < 1) {
        return `rgba(${cAny.r},${cAny.g},${cAny.b},${a})`;
      } else {
        return `rgb(${cAny.r},${cAny.g},${cAny.b})`;
      }
    }
  }
}
function colorFromHSL(hue, sat = 100, lum = 50) {
  return hslToHex(valf(hue, rHue()), sat, lum);
}
function colorHex(cAny) {
  let c = colorFrom(cAny);
  if (c[0] == '#') {
    return c;
  } else {
    let res = pSBC(0, c, 'c');
    return res;
  }
}
function colorHSL(cAny, asObject = false) {
  let res = colorFrom(cAny, undefined, true);
  let shsl = res;
  if (res[0] == '#') {
    if (res.length == 9) {
      shsl = hexAToHSLA(res);
    } else if (res.length == 7) {
      shsl = hexToHSL(res);
    }
  } else if (res[0] == 'r') {
    if (res[3] == 'a') {
      shsl = RGBAToHSLA(res);
    } else {
      shsl = RGBToHSL(res);
    }
  }
  let n = allNumbers(shsl);
  if (asObject) {
    return { h: n[0], s: n[1] / 100, l: n[2] / 100, a: n.length > 3 ? n[3] : 1 };
  } else {
    return shsl;
  }
}
function colorHSLBuild(hue, sat = 100, lum = 50) { let result = "hsl(" + hue + ',' + sat + '%,' + lum + '%)'; return result; }
function colorIdealText(bg, grayPreferred = false) {
  let rgb = colorRGB(bg, true);
  const nThreshold = 105;
  let r = rgb.r;
  let g = rgb.g;
  let b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114;
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function colorLum(cAny,percent=false) {
  let hsl = colorHSL(cAny, true);
  return percent?hsl.l*100:hsl.l;
}
function colorNameToHexString(str) {
  var ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = str;
  return ctx.fillStyle;
}
function colorPalette(color, type = 'shade') {
  color = colorFrom(color);
  return colorShades(color);
}
function colorRGB(cAny, asObject = false) {
  let res = colorFrom(cAny);
  let srgb = res;
  if (res[0] == '#') {
    srgb = pSBC(0, res, 'c');
  }
  let n = allNumbers(srgb);
  if (asObject) {
    return { r: n[0], g: n[1], b: n[2], a: n.length > 3 ? n[3] : 1 };
  } else {
    return srgb;
  }
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
function colorShades(color) {
  let res = [];
  for (let frac = -0.8; frac <= 0.8; frac += 0.2) {
    let c = pSBC(frac, color, undefined, true);
    res.push(c);
  }
  return res;
}
function colorTrans(cAny, alpha = 0.5) {
  return colorFrom(cAny, alpha);
}
function cropTo(tool, wnew, hnew) {
  let [img, dParent, cropBox, setRect] = [tool.img, tool.dParent, tool.cropBox, tool.setRect];
  let [x, y, w, h] = ['left', 'top', 'width', 'height'].map(x => parseInt(cropBox.style[x]));
  let xnew = x + (wnew - w) / 2;
  let ynew = y + (hnew - h) / 2;
  redrawImage(img, dParent, xnew, ynew, wnew, wnew, wnew, hnew, () => setRect(0, 0, wnew, hnew))
}
async function deleteEvent(id){
  let result = await simpleUpload('event', {id:id,user:U.name}); 
  delete Items[id]; 
  mBy(id).remove(); 
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
function download(jsonObject, fname) {
  json_str = JSON.stringify(jsonObject);
  saveFile(fname + '.json', 'data:application/json', new Blob([json_str], { type: '' }));
}
function downloadAsText(s, filename, ext = 'txt') {
  saveFileAtClient(
    filename + "." + ext,
    "data:application/text",
    new Blob([s], { type: "" }));
}
function drop(ev) {
  ev.preventDefault();
  let targetElem = findDragTarget(ev);
  targetElem.appendChild(draggedElement);
  setDropPosition(ev, draggedElement, targetElem, isdef(draggedElement.dropPosition) ? draggedElement.dropPosition : dropPosition);
}
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
function error(msg) {
  let fname = getFunctionsNameThatCalledThisFunction();
  console.log(fname, 'ERROR!!!!! ', msg);
}
function evNoBubble(ev) { ev.preventDefault(); ev.cancelBubble = true; }
function evToId(ev) {
  let elem = findParentWithId(ev.target);
  return elem.id;
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
function findDragTarget(ev) {
  let targetElem = ev.target;
  while (!targetElem.ondragover) targetElem = targetElem.parentNode;
  return targetElem;
}
function findParentWithId(elem) { while (elem && !(elem.id)) { elem = elem.parentNode; } return elem; }
function firstCond(arr, func) {
  if (nundef(arr)) return null;
  for (const a of arr) {
    if (func(a)) return a;
  }
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
function firstWord(s, allow_ = false) { return toWords(s, allow_)[0]; }
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
function getEvent(id) { return lookup(U,['data','events',id]); } //lookup(U.Serverdata,['config','events',id]);//evToEventObject(ev);
function getEvents() { return lookup(Serverdata,['users',uname]); }
function getFunctionsNameThatCalledThisFunction() {
  let c1 = getFunctionsNameThatCalledThisFunction.caller;
  if (nundef(c1)) return 'no caller!';
  let c2 = c1.caller;
  if (nundef(c2)) return 'no caller!';
  return c2.name;
}
function getItem(k) { return infoToItem(Syms[k]); }
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
  addKeys({ l: r.x, t: r.y, r: r.x + r.w, b: r.t + r.h }, r);
  return r;
}
function getServerurl(){
  let type = detectSessionType();
  let server = type == 'vps' ? 'https://server.vidulusludorum.com' : 'http://localhost:3000';
  return server;
}
function getStyleProp(elem, prop) { return getComputedStyle(elem).getPropertyValue(prop); }
function getUID(pref = '') {
  UIDCounter += 1;
  return pref + '_' + UIDCounter;
}
function getUser(uname){return lookup(Serverdata,['users',uname]);}
function hexAToHSLA(H) {
  let ex = /^#([\da-f]{4}){1,2}$/i;
  if (ex.test(H)) {
    let r = 0,
      g = 0,
      b = 0,
      a = 1;
    if (H.length == 5) {
      r = '0x' + H[1] + H[1];
      g = '0x' + H[2] + H[2];
      b = '0x' + H[3] + H[3];
      a = '0x' + H[4] + H[4];
    } else if (H.length == 9) {
      r = '0x' + H[1] + H[2];
      g = '0x' + H[3] + H[4];
      b = '0x' + H[5] + H[6];
      a = '0x' + H[7] + H[8];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    a = (a / 255).toFixed(3);
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  } else {
    return 'Invalid input color';
  }
}
function hexToHSL(H) {
  let ex = /^#([\da-f]{3}){1,2}$/i;
  if (ex.test(H)) {
    let r = 0,
      g = 0,
      b = 0;
    if (H.length == 4) {
      r = '0x' + H[1] + H[1];
      g = '0x' + H[2] + H[2];
      b = '0x' + H[3] + H[3];
    } else if (H.length == 7) {
      r = '0x' + H[1] + H[2];
      g = '0x' + H[3] + H[4];
      b = '0x' + H[5] + H[6];
    }
    r /= 255;
    g /= 255;
    b /= 255;
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  } else {
    return 'Invalid input color';
  }
}
function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    }
    : null;
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
function HSLAToRGBA(hsla, isPct) {
  let ex = /^hsla\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)(((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2},\s?)|((\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}\s\/\s))((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
  if (ex.test(hsla)) {
    let sep = hsla.indexOf(',') > -1 ? ',' : ' ';
    hsla = hsla
      .substr(5)
      .split(')')[0]
      .split(sep);
    if (hsla.indexOf('/') > -1) hsla.splice(3, 1);
    isPct = isPct === true;
    let h = hsla[0],
      s = hsla[1].substr(0, hsla[1].length - 1) / 100,
      l = hsla[2].substr(0, hsla[2].length - 1) / 100,
      a = hsla[3];
    if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
    else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
    else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
    if (h >= 360) h %= 360;
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    let pctFound = a.indexOf('%') > -1;
    if (isPct) {
      r = +((r / 255) * 100).toFixed(1);
      g = +((g / 255) * 100).toFixed(1);
      b = +((b / 255) * 100).toFixed(1);
      if (!pctFound) {
        a *= 100;
      } else {
        a = a.substr(0, a.length - 1);
      }
    } else if (pctFound) {
      a = a.substr(0, a.length - 1) / 100;
    }
    return 'rgba(' + (isPct ? r + '%,' + g + '%,' + b + '%,' + a + '%' : +r + ',' + +g + ',' + +b + ',' + +a) + ')';
  } else {
    return 'Invalid input color';
  }
}
function hslToHex(h, s, l) {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = n => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
function hslToHexCOOL(hslColor) {
  const hslColorCopy = { ...hslColor };
  hslColorCopy.l /= 100;
  const a =
    (hslColorCopy.s * Math.min(hslColorCopy.l, 1 - hslColorCopy.l)) / 100;
  const f = (n) => {
    const k = (n + hslColorCopy.h / 30) % 12;
    const color = hslColorCopy.l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}
function HSLToRGB(hsl, isPct) {
  let ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;
  if (ex.test(hsl)) {
    let sep = hsl.indexOf(',') > -1 ? ',' : ' ';
    hsl = hsl
      .substr(4)
      .split(')')[0]
      .split(sep);
    isPct = isPct === true;
    let h = hsl[0],
      s = hsl[1].substr(0, hsl[1].length - 1) / 100,
      l = hsl[2].substr(0, hsl[2].length - 1) / 100;
    if (h.indexOf('deg') > -1) h = h.substr(0, h.length - 3);
    else if (h.indexOf('rad') > -1) h = Math.round((h.substr(0, h.length - 3) / (2 * Math.PI)) * 360);
    else if (h.indexOf('turn') > -1) h = Math.round(h.substr(0, h.length - 4) * 360);
    if (h >= 360) h %= 360;
    let c = (1 - Math.abs(2 * l - 1)) * s,
      x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
      m = l - c / 2,
      r = 0,
      g = 0,
      b = 0;
    if (0 <= h && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (60 <= h && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (120 <= h && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (180 <= h && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (240 <= h && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else if (300 <= h && h < 360) {
      r = c;
      g = 0;
      b = x;
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    if (isPct) {
      r = +((r / 255) * 100).toFixed(1);
      g = +((g / 255) * 100).toFixed(1);
      b = +((b / 255) * 100).toFixed(1);
    }
    return 'rgb(' + (isPct ? r + '%,' + g + '%,' + b + '%' : +r + ',' + +g + ',' + +b) + ')';
  } else {
    return 'Invalid input color';
  }
}
function hue(h) {
  var r = Math.abs(h * 6 - 3) - 1;
  var g = 2 - Math.abs(h * 6 - 2);
  var b = 2 - Math.abs(h * 6 - 4);
  return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
}
function idealTextColor(bg, grayPreferred = false, nThreshold = 105) {
  if (bg.substring(0, 1) != '#') bg = colorNameToHexString(bg);
  rgb = hexToRgb(bg);
  r = rgb.r;
  g = rgb.g;
  b = rgb.b;
  var bgDelta = r * 0.299 + g * 0.587 + b * 0.114; 
  var foreColor = 255 - bgDelta < nThreshold ? 'black' : 'white';
  if (grayPreferred) foreColor = 255 - bgDelta < nThreshold ? 'dimgray' : 'snow';
  return foreColor;
}
function iDiv(i) { return isdef(i.live) ? i.live.div : isdef(i.div) ? i.div : i; }
function infoToItem(x) { let item = { info: x, key: x.key }; item.id = iRegister(item); return item; }
function initCollection(name){
  let list=[];
  if (name == 'all' || isEmpty(name)){
    list = Object.keys(M.superdi);
  }else if (isdef(M.byCollection[name])){
    list = M.byCollection[name];
  }else return;
  mClear(dMenu);
  let dParent = dMenu;
  let colls = M.collections; 
  mDom(dParent, {}, { html: '' }); 
  let dlColl = mDatalist(dParent, colls, {onupdate:collectionAddEmpty});
  dlColl.inpElem.oninput = ev=>initCollection(ev.target.value);
  dlColl.inpElem.value = name;
  initFilter(list);
  mButton('prev', onclickPrev, dMenu, { w: 70, margin: 0 }, 'input');
  mButton('next', onclickNext, dMenu, { w: 70, margin: 0 }, 'input');
  M.keys = list;
  M.index = 0;
  showImageBatch();
}
function initCrowd() {
  while (availablePeeps.length) {
    addPeepToCrowd().walk.progress(Math.random())
  }
}
function initFilter(list){
  M.masterKeys = list;
  let cats = collectCats(list);
  cats.sort();
  mDom(dMenu, {}, { html: 'Filter:' }); 
  let dlCat = mDatalist(dMenu, cats, {edit:false});
  dlCat.inpElem.oninput = filterImages;
}
function iRegister(item, id) { let uid = isdef(id) ? id : getUID(); Items[uid] = item; return uid; }
function isAlphanumeric(s) { for (const ch of s) { if (!isLetter(ch) && !isDigit(ch)) return false; return true; } }
function isdef(x) { return x !== null && x !== undefined; }
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isDigit(s) { return /^[0-9]$/i.test(s); }
function isEmpty(arr) {
  return arr === undefined || !arr
    || (isString(arr) && (arr == 'undefined' || arr == ''))
    || (Array.isArray(arr) && arr.length == 0)
    || Object.entries(arr).length === 0;
}
function isGrayColor(color, diff = 60) {
  const rgb = AhexToRgb(color);
  return Math.abs(rgb.r - rgb.g) + Math.abs(rgb.r - rgb.b) + Math.abs(rgb.g - rgb.b) < 3 * diff;
}
function isLetter(s) { return /^[a-zA-Z]$/i.test(s); }
function isList(arr) { return Array.isArray(arr); }
function isNumber(x) { return x !== ' ' && x !== true && x !== false && isdef(x) && (x == 0 || !isNaN(+x)); }
function isSameDate(date1, date2) {
  return date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();
}
function isString(param) { return typeof param == 'string'; }
function isSvg(elem) { return startsWith(elem.constructor.name, 'SVG'); }
function isWhiteSpace(ch) { return /\s/.test(ch) }
function last(arr) {
  return arr.length > 0 ? arr[arr.length - 1] : null;
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
async function loadUserdata(uname) {
  let data = await mGetRoute('user', { user: uname });
  console.log('data',data)
  if (!data) { data = await postUserChange({ name: uname, color: rChoose(M.playerColors) }); }
  else Serverdata.users[uname] = data;
  return data;
}
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
function mButtonX(dParent, sz = 30, offset = 0, id = null) {
  mIfNotRelative(dParent);
  let popup = isdef(id) ? mBy(id) : dParent;
  if (nundef(id)) id = dParent.id;
  let bx = mDom(dParent, { position: 'absolute', top: -2 + offset, right: -5 + offset, w: sz, h: sz, cursor: 'pointer' }, { className: 'hop1' });
  bx.onclick = ev => { evNoBubble(ev); popup.remove() };
  let o = M.superdi.xmark;
  el = mDom(bx, { fz: sz, hline: sz, family: 'fa6', fg: 'dimgray', display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
}
function mBy(id) { return document.getElementById(id); }
function mCenterCenterFlex(d, gap) { mCenterFlex(d, true, true, true, gap); }
function mCenterFlex(d, hCenter = true, vCenter = false, wrap = true, gap = null) {
  let styles = { display: 'flex' };
  if (hCenter) styles['justify-content'] = 'center';
  styles['align-content'] = vCenter ? 'center' : 'flex-start';
  if (wrap) styles['flex-wrap'] = 'wrap';
  if (gap) styles.gap = gap;
  mStyle(d, styles);
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
function mClear(d) { clearElement(toElem(d)); }
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
  };
  for (const opt in opts) { d[valf(aliases[opt], opt)] = opts[opt] };
  mStyle(d, styles);
  return d;
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
function mDummyFocus(){
  if (nundef(mBy('dummy'))) addDummy(document.body, 'cc');
  mBy('dummy').focus();
}
function mFlex(d, or = 'h') {
  d = toElem(d);
  d.style.display = 'flex';
  d.style.flexFlow = (or == 'v' ? 'column' : 'row') + ' ' + (or == 'w' ? 'wrap' : 'nowrap');
}
function mFlexV(d) { mStyle(d, { display: 'flex', 'align-items': 'center' }); }
function mFlexWrap(d) { mFlex(d, 'w'); }
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
async function mGetYaml(path = '../base/assets/m.txt') {
  let res = await fetch(path);
  let text = await res.text();
  let di = jsyaml.load(text);
  return di;
}
function mGrid(rows, cols, dParent, styles = {}) {
  let d = mDiv(dParent, styles);
  d.style.gridTemplateColumns = 'repeat(' + cols + ',1fr)';
  d.style.gridTemplateRows = 'repeat(' + rows + ',1fr)';
  d.style.display = 'inline-grid';
  d.style.padding = valf(styles.padding, styles.gap) + 'px';
  return d;
}
function mIfNotRelative(d) { if (isEmpty(d.style.position)) d.style.position = 'relative'; }
function mimali(c,n){
  function whh(c1,c2){return generateArrayColors(colorHex(c1), colorHex(c2), 10);}
  function genc(c,hinc){  let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,hsl.s*100,hsl.l*100);}
  function cinc(c,hinc,sinc,linc){let hsl=colorHSL(c,true);return colorHSLBuild((hsl.h+hinc)%360,clamp(hsl.s*100+sinc,0,100),clamp(hsl.l*100+linc,0,100));}
  function arrd(c,hinc,sinc,linc,n){let r=[];for(let i=0;i<n;i++){r.push(cinc(c,hinc*i,sinc*i,linc*i));}return r;}
  function light(c,lper=75){let hsl=colorHSL(c,true);return colorHSLBuild(hsl.h,hsl.s*100,lper);}
  function sat(c,sper=100){let hsl=colorHSL(c,true);return colorHSLBuild(sper,hsl.s*100,hsl.l*100);}
  function hue(c,hdeg){let hsl=colorHSL(c,true);return colorHSLBuild(hdeg,hsl.s*100,hsl.l*100);}
  c=light(c,75);
  let diff=Math.round(360/n)
  wheel=arrd(c,diff,0,0,n);
  return wheel;
}
function mInput(dParent, styles, id, placeholder, classtr = 'input', tabindex = null, value = '', selectOnClick = false, type = "text") {
  let html = selectOnClick ? `<input type="${type}" onclick="this.select();" id=${id} class="${classtr}" placeholder="${valf(placeholder, '')}" tabindex="${tabindex}" value="${value}">` : `<input type="${type}" id=${id} class="${classtr}" placeholder="${valf(placeholder, '')}" tabindex="${tabindex}" value="${value}">`;
  let d = mAppend(dParent, mCreateFrom(html));
  if (isdef(styles)) mStyle(d, styles);
  return d;
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
  const hex = colorHex({r:r,g:g,b:b}); // '#' + r.toString(16) + g.toString(16) + b.toString(16);
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
function mPlace(elem, pos, offx, offy) {
  elem = toElem(elem);
  pos = pos.toLowerCase();
  let dParent = elem.parentNode; if (dParent.style.position != 'absolute') dParent.style.position = 'relative';
  let vert = valf(offx, 0);
  let hor = isdef(offy) ? offy : vert;
  if (pos[0] == 'c' || pos[1] == 'c') {
    let rParent = getRect(dParent);
    let [wParent, hParent] = [rParent.w, rParent.h];
    let rElem = getRect(elem);
    let [wElem, hElem] = [rElem.w, rElem.h];
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
function mRemoveClass(d) { for (let i = 1; i < arguments.length; i++) d.classList.remove(arguments[i]); }
function mStyle(elem, styles, unit = 'px') {
  elem = toElem(elem);
  if (isdef(styles.whrest)) { delete styles.whrest; styles.w = styles.h = 'rest'; } else if (isdef(styles.wh100)) { styles.w = styles.h = '100%'; delete styles.wh100; }
  if (isdef(styles.w100)) styles.w = '100%'; else if (isdef(styles.wrest)) styles.w = 'rest';
  if (isdef(styles.h100)) styles.h = '100%'; else if (isdef(styles.hrest)) styles.h = 'rest';
  let dParent = elem.parentNode;
  if (isdef(dParent)) {
    let pad = dParent && isdef(dParent.style.padding) ? parseInt(dParent.style.padding) : 0;
    let rp = getRect(dParent);
    let r = getRect(elem, dParent);
    if (styles.w == 'rest') {
      let left = r.l;
      let w = rp.w;
      let wrest = w - left - pad;
      styles.w = wrest;
    }
    if (styles.h == 'rest') {
      let r1 = getRect(dParent.lastChild, dParent);
      let hrest = rp.h - (r1.y) - pad;
      styles.h = hrest;
    }
  }
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
  if (isdef(styles.round)) styles['border-radius'] = '50%';
  for (const k in styles) {
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
    } else if (k == 'classname') {
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
function nundef(x) { return x === null || x === undefined; }
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
  if (U){
    U.color = c;
    await postUserChange();
  }
}
async function onclickColors() {
  showTitle('Set Color Theme');
  let d = mDom('dMain', { hpadding:20, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  let i = 0;
  for (const c of list) {
    let dc = mDom(d, { w: 50, h: 50, bg: c, fg: idealTextColor(c) });
    dc.onclick = onclickColor; 
    mStyle(dc, { cursor: 'pointer' }); 
    i++; if (i % 15 == 0) mDom(d, { w: '100%', h: 0 });
  }
}
function onclickDay(ev) {
  let tsDay = evToId(ev);
  let tsCreated = Date.now()
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? U.name : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let d1 = addEditable(ev.target, { w: '100%' }, { id: id, onEnter: onEventEdited, onclick: onclickExistingEvent });
}
function onclickExistingEvent(ev) { showEventOpen(evToId(ev)); }
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
async function onclickSetEditedEvent(id, text, time) {
  let e = getEvent(id);
  e.time = time;
  e.text = text;
  await updateEvent(id, e);
  closePopup();
}
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
  if (isdef(uname) && (!U || U.name != uname)) {    await switchToUser(uname);  }
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
  let bg=mGetStyle('dNav','bg');
  for (let i = 0; i < M.rows * M.cols; i++) {
    let d = mDom(M.grid, { bg: bg, box: true, padding: 8, margin: 8, w: 128, h: 128, overflow: 'hidden' });
    mCenterCenterFlex(d);
    M.cells.push(d);
  }
  initCollection('animals');
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
async function onEventEdited(ev) {
  let id = evToId(ev);
  let o = Items[id];
  let inp = mBy(id);
  if (inp.value) {
    o.text = inp.value;
    console.log('text',o.text);
    await updateEvent(id, o);
  }
}
function openPopup(name='dPopup') {
  closePopup();
  let popup = document.createElement('div');
  popup.id=name;
  let defStyle = {padding:25,bg:'white',fg:'black',zIndex:1000,rounding:12,position:'fixed',boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',wmin:300,hmin:100,border: '1px solid #ccc',};
  mStyle(popup,defStyle);
  mButtonX(popup,25,4);
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
function randomIndex(array) { return randomRange(0, array.length) | 0 }
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
function RGBAToHSLA(rgba) {
  let ex = /^rgba\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){3}))|(((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s){3})|(((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){3}))\/\s)((0?\.\d+)|[01]|(([1-9]?\d(\.\d+)?)|100|(\.\d+))%)\)$/i;
  if (ex.test(rgba)) {
    let sep = rgba.indexOf(',') > -1 ? ',' : ' ';
    rgba = rgba
      .substr(5)
      .split(')')[0]
      .split(sep);
    if (rgba.indexOf('/') > -1) rgba.splice(3, 1);
    for (let R in rgba) {
      let r = rgba[R];
      if (r.indexOf('%') > -1) {
        let p = r.substr(0, r.length - 1) / 100;
        if (R < 3) {
          rgba[R] = Math.round(p * 255);
        }
      }
    }
    let r = rgba[0] / 255,
      g = rgba[1] / 255,
      b = rgba[2] / 255,
      a = rgba[3],
      cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
  } else {
    return 'Invalid input color';
  }
}
function RGBToHSL(rgb) {
  let ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;
  if (ex.test(rgb)) {
    let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
    rgb = rgb
      .substr(4)
      .split(')')[0]
      .split(sep);
    for (let R in rgb) {
      let r = rgb[R];
      if (r.indexOf('%') > -1) rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
    }
    let r = rgb[0] / 255,
      g = rgb[1] / 255,
      b = rgb[2] / 255,
      cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return 'hsl(' + h + ',' + s + '%,' + l + '%)';
  } else {
    return 'Invalid input color';
  }
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
function rUID(prefix = null, n = null) {
  return (prefix ?? rLetter()) + '_' + new Date().getTime() + '_' + Math.random().toString(36).substr(3, n ?? 4);
  const timestamp = new Date().getTime(); 
  const random = Math.random().toString(36).substr(2, 9); 
  let res = `${prefix}${timestamp}${random}`;
  if (n > 0) res = res.substr(0, n);
  return res;
}
function saveFile(name, type, data) {
  if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
  var a = $("<a style='display: none;'/>");
  var url = window.URL.createObjectURL(new Blob([data], { type: type }));
  a.attr('href', url);
  a.attr('download', name);
  $('body').append(a);
  a[0].click();
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 500);
}
function saveFileAtClient(name, type, data) {
  if (data != null && navigator.msSaveBlob) return navigator.msSaveBlob(new Blob([data], { type: type }), name);
  let a = document.createElement('a');
  a.style.display = 'none';
  let url = window.URL.createObjectURL(new Blob([data], { type: type }));
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  simulateClick(a);
  setTimeout(function () {
    window.URL.revokeObjectURL(url);
    a.remove();
  }, 500);
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
function setCssVar(varname, val) { document.body.style.setProperty(varname, val); }
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
function setEvent(id, o) { 
  Items[id] = lookupSetOverride(U.data, ['events', id], o); 
  mBy(id).value=stringBefore(o.text,'\n');
  return o; 
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
function show(elem, isInline = false) {
  if (isString(elem)) elem = document.getElementById(elem);
  if (isSvg(elem)) {
    elem.setAttribute('style', 'visibility:visible');
  } else {
    elem.style.display = isInline ? 'inline-block' : null;
  }
  return elem;
}
function showCalendarApp(){
  if (!U) {console.log('you have to be logged in to use this menu!!!'); return;}
  showTitle('Calendar');
  let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
  let x = DA.calendar = uiTypeCalendar(d1, U?U.color:rColor(),null, null, getEvents());
}
function showChatMessage() {
  for (const arg of [...arguments]) {
    console.log('arg', arg);
    let d = mBy('dChatWindow');
    if (d) mDom(d, {}, { html: arg })
  }
}
function showEventOpen(id) {
  let e = getEvent(id); 
  if (!e) return;
  let date = new Date(Number(e.day));
  let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];
  console.log('day', `${day}.${month}.${year}`);
  let time = e.time;
  let popup = openPopup();
  let d = mBy(id); 
  console.log('d', d)
  let [x, y, w, h, wp, hp] = [d.offsetLeft, d.offsetTop, d.offsetWidth, d.offsetHeight, 300, 180];
  let [left,top]=[Math.max(10,x + w / 2 - wp / 2),Math.min(window.innerHeight-hp-60,y + h / 2 - hp / 2)]
  console.log('left,top',left,top)
  mStyle(popup, { left: left, top: top, w:wp, h:hp });
  let dd = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 3, pabottom: 4 }, { html: `date: ${day}.${month}.${year}` });
  let dt = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 20, pabottom: 4 }, { html: `time:` });
  let inpt = mDom(popup, { fz: '80%', maleft: 3, mabottom: 4, w: 60 }, { tag: 'input', value: e.time });
  mOnEnter(inpt);
  let ta = mDom(popup, { rounding: 4, matop:7, box: true, w: '100%', vpadding: 4, hpadding: 10, }, { tag: 'textarea', rows: 7, value: e.text });
  let line=mDom(popup,{matop:6,w:'100%'}); //,'align-items':'space-between'});
  let buttons=mDom(line,{display:'inline-block'});
  let bsend=mButton('Save', () => onclickSetEditedEvent(id, ta.value, inpt.value), buttons, {fg:'red'});
  mButton('Cancel', () => closePopup(), buttons,{hmargin:10})
  mButton('Delete', () => {deleteEvent(id);closePopup();}, buttons, )
  mDom(line,{fz:'90%',maright:5,float:'right',},{html:`by ${e.user}`});
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
function showImage(key, dParent, styles = {}) {
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
  let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', overflow: 'hidden' });
  mCenterCenterFlex(d1)
  let el = null;
  if (isdef(o.img)) {
    el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
  }
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  assertion(el, 'PROBLEM mit' + key);
  mStyle(el, { cursor: 'pointer' })
  return d1;
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
function simulateClick(elem) {
  var evt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
  var canceled = !elem.dispatchEvent(evt);
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
function stringAfter(sFull, sSub) {
  let idx = sFull.indexOf(sSub);
  if (idx < 0) return '';
  return sFull.substring(idx + sSub.length);
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
async function switchToUser(uname){
  U = await loadUserdata(uname);
  localStorage.setItem('username', uname);
}
function takeFromTo(ad, from, to) {
  if (isDict(ad)) {
    let keys = Object.keys(ad);
    return keys.slice(from, to).map(x => (ad[x]));
  } else return ad.slice(from, to);
}
async function test40_socketio() {
  await prelims();
  console.log('Serverdata',Serverdata)
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
function toElem(d) { return isString(d) ? mBy(d) : d; }
function toggleSelectionOfPicture(pic, selectedPics, className = 'framedPicture') {
  let ui = iDiv(pic);
  pic.isSelected = !pic.isSelected;
  if (pic.isSelected) mClass(ui, className); else mClassRemove(ui, className);
  if (isdef(selectedPics)) {
    if (pic.isSelected) {
      console.assert(!selectedPics.includes(pic), 'UNSELECTED PIC IN PICLIST!!!!!!!!!!!!')
      selectedPics.push(pic);
    } else {
      console.assert(selectedPics.includes(pic), 'PIC NOT IN PICLIST BUT HAS BEEN SELECTED!!!!!!!!!!!!')
      removeInPlace(selectedPics, pic);
    }
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
function uid() {
  UID += 1;
  return 'a' + UID;
}
function uiTypeCalendar(dParent, seedColor, month1, year1, events1 = []) {
  const [cellWidth, gap] = [100, 10];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var dParent = toElem(dParent);
  const events = events1;
  var container = mDiv(dParent, {}, 'dCalendar');
  var currentDate = new Date();
  var today = new Date();
  let dTitle = mDiv(container, { w: 760, padding: gap, fz: 26, family: 'sans-serif', display: 'flex', justify: 'space-between' }, { className: 'title' });
  var dWeekdays = mGrid(1, 7, container, { gap: gap });
  var dDays = [];
  var info = {};
  for (const w of weekdays) { mDiv(dWeekdays, { w: cellWidth }, null, w, 'subtitle') };
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
  function getDay(d) {
    let i = d + info.dayOffset;
    if (i < 1 || i > info.numDays) return null;
    let ui = dDays[i];
    if (ui.style.opacity === 0) return null;
    return { div: dDays[i], events: [] };
  }
  function setDate(m, y) {
    currentDate.setMonth(m - 1);
    currentDate.setFullYear(y);
    mClear(dDate);
    dMonth = mDiv(dDate, {}, 'dMonth', `${currentDate.toLocaleDateString('en-us', { month: 'long' })}`);
    dYear = mDiv(dDate, {}, 'dYear', `${currentDate.getFullYear()}`);
    mClear(dGrid); dDays.length = 0;
    let outerStyles = {
      rounding: 4, patop: 4, pabottom: 4, weight: 'bold', box: true,
      paleft: gap / 2, w: cellWidth, hmin: cellWidth,
      bg: 'black', fg: 'white',
    }
    let c = colorHex(mGetStyle('dNav', 'bg')); //info.seedColor; //info.wheel[m-1];
    let dayColors = mimali(c, 43).map(x => colorHex(x))
    for (const i of range(42)) {
      let cell = mDiv(dGrid, outerStyles);
      mStyle(cell, { bg: dayColors[i], fg: 'contrast' })
      dDays[i] = cell;
    }
    populate(currentDate);
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
    let innerStyles = { box: true, align: 'center', bg: 'beige', rounding: 4, w: '95%', hpadding: '2%', hmin: cellWidth - 28 };
    for (let i = paddingDays + 1; i <= paddingDays + daysInMonth; i++) {
      const daySquare = dDays[i - 1];
      let date = new Date(year, month, i - paddingDays);
      daySquare.innerText = i - paddingDays + (isSameDate(date, today) ? ' TODAY' : '');
      let d = mDom(daySquare, innerStyles, { id: date.getTime() });
      d.addEventListener('click', onclickDay); //ev => calendarOpenDay(date, daySquare.lastChild, ev));
    }
    updateEvents();
  }
  function updateEvents() {
    for (const k in events) {
      let e = events[k];
      let dt = new Date(Number(e.day));
      if (dt.getMonth() != currentDate.getMonth() || dt.getFullYear() != currentDate.getFullYear()) {
        continue;
      }
      let dDay = dDays[dt.getDate() + info.dayOffset].children[0];
      let d1 = addEditable(dDay, { w: '100%' }, { id: k, onEnter: onEventEdited, onclick: onclickExistingEvent, value: e.text });
    }
    mDummyFocus();
  }
  setDate(valf(month1, currentDate.getMonth() + 1), valf(year1, currentDate.getFullYear()));
  populate();
  return { container, date: currentDate, dDate, dGrid, dMonth, dYear, info, getDay, setDate, populate }
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
async function updateEvent(id, o) { 
  let result = await simpleUpload('event', o); 
  setEvent(id, o); 
  console.log('result', result); 
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
    if (nundef(arg) || isEmpty(arg) || isWhiteSpace(arg)) continue;
    return arg;
  }
  return null;
}
