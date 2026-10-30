// const express = require('express')
// const app = express()



// app.get('/users', (req, res) => {
//   res.json([
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' }
//   ]);
// });




const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "hello world"
    })
})


app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ]);
});


// app.listen(8080, () => {
//     console.log('server running on port 8080')
// })

module.exports = app;