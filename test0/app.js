const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
const cors = require('cors'); app.use(cors());

app.post('/save', (req, res) => {
  const dataURL = req.body.dataURL;
  const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
  const filePath = path.join(__dirname, 'saved_image.png');

  fs.writeFile(filePath, base64Data, 'base64', (err) => {
    if (err) {
      res.status(500).json({ message: 'Error saving file' });
    } else {
      res.json({ message: 'File saved successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
