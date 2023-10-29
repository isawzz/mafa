

function createImageIndex(){
	let byKey={},byFriendly={},byCat={};
	console.log(M.emos.abacus)
	for(const k in M.emos){
		let o=M.emos[k];
		let onew = {friendly:k};
		addKeys(o,onew);
		if (isdef(o.img)) onew.path = '../assets/img/emo/'+o.img;
		byKey[k]=onew;
		lookupAddIfToList(byFriendly,[k],onew);
		o.cats.map(x=>lookupAddIfToList(byCat,[x],onew));
	}
	for(const k in M.collections){
		let o=M.collections[k];
		let onew = {friendly:o.name,cats:[o.cat],img:k+'.'+k.ext};
		onew.path = `../y/${k}.${o.ext}`;
		byKey[k]=onew;
		lookupAddIfToList(byFriendly,[o.name],onew);
		lookupAddIfToList(byCat,[o.cat],onew);
	}
	return [byKey,byFriendly,byCat];
}
async function loadCollections(){
	if (nundef(M.emos)) {
		let type=detectSessionType();
		let server=type == 'vps'?'https://server.vidulusludorum.com':'http://localhost:3000';
		M.emos = await mGetYaml('../assets/m.yaml');
		M.collections = await mGetYaml('../y/m2.yaml');
		M.amanda = await mGetFiles(server,'../assets/img/amanda')
		M.airport = await mGetFiles(server,'../assets/img/airport');
		M.animals = await mGetAnimals(server);

		let di = M.animals;
		for(const k in M.emos){
			let o=M.emos[k];
			let onew = {key:k,friendly:k};
			addKeys(o,onew);
			if (isdef(o.img)) {onew.path = '../assets/img/emo/'+o.img; onew.ext=stringAfter(o.img,'.');}
			di[k] = onew;
		}
		for(const k in M.collections){
			let o=M.collections[k];
			let onew = {key:k,friendly:o.name,cats:[o.cat],img:`${k}.${o.ext}`,ext:o.ext};
			onew.path = `../y/${k}.${o.ext}`;
			di[k] = onew;
		}
		for(const fname of M.amanda){
			let o = filenameToObject(fname, '../img/amanda', ['art','amanda']);
			if (isdef(di[o.key])) console.log('ACHTUNG!!! duplicate',o.key)
			di[o.key]=o;
		}
		for(const fname of M.airport){
			let o = filenameToObject(fname, '../img/airport', ['wallpaper','airport']);
			if (isdef(di[o.key])) console.log('ACHTUNG!!! duplicate',o.key)
			di[o.key]=o;
		}
		let superdi = M.superdi = sortKeysAlphabetically(di);

		//indexing superdi!
		let bycat={},byfriendly={};
		for(const k in superdi){
			let o = superdi[k];
			lookupAddIfToList(byfriendly,[o.friendly],o.key);
			o.cats.map(x=>lookupAddIfToList(bycat,[x],o.key));
		}

		M.byCat = sortKeysAlphabetically(bycat);
		M.byFriendly = sortKeysAlphabetically(byfriendly);
		M.names = Object.keys(M.byFriendly);
		M.categories = Object.keys(M.byCat); //collectCats(di); 


		showNavbar('M', ['view', 'add', 'play', 'create']);
		dTitle = mDom(document.body, { margin: 16 }, { tag: 'h1', html: 'Add to Collection' });
		mInsert(document.body, dTitle, 1)
	}	
	return [M.emos,M.cats];
}












