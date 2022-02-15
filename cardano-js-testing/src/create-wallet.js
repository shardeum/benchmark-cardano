const cardano = require('./cardano')

const createWallet = (account) => {
    const payment = cardano.addressKeyGen(account);
    const stake = cardano.stakeAddressKeyGen(account);
    cardano.stakeAddressBuild(account);
    // cardano.addressBuild(account, {
    //   paymentVkey: payment.vkey
    //   // stakeVkey: stake.vkey,
    // });
    cardano.addressBuild(account, {
        paymentVkey: payment.vkey
    });
    return cardano.wallet(account);
};

createWallet("one")
createWallet("two")
createWallet("three")
