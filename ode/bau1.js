
function showim2(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]); console.log(imgKey,o)
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles);

	if (nundef(o)) src = rChoose(M.allImages).path;
	if (isdef(src)) return mDom(d, styles, { tag: 'img', src });

	fz=.8*h;
	let [family,html]=isdef(o.text)?['emoNoto',o.text]:isdef(o.fa)?['pictoFa',String.fromCharCode('0x' + o.fa)]:isdef(o.ga)?['pictoGame',String.fromCharCode('0x' + o.ga)]:isdef(o.fa6)?['fa6',String.fromCharCode('0x' + o.fa6)]:['algerian',o.friendly];
	addKeys({ family, fz, hline: fz, display: 'inline'}, styles);

	let el = mDom(d, styles, { html }); mCenterCenterFlex(el);

	return el;

	if (isdef(o.text)) el = mDom(d, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
	else if (isdef(o.fa)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
	else if (isdef(o.ga)) el = mDom(d, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
	else if (isdef(o.fa6)) el = mDom(d, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
	return el;
}



