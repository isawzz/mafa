
class SimpleDatabase {
  constructor() {
    this.data = new Map();
  }

  // Insert or update a key-value pair
  set(key, value) {
    this.data.set(key, value);
  }

  // Retrieve the value associated with a key
  get(key) {
    return this.data.get(key);
  }

  // Remove a key-value pair
  remove(key) {
    this.data.delete(key);
  }

  // Get all keys in the database
  getKeys() {
    return Array.from(this.data.keys());
  }

  // Get all values in the database
  getValues() {
    return Array.from(this.data.values());
  }

  // Get all key-value pairs in the database
  getAll() {
    return Array.from(this.data.entries());
  }
}

// Example usage:
const db = new SimpleDatabase();

// Insert data
db.set('name', 'John');
db.set('age', 25);
db.set('city', 'Example City');

// Retrieve data
console.log('Name:', db.get('name')); // Output: John
console.log('Age:', db.get('age')); // Output: 25

// Remove a key-value pair
db.remove('age');

// Get all keys
console.log('Keys:', db.getKeys()); // Output: ['name', 'city']

// Get all values
console.log('Values:', db.getValues()); // Output: ['John', 'Example City']

// Get all key-value pairs
console.log('All:', db.getAll()); // Output: [['name', 'John'], ['city', 'Example City']]



















