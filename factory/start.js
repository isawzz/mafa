onload = start;
async function start() { test18(); }

async function test19(){
	let files = await getFilesFromApp
}
async function test18() {
	M = createMFromAssetsOld();
}
async function createMFromAssetsOld() {
	//read in allSyms
	let dinew = await createAllsymsNew();
	dinew = await addFacodesTo(dinew);
	dinew = await addGamecodesTo(dinew);
	dinew = await addImagesTo(dinew);
	dinew = await addCats(dinew);

	//da ist aber jetzt noch nur das mit den genders drin!
	//eliminate genders!
	let di1 = dictWithoutGender(dinew);
	dinew = sortKeysAlphabetically(di1);

	dinew = filterCats(dinew);

	console.log('dinew count', Object.keys(dinew).length);
	console.log(dinew.sun);
	console.log('downloading HALLO')
	//downloadAsYaml(dinew,'HALLO');

}
function filterCats(dinew) {
	for (const k in dinew) {
		let o = dinew[k];
		if (isEmpty(dinew[k].cats)) {
			if (k.includes('digit')) o.cats = ['digit', 'symbol'];
			else if (k.includes('clock')) o.cats = ['time'];
			else if (k.includes('sign')) o.cats = ['sign', 'symbol'];
			else if (k.includes('blood')) o.cats = ['medical', 'symbol'];
			else if (k.includes('globe')) o.cats = ['place'];
			else if (k.includes('heart')) o.cats = ['symbol', 'heart', 'emotion'];
			else if (k.includes('key')) o.cats = ['symbol', 'key'];
			else { o.cats = ['symbol']; } //console.log('no cats',k,dinew[k]);}
		}
		if (k.includes('blood_type')) addIf(o.cats, 'medical');
	}

	for (const k in dinew) {
		let cats = dinew[k].cats;
		let newcats = [];
		//if (['moon','sun','rain','sky']k.includes())
		if (k.includes('_moon')) newcats = ['symbol'];
		else if (cats.includes('living being')) newcats = ['nature'];
		else if (cats.includes('sky')) newcats = ['nature', 'symbol'];
		else if (cats.includes('planet')) newcats = ['nature'];
		else {
			for (const c of cats) {
				if (isNumber(c) || c.length < 2) continue;
				addIf(newcats, c);
			}
		}
		dinew[k].cats = newcats;
	}
	return dinew;

}
async function addCats(dinew) {
	//add cats from cats.yaml file
	let txt = await mGetText('../factory/assets/cats.txt');
	let lines = txt.split('\n');
	let cats = {};
	for (const line of lines) {
		//let tline = line.replace(/^\s+|\s+$/g, '');
		if (isEmpty(line.trim())) continue;
		let [key, val] = line.split(':').map(x => x.trim());
		if (nundef(val)) console.log('problem', key)
		let newkey = normalizedKey(key);
		val = val.toLowerCase();
		if (isdef(cats[newkey])) addIf(cats[newkey], val);
		else cats[newkey] = [val];
	}
	for (const k in dinew) {
		let o = dinew[k];
		if (isdef(cats[k])) cats[k].map(x => addIf(o.cats, x));
	}

	let diprefix = {
		act: 'action',
		art: 'art',
		facial: 'expression',
		game: 'game',
		musi: 'music',
		natur: 'nature',
		creat: 'creature',
		medic: 'medical',
		scien: 'science',
		trans: 'transport',
		sport: 'sport',
		myth: 'mythical',
		body: 'body',
		plant: 'plant',
		celestial: 'place',
		'elemental att': 'attack',
		'elemental def': 'defense',
	};

	for (const k in dinew) {
		let o = dinew[k];
		let list = o.cats;
		let newlist = [];

		//only the prefix of 
		for (const w of list) {
			let prefkey = Object.keys(diprefix).find(x => w.startsWith(x));
			if (prefkey) addIf(newlist, diprefix[prefkey]); else addIf(newlist, w);
		}
		dinew[k].cats = newlist;
	}

	return dinew;
}
async function addImagesTo(diold) {
	//let files = await mGetFiles("http://localhost:3000", "C:\\xampp\\htdocs\\_history\\htdocs2309\\_base_old\\assets\\img\\emo"); //YEAH!!!
	//same as:
	let files = await mGetFiles("http://localhost:3000", "../assets/img/emo"); //YEAH!!!
	let di = {};
	for (const o of files) {
		//console.log('f',f);break;
		let k = stringBefore(o, '.');
		let k1 = normalizedKey(k);
		di[k1] = { img: o };
		if (isdef(diold[k1])) {
			addKeys(diold[k1], di[k1]);
		} else di[k1].cats = [];
	}
	addKeys(diold, di);
	return di;
}
async function addGamecodesTo(diold) {
	let fasyms = await mGetYaml('../factory/assets/gamecodes.yaml');
	let di = {};
	for (const k in fasyms) {
		let o = fasyms[k];
		let k1 = normalizedKey(k);
		di[k1] = { ga: o };
		if (isdef(diold[k1])) {
			addKeys(diold[k1], di[k1]);
		} else di[k1].cats = [];
	}
	addKeys(diold, di);
	return di;
}
async function addFacodesTo(diold) {
	let fasyms = await mGetYaml('../factory/assets/facodes.yaml');
	let di = {};
	for (const k in fasyms) {
		let o = fasyms[k];
		let k1 = normalizedKey(k);
		di[k1] = { fa: o };
		if (isdef(diold[k1])) {
			addKeys(diold[k1], di[k1]);
		} else di[k1].cats = [];
	}
	addKeys(diold, di);
	return di;
}
async function createAllsymsNew() {
	let allsyms = await mGetYaml('../factory/assets/allSyms.yaml');
	//console.log('allsyms',allsyms);

	//start a dict to hold new info
	let di = {};
	for (const k in allsyms) {
		let o = allsyms[k];
		if (o.family == 'emoNoto') {
			let k1 = normalizedKey(k);
			let cats = valf(o.cats, []);
			if (isdef(o.group)) addIf(cats, o.group);
			if (isdef(o.subgroup)) addIf(cats, o.subgroup);
			if (nundef(cats)) { console.log('WTF???????????', k) }
			di[k1] = { text: o.text, cats: normalizedCats(cats) };
		}
	}

	//console.log('allsyms info',di)
	//downloadAsYaml(di,'allsyms');
	return di;
}
function dictWithoutGender(dinew) {
	let dinew2 = {};
	for (const k in dinew) {
		if (k.startsWith('man_') || k.startsWith('woman_') || k.startsWith('person_')) {
			let k1 = stringAfter(k, '_');
			//console.log('k1',k1)
			let n = stringCount(k1, '_');
			if (n > 1) k1 = stringAfter(k1, '_');
			while (['with', 'man'].some(x => k1.startsWith(x))) k1 = stringAfter(k1, '_')
			//console.log('k1', k1)
			let knew = k1;
			if (nundef(dinew[knew]) || k.startsWith('person')) dinew2[knew] = dinew[k];
		} else dinew2[k] = dinew[k];
	}
	//console.log('di count', Object.keys(dinew).length)
	//console.log('dinew2 count', Object.keys(dinew2).length)
	return dinew2;

}
function normalizedKey(k) {
	let k1 = k.toLowerCase();
	k2 = replaceAll(k1, ' ', '_');
	k3 = replaceAll(k2, '-', '_');
	k3 = replaceAll(k3, ':', '');

	if (k3.includes('(blood_type)')) k3 = stringBefore(k3, '(blood_type)') + 'blood_type';
	if (k3.startsWith('i_')) k3 = k3.substr(2);
	if (k3.endsWith('gnome')) k3 = 'gnome';
	if (k3 == 'muscle_up') k3 = 'muscle';

	return k3;
}
function normalizedCats(list) {
	let lnew = [];
	list = list.map(x => x.toLowerCase());
	if (list.some(x => x.startsWith('act'))) lnew.push('action');
	let ani = list.find(x => x.startsWith('ani'));
	if (isdef(ani)) lnew.push('animal');
	let anispec = list.find(x => x.startsWith('animal-'));
	if (isdef(anispec)) lnew.push(stringAfter(anispec, '-'));
	if (list.some(x => x.startsWith('obj') && !x.endsWith('Plus'))) lnew.push('object');

	for (const w of ['best', 'body', 'clothing', 'dishware', 'drink', 'food', 'plant', 'vegetable', 'fruit', 'emotion', 'event', 'face', 'game', 'hand', 'household', 'nature', 'medical', 'music', 'office', 'person', 'place', 'science', 'smiley', 'sport', 'sound', 'symbol', 'time', 'tool', 'transport', 'travel']) {
		if (list.some(x => x.includes(w))) addIf(lnew, w);
	}

	return lnew;
}
function sortKeysAlphabetically(dinew) {
	let keys = Object.keys(dinew); keys.sort();
	let difinal = {};
	for (const k of keys) {
		difinal[k] = dinew[k];
	}
	return difinal;
}




