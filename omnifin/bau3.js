function dbq(q) {	return DB.exec(q);}

function dboutput(q){
	let result = dbq(q);
	return output = result.map(({ columns, values }) => {
		return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	}).join('\n\n');
}
function dbtable(q,dParent){
	let result = dbq(q)[0];
	let di={dateof:'date',sender_name:'from',sender_owner:'owner',receiver_name:'to',receiver_owner:'owner',description:'note'};
	let headers = result.columns.map(x => valf(di[x], x));
	let t=mTable(dParent, headers, true);
	for(const rec of result.values){
		let r = mDom(t,{},{tag:'tr'});
		console.log(rec); 
		for(const s of rec){
			mTableCol(r,s)
		}
	}
}
function dbview(q,dParent,fformat){
	let result = dbq(q)[0];

	let di={dateof:'date',sender_name:'from',sender_owner:'owner',receiver_name:'to',receiver_owner:'owner',description:'note'};
	let headers = result.columns.map(x => valf(di[x], x));
	let t=mTable(dParent, headers, true);
	for(const rec of result.values){
		let r = mDom(t,{},{tag:'tr'});
		console.log(rec); 
		for(const s of rec){
			mTableCol(r,s)
		}
		
		//return;
	}

	// return output = result.map(({ columns, values }) => {
	// 	return columns.join('\t') + '\n' + values.map(row => row.join('\t')).join('\n');
	// }).join('\n\n');
}
