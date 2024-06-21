

function showCardWingspanPortrait(o, d, sz = 480) {
	let item = { o, key: o.key };
	let card = cBlank(d, { sz, border: 'silver' });
	let dCard = iDiv(card);
	let fa = sz / 480;
	let [rounding, h, w, fz, gap] = [card.rounding, card.h, card.w, 15 * fa, card.w/36];

	let szlt = w / 3;
	let dlt = mDom(dCard, { w: szlt, h: szlt * .9, bg: '#eee' }); mPlace(dlt, 'tl'); dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`; mCenterCenterFlex(dlt);
	showHabitat(dlt, o.ohabitat, 40 * fa);
	mLinebreak(dlt, 4 * fa);
	showFood(dlt, o.foodTokens, szlt, fz);

	let dtitle = mDom(dCard, { paleft: gap,wmax:szlt*1.5 }); mPlace(dtitle, 'tl', szlt, gap)
	mDom(dtitle, { fz: fz * 1.2, weight: 'bold' }, { html: fromNormalized(o.friendly) });
	mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });

	let [szPic, yPic] = [sz / 2, szlt]
	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', w / 50, yPic);

	let szPlatz = sz / 30; //Math.max(sz / 40, 8);
	let dPlaetze = showPlaetze(dCard, o.ooffsprings.num, szPlatz);
	mPlace(dPlaetze, 'tl', (w - szPic) / 2, szlt + szPlatz);

	let dbrown = mDom(dCard, { fz:fz*1.2, padding:gap, matop: szlt+szPic+szPlatz, w100: true, bg: 'sienna', fg: 'white', box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'bl', gap);

	let size = calcSize(o.size);// console.log('lifespan',lifespan);
	let dsize = mDom(dCard, { fz, display: 'inline' }, { html: size.text })
	mPlace(dsize, 'br', gap);

	let value = rChoose(range(1,3))*o.foodTokens.length;
	let dval=mDom(dCard,{fz:fz*1.8,weight:'bold'},{html:value}); mPlace(dval,'tr',2*gap,gap)

}

function _showCardWingspanPortrait(o, d, sz = 480) {
	let item = { o, key: o.key };
	let fa = sz / 480;
	let card = cBlank(d, { sz, border: 'silver' });
	let dCard = iDiv(card);
	let [rounding, h, w, fz] = [card.rounding, card.h, card.w, 15].map(x => x * fa);

	let hu = measureHeightOfTextStyle(dCard, { fz });
	let wu = w / 20;
	console.log('card', card, sz, h, w, rounding, hu, wu, 480 / 20);

	return;
	//habitat
	mCenterCenterFlex(dlt);

	let hcolors = o.ohabitat.colors; //console.log(hcolors)
	//let dHabitat = mDom(dlt, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dHabitat);
	//mPizza(dlt, 40*fa, ...hcolors);//mDom(dCard, {}, { html: generatePizzaSvg(50, ...hcolors) });
	mDom(dlt, { h: 40 * fa, w: 40 * fa, bg: hcolors[0], round: true })
	mLinebreak(dlt, 4 * fa);

	let df = mDom(dlt); mCenterCenterFlex(df);
	let tokens = o.foodTokens;
	let len = tokens.length;
	let ch = len < 3 && coin() ? '/' : '+';
	let [szf, szt] = [szlt / 4, szlt / 9];
	let tlist = [{ t: tokens[0], sz: szf }];
	if (len > 1) { tlist.push({ t: ch, sz: szt }); tlist.push({ t: tokens[1], sz: szf }) }
	if (len > 2) { tlist.push({ t: ch, sz: szt }); tlist.push({ t: tokens[2], sz: szf }) }
	for (const x of tlist) {
		let d = mDom(df, { w: x.sz }); //,bg:rColor()}); 
		mCenterCenterFlex(d);
		let c = x.t;
		if (c == '+') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c == '/') { d.innerHTML = c; mStyle(d, { fz }) }
		else if (c.includes('.')) {
			let img = showim1(c, d, { w: x.sz });
			if (c.includes('mouse')) mStyle(img, { matop: fz / 4 })
		} else {
			let d1 = mDom(d, { h: x.sz * .8 })
			//mPizza(d1, x.sz*.8, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue'); 
		}
	}
	// for (let i = 0; i < Math.min(3, len); i++) {

	// 	if (i == 2) { mLinebreak(dfood); mDom(dfood, { fz: hTop / 5, matop: -gap, maright: gap }, { html: '+' }); }
	// 	if (i == 1) mDom(dfood, { fz: hTop / 5, matop: gap / 2 }, { html: len > 2 || coin() ? '+' : '/&nbsp;' });
	// 	let t = tokens[i];
	// 	if (t == 'omni') {
	// 		let d = mDom(dfood, { matop: i == 2 ? -gap : 1 });
	// 		mPizza(d, hTop / 4, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue');
	// 	} else showim1(t, dfood, { sz: hTop / 2.8 });
	// }
	// let flist = o.foodlist; console.log(flist);
	// mPlace(dfood, 'tl', 0, 0);
	// console.log(o.foodtype);

	// let dfoodtype = mDom(dCard, { display: 'inline' }, { html: o.foodtype })
	// mPlace(dfoodtype, 'tl', 40, yLifespan);


}
function rest() {
	let [yTitle, yPic, szPic] = [8, sz / 5, sz / 2];
	let [yLifespan, yBrown, hTop, szPlatz] = [yPic + szPic, yPic + szPic + 22, sz * .12, Math.max(sz / 40, 8)];


	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tc', 0, yPic);

	let hcolors = o.ohabitat.colors; //console.log(hcolors)
	let dHabitat = mDom(dCard, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dHabitat);
	mPizza(dHabitat, hTop - 10, ...hcolors);//mDom(dCard, {}, { html: generatePizzaSvg(50, ...hcolors) });
	mPlace(dHabitat, 'tr', 0, 0);


	let title = fromNormalized(o.friendly);
	let dtitle = mDom(dCard, { display: 'inline', weight: 'bold' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle);

	title = o.species; //fromNormalized(o.friendly);
	dtitle = mDom(dCard, { fz: '80%', display: 'inline', 'font-style': 'italic' }, { html: title });
	mPlace(dtitle, 'tc', 0, yTitle + 24);

	let n = o.ooffsprings.num; //console.log()
	let plaetze = nundef(n) ? 2 : n == 0 ? 0 : n == 1 ? 1 : n < 8 ? 2 : n < 25 ? 3 : n < 100 ? 4 : n < 1000 ? 5 : 6;
	let dPlaetze = item.dPlaetze = mDom(dCard, { w: '60%', gap: szPlatz }); mCenterFlex(dPlaetze);
	for (const i of range(plaetze)) { mDom(dPlaetze, { round: true, w: szPlatz, h: szPlatz, border: 'silver' }); }
	mPlace(dPlaetze, 'tc', 0, yTitle + 60);

	let lifespan = calcLifespan(o.lifespan);// console.log('lifespan',lifespan);
	let dlifespan = mDom(dCard, { display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'tr', 40, yLifespan);

	let dbrown = mDom(dCard, { matop: yBrown, w100: true, bg: 'sienna', fg: 'white', padding: 10, box: true }, { html: 'WHEN ACTIVATED: All players gain 1 food from supply.' })

	let rounding = mGetStyle(dCard, 'rounding')
	let dfood = mDom(dCard, { w: hTop, h: hTop, bg: '#eee', rounding }); mCenterCenterFlex(dfood);
	let gap = hTop / 15;

	console.log(mGetStyle(dfood, 'fz'))

	let tokens = o.foodTokens;
	let len = tokens.length;
	for (let i = 0; i < Math.min(3, len); i++) {
		if (i == 2) { mLinebreak(dfood); mDom(dfood, { fz: hTop / 5, matop: -gap, maright: gap }, { html: '+' }); }
		if (i == 1) mDom(dfood, { fz: hTop / 5, matop: gap / 2 }, { html: len > 2 || coin() ? '+' : '/&nbsp;' });
		let t = tokens[i];
		if (t == 'omni') {
			let d = mDom(dfood, { matop: i == 2 ? -gap : 1 });
			mPizza(d, hTop / 4, 'red', 'green', 'yellow', 'gray', 'orange', 'skyblue');
		} else showim1(t, dfood, { sz: hTop / 2.8 });
	}
	let flist = o.foodlist; console.log(flist);
	mPlace(dfood, 'tl', 0, 0);
	console.log(o.foodtype);

	let dfoodtype = mDom(dCard, { display: 'inline' }, { html: o.foodtype })
	mPlace(dfoodtype, 'tl', 40, yLifespan);



	return item;

	//food
	//wieviel food soll das ding essen?
	let list = o.foodTokens;
	console.log(list);
	let nlist = range(list.length);
	list = arrTake(list, 3);
	let plusor = nlist > 2 ? '+' : nlist == 2 ? coin() ? '+' : '/' : coin() ? '+' : '';

	showim1(difood[foodtype], dfood, { sz: 30 });





}









