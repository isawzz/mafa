onload = start;

async function start() { TESTING = true; await prelims(); }
async function start() { TESTING = true; await test124(); }

async function test124(){
  await prelims(); 
  let di={};

  for(const k in M.superdi){
    let o=M.superdi[k];
    assertion(isList(o.colls),`${k} does not have colls!`);
    assertion(isList(o.cats),`${k} does not have cats!`);

    if (isEmpty(o.colls)) {
      console.log(`${k} NO MORE colls!!!`,o);
    }
    delete o.key;

    di[k]=o;
  }
  di=sortDictionary(di);
  // downloadAsYaml(di,'superdi');
}
async function test124_animalDetailsYaml(){
  let ad = getAnimalDetails();
  let di={};
  for (const k in ad) {
    let o = ad[k];
    let knew = normalizeString(k);
    //let lastWord = stringAfterLast(knew, '_');
    di[knew]=o;
  }
  di = sortDictionary(di);
  downloadAsYaml(di,'diDetails');
    
}
async function test123(){
  await prelims(); 
  let di={};

  for(const k in M.superdi){
    let o=M.superdi[k];
    // if (isdef(o.key)) console.log('has key!',o);
    //assertion(nundef(o.key),`${k} still has a key!`);
    assertion(isList(o.colls),`${k} does not have colls!`);
    assertion(isList(o.cats),`${k} does not have cats!`);

    for(const s of ['animals','critters','armadillos','owls']) {
      removeInPlace(o.colls,s);
    }
    if (isEmpty(o.colls)) console.log(`${k} NO MORE colls!!!`)
    let validcats = 'animal action building card clothing food emotion gesture wheather user transport sport plant';
    o.cats=o.cats.filter(x=>validcats.includes(x));

    delete o.key;

    di[k]=o;
  }
  di=sortDictionary(di);
  downloadAsYaml(di,'superdi');
}
async function test122(){
  await prelims(); 
  let di={};

  for(const k in M.superdi){
    let o=M.superdi[k];
    delete o.key;
    assertion(isdef(o.colls),`${k} does not have colls!`);
    assertion(isdef(o.cats),`${k} does not have cats!`);
    removeInPlace(o.cats,'best');
    if (isEmpty(o.colls)) console.log(`${k} in NO collection`)
    if (o.colls.length == 1 && o.colls[0]=='animals') continue;
    di[k] = o;
  }
  //downloadAsYaml(di,'superdi');
}
async function test121_tierbilderbesser(){
  await prelims(); return;
  let tierfiles = await mGetFiles('../assets/img/tierspiel');
  //console.log(tierfiles);
  let d=clearFlex();
  let keys = M.byCollection.animals;
  let newkeys = M.byCollection.tierspiel;

  let di={};
  for(const k of keys){
    let old=M.superdi[k];
    let img =old.img;
    if (tierfiles.some(x=>img.includes(x))) {
      console.log('___found',k);
      if (newkeys.includes(k)) {
        console.log('IS in tierspiel!',old); 

      }

    }
  }
}
async function test120_normalizeFriendly(){
  await prelims(); 
  for(const k in M.superdi){
    let o=M.superdi[k];
    o.friendly = normalizeString(o.friendly);
  }

  downloadAsYaml(M.superdi,'superdi');
}
async function test119_animalDetails() {
  await prelims(); 
  let ad = getAnimalDetails();
  let di = {};
  let diDetail = {}, deletedKeys = [], collname = 'tierspiel';
  for (const k in ad) {
    let knew = normalizeString(k);
    let lastWord = stringAfterLast(knew, '_');
    let f1 = M.byFriendly[k];
    let f2 = M.byFriendly[knew];
    let m1 = M.superdi[k];
    let m2 = M.superdi[knew];
    let m3 = M.superdi[lastWord];
    diDetail[knew] = ad[k];
    if (isdef(m2)) {console.log('already have',knew,m2); continue; }

    console.log('___', k);
    if (k != knew && isdef(m1)) console.log(`m1: ${k} in superdi`, m1);
    if (isdef(m2)) console.log(`m2: ${knew} in superdi`, m2);
    if (k != knew && isdef(f1)) console.log(`f1: ${k} in friendly`, f1, M.superdi[f1[0]]);
    if (isdef(f2)) console.log(`f2: ${knew} in friendly`, f2, M.superdi[f2[0]]);

    assertion(nundef(f1),"HALLO DA SIND IMMER NOCH non-normalized friendly strings!!!");

    if (isdef(m1) && m1.colls.includes(collname) && knew != k) { addIf(deletedKeys, k); di[knew] = di[k]; }
    else if (isdef(f2) && nundef(m2)) {
      let kbloed = f2[0];
      let o = M.superdi[kbloed];
      addIf(deletedKeys, kbloed);
      o.friendly = knew;
      let kfinal = nundef(M.superdi[lastWord]) ? lastWord : knew;
      o.key = kfinal;
      console.log('add', o, 'as', kfinal);
      di[kfinal] = o;
    } else if (isdef(f2) && nundef(m1)) {
      let kbloed = f2[0];
      let o = M.superdi[kbloed];
      o.friendly = knew;
      let kfinal = nundef(M.superdi[lastWord]) ? lastWord : kbloed;
      console.log('add', o, 'as', kfinal);
      if (kfinal != kbloed) addIf(deletedKeys, kbloed);
      di[kfinal] = o;
    }


    break;
    //if (isdef(m1) && m1.colls.includes(collname) && knew!=k) {addIf(deletedKeys,k);di[knew]=di[k];}
  }

  console.log('delete:',deletedKeys)
  // let res = await mPostRoute('postUpdateSuperdi', { di });
  // await loadAssets();
  // collPostReload();

  //diDetail = sortDictionary(diDetail);
  //downloadAsYaml(diDetail,'diDetail');
}
async function test118_deleteTheme() {
  await prelims();
  delete Serverdata.config.themes.forest;
  await mPostRoute('postConfig', Serverdata.config)
}

