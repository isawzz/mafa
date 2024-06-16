
function showim1(imgKey, d, styles = {}, opts = {}) {
	let o = lookup(M.superdi, [imgKey]);
	let src;
	if (nundef(o) && imgKey.includes('.')) src = imgKey;
	else if (isdef(o) && isdef(opts.prefer)) src = valf(o[opts.prefer], o.img);
	else if (isdef(o)) src = valf(o.img, o.photo)

	if (nundef(src)) src = rChoose(M.allImages).path;
	//console.log('src', src)
	//let src = valf(lookup(M.superdi, [imgKey, valf(opts.prefer,'img')]), );
	let img = mDom(d, styles, { tag: 'img', src });
	return img;
}












