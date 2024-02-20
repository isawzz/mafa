async function mGather(dAnchor, styles = {}, opts = {}) {
	return new Promise((resolve, _) => {
		let [content, type, align] = [valf(opts.content, 'name'), valf(opts.type, 'text'), valf(opts.align, 'bl')];

		let d = document.body;
		let dialog = mDom(d, { bg: '#00000040', box: true, w: '100vw', h: '100vh' }, { tag: 'dialog' });

		let rect = dAnchor.getBoundingClientRect();//getRect(dAnchor);

		let [v, h] = [align[0], align[1]];
		let vPos = v == 'b' ? { top: rect.bottom } : v == 'c' ? { top: rect.top } : { bottom: rect.top };
		let hPos = h == 'l' ? { left: rect.left } : v == 'c' ? { left: rect.left } : { right: window.innerWidth - rect.right };

		let formStyles = { position: 'absolute' };
		addKeys(vPos, formStyles);
		addKeys(hPos, formStyles); //,top:rect.bottom,right:}; //,bg:'red'}; //,w:100,h:100};
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });

		let evalFunc = type == 'multi' ? uiGadgetTypeMulti(form, content, styles, opts) :
			type == 'text' ? uiGadgetTypeText(form, content, styles, opts) :
				type == 'yesno' ? uiGadgetTypeYesNo(form, content, styles, opts) :
					uiGadgetTypeText(form, content, styles, opts);

		// if (isdef(opts.cancel)) {
		// 	//add a cancel button to the dialog!
		// 	mDom(form,{w:70},{className:'input',onclick:})
		// }

		dialog.showModal();
		form.onsubmit = (ev) => { ev.preventDefault(); resolve(evalFunc()); dialog.remove(); };
	});
}


function uiGadgetTypeYesNo(form, content, styles = {}, opts = {}) {
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	let dq = mDom(dOuter, { mabottom: 7 }, { html: capitalize(content) });
	let db = mDom(dOuter, { w100: true, box: true, display: 'flex', 'justify-content': 'space-between', gap: 10 })
	let bYes = mDom(db, { w: 70, classes: 'input' }, { html: 'Yes', tag: 'button', onclick: () => form.setAttribute('proceed', 'yes') })
	let bNo = mDom(db, { w: 70, classes: 'input' }, { html: 'No', tag: 'button', onclick: () => form.setAttribute('proceed', 'no') })

	return () => form.getAttribute('proceed') == 'yes';
}
function uiGadgetTypeText(form, content, styles = {}, opts = {}) {
	//type text: hier kommen jetzt verschiedene options acc to type!

	let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	//let inputStyles = {w:100,margin:0}; 
	// let inp = mDom(form, inputStyles, { className: 'input', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	//let inputStyles = { bg: 'white', align: 'center', vpadding: 3, hpadding: 6, matop: 2 }; // outline: 'none', w: 130, margin:0 }
	// let inp = mDom(form, inputStyles, { className: 'reset', name: content, tag: 'input', type: 'text', placeholder: valf(opts.placeholder, `<enter ${content}>`) });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => inp.value;
}
function uiGadgetTypeMulti(form, dict, styles = {}, opts = {}) {
	let inputs = [];
	for (const k in dict) {
		let [content, val] = [k, dict[k]];
		let inp = mDom(form, styles, { className: 'input', name: content, tag: 'input', type: 'text', value: val, placeholder: `<enter ${content}>` });
		inputs.push({ name: content, inp: inp });
		mNewline(form)
	}
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return () => {
		let di={};
		inputs.map(x => di[x.name]=x.inp.value);
		return di;
	};
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

