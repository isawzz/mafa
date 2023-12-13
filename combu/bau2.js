

async function deleteEvent(id) {
  let result = await simpleUpload('postEvent', { id });
  delete Items[id];
  mBy(id).remove();
}
function onclickDay(d, styles) {
  let tsDay = d.id; //evToId(ev);
  let tsCreated = Date.now();
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? U.name : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let x = uiTypeEvent(d, o, styles); //addEditable(d, { w: '100%' }, { id: id, onEnter: ()=>onEventEdited(id,mBy(id).value), onclick: onclickExistingEvent });
  x.inp.focus();
}
async function onEventEdited(id, text, time) {
  console.log(id,text,time)
  let e = Items[id];
  //console.log('e',e,'text',text);
  if (nundef(time)) {
    [time, text] = extractTime(text);
  }
  e.time = time;
  e.text = text;
  //console.log('time',time,'text',text);
  let result = await simpleUpload('postEvent', e);
  console.log('result',result)
  Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
  //console.log('mBy(id)',mBy(id))
  mBy(id).firstChild.value = getEventValue(e); // e.time + ' ' + stringBefore(e.text, '\n');
  closePopup();
}
function rWord(n = 6) { return rLetters(n).join(''); }
function showEventOpen(id) {
  let e = Items[id];
  if (!e) return;
  let date = new Date(Number(e.day));
  let [day, month, year] = [date.getDate(), date.getMonth(), date.getFullYear()];
  //console.log('day', `${day}.${month}.${year}`);
  let time = e.time;
  let popup = openPopup();
  let d = mBy(id);
  //console.log('d', d)
  let [x, y, w, h, wp, hp] = [d.offsetLeft, d.offsetTop, d.offsetWidth, d.offsetHeight, 300, 180];
  let [left, top] = [Math.max(10, x + w / 2 - wp / 2), Math.min(window.innerHeight - hp - 60, y + h / 2 - hp / 2)]
  //console.log('left,top', left, top)
  mStyle(popup, { left: left, top: top, w: wp, h: hp });
  let dd = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 3, pabottom: 4 }, { html: `date: ${day}.${month}.${year}` });
  let dt = mDom(popup, { display: 'inline-block', fz: '80%', maleft: 20, pabottom: 4 }, { html: `time:` });
  let inpt = mDom(popup, { fz: '80%', maleft: 3, mabottom: 4, w: 60 }, { tag: 'input', value: e.time });
  mOnEnter(inpt);
  let ta = mDom(popup, { rounding: 4, matop: 7, box: true, w: '100%', vpadding: 4, hpadding: 10, }, { tag: 'textarea', rows: 7, value: e.text });
  let line = mDom(popup, { matop: 6, w: '100%' }); //,'align-items':'space-between'});
  let buttons = mDom(line, { display: 'inline-block' });
  let bsend = mButton('Save', () => onEventEdited(id, ta.value, inpt.value), buttons, { fg: 'red' });
  mButton('Cancel', () => closePopup(), buttons, { hmargin: 10 })
  mButton('Delete', () => { deleteEvent(id); closePopup(); }, buttons,)
  mDom(line, { fz: '90%', maright: 5, float: 'right', }, { html: `by ${e.user}` });
}
function getEventValue(o){
  if (isEmpty(o.time)) return o.text;
  return o.time + ' ' + stringBefore(o.text, '\n');
}
function uiTypeEvent(dParent, o, styles = {}) {

  console.log('styles.hmin',styles.hmin)
  //console.log(dParent,o)
  Items[o.id] = o;
  let id=o.id;
  //console.log('styles',styles)
  let ui = mDom(dParent, styles, { id: id }); //, className:'no_events'}); //onclick:ev=>evNoBubble(ev) }); 
  //mStyle(ui,{cursor:'normal','pointer-events':'none',overflow:'hidden',display:'flex',gap:2,padding:2,'align-items':'center'}); //,'justify-items':'center'})
  mStyle(ui,{overflow:'hidden',display:'flex',gap:2,padding:2,'align-items':'center'}); //,'justify-items':'center'})
  
  let [wtotal, wbutton, h] = [mGetStyle(dParent, 'w'), 17, styles.hmin];
  
  let fz = 15;
  let stInput={overflow:'hidden',hline:fz*4/5,fz:fz,h:h,border:'solid 1px silver',box:true,margin:0,padding:0 };
  let inp=mDom(ui,stInput,{html:o.text,tag:'input',className:'no_outline',onclick:ev => {evNoBubble(ev)}}); //;selectText(ev.target);}});
  inp.value = getEventValue(o);
  inp.addEventListener('keyup', ev => { if (ev.key == 'Enter') { mDummyFocus(); onEventEdited(id, inp.value); } });
  
  fz=14;
  let stButton={overflow:'hidden',hline:fz*4/5,fz:fz,box:true,fg:'silver',bg:'white',family: 'pictoFa',display:'flex'};
  let b=mDom(ui,stButton,{html:String.fromCharCode('0x' + M.superdi.pen_square.fa)});
  ui.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev); }
  mStyle(inp,{w:wtotal-wbutton});
  // let b2=mDom(ui,stButton,{html:String.fromCharCode('0x' + M.superdi.window_close.fa)});
  // b2.onclick = ev => { evNoBubble(ev); deleteEvent(o.id); }
  // mStyle(inp,{w:wtotal-2*wbutton});
  return {ui:ui,inp:inp,id:id};
}
