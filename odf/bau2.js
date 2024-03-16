

async function onEventEdited(id, text, time) {
  console.log(id, text, time)
  let e = Items[id];
  if (nundef(time)) {
    [time, text] = extractTime(text);
  }
  e.time = time;
  e.text = text;
  let result = await simpleUpload('postEvent', e);
	console.log('result',result)
  Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
  mBy(id).firstChild.value = getEventValue(e); 
  closePopup();
}
function uiTypeEvent(dParent, o, styles = {}) {
  Items[o.id] = o;
  let id = o.id;
  let ui = mDom(dParent, styles, { id: id }); //, className:'no_events'}); //onclick:ev=>evNoBubble(ev) }); 
  mStyle(ui, { overflow: 'hidden', display: 'flex', gap: 2, padding: 2, 'align-items': 'center' }); //,'justify-items':'center'})
  let [wtotal, wbutton, h] = [mGetStyle(dParent, 'w'), 17, styles.hmin];
  let fz = 15;
  let stInput = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, h: h, border: 'solid 1px silver', box: true, margin: 0, padding: 0 };
  let inp = mDom(ui, stInput, { html: o.text, tag: 'input', className: 'no_outline', onclick: ev => { evNoBubble(ev) } }); //;selectText(ev.target);}});
  inp.value = getEventValue(o);
  inp.addEventListener('keyup', ev => { if (ev.key == 'Enter') { mDummyFocus(); onEventEdited(id, inp.value); } });
  fz = 14;
  let stButton = { overflow: 'hidden', hline: fz * 4 / 5, fz: fz, box: true, fg: 'silver', bg: 'white', family: 'pictoFa', display: 'flex' };
  let b = mDom(ui, stButton, { html: String.fromCharCode('0x' + M.superdi.pen_square.fa) });
  ui.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev); }
  mStyle(inp, { w: wtotal - wbutton });
  return { ui: ui, inp: inp, id: id };
}










