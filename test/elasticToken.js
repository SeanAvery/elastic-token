const ElasticToken = artifacts.require('./ElasticToken.sol')
const BN = require('bn.js')

const {
  getContract,
  getCoinbase,
  getAccounts
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
        assert.equal(supply.toString(), new BN(tokenParams[1], 10).toString())
        assert.equal(decimal.toString(), new BN(tokenParams[2], 10).toString())
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
        assert.equal(balance.toString(), new BN(tokenParams[1], 10).toString())
      } catch (err) {
        console.log('### error in test 2', err)
      }
    })
  })

  describe('Transfer tests', () => {
    it('Should transfer 100 tokens given sufficient balance', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        const balanceApre = await elasticToken.balances.call(accounts[0])
        await elasticToken.transfer(accounts[1], 1e2, { from: accounts[0] })
        const balanceA = await elasticToken.balances.call(accounts[0])
        const balanceB = await elasticToken.balances.call(accounts[1])
        console.log('balanceApre', balanceApre)
        assert.equal(balanceApre.sub(balanceA).toString(), new BN('100', 10).toString())
        assert.equal(balanceB, new BN('100', 10).toString())
      } catch (err) {
        console.log('### error in test 3', err)
      }
    })

    it('Should not transfer tokens given unsufficent funds', async () => {
      const elasticToken = await getContract()
      const accounts = await getAccounts()
      const balanceApre = await elasticToken.balances.call(accounts[1])
      const balanceBpre = await elasticToken.balances.call(accounts[2])
      try {
        await elasticToken.transfer(balanceApre + 100, accounts[2], { from: accounts[1] })
      } catch (err) {
        console.log('### throw in transfer call (this is good!)', err)
      } finally {
        const balanceApost = await elasticToken.balances.call(accounts[1])
        const balanceBpost = await elasticToken.balances.call(accounts[2])
        assert.equal(balanceApre.toString(), balanceApost.toString())
        assert.equal(balanceBpre.toString(), balanceBpost.toString())
      }
    })
  })

  describe('Approve and TransferFrom tests', () => {
    it('Should approve spender given sufficient balance', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        await elasticToken.approve(accounts[3], 1e2, { from: accounts[0] })
        const approval = elasticToken.approvals.call(accounts[3])
        assert.equal(approval.toString(), new BN(100, 10).toString())
      } catch (err) {
        console.log('### error in test 5', err)
      }
    })
  })
})
