require.config({
  paths: {
    jQuery: '/jquery/src/jquery',
    Underscore: '/underscore/underscore',
    Backbone: '/backbone/backbone',
    text: '/js/libs/text',
    templates: '../templates'
  },
  
  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'SocialNet': ['Backbone'] 
  }
})

require(['SocialNet'], function(SociaNet){
  SocialNet.initialize() 
})
