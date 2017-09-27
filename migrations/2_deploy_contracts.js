const ElasticToken = artifacts.require('./ElasticToken.sol')
const users = require('../conf/accounts.json')
console.log('users', users)
const tokenParams =  [ users[1].publicAddress, 1e9, 0, 'Gold', 'GLD' ]

module.exports = function(deployer) {
  deployer.deploy(ElasticToken, tokenParams[0], tokenParams[1], tokenParams[2], tokenParams[3], tokenParams[4])
  .then(() => console.log('### deployed ElasticToken contract'))
  .catch(err => console.log('### error deploying ElasticToken contract', err))
};
