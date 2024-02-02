function clearMain() { clear_timeouts(); mClear('dMain'); mClear('dTitle'); }
function mCommand(dParent, key, html, open, close) {
	if (nundef(html)) html = capitalize(key);
	if (nundef(open)) open = window[`onclick${html}`];
	if (nundef(close)) close = () => { console.log('close', key) }
	let d = mDom(dParent, { display: 'inline-block' }, { key: key });
	let a = mDom(d, {}, { key: `${key}`, tag: 'a', href: '#', html: html, className: 'nav-link', onclick: onclickCommand })

	return { dParent, elem: d, div: a, key, open, close };
}
function menuCommand(dParent, menuKey, key, html, open, close) {
	let cmd = mCommand(dParent, key, html, open, close);
	let a = iDiv(cmd);
	a.setAttribute('key', `${menuKey}_${key}`);
	a.onclick = onclickMenu;
	cmd.menuKey = menuKey;
	return cmd;
}
function menuCloseCurrent(menu) {
	let curKey = lookup(menu, ['cur']);
	//console.log('current',menu,curKey)
	if (curKey) {
		let cur = menu.commands[curKey];
		mClassRemove(iDiv(cur), 'activeLink'); //unselect cur command
		cur.close();

	}
}
function menuDisable(menu, key) { mClass(iDiv(menu.commands[key]), 'disabled') }
function menuEnable(menu, key) { mClassRemove(iDiv(menu.commands[key]), 'disabled') }
function menuOpen(menu, key) {
	let cmd = menu.commands[key];	//console.log('clicked',menu,cmd);
	menu.cur = key;
	mClass(iDiv(cmd), 'activeLink')
	cmd.open();
}
function mGadget(name, styles = {}) {
	let d = document.body;
	let dialog = mDom(d, { w100: true }, { className: 'reset', tag: 'dialog', id: `modal_${name}` });
	//addKeys({ position: 'fixed', top: 40, left: 0, display: 'inline-block', padding: 12, box: true },styles)
	addKeys({ position: 'fixed', display: 'inline-block', padding: 12, box: true }, styles)
	let form = mDom(dialog, styles, { autocomplete: 'off', tag: 'form', method: 'dialog' });
	let inp = mDom(form, { outline: 'none', w: 130 }, { className: 'input', name: name, tag: 'input', type: 'text', placeholder: `<enter ${name}>` });
	mDom(form, { display: 'none' }, { tag: 'input', type: 'submit' });
	return { name, dialog, form, inp }
}
function mLMR(dParent) {
	dParent = toElem(dParent);
	let d = mDom(dParent, { display: 'flex', 'align-items': 'center', 'justify-content': 'space-between', 'flex-flow': 'row nowrap' });
	let stflex = { gap: 10, display: 'flex', 'align-items': 'center' };
	let [l, m, r] = [mDom(d, stflex), mDom(d, stflex), mDom(d, stflex)];
	return [d, l, m, r];
}
function mMenu(dParent, key) { let [d, l, m, r] = mLMR(dParent); return { dParent, elem: d, l, m, r, key, cur: null }; }
async function mPrompt(gadget) {
	return new Promise((resolve, reject) => {
		//console.log('form', gadget.form);
		gadget.dialog.showModal();
		gadget.form.onsubmit = (event) => {
			event.preventDefault(); // Prevent the default form submission
			resolve(gadget.inp.value);
			gadget.inp.value = '';
			gadget.dialog.close();
		};
	});
}
function onclickCommand(ev) {
	let key = evToAttr(ev, 'key');
	//console.log('click command',key)
	assertion(isdef(UI[key]), `command ${key} not in UI!!!`)
	let cmd = UI[key];
	cmd.open();
}
function onclickMenu(ev) {
	let keys = evToAttr(ev, 'key');
	let [menuKey, cmdKey] = keys.split('_');
	let menu = UI[menuKey];
	menuCloseCurrent(menu);
	menuOpen(menu, cmdKey);
}
async function onclickUser() {
	let gadget = UI.gadgetUsername;
	let uname = await mPrompt(gadget);
	//console.log('username is',uname)
	await switchToUser(uname);
}
async function showColors() {
	showTitle('Set Color Theme');
	let sz = 30;
	let d = mDom('dMain', { wmax: (sz + 4) * 15, hpadding: 0, display: 'flex', gap: '2px 4px', wrap: true });
	let grays = []; for (const x of '0123456789abcde') { grays.push(`#${x}${x}${x}${x}${x}${x}`) };
	list = M.playerColors.concat(grays);
	for (const c of list) {
		let dc = mDom(d, { w: sz, h: sz, bg: c, fg: idealTextColor(c) });
		dc.onclick = onclickColor;
		mStyle(dc, { cursor: 'pointer' });
	}
}
async function showDashboard() {
	mDom('dMain', { fg: getThemeFg() }, { html: `hi, ${U.name}! this is your dashboard` })
}
function showNavbar() {
	let nav = mMenu('dNav');
	let commands = {};
	commands.home = menuCommand(nav.l, 'nav', 'home', 'HOME', showDashboard, clearMain);
	commands.colors = menuCommand(nav.l, 'nav', 'colors', null, showColors, clearMain);
	commands.collections = menuCommand(nav.l, 'nav', 'collections', null, onclickCollections, clearMain);
	commands.play = menuCommand(nav.l, 'nav', 'play', null, showTables, clearMain);
	commands.plan = menuCommand(nav.l, 'nav', 'plan', 'Calendar', onclickPlan, clearMain);
	nav.commands = commands;
	// console.log(commands)
	return nav;
}
async function switchToMenu(menu, key) {
	menuCloseCurrent(menu);
	menuOpen(menu, key);
}
async function switchToUser(uname) {
	if (!isEmpty(uname)) uname = normalizeString(uname);
	if (isEmpty(uname)) uname = 'guest';
	sockPostUserChange(U ? U.name : '', uname); //das ist nur fuer die client id!
	U = await getUser(uname);
	Clientdata.lastUser = uname;
	localStorage.setItem('username', uname);

	iDiv(UI.user).innerHTML = uname;
	setColors(U.color);

	if (uname == 'guest') { await switchToMenu(UI.nav, 'home'); menuDisable(UI.nav, 'plan'); }
	else {
		menuEnable(UI.nav, 'plan');
		let t = Clientdata.table;
		let cur = UI.nav.cur; console.log('current menu is',cur); 
		if (cur == 'play' && isdef(t) && t.fen.playerNames.includes(uname)) await showTable(t, uname);
		else await switchToMenu(UI.nav, valf(cur, 'home'));
	}
}
