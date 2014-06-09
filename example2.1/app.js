var express = require('express')
var app = express()

// Expecting the name of one of the stooges as input
app.get('/stooges/:name', function(req, res){
  var name = req.params.name
  
  switch( name ? name.toLowerCase() : ''){
    case 'larry':
    case 'curly':
    case 'moe':
      res.send(name + ' is my favorite stooge.')
      break
    default:
      next()
   }
})


// A fallback from the previous route, in case the name provided was not found
app.get('/stooges/*?', function(req, res){
  res.send('no stooges listed')
})

// A default route used to access the application’s home page
app.get('/?', function(req, res){
  res.send('hello world')
})

var port = 8080
app.listen(port)
console.log('Listeng on port ' + port)
