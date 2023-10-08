onload = start;
async function start() { test16(); }

async function test16() {
	let files = await mGetFiles("http://localhost:3000","../assets_old/assets/img/emoji/diversity"); //YEAH!!!
	let wrong = firstCond(files,x=>!x.includes('skin-tone'));
	console.log('files', files);
	console.log('wrong',wrong?wrong:'ALL FILES CONTAIN SKIN-TONE!!!');
}



//**************************************************************************** */
function dictWithoutGender(dinew) {
	let dinew2 = {};
	for (const k in dinew) {
		if (k.startsWith('man_') || k.startsWith('woman_') || k.startsWith('person_')) {
			let k1 = stringAfter(k, '_');
			//console.log('k1',k1)
			let n = stringCount(k1, '_');
			if (n > 1) k1 = stringAfter(k1, '_');
			while (['with', 'man'].some(x => k1.startsWith(x))) k1 = stringAfter(k1, '_')
			console.log('k1', k1)
			let knew = k1;
			if (nundef(dinew[knew]) || k.startsWith('person')) dinew2[knew] = dinew[k];
		} else dinew2[k] = dinew[k];
	}
	console.log('di count', Object.keys(dinew).length)
	console.log('dinew2 count', Object.keys(dinew2).length)
	return dinew2;

}

function sortKeysAlphabetically(dinew) {
	let keys = Object.keys(dinew); keys.sort();
	let difinal = {};
	for (const k of keys) {
		difinal[k] = dinew[k];
	}
	return difinal;
}
function collectCats(di) {
	let cats = [];
	for (const k in di) di[k].cats.map(x => addIf(cats, x));
	return cats;
}
function normalizedKey(k) {
	let k1 = k.toLowerCase();
	k2 = replaceAll(k1, ' ', '_');
	k3 = replaceAll(k2, '-', '_');
	return k3;
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
