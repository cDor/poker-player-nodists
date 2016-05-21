'use strict';

const player = require('../player');
const expect = require('chai').expect;

const fakeState = { tournament_id: '5740866147cecc0003000155',
  game_id: '57409fded9f9820003000078',
  round: 41,
  players:
   [ { name: 'Smiling Monkey',
       stack: 959,
       status: 'active',
       bet: 10,
        version: 'Default C# folding player',
       id: 0 },
     { name: 'All In',
       stack: 0,
       status: 'out',
       bet: 0,
       version: 'Kiel #1 Team',
       id: 1 },
     { name: 'nodists',
       stack: 3021,
       status: 'active',
       bet: 10,
       hole_cards: [ { rank: 'J', suit: 'clubs' }, { rank: 'A', suit: 'hearts' } ],
       version: 'Kickstarter',
       id: 2 },
     { name: 'Fantastic Pony',
       stack: 0,
       status: 'out',
       bet: 0,
       version: 'Ludicrous poker player',
       id: 3 } ],
  small_blind: 5,
  big_blind: 10,
  orbits: 10,
  dealer: 0,
  community_cards:
   [ { rank: 'J', suit: 'hearts' },
     { rank: '2', suit: 'clubs' },
     { rank: '7', suit: 'clubs' },
     { rank: '10', suit: 'spades' } ],
  current_buy_in: 10,
  pot: 20,
  in_action: 2,
  minimum_raise: 10,
  bet_index: 0 }

describe('Pokerbot', function() {
    it('should return', function(done) {
        player.bet_request(fakeState, function(bet) {
            try {
                expect(bet).to.exist;
                expect(bet>=0).to.be.ok;
            } catch(e) {
                return done(e);
            }
            done();
        });
    });
});