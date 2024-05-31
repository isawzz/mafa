
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
		addKeys(hPos, formStyles);
		let form = mDom(dialog, formStyles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
		dialog.addEventListener('mouseup', ev => {
			if (opts.type != 'select' && isPointOutsideOf(form, ev.clientX, ev.clientY)) {
				console.log('RESOLVE NULL POINTER OUTSIDE!!!',form, ev.clientX, ev.clientY)
				resolve(null);
				dialog.remove();
			}
		});
		dialog.addEventListener('keydown', ev => {
			if (ev.key === 'Escape') {
				dialog.remove(); 
				console.log('RESOLVE NULL ESCAPE');
				resolve(null);
			}
		});
		let evalFunc;
		if (type == 'multi') evalFunc = uiGadgetTypeMulti(form, content, styles, opts);
		else if (type == 'yesno') evalFunc = uiGadgetTypeYesNo(form, content, styles, opts);
		else if (type == 'select') evalFunc = uiGadgetTypeSelect(form, content, styles, opts);
		else if (type == 'checklist') evalFunc = uiGadgetTypeCheckList(form, content, styles, opts);
		else if (type == 'checklistinput') evalFunc = uiGadgetTypeCheckListInput(form, content, styles, opts);
		else if (type == 'text') evalFunc = uiGadgetTypeText(form, content, styles, opts);
		dialog.showModal();
		form.onsubmit = (ev) => {
			console.log('SUBMIT!!! val', ev)
			ev.preventDefault();
			let val = evalFunc();
			//dialog.remove();
			resolve(val);
		};
	});
}





