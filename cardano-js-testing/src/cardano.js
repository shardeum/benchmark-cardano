const CardanocliJs = require("cardanocli-js");
const os = require("os");
const path = require("path");
const { Cardano } = require('@cardano-sdk/core');

// const dir = path.join(os.homedir(), "Cardano/cardano-node/example/");
const shelleyPath = path.join(
    os.homedir(),
    "Cardano/cardano-node/example/shelley",
    "genesis.json"
);

const cardanocliJs = new CardanocliJs({
    //   era: "mary",
    network: `testnet-magic 42`,
    // dir,
    shelleyGenesisPath: shelleyPath,
    socketPath: path.join(os.homedir(), "Cardano/cardano-node/example/node-bft1", "node.sock"),
    // socketPath: path.join(os.homedir(), "Cardano/cardano-private-testnet-setup/private-testnet/node-bft1", "node.sock"),
});

module.exports = cardanocliJs