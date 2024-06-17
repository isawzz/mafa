
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o);

	//specifics
	if (isdef(o.lifespan)) o.lifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) o.foodtype = extractFoodType(o.food); //console.log(key,foodtype)
	if (isdef(o.offsprings)) o.offsprings = calcOffsprings(o.offsprings);
	if (isdef(o.weight)) o.weight = calcNumericInfo(o.weight, { kg: 1000, g: 1, mg: .001 }, 'kg');
	if (isdef(o.size)) o.size = calcNumericInfo(o.size, { cm: .01, centimeter: .01, mm: .001, millimeter: .001, meter: 1, m: 1 }, 'm');
	if (isdef(o.color)) o.colors = extractColors(o.color);

	o = sortDictionary(o);
	return o;
}
function getPresentableDetails(o) {
	let di = {};
	for (const key in o) {
		if ('cats colls fa fa6 img photo text key friendly ga name'.includes(key)) continue;
		let val = o[key];
		if (!isLiteral(val)) continue;
		di[key] = val;
	}
	return di;
}
function strRemoveTrailing(s, sub) {
	return s.endsWith(sub)?stringBeforeLast(s, sub):s;
}
function extractFoodType(s, easy = true, key = null) {
	s = s.toLowerCase();
	let words = toWords(s,true).map(x => strRemoveTrailing(x, 's'));
	if (easy) {
		for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
			if (s.includes(t)) return t + 'vorous';
		}
	}
	let herbi = M.byCat.plant; herbi = herbi.concat(['plant','berries','grasses','leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal; carni = carni.concat(['animal'])
	let insecti = ['insect', 'worm', 'ant', 'fly', 'flies']
	let di = { herbi, carni, insecti };
	let types = [];
	let contained = [];
	for (const type in di) {
		let arr = di[type];
		for (const a of arr) {
			let w = strRemoveTrailing(a, 's'); //console.log('w',w)
			let o = M.superdi[a];

			//if (key == 'stellers_jay') console.log('...', words)

			if (isdef(o) && words.includes(o.friendly) || words.includes(w)) {
				let cont = {};
				if (o) { cont.key = a; cont.cats = o.cats; cont.friendly = o.friendly }
				else cont.key = w;
				addIf(contained, cont); // w); 
				addIf(types, type);
				continue;
			}
		}
	}
	// if (plants.some(x => s.includes(x.substring(0,4)))) types.push('herbi');
	// if (carni.some(x => s.includes(x.substring(0,4)))) types.push('carni');
	//console.log('contained', contained, key)
	if (isEmpty(types)) { return 'unknown' }
	if (types.includes('herbi') && types.length >= 2) return 'omnivorous';
	else if (types.length >= 2) return 'carnivorous';
	else return types[0] + 'vorous';
}
function extractColors(s){
	let words = toWords(s);
	words = words.map(x=>strRemoveTrailing(x,'ish')).map(x=>x.toLowerCase());
	let colors = Object.keys(M.colorByName);

	let res = [];
	console.log(words)
	for(const w of words){
		for(const c of colors){
			if (c == 'pink') console.log('JAAAAAAAAAA')
			if (w == c) res.push(c);
		}
	}
	return res;

}









