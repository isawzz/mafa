function clearMain(){clear_timeouts();mClear('dMain');mClear('dTitle');}
function mCommand(dParent, key, html, open, close) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(open)) open = window[`onclick${html}`];
	if (nundef(close)) close=()=>{console.log('close',key)}
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })

	return {dParent,elem:d,div:a,key,open,close};
}
function menuCommand(dParent, menuKey, key, html, open,close) {
	let cmd=mCommand(dParent,key,html,open,close);
	let a=iDiv(cmd);
	a.setAttribute('key',`${menuKey}_${key}`);
	a.onclick = onclickMenu;
	cmd.menuKey = menuKey;
	// if (nundef(html)) html = capitalize(key);
	// if (nundef(open)) open = window[`onclick${html}`];
	// if (nundef(close)) close=()=>{console.log('close',key)}
	// let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	// let a = mDom(d, {}, { key: `${menuKey}_${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: menuOpen })

	return cmd; // {dParent,elem:d,div:a,menu:menuKey,key,open,close};
}
function menuCloseCurrent(menu){
	let curKey=lookup(menu,['cur']);
	console.log('current',menu,curKey)
	if (curKey) {  
		let cur = menu.commands[curKey]; 
		mClassRemove(iDiv(cur), 'activeLink'); //unselect cur command
		cur.close();
	
	}
}
function menuDisable(menu,key){	mClass(iDiv(menu.commands[key]),'disabled')}
function menuEnable(menu,key){	mClassRemove(iDiv(menu.commands[key]),'disabled')}
function menuOpen(menu,key){
	let cmd = menu.commands[key];	console.log('clicked',menu,cmd);
	menu.cur=key;
	mClass(iDiv(cmd),'activeLink')
	cmd.open();
}
function mLMR(dParent) {
	dParent = toElem(dParent);
	let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
	let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
	let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
	return [d,l,m,r];
}
function mMenu(dParent,key) {	let [d,l,m,r]=mLMR(dParent);	return {dParent,elem:d,l,m,r,key,cur:null}; }
function onclickCommand(ev){
	let key = evToAttr(ev,'key');
	console.log('click command',key)
	let cmd = UI[key];
	console.log(key,cmd)
	cmd.open();
}
function onclickMenu(ev){
	let keys = evToAttr(ev,'key');
	let [menuKey,cmdKey] = keys.split('_');
	let menu = UI[menuKey];
	menuCloseCurrent(menu);
	menuOpen(menu,cmdKey);
}
async function onclickUser() {
  let uname = await mPrompt(iDiv(UI.user));
  await switchToUser(uname);
}
function showNavbar() {
	let nav = UI.nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
	commands.colors = menuCommand(nav.l, 'nav', 'colors', null, onclickColors, clearMain);
	commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, clearMain);
	commands.play = menuCommand(nav.l, 'nav', 'play', null, showTables, clearMain);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
	nav.commands = commands;
	// console.log(commands)
	UI.user = mCommand(nav.r, 'user', null, onclickUser);
}
async function switchToMenu(menu,key) { 
	menuCloseCurrent(menu);
	menuOpen(menu,key);
}
async function switchToUser(uname) {
  if (!isEmpty(uname)) uname = normalizeString(uname);
  if (isEmpty(uname)) uname = 'guest';
  sockPostUserChange(U ? U.name : '', uname); //das ist nur fuer die client id!
  U = await getUser(uname);
  Clientdata.lastUser = uname;
  localStorage.setItem('username', uname);

	// showUser(uname);
	let dUser = iDiv(UI.user);
  mClear(dUser);
  mStyle(dUser, { display: 'flex', gap: 12, valign: 'center' })
  let d;
  d = mDom(dUser, { cursor: 'pointer', padding: '.5rem 1rem', rounding: '50%' }, { html: U.name, className: 'activeLink' });
  setColors(U.color)
  d.onclick = onclickUser;

	let cur = UI.nav.cur;//Clientdata.lastMenu;
  if (uname == 'guest'){await switchToMenu(UI.nav,'home');menuDisable(UI.nav,'plan'); }
  else {
    menuEnable(UI.nav,'plan');
    let t=Clientdata.table;
    if (cur == 'play' && isdef(t) && t.fen.playerNames.includes(uname)) await showTable(t,uname);
    else await switchToMenu(UI.nav,valf(cur,'home'));
  }
}
