

async function deleteEvent(id) {
  let result = await simpleUpload('postEvent', { id });
  delete Items[id];
  mBy(id).remove();
}
function onclickDay(d,styles) {
  let tsDay = d.id; //evToId(ev);
  let tsCreated = Date.now();
  let id = generateEventId(tsDay, tsCreated);
  let uname = U ? U.name : 'guest';
  let o = { id: id, created: tsCreated, day: tsDay, time: '', text: '', user: uname, shared: false, subscribers: [] };
  Items[id] = o;
  let d1 = uiTypeEvent(d,o,styles); //addEditable(d, { w: '100%' }, { id: id, onEnter: ()=>onEventEdited(id,mBy(id).value), onclick: onclickExistingEvent });
}
async function onEventEdited(id, text, time) {
  let e = Items[id];
	//console.log('e',e,'text',text);
	if (nundef(time)) {
		[time,text]=extractTime(text);
	}
  e.time = time;
  e.text = text;
	//console.log('time',time,'text',text);
  let result = await simpleUpload('postEvent', e);
  Items[id] = lookupSetOverride(Serverdata, ['events', id], e);
  mBy(id).value = stringBefore(e.text, '\n');
  closePopup();
}
function rWord(n=6){return rLetters(n).join('');}
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
function uiTypeEvent(dParent,o,styles={}){
	Items[o.id]=o;

	// let styles1 = jsCopy(styles);
	// let ui=mDom(dParent,styles1); //,{html:rWord()});
	// styles1.h=styles.h+14

	let ui=mDom(dParent,styles,{id:o.id}); //,{html:rWord()});
	mFlexLR(ui);
	mStyle(ui,{'align-items': 'center','align-content':'center'})
	//console.log('styles',styles)

	//addKeys({weight:'normal',box:true},styles);  //addKeys({ wmax: '90%', box: true }, styles);

	let opts={ onEnter: onEventEdited, onclick: onclickExistingEvent, value: o.text };
	addKeys({ tag: 'input', classes: 'plain' }, opts);
	//console.log('parentWidth',dParent.style.width,mGetStyle(dParent,'w'))
	let [wtotal,wbutton]=[mGetStyle(dParent,'w'),20];
  let inp = mDom(ui, {matop:2,maleft:2,box:true,w:wtotal-wbutton}, opts);
	console.log('styles',styles)
	console.log('opts',opts)
  //x.focus();
  inp.addEventListener('keyup', ev => {
    if (ev.key == 'Enter') {
      mDummyFocus();
      if (isdef(opts.onEnter)) opts.onEnter(ev)
    }
  });

	let dr = mDom(ui, {box:true,w:wbutton,fg:'gray'});//,bg:'blue'});
	mStyle(dr,{fz:styles.fz+5,family:'pictoFa',box:true,cursor:'pointer',className:'hop1'});//matop:2,border:'red',bg:'blue',fg:'white'});
	let sym = M.superdi.pen_square;
	dr.innerHTML=String.fromCharCode('0x' + sym.fa); //'A'
	dr.onclick=ev=>evNoBubble(ev);


	return ui;
}
function restUiTypeEvent(){

	let ui = mDom(dParent,{ w: '100%',paright:2, box:true });
	//109x88
	
	let [dl, dr] = mColFlex(ui, [12,1]);

	let inp = addEditable(dl, { w:'100%' }, { id: o.id, onEnter: onEventEdited, onclick: onclickExistingEvent, value: o.text });
  // let bx = mDom(dr, { w: '100%', h: '100%', cursor: 'pointer',halign:'center',valign:'center' }, { className: 'hop1' });
  // bx.onclick = ev => { evNoBubble(ev); onclickExistingEvent(ev) };

	// let d1=mDom(ui,{w:22,h:20,bg:'silver',border:'dimgray',rounding:'50%',align:'center'});
	//let sz=27;
	//let sym = showImage('pen_square', dr, {fg:'white',bg:'green',padding:0, w:sz,h:sz,className:'hop1'});

	mStyle(dr,{matop:2,border:'red',family:'pictoFa',box:true, w:20,h:21,bg:'blue',fg:'white'});
	let sym = M.superdi('pen_square');
	dr.innerHTML=String.fromCharCode('0x' + sym.fa); //'A'

	//<div style="font-size: 21.6px; line-height: 21.6px; font-family: pictoFa; background: rgba(0, 0, 0, 0); color: rgb(255, 255, 255); display: inline; cursor: pointer;"></div>
	

	return ui;
}
