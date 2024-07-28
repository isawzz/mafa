//#region require - constants
const express = require("express");
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
const fsp = require('fs').promises;
const path = require("path");
const yaml = require('js-yaml');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.json({ limit: '200mb' })); //works!!!
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); //Serve public directory
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});
app.use(express.urlencoded({ extended: true }));

const assetsDirectory = path.join(__dirname, '..', 'assets');
const uploadDirectory = path.join(__dirname, '..', 'y');
const configFile = path.join(uploadDirectory, 'config.yaml');
const pagesDirectory = path.join(uploadDirectory, 'pages');
const Session = {};
var parsingComplete = false;

//const voyagePath = path.join(__dirname, '..', 'enmini.xml');
const voyagePath = path.join(__dirname, '..', 'enwikivoyage-20240220-pages-meta-current.xml');

//#endregion

const PORT = 3001;

//#region functions
function addIf(arr, el) { if (!arr.includes(el)) arr.push(el); }
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function arrClear(arr) { arr.length = 0; return arr; }
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrMinus(arr, b) { if (isList(b)) return arr.filter(x => !b.includes(x)); else return arr.filter(x => x != b); }
function arrTake(arr, n = 0, from = 0) {
	if (isDict(arr)) {
		let keys = Object.keys(arr);
		return n > 0 ? keys.slice(from, from + n).map(x => (arr[x])) : keys.slice(from).map(x => (arr[x]));
	} else return n > 0 ? arr.slice(from, from + n) : arr.slice(from);
}
function assertion(cond) {
	if (!cond) {
		let args = [...arguments];
		console.log('!!!ASSERTION!!!')
		for (const a of args) {
			console.log('\n', a);
		}
		return false;
	} else return true;
}
function calcScoreSum(table) {
	let res = 0;
	for (const name in table.players) {
		res += table.players[name].score;
	}
	return res;
}
function calcErrSum(table) {
	let res = 0;
	for (const name in table.players) {
		res += valf(table.players[name].errors, 0);
	}
	return res;
}
function copyKeys(ofrom, oto, except = {}, only = null) {
	let keys = isdef(only) ? only : Object.keys(ofrom);
	for (const k of keys) {
		if (isdef(except[k])) continue;
		oto[k] = ofrom[k];
	}
	return oto;
}
function deleteFile(filePath) {
	fs.unlink(filePath, (err) => {
		if (err) {
			console.error('Error deleting file:', err);
			return;
		}
		console.log('File deleted:', filePath);
	});
}
function deleteTable(id) {
	delete Session.tables[id];
	deleteFile(getTablePath(id));
	let ti = Session.tableInfo[id];
	if (isdef(ti)) {
		delete Session.tableInfo[id];
		saveTableInfo();
	}

}
function emitToPlayers(namelist, msgtype, o) {
	for (const name of namelist) {
		let idlist = byUsername[name]; //console.log('name', name, '\nid', idlist);
		if (nundef(idlist)) continue;
		console.log('ids for', name, idlist)
		for (const id of idlist) {
			let client = clients[id]; //console.log(name, client.id); //isdef(client),Object.keys(client))
			if (client) client.emit(msgtype, o);
		}
	}
}
async function generateCityInfo() {
	let o = await loadYamlFile(path.join(uploadDirectory, 'citygood.yaml'));
	//console.log('o',o);
	//console.log('keys',Object.keys(o));return;
	let titles = Object.keys(o).map(x => o[x].title);
	console.log(titles.length);
	let max = titles.length
	let nStart = 0;
	for (let n = nStart; n < max; n += 50) {
		let list = titles.slice(n, n + 50);
		let di = await getPageDetails(list);
		console.log(di)
		saveYaml(di, `_city_${n}.yaml`);
	}

}
async function getFiles(dir) {
	const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
	//console.log('dirpath', directoryPath)
	const files = await fsp.readdir(directoryPath);
	return files;

}
function getTablePath(id) { return path.join(tablesDir, `${id}.yaml`); }
function getTablesInfo() {
	let info = [];
	//console.log('session.tables',Session.tables); return [];
	for (const id in Session.tables) {
		let t = jsCopy(Session.tables[id]);
		delete t.fen;
		//delete t.players;
		info.push(t);
	}
	return info;
}
function getUniquePath(fname, dir) {
	let core = stringBefore(fname, '.');
	let ext = '.' + stringAfter(fname, '.');
	let name = core;
	let i = 1;
	while (true) {
		if (!fs.existsSync(dir + name + ext)) break;
		name = core + (i++);
	}
	return [name + ext, path.join(dir, name + ext)];

}
function getUserPath(name) { return path.join(usersDir, `${name}.yaml`); }
function isAlphaNum(s) { query = /^[a-zA-Z0-9]+$/; return query.test(s); }
function isdef(x) { return x !== null && x !== undefined; }
function isDict(d) { let res = (d !== null) && (typeof (d) == 'object') && !isList(d); return res; }
function isEmpty(arr) {
	return arr === undefined || !arr
		|| (isString(arr) && (arr == 'undefined' || arr == ''))
		|| (Array.isArray(arr) && arr.length == 0)
		|| Object.entries(arr).length === 0;
}
function isList(arr) { return Array.isArray(arr); }
function isLiteral(x) { return isString(x) || isNumber(x); }
function isNumber(x) { return x !== ' ' && x !== true && x !== false && isdef(x) && (x == 0 || !isNaN(+x)); }
function isObject(item) { return (item && typeof item === 'object' && !Array.isArray(item)); }
function isString(param) { return typeof param == 'string'; }
function jsCopy(o) { return JSON.parse(JSON.stringify(o)); }
function lookup(dict, keys) {
	if (nundef(dict)) return null;
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (k === undefined) break;
		let e = d[k];
		if (e === undefined || e === null) return null;
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupAddIfToList(dict, keys, val) {
	let lst = lookup(dict, keys);
	if (isList(lst) && lst.includes(val)) return;
	lookupAddToList(dict, keys, val);
}
function lookupAddToList(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (i == ilast) {
			if (nundef(k)) {
				console.assert(false, 'lookupAddToList: last key indefined!' + keys.join(' '));
				return null;
			} else if (isList(d[k])) {
				d[k].push(val);
			} else {
				d[k] = [val];
			}
			return d[k];
		}
		if (nundef(k)) continue;
		if (d[k] === undefined) d[k] = {};
		d = d[k];
		i += 1;
	}
	return d;
}
async function loadYamlFile(p) {
	let yamlFile = fs.readFileSync(p, 'utf8');
	return yaml.load(yamlFile);
}
function lookupSet(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (nundef(k)) continue;
		//if (d[k] === undefined) d[k] = (i == ilast ? val : {});
		if (nundef(d[k])) d[k] = (i == ilast ? val : {}); //only uses val if hasn't been set!
		d = d[k];
		if (i == ilast) return d;
		i += 1;
	}
	return d;
}
function lookupSetOverride(dict, keys, val) {
	let d = dict;
	let ilast = keys.length - 1;
	let i = 0;
	for (const k of keys) {
		if (i == ilast) {
			if (nundef(k)) {
				return null;
			} else {
				d[k] = val;
			}
			return d[k];
		}
		if (nundef(k)) continue;
		if (nundef(d[k])) d[k] = {};
		d = d[k];
		i += 1;
	}
	return d;
}
function normalizeString(s, sep = '_', keep = []) {
	s = s.toLowerCase().trim();
	let res = '';
	for (let i = 0; i < s.length; i++) { if (isAlphaNum(s[i]) || keep.includes(s[i])) res += s[i]; else res += sep; }
	return res;
}
function nundef(x) { return x === null || x === undefined; }
async function processToPageTitles(filePath) {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
		const rl = readline.createInterface({
			input: readStream,
			crlfDelay: Infinity
		});

		let lineNumber = 0;
		let titledict = {};
		let page, title, norm;
		rl.on('line', (line) => {
			let l = line.trim();
			//console.log(l)
			if (l.includes('<title>')) {
				title = stringBetween(l, '<title>', '</title>').trim();
				norm = normalizeString(title)
			} else if (l.includes('<page')) {
				if (isdef(title)) titledict[norm] = title;
				page = '';
			} else if (l.includes('</mediawiki')) {
				console.log('END DETECTED!!!!');
				saveYaml(titledict, path.join(uploadDirectory, 'pagetitles.yaml'));
			}
			lineNumber++;
		});

		rl.on('close', () => {
			console.log('Finished reading lines', lineNumber);
			parsingComplete = true;

			resolve(titledict);
		});

		rl.on('error', (error) => {
			console.error(`Error reading file: ${error.message}`);
			reject(error);
		});

		readStream.on('error', (error) => {
			console.error(`Error reading stream: ${error.message}`);
			reject(error);
		});
	});
}
async function processToPageText(filePath) {
	return new Promise((resolve, reject) => {
		const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
		const rl = readline.createInterface({
			input: readStream,
			crlfDelay: Infinity
		});

		let lineNumber = 0;
		let pages = {}, page, title;
		rl.on('line', (line) => {
			let l = line.trim(); //trimWhitespace(line);
			//console.log(l)
			if (l.includes('<title>')) {
				title = stringBetween(l, '<title>', '</title>').toLowerCase().trim();
				title = normalizeString(title)
			} else if (l.includes('<page')) {
				if (isdef(title)) pages[title] = page;
				page = '';
			} else if (l.includes('</mediawiki')) {
				console.log('END DETECTED!!!!')
				saveHugeYaml(pages, 'pages');
			} else if (isdef(page)) {
				page += l + '\n';
			} //else console.log(`ERROR line# ${lineNumber}`);
			// Process each line here
			lineNumber++;
			//console.log(line);
		});

		rl.on('close', () => {
			console.log('Finished reading file.');
			parsingComplete = true;
			resolve(pages);
		});

		rl.on('error', (error) => {
			console.error(`Error reading file: ${error.message}`);
			reject(error);
		});

		readStream.on('error', (error) => {
			console.error(`Error reading stream: ${error.message}`);
			reject(error);
		});
	});
}
function recFlatten(o) {
	if (isLiteral(o)) return o;
	else if (isList(o)) return o.map(x => recFlatten(x)).join(', ');
	else if (isDict(o)) {
		let valist = [];
		for (const k in o) { let val1 = recFlatten(o[k]); valist.push(`${k}: ${val1}`); }
		return valist.join(', ');
	}
}
function removeInPlace(arr, el) {
	let i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
	return i;
}
function saveConfig() { let y = yaml.dump(Session.config); fs.writeFileSync(configFile, y, 'utf8'); }
function saveDetails() { let y = yaml.dump(M.details); fs.writeFileSync(detailsFile, y, 'utf8'); }
function saveLists() { let y = yaml.dump(M.lists); fs.writeFileSync(listsFile, y, 'utf8'); }
function saveTable(id, o) {
	lookupSetOverride(Session, ['tables', id], o);
	let y = yaml.dump(Session.tables[id]);
	fs.writeFileSync(getTablePath(id), y, 'utf8');
}
function saveTableInfo() {
	let y = yaml.dump(Session.tableInfo); fs.writeFileSync(tablesFile, y, 'utf8');
}
function saveUser(name, o) {
	let nogo = ['div', 'isSelected', 'button', 'button99', 'button98', 'button97', 'playmode'];
	nogo.map(x => delete o[x]);
	for (const k in o) {
		let val = o[k];
		if (!isDict(val)) continue;
		delete val['playmode'];
	}

	lookupSetOverride(Session, ['users', name], o);
	let y = yaml.dump(Session.users[name]);
	fs.writeFileSync(getUserPath(name), y, 'utf8');
}
//const { Readable } = require('stream');
function saveHugeYaml(o, dir) {
	for (const k in o) {
		if (isNumber(k)) continue;
		let val = o[k];
		console.log(val)
		let p = path.join(uploadDirectory, dir, `${k}.yaml`);
		console.log('saving to', p);
		fs.writeFileSync(p, o[k]);
	}
	// let y = yaml.dump(o);
	// const readable = Readable.from(yamlStr);
	// const writable = fs.createWriteStream(p);
	// readable.pipe(writable);
	// writable.on('finish', () => { console.log('YAML file saved successfully'); });
	// writable.on('error', (err) => { console.error('Error writing YAML file:', err); });
}
function saveYaml(o, p) { let y = yaml.dump(o); fs.writeFileSync(p, y, 'utf8'); }
function stringAfter(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return '';
	return sFull.substring(idx + sSub.length);
}
function stringAfterLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return arrLast(parts);
}
function stringBefore(sFull, sSub) {
	let idx = sFull.indexOf(sSub);
	if (idx < 0) return sFull;
	return sFull.substring(0, idx);
}
function stringBeforeLast(sFull, sSub) {
	let parts = sFull.split(sSub);
	return sFull.substring(0, sFull.length - arrLast(parts).length - 1);
}
function stringBetween(sFull, sStart, sEnd) {
	return stringBefore(stringAfter(sFull, sStart), isdef(sEnd) ? sEnd : sStart);
}
function toFlatObject(o) {
	if (isString(o)) return { details: o };
	for (const k in o) { let val = o[k]; o[k] = recFlatten(val); }
	return o;
}
function trimWhitespace(line) { return line.replace(/\s+/g, ''); }

