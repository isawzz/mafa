
//#region legacy code
async function getPaletteFromElem(elem) {
	//blend-mode is not taken into account!
  let cv = await html2canvas(elem);
  let imgData = cv.toDataURL("image/jpeg", 0.9);
  let img = await imgAsync(elem.parentNode, { w: 100, h: 100, border: 'red', position: 'absolute', top: 210, left: 800 }, { src: imgData });
  let pal = ColorThiefObject.getPalette(img); //console.log('palette',pal)

  //sort palette by brightness!
  let arr = pal.map(x => ({ orig: x, hex: colorHex(x), lum: colorHSL(x, true).l }));
  arr = sortBy(arr, 'lum');
  //img.remove();
  //console.log(arr);

  return arr.map(x => x.hex); //.map(x=>colorHex(x));//new Image(cv.width,cv.height,imgData;
  // .then(function (canvas) {
  // 	let imgData = canvas.toDataURL("image/jpeg", 0.9);
  // 	var profile_image = mBy("profile_image");
  // 	profile_image.src = imgData;
  // 	mBy('imgPreview').src = imgData;

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
    "amanda": "#339940",
    "annabel": "#ADA0EE",
    "bob": "#033993",
    "buddy": "midnightblue",
    "felix": BLUE,
    "guest": "dodgerblue",
    "gul": "#6fccc3",
    "lauren": BLUEGREEN,
    "leo": "#C19450",
    "mac": ORANGE,
    "minnow": "#F28DB2",
    "mimi": "#76AEEB",
    "nasi": "#EC4169",
    "nimble": "#6E52CC",
    "sarah": "deeppink",
    "sheeba": "gold",
    "valerie": "lightgreen"
  };
  // for (const plname in userColors) {
  //   let uc = userColors[plname];
  //   uc = colorFrom(uc);
  //   let already = firstCond(all, x => x.c.toLowerCase() == uc.substring(0, 7).toLowerCase());
  //   if (already) console.log('present', uc);
  // }
  userColors = Object.values(userColors).map(x => colorFrom(x));
  ensureColorDict();
  ensureColorNames();
  let allColors = Object.values(ColorDi).map(x => x.c);
  let list = Object.values(userColors).concat(plColors).concat(allColors).concat(Object.values(ColorNames));
  // console.log('list',jsCopy(list))
  //list = list.filter(x => colorLum(x) < .85);
  list = list.filter(x => !isGrayColor(x));
  let s = new Set(list);
  list = Array.from(s);
  // let x=list.filter(x=>x.length!=7); console.log(x)
  assertion(list.every(x => x.length == 7), "COLORS WRONG!")
  let hsllist = list.map(x => colorHexToHsl01Array(x)); //, true));
  // hsllist = hsllist.map(x=>({h:x[0],s:x[1],l:x[2]}));
  hsllist = hsllist.map(x => ({ h: x[0] * 360, s: x[1] * 100, l: x[2] * 100 }));
  console.log('list', jsCopy(hsllist));
  sortByMultipleProperties(hsllist, 'h', 'l');
  console.log('list', jsCopy(hsllist[100]));
  // let list2 = hsllist.map(x => hslToHex(x.h*360,x.s*100,x.l*100)); //colorFrom(hslToHsl(x)));
  let list2 = hsllist.map(x => hslToHex(x.h, x.s, x.l)); //colorFrom(hslToHsl(x)));
  for (let i = 0; i < list2.length; i++) if (!list.includes(list2[i])) console.log("ERROR")
  console.log('list', jsCopy(list))
  //list = arrRemoveDuplicates(list);
  //M.playerColors = list;
  return list;
}

