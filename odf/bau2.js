
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
					uiGadgetTypeText(form, content, styles, opts);

		console.log('evalFunc',evalFunc)
		dialog.showModal();
		form.onsubmit = (ev) => { ev.preventDefault(); resolve(evalFunc()); dialog.remove(); };
	});
}











