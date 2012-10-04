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
            bonuses : 0
        };

        //when something in player changes, store it in localStorage
        var updatePlayerStore = function() {
            var strPlayer = JSON.stringify( player );
            localStorage.setItem( "p" , strPlayer );
        };

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
            }
            if ( typeof quantity === "number" ) {
                //Question: is it worth testing to see if a decrement would drop
                //player.level below 1? Are there cards that allow this?
                player[valueType] += quantity;
                $( '#' + valueType ).find( '.display' ).html(player[valueType]);
            }
            else {
                console.log( "Error: not a valid quantity. Try using a number, genius." );
                return false;
            }
            refreshStrength();
            //no need to call updatePlayerStore b/c refreshStrength does
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
        };

        //if there's player information, offer to load it
        if ( prevPlayer !== null ) {
            //place "restore" & "delete" elements somewhere
            //restore.click => restorePlayer()
            //delete element.click => localStorage.removeItem( "p" )
            //localStorage.getItem( "p" ) will be overwritten if actions happen
            //but prevPlayer will still hold the previous player so restorePlayer is still valid
        }

        //click handlers for -/+ buttons
        //this section totally fails DRY...
        $( '#level' ).find( '.pm-button' ).first().click(
            function() {
                changeValue( 'level', -1 );
            }
        );

        $( '#level' ).find( '.pm-button' ).last().click(
            function() {
                changeValue( 'level' , 1 );
            }
        );

        $( '#bonuses' ).find( '.pm-button' ).first().click(
            function() {
                changeValue( 'bonuses' , -1 );
            }
        );

        $( '#bonuses' ).find( '.pm-button' ).last().click(
            function() {
                changeValue( 'bonuses', 1 );
            }
        );

        //contenteditable polyfill
        if ( !window.Modernizr.contenteditable ) {
            $( 'h1[contenteditable]' ).click(
                function(e){
                    var newName = prompt( "What's your name?" );
                    $( 'h1[contenteditable]' ).html( newName) ;
                    });
        }

        //combat section

        var openCombatDialog = function() {

            //fills in combat strengths, sets up in/decrement functions, adds click handler to Done button
            var setupCombat = function() {
                $( '#combat-dialog .player .display' ).html( player.level + player.bonuses );

                //TO DO: check to make sure typeof monsterStrength == 'number'?
                var monsterStrength = prompt( "What is the monster's combat strength?" );
                $( '#combat-dialog .monster .display' ).html( monsterStrength );

                //hide the combat section if Done button is clicked
                $( "#combat-done" ).click( function() {
                    $( '#combat-dialog' ).hide( 'slow' );
                });

                //setting up +/- buttons again but for monster & player
                //once again, this fails DRY horribly
                //also will present difficulties w/ multiple monsters xor players
                $( '.monster' ).find( '.pm-button' ).first().click(
                    function() {
                        $disp = $( '.monster' ).find( '.display' );
                        $disp.html(
                            parseInt( $disp.text(), 10) - 1
                        );
                    }
                );

                $( '.monster' ).find( '.pm-button' ).last().click(
                    function() {
                        $disp = $( '.monster' ).find( '.display' );
                        $disp.html(
                            parseInt( $disp.text(), 10) + 1
                        );
                    }
                );

                $( '.player' ).find( '.pm-button' ).first().click(
                    function() {
                        $disp = $( '.player' ).find( '.display' );
                        $disp.html(
                            parseInt( $disp.text(), 10) - 1
                        );
                    }
                );

                $( '.player' ).find( '.pm-button' ).last().click(
                    function() {
                        $disp = $( '.player' ).find( '.display' );
                        $disp.html(
                            parseInt( $disp.text(), 10) + 1
                        );
                    }
                );
            };

            //if combat.html isn't already loaded in the DOM, get it via AJAX
            if ( $( '#combat-dialog' ).length === 0) {
                $.get( 'combat.html' , function(r) {
                    $( r ).appendTo( '#main' );
                    setupCombat();
                });
            }

            //if we already grabbed combat.html earlier, let's just setupCombat
            else {
                $( '#combat-dialog' ).show( 'slow', setupCombat );
            }
        };

        $( '#dagger' ).click( openCombatDialog );

    }); //run on document load

} (jQuery));
