const express = require('express') 
const bodyParser = require('body-parser') 
const MongoClient = require('mongodb').MongoClient
const app = express() 
const port = 9000

app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))

MongoClient.connect('mongodb://dannyboynyc:dd2345@ds149329.mlab.com:49329/bcl2', (err, database) => {
  db = database
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
  })
})

app.get('/', (req, res) => {
 res.sendFile(__dirname + '/index.html')
})

app.post('/entries', (req, res) => {
  db.collection('entries').save(req.body, (err, result) => {
    if (err) return console.log(err)
      console.log('saved to database')
    res.redirect('/')
  })
})
// app.get('/', (req, res) => {
//   db.collection('entries').find().toArray((err, result) => {
//     if (err) return console.log(err)
//     res.sendFile(__dirname + '/index.html')
// })
// })

// app.get('/:name?', (req, res) => {
//   let name = req.params.name
//   db.collection('entries').find({
//     "label": name
//   }).toArray((err, result) => {
//     res.render('index.ejs', {entries: result})
//   })
// })















