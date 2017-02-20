#Session 4b

##Homework

See session-4-homework repo.

##CRUD (continued)

cd into the working directory and npm install all dependencies.

Review the connection settings.

Log into mLab.com and find your database and database user.

Add a variable with the db username and password in the connection URL 

`const mongoUrl = 'mongodb://dannyboynyc:dd2345@ds139969.mlab.com:39969/bcl'` 

(Replace it with your own.)

```
MongoClient.connect(mongoUrl, (err, database) => {...}
```

Run `nodemon app.js`

####Showing entries to users

To show the entries stored in MongoLab:

1. Get entries from MongoLab

2. Use Javascript to display the entries

We can get the entries from MongoLab by using the find method that’s available in the [collection method](https://docs.mongodb.com/manual/reference/method/js-collection/).

```js
app.get('/', (req, res) => {
  var cursor = db.collection('entries').find()
  console.log(cursor)
  res.sendFile(__dirname + '/index.html')
})
```

The find method returns a cursor (a complex Mongo Object that probably doesn’t make much sense).

This cursor object contains all entries from our database. It also contains a [bunch of other properties and methods](https://docs.mongodb.com/manual/reference/method/js-cursor/) that allow us to work with data easily. One method is the toArray method.

The `toArray` method takes callback function that allows us to perform actions on the entries we retrieved from MongoLab. Try doing a console.log() for the results and see what we get:


```js
app.get('/', (req, res) => {
  db.collection('entries').find().toArray((err, results) => {
    console.log(results)
    res.sendFile(__dirname + '/index.html')
  })
})
```

The array of entries should appear in the terminal. 

####Generate HTML to contain the entries

The standard method for outputting content fetched from a database is to use a templating engine. Some popular template engines include Jade/pug, [Moustache](https://mustache.github.io/#demo), Embedded JavaScript [(ejs)](http://www.embeddedjs.com) and Nunjucks. React and Angular offer their own templating engines - but to conclude this exercise we will use Embedded JavaScript (ejs). It’s the easiest to implement.

We use ejs by first installing it and then setting the view engine in Express to ejs.

`$ npm install ejs --save`

and in app.js:

`app.set('view engine', 'ejs')`

Let’s first create an index.ejs file within a views folder so we can start populating data.

```
mkdir views
touch views/index.ejs
```

Now, copy the contents of index.html into index.ejs and add.

```
<% for(var i=0; i<entries.length; i++) { %>
<div class="entry">
  <h2><%= entries[i].label %></h2>
  <p><%= entries[i].content %></p>
</div>
<% } %>
```

In EJS, you can write JavaScript within <% and %> tags. You can also output JavaScript as strings with the <%= and %> tags.

```
.entry {
  background: #eee;
  padding: 0.5rem;
}
```

We’re basically going to loop through the entries array and create strings with `entries[i].label` and `entries[i].content`.

The complete index.ejs file so far should be:

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test</title>
  <style>
    input, textarea {
      display: block;
      margin: 1rem;
      width: 70%;
    }
    .entry {
      background: #eee;
      padding: 0.5rem;
    }
  </style>
</head>
<body>
  <% for(var i=0; i<entries.length; i++) { %>
  <div class="entry">
    <h2><%= entries[i].label %></h2>
    <p><%= entries[i].content %></p>
  </div>
  <% } %>

  <form action="/entries" method="POST">
    <input type="text" placeholder="label" name="label">
    <input type="text" placeholder="header" name="header">
    <textarea type="text" placeholder="content" name="content"></textarea>
    <button type="submit">Submit</button>
  </form>

</body>
</html>
```

Finally, we have to render this index.ejs file when handling the GET request. Here, we’re setting the results (an array) as the entries array we used in index.ejs above.


```js
app.get('/', (req, res) => {
  db.collection('entries').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {entries: result})
  })
})
```

Now, refresh your browser and you should be able to see all entries.

##Integration with the old site

We need to 

1. edit our npm scripts to integrate nodemon

2. move the old index.html into index.ejs 

3. re-enable app.use static. 

Edit package.json to proxy the browser sync to our express port number and add nodemon to our list of currently running scripts.

```
 "scripts": {
    "watch-node-sass": "node-sass --watch scss/styles.scss --output public/css/  --source-map true",
    "start": "browser-sync start --proxy 'localhost:9000' --browser \"google chrome\"  --files 'public'",
    "boom!": "concurrently \"nodemon app.js\" \"npm run start\" \"npm run watch-node-sass\" "
  },
