const ElasticToken = artifacts.require('./ElasticToken.sol')
const {
  getContract,
  getCoinbase
} = require('./utils')

const tokenParams =  [ '0x77161ac6576e2870f64ca147de120f0ba8a66255', 1e9, 0, 'Gold', 'GLD' ]

contract('ElasticToken', (accounts) => {
  describe('initialization tests', () => {
    it('Should initialize contract with globals as defined in params', async () => {
      try {
        const elasticToken = await getContract()
        const admin = await elasticToken.admin.call()
        const supply = await elasticToken.supply.call()
        const decimal = await elasticToken.decimal.call()
        const name = await elasticToken.name.call()
        const ticker = await elasticToken.ticker.call()
        assert.equal(admin, tokenParams[0])
        assert.equal(supply, tokenParams[1])
        assert.equal(decimal, tokenParams[2])
        assert.equal(name, tokenParams[3])
        assert.equal(ticker, tokenParams[4])
      } catch (err) {
        console.log('### error in test1', err)
      }
    })

    it('Should initially assign the total supply to msg.sender', async () => {
      try {
        const elasticToken = await getContract()
        const deployer = await getCoinbase()
        const balance = await elasticToken.balances.call(deployer)
        assert.equal(balance, tokenParmas[1])
      } catch (err) {
        console.log('### error in test 2', err)
      }
    })
  })
})
