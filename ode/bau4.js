

function isExactly(n,num=1){return n == num;}
function isAtLeast(n,num=1){return n >= num;}
function simpleSidebar(wmin) {
	mStyle('dLeft', { wmin });
	let d = mDom('dLeft', { wmin: wmin - 10, matop: 20, h: window.innerHeight - getRect('dLeft').y - 102 }); //, bg:'#00000020'  }); 
	let gap = 5;
	let stylesTitles={matop:10,bg:'#ffffff80',fg:'black'};

	let cmds = {};
	//mDom(d,stylesTitles,{html:'Collection:'});
	cmds.simpleNew = mCommand(d, 'simpleNew', 'New'); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Selection:'})
	cmds.simpleSelectAll = mCommand(d, 'simpleSelectAll', 'Select All'); mNewline(d, gap);
	cmds.simpleSelectPage = mCommand(d, 'simpleSelectPage', 'Select Page'); mNewline(d, gap);
	cmds.simpleClearSelections = mCommand(d, 'simpleClearSelections', 'Clear Selection',{fSel:x=>x>=1}); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Item:'})
	cmds.setAvatar = mCommand(d, 'setAvatar', 'Set Avatar',{fSel:x=>x==1}); mNewline(d, gap);

	mDom(d,stylesTitles,{html:'Items:'})
	cmds.addSelected = mCommand(d, 'addSelected', 'Add To',{fSel:x=>(x>=1)}); mNewline(d, gap);
	cmds.simpleRemove = mCommand(d, 'simpleRemove', 'Remove',{fSel:x=>(!simpleLocked() && x>=1)}); mNewline(d, gap);

	// UI.editCategories = mCommand(d, 'editCategories', 'Edit Categories'); mNewline(d, gap);
	// UI.removeCategory = mCommand(d, 'removeCategory', 'Remove Category'); mNewline(d, gap);
	// UI.addCategory = mCommand(d, 'addCategory', 'Add Category'); mNewline(d, gap);
	// UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete Selected'); mNewline(d, 3 * gap);
	// UI.asSecondary = mCommand(d, 'asSecondary', 'Edit Collection'); mNewline(d, gap);
	// UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection'); mNewline(d, gap);
	// UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection'); mNewline(d, 3 * gap);
	// simpleDisableListCommands();
	// simpleDisableItemCommands();
	copyKeys(cmds,UI.commands);
	simpleCheckCommands();
}
function simpleCheckCommands(){
	if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let n = UI.selectedImages.length; 
	for(const k in UI.commands){
		let cmd = UI.commands[k];
		if (nundef(cmd) || nundef(iDiv(cmd))) continue;

		//console.log(cmd)
		//let x = cmd.fSel(n);console.log('k',k,cmd,x)
		if (nundef(cmd.fSel) || cmd.fSel(n)) cmdEnable(k); else cmdDisable(k);
	}
}













