async function showColors() {
  showTitle('Set Color Theme');
  let sz = 30;
  let d = mDom('dMain', { wmax: (sz + 4) * 15, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  let itemsColor = [];
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c), cursor: 'pointer' });
    let item = { div: dc, color: c, isSelected: false };
    itemsColor.push(item);
    dc.onclick = () => onclickColor(item, itemsColor);
  }
  let dcc = mDom(d, { border: getThemeFg(), h: sz, cursor: 'pointer', hpadding: 4 }, { html: 'none' });
  let itemc = { div: dcc, color: '', isSelected: false };
  itemsColor.push(itemc);
  dcc.onclick = () => onclickColor(itemc, itemsColor);

  let dTheme = mDom('dMain', { wmax: (sz + 4) * 15, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list = M.textures;
  let itemsTexture = [];
  for (const t of list) {
    //console.log(c, typeof c)
    let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
    let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
    let bgImage = `url('${t}')`;
    let recommendedMode = t.includes('ttrans')?'normal':t.includes('marble_')?'luminosity':'multiply';
    let dc = mDom(dTheme, { cursor: 'pointer', border: 'black', w: sz, h: sz, 'background-image': bgImage, 'background-blend-mode': recommendedMode });
    let item = { div: dc, path: t, bgImage, bgRepeat, bgSize, blendMode:recommendedMode, isSelected: false };
    itemsTexture.push(item);
    dc.onclick = () => onclickTexture(item, itemsTexture);
  }
  let dct = mDom(dTheme, { border: getThemeFg(), h: sz, cursor: 'pointer', hpadding: 4 }, { html: 'none' });
  let itemt = { div: dct, bgImage: '', bgRepeat: '', bgSize: '', blendMode:'', isSelected: false };
  itemsTexture.push(itemt);
  dct.onclick = () => onclickTexture(itemt, itemsTexture);

  sz = 100;
  let dBlend = mDom('dMain', { wmax: (sz + 4) * 6, margin: 20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list = 'normal|multiply|screen|overlay|darken|lighten|color-dodge|saturation|color|luminosity'.split('|');
  let itemsBlend = [];
  // console.log('list',list.length)
  for (const [idx, mode] of list.entries()) {
    let id = `dSample${idx}`;
    let db = mDom(dBlend, { border: 'white', w: 100, h: 100, 'background-blend-mode': mode, cursor: 'pointer' }, { id, idx });
    let item = { div: db, blendMode: mode, isSelected: false };
    itemsBlend.push(item);
    db.onclick = () => onclickBlendSample(item, itemsBlend);
  }

  //hier moecht ich ein fs mit radios fuer die verschiedenen bland modes
  // let dBlend = mDom('dMain', { margin:20, hpadding: 0 });

  



}
function setColors(c, texture, blendMode) {
  // mClass(document.body, 'wood');
  if (nundef(c)){
    //pickup document.body style
    c=document.body.style.background;
    texture = document.body.style.backgroundImage;
    blendMode = document.body.style.backgroundBlendMode;
  }
  if (isEmpty(c)) c='transparent';
  if (nundef(texture)) texture = '';
  if (nundef(blendMode)) blendMode = '';
  let [bgRepeat,bgSize] = getRepeatAndSizeForTexture(texture);
  console.log('')
  //mStyle(document.body,{'background-'}


  return;
  if (isdef(texture)) c = 'transparent';
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
  if (nundef(texture)) return;
  console.log('HALLO')
  mStyle(document.body, { 'background-repeat': 'repeat', 'background-image': texture })

}
async function colorsUpdate(){
  let seldivs = document.body.getElementsByClassName('framedPicture');
  //first, find selected sample!

  // for(const el of Array.from(seldivs)){
  //   console.log('el',el);
  //   if (el.id.startsWith('dSample'))
  // }
}
async function onclickColor(item, items) {
  let c = item.color;//ev.target.style.background; 
  toggleItemSelection(item);//console.log('items',items)
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('c',c,typeof(c),isEmpty(c))
  if (!isEmpty(c)) c = colorHex(c);
  if (isEmpty(c)) { console.log('color EMPTY!', item); } //ev.target.style);}
  for (const i of range(0, 9)) { mBy(`dSample${i}`).style.backgroundColor = c; }
  document.body.style.background = c;
  // mBy('dPos').style.backgroundColor = c;
}
async function onclickTexture(item, items) {
  console.log('item', item)
  let texture = item.bgImage; //ev.target.style.backgroundImage;
  let repeat = item.bgRepeat; //ev.target.style.backgroundRepeat;
  let bgSize = item.bgSize; //repeat == 'repeat'?'auto':'cover';
  let blendMode = item.blendMode;
  toggleItemSelection(item);
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('texture',texture,'repeat',repeat)
  if (isEmpty(texture)) { console.log('texture EMPTY!', item); } //ev.target.style);}
  let blendModeDiv = null;
  for (const i of range(0, 9)) {
    let sample = mBy(`dSample${i}`);
    console.log(sample.style.backgroundBlendMode, blendMode)
    if (sample.style.backgroundBlendMode == blendMode) { blendModeDiv = sample; console.log('YES!') }
    sample.style.backgroundImage = texture;
    sample.style.backgroundRepeat = repeat;
    sample.style.backgroundSize = bgSize;
  }
  document.body.style.backgroundImage = texture;
  document.body.style.backgroundRepeat = repeat;
  document.body.style.backgroundSize = bgSize;
  if (nundef(blendModeDiv)) return;
  blendModeDiv.click();

  //mBy('dSample0').click()
  // mBy('dPos').style.backgroundImage = texture;
  // mBy('dPos').style.backgroundRepeat = repeat;
  // mBy('dPos').style.backgroundSize = bgSize;
}
async function onclickBlendSample(item, items) {
  console.log('CLICK!!!');//,item)
  let blendMode = item.blendMode; //ev.target.style.backgroundImage;
  toggleItemSelection(item);
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  document.body.style.backgroundBlendMode = blendMode;
}
