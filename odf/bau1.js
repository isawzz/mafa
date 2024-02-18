
async function mGather1(dAnchor,label){
		//open a 1 text gadget that anchors to UI.newCollection command div
		let d=dAnchor;
		let rect=getRect(d);
		let gadget = mGadget('name', { padding:0, maleft:8, left: rect.l, top: rect.b });//, { placeholder: `<enter name>` });
		console.log(gadget)
		name = await mPrompt(gadget);
		return name;
}

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
	let resp=prompt(`Delete collection ${name}?`,'no');
	console.log('resp',resp)
	//await collDelete(name);
}
async function onclickRenameCollection(name) {
	
	if (nundef(name)) name = await mPrompt(UI.gadgetRenameCollection);
	await collRename(name);
}



























