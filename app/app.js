// app.js
const node_env = process.env.NODE_ENV;
console.log(`node_env is ${node_env}`);

const app_pool = process.env.APP_POOL;
console.log(`app_pool is ${app_pool}`);


// const express = require('express')
// const app = express()

// app.get('/users', (req, res) => {
//   res.json([
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' }
//   ]);
// });

const express = require('express')
const app = express()

app.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'hello world'
  })
})

app.get('/users', (req, res) => {
  res.json([
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ])
})

app.get('/healthz', (req, res) => {
  res.json({
    status: 200,
    message: 'I am alive!'
  })
})

// app.listen(8080, () => {
//     console.log('server running on port 8080')
// })

// const args = process.argv.slice(2);
// args.forEach((value, index) => {
//   console.log(index, value);
// });


module.exports = app
