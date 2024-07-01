function dbq(q) {	return DB.exec(q);}
function dboutput(q){
	let result = dbq(q);
	return output = result.map(({ columns, values }) => {
		return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	}).join('\n\n');
}
function dbtable(q,dParent){
	let result = dbq(q)[0];

	let t=mTable(dParent, result.columns, true);
	for(const rec of result.values){
		console.log(rec); return;
	}

	// return output = result.map(({ columns, values }) => {
	// 	return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	// }).join('\n\n');
}
