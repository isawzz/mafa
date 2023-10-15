onload = start

async function start() { test0(); }

async function test0() {
	let emos = M.emos = await mGetYaml('../assets/m.yaml');
	let cats = M.cats = collectCats(emos); cats.sort(); //console.log('cats', cats); 

	let d = mDom('dMain');
	mFlexWrap(d);
	let dDrop = mDom(d, {}, { id: 'dDrop', classes: 'dropZone' }); mDropZone(dDrop);

	let dForm = mDom(d, {}, { tag: 'form', onsubmit:ev=>event.preventDefault() });

	mDom(dForm, {}, { html: 'Category:' }); let dl = mDatalist(dForm, cats);
	// mDom(dForm, {}, { html: 'Category:' }); let dl = myDatalist(dForm, cats);

}
function mDatalist(dParent, list, opts = {}) {
	var mylist = list;
	var opts = opts;
	addKeys({ alpha: true, edit: true, filter: 'contains'},opts); // matches: (x, inputVal) => x.startsWith(inputVal.toLowerCase()) },opts)

	let d = mDiv(toElem(dParent));
	let optid = getUID('dl');
	mDom(d, {}, { tag: 'input', className: 'datalistInput', placeholder: "<enter value>" });
	mDom(d, {}, { tag: 'datalist', id: optid, className: 'datalist' });

	var elem = d;
	var inp = elem.firstChild;
	var datalist = elem.lastChild;

	inp.setAttribute('list', optid);
	// console.log('datalist',elem,inp,datalist)
	
	function update() {
		let val = valf(inp.value,'');
		if (isEmpty(val)) return;
		if (mylist.includes(val)) return;
		mylist.push(val);
		if (opts.alpha) mylist.sort();
		let i=mylist.indexOf(val);
		//if (opts.alpha) addIfAlpha(mylist,val); else addIf(mylist,val);
		inp.value = ''; //clear input
		if (opts.filter == 'contains') { let el=mDom(datalist, {}, { tag: 'option', value: val }); mInsertAt(datalist,el,i) }
		else populate();
	}
	function populate() {
		//if (isdef(datalist.firstChild) && opts.filter == 'contains') return;
		let val = valf(inp.value,''); val=val.toLowerCase();
		datalist.innerHTML = '';
		//console.log('datalist',datalist)
		let filteredList = isEmpty(val)?mylist:mylist.filter(x => opts.matches(x, val));
		//console.log('filtered',filteredList)
		for (const w of filteredList) { mDom(datalist, {}, { tag: 'option', value: w }); }
	}
	populate();
	
	if (opts.edit) inp.addEventListener('keyup', ev => {	if (ev.key === 'Enter') update(); });
	if (isdef(opts.matches)) inp.addEventListener('input', populate);

	return {
		list: mylist,
		elem: elem,
		inpElem: inp,
		listElem: datalist,
		opts: opts,
		populate: populate,

	}
}







function arrInsertAt(arr, x, i) {
	arr.splice(i, 0, x);
	return arr;
}
function addIfAlpha(arr,val){
	console.log('arr',arr,'val',val)
	let i = 0;
	for (const v of arr) {
		if (v == val) { break; } //console.log('found val', v); break; }
		else if (v > val) { arrInsertAt(arr, val, i); break; }
		else if (i == arr.length-1) arr.push(val);
		i++;
	}
	console.log('i',i,'len',arr.length,arr)
	return i;
}



function mForm(dParent, listOfInputs = [], styles = {}, opts = {}) {
	dParent = toElem(dParent);
	addKeys({ tag: 'form' }, opts);
	let dForm = mDom(dParent, styles, opts);
	for (const o of listOfInputs) {
		if (isString(o)) {
			let dLabel = mDom(dForm, {}, { tag: 'span', html: o + ':' });
			mDom(dForm, {}, { tag: 'br' });
			let dInput = mDom(dForm, {}, { tag: 'input', name: o, type: 'text' });
			mDom(dForm, {}, { tag: 'br' });
			mDom(dForm, {}, { tag: 'br' });
		} else {
			addKeys({ tag: 'input', type: 'text', html: valf(o.label, 'value') }, o);
			if (isdef(o.label)) {
				let dLabel = mDom(dForm, {}, { tag: 'span', html: o.label + ':' });
				mDom(dForm, {}, { tag: 'br' });
			}
			if (o.tag == 'select') {
				let d = mSelect(dForm, o.options);
			} else {
				let d = mDom(dForm, {}, { tag: 'input', name: o.html, type: o.type });
			}
			mDom(dForm, {}, { tag: 'br' });
			mDom(dForm, {}, { tag: 'br' });
		}
	}
	return dForm;
}







