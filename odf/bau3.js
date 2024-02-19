
async function mGather(dAnchor,styles={},opts={}){ //content='name',type='text'){
	let rect=getRect(dAnchor);
	addKeys({right:rect.r,top:rect.b},styles);
	let [content,type]=[valf(opts.content,'name'),valf(opts.type,'text')];

	// let gadget = mGadget(content, { padding:0, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog' });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });

	//type text: hier kommen jetzt verschiedene options acc to type!
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });

	let getResult111 = ()=>inp.value;
	let cleanup111= ()=>inp.value='';


	return new Promise((resolve, reject) => {
		dialog.showModal();
		form.onsubmit = (ev) => {
			ev.preventDefault(); // Prevent the default form submission
			resolve(getResult111()); //inp.value);
			cleanup111(); //inp.value = '';
			dialog.close();
		};
	});


}
function mGadget(name, styles = {}, opts = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true, h100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${name}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
async function mPrompt(gadget) {
	return new Promise((resolve, reject) => {
		gadget.dialog.showModal();
		gadget.form.onsubmit = (ev) => {
			ev.preventDefault(); 
			resolve(gadget.inp.value);
			gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}

async function mGather(dAnchor,styles={},opts={label:'name'}){
	//open a 1 text gadget that anchors to UI.newCollection command div
	let d=dAnchor;
	let rect=getRect(d);
	let gadget = mGadget(opts.label, { padding:0, maleft:8, right: rect.r, top: rect.b });//, { placeholder: `<enter name>` });
	//console.log(gadget)
	let result = await mPrompt(gadget);
	return result;
}

