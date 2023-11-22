const express = require("express");
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const fs = require('fs');
const fsp = require('fs').promises;
const path = require("path");
const PORT = process.env.PORT || 3000;
const yaml = require('js-yaml');

console.log('**************\n__dirname', __dirname);
const uploadDirectory = path.join(__dirname, '..', 'y');
const configFile = path.join(uploadDirectory, 'config.yaml');
var Config = {}; // permanent app data: mem && saved on change
var Session = {}; // session ist nur fuer temp data: just mem
var Users = {}; // users logged in currently - unused as of now!
try {
	const yamlFile = fs.readFileSync(configFile, 'utf8');
	Config = yaml.load(yamlFile);
	showEvents();
} catch (error) {
	console.error('Error reading or parsing the YAML file:', error);
}

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
function isdef(x) { return x !== null && x !== undefined; }
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
function saveConfig(){	let y = yaml.dump(Config);	fs.writeFileSync(configFile, y, 'utf8');}
function showEvents() { console.log('Events', Object.keys(Config.events).length); }
//#endregion

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;
	if (!dir) { return res.status(400).json({ error: 'Directory parameter is missing' }); }
	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
		console.log('dirpath', directoryPath)
		const files = await fsp.readdir(directoryPath);
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});
app.get('/login', (req,res)=>{
	console.log('______\nquery',req.query);
	let u = req.query;
	let uname = u.name;
	if (nundef(uname)) {res.json({ message:'ERROR! missing name' });return;}
	let uconf = lookup(Config,['users',uname]);
	if (!uconf || uconf.color!=u.color) {uconf = lookupSetOverride(Config,['users',uname],u); saveConfig();}
	let usession = lookupSetOverride(Session,['users',uname],u);
	//now user is registered as well as loggedIn and with correct color!
	res.json({ session:Session,config:Config,message:`user ${uname} logged in!` });
})

app.post('/upload', (req, res) => {
	console.log(Object.keys(req.body)); //'req.body',req.body)
	const uploadedFile = req.files.image; // 'image' is the field name in the form
	uploadedFile.mv(path.join(uploadDirectory, 'img', uploadedFile.name), (err) => {
		if (err) { return res.status(500).send(err); }
		const fileSizeInBytes = uploadedFile.size;
		const fileName = uploadedFile.name;
		let [unique, ext] = fileName.split('.');
		console.log('filename', fileName)
		const fileSizeInKB = fileSizeInBytes / 1024; // KB
		const fileSizeInMB = fileSizeInKB / 1024; // MB
		console.log('!!!!', req.body.category, req.body.name);
		fs.appendFile(path.join(uploadDirectory, 'm2.yaml'), `\n${unique}:\n  cat: ${req.body.collection}\n  coll: ${req.body.collection}\n  name: ${req.body.name}\n  ext: ${ext}`, err => { if (err) console.log('error:', err); });
		res.json({
			message: 'File uploaded successfully',
			fileName: fileName,
			fileSizeInBytes: fileSizeInBytes,
			fileSizeInKB: fileSizeInKB,
			fileSizeInMB: fileSizeInMB,
		});
	});
});
app.post('/event', (req, res) => {
	const event = req.body;
	//console.log('Received data:', event);

	Config.events[event.id] = event;
	showEvents()

	try {
		// Convert the JavaScript object to a YAML string
		const yamlData = yaml.dump(Config);

		// Write the YAML string to a file
		fs.writeFileSync(path.join(uploadDirectory, 'config.yaml'), yamlData, 'utf8');
		console.log('Config file updated successfully.');
	} catch (error) {
		console.error('Error writing YAML file:', error);
	}
	// Process the received JSON object as needed
	//update this event!
	//ich sollte am server ein Config dict haben!

	res.json({ message: `event ${event.id} updated!` });
	// console.log('req',Object.keys(req.query)); //Object.keys(req.body));
	// res.json({msg:'YEAH!!!!'});
});
app.post('/save', (req, res) => {
	const body = req.body;
	const data = body.data; //some json object or base64 image data (or undef)
	const fname = isdef(body.path)?path.join(__dirname, body.path):''; // 
	const mode = body.mode;

	console.log('save:', mode, 'to', fname); //, '\n', data);
	try {
		if (mode == 'a') {
			fs.appendFileSync(fname, data, 'utf8');
		} else if (mode == 'w') {
			fs.writeFileSync(fname, data, 'utf8');
		} else if (mode == 'wi') {
			var base64Data = data.image.replace(/^data:image\/png;base64,/, "");
			fs.writeFileSync(fname, base64Data, 'base64'); //, function(err) {  console.log('ERROR img upload: '+fname);});
		} else if (mode == '_ac') {
			addKeys(data, Config);
		}	else if (mode == '_wc') {
			copyKeys(data, Config);
		} else if (mode == 'ay') {
			let di = yaml.load(fs.readFileSync(fname, 'utf8'));
			addKeys(data, di);
			let y = yaml.dump(di);
			fs.writeFileSync(fname, y, 'utf8');
		} else if (mode == 'wy') {
			let di = yaml.load(fs.readFileSync(fname, 'utf8'));
			copyKeys(data, di);
			let y = yaml.dump(di);
			fs.writeFileSync(fname, y, 'utf8');
		} else if (mode == 'as' || mode == 's') {
			lookupSet(Session,body.path.split('.'),data);
			console.log('Session',Session)
		} else if (mode == 'ws') {
			lookupSetOverride(Session,body.path.split('.'),data);
			console.log('Session',Session)
		} else if (mode == 'ac') {
			lookupSet(Config,body.path.split('.'),data);
			let y = yaml.dump(Config);
			fs.writeFileSync(configFile, y, 'utf8');
		}	else if (mode == 'wc' || mode == 'c') {
			if (data) lookupSetOverride(Config,body.path.split('.'),data);
			saveConfig();
		}
		console.log('*** success ***');
	} catch (error) {
		console.error('Error updating file:', error);
	}
	res.json({ message: `save mode:${mode} ${fname} *** successful ***`, config: Config, session: Session });
});
app.get('/load', (req, res) => {
	try {
		console.log('______\nquery',req.query);
		let params = req.query;
		let result={};
		if (params.config) result.config=Config;
		if (params.session) result.session=Session;

		//const yamlFile = fs.readFileSync('path/to/your/file.yaml', 'utf8');	const data = yaml.load(yamlFile);

		res.json(result);
	} catch (error) {
		console.error('Error reading or parsing the YAML file:', error);
	}
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));