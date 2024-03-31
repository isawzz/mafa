
async function switchToTable(id) {
  console.log('switchToTable!!!',id)
  let res = Clientdata.table = await mGetRoute('table', { id });
  await showTable(res, getUname())
}
async function onclickTable(id) { 
	console.log('_____ onclickTable')
	await switchToTable(id); 
}
async function onclickJoinTable(id){
	//console.log(U.name,'clicked join',id);
	let table = Serverdata.tables.find(x=>x.id == id);
	assertion(nundef(table.players.find(x=>x.name == U.name)),'already joined!!!');
	table.players.push(createHumanPlayer(U.name));
	table.playerNames = table.players.map(x=>x.name);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames:table.playerNames });
	console.log('res',res);
}
async function onclickLeaveTable(id){
	//console.log(U.name,'clicked leave',id);
	let table = Serverdata.tables.find(x=>x.id == id);
	assertion(isdef(table.players.find(x=>x.name == U.name)),'not in joined players!!!!');
	//console.log('players',table.players);
	let player=table.players.find(x=>x.name == U.name);
	removeInPlace(table.players,player); 
	table.playerNames = table.players.map(x=>x.name);
	let res = await mPostRoute('postTable', { id, players: table.players, playerNames:table.playerNames });
	console.log('res',res);
}
async function onclickOpenToJoinGame(){
	console.log('_____ onclickOpenToJoinGame')
	let options = collectOptions();
	let players = collectPlayers(options);
	let t = createOpenTable(DA.gamename,players,options);
	let res = await mPostRoute('postTable', t);
}
async function onclickStartGame(){
	console.log('_____ onclickStartGame')
	let options = collectOptions();
	let players = collectPlayers(options); 

	//console.log(jsCopy(players))
	let name=getUname();	let names = [name];if (name=='felix')names.push('amanda'); else names.push('felix');
	players = names.map(x=>createHumanPlayer(x)); // TEST!
	//console.log(jsCopy(players))

	await startGame(DA.gamename,players,options);
}
async function onclickStartTable(id) {
	console.log('_____ onclickStartTable')
	let table = Serverdata.tables.find(x => x.id == id); assertion(isdef(table), `table with id ${id} not in Serverdata!`);
	table =  setTableToStarted(table);
	let res = await mPostRoute('postTable', table); 
	//console.log('res', res);
}
async function startGame(gamename,players,options){
	let table = createOpenTable(gamename,players,options);
	table = setTableToStarted(table); //fen is created here!!!!
	let res = await mPostRoute('postTable', table); 

}
async function natCreateGame() {
  let id = generateTableId();
  let fen = natCreate(U.name, ['felix', 'amanda']); //{felix:{level:'emperor'},lili:{civ:'rome'},lauren:{civ:'mongolia'}});
  let s = JSON.stringify(fen);
  let res = await mPostRoute('postTable', { status:'started', id: id, fen: fen, game: 'nations', friendly: generateTableName(fen.numPlayers) });
}














