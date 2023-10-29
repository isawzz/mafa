
async function test17() {
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


	//check ob img ohne text und cats empty!

	for(const k in dinew){
		let o=dinew[k];
		if (isEmpty(dinew[k].cats)) {
			
			if (k.includes('digit')) o.cats=['digit','symbol'];
			else if (k.includes('clock')) o.cats=['time'];
			else if (k.includes('sign')) o.cats=['sign','symbol'];
			else if (k.includes('blood')) o.cats=['medical','symbol'];
			else if (k.includes('globe')) o.cats=['place'];
			else if (k.includes('heart')) o.cats=['symbol','heart','emotion'];
			else if (k.includes('key')) o.cats=['symbol','key'];
			else {o.cats = ['symbol']; } //console.log('no cats',k,dinew[k]);}
		}
		if (k.includes('blood_type')) addIf(o.cats,'medical');
	}

	console.log('dinew count', Object.keys(dinew).length);
	console.log(dinew.gnome);
	//downloadAsYaml(dinew,'dinew');

}
async function test16() {
	let files = await mGetFiles("http://localhost:3000", "../assets_old/assets/img/emoji/diversity"); //YEAH!!!
	let wrong = firstCond(files, x => !x.includes('skin-tone'));
	console.log('files', files);
	console.log('wrong', wrong ? wrong : 'ALL FILES CONTAIN SKIN-TONE!!!');
}

async function test15() {
	let files = await fetchFilenamesLocalhost("C:\\xampp\\htdocs\\mafa\\assets_old\\assets\\img\\emoji\\diversity");
}
async function test14() {
	//haben alle files in diversity skin-tone im namen?
	//dazu brauch ich app!
	//mach einen call zu port 3000
	let filenames = await fetch('http://localhost:3000/files');
	let files = await filenames.json();
	console.log('files', files)
}
async function test13_allnew() {
	let syms = await mGetYaml('../factory/assets/newsyms.yaml'); //console.log('m', m);
	M = await mGetYaml('../assets/m.yaml'); //console.log('m', m);

	for (const k in syms) {
		let sym = syms[k];
		let km = normalizedKey(k);
		let o = { img: k, text: sym.unicode };
		M[km] = o;
	}

	let mnew = sortKeysAlphabetically(M);
	downloadAsYaml(mnew, 'mnew');
}
async function test12_allnew() {
	let syms = await mGetYaml('../factory/assets/newsyms.yaml'); //console.log('m', m);
	M = await mGetYaml('../assets/m.yaml'); //console.log('m', m);

	let mnew = dictWithoutGender(M);
	downloadAsYaml(mnew, 'mnew');
}

async function test11_nohex() {
	syms = await mGetYaml('../factory/assets/newsyms.yaml'); //console.log('m', m);
	M = await mGetYaml('../assets/m.yaml'); //console.log('m', m);

	let mnew = {};
	for (const k in M) {
		let o = M[k];
		if (isdef(o.text) && isdef(o.hex)) { let onew = {}; delete o.hex; addKeys(o, onew); mnew[k] = onew; }
	}
	downloadAsYaml(mnew, 'mnew');
}


async function test10_emodir() {
	let files = await mGetYaml('../files.yaml'); //console.log('m', m);
	//console.log('files',files.files);
	let list = files.files.map(x => stringBefore(x, '.'));
	//	list = list.map(x=>normalizedKey(x));
	//console.log('arrTake',arrTake(list,10))

	M = await mGetYaml('../assets/m.yaml'); //console.log('m', m);
	syms = await mGetYaml('../factory/assets/allSyms.yaml'); //console.log('m', m);
	let dinew = {};
	let modified = [], allnew = [];
	for (const k of list) {
		let km = normalizedKey(k)
		if (km.includes('skin_tone')) continue;
		let m = M[km];
		if (nundef(m)) {
			let o = { img: k, cats: [] };
			dinew[km] = o;
			addIf(allnew, k)
		} else if (nundef(m.img)) {
			m.img = k;
			addIf(modified, k)
			//console.log('lookup M: ',km)
		}
	}


	// console.log('allnew',arrTake(allnew,100));
	// console.log('allnew',arrTakeFromTo(allnew,100,200));
	// console.log('allnew',arrTakeFromTo(allnew,200,300));
	// console.log('allnew',arrTakeFromTo(allnew,300,400));
	console.log('modified:', modified.length);
	//console.log('modified',arrTakeFromTo(modified,0,100));
	console.log('modified', arrTakeFromTo(modified, 100, 200));
	console.log('modified', arrTakeFromTo(modified, 200, 300));


	// console.log('dinew',dinew);
	//console.log('modified',modified)


}

