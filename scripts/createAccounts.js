const keythereum = require('keythereum')
const fs = require('fs')
const { privateToAddress } = require('ethereumjs-util')

const params = { keyBytes: 32, ivBytes: 16 }
const balance = '0x28DF9A72FDE228000'
let acntNum = 10
let accounts = []

async function createAccounts() {
  try {
    const privKey = keythereum.create(params).privateKey.toString('hex').replace(/^/, '0x')
    const pubAddress = privateToAddress(privKey).toString('hex').replace(/^/, '0x')
    accounts.push({ secretKey: privKey, publicAddress: pubAddress, balance })
    acntNum--
    if (acntNum <= 1) return true
    return createAccounts()
  } catch (err) {
    console.log('### error in createAccounts', err)
  }
}

async function writeAccounts() {
  return new Promise((res, rej) => {
    fs.writeFile('./conf/accounts.json', JSON.stringify(accounts), 'utf8', err => {
      if (err) rej(err)
      res(true)
    })
  })
}

createAccounts().then(() => writeAccounts())
.then(() => console.log('### wrote accounts to ./conf/accounts.json'))
.catch(err => console.log('### error in account creation', err))
