
//#region 10.7.24
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

//20.mai 24: unneeded in newclosure / todo abarbeiten!
function getBg(d) { let style = window.getComputedStyle(toElem(d)); let bg = valf(style.backgroundColor, style.background); return colorFrom(bg); }

//20.mai 24: GENIAL!!! function call or return function
function updateUserImageToBotHuman(playername){
	return (checked,name,val) =>{
		let du=mByAttr('username',playername);
		//console.log('checked',checked,name,val,du); return;
		let img = du.firstChild;
		if (val == 'human') mStyle(img,{round:true}); else mStyle(img,{rounding:0});
	}
}
function updateUserImageToBotHuman(playername,a,b,c){
	function doit(checked,name,val){
		let du=mByAttr('username',playername);
		console.log('checked',checked,name,val,du); return;
		let img = du.firstChild;
		if (checked==true) if (val == 'human') mStyle(img,{round:true}); else mStyle(img,{rounding:0});
	}
	doit(a,b,c);
}
function updateUserImageToBotHuman(playername,value){
	function doit(checked,name,val){
		let du=mByAttr('username',playername);
		//console.log('checked',checked,name,val,du); return;
		let img = du.firstChild;
		if (checked==true) if (val == 'human') mStyle(img,{round:true}); else mStyle(img,{rounding:0});
	}
	if (isdef(value)) doit(true,0,value); else return doit;
}
function setPlayersToMulti() {
	for (const name in DA.allPlayers) {
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'human');
		updateUserImageToBotHuman(name,'human');
		// let el = document.querySelector(`div[username="${name}"]`);
		// let img = el.getElementsByTagName('img')[0];
		// mStyle(img, { round: true });
	}
	setRadioValue('playmode', 'human');
}
function setPlayersToSolo() {
	for (const name in DA.allPlayers) {
		if (name == getUname()) continue;
		lookupSetOverride(DA.allPlayers, [name, 'playmode'], 'bot');
		updateUserImageToBotHuman(name,'bot');
		// let el = document.querySelector(`div[username="${name}"]`);
		// let img = el.getElementsByTagName('img')[0];
		// mStyle(img, { rounding: 2 });
	}
	let popup = mBy('dPlayerOptions');
	if (isdef(popup) && popup.firstChild.innerHTML.includes(getUname())) return;
	setRadioValue('playmode', 'bot');
}

