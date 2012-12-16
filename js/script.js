// ensure $ = jQuery
// run on document load using jQuery's shorthand
(function ($) {
    $( function () {
        // Initial player stats
        var player = {
            level : 1,
            bonuses : 0,
            name : "Player"
        },

        // shorthand for parseInt
        pI = function ( string ) {
            return parseInt( string, 10 );
        },

        // with any change, update DOM, player object, & storage
        updatePlayer = function () {
            // update displays & name
            player.level = pI( $( '#level .display' ).text() );
            player.bonuses = pI( $( '#bonuses .display' ).text() );
            player.name = $( 'h2.pname' ).text();
            $( '#strength' ).find( '.display' ).html( player.level + player.bonuses );
            // update storage
            localStorage.p = JSON.stringify( player );
            // if "clear" link was hit & restore link hidden
            if ( $( '#restore:hidden' )[0] ) {
                $( '#restore' ).show();
            }
        },

        // given a jQuery Object, makes first child button increment & last button decrement
        // the .display element inside the selector
        // calls refreshPlayer to update strength display & player object
        plusMinusBtns = function ( $obj ) {
            // cache DOM lookups
            var $target = $obj, $disp = $target.find( '.display' );
            // minus button
            $target.find( 'button' ).first().click(
                function () {
                    $disp.text(
                        pI( $disp.text() ) - 1
                    );
                    updatePlayer();
                }
            );
            // plus button
            $target.find( 'button' ).last().click(
                function () {
                    $disp.text(
                        pI( $disp.text() ) + 1
                    );
                    updatePlayer();
                }
            );
        },

        // combat section
        openCombatDialog = function () {
            // these vars are shared by the 2 sub-functions below
            var monsterPrompt = "What is the monster's level?",
                needInt = "Please enter an integer.",

            // handles 1st time setup: handlers on +monster, +player, done
                initialSetup = function () {
                    var $combPlayer = $( '#combat-dialog .player' ),
                        $combMonster = $( '#combat-dialog .monster' );

                    // set up +/- buttons for monster & player
                    plusMinusBtns( $combMonster );
                    plusMinusBtns( $combPlayer );

                    // set up add monster/player buttons
                    $( '#add-monster' ).click(
                        function () {
                            $combMonster = $( '#combat-dialog .monster' );
                            monsterStrength = prompt( monsterPrompt );
                            while ( isNaN( pI( monsterStrength ) ) ) {
                                monsterStrength = prompt( needInt );
                            }
                            var monsterIndex = $combMonster.length,
                                // copy & insert 1st monster HTML but not +/- handlers
                                monsterDOM = $combMonster.first().clone( false );
                            // fill in new Monster level & apply new +/- handlers
                            $combMonster.eq( monsterIndex - 1 ).after( monsterDOM );
                            var $newMonster = $( '#combat-dialog .monster' ).eq( monsterIndex );
                            $newMonster.find( '.display' ).html(
                                pI( monsterStrength )
                            );
                            plusMinusBtns( $newMonster );
                        }
                    );

                    $( '#add-player' ).click(
                        function () {
                            var helperStrength = prompt( "What is the player's combat strength?" );
                            while ( isNaN( pI( helperStrength ) ) ) {
                                helperStrength = prompt( needInt );
                            }
                            // copy & insert first player HTML but not +/- handlers
                            var playerDOM = $combPlayer.first().clone( false );
                            // fill in helper strength & apply new +/- handlers
                            $combPlayer.after( playerDOM );
                            var $newPlayer = $( '.player' ).eq( 1 );
                            $newPlayer.find( '.display' ).html(
                                pI( helperStrength )
                            );
                            $newPlayer.find( 'h2' ).text( "Helper" );
                            plusMinusBtns( $newPlayer );
                            // can't have more than 2 helpers so hide +player
                            $( '#add-player' ).hide();
                        }
                    );

                    // shut down if Done is hit
                    $( "#combat-done" ).click(
                        function () {
                            // hide dialog
                            $( '#combat-dialog' ).hide( 'slow',
                                // when it's hidden, reset everything to standard
                                function() {
                                    var numMonsters = $( '.monster' ).length;
                                    // remove helper, show +player again
                                    $( '#combat-dialog .player' ).eq( 1 ).remove();
                                    $( '#add-player' ).show();
                                    // remove extra monsters
                                    for ( var i = 1; i < numMonsters ; i++ ) {
                                        $( '.monster' ).eq( i - 1 ).remove();
                                    }
                                }
                            );
                            // scroll to top, combat dialog has chance to be longer than page
                            window.scrollTo( window.scrollX, 0 );
                        }
                    );

                    // after we're set up, still need to runCombat
                    runCombat();
                },

                // fills in combat strengths, runs after initialCombat()
                runCombat = function () {
                    var monsterStrength = prompt( monsterPrompt ),
                        $combPlayer = $( '#combat-dialog .player' ),
                        $combMonster = $( '#combat-dialog .monster' );

                    while ( isNaN( pI( monsterStrength ) ) ) {
                        if ( !monsterStrength ) {
                            // user hit cancel, or entered nothing
                            return;
                        }
                        monsterStrength = prompt( needInt );
                    }
                    $combMonster.find( '.display' ).html( monsterStrength );

                    // fill in player's attributes
                    $combPlayer.find( '.display' ).html( player.level + player.bonuses );
                    $combPlayer.find( 'h2' ).text( player.name );

                    // at the end of runCombat, reveal the dialog
                    $( '#combat-dialog' ).show( 'slow' );
                };

            // combat dialog isn't in the DOM, load it via AJAX then do initialSetup()
            if ( $( '#combat-dialog' ).length === 0 ) {
                $.get( 'combat.html' , function ( response ) {
                    $( response ).appendTo( '#main' );
                    initialSetup();
                    }
                );
            }

            // we grabbed combat.html earlier, runCombat()
            else {
                runCombat();
            }
        },

        // open nav menu
        toggleMenu = function () {
            $( 'nav .start-hid' ).toggle( 'slow' );
        };

        // if there's player information, offer to load it
        // if ( localStorage.p !== null ) {
        //     place "restore" & "delete" elements somewhere
        //     restore.click => restorePlayer()
        //     delete element.click => localStorage.removeItem( "p" )
        //     localStorage.getItem( "p" ) will be overwritten if actions happen
        //     but prevPlayer will still hold the previous player so restorePlayer is still valid
        // }

        // expose restore/clear functionality only if localStorage is available
        if ( localStorage ) {
            // set player object to data in localStorage
            restorePlayer = function () {
                if ( localStorage.p === null ) {
                    alert( 'No data to restore!' );
                    toggleMenu();
                    $( '#restore' ).hide();
                }
                player = JSON.parse( localStorage.p );
                $( '#level .display' ).text( player.level );
                $( '#bonuses .display' ).text( player.bonuses );
                $( '#strength' ).find( '.display' ).html( player.level + player.bonuses );
                $( 'h2.pname' ).text( player.name );
                toggleMenu();
            },

            // delete player data from localStorage
            clearData = function () {
                localStorage.removeItem( 'p' );
                toggleMenu();
                $( '#restore' ).hide();
            };

            if ( localStorage.p === null ) {
                localStorage.p = JSON.stringify( player );
            }

            $( '#restore' ).removeClass( 'start-hid' );
            $( '#clear' ).removeClass( 'start-hid' );
            $( '#restore' ).click( restorePlayer );
            $( '#clear' ).click( clearData );
        }

        // handlers for player -/+ buttons
        plusMinusBtns( $( '#level' ) );
        plusMinusBtns( $( '#bonuses' ) );
        // open/close the menu
        $( 'nav a:first, #close-menu' ).click( toggleMenu );

        // contenteditable polyfill
        if ( !window.Modernizr.contenteditable ) {
            $( 'h1[contenteditable]' ).click(
                function (){
                    player.name = prompt( "What's your name?" );
                    $( 'h1[contenteditable]' ).html( player.name );
                }
            );
        }

        $( '#dagger' ).click( openCombatDialog );

    }); // run on document load

} ( jQuery ));
