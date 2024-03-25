
async function onclickStartTable(id) {
	//console.log('BINGO!!!!!!!!!!!!!', id);
	let table = Serverdata.tables.find(x => x.id == id); assertion(isdef(table), `table with id ${id} not in Serverdata!`);

	let status = 'started';
	console.log(id,table.game, table.friendly, table.players);

	//create initial fen
	let fen = DA.funcs[table.game].setup(table);
	//postTable
	let res = await mPostRoute('postTable', { id, status, fen });
	console.log('res', res);
}


















