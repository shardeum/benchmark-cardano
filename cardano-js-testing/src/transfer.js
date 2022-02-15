const cardano = require("./cardano");

//carteiras

const wallets = ["one"];

wallets.map((wallet) => {
    const sender = cardano.wallet(wallet);
    console.log(
        "Balance of Sender wallet: " +
        cardano.toAda(sender.balance().value.lovelace) +
        " ADA"
    );

    //  carteira do drop
    const receiver = "addr_test1vzdqfed3jp6l7ztgpm3a0zsz5ahsyuvnh4fdqy2lf7dksdq4k8pyn";

    //  valor do drop
    const dropValue = 18;

    const txInfo = {
        txIn: cardano.queryUtxo(sender.paymentAddr),
        txOut: [
            {
                address: sender.paymentAddr,
                value: {
                    lovelace:
                        sender.balance().value.lovelace - cardano.toLovelace(dropValue),
                },
            },
            {
                address: receiver,
                value: {
                    lovelace: cardano.toLovelace(dropValue),
                },
            },
        ],
    };

    const raw = cardano.transactionBuildRaw(txInfo);

    const fee = cardano.transactionCalculateMinFee({
        ...txInfo,
        txBody: raw,
        witnessCount: 1,
    });

    txInfo.txOut[0].value.lovelace -= fee;

    const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

    const txSigned = cardano.transactionSign({
        txBody: tx,
        signingKeys: [sender.payment.skey],
    });

    const txHash = cardano.transactionSubmit(txSigned);

    console.log(txHash);
});
