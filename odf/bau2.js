
async function showTable(table, name) {
	//console.log('showTable', name, table, table.playerNames.includes(name));
	//console.log('Clientdata',Clientdata);
	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(name)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

  clear_timeouts();


	//natTitle();
	showTitle(`${table.friendly} ${name}`)

  // await natPresent(fen, plname);
	await DA.funcs[table.game].present(table,name);
  mRise('dMain');

  if (!table.fen.turn.includes(name)) {    return;  }
  
	//selPrep(fen); natPreAction()
	await DA.funcs[table.game].activate(table,name);


}
function sendMyMove(o) {
  let name = getUname(); //U.name;
  let table = Clientdata.table.id;
  sockPostMove(table, name, o);
}



