
async function onclickNewCollection(name='tierspiel') {
	if (nundef(name)) name = await mGather(iDiv(UI.newCollection));
	if (!name) return;
	if (isEmpty(name)) {
		showMessage(`ERROR! you need to enter a valid name!!!!`);
		return;
	}
	if (collLocked(name)) {
		showMessage(`collection ${name} is Read-Only!`);
		return;
	}
	M.collections.push(name); M.collections.sort();
	UI.collSecondary.name = name;
	collOpenSecondary(4, 2);
	collOpenPrimary(4, 2);
}
async function onclickAsSecondary(ev) {
	console.log('onclickAsSecondary')
	let name = UI.collPrimary.name;
	if (name == 'all' || collLocked(name)) {
		showMessage(`ERROR! collection ${name} cannot be altered!`);
		return;
	}
	if (nundef(M.byCollection[name])) {
		showMessage(`ERROR! collection ${name} not found!`);
		return;
	}
	UI.collSecondary.name = name;
	UI.collPrimary.name = 'animals';
	collOpenSecondary(4, 2);
	collOpenPrimary(4, 2);
}























