async function showTable(table) {
	DA.counter += 1;
	//console.log('___showTable', DA.counter, getUname(), getPlaymode(table)); //name, table.friendly, table.playerNames.includes(name));//console.log('Clientdata',Clientdata);

	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } //console.log('id',id); }
	// else {console.log(table.fen.players[getUname()].playmode)}

	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; //console.log('___showTable'); //,me); //table.fen.players[me]);
	//console.log('table.status',table.status,table); return;

	clearEvents();
	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	await func.present(table);
	mRise('dMain');

	//console.log('table',table.fen); //return;

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return;

	//console.log('...proceeding with move')
	let mode = table.fen.players[me].playmode;
	if (mode == 'bot') return await func.botMove(table, me);
	else if (mode == 'hybrid') return await func.hybridMove(table, me);
	else if (mode == 'human') return await func.activate(table);

}

