
function mNode(o, dParent, title, isSized = false) {
	let d = mCreate('div');
	mYaml(d, o);
	let pre = d.getElementsByTagName('pre')[0];
	pre.style.fontFamily = 'inherit';
	if (isdef(title)) mInsert(d, mText(title));
	if (isdef(dParent)) mAppend(dParent, d);
	if (isDict(o)) d.style.textAlign = 'left';
	if (isSized) addClass(d, 'centered');
	return d;
}
function mYaml(d, js) {
	d.innerHTML = '<pre>' + jsonToYaml(js) + '</pre>';
}
function jsonToYaml(o) { let y = jsyaml.dump(o); return y; }

function showObject(o, keys, dParent, styles = {}, opts={}) {

	if (nundef(keys)) {keys = Object.keys(o);opts.showKeys = true;styles.align='left'}
	addKeys({ align: 'center', padding: 2, bg:'dimgrey', fg: 'contrast' }, styles);

	let d = mDom(dParent, styles, opts);

	let onew={};
	for(const k of keys) onew[k]=o[k];

	mNode(onew,d,o.friendly);
	// let html = '';
	// for (const k of keys) { html += (opts.showKeys?k+': ':'') + o[k] + '<br>'; }
	// let d = mDom(dParent, styles, { html });
	return d;
}


