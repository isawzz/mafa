const express = require('express');
const multer = require('multer');
const app = express();
const port = 3000;



// Multer configuration for storing uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads/'); // Images will be stored in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Keep the original file name
    }
});

const upload = multer({ storage: storage });

console.log('__dirname',__dirname)


app.use(express.static(__dirname + '/..')); //Serve root directory
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// app.use(express.static(__dirname)); //'public')); // Serve HTML and client-side scripts from the 'public' directory

app.post('/upload', upload.single('image'), (req, res) => {
    // The uploaded image is available at req.file
    console.log('Image received:', req.file);
    res.json({ message: 'Image uploaded successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
