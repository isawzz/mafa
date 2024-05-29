
function clearFlex() {
	let dp = clearBodyDiv({ bg: 'white', h: '100vh', padding: 10 });
	let d = mDom(dp, { gap: 10 }); mFlexWrap(d);
	return d;
}
function showObject(o, keys, dParent, styles = {}) {
	let bg = valf(styles.bg, 'dimgray');
	addKeys({ align: 'center', wmin: 120, padding: 2, bg, fg: colorIdealText(bg) }, styles);
	let html = '';
	for (const k of keys) { html += o[k] + '<br>'; }

	let d = mDom(dParent, styles, { html });
	return d;
}







