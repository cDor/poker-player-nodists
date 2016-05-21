'use strict';

const getRanking = require('./ranking');

let gameState, myplayer;
module.exports = {
  VERSION: "It's a long way to the top",
  bet_request: function(game_state, bet) {
    new Promise((resolve, reject) => {
        gameState =  game_state;
        myplayer = game_state.players[game_state.in_action];
        console.log(myplayer.hole_cards);
        console.log(game_state);

        //Check for zero phase
        try {
            let promise;
            if(gameState.community_cards.length <= 3){
              promise = Promise.resolve(phase_zero());
            } else {
              promise = Promise.resolve(phase_two());
            }
            promise.then(resolve, reject);
        } catch(e) {
            console.error(e);
            reject(e);
        }
    }).then(value => {
        bet(Math.round(value));
    }).catch(err => {
        console.log('ERROR!!!! Bluffing', err);
        bet(Math.random() * myplayer.stack);
    });
  },
  showdown: function(game_state) {
  }
};

function phase_zero (){

  const highCards = myplayer.hole_cards.filter(isHighCard);
  if(highCards.length > 0 && isSmallBlind()) {
    console.log('we have a high card and it is still small blind - call!');
    return callMax(gameState.small_blind * 4);
  }
  const haveHighCard = highCards.length > 0;
  if(highCards.length > 1) {
    return minimalRaise();
  } else if(haveHighCard) {
    return callMax(4 * gameState.small_blind);
  }

  const first = myplayer.hole_cards[0];
  const second = myplayer.hole_cards[1];
  if(first.rank === second.rank){ // check pair
    return minimalRaise();
  }else if(isSuited(myplayer.hole_cards)){
    return call();
  } else if(isHighCard(first) || isHighCard(second) || areContinous(first, second)) {
    return call();
  }else {
    return fold();
  }

}

function phase_two (){
  console.log('phase 2!');
  const allCards = gameState.community_cards.map(item => item);
  myplayer.hole_cards.forEach(item => allCards.push(item));
  console.log('allcards', allCards);

  const numberOfPairs = pairsWithCommunity(myplayer.hole_cards[0], myplayer.hole_cards[1], gameState.community_cards);
  if(numberOfPairs >= 2) {
    return allIn();
  } else if(numberOfPairs === 1) {
    return minimalRaise(); // TODO: maybe more?
  }

  if(isSuited(myplayer.hole_cards)) {
    const suit = myplayer.hole_cards[0].suit;
    const suited = gameState.community_cards.filter(card => {
        return card.suit === suit;
    }).length;

    if(suited >= 3) { // FLUSH! TODO: change if they react
        return allIn();
    } else if(suited == 2) {
        if(gameState.community_cards.length < 5) { // flush still possible
            return minimalRaise();
        } // else use ranking
    }
  }

  // const communityOnly = getRanking(gameState.community_cards);
  const withOurCards = getRanking(allCards);
  return getRanking(allCards).then((rankingData) => {
    const allCardsRank = rankingData.rank;
    console.log('got rank', allCardsRank);
    if(allCardsRank >= 8) {
        return allIn();
    } else if(allCardsRank >= 5) {
        return minimalRaise();
    } else if(allCardsRank >= 3) {
        return minimalRaise();
    } else if(allCardsRank >= 2) {
        return minimalRaise();
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

function pairsWithCommunity(first, second, communityCards) {
    const pairs = communityCards.filter((commCard) => {
        return isPair(commCard, first) || isPair(commCard, second);
    });
    return pairs.length;
}

function isPair(first, second) {
    return first.rank === second.rank;
}

function areContinous(first, second) {
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const firstValue = ranks.indexOf(first.rank);
    const secondValue = ranks.indexOf(second.rank);
    return ((firstValue + 1) == secondValue) || (firstValue == (secondValue + 1));
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
    const rand = Math.random();
    if(rand > 0.7) {
        return call() + rand * 10 * gameState.minimum_raise; // randomly higher
    } else {
        return call() + gameState.minimum_raise+100;
    }
}