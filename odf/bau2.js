async function showTable(id) {
	//console.log('showTable', getUname()); //name, table.friendly, table.playerNames.includes(name));
	//console.log('Clientdata',Clientdata);
	let table = await mGetRoute('table', { id }); 
	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; console.log('___showTable'); //,me); //table.fen.players[me]);
	
	clear_timeouts();
	//await waitForUnlocked();
	//setLock();

	//natTitle();
	showTitle(`${table.friendly} ${me}`);

	let func=DA.funcs[table.game];
	await func.present(table); // await natPresent(fen, plname);
	mRise('dMain');

	//if this table contains robots, kann hier einen robot move ausloesen!
	//versuch das mal!!!
	//robotMove(me);

	if (!table.fen.turn.includes(me)) { return; }

	if (table.fen.players[me].playmode == 'bot') await func.robotMove(table,me); 
	else await func.activate(table);

	//resetLock();
	// DA.mc=0; if (TESTING && DA.mc++<2) await func.robotMove(table,me); else await func.activate(table);
}
function setLock(){console.log('locked');DA.LOCK=true;}
function resetLock(){console.log('frei');DA.LOCK=false;}
function isLocked(){return DA.LOCK==true;}
async function waitForUnlocked(){
	while(isLocked()){
		console.log('.')
	}
	return;
}





