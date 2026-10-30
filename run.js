const assert = require('assert');
const http = require('http');
const app = require('./app');

// Start the server
app.listen(8080, () => {
    console.log('server running on port 8080')
})