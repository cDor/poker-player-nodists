'use strict';

let gameState;
module.exports = {
  VERSION: "Kickstarter",

  bet_request: function(game_state, bet) {
    new Promise(resolve => {
        gameState =  game_state;
        const myplayer = game_state.players[game_state.in_action];
        console.log(myplayer.hole_cards);
        console.log(game_state);


        //Check for zero phase
        if(gameState.community_cards.length === 0){
          resolve(phase_zero());
        }else if(gameState.community_cards.length === 3){
          resolve(phase_three());
        }else if(gameState.community_cards.length === 4){
          resolve(phase_four());
        }else {
          resolve(phase_five());
        }
    }).then(value => {
        bet(value);
    }).catch(err => {
        console.log('ERROR', err);
    });
  },
  showdown: function(game_state) {
  }
};

function phase_zero (){
  console.log("phase zero");
  return call();
}

function phase_three (){
  return call();
}

function phase_four (game_state, bet){
  return call();
}
function phase_five (game_state, bet){
  return call();

}

function call (){
  const c = gameState.current_buy_in - gameState.players[gameState.in_action].bet;
  return c;
}
