async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];

		let d = document.body;
		let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });

		let rect = dAnchor.getBoundingClientRect();

		let [v, h] = [align[0], align[1]];
		let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
		let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };

		let formStyles = { position: 'absolute' };
		addKeys(vPos, formStyles);
		addKeys(hPos, formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		dialog.addEventListener('click', ev => {if (isPointOutsideOf(form,ev.clientX,ev.clientY)){ resolve(null); dialog.remove(); }});
		dialog.addEventListener('keydown', ev => { if (ev.key === 'Escape') { dialog.remove(); resolve(null); } });

		let evalFunc = type == 'multi' ? uiGadgetTypeMulti(form, content, styles, opts) :
			type == 'text' ? uiGadgetTypeText(form, content, styles, opts) :
				type == 'yesno' ? uiGadgetTypeYesNo(form, content, styles, opts) :
					type == 'select' ? uiGadgetTypeSelect(form, content, styles, opts) :
						type == 'checklist' ? uiGadgetTypeCheckList(form, content, styles, opts) :
							uiGadgetTypeText(form, content, styles, opts);

		console.log('evalFunc',evalFunc)
		dialog.showModal();
		form.onsubmit = (ev) => { ev.preventDefault(); resolve(evalFunc()); dialog.remove(); };
	});
}
async function onclickCatListDone(ui){
	//let ui=ev.target.parentNode;
	let checks=Array.from(ui.getElementsByTagName('input'));
	console.log('checkboxes',checks,checks[0]);
	DA.x = checks[0];
	let cats=[];
	for(const ch of checks) if (ch.checked) cats.push(ch.name);
	console.log('cats',cats);

	ui.setAttribute('proceed',cats.join('@'));

}
function uiTypeCheckList(lst,dParent,styles={},opts={}){
	let d = mDom(dParent,{overy:'auto'}); //hier drin kommt die liste!
	lst.forEach((text, index) => {
		let dcheck=mDom(d,{},{tag:'input',type:'checkbox',name:text,value:text,id:`ch_${index}`});
		let dlabel=mDom(d,{},{tag:'label',for:dcheck.id,html:text});
		mNewline(d,0);
	});
	let r=getRect(d); //console.log('r',r); //soviel braucht die liste
	let rp=getRect(dParent); console.log('rp',rp);
	let hParent = rp.h;
	if (hParent == 0) hParent = mGetStyle(dParent,'max-height');
	console.log('hParent',hParent);
	let p=mGetStyle(dParent,'pabottom'); console.log('pb',p,mGetStyle(dParent,'padding'))
	let h=hParent-r.y; //-p;
	mStyle(d,{hmax:h});//,pabottom:10,box:true});
	return d;
	//check all the boxes that are set for this element

	//mButton('done',)
}
function generateRandomWords(n) {
	// Sample words to pick from
	const sampleWords = ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig', 'grape', 'honeydew', 'kiwi', 'lemon', 'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'tangerine', 'ugli', 'victoria plum', 'watermelon', 'xigua', 'yuzu', 'zucchini'];
	
	// Generate the array
	let randomWords = [];
	for (let i = 0; i < n; i++) {
			// Pick a random word from the sampleWords array
			const randomWord = sampleWords[Math.floor(Math.random() * sampleWords.length)];
			randomWords.push(randomWord);
	}
	return randomWords;
}











