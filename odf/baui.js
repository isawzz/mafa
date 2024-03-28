

function cBlank(dParent, styles = {}, opts={}) {
  if (nundef(styles.h)) styles.h = valf(styles.sz,100);
  if (nundef(styles.w)) styles.w = styles.h * .7;
  if (nundef(styles.bg)) styles.bg = 'white';
  styles.position = 'relative';
  if (nundef(styles.rounding)) styles.rounding = Math.min(styles.w, styles.h) * .05;
	addKeys({className:'card'},opts);
  let d = mDom(dParent, styles, opts);
	opts.type = 'card';
  addKeys(styles, opts);
  let item = mItem(d?{ div: d }:{}, opts);
  return item;
}
function cLandscape(dParent, styles = {}, opts={}) {
  if (nundef(styles.w)) styles.w = 100;
  if (nundef(styles.h)) styles.h = styles.w * .65;
  return cBlank(dParent, styles, opts);
}
function cPortrait(dParent, styles = {}, opts={}) {
  if (nundef(styles.h)) styles.h = 100;
  if (nundef(styles.w)) styles.w = styles.h * .7;
  return cBlank(dParent, styles, opts);
}
function cRound(dParent, styles = {}, opts={}) {
  styles.w = valf(styles.w, 100);
  styles.h = valf(styles.h, 100);
  styles.rounding = '50%';
  return cBlank(dParent, styles, opts);
}
function mItem(liveprops={},opts={}) {
	let id = valf(opts.id,getUID());
  let item = opts;
	item.live = liveprops;
	item.id = id;
	let d=iDiv(item); if (isdef(d)) d.id=id;
	Items[id]=item;
	return item;
}
function mPlace(elem, pos, offx, offy) {
  elem = toElem(elem);
  pos = pos.toLowerCase();
  let dParent = elem.parentNode; mIfNotRelative(dParent); //if (dParent.style.position != 'absolute') dParent.style.position = 'relative';
  let vert = valf(offx, 0);
  let hor = isdef(offy) ? offy : vert;
  if (pos[0] == 'c' || pos[1] == 'c') {

		
		let dpp=dParent.parentNode; //look if dParent is connected to DOM
		let opac=mGetStyle(dParent,'opacity'); console.log('opac',opac);
		//console.log('parent of parent',dpp);
		if (nundef(dpp)) {mAppend(document.body,dParent);mStyle(dParent,{opacity:0})}

    let rParent = getRect(dParent); 
    let [wParent, hParent] = [rParent.w, rParent.h];
		//if (wParent == 0) [wParent,hParent] = [mGetStyle(dParent,'w'),mGetStyle(dParent,'h')]; // 
    let rElem = getRect(elem);
    let [wElem, hElem] = [rElem.w, rElem.h];
		// console.log(rParent,'wParent',wParent,'hParent',hParent);
		// console.log(rElem,wElem,hElem)

		if (nundef(dpp)) {dParent.remove();mStyle(dParent,{opacity:valf(opac,1)})}

		switch (pos) {
      case 'cc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert + (hParent - hElem) / 2 }); break;
      case 'tc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, top: vert }); break;
      case 'bc': mStyle(elem, { position: 'absolute', left: hor + (wParent - wElem) / 2, bottom: vert }); break;
      case 'cl': mStyle(elem, { position: 'absolute', left: hor, top: vert + (hParent - hElem) / 2 }); break;
      case 'cr': mStyle(elem, { position: 'absolute', right: hor, top: vert + (hParent - hElem) / 2 }); break;
    }
    return;
  }
  let di = { t: 'top', b: 'bottom', r: 'right', l: 'left' };
  elem.style.position = 'absolute';
  elem.style[di[pos[0]]] = hor + 'px'; elem.style[di[pos[1]]] = vert + 'px';
}
function logItems(){Object.keys(Items).sort().forEach(k=>console.log('Items',Items[k]));}












