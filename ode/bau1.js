
function toNameValueList(any){
	if (isEmpty(any)) return [];
	let list=[];
	if (isString(any)){
		let words = toWords(any);
		for(const w of words){list.push({name:w,value:w})};
	}else if (isDict(any)){
		for(const k in any){list.push({name:k,value:any[k]})};
	}else if (isList(any) && !isDict(any[0])){
		for(const el of any) list.push({name:el,value:el});
	}else if (isList(any) && isdef(any[0].name)  && isdef(any[0].value)) {
		list = any;
	}else {
		let el=any[0];
		let keys = Object.keys(el);
		let nameKey=keys[0];
		let valueKey=keys[1];
		for(const x of any){
			list.push({name:x[nameKey],value:x[nameKey]});
		}
	}
	return list;
}
function uiTypeSelect(any, handler, form, styles = {}, opts = {}) {

	let list=toNameValueList(any);
	//console.log(list); //return;

	let d = form; // mDom(dParent, { overy: 'auto' }); //hier drin kommt das select elem
	let id = getUID();
	let dselect = mDom(d, styles, { className: 'input', tag: 'select', id });
	for(const el of list){
		//console.log(el.name,el.value)
		mDom(dselect, {}, { tag: 'option', html: el.name, value: el.value });
	}
	// dselect.onchange = ()=>isdef(opts.handler)??opts.handler(id); //ev=>console.log('changed',id,mBy(id).value);

	if (nundef(handler)) handler = ()=>console.log(id,'value changed to',mBy(id).value)

	dselect.onchange = ev=>{ev.preventDefault();handler(mBy(id).value);}// ()=>{form.setAttribute('proceed',mBy(id).value)}; //;form.submit(); } //console.log('changed',id,mBy(id).value);
	return dselect;
}
function uiGadgetTypeSelect(form, content, styles = {}, opts = {}) {

	mStyle(form,{bg:'red',padding:10}); //,wmin:'100vw',hmin:'100vh'});
	let d=mDom(form);
	let handler = selval=>{
		form.setAttribute('proceed',selval);
		//form.submit();
	}
	let select = uiTypeSelect(content,handler,d,styles,opts);
	//mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	//return () => form.getAttribute('proceed');
	return () => form.getAttribute('proceed');
}