```

Migrate index.html into index.ejs something like the below:

```
<!DOCTYPE html>
<html lang="en">
<head>
	<head>
		<meta charset="UTF-8">
		<title>EJS Barclays Live</title>
		<link rel="stylesheet" href="/css/styles.css">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<style>
			input, textarea {
				display: block;
				margin: 1rem;
				width: 70%;
			}
			.entry {
				background: #eee;
			}
		</style>
	</head>
	<body>
		<header>
			<h1>Not on the app store!</h1>
		</header>

		<nav id="main">
			<a class="logo" href="#0"><img src="/img/logo.svg" /></a>
			<ul id="nav-links"></ul>
		</nav>

		<div class="site-wrap">
			<% for(var i=0; i<entries.length; i++) { %>
			<div class="entry">
				<h2><%= entries[i].label %></h2>
				<p><%= entries[i].content %></p>
			</div>
			<% } %>

			<form action="/entries" method="POST">
				<input type="text" placeholder="label" name="label">
				<input type="text" placeholder="header" name="header">
				<textarea type="text" placeholder="content" name="content"></textarea>
				<button type="submit">Submit</button>
			</form>
		</div>
		<script src="/js/navitems.js"></script>
		<script src="/js/main.js"></script>
	</body>
</html>
```

Change the name of index.html to something else.

Enable use.static in app.js, rename /public/index.html (otherwise express will serve it instead of index.ejs), halt nodemon, and run:

`npm run boom!`

Get one entry using parameters:

```
app.get('/:name?', (req, res) => {
  let name = req.params.name
  db.collection('entries').find({
    "label": name
  }).toArray((err, result) => {
    res.render('index.ejs', {entries: result})
  })
})
```

Try: `http://localhost:3000/watchlist`

Edit main.js to remove onload and hashchange events and main.js to remove the hashes.


##Angular as a Templating Engine

Set up `angular` folder with npm install and boom!

`<script src="https://code.angularjs.org/1.5.8/angular.js"></script>`

HTML5 introduced the `data-` [attribute](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes).

