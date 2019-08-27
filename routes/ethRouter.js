var express = require('express');
var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

var router = express.Router();

/* GET home page. */
/* url : /eth */
router.get('/', async function (req, res, next) {
     var blockNumber = await web3.eth.getBlockNumber();
     //var showCount = 10;
     var blockList = [];

     // var startNum = 0;
     // var endNum = blockNumber;

     /*  if (blockNumber > showCount) {
        startNum = blockNumber - showCount;
      } */
     var startNum = 239;
     var endNum = 283;


     for (let i = startNum; i < endNum; i++) {
          let block = await web3.eth.getBlock(i);
          blockList.push(block);
     }

     //console.log('blockNumber : ', blockNumber);
     //console.log('blocks : ', JSON.stringify(blockList, null, 2));

     res.render('blockchain', { blocks: blockList, title: "blockchain", selectedIdx: startNum, txs: [] });
});


router.get('/test', function (req, res, next) {
     web3.eth.getBlockNumber()
          .then(number => {
               console.log(number);
               res.json(number);
          })
})



router.get('/accountlist', function (req, res, next) {
     let accountList = [];
     web3.eth.getAccounts().then(async (accounts) => {
          for (let i = 0; i < accounts.length; i++) {
               await web3.eth.getBalance(accounts[i]).then((balance) => {
                    accountList.push({
                         WalletAddress: accounts[i],
                         balance: web3.utils.fromWei(balance, "ether")
                    });
               });
          };
          res.render('accountlist', { accounts: accountList })
     });
});

router.get('/createaccount', function (req, res, next) {

     web3.eth.personal.newAccount("eth")
          .then(() => {
               res.redirect('/eth/accountlist');
          })
          .catch(() => {
               console.log("ERR:create account errer");
               res.redirect('/eth/accountlist');
          })

})

router.get('/block/:idx', function (req, res, next) {
     const selectedIdx = req.params.idx;
     let blocklist = [];
     let transactionlist = [];

     web3.eth.getBlockNumber().then(async (BlockNumber) => {
          console.log("BlockNumber : ", BlockNumber);
          for (var i = 239; i <= 282; i++) {
               await web3.eth.getBlock(i).then((Block) => {
                    console.log("Block : ", Block);
                    blocklist.push({
                         parentHash: Block.parentHash,
                         hash: Block.hash,
                         number: Block.number,
                         nonce: Block.nonce,
                         timestamp: Block.timestamp
                    });
               }).catch((err) => {
                    console.log("getBlock err : ", err);
               });
          };

          web3.eth.getBlock(selectedIdx).then(async (Block) => {
               console.log("Block : ", Block);
               console.log("Block.transactions : ", Block.transactions);
               console.log("Block.transactions.length : ", Block.transactions.length);
               for (var i = 0; i < Block.transactions.length; i++) {
                    await web3.eth.getTransaction(String(Block.transactions[0])).then((Transaction) => {
                         console.log("Transaction : ", Transaction);
                         transactionlist.push({
                              fromAddress: Transaction.from,
                              toAddress: Transaction.to,
                              amount: Transaction.value
                         });

                    }).catch((err) => {
                         console.log("getTransaction err : ", err);
                    });
               }
               res.render('blockchain', {
                    blocks: blocklist,
                    selectedIdx: selectedIdx,
                    txs: transactionlist
               });
          }).catch((err) => {
               console.log("getBlock : ", err);

          });
     }).catch((err) => {
          console.log("getBlockNumber err : ", err);

     });
});

router.get('/wallet/:address', function (req, res, next) {
     const address = req.params.address;
     let transactionlist = [];

     web3.eth.getBlockNumber().then(async (BlockNumber) => {

          for (let i = 0; i <= BlockNumber; i++) {

            await web3.eth.getBlock(i).then((block) => {
                    block.transactions.forEach((el) => {
                         web3.eth.getTransaction(el).then((tx) => {
                              if(address == tx.from || address == tx.to) {
                                   transactionlist.push({
                                        fromAddress: tx.from,
                                        toAddress: tx.to,
                                        blockNumber: tx.blockNumber,
                                        amount: tx.value,
                                   });
                              }
                         }).catch((err) => {
                              console.log("getTransaction err : ", err);
                         });
                         console.log("transactionlist : ", transactionlist);
                    });
               }).catch((err) => {
                    console.log("getTransaction err : ", err);
               });
          };
          let balance = await web3.eth.getBalance(address);
          console.log("balance : ", balance);
          res.render('wallet', {
               address: address,
               txs: transactionlist,
               balance: balance
          });
     });
});

router.get('/createtx', function (req, res, next) {
     web3.eth.getCoinbase().then((wallet) => {
          res.render('createtx', { wallet: wallet });
     })
})

router.post('/createtx', function (req, res, next) {
     const fromAddress = req.body.fromAddress;
     const toAddress = req.body.toAddress;
     const amount = req.body.amount;
     const keystore = {"address":"8f30db011e6f3d92538bac8452ee907eebe04e3a","crypto":{"cipher":"aes-128-ctr","ciphertext":"1e451b4c0e4e5e2e0f2d028c58b8855cd6761fb84a0ec2eca6c310d7c4202efa","cipherparams":{"iv":"3097ad8b5d3808d2bbb5ae1d62ecea38"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"27bf30ae680e869073ddf4bcd913cdca688f636d028d46999ce9b8cf2b40dd24"},"mac":"1754d5de6ee2310273b29019a8a285d88efff34556e0bacd5614b66bc20cfe76"},"id":"a4aed727-b5e6-48c2-99d6-b94997b8bccb","version":3};
     const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth');

     console.log('fromAddress : ', fromAddress);
     console.log('toAddress : ', toAddress);
     console.log('amount : ', amount);

     async function sendTransaction(fromAddress, toAddress, amount) {
          var txPrams = {
               from: fromAddress,
               to: toAddress,
               value: amount,
               gas: web3.utils.toHex(0x21000)
          }

          var signedTx = await decryptAccount.signTransaction(txPrams);
          console.log(signedTx);


          web3.eth.sendSignedTransaction(signedTx.rawTransaction)
               .once('transactionHash', (hash) => {
                    console.log("hash : " + hash);
               })
     }
     sendTransaction(fromAddress, toAddress, amount);
     res.redirect('/eth/accountlist');
})


router.get('/pendingtransaction', function (req, res, next) {
     let txs = web3.eth.pendingtransaction;
     console.log("txs : " + txs);
     res.render('pendingtransaction', { txs: txs });
})


router.get('/miningblock', function (req, res, next) {
     mychain.minePendingTransactions(wallet1);
     console.log('blocked mined...');
     res.redirect('/eth');
})

router.get('/setting', function (req, res, next) {
     res.render('setting', {});
})

router.post('/setting', function (req, res, next) {
     const difficulty = req.body.difficulty;
     const reward = req.body.reward;

     console.log('difficult : ', difficulty);
     console.log('reward : ', reward);

     mychain.difficulty = parseInt(difficulty);
     mychain.miningReward = parseInt(reward);

     console.log(mychain);

     res.redirect('/eth/setting');
})

module.exports = router;