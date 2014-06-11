module.exports = function(config, mongoose, nodemailer){
  var crypto = require('crypto')

  var AccountSchema = new mongoose.Schema({
    email:    { type: String, unique: true},
    password: { type: String},
    name:     {
      first:  { type: String },
      last:   { type: String }
    },
    birthday: {
      day:    { type: Number, min:1, max: 31, required: false },
      month:  { type: Number, min:1, max:12, required: false },
      year:   { type: Number }    
    },
    photoUrl:   { type: String },
    biography:  { type: String }
  }) 

  var Account = mongoose.model('Account', AccountSchema)

  var registerCallback = function(err){
    return err ? console.log(err)
           : console.log('Account was created')    
  }

  var changePassword = function(accountId, newpassword){
    var shaSum = crypto.createHash('sha256')
    shaSum.update(newpassword)
    var hashedPassword = shaSum.digest('hex')
    Account.update({_id:accountId}, {$set : {password : hashedPassword}}, {upsert: false}, function changePasswordCallback(err){
      console.log('Change password done for account ' + accountId)    
    })  
  }

  var forgotPassword = function(email, resetPasswordUrl, callback){
    var user = Account.findOne({email: email}, function findAccount(err, doc){
      if(err){
        // Email address is not valid user
        callback(false)
      } else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail)
        resetPasswordUrl += '?account='+ doc._id
        smtpTransport.sendMail({
          from: 'thisapp@example.com',
          to: doc.email,
          subject: 'SocialNet Password Request',
          text: 'Click here to reset your password: ' + resetPasswordUrl        
        }, function forgotPasswordResult(err){
              return err ? callback(false) : callback(true)
        })
      }            
    })
  }

  var login = function(email, password, callback){
    var shaSum = crypto.createHash('sha256')
    shaSum.update(password)
    Account.findOne({email: email, password: shaSum.digest('hex')}, function(err, doc){callback(null!=doc})
  }

  var register = function(email, password, fisrName, lastName){
    var shaSum = crypto.createHash('sha256')
    shaSum.update(password)
  
    console.log('Registering ' + email)
    var use = new Account({
      email: email,
      name: {
        fisrt: firstName,
        last: lastName       
      },
      password: shaSum.digest('hex')
    })    
    user.save(registerCallbak)
    console.log('Save command was sent')
  } 

}
