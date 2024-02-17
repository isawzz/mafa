async function collRename(oldname,newname){
	if (collLockedOrDoesNotExist(oldname)) return;
	console.log('rename collection', oldname,'to',newname)
	collPreReload(oldname);

	//if any of the keys has an img that includes img/oldname/
	//should rename directory (only once!) and rename the path img accordingly

	let needToRenameDir=false;
	for(const k of M.byCollection[oldname]){
		let item = M.superdi[k];
		let path = item.img;
		if (isString(path) && path.includes(`img/${oldname}/`)){
			item.img = `../assets/img/${newname}/${stringAfterLast(path,'/')}`;
			needToRenameDir=true;
		}
		removeInPlace(item.colls,oldname)
		item.colls.push(newname);
		let res = await mPostRoute('postUpdateItem',{key:k,item:item});
		console.log(res)
	}
	if (needToRenameDir) await mPostRoute('renameImgDir',{oldname,newname});
	await loadAssets();
	if (UI.collPrimary.name==oldname)UI.collPrimary.name=newname;
	if (UI.collSecondary.name==oldname)UI.collSecondary.name=newname;
	collPostReload(); 
}


















