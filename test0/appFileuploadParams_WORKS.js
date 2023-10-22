const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT || 3000;

const app = express();

app.use(fileUpload());
// {
// 	createParentPath: true,
// 	useTempFiles: true,
// 	tempFileDir: '/tmp/',
// 	limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5 MB if needed
// 	debug: true,
// 	safeFileNames: true,
// 	preserveExtension: true,
// 	abortOnLimit: true,
// 	uploadTimeout: 10000, // 10 seconds upload timeout
// 	abortOnTimeout: true,
// 	responseOnTimeout: "File upload timeout"
// }));
const cors = require('cors'); app.use(cors());


app.use(express.static(path.join(__dirname, '/..'))); //Serve public directory
console.log('__dirname', __dirname)

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

// app.post('/upload', (req, res) => {
// 	console.log('req.files',req.files)
//   const uploadedFile = req.files.image; // 'image' is the field name in the form
//   const fileSizeInBytes = uploadedFile.size;
//   const fileName = uploadedFile.name;
//   const fileSizeInKB = fileSizeInBytes / 1024; // KB
//   const fileSizeInMB = fileSizeInKB / 1024; // MB
//   res.json({
//     fileSizeInBytes: fileSizeInBytes,
//     fileSizeInKB: fileSizeInKB,
//     fileSizeInMB: fileSizeInMB,
//   });
// });

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
			fileSizeInBytes: fileSizeInBytes,
			fileSizeInKB: fileSizeInKB,
			fileSizeInMB: fileSizeInMB,
		});
	});
});
	// app.post('/upload',
	//   (req, res) => {
	//     const files = req.files;
	//     Object.keys(files).forEach(key => {
	//       const filepath = path.join(__dirname, '..', 'y', files[key].name)
	// 			console.log('uploaded image',files[key].name)
	//       files[key].mv(filepath, (err) => {
	//         if (err) return res.status(500).json({ status: "error", message: err })
	//       })
	//     })
	//     return res.json({ status: 'success', message: Object.keys(files).toString() })
	//   }
	// )


	app.listen(PORT, () => console.log(`Server running on port ${PORT}`));