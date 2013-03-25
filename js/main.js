/*jshint strict:false, white:false */
/*global jQuery, Modernizr */
// ensure $ = jQuery
// run on document load using jQuery's shorthand
var LevelCounter = (function ($) {
    // Initial player stats
    var player = {
        level : 1,
        bonuses : 0,
        name : 'Player'
    },

    // with any change, update DOM, player object, & storage
    updatePlayer = function () {
        // update displays & name
        player.level = pI( $levelDisplay.text() );
        player.bonuses = pI( $bonusesDisplay.text() );
        player.name = $playerName.text();
        $strengthDisplay.text( player.level + player.bonuses );
        // update storage
        localStorage.p = JSON.stringify( player );
        // if 'clear' link was hit & restore link hidden
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
    };

    // handlers for player -/+ buttons
    plusMinusBtns( $( '#level' ) );
    plusMinusBtns( $( '#bonuses' ) );

    // cache common DOM lookups
    var $levelDisplay = $( '#level .display' ),
        $bonusesDisplay = $( '#bonuses .display' ),
        $playerName = $( 'h2.pname' ),
        $strengthDisplay = $( '#strength' ).find( '.display' ),
        $menu = $( 'nav .menu-items' ),
        $restoreBtn = $( '#restore' ),
        $clearBtn = $( '#clear' ),
        $menuItems = $( '.menu-items' ),
        $doc = $( document ),

        // shorthand for parseInt
        pI = function ( string ) {
            return parseInt( string, 10 );
        },

        scrollToTop = function () {
            window.scrollTo( window.scrollX, 0 );
        },

        toggleMenu = function () {
            $menu.toggle( 'slow' );
        },

        prompt = {
            $dialog : $( '#prompt' ),
            needInt : 'Please enter an integer. Hit ESC to cancel.',
            open : function ( msg ) {
                this.$header.text( msg );
                this.$dialog.show( 'slow' );
                this.$input.focus();
                scrollToTop();
            },
            close : function () {
                // use "prompt" instead of this
                // because it's likely to be called inside an event handler
                prompt.$dialog.hide( 'slow', function () {
                    scrollToTop();
                    // remove form event handlers
                    prompt.$form.off( 'submit' );
                    prompt.$input.val( '' );
                } );
            }
        };

    // build on previous properties
    prompt.$header = prompt.$dialog.find( 'h2' );
    prompt.$input = prompt.$dialog.find( 'input' );
    prompt.val = function () {
        return pI( prompt.$input.val() );
    };
    prompt.$form = prompt.$dialog.find( 'form' );

    // combat section
    var combat = {
        // all the combat DOM lookups
        $dialog : $( '#combat-dialog' ),
        $addPlayerBtn : $( '#add-player' ),
        $addMonsterBtn : $( '#add-monster' ),
        $doneBtn : $( '#combat-done' ),
        // handy strings & info
        monsterPrompt : 'What is the monster\'s level?',
        numMonsters : 1
    };

    // these build on previous properties
    combat.$firstPlayer = combat.$dialog.find( '.player' );
    combat.$firstMonster = combat.$dialog.find( '.monster' );
    // monster HTML, used for adding multiple monsters
    combat.monsterDOM = combat.$dialog.find( '.monster-col' ).html();
    combat.playerDOM = combat.$dialog.find( '.player-col' ).html();

    combat.initialize = function () {
        // set up +/- buttons for monster & player
        plusMinusBtns( this.$firstMonster );
        plusMinusBtns( this.$firstPlayer );

        // set up add monster/player buttons
        this.$addMonsterBtn.click(
            function () {
                prompt.open( combat.monsterPrompt );
                prompt.$input.focus();
                prompt.$form.on( 'submit', combat.addMonster );
            }
        );

        this.$addPlayerBtn.click(
            function () {
                prompt.open( 'What is the player\'s combat strength?' );
                prompt.$input.focus();
                prompt.$form.on( 'submit', combat.addPlayer );
            }
        );

        // shut down if Done is hit
        this.$doneBtn.click(
            function () {
                combat.resetDialog();
            }
        );
    };

    combat.openDialog = function () {
        prompt.open( combat.monsterPrompt );
        prompt.$form.on( 'submit', combat.fillInCombat );
    };

    combat.fillInCombat = function ( event ) {
        event.preventDefault();

        // force integer input
        if ( isNaN( prompt.val() ) ) {
            prompt.$header.text( prompt.needInt );
            return;
        }

        // remove event handler from prompt
        prompt.$form.off( 'submit' );

        var monsterStrength = prompt.val();

        combat.$firstMonster.find( '.display' ).text( monsterStrength );

        // fill in player's attributes
        combat.$firstPlayer.find( '.display' ).text( player.level + player.bonuses );
        combat.$firstPlayer.find( 'h2' ).text( player.name );

        // at the end, hide prompt & reveal combat dialog
        prompt.$dialog.fadeOut( 'slow', function () {
            $( '#combat-dialog' ).show( 'slow' );
            prompt.$input.val( '' );
        });
    };

    combat.addMonster = function ( event ) {
        event.preventDefault();
        if ( isNaN( prompt.val() ) ) {
            prompt.$header.text( prompt.needInt );
            return;
        }
        prompt.$form.off( 'submit' );
        var newMonsterStrength = prompt.val();
        // fill in new Monster level & apply new +/- handlers
        $( '#combat-dialog .monster' ).eq( combat.numMonsters - 1 ).after( combat.monsterDOM );
        var $newMonster = $( '#combat-dialog .monster' ).eq( combat.numMonsters );
        $newMonster.find( '.display' ).text( newMonsterStrength );
        plusMinusBtns( $newMonster );
        combat.numMonsters++;
        prompt.$dialog.fadeOut( 'slow', function () {
            prompt.$input.val( '' );
        });
    };

    combat.addPlayer = function ( event ) {
        event.preventDefault();
        if ( isNaN( prompt.val() ) ) {
            prompt.$header.text( prompt.needInt );
            return;
        }
        prompt.$form.off( 'submit' );
        var helperStrength = prompt.val();
        // fill in helper strength & apply new +/- handlers
        combat.$firstPlayer.after( combat.playerDOM );
        var $newPlayer = $( '#combat-dialog .player' ).eq( 1 );
        $newPlayer.find( '.display' ).text( helperStrength );
        $newPlayer.find( 'h2' ).text( 'Helper' );
        plusMinusBtns( $newPlayer );
        // can't have more than 2 helpers so hide +player
        combat.$addPlayerBtn.hide();
        prompt.$dialog.fadeOut( 'slow', function () {
            prompt.$input.val( '' );
        });
    };

    combat.resetDialog = function () {
        // hide dialog
        $( '#combat-dialog' ).hide( 'slow',
            // when it's hidden, reset everything to standard
            function () {
                var numMonsters = $( '.monster' ).length;
                // remove helper, show +player again
                $( '#combat-dialog .player' ).eq( 1 ).remove();
                combat.$addPlayerBtn.show();
                // remove extra monsters
                for ( var i = 1; i < numMonsters ; i++ ) {
                    $( '#combat-dialog .monster' ).eq( i - 1 ).remove();
                }
                numMonsters = 1;
            }
        );
        // scroll to top, combat dialog has chance to be longer than page
        scrollToTop();
    };

    // close open prompt, menu, or combat dialog when ESC is typed
    var escHandler = function ( ev ) {
        // keyCode for ESC = 27
        if ( ev.which == 27 ) {
            if ( prompt.$dialog.is( ':visible' ) ) {
                prompt.close();
            } else if ( $menuItems.is( ':visible' ) ) {
                toggleMenu();
            } else if ( combat.$dialog.is( ':visible' ) ) {
                combat.resetDialog();
            }
        }
    };

    $doc.keyup( escHandler );

    // expose restore/clear functionality only if localStorage is available
    if ( Modernizr.localstorage ) {
        // set player object to data in localStorage
        var restorePlayer = function () {
            if ( localStorage.p === null ) {
                alert( 'No data to restore!' );
                toggleMenu();
                $restoreBtn.hide();
            }
            // if no JSON, load a polyfill
            Modernizr.load( {
                test: Modernizr.json,
                nope: 'js/libs/json3.js'
            } );
            player = JSON.parse( localStorage.p );
            $levelDisplay.text( player.level );
            $bonusesDisplay.text( player.bonuses );
            $strengthDisplay.text( player.level + player.bonuses );
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

    // open/close the menu
    $( 'nav a:first, #close-menu' ).click( toggleMenu );

    // contenteditable polyfill
    if ( !Modernizr.contenteditable ) {
        $( 'h1[contenteditable]' ).click(
            function () {
                var oldName = player.name;
                player.name = prompt.open( 'What\'s your name?' );
                if ( player.name === null ) {
                    // user entered nothing or hit cancel
                    player.name = oldName;
                    return;
                }
                $( this ).text( player.name );
            }
        );
    }

    // combat event listeners
    $( '#dagger' ).click( combat.openDialog );
    combat.initialize();

    // expose public items
    var Module = {
        'player' : player,
        'updatePlayer' : updatePlayer,
        'toggleMenu' : toggleMenu,
        'prompt' : prompt,
        'combat' : combat
    };
    return Module;
} ( jQuery ));
