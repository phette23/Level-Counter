/*jshint strict:false, white:false */
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

function checkLevel ( newVal, oldVal ) {
    if ( newVal === 10 ) {
        onWin();
    }
}

function onWin () {
    console.log( "Yay! You win! Here are some unicorns." );
    intervalID = setInterval( unicorns, 800 );
}

function unicorns () {
    cornify_add();
    if ( cornify_count === 9 ) {
        clearInterval( intervalID );
    }
}