//#region mStyle
function mStyle(elem, styles = {}, unit = 'px') {
  elem = toElem(elem);
  let style = styles = jsCopy(styles);
  if (isdef(styles.w100)) style.w = '100%';
  if (isdef(styles.h100)) style.h = '100%';
  let bg, fg;
  if (isdef(styles.bg) || isdef(styles.fg)) {
    [bg, fg] = colorsFromBFA(styles.bg, styles.fg, styles.alpha);
    //console.log('bg',bg)
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
    else if (key == 'background-color') elem.style.backgroundColor = bg;
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
//#endregion

//#region findNearest von chatGPT using LAB, XYZ color system
function rgbToXyz([r, g, b]) {
	r = r / 255;
	g = g / 255;
	b = b / 255;

	r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92;
	g = g > 0.04045 ? ((g + 0.055) / 1.055) ** 2.4 : g / 12.92;
	b = b > 0.04045 ? ((b + 0.055) / 1.055) ** 2.4 : b / 12.92;

	let x = r * 0.4124 + g * 0.3576 + b * 0.1805;
	let y = r * 0.2126 + g * 0.7152 + b * 0.0722;
	let z = r * 0.0193 + g * 0.1192 + b * 0.9505;

	return [x * 100, y * 100, z * 100];
}
function xyzToLab([x, y, z]) {
	x /= 95.047;
	y /= 100.000;
	z /= 108.883;

	x = x > 0.008856 ? x ** (1 / 3) : (7.787 * x) + (16 / 116);
	y = y > 0.008856 ? y ** (1 / 3) : (7.787 * y) + (16 / 116);
	z = z > 0.008856 ? z ** (1 / 3) : (7.787 * z) + (16 / 116);

	let l = (116 * y) - 16;
	let a = 500 * (x - y);
	let b = 200 * (y - z);

	return [l, a, b];
}
function rgbToLab(rgb) {
	return xyzToLab(rgbToXyz(rgb));
}
function deltaE2000(lab1, lab2) {
	const [L1, a1, b1] = lab1;
	const [L2, a2, b2] = lab2;

	const kL = 1;
	const kC = 1;
	const kH = 1;

	const deltaLPrime = L2 - L1;
	const LBar = (L1 + L2) / 2;
	const C1 = Math.sqrt(a1 * a1 + b1 * b1);
	const C2 = Math.sqrt(a2 * a2 + b2 * b2);
	const CBar = (C1 + C2) / 2;
	const a1Prime = a1 + a1 / 2 * (1 - Math.sqrt(CBar ** 7 / (CBar ** 7 + 25 ** 7)));
	const a2Prime = a2 + a2 / 2 * (1 - Math.sqrt(CBar ** 7 / (CBar ** 7 + 25 ** 7)));
	const C1Prime = Math.sqrt(a1Prime * a1Prime + b1 * b1);
	const C2Prime = Math.sqrt(a2Prime * a2Prime + b2 * b2);
	const CBarPrime = (C1Prime + C2Prime) / 2;
	const deltaCPrime = C2Prime - C1Prime;
	const h1Prime = Math.atan2(b1, a1Prime) * 180 / Math.PI;
	const h2Prime = Math.atan2(b2, a2Prime) * 180 / Math.PI;
	const hBarPrime = (Math.abs(h1Prime - h2Prime) > 180) ? (h1Prime + h2Prime + 360) / 2 : (h1Prime + h2Prime) / 2;
	const deltaHPrime = 2 * Math.sqrt(C1Prime * C2Prime) * Math.sin((h2Prime - h1Prime) * Math.PI / 360);
	const T = 1 - 0.17 * Math.cos((hBarPrime - 30) * Math.PI / 180) + 0.24 * Math.cos((2 * hBarPrime) * Math.PI / 180) + 0.32 * Math.cos((3 * hBarPrime + 6) * Math.PI / 180) - 0.20 * Math.cos((4 * hBarPrime - 63) * Math.PI / 180);
	const SL = 1 + ((0.015 * ((LBar - 50) ** 2)) / Math.sqrt(20 + ((LBar - 50) ** 2)));
	const SC = 1 + 0.045 * CBarPrime;
	const SH = 1 + 0.015 * CBarPrime * T;
	const RT = -2 * Math.sqrt(CBarPrime ** 7 / (CBarPrime ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hBarPrime - 275) / 25) ** 2)) * Math.PI / 180);
	const deltaE = Math.sqrt((deltaLPrime / (kL * SL)) ** 2 + (deltaCPrime / (kC * SC)) ** 2 + (deltaHPrime / (kH * SH)) ** 2 + RT * (deltaCPrime / (kC * SC)) * (deltaHPrime / (kH * SH)));

	return deltaE;
}
function findNearestNamedColor(inputColor, namedColors) {
	let inputRgb = colorHexToRgbArray(colorFrom(inputColor));
	let inputLab = rgbToLab(inputRgb);

	let minDistance = Infinity;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let namedRgb = colorHexToRgbArray(namedColor.hex);
		let namedLab = rgbToLab(namedRgb);
		let distance = deltaE2000(inputLab, namedLab);
		if (distance < minDistance) {
			minDistance = distance;
			nearestColor = namedColor;
		}
	});

	return nearestColor;
}
function findFarestNamedColor(inputColor, namedColors) {
	let inputRgb = colorHexToRgbArray(colorFrom(inputColor));
	let inputLab = rgbToLab(inputRgb);

	let minDistance = 0;
	let nearestColor = null;

	namedColors.forEach(namedColor => {
		let namedRgb = colorHexToRgbArray(namedColor.hex);
		let namedLab = rgbToLab(namedRgb);
		let distance = deltaE2000(inputLab, namedLab);
		if (distance > minDistance) {
			minDistance = distance;
			nearestColor = namedColor;
		}
	});

	return nearestColor;
}
//#endregion

//#region CancelablePromise und mSleep
class CancelablePromise {
  constructor(executor, oncancel) {
    this._hasCanceled = false;
    this._oncancel = oncancel;
    this.promise = new Promise((resolve, reject) => {
      this._reject = reject; // Store reject function to call it on cancel

      executor(
        (value) => {
          if (this._hasCanceled) {
            reject({ isCanceled: true });
          } else {
            resolve(value);
          }
        },
        (error) => {
          if (this._hasCanceled) {
            reject({ isCanceled: true });
          } else {
            reject(error);
          }
        }
      );
    });
  }

  cancel() {
    if (this._hasCanceled) return;
    this._hasCanceled = true;
    if (this._oncancel) this._oncancel();
    this._reject({ isCanceled: true }); // Immediately reject with cancellation
  }
}
async function mySleep(ms, oncancel) {
  // // Usage example:
  // (async () => {
  //   const sleep = await mySleep(3000, () => console.log('Canceled!'));

  //   // To cancel the sleep
  //   setTimeout(() => sleep.cancel(), 1000); // Cancels the sleep after 1 second
  // })();
  //if (nundef(oncancel)) oncancel = ()=>console.log('SLEEP CANCELLED!!!!');
  return new CancelablePromise((resolve) => {
    const timeoutId = setTimeout(resolve, ms);
    // Clean up timeout if canceled
    this.promise.catch((err) => {
      if (err.isCanceled) {
        clearTimeout(timeoutId);
      }
    });
  }, oncancel);
}

async function mSleep0(ms) {
  if (SLEEP_WATCHER) SLEEP_WATCHER.cancel();
  SLEEP_WATCHER = await mySleep(ms);
}
async function mSleep1(ms) {
  const sleep = await mySleep(3000, () => console.log('Canceled!'));
  setTimeout(() => sleep.cancel(), 4000); // Cancels the sleep after 1 second
}
//#endregion



