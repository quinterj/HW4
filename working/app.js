const express = require('express') 
const bodyParser = require('body-parser') 
const MongoClient = require('mongodb').MongoClient
const app = express() 
const port = 9000

// EXPRESS STATIC FILES
// app.use(express.static('public'))

app.use(bodyParser.urlencoded({extended: true}))


MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {
   if (err) return console.log(err)
    db = database
  app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
  })
})

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

// EXAMPLE - VIEW FORM CONTENTS (object) IN THE REQUEST BODY
// app.post('/entries', (req, res) => {
//   let payload = req.body
//   console.log(typeof payload)
//   res.redirect('/')
// })

app.post('/entries', (req, res) => {
  db.collection('entries').save(req.body, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

// EXAMPLE - REQUEST PARAMETERS
// app.get('/entry/:name?/:link?', function(req, res){
// 	let name = req.params.name;
// 	let hashlink = req.params.link;
// 	res.send(`
// 		<h1>${name}</h1>
// 		<p>Commentary on ${hashlink} will go here.</p>
// 		`)
// })

// EXAMPLE - START EXPRESS
// app.listen(port, function () {
// 	console.log(`Listening on port ${port}!`)
// })
















