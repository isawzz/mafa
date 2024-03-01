
function collSidebar() {

	mStyle('dLeft', { wmin: 100 });
	let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

	UI.newCollection = mCommand(d, 'newCollection', 'New / Edit'); mNewline(d);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	mNewline(d);
	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete'); mNewline(d);
	cmdDisable(UI.deleteSelected);
	// UI.sortCollection = mCommand(d, 'sortBy', 'Sort By'); mNewline(d);
}
function collDisableListCommands(){
	for(const cmd of [UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.addCatToSelected]){
		if (nundef(cmd)) continue;
		cmdDisable(cmd);
	}
}
function collEnableListCommands(){
	for(const cmd of [UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.addCatToSelected]){
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
}
















