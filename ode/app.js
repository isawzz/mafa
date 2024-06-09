//#region require - constants
const express = require("express");
const bodyParser = require('body-parser');
//const fileUpload = require("express-fileupload");
const fs = require('fs');
const fsp = require('fs').promises;
const path = require("path");
const yaml = require('js-yaml');
//console.log('**************\n__dirname', __dirname);
const PORT = process.env.PORT || 3000;
const assetsDirectory = path.join(__dirname, '..', 'assets');
const uploadDirectory = path.join(__dirname, '..', 'y');
const dbDirectory = path.join(__dirname, '..', 'y', 'dbyaml');
const configFile = path.join(uploadDirectory, 'config.yaml');
const usersFile = path.join(dbDirectory, 'users.yaml');
const eventsFile = path.join(dbDirectory, 'events.yaml');
const mFile = path.join(uploadDirectory, 'm.yaml');
const superdiFile = path.join(uploadDirectory, 'superdi.yaml');
const tablesDir = path.join(uploadDirectory, 'tables');
const tablesFile = path.join(uploadDirectory, 'tableinfo.yaml');
const usersDir = path.join(uploadDirectory, 'users');
var Session = {}; // session ist nur fuer temp data: just mem
var Superdi = {};
//var Spectators={}; //spectators on tables - never saved

const app = express();
app.use(bodyParser.json({ limit: '200mb' })); //works!!!
//app.use(express.json({ limit: '200mb' }));  //doesn't work
//app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); //Serve public directory
//#endregion

//#region functions
function addIf(arr, el) { if (!arr.includes(el)) arr.push(el); }
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function arrClear(arr) { arr.length = 0; return arr; }
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrMinus(arr, b) { if (isList(b)) return arr.filter(x => !b.includes(x)); else return arr.filter(x => x != b); }
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
		console.log('ids for',name,idlist)
		for (const id of idlist) {
			let client = clients[id]; //console.log(name, client.id); //isdef(client),Object.keys(client))
			if (client) client.emit(msgtype, o);
		}
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
function getUserPath(name) { return path.join(usersDir, `${name}.yaml`); }
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
function nundef(x) { return x === null || x === undefined; }
function removeInPlace(arr, el) {
	let i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
	return i;
}
function saveConfig() {
	let y = yaml.dump(Session.config); fs.writeFileSync(configFile, y, 'utf8');
}
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
// function saveUser(uname) {
// 	let p = path.join(uploadDirectory, 'users', uname + '.yaml');
// 	let y = yaml.dump(Session.users[uname]); fs.writeFileSync(p, y, 'utf8');
// }
function valf() {
	for (const arg of arguments) if (isdef(arg)) return arg;
	return null;
}
//#endregion

//#region socket io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origins: '*', } });//live-server: brauch ich cors!
const byClient = {};
const byUsername = {};
const clients = {};
io.on('connection', (client) => {
	clients[client.id] = client;
	client.on('userChange', x => handle_userChange(x, client.id));
	client.on('disconnect', x => handle_disconnect(x, client.id));
});
function handle_disconnect(x, id) {
	console.log('::io.disconnected', id);
	let uname = byClient[id];
	let idlist = byUsername[uname];
	if (isList(idlist)) removeInPlace(idlist, id);
	// for(const k in Spectators){removeInPlace(Spectators[k],uname)}
	io.emit('message', `${uname} left`);
}
function handle_userChange(x, id) {
	if (x.oldname == x.newname) { console.log('no change:', x.oldname); return; }
	console.log('::user change', x.newname);
	// for(const k in Spectators){removeInPlace(Spectators[k],x.oldname)}
	byClient[id] = x.newname;
	lookupAddToList(byUsername, [x.newname], id);
	let list = byUsername[x.oldname];
	//console.log('list',list,id)
	if (isList(list) && list.includes(id)) removeInPlace(list, id);
	io.emit('userChange', `${id} is now ${x.newname}`);
}
//#endregion

