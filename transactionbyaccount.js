var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

async function getTransactionByAccount(myaccount, startBlockNumber, endBlockNumber) {
    console.log('Transaction By Account');
    console.log('Account : ', myaccount);
    console.log('Block : ', startBlockNumber, ' - ', endBlockNumber);

    for (let i = startBlockNumber; i <= endBlockNumber; i++) {
        let block = await web3.eth.getBlock(i);
        /*         if(block.transactions.length > 0){
                    console.log(block);
                    break;
                } */

        if (block != null && block.transactions != null) {
            block.transactions.forEach(async (el) => {
                let tx = await web3.eth.getTransaction(el);
                //console.log(tx);
                console.log("tx hash : ", tx.hash);
                console.log("   nonce : ", tx.nonce);
                console.log("   blocknumber : ", tx.blockNumber);
                console.log("   from : ", tx.from);
                console.log("   to : ", tx.to);
            })
        }
    }
}

//0번 계정 , 트랜잭션이 있는 BlockNumber, endNumber
getTransactionByAccount("0x1664c7dabe2f932b37b28c53ffc32eba47ad8e7e", 239, 282 ); 