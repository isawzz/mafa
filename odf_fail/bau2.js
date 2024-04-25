
async function showTable(table) {

	//ensure table
	if (!isDict(table)) { let id = table; table = await mGetRoute('table', { id }); }
	if (!table) { showMessage('table deleted!'); return await showTables('showTable'); }
	Clientdata.table = table;
	let me = getUname();

	console.log('table', table, get_now()); table.ts=get_now();
	H.push(table); 

	showTitle(`${table.friendly}`);
	let func = DA.funcs[table.game];
	mClear('dMain'); 
	let d = mDom('dMain',{w100:true,box:true,padding:12}); //, bg: '#00000080' }); mCenterFlex(d)
	//console.log('dims',getRectInt('dMain').w)
	[dOben, dOpenTable, dRechts] = tableLayoutMR(d);

	//main view
	let vid='main';
	V[vid] = func.presentTable(dOpenTable,table,me,100);
	func.presentStats(dOben,vid);
	mRise(d);



}

function isDead(table){return arrLast(H)!=table;}








