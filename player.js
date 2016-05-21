
module.exports = {

  VERSION: "Kickstarter",

  bet_request: function(game_state, bet) {
    const myplayer = game_state.players[game_state.in_action]
    console.log(myplayer.hold_cards)
    //Check for first
    console.log(game_state);
    call();
  },
  showdown: function(game_state) {
  }
};

function zero (game_state, bet){
  if(rank >)

}

function three (game_state, bet){

}

function four (game_state, bet){

}

function five (game_state, bet){

}

function call (game_state, bet){
  const c = game_state.current_buy_in - game_state.players[game_state.in_action].bet;
  bet(c);
}
