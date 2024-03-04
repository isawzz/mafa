
function collSidebar() {

	// console.log('r',getRect('dLeft'))
	mStyle('dLeft', { wmin: 155 });
	let d = mDom('dLeft', { margin: 10, matop: 100,h:window.innerHeight-getRect('dLeft').y-102 }); //, bg:'#00000020'  }); 

	UI.newCollection = mCommand(d, 'newCollection', 'New / Edit'); mNewline(d);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	mNewline(d);
	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete'); mNewline(d);
	cmdDisable(UI.deleteSelected);
	UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d);
	cmdDisable(UI.addCategory);
	// UI.sortCollection = mCommand(d, 'sortBy', 'Sort By'); mNewline(d);
}
function collDisableListCommands(){
	for(const cmd of [UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.addCategory]){
		if (nundef(cmd)) continue;
		cmdDisable(cmd);
	}
}
function collEnableListCommands(){
	for(const cmd of [UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.addCategory]){
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
}
















