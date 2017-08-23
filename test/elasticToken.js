const ElasticToken = artifacts.require('./ElasticToken.sol')
const bn = require('bignumber.js')
const abi = require('ethereumjs-abi')
const { ecrecover, pubToAddress } = require('ethereumjs-util')

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

function hashOrder(order) {
  return '0x' + abi.soliditySHA3(
    [
      'uint', 'bytes4', 'address', 'uint',
    ],
    order
  ).toString('hex')
}

function sign(address, hash) {
  console.log('address', address)
  return new Promise((resolve, reject) => {
    return web3.eth.sign(hash, address)
    .then((res) => {
      const r = "0x"+res.substr(2, 64)
      const s = "0x"+res.substr(66, 64)
      const v = 27 + Number(res.substr(130, 2));
      console.log('v', v, 'r', r, 's', s)
      resolve([v, r, s])
    })
  })
}

function sign2(address, hash) {

}

contract('ElasticToken', (accounts) => {
  const elastic_token_params = [
    accounts[0],
    'Veridium',
    'VRD',
    new bn(0),
    new bn(1e6)
  ]

  it('Should create contract with initial supply 1,000,000 owned by the instantiator', () => {
    return ElasticToken.new(...elastic_token_params)
    .then((inst) => {
      return inst.balances.call(accounts[0])
    }).then((res) => {
      assert.equal(res.toNumber(), 1e6)
    })
  })

  it('Should burn alloted tokens given correct signature', () => {
    let elastic_token
    let msg_hash
    return ElasticToken.new(...elastic_token_params)
    .then((inst) => {
      elastic_token = inst
      msg_hash = hashOrder([100, "0xc1644b1f", elastic_token.address, 0])
      return sign(accounts[0], msg_hash)
    }).then((sig) => {
      // return elastic_token.provableBurn.call(sig, 1000, 0)
      const signer = pubToAddress(ecrecover(Buffer.from(msg_hash.slice(2), 'hex'), sig[0], sig[1], sig[2]))

      console.log('signer', '0x' + signer.toString('hex'))
      console.log('true signer', accounts[0])
    })
  })
})