async function test9_draw() {
	//draw a random img h 200
	M = await mGetYaml('../assets/m.yaml'); //console.log('m', m);
	console.log('M', M)
	let k = rChoose(Object.keys(M));
	console.log('k', k)

	k = M[k];
	console.log('k', k)
	let d = mBy('dGames');
	if (isdef(k.img)) mDom(d, { h: 200 }, { tag: 'img', src: '../assets/img/emo/' + k.img + '.png' });
	if (isdef(k.text)) mDom(d, { fz: 200, family: 'emoNoto', bg: rColor(), fg: rColor(), display: 'inline' }, { html: k.text });
	// if (isdef(k.hex)) mDom(d,{fz:200,family:'emoNoto',bg:rColor(),fg:rColor(),display:'inline'},{html:String.fromCharCode('0x'+k.hex)});
	if (isdef(k.fa)) mDom(d, { fz: 200, family: 'pictoFa', bg: rColor(), fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + k.fa) });
	if (isdef(k.ga)) mDom(d, { fz: 200, family: 'pictoGame', bg: rColor(), fg: rColor(), display: 'inline' }, { html: String.fromCharCode('0x' + k.ga) });


}

async function test8() {
	let dir = '../factory/assets/'
	let m = await mGetYaml(dir + 'm.yaml'); //console.log('m', m);
	let emo = createMDict(m);

	// console.log('emo', emo)
	let syms = await mGetYaml(dir + 'allSyms.yaml');
	let facodes = await mGetYaml(dir + 'facodes.yaml');
	let gamecodes = await mGetYaml(dir + 'gamecodes.yaml');
	fa = convertValuesToDict(facodes, 'fa')
	game = convertValuesToDict(gamecodes, 'ga')

	// console.log('emo',emo);
	emonew = {}
	for (const e in emo) {
		let o = emo[e];
		emonew[e] = { cats: [o.cat], img: o.key };
	}
	emo = emonew;

	//von syms nimm nur die die emoNoto haben!
	let newsyms = {};
	for (const k in syms) {
		let o = syms[k];
		if (o.family == 'emoNoto') newsyms[k] = { hex: o.hex, text: o.text, cats: valf(o.cats, []) }; //syms[k];
	}
	syms = newsyms;
	console.log('emo', emo, fa, game, syms);

	//compose keys
	let dinew = {};
	for (const di of [emo, fa, game, syms]) {
		for (const k in di) {
			let o = di[k];

			o.cats = reducedCats(o);
			if (nundef(o.cats)) { console.log('no cats for', k, 'from', di); break; }

			let kn = normalizedKey(k);
			if (isdef(dinew[kn])) {
				//merge it in
				let oold = dinew[kn];
				let onew = o;
				onew.cats.map(x => addIf(oold.cats, x));
				addKeys(onew, oold);

			} else dinew[kn] = o;
		}
	}
	// combine woman man person
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

			// let knew = stringAfterLast(k, '_');
			// console.log('knew',knew)

			// let knew2 = stringAfter(k, '_');
			// if (knew2.startsWith('and_man')) knew2=stringAfter(knew,'and_man_');
			// console.log('knew2',knew2)

			if (nundef(dinew[knew]) || k.startsWith('person')) dinew2[knew] = dinew[k];
		} else dinew2[k] = dinew[k];
	}


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

	//sort keys
	let keys = Object.keys(dinew); keys.sort();
	let difinal = {};
	for (const k of keys) {
		difinal[k] = dinew[k];
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


	for (const k in difinal) {
		let o = difinal[k];
		let list = o.cats;
		let newlist = [];

		//only the prefix of 
		for (const w of list) {
			let prefkey = Object.keys(diprefix).find(x => w.startsWith(x));
			if (prefkey) addIf(newlist, diprefix[prefkey]); else addIf(newlist, w);
		}
		difinal[k].cats = newlist;
	}

	let allcats = collectCats(difinal); allcats.sort();
	console.log('allcats', allcats);
	M = difinal;
	console.log('dfinal', difinal, Object.keys(difinal).length);

	downloadAsYaml(difinal, 'mnew');
}

