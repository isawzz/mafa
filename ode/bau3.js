
function wsFromCardInfo(s, d, sz) {
  let [key, valueFactor, power, colorPower, sym, colorSym,op] = s.split('@');
  power = wsFromNormalized(power); //console.log('power',power)
  power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');
  return wsShowCard(key, d, sz, Number(valueFactor), power, colorPower, sym, colorSym,op);
}
function wsShowCard(key, d, fa, valueFactor, power, colorPower, sym, colorSym,op) {
  let o = getDetailedSuperdi(key);
  let item = jsCopy(o);
  let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

  let [card, dCard] = wsCard(d, w, h);
  let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
  addKeys(card, item);

  let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
  sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
  power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
  valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
  let value = item.value = valueFactor * (item.op=='+'?1:o.foodTokens.length);

  //o.habTokens.push('wetland');
  wsHabitat(o.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
  wsFood(o.foodTokens, op, dtop, sz * .8);
  wsTitle(o, dCard, sztop, fz, gap);

  let [szPic, yPic] = [h / 2, sztop + gap]
  let d1 = showim2(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
  mPlace(d1, 'tr', gap, yPic);

  let leftBorderOfPic = w - (szPic + gap);
  let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
  mCenterCenterFlex(dleft);

  let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: value });
  // mPlace(dval, 'tl', sztop/2-gap,sztop+gap); //(w-szPic)/2-3*gap, sztop+gap); //mPlace(dval, 'tr', 2 * gap, gap)
  mLinebreak(dleft, 2 * gap)

  let szSym = sz * 1.5;
  let a = showim2(sym, dleft, { w: szSym, h: szSym, fg });
  // mPlace(a,'tl',sztop/2-gap,sztop*2)
  mLinebreak(dleft, 3 * gap)

  //let szPlatz = h / 30; //o.ooffsprings.num =1;
  let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, o.ooffsprings.num, gap * 2); //szPlatz);
  //mPlace(dPlaetze, 'cl', (w - szPic) / 2 - 3 * gap, 5 * gap); //2*gap,gap); //(w - szPic) / 2,0);//, sztop*2); // + szPlatz);

  let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: power })
  item.power = dbrown.innerHTML;

  let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
  mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
  mDom(dinfo, {}, { html: o.class });
  mDom(dinfo, {}, { html: o.olifespan.text });
  mDom(dinfo, {}, { html: o.osize.text });
  // let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: `${o.class.toLowerCase()} ${o.olifespan.text}` })
  // mPlace(dlifespan, 'bl', gap);

  // let dsize = mDom(dCard, { fz, display: 'inline' }, { html: o.osize.text })
  // mPlace(dsize, 'br', gap);

  // let dclass = mDom(dCard, { fz, display: 'inline' }, { html: o.class });
  // mPlace(dsize, 'br', gap);

  return item;

}

function wsGenerateCardInfo(key) {
  let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = rChoose(palette);
  sym = getAbstractSymbol([2, 4, 8, 23, 26]);
  power = wsGetPower();
  valueFactor = rChoose(range(1, 3));
	op=rChoose(['+','/']); console.log('op',op)
	return wsFenFromItem({key,valueFactor,power,colorPower:bg,abstract:sym,colorSym:fg,op});
}

function wsItemFromFen(fen){

  let [key, valueFactor, power, colorPower, sym, colorSym, op] = fen.split('@');

  let o = getDetailedSuperdi(key);
  let item = jsCopy(o);
  let bg = item.colorPower = colorPower; //valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = item.colorSym = colorSym; //valf(colorSym, rChoose(palette)); //console.log(palette)
  sym = item.abstract = sym; //valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
  item.power = power;
  valueFactor = item.valueFactor = valueFactor; //valf(valueFactor, rChoose(range(1, 3)));
	item.op = op;
	item.value = valueFactor * (item.op == '+' ? 1 : item.foodTokens.length);

	return item;
}
function wsGenerateCardInfo_0(key) {
  let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = rChoose(palette);
  sym = getAbstractSymbol([2, 4, 8, 23, 26]);
  power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
  valueFactor = rChoose(range(1, 3));
	op=rChoose(['+','/']); console.log('op',op)
	return wsFenFromItem({key,valueFactor,power,colorPower:bg,abstract:sym,colorSym:fg,op});
}
function wsItemFromFen_0(fen){

  let [key, valueFactor, power, colorPower, sym, colorSym,op] = fen.split('@');
  power = wsFromNormalized(power); //console.log('power',power)
  power = stringBefore(power, ':').toUpperCase() + ':' + stringAfter(power, ':');

  let o = getDetailedSuperdi(key);
  let item = jsCopy(o);
  let bg = item.colorPower = valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
  let palette = ['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = item.colorSym = valf(colorSym, rChoose(palette)); //console.log(palette)
  sym = item.abstract = valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
  item.power = valf(power, 'WHEN ACTIVATED: All players gain 1 food from supply.');
  valueFactor = item.valueFactor = valf(valueFactor, rChoose(range(1, 3)));
  let value = item.value = valueFactor * (item.op=='+'?1:o.foodTokens.length);

	return item;
}
function wsShowCardItem(item,d,fa){
  let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);

	let [card, dCard] = wsCard(d, w, h);
  let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
  addKeys(card, item);

	let [bg,fg]=[item.colorPower,item.colorSym];

	wsHabitat(item.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
  wsFood(item.foodTokens, op, dtop, sz * .8);
  wsTitle(item, dCard, sztop, fz, gap);

	let [szPic, yPic] = [h / 2, sztop + gap]
  let d1 = showim2(item.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
  mPlace(d1, 'tr', gap, yPic);

	let leftBorderOfPic = w - (szPic + gap);
  let dleft = mDom(dCard, { w: leftBorderOfPic, h: szPic }); mPlace(dleft, 'tl', gap / 2, sztop + gap);
  mCenterCenterFlex(dleft);

	let dval = mDom(dleft, { fg, w: sz * 1.2, align: 'center', fz: fz * 1.8, weight: 'bold' }, { html: item.value });
  mLinebreak(dleft, 2 * gap)
  let szSym = sz * 1.5;
  let a = showim2(sym, dleft, { w: szSym, h: szSym, fg });
  mLinebreak(dleft, 3 * gap)
  let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, item.ooffsprings.num, gap * 2); //szPlatz);

	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: item.power })

	return item;
}

