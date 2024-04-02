async function sendMyMove(move,type) {
  let name = getUname(); 
	let table = Clientdata.table;
  let id = table.id;
	let friendly = table.friendly;
	let step = valf(table.step,0);
	let turn = table.fen.turn;
	console.log('sendMyMove',step,name); //type,move,turn)
	mPostRoute('move',{id,friendly,name,move,type,step,turn})
  // sockPostMove(table, me, o);
}

function onsockReceiveMove(o){
	//integrate move according to type and complete step if complete
	console.log('onsockReceiveMove',o.step,o.name);
	let [id,friendly,name,move,type,step,turn]=[o.id,o.friendly,o.name,o.move,o.type,o.step,o.turn];
	let table = Clientdata.table;
	if (!table) {console.log(`not playing at table ${id}`)}

	//checkIfStepComplete
	if (type == 'race1'){
		table.step=step;
		//stepComplete
		console.log('game',table.game)
		DA.funcs[table.game].stepComplete(table,o)
	}

}
















