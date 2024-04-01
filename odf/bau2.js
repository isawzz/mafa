
async function showTable(id) {
	//console.log('showTable', name, table, table.playerNames.includes(name));
	//console.log('Clientdata',Clientdata);
	let table = await mGetRoute('table', { id });
	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table;
	clear_timeouts();

	//natTitle();
	showTitle(`${table.friendly} ${me}`)

  // await natPresent(fen, plname);
	await DA.funcs[table.game].present(table);
  mRise('dMain');

  if (!table.fen.turn.includes(me)) {    return;  }
  
	//selPrep(fen); natPreAction()
	await DA.funcs[table.game].activate(table);


}
function sendMyMove(o) {
  let me = getUname(); 
  let table = Clientdata.table.id;
	console.log('sendMyMove',me,Clientdata)
  sockPostMove(table, me, o);
}