async function test117() {
  await prelims();

}

//#region settings
async function test116_calcPalette() {
  await prelims();

  //console.log('???',typeof colorDistanceHue('red','black'));return;
  return;
  let [pal, palContrast] = await calcUserPalette('mac');
  let d = mPopup(); showPaletteMini(d, pal); mLinebreak(d); showPaletteMini(d, palContrast);
}
async function test115_calcPaletteForUser() {
  await prelims();

  let x = colorDistanceHueLum('#ffffff', '#000000'); console.log(x); //return;
  x = colorDistanceHueLum('#ff0000', '#00ffff'); console.log(x); //return;
  x = colorDistanceHueLum('#ffff00', '#000000'); console.log(x); //return;
  x = colorDistanceHueLum('#006c7f', '#8e846a'); console.log(x); //return;

  //await switchToUser('maya','settings'); 
  await calcUserPalette('lauren');
}
async function test115_calcPaletteForUser_no() {
  await prelims();
  let user = Serverdata.users['lauren'];
  let d = clearFlex({ h: '100vh', w: '100vw', bg: user.color });
  mDom(d, { fg: 'white' }, { html: user.name });
  let palette = await showPaletteFor(d, user.texture, user.color, user.blendMode);
}
//#endregion

//#region mGather refactoring!
async function test114_mGatherCheckListInput() {
  await prelims();
  return;
  await switchToMainMenu('collections');
  await onclickCollSelectAll();
  await onclickEditCategories();
  let d = clearFlex(); let dAnchor = mDom(d, { matop: 100, bg: 'green', padding: 10, align: 'center' }, { html: 'Anchor' });
  let content, res;

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  // content={a:true,b:false,c:true};
  // content = ['das','ist','richtig']
  // content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, { hmax: 510, wmax: 200, pabottom: 10, box: true }, { content, type: 'checkList' });
  console.log('res', res)


}
async function test114_mGatherCheckList() {
  await prelims();
  await switchToMainMenu('collections'); return;
  let d = clearFlex(); let dAnchor = mDom(d, { matop: 100, bg: 'green', padding: 10, align: 'center' }, { html: 'Anchor' });
  let content, res;

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  // content={a:true,b:false,c:true};
  // content = ['das','ist','richtig']
  // content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, { hmax: 510, wmax: 200, pabottom: 10, box: true }, { content, type: 'checkList' });
  console.log('res', res)


}
async function test113_mGather() {
  await prelims();

  // return;
  let d = clearFlex(); let dAnchor = mDom(d, { matop: 100, bg: 'green', padding: 10, align: 'center' }, { html: 'Anchor' });
  let content, res;
  //let name = await mGather(dAnchor); console.log('you picked',name); //OK

  content = { input1: '', input2: '', input3: '' };
  //res = await mGather(dAnchor,{},{content,type: 'multi'}); console.log('you picked',res); //OK object w/ new vals

  content = 'are you happy?';
  //res = await mGather(dAnchor,{},{content,type: 'yesNo'}); console.log('you picked',res); //OK true|false

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  content = { a: 1, b: 2, c: 3 };
  content = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5 }];
  //content = ['das','ist','richtig']
  //content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, {}, { content, type: 'select' });
  console.log('res', res)


}
async function test112() {
  //wie mach ich ein gadget fuer colorname?
  await prelims();
  let d = clearFlex();

  let dAnchor = mDom(d, { matop: 100, bg: 'green', w: 200, padding: 10, align: 'center' }, { html: 'Anchor' });
  let res;

  let content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  content = { a: 1, b: 2, c: 3 };
  content = [{ a: 1, b: 2, c: 3 }, { a: 4, b: 5 }];
  //content = ['das','ist','richtig']
  //content = 'ich bin hier im jetzt';
  res = await mGather(dAnchor, {}, { content, type: 'select' });
  console.log('res', res)
  // res = uiTypeSelect(content,d); //console.log(res)

  return;

  //res = await mGather(title,{},{content, type: 'select'}); 
  console.log('you picked', res);

  //let name = await mGather(title); console.log('you picked',name); //OK

  content = [{ name: 'a', value: true }, { name: 'b', value: false }, { name: 'c', value: false }]; //OK 'a@b@c'|[options join @]
  //res = await mGather(title,{},{content,type: 'checkList'}); console.log('you picked',res); 

  content = 'restart?'
  //res = await mGather(title,{},{content,type: 'yesno'}); console.log('you picked',res); //OK true|false

  content = [{ name: 'a', value: true }, { name: 'b', value: true }, { name: 'c', value: false }];
  //res = await mGather(title,{},{content,type: 'checkListInput'}); console.log('you picked',res); //OK list of vals

  content = { input1: '', input2: '', input3: '' };
  //res = await mGather(title,{},{content,type: 'multi'}); console.log('you picked',res); //OK object w/ new vals



}
async function test111() {
  //console.log(colorDistance('black','white')); return;
  await prelims();
  let d = clearFlex();
  for (const i of range(30)) {
    let letter = rChoose(['R', 'G', 'Y', 'B', 'M', 'C']);
    let num = rChoose(range(100));
    for (let x = -90; x < 100; x += 30) {
      let [w, b] = x < 0 ? [-x, 0] : x == 0 ? [0, 0] : [0, x]; //rChoose(range(100)),rChoose(range(100))];
      let ncol = letter + num; console.log('___ my ncol', ncol, w, b)
      let color = colorFromNcol(ncol, w, b);
      let w3 = colorO(color);
      w3.myNcol = ncol;
      let realColor = M.colorByName[w3.name];
      let dist = w3.distance;
      if (w3.distance > 20) w3.name = `[${w3.name}]`;
      else w3.name += dist < 5 ? '***' : dist < 10 ? '**' : dist < 15 ? '*' : '';
      //w3.myBucket=colorGetBucket(w3.hex);
      let d1 = showObject(w3, ['name', 'hex', 'distance', 'bucket', 'hue', 'ncol', 'myNcol'], d, { bg: w3.hex, wmin: 233 });
      showObject(realColor, ['name', 'hex', 'bucket'], d, { bg: realColor.hex, wmin: 233 });
      mLinebreak(d)
    }
    mLinebreak(d)
  }


}
//#endregion

