
function simpleSidebar(wmin) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;

	let stylesTitles={matop:10,bg:'#ffffff80',fg:'black'};

	//mDom(d,stylesTitles,{html:'Collection:'});
	UI.simpleNew = mCommand(d, 'simpleNew', 'New'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Selection:'})
	UI.simpleSelectAll = mCommand(d, 'simpleSelectAll', 'Select All'); mNewline(d, gap);
	UI.simpleSelectPage = mCommand(d, 'simpleSelectPage', 'Select Page'); mNewline(d, gap);
	UI.simpleClearSelections = mCommand(d, 'simpleClearSelections', 'Clear Selection'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Item:'})
	UI.setAvatar = mCommand(d, 'setAvatar', 'Set Avatar'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Items:'})
	UI.simpleRemove = mCommand(d, 'simpleRemove', 'Remove'); mNewline(d, gap);

	// UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	// UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	// UI.addSelected = mCommand(d, 'addSelected', 'Add Selected'); mNewline(d, gap);
	// UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	simpleDisableListCommands();
	simpleDisableItemCommands();
	// UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	// UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	// UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
}
function simpleDisableListCommands() {
	for (const cmd of [UI.simpleClearSelections, UI.deleteSelected, UI.addSelected, UI.simpleRemove, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd.key);
	}
}
function simpleDisableItemCommands() {
	for (const cmd of [UI.setAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdDisable(cmd.key);
	}
}
function simpleEnableItemCommands() {
	for (const cmd of [UI.setAvatar, UI.editCollItem]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
}
function simpleEnableListCommands() {
	for (const cmd of [UI.simpleClearSelections, UI.addSelected, UI.editCategories, UI.addCategory, UI.removeCategory]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
	if (isEmpty(UI.selectedImages)) return;
	for (const cmd of [UI.deleteSelected, UI.simpleRemove,]) {
		if (nundef(cmd)) continue;
		cmdEnable(cmd.key);
	}
}

