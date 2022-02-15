const cardano = require("./cardano");
const { WalletServer } = require('cardano-wallet-js');
// let walletServer = WalletServer.init('http://localhost:3001/v2');

// const network = async () => {
//   let information = await walletServer.getNetworkInformation();
//   console.log(information);
// }

// network()


// const wallets = ["one", "two", "three"];
const wallets = ["one"];

wallets.map((wallet) => {
    // try {
    //   console.log("Balance of ", wallet)
    //   const sender = cardano.wallet(wallet);
    //   console.log(sender.balance().value)

    //   console.log(cardano.toAda(sender.balance().value.lovelace));
    //   console.log("--------------------------")
    // } catch (e) {
    //   console.log(e)
    // }

    // try {
    //   const sender = cardano.wallet(wallet);
    //   const address = cardano.addressInfo(sender.paymentAddr);
    //   console.log(address.base16)
    //   // const sender = cardano.addressInfo('addr_test1vzdqfed3jp6l7ztgpm3a0zsz5ahsyuvnh4fdqy2lf7dksdq4k8pyn');
    //   // console.log(sender)
    // } catch (e) {
    //   console.log(e)
    // }

    try {
        // const sender = cardano.queryUtxo('addr_test1vzdqfed3jp6l7ztgpm3a0zsz5ahsyuvnh4fdqy2lf7dksdq4k8pyn');
        // console.log(sender)
        // const sender = cardano.addressInfo('addr_test1vzdqfed3jp6l7ztgpm3a0zsz5ahsyuvnh4fdqy2lf7dksdq4k8pyn');
        // console.log(sender)
        const query = cardano.queryTip()
        console.log(query)

    } catch (e) {
        console.log(e)
    }
});