//#region colors, palette, ...
async function test108_colorNatVersusW3_BROKEN() {
  await prelims();
  let d = clearFlex();
  for (const i of range(30)) {
    let w3 = rChoose(M.colorList);
    let hex = w3.hex;
    let hwb = colorToHwbRounded(hex);
    let ncol = colorHueToNcol(hwb.h); //console.log('my ncol',ncol)
    console.log('___', w3.hue, w3.ncol, ncol, colorNcolToHue(ncol)); //w3.toNcol()); 
    let nat = colorHueToNat(hwb.h);
    console.log(w3.hue, nat, colorNatToHue(nat)); //w3.toNcol()); 
  }
}
async function test110_colorNatVersusW3() {
  await prelims();
  let d = clearFlex();
  for (const i of range(103)) {
    let c = rChoose(M.colorList); console.log('___', c.hue, c.sat * 100, Math.round(c.lightness * 100), c.hex);
    let hex = c.hex;
    let hsl = colorHexToHslRounded(hex); console.log(hsl)
    assertion(hsl.h == c.hue && hsl.s == Math.round(c.sat * 100) && hsl.l == Math.round(c.lightness * 100), 'WTF')
    //let hex = c.hex; console.log(hex)
  }
}
async function test109_colorNatVersusW3() {
  await prelims();
  let d = clearFlex();
  for (const i of range(103)) {
    let c = rChoose(M.colorList); console.log('___', c.hue, c.sat * 100, Math.round(c.lightness * 100), c.hex);
    let hex = c.hex;
    let hsl = colorHexToHslRounded(hex); console.log(hsl)
    assertion(hsl.h == c.hue && hsl.s == Math.round(c.sat * 100) && hsl.l == Math.round(c.lightness * 100), 'WTF')
    //let hex = c.hex; console.log(hex)
  }
}
async function test108_colorNatVersusW3() {
  await prelims();
  let d = clearFlex();
  for (const i of range(105)) {
    let c = rChoose(M.colorList); console.log(c.red, c.green, c.blue, c.hex);
    let hex = c.hex;
    let [r, g, b] = colorHexToRgbArray(hex); console.log(r, g, b)
    assertion(r == c.red && g == c.green && b == c.blue, 'WTF');
    //let hex = c.hex; console.log(hex)
  }
}
async function test108_ncolHue() {
  for (const i of range(20)) {
    let ncol = colorHueToNcol(i); let hue = colorNcolToHue(ncol);
    // console.log(`i:${i}, ncol:${ncol}, hue:${hue}`);
    assertion(hue == i, `i:${i}, ncol:${ncol}, hue:${hue}`);
  }
}
async function test107_hueTest() {
  await prelims();
  let d = clearFlex();
  let list = [44, 45, 46, 0, 1, 2, 359, 360];
  list.forEach(x => showColorFromHue(d, x))
}
async function test106_hueCheck() {
  await prelims();
  let d = clearFlex();
  //console.log('names',Object.keys(byname));
  for (const i of range(1, 360, 5)) {
    let c = colorHsl360ArgsToHex79(i, 100, 50);
    let w3 = colorNearestNamed(c, M.colorList);
    //let w3=rChoose(dicolorlist);
    let d1 = showObject(w3, ['name', 'hex', 'bucket', 'hue'], d, { bg: w3.hex });
    d1.innerHTML += colorGetBucket(w3.hex);
  }
}
async function test106_bucketCheck() {
  await prelims();
  [dicolorlist, byhex, byname] = getListAndDictsForDicolors();
  //console.log('names',Object.keys(byname));
  let d = clearFlex();
  for (const i of range(3)) {
    let w3 = rChoose(dicolorlist);
    let d1 = showObject(w3, ['name', 'hex', 'bucket', 'hue'], d, { bg: w3.hex });
    d1.innerHTML += colorGetBucket(w3.hex);
  }
}
async function test105_myhwb() {
  let hex = colorTrans('black', .5); //'black'; //'#ffffff'; //rColor(); //'#00ff80'; //
  console.log(colorFrom(hex), hex)
  let c = w3color(hex); console.log(c);
  let hsl = c.toHslaString(); console.log('toHsl', hsl);
  let hbw = c.toHwb(); console.log('toHwb', hbw);
  let w3ncol = c.toNcol(); console.log('toNcol', w3ncol);

  console.log(colorHueToNcol(hsl.h))


}
async function test104_WTF() {
  let hex = '#00ff80'; //rColor(); 
  console.log(colorFrom(hex), hex)
  let c = w3color(hex); console.log(c);
  let x = c.toCmyk(); console.log('toCmyk', x);
  x = c.toCmykString(); console.log('toCmykString', x);
  x = c.toHsl(); console.log('toHsl', x);
  x = c.toHslString(); console.log('toHslString', x);
  x = c.toHslStringDecimal(); console.log('toHslStringDecimal', x);
  x = c.toHwb(); console.log('toHwb', x);
  x = c.toHwbString(); console.log('toHwbString', x);
  x = c.toHwbStringDecimal(); console.log('toHwbStringDecimal', x);
  x = c.toName(); console.log('toName', x);
  x = c.toNcol(); console.log('toNcol', x);
  x = c.toNcolString(); console.log('toNcolString', x);
  x = c.toNcolStringDecimal(); console.log('toNcolStringDecimal', x);
  x = c.toRgb(); console.log('toRgb', x);
  x = c.toRgbString(); console.log('toRgbString', x);
  return;
  let nearestColor = c.toNcol();
  console.log(`The nearest named color to ${hex} is`, nearestColor);
}
async function test103_w3colorNcol() {

  function findNearestNamedColor(hex) {
    let color = w3color(hex);
    let nearestColor = color.toNcol();
    console.log(`The nearest named color to ${hex} is ${nearestColor}`);
  }
  findNearestNamedColor("#ff5733");
  findNearestNamedColor("#3498db");
  findNearestNamedColor("#aabbcc");

}
async function test102() {
  await prelims();
  let namedColors = colorGetDicolorList(); console.log('namedColors', namedColors.length);
  let dp = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
  let d = mDom(dp, { gap: 10 }); mFlexWrap(d);

  let c = rColor(); console.log('c', c); showColor(d, c);
  mLinebreak(d);

  console.log('________ nearest')
  let named = colorNearestNamed(c, namedColors); showColor(d, named);
  console.log('________ nearest 2')
  let named2 = findNearestNamedColor(c, namedColors); showColor(d, named2);

  console.log('________ nearest 2')
  let named3 = w3color(c).toName(); console.log(named3); //showColor(d, named3);

  mLinebreak(d); return;

  console.log('________ farest')
  let contrast = colorFarestNamed(c, namedColors);
  let contrastToAlg1 = colorGetContrast(c, contrast.hex);

  let d1 = showColor(d, contrast); d1.innerHTML += `<br>${contrastToAlg1}`;

  console.log('________ farest 2')
  let contrast2 = findFarestNamedColor(c, namedColors);
  let contrastToAlg2 = colorGetContrast(c, contrast2.hex)

  d1 = showColor(d, contrast2); d1.innerHTML += `<br>${contrastToAlg2}`;

  mLinebreak(d);
  let compl = colorComplement(c); showColor(d, compl);
  let contrastToComplement = colorGetContrast(c, compl)
  let complNamed = colorNearestNamed(compl, namedColors);

  d1 = showColor(d, compl); d1.innerHTML += `<br>${contrastToComplement}`;

  mLinebreak(d);
  showText(d, colorGetContrast(c, 'white'), 'white')
  showText(d, colorGetContrast(c, 'black'), 'black')

}
async function test101_blendModesAppliedToColors() {
  d = mDom(document.body); let d2 = mDom(d, { gap: 10 }); mFlexWrap(d2);

  let color1 = rColor();
  let color2 = rColor();
  mDom(d2, { align: 'center', wmin: 120, padding: 2, bg: color1, fg: colorIdealText(color1) }, { html: color1 });
  mDom(d2, { align: 'center', wmin: 120, padding: 2, bg: color2, fg: colorIdealText(color2) }, { html: color2 });
  mLinebreak(d2);
  for (const blc of getBlendModesCanvas()) {
    let bl = getBlendCSS(blc); console.log(bl)
    let c = colorBlendMode(color1, color2, bl);
    mDom(d2, { align: 'center', wmin: 120, padding: 2, bg: c, fg: colorIdealText(c) }, { html: bl });
  }

}
async function test100_enrichColorBlendModes() {
  const blendModes = [
    'source-over',
    'lighter',
    'copy',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity'
  ];

}
async function test99_calcPaletteForUser() {
  await prelims();
  //await switchToUser('maya','settings'); 
  let d = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
  mFlexWrap(d);
  await analyseColorsForUser(d, 'lauren');
}
async function test98_rgb2hsl() {
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s, l];
  }
  let x = rgbToHsl(0, 0, 255);
  console.log(x)
}
async function test97_calcPalette() {
  await prelims();
  //await switchToUser('maya','settings'); 
  let d = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
  mFlexWrap(d);
  // showBlendMode(d,U.blendMode);
  for (const name in Serverdata.users) {
    let user = Serverdata.users[name];
    let d1 = mDom(d, { align: 'center', bg: user.color, fg: valf(user.fg, colorIdealText(user.color)) });
    mDom(d1, {}, { html: name });
    let palette = await showPaletteFor(d1, user.texture, user.color, user.blendMode);
  }
}
async function test96_() {
  await prelims();
  await switchToUser('maya', 'settings');
}
async function test95_fixThemes() {
  await prelims();
  for (const key in Serverdata.config.themes) {
    let theme = Serverdata.config.themes[key];
    theme.texture = pathFromBgImage(theme.bgImage); delete theme.bgImage;
    theme.blendMode = theme.bgBlend; delete theme.bgBlend;
  }
  await mPostRoute('postConfig', Serverdata.config);
  console.log('themes', Serverdata)
}
async function test95_fixUsers() {
  await prelims();
  for (const name in Serverdata.users) {
    let user = Serverdata.users[name];
    if (nundef(user.imgKey)) user.imgKey = isdef(M.superdi[name]) ? name : 'unknown_user';
    delete user.key;
    if (!isEmpty(user.bgBlend)) { user.blendMode = user.bgBlend; }
    delete user.bgBlend;
    delete user.bgRepeat;
    delete user.bgSize;
    if (!isEmpty(user.bgImage)) { user.texture = pathFromBgImage(user.bgImage); }
    delete user.bgImage;
    delete user.games;
    let res = await postUserChange(user, true);
    if (name == 'guest') console.log(res); else console.log(res.name, res.imgKey)
  }
}
async function test94_showBlendModes() {
  await prelims();
  //await switchToUser('mimi','settings'); //console.log(mBy('dSettingsMenu'))
  //await onclickSettTexture();
}
async function test93_modUsersBgImageToTexture() {
  await prelims();
  for (const name in Serverdata.users) {
    let user = Serverdata.users[name];
    if (isdef(user.bgImage)) {
      user.texture = pathFromBgImage(user.bgImage);
      delete user.bgImage;
      user.blendMode = user.bgBlend;
      delete user.bgBlend;
      delete user.bgSize;
      delete user.bgRepeat;
    }
    user.imgKey = user.key;
    delete user.key;
    await postUserChange(user, true);
  }
  let x = await mGetRoute('users');
  console.log('users', x)
}
async function test92_showBlendModes() {
  let d = clearBodyDiv({ gap: 4 }); mFlexWrap(d);
  let tlist = await getTextures();
  let [fill, src] = [rColor(), rTexture()]; console.log(fill, src);
  //src='../assets/textures/ttranscircles.png';
  for (const blendCSS of arrMinus(getBlendModesCSS(), ['saturation', 'color'])) {
    let d1 = mDom(d);
    let bgBlend = getBlendCanvas(blendCSS)
    mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
    let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
    let palette = await getPaletteFromCanvas(ca.cv);
    //console.log(palette); 
    palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
async function test91_canvasCSSBlendModes() {
  let d = clearBodyDiv({ gap: 4 }); mFlexWrap(d);
  let tlist = await getTextures();
  let [fill, src] = [rColor(), rTexture()]; console.log(fill, src);
  //src='../assets/textures/ttranscircles.png';
  for (const blendCSS of arrMinus(getBlendModesCSS(), ['saturation', 'color'])) {
    let d1 = mDom(d);
    let bgBlend = getBlendCanvas(blendCSS)
    mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
    let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
    let palette = await getPaletteFromCanvas(ca.cv);
    //console.log(palette); 
    palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
//#endregion

//#region colors
async function test90_integrateGetMyColors1() {
  await prelims();
  let dinew = jsCopy(M.dicolor);
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [n1, n2, n3] = [dil[2], unfi[2], beau[2]];
  let [hk1, hk2, hk3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];

  let dParent = clearBodyDiv(); let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);

  //dicolor anreichern mit neuen colors aus getMyColors2
  let int1 = intersection(hk1, hk3); //hex colors 
  console.log('intersection', int1)
  let skeys = 'name hex bucket', styles = { padding: 10 };
  for (const k of int1) removeInPlace(hk3, k);
  console.log('neue colors', hk3);
  for (const k of hk3) {
    let ofi = h3[k];
    showColorBox(h3[k], skeys, d1, styles);
    let odiname = n1[ofi.name];
    if (isdef(odiname)) {
      assertion(odiname.hex != ofi.hex, "WTF!!!!!!!!!!!!!!!!!");
      console.log(odiname.hex, ofi.hex)
      showColorBox(odiname, skeys, d1, styles);
    } else {
      assertion(nundef(h1[k]), 'WTF!!!!');
      assertion(nundef(n1[ofi.name]), 'WTF name!!!');
      lookupSet(dinew, [ofi.bucket, ofi.name], k);
    }
    mLinebreak(d1)
  }

  //sortDicolor(dinew); //das macht downloadAsYaml!!!

}
async function test90_integrateGetMyColors2() {
  await prelims();
  let dinew = jsCopy(M.dicolor);
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [n1, n2, n3] = [dil[2], unfi[2], beau[2]];
  let [hk1, hk2, hk3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];

  let dParent = clearBodyDiv(); let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);

  //dicolor anreichern mit neuen colors aus getMyColors2
  let int1 = intersection(hk1, hk2); //hex colors 
  let skeys = 'name hex bucket', styles = { padding: 10 };
  for (const k of int1) removeInPlace(hk2, k);
  console.log(hk2);
  for (const k of hk2) {
    let ofi = h2[k];
    showColorBox(h2[k], skeys, d1, styles);
    let odiname = n1[ofi.name];
    if (isdef(odiname)) {
      assertion(odiname.hex != ofi.hex, "WTF!!!!!!!!!!!!!!!!!");
      console.log(odiname.hex, ofi.hex)
      showColorBox(odiname, skeys, d1, styles);
    } else {
      assertion(nundef(h1[k]), 'WTF!!!!');
      assertion(nundef(n1[ofi.name]), 'WTF name!!!');
      lookupSet(dinew, [ofi.bucket, ofi.name], k);
    }
    mLinebreak(d1)
  }

  //sortDicolor(dinew); //das macht downloadAsYaml!!!

}
async function test89_colorlists() {
  await prelims();
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [n1, n2, n3] = [dil[2], unfi[2], beau[2]];

  //name overlappings: nur 1-2
  let [k1, k2, k3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  console.log('1-2', intersection(k1, k2));
  console.log('1-3', intersection(k1, k3));
  console.log('2-3', intersection(k2, k3));

  //hex overlappings: nur 1-2
  let [nk1, nk2, nk3] = [Object.keys(n1), Object.keys(n2), Object.keys(n3)];
  console.log('1-2', intersection(nk1, nk2));
  console.log('1-3', intersection(nk1, nk3));
  console.log('2-3', intersection(nk2, nk3));

  let dParent = clearBodyDiv();
  //let styles = { wmin: 250, padding: 20 };
  for (const list of [l1, l2, l3]) {
    console.log('list', list.length)
    showColorBoxes(list, 'name', dParent, { padding: 10 });
    mLinebreak(dParent)
  }
}
async function test88_colorlists() {
  await prelims();
  let dil = getListAndDictsForDicolors();
  let unfi = getListAndDicts(getMyColors2(), 'hex', 'name');
  let beau = getListAndDicts(getMyColors1(), 'hex', 'name');
  let [l1, l2, l3] = [dil[0], unfi[0], beau[0]];
  let [h1, h2, h3] = [dil[1], unfi[1], beau[1]];
  let [k1, k2, k3] = [Object.keys(h1), Object.keys(h2), Object.keys(h3)];
  console.log('1-2', intersection(k1, k2));
  console.log('1-3', intersection(k1, k3));
  console.log('2-3', intersection(k2, k3));
  let dParent = clearBodyDiv();
  //let styles = { wmin: 250, padding: 20 };
  for (const list of [l1, l2, l3]) {
    console.log('list', list.length)
    showColorBoxes(list, 'name', dParent, { padding: 10 });
    mLinebreak(dParent)
  }
}
async function test87_colorPairs() {
  await prelims();

  let dil = getListAndDictsForDicolors();
  let byhex = dil[1]
  let unfiltered = getBeautifulColors();
  let fullColorlist = unfiltered.filter(x => x.sat * 100 >= 50);
  let byhexbeau = list2dict(fullColorlist, 'hex');
  let inBeiden = [], nurInBeautiful = [];

  let nurInUnfitered = [];
  let unfiltDicolors = [];

  for (const c of unfiltered) {
    if (isdef(byhexbeau[c.hex])) {
      if (isdef(byhex[c.hex])) {
        inBeiden.push(byhex[c.hex]);
      } else nurInBeautiful.push(c);
    } else {
      if (isdef(byhex[c.hex])) {
        unfiltDicolors.push(byhex[c.hex]);
      } else nurInUnfitered.push(c);
    }
  }
  console.log('unfiltDicolors', unfiltDicolors.map(x => x.hex));
  console.log('nurInUnfitered', nurInUnfitered.map(x => x.hex));
  return;

  console.log('inBeiden', inBeiden);
  console.log('nurInBeautiful', nurInBeautiful);

  let nurInDicolor = [];
  for (const k in byhex) if (nundef(byhexbeau[k])) nurInDicolor.push(byhex[k]);

  console.log('nurInDicolor', nurInDicolor);

  let dParent = clearBodyDiv();
  let d1 = mDom(dParent, { gap: 12, padding: 12 }); mFlexWrap(d1);

  for (const c of inBeiden) showColorBox(d1, c);

  let colorlist = getMyColors1(); console.log('colors', colorlist);

  let items = [];
  for (var c of colorlist) {
    let item = showColorBox(d1, c); items.push(item);
    items.push(item);
    let c1 = byname[c.name];
    let c2name = replaceAll(c.name, '_', ''); console.log(c2name);
    let c2 = byname[c2name];
    if (isdef(c1)) showColorBox(d1, c1);
    if (c2name != c.name && isdef(c2)) showColorBox(d1, c2);
    mLinebreak(d1)
  }
}
async function test86_andereColors() {
  let colors = getMyColors1(); console.log('colors', colors)
  let d = clearBodyDiv();
  let items = showPaletteNames(d, colors)
  items.map(x => mDom(iDiv(x), {}, { html: x.bucket }));
}
async function test85_superColors() {
  await prelims();
  let listw3 = getBeautifulColors();
  let listDicolor = [];
  let bucketlist = 'yellow orangeyellow orange orangered red magentapink magenta bluemagenta blue cyanblue cyan greencyan green yellowgreen'.split(' ');
  bucketlist = arrCycle(bucketlist, 8);
  for (const bucket of bucketlist) {
    let list = dict2list(M.dicolor[bucket]);
    for (const c of list) {
      let o = w3color(c.value);
      o.name = c.id;
      o.hex = c.value;
      o.bucket = bucket;
      listDicolor.push(o);
    }
  }

  console.log('beautiful', listw3[0]);
  console.log('bucket', listDicolor[0]);
  let byhex = list2dict(listDicolor, 'hex');
  let byname = list2dict(listDicolor, 'name');

  let extra = [];
  for (const c of listw3) {
    if (nundef(byhex[c.hex])) {
      console.log(`${c.hex} NOT in dicolor!`);
      extra.push(c.hex);
    }

  }

  downloadAsYaml(extra, 'extra');



  console.log('die beiden listen muessen gejoined werden irgendwie!')

}
//#endregion

//#region canvas blend modes
async function test84_canvasCSSBlendModes() {
  let d = clearBodyDiv({ gap: 4 }); mFlexWrap(d);
  let tlist = await getTextures();
  let [fill, src] = [rColor(), rTexture()]; console.log(fill, src);
  //src='../assets/textures/ttranscircles.png';
  for (const blendCSS of arrMinus(getBlendModesCSS(), ['saturation', 'color'])) {
    let d1 = mDom(d);
    let bgBlend = getBlendCanvas(blendCSS)
    mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
    let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
    let palette = await getPaletteFromCanvas(ca.cv);
    console.log(palette); palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
async function test83_canvasAllBlendModes() {
  let d = clearBodyDiv({ gap: 4 }); mFlexWrap(d);
  let tlist = await getTextures();
  let [fill, src] = [rColor(), rTexture()]; console.log(fill, src);
  //src='../assets/textures/ttranscircles.png';
  for (const bgBlend of getBlendModesCanvas()) {
    let d1 = mDom(d);
    mDom(d1, {}, { html: `${bgBlend}<br>${src}<br>` });
    let ca = await getCanvasCtx(d1, { w: 300, h: 200, fill, bgBlend }, { src });
    let palette = await getPaletteFromCanvas(ca.cv);
    console.log(palette); palette.unshift(fill); palette.splice(8);
    showPaletteMini(d1, palette);
  }
}
async function test82_canvas() {
  let d = clearBodyDiv();
  let tlist = await getTextures();
  // let ca = await getCanvasCtx(d,{w:400,h:300,fill:'blue',bgBlend:'multiply'},{src:tlist[0]});
  let [fill, bgBlend, src] = [rColor(), rBlendCanvas(), rTexture()];
  console.log(fill, bgBlend, src)
  let ca = await getCanvasCtx(d, { w: 400, h: 300, fill, bgBlend }, { src });
  let palette = await getPaletteFromCanvas(ca.cv);
  console.log(palette);
  showPaletteMini(d, palette);

  // let items = showPaletteText(d,getBlendModesCanvas());
  // items.map(x=>iDiv(x).onclick=()=>{modifyCanvasBlendMode(x.text)});
}
async function test81_canvas() {
  await prelims();
  let list = M.textures;
  let d = clearBodyDiv({ bg: 'white', h: '100vh' });
  let canvas = mDom(d, { w: 300, h: 200 }, { tag: 'canvas' });
  let ctx = canvas.getContext('2d');

  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let t = list[0];
  let img = await imgAsync(null, { w: canvas.width, h: canvas.height }, { src: t });

  ctx.globalCompositeOperation = 'multiply';

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);



  return;


}
//#endregion

async function test80() {
  await prelims();

}

async function prelims() {

  ColorThiefObject = new ColorThief();//console.log(ColorThiefObject);
  let t1 = performance.now();
  Serverdata = await mGetRoute('session'); //session ist: users,config,events
  let t2 = performance.now();
  await loadAssets();
  let t4 = performance.now();
  sockInit();
  UI.dTitle = mBy('dTitle');
  let t5 = performance.now();
  window.onkeydown = keyDownHandler;
  window.onkeyup = keyUpHandler;
  DA.funcs = { setgame: setgame(), fishgame: fishgame(), button96: button96() }; //implemented games!
  for (const gname in Serverdata.config.games) {
    if (isdef(DA.funcs[gname])) continue;
    DA.funcs[gname] = defaultGameFunc();
  }

  let html = `
    <div style="position:fixed;width:100%;z-index:20000">
      <div id="dNav" class="nav p10"></div>
      <div id="dMessage" style='height:0px;padding-left:10px' class="transh"></div>
    </div>
    <div id="dBuffer" style="height:32px;width:100%"></div>
    <div id="dExtra" class="p10hide nav"></div>
    <div id="dTitle"></div>
    <div id="dPage" style="display:grid;grid-template-columns: auto 1fr auto;">
      <div id="dLeft" class="h100 over0 translow nav">
      </div>
      <div id="dMain"></div>
      <div id="dRight" class="h100 over0 translow"></div>
    </div>
    <d id="dBottom"></d>
    
    `;
  document.body.innerHTML = html;
  UI.nav = showNavbar();
  staticTitle();
  UI.user = mCommand(UI.nav.r, 'user'); iDiv(UI.user).classList.add('activeLink');
  await switchToUser(localStorage.getItem('username'), localStorage.getItem('menu'));
}
function defaultGameFunc() {
  function setup(table) { let fen = { players: table.players, turn: [table.owner] }; delete table.players; }
  function present(dParent, table) { mClear('dMain'); } //showMessage(`BINGO!!! ${table.friendly} view ${name}: NOT IMPLEMENTED!!!!!`,1000); } 
  async function activate(table) { console.log('activate for', getUname()) }
  function checkGameover(table) { return false; }
  async function hybridMove(table) { console.log('hybrid moves for', getUname()) }
  async function botMove(table) { console.log('robot moves for', getUname()) }
  async function stepComplete(table, o) { console.log(`integrate if step complete for ${table.friendly}`); }
  return { setup, activate, checkGameover, present, hybridMove, botMove, stepComplete };
}

async function updateExtra() {
  mClear('dExtra');
  let d = mDom('dExtra');
  mStyle(d, { display: 'flex', justify: 'space-between' });
  let [left, right] = [mDom(d, { hpadding: 10 }, { id: 'dExtraLeft' }), mDom(d, {}, { id: 'dExtraRight' })];
  if (TESTING) await updateTestButtonsLogin();
}
async function updateTestButtonsLogin(names) {
  if (nundef(names)) names = ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
  let d = mBy('dExtraRight'); mClear(d);
  let me = getUname();
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, async () => await switchToUser(name), d, { maright: 4, hpadding: 3, wmin: 50, className: 'button' });
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }
}
async function updateTestButtonsPlayers(table) {
  if (nundef(table)) table = T;
  assertion(table, "NOT TABLE IN updateTestButtonsPlayers")
  let d = mBy('dExtraRight'); mClear(d); //mFlexWrap(d);
  let me = getUname();
  let names = T.playerNames; //addIf(names,'mimi');
  //addIf(names,me);
  let dplayers = mDom(d);
  for (const name of names) {
    let idname = getButtonCaptionName(name);
    let b = UI[idname] = mButton(name, async () => await switchToUser(name), dplayers, { maright: 4, hpadding: 3, wmin: 50, className: 'button' });
    if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
  }

  if (!table.playerNames.includes(me)) return;
  let dbotswitch = mDom(d, { align: 'right', patop: 10, gap: 6 }, { html: 'BOT' }); mFlexLine(dbotswitch, 'end')
  let oSwitch = mSwitch(dbotswitch, {}, { id: 'bot', val: amIHuman(table) ? '' : 'checked' });
  let inp = oSwitch.inp;
  oSwitch.inp.onchange = onchangeBotSwitch;


}

//wegwerf!!!
function correctPastelRed() {
  //doppelt: pastel_red
  let di = jsCopy(M.dicolor);
  di.red.pastel_red = '#ff6961';
}
function correctDarkLavender() {
  //doppelt: dark_lavender
  console.log('lilac', n1.darklilac, n1.dark_lilac)
  let di = jsCopy(M.dicolor);
  delete di.blue.dark_blue_gray;
  di.bluemagenta.dark_lavender = n2.dark_lavender.hex;
  di.bluemagenta.dark_lilac = n1.dark_lavender.hex;

  downloadAsYaml(di, 'dicolor')

  // //let styles = { wmin: 250, padding: 20 };
  // for (const list of [l1, l2, l3]) {
  //   console.log('list',list.length)
  //   showColorBoxes(list, 'name', dParent, { padding: 10 });
  //   mLinebreak(dParent)
  // }

}
function showHexDuplicates(int1, skeys, d1, styles, h1, h2, n1) {
  for (const k of int1) {
    //console.log('k',k, jsCopy(h1[k]), jsCopy(h2[k]))
    let odi = h1[k];
    let ofi = h2[k];
    showColorBox(odi, skeys, d1, styles)
    showColorBox(ofi, skeys, d1, styles)

    //console.log('=',k, jsCopy(h1[k]), jsCopy(h2[k]))
    let name = ofi.name;
    let odiname = n1[name];
    if (isdef(odiname) && odiname.hex != odi.hex) {
      console.log(odiname.hex, odi.hex)
      showColorBox(odiname, skeys, d1, styles);
      showColorBox(n1.lilac, skeys, d1, styles);
    }

    mLinebreak(d1)
    //console.log(odi,ofi);
  }

}
