function sockInit(){
	let server = getServerurl();
	Socket = io(server);
	Socket.on('message', showChatMessage);
	Socket.on('disconnect', x => console.log('::SOCK disconnect:', x));
	Socket.on('update', x => console.log('::SOCK update:', x));
	Socket.on('newTable', sockGetNewTable); //x => console.log('::SOCK table:', x));
	Socket.on('turnUpdate', sockGetTurnUpdate); //x => console.log('::SOCK table:', x));
	Socket.on('userChange', x => console.log('::SOCK userChange:', x));
}
function sockPostUserChange(oldname,newname){
	Socket.emit('userChange',{oldname,newname});
}
function sockPostMove(id,name,move){
	Socket.emit('move',{id,name,move});
}

function sockGetNewTable(x){
	let fen = x.fen;
	let tables = x.tables;
	Serverdata.tables = tables;
	console.log('::SOCK new table:',fen);
	console.log('... new table:',tables.find(x=>x.id == fen.id));

	Clientdata.fen = fen;
	natGameView(fen,getActivePlayer(fen));
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
