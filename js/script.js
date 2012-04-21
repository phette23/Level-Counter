//ensure use of the $ in jQuery
//just in case some script in the User Agent, e.g. browser extension, is doing something stupid
//run code on document load using jQuery's shorthand for that
(function($) {
    $(
        //initial player stats
        var player = {
            level : 1,
            bonuses : 0,
            races : ['Human'],
            classes : ['None'],
            "super-munchkin" : false,
            "half-breed" : false
        };

        var refreshStrength = function() {
            $( '#strength' ).find( '.display' ).html( player.level + player.bonuses );
        };

        var changeValue = function( valueType, quantity ) {
            if ( !player.hasOwnProperty(valueType) ) {
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
        };

        //jQuery click handlers for -/+ buttons
        //this section totally fails DRY...
        $( '#level' ).find( '.pm-button' ).first().click(
            function(e) {
            	changeValue( 'level', -1 );
            });
        $( '#level' ).find( '.pm-button' ).last().click(
            function(e) {
            	changeValue( 'level' , 1 );
            });
        $( '#bonuses' ).find( '.pm-button' ).first().click(
            function(e) {
            	changeValue( 'bonuses' , -1 );
            });
        $( '#bonuses' ).find( '.pm-button' ).last().click(
            function(e) {
            	changeValue( 'bonuses', 1 );
            });

        //change handlers for select inputs
        //races
        $( '#race1' ).change( function() {
            player.races[0] = $(this).val();
        });
        $( '#race2' ).change( function() {
            player.races[1] = $(this).val();
        });

        //classes
        $( '#class1' ).change( function() {
            player.classes[0] = $(this).val();
        });
        $( '#class2' ).change( function() {
            player.classes[1] = $(this).val();
        });

        //1st input is half-breed
        $('input').first().change(
            function() {
                player['half-breed'] = !( player['half-breed'] ); //invert h-b state
                if (player['half-breed']) { //player becomes h-b
                    $( 'label[for="race2"]' ).fadeIn( 'slow' );
                    $( '#race2' ).fadeIn( 'slow' );
                }

                else { //player is going from h-b to not h-b
                    $('label[for="race2"]').hide();
                    $('#race2').attr('value','Human').hide();
                    delete player.races[1];
                }
            });

        //2nd input is super-munchkin
        $( 'input' ).last().change(
                function() {
                player['super-munchkin'] = !( player['super-munchkin'] );
                if ( player['super-munchkin'] ) {
                    $( '#class2' ).fadeIn( 'slow' );
                    $( 'label[for="class2"]' ).fadeIn( 'slow' );
                }

                else {
                    $( '#class2' ).attr( 'value', '' ).hide();
                    $( 'label[for="class2"]' ).hide();
                    delete player.classes[1];
                }

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

    ); //run on document load

} (jQuery));