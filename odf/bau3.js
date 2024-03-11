
function rWords(n=1){
	let words = getColorNames().map(x=>x.toLowerCase());
	let arr = rChoose(words,n);
	return arr;
}
function uiTypeCheckListInput(lst, dParent, styles = {}, opts = {}) {

	let inp = mDom(dParent, styles, { className: 'input', tag: 'input', type: 'text' });


	// let chlist = uiTypeCheckList(lst, dParent, styles, opts);
	let d = mDom(dParent,{overy:'auto'}); //hier drin kommt die liste!
	//console.log('lst',lst)
	lst.forEach((o, index) => {
		let [text,value]=[o.name,o.value];
		let dcheck=mDom(d,{},{tag:'input',type:'checkbox',name:text,value:text,id:`ch_${index}`,checked:value});
		//dcheck.checked = value;
		let dlabel=mDom(d,{},{tag:'label',for:dcheck.id,html:text});
		mNewline(d,0);
	});
	let r=getRect(d); //console.log('r',r); //soviel braucht die liste
	let rp=getRect(dParent); //console.log('rp',rp);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent,'max-height');
	//console.log('hParent',hParent);
	let p=mGetStyle(dParent,'pabottom'); //console.log('pb',p,mGetStyle(dParent,'padding'))
	let h=hParent-r.y; //-p;
	mStyle(d,{hmax:h});//,pabottom:10,box:true});
	let chlist= d;


	
	inp.value = getCheckedNames(chlist).join(', ');
	mStyle(inp, { w100: true })
	let chks = arrChildren(chlist);
	for (const chk of chks) {
		chk.addEventListener('click', () => mergeInputAndChecklist(inp, chlist));
	}
	return { inp, chlist };
}
function mergeInputAndChecklist(inp, chlist) {
	let cur = extractWords(inp.value);
	let checked = getCheckedNames(chlist);
	for (const c of checked) addIf(cur, c);
	cur.sort();
	inp.value = cur.join(', ');
}
function uiGadgetTypeCheckListInput(form, content, styles, opts) {


	//was soll der content sein? wo soll der content berechnet werden?
	// addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	addKeys({ w: 600, bg: 'white', fg: 'black', padding: 10, rounding: 10, box: true }, styles)
	let dOuter = mDom(form, styles)
	// let d=mDom(form,{bg:'white'})
	let dParent = mDom(dOuter, { hmax: 510, wmax: 200, pabottom: 10, box: true }); //,bg:'blue',fg:'contrast'});

	// console.log('content', content)
	// let lst = content.map(x => x.name);
	// console.log('lst', lst)

	let ui = uiTypeCheckListInput(content, dParent, styles, opts);
	let [chlist, inp] = [ui.chlist, ui.inp];
	//console.log('ui',ui);




	//console.log('ui', ui)

	//onclick: () => form.setAttribute('proceed', 'yes')

	// mButton('done', () => {
	// 	let cur=extractWords(inp.value);
	// 	let checked = getCheckedNames(ui);
	// 	for(const c of checked) addIf(cur,c);
	// }, dOuter, { classes: 'input', margin: 10 }); //da muss noch ein button dazu

	return () => extractWords(inp.value);

	//muss eine evalfunc returnen!!!
}







