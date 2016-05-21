'use strict';

let gameState, myplayer;
module.exports = {
  VERSION: "Kickstarter",
  bet_request: function(game_state, bet) {
    new Promise(resolve => {
        gameState =  game_state;
        myplayer = game_state.players[game_state.in_action];
        console.log(myplayer.hole_cards);
        console.log(game_state);

        //Check for zero phase

        if(gameState.community_cards.length === 0){
          resolve(phase_zero());
        }else if(gameState.community_cards.length <= 3){
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
  if(myplayer.hole_cards.length < 2){
    return 0;
  }

  console.log("phase zero");
  const rank = evaluate(myplayer.hole_cards);
  if(rank === 3){
    return gameState.minimum_raise;
  }else if (rank ===2) {
    return call();
  }
  return fold();
}

function phase_three (){
  const rank = evaluate(myplayer.hole_cards);
  if(rank === 3){
    return gameState.minimum_raise;
  }else if (rank ===2) {
    return call();
  }
  return fold();
}

function phase_four (game_state, bet){
  const rank = evaluate(myplayer.hole_cards);
  if(rank === 3){
    return gameState.minimum_raise;
  }else if (rank ===2) {
    return call();
  }
  return fold();
}

function phase_five (game_state, bet){
  const rank = evaluate(myplayer.hole_cards);
  if(rank === 3){
    return gameState.minimum_raise;
  }else if (rank ===2) {
    return call();
  }
  return fold();
}

function evaluate (cards){
  const first = cards[0];
  const second = cards[1];
  if(first.rank === second.rank){
    return 3;
  }else if(isSuited(cards)){
    return 2;
  } else {
    return 0;
  }
}

function isSuited(cards){
  const reds = ['clubs','spades'];
  const blacks = ['hearts', 'diamonds'];
  const first = cards[0];
  const second = cards[1];
  if((reds.indexOf(first.suit) >= 0  && reds.indexOf(second.suit)) || (blacks.indexOf(first.suit) >= 0  && blacks.indexOf(second.suit))){
    return true;
  }else{
    return false;
  }
}

function call (){
  const c = gameState.current_buy_in - gameState.players[gameState.in_action].bet;
  return c;
}

function allIn(){
  const c = myplayer.stack;
  return c;
}

function fold(){
  return 0;
}
