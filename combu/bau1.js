function isMyTurn(fen) {
  return fen.turn.includes(U.name)
}
function getTurnPlayers(fen){
  return fen.turn.join(', ');
}
function selectAddItems(items, callback = null, instruction = null) {
  let [A, fen] = [Clientdata.A, Clientdata.fen];
  A.level++; A.items = items; A.callback = callback; A.selected = []; A.di = {};
  let dInstruction = mBy('dSelections0');
  mClass(dInstruction, 'instruction');
  mCenterCenterFlex(dInstruction);
  mStyle(dInstruction, { 'align-content': 'center', 'justify-content': 'center' })
  dInstruction.innerHTML = (isMyTurn(fen) ? `${get_waiting_html()}<span style="color:red;font-weight:bold;max-height:25px">You</span>` + "&nbsp;" + instruction : `waiting for: ${getTurnPlayers(fen)}`);
  let buttonstyle = { maleft: 25, vmargin: 2, rounding: 6, padding: '4px 12px 5px 12px', border: '0px solid transparent', outline: 'none' }
  for (const item of A.items) {
    let type = item.itemtype = isdef(item.itemtype) ? item.itemtype : is_card(item) ? 'card' : isdef(M.superdi[item.key]) ? 'sym' : isdef(item.o) ? 'container' : isdef(item.src) ? 'img' : 'string';
    let [el, o, d1, fz, fg] = [null, item.o, dInstruction, 30, 'grey'];
    if (type == 'sym') {
      if (isdef(o.img)) { el = mDom(d1, { h: fz, hmargin: 8, 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` }); }
      else if (isdef(o.text)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
      else if (isdef(o.fa6)) el = mDom(d1, { hmargin: 8, fz: fz - 2, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
      else if (isdef(o.fa)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
      else if (isdef(o.ga)) el = mDom(d1, { hmargin: 8, fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
      //console.log('src',item.src)
      //item.div = mDom(dInstruction,{h:30},{tag:'img',src:item.src,id:id}); //item.a, handler, dInstruction, buttonstyle, null, id);
    } else if (isdef(item.present)) {
      el = item.present(item, d1, { sz: fz, fg: fg });
    } else assertion(false, `WRONG ITEM TYPE ${type}`)

    mStyle(el, { cursor: 'pointer' })
    el.id = getUID(); A.di[el.id] = item;
    el.onclick = callback;
  }

}