const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors'); // Import the CORS module
const app = express();
const port = 3000;

// Middleware for CORS and file uploads
app.use(cors()); // Enable CORS for all routes
app.use(fileUpload());

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle file upload
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.uploadedFile;
    const uploadPath = __dirname + '/uploads/' + uploadedFile.name;

    uploadedFile.mv(uploadPath, (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send('File uploaded!');
    });
});

app.options('/upload', cors()); // Enable CORS for the OPTIONS preflight request to /upload

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
