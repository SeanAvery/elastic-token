const ElasticToken = artifacts.require('./ElasticToken.sol')
const provider = require('ethjs-provider-http')
const rpc = require('ethjs-rpc')
const eth = new rpc(new provider('http://localhost:8547'))

function getContract() {
  return new Promise((res, rej) => {
    ElasticToken.deployed()
    .then(inst => res(inst))
    .catch(err => rej(err))
  })
}

async function getCoinbase() {
  try {
    const accounts = await eth.sendAsync({
      method: 'eth_accounts',
      params: []
    })
    return accounts[0]
  } catch (err) {
    console.log('### error in getCoinbase', err)
  }
}

async function getAccounts() {
  try {
    const accounts = await eth.sendAsync({
      method: 'eth_accounts',
      params: []
    })
    return accounts
  } catch (err) {
    console.log('### error in getAccounts', err)
  }
}

module.exports = {
  getContract,
  getCoinbase,
  getAccounts
}
