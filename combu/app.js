const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const fs = require('fs');
const fsp = require('fs').promises;
const path = require("path");
const PORT = process.env.PORT || 3000;
const yaml = require('js-yaml');

//#region crypto
const crypto = require('crypto');

// Generate key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
	modulusLength: 2048, // You can adjust the modulus length based on your security requirements
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

//console.log('Public Key:', publicKey);
//console.log('Private Key:', privateKey);
//console.log('...keys generated')

// Function to decrypt data using Node.js crypto module
function decryptData(encryptedData, privateKey) {
	const privateKeyBuffer = Buffer.from(privateKey, 'base64');
	const decryptedBuffer = crypto.privateDecrypt(
		{ key: privateKeyBuffer, passphrase: '' }, // Use a passphrase if your private key is encrypted
		Buffer.from(encryptedData, 'base64')
	);

	return decryptedBuffer.toString('utf8');
}

// Example: Decrypt data received from the client
// const encryptedDataFromClient = '...'; // Replace with the actual encrypted data received from the client
// const privateKey = '...'; // Replace with your actual private key
// const decryptedData = decryptData(encryptedDataFromClient, privateKey);
// console.log('Decrypted Data:', decryptedData);

// Save the decrypted data or perform other operations as needed

//#endregion

//console.log('**************\n__dirname', __dirname);
const uploadDirectory = path.join(__dirname, '..', 'y');
const configFile = path.join(uploadDirectory, 'config.yaml');
var Session = {}; // session ist nur fuer temp data: just mem

const app = express();
app.use(bodyParser.json({ limit: '200mb' })); //works!!!
//app.use(express.json({ limit: '200mb' }));  //doesn't work
app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '..'))); //Serve public directory

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
async function getFiles(dir) {
	const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
	//console.log('dirpath', directoryPath)
	const files = await fsp.readdir(directoryPath);
	return files;

}
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
function saveConfig() {
	let y = yaml.dump(Session.config); fs.writeFileSync(configFile, y, 'utf8');
}
function saveUser(uname) {
	let p = path.join(uploadDirectory, 'users', uname + '.yaml');
	let y = yaml.dump(Session.users[uname]); fs.writeFileSync(p, y, 'utf8');
}
//#endregion

//#region sqlite3
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database(path.join(uploadDirectory,'example.db'), (err) => {});
//CREATE READ UPDATE DELETE CRUD
//#endregion

app.get('/user', (req, res) => {
	let params = req.query;
	console.log('==> get user:\n params', params)
	let data = lookup(Session, ['users', params.user]);
	//console.log(data)
	res.json(data);
});
app.get('/config', (req, res) => {
	console.log('==> get config')
	res.json(Session.config);
});
app.get('/session', (req, res) => {
	console.log('==> get session')
	res.json(Session);
});
app.post('/postUser', (req, res) => {
	let name = req.body.name;
	let data = req.body;
	console.log('<== post user')
	//console.log('data', data)
	let fname = path.join(uploadDirectory, 'users', name + '.yaml');
	lookupSetOverride(Session, ['users', name], data);
	let y = yaml.dump(data);
	fs.writeFileSync(fname, y, 'utf8');
	res.json(data);
});
app.post('/postConfig', (req, res) => {
	//body is supposed to be serverdata.
	console.log('<== post config')
	let newConfig = req.body;
	let oldConfig = Session.config;
	Session.config = deepMerge(oldConfig, newConfig);
	let y = yaml.dump(Session.config);
	fs.writeFileSync(configFile, y, 'utf8');
	res.json(Session.config);
});

//#region socket io
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origins: '*', } });//live-server: brauch ich cors!
const UserByClientId={};
io.on('connection', (client) => {
	//handle_connect(client.id);
	//client.emit('message','hello')
	client.on('login', x=>handle_login(x,client.id));
	client.on('message', handle_message);
	client.on('update', handle_update);
	client.on('disconnect', handle_disconnect); // ()=>handle_disconnect(socket.id));
});
function handle_connect(id) { console.log('connected', id); io.emit('message', 'someone logged in!'); }
function handle_disconnect(x) { console.log('io.disconnected', x); io.emit('message', x); }
function handle_login(x,id) { 
	console.log('login:', x,id); 
	UserByClientId[x] = id;
	io.emit('message', `${x} logged in!`); 
}
function handle_message(x) { console.log('got message', arguments); io.emit('message', x); }
function handle_update(x) { console.log('got update', x); io.emit('update', x); }
//#endregion



async function init() {
	const yamlFile = fs.readFileSync(configFile, 'utf8');
	Session.config = yaml.load(yamlFile);
	let userfiles = await getFiles('../y/users');
	Session.users = {};
	for (const fname of userfiles) {
		let uname = fname.substring(0, fname.length - 5);
		// console.log('uname',uname);
		let p = path.join(uploadDirectory, 'users', fname);
		//console.log('path',p)
		let f = fs.readFileSync(p, 'utf8');
		Session.users[uname] = yaml.load(f);
	}
	server.listen(PORT, () => console.log('listening on port ' + PORT));	
	//app.listen(PORT, () => console.log(`Server on port ${PORT}`));
}
init();

