


//TODO
function fishgame() {

	function setup(table) {
		let fen = {};
		fen.deck = jsCopy(M.byCollection.tierspiel).map(x=>wsGenerateCardInfo(x)); //rChoose(M.byCollection.tierspiel, 170); //range(4, table.options.numCards); //[4, 5, 6, 7, 8, 9, 10];
		arrShuffle(fen.deck);
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
			pl.cards = deckDeal(fen.deck, 5);
		}
		//fen.cards = [1, 2, 3];
		fen.round=0;
		fen.phase='init';
		fen.stage='pick_cards';
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function stats(table) {
		mClear('dRight');
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dRight', 'colflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	function present(table) {
		let fen = table.fen;
		let d = mBy('dTable');
		d.style = '';
		d.className = '';

		mStyle(d, { hmin: 500, w: '90%', margin: 20 }); 
		d.innerHTML = ' '; mCenterFlex(d)

		let me = getUname();
		let pl = table.players[me];

		let dCards = mDom(d, { gap: 8 }); mCenterFlex(dCards);
		let items = []; //console.log(pl.cards)
		for (const fencard of pl.cards) { 
			//console.log(cinfo)
			let ocard = wsItemFromFen(fencard); //console.log(fencard,ocard) 
			wsShowCardItem(ocard,dCards,.5);
			// let o = getDetailedSuperdi(key); 
			// let ocard = showCardWingspanPortrait(o,dCards,250);
			items.push(ocard);
		}

		mLinebreak(d,25)
		let [w,h]=[1467,1235].map(x=>x*.67);
		let db=mDom(d,{w,h,bg:'green',padding:10,position:'relative'});
		let da=mDom(db,{transform:'rotate( -.5deg )',position:'relative',w,h});
		let ibg=mDom(da,{position:'absolute',left:0,top:0,w,h},{tag:'img',src:'../ode/wsboard1.jpg'});

		let dBoard=mDom(db,{position:'absolute',left:-2,top:0,w:w-15,h:h-12,wbox:true,border:'20px green solid'});

		//let db=mDom(d,{wbox:true,border:'30px inset green',outline: 'solid 25px green','outline-offset': -20,w,h});
		//let dBoard = mDom(db,{w,h,transform:'rotate( -.5deg )',bgSize:'cover',bgImage:`url('../ode/wsboard1.jpg')`}); //position:'relative'});
		//mDom(dBoard,{},{tag:'img',src:'../ode/wslandscape.png'});
		let gap=11;
		let grid=mGrid(3,5,dBoard,{padding:gap,w:w-52}); //,position:'absolute'});
		let sym=['food','child','card'];
		let n=[1,1,2,2,3];
		let cost=[0,1,1,2,2];
		let addon=[0,1,0,1,0]
		for(const i of range(3)){
			for(const j of range(5)){
				let d=mDom(grid,{w:170,h:250,bg:rColor(),mabottom:20},{html:'card'});

			}
		}



		return items;
	}
	
	async function activate(table, items) {

		await instructionStandard(table,'may pick your initial cards'); //browser tab and instruction if any

		for(const item of items){
			let d=iDiv(item);
			d.onclick = wsOnclickCard;
			//console.log(item)
		}

		//dBoard.

		return;

		if (!isMyTurn(table)) { return; } //console.log('table.turn',table.turn); 

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//check end condition
		if (isEmpty(table.fen.cards)) return gameoverScore(table);

		//bot move activation: in solo mode OR if user is a bot
		if (amIHuman(table) && table.options.gamemode == 'multi') return;

		let name = amIHuman(table) && table.options.gamemode == 'solo' ? someOtherPlayerName(table) : getUname();
		if (nundef(name)) return; //console.log('bot name',name)

		await botMove(name, table, items);
	}
	async function botMove(name, table, items) {
		let ms = rChoose(range(2000, 5000));

		TO.bot = setTimeout(async () => {
			let item = rChoose(items);
			toggleItemSelection(item);
			TO.bot1 = setTimeout(async () => await evalMove(name, table, item.key), 500);

		}, rNumber(ms, ms + 2000));

	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		try { await mSleep(200); } catch (err) { return; }
		await evalMove(getUname(), table, item.key);
	}
	async function evalMove(name, table, key) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let step = table.step;

		let best = arrMinMax(table.fen.cards).min;
		let succeed = key == best;
		if (succeed) {
			table.players[name].score += 1;

			//calc how to replace cards from set
			let fen = table.fen;
			let newCards = deckDeal(fen.deck, 1);
			if (newCards.length > 0) arrReplace1(fen.cards, key, newCards[0]); else removeInPlace(fen.cards, key);
		} else {
			table.players[name].score -= 1;
		}
		lookupAddToList(table, ['moves'], { step, name, move: key, change: succeed ? '+1' : '-1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (succeed) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o);
	}
	return { setup, present, stats, activate };

}

async function wsOnclickCard(table,item,items){}
async function wsPreAction(table,items){

	let [fen,me] = [table.fen,getUname()]
	let [phase,stage,round,pl,plorder,turn]=[fen.phase,fen.stage,fen.round,table.players[me],table.plorder,table.turn];

	console.log()
}


//#region ws cards
function wsCard(d, w, h) {
  let card = cBlank(d, { h, w, border: 'silver' }); //return;
  let dCard = iDiv(card);
  return [card, dCard];
}
function wsFenFromItem(item) {
	//console.log('___item',item);
  return `${item.key}@${item.valueFactor}@${normalizeString(item.power, '_', [':', '.'])}@${item.colorPower}@${item.abstract}@${item.colorSym}@${item.op}`;
}
function wsFood(tokens, op, dtop, sz) {

  let d = mDom(dtop); mCenterCenterFlex(d);
  let ch = op; //tokens.length >= 2 && coin() ? '/' : '+';
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    let d1 = wsPrintSymbol(d, sz, t);
    if (i < tokens.length-1) mDom(d, { fz: sz * .7,weight:'bold' }, { html: ch });
  }
}
function wsFromNormalized(s, sep = '_') {
  let x = replaceAll(s, sep, ' '); return x;
}
function wsHabitat(tokens, dtop, sz) {
  for (let i = 0; i < tokens.length; i++) {
    let t = tokens[i];
    if (i == 2) mLinebreak(dtop);
    let d = wsPrintSymbol(dtop, sz, t);
    if (i == 2) mStyle(d, { matop: -sz * 3 / 2 });
  }
}
function wsTitle(o, dCard, sztop, fz, gap) {
  let dtitle = mDom(dCard, { paleft: gap, wmax: sztop * 1.5 }); mPlace(dtitle, 'tl', sztop, gap)
  mDom(dtitle, { fz: fz * 1.1, weight: 'bold' }, { html: fromNormalized(o.friendly) });
  mDom(dtitle, { fz, 'font-style': 'italic' }, { html: o.species });
}
function wsTopLeft(dCard, sztop, rounding) {
  let dtop = mDom(dCard, { w: sztop, h: sztop, bg: '#ccc' });
  mPlace(dtop, 'tl');
  dtop.style.borderTopLeftRadius = dtop.style.borderBottomRightRadius = `${rounding}px`;
  mCenterCenterFlex(dtop);
  return dtop;
}
function wsPowerText(item, d, styles = {}) {
	mClear(d)
	let key = item.power; if (key.startsWith('_')) key = 'sienna' + key;
	//let list=wsGetPower(key);

	//let powerColors = ['sienna','pink','white','lightblue'];

	//da muessern jetzt die symbols eingefuegt werden!!!!
	let parts = key.split('_'); //console.log(parts)
	let s = '';
	let color = parts[0];
	if (color == 'sienna') s += 'WHEN ACTIVATED: ';
	else if (color == 'pink') s += 'ONCE BETWEEN TURNS: ';
	else if (color == 'white') s += 'WHEN PLAYED: ';
	else if (color == 'lightblue') s += 'ROUND END: ';

	copyKeys({ bg: color }, styles); mStyle(d, { bg: color, fg: 'contrast' });

	let what = parts[1];
	let verb = '';
	let n = Number(parts[2]);

	if (color == 'sienna') {
		if (what == 'child') {
			verb = 'place';
			s += `${capitalize(verb)} ${n} ${pluralOf('child', n)} on any`;
			let prop = parts[3];
			switch (prop) {
				case 'color':
					s += ` ${n == 1 ? 'card' : '2 cards'} with color <span style="border-radius:${item.fz}px;padding-left:${item.fz / 2}px;padding-right:${item.fz / 2}px;background-color:white;color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
				case 'class':
					s += ` ${item.class}.`; break;
				case 'sym':
				default:
					s += ` ${n == 1 ? 'card' : '2 cards'} with symbol ${wsGetSymbolInline(item.abstract, item.fz)}.`;
			}
			if (n == 2) s += ` Other players may place 1 ${what}.`
		} else if (what == 'draw') {
			verb = 'draw';
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf(what, n)}`;
			let prop = parts[4];
			switch (prop) {
				case 'tray':
				case 'deck': s += ` from ${prop}.`; break;
				case 'return': s += `, return 1 at the end of action.`; break;
				case '1': s += ` Other players may draw 1.`; break;
				default: s += '.'; break;
			}
		} else if (what == 'tuck') {
			verb = what;
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf('card', n)}`;
			let prop = parts[3];
			switch (prop) {
				case 'pick': s += ` to ${prop} 1 food from ${parts[4]}.`; break;
				case 'draw': s += ` to ${prop} 1 card from ${parts[4]}.`; break;
				case 'place': s += ` to ${prop} 1 child on any card.`; break;
				default:
			}
		} else if (what == 'food') {
			verb = 'pick';
			s += `${capitalize(verb)} ${n} ${what} from ${parts[3]}.`;
			if (n == 2) s += ` Other players ${verb} 1 ${what}.`
		} else if (what == 'all') {
			s += `All players ${parts[2]} ${parts[3]} ${what}.`;
		} else if (what == 'discard') {
			let n1 = Number(parts[5])
			s += `You may ${what} ${n} ${parts[3]} to ${parts[4]}`;
			if (parts.length > 5) {
				let n1 = Number(parts[5]);
				s += ` ${n1} ${pluralOf(parts[6], n1)}`;
				s += parts.length > 7 ? ` from ${parts[7]}.` : '.';
			} else s += '.';
		} else if (what == 'repeat') {
			s += `Repeat another brown power on this habitat.`;
		} else if (what == 'hunt') {
			let verb = what; what = parts[2];
			if (what == 'food') {
				s += `Roll dice in feeder. If there is a ${parts[3]}, keep it.`;
			} else if (what == 'card') {
				s += `Draw a card. `;
				switch(parts[3]){
					case 'sym':
					default: s+=`If it has symbol ${wsGetSymbolInline(item.abstract, item.fz)}, tuck it.`; break;
				}
				
			}
		}
	}

	if (color == 'pink') {
		let [verb1, what1, verb2, n, what2, from] = parts.slice(1);
		s += `When another player ${verb1}s ${what1}, ${verb2} ${n} ${what2}`;
		s += isdef(from) ? ` from ${from}.` : '.';
	}

	if (color == 'white') {
		if (what == 'draw') {
			verb = 'draw';
			what = parts[3];
			s += `${capitalize(verb)} ${n} ${pluralOf(what, n)}`;
			let prop = parts[4]; //console.log(parts[4])
			switch (prop) {
				case 'tray':
				case 'deck': s += ` from ${prop}.`; break;
				case 'return': s += `, return 1`; s += what == 'card'? ` at the end of action.`:'.'; break;
				case '1': s += ` Other players may draw 1.`; break;
				default: s += '.'; break;
			}
		} else if (what == 'collect'){
			s+= `Collect all ${parts[2]} from feeder.`
		}else if (what == 'child'){
			s+=`Place 1 child on each of your cards with `;
			what=parts[2];
			switch(what){
				case 'sym': s+=`symbol ${wsGetSymbolInline(item.abstract, item.fz)}.`; break;
				case 'class': s+=`class ${item.class}.`; break;
				case 'color': s+=`color <span style="color:${colorFrom(item.colorSym)}">${wsGetColorRainbowText(item.colorSym)}</span>.`; break;
			}
		}
	}

	if (color == 'lightblue'){
		if (what == 'feeder') s+=`Collect all food in feeder.`
		else if (what == 'tray') s+=`Collect a card from tray.`
	}

	s=replaceAll(s,'child',wsGetChildInline(item));
	d.innerHTML = s;
	return d;

}
function wsGenerateCardInfo(key) {
  let bg = rChoose(['white', 'sienna', 'pink', 'lightblue']);
  let palette = wsGetColorRainbow(); //['gold', 'limegreen', 'orangered', 'dodgerblue']; if (bg != 'white') palette.push(bg);
  let fg = rChoose(palette);
  sym = getAbstractSymbol([2, 8, 10, 23, 26]);
  power = wsGetPower(bg); //console.log(power)
  valueFactor = rChoose(range(1, 3));
	op=rChoose(['+','/']); //console.log('op',op)
  //console.log(bg)
	return wsFenFromItem({key,valueFactor,power,colorPower:bg,abstract:sym,colorSym:fg,op});
}
function wsGetColorRainbow(){return ['gold', 'limegreen', 'orangered', 'dodgerblue', 'indigo', 'hotpink'];}
function wsGetColorRainbowText(color){return {gold:'gold',limegreen:'green',orangered:'red',hotpink:'pink',indigo:'violet',dodgerblue:'blue'}[color];}
function wsItemFromFen(fen){

  let [key, valueFactor, power, colorPower, sym, colorSym, op] = fen.split('@');

  let o = getDetailedSuperdi(key);
  let item = jsCopy(o);
  //console.log(key,item,fen)
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
  let dPlaetze = item.live.dPlaetze = showPlaetze(dleft, item, gap * 2); //szPlatz);

	item.dpower = mDom(dCard, { fz: fz * 1.2, padding: gap, matop: sztop + szPic + gap * 3, w100: true, bg, fg: 'contrast', box: true });
  wsPowerText(item,item.dpower,{fz:item.fz})

  let dinfo = mDom(dCard, { fz, hpadding: gap, box: true, w100: true });
  mPlace(dinfo, 'bl'); mFlexLine(dinfo, 'space-between');
  mDom(dinfo, {}, { html: item.class });
  mDom(dinfo, {}, { html: item.olifespan.text });
  mDom(dinfo, {}, { html: item.osize.text });

	return item;
}
function wsGetPower(colorOrKey,prop){

	let powers={
		_child_1_sym:[],
		_child_2_sym:[],
		_child_1_class:[],
		_child_2_class:[],
		_child_1_color:[],
		_child_2_color:[],
		_draw_1_card_deck:[],
		_draw_2_card_return_1:[],
		_draw_2_card_1:[],
		_tuck_1_pick_feeder:[],
		_tuck_1_pick_supply:[],
		_tuck_1_draw_tray:[],
		_tuck_1_draw_deck:[],
		_tuck_1_place:[],
		_food_1_supply:[],
		_food_1_feeder:[],
		_food_2_supply:[],
		_food_2_tray:[],
		_discard_1_child_pick_2_food_feeder:[],
		_discard_1_child_pick_1_food_supply:[],
		_discard_1_child_draw_2_card:[],
		_discard_1_food_draw_1_card:[],
		_discard_1_card_pick_1_food_supply:[],
		_repeat:[],
		_hunt_food_mouse:[],
		_hunt_food_fish:[],
		_hunt_card_sym:[],
		//pink_verb_what_verb_n_what:[]
		pink_draw_mission_pick_1_food_feeder:[],
		pink_place_child_pick_1_food_feeder:[],
		pink_hunt_successfully_pick_1_food_feeder:[],
		pink_draw_mission_draw_1_card_deck:[],
		pink_place_child_draw_1_card_deck:[],
		pink_hunt_successfully_draw_1_card_deck:[],
		white_draw_2_mission_return_1:[],
		//white_draw_1_mission:[],
		white_collect_fish:[],
		white_collect_mouse:[],
		white_collect_worm:[],
		white_collect_cherries:[],
		white_child_sym:[],
		white_child_color:[],
		white_child_class:[],
		lightblue_feeder:[],
		lightblue_tray:[],
	};
	let list=Object.keys(powers);
	//console.log(colorOrKey);
	if (isColor(colorOrKey)) return rChoose(list.filter(x=>colorOrKey == 'sienna'?x.startsWith('_'):x.startsWith(colorOrKey)));
	else if (nundef(colorOrKey)) return rChoose(list);
	else if (nundef(prop)) return powers[colorOrKey];
	else return lookup(powers,[colorOrKey,prop]);
}

//#region NOT ws
function getAbstractSymbol(n){
	// let abs=M.byCollection.icon.filter(x=>x.includes('abstract'));
	if (nundef(n)) n=rChoose(range(1,100));
	else if (isList(n)) n=rChoose(n);
	return `abstract_${String(n).padStart(3, '0')}`;
}
function getDetailedSuperdi(key) {
	let o = M.superdi[key]; //console.log('...',key,o)
	let details = valf(M.details[key],M.details[o.friendly]);
	if(nundef(details)) return null;
	addKeys(details, o);
	o.key = key;
	o.class = o.class.toLowerCase();
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) {
		[o.foodlist, o.foodtype] = extractFoodAndType(o.food);
		let foodTokens = [];
		if (['berries', 'fruit'].some(x => o.foodlist.includes(x))) foodTokens.push('cherries');
		if (['fish', 'shrimp', 'squid'].some(x => o.foodlist.includes(x))) foodTokens.push('fish');
		if (['wheat', 'grain', 'crops'].some(x => o.foodlist.includes(x))) foodTokens.push('grain');
		if (o.foodtype.startsWith('insect')) foodTokens.push('worm');
		else if (o.foodtype.startsWith('carni')) foodTokens.push('mouse');
		else if (o.foodtype.startsWith('omni')) foodTokens.push('omni');
		else if (o.foodtype.startsWith('herbi')) foodTokens.push('seedling');
		o.foodTokens = arrTake(foodTokens,3);
	}
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) {
		let x = o.species; o.longSpecies = x; o.species = extractSpecies(x);
	}

	if (isdef(o.habitat)) {
		let text = o.habitat;
		let hlist = o.hablist = extractHabitat(text, ['coastal']);
		let habTokens = [];
		if (['wetland'].some(x => hlist.includes(x))) { habTokens.push('wetland'); } //colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png'); }
		if (['dwellings', 'grassland', 'desert'].some(x => hlist.includes(x))) { habTokens.push('grassland'); } //{ colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png'); }
		if (['forest', 'mountain', 'ice'].some(x => hlist.includes(x))) { habTokens.push('forest'); } //{ colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png'); }
		o.habTokens = habTokens;
		//let ohab = o.ohabitat = { text };
		// let colors = ohab.colors = [];
		// let imgs = ohab.imgs = [];
		// if (['wetland'].some(x => hlist.includes(x))) { colors.push('lightblue'); imgs.push('../assets/games/wingspan/wetland.png'); }
		// if (['dwellings', 'grassland', 'desert'].some(x => hlist.includes(x))) { colors.push('goldenrod'); imgs.push('../assets/games/wingspan/grassland2.png'); }
		// if (['forest', 'mountain', 'ice'].some(x => hlist.includes(x))) { colors.push('emerald'); imgs.push('../assets/games/wingspan/forest1.png'); }
	}

	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color, colors);
	o = sortDictionary(o);
	return o;
}
function generatePizzaSvg(sz) {
	let colors = Array.from(arguments).slice(1);
	let numSlices = colors.length;
	const radius = sz / 2;
	const centerX = radius;
	const centerY = radius;
	const angleStep = (2 * Math.PI) / numSlices;
	const svgParts = [];
	svgParts.push(`<svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}" xmlns="http://www.w3.org/2000/svg">`);
	//svgParts.push(`<g transform="matrix(1,0,0,1,0,-${sz/2})">`);
	for (let i = 0; i < numSlices; i++) {
		const startAngle = i * angleStep;
		const endAngle = (i + 1) * angleStep;
		const x1 = centerX + radius * Math.cos(startAngle);
		const y1 = centerY + radius * Math.sin(startAngle);
		const x2 = centerX + radius * Math.cos(endAngle);
		const y2 = centerY + radius * Math.sin(endAngle);
		const largeArcFlag = angleStep > Math.PI ? 1 : 0;
		const pathData = [
			`M ${centerX},${centerY}`, // Move to the center
			`L ${x1},${y1}`,           // Line to the start of the arc
			`A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2}`, // Arc to the end of the slice
			`Z`                        // Close the path
		].join(' ');
		svgParts.push(`<path d="${pathData}" fill="${colors[i]}" />`);
	}
	svgParts.push('</svg>');
	return svgParts.join('\n');
}
function isColor(s){ return isdef(M.colorByName[s]);}
function pluralOf(s, n) {
	di = { food: '', child: 'ren' };
	return s + (n == 0 || n > 1 ? valf(di[s.toLowerCase()], 's') : '');
}
function showim1(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]);
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	if (nundef(src)) src = rChoose(M.allImages).path;
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles)
	let img = mDom(d, styles, { tag: 'img', src });
	return img;
}
function simpleShowImageInBatch(key, dParent, styles = {}, opts = {}) {
	let o = M.superdi[key]; o.key = key;
	addKeys({ bg: rColor() }, styles);
	mClear(dParent);
	[w, h] = [dParent.offsetWidth, dParent.offsetHeight];
	let [sz, fz] = [.9 * w, .8 * h];
	let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
	mCenterCenterFlex(d1)
	let el = null;
	let src = (opts.prefer == 'photo' && isdef(o.photo)) ? o.photo : valf(o.img, null);
	if (isdef(src)) {
		if (o.cats.includes('card')) {
			el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
			mDom(d1, { h: 1, w: '100%' })
		} else {
			el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src });
		}
	}
	else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	assertion(el, 'PROBLEM mit' + key);
	let label = mDom(d1, { fz: 11, cursor: 'pointer' }, { html: o.friendly, className: 'ellipsis hoverHue' });
	label.onclick = simpleOnclickLabel;
	mStyle(d1, { cursor: 'pointer' });
	d1.onclick = simpleOnclickItem;
	d1.setAttribute('key', key);
	d1.setAttribute('draggable', true)
	d1.ondragstart = ev => { ev.dataTransfer.setData('itemkey', key); }
	return d1;
}



//#region TODO
function wsHowMany(deck,prop,val,op){
}
function wsGetMission(){

	let missions={
		class:[],
		food_only:[],
		food_specific:[],
		size_atMost:[],
		size_arLeast:[],
		weight_AtMost:[],
		weight_AtLeast:[],
		cards_hand:[],
		cards_board:[],
		cards_habitat:[],
		habitat_only:[],
		tuck:[],
		powerColor:[],
	}
	return rChoose(Object.keys(missions));

}
