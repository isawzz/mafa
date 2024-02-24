function collSidebar() {

	mStyle('dLeft', { wmin: 100 });
	let d = mDom('dLeft', { margin: 10, matop: 100 }); //,fg:getThemeFg()});

	UI.newCollection = mCommand(d, 'newCollection', 'New / Edit'); mNewline(d);
	UI.deleteCollection = mCommand(d, 'deleteCollection', 'Delete Collection');	mNewline(d);
	UI.renameCollection = mCommand(d, 'renameCollection', 'Rename Collection');	mNewline(d);
	UI.deleteSelected = mCommand(d, 'deleteSelected', 'Delete'); mNewline(d);
	cmdDisable(UI.deleteSelected);
}
async function onclickCollItem(ev) {
  evNoBubble(ev);
  let o = evToAttrElem(ev, 'key');
  if (!o) return;
  let [key, elem] = [o.val, o.elem];
  if (nundef(key)) { console.log('no key'); return; }
  if (nundef(Items[key])) {
    let o = M.superdi[key];
    Items[key] = { key:key, selected: false };
    addKeys(o, Items[key]);
  }
  Items[key].div = elem; 
  if (nundef(UI.selectedImages)) UI.selectedImages = [];
	let selist = UI.selectedImages;
  toggleSelectionOfPicture(Items[key], UI.selectedImages);

	console.log('selected',UI.selectedImages.map(x=>x.key))
	if (isEmpty(selist)) collDisableListCommands(); else collEnableListCommands();
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










