const keythereum = require('keythereum')
const fs = require('fs')
const { privateToAddress } = require('ethereumjs-util')

const params = { keyBytes: 32, ivBytes: 16 }
let accountNum = 10
let accounts = []

async function createAccounts() {
  try {
    const pk = keythereum.create(params).privateKey.toString('hex').replace(/^/, '0x')
    console.log('pk', pk)
    return pk
  } catch (err) {
    console.log('### error in createAccounts', err)
  }
}

createAccounts().then(() => {})
