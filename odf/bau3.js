
async function showTable(table, name) {
	//console.log('showTable', name, table, table.playerNames.includes(name));
	//console.log('Clientdata',Clientdata);
	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(name)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	DA.funcs[table.game].present(table,name);

}
function getGameFriendly(game){return Serverdata.config.games[game].friendly;}

