app.get('/user', (req, res) => {
	let name = req.query.name;
	//console.log('==> get user:', name)
	let data = lookup(Session, ['users', name]);
	//console.log(data)
	res.json(data);
});
app.get('/otherUser', (req, res) => {
	let params = req.query;
	// console.log('params',params,Object.values(params));
	let list = Array.from(Object.values(params));
	//console.log(list)
	let i = list.indexOf(Session.lastUser);
	//console.log(i)
	let name = Session.lastUser = i < 0 ? list[0] : list[(i + 1) % list.length];
	// let [name1, name2] = [params.name1, params.name2];
	// let name = Session.lastUser = (Session.lastUser == name1 ? name2 : name1);
	res.json(name);
});
app.get('/users', (req, res) => {
	let users = lookup(Session, ['users']);
	let di = {};
	for (const k in users) {
		if (k.includes('_') || k.includes('unsafe')) continue;
		di[k] = users[k];
	}
	return res.json(di);
});
app.get('/config', (req, res) => {
	console.log('==> get config')
	res.json(Session.config);
});
app.get('/event', (req, res) => {
	let params = req.query;
	console.log('==> get event:\n params', Object.keys(params))
	let data = lookup(Session, ['events', params.id]);
	//console.log(data)
	res.json(data);
});
app.get('/events', (req, res) => { return res.json(lookup(Session, ['events'])); });
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
app.get('/session', (req, res) => {
	console.log('==> get session')
	res.json({ users: Session.users, config: Session.config, tables: getTablesInfo() });
});
app.get('/table', (req, res) => {
	let params = req.query;
	//console.log('==> get table:\n params', params); //Object.keys(params))
	//can also get a table by friendly name
	let data = lookup(Session, ['tables', params.id]);
	if (!data) {
		//search tables by friendly name contains id
		for (const id in Session.tables) {
			let t = Session.tables[id];
			if (t.friendly.toLowerCase().includes(params.id.toLowerCase())) { data = t; break; }
		}
	}
	//console.log(data)
	res.json(data);
});
app.get('/tables', (req, res) => { return res.json(getTablesInfo()); });

