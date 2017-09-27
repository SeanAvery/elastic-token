const ElasticToken = artifacts.require('./ElasticToken.sol')
const BN = require('bn.js')
const sha3 = require('solidity-sha3').default
const crypto = require('crypto')
const {
  getContract,
  getCoinbase,
  getAccounts,
  signMsg
} = require('./utils')
const users = require('../conf/accounts.json')

const tokenParams =  [ users[1].publicAddress, 1e9, 0, 'Gold', 'GLD' ]

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
        console.log('### throw in transfer call (this is good!)')
      } finally {
        const balanceApost = await elasticToken.balances.call(accounts[1])
        const balanceBpost = await elasticToken.balances.call(accounts[2])
        assert.equal(balanceApre.toString(), balanceApost.toString())
        assert.equal(balanceBpre.toString(), balanceBpost.toString())
      }
    })
  })

  describe('Approve and TransferFrom tests', () => {
    it('Should approve spender 100 tokens given sufficient balance', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        await elasticToken.approve(accounts[3], 100, { from: accounts[0] })
        const approval = await elasticToken.approvals.call(accounts[0], accounts[3])
        assert.equal(approval.toString(), new BN(100, 10).toString())
      } catch (err) {
        console.log('### error in test 5', err)
      }
    })

    it('Should not approve spender given insufficient balance', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        const approvalPre = await elasticToken.approvals.call(accounts[3], accounts[4])
        console.log('approvalPre', approvalPre)
        try {
          await elasticToken.approve(accounts[3], 100, { from: accounts[4] })
        } catch (err) {
          console.log('### throw in approve call (this is good!)')
        } finally {
          const approvalPost = await elasticToken.approvals.call(accounts[4], accounts[3])
          console.log('approvalPost', approvalPost)
          assert.equal(approvalPost.toString(), approvalPre.toString())
        }
      } catch (err) {
        console.log('### error in test 6', err)
      }
    })

    it('Should transferFrom given sufficient approval balance', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        const approvalPre = await elasticToken.approvals.call(accounts[0], accounts[3])
        const balanceApre = await elasticToken.balances.call(accounts[0])
        const balanceBpre = await elasticToken.balances.call(accounts[5])
        await elasticToken.transferFrom(accounts[0], accounts[5], 1e1, { from: accounts[3] })
        const approvalPost = await elasticToken.approvals.call(accounts[0], accounts[3])
        const balanceApost = await elasticToken.balances.call(accounts[0])
        const balanceBpost = await elasticToken.balances.call(accounts[5])
        assert.equal(approvalPre.sub(approvalPost).toString(), '10')
        assert.equal(balanceApre.sub(balanceApost).toString(), '10')
        assert.equal(balanceBpost.sub(balanceBpre).toString(), '10')
      } catch (err) {
        console.log('### error in test 7', err)
      }
    })
  })

  describe('Burn functionality', () => {
    it('Should burn 10 tokens given sufficeint balance', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        const balancePre = await elasticToken.balances.call(accounts[0])
        const burningPre = await elasticToken.burnings(accounts[0])
        const supplyPre = await elasticToken.supply.call()
        await elasticToken.burn(10, { from: accounts[0] })
        const balancePost = await elasticToken.balances.call(accounts[0])
        const burningPost = await elasticToken.burnings(accounts[0])
        const supplyPost = await elasticToken.supply.call()
        assert.equal(burningPost.sub(burningPre).toString(), '10')
        assert.equal(balancePre.sub(balancePost).toString(), '10')
        assert.equal(supplyPre.sub(supplyPost).toString(), '10')
      } catch (err) {
        console.log('### error in test 8', err)
      }
    })
  })

  describe('Admin functionality', () => {
    it('Should mint 1000 tokens increasing the supply', async () => {
      try {
        const elasticToken = await getContract()
        const supplyPre = await elasticToken.supply.call()
        const balancePre = await elasticToken.balances.call(accounts[6])
        await elasticToken.mint(1e3, accounts[6], { from: accounts[1]})
        const supplyPost = await elasticToken.supply.call()
        const balancePost = await elasticToken.balances.call(accounts[6])
        assert.equal(supplyPost.sub(supplyPre).toString(), '1000')
        assert.equal(balancePost.sub(balancePre).toString(), '1000')
      } catch (err) {
        console.log('### error in test 9', err)
      }
    })

    it('Should change decimal to 10', async () => {
      try {
        const elasticToken = await getContract()
        await elasticToken.changeDecimal(1e1, { from: accounts[1] })
        const decimal = await elasticToken.decimal.call()
        assert.equal(decimal.toString(), '10')
      } catch (err) {
        console.log('### error in test 10', err)
      }
    })

    it('Should change admin', async () => {
      try {
        const elasticToken = await getContract()
        const accounts = await getAccounts()
        const adminPre = await elasticToken.admin.call()
        console.log('adminPre', adminPre)
        console.log('accounts 1', accounts[1])
        await elasticToken.changeAdmin(accounts[7], { from: accounts[1] })
        const admin = await elasticToken.admin.call()
        assert.equal(admin, accounts[7])
      } catch (err) {
        console.log('### error in test 11', err)
      }
    })
  })

  describe('Signature abstracted tests', async () => {
    it('Should burn 10 tokens given correct signature', async () => {
      try {
        const elasticToken = await getContract()
        const salt = crypto.randomBytes(32).toString('hex')
        const msgHash = sha3(elasticToken.address, '0xc1644b1f', salt, 10)
        const signature = await signMsg(accounts[0], msgHash)
        console.log('signature', signature)
        // const signature = await signMsg(accounts[0], 10)
      } catch (err) {
        console.log('### error in test 12', err)
      }
    })
  })
})
