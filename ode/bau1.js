function isAncestorOf(elem, elemAnc) {
	while (elem) {
			if (elem === elemAnc) {
					return true;
			}
			elem = elem.parentNode;
	}
	return false;
}

function enableDataDrop(elem, onDropCallback) {
	const originalBorderStyle = elem.style.border;
	elem.addEventListener('dragover', ev => { ev.preventDefault(); }); // Prevent default behavior for dragover and drop events to allow drop
	elem.addEventListener('dragenter', ev => { 
		console.log(ev);
		let els=ev.srcElement;
		if (isAncestorOf(els,elem)) return;
		elem.style.border = '2px solid red'; 
	}); // Highlight the border on drag enter
	elem.addEventListener('drop', ev => {
		ev.preventDefault();
		elem.style.border = originalBorderStyle;
		console.log('border', elem.style.border)
		onDropCallback(ev, elem);
	});
}

function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o);
	o.key=key;

	//specifics
	if (isdef(o.lifespan)) o.olifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) o.ofoodtype = extractFoodType(o.food); //console.log(key,foodtype)
	if (isdef(o.offsprings)) o.ooffsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) {o.oweight = calcWeight(o.weight);o.nweight=o.oweight.avg;}
	
	if (isdef(o.size)) {o.osize = calcSize(o.size);o.nsize=o.osize.avg;}

	let colors = ['turquoise', 'bluegreen', 'teal', 'brown', 'gray', 'green', 'violet', 'blue', 'black', 'yellow', 'white', 'lavender', 'orange', 'buff', 'red', 'pink', 'golden', 'cream', 'grey', 'sunny', 'beige'];
	if (isdef(o.color)) o.colors = extractColors(o.color);

	o = sortDictionary(o);
	return o;
}
