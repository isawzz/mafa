
function showTableSortedBy(dParent,records,headers,header){
	if (DA.sortedBy == header) {sortByDescending(records, header);DA.sortedBy = null;}
	else {sortBy(records,header); DA.sortedBy=header;}
	
	mClear(dParent);
	mText(`<h2>transactions</h2>`, dParent, { maleft: 12 })
	let t = UI.tables = mDataTable(records, dParent, null, headers, 'records');
	console.log(t,t.div)
	let headeruis = Array.from(iDiv(t).firstChild.getElementsByTagName('th'));
	for(const ui of headeruis){
		//console.log(ui)
		mStyle(ui,{cursor:'pointer'});
		ui.onclick = ()=>showTableSortedBy(dParent,records,headers,ui.innerHTML);
	}
}
async function showTransactions(res) {

	console.log(res);
	let headers = res.columns; //getHeaderNames(res.columns);
	let records = [];
	for(const row of res.values){
		let o={};
		for(let i=0;i<headers.length;i++){ 
			o[headers[i]]=row[i];
		}
		records.push(o);
	}

	//return;
	let dParent = mBy('dT');
	if (isdef(dParent)) { mClear(dParent); }
	else dParent = mDom('dMain', {}, { className: 'section', id: 'dT' });
	if (isEmpty(records)) { mText('no records', dParent); return []; }

	records.map(x => x.amount = Number(x.amount));
	records.map(x => x.from = `${x.sender_name} (${x.sender_owner})`);
	records.map(x => x.to = `${x.receiver_name} (${x.receiver_owner})`);
	let units=['$','€'];
	records.map(x => x.amt = `${x.unit<units.length?units[x.unit]:'?'}${x.amount}`);
	//records.map(x=>x.note=x.description.substring(0,20));

	showTableSortedBy(dParent,records,['id','dateof','from','to','amount','unit'],'dateof');
	// mTableCommandify(t.rowitems.filter(ri => ri.o.status != 'open'), {
	// 	0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	// });
	// mTableStylify(t.rowitems.filter(ri => ri.o.status == 'open'), { 0: { fg: 'blue' }, });
	// let d = iDiv(t);
	// for (const ri of t.rowitems) {
	// 	let r = iDiv(ri);
	// 	let id = ri.o.id;
	// 	if (ri.o.prior == 1) mDom(r, {}, { tag: 'td', html: getWaitingHtml(24) });
	// 	if (ri.o.status == 'open') {
	// 		let playerNames = ri.o.playerNames;
	// 		if (playerNames.includes(me)) {
	// 			if (ri.o.owner != me) {
	// 				let h1 = hFunc('leave', 'onclickLeaveTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
	// 			}
	// 		} else {
	// 			let h1 = hFunc('join', 'onclickJoinTable', ri.o.id); let c = mAppend(r, mCreate('td')); c.innerHTML = h1;
	// 		}
	// 	}
	// 	if (ri.o.owner != me) continue;
	// 	let h = hFunc('delete', 'onclickDeleteTable', id); let c = mAppend(r, mCreate('td')); c.innerHTML = h;
	// 	if (ri.o.status == 'open') { let h1 = hFunc('start', 'onclickStartTable', id); let c1 = mAppend(r, mCreate('td')); c1.innerHTML = h1; }
	// }
}
