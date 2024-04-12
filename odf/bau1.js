async function setOnclickCard(item, items) {
	//console.log('click', item.key)
	toggleItemSelection(item);
	let selitems = items.filter(x => x.isSelected);
	let [keys, m] = [selitems.map(x => x.key), selitems.length];
	if (m == 3 || TESTING && m == 3) {
		mShield(dOpenTable, { bg: '#00000000' }); //disable ui
		let [me, table] = [getUname(), Clientdata.table];
		let [fen, pl] = [table.fen, table.fen.players[me]];
		let isSet = checkIfSet(keys); //console.log('isSet', isSet); //check if set condition is met
		if (isSet || TESTING) { //if yes, increase score, remove items, add 3 new items
			// <12:0 (deck should be Empty), 12:3, 13:2, 14:1, ab 15:0
			assertion(fen.cards.length>=12 || isEmpty(fen.deck),`LOGISCHER IRRTUM SET REPLENISH ${fen.cards.length}, deck:${fen.deck.length}`)
			let toomany = Math.max(0, fen.cards.length - 12); // replenish cards
			let need = Math.max(0,3 - toomany); //wenn 16 cards, soll trotzdem nur 3 replacen!
			let newCards = deckDeal(fen.deck, need); //returns [] if deck empty!
			for (let i = 0; i < 3; i++) if (i < newCards.length) arrReplace1(fen.cards, keys[i], newCards[i]); else removeInPlace(fen.cards, keys[i])
			pl.score++;
		} else {
			pl.score--;
		}
		let res = await mPostRoute('mergeTable', table); // console.log('res', res)
	}
	else if (m >= 1) disableButton(T.bHint); else enableButton(T.bHint);
}
async function setOnclickNoSet(){
	mShield(dOpenTable, { bg: '#00000000' }); //disable ui
	let [me, table] = [getUname(), Clientdata.table];
	let [fen, pl] = [table.fen, table.fen.players[me]];
	
	if (isEmpty(T.sets)){ //if there is no set, increase score, add 1 card
		pl.score++;
		let newCards = deckDeal(fen.deck,1); //add 1 cards!
		if (!isEmpty(newCards))	fen.cards.push(newCards[0]);
		else {
			setGameover(table);
			console.log(`table status is now ${table.status}`);
			assertion(table.status == 'over',"HAAAAAAAAALLLLLLLO")
		}
	}else{
		pl.score--;
	}
	let res = await mPostRoute('mergeTable', table); // console.log('res', res)
}
















