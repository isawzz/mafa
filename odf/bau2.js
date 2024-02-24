async function onclickDeleteSelected(){
	console.log('delete',UI.selectedImages.map(x=>x.key));

	//only items that do not belong to locked collection can be deleted
	//first check if this item can be deleted
	let di={},deletedKeys=[];

	for(const item of UI.selectedImages){
		console.log('item',item);
		let coll = collSelectedFindCollection(item);
		assertion(coll,'deleteSelected called outside of Collections!!!!!');

		if (collLocked(coll.name)) continue; //item cannot be removed or deleted because collection locked

		let m=M.superdi[item.key];

		//await collRemoveFromCollection(coll,item); 
		

		//now find the real item behind that image
		let colls = m.colls;
		if (colls.some(x=>collLocked(x))) continue; //item cannot be deleted but can be removed from this collection!

		//item can be deleted!

		await collDeleteKey(item.key)


	}

}
//async function collRemoveFromCollection(coll,item){}













