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
async function collDelete(collname) {

	if ('all amanda animals big emo fa6 icon nations users'.includes(collname)) {
		console.log(`!!!!!CANNOT delete this collection ${collname}`);
		return;
	}
	let keys = M.byCollection[collname];
	if (nundef(keys)) {
		console.log(`!!!!!collection does not exists ${collname}`);
		return;
	}
	console.log('delete collection', keys)
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
	delete M.byCollection[collname];


}


















