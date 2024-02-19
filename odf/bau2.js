function collSidebar() {

	mStyle('dLeft', { wmin: 100 });
	let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

	UI.newCollection = mCommand(d, 'newCollection', 'New / Edit'); mNewline(d);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	
}










