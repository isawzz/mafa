async function showTable(table) {
	INTERRUPT(); //reentrance?!?!?
	DA.counter += 1; let me = getUname();
	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } 
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; DA.tsTable=DA.merged;

	clearEvents();
	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	T = {};
	let items = T.items = await func.present('dMain',table);
	mRise('dMain');

	let playmode = getPlaymode(table,me);
	if (TESTING) testUpdateTestButtons();

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return;

	if (playmode == 'bot') return await func.botMove(table, items, me);
	else return await func.activate(table, items);

}

