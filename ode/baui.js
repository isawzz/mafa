
function calculateGoodColors(bg, fg) {
	let fgIsLight = isdef(fg) ? colorIdealText(fg) == 'black' : colorIdealText(bg) == 'white';
	let bgIsDark = colorIdealText(bg) == 'white';
	if (nundef(fg)) fg = colorIdealText(bg);
	let bgNav = bg;
	fg = colorToHex79(fg);
	if (fgIsLight) {
		if (isEmpty(U.bgImage)) { bgNav = '#00000040'; }
		else if (bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorDark(bg, 50), .8); }
	} else {
		if (isEmpty(U.bgImage)) { bgNav = '#ffffff40'; }
		else if (!bgIsDark) { bgNav = colorTrans(bg, .8); }
		else { bgNav = colorTrans(colorLight(bg, 50), .8); }
	}
	let t = U.bgImage;
	let realBg = bg;
	if (bgNav == realBg) bgNav = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let bgContrast = fgIsLight ? colorDark(bgNav, .2) : colorLight(bgNav, .2);
	let fgContrast = fgIsLight ? '#ffffff80' : '#00000080'; // 'red'; //bestContrastingColor(bgNav); // colorContrast(bgNav); // fgIsLight ? colorDark(fg, .5) : colorLight(fg, .5);
	return [realBg, bgContrast, bgNav, fg, fgContrast];
}
async function gameoverScore(table) {
	table.winners = getPlayersWithMaxScore(table);
	table.status = 'over';
	table.turn = [];
	let id = table.id;
	let name = getUname();
	let step = table.step;
	let stepIfValid = step + 1;
	let o = { id, name, step, stepIfValid, table };
	let res = await mPostRoute('table', o); //console.log(res);

}
function modifyStat(name,prop,val){
	//for this to work need to provide opts.id to playerStatCount!
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
function showValidMoves(table) {
	if (nundef(table.moves)) { console.log('no moves yet!'); return; }
	console.log('________', table.step)
	for (const m of table.moves) {
		console.log(`${m.step} ${m.name}: ${m.move.map(x => x.substring(0, 5)).join(',')} (${m.change})=>${m.score}`);
	}
}










