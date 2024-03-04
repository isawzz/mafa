
function collFromElement(elem){
	let id = findAttributeInAncestors(elem,'id'); //console.log('ancestor is',id);//find Ancestor with id collPrimary or collSecondary
	let coll = id == 'collPrimary'?UI.collPrimary:id == 'collSecondary'?UI.collSecondary:null;
	return coll;
}
function isPointOutsideOf(form, x, y) { const r = form.getBoundingClientRect(); return (x < r.left || x > r.right || y < r.top || y > r.bottom); }






