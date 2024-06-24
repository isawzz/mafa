
function showim2(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]);
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)
	let [w, h] = mSizeSuccession(styles, 40);
	addKeys({ w, h }, styles)

	if (nundef(src)) src = rChoose(M.allImages).path;

	let img = mDom(d, styles, { tag: 'img', src });
	return img;
}



