const express = require('express')
const bodyParser= require('body-parser')
const mongoose = require('mongoose');
const app = express()
const MongoClient = require('mongodb').MongoClient
const port = 9000

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public/'))
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  db.collection('entries').find().toArray((err, result) => {
    res.render('index.ejs', {entries: result})
  })
})

// app.get('/', (req, res) => {  
//   res.render('index', { title: 'The index page!' })
// });

app.get('/:name?', (req, res) => {
  let name = req.params.name
  db.collection('entries').find({
    "label": name
  }).toArray((err, result) => {
    res.render('index.ejs', {entries: result})
  })
})

app.post('/entries', (req, res) => {
  db.collection('entries').save(req.body, (err, result) => {
    res.redirect('/')
  })
})


MongoClient.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl', (err, database) => {
	db = database
	app.listen(port, () => {
		console.log(`Listening on port ${port}!`)
	})
})

mongoose.connect('mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl');

var dba = mongoose.connection;

dba.on('error', console.error.bind(console, 'connection error:'));

dba.once('open', function() {
  console.log("we're connected via mongoose")
});

var entrySchema = mongoose.Schema({
  label: String,
  header: String, 
  content: String
})

var Entry = mongoose.model('Entry', entrySchema);

var faq = new Entry({
  label: "faq",
  header: "FAQs are not useful", 
  content: "String"
})

console.log(faq.header);

faq.save(function (err, faq) {
  if (err) return console.error(err);
});

// Entry.find(function (err, entries) {
//   if (err) return console.error(err);
//   console.log(entries);
// })


