async function collDeleteOrRemove(k,collname,di,deletedKeys){
	let item = M.superdi[k];
	console.log('item', item)
	let colls = item.colls;
	console.log('colls',colls)
	assertion(colls.includes(collname),`item ${k} from coll ${collname} does not have ${collname} in colls!!!!!!`)
	if (colls.length == 1) {
		console.log('deleting',k,'!!!!!!!!!!!!');
		deletedKeys.push(k);
	}else if (isdef(item.img) && item.img.includes(`/${collname}/`)){
		removeInPlace(item.colls,collname);
		//move this img to other collname, create it if it does not exist!!!

		let olddir = collname;
		let newdir=item.colls[0];
		let filename = stringAfterLast(item.img,'/');
		//item.img=`../assets/img/${newdir}/`
		item.img = item.img.replace(olddir,newdir);

		let resp = await mPostRoute('moveImage',{olddir,newdir,filename});
		if (isdef(resp.newpath)) item.img = resp.newpath;
		console.log('moveImage:',resp)
		// needToRenameImgDir={oldname:collname,newname:newpath};

		//bei einem key den ich nicht delete! muss ich colls aendern!
		//console.log('item',item);
		// removeInPlace(item.colls,collname);
		di[k]=item;
	}else{
		//this pic cannot be deleted! also: the key cannot be deleted!!!
		//bei einem key den ich nicht delete! muss ich colls aendern!
		//console.log('item',item);
		removeInPlace(item.colls,collname);
		di[k]=item;
		//res = await mPostRoute('postUpdateItem', { key: k, item:item });
	}

}

async function collDelete(collname) {
	if (collLocked(collname) || !collExists(collname)) return;
	let keys = M.byCollection[collname];
	console.log('_________delete collection', keys)
	collPreReload(collname);
	let di={},deletedKeys=[]; //,needToRenameImgDir=false,newdir=null;
	for (const k of keys) {
		await collDeleteOrRemove(k,collname,di,deletedKeys);
	}

	let res = await mPostRoute('postUpdateSuperdi',{di,deletedKeys,collname,deletedCollection:true});
	console.log('postUpdateSuperdi',res)
	await loadAssets();

	collPostReload(); //	delete M.byCollection[collname];


}
async function collDeleteKey(key) {
	let item = M.superdi[key];
	assertion(isdef(item.img) && isdef(item.key), `superdi[${key}] cannot be deleted!!!!`);
	let path = item.img;
	let res = await mPostRoute('deleteImage', { path: item.img });
	console.log('res', res);

	//das mach ich jetzt anders
	res = await mPostRoute('deleteItem', { key: key });
	//wie wird M geladen? prelims?
	await loadAssets();

	//collections muessen neu initiated werden!

}
async function collRename(oldname, newname) {
	if (collLocked(oldname) || !collExists(oldname) || !isAlphanumeric(newname)) {
		showMessage(`Cannot rename collection ${oldname} to ${newname}`);
		return;
	}
	console.log('rename collection', oldname, 'to', newname)
	collPreReload(oldname);
	let needToRenameDir = false;
	let di = {};
	for (const k of M.byCollection[oldname]) {
		let item = M.superdi[k];
		let path = item.img;
		if (isString(path) && path.includes(`img/${oldname}/`)) {
			item.img = `../assets/img/${newname}/${stringAfterLast(path, '/')}`;
			needToRenameDir = true;
		}
		removeInPlace(item.colls, oldname)
		item.colls.push(newname);
		di[k] = item;
		//let res = await mPostRoute('postUpdateItem',{key:k,item:item}); console.log(res)
	}


	if (needToRenameDir) {
		let resp = await mPostRoute('renameImgDir', { oldname, newname });
		console.log('response from server', resp)
	}
	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys:[] }); console.log('response from server', res)
	await loadAssets();
	if (UI.collPrimary.name == oldname) UI.collPrimary.name = newname;
	if (UI.collSecondary.name == oldname) UI.collSecondary.name = newname;
	collPostReload();
}
















