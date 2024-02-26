async function onclickDeleteSelected(){
	console.log('delete',UI.selectedImages.map(x=>x.key));

	//only items that do not belong to locked collection can be deleted
	//first check if this item can be deleted
	//collPreReload(collname);
	let di={},deletedKeys={};

	for(const item of UI.selectedImages){
		console.log('item',item);
		let coll = collSelectedFindCollection(item);
		assertion(coll,'deleteSelected called outside of Collections!!!!!');
		
		if (collLocked(coll.name)) continue; //item cannot be removed or deleted because collection locked
		if (nundef(deletedKeys[coll.name])) deletedKeys[coll.name]=[];
		await collDeleteOrRemove(item.key,coll.name,di,deletedKeys[coll.name]);
	}

	//die deletedKeys da muss ich mir merken von welcher coll!!!!
	console.log('deletedKeys dict: ',deletedKeys);

	for(const k in deletedKeys){
		let res = await mPostRoute('postUpdateSuperdi',{di,deletedKeys:deletedKeys[k],collname:k});
		console.log('postUpdateSuperdi',k,res)
	}

	await loadAssets();
	collPostReload(); //	delete M.byCollection[collname];
	UI.selectedImages = [];

}
//async function collRemoveFromCollection(coll,item){}