//#region post routes (uses emit)
app.post('/deleteImage', (req, res) => {
	let path1 = path.join(__dirname, req.body.path);
	console.log('!!!deleting', path1);
	if (fs.existsSync(path1)) fs.unlinkSync(path1); else console.log('NO', path1)
	res.json(`image deleted ${req.body.path}`);
});
app.post('/deleteItem', (req, res) => {
	let key = req.body.key;
	if (nundef(M.superdi[key])) {
		res.json(`item ${key} NOT FOUND! NO UPDATE!!!!!!`);
	} else {
		delete M.superdi[key];
		let y = yaml.dump(M.superdi);
		fs.writeFileSync(superdiFile, y, 'utf8');
		io.emit('superdi', key);
		res.json(`item ${key} deleted successfully!`);
	}
});
app.post('/deleteTable', (req, res) => {
	let id = req.body.id;
	console.log('<== delete table', id);
	let t = lookup(Session, ['tables', id]);
	if (t) {
		deleteTable(id);
		io.emit('tables', getTablesInfo());
		//io.emit('deleteTable', getTablesInfo());
	}
	res.json(getTablesInfo());
});
app.post('/moveImage', (req, res) => {
	let [olddir, newdir, filename] = [req.body.olddir, req.body.newdir, req.body.filename];
	console.log('...move', olddir, newdir, filename);
	let oldpath = path.join(assetsDirectory, 'img', olddir, filename);
	let newpath = path.join(assetsDirectory, 'img', newdir, filename);
	if (fs.existsSync(newpath)) {
		console.log('@@@@@@@ NOT UNIQUE:', filename)
		filename = `i${Date.now()}_${filename}`;
		newpath = path.join(assetsDirectory, 'img', newdir, filename);
	}
	let dir = path.join(assetsDirectory, 'img', newdir);
	if (!fs.existsSync(dir)) fs.mkdirSync(dir);
	else console.log('dir', dir, 'already exists');
	console.log('move', oldpath, newpath);
	if (fs.existsSync(oldpath)) {
		fs.renameSync(oldpath, newpath);
		res.json({ newpath: `../assets/img/${newdir}/${filename}`, msg: `image renamed to ${filename} in ${newdir}` });
	} else {
		console.log('!!!NO', oldpath);
		res.json(`did NOT find ${oldpath}`);
	}
});
app.post('/postConfig', (req, res) => {
	console.log('<== post config')
	Session.config = req.body;
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	io.emit('config',Session.config);
	res.json("config saved!");
});
app.post('/postEvent', (req, res) => {
	let id = req.body.id;
	let data = req.body;
	console.log('<== post event')
	console.log('data', data)

	if (isEmpty(data.text)) delete Session.events[id]; else lookupSetOverride(Session, ['events', id], data);
	let y = yaml.dump(Session.events);
	let fname = path.join(dbDirectory, 'events.yaml');
	fs.writeFileSync(fname, y, 'utf8');
	res.json(data);
});
app.post('/postImage', (req, res) => {
	console.log('<== post image')
	const data = req.body;
	let p = data.path;
	let base64Data = data.image.replace(/^data:image\/png;base64,/, "");
	let fname;
	if (isdef(data.coll)) {
		let dir = path.join(assetsDirectory, 'img', data.coll);
		if (!fs.existsSync(dir)) fs.mkdirSync(dir);
		fname = path.join(dir, p);
	} else {
		fname = path.join(__dirname, p);
	}
	console.log('fname', fname);
	fs.writeFileSync(fname, base64Data, 'base64');
	res.json({
		message: 'File uploaded successfully',
		fileName: fname,
	});
});
app.post('/postUpdateEvent', (req, res) => {
	let id = req.body.id;
	let data = req.body;
	console.log('<== post update event')
	console.log('data', data)

	if (isEmpty(data.text)) delete Session.events[id]; else lookupSetOverride(Session, ['events', id], data);
	let y = yaml.dump(Session.events);
	let fname = path.join(dbDirectory, 'events.yaml');
	fs.writeFileSync(fname, y, 'utf8');
	io.emit('event', data);
	res.json(`events updated successfully!`);
	//res.json(data);
});
app.post('/postNewItem_', (req, res) => {
	let key = req.body.key;
	let item = req.body.item;
	if (nundef(M.superdi[key])) {
		M.superdi[key] = item;
		let y = yaml.dump(M.superdi);
		fs.writeFileSync(superdiFile, y, 'utf8');
		item.key = key;
		io.emit('superdi', item);
		res.json(`item ${key} posted successfully!`);
	} else {
		res.json(`item ${key} is a DUPLICATE!!!! NOT ADDED!!!`);
	}
});
app.post('/postUpdateItem_', (req, res) => {
	let key = req.body.key;
	let item = req.body.item;
	if (nundef(M.superdi[key])) {
		res.json(`item ${key} NOT FOUND! NO UPDATE!!!!!!`);
	} else {
		M.superdi[key] = item;
		let y = yaml.dump(M.superdi);
		fs.writeFileSync(superdiFile, y, 'utf8');
		item.key = key;
		io.emit('superdi', item);
		res.json(`item ${key} updated successfully!`);
	}
});
app.post('/postUpdateSuperdi', (req, res) => {
	let partialdi = req.body.di;
	let toBeDeleted = valf(req.body.deletedKeys, []);
	let collname = req.body.collname;
	let deleteCollection = req.body.deleteCollection; //true when deleting a collection entirely!
	console.log('<== postUpdateSuperdi')
	console.log('to be deleted', toBeDeleted);
	console.log('to be updated:', Object.keys(partialdi));
	for (const k of toBeDeleted) {
		//image needs to be deleted as well!!!!
		let item = M.superdi[k];
		if (nundef(item.img) || item.colls.length > 1) {
			console.log('!!!no image!!!', k)
			continue;
		}
		let path1 = path.join(__dirname, item.img);
		console.assert(path1.includes(collname), '!!!!!!!!!!!!!!!!!!');
		console.log('!!!!!!!!!!!!!deleting', path1);
		if (fs.existsSync(path1)) fs.unlinkSync(path1); else console.log('NO', path1)
		delete M.superdi[k];
	}
	for (const k in partialdi) {
		let o=partialdi[k];
		//do NOT ever save 'key' in superdi
		delete o.key;
		M.superdi[k] = o;
	}
	if (deleteCollection == true) {
		let p = path.join(assetsDirectory, 'img', collname);
		if (fs.existsSync(p)) fs.rmdirSync(p);
	}
	let y = yaml.dump(M.superdi);
	fs.writeFileSync(superdiFile, y, 'utf8');
	io.emit('superdi', partialdi);
	res.json(`Superdi updated successfully!`);
});
app.post('/overrideUser', (req, res) => {
	let name = req.body.name;
	let data = req.body;
	saveUser(name, data);
	res.json(data);
});
app.post('/postUser', (req, res) => {
	let name = req.body.name;
	let userdata = req.body;
	console.log('<== post user', userdata)
	let user = lookup(Session, ['users', name]);
	let isNew = !user;
	if (isNew) {
		let imgKey = userdata.imgKey;
		if (nundef(imgKey) || nundef(M.superdi[imgKey])) imgKey = fs.existsSync(path.join(assetsDirectory, `img/users/${name}.jpg`)) ? name : 'unknown_user';		
		//if (nundef(userdata.imgKey) || nundef(M.superdi[userdata.imgKey])) userdata.imgKey = fs.existsSync(path.join(assetsDirectory, `img/users/${name}.jpg`)) ? name : 'unknown_user';		
		user = userdata; 
	}	else copyKeys(userdata, user);
	saveUser(name, user);
	let msg = `user posted: ${user.name} new:${isNew}`;
	console.log(msg)
	res.json(user);
});
app.post('/renameImgDir', (req, res) => {
	let oldname = req.body.oldname;
	let newname = req.body.newname;
	fs.renameSync(path.join(assetsDirectory, `img/${oldname}`), path.join(assetsDirectory, `img/${newname}`));
	res.json(`dir ${oldname} renamed successfully!`);
});

