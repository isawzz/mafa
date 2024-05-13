
function setColors(bg, fg) {
  let fgIsLight = isdef(fg)?colorIdealText(fg)=='black':colorIdealText(bg)=='white';
  let bgIsDark = colorIdealText(bg)=='white';

  if (nundef(fg)) fg = colorIdealText(bg);

  let bgNav=bg;
  fg=colorToHex79(fg); console.log('fg',fg);
  if (fgIsLight){
    //navbar soll ein dunkler ton sein, based on bg, aber NICHT fully opaque!
    if (isEmpty(U.bgImage)){
      bgNav = '#00000040';
    } else if (bgIsDark){ //das heisst bg ist fairly dark already!
      bgNav = colorTrans(bg,.8);
    }else{
      //bg needs to be darker
      bgNav = colorTrans(colorDark(bg,50),.8);
    }
  }else{
    if (isEmpty(U.bgImage)){
      bgNav = '#ffffff40';
    } else if (!bgIsDark){ //das heisst bg ist fairly dark already!
      bgNav = colorTrans(bg,.8);
    }else{
      //bg needs to be darker
      bgNav = colorTrans(colorLight(bg,50),.8);
    }
  }
  setCssVar('--bgBody', isEmpty(U.bgImage)?bg:colorTrans(bg,.5));
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

  console.log(':::body color',colorToHex79(mGetStyle(document.body,'bg')))
  console.log('body style',['backgroundColor','backgroundImage','backgroundSize','backgroundRepeat','backgroundBlandMode'].map(x=>document.body.style[x]).join(','));
}
function setTexture(item) {
  // console.log(item);
  let d=document.body;
  let bgImage = valf(item.bgImage,'');
  let bgRepeat = valf(item.bgRepeat,'');
  let bgBlend = valf(item.bgBlend,'');
  let bgSize = valf(item.bgSize,'');

  // console.log('setTexture',bgImage,bgRepeat,bgBlend,bgSize);

  d.style.backgroundImage = bgImage;
  d.style.backgroundSize = bgSize;
  d.style.backgroundRepeat = bgRepeat;
  d.style.backgroundBlendMode = 'color-dodge'; //'overlay'; //bgBlend;
  //d.style.backgroundColor = colorTrans(U.color,.5);

  //d.style.opacity = .5

	//if (!isEmpty(bgImage)) d.style.filter = `url(#transparencyFilter)`;
  console.log(':::body color',colorToHex79(mGetStyle(document.body,'bg')))
  console.log('body style',['backgroundColor','backgroundImage','backgroundSize','backgroundRepeat','backgroundBlandMode'].map(x=>document.body.style[x]).join(','));
  // console.log('body style',document.body);
}








