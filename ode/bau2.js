async function onclickColor(item, items) {
  let c = item.color;//ev.target.style.background; 
  toggleItemSelection(item);//console.log('items',items)
  let selitems = items.filter(x => x.isSelected && x != item); selitems.map(x => toggleItemSelection(x));
  //console.log('c',c,typeof(c),isEmpty(c))
  if (!isEmpty(c)) c = colorHex(c);
  if (isEmpty(c)) { console.log('color EMPTY!', item); } //ev.target.style);}
  for (const i of range(0, 9)) { mBy(`dSample${i}`).style.backgroundColor = c; }
  document.body.style.backgroundColor = c;
  // mBy('dPos').style.backgroundColor = c;
}


function uiTypeRadios(lst, d, styles = {}, opts = {}) {
	let rg = mRadioGroup(d, {}, 'rSquare', 'Resize (cropped area) to height: '); mClass(rg, 'input');
	let handler = x => squareTo(cropper, x);
	mRadio(`${'just crop'}`, 0, 'rSquare', rg, {}, cropper.crop, 'rSquare', false)
	for (const h of [128, 200, 300, 400, 500, 600, 700, 800]) {
		mRadio(`${h}`, h, 'rSquare', rg, {}, handler, 'rSquare', false)
	}
	return rg;
}
function getRepeatAndSizeForTexture(t){
	if (isEmpty(t)) return ['',''];
	let bgRepeat = t.includes('marble_') ? 'no-repeat' : 'repeat';
	let bgSize = bgRepeat == 'repeat' ? 'auto' : 'cover';
	return [bgRepeat,bgSize];
}
