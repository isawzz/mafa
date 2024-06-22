function showCardWingspanPortrait(o, d, h = 400) {
	let item = { o, key: o.key };
	let fa = h / 250;
	let w = 170 * fa;
	
	let card = cBlank(d, { h, w, border: 'silver' });
	let dCard = iDiv(card);
	addKeys(card,item);

	let [rounding, fz, gap] = [card.rounding, 8 * fa, w / 36];
	let wtop = w / 4;
	let htop=wtop*1.1;
	let dlt = mDom(dCard, { w: wtop, h: htop, bg: '#eee' }); mPlace(dlt, 'tl'); dlt.style.borderTopLeftRadius = dlt.style.borderBottomRightRadius = `${rounding}px`; mCenterCenterFlex(dlt);

	showHabitat(dlt, o.ohabitat, 16 * fa);
	mLinebreak(dlt, 4 * fa);

	//console.log(o.foodTokens); //return item;
	showFood(dlt, o.foodTokens, wtop, fz); 

	let dtitle = mDom(dCard, { paleft: gap, wmax: wtop * 1.5 }); mPlace(dtitle, 'tl', wtop, gap)
	mDom(dtitle, { fz: fz * 1.2, weight: 'bold' }, { html: fromNormalized(o.friendly) });
	mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });

	let [szPic, yPic] = [h / 2, wtop+gap]
	let d1 = showim1(o.key, dCard, { rounding: 12, w: szPic, h: szPic }, { prefer: 'photo' });
	mPlace(d1, 'tr', w / 50, yPic);

	let szPlatz = h / 30;
	let dPlaetze = item.dPlaetze = showPlaetze(dCard, o.ooffsprings.num, szPlatz);
	mPlace(dPlaetze, 'tl', (w - szPic) / 2, wtop + szPlatz);
	
	let power = 'WHEN ACTIVATED: All players gain 1 food from supply.';
	let dbrown = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: wtop + szPic + szPlatz, w100: true, bg: 'sienna', fg: 'white', box: true }, { html: power })
	item.power = dbrown.innerHTML;
	
	let lifespan = item.lifespan = calcLifespan(o.lifespan);
	let dlifespan = mDom(dCard, { fz, display: 'inline' }, { html: lifespan.lifespan })
	mPlace(dlifespan, 'bl', gap);

	let size = item.size = calcSize(o.size);
	let dsize = mDom(dCard, { fz, display: 'inline' }, { html: size.text })
	mPlace(dsize, 'br', gap);
	
	let value = item.value = rChoose(range(1, 3)) * o.foodTokens.length;
	let dval = mDom(dCard, { fz: fz * 1.8, weight: 'bold' }, { html: value }); mPlace(dval, 'tr', 2 * gap, gap)
	
	return item;
}

async function showTable(id) {
	let me = getUname();
	let table = await mGetRoute('table', { id });  //console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	let func = DA.funcs[table.game];
	T = table;
	clearMain();
	let d = mBy('dExtraLeft');
	d.innerHTML = `<h2>${getGameProp('friendly').toUpperCase()}: ${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d);
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d);
	func.stats(table);
	let minTableSize = 400;
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);
	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }
	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);
	await updateTestButtonsPlayers(table);
	func.activate(table, items);
}











