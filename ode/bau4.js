
function _fillFormFromObject(ev, inputs, form) {
	//let form = 
	let popup = mPopup(form, { margin: 100 }); //mStyle(popup,{left:10})
	mDom(popup, {}, { html: 'paste your information into the text area' })
	let ta = mDom(popup, {}, { tag: 'textarea', rows: 20, cols: 80 });
	mButton('Fill Form', () => { onclickPasteDetailObject(ta.value, inputs); }, popup);
}
function fillFormFromObject(inputs, wIdeal, df,db, styles, opts) {
	let popup = mDom(df,{margin:10}); //mPopup(df, { margin: 100 }); //mStyle(popup,{left:10})
	mDom(popup, {}, { html: 'paste your information into the text area' })
	let ta = mDom(popup, {}, { tag: 'textarea', rows: 20, cols: 80 });
	mButton('Fill Form', () => { onclickPasteDetailObject(ta.value, inputs, wIdeal, df, styles, opts); }, db, { maright: 10 },'button','bParseIntoForm');
}
function onclickPasteDetailObject(text, inputs, wIdeal, df, styles, opts) {
	//each inpu is of the form:{name,inp}, inp is the element
	//console.log('text', text);
	//console.log(inputs)

	function parseToInputs(o) {
		let keys = Object.keys(o); //console.log('keys',keys);
		//console.log(o);
		if (keys.length == 1) { o = o[keys[0]]; console.log('new o is', o); }
		let onorm = {};
		for (const k in o) {
			let k1 = normalizeString(k);
			onorm[k1] = o[k];
		}
		if (isEmpty(inputs)) {
			mBy('bParseIntoForm').remove();
			fillMultiForm(o,inputs,wIdeal,df,styles,opts);
		} else {
			for (const oinp of inputs) {
				let k = normalizeString(oinp.name);
				if (isdef(o[k])) oinp.inp.value = o[k];
			}
		}
		//popup.remove();
	}

	try {
		let o = jsyaml.load(text);
		if (isdef(o)) parseToInputs(o);
		//console.log('object',o)
	} catch {
		try {
			let o = JSON.parse(text);
			if (isdef(o)) parseToInputs(o);
		} catch { showMessage('text cannot be parsed into yaml or json object!') }
	}

}














