
function collSidebar() {

	// console.log('r',getRect('dLeft'))
	//mClear('dLeft');
	let wmin=170;
	mStyle('dLeft', { wmin: wmin,  });
	let d = mDom('dLeft', { wmin: wmin-10, margin: 10, matop: 180,h:window.innerHeight-getRect('dLeft').y-102 }); //, bg:'#00000020'  }); 

	UI.newCollection = mCommand(d, 'newCollection', 'New / Edit'); mNewline(d,6);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d,6);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	mNewline(d,12);

	// UI.editCollItem = mCommand(d, 'editCollItem', 'Edit Item'); mNewline(d,10);
	// cmdDisable(UI.editCollItem);

	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d,6);
	cmdDisable(UI.deleteSelected);

	UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d,6);
	cmdDisable(UI.editCategories);

	// UI.addCategories = mCommand(d, 'addCategories', 'Add Categories'); mNewline(d);
	// cmdDisable(UI.addCategories);

	// UI.removeCategories = mCommand(d, 'removeCategories', 'Remove Categories'); mNewline(d);
	// cmdDisable(UI.removeCategories);

	// UI.sortCollection = mCommand(d, 'sortBy', 'Sort By'); mNewline(d);
}
function collDisableItemCommands(){
	for(const cmd of [UI.editCollItem]){
		if (nundef(cmd)) continue;
		cmdDisable(cmd);
	}
}
function collEnableItemCommands(){
	for(const cmd of [UI.editCollItem]){
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
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
















