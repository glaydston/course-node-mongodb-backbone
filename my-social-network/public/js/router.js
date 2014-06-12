define(['views/index', 'views/register', 'views/login',
        'views/forgotPassword', 'views/profile', 'views/contacts',
        'views/addContact', 'models/Account', 'models/StatusCollection'],
        'models/ContactCollection',
    function(IndexView, RegisterView, LoginView, ForgotPasswordView, ProfileView,
             ContactsView, AddContactView, Account, StatusCollection,
             ContactCollection){
        var SocialRouter = Backbone.Router.extend({
            currentView: null,

            routes: {
                "addContact": "addContact",
                "index": "index",
                "login": "login",
                "register": "register",
                "forgotPassword": "forgotPassword",
                "profile/:id": "profile",
                "contacts/:id": "contacts"
            },

            changeView: function(view){
                if(null != this.currentView){
                    this.currentView.undelegateEvents()
                }
                this.currentView = view
                this.currentView.render()
            },

            index: function(){
                var statusCollection = new StatusCollection()
                statusCollection.url = 'account/me/activity'
                this.changeView(new IndexView({
                    collection: statusCollection
                }))
                statusCollection.fetch()

            },

            addContact: function() {
                this.changeView(new AddContactView());
            },

            login: function(){
                this.changeView(new LoginView())
            },

            forgotPassword: function(){
                this.changeView(new ForgotPasswordView())
            },

            register: function(){
                this.changeView(new RegisterView())
            },

            profile: function(id){
                var model = new Account({id: id})
                this.changeView(new ProfileView({model: view}))
                model.fetch()
            },

            contacts: function(id) {
                var contactId = id ? id : 'me';
                var contactsCollection = new ContactCollection();
                contactsCollection.url = '/accounts/' + contactId + '/contacts';
                this.changeView(new ContactsView({
                    collection: contactsCollection
                }));
                contactsCollection.fetch();
            }
        })

        return new SocialRouter()
    })
