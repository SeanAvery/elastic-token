const fs = require('fs')
const RPC = require('ethereumjs-testrpc')

async function readAccounts() {
  return new Promise((res, rej) => {
    fs.readFile('./conf/accounts.json', (err, data) => {
      if (err) rej(err)
      res(data.toString('utf8'))
    })
  })
}

readAccounts()
.then(acts => {
  const server = RPC.server({ 'accounts': JSON.parse(acts) })
  server.listen('8547', (err, chain) => {
    if (err) console.log9('### error in rpc server', err)
    console.log('### tesrpc listening on port 8547')
  })
})
