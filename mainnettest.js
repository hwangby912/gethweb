var Web3 = require('web3');
var web3 = new Web3('https://mainnet.infura.io');

web3.eth.getBlockNumber()
.then(number => {
    console.log(number);
})

/* web3.eth.getBlock(8430167)
.then(block =>{
    console.log(block);
}) */

web3.eth.getTransaction("0x353ebbcde015563b2a70a3cb94c46d10638746dbf1eb56a0cec9403517504856")
.then(tx => {
    console.log(tx);
})