
async function showTable(table, name) {
	//console.log('showTable', name, table, table.playerNames.includes(name));
	console.log('Clientdata',Clientdata);
	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(name)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null;return; }
	else {
		let func = window[table.game]; assertion(isdef(func), `GAME ${table.game.toUpperCase()} NOT YET IMPLEMENTED!`);
		let o = func(); assertion(o && isdef(o.present), isdef(func), `GAME ${table.game.toUpperCase()} HAS NO VALID present FUNCTION!`);

		o.present(table,name);

		return;
	}

	// else if (table.game == 'nations') { await natGameView(table.fen, name); }
	showMessage(`GAME ${table.game.toUpperCase()} NOT YET IMPLEMENTED!`); Clientdata.table = null;
}


















