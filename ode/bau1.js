
function presentStandardBGA() {
	let dTable = mDom('dMain');
	mClass('dPage', 'wood');
	let [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(dTable); mFlexWrap(dOpenTable)
	mDom(dRechts, {}, { id: 'dStats' });

}
function wsGetFoodlist(){return ['cherries','fish','grain','mouse','seedling','worm']}
function wsSetup(table) {
	let fen = {};
	fen.deck = jsCopy(M.byCollection.tierspiel).map(x => wsGenerateCardInfo(x)); //rChoose(M.byCollection.tierspiel, 170); //range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
	arrShuffle(fen.deck);
	for (const name in table.players) {
		let pl = table.players[name];
		pl.score = 0;
		pl.cards = deckDeal(fen.deck, 5);
		pl.missions = [];
		pl.offsprings = 0;

		wsGetFoodlist().map(x=>pl[x]=0);
		
		pl.forest = [];
		pl.grassland = [];
		pl.wetland = [];

	}
	//fen.cards = [1, 2, 3];
	fen.round = 0;
	fen.phase = 'init';
	fen.stage = 'pick_cards';
	table.plorder = jsCopy(table.playerNames);
	table.turn = jsCopy(table.playerNames);
	return fen;
}
function wsOffspringSymbol(dParent,styles={}){
	console.log(styles)
	let [w,h]=[styles.h,styles.h];//mSizeSuccession(styles,16,false); 
	console.log(w,h)
	//styles.h=24;styles['line-height']=24;mStyle(dParent,{w:24,h:24,bg:'red'})
	let d=mDom(dParent,{w,h,box:true});//,bg:'orange'}); //w100:true,h100:true,bg:'lime'});
	let fz = styles.h;let hline=fz;
	mIfNotRelative(d);
	let o = M.superdi.big_egg;
	let [fam, sym] = isdef(o.fa6) ? ['fa6', 'fa6'] : isdef(o.fa) ? ['pictoFa', 'fa'] : ['pictoGame', 'ga'];
	//let fz=16;//:styles.sz*1.2
	let dEgg = mDom(d,{fg:'grey',family:fam,fz,padding:0,hline},{html:String.fromCharCode('0x' + o[sym])});
	o = M.superdi.paw;
	[fam, sym] = isdef(o.fa6) ? ['fa6', 'fa6'] : isdef(o.fa) ? ['pictoFa', 'fa'] : ['pictoGame', 'ga'];
	//fz= 12; //styles.sz*.8
	let dPaw = mDom(d,{w100:true,fg:'black',family:fam,fz:8,hline},{html:String.fromCharCode('0x' + o[sym])});
	mCenterFlex(dPaw)
	mPlace(dPaw,'tc')
}
function wsStats(table) {
	let [me, players] = [getUname(), table.players];
	let style = { patop: 8, mabottom: 20, bg: 'beige', fg: 'contrast' };
	let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'colflex', style)
	for (const plname in players) {
		let pl = players[plname];
		let item = player_stat_items[plname];
		if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
		let d = iDiv(item); 
		mStyle(d,{wmin:200,padding:12})
		mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);

		let d1=mDom(d);mCenterFlex(d1);
		wsGetFoodlist().map(x=>playerStatCount(wsGetSymbolFilename(x), pl[x], d1)); 
		mLinebreak(d,10);
		let d2=mDom(d);mCenterFlex(d2);

		playerStatCount('star', pl.score, d2, null, {useSymbol:true}); //, {}, {id:`stat_${plname}_score`});
		playerStatCount('hand_with_fingers_splayed', pl.cards.length, d2,null, {useSymbol:true});
		playerStatCount(wsOffspringSymbol, pl.offsprings, d2); //, {}, {id:`stat_${plname}_score`});

		

		if (table.turn.includes(plname)) { mDom(d,{ position:'absolute', left: -3, top: 0 },{html:getWaitingHtml()}); }

	}
}

function wsPresent(table) {
	presentStandardBGA();

	return;
	let fen = table.fen;
	let me = getUname();
	let pl = table.players[me];

	let d = mBy('dTable');
	d.style = '';
	d.className = '';
	mStyle(d, { hmin: 500, w: '90%', margin: 20 });
	d.innerHTML = ' '; mCenterFlex(d)

	let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
	let items = [];
	for (const fencard of pl.cards) {
		let ocard = wsItemFromFen(fencard);
		wsShowCardItem(ocard, dCards, .5);
		items.push(ocard);
	}

	mLinebreak(d, 25)
	let [w, h] = [1467, 1235].map(x => x * .67);
	let bg = U.color;
	let db = mDom(d, { w, h, bg, padding: 10, position: 'relative' });
	let da = mDom(db, { 'transform-origin': 'center', transform: 'rotate( -.3deg )', position: 'relative', w, h });
	let ibg = mDom(da, { position: 'absolute', left: 0, top: 0, w, h }, { tag: 'img', src: '../ode/wsboard1.jpg' });
	let dBoard = mDom(db, { position: 'absolute', left: -2, top: 0, w: w - 18, h: h - 12, wbox: true, border: `20px ${bg} solid` });
	let gap = 12;
	let grid = mGrid(3, 5, dBoard, { paleft: gap / 2, patop: gap, w: w - 52 }); //,position:'absolute'});

	let sym = ['food', 'child', 'card'];
	let n = [1, 1, 2, 2, 3];
	let cost = [0, 1, 1, 2, 2];
	let addon = [0, 1, 0, 1, 0];
	let list = wsGetRandomCards(15, fen.deck);
	for (const i of range(3)) {
		for (const j of range(5)) {
			let d = mDom(grid, { w: 172, h: 250, bg: rColor(), mabottom: 20 }); //,{html:'card'});
			let item = wsShowCardItem(list[i + 3 * j], d, .5)

		}
	}
	return items;
}



