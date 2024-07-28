const express = require('express');
const app = express();
const port = 3000;
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const fs = require('fs');
const sax = require('sax');
const xmlFile = 'enmini.xml';
//const xmlFile = 'enwikivoyage-20240220-pages-meta-current.xml';

const pages = {};
const saxParser = sax.createStream(true);
//fs.createReadStream(xmlFile).pipe(saxParser);
const xmlStream = fs.createReadStream(xmlFile);

let shouldStop = false;
let parsingComplete = false;
var Counter = 0;
console.log('________')

saxParser.on('opentag', (node) => {
	if (node.name === 'page' && Counter>10) {
			shouldStop = true;
			xmlStream.destroy(); // Stop the stream
	}
});
saxParser.on('error', (error) => {
	console.error('Error parsing XML with SAX:', error);
	xmlStream.destroy(); // Ensure the stream stops on error
});

xmlStream.pipe(saxParser);

xmlStream.on('close', () => {
	console.log('XML stream closed');
});

saxParser.on('end', () => {
	console.log('Parsing ended');
});

// let currentPage = null;
// let currentNode = null;

// parser.ontext = function (text) {
// 	Counter++;
// 	if (Counter > 3) { parser.write('<book><title>My Book</title><author>John Doe</author></book>').close(); return; } //parser.close(); return; }
// 	console.log('Text:', text.substring(0, 10));
// };

// parser.onopentag = function (tag) {
// 	console.log('Open tag:', tag.name);
// 	//console.log('Attributes:', tag.attributes);
// };

// parser.onclosetag = function (tag) {
// 	//console.log('Close tag:', tag);
// };

// parser.onend = function () {
// 	console.log('Parsing completed.');
// };

// parser.on('opentag', node => {
// 	if (Counter > 10) { parser.emit('end'); return; }
// 	console.log(parser.)
// 	if (node.name === 'page') {
// 		currentPage = '';
// 		currentNode = 'page';
// 	}
// });

// // parser.on('text', text => {
// // 	if (Counter > 10) { parser.emit('end'); return }
// // 	if (!currentPage) currentPage = {};
// // 	currentPage.text = text;
// // });

// parser.on('closetag', tagName => {
// 	if (Counter > 10) { parser.emit('end'); return; }
// 	if (tagName === 'page') {
// 		pages['_' + Counter++] = currentPage;
// 		currentPage = null;
// 	}
// 	currentNode = null;
// });

// parser.on('error', error => {
// 	console.error('Error parsing XML:', error);
// });

// parser.on('end', () => {
// 	parsingComplete = true;
// 	console.log('Parsing complete', pages._0);
// });

app.get('/city', async (req, res) => {
	if (parsingComplete) res.json(pages); else res.json('wait...')
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});
