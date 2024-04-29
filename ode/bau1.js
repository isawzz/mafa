function setColors(c,texture) {
  mClass(document.body,'wood');
	return;
  if (isdef(texture)) c='transparent';
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
  mStyle(document.body,{'background-repeat':'repeat','background-image': texture})

}

async function onclickColor(item,items) {
  let c = item.color;//ev.target.style.background; 
  toggleItemSelection(item);//console.log('items',items)
  let selitems=items.filter(x=>x.isSelected && x!=item); selitems.map(x=>toggleItemSelection(x));
  console.log('c',c,typeof(c),isEmpty(c))
  if (!isEmpty(c)) c = colorHex(c);
  if (isEmpty(c)) {console.log('color EMPTY!',item);} //ev.target.style);}
  for(const i of range(0,9)){mBy(`dSample${i}`).style.backgroundColor=c;}
  mBy('dPage').style.backgroundColor = c;
  // mBy('dPos').style.backgroundColor = c;
}
async function onclickTexture(item,items) {
  console.log('item',item)
  let texture = item.bgImage; //ev.target.style.backgroundImage;
  let repeat = item.bgRepeat; //ev.target.style.backgroundRepeat;
  let bgSize = item.bgSize; //repeat == 'repeat'?'auto':'cover';
  toggleItemSelection(item);
  let selitems=items.filter(x=>x.isSelected && x!=item); selitems.map(x=>toggleItemSelection(x));
  console.log('texture',texture,'repeat',repeat)
  if (isEmpty(texture)) {console.log('texture EMPTY!',item);} //ev.target.style);}
  for(const i of range(0,9)){
    mBy(`dSample${i}`).style.backgroundImage = texture;
    mBy(`dSample${i}`).style.backgroundRepeat=repeat;
    mBy(`dSample${i}`).style.backgroundSize=bgSize;
  }
  mBy('dPage').style.backgroundImage = texture;
  mBy('dPage').style.backgroundRepeat = repeat;
  mBy('dPage').style.backgroundSize = bgSize;
  // mBy('dPos').style.backgroundImage = texture;
  // mBy('dPos').style.backgroundRepeat = repeat;
  // mBy('dPos').style.backgroundSize = bgSize;
}
async function onclickBlendSample(item,items) {
  console.log('item',item)
  let blendMode = item.blendMode; //ev.target.style.backgroundImage;
  toggleItemSelection(item);
  let selitems=items.filter(x=>x.isSelected && x!=item); selitems.map(x=>toggleItemSelection(x));
  mBy('dPage').style.backgroundBlendMode = blendMode;
}
