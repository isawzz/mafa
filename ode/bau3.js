
function setColors(bg, fg) {
  let fgIsLight = isdef(fg) ? colorIdealText(fg) == 'black' : colorIdealText(bg) == 'white';
  let bgIsDark = colorIdealText(bg) == 'white';

  if (nundef(fg)) fg = colorIdealText(bg);

  let bgNav = bg;
  fg = colorToHex79(fg);
  if (fgIsLight) {
    if (isEmpty(U.bgImage)) { bgNav = '#00000040'; }
    else if (bgIsDark) { bgNav = colorTrans(bg, .8); }
    else { bgNav = colorTrans(colorDark(bg, 50), .8); }
  } else {
    if (isEmpty(U.bgImage)) { bgNav = '#ffffff40'; }
    else if (!bgIsDark) { bgNav = colorTrans(bg, .8); }
    else { bgNav = colorTrans(colorLight(bg, 50), .8); }
  }

  let t = U.bgImage;
  //bgNav darf nicht bg sein
  let realBg = bg; // isEmpty(t) || t.includes('ttrans') ? bg : colorTrans(bg, .5);
  if (bgNav == realBg) bgNav = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);

	//if (U.swapColoring){ let help=bgNav;bgNav=realBg;realBg=help;}

  setCssVar('--bgBody', realBg);
  setCssVar('--bgButton', 'transparent')
  setCssVar('--bgButtonActive', 'transparent')
  setCssVar('--bgNav', bgNav)
  // setCssVar('--bgLighter', light())
  // setCssVar('--bgDarker', dark())
  setCssVar('--fgButton', fg)
  setCssVar('--fgButtonActive', fg)
  setCssVar('--fgButtonDisabled', 'silver')
  setCssVar('--fgButtonHover', fg)
  setCssVar('--fgTitle', fg)
  setCssVar('--fgSubtitle', fg);
}
function setTexture(item) {
  let d = document.body;
  let bgImage = valf(item.bgImage, '');
  let bgRepeat = valf(item.bgRepeat, '');
  let bgBlend = valf(item.bgBlend, '');
  let bgSize = valf(item.bgSize, '');

  d.style.backgroundColor = U.color;
  d.style.backgroundImage = bgImage;

	d.style.backgroundSize = bgSize=='cover'?'100vw 100vh':bgSize;
  d.style.backgroundRepeat = 'repeat'; //bgRepeat;

	// d.style.backgroundSize = bgSize=='cover'?'100% 100%':bgSize;
  // d.style.backgroundRepeat = bgRepeat;


	d.style.backgroundBlendMode = bgBlend;
}





