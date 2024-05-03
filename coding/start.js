
async function start() { await test6_sortFunctionsOfAFile(); }

async function test6_sortFunctionsOfAFile(){
	S.type = detectSessionType();	initCodingUI();

	let path = `../copi2/w3helpers.js`;

	let bykey = await getCodeDictByKey(path);
	let text = '';
	let keys = Object.keys(bykey);
	keys.sort();
	for (const k of keys) { 
		text += bykey[k].code + '\n'; 
	}
	AU.ta.value = text;


}

async function test5_lineEndings(){
	S.type = detectSessionType();
	initCodingUI();
	let bykey = await getCodeDictByKey(`../ode/closure.js`);
	let text = '';
	for (const k in bykey) { 
		text += bykey[k].code + '\n'; 
	}
	AU.ta.value = text;

}
async function test4_intode(){
	test3_integrate(`../ode/closure.js`,'../ode/baui.js');
}
async function test3_integrate(pathLarge,pathNew){
	S.type = detectSessionType();
	initCodingUI();
	let bykey = await getCodeDictByKey(pathLarge);
	copyKeys(await getCodeDictByKey(pathNew),bykey);

	let list = Object.keys(bykey);
	list = sortCaseInsensitive(list);
	
	let text = '';
	for (const k of list) { 
		text += bykey[k].code + '\r\n'; 
	}
	AU.ta.value = text;

}
async function test2_ode() {
	S.type = detectSessionType();
	initCodingUI();
	let bykey = await getCodeDictByKey('../basejs/allfhuge.js');
	addKeys(await getCodeDictByKey('../basejs/allghuge.js'),bykey);
	copyKeys(await getCodeDictByKey(`../ode/globals.js`),bykey);
	copyKeys(await getCodeDictByKey(`../ode/closure.js`),bykey);
	DA.diglobal = bykey;
	let list = DA.listglobal = dict2list(bykey); 

	let bytype = {};
	for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }

	let seed = await getCodeKeys(`../ode/closure.js`); //console.log('seed', seed);

	let [globs, funcs, byKeyMinimized] = createListsFromSeed(bykey, list, seed);
	//let byKeyMinimized = _minimizeCode(bykey, seed, []);
	//console.log('res',byKeyMinimized); return;


	//console.log('funcs',funcs); return;

	let text = generateCodeText(globs, funcs, byKeyMinimized);


	AU.ta.value = text;

}

async function test1_ode() {
	S.type = detectSessionType();
	initCodingUI();
	let bykey = await getCodeDictByKey('../basejs/allfhuge.js');
	addKeys(await getCodeDictByKey('../basejs/allghuge.js'),bykey);
	copyKeys(await getCodeDictByKey(`../ode/code.js`),bykey);
	DA.diglobal = bykey;
	let list = DA.listglobal = dict2list(bykey); 

	let bytype = {};
	for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }

	let seed = await getCodeKeys(`../ode/code.js`); //console.log('seed', seed);

	let [globs, funcs, byKeyMinimized] = createListsFromSeed(bykey, list, seed);
	//let byKeyMinimized = _minimizeCode(bykey, seed, []);
	//console.log('res',byKeyMinimized); return;


	//console.log('funcs',funcs); return;

	let text = generateCodeText(globs, funcs, byKeyMinimized);

	AU.ta.value = text;

}
function createListsFromSeed(bykey,list,seed){

	//mach die closure von seed
	let nogos = ['RSG','annotate','geht','uiGetContact', 'grid']; // { codingfull: ['uiGetContact'], coding: ['uiGetContact', 'grid'] };
	nogos = nogos.concat(['accuse', 'aristo', 'bluff', 'ferro', 'nations', 'spotit' ,'wise','a_game'])
	// if (project == 'nature') seed = seed.concat(['branch_draw', 'leaf_draw', 'lsys_init', 'tree_init', 'lsys_add', 'tree_add', 'lsys_draw', 'tree_draw']);
	// let nogos = valf(knownNogos[project], [])

	let byKeyMinimized = minimizeCode(bykey, seed, nogos);
	['start','rest'].map(x=>delete byKeyMinimized[x]);

	for (const k in byKeyMinimized) {
		let code = byKeyMinimized[k].code;
		let lines = code.split('\n');
		let newcode = '';
		for (const l of lines) {
			newcode += removeTrailingComments(l) + '\n';
		}
		byKeyMinimized[k].code = newcode.trim();
	}
	let cvckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type != 'function').map(x => x.key); //in order of appearance!
	let funckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type == 'function').map(x => x.key); //in order of appearance!
	funckeys = sortCaseInsensitive(funckeys);

	return [cvckeys,funckeys,byKeyMinimized];
}	
function minimizeCode(di, symlist = ['start'], nogo = []) {
	let done = {};
	let tbd = symlist;
	let MAX = 1000000, i = 0;
	let visited = {
		autocomplete: true, Card: true, change: true, config: true, grid: true, hallo: true,
		jQuery: true, init: true,
		Number: true, sat: true, step: true, PI: true
	};
	console.log('di',di)
	console.log('tbd',tbd)
	while (!isEmpty(tbd)) {
		if (++i > MAX) {console.log('MAX reached');break;}
		let sym = tbd[0]; //console.log('sym',sym)
		if (isdef(visited[sym])) { tbd.shift(); continue; }
		visited[sym] = true;
		let o = di[sym]; //console.log('o',o)
		if (nundef(o)) { tbd.shift(); continue; }
		if (sym.length <= 2 && o.type != 'var' && o.type != 'const') {tbd.shift(); console.log('discard',o); continue;}
		if (sym.includes('_') && o.type == 'function') {tbd.shift(); console.log('discard',o); continue;}
		let text = o.code;
		let words = toWords(text, true);
		for (const w of words) {
			if (nogo.some(x => w.startsWith(x))) continue;
			if (w.length>2  && w.startsWith('d') && w[1]==w[1].toUpperCase()) continue;

			//remove words within quotes that are functions
			let idx = text.indexOf(w);
			let ch = text[idx - 1];
			if (w.startsWith('lsys')) console.log('.....ch', w, ch, sym)
			if (ch == "'" || '"`'.includes(ch)) continue;

			if (nundef(done[w]) && nundef(visited[w]) && w != sym && isdef(di[w])) {
				//console.log('first',w,'from',sym)
				addIf(tbd, w);
			}
		}
		assertion(sym == tbd[0], 'W T F')
		tbd.shift();
		done[sym] = o;//console.log('o',o)
	}
	return done;
}

