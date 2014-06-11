module.exports = function(config, mongoose, Status, nodemailer){
    var crypto = require('crypto')

    var Status = new mongoose.Schema({
        name: {
            firstName: { type: String},
            lastName : { type: String}
        },

        status: { type: String}

    })

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
        biography:  { type: String },
        status: [Status],
        activity: [Status]
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
        Account.findOne({email: email, password: shaSum.digest('hex')}, function(err, doc){callback(null!=doc)})
    }

    var findById = function(accountId, callback){
        Account.findOne({_id: accountId}, function(err, doc){
            callback(doc)
        })
    }

    var findByString = function(searchStr, callback){
        var searchRegex = new RegExp(searchStr, 'i')
        Account.find({
            $or: [
                {'name.full': {$regex: searchRegex}},
                { email: {$regex: searchRegex}}
            ]
        }, callback)
    }

    var register = function(email, password, fisrName, lastName){
        var shaSum = crypto.createHash('sha256')
        shaSum.update(password)

        console.log('Registering ' + email)
        var use = new Account({
            email: email,
            name: {
                first: firstName,
                last: lastName
            },
            password: shaSum.digest('hex')
        })
        user.save(registerCallback)
        console.log('Save command was sent')
    }


    var addContact = function(account, addContact){
        contact = {
            name: addContact.name,
            accountId: addContact.accountId,
            added: new Date(),
            updated: new Date()
        }

        account.contacts.push(contact)
        account.save(function(err){
            err ? console.log('Error saving account: ' + err) : {}
        })

    }

    return {
        findById: findById,
        findByString: findByString,
        addContact: addContact,
        register: register,
        forgotPassword: forgotPassword,
        changePassword: changePassword,
        login: login,
        Account: Account
    }

}