//setgame simplified
function setgame() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.deck = setCreateDeck(); console.log('deck size',fen.deck.length)
		fen.cards = deckDeal(fen.deck, table.options.numCards);
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	function present(table) {
		const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
		setLoadPatterns('dPage', colors);
		let fen = table.fen;
		mStyle('dTable', { padding: 50, wmin: 500 });//rounding:250});
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let rows = fen.cards.length / 3;
		let sz = Math.min(80, Math.round(400 / rows));
		let dBoard = T.dBoard = mGrid(rows, 3, d, { gap: 14 });
		let items = [];
		for (const c of fen.cards) {
			let dc = setDrawCard(c, dBoard, colors, sz); //TESTING ? 80 : 100);
			let item = mItem({ div: dc }, { key: c });
			items.push(item);
		}

		return items;
	}
	async function activate(table, items) {
		let myTurn = isMyTurn(table);

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//show no set button
		let dParent = mBy('dTable').parentNode;
		mIfNotRelative(dParent);
		let bNoSet = mButton('No Set', () => onclickNoSet(table, items), dParent, { className: 'button' });
		mPos(bNoSet, window.innerWidth / 2 + 180, 110);

		if (amIHuman(table)) return;

		//bot move activation: random move
		let it1,it2;
		for (const ch of 'rgp') {
			console.log('ch', ch);
			let arr = items.filter(x => x.key[0] == ch);
			if (arr.length > 1) { it1 = arr[0]; it2 = arr[1]; break; }
		}
		TO.bot = setTimeout(async () => {
			toggleItemSelection(it1); toggleItemSelection(it2);
			TO.bot1 = setTimeout(async () => await evalMove(table, [it1.key, it2.key]), 400);
		}, rNumber(3000, 4000));

	}

	//#region set specific functions
	function setCheckIfSet(keys) {
		let arr = makeArrayWithParts(keys);
		let isSet = arr.every(x => arrAllSameOrDifferent(x));
		return isSet;
	}
	function setCreateDeck() {
		let deck = [];
		['red', 'purple', 'green'].forEach(color => {
			['diamond', 'squiggle', 'oval'].forEach(shape => {
				[1, 2, 3].forEach(num => {
					['solid', 'striped', 'open'].forEach(fill => {
						deck.push(`${color}_${shape}_${num}_${fill}`);
					});
				});
			});
		});
		arrShuffle(deck);
		return deck;
	}
	function setDrawCard(card, dParent, colors, sz = 100) {
		const paths = {
			diamond: "M25 0 L50 50 L25 100 L0 50 Z",
			squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
			oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
		}
		let [color, shape, num, fill] = card.split('_');
		var attr = {
			d: paths[shape],
			fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
			stroke: colors[color],
			'stroke-width': 2,
		};
		let h = sz, w = sz / .65;
		let ws = w / 4;
		let hs = 2 * ws;
		let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
		mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
		let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
		for (const i of range(num)) {
			let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
		}
		return d0;
	}
	function setFindAllSets(items) {
		let result = [];
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) result.push(list);
				}
			}
		}
		if (isEmpty(result)) console.log('no set!')
		return result;
	}
	function setFindOneSet(items) {
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) return { items: list, keys };
				}
			}
		}
		console.log('no set!')
		return null;
	}
	function setLoadPatterns(dParent, colors) {
		dParent = toElem(dParent);
		let id = "setpatterns";
		if (isdef(mBy(id))) { return; }
		let html = `
			<svg id="setpatterns" width="0" height="0">
				<!--  Define the patterns for the different fill colors  -->
				<pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
				</pattern>
				<pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
				</pattern>
				<pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
				</pattern>
			</svg>
			`;
		let el = mCreateFrom(html);
		mAppend(dParent, el)
	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		let selitems = items.filter(x => x.isSelected);
		let [keys, m] = [selitems.map(x => x.key), selitems.length];
		if (m == 2) {
			await evalMove(table, keys);
		}
	}
	async function evalMove(table, keys) {
		clearEvents();
		mShield('dTable', { bg: 'transparent' });
		let id = table.id;
		let name = getUname();
		let step = table.step;

		let isSet = keys[0][0] == keys[1][0]; //setCheckIfSet(keys);
		if (isSet) {
			table.players[name].score += 1;

			//calc how to replace cards from set
			let fen = table.fen;
			let toomany = Math.max(0, fen.cards.length - table.options.numCards);
			let need = Math.max(0, 3 - toomany);
			let newCards = deckDeal(fen.deck, need);
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i]);

		} else {
			table.players[name].score -= 1;

		}
		lookupAddToList(table, ['moves'], { step, name, keys, change: isSet ? '+1' : '-1', score: table.players[name].score });

		let o = { id, name, step, table };

		if (isSet) o.stepIfValid = step + 1;

		let res = await mPostRoute('table', o); //console.log(res);
	}

	async function onclickNoSet(table, items) { console.log('clicked No Set!') }


	return { setup, present, stats, activate };
}

