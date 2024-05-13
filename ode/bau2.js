
function testUpdateTestButtons(dParent, styles = {}) {
	let table = Clientdata.table;
	dParent = toElem(dParent);
	let id = 'dTestButtons'; mRemoveIfExists(id);
	mIfNotRelative(dParent);
	if (dParent.id == 'dExtra') mStyle(dParent,{hmin:26});
	addKeys({ display: 'flex', gap: 10, vpadding: 2, position: 'absolute', right: 8, top: 0 }, styles);
	let dBotHuman = mDom(dParent, styles, { id });
	let me = getUname();
	let names = isdef(table) ? [] : ['amanda', 'felix', 'lauren', 'mimi', 'gul'];
	for (const name of names) {
		let idname = getButtonCaptionName(name);
		let b = UI[idname] = mButton(name, testOnclickCaption, dBotHuman);
		if (me == name) mStyle(b, { bg: 'red', fg: 'white' });
	}
	if (nundef(table)) return dBotHuman;;
	let playmode = getPlaymode(table, me);
	if (nundef(playmode)) return dBotHuman;;
	let [playmodeKey, sz, bg, matop, patop] = [playmode == 'human' ? 'skullcap' : 'robot', 25, 'transparent', 2, 0];
	showImage(playmodeKey, dBotHuman, { fg: 'white', sz, round: true, bg, matop, patop });// , 'line-height': sz });
	let caption = `Make me ${playmode == 'bot' ? 'human' : 'bot'}`;
	UI.bPlaymode = mButton(caption, testOnclickPlaymode, dBotHuman, { w: 130 });
	return dBotHuman;
}