app.post('/postTable', (req, res) => { //reset version!!! emits id turn to everyone, fuer den anfang von einer table!
	let id = req.body.id;
	let newTable = req.body;
	let table = lookup(Session, ['tables', id]);
	let isNew = !table || table.status == 'open' && newTable.status == 'started';
	if (isNew) table = newTable; else copyKeys(newTable, table);
	console.log(newTable.status);
	let isStarted = table.status == 'started';
	saveTable(id, table);
	lookupSetOverride(Session, ['tableInfo', id, 'version'], 0);
	let msg = `table posted: ${table.friendly} new:${isNew} status:${table.status}`;
	console.log(msg)
	let turn = isStarted ? table.turn : [];
	io.emit('table', { msg, id, turn, isNew })
	res.json(msg);
});

// *** old API ***
app.post('/olist', (req, res) => { //partial override using olist, emit+return iff valid!
	let name = req.body.name; if (nundef(name)) return res.json("ERRROR! no name provided for olist!");
	let id = req.body.id; if (nundef(id)) return res.json("ERRROR! no id provided for olist!");
	let olist = req.body.olist; if (nundef(olist)) return res.json("ERRROR! no olist provided for olist!");
	let step = req.body.step;
	let stepIfValid = req.body.stepIfValid;
	let table = lookup(Session, ['tables', id]);

	//validity!
	let version = lookupSet(Session, ['tableInfo', id, 'version'], step);
	if (isdef(step) && step < version) {
		//data obsolete! table version has already been updated!
		res.json(`INVALID!!!! step:${step} version:${version}`);
		return;
	}
	if (isdef(stepIfValid)) {
		lookupSetOverride(Session, ['tableInfo', id, 'version'], stepIfValid);
		table.step = stepIfValid;
		saveTableInfo();
	}
	for (const o of olist) lookupSetOverride(table, o.keys, o.val);
	saveTable(id, table);
	io.emit('pending',id);
	res.json(`YEAH!!!!`);
});

//******** NEW GAME API *********/
app.post('/table', (req, res) => { //override & emit iff valid!
	let name = req.body.name; if (nundef(name)) return res.json("ERRROR! no name provided for olist!");
	let id = req.body.id; if (nundef(id)) return res.json("ERRROR! no id provided for olist!");
	let table = req.body.table; if (nundef(table)) return res.json("ERRROR! no table provided for olist!");
	let step = req.body.step;
	let stepIfValid = req.body.stepIfValid;

	//validity!
	let version = lookupSet(Session, ['tableInfo', id, 'version'], step);
	if (isdef(step) && step < version) { //data obsolete! table version has already been updated!
		res.json(`INVALID!!!! step:${step} version:${version}`);
		console.log('INVALID!!!',name,step);
		return;
	}
	if (isdef(stepIfValid)) {
		lookupSetOverride(Session, ['tableInfo', id, 'version'], stepIfValid);
		table.step = stepIfValid;
		saveTableInfo();
	}
	saveTable(id, table);
	io.emit('pending',id);
	res.json(`YEAH!!!!`);
});



async function init() {
	let yamlFile = fs.readFileSync(configFile, 'utf8');
	Session.config = yaml.load(yamlFile);
	yamlFile = fs.readFileSync(tablesFile, 'utf8');
	Session.tableInfo = yaml.load(yamlFile);
	// yamlFile = fs.readFileSync(usersFile, 'utf8');
	// Session.users = valf(yaml.load(yamlFile), {});
	Session.users = {};
	let userfiles = await fsp.readdir(usersDir);
	for (const f of userfiles) {
		let p = path.join(usersDir, f)
		//console.log('path',p)
		yamlFile = fs.readFileSync(p, 'utf8');
		let o = yaml.load(yamlFile);
		Session.users[o.name] = o;
	}

	yamlFile = fs.readFileSync(eventsFile, 'utf8');
	Session.events = valf(yaml.load(yamlFile), {});
	yamlFile = fs.readFileSync(mFile, 'utf8');
	M = valf(yaml.load(yamlFile), {});
	yamlFile = fs.readFileSync(superdiFile, 'utf8');
	M.superdi = valf(yaml.load(yamlFile), {});
	Session.tables = {};
	let tablefiles = await fsp.readdir(tablesDir);
	for (const f of tablefiles) {
		let p = path.join(tablesDir, f)
		//console.log('path',p)
		yamlFile = fs.readFileSync(p, 'utf8');
		let o = yaml.load(yamlFile);
		Session.tables[o.id] = o;
	}
	server.listen(PORT, () => console.log('ode: listening on port ' + PORT));
}
init();










