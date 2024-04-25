function setPresentTable(dParent, table, name, sz) {
	const colors = { red: '#e74c3c', green: '#27ae60', purple: 'indigo' }; //'#4b0082' //'#8e44ed' }; //'blueviolet' }; //'#8e44ad' };
	setLoadPatterns('dPage', colors);

	let [fen, playerNames, players, turn] = [table.fen, table.playerNames, table.fen.players, table.fen.turn];
	let cards = fen.cards;
	let dp = mDom(dParent, { w100: true }); mCenterFlex(dp);
	let dBoard = mGrid(cards.length / 3, 3, dp, { gap: isdef(sz) ? sz / 8 : 14 });
	let items = [];
	for (const c of cards) {
		//mDom(dBoard,{},{html:c})
		let d = setDrawCard(c, dBoard, colors, isdef(sz) ? sz : TESTING ? 80 : 100);
		let item = mItem({ div: d }, { key: c });
		items.push(item);
	}
	return { dBoard, items, div:dParent, table, name, sz };
}
