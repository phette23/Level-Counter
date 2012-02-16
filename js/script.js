/*eventually it'll make sense to refactor for multiple players on 1 page
I bet something like
function Player() {
    this.level = 1;
    this.bonuses = 0;
    this.getCombatStrength = function() {
        return level + bonuses;}
}
can serve as a constructor
but for now I just want to get a single player working at a time
you can have multiple tabs/windows open for multiple players
also - I know jQuery is in HTML5BP but I don't know if I'll really need it
so I'm writing this in pure JS first, if it becomes obvious that jQ is needed
I'll switch */

var $ = function(id) { //just shorthand for getElementById
	return document.getElementById(id);
};

var player = {
    level : 1,
    bonuses : 0,
    races : [], //currently unused, for future features
    classes : [] //ditto
};

var refreshStrength = function() {
	$('strength').innerHTML=(player.level+player.bonuses);
};

var changeValue = function(valueType, quantity) {
    if (!player.hasOwnProperty(valueType)) {
        console.log("Error: not a valid value. Use either level or bonuses.");
        return false;
    };
    if (typeof quantity === "number") {
        player[valueType] += quantity;
        $(valueType).innerHTML = player[valueType];
    }
    else {
        console.log("Error: not a valid quantity. Try using a number, genuis.");
        return false;
    };
    refreshStrength();
};