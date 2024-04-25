
function checkInterrupt(items) {
	return isdef(T) && items[0] == T.items[0] && isdef(DA.Tprev) && T.items[0] == DA.Tprev.items[0];
}
function stopAutobot() {
	if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
	DA.stopAutobot = true;
}
function INTERRUPT() {
	DA.merged = get_now(); //console.log('ts', DA.merged);
	if (isdef(TO.SLEEPTIMEOUT)) { clearEvents(); } //Timeout(TO.SLEEPTIMEOUT); TO.SLEEPTIMEOUT = null; }
	DA.Tprev = T; T = null;
	delete DA.stopAutobot;
}
function calcBotLevel(table) {
	let humanPlayers = dict2list(table.fen.players).filter(x => x.playmode == 'human');
	if (isEmpty(humanPlayers) || getGameOption('use_level') == 'no') return null;
	let level = arrAverage(humanPlayers, 'level');
	return level;
}
function calcBotSpeed(table) {
	let speed = 2000 + Math.round(Math.random() * 2000); //console.log('speed', speed);
	let botLevel = calcBotLevel(table);
	return botLevel ? botLevel == 1 ? speed : speed * 4 / botLevel : speed;
}
async function setBotMove(table) {
	try {
		let items = T.items;
		[T.bNoSet, T.bHint] = setShowButtons(items); T.bHint.remove();
		mShield(dOpenTable, { bg: '#00000010' });
		let speed = calcBotSpeed(table); console.log('speed', speed);
		T.sets = setFindAllSets(items);
		if (isEmpty(T.sets)) {
			speed *= 3; //speed=1000; 
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep noset'); return; }
			await setOnclickNoSet(items);
		} else {
			let list = rChoose(T.sets); //console.log('set', list);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!sleep 1'); return; }
			await setOnclickCard(list[0], items);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!!sleep 2'); return; }
			await setOnclickCard(list[1], items);
			await mSleep(speed); if (checkInterrupt(items)) { console.log('!!!sleep 3'); return; }
			await setOnclickCard(list[2], items);
		}
		console.log('* END OF AUTOMOVE *');
	} catch { console.log('please reload!') }

}
async function setOnclickHint(items, direct = false) {
	//console.log('clickedHint',direct, T.numHints);//pointerevent
	assertion(T.numHints > 0, 'NO Hints left!!!!');
	if (direct) stopAutobot();
	T.numHints -= 1;
	if (isEmpty(T.sets)) {
		let elem = T.bNoSet;
		T.numHints = 0; setHintHide();
		ANIM.button = scaleAnimation(elem);
		return;
	} else if (nundef(T.hintSet)) {
		T.hintSet = rChoose(T.sets);
	} else {
		//make sure that all selected items belong to hintSet
		let sofar = T.items.filter(x => x.isSelected);
		//if (sofar.some(x=>!T.hintSet.includes(x))) {
		if (sofar.length >= 2) {
			//pick a new hintSet
			//at least stop autohints!
			//setHintHide();
			//console.log('2 items selected',sofar);
			return;
		}
	}

	let item = T.hintSet.find(x => !x.isSelected);
	if (!T.numHints) setHintHide();
	await setOnclickCard(item, T.items, direct);
}
async function setOnclickCard(item, items, direct = false) {
	//console.log('click', item.key, direct)
	//if (direct) setStopAutoHints();
	if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
	else if (direct) stopAutobot();
	else if (!direct && item.isSelected) { console.log('already clicked!'); return; }
	else if (DA.stopAutobot == true) { assertion(!direct, 'direct and autobot true'); return; }
	//else if (direct) {T.numHints--;if (!T.numHints) setHintHide();}
	//console.log('NOW!')
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected);

	let [keys, m] = [selitems.map(x => x.key), selitems.length];
	//console.log('keys',keys)
	let overrideList = [];

	if (m == 3) {
		clearEvents();
		mShield(dOpenTable, { bg: '#00000000' }); //disable ui
		let [me, table] = [getUname(), Clientdata.table];
		let [fen, pl] = [table.fen, table.fen.players[me]];
		let isSet = setCheckIfSet(keys); //console.log('isSet', isSet); //check if set condition is met
		if (isSet) { //if yes, increase score, remove items, add 3 new items
			// <12:0 (deck should be Empty), 12:3, 13:2, 14:1, ab 15:0
			assertion(fen.cards.length >= table.options.numCards || isEmpty(fen.deck), `LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
			let toomany = Math.max(0, fen.cards.length - table.options.numCards); // replenish cards
			let need = Math.max(0, 3 - toomany); //wenn 16 cards, soll trotzdem nur 3 replacen!
			let newCards = deckDeal(fen.deck, need); //returns [] if deck empty!
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
			overrideList.push({ keys: ['fen', 'cards'], val: table.fen.cards });
			overrideList.push({ keys: ['fen', 'deck'], val: table.fen.deck });
			pl.score++;
			pl.incScore = 1;
		} else {
			pl.score--;
			pl.incScore = -1;
		}
		//just override my score at server! NOTHING else!!!
		overrideList.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
		if (pl.playmode == 'bot') {
			await mSleep(500);
			if (checkInterrupt(items)) { console.log('!!!onclick card!!!'); return; }
		}
		let res = await sendMergeTable({ id: table.id, name: me, overrideList }); // console.log('res', res)
	}
}
async function setOnclickNoSet(items, direct = false) {
	//clearEvents();
	if (direct) stopAutobot();
	mShield(dOpenTable, { bg: '#00000000' }); //disable ui
	let b = T.bNoSet; mClass(b, 'framedPicture')
	let [me, table] = [getUname(), Clientdata.table];
	let [fen, pl] = [table.fen, table.fen.players[me]];
	let overrideList = [];
	if (isEmpty(T.sets)) { //if there is no set, increase score, add 1 card
		pl.score++;
		pl.incScore = 1;
		let newCards = deckDeal(fen.deck, 1); //add 1 cards!
		if (!isEmpty(newCards)) {
			fen.cards.push(newCards[0]);
			overrideList.push({ keys: ['fen', 'cards'], val: table.fen.cards });
			overrideList.push({ keys: ['fen', 'deck'], val: table.fen.deck });
		} else {
			setGameover(table);
			overrideList.push({ keys: ['status'], val: table.status });
			overrideList.push({ keys: ['winners'], val: table.winners });
			console.log(`table status is now ${table.status}`);
			assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
		}
	} else {
		pl.score--;
		pl.incScore = -1;
	}
	overrideList.push({ keys: ['fen', 'players', me, 'score'], val: pl.score });
	if (pl.playmode == 'bot') {
		await mSleep(500);
		if (checkInterrupt(items)) { console.log('!!!onclick noset!!!'); return; }
	}
	let res = await sendMergeTable({ id: table.id, name: me, overrideList });
}















