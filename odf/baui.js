
function collSidebar() {

	// console.log('r',getRect('dLeft'))
	mStyle('dLeft', { wmin: 155 });
	let d = mDom('dLeft', { margin: 10, matop: 100,h:window.innerHeight-getRect('dLeft').y-102 }); //, bg:'#00000020'  }); 

	UI.newCollection = mCommand(d, 'newCollection', 'New / Edit'); mNewline(d);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	mNewline(d);
	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete'); mNewline(d);
	cmdDisable(UI.deleteSelected);
	UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d);
	cmdDisable(UI.editCategories);
	UI.addCategories = mCommand(d, 'addCategories', 'Add Categories'); mNewline(d);
	cmdDisable(UI.addCategories);
	UI.removeCategories = mCommand(d, 'removeCategories', 'Remove Categories'); mNewline(d);
	cmdDisable(UI.removeCategories);
	// UI.sortCollection = mCommand(d, 'sortBy', 'Sort By'); mNewline(d);
}
function collDisableListCommands(){
	for(const cmd of [UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.editCategories,UI.addCategories,UI.removeCategories]){
		if (nundef(cmd)) continue;
		cmdDisable(cmd);
	}
}
function collEnableListCommands(){
	for(const cmd of [UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.editCategories,UI.addCategories,UI.removeCategories]){
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
}
















