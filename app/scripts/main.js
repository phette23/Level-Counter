/*global cornify_add, cornify_count */
function onWin () {
    var interval,
        unicorns = function () {
            /* jshint camelcase: false */
            cornify_add();
            if ( cornify_count === 9 ) {
                clearInterval( interval );
            }
        };

    if ( typeof console.log === 'function' ) {
        console.log( 'Yay! You win! Here are some unicorns.' );
    }

    // cornify loads images over HTTP
    // so only run if we're connected
    if ( navigator.onLine ) {
        interval = setInterval( unicorns, 800 );
    }
}

function checkLevel ( newVal ) {
    if ( newVal === 10 ) {
        onWin();
    }
}

function LevelCounter( $scope ) {
    $scope.player = {
        level : 1,
        bonus : 0,
        strength : function () {
            return this.level + this.bonus;
        },
        upLvl : function () {
            this.level++;
        },
        dnLvl : function () {
            this.level--;
        },
        upBns : function () {
            this.bonus++;
        },
        dnBns : function () {
            this.bonus--;
        }
    };

    // watch level for when it hits 10 & someone wins
    $scope.$watch( 'player.level', checkLevel );
}
// to prevent minifier from renaming $scope param
LevelCounter.$inject = [ '$scope' ];
