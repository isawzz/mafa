async function showDashboard(){
	mClear('dMain');mClear('dPageTitle');
	mDom('dMain',{fg:getThemeFg()},{html:`hi, ${U.name}! this is your dashboard`})
}
function showCalendarApp() {
  if (!U) { console.log('you have to be logged in to use this menu!!!'); return; }
  showTitle('Calendar');
  let d1 = mDiv('dMain', { w: 800, h: 800 }); //, bg: 'white' })
  let x = DA.calendar = uiTypeCalendar(d1);
}
function showChatMessage(o) {
  let d = mBy('dChatWindow'); if (nundef(d)) return;
  if (o.user == getUname()) mDom(d, { align: 'right' }, { html: `${o.msg}` })
  else mDom(d, { align: 'left' }, { html: `${o.user}: ${o.msg}` })
  // for (const arg of [...arguments]) {
  //   console.log('arg', arg);
  //   let d = mBy('dChatWindow');
  //   if (d) mDom(d, {}, { html: arg })
  // }
}
function showChatWindow() {
  //mStyle('dMain',{bg:'#ffffff40'})
  let dChat = mDom('dRight', { padding: 10, fg: 'white', box: true }, { id: 'dChat', html: 'Chatbox' });
  //UI.chatInput = mInput(dChat, {}, '<your message>', 'input');
  UI.chatInput = mInput(dChat, { w: 260 }, 'inpChat', '<your message>', 'input', 1);
  UI.chatWindow = mDom(dChat, {}, { id: 'dChatWindow' });
  mOnEnter(UI.chatInput, ev => {
    let inp = ev.target;
    Socket.emit('message', { user: U.name, msg: ev.target.value });
    ev.target.value = '';

  });


}
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
  let bsend = mButton('Save', () => onEventEdited(id, ta.value, inpt.value), buttons);
  mButton('Cancel', () => closePopup(), buttons, { hmargin: 10 })
  mButton('Delete', () => { deleteEvent(id); closePopup(); }, buttons, { fg: 'red' })
  mDom(line, { fz: '90%', maright: 5, float: 'right', }, { html: `by ${e.user}` });
}
function showImage(key, dParent, styles = {}) {
  let o = M.superdi[key];
  //if (key == 'book') {    console.log(o,styles)  }
  //console.log('o',o)
  if (nundef(o)) { console.log('showImage:key not found', key); return; }
  let [w, h] = [valf(styles.w, styles.sz), valf(styles.h, styles.sz)];
  if (nundef(w)) {
    mClear(dParent);
    [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  } else {
    addKeys({ w: w, h: h }, styles)
    dParent = mDom(dParent, styles);
  }
  let [sz, fz, fg] = [.9 * w, .8 * h, valf(styles.fg, rColor())];
  let d1 = mDiv(dParent, { position: 'relative', h: fz, overflow: 'hidden' });
  mCenterCenterFlex(d1)
  let el = null;
  if (isdef(o.img)) {
    el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
  }
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: fg, display: 'inline' }, { html: o.text });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz - 2, hline: fz, family: 'fa6', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: fg, display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  assertion(el, 'PROBLEM mit' + key);
  mStyle(el, { cursor: 'pointer' })
  return d1;
}
function showImageBatch(inc = 0) {
  let [keys, index, x] = [M.keys, M.index, M.rows * M.cols];
  if (isEmpty(keys)) showMessage('nothing has been added to this collection yet!'); 
  if (keys.length <= x) inc = 0;
  index += x * inc; if (index >= keys.length) index = 0; else if (index < 0) index += keys.length;
  let list = arrTakeFromTo(keys, index, index + x);
  M.index = index;
  for (let i = 0; i < list.length; i++) {
    mStyle(M.cells[i], { opacity: 1 })
    showImageInBatch(list[i], M.cells[i]);
  }
  for (let i = list.length; i < x; i++) {
    mStyle(M.cells[i], { opacity: 0 })
  }
}
function showImageInBatch(key, dParent, styles = {}) {
  let o = M.superdi[key];
  addKeys({ bg: rColor() }, styles);
  mClear(dParent);
  [w, h] = [dParent.offsetWidth, dParent.offsetHeight];
  let [sz, fz] = [.9 * w, .8 * h];
  let d1 = mDiv(dParent, { position: 'relative', w: '100%', h: '100%', padding: 11, box: true });//overflow: 'hidden', 
  mCenterCenterFlex(d1)
  let el = null;
  if (isdef(o.img)) {
    if (o.cats.includes('card')) {
      el = mDom(d1, { h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
      mDom(d1, { h: 1, w: '100%' })
    } else {
      el = mDom(d1, { w: '100%', h: '100%', 'object-fit': 'cover', 'object-position': 'center center' }, { tag: 'img', src: `${o.path}` });
    }
  }
  else if (isdef(o.text)) el = mDom(d1, { fz: fz, hline: fz, family: 'emoNoto', fg: rColor(), display: 'inline' }, { html: o.text });
  else if (isdef(o.fa)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoFa', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa) });
  else if (isdef(o.ga)) el = mDom(d1, { fz: fz, hline: fz, family: 'pictoGame', bg: 'beige', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.ga) });
  else if (isdef(o.fa6)) el = mDom(d1, { fz: fz, hline: fz, family: 'fa6', bg: 'transparent', fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + o.fa6) });
  assertion(el, 'PROBLEM mit' + key);
  let label = mDom(d1, { fz: 11 }, { html: key, className: 'ellipsis' }); //,w:'100%'
  mStyle(d1, { cursor: 'pointer' });
  d1.onclick = onclickItem;
  d1.setAttribute('key', key)
}
function showMessage(msg,ms=3000){
  // console.log('msg',msg)

  let d=mBy('dMessage');
  //mAnimateList(d, { height: 0, opacity: 0 }, () => { mClear(d); if (callback) callback(); }, ms, 'ease-out', delay);
  mStyle(d,{h:21,bg:'red',fg:'yellow'}); //getThemeFg()});
  d.innerHTML=msg;
  clearTimeout(TO.message);
  TO.message = setTimeout(()=>mStyle('dMessage',{h:0}),ms)

  //if (isdef(ms)) mFadeHClear(d,ms)
  // console.log('dMessage',dMessage,mBy('dMessage'));
  // showFleetingMessage('nothing has been added to this collection yet!', 'dMessage', { margin: 10 }, 5000)
}
function showNavbar() {
  let titles = ['add', 'collections', 'NATIONS', 'plan', 'play', 'colors'];
  let funcNames = titles.map(x => `onclick${capitalize(x)}`);

  let nav = UI.nav = mNavbar('dNav');

  let [dl, dr] = [nav.dleft, nav.dright];
  //let t1=toggleAdd('left','arrow_down_long',dl,{hpadding:9,vpadding:5},{w:0,wmin:0},{wmin:100});
  let title = mDom(dl, { fz: 20, cursor:'pointer' }, { onclick:onclickHome, html: 'COMBU', classes: 'title' });
  let d2 = mDom(dl);
  for (let i = 0; i < titles.length; i++) {
    let d3 = mDom(d2, { display: 'inline-block' }, { html: `<a class="nav-link" href="#" onclick="UI.nav.activate(event);${funcNames[i]}()">${titles[i]}</a>` })
  }

  dUser = mDom(dr, {}, { id: 'dUser' });
  let t2 = toggleAdd('right', 'arrow_down_long', dr, { hpadding: 9, vpadding: 5 }, { w: 0 }, { w: 300 });
  // nav.disable('play');


}
async function showTables(){
	Clientdata.table=null;
  Serverdata.tables = tables = await mGetRoute('tables');
  console.log('tables',tables);
	tables.map(x=>x.prior=x.turn.includes(U.name)?1:x.players.includes(U.name)?2:3);
	sortBy(tables,'prior');
	
  let dParent = mDom('dMain', {}, {className:'section'}); 
	//return;
  // let d2 = mDiv('dMain', {}, {className:'section',id:'dGames'}); //, bg: 'white' })
	if (isEmpty(tables)) { mText('no active game tables', dParent); return []; }

	tables.map(x => x.game_friendly = capitalize(x.game));
	mText(`<h2>game tables</h2>`, dParent, { maleft: 12 })
	let t = mDataTable(tables, dParent, null, ['friendly', 'game_friendly', 'players'], 'tables', false);

	mTableCommandify(t.rowitems, {
		0: (item, val) => hFunc(val, 'onclickTable', item.o.id, item.id),
	});

	let d = iDiv(t);
	for (const ri of t.rowitems) {
		let r = iDiv(ri);
		if (ri.o.prior == 1) mDom(r,{},{tag:'td',html:get_waiting_html(24)}); //'my turn!'});
		let h = hFunc('delete', 'deleteTable', ri.o.friendly);
		c = mAppend(r, mCreate('td'));
		c.innerHTML = h;
	}


}
async function showTable(table,name){
  //showMessage(`showTable ${table.friendly}`); return;
	console.log('showTable',name,table)
  if (!table.fen.playerNames.includes(name)) showMessage(`SPECTATOR VIEW NOT YET IMPLEMENTED!`)
	else if (table.game == 'nations'){ await natGameView(table.fen,name); }
	else showMessage(`GAME ${table.game.toUpperCase()} NOT YET IMPLEMENTED!`)
}
function showTitle(title) {
  mClear(dTitle);
  mDom(dTitle, {}, { tag: 'h1', html: title, classes: 'title' });
}
function showUser() {
  //UI.nav.activate('user')
  mClear(dUser);
  mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  let d;
  d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'activeLink' });
  setColors(U.color)
  d.onclick = onclickUser;
}
