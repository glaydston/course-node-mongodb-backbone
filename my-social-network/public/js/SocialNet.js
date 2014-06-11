define(['router'], function(router){
    var initialize = function(){
        checkLogin(runApplication)
    }

    var checkLogin = function(callback){
        $.ajax("/account/authenticated", {
            method: "GET",
            success: function(){
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

