
// ensure $ = jQuery
// run on document load using jQuery's shorthand
var MunchkinCounter = (function ($) {
    // Initial player stats
    var player = {
        level : 1,
        bonuses : 0,
        name : "Player"
    },

    // cache common DOM lookups
    $levelDisplay = $( '#level .display' ),
    $bonusesDisplay = $( '#bonuses .display' ),
    $playerName = $( 'h2.pname' ),
    $strengthDisplay = $( '#strength' ).find( '.display' ),
    $menu = $( 'nav .menu-items' ),
    $restoreBtn = $( '#restore' ),
    $clearBtn = $( '#clear' ),

    // shorthand for parseInt
    pI = function ( string ) {
        return parseInt( string, 10 );
    },

    // with any change, update DOM, player object, & storage
    updatePlayer = function () {
        // update displays & name
        player.level = pI( $levelDisplay.text() );
        player.bonuses = pI( $bonusesDisplay.text() );
        player.name = $playerName.text();
        $strengthDisplay.html( player.level + player.bonuses );
        // update storage
        localStorage.p = JSON.stringify( player );
        // if "clear" link was hit & restore link hidden
        if ( $restoreBtn.is( ':hidden' ) ) {
            $restoreBtn.show();
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
            numMonsters = 1;

        // handles 1st time setup: handlers on +monster, +player, done
            initialSetup = function () {
                var $combPlayer = $( '#combat-dialog .player' ),
                    $combMonster = $( '#combat-dialog .monster' ),
                    $addPlayerBtn = $( '#add-player' );
                // set up +/- buttons for monster & player
                plusMinusBtns( $combMonster );
                plusMinusBtns( $combPlayer );

                // set up add monster/player buttons
                $( '#add-monster' ).click(
                    function () {
                        var newMonsterStrength = prompt( monsterPrompt );
                        while ( isNaN( pI( newMonsterStrength ) ) ) {
                            newMonsterStrength = prompt( needInt );
                        }
                        // copy & insert 1st monster HTML but not +/- handlers
                        var monsterDOM = $combMonster.clone( false );
                        // fill in new Monster level & apply new +/- handlers
                        $( '#combat-dialog .monster').eq( numMonsters - 1 ).after( monsterDOM );
                        var $newMonster = $( '#combat-dialog .monster').eq( numMonsters );
                        numMonsters++;
                        $newMonster.find( '.display' ).html(
                            pI( newMonsterStrength )
                        );
                        plusMinusBtns( $newMonster );
                    }
                );

                $addPlayerBtn.click(
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
                        $addPlayerBtn.hide();
                    }
                );

                // shut down if Done is hit
                $( '#combat-done' ).click(
                    function () {
                        // hide dialog
                        $( '#combat-dialog' ).hide( 'slow',
                            // when it's hidden, reset everything to standard
                            function () {
                                var numMonsters = $( '.monster' ).length;
                                // remove helper, show +player again
                                $( '#combat-dialog .player' ).eq( 1 ).remove();
                                $addPlayerBtn.show();
                                // remove extra monsters
                                for ( var i = 1; i < numMonsters ; i++ ) {
                                    $( '#combat-dialog .monster' ).eq( i - 1 ).remove();
                                }
                                numMonsters = 1;
                            }
                        );
                        // scroll to top, combat dialog has chance to be longer than page
                        window.scrollTo( window.scrollX, 0 );
                    }
                );

                // after we're set up, still need to runCombat
                runCombat();
            },

            // fills in combat strengths, runs after initialSetup()
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
        $menu.toggle( 'slow' );
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
    if ( Modernizr.localstorage ) {
        // set player object to data in localStorage
        restorePlayer = function () {
            if ( localStorage.p === null ) {
                alert( 'No data to restore!' );
                toggleMenu();
                $restoreBtn.hide();
            }
            // if no JSON, load a polyfill
            Modernizr.load( {
                test: Modernizr.json,
                nope: "js/libs/json3.js"
            } );
            player = JSON.parse( localStorage.p );
            $levelDisplay.text( player.level );
            $bonusesDisplay.text( player.bonuses );
            $strengthDisplay.html( player.level + player.bonuses );
            $playerName.text( player.name );
            toggleMenu();
        },

        // delete player data from localStorage
        clearData = function () {
            localStorage.removeItem( 'p' );
            toggleMenu();
            $restoreBtn.hide();
        };

        if ( localStorage.p === null ) {
            localStorage.p = JSON.stringify( player );
        }

        $restoreBtn.removeClass( 'start-hid' );
        $clearBtn.removeClass( 'start-hid' );
        $restoreBtn.click( restorePlayer );
        $clearBtn.click( clearData );
    }

    // handlers for player -/+ buttons
    plusMinusBtns( $( '#level' ) );
    plusMinusBtns( $( '#bonuses' ) );
    // open/close the menu
    $( 'nav a:first, #close-menu' ).click( toggleMenu );

    // contenteditable polyfill
    if ( !Modernizr.contenteditable ) {
        $( 'h1[contenteditable]' ).click(
            function () {
                var oldName = player.name;
                player.name = prompt( "What's your name?" );
                if ( player.name === null ) {
                    // user entered nothing or hit cancel
                    player.name = oldName;
                    return;
                }
                $( this ).html( player.name );
            }
        );
    }

    $( '#dagger' ).click( openCombatDialog );

    // expose public items
    var Module = {
        player: player,
        updatePlayer: updatePlayer
    };
    return Module;
} ( jQuery ));
