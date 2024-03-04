
async function onclickEditCategories() {
	let selist = UI.selectedImages; console.log('selist',selist)
	let keys=selist.map(x=>stringBefore(x,'@'));
	let catlist=M.categories.map(x=>({name:x}));
	let arrs=keys.map(x=>M.superdi[x].cats); 
	let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.editCategories), {},{content:catlist,type:'checklist'});	
	console.log('user selected',cats);
}

function uiGadgetTypeCheckList(form,content,styles,opts){

	//was soll der content sein? wo soll der content berechnet werden?
	addKeys({ bg: 'white', fg: 'black', padding: 10, rounding: 10, w100: true, box: true }, styles)
	let dOuter = mDom(form, styles)
	// let d=mDom(form,{bg:'white'})
	let dParent = mDom(dOuter,{hmax:510,wmax:200,pabottom:10,box:true}); //,bg:'blue',fg:'contrast'});

	console.log('content',content)
	let lst=content.map(x=>x.name);
	console.log('lst',lst)

	let ui = uiTypeCheckList(lst,dParent,styles,opts);
	console.log('ui',ui)

	mButton('done',onclickCatListDone,dParent,{classes:'input',margin:10}); //da muss noch ein button dazu



	//muss eine evalfunc returnen!!!
}



async function onclickAddCategories() {
	let selist = UI.selectedImages; console.log('selist',selist)
	let keys=selist.map(x=>stringBefore(x,'@'));
	let catlist=M.categories.map(x=>({name:x}));
	let arrs=keys.map(x=>M.superdi[x].cats); 
	let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.editCategories), {},{content:catlist,type:'checklist'});	
	console.log('user selected',cats);
}
async function onclickRemoveCategories() {
	//hier soll in der liste NUR intersein!
	let selist = UI.selectedImages; console.log('selist',selist)
	let keys=selist.map(x=>stringBefore(x,'@'));
	let catlist=M.categories.map(x=>({name:x}));
	let arrs=keys.map(x=>M.superdi[x].cats); 
	let inter = intersectionOfArrays(arrs);	console.log('inter',inter);
	for(const c of catlist){c.val=inter.includes(c.name);	}

	let cats = await mGather(iDiv(UI.editCategories), {},{content:catlist,type:'checklist'});	
	console.log('user selected',cats);
}
	
function intersectionOfArrays() {
	// Check if the input is an array of arrays
	let arrs=arguments[0];	console.log('arrs',arrs);
	if (!arrs.every(Array.isArray)) arrs=Array.from(arguments);
	return arrs.reduce((acc, array) => acc.filter(element => array.includes(element)));
}

async function hallo(){
	return;
	let cat = await mGather(iDiv(UI.editCategories), {},{content:M.categories,type:'select'});	
	console.log('selected cat',cat); return;
	//console.log('addCategpory', selist);
	let di = {};
	for (const k of selist) {
		let o = collKeyCollnameFromSelkey(k);
		let key = o.key;
		await collDeleteOrRemove(key, collname, di, deletedKeys[collname]);
	}
	let res = await mPostRoute('postUpdateSuperdi', { di, deletedKeys: [] });
	console.log('postUpdateSuperdi', k, res)
	await loadAssets();
	collPostReload();
	UI.selectedImages = [];
}











