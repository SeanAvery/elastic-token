const ElasticToken = artifacts.require('./ElasticToken.sol')

const tokenParams =  [
  '0x0',
  1e9,
  0,
  'Gold',
  'GLD'
]

module.exports = function(deployer) {
  deployer.deploy(ElasticToken, ...tokenParams)
  .then(() => console.log('### deployed ElasticToken contract'))
  .catch(err => console.log('### error deploying ElasticToken contract', err))
};
