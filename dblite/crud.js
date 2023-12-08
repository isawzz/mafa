const sqlite3 = require('sqlite3');

// Step 1: Open a SQLite database connection
const db = new sqlite3.Database('users.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});

// Step 2: Create a users table
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
  )
`);

// CRUD operations

// Step 3: Create (Insert) a new user
function createUser(name, email) {
  const insertQuery = 'INSERT INTO users (name, email) VALUES (?, ?)';
  const values = [name, email];

  db.run(insertQuery, values, function (err) {
    if (err) {
      console.error('Error creating user:', err.message);
    } else {
      console.log(`User created with ID: ${this.lastID}`);
    }
  });
}

// Step 4: Read (Get) all users
function getAllUsers() {
  const selectQuery = 'SELECT * FROM users';

  db.all(selectQuery, (err, rows) => {
    if (err) {
      console.error('Error getting users:', err.message);
    } else {
      console.log('All users:', rows);
    }
  });
}

// Step 5: Read (Get) a user by ID
function getUserById(userId) {
  const selectQuery = 'SELECT * FROM users WHERE id = ?';

  db.get(selectQuery, [userId], (err, row) => {
    if (err) {
      console.error('Error getting user by ID:', err.message);
    } else {
      console.log('User by ID:', row);
    }
  });
}

// Step 6: Update a user by ID
function updateUser(userId, newName) {
  const updateQuery = 'UPDATE users SET name = ? WHERE id = ?';

  db.run(updateQuery, [newName, userId], function (err) {
    if (err) {
      console.error('Error updating user:', err.message);
    } else {
      console.log(`User updated: ${this.changes} row(s) affected`);
    }
  });
}

// Step 7: Delete a user by ID
function deleteUser(userId) {
  const deleteQuery = 'DELETE FROM users WHERE id = ?';

  db.run(deleteQuery, [userId], function (err) {
    if (err) {
      console.error('Error deleting user:', err.message);
    } else {
      console.log(`User deleted: ${this.changes} row(s) affected`);
    }
  });
}

// Example usage
createUser('John Doe', 'john@example.com');
createUser('Jane Doe', 'jane@example.com');

getAllUsers();

getUserById(1);

updateUser(1, 'Updated John Doe');

deleteUser(2);

getAllUsers();

// Step 8: Close the SQLite database connection
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Closed the SQLite database connection');
  }
});
