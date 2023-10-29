const express = require("express");
const fileUpload = require("express-fileupload");
const fs = require('fs');
const fsp = require('fs').promises;
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '/..'))); //Serve public directory

console.log('__dirname', __dirname)

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;
	if (!dir) {		return res.status(400).json({ error: 'Directory parameter is missing' });	}
	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
		console.log('dirpath', directoryPath)
		const files = await fsp.readdir(directoryPath);
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});

const uploadDirectory = path.join(__dirname, '..', 'y');
app.post('/upload', (req, res) => {
	console.log(Object.keys(req.body)); //'req.body',req.body)
	const uploadedFile = req.files.image; // 'image' is the field name in the form
	uploadedFile.mv(path.join(uploadDirectory, uploadedFile.name), (err) => {
		if (err) { return res.status(500).send(err); }
		const fileSizeInBytes = uploadedFile.size;
		const fileName = uploadedFile.name;
		let [unique,ext]=fileName.split('.');
		console.log('filename',fileName)
		const fileSizeInKB = fileSizeInBytes / 1024; // KB
		const fileSizeInMB = fileSizeInKB / 1024; // MB
		console.log('!!!!',req.body.category,req.body.name);
		fs.appendFile(path.join(uploadDirectory, 'm2.yaml'),`\n${unique}:\n  cat: ${req.body.category}\n  name: ${req.body.name}\n  ext: ${ext}`,err=>{if (err) console.log('error:',err);});
		res.json({
			message: 'File uploaded successfully',
			fileName: fileName,
			fileSizeInBytes: fileSizeInBytes,
			fileSizeInKB: fileSizeInKB,
			fileSizeInMB: fileSizeInMB,
		});
	});
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));