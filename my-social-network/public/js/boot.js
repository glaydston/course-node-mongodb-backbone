require.config({
    paths: {
        jQuery: '/jquery/src/jquery',
        Underscore: '/underscore/underscore',
        Backbone: '/backbone/backbone',
        text: '/js/libs/text',
        templates: '../templates',
        Sockets: '/socket.io/socket.io'
    },

    shim: {
        'Backbone': ['Underscore', 'jQuery'],
        'SocialNet': ['Backbone']
    }
})

require(['SocialNet'], function(SocialNet){
    SocialNet.initialize()
})
