
async function start() {
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
	let text,css,project;
	let glitches = ['startsWith', 'endsWith'];
	text = '<please call closureFromProject>', css='';
	text = await combineFromProject('../combu');

	let globlist = await codeParseFile('../basejs/allghuge.js');
	console.log('globlist',globlist);
	let globsused=[];
	for(const o of globlist){
		let k=o.key;
		if (text.includes(k)) globsused.push(o)
	}
	console.log('globsused',globsused);
	let globtext = globsused.map(x=>x.code).join('\r\n');
	downloadAsText(globtext,'globs','js');
	
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
async function combineFromProject(project){
	let files = await mGetFiles(`${project}`);
	files = files.filter(x=>x.endsWith('js'));
	//eliminiere test.js und app.js
	files = files.filter(x=>!x.startsWith('test') && !x.startsWith('app.'));
	files = files.map(x=>`../${project}/${x}`);
	//console.log('files',files); return;
	//let files = projectList.map(x=>`../${x}/closure.js`);
	let [globtext, functext, functextold] = await codebaseFromFiles2(files);
	//downloadAsText(globtext,'globs','js');
	return functext;
}

async function combineClosures(projectList){
	let files = projectList.map(x=>`../${x}/closure.js`);
	let [globtext, functext, functextold] = await codebaseFromFiles(files);
	downloadAsText(globtext,'globs','js');
	return functext;
}
function _minimizeCode(di, symlist = ['start'], nogo = []) {
	let done = {};
	let tbd = symlist;
	let MAX = 1000000, i = 0;
	let visited = {
		autocomplete: true, Card: true, change: true, config: true, grid: true, hallo: true,
		jQuery: true, init: true,
		Number: true, sat: true, step: true, PI: true
	};
	while (!isEmpty(tbd)) {
		if (++i > MAX) break;
		let sym = tbd[0];
		if (isdef(visited[sym])) { tbd.shift(); continue; }
		visited[sym] = true;
		let o = di[sym];
		if (nundef(o)) { tbd.shift(); continue; }
		let text = o.code;
		let words = toWords(text, true);
		for (const w of words) {
			if (nogo.some(x => w.startsWith(x))) continue;

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
		done[sym] = o;
	}
	return done;
}
async function closureFromProject(project, ignoreList=[], addList=[]) {

	console.log('HAAAAAAAAAAAAALLLLLLLLLLLOOOOOOOOOOOO')

	//get the dicts
	let globlist = await codeParseFile('../basejs/allghuge.js');
	let funclist = await codeParseFile('../basejs/allfhuge.js');
	let list = globlist.concat(funclist); //keylist in order of loading!
	let bykey = list2dict(list, 'key');
	DA.diglobal = Object.keys(bykey); //list2dict(list, 'key');
	let bytype = {};
	for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }
	//get .js files from project
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	html = removeCommentLines(html, '<!--', '-->');
	let dirhtml = `../${project}`;
	let files = extractFilesFromHtml(html, htmlFile);
	files = files.filter(x => !x.includes('../all') && !x.includes('/test'));
	// console.log('files', files)

	let olist = [];
	for (const path of files) {
		let opath = await codeParseFile(path);
		olist = olist.concat(opath);
	}
	//sollen die jetzt gleich in bytype kommen?oder in bykey? bytype kann duplicates haben!!! davon nimm das letzte in olist!
	let mytype = {}, mykey = {};
	for (const o of olist) { mykey[o.key] = o; }
	for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }

	//alle keys in bykey und in mykey sind unique. aber es kann same key in beiden geben
	//welchen code nehm ich dann?
	DA.duplicates = [];
	let dupltext = '';
	for (const k in mykey) {
		let onew = mykey[k];
		let oold = bykey[k];
		if (isdef(oold) && onew.code == oold.code) {
			//console.log('override w/ SAME code', k);//brauch garnix machen!
		} else if (isdef(oold)) {
			console.log('override w/ DIFFERENT code', k);//override code with new code but keep old code!
			oold.oldcode = oold.code;
			oold.code = onew.code;
			dupltext += oold.oldcode + '\n' + oold.code + '\n';
			DA.duplicates.push(k);
		} else {
			bykey[k] = onew; //add new element to bykey
			lookupAddIfToList(bytype, [onew.type], onew);
			list.push(onew);
		}
	}

	// *** here bykey contains newest code for project ***
	//minimize
	let knownNogos = { codingfull: ['uiGetContact'], coding: ['uiGetContact', 'grid'] };
	let seed = ['start'].concat(extractOnclickFromHtml(html)); console.log('seed', seed);

	if (project == 'nature') seed = seed.concat(['branch_draw', 'leaf_draw', 'lsys_init', 'tree_init', 'lsys_add', 'tree_add', 'lsys_draw', 'tree_draw']);

	seed = seed.concat(addList);

	//console.log('____',bykey.NATURE)
	let nogos = valf(knownNogos[project], [])
	nogos = nogos.concat(ignoreList);

	let byKeyMinimized = _minimizeCode(bykey, seed, nogos);
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

	//console.log('____',byKeyMinimized.NATURE)

	let cvckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type != 'function').map(x => x.key); //in order of appearance!
	let funckeys = list.filter(x => isdef(byKeyMinimized[x.key]) && x.type == 'function').map(x => x.key); //in order of appearance!
	funckeys = sortCaseInsensitive(funckeys);


	//generate
	let closuretext = '', justproject = '';
	console.log('DA.diglobal',DA.diglobal)
	for (const k of cvckeys) { closuretext += byKeyMinimized[k].code + '\n'; }
	for (const k of funckeys) { 
		closuretext += byKeyMinimized[k].code + '\n'; 
		if (DA.duplicates.includes(k) || !DA.diglobal.includes(k)) justproject += byKeyMinimized[k].code + '\n'; 
	}

	//css closure as well!
	cssfiles = extractFilesFromHtml(html, htmlFile, 'css');
	//console.log('cssfiles', cssfiles);
	cssfiles.unshift('../basejs/myclasses.css');

	//generate css dict

	//get concatenated text from files
	let tcss = '';
	for (const path of cssfiles) { tcss += await route_path_text(path) + '\r\n'; }
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	// console.log('t',t)

	//prep dictionary by key: di = {key: type:}
	let lines = t.split('\r\n');
	if (lines.length <= 2) lines = t.split('\n');
	//console.log('lines', lines)
	let allkeys = [], newlines = []; //in newlines
	let di = {};
	let testresult = '';
	for (const line of lines) {
		let type = cssKeywordType(line);
		if (type) {
			testresult += line[0] + '=';//addIf(testresult,line[0]); 
			let newline = isLetter(line[0]) || line[0] == '*' ? line : line[0] == '@' ? stringAfter(line, ' ') : line.substring(1);
			// testresult += newline + '\n';
			let key = line.includes('{') ? stringBefore(newline, '{') : stringBefore(newline, ','); //firstWordIncluding(newline, '_-: >').trim();
			key = key.trim();
			// testresult += key + '\n';
			if (isdef(di[key]) && type != di[key].type) {
				console.log('duplicate key', key, type, di[key].type);
			}
			di[key] = { type: type, key: key }
			newline = key + stringAfter(newline, key);
			if (key == '*') console.log('***', stringAfter(newline, key));
			//testresult += newline + '\n';
			addIf(allkeys, key);
			newlines.push(newline)
			di[key] = { type: type, key: key }
		} else {
			newlines.push(line);
		}
	}
	//console.log('di', di)

	//minimize
	let neededkeys = [], code = closuretext;
	for (const k of allkeys) {
		if (['rubberBand'].includes(k)) continue;
		let ktest = k.includes(' ') ? stringBefore(k, ' ') : k.includes(':') ? stringBefore(k, ':') : k;
		if (['root'].some(x => x == k)) addIf(neededkeys, k);
		else if (code.includes(`${ktest}`) || code.includes(`'${ktest}'`) || code.includes(`"${ktest}"`)) addIf(neededkeys, k);
		else if (html.includes(`${ktest}`)) addIf(neededkeys, k);
	}

	//add clauses to di
	let clause = '';
	let state = 'search_kw';
	for (const kw of neededkeys) {
		let i = 0;
		for (const line of newlines) {
			if (line.startsWith(kw)) {
				let w1 = line.includes('{') ? stringBefore(line, '{') : stringBefore(line, ',');
				if (w1.trim() != kw) continue;
				assertion(line.includes('{') || line.includes(','), `WEIRED LINE: ${kw} ${line}`);
				if (line.includes('{')) {
					clause = '{\n'; state = 'search_clause_end';
				} else if (line.includes(',')) {
					state = 'search_clause_start';
				}
			} else if (state == 'search_clause_start' && line.includes('{')) {
				clause = '{\n'; state = 'search_clause_end';
			} else if (state == 'search_clause_end') {
				if (line[0] == '}') {
					clause += line;
					let cleanclause = cssCleanupClause(clause, kw);
					lookupAddIfToList(di, [kw, 'clauses'], cleanclause);
					lookupAddIfToList(di, [kw, 'fullclauses'], clause);
					state = 'search_kw';
				} else {
					clause += line + '\n';
				}
			}
		}
	}

	let dis = {};
	for (const o of get_values(di)) {
		if (nundef(o.clauses)) continue;
		let x = lookup(dis, [o.type, o.key]); if (x) console.log('DUPL:', o.key, o.type)
		lookupSet(dis, [o.type, o.key], o);
	}

	//generate text
	let csstext = '';
	let types = ['root', 'tag', 'class', 'id', 'keyframes'];
	let ditypes = { root: 58, tag: 't', class: 46, id: 35, keyframes: 64 }; // : tags . # @
	if (types.includes('root')) types = ['root'].concat(arrMinus(types, ['root']));
	//console.log('types', types);
	types = types.map(x => ditypes[x]);
	for (const type of types) {
		if (nundef(dis[type])) continue;
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : String.fromCharCode(type);
		if (prefix == '@') prefix += 'keyframes ';
		//console.log('type', type, prefix, ksorted)
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				csstext += startfix + clause;
			}
		}
	}

	return [closuretext, csstext, justproject];
}
async function codebaseExtendFromProject(project) {
	// read in codebase
	let globlist = await codeParseFile('../basejs/allghuge.js');
	let funclist = await codeParseFile('../basejs/allfhuge.js');
	let list = globlist.concat(funclist); //keylist in order of loading!
	let bykey = list2dict(list, 'key');
	let bytype = {};
	for (const k in bykey) { let o = bykey[k]; lookupAddIfToList(bytype, [o.type], o); }
	//get .js files from project
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	html = removeCommentLines(html, '<!--', '-->');
	let dirhtml = `../${project}`;
	let files = extractFilesFromHtml(html, htmlFile);
	files = files.filter(x => !x.includes('../all'));
	console.log('files', files)
	// let res=await codebaseFromFiles(files);	return res;
	let [globtext, functext, functextold] = await codebaseFromFiles(files, bykey, bytype, list);
	// downloadAsText(globtext, 'allglobals', 'js');
	// downloadAsText(functext, 'allfuncs', 'js');
	// downloadAsText(functextold, 'allfuncs_old', 'js');
	return [globtext, functext, functextold];
}
async function codebaseFromFiles(files, bykey={}, bytype={}, list=[]) {
	let olist = [];
	for (const path of files) {
		let opath = await codeParseFile(path);
		olist = olist.concat(opath);
	}
	//sollen die jetzt gleich in bytype kommen?oder in bykey? bytype kann duplicates haben!!! davon nimm das letzte in olist!
	let mytype = {}, mykey = {};
	for (const o of olist) { mykey[o.key] = o; }
	for (const k in mykey) { let o = mykey[k]; lookupAddIfToList(mytype, [o.type], o); }

	//alle keys in bykey und in mykey sind unique. aber es kann same key in beiden geben
	//welchen code nehm ich dann?
	let dupltext = '';
	for (const k in mykey) {
		let onew = mykey[k];
		let oold = bykey[k];
		if (isdef(oold) && onew.code == oold.code) {
			console.log('override w/ SAME code', k);//brauch garnix machen!
		} else if (isdef(oold)) {
			console.log('override w/ DIFFERENT code', k);//override code with new code but keep old code!
			oold.oldcode = oold.code;
			oold.code = onew.code;
			dupltext += oold.oldcode + '\n' + oold.code + '\n';
		} else {
			bykey[k] = onew; //add new element to bykey
			lookupAddIfToList(bytype, [onew.type], onew);
			list.push(onew);
		}
	}

	// console.log('bytype',bytype); return //get_keys(bytype));return;
	//list, bytype und bykey sind jetzt complete!!!!
	let globtext = '', functext = '', functextold = '';
	for (const type of ['const', 'var', 'class']) {
		if (nundef(bytype[type])) continue;
		for (const o of bytype[type]) { if (!isEmptyOrWhiteSpace(o.code)) globtext += o.code + '\n'; }
	}
	let sortedFuncKeys = sortCaseInsensitive(bytype.function.map(x => x.key)).filter(x => !['step', 'Number'].includes(x));
	sortedFuncKeys.map(x => functext += isEmptyOrWhiteSpace(bykey[x].code) ? '' : (bykey[x].code + '\n'));
	sortedFuncKeys.map(x => functextold += (isdef(bykey[x].oldcode) ? bykey[x].oldcode : bykey[x].code) + '\n');

	return [globtext, functext, functextold]
}
async function codeParseFile(path) {
	let text = await route_path_text(path);

	//let keys = codeParseKeys(text); console.log('parse', path, keys)
	let olist = codeParseBlocks(text);

	return olist; // [keys, olist];
}
function codeParseKeys(text) {
	let keys = [];
	let lines = text.split('\r\n');
	for (const l of lines) {
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			let key = ithWord(l, (l[0] == 'a' ? 2 : 1), true);
			keys.push(key);
		}
	}
	return keys;
}
function codeParseBlocks(text) {
	//erstmal ohne regions!!!
	let lines = text.split('\r\n');
	lines = lines.map(x => removeTrailingComments(x));
	let i = 0, o = null, res = [];
	while (i < lines.length) {
		let l = lines[i];
		if (['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x))) {
			[o, iLineAfterBlock] = codeParseBlock(lines, i);
			i = iLineAfterBlock;
			res.push(o)
		} else i++;
	}
	return res;
}
function codeParseBlock(lines, i) {
	let l = lines[i];
	let type = l[0] == 'a' ? ithWord(l, 1) : ithWord(l, 0);
	let key = l[0] == 'a' ? ithWord(l, 2, true) : ithWord(l, 1, true);
	let code = l + '\n'; i++; l = lines[i];
	while (i < lines.length && !(['var', 'const', 'cla', 'func', 'async'].some(x => l.startsWith(x)) && !l.startsWith('}'))) {
		if (!(l.trim().startsWith('//') || isEmptyOrWhiteSpace(l))) code += l + '\n';
		i++; l = lines[i];
	}

	code = replaceAllSpecialChars(code, '\t', '  ');
	code = code.trim();

	return [{ key: key, type: type, code: code }, i];
}
async function cssExtendFromProject(project) {
	//cssbase ist in '../basejs/myclasses.css'
	// let list = ['../basejs/myclasses', `../coding/final`]; // ['reset','base','cards','features','mybutton','shapes'];//'base','cards','features','mybutton','shapes']; //,'cards','chess' //wurde bereits geloescht!!!
	// let csstext = await cssbaseNew(list); //,'../base/css');
	//eigentlich sollten transitions auch darein gehen! oder?
	//erstmal mach die files
	let htmlFile = `../${project}/index.html`;
	let html = await route_path_text(htmlFile);
	cssfiles = extractFilesFromHtml(html, htmlFile, 'css');
	console.log('cssfiles', cssfiles);
	cssfiles.unshift('../basejs/myclasses.css');

	let csstext = await cssFromFiles(cssfiles);
	downloadAsText(csstext, 'allcss', 'css');
	return csstext;
}
async function cssSelectFromFile(cssfile, types) {
	//nochmal die types aufschreiben!

	let csstext = await cssFromFiles([cssfile], '', types);
	downloadAsText(csstext, 'selectioncss', 'css');
	return csstext;

}
async function cssFromFiles(files, dir = '', types = ['root', 'tag', 'class', 'id', 'keyframes']) {

	//get concatenated text from files
	let tcss = '';
	if (!isEmpty(dir) && !dir.endsWith('/')) dir += '/';
	for (const file of files) {
		let path = dir + file + (file.endsWith('.css') ? '' : '.css');
		tcss += await route_path_text(path) + '\r\n';
	}
	let t = replaceAllSpecialChars(tcss, '\t', '  ');
	// console.log('t',t)

	//prep dictionary by key: di = {key: type:}
	let lines = t.split('\r\n');
	if (lines.length <= 2) lines = t.split('\n');
	console.log('lines', lines)
	let allkeys = [], newlines = []; //in newlines
	let di = {};
	let testresult = '';
	for (const line of lines) {
		let type = cssKeywordType(line);
		if (type) {
			testresult += line[0] + '=';//addIf(testresult,line[0]); 
			let newline = isLetter(line[0]) || line[0] == '*' ? line : line[0] == '@' ? stringAfter(line, ' ') : line.substring(1);
			// testresult += newline + '\n';
			let key = line.includes('{') ? stringBefore(newline, '{') : stringBefore(newline, ','); //firstWordIncluding(newline, '_-: >').trim();
			key = key.trim();
			// testresult += key + '\n';
			if (isdef(di[key]) && type != di[key].type) {
				console.log('duplicate key', key, type, di[key].type);
			}
			di[key] = { type: type, key: key }
			newline = key + stringAfter(newline, key);
			if (key == '*') console.log('***', stringAfter(newline, key));
			//testresult += newline + '\n';
			addIf(allkeys, key);
			newlines.push(newline)
			di[key] = { type: type, key: key }
		} else {
			newlines.push(line);
		}
	}
	console.log('di', di)
	// return testresult; //linestarts.join();

	//allkeys has all css keys in order, di is bykey
	//add clauses
	let neededkeys = allkeys;
	let clause = '';
	let state = 'search_kw'; // search_kw search_clause_start search_clause_end
	for (const kw of neededkeys) {
		let i = 0;
		for (const line of newlines) {
			if (line.startsWith(kw)) {
				let w1 = line.includes('{') ? stringBefore(line, '{') : stringBefore(line, ',');
				if (w1.trim() != kw) continue;
				assertion(line.includes('{') || line.includes(','), `WEIRED LINE: ${kw} ${line}`);
				if (line.includes('{')) {
					clause = '{\n'; state = 'search_clause_end';
				} else if (line.includes(',')) {
					state = 'search_clause_start';
				}
			} else if (state == 'search_clause_start' && line.includes('{')) {
				clause = '{\n'; state = 'search_clause_end';
			} else if (state == 'search_clause_end') {
				if (line[0] == '}') {
					clause += line;
					let cleanclause = cssCleanupClause(clause, kw);
					lookupAddIfToList(di, [kw, 'clauses'], cleanclause);
					lookupAddIfToList(di, [kw, 'fullclauses'], clause);
					state = 'search_kw';
				} else {
					clause += line + '\n';
				}
			}
		}
	}

	//create dis = dict by type,key
	let dis = {};
	for (const o of get_values(di)) {
		if (nundef(o.clauses)) continue;
		let x = lookup(dis, [o.type, o.key]); if (x) console.log('DUPL:', o.key, o.type)
		lookupSet(dis, [o.type, o.key], o);
	}

	//combine to final text
	let text = '';

	let ditypes = { root: 58, tag: 't', class: 46, id: 35, keyframes: 64 }; // : tags . # @
	if (types.includes('root')) types = ['root'].concat(arrMinus(types, ['root']));
	console.log('types', types);
	types = types.map(x => ditypes[x]);
	//root als erstes!!!
	//let types = [58, t, 46, 35, 64]; // : tags . # @
	for (const type of types) {
		if (nundef(dis[type])) continue;
		let ksorted = sortCaseInsensitive(get_keys(dis[type]));
		let prefix = type == 't' ? '' : String.fromCharCode(type);
		if (prefix == '@') prefix += 'keyframes ';
		console.log('type', type, prefix, ksorted)
		for (const kw of ksorted) {
			let startfix = prefix + kw;
			for (const clause of dis[type][kw].clauses) {
				text += startfix + clause;
			}
		}
	}
	return text;


}
function cssKeywordType(line) {
	if (isLetter(line[0]) || line[0] == '*' && line[1] != '/') return 't';
	else if (toLetters(':.#').some(x => line[0] == x)) return (line.charCodeAt(0)); //[0].charkey());
	else if (line.startsWith('@keyframes')) return (line.charCodeAt(0));
	else return null;
	//return toLetters('*:.@#').some(x => line[0] == x) || isLetter(line[0]); 
}
async function extractKeywords(path,trimmedlines=false) {
	let text = await route_path_text(path);
	let lines = text.split('\n');
	// console.log('lines',lines);
	let kws = [];
	for (const line of lines) {
		let l=trimmedlines?line.trim():line;
		if (l.startsWith('function')) kws.push(ithWord(l, 1, true));
		if (l.startsWith('async')) kws.push(ithWord(l, 2, true));
		if (l.startsWith('const')) kws.push(ithWord(l, 1, true));
		if (l.startsWith('var')) kws.push(ithWord(l, 1, true));
		if (l.startsWith('class')) kws.push(ithWord(l, 1, true));
	}
	return kws;
}
function ithWord(s, n, allow_) {
	let ws = toWords(s, allow_);
	// console.log('?',s,n,allow_,ws);
	return ws[Math.min(n, ws.length - 1)];
}
function initCodingUI() {
	mStyle('dMain', { bg: 'silver' });
	[dTable, dSidebar] = mCols100('dMain', '1fr auto', 0);
	let [dtitle, dta] = mRows100(dTable, 'auto 1fr', 2);
	mDiv(dtitle, { padding: 10, fg: 'white', fz: 24 }, null, 'OUTPUT:');
	mFlex(dta);
	AU.ta = mTextArea100(dta, { w:'50%', fz: 20, padding: 10, family: 'opensans' });
	AU.css = mTextArea100(dta, { w:'50%', fz: 20, padding: 10, family: 'opensans' });

}
async function intersectAnimeAndAllfuncs(){
	let kws = await extractKeywords('../animex/anime.js',true);
	console.log('kws',kws); //return;
	let kws1 = await extractKeywords('../basejs/allfhuge.js');
	let inter = intersection(kws, kws1);
	console.log('keywords', inter);
	text=inter.join()
	return text
}
function mCols100(dParent, spec, gap = 4) {
	let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
	grid.style.gridTemplateColumns = spec;
	let res = [];
	for (const i of range(stringCount(spec, ' ') + 1)) {
		let d = mDiv(grid, { h: '100%', w: '100%', box: true })
		res.push(d);
	}
	return res;
}
function mRows100(dParent, spec, gap = 4) {
	let grid = mDiv(dParent, { padding: gap, gap: gap, box: true, display: 'grid', h: '100%', w: '100%' })
	grid.style.gridTemplateRows = spec;
	let res = [];
	for (const i of range(stringCount(spec, ' ') + 1)) {
		let d = mDiv(grid, { h: '100%', w: '100%', box: true })
		res.push(d);
	}
	return res;
}
function mTextArea100(dParent, styles = {}) {
	mCenterCenterFlex(dParent)
	let html = `<textarea style="width:100%;height:100%;box-sizing:border-box" wrap="hard"></textarea>`;
	let t = mCreateFrom(html);
	mStyle(t, styles);
	mAppend(dParent, t);
	return t;
}
function removeTrailingComments(line) {
	let icomm = line.indexOf('//');
	let ch = line[icomm - 1];
	if (icomm <= 0 || ch == "'" || ':"`'.includes(ch)) return line;
	if ([':', '"', "'", '`'].some(x => line.indexOf(x) >= 0 && line.indexOf(x) < icomm)) return line;
	return line.substring(0, icomm);
}
























