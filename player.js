'use strict';

const getRanking = require('./ranking');

let gameState, myplayer, folded;
module.exports = {
  VERSION: "Kickstarter",
  bet_request: function(game_state, bet) {
    new Promise((resolve, reject) => {
        folded = false;
        gameState =  game_state;
        myplayer = game_state.players[game_state.in_action];
        console.log(myplayer.hole_cards);
        console.log(game_state);

        //Check for zero phase

        let promise;
        if(gameState.community_cards.length <= 3){
          promise = Promise.resolve(phase_zero());
        } else {
          promise = Promise.resolve(phase_two());
        }
        promise.then(resolve, reject);
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
  folded = false;
  if(myplayer.hole_cards.length < 2){
    return 0;
  }

  console.log("phase zero");
  const rank = evaluate(myplayer.hole_cards);
  if(rank >= 3){
    return minimalRaise();
  }else if (rank ===2) {
    return call();
  }
  folded = true;
  return fold();
}

function phase_two (){
  console.log('phase 2!');
  const allCards = gameState.community_cards.map(item => item);
  myplayer.hole_cards.forEach(item => allCards.push(item));
  console.log('allcards', allCards);

  return getRanking(allCards).then((rankingData) => {
    const rank = rankingData.rank;

    if(rank >= 8) {
        return allIn();
    } else if(rank >= 5) {
        return minimalRaise();
    } else if(rank >= 3) {
        return call();
    } else {
        return fold();
    }
  }, err => {
    console.log('ERROR could not get rank', err);
    return call();
  });


  // const rank = evaluate(myplayer.hole_cards);
  // if(rank === 3){
  //   return gameState.minimum_raise;
  // }else if (rank ===2) {
  //   return call();
  // }
  // return fold();
}

function evaluate (cards){
  const first = cards[0];
  const second = cards[1];
  if(first.rank === second.rank){ // check pair
    return 3;
  }else if(isSuited(cards)){
    return 2;
  } else {
    return 0;
  }
}

function isSuited(cards){
  const first = cards[0];
  const second = cards[1];
  if(first.suit === second.suit){
    return true;
  }
  return false;

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

function minimalRaise() {
    return call() + gameState.minimum_raise;
}