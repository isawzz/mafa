function uiGadgetTypeDoubleList(form, dict, styles = {}, opts = {}) {

	





	let select = DA.select=mDom(form,styles,{className:'input',tag:'select'});
	//console.log('dict',dict);
	if (isList(dict)) dict = list2dict(dict);
	mDom(select, {}, { tag: 'option', html: '' });

	//console.log('dict',dict)
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		mDom(select, {}, { tag: 'option', html: content, value: val });
	}
	mDom(form, { display:'none' }, { tag: 'input', type: 'submit' });
	select.addEventListener('change',()=>form.submit());
	return () => {console.log('selected',DA.select,DA.select.value);return DA.select.value;}
}
