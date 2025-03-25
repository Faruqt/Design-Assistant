const fs = require('fs');
const path = require('path');

const jsonString = fs.readFileSync(path.resolve(__dirname, '../src/data.json'), 'utf8');

const jsonObjects = JSON.parse(jsonString);

// write to a new file named data.js
fs.writeFileSync(path.resolve(__dirname, '../src/data.js'), `export default ${JSON.stringify(jsonObjects)}`);