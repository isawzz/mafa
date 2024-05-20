
function showValidMoves(table){
	if (nundef(table.moves)) {console.log('no moves yet!'); return;}
	console.log('________',table.step)
	for(const m of table.moves){
		console.log(`${m.step} ${m.name}: ${m.move.map(x=>x.substring(0,4)).join(',')} (${m.change})=>${m.score}`);
	}
}

async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	//VALID TABLES SOLLEN NICHT UNBEDINGT DEN MOVE UNTERBRECHEN! es kann auch nur ein UI update sein!
	let me = getUname();
	let table = await mGetRoute('table', { id });	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game]; showValidMoves(table);//console.log('valid moves',table.moves);

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title
	d = mDom('dMain'); mCenterFlex(d); 
	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction
	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); 
	
	func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);

	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}

















