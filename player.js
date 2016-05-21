let gameState, respond;
module.exports = {
  VERSION: "Kickstarter",

  bet_request: function(game_state, bet) {
    gameState =  game_state;
    respond = bet;
    const myplayer = game_state.players[game_state.in_action]
    console.log(myplayer.hole_cards)
    //Check for first
    console.log(game_state);
    call();
  },
  showdown: function(game_state) {
  }
};

function phase_zero (game_state, bet){
  call();
}

function phase_three (game_state, bet){
  call();

}

function phase_four (game_state, bet){
  call();

}

function phase_five (game_state, bet){
  call();

}

function call (){
  const c = gameState.current_buy_in - gameState.players[game_state.in_action].bet;
  respond(c);
}
