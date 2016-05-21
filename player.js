
module.exports = {

  VERSION: "Kickstarter",

  bet_request: function(game_state, bet) {
    const myplayer = game_state.players[game_state.in_action]
    console.log(myplayer.hold_cards)
    //Check for first
    console.log(game_state);
    bet(game_state.minimum_raise);
  },
  showdown: function(game_state) {
  }
};

function zero (game_state, bet){
  if()

}

function three (game_state, bet){

}

function four (game_state, bet){

}

function five (game_state, bet){

}
