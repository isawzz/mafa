function uiTypeRadios(lst, d, styles = {}, opts = {}) {
	let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
	let handler = x => squareTo(cropper, x);
	mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
	for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
		mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
	}
	return rg;
}
