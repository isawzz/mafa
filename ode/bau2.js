
function showDetailsPresentation(o, dParent) {
	let onew = {};
	//console.log(o);
	let nogo = ['ooffsprings','name', 'cats', 'colls', 'friendly', 'ga', 'fa', 'fa6', 'text', 'key', 'nsize', 'nweight', 'img', 'photo']
	for (const k in o) {
		if (nogo.includes(k)) continue;
		let val = o[k];
		let knew = k == 'ofoodtype'?'foodtype':k;
		if (isString(val)) {
			val = replaceAll(val,'>-','');
			val = val.trim();
			if (val.startsWith("'")) val=val.substring(1);
			if (val.endsWith("'")) val=val.substring(0,val.length-1);
			if (val.includes(':')) val=stringAfter(val,':')
			onew[knew] = capitalize(val.trim());
		}
		if (k == 'food') console.log(onew[knew])
	}
	onew = sortDictionary(onew);

	let d=mDom(dParent,{w:window.innerWidth*.8})
	let t=mTable(d);
	for(const k in onew){
		let r = mCreate('tr');
		mAppend(t, r);
		let col = mCreate('td'); mAppend(r, col); col.innerHTML = `${k}: `;
		col = mCreate('td'); mAppend(r, col); mDom(col,{},{html:`${onew[k]}`});
	}
	return t;
	// let d=mGrid(null,2,dParent,{gap:4,w:604});
	// for(const k in onew){
	// 	mDom(d,{align:'right',w:160},{html:`${k}: `});
	// 	mDom(d,{w:440},{html:onew[k]})
	// 	//mDom(d,{},{html:`${k}: ${onew[k]}`})
	// 	//mLinebreak(dParent,0)
	// }

	//showObject(onew, null, dParent);
}