function valf() {
	for (const arg of arguments) if (isdef(arg)) return arg;
	return null;
}
//#endregion

//#region new functions
function getFileContent(p) {
	if (!fs.existsSync(p)) return null;
	yamlFile = fs.readFileSync(p, 'utf8');
	return yaml.load(yamlFile);
}
async function getFromWebPage(city) {
	const url = `https://en.wikivoyage.org/wiki/${encodeURIComponent(city)}`;
	try {
		const { data } = await axios.get(url);
		//const lines = data.split('\n').slice(0, 200).join('\n');
		return data;
	} catch (error) {
		console.error(`Error fetching the page for ${city}:`, error);
		return null;
	}
}
async function _getPageDetails(titles) {
	const URL = "https://en.wikivoyage.org/w/api.php";
	const PARAMS = {
		action: "query",
		format: "json",
		titles: titles.join('|'),
		prop: "categories|extracts",
		cllimit: "max",
		exintro: true,
		explaintext: true,
		redirects: true
	};

	try {
		const response = await axios.get(URL, { params: PARAMS });
		const pages = response.data.query.pages;

		const results = Object.values(pages).map(page => {
			const isCity = page.categories.some(category => category.title === "Category:Cities");
			const statusCategories = ["Category:Star_articles", "Category:Guide_articles", "Category:Usable_articles"];
			const status = statusCategories.find(category =>
				page.categories.some(cat => cat.title === category)
			) || "None";

			return {
				title: page.title,
				isCity: isCity,
				status: status.replace("Category:", "").replace("_articles", "").toLowerCase(),
				extract: page.extract || "No extract available"
			};
		});

		return results;
	} catch (error) {
		console.error('Error fetching page details:', error);
		return null;
	}
}
async function getPageDetails(titles) {
	const URL = "https://en.wikivoyage.org/w/api.php";
	const PARAMS = {
		action: "query",
		format: "json",
		titles: titles.join('|'),
		prop: "categories", //|extracts",
		//cllimit: "max",
		// exintro: true,
		// explaintext: true,
		// category: true,
		//redirects: true
	};

	try {
		const response = await axios.get(URL, { params: PARAMS });
		const pages = response.data.query.pages;
		return pages;

		//console.log(response.data);
		let details = {};
		for (const k in pages) {
			let page = pages[k];
			console.log(page.title);
			let o = {};
			if (nundef(page.categories)) continue;
			for (const cat of page.categories) {
				let parts = cat.title.split(':');
				let val = parts[1].toLowerCase(); console.log(val);
				if (val.startsWith('city')) o.isCity = true;
				if (val.startsWith('star')) o.status = 'star';
				else if (val.startsWith('guide')) o.status = 'guide';
				else if (val.startsWith('usable')) o.status = 'usable';
				else o.status = 'unknown';

				//console.log(cat.title);
			}
			details[page.title] = o;
		}
		return details;

		const results = Object.values(pages).map(page => {
			const isCity = page.categories.some(category => category.title === "Category:Cities");
			const statusCategories = ["Category:Star_articles", "Category:Guide_articles", "Category:Usable_articles"];
			const status = statusCategories.find(category =>
				page.categories.some(cat => cat.title === category)
			) || "None";

			return {
				title: page.title,
				isCity: isCity,
				status: status.replace("Category:", "").replace("_articles", "").toLowerCase(),
				extract: page.extract || "No extract available"
			};
		});

		return results;
	} catch (error) {
		console.error('Error fetching page details:', error);
		return null;
	}
}
async function getPageDetailsByIds(pageIds) {
	const URL = "https://en.wikivoyage.org/w/api.php";
	const PARAMS = {
		action: "query",
		format: "json",
		pageids: pageIds.join('|'),
		prop: "categories|extracts",
		cllimit: "max",
		exintro: true,
		explaintext: true,
		redirects: true
	};

	try {
		const response = await axios.get(URL, { params: PARAMS });
		const pages = response.data.query.pages;
		return pages;
	} catch (error) {
		console.error('Error fetching page details:', error);
		return null;
	}
}