//**************************************************************************** */

function collectCats(di) {
	let cats = [];
	for (const k in di) di[k].cats.map(x => addIf(cats, x));
	return cats;
}
function reducedCats(o) {
	let difinal = {};
	let list = valf(o.cats, []);
	let lnew = [];
	if (list.some(x => x.startsWith('act'))) lnew.push('action');
	let ani = list.find(x => x.startsWith('ani'));
	if (isdef(ani)) lnew.push('animal');
	let anispec = list.find(x => x.startsWith('animal-'));
	if (isdef(anispec)) lnew.push(stringAfter(anispec, '-'));
	if (list.some(x => x.startsWith('obj') && !x.endsWith('Plus'))) lnew.push('object');

	for (const w of ['best', 'body', 'clothing', 'dishware', 'drink', 'food', 'plant', 'vegetable', 'fruit', 'emotion', 'event', 'face', 'game', 'hand', 'household', 'nature', 'medical', 'music', 'office', 'person', 'place', 'science', 'smiley', 'sport', 'sound', 'symbol', 'time', 'tool', 'transport', 'travel']) {
		if (list.some(x => x.includes(w))) addIf(lnew, w);
	}

	return lnew;
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
function convertValuesToDict(di, key) {
	let dires = {};
	for (const k in di) {
		dires[k] = {}; dires[k][key] = di[k];
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
