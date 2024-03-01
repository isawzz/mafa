
function collFromElement(elem){
	let id = findAttributeInAncestors(elem,'id'); //console.log('ancestor is',id);//find Ancestor with id collPrimary or collSecondary
	let coll = id == 'collPrimary'?UI.collPrimary:id == 'collSecondary'?UI.collSecondary:null;
	return coll;
}






