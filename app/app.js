// app.js
const release_id = process.env.RELEASE_ID;
console.log(`release_id is ${release_id}`);

const app_pool = process.env.APP_POOL;
console.log(`app_pool is ${app_pool}`);

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
    message: 'alive!'
  })
})

app.get('/release', (req, res) => {
  res.json({
    status: 200,
    message: `${release_id}`
  })
})

app.get('/pool', (req, res) => {
  res.json({
    status: 200,
    message: `${app_pool}`
  })
})

// app.get('/env', (req, res) => {
//   res.json([
//     { app_pool: `${app_pool}` },
//     { node_env: `${node_env}` }
//   ])
// })

module.exports = app
