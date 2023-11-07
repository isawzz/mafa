function collectionAddEmpty(ev){ //val,inp){
	if (ev.key != 'Enter') return;
	console.log('onupdate',ev.target,ev.target.value); 
	let val = ev.target.value;
	addIf(M.collections,val);
	M.collections.sort()
	//M.collections.push(val);
	M.byCollection[val] = [];
	initCollection(val);
	return;

	let inp = ev.target;
	let dlid = inp.getAttribute('list');
	console.log('datalist',mBy(dlid)); 
	let dl = mBy(dlid);
	mDom(dl, {}, { tag: 'option', value: inp.value });
	return;
	console.log('would you like to add a new collection',val,'???');
	M.collections.push(val);
	M.byCollection[val] = [];
	console.log('inp'.inp)
	mDom(mBy(inp.list), {}, { tag: 'option', value: val });
	//simplest: add it, send info to m2
}
function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	// addKeys({ alpha: true, edit: false, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)
	addKeys({ alpha: true, filter: 'contains' }, opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {w:200}, { tag: 'input', className: 'input', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;
	for (const w of mylist) { mDom(datalist, {}, { tag: 'option', value: w }); }

	inp.setAttribute('list', optid);
	// console.log('datalist',elem,inp,datalist)

	function ____update() {
		console.log('update!!!')
		let val = valf(inp.value, '');
		if (isEmpty(val)) return;
		if (mylist.includes(val) || !opts.edit) {console.log('cannot update!'); return; }
		console.log('val',val,opts)
		mylist.push(val);
		if (opts.alpha) mylist.sort();
		let i = mylist.indexOf(val);
		inp.value = ''; //clear input
		if (opts.filter == 'contains') { let el = mDom(datalist, {}, { tag: 'option', value: val }); mInsertAt(datalist, el, i) }
		else populate();

		//hier muss der value bei dem collections ding zu M.collections und M.byCollection muss zu [] initialisiert werden und zum server gesendet!
		if (isdef(opts.onupdate)) opts.onupdate(val);
	}
	function ___populate() {
		//if (isdef(datalist.firstChild) && opts.filter == 'contains') return;
		let val = valf(inp.value, ''); val = val.toLowerCase();
		datalist.innerHTML = '';
		//console.log('datalist',datalist)
		let filteredList = isEmpty(val) ? mylist : mylist.filter(x => opts.matches(x, val));
		//console.log('filtered',filteredList)
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	//populate();


	//if (opts.edit) inp.addEventListener('keyup', ev => { if (ev.key === 'Enter') update(); });
	if (opts.onupdate) inp.addEventListener('keyup', opts.onupdate); //ev => { if (ev.key === 'Enter') opts.onupdate(ev.target.value,ev.target); });
	//if (isdef(opts.matches)) inp.addEventListener('input', populate);
	inp.onmousedown = () => inp.value = ''

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		//populate: populate,

	}
}






































