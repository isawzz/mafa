
function mClip(shape, d) { 
	if (shape == 'circle' || shape == 'ellipse') mStyle(d, { rounding: '50%' });
	else mStyle(d, { 'clip-path': PolyClips[shape] }); 
}
function showPlaetze(dParent, n, bg) {
	let ch = arrChildren(dParent);
	ch.map(x => mStyle(x, { bg: 'transparent' }));
	arrTake(ch, n).map(x => mStyle(x, { bg }));
}

