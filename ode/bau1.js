
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o); //console.log('1',o.species)
	addKeys(M.details[o.friendly], o); //console.log('e',o.species)
	o.key = key;

	//specifics
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) o.ofoodtype = extractFoodType(o.food); //console.log(key,foodtype)
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) { 
		//console.log(o.species,typeof o.species);
		let x=o.species;o.longSpecies = x; o.species = extractSpecies(x); //console.log(x) 
	}

	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color,colors);

	o = sortDictionary(o);
	return o;
}
