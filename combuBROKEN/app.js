const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");

const { fileExtLimiter, filesPayloadExists, fileSizeLimiter } = require('./server/file');

const PORT = process.env.PORT || 3000;

const app = express();

const cors = require('cors'); app.use(cors()); // app.use(cors({origin:'*'}));

app.use(express.static(path.join(__dirname, '/..'))); //Serve public directory
console.log('__dirname',__dirname)

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post('/upload',
    fileUpload({ createParentPath: true }),
    filesPayloadExists,
    fileExtLimiter(['.png', '.jpg', '.jpeg']),
    fileSizeLimiter,
    (req, res) => {
        const files = req.files;
        //console.log(files);
				console.log(Object.keys(req).join('\n'));
				console.log('____________ BODY')
				console.log(Object.keys(req.body).join('\n'));
				console.log('____________ FILES');
				console.log(Object.keys(req.files).join('\n'));

        Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, 'files', files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)




app.listen(PORT, () => console.log(`Server running on port ${PORT}`));