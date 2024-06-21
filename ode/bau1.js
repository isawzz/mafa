
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o); //console.log('1',o.species)
	addKeys(M.details[o.friendly], o); //console.log('e',o.species)
	o.key = key;

	//specifics
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) {
		[o.foodlist,o.foodtype] = extractFoodAndType(o.food); //console.log(key,foodtype)
		let foodTokens = [];
		if (['berries','fruit'].some(x=>o.foodlist.includes(x))) foodTokens.push('../assets/games/wingspan/fruit.svg');
		if (['fish','shrimp','squid'].some(x=>o.foodlist.includes(x))) foodTokens.push('../assets/games/wingspan/fish.svg');
		if (['wheat','grain','crops'].some(x=>o.foodlist.includes(x))) foodTokens.push('../assets/games/wingspan/wheat.svg');
		if (o.foodtype.startsWith('insect')) foodTokens.push('../assets/games/wingspan/worm.svg');
		else if (o.foodtype.startsWith('carni')) foodTokens.push('../assets/games/wingspan/mouse.svg');
		else if (o.foodtype.startsWith('omni')) foodTokens.push('omni');
		else if (o.foodtype.startsWith('herbi')) foodTokens.push('../assets/img/emo/seedling.png');
		o.foodTokens = foodTokens;
	}
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) { o.oweight = calcWeight(o.weight); o.nweight = o.oweight.avg; }
	if (isdef(o.size)) { o.osize = calcSize(o.size); o.nsize = o.osize.avg; }
	if (isdef(o.species)) {
		//console.log(o.species,typeof o.species);
		let x = o.species; o.longSpecies = x; o.species = extractSpecies(x); //console.log(x) 
	}
	if (isdef(o.habitat)) { 
		let text = o.habitat; 
		let ohab= o.ohabitat = { text };
		let hlist = ohab.list = extractHabitat(text,['coastal']);
		let colors = ohab.colors = [];
		let imgs = ohab.imgs = [];
		if (['wetland'].some(x=>hlist.includes(x))) {colors.push('lightblue');imgs.push('../ode/wetland.png');}
		if (['dwellings','grassland','desert'].some(x=>hlist.includes(x))) 			{colors.push('goldenrod');imgs.push('../ode/grassland2.png');}
		if (['forest','mountain','ice'].some(x=>hlist.includes(x))) 			{colors.push('emerald');imgs.push('../ode/forest1.png');}
		//if (['dwellings','ice'].some(x=>hlist.includes(x))) hcolors.push('grey');
	}

	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color, colors);

	o = sortDictionary(o);
	return o;
}
