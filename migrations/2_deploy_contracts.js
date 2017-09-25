const ElasticToken = artifiacts.require('./ElasticToken.sol')

module.exports = function(deployer) {
  deployer.deploy(ElasticToken)
  .then(() => console.log('### deployed ElasticToken contract'))
  .catch(err => console.log('### error deploying ElasticToken contract', err))
};