async function test01_try() {
	let [bykey, bytype] = await getTheDicts();
	console.log('dicts', bykey, bytype);

	let codelist = await codeParseFile('../ode/code.js');
	console.log('codelist', codelist)
	let codebykey = list2dict(codelist, 'key');

	for (const k in codebykey) {
		bykey[k] = codebykey[k];
		bytype.function[k]
	}
}
async function test0(dir='odf') {
	S.type = detectSessionType();
	initCodingUI();

	//#region tests

	// let text=await intersectAnimeAndAllfuncs();
	// let [g, text, old] = await codebaseExtendFromProject('hltest');

	// let csstext = await cssbaseExtend('coding');
	// let csstext = await cssSelectFrom('../base/alibs/transition.css',['keyframes']);
	// let csstext = await cssSelectFrom('../base/alibs/bs4/bootstrap.css',['class']);
	// let csstext = await cssSelectFrom('../base/alibs/w3.css',['root','class','keyframes']);
	//downloadAsText(text, 'closure', 'js');
	//downloadAsText(css, 'final', 'css');
	//#endregion
	let text, css, project;
	let glitches = ['startsWith', 'endsWith'];
	text = '<please call closureFromProject>', css = '';
	text = await combineFromProject(`../${dir}`);

	let globlist = await codeParseFile('../basejs/allghuge.js');
	console.log('globlist', globlist); //return;
	let globsused = [];
	for (const o of globlist) {
		let k = o.key;
		if (text.includes(k)) globsused.push(o)
	}
	console.log('globsused', globsused);
	let globtext = globsused.map(x => x.code).join('\r\n');
	downloadAsText(globtext, 'globs', 'js');

	//[text, css, project] = await closureFromProject('combu', glitches, ['downloadAsText','onclickColors','onclickPlan','onclickCollection','onclickPlay','onclickNATIONS','onclickHome']); 
	// [text, css, project] = await closureFromProject('coding', glitches, ['downloadAsText']); 
	// [text, css, project] = await closureFromProject('spiel', glitches); 
	// [text, css, project] = await closureFromProject('testa', glitches); 
	// [text, css, project] = await closureFromProject('testphp', glitches); 
	// [text, css, project] = await closureFromProject('tiere', glitches.concat(['expand', 'drop']), ['allowDrop','dropImage']);

	//text = await combineClosures(['coding','spiel','testa','tiere']); 
	// cssFromFiles(files, dir = '', types = ['root', 'tag', 'class', 'id', 'keyframes'])
	//downloadAsText(css,'final','css');

	AU.ta.value = text;
	//AU.ta.value = project; //if want only functions not in allfhuge.js!
	AU.css.value = css;

}
























