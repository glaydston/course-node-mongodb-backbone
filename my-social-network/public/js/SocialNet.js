define(['router', 'SocialNetSockets'], function(router, socket){
    var initialize = function(){
        socket.initialize(router.socketEvents)
        checkLogin(runApplication)
    }

    var checkLogin = function(callback){
        $.ajax("/account/authenticated", {
            method: "GET",
            success: function(data){
                router.socketEvents.trigger('app:loggedin', data)
                return callback(true)
            },
            error: function(){
                return callback(false)
            }
        })
    }

    var runApplication = function(authenticated){
        window.location.hash = !authenticated ? 'login' : 'index'
        Backbone.history.start()
    }

    return {
        initialize: initialize
    }
})

