function onclickCollDone(){
	collCloseSecondary();
	console.log('sec',UI.collSecondary)
	UI.collPrimary.name = UI.collSecondary.name;
	collOpenPrimary();
}
async function onclickCollNext(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	showImageBatch(coll, 1);
}
async function onclickCollPrev(ev) {
	let id = evToId(ev); console.log('id', id)
	let coll = UI[id];
	showImageBatch(coll, -1);
}
async function onclickCollections() {

	let dPanes = mDom('dMain'); mFlex(dPanes);
	let dSecondary = mDom(dPanes, { wmin: 0, w: 0 }, { id: 'collSecondary', className: 'translow' }); //mFlexWrap(dPlus);
	let dPrimary = mDom(dPanes, {}, { id: 'collPrimary' }); //mFlexWrap(d1);

	collSidebar();

	let collName = localStorage.getItem('collection');
	if (nundef(collName) || !M.collections.includes(collName)) collName = 'animals'

	UI.collPrimary = { div: dPrimary, name: collName }; //{name:'amanda'};
	UI.collSecondary = { div: dSecondary, name: null };
	collOpenPrimary(4, 4);
}
async function onclickDeleteCollection(name) {
	if (nundef(name)) name = UI.collSecondary.name;
	if (nundef(name)) name = await mGather(iDiv(UI.deleteCollection), 'name');

	let proceed = await mGather(iDiv(UI.deleteCollection), {}, { type: 'yesno', content: `delete collection ${name}?` });

	// console.log('...',(proceed?'will':'will NOT'),`delete collection ${name}`);
	if (proceed) await collDelete(name);
}
async function onclickNewCollection(name) {

	// if (nundef(name)) name=await mGather1(iDiv(UI.newCollection),'name');
	if (nundef(name)) name = await mGather(iDiv(UI.newCollection));
	//console.log('would open new Collection',name); return;

	if (isEmpty(name)){
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (collLocked(name)) {
		showMessage(`collection ${name} is Read-Only!`);
		return;
	}
	UI.collSecondary.name = name; 
	collOpenSecondary(4, 3);
}
async function onclickRenameCollection(oldname, newname) {
	if (nundef(oldname)) oldname = UI.collSecondary.name;
	if (nundef(newname)) {
		console.log('HALLO!!!!')
		let di = await mGather(iDiv(UI.renameCollection), {},{content:{ oldname: valf(oldname, ''), newname: '' },type:'multi'});
		console.log('di', di);
		[oldname,newname]=[di.oldname,di.newname];
	}

	newname = newname.toLowerCase();
	if (isEmpty(newname)){
		showMessage(`ERROR! you need to enter a valid new name!!!!`);
		return;
	}
	if (!isAlphanumeric(newname)) {
		showMessage(`ERROR! ${newname} needs to be alphanumeric starting with a letter!`);
		return;
	}
	if (collLocked(oldname)) {
		showMessage(`ERROR: Collection ${oldname} is Read-Only!`);
		return;
	}
	if (!collExists(oldname)) {
		showMessage(`ERROR: Collection ${oldname} not found!`);
		return;
	}
	if (isdef(M.byCollection[newname])){
		showMessage(`ERROR! Collection ${newname} already exists!!!!`);
		return;
	}

	//console.log(`would rename collection ${oldname} to ${newname}`);return;
	await collRename(oldname, newname);
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
	let uname = await mGather(iDiv(UI.user),{w:100,margin:0},{content:'username',align:'br',placeholder:' <username> '});
	await switchToUser(uname);
}
