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
const tablesDir = path.join(dbDirectory, 'tables');
var Session = {}; // session ist nur fuer temp data: just mem

const app = express();
app.use(bodyParser.json({ limit: '200mb' })); //works!!!
//app.use(express.json({ limit: '200mb' }));  //doesn't work
//app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); //Serve public directory
//#endregion

//#region functions
function addKeys(ofrom, oto) { for (const k in ofrom) if (nundef(oto[k])) oto[k] = ofrom[k]; return oto; }
function copyKeys(ofrom, oto, except = {}, only = null) {
	let keys = isdef(only) ? only : Object.keys(ofrom);
	for (const k of keys) {
		if (isdef(except[k])) continue;
		oto[k] = ofrom[k];
	}
	return oto;
}
function deleteFile(filePath){
	fs.unlink(filePath, (err) => {
    if (err) {
        console.error('Error deleting file:', err);
        return;
    }
    console.log('File deleted successfully:', filePath);
	});	
}
function deleteTable(id){		delete Session.tables[id]; 	deleteFile(getTablePath(id));}
function emitToPlayers(namelist,msgtype,o){
	for(const name of namelist){
		let id = byUsername[name]; //console.log('name',name,'\nid',id)
		let client = clients[id]; //console.log('client',client)
		if (client) client.emit(msgtype,o);
	}
}
async function getFiles(dir) {
	const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
	//console.log('dirpath', directoryPath)
	const files = await fsp.readdir(directoryPath);
	return files;

}
function getTablePath(id){return path.join(tablesDir,`${id}.yaml`);}
function deepMerge(target, source) {
	// Check if the arguments are objects
	if (typeof target !== 'object' || typeof source !== 'object') {
		throw new Error('Both arguments must be objects');
	}

	// Iterate through the source object
	for (const key in source) {
		if (source.hasOwnProperty(key)) {
			// Check if the key exists in the target object
			if (target.hasOwnProperty(key)) {
				// If both values are objects, recursively merge them
				if (typeof target[key] === 'object' && typeof source[key] === 'object') {
					target[key] = deepMerge(target[key], source[key]);
				} else {
					// Otherwise, overwrite the value in the target object
					target[key] = source[key];
				}
			} else {
				// If the key does not exist in the target object, add it
				target[key] = source[key];
			}
		}
	}

	return target;
}
function isdef(x) { return x !== null && x !== undefined; }
function isEmpty(arr) {
	return arr === undefined || !arr
		|| (isString(arr) && (arr == 'undefined' || arr == ''))
		|| (Array.isArray(arr) && arr.length == 0)
		|| Object.entries(arr).length === 0;
}
function isList(arr) { return Array.isArray(arr); }
function isString(param) { return typeof param == 'string'; }
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
function saveTable(id,o){
	lookupSetOverride(Session, ['tables', id], o);
	let y = yaml.dump(Session.tables[id]);
	fs.writeFileSync(getTablePath(id), y, 'utf8');
}
function saveUser(uname) {
	let p = path.join(uploadDirectory, 'users', uname + '.yaml');
	let y = yaml.dump(Session.users[uname]); fs.writeFileSync(p, y, 'utf8');
}
function valf() {
	for (const arg of arguments) if (isdef(arg)) return arg;
	return null;
}
//#endregion

