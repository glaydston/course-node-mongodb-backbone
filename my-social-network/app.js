var express = require('express')
var app = express()

app.configure(function(){
  app.set('view engine', 'jade')
  app.use(express.static(__dirname + 'public'))
})

app.get('/', function(req, res){
  res.render("index.jade", {layout:false})
})

app.get('account/authenticated', function(req, res){
  req.session.loggedIn ? res.send(200)
		:	res.send(401)
})

app.post('/register', function(req, res){
	var firstName = req.param('firstName', '')
	var lastName = req.param('lastName','')
	var email = req.param('email', '')
	var password = req.param('password', '')

	if(null == email || null == password){
		res.send(400)
		return
	}

	Account.register(email, password, firstName, lastName)
	res.send(200)
})

app.post('/login', function(req, res){
  console.log('login request')
  
  var email = req.param('email', '')
  var password = req.param('password', '')

  if(null == email || email.length < 1 
      || null == password || password.length < 1){
    res.send(400)
    return
  }

  Account.login(email, password, function(success){
    if(!success){ 
      res.send(401)
      return    
    }

    console.log('login was successful')
    res.send(200)
  })
  
})

app.post('/forgotpassword', function(req, res){
	var hostname = req.headers.host
	var resetPasswordUrl = 'http://' + hostname + 'resetPassword'
	var email = req.param('email', null)

	if( null == email, || email.length < 1){
		res.send(400)
		return			
	}

	Account.forgotPassword(email, resetPasswordUrl, function(success){
		success ? res.send(200) 
		:	/* otherwise */	res.send(400) 
	})
})

app.get('resetPassowrd', function(req, res){
	var accountId = req.param('account', null)
	res.sender('resetPassword.jade', {locals: {accountId:accountId}})
})

app.post('resetPassword', function(req, res){
	var accountId = req.param('accountId', null)
	var password = req.param('password', null)
	
	if(null != accountId && null != password){
		Account.changePassword(accountId, password)		
	}

	res.sender('resetPasswordSuccess.jade')
})


app.listen(8080)
