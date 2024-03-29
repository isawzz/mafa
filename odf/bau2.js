
async function startGame(gamename,players,options){
	let table = createOpenTable(gamename,players,options);
	table = setTableToStarted(table);
	let res = await mPostRoute('postTable', table); 

}




