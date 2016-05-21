'use strict';

const getRanking = require('./ranking');

let gameState, myplayer;
module.exports = {
  VERSION: "Kickstarter",
  bet_request: function(game_state, bet) {
    new Promise((resolve, reject) => {
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

  const rank = evaluate(myplayer.hole_cards);
  console.log("phase zero", rank);
  if(rank >= 3){
    return minimalRaise();
  }else if (rank ===2) {
    return call();
  }
  console.log('neither raise nor call');
  const highCards = myplayer.hole_cards.filter(isHighCard);
  if(highCards.length > 0 && isSmallBlind()) {
    console.log('we have a high card and it is still small blind - call!');
    return callMax(gameState.small_blind * 4);
  }
  return fold();
}

function phase_two (){
  console.log('phase 2!');
  const allCards = gameState.community_cards.map(item => item);
  myplayer.hole_cards.forEach(item => allCards.push(item));
  console.log('allcards', allCards);

  if(isSuited(myplayer.hole_cards)) {
    const suit = myplayer.hole_cards[0].suit;
    const suited = gameState.community_cards.filter(card => {
        return card.suit === suit;
    }).length;

    if(suited === 3) { // FLUSH!
        return allIn();
    } else if(suited == 2) {
        if(gameState.community_cards.length < 5) { // flush still possible
            return minimalRaise();
        } // else use ranking
    }
  }

  // const communityOnly = getRanking(gameState.community_cards);
  const withOurCards = getRanking(allCards);
  return Promise.all([/*communityOnly,*/ withOurCards]).then((rankingData) => {
    // const communityRank = rankingData[0].rank;
    const allCardsRank = rankingData[0].rank;

    // console.log('community and allcards rank:', communityRank, allCardsRank);

    // if(communityRank > allCardsRank) {
    //     console.log('communityRank > allCardsRank', communityRank, allCardsRank);
    //     return Math.random() >= 0.7? call():fold(); // 70% call
    // }

    if(allCardsRank >= 8) {
        return allIn();
    } else if(allCardsRank >= 5) {
        return minimalRaise();
    } else if(allCardsRank >= 3) {
        return call();
    } else if(allCardsRank >= 2) {
        return call();
    } else if(allCardsRank >= 1) {
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

function isHighCard(card) {
    const highCards = ['J', 'Q', 'A', 'K', '10'];
    return highCards.indexOf(card.rank.toUpperCase()) >= 0;
}

function isSmallBlind() {
    return gameState.current_buy_in === gameState.small_blind;
}

function callMax(max) {
    const called = call();
    return Math.min(max, called); // if "max" is selected, we fold
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