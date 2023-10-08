const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
console.log('directory', __dirname)

// Route to fetch filenames from a directory
app.get('/filenames', async (req, res) => {
	const { directory: dir } = req.query;

	if (!dir) {
		return res.status(400).json({ error: 'Directory parameter is missing' });
	}

	try {
		const directoryPath = dir.startsWith('C:') ? dir : path.join(__dirname, dir);
		console.log('dirpath', directoryPath)
		const files = await fs.readdir(directoryPath);
		res.json({ files });
	} catch (err) {
		res.status(500).json({ error: 'Error reading directory', details: err.message });
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
