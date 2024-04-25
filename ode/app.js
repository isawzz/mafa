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
const superdiFile = path.join(uploadDirectory, 'm.yaml');
const tablesDir = path.join(uploadDirectory, 'tables');
const usersDir = path.join(uploadDirectory, 'users');
var Session = {}; // session ist nur fuer temp data: just mem
var Superdi = {};

const app = express();
app.use(bodyParser.json({ limit: '200mb' })); //works!!!
//app.use(express.json({ limit: '200mb' }));  //doesn't work
//app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); //Serve public directory
//#endregion

//#region functions
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function arrClear(arr) { arr.length = 0; return arr; }
function arrLast(arr) { return arr.length > 0 ? arr[arr.length - 1] : null; }
function arrMinus(arr, b) { if (isList(b)) return arr.filter(x => !b.includes(x)); else return arr.filter(x => x != b); }
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
function deleteTable(id) { delete Session.tables[id]; deleteFile(getTablePath(id)); }
function emitToPlayers(namelist, msgtype, o) {
	for (const name of namelist) {
		let idlist = byUsername[name]; //console.log('name', name, '\nid', idlist);
		if (nundef(idlist)) continue;
		// console.log('ids for',name,idlist)
		for (const id of idlist) {
			let client = clients[id]; //console.log(name, client.id); //isdef(client),Object.keys(client))
			o.clientid=client.id;
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
		if (isdef(t.fen)) { t.turn = t.fen.turn; delete t.fen; }
		info.push(t);
	}
	return info;
}
function getUserPath(name) { return path.join(usersDir, `${name}.yaml`); }
function isdef(x) { return x !== null && x !== undefined; }
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
		if (d[k] === undefined) d[k] = (i == ilast ? val : {});
		if (nundef(d[k])) d[k] = (i == ilast ? val : {});
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
function saveUser(name, o) {
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
	io.emit('message', `${uname} left`);
}
function handle_userChange(x, id) {
	if (x.oldname == x.newname) { console.log('no change:', x.oldname); return; }
	console.log('::user change', x.newname);
	byClient[id] = x.newname;
	lookupAddToList(byUsername, [x.newname], id);
	let list = byUsername[x.oldname];
	//console.log('list',list,id)
	if (isList(list) && list.includes(id)) removeInPlace(list, id);
	io.emit('userChange', `${id} is now ${x.newname}`);
}
//#endregion


app.get('/session', (req, res) => {
	console.log('==> get session')
	res.json({ users: Session.users, config: Session.config, tables: getTablesInfo() }); 
});


async function init() {
	let yamlFile = fs.readFileSync(configFile, 'utf8');
	Session.config = yaml.load(yamlFile);
	yamlFile = fs.readFileSync(usersFile, 'utf8');
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
	yamlFile = fs.readFileSync(superdiFile, 'utf8');
	M = valf(yaml.load(yamlFile), {});
	Session.tables = {};
	let tablefiles = await fsp.readdir(tablesDir);
	for (const f of tablefiles) {
		let p = path.join(tablesDir, f)
		//console.log('path',p)
		yamlFile = fs.readFileSync(p, 'utf8');
		let o = yaml.load(yamlFile);
		Session.tables[o.id] = o;
	}
	server.listen(PORT, () => console.log('listening on port ' + PORT));
}
init();










