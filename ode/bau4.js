
function colorCalculator(p, c0, c1, l) {
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
function colorDark(c, percent = 50, log = true) {
  if (nundef(c)) c = rColor(); else c = colorFrom(c);
  let zero1 = -percent / 100;
  return colorCalculator(zero1, c, undefined, !log);
}
function colorLight(c, percent = 20, log = true) {
  if (nundef(c)) {
    return colorFromHSL(rHue(), 100, 85);
  } else c = colorFrom(c);
  let zero1 = percent / 100;
  return colorCalculator(zero1, c, undefined, !log);
}

async function onclickBlendMode(item) {

  //console.log('WASSSSSSSSSSSSSS'); //return;
  U.bgImage = item.bgImage;
  U.bgBlend = item.bgBlend;
  U.bgSize = item.bgSize;
  U.bgRepeat = item.bgRepeat;

  await postUserChange();
  setTheme(U);
}
async function onclickColor(color) {
  let hex = colorToHex79(color);
  U.color = hex;
  await postUserChange();
  setTheme(U);
}
async function onclickSettColor() { await showColors(); }

async function onclickSettFg() { await showTextColors(); }

async function onclickSettBlendMode() {
  if (isEmpty(U.bgImage)) {
    showMessage('You need to set a Texture in order to set a Blend Mode!');
    return;
  }
  showBlendModes();
}
async function onclickSettRemoveTexture() {
  if (isEmpty(U.bgImage)) return;
  for (const prop of ['bgImage', 'bgSize', 'bgBlend', 'bgRepeat']) delete U[prop];
  console.log(U);
  await postUserChange(U, true)
  setTheme();
}
async function onclickSettSwapColoring(){
  if (isdef(U.swapColoring)) delete U.swapColoring;
  else U.swapColoring = true;
  await postUserChange(U,true); 
  setTheme();
}
async function onclickSettTexture() { await showTextures(); }

async function onclickTextColor(fg){
  let hex = colorToHex79(fg);
  U.fg = hex;
  await postUserChange();
  setTheme(U);
}
async function onclickTexture(item) {
  U.bgImage = item.bgImage;
  U.bgBlend = item.bgBlend;
  U.bgSize = item.bgSize;
  U.bgRepeat = item.bgRepeat;
  await postUserChange();
  setTheme(U);

}
async function showBlendModes() {
  let d = mBy('dSettingsColor'); mClear(d);
  let dTheme = mDom(d, { padding: 10, gap: 10 }); mFlexWrap(dTheme);

  let bgImage = U.bgImage;
  let bg = U.color;
  let bgRepeat = bgImage.includes('marble') ? 'no-repeat' : 'repeat';
  let bgSize = bgImage.includes('marble') ? 'cover' : '';
  // let bgSizeItem = bgImage.includes('marble')?'100vw 100vh':'auto'; 
  let bgSizeItem = bgSize; //bgImage.includes('marble')?'100vw 100vh':'auto'; 
  let list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  let items = [];
  for (const bgBlend of list) {
    let d = mDom(dTheme, { align: 'center', border: 'red', bgBlend, bg, bgRepeat, bgImage, bgRepeat, bgSize, w: '30%', h: 150 });
    mCenterCenterFlex(d);
    let d1 = mDom(d, { className: 'no_events' })
    mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'white' }, { html: bgBlend })
    mDom(d1, { fz: 30, weight: 'bold', align: 'center', fg: 'black' }, { html: bgBlend })
    let item = { div: d, bgImage, bgRepeat, bgSize: bgSizeItem, bgBlend, isSelected: false };
    items.push(item);
    d.onclick = async () => onclickBlendMode(item);
  }
  return items;
}
function showPaletteNames(dParent, colors) {
  let d1 = mDom(dParent, { gap: 12 }); mFlexWrap(d1);
  for (var c of colors) {
    let bg = c.hex;
    let d2 = mDom(d1, { wmin: 250, bg, fg: idealTextColor(bg), padding: 20 }, { class: 'colorbox', dataColor: bg });
    mDom(d2, { weight: 'bold', align: 'center' }, { html: c.name });
    let html = `<br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat * 100)}<br>lum:${Math.round(c.lightness * 100)}`
    let dmini = mDom(d2, { align: 'center', wmin: 120, padding: 2, bg, fg: idealTextColor(bg) }, { html });
  }
}
function _showPaletteNames(dParent, colors) {
  let d1 = mDom(dParent, { padding: 10, gap: 4 }); mFlexWrap(d1);

  for (var c of colors) {
    let bg = c.hex;
    let html = `${c.name}`; //: ${bg} hue:${c.hue} sat:${Math.round(c.sat * 100)} lum:${Math.round(c.lightness * 100)}`
    let dmini = mDom(d1, { padding: 2, bg, fg: idealTextColor(bg) }, { html, class: 'colorbox', dataColor: bg });
  }

}
async function showTextColors() {
  let d = mBy('dSettingsColor'); mClear(d);
  let d1 = mDom(d, { gap: 12 }); mFlexWrap(d1);
  let colors = ['white', 'silver', 'dimgray', 'black', getCSSVariable('--fgButton'), getCSSVariable('--fgButtonHover')].map(x => w3color(x));
  for (var c of colors) {
    let bg = 'transparent';
    let fg = c.hex = c.toHexString();
    let d2 = mDom(d1, { border: fg, wmin: 250, bg, fg, padding: 20 }, { class: 'colorbox', dataColor: fg });
    mDom(d2, { weight: 'bold', align: 'center' }, { html: 'Text Sample' });
    let html = `<br>${bg}<br>hue:${c.hue}<br>sat:${Math.round(c.sat * 100)}<br>lum:${Math.round(c.lightness * 100)}`
    let dmini = mDom(d2, { align: 'center', wmin: 120, padding: 2, bg, fg }, { html });
  }
  let divs = document.getElementsByClassName('colorbox');
  for (const div of divs) {
    div.onclick =async()=>onclickTextColor(div.getAttribute('dataColor')); 
  }
}
async function showTextures() {
  let d = mBy('dSettingsColor'); mClear(d);
  let dTheme = mDom(d, { padding: 12, gap: 10 }); mFlexWrap(dTheme);
  let list = M.textures; //await mGetFiles(`../assets/textures`);//jsCopy(M.textures); //list.reverse();
  //assertion(list.some(x=>x.includes('greenorange')),'NEIIIIIIIIIIIIIIIIIIIN');
  //list=list.filter(x=>x.includes('green'))
  let itemsTexture = [];
  for (const t of list) {
    let bgRepeat =  t.includes('marble_') ?'no-repeat':'repeat';
    //let bgSize = t.includes('marble_') ? `100vw 100vh` : t.includes('ttrans') ? '' : 'auto';
    let bgSize = t.includes('marble_') ? `cover` : t.includes('ttrans') ? '' : 'auto';
    let bgImage = `url('${t}')`;
    let recommendedMode = t.includes('ttrans') ? 'normal' : t.includes('marble_') ? 'luminosity' : 'multiply';
    // let dc = mDom(dTheme, { cursor: 'pointer', border: 'white', w: 300, h: 170 }, { tag: 'img' });
    let dc = mDom(dTheme, { bg: U.color, bgImage, bgSize, bgRepeat, bgBlend: recommendedMode, cursor: 'pointer', border: 'white', w: '30%', wmax:300, h: 170 });
    let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, bgBlend: recommendedMode, isSelected: false };
    itemsTexture.push(item);
    dc.onclick = async () => onclickTexture(item, itemsTexture);
  }

  // for (const [i, o] of itemsTexture.entries()) {
  //   let img = iDiv(o);
  //   img.onload = () => {
  //     let pal = ColorThiefObject.getPalette(img);
  //     if (pal == null) { pal = colorTransPalette(); }
  //     if (pal != null) {
  //       pal.unshift('white'); pal.push('black');
  //       let n = pal.length;
  //       pal = pal.map(x => colorHex(x));
  //       let palhex = Array.from(new Set(pal));
  //       let palhsl = palhex.map(x => colorHexToHsl360Object(x));
  //       let lum = palhsl.map(x => x.l);
  //       let hue = palhsl.map(x => x.h);
  //       let sat = palhsl.map(x => x.s);
  //       pal = [];
  //       for (let i = 0; i < palhex.length; i++) {
  //         let o = { hex: palhex[i], lum: lum[i], hue: hue[i], sat: sat[i] };
  //         pal.push(o);
  //       }
  //     }
  //     itemsTexture[i].palette = pal;
  //   }
  //   img.src = o.path;
  // }
  return itemsTexture;
}
function setTheme(o) {
  if (nundef(o)) o=U;
  setColors(o.color, o.fg);
  setTexture(o);
  console.log('___setTheme', 'color', U.color, '\nfg', U.fg, '\nbgImage', U.bgImage, '\nbgSize', U.bgSize, U.bgRepeat, U.bgBlend)
}
async function settingsOpen() {
  mClear('dMain');
  let d = mDom('dMain', { padding: 0, overy: 'auto', hmax: calcRestHeight('dMain') }, { id: 'dSettingsColor' });
  if (isdef(U.bgImage)) await showBlendModes(); else await showColors();
  settingsSidebar();
}
async function settingsClose() { closeLeftSidebar(); clearMain(); }

function settingsSidebar() {
  let wmin = 170;
  mStyle('dLeft', { wmin: wmin });
  let d = mDom('dLeft', { wmin: wmin - 10, margin: 10, matop: 160, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
  let gap = 5;
  UI.settColor = mCommand(d, 'settColor', 'Color'); mNewline(d, gap);
  UI.settFg = mCommand(d, 'settFg', 'Text Color'); mNewline(d, gap);
  UI.settTexture = mCommand(d, 'settTexture', 'Texture'); mNewline(d, gap);
  UI.settRemoveTexture = mCommand(d, 'settRemoveTexture', 'Remove Texture'); mNewline(d, gap);
  UI.settBlendMode = mCommand(d, 'settBlendMode', 'Blend Mode'); mNewline(d, gap);
  //UI.settSwapColoring = mCommand(d, 'settSwapColoring', 'Swap Coloring'); mNewline(d, gap);
}
