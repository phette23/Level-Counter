/*jshint strict:false, white:false */
/*global jQuery, Modernizr, angular */
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
}
