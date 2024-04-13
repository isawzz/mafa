
function INTERRUPT(){if (isdef(TO.SLEEPTIMEOUT)) {clearTimeout(TO.SLEEPTIMEOUT);TO.SLEEPTIMEOUT=null;}}

function checkInterrupt() { return DA.counterBot > DA.counter + 1; }

async function setAutoMove(table) {
	//if (DA.inAutomove) {DA.inAutomove = false; return;}
	while (DA.inAutomove) { await mSleep(10); }
	DA.inAutomove = true;
	DA.counterBot += 1; //=DA.counter; console.log('==>',DA.counter,DA.counterBot);
	await mSleep(2000); if (checkInterrupt()) { console.log('!sleep 1');DA.inAutomove = false; return; }
	T.sets = setFindAllSets(T.items);
	if (isEmpty(T.sets)) await setOnclickNoSet();
	else {
		let list = rChoose(T.sets); //console.log('set', list);
		await setOnclickCard(list[0], T.items);

		await mSleep(2000); if (checkInterrupt()) { console.log('!!sleep 2');DA.inAutomove = false; return; }
		await setOnclickCard(list[1], T.items);
		await mSleep(2000); if (checkInterrupt()) { console.log('!!!sleep 3');DA.inAutomove = false; return; }
		await setOnclickCard(list[2], T.items);

	}
	console.log('* END OF AUTOMOVE *');
	DA.inAutomove = false;
}
async function setBotMove(table) {
	//console.log('bot move:', DA.counterBot, DA.inAutomove);
	if (isNaN(DA.counterBot) || nundef(DA.counterBot)) DA.counterBot = DA.counter;
	if (DA.counterBot < DA.counter) { DA.counterBot = DA.counter; DA.inAutomove = false; }

	setShowButtons();
	mShield(dOpenTable, { bg: '#00000010' });
	await setAutoMove(table);
}

async function mSleep(ms = 1000) {
	return new Promise(
		(res, rej) => {
			if (ms <= 5000) {
				if (isdef(TO.SLEEPTIMEOUT)) clearTimeout(TO.SLEEPTIMEOUT);
				TO.SLEEPTIMEOUT = setTimeout(res, ms);
			} else {
				console.log('param should be less than 3001');
			}
		});
}


async function setHybridMove(table) {
	setShowButtons();
	setActivateCards();
	await setAutoMove(table);
}








async function setGhostMove(table) {
	T.sets = setFindAllSets(T.items);

}
async function setOnclickCard(item, items) {
	//console.log('click', item.key)
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected);
	let [keys, m] = [selitems.map(x => x.key), selitems.length];
	if (m == 3 || TESTING && m == 3) {
		clearEvents();
		mShield(dOpenTable, { bg: '#00000000' }); //disable ui
		let [me, table] = [getUname(), Clientdata.table];
		let [fen, pl] = [table.fen, table.fen.players[me]];
		let isSet = setCheckIfSet(keys); //console.log('isSet', isSet); //check if set condition is met
		if (isSet || TESTING) { //if yes, increase score, remove items, add 3 new items
			// <12:0 (deck should be Empty), 12:3, 13:2, 14:1, ab 15:0
			assertion(fen.cards.length >= 12 || isEmpty(fen.deck), `LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
			let toomany = Math.max(0, fen.cards.length - 12); // replenish cards
			let need = Math.max(0, 3 - toomany); //wenn 16 cards, soll trotzdem nur 3 replacen!
			let newCards = deckDeal(fen.deck, need); //returns [] if deck empty!
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
			pl.score++;
		} else {
			pl.score--;
		}
		let res = await sendMergeTable(table); // console.log('res', res)
	}
	else if (m >= 1) disableButton(T.bHint); else enableButton(T.bHint);
}
async function setOnclickNoSet() {
	clearEvents();
	mShield(dOpenTable, { bg: '#00000000' }); //disable ui
	let [me, table] = [getUname(), Clientdata.table];
	let [fen, pl] = [table.fen, table.fen.players[me]];

	if (isEmpty(T.sets)) { //if there is no set, increase score, add 1 card
		pl.score++;
		let newCards = deckDeal(fen.deck, 1); //add 1 cards!
		if (!isEmpty(newCards)) fen.cards.push(newCards[0]);
		else {
			setGameover(table);
			console.log(`table status is now ${table.status}`);
			assertion(table.status == 'over', "HAAAAAAAAALLLLLLLO")
		}
	} else {
		pl.score--;
	}
	let res = await sendMergeTable(table); // console.log('res', res)
}
async function sendMergeTable(table) { return await mPostRoute('mergeTable', valf(table, Clientdata.table)); }
















