
function uiGadgetTypeMultiText(dParent, dict, resolve, styles = {}, opts = {}) {
	let inputs = [];
	let wIdeal = 500;
	let formStyles = { maleft: 10, wmin: wIdeal, padding: 10, bg: 'white', fg: 'black' };
	// let form = mDom(dParent, formStyles, { tag: 'form', method: null, action: "javascript:void(0)" })
	let form = mDom(dParent, formStyles, {})
	
	addKeys({ className: 'input', tag: 'textarea', }, opts);
	addKeys({ fz: 14, family: 'tahoma', w: wIdeal, resize: 'none' }, styles);

	let df=mDom(form);
	let db = mDom(form, { vmargin: 10, align: 'right' });
	mButton('Cancel', ev => resolve(null), db, { classes: 'button', maright: 10 });
	mButton('Save', ev => {
		let di = {};
		inputs.map(x => di[x.name] = x.inp.value);
		resolve(di);
	}, db, { classes: 'button', maright: 10 });

	if (isEmpty(dict)){
		fillFormFromObject(inputs,wIdeal, df,db,styles,opts);
	}else{
		fillMultiForm(dict,inputs,wIdeal,df,styles,opts);
	}
	// for (const k in dict) {
	// 	let [content, val] = [k, dict[k]];
	// 	mDom(form, {}, { html: `${content}:` });
	// 	let inp = mDom(form, styles, opts);
	// 	inp.rows = calcRows(styles.fz, styles.family, val, wIdeal); //console.log('rows',inp.rows)
	// 	inp.value = val;
	// 	inputs.push({ name: content, inp: inp });
	// 	mNewline(form)
	// }
	//mButton('Paste Object', ev => fillFormFromObject(inputs,wIdeal, df,styles,opts), db, { classes: 'button', maright: 10 });

	// mDom(db, { maright:10,className:'button' }, { tag: 'input', type: 'button', value:'Paste Object', onclick:ev=>fillFormFromObject(ev,inputs,form) });
	// mDom(db, { maright:10,className:'button' }, { tag: 'input', type: 'button', value:'Cancel', onclick:()=>resolve(null) });
	// mDom(db, { className:'button' }, { tag: 'input', type: 'submit', value:'Save' });
	//mButton('done', handler, dOuter, { classes: 'input', margin: 10 });
	// let handler = () => resolve(getCheckedNames(ui)); //.join('@'));
	// form.onsubmit = ev => {
	// 	ev.preventDefault();
	// 	let di = {};
	// 	inputs.map(x => di[x.name] = x.inp.value);
	// 	resolve(di);
	// }
	return form;
}













