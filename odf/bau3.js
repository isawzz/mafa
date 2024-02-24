
function collSelectedFindCollection(item){
	let ui = iDiv(item);
	let id = findAttributeInAncestors(ui,'id'); console.log('ancestor is',id);//find Ancestor with id collPrimary or collSecondary
	let coll = item.coll = id == 'collPrimary'?UI.collPrimary:id == 'collSecondary'?UI.collSecondary:null;
	return coll;
}






