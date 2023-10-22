const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

//#region express-fileupload
//const { fileExtLimiter, filesPayloadExists, fileSizeLimiter } = require('./server/file');
// const path = require("path")
const MB = 5; // 5 MB 
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

function fileExtLimiter(allowedExtArray) {
	return (req, res, next) => {
		const files = req.files

		const fileExtensions = []
		Object.keys(files).forEach(key => {
			fileExtensions.push(path.extname(files[key].name))
		})

		// Are the file extension allowed? 
		const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext.toLowerCase()))

		if (!allowed) {
			const message = `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replaceAll(",", ", ");

			return res.status(422).json({ status: "error", message });
		}

		next()
	}
}
function filesPayloadExists (req, res, next) {
	if (!req.files) return res.status(400).json({ status: "error", message: "Missing files" })

	next()
}
function fileSizeLimiter(req, res, next) {
	const files = req.files

	const filesOverLimit = []
	// Which files are over the limit?
	Object.keys(files).forEach(key => {
		if (files[key].size > FILE_SIZE_LIMIT) {
			filesOverLimit.push(files[key].name)
		}
	})

	if (filesOverLimit.length) {
		const properVerb = filesOverLimit.length > 1 ? 'are' : 'is';

		const sentence = `Upload failed. ${filesOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB.`.replaceAll(",", ", ");

		const message = filesOverLimit.length < 3
			? sentence.replace(",", " and")
			: sentence.replace(/,(?=[^,]*$)/, " and");

		return res.status(413).json({ status: "error", message });

	}

	next()
}


//module.exports = { fileExtLimiter, filesPayloadExists, fileSizeLimiter};
//#endregion

const PORT = process.env.PORT || 3000;

const app = express();

const cors = require('cors'); app.use(cors());

app.use(express.static(path.join(__dirname, '/..'))); //Serve public directory
console.log('__dirname', __dirname)

app.get("/", (req, res) => { res.sendFile(path.join(__dirname, "index.html")); });

app.post('/upload',
  fileUpload({ createParentPath: true }),
  filesPayloadExists,
  fileExtLimiter(['.png', '.jpg', '.jpeg']),
  fileSizeLimiter,
  (req, res) => {
    const files = req.files;
    Object.keys(files).forEach(key => {
      const filepath = path.join(__dirname, '..', 'y', files[key].name)
			console.log('uploaded image',files[key].name)
      files[key].mv(filepath, (err) => {
        if (err) return res.status(500).json({ status: "error", message: err })
      })
    })
    return res.json({ status: 'success', message: Object.keys(files).toString() })
  }
)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));