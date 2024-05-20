
function modifyStat(name,prop,val){
	let id = `stat_${name}_${prop}`;
	console.log('id',id)
	let ui=mBy(id);

	console.log('ui',ui)
	if (isdef(ui)) ui.innerHTML = val;
}

function playerStatCount(key, n, dParent, styles = {}, opts = {}) {
	let sz = valf(styles.sz, 16);
	addKeys({ display: 'flex', margin: 4, dir: 'column', hmax: 2 * sz, 'align-content': 'center', fz: sz, align: 'center' }, styles);
	let d = mDiv(dParent, styles);
	let o = M.superdi[key];
	if (isdef(o)) showImage(key, d, { h: sz, 'line-height': sz, w: '100%', fg: 'grey' }, true);
	else mText(key, d, { h: sz, fz: sz, w: '100%' });
	d.innerHTML += `<span ${isdef(opts.id)?`id='${opts.id}'`:''} style="font-weight:bold;color:inherit">${n}</span>`;
	return d;
}



