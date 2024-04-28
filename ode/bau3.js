
async function showColors() {
  showTitle('Set Color Theme');
  let sz = 30;
  let d = mDom('dMain', { wmax: (sz + 4) * 15,margin:20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
  list = M.playerColors.concat(grays);
  for (const c of list) {
    let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
    dc.onclick = onclickColor;
    mStyle(dc, { cursor: 'pointer' });
  }
	let dc = mDom(d, { border:getThemeFg(), h: sz, cursor:'pointer',hpadding:4 },{html:'none'});
	dc.onclick = onclickColor;

  let dTheme = mDom('dMain', { wmax: (sz + 4) * 15,margin:20, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
  list = M.textures;
  for (const c of list) {
		let bgRepeat='repeat';
		bgImage = `url('${c}')`;
    let dc = mDom(dTheme, { border:getThemeFg(), w: sz, h: sz, 'background-repeat':bgRepeat,'background-image': bgImage });
    dc.onclick = onclickTexture;
    mStyle(dc, { cursor: 'pointer' });
  }
	dc = mDom(dTheme, { border:getThemeFg(), h: sz, cursor:'pointer',hpadding:4 },{html:'none'});
	dc.onclick = onclickTexture;

}


