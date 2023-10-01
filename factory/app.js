const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = 3000;

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
