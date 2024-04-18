async function showTable(table) {
	DA.counter += 1;
	let me = getUname();
	//console.log('___showTable', DA.counter, me, getPlaymode(table,me)); //name, table.friendly, table.playerNames.includes(name));//console.log('Clientdata',Clientdata);

	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); } //console.log('id',id); }
	// else {console.log(table.fen.players[me].playmode)}


	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; //console.log('___showTable'); //,me); //table.fen.players[me]);
	if (TESTING) testUpdateTestButtons();
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
	let playmode = getPlaymode(table,me);
	if (playmode == 'bot') return await func.botMove(table, me);
	else if (playmode == 'hybrid') return await func.hybridMove(table, me);
	else return await func.activate(table);

}

