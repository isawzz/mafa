function setgame() {
	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const o of table.players) {
			let pl = fen.players[o.name] = o;
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck,12);
		fen.turn = jsCopy(table.playerNames); // alle zugleich dran
		return fen;
	}
	async function activate(table) {await setActivate(); console.log('activate for',getUname());}
	function checkGameover(table) { 
		return table.playerNames.some(x=>x.score == table.options.winning_score);
	}
	async function present(table) { await setPresent(table); } 
	return { setup, activate, checkGameover, present };
}
async function setActivate(){
	for(const item of Clientdata.items){
		iDiv(item).onclick = ()=>setOnclickCard(item,Clientdata.items);

	}
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
function setDrawCard(card, dParent, sz = 100) {
	//card eg purple_squiggle_2_open	
	const paths = {
		diamond: "M25 0 L50 50 L25 100 L0 50 Z",
		squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
	}
	const colors = { red: '#e74c3c', green: '#27ae60', purple: '#8e44ad' };
	let [color, shape, num, fill] = card.split('_');
	var attr = {
		d: paths[shape], 
		fill: fill=='striped'?`url(#striped-${color})`:fill=='solid'?colors[color]:'none',
		stroke: colors[color]
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
function setLoadPatterns(dParent){
	dParent = toElem(dParent);
	let id="setpatterns";
	if (isdef(mBy(id))) {return;}
	let html = `
		<svg id="setpatterns" width="0" height="0">
			<!--  Define the patterns for the different fill colors  -->
			<pattern id="striped-red" patternUnits="userSpaceOnUse" width="4" height="4">
				<path d="M-1,1 H5" style="stroke:#e74c3c; stroke-width:1" />
			</pattern>
			<pattern id="striped-green" patternUnits="userSpaceOnUse" width="4" height="4">
				<path d="M-1,1 H5" style="stroke:#27ae60; stroke-width:1" />
			</pattern>
			<pattern id="striped-purple" patternUnits="userSpaceOnUse" width="4" height="4">
				<path d="M-1,1 H5" style="stroke:#8e44ad; stroke-width:1" />
			</pattern>
		</svg>
		`;
	let el=mCreateFrom(html);
	mAppend(dParent,el)
}
async function setPresent(table) {
	setLoadPatterns('dPage');
	mClear('dMain');
	let d = mDom('dMain', { margin: 10 }); //, bg: '#00000080' }); mCenterFlex(d)
	//mDom(d, { fz: 100, fg: 'white' }, { html: `we are playing ${getGameFriendly(table.game)}!!!!` })

	let [fen,playerNames,players,turn]=[table.fen,table.playerNames,table.fen.players,table.fen.turn];
	let cards = fen.cards;
	let dBoard=mGrid(cards.length/3,3,d,{gap:14});
	let items = Clientdata.items = [];
	for(const c of cards){
		//mDom(dBoard,{},{html:c})
		let d = setDrawCard(c,dBoard);
		let item = mItem({div:d},{key:c});
		items.push(item);
	}


}
async function setOnclickCard(item,items){
	toggleItemSelection(item);
	let n=items.length;
	let selitems=items.filter(x=>x.isSelected);
	let m = selitems.length;
	//console.log(`${m} out of ${n} items selected!`);
	if (m == 3){
		//check if this is a set!
		//console.log('selected',selitems)
		let move = selitems.map(x=>x.key);
		sendMyMove(move);
		//send move!

	}

}


















