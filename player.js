let gameState, respond;
module.exports = {
  VERSION: "Kickstarter",

  bet_request: function(game_state, bet) {
    gameState =  game_state;
    respond = bet;
    const myplayer = game_state.players[game_state.in_action]
    console.log(myplayer.hole_cards)
    console.log(game_state);
    //Check for zero phase
    if(gameState.community_cards.length == 0){
      phase_zero();
    }else if(gameState.community_cards.length == 3){
      phase_three();
    }else if(gameState.community_cards.length == 4){
      phase_four();
    }else if(gameState.community_cards.length == 5){
      phase_five();
    }
  },
  showdown: function(game_state) {
  }
};

function phase_zero (game_state, bet){
  console.log("phase zero");
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
