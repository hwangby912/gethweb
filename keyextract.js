var Web3 = require('web3');
var web3 = new Web3('http://localhost:8545');

const keystore = {"address":"32c56733861373610195b0119f8e86e1a2052611","crypto":{"cipher":"aes-128-ctr","ciphertext":"8526e49d55f273247e440cf52c0a71cc0a4187b9b0c4527d5f2bf00484fdb95d","cipherparams":{"iv":"3f14cf539a9f65157c41c979ae031885"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"e84c150180ea4c15e2460761287a652e492e8f2391fd7d0606a7989837f09ad4"},"mac":"947975ddb4ecbe959821deb227861f218bbd4f9b87c86ee70d371be24609e694"},"id":"6ca07a9d-3b98-4473-81c8-999321c744a5","version":3}
const decryptAccount = web3.eth.accounts.decrypt(keystore, 'eth'); // 2번째 인자는 암호값
console.log(decryptAccount.privateKey);

// privateKey = 0x7894374c37bf3a7e931b7f84f694c8a20788289ff4296cf3c17fa60d8db1f2e0

var fromAddress = '0xab6196dd71f5a3b297704717166927dd41b5828a';
var toAddress = '0xd3a28a28c01f700e1e279a1c99bf6f14ea713128';
var amount = web3.utils.toHex(11111111111112);

async function sendTransaction(fromAddress, toAddress, amount) {
    var txPrams = {
        from : fromAddress,
        to : toAddress,
        value : amount,
        gas : web3.utils.toHex(0x21000)
    }
    
    var signedTx = await decryptAccount.signTransaction(txPrams);
    console.log(signedTx);

    web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    .once('transactionHash', (hash) => {
        console.log(hash);
    })
}

sendTransaction(fromAddress, toAddress, amount);

