const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = 3000;

// Specify the path of the directory you want to access
const directoryPath = __dirname;
console.log(__dirname);

function listEmojiFiles(){
	let dir = 'C:\\xampp\\htdocs\\mafa\\assets\\img\\emo';
	fs.readdir(dir, (err, files) => {
		if (err) {
			console.log('Error reading directory');
		} else {
			console.log('files',files.length)
			for(let i=0;i<10;i++) console.log('i',i,files[i])
			const yamlData = yaml.dump({ files: files });

			// Write YAML data to files.yaml
			fs.writeFile('files.yaml', yamlData, (err) => {
					if (err) {
							console.error('Error writing to files.yaml:', err);
					} else {
							console.log('List of files saved to files.yaml');
					}
			});
	
		}
	});


}
//listEmojiFiles();

// Endpoint to get data from the YAML file
app.get('/data', (req, res) => {
	res.json(data);
});

// Endpoint to get a list of files in the specified directory
const dir_diversity="C:\\xampp\\htdocs\\mafa\\assets_old\\assets\\img\\emoji\\diversity";
app.get('/files', (req, res) => {
	fs.readdir(dir_diversity, (err, files) => {
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
