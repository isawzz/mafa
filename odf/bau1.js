


async function onclickNewCollection(name) {

	// if (nundef(name)) name=await mGather1(iDiv(UI.newCollection),'name');
	if (nundef(name)) name=await mGather(iDiv(UI.newCollection));
	//console.log('would open new Collection',name); return;

	if (collLockedOrDoesNotExist(name)) {
		showMessage(`collection ${name} cannot be edited!`);
		return;
	}
	UI.collSecondary.name = name; //valf(name,'owl');
	collOpenSecondary(4, 3);

}
async function onclickDeleteCollection(name) {
	if (nundef(name)) name = UI.collSecondary.name;
	if (nundef(name)) name=await mGather(iDiv(UI.deleteCollection),'name');

	let proceed=await mGather(iDiv(UI.deleteCollection),{},{type:'yesno',content:`delete collection ${name}?`});
	console.log('proceed',proceed)
	console.log('...',(proceed?'will':'will NOT'),`delete collection ${name}`);
	// console.log('...',(proceed==true?'will':'will NOT'),`delete collection ${name}`);
	//if (proceed) await collDelete(name);
}
async function onclickRenameCollection(name,newname) {
	if (nundef(name)) name = UI.collSecondary.name;
	
	if (nundef(name)) name=await mGather(iDiv(UI.renameCollection));
	if (nundef(newname)) newname=await mGather(iDiv(UI.renameCollection),{matop:20},{content:'new name'});
	// if (nundef(name)) name = await mPrompt(UI.gadgetRenameCollection);
	await collRename(name,newname);
}



