//setgame version 1: fehler interrupten move
function setgame() {

	function setup(table) {
		//console.log('setup',table)
		let fen = {};
		for (const name in table.players) {
			let pl = table.players[name];
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck, table.options.numCards);
		table.plorder = jsCopy(table.playerNames);
		table.turn = jsCopy(table.playerNames);
		return fen;
	}
	function resolvePending(table) {
		let [fen, players] = [table.fen, table.players];
		let pending = table.pending; delete table.pending;
		let [name, move] = [pending.name, pending.move];

		let skip = false;

		if (isdef(move.noset)){
			if (move.noset == 'correct'){
				players[name].score += 1;
				let newCards = deckDeal(fen.deck, 1); //add 1 cards!
				if (!isEmpty(newCards))	fen.cards.push(newCards[0]);
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			}else{
				//console.log('INCORRECT NOSET!!!!');
				players[name].score -= 1;
				DA.pendingChanges = [['players', name, 'score']];
			}
		}else{
			let isSet = setCheckIfSet(move);
			if (isSet) {
				players[name].score += 1;
	
				//calc how to replace cards from set
				let toomany = Math.max(0, fen.cards.length - table.options.numCards);
				let need = Math.max(0, 3 - toomany);
				let newCards = deckDeal(fen.deck, need);
				for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, move[i], newCards[i]); else removeInPlace(fen.cards, move[i]);
	
				DA.pendingChanges = [['players', name, 'score'], ['fen']];
			}else{
				//console.log('INCORRECT SET!!!!');
				players[name].score -= 1;
				DA.pendingChanges = [['players', name, 'score']];
			}
		}

		// ***TODO*** nicht ganz correct hier!!!
		if (isEmpty(fen.deck)){
			table.winners = getPlayersWithMaxScore(table);
			table.status = 'over';
			table.turn = [];
			delete DA.pendingChanges;
		}
	}
	function present(table) {
		const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' };
		setLoadPatterns('dPage', colors);
		let fen = table.fen;
		mStyle('dTable', { padding: 50, wmin: 500 });//rounding:250});
		let d = mDom('dTable', { gap: 10, padding: 10 }); mCenterFlex(d);
		let rows = fen.cards.length / 3;
		let sz = Math.min(80, Math.round(400 / rows));
		let dBoard = T.dBoard = mGrid(rows, 3, d, { gap: 14 });
		let items = [];
		for (const c of fen.cards) {
			let dc = setDrawCard(c, dBoard, colors, sz); //TESTING ? 80 : 100);
			let item = mItem({ div: dc }, { key: c });
			items.push(item);
		}

		let oset = setFindOneSet(items);
		console.log('set',oset?oset.keys:'NO SET'); 
		//if (oset)	console.log('set',oset.keys); else console.log('NO')

		return items;
	}
	function stats(table) {
		let [me, players] = [getUname(), table.players];
		let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
		let player_stat_items = uiTypePlayerStats(table, me, 'dStats', 'rowflex', style)
		for (const plname in players) {
			let pl = players[plname];
			let item = player_stat_items[plname];
			if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
			let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
			playerStatCount('star', pl.score, d); //, {}, {id:`stat_${plname}_score`});
		}
	}
	async function activate(table, items) {
		let myTurn = isMyTurn(table);

		for (const item of items) {
			let d = iDiv(item);
			mStyle(d, { cursor: 'pointer' });
			d.onclick = ev => onclickCard(table, item, items);
		}

		//show no set button
		let dParent = mBy('dTable').parentNode;
		mIfNotRelative(dParent);
		let bNoSet = mButton('No Set',()=>onclickNoSet(table,items),dParent,{className:'button'});
		mPos(bNoSet,window.innerWidth/2+180,110);

		if (amIHuman(table)) return;

		//bot move activation: random move
		TO.bot = setInterval(async () => {
			//console.log('BOT!!!',table.step);
			let item = rChoose(items);
			await onclickCard(table, item, items);
		}, rNumber(1000, 4000));

	}

	//#region set specific functions
	function setCheckIfSet(keys) {
		let arr = makeArrayWithParts(keys);
		let isSet = arr.every(x => arrAllSameOrDifferent(x));
		return isSet;
	}
	function setCreateDeck() {
		let deck = [];
		['red', 'purple', 'green'].forEach(color => {
			['diamond', 'squiggle', 'oval'].forEach(shape => {
				[1, 2, 3].forEach(num => {
					['solid', 'striped', 'open'].forEach(fill => {
						deck.push(`${color}_${shape}_${num}_${fill}`);
					});
				});
			});
		});
		arrShuffle(deck);
		return deck;
	}
	function setDrawCard(card, dParent, colors, sz = 100) {
		const paths = {
			diamond: "M25 0 L50 50 L25 100 L0 50 Z",
			squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
			oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
		}
		let [color, shape, num, fill] = card.split('_');
		var attr = {
			d: paths[shape],
			fill: fill == 'striped' ? `url(#striped-${color})` : fill == 'solid' ? colors[color] : 'none',
			stroke: colors[color],
			'stroke-width': 2,
		};
		let h = sz, w = sz / .65;
		let ws = w / 4;
		let hs = 2 * ws;
		let d0 = mDom(dParent, { display: 'flex', w, h, bg: 'white', rounding: 10 });
		mStyle(d0, { justify: 'center', 'align-items': 'center', gap: 6 })
		let shapeSvg = `<svg viewbox="-2 -2 54 104">` + makeSVG("path", attr) + '</svg>';
		for (const i of range(num)) {
			let d1 = mDom(d0, { h: hs, w: ws }, { html: shapeSvg });
		}
		return d0;
	}
	function setFindAllSets(items) {
		let result = [];
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) result.push(list);
				}
			}
		}
		if (isEmpty(result)) console.log('no set!')
		return result;
	}
	function setFindOneSet(items) {
		for (var x = 0; x < items.length; x++) {
			for (var y = x + 1; y < items.length; y++) {
				for (var z = y + 1; z < items.length; z++) {
					assertion(items[x] != items[y], `WTF!?!?!?! ${items[x].key} ${items[y].key}`)
					let list = [items[x], items[y], items[z]];
					let keys = list.map(x => x.key);
					if (setCheckIfSet(keys)) return{items:list,keys};
				}
			}
		}
		console.log('no set!')
		return null;
	}
	function setLoadPatterns(dParent, colors) {
		dParent = toElem(dParent);
		let id = "setpatterns";
		if (isdef(mBy(id))) { return; }
		let html = `
			<svg id="setpatterns" width="0" height="0">
				<!--  Define the patterns for the different fill colors  -->
				<pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.red}; stroke-width:1" />
				</pattern>
				<pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.green}; stroke-width:1" />
				</pattern>
				<pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
					<path d="M-1,1 H5" style="stroke:${colors.purple}; stroke-width:1" />
				</pattern>
			</svg>
			`;
		let el = mCreateFrom(html);
		mAppend(dParent, el)
	}

	async function onclickCard(table, item, items) {
		toggleItemSelection(item);
		let selitems = items.filter(x => x.isSelected);
		let [keys, m] = [selitems.map(x => x.key), selitems.length];
		if (m == 3) {
			clearEvents();
			mShield('dTable', { bg: 'transparent' });
			let id = table.id;
			let name = getUname();
			let move = keys;
			let step = table.step;
			let olist = [{ keys: ['pending'], val: { name, move } },];
			if (isdef(DA.pendingChanges)) {
				for (const klist of DA.pendingChanges) {
					olist.push({ keys: klist, val: lookup(table, klist) });
				}
			}
			let o = { id, name, olist, step };

			let isSet = setCheckIfSet(keys);
			if (isSet) o.stepIfValid = step + 1;

			let res = await mPostRoute('olist', o); //console.log(res);
		}
	}
	async function onclickNoSet(table,items){
		console.log('was nun?');
		clearEvents();
		mShield('dTable', { bg: 'transparent' });

		let oset = setFindOneSet(items);

		let id = table.id;
		let name = getUname();
		let move = oset?{noset:'wrong',keys:oset.keys}:{noset:'correct'};
		let step = table.step;
		let olist = [{ keys: ['pending'], val: { name, move } },];
		if (isdef(DA.pendingChanges)) {
			for (const klist of DA.pendingChanges) {
				olist.push({ keys: klist, val: lookup(table, klist) });
			}
		}
		let o = { id, name, olist, step };

		if (!oset) o.stepIfValid = step + 1;
		let res = await mPostRoute('olist', o); //console.log(res);
	}


	return { setup, resolvePending, present, stats, activate };
}

