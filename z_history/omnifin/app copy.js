
const sqlite3 = require('sqlite3').verbose();

// Open a database connection
let db = new sqlite3.Database(':memory:', (err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.log('Connected to the in-memory SQLite database.');
	}
});

// Create a table
db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT
)`, (err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.log('Table created.');
	}
});

// Insert a row
db.run(`INSERT INTO users (name, email) VALUES (?, ?)`, ['Alice', 'alice@example.com'], function (err) {
	if (err) {
		console.error(err.message);
	} else {
		console.log(`A row has been inserted with rowid ${this.lastID}`);
	}
});

// Query the table
db.all(`SELECT * FROM users`, [], (err, rows) => {
	if (err) {
		throw err;
	}
	rows.forEach((row) => {
		console.log(row);
	});
});

// Close the database connection
db.close((err) => {
	if (err) {
		console.error(err.message);
	} else {
		console.log('Closed the database connection.');
	}
});