app.get('/cityxml', async (req, res) => {
	let { query } = req.query; console.log('==> get cityxml:', query);
	let norm = normalizeString(query);

	let xml = lookup(Session, ['xml', norm]);
	if (xml) return res.json(xml);

	let p = path.join(uploadDirectory, 'pages', `${norm}.yaml`);
	let content = getFileContent(p);
	lookupSet(Session, ['xml', norm], content);
	return res.json(content);
});
app.get('/cityweb/:city', async (req, res) => {
	const city = req.params.city; console.log('==> get cityweb', city);
	const first200Lines = await getFromWebPage(city);
	if (first200Lines) {
		res.send(first200Lines);
	} else {
		res.status(404).json({ message: 'City not found or error fetching data' });
	}
});
app.get('/details/:title', async (req, res) => {
	const title = req.params.title;
	console.log('==> get details', title);
	//return res.json({title})
	let o = await getPageDetails([title]);
	res.json(o);
});
app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;
	if (!dir) { return res.status(400).json({ error: 'Directory parameter is missing' }); }
	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(assetsDirectory, dir);
		//console.log('dirpath', directoryPath)
		const files = await fsp.readdir(directoryPath);
		//console.log('files',files)
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});
app.get('/pageinfo/:id', async (req, res) => {
	const id = req.params.id;
	console.log('==> get details', id);
	let o = await getPageDetailsByIds([id]);
	res.json(o);
});
app.get('/wiki', async (req, res) => {
	const { query } = req.query;
	if (!query) {
		return res.status(400).json({ error: 'Query parameter is required.' });
	} else if (lookup(Session, ['extracts', query])) {
		return res.json({ title: query, extract: lookup(Session, ['extracts', query]) });
	}
	try {
		const encodedQuery = encodeURIComponent(query);
		const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&titles=${encodedQuery}`;
		const response = await fetch(apiUrl);
		const data = await response.json();
		const pages = data.query.pages;
		const page = Object.values(pages)[0];
		if (nundef(Session.extracts)) Session.extracts = {};
		const extract = page.extract || 'No information available.';
		if (isdef(page.extract)) Session.extracts[page.title] = extract;
		res.json({ title: page.title, extract });
	} catch (error) {
		console.error('Error fetching data from Wikipedia:', error);
		res.status(500).json({ error: 'Error fetching data from Wikipedia.' });
	}
});
app.get('/quotes/:title', async (req, res) => {
	const titles = [req.params.title];
	const pageTitle = req.params.title; //"Wolfgang Amadeus Mozart";
	const URL = "https://en.wikiquote.org/w/api.php";
	const PARAMS = {
		action: "parse",
		format: "json",
		page: pageTitle, //titles.join('|'),
		prop: "text",
		section: 1 // Usually, the quotes are in the first section after the intro
	};
	try { 
		const response = await axios.get(URL, { params: PARAMS }); //const pages = response.data.query.pages; return pages; 
		const html = response.data.parse.text["*"];
		return res.json(html);
		const quotes = [];
		const quoteRegex = /<li>(.*?)<\/li>/g;
		let match;
		while ((match = quoteRegex.exec(html)) !== null) { //} && quotes.length < 5) {
			quotes.push(match[1].replace(/<.*?>/g, "")); // Remove HTML tags
		}
		return res.json(quotes);
	}	catch (error) { console.error('Error fetching page details:', error); return res.json('ERROR'); }
});
app.get('/wiquote/:title', async (req, res) => {
	const titles = [req.params.title];
	const URL = "https://en.wikiquote.org/w/api.php";
	const PARAMS = { action: "query", format: "json", titles: titles.join('|'), prop: "categories", redirects: true };
	try { const response = await axios.get(URL, { params: PARAMS }); const pages = response.data.query.pages; return pages; }
	catch (error) { console.error('Error fetching page details:', error); return null; }
});
app.get('/testquote', async (req, res) => {
  let url=`https://en.wikiquote.org/w/api.php?action=query&format=json&titles=Albert%20Einstein&prop=extracts&exintro=true&explaintext=true`;
  url=`https://en.wikiquote.org/w/api.php?action=query&format=json&titles=Ludwig%20van%20Beethoven&prop=extracts&exintro=true&explaintext=true`;
  //url=`https://en.wikiquote.org/w/api.php?action=query&format=json&pageids=2169|2170|2180&prop=extracts&exintro=true&explaintext=true`;
	try { const response = await axios.get(url); const pages = response.data.query.pages; return res.json(pages); }
	catch (error) { console.error('Error fetching page details:', error); return res.json('ERROR'); }
});
app.get('/wiz', async (req, res) => {
});

async function init() {
	app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}/`); });
}
init();