//change: 2 geteiltes showTable wieder zusammengegeben:
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });
	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		func.resolvePending(table); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
	}

	let items = tablePresentation(table, func);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}
function tablePresentation(table, func) {
	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d); //console.log(getRect('dMain'))

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	return items;
}

//change: remove TESTING clause
function collectPlayers() {
	let players = {};
	if (isList(DA.playerList)) {
		for (const name of DA.playerList) {
			players[name] = DA.allPlayers[name];
		}
	}
	if (TESTING == 'felixAmanda') {
		if (nundef(players.felix)) players.felix = createGamePlayer('felix', DA.gamename)
		if (nundef(players.amanda)) players.amanda = createGamePlayer('amanda', DA.gamename)
	}
	return players;
}

//change: remove 0.clientid = client.id
function emitToPlayers(namelist, msgtype, o) {
	for (const name of namelist) {
		let idlist = byUsername[name]; //console.log('name', name, '\nid', idlist);
		if (nundef(idlist)) continue;
		// console.log('ids for',name,idlist)
		for (const id of idlist) {
			let client = clients[id]; //console.log(name, client.id); //isdef(client),Object.keys(client))
			o.clientid = client.id;
			if (client) client.emit(msgtype, o);
		}
	}
}

//change: remove 'shields' list
function mShield(dParent, styles = {}, id = null, classnames = null, hideonclick = false) {
	addKeys({ bg: '#00000020' },styles);
	dParent = toElem(dParent);
	let d = mDiv(dParent, styles, id, classnames);
	lookupAddIfToList(DA, ['shields'], d);
	mIfNotRelative(dParent);
	mStyle(d, { position: 'absolute', left: 0, top: 0, w: '100%', h: '100%' });
	if (hideonclick) d.onclick = ev => { evNoBubble(ev); d.remove(); };
	else d.onclick = ev => { evNoBubble(ev); };
	mClass(d, 'topmost');
	return d;
}

