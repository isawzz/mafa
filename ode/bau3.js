

function wsGenerateCardInfo(key) {
  let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
  let palette = wsGetColorRainbow(); //['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = rChoose(palette);
  sym = getAbstractSymbol([2, 8, 10, 23, 26]);
  power = wsGetPower();
  valueFactor = rChoose(range(1, 3));
	op=rChoose(['+','/']); //console.log('op',op)
	return wsFenFromItem({key,valueFactor,power,colorPower:bg,abstract:sym,colorSym:fg,op});
}
function wsGetColorRainbow(){return ['gold', 'limegreen', 'orangered', 'dodgerblue', 'indigo', 'hotpink'];}
function wsGetColorRainbowText(color){return {gold:'gold',limegreen:'green',orangered:'red',hotpink:'pink',indigo:'violet',dodgerblue:'blue'}[color];}
function wsItemFromFen(fen){

  let [key, valueFactor, power, colorPower, sym, colorSym, op] = fen.split('@');

  let o = getDetailedSuperdi(key);
  let item = jsCopy(o);
  let bg = item.colorPower = colorPower; //valf(colorPower, rChoose(['white', 'sienna', 'pink', 'lightblue']));
  let palette = wsGetColorRainbow(); //['gold', 'limegreen', 'orangered', 'dodgerblue', 'indigo', 'hotpink']; //if (bg != 'white') palette.push(bg);
  let fg = item.colorSym = colorSym; //valf(colorSym, rChoose(palette)); //console.log(palette)
  sym = item.abstract = sym; //valf(sym, getAbstractSymbol([2, 4, 8, 23, 26]));
  item.power = power;
  valueFactor = item.valueFactor = valueFactor; //valf(valueFactor, rChoose(range(1, 3)));
	item.op = op;
	item.value = valueFactor * (item.op == '+' ? 1 : item.foodTokens.length);

	return item;
}
function wsShowCardItem(item,d,fa){
  let [w, h, sztop, sz, gap, fz] = [340, 500, 100, 30, 8, 16].map(x => x * fa);
  item.fz=fz;

	let [card, dCard] = wsCard(d, w, h);
  let dtop = wsTopLeft(dCard, sztop, card.rounding);//mStyle(dtop,{h:200})
  addKeys(card, item);

	let [bg,fg]=[item.colorPower,item.colorSym];

	wsHabitat(item.habTokens, dtop, sz * 1.1); mLinebreak(dtop, sz / 5);
  wsFood(item.foodTokens, item.op, dtop, sz * .8);
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
  let a = showim2(item.abstract, dleft, { w: szSym, h: szSym, fg });
  mLinebreak(dleft, 3 * gap)
  let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, item.ooffsprings.num, gap * 2); //szPlatz);

	item.dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true }, { html: item.power })

  let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
  mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
  mDom(dinfo, {}, { html: item.class });
  mDom(dinfo, {}, { html: item.olifespan.text });
  mDom(dinfo, {}, { html: item.osize.text });

	return item;
}

