onload = start;
async function start() { test1(); }

async function test1(){
	let dir='../factory/assets/'
	let m = await mGetYaml(dir+'m.yaml'); //console.log('m', m);
	let emo  = createMDict(m); 
	console.log('emo',emo)
	let syms = await mGetYaml(dir+'allSyms.yaml'); 
	let facodes = await mGetYaml(dir+'facodes.yaml'); 

	let gamecodes = await mGetYaml(dir+'gamecodes.yaml'); 
	fa = convertValuesToDict(facodes,'fa')
	game = convertValuesToDict(gamecodes,'ga')
	for (const pair of [[game, 'g'], [fa, 'f'], [syms, 's'], [emo, 'm']]) {
		for (const k in pair[0]) { pair[0][k].type = pair[1]; }

	}

	let di = M = mergeDictionariesWithListOfValues([emo,syms,fa,game]);
	console.log('di',di);

	//da draus mach jetzt ein di dass alle values merged hat, und type soll sein: 

}
async function test0() {
	// Read the .yaml file into a dictionary
	const data = {};
	const allSyms = yaml.load(fs.readFileSync('allSyms.yaml', 'utf8'));
	//facodes und gamecodes sind unicode hex chars, iconchars hat alle
	const facodes = yaml.load(fs.readFileSync('facodes.yaml', 'utf8'));
	const gamecodes = yaml.load(fs.readFileSync('gamecodes.yaml', 'utf8'));
	const iconchars = yaml.load(fs.readFileSync('iconchars.yaml', 'utf8'));
	let m = yaml.load(fs.readFileSync('m.yaml', 'utf8'));
	//console.log('m',m.emoji.nature)
	console.log('m list', m.emoji.list.length)
	m = createMDict(m);
	const gsg = yaml.load(fs.readFileSync('symGSG.yaml', 'utf8'));
	let gkeys = Object.keys(gamecodes);
	let fkeys = Object.keys(facodes);
	let ikeys = Object.keys(iconchars);
	let skeys = Object.keys(allSyms);
	let mkeys = Object.keys(m);
	console.log('g', Object.keys(gamecodes).length);
	console.log('f', Object.keys(facodes).length);
	console.log('i', Object.keys(iconchars).length);
	console.log('s', Object.keys(allSyms).length);
	console.log('m', Object.keys(m).length);

	for (const pair of [[gamecodes, 'g'], [facodes, 'f'], [iconchars, 'i'], [allSyms, 's'], [m, 'm']]) {
		for (const k in pair[0]) { pair[0][k].type = pair[1]; }

	}

	const di = {
		g: { di: gamecodes, keys: Object.keys(gamecodes), vals: Object.values(gamecodes) },
		f: { di: facodes, keys: Object.keys(facodes), vals: Object.values(facodes) },
		i: { di: iconchars, keys: Object.keys(iconchars), vals: Object.values(iconchars) },
		s: { di: allSyms, keys: Object.keys(allSyms), vals: Object.values(allSyms) },
		m: { di: m, keys: Object.keys(m), vals: Object.values(m) },
	}
	//console.log('gc',di.g.di)
	let arr = 'gfism';
	for (let i = 0; i < arr.length; i++) {
		for (let j = i + 1; j < arr.length; j++) {
			let di1 = di[arr[i]].di;
			let di2 = di[arr[j]].di;
			let [uni, inter] = computeUnionAndIntersection(di1, di2);
			//console.log('uni',uni);
			console.log('inter', arr[i], arr[j], Object.keys(inter).length);
			//break;
		}
		//break;
	}
	console.log('*TEST DONE*')


}

function computeUnionAndIntersection(dict1, dict2) {
	let union = { ...dict1, ...dict2 };
	//return [union,{}];
	let intersection = {};

	for (let key in dict1) {
		//console.log(key);break;
		if (dict2[key] != undefined) { //key in dict2) { //dict2.hasOwnProperty(key)) {
			intersection[key] = dict1[key];
		}
	}

	return [union, intersection];
}
function createMDict(m) {
	let di = {};
	for (const cat of ['activity', 'food', 'nature', 'objects', 'people', 'travel']) {
		let list = m.emoji[cat];
		for (const w of list) {
			di[w] = { cat: cat, key: w.toLowerCase() };
		}
	}
	return di;
}
function convertValuesToDict(di,key) {
	let dires = {};
	for (const k in di) {
		dires[k] = {};dires[k][key]=di[k];
	}
	return dires;
}

function mergeDictionariesWithListOfValues(listOfDictionaries) {
	const mergedDictionary = {};

	for (const dictionary of listOfDictionaries) {
		for (const key of Object.keys(dictionary)) {
			if (mergedDictionary[key]) {
				mergedDictionary[key].push(dictionary[key]);
			} else {
				mergedDictionary[key] = [dictionary[key]];
			}
		}
	}

	return mergedDictionary;
}