async function test7() {
	M = await mGetYaml('../assets/m.yaml');
	let count = 100;
	for (const k of ['3d_hammer']) {
		let o = M[k];
		console.log('o', o)
		let family = isdef(o.ga) ? 'pictoGame' : isdef(o.tx) ? o.tx.toLowerCase().startsWith('f') ? 'pictoFa' : o.tx.startsWith('E') ? 'pictoGame' : 'emoNoto' : isdef(o.ga) ? 'pictoGame' : isdef(o.fa) ? 'pictoFa' : 'opensans';
		let text = valf(o.tx, o.ga, o.fa, k);
		let d = mDiv('dGames');
		let d1 = mSpan(d, {}, k + ': ' + family + ' ');
		let d2 = mDiv(d, { display: 'inline', family: family, fz: 50 });

		if (family.startsWith('picto')) d2.innerHTML = String.fromCharCode('0x' + text); else d2.innerHTML = text;
		if (count-- < 0) break;
	}
}
async function test6() {
	M = await mGetYaml('../assets/m.yaml');
	console.log('M', M);
	let [m, p, w] = [[], [], []];
	let allcats = [];
	for (const k in M) {
		M[k].cats.map(x => addIf(allcats, x));
		if (k.startsWith('man_')) m.push(stringAfter(k, '_'))
		if (k.startsWith('woman_')) w.push(stringAfter(k, '_'))
		if (k.startsWith('person_')) p.push(stringAfter(k, '_'))
	}

	console.log('all cats', allcats, m.length, p.length, w.length);
	//woman is the largest!
	// was soll ich eigentlich machen damit?
	//erstmal bilder ausgeben? aber wie?
}
async function test5() {
	M = await mGetYaml('../assets/m.yaml');
	console.log('M', M);
	let allcats = [];
	for (const k in M) {
		M[k].cats.map(x => addIf(allcats, x));
	}
	console.log('all cats', allcats);

}
async function test4() {
	M = await mGetYaml('../assets/m.yaml');
	let txt = await mGetText('../factory/assets/cats.txt');
	let lines = txt.split('\n');
	let cats = {};
	for (const line of lines) {
		//let tline = line.replace(/^\s+|\s+$/g, '');
		if (isEmpty(line.trim())) continue;
		let [a, b] = line.split(':').map(x => x.trim());
		a = a.toLowerCase();
		if (nundef(b)) console.log('problem', a)
		b = b.toLowerCase();
		// console.log('a',a,a.length)
		// console.log('b',b,b.length)
		if (isdef(cats[a])) addIf(cats[a], b);
		else cats[a] = [b];
	}
	let keys = Object.keys(M);
	keys.sort();
	let dnew = {};
	for (const k of keys) {
		let o = M[k];
		let k1 = k.toLowerCase(); if (k != k1) console.log('wrong key', k, k1);

		let clist = cats[k];
		if (nundef(clist)) console.log('no cats for', k);

		k2 = replaceAll(k1, ' ', '_');
		k3 = replaceAll(k2, '-', '_');
		//ich moecht es auch noch so veraendern dass ich 
		//keys mit - zu 

		if (clist) clist.map(x => addIf(o.cats, x));

		if (isdef(dnew[k3])) {
			//merge it in
			let oold = dnew[k3];
			let onew = o;
			onew.cats.map(x => addIf(oold.cats, x));
			addKeys(onew, oold);

		} else dnew[k3] = o;
	}
	//downloadAsYaml(dnew,'mnew');

	console.log('dnew', dnew)
}

