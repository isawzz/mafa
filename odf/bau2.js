
async function showGamePlayers(dParent, gamename) {
	let users = await mGetRoute('users');
	//console.log('users',users);

	let d = mDom(dParent, { display: 'flex', gap: 6, wrap: true })
	DA.playerlist = [];
	DA.allPlayers = [];
	DA.lastName = null;
	//let params = [gamename, DA.playerlist];
	let funcs = [style_not_playing, style_playing_as_human, style_playing_as_bot];

	let me = getUname();
	for (const name in users) {
		let d1 = mDom(d, { cursor: 'pointer' });
		d1.setAttribute('username', name)
		let img = showUserImage(name, d1, 40); //for(const i of range(3))showUserImage(name,d,40);
		let label = mDom(d1, { matop: -4, fz: 12, hline: 12 }, { html: name });

		let item = { name, div: d1, state: 0, strategy: '', isSelected: false };
		DA.allPlayers.push(item);
		if (name == me) { toggle_select(item, funcs, gamename, DA.playerlist); DA.lastName = name; }
		else d1.onclick = onclickGameMenuPlayer;

	}
}


function getPlaymode(idOrTable){
	if (isDict(idOrTable)) {
		let table = idOrTable;
		return isdef(table.fen)?table.fen.players[getUname()].playmode:'no fen';
	}else if (Clientdata.table){
		return Clientdata.table.id == idOrTable?Clientdata.table.fen.players[getUname()].playmode:'wrong table';
	}else return 'NO table!';
}
async function showTable(table) {
	DA.counter+=1;
	//console.log('___showTable', DA.counter, getUname(), getPlaymode(table)); //name, table.friendly, table.playerNames.includes(name));//console.log('Clientdata',Clientdata);
	
	if (!isDict(table)) {let id=table;table = await mGetRoute('table', { id });} //console.log('id',id); }
	// else {console.log(table.fen.players[getUname()].playmode)}
	
	let me = getUname();

	if (!table) { showMessage('table deleted!'); return await showTables(); }
	else if (!table.playerNames.includes(me)) { showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`); Clientdata.table = null; return; }

	Clientdata.table = table; //console.log('___showTable'); //,me); //table.fen.players[me]);
	//console.log('table.status',table.status,table); return;
	
	clearEvents();
	showTitle(`${table.friendly}`);
	let func=DA.funcs[table.game];
	await func.present(table);  
	mRise('dMain');

	//console.log('table',table.fen); //return;

	if (table.status == 'over') return showGameover(table);

	if (!table.fen.turn.includes(me)) return; 

	//console.log('...proceeding with move')
	let mode = table.fen.players[me].playmode;
	if (mode == 'bot') return await func.botMove(table,me); 
	else if (mode == 'hybrid') return await func.hybridMove(table,me); 
	else if (mode == 'human') return await func.activate(table);

}





