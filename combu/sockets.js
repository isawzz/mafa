function sockInit(){
	let server = getServerurl();
	Socket = io(server);
	Socket.on('deleteTable', sockGetDeleteTable); //x => console.log('::SOCK table:', x));
	Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
	Socket.on('message', showChatMessage);
	Socket.on('newTable', sockGetNewTable); //x => console.log('::SOCK table:', x));
	Socket.on('turnUpdate', sockGetTurnUpdate); //x => console.log('::SOCK table:', x));
	Socket.on('userChange', x => console.log('::SOCK userChange:', x));
	Socket.on('update', x => console.log('::SOCK update:', x));
}
function sockPostUserChange(oldname,newname){
	Socket.emit('userChange',{oldname,newname});
}
function sockPostMove(id,name,move){
	Socket.emit('move',{id,name,move});
}


function sockGetDeleteTable(x){
	let fen = x.fen;
	let tables = x.tables;
	Serverdata.tables = tables;
	console.log('::SOCK deleted table:',id);
	console.log('... new table:',tables.find(x=>x.id == fen.id));

	//wenn dieser user im play menu ist und ein spieler in dem spiel, dann wird das spiel jetzt geladen
	//sonst passiert garnix!
	let name=U.name;
	if (Clientdata.lastMenu == 'play' && fen.turn.includes(name)){
		Clientdata.fen = fen;
		Clientdata.lastTable = fen.id;
		natGameView(fen,getActivePlayer(fen));
	}
}
function sockGetNewTable(x){
	let table = x.table;
	let tables = x.tables;
	Serverdata.tables = tables;
	console.log('::SOCK new table:',table);
	//console.log('... new table:',tables.find(x=>x.id == fen.id));

	//wenn dieser user im play menu ist und ein spieler in dem spiel, dann wird das spiel jetzt geladen
	//sonst passiert garnix!
	let name=U.name;
	if (Clientdata.lastMenu == 'play' && fen.playerNames.includes(name)){
		Clientdata.fen = fen;
		Clientdata.lastTable = table;
		natGameView(table.fen,getActivePlayer(fen));
	}
}
function sockGetTurnUpdate(turn){
	console.log('::SOCK turn:',turn);
	Clientdata.fen.turn = turn;

	//startNatGame(Clientdata.fen);
	instructionUpdate();
	hourglassUpdate();
	tabtitleUpdate();
}

function instructionUpdate(){

}
function hourglassUpdate(){
	
}
function tabtitleUpdate(){
	
}