async function test3() {
	M = await mGetYaml('../assets/m.yaml');
	let cats = await mGetYaml('../factory/assets/cats.yaml');

	let keys = Object.keys(M);
	keys.sort();
	let dnew = {};
	for (const k of keys) {
		let o = M[k];
		if (isdef(cats[k])) addIf(o.cats, cats[k]);
		dnew[k] = o;
	}
	downloadAsYaml(M, 'mnew');
}

async function test2() {
	M = await mGetYaml('../assets/m.yaml');
	let keys = Object.keys(M);
	console.log('num', keys.length);
	console.log('roller coaster', keys.indexOf('roller coaster'));
	//let arr = arrTake(keys,10);	arr.map(x=>console.log(x))

	//make an index
	//first just show me the categories
	let cats = [];
	for (const k in M) { for (const c of M[k].cats) addIf(cats, c); } console.log('categories', cats);

	let list = ['action', 'object', 'music', 'sport', 'best', 'game', 'place', 'transport', 'travel', 'animal', 'plant', 'nature', 'body', 'person', 'event', 'drink', 'food', 'vegetable', 'fruit', 'dishware', 'bug', 'mammal', 'bird', 'marine', 'emotion', 'smiley', 'reptile', 'amphibian', 'tool', 'household', 'office', 'science', 'medical', 'time', 'face', 'clothing', 'symbol', 'hand', 'sound'];
	let smallerlist = ['action', 'object', 'music', 'sport', 'game', 'place', 'transport', 'travel', 'plant', 'body', 'person', 'event', 'drink', 'food', 'vegetable', 'fruit', 'dishware', 'bug', 'mammal', 'bird', 'marine', 'emotion', 'reptile', 'amphibian', 'tool', 'household', 'office', 'science', 'medical', 'time', 'clothing', 'symbol', 'sound']

	let arr = arrTakeFromTo(keys, 0, 10); console.log('arr', arr);
}

async function test1() {
	let dir = '../factory/assets/'
	let m = await mGetYaml(dir + 'm.yaml'); //console.log('m', m);
	let emo = createMDict(m);
	console.log('emo', emo)
	let syms = await mGetYaml(dir + 'allSyms.yaml');
	let facodes = await mGetYaml(dir + 'facodes.yaml');

	let gamecodes = await mGetYaml(dir + 'gamecodes.yaml');
	fa = convertValuesToDict(facodes, 'fa')
	game = convertValuesToDict(gamecodes, 'ga')
	for (const pair of [[game, 'g'], [fa, 'f'], [syms, 's'], [emo, 'm']]) {
		for (const k in pair[0]) { pair[0][k].type = pair[1]; }

	}

	let di = M = mergeDictionariesWithListOfValues([emo, syms, fa, game]);
	console.log('di', di);

	//da draus mach jetzt ein di dass alle values merged hat, und type soll sein: 
	let superdi = {};
	let allcats = [];
	for (const k in di) {
		let o = { cats: [] };
		for (const val of di[k]) {
			if (val.type == 's') { o.tx = val.text; if (isdef(val.cats)) val.cats.map(x => addIf(o.cats, x)); }
			if (val.type == 'g') { o.ga = val.ga; }
			if (val.type == 'f') { o.fa = val.fa; }
			if (val.type == 'm') { o.img = val.key; addIf(o.cats, val.cat); }
		}
		superdi[k] = o;
		if (isdef(o.cats)) o.cats.map(x => addIf(allcats, x));

	}

	allcats.sort();
	console.log('allcats', allcats);
	console.log('superdi', superdi);
	//objects and object should be just one of them
	let difinal = {};
	for (const k in superdi) {
		let old = superdi[k];
		let o = difinal[k] = { cats: [] };
		addKeys(old, o);

		if (nundef(old.cats)) continue;
		let list = old.cats;
		//console.log('list', list)
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

		lnew.map(x => o.cats.push(x));


	}
	console.log('final', difinal.ant, superdi.ant);
	//save file as yaml
	//downloadAsYaml(difinal,'di');
	//M=difinal;
}
async function test0_addToCollection() {
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
