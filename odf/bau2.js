
async function showTable(id) {
	//console.log('showTable', getUname()); //name, table.friendly, table.playerNames.includes(name));//console.log('Clientdata',Clientdata);
	let table = await mGetRoute('table', { id }); 
	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; //console.log('___showTable'); //,me); //table.fen.players[me]);
	//console.log('table.status',table.status,table); return;
	
	clearTable();
	showTitle(`${table.friendly} ${me}`);
	let func=DA.funcs[table.game];
	await func.present(table); 
	mRise('dMain');

	//console.log('table',table.fen); //return;

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return; 

	if (table.fen.players[me].playmode == 'bot') await func.robotMove(table,me); 
	else await func.activate(table);

}





