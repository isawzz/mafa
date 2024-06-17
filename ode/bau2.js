
function getDetailedSuperdi(key) {
	let o = M.superdi[key];
	addKeys(M.details[key], o);
	addKeys(M.details[o.friendly], o);

	//specifics
	if (isdef(o.lifespan)) o.lifespan = calcLifespan(o.lifespan);
	if (isdef(o.food)) o.foodtype = extractFoodType(o.food); //console.log(key,foodtype)

	// if (isdef(o.offsprings)) o.lifespan = calcLifespan(o.lifespan);
	// if (isdef(o.lifespan)) o.lifespan = calcLifespan(o.lifespan);


	o=sortDictionary(o);
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
function extractFoodType(s) {
	s = s.toLowerCase();
	// for (const t of ['omni', 'herbi', 'carni', 'insecti']) {
	// 	if (s.includes(t)) return t + 'vorous';
	// }
	let herbi = M.byCat.plant; herbi = herbi.concat(['leave', 'tree', 'twig', 'fruit', 'grass', 'grain']);
	let carni = M.byCat.animal;
	let insecti = ['insect','worm','ant','fly','flies']
	let di={herbi,carni,insecti};
	let types = [];
	let contained=[];
	for(const type in di){
		let arr = di[type];
		for(const a of arr){
			let len = a.length;
			let w=a.endsWith('s')?a.substring(0,len-1):a;
			if (s.includes(w)) {addIf(contained,w); addIf(types,type);}
		}
	}
	// if (plants.some(x => s.includes(x.substring(0,4)))) types.push('herbi');
	// if (carni.some(x => s.includes(x.substring(0,4)))) types.push('carni');
	if (isEmpty(types)) { console.log(s); return 'unknown' }
	if (types.length >= 2) return 'omnivorous';
	else return types[0] + 'vorous';
}










