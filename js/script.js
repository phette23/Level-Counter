//ensure use of the $ in jQuery
//just in case some script in the User Agent, e.g. browser extension, is doing something stupid
//run code on document load using jQuery's shorthand for that
(function($) {
    $( function() {
        //Consider keeping player's name in a variable
        //then using Remy Sharp's "save contentEditable" script: http://jsbin.com/owavu3
        //Initial player stats
        var player = {
            level : 1,
            bonuses : 0,
            races : ['Human'],
            classes : ['None'],
            "super-munchkin" : false,
            "half-breed" : false
        };

        //when something in player changes, store it in localStorage
        var updatePlayerStore = function() {
            var strPlayer = JSON.stringify( player );
            localStorage.setItem( "p" , strPlayer );
        }

        //each time combat strength changes, update the DOM
        var refreshStrength = function() {
            $( '#strength' ).find( '.display' ).html( player.level + player.bonuses );
            updatePlayerStore();
        };

        //when level or bonus changes, update player object & call refreshStrength
        var changeValue = function( valueType, quantity ) {
            if ( !player.hasOwnProperty( valueType ) ) {
                console.log( "Error: not a valid value. Use either level or bonuses." );
                return false;
            };
            if ( typeof quantity === "number" ) {
                //Question: is it worth testing to see if a decrement would drop
                //player.level below 1? Are there cards that allow this?
                player[valueType] += quantity;
                $( '#' + valueType ).find( '.display' ).html(player[valueType]);
            }
            else {
                console.log( "Error: not a valid quantity. Try using a number, genius." );
                return false;
            };
            refreshStrength();
            //no need to call updatePlayerStore - refreshStrength does
        };

        //cache the localStorage lookup
        var prevPlayer = localStorage.getItem( "p" );

        var restorePlayer = function() {
            player = prevPlayer;
            //wow these next two lines feel silly...either rename function or find out why it's ridiculous
            //maybe refactor refreshStrength to take 2 parameters (level, bonus) & then handle all .html() updates
            changeValue( 'strength', 0);
            changeValue( 'level', 0);
            refreshStrength();
            //need to make HTML reflect the new player object (e.g. in races/classes/super-munchkin/half-breed)
        };

        //if there's player information, offer to load it
        if ( prevPlayer !== null ) {
            //place "restore" & "delete" elements somewhere
            //restore.click => restorePlayer()
            //delete element.click => localStorage.removeItem( "p" )
            //localStorage.getItem( "p" ) will be overwritten if actions happen
            //but prevPlayer will still hold the previous player so restorePlayer is still valid
        }

        //jQuery click handlers for -/+ buttons
        //this section totally fails DRY...
        $( '#level' ).find( '.pm-button' ).first().click(
            function(e) {
            	changeValue( 'level', -1 );
            }
        );

        $( '#level' ).find( '.pm-button' ).last().click(
            function(e) {
            	changeValue( 'level' , 1 );
            }
        );

        $( '#bonuses' ).find( '.pm-button' ).first().click(
            function(e) {
            	changeValue( 'bonuses' , -1 );
            }
        );

        $( '#bonuses' ).find( '.pm-button' ).last().click(
            function(e) {
            	changeValue( 'bonuses', 1 );
            }
        );

        //change handlers for select inputs
        //races
        $( '#race1' ).change( function() {
            player.races[0] = $(this).val();
            updatePlayerStore();
        });
        $( '#race2' ).change( function() {
            player.races[1] = $(this).val();
            updatePlayerStore();
        });

        //classes
        $( '#class1' ).change( function() {
            player.classes[0] = $(this).val();
            updatePlayerStore();
        });
        $( '#class2' ).change( function() {
            player.classes[1] = $(this).val();
            updatePlayerStore();
        });

        //1st input is half-breed
        $('input').first().change(
            function() {

                player['half-breed'] = !( player['half-breed'] ); //invert h-b state

                if (player['half-breed']) { //player becomes h-b
                    $( 'label[for="race2"]' ).fadeIn( 'slow' );
                    $( '#race2' ).fadeIn( 'slow' );
                }

                else { //player has lost h-b
                    $('label[for="race2"]').hide();
                    $('#race2').attr('value','Human').hide();
                    delete player.races[1];
                }

                //either way, updatePlayerStore
                updatePlayerStore();

            });

        //2nd input is super-munchkin
        $( 'input' ).last().change(
                function() {

                player['super-munchkin'] = !( player['super-munchkin'] ); //invert s-m state
                if ( player['super-munchkin'] ) {
                    $( '#class2' ).fadeIn( 'slow' ); //player becomes s-m
                    $( 'label[for="class2"]' ).fadeIn( 'slow' );
                }

                else { //player has lost s-m
                    $( '#class2' ).attr( 'value', '' ).hide();
                    $( 'label[for="class2"]' ).hide();
                    delete player.classes[1];
                }

                //either way, updatePlayerStore
                updatePlayerStore();

            });

        //contenteditable polyfill
        if ( !window.Modernizr.contenteditable ) {
            $( 'h1[contenteditable]' ).click(
                function(e){
                    var newName = prompt( "What's your name?" );
                    $( 'h1[contenteditable]' ).html( newName) ;
                    });
        }

        //annoying but necessary?
        //window.onbeforeunload = function() {
            //only annoy the user if in fact there is data stored
        //    if ( !(player.level === 1 && player.bonuses === 0
        //        && player.races.length === 0 && player.classes.length === 0)) {
        //    return "All game data will be lost. Are you sure you want to navigate away from the page?";
        //    }
        //};

    }); //run on document load

} (jQuery));