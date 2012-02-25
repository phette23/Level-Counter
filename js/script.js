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

//initial player stats
var player = {
    level : 1,
    bonuses : 0,
    races : [], //currently unused, for future features
    classes : [] //ditto
};

var refreshStrength = function() {
    $('#strength').find('.display').html(player.level + player.bonuses);
};

var changeValue = function(valueType, quantity) {
    if (!player.hasOwnProperty(valueType)) {
        console.log("Error: not a valid value. Use either level or bonuses.");
        return false;
    };
    if (typeof quantity === "number") {
        //Question: is it worth testing to see if a decrement would drop
        //player.level below 1? Are there cards that allow this?
        player[valueType] += quantity;
        $('#' + valueType).find('.display').html(player[valueType]);
    }
    else {
        console.log("Error: not a valid quantity. Try using a number, genuis.");
        return false;
    };
    refreshStrength();
};

//jQuery click handlers for -/+ buttons
//this section totally fails DRY...
$('#level').find('.pm-button').first().click( function(e) {
	changeValue('level', -1);
});
$('#level').find('.pm-button').last().click( function(e) {
	changeValue('level', 1);
});
$('#bonuses').find('.pm-button').first().click( function(e) {
	changeValue('bonuses', -1);
});
$('#bonuses').find('.pm-button').last().click( function(e) {
	changeValue('bonuses', 1);
});

//annoying but necessary?
//window.onbeforeunload = function() {
    //only annoy the user if in fact there is data stored
//    if (!(player.level === 1 && player.bonuses === 0
//        && player.races.length === 0 && player.classes.length === 0)) {
//    return "All game data will be lost. Are you sure you want to navigate away from the page?";
//    }
//};