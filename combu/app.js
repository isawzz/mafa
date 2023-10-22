const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(fileUpload());
const cors = require('cors'); app.use(cors());
app.use(express.static(path.join(__dirname, '/..'))); //Serve public directory

console.log('__dirname', __dirname)

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

const uploadDirectory = path.join(__dirname, '..', 'y');
app.post('/upload', (req, res) => {
	const uploadedFile = req.files.image; // 'image' is the field name in the form
	uploadedFile.mv(path.join(uploadDirectory, uploadedFile.name), (err) => {
		if (err) { return res.status(500).send(err); }
		const fileSizeInBytes = uploadedFile.size;
		const fileName = uploadedFile.name;
		const fileSizeInKB = fileSizeInBytes / 1024; // KB
		const fileSizeInMB = fileSizeInKB / 1024; // MB
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