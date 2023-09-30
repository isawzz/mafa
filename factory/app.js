const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = 3000;

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

	return [union, intersection ];
}

// Read the .yaml file into a dictionary
const data = {};
const allSyms = yaml.load(fs.readFileSync('allSyms.yaml', 'utf8'));
//facodes und gamecodes sind unicode hex chars, iconchars hat alle
const facodes = yaml.load(fs.readFileSync('facodes.yaml', 'utf8'));
const gamecodes = yaml.load(fs.readFileSync('gamecodes.yaml', 'utf8'));
const iconchars = yaml.load(fs.readFileSync('iconchars.yaml', 'utf8'));
const m = yaml.load(fs.readFileSync('m.yaml', 'utf8'));
const gsg = yaml.load(fs.readFileSync('symGSG.yaml', 'utf8'));
//console.log('m',m.emoji.nature)
let gkeys = Object.keys(gamecodes);
let fkeys = Object.keys(facodes);
let ikeys = Object.keys(iconchars);
let skeys = Object.keys(allSyms);
console.log('g',Object.keys(gamecodes).length);
console.log('f',Object.keys(facodes).length);
console.log('i',Object.keys(iconchars).length);
console.log('s',Object.keys(allSyms).length);

const di={
	g:{di:gamecodes, keys:Object.keys(gamecodes),vals:Object.values(gamecodes)},
	f:{di:facodes, keys:Object.keys(facodes),vals:Object.values(facodes)},
	i:{di:iconchars, keys:Object.keys(iconchars),vals:Object.values(iconchars)},
	s:{di:allSyms, keys:Object.keys(allSyms),vals:Object.values(allSyms)},
}
//console.log('gc',di.g.di)
let arr='gfis';
for(let i=0;i<arr.length;i++){
	for(let j=i+1;j<arr.length;j++){
		let di1=di[arr[i]].di;
		let di2=di[arr[j]].di;
		let [uni, inter] = computeUnionAndIntersection(di1,di2);
		//console.log('uni',uni);
		console.log('inter',arr[i],arr[j],Object.keys(inter).length);
		//break;
	}
	//break;
}
console.log('*TEST DONE*')

// Specify the path of the directory you want to access
const directoryPath = __dirname;

// Endpoint to get data from the YAML file
app.get('/data', (req, res) => {
	res.json(data);
});

// Endpoint to get a list of files in the specified directory
app.get('/files', (req, res) => {
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			res.status(500).send('Error reading directory');
		} else {
			res.json(files);
		}
	});
});

// Start the Express server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
