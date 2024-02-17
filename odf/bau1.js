async function collDeleteKey(key){
	let item = M.superdi[key];
	assertion(isdef(item.img) && isdef(item.key),`superdi[${key}] cannot be deleted!!!!`);
	let path = item.img;
	let res = await mPostRoute('deleteImage', { path: item.img });
	console.log('res', res);

	//das mach ich jetzt anders
	res = await mPostRoute('deleteItem', { key: key });
	//wie wird M geladen? prelims?
	await loadAssets();

	//collections muessen neu initiated werden!

}
function deleteKeyFromLocalSuperdi(k){
	delete M.superdi[k];

	let fri=item.friendly;
	//remove the key from M.byFriendly, if M.byFriendly[item.friendly] empty also delete it from names and byFriendly
	let lst=M.byFriendly[fri];
	removeInPlace(lst,k); if (isEmpty(lst)) {delete M.byFriendly[fri];removeInPlace(M.names,fri);}

	//for each cat: remove the key from M.byCat, if M.byFriendly[item.friendly] empty also delete it from names and byFriendly
	for(const cat of item.cats){
		let lst=M.byCat[cat];
		removeInPlace(lst,k); if (isEmpty(lst)) {delete M.byCat[cat];removeInPlace(M.categories,cat);}
	}
}
async function collRename(oldname,newname){
	if (collLockedOrDoesNotExist(oldname)) return;
	console.log('rename collection', oldname,'to',newname)
	collPreReload(oldname);
	for(const k of M.byCollection[oldname]){
		let item = M.superdi[k];
		removeInPlace(item.colls,oldname)
		item.colls.push(newname);
		let res = await mPostRoute('postUpdateItem',{key:k,item:item});
		console.log(res)
	}
	await loadAssets();
	if (UI.collPrimary.name==oldname)UI.collPrimary.name=newname;
	if (UI.collSecondary.name==oldname)UI.collSecondary.name=newname;
	collPostReload(); 
}
function collLockedOrDoesNotExist(collname){
	if ('all amanda animals big emo fa6 icon nations users'.includes(collname)) {
		console.log(`!!!!!CANNOT delete this collection ${collname}`);
		return true;
	}
	let keys = M.byCollection[collname];
	if (nundef(keys)) {
		console.log(`!!!!!collection does not exists ${collname}`);
		return true;
	}
	return false;
}
function collPreReload(name){if (name == UI.collSecondary.name) { collCloseSecondary(); UI.collSecondary.name = null; }}
function collPostReload(){
	if (UI.collPrimary.isOpen) { collInitCollection(UI.collPrimary.name, UI.collPrimary); }
	if (UI.collSecondary.isOpen) { collInitCollection(UI.collSecondary.name, UI.collSecondary); }

}
async function collDelete(collname) {
	if (collLockedOrDoesNotExist(name)) return;
	console.log('delete collection', keys)
	collPreReload(name);
	for (const k of keys) {
		let item = M.superdi[k];
		console.log('item', item)
		let colls = item.colls;
		console.log('colls',colls)
		if (colls.includes(collname) && colls.length == 1) {
			await collDeleteKey(k);			
		}else{
			//this pic cannot be deleted! also: the key cannot be deleted!!!
			console.log('not deleting',path,'!!!!!!!!!!!!')
		}
		//jetzt muss 
		
	}
	collPostReload(); //	delete M.byCollection[collname];


}


















