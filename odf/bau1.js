async function sendMyMove(move,type) {
  let name = getUname(); 
	let table = Clientdata.table;
  let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = table.fen.turn;
	//console.log('___ sendMyMove',step,name); //type,move,turn)
	let res = await mPostRoute('move',{id,friendly,name,move,type,step,turn});
	//console.log('result',res)
  // sockPostMove(table, me, o);
}
async function onsockReceiveMove(o){
	let [e,mlist]=[o.event,o.moves];
	console.log('___ onsockReceiveMove',e.step,e.name,e.ts,mlist); return;
	let [id,friendly,name,move,type,step,turn,ts]=[e.id,e.friendly,e.name,e.move,e.type,e.step,e.turn,e.ts];
	let table = Clientdata.table;
	if (!table || table.id != id) {console.log(`not playing at table ${id}`); return;}

	let func = DA.funcs[table.game];
	//console.log('...process',type,turn,friendly);
	//somebody moved but fen has not changed

	//checkIfStepComplete
	// if (type == 'r1'){

	// 	table.step=step;
	// 	//stepComplete
	// 	//console.log('game',table.game)
	// 	func.stepComplete(table,o)
	// }

}
async function sendMoveComplete(fen) {
  let name = getUname(); 
	let table = Clientdata.table;
  let id = table.id;
	let friendly = table.friendly;
	let step = table.step;
	let turn = fen.turn;
	//console.log('___ sendMoveComplete',step,name); //type,move,turn)
	let res = await mPostRoute('moveComplete',{id,friendly,name,fen,step,turn});
	//console.log('result',res)
  // sockPostMove(table, me, o);
}














