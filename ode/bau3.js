
function fillMultiForm(dict,inputs,wIdeal,df,styles,opts){
	mClear(df);
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		mDom(df, {}, { html: `${content}:` });
		let inp = mDom(df, styles, opts);
		inp.rows = calcRows(styles.fz, styles.family, val, wIdeal); //console.log('rows',inp.rows)
		inp.value = val;
		inputs.push({ name: content, inp: inp });
		mNewline(df)
	}

}



