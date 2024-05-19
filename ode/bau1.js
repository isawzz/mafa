
async function showTable(id) {
	//INVALID TABLES KOMMEN GARNICHT HIERHER!!!
	let me = getUname();
	let table = await mGetRoute('table', { id });
	//console.log('table',table)
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }

	let func = DA.funcs[table.game];

	if (table.status == 'started' && isdef(table.pending)) {
		func.resolvePending(table); // deterministic!!! (table.pending)
		if (table.status == 'over') { mPostRoute('postTable', table); return; }
	}

	T = table;
	clearMain();
	let d = mBy('dExtraLeft'); d.innerHTML = `<h2>${table.friendly} (${table.step})</h2>`; // title

	//let tableSize = calcHeightLeftUnder('dExtra') - 40; //height visible in browser
	d = mDom('dMain'); mCenterFlex(d); //console.log(getRect('dMain'))

	mDom(d, { className: 'instruction' }, { id: 'dInstruction' }); mLinebreak(d); // instruction

	mDom(d, {}, { id: 'dStats' }); mLinebreak(d); func.stats(table); // player stats

	let minTableSize = 400; // present
	let dTable = mDom(d, { hmin: minTableSize, wmin: minTableSize, margin: 20, round: true, className: 'wood' }, { id: 'dTable' });
	mCenterCenter(dTable);
	let items = func.present(table);


	if (table.status == 'over') { showGameover(table, 'dTitle'); return; }

	assertion(table.status == 'started', `showTable status ERROR ${table.status}`);

	await updateTestButtonsPlayers(table); // right side buttons

	func.activate(table, items); // activate

}

















