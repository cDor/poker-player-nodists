'use strict';

const request = require('request-promise');

module.exports = function(cards) {
    request({
        uri: 'http://rainman.leanpoker.org/rank?cards='+encodeURIComponent(JSON.stringify(cards)),
        timeout: 2000
    })
    .then(function (answer) {
        console.log('answer', answer);
    })
    .catch(function (err) {
        console.error('error', err);
    });
};