app.get('/user', (req, res) => {
	let params = req.query;
	let name = params.uname;
	console.log('==> get user:\n params', params)
	let data = lookup(Session, ['users', name]);
	//console.log(data)
	res.json(data);
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
function getTablesInfo(){
	let info=[];
	for(const id in Session.tables){
		//ich solltehaben: game, players, friendlyname, turn als minimum
		let t = Session.tables[id];
		let o={game:t.game,players:t.fen.playerNames,turn:t.fen.turn,friendly:t.friendly,id:id}
		info.push(o);
	}
	return info;
}
app.get('/session', (req, res) => {
	console.log('==> get session')
	let s={}; addKeys()
	res.json({users:Session.users,config:Session.config,tables:getTablesInfo()});
});
app.get('/table', (req, res) => {
	let params = req.query;
	console.log('==> get table:\n params', params); //Object.keys(params))
	//can also get a table by friendly name
	let data = lookup(Session, ['tables', params.id]);
	if (!data) {
		//search tables by friendly name contains id
		for(const id in Session.tables){
			let t=Session.tables[id];
			if (t.friendly.toLowerCase().includes(params.id.toLowerCase())) {data=t; break;}
		}
	}
	//console.log(data)
	res.json(data);
});
app.get('/tables', (req, res) => { return res.json(getTablesInfo()); });

//#region socket io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origins: '*', } });//live-server: brauch ich cors!
const byClient = {};
const byUsername = {};
const clients = {};
io.on('connection', (client) => {
	clients[client.id]=client;
	//handle_connect(client.id);
	//client.emit('message','hello')
	client.on('login', x => handle_login(x, client.id));
	client.on('userChange', x => handle_userChange(x, client.id));
	client.on('message', handle_message);
	client.on('move', handle_move);
	client.on('update', handle_update);
	client.on('disconnect', handle_disconnect); // ()=>handle_disconnect(socket.id));
});
function handle_connect(id) { console.log('::connected', id); io.emit('message', 'someone logged in!'); }
function handle_disconnect(x) { console.log('::io.disconnected', x); io.emit('message', x); }
function handle_login(x, id) {
	console.log('::login:', x, id);
	byClient[id] = x;
	byUsername[x] = id;
	io.emit('message', `${x} logged in!`);
}
function handle_message(x) { console.log('::message', arguments); io.emit('message', x); }
function handle_move(x){ 
	console.log('::move', arguments);  
	//console.log('Session tables',Session.tables)
	let table = lookup(Session,['tables',x.id]);
	//console.log('table',table);
	//wie kann ich temp move zu table saven?
	let fen = table.fen;
	let turn = fen.turn;
	console.log('turn',turn)
	let name = x.name;
	let move = x.move;

	//simplest:
	if (!turn.includes(name)) {console.log('!!!move mismatch',name,move);return;}
	lookupSetOverride(fen,['moves',name],move);
	removeInPlace(fen.turn,name)
	//save new fen when all players moved? or after each and every move?

	//broadcast fen
	io.emit('turnUpdate',fen.turn);


	// if (turn.includes(name)) {
	// 	lookupSet(table,['moves',name],x.move);
	// 	console.log('moves so far',table.moves);
	// }
	// //sobald alle slots gefuellt sind, setze fen.moves und broadcast
	// //jetzt kann jeder integrieren und updaten
	// let donelist = Object.keys(table.moves);
	// if (donelist.length == turn.length){
	// 	donelist.map(x=>fen.players[x].lastmove=)
	// }

}
function handle_update(x) { console.log('got update', x); io.emit('update', x); }
function handle_userChange(x, id) {
	console.log(':::SOCK user change:', x, id);
	byClient[id] = x.newname;
	lookupAddToList(byUsername,[x.newname],id);
	let old = byUsername[x.oldname];
	if (isdef(old)) removeInPlace(old,id);
	io.emit('userChange', `${id} is now ${x.newname}`);
}
//#endregion

//#region post routes (uses emit)
app.post('/deleteTable', (req, res) => {
	let id = req.body.id;
	console.log('<== delete table',id);
	let t=lookup(Session,['tables',id]);
	if (t){
		deleteTable(id);
		emitToPlayers(t.fen.playerNames,'deleteTable',getTablesInfo());
	}
	res.json('table deleted');
});
app.post('/postEvent', (req, res) => {
	let id = req.body.id;
	let data = req.body;
	console.log('<== post event')
	//console.log('data', data)
	let fname = path.join(dbDirectory, 'events.yaml');

	if (isEmpty(data.text)) delete Session.events[id]; else lookupSetOverride(Session, ['events', id], data);
	let y = yaml.dump(Session.events);
	fs.writeFileSync(fname, y, 'utf8');
	res.json(data);
});
app.post('/postUser', (req, res) => {
	let name = req.body.name;
	let data = req.body;
	if (nundef(data.icon)) data.icon = fs.existsSync(path.join(assetsDirectory,`img/users/${name}.jpg`))?name:'unknown_user';
	console.log('<== post user')
	//console.log('data', data)
	let fname = path.join(dbDirectory, 'users.yaml');
	lookupSetOverride(Session, ['users', name], data);
	let y = yaml.dump(Session.users);
	fs.writeFileSync(fname, y, 'utf8');
	res.json(data);
});
app.post('/postConfig', (req, res) => {
	console.log('<== post config')
	let newConfig = req.body;
	let oldConfig = Session.config;
	Session.config = deepMerge(oldConfig, newConfig);
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	res.json(Session.config);
});
app.post('/postImage', (req, res) => {
	console.log('<== post image')
	const data = req.body;
	let p = data.path;
	let base64Data = data.image.replace(/^data:image\/png;base64,/, "");
	let fname;
	if (isdef(data.coll)) {
		fname = path.join(uploadDirectory, 'img', p);
		fs.appendFile(path.join(uploadDirectory, 'm2.yaml'), `\n${data.unique}:\n  cat: ${data.coll}\n  coll: ${data.coll}\n  name: ${data.name}\n  ext: ${data.ext}`, err => { if (err) console.log('error:', err); });
	} else {
		fname = path.join(__dirname, '..', p);
	}
	console.log('fname', fname); //console.log('save to', p, __dirname)
	fs.writeFileSync(fname, base64Data, 'base64');
	res.json({
		message: 'File uploaded successfully',
		fileName: fname,
	});
});
app.post('/postNewTable', (req, res) => {
	let id = req.body.id;
	let fen = req.body.fen;
	console.log('<== post newTable',id)
	saveTable(id,req.body);
	emitToPlayers(fen.playerNames,'newTable',{tables:getTablesInfo(),table:req.body});
	res.json('table posted successfully!');
});




async function init() {
	let yamlFile = fs.readFileSync(configFile, 'utf8');
	Session.config = yaml.load(yamlFile);
	yamlFile = fs.readFileSync(usersFile, 'utf8');
	Session.users = valf(yaml.load(yamlFile), {});
	yamlFile = fs.readFileSync(eventsFile, 'utf8');
	Session.events = valf(yaml.load(yamlFile), {});
	Session.tables = {};
	console.log('tablesDir',tablesDir)
	let tablefiles = await fsp.readdir(tablesDir);
	console.log('tablefiles',tablefiles);
	for(const f of tablefiles){
		let p = path.join(tablesDir,f)
		console.log('path',p)
		yamlFile = fs.readFileSync(p, 'utf8');
		let o=yaml.load(yamlFile);
		Session.tables[o.id] = o;
	}
	server.listen(PORT, () => console.log('listening on port ' + PORT));
}
init();












