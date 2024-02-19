


async function onclickNewCollection(name) {

	if (nundef(name)) name=await mGather1(iDiv(UI.newCollection),'name');

	if (collLockedOrDoesNotExist(name)) {
		showMessage(`collection ${name} cannot be edited!`);
		return;
	}
	UI.collSecondary.name = name; //valf(name,'owl');
	collOpenSecondary(4, 3);

}
async function onclickDeleteCollection(name) {
	if (nundef(name)) name = UI.collSecondary.name;
	if (nundef(name)) name=await mGather1(iDiv(UI.deleteCollection),'name');

	let proceed=await mGatherYesNo(iDiv(UI.deleteCollection),`delete collection ${name}?`);
	console.log('proceed',proceed)
	console.log('...',(proceed?'will':'will NOT'),`delete collection ${name}`);
	// console.log('...',(proceed==true?'will':'will NOT'),`delete collection ${name}`);
	//if (proceed) await collDelete(name);
}
async function onclickRenameCollection(name) {
	
	if (nundef(name)) name = await mPrompt(UI.gadgetRenameCollection);
	await collRename(name);
}



