Angular uses this concept to extend html with [directives](https://www.w3schools.com/angular/angular_directives.asp) such as data-ng-app, data-ng-controller, data-ng-repeat

`<html lang="en"  data-ng-app="myApp">`

In navItems:

`var app = angular.module('myApp', []);`

App is the main Angular space and can be broken down into multiple controllers.

`<body data-ng-controller="NavController">`

```
app.controller("NavController", function( $scope ) {
  $scope.navItems = [
```

[Scope](https://docs.angularjs.org/guide/scope#!) is the glue between application controller and the view.

Comment out the navItems build script in main.js

```
const markup =
//   `<ul>
//     ${navItems.map(listItem => `<li><a href="${listItem.link}">${listItem.label}</a></li>`).join('')}
//   </ul>`;
// navLinks.innerHTML = markup;
```

Use Angular to build it out again:

```
<nav id="main">
  <a class="logo" href="#0"><img src="/img/logo.svg" /></a>
  <ul id="nav-links">
    <li data-ng-repeat="navItem in navItems">
      <a href={{navItem.link}}>{{navItem.label}}</a>
    </li>
  </ul>
</nav>
```

`{{  }}` - moustaches or handlebars are similar to JavaScript Template Strings (`${   }`). These are known as [expressions](https://docs.angularjs.org/guide/expression).

`ng-repeat` is a directive. There are [many directives](https://docs.angularjs.org/api/).

Build out the content:

```
<div ng-repeat="navItem in navItems">
  <h2>{{ navItem.label }}</h2>
  <h3>{{ navItem.header }}</h3>
</div>
```

Note - injecting html into a page is considered unsafe. Try adding `{{ navItem.content }}`

We could use:

`<div ng-bind-html="navItem.content"></div>``

Load [sanitize](https://docs.angularjs.org/api/ngSanitize):

`<script src="https://code.angularjs.org/1.5.8/angular-sanitize.min.js"></script>`

Use [injection](https://docs.angularjs.org/guide/di) to make it available to the app:

`var app = angular.module('myApp', ['ngSanitize']);`

###Details, details

Simple Angular directives:

1. ng-app − This directive starts an AngularJS Application. We use it to create [Modules](https://docs.angularjs.org/guide/module)
2. ng-init − This directive initializes application data. (We won't use it except for the simple examples below.)
3. ng-model − This directive defines the model that is variable to be used in AngularJS.
4. ng-repeat − This directive repeats html elements for each item in a collection.

```
<div class="site-wrap"  ng-init="messageText = 'Hello World!'">

<input ng-model="messageText" size="30"/>
<p>Everybody shout "{{ messageText | uppercase }}"</p>
```

This is a demonstration of [data binding](https://docs.angularjs.org/guide/databinding) and [filtering](https://docs.angularjs.org/api/ng/filter) to uppercase.

Add the data to our controller - `$scope.messageText = 'Hello World!'`

and it is still available in our view:

```
<div class="site-wrap">

<input ng-model="messageText" size="30"/>
<p>Everybody shout "{{ messageText | uppercase }}"</p>
```

Alernates 1 - using an object

`ng-init="greeting = { greeter: 'Daniel' , message: 'Hello World' }"`

```
<input type="text" ng-model="greeting.greeter" size="30"/>
<input type="text" ng-model="greeting.message" size="30"/>
{{greeting.greeter }} says "{{ greeting.message }}"
```

Alternates 2 - using ng-repeat with an array

```
<div class="site-wrap" ng-init="portfolios = ['Call of Booty', 'The Sack of the Innocents', 'Pipe and First Mate']" >

<ul>
  <li ng-repeat="portfolio in portfolios">
    {{ portfolio }}
  </li>
</ul>
```

Alernate 3 - [filtering](https://docs.angularjs.org/api/ng/filter) and ordering on an array of objects

```
<div class="site-wrap" ng-init="portfolios = [
{ name: 'Call of Booty', date: '2013-09-01' },
{ name: 'The Sack of the Innocents', date: '2014-04-15' },
{ name: 'Pipe and First Mate', date: '2012-10-01' } ]">

<p>Filter list: <input ng-model="searchFor" size="30"/></p>

<ul>
  <li ng-repeat="portfolio in portfolios | filter:searchFor | orderBy:'date' ">
  {{ portfolio.name  }}</li>
</ul>
```

ngClass:

```
<ul>
  <li ng-repeat="portfolio in portfolios |
  filter:searchFor |
  orderBy:'date'"
  ng-class="{ even: $even, odd: $odd }">
  {{ portfolio.name  }}</li>
</ul>
```

keys and values of the array:

```
<ul>
  <li ng-repeat="(key, value) in portfolios">
      <strong>{{key}}</strong> - {{value}}
  </li>
</ul>
```

##Components

test.js

```
angular.module('myApp', []);

angular.module('myApp').component('greetUser', {
    template: 'Hello, {{$ctrl.user}}!',
    controller: function GreetUserController() {
        this.user = 'world';
    }
});
```

test.html

```
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8" />
  <title>AngularJS Module</title>
  <script src="https://code.angularjs.org/1.5.8/angular.js"></script>
  <script src="test.js"></script>
</head>

<body>

  <div ng-app="myApp">
    <greet-user></greet-user>
  </div>

</body>

</html>
```


###Notes

https://github.com/expressjs/body-parser#bodyparserurlencodedoptions

http://mongoosejs.com/docs/

Homework

Go to:

`https://api.github.com/users/dannyboynyc`

Your job is to extract your username from your github api and display it on a page using Angular. You need not use Express or npm, a plain html file will do. 

Here's some code that should prove helpful:

```
app.controller("NavController", function( $scope, $http ) {

var onUserComplete = function (response){
  $scope.user = response.data
}
$http.get('https://api.github.com/users/dannyboynyc')
.then( onUserComplete )
```

`<p>{{ user.name }}</p>` 

