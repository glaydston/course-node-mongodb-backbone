define(['SocialNetView', 'text!templates/contact.html'],
    function(SocialNetView, contactTemplate){
        var contactView = SocialNetView.extend({
            addButton: false,
            removeButton: false,
            tagName: 'li',
            events: {
                "click .addButton": "addContact",
                "click .removeButton": "removeContact"
            },

            addContact: function(){
                var $responseArea = this.$('.actionArea')
                $.post('/accounts/me/contact',
                    { contactId: this.model.get('_id')},
                    function onSuccess(){
                        $responseArea.text('Contact Added')
                    },
                    function onError(){
                        $responseArea.text('Could not add contact')
                    }
                )
            },

            removeContact: function(){
                var $responseArea = this.$('.actionArea')
                $responseArea.text('Removing contact...')
                $.ajax({
                    url: '/accounts/me/contact',
                    type: 'DELETE',
                    data: {
                        contactId: this.model.get('accountId')
                    }
                }).done(function onSucess(){
                    $responseArea.text('Contact removed')
                }).fail(function onError(){
                    $responseArea.text('Could not remove contact')
                })
            },

            initialize: function(){
                // Set the addButton variable is case it has been added in the constructor
                this.options.addButton ? this.addButton = this.options.addButton : {}
                this.options.removeButton ? this.removeButton = this.options.removeButton : {}
            }

        })

        return contactView
    })