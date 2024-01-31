function clearMain(){clear_timeouts();mClear('dMain');mClear('dTitle');}
function mCommand(dParent, key, html, open,close) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(open)) open = window[`onclick${html}`];
	if (nundef(close)) close=()=>{console.log('close',key)}
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { key: key, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: open })

	return {dParent,div:d,key,open,close};
}
function mMenuLMR(dParent) {
	dParent = toElem(dParent);
	let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
	let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
	let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
	return [l,m,r];
}