//#region tableLayout
function tableLayout(dParent) {
  clearElement(dParent);
  let d = mGrid(1, 2, dParent);
  let [dMiddle, dRechts] = [mDom(d), mDom(d)];
  let dOben = mDom(dMiddle, { mabottom: 10 }, { id: 'dOben' });
  let dOpenTable = mDom(dMiddle, {}, { id: 'dOpenTable' });
  return [dOben, dOpenTable, dRechts];
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
  let d = mGrid(1, 2, dParent);
  let [dMiddle, dRechts] = [mDom(d), mDom(d)];
  let dOben = mDom(dMiddle, { mabottom: 10 }, { id: 'dOben' });
  let dOpenTable = mDom(dMiddle, {}, { id: 'dOpenTable' });
  return [dOben, dOpenTable, dRechts];
}
function tableLayoutMR(dParent) {
  clearElement(dParent);
  let d = mGrid(1, 2, dParent);
  //let d=mDom(dParent,{w100:true,display:'grid'});
  //d.style.gridTemplateColumns = 2;
  let [dMiddle, dRechts] = [mDom(d), mDom(d)];
  //mCenterFlex(dMiddle, false);
  let dOben = mDom(dMiddle, { mabottom: 10 }, { id: 'dOben' });
  let dOpenTable = mDom(dMiddle, {}, { id: 'dOpenTable' });
  return [dOben, dOpenTable, dRechts];
}

//endregion

//#region button96
function button96() {
  function setup(table) {
    let fen = {};
    fen.players = {};
    for (const name in table.players) {
      let pl = fen.players[name] = table.players[name];
      pl.color = getUserColor(name)
      pl.score = 0;
    }
    fen.number = 0;
    fen.plorder = jsCopy(table.playerNames);
    fen.turn = jsCopy(table.playerNames);
    delete table.players;
    return fen;
  }
  function checkGameover(table) {
    let score_sum = calcScoreSum(table);
    //console.log('___check score sum',score_sum);
    if (score_sum >= 5) {
      table.winners = getPlayersWithMaxScore(table.fen);
      table.status = 'over';
      return true;
    } else return false;
    //return table.playerNames.some(x => x.score == table.options.winning_score);
  }
  function present(T) {
    // //assumes that me is player at this table!!!
    // //assertion(calcScoreSum(table) == table.fen.number, "SCORE MISMATCH!!!! present")
    // //mClear(dParent);
    // let dInstruction = mDom(dParent,{className:'instruction'},{html:`Waiting for ${table.fen.turn.join(', ')}`});
    // let dStats = mDom(dParent);
    // let div = mDom(dParent, { margin: 12, align: 'center' }, { id: 'dGameDiv' }); //for shield! 

    // let bYes = mDom(div, { fz: 100, wmin: 200, margin:10, className: 'button' }, { tag: 'button', html: `Step:${table.step}` });
    // let bNo = mDom(div, { fz: 100, wmin: 200, margin:10,className: 'button' }, { tag: 'button', html: `Error!` });

    // if (nundef(name)) name=getUname(); //eingeloggter user perspective is default!

    // return { div, bYes, bNo, dInstruction, dStats, table, name };
  }
  function showStats(T) { button96Stats(T); }
  async function activate(T) {
    dInstruction.innerHTML = "click one of the buttons!"
    T.bYes.onclick = () => button96OnclickYes(T, true);
    T.bNo.onclick = () => button96OnclickNo(T, true);
  }
  async function botMove(T) {
    TO.button = setTimeout(() => button96BotMove(T), rChoose([1000, 2000, 3000]));
  }
  return { setup, activate, checkGameover, present, showStats, botMove };
}
function button96Stats(T) {
  let [fen, name, dStats] = [T.table.fen, T.name, T.dStats];
  let layout = 'rowflex';
  let style = { patop: 8, mabottom: 20, wmin: 80, bg: 'beige', fg: 'contrast' };
  let player_stat_items = uiTypePlayerStats(fen, name, dStats, layout, style)
  for (const plname in fen.players) {
    let pl = fen.players[plname];
    let item = player_stat_items[plname];
    if (pl.playmode == 'bot') { mStyle(item.img, { rounding: 0 }); }
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d); mIfNotRelative(d);
    playerStatCount('star', pl.score, d);
  }
}
async function button96OnclickYes(T, direct = false) {
  let b = T.bYes;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceStepScore(T.table, T.name);
}
async function button96OnclickNo(T, direct = false) {
  let b = T.bNo;
  if (direct) clearEvents();
  disableUI(); //disableButton(b);

  await sendRaceError(T.table, T.name);
}
async function button96BotMove(T) {
  if (coin(80)) await button96OnclickYes(T); else await button96OnclickNo(T);
}
//#endregion

