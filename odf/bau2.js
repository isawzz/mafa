
async function showTable(id) {
	//console.log('showTable', getUname()); //name, table.friendly, table.playerNames.includes(name));
	//console.log('Clientdata',Clientdata);
	let table = await mGetRoute('table', { id });
	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.curTable = null; return; }

	Clientdata.curTable = table;
	clear_timeouts();

	//natTitle();
	showTitle(`${table.friendly} ${me}`)

	let func=DA.funcs[table.game];
	await func.present(table); // await natPresent(fen, plname);
	mRise('dMain');

	//if this table contains robots, kann hier einen robot move ausloesen!
	//versuch das mal!!!
	//robotMove(me);

	if (!table.fen.turn.includes(me)) { return; }

	await func.activate(table);
	//await func.robotMove(table,me);
	// if (coin()) await func.robotMove(table,me);
	// else await func.activate(table); //selPrep(fen); natPreAction()




}



