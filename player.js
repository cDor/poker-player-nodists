
module.exports = {

  VERSION: "Kickstarter",

  bet_request: function(game_state, bet) {
    //Check for first
    console.log(game_state);
    bet(game_state.minimum_raise);
  },
  showdown: function(game_state) {
  }
};

function first (game_state, bet){

}