//change: einfach switchToUser inlined bei updateTestButtons...
async function testOnclickCaption(ev) {
	let name = ev.target.innerHTML;
	let b = UI[getButtonCaptionName(name)];
	for (const name of getButtonCaptionNames(Clientdata.table)) {
		let b = UI[getButtonCaptionName(name)];
		if (isdef(b)) mStyle(b, { bg: 'silver', fg: 'black' });
	}
	mStyle(UI[getButtonCaptionName(x)], { bg: 'red', fg: 'white' });
	await switchToUser(x);
}

//change: guest is like any other user
async function switchToUser(uname) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? getUname() : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	Clientdata.curUser = uname;
	localStorage.setItem('username', uname);
	iDiv(UI.user).innerHTML = uname;
	setTheme(U);
	if (uname == 'guest') {
		await switchToMenu(UI.nav, 'home');
		menuDisable(UI.nav, 'plan');
	} else {
		menuEnable(UI.nav, 'plan');
		let t = Clientdata.table;
		let cur = Clientdata.curMenu;
		if (cur == 'play' && isdef(t) && t.playerNames.includes(uname) && t.status == 'started') await showTable(t.id);
		else await switchToMenu(UI.nav, valf(cur, 'home'));
	}
}
//change: simplified
function testUpdateTestButtons(dParent, styles = {}) {
	let table = Clientdata.table;
	dParent = toElem(dParent);
	let id = 'dTestButtons'; mRemoveIfExists(id);
	mIfNotRelative(dParent);
	if (dParent.id == 'dExtra') mStyle(dParent,{hmin:26});
	addKeys({ display: 'flex', gap: 10, vpadding: 2, position: 'absolute', right: 8, top: 0 }, styles);
	let dBotHuman = mDom(dParent, styles, { id });
	let me = getUname();
	let names = isdef(table) ? [] : ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
	for (const name of names) {
		let idname = getButtonCaptionName(name);
		let b = UI[idname] = mButton(name, testOnclickCaption, dBotHuman);
		if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
	}
	if (nundef(table)) return dBotHuman;;
	let playmode = getPlaymode(table, me);
	if (nundef(playmode)) return dBotHuman;;
	let [playmodeKey, sz, bg, matop, patop] = [playmode == 'human' ? 'skullcap' : 'robot', 25, 'transparent', 2, 0];
	showImage(playmodeKey, dBotHuman, { fg: 'white', sz, round: true, bg, matop, patop });// , 'line-height': sz });
	let caption = `Make me ${playmode == 'bot' ? 'human' : 'bot'}`;
	UI.bPlaymode = mButton(caption, testOnclickPlaymode, dBotHuman, { w: 130 });
	return dBotHuman;
}
