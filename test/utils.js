const ElasticToken = artifacts.require('./ElasticToken.sol')
const provider = require('ethjs-provider-http')
const rpc = require('ethjs-rpc')
const eth = new rpc(new provider('http://localhost:8547'))
const {
  ecsign
} = require('ethereumjs-util')
const users = require('../conf/accounts.json')

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

async function signMsg(pubAdrs, msgHsh) {
  try {
    let privbuff
    users.forEach((usr, i) => {
      if (usr.publicAddress == pubAdrs) privbuff = usr.secretKey
    })
    const signature = ecsign(Buffer.from(msgHsh.substring(2), 'hex'), Buffer.from(privbuff.substring(2), 'hex'))
    console.log('r', signature.r.toString('hex'))
    console.log('s', signature.s.toString('hex'))
    console.log('v', signature.v)
    return [signature.r.toString('hex'), signature.s.toString('hex'), signature.v]
  } catch (err) {
    console.log('### error in signMsg', err)
  }
}

module.exports = {
  getContract,
  getCoinbase,
  getAccounts,
  signMsg
}
