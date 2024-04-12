function setgame() {
	function setup(table) {
		let fen = {};
		fen.players = {};
		for (const o of table.players) {
			let pl = fen.players[o.name] = o;
			pl.color = getUserColor(o.name)
			pl.score = 0;
		}
		fen.deck = setCreateDeck();
		fen.cards = deckDeal(fen.deck,12);
		fen.plorder = jsCopy(table.playerNames);
		fen.turn = jsCopy(table.playerNames); // alle zugleich dran
		delete table.players;
		return fen;
	}
	async function activate(table) {await setActivate(); } //console.log('activate for',getUname());}
	function checkGameover(table) { 
		return table.playerNames.some(x=>x.score == table.options.winning_score);
	}
	async function present(table) { await setPresent(table); } 
	async function robotMove(table) {await setRobotMove(table); } //console.log('activate for',getUname());}
	async function stepComplete(table,o) { await setStepComplete(table,o); } 
	return { setup, activate, checkGameover, present, robotMove, stepComplete };
}
async function setRobotMove(table){
	T.sets=setFindAllSets(T.items);
	let buttons = mDom(dOpenTable,{w100:true,gap:10,matop:20});mCenterCenterFlex(buttons)
	mButton('NO Set',setOnclickNoSet,buttons,{w:80},'input');
	T.bHint=mButton('Hint',setOnclickHint,buttons,{w:80},'input');
	mShield(dOpenTable,{bg:'#00000010'});

	T.dTimer = mDom(dOpenTable);
	if (isEmpty(T.sets)) createCountdownG(T.dTimer,{},1000,setOnclickNoSet());
	else{
		T.list = rChoose(T.sets);
		createCountdownG(T.dTimer,{},2000,setClickNext);
	}
}
function setClickNext(){
	if (isEmpty(T.list)) {console.log('list empty!');return;}
	let el=T.list.shift();
	setOnclickCard(el,T.items);
	if (!isEmpty(T.list)) createCountdownG(T.dTimer,{},4000,setClickNext);
}
async function setActivate(){
	T.sets=setFindAllSets(T.items);

	for(const item of T.items){
		let d=iDiv(item);
		d.onclick = ()=>setOnclickCard(item,T.items);
		mStyle(d,{cursor:'pointer'})

	}
	let buttons = mDom(dOpenTable,{w100:true,gap:10,matop:20});mCenterCenterFlex(buttons)
	mButton('NO Set',setOnclickNoSet,buttons,{w:80},'input');
	T.bHint=mButton('Hint',setOnclickHint,buttons,{w:80},'input');

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
	//card eg purple_squiggle_2_open	
	const paths = {
		diamond: "M25 0 L50 50 L25 100 L0 50 Z",
		squiggle: "M38.4,63.4c2,16.1,11,19.9,10.6,28.3c1,9.2-21.1,12.2-33.4,3.8s-15.8-21.2-9.3-38c3.7-7.5,4.9-14,4.8-20 c0-16.1-11-19.9-10.6-28.3C1,0.1,21.6-3,33.9,5.5s15.8,21.2,9.3,38C40.4,50.6,38.5,57.4,38.4,63.4z",
		oval: "M25,95C14.2,95,5.5,85.2,5.5,80V20C5.5,13.2,14.2,5.2,25,5.2S44.5,13.2,44.5,20v60 C44.5,85.2,35.8,95,25,95z"
	}
	let [color, shape, num, fill] = card.split('_');
	var attr = {
		d: paths[shape], 
		fill: fill=='striped'?`url(#striped-${color})`:fill=='solid'?colors[color]:'none',
		stroke: colors[color],
		'stroke-width':2,
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
function setGameover(table){
	table.status = 'over';
	table.winners = getPlayersWithMaxScore(table.fen);
}
function setLoadPatterns(dParent, colors){
	dParent = toElem(dParent);
	let id="setpatterns";
	if (isdef(mBy(id))) {return;}
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
	let el=mCreateFrom(html);
	mAppend(dParent,el)
}
async function setOnclickHint(){
	if (isEmpty(T.sets)) {console.log('no set');return;}
	//this should only work if no card is clicked?
	let set = rChoose(T.sets);
	await setOnclickCard(set[0],T.items)

}
async function setPresent(table) {
	T={};
	const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; //'#4b0082' //'#8e44ed' }; //'blueviolet' }; //'#8e44ad' };

	setLoadPatterns('dPage',colors);
	mClear('dMain');
	let d = mDom('dMain', { margin: 10 }); //, bg: '#00000080' }); mCenterFlex(d)
  [dOben, dOpenTable, dMiddle, dRechts] = tableLayoutMR(d);
	// mCenterCenterFlex(dOben);
	//mDom(d, { fz: 100, fg: 'white' }, { html: `we are playing ${getGameFriendly(table.game)}!!!!` })

	let [fen,playerNames,players,turn]=[table.fen,table.playerNames,table.fen.players,table.fen.turn];
	let cards = fen.cards;
	let dp=mDom(dOpenTable,{w100:true});mCenterFlex(dp);
	let dBoard=T.dBoard=mGrid(cards.length/3,3,dp,{gap:14});
	let items = T.items = [];
	for(const c of cards){
		//mDom(dBoard,{},{html:c})
		let d = setDrawCard(c,dBoard,colors,TESTING?100:110); 
		let item = mItem({div:d},{key:c});
		items.push(item);
	}

	//setStats(table.fen, dRechts,'col');
	setStats(table.fen, dOben,'rowflex',false)

}
async function setStepComplete(table,o){
	console.log('___ stepComplete')
	table.step=o.step;
	let pl = table.fen.players[o.name];
	pl.score++;
	Clientdata.table = table;
	console.log('player scores',table.playerNames.map(x=>table.fen.players[x].score));
	let [step,fen]=[table.step,table.fen];
	if (getUname()==o.name) await mPostRoute('postTable', {step,fen});

}
function setStats(fen, dParent, layout, showTurn=true) {
	let me=getUname();
  let player_stat_items = uiTypePlayerStats(fen, me, dParent, layout, { patop:8, mabottom:20, wmin: 130, bg: 'beige', fg: 'contrast' })
  for (const plname in fen.players) {
    let pl1 = fen.players[plname]; //console.log('player',pl1)
    let item = player_stat_items[plname];
    let d = iDiv(item); mCenterFlex(d); mLinebreak(d);
    playerStatCount('', pl1.score, d);
    mDom(d, { h: 6, w: '100%' });
    if (showTurn && fen.turn.includes(plname)) {
      show_hourglass(plname, d, 30, { left: -3, top: 0 }); //'calc( 50% - 36px )' });
    }
    // mDom(d, { position: 'absolute', top: 0 }, { html: pl1.level })
  }
}
async function rest(item,items){
	//console.log('click')
	toggleItemSelection(item);
	let n=items.length;
	//console.log(n);
	let selitems=items.filter(x=>x.isSelected);
	let m = selitems.length;
	//console.log(selitems,m);
	//console.log(`${m} out of ${n} items selected!`);
	if (m > 0){ //TESTING!!!
		//check if this is a set!
		//console.log('selected',selitems);
		let move = selitems.map(x=>x.key);
		let table=Clientdata.table;
		let fen=table.fen;
		let pl=fen.players[getUname()];
		pl.score++;
		await sendMoveComplete(fen);
		//send move!
	}
}
function checkIfSet(keys){
	let arr=makeArrayWithParts(keys);
	let isSet = arr.every(x=>checkIfAllSameOrDifferent(x));
	return isSet;
}
function checkIfAllSameOrDifferent(arr) {
	if (arr.length === 0) {
			return true; // Consider an empty array as meeting the criteria
	}
	
	// Check if all elements are the same
	const allSame = arr.every(element => element === arr[0]);
	if (allSame) {
			return true;
	}
	
	// Check if all elements are unique
	const uniqueElements = new Set(arr);
	const allDifferent = uniqueElements.size === arr.length;
	
	return allDifferent;
}
function setFindAllSets(items){
  let result = [];
  for(var x = 0; x < items.length; x++){
    for(var y = x+1; y < items.length; y++){
      for(var z = y+1; z < items.length; z++){
				assertion(items[x]!=items[y],`WTF!?!?!?! ${items[x].key} ${items[y].key}`)
				let list = [items[x],items[y],items[z]];
				let keys =list.map(x=>x.key);
				if (checkIfSet(keys)) result.push(list);
      }
    }
  }
	//if (TESTING) console.log('sets',result.map(x=>x.map(y=>y.key)));
  return result;
}
function makeArrayWithParts(keys){
	let arr=[];keys[0].split('_').map(x=>arr.push([]));
	for(const key of keys){
		let parts = key.split('_');
		for(let i=0;i<parts.length;i++) arr[i].push(parts[i]);
	}
	return arr;
}
async function setGhostMove(table){
	let item = rChoose(T.items);
  let name = getUname(); 
	console.log(name,'click',item.key)
	//if (name == 'felix') await mSleep(10);
	await mSleep(rChoose([0,10,20,30,40]));
	let fen=table.fen;
	let pl=fen.players[name];
	pl.score++;
	// await sendMoveComplete(fen);
  let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = fen.turn;
	//console.log('___ sendMoveComplete',step,name); //type,move,turn)
	let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
	console.log('res',res)
}
