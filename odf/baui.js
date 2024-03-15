
function collSidebar() {

	// console.log('r',getRect('dLeft'))
	//mClear('dLeft');
	let wmin=170;
	mStyle('dLeft', { wmin: wmin,  });
	let d = mDom('dLeft', { wmin: wmin-10, margin: 10, matop: 160,h:window.innerHeight-getRect('dLeft').y-102 }); //, bg:'#00000020'  }); 
	let gap=5;

	// *** selection commands ***
	UI.collSelectAll = mCommand(d, 'collSelectAll', 'Select All'); mNewline(d,gap);
	UI.collSelectPage = mCommand(d, 'collSelectPage', 'Select Page'); mNewline(d,gap);
	UI.collClearSelections = mCommand(d, 'collClearSelections', 'Clear Selection'); mNewline(d,gap);
	UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d,gap);
	UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d,gap);
	UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d,gap);
	UI.addSelected = mCommand(d, 'addSelected', 'Add Selected'); mNewline(d, gap);
	UI.removeSelected = mCommand(d, 'removeSelected', 'Remove Selected'); mNewline(d, gap);
	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d,3*gap);
	collDisableListCommands();

	// *** collectino commands ***
	UI.newCollection = mCommand(d, 'newCollection', 'New Collection'); mNewline(d,gap);
	UI.asSecondary = mCommand(d, 'asSecondary', 'Open DragDrop'); mNewline(d,gap);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d,gap);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	mNewline(d,3*gap);


	//onclickCollClearSelections	//cmdDisable(UI.collSelectAll);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Categories'); mNewline(d);
	// cmdDisable(UI.addCategory);


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
	for(const cmd of [UI.collClearSelections,UI.deleteSelected,UI.addSelectedToCollection,UI.removeSelected,UI.editCategories,UI.addCategory,UI.removeCategory]){
		if (nundef(cmd)) continue;
		cmdDisable(cmd);
	}
}
function collEnableListCommands(){
	for(const cmd of [UI.collClearSelections,UI.addSelectedToCollection,UI.editCategories,UI.addCategory,UI.removeCategory]){
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
	let selist=UI.selectedImages;
	//console.log('selist',selist);
	let colls = selist.filter(x=>!collLocked(stringAfter(x,'@')));
	if (isEmpty(colls)) return;

	for(const cmd of [UI.deleteSelected,UI.removeSelected,]){
		if (nundef(cmd)) continue;
		cmdEnable(cmd);
	}
}
















