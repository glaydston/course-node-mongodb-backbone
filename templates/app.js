var express = require('express')
var app = express()

// These commands are telling Express
// that all of its views should be drawn
// from the folder name 'views'..
app.set('view engine', 'jade')
app.set('view options', {layout: true})
app.set('views', express.static(__dirname + '/views'))

// Expecting the name of one of the stooges as input
app.get('/stooges/:name?', function(req, res){
  var name = req.params.name
  
  switch( name ? name.toLowerCase() : ''){
    case 'larry':
    case 'curly':
    case 'moe':
      res.render('stooges', {stooge: name})
      break
    default:
      next()
   }
})


// A fallback from the previous route, in case the name provided was not found
app.get('/stooges/*?', function(req, res){
  res.render('stooges', {stooge: null})
})

// A default route used to access the application’s home page
app.get('/?', function(req, res){
  res.render('index')
})

var port = 8080
app.listen(port)
console.log('Listeng on port ' + port)
