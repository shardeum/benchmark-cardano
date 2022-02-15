## Cardano TPS Test for Coin Transfer

##### Hardware: dedicated server at `nocix.net`

- Processor 2x E5-2660 @ 2.2GHz / 3GHz Turbo 16 Cores / 32 thread
- Ram 96 GB DDR3
- Disk 960 GB SSD
- Bandwidth 1Gbit Port: 200TB Transfer
- Operating System Ubuntu 18.04 (Bionic)

##### Network setup

- A network of 5 nodes was run.
- All nodes used the same IP, but different ports
- All nodes had mining turned on; each was a block producer

##### Issues found in this network.

- Although we were able to set accounts in genesis block for funds and make transactions, we were not able to get block info ( block timestamp, txs included in the block, etc ).
- Tried using cardano-db-sync for that, but still ran into issues.

##### Instructions to recreate this test

1.  Install required tools and dependencies.
    1. [https://developers.cardano.org/docs/get-started/installing-cardano-node](https://developers.cardano.org/docs/get-started/installing-cardano-node)
    2. We need to follow the instructions till we got _cardano-cli_ and _cardano-node \_in our machine_.\_
    3. This process takes quite some time to install successfully in the machine.
2.  Now we can start the 3 nodes network with _[cardano-node](https://github.com/input-output-hk/cardano-node)_ source. Go to _cardano-node/scripts/_ and start the network in Alonzo era (latest phase at the time of writing time and also it supports smart contract) with the following commands. This will create its data in _cardano-node/example_.
    1. Configure the network.
       - ./scripts/byron-to-alonzo/mkfiles.sh alonzo
    2. To fund accounts and run transactions, look into step.4(1).
    3. Start the network.
       - ../example/run/all.sh
         Make sure there is no error line in the logs. Sometimes there can be issues when the server is started late.
    4. Clean the network. Make sure you have cleaned this when you run a new network.
       - rm -fr example logs
3.  Some useful commands to interact with the network.

    1.  ```
        CARDANO_NODE_SOCKET_PATH=$HOME/Cardano/cardano-node/example/node-bft1/node.sock \
        cardano-cli query protocol-parameters --testnet-magic 42
        ```

    2.  ```
        CARDANO_NODE_SOCKET_PATH=$HOME/Cardano/cardano-node/example/node-bft1/node.sock \
        cardano-cli query protocol-parameters --testnet-magic 42
        ```

    3.  ```
        CARDANO_NODE_SOCKET_PATH=example/node-bft1/node.sock \
        cardano-cli query utxo --address $(cat example/addresses/user1.addr) --testnet-magic 42
        ```

4.  Temporary script for running transactions to the network

    1. [https://gitlab.com/shardeum/smart-contract-platform-comparison/cardano](https://gitlab.com/shardeum/smart-contract-platform-comparison/cardano)
    2. cd cardano-js-testing && npm install
    3. Create wallet for accounts [one, two, three] for testing purposes.
       - node src/create-wallets.js
    4. Get these account’s base64 addresses to put in the genesis. So that they have some balance.
       - node src/get-addresses.js
    5. Add these accounts in the cardano-node/example/shelly/genesis.json. Start the network.

       ```
       "initialFunds": {
              "60cc882f3b1eee26420783f57ec01ac06f862b6a9858c444c1b37b3478": 900000000000,
              ...New addresses
       },
       ```

    6. Run some transactions.
       - node src/transfer.js
    7. Get the network info.
       - node src/get-network.js

5.  I find we are not able get the blockInfo (block timestamp, txCount, etc ) from the network with the cardano-js. I look into _[cardano-db-sync](https://github.com/input-output-hk/cardano-db-sync)_ to get info from it. But ran into issues when connecting it to the network.
6.  Install cardano-db-sync and required dependencies in the machine.

    1.  [https://github.com/input-output-hk/cardano-db-sync/blob/master/doc/building-running.md](https://github.com/input-output-hk/cardano-db-sync/blob/master/doc/building-running.md)
    2.  Also, reference this [https://github.com/woofpool/cardano-private-testnet-setup](https://github.com/woofpool/cardano-private-testnet-setup).
    3.  sudo apt-get install libpq-dev
    4.  sudo apt-get install postgresql postgresql-contrib
    5.  To enter postgres sql session → sudo -u postgres psql
    6.  To exit
        > \q
    7.  To create new Postgres role for your linux user account

        > sudo -u postgres createuser --interactive
        >
        > \# enter your linux user account
        >
        > Enter name of role to add: <your_linux_user_account_name>
        >
        > Shall the new role be a superuser? (y/n) y

    8.  Some useful psql command needed for the network
        - sudo -u postgres psql
        - \du (display users)
        - CREATE DATABASE testnet; (create database named testnet)
        - DROP DATABASE testnet; (delete database named testnet)
        - \l (list the databases)
        - \q (exit the session)
    9.  git clone https://github.com/input-output-hk/cardano-db-sync
    10. cd cardano-db-sync
    11. git fetch --tags --all
    12. git checkout $(curl -s https://api.github.com/repos/input-output-hk/cardano-db-sync/releases/latest | jq -r .tag_name)
    13. cabal build cardano-db-sync
    14. sudo cp -p $(find dist-newstyle/build -type f -name "cardano-db-sync") /usr/local/bin/cardano-db-sync
    15. If config/pgpass-test file does not exist, create that with the following content.

        ```
        /var/run/postgresql:5432:testnet:*:*
        ```

    16. Copy config/mainnet-config.yaml as config/private-config.yaml for our local network and edit some info.

        - Set _NetworkName: Testnet_
        - For NodeConfigFile, direct to _cardano-node_ path.
          _NodeConfigFile: ../../cardano-node/example/configuration.yaml_

    17. We need to add some info in the _cardano-node/example/configuration.yaml_ file.

        1. cardano-cli byron genesis print-genesis-hash --genesis-json example/byron/genesis.json
        2. cardano-cli genesis hash --genesis example/shelley/genesis.json
        3. cardano-cli genesis hash --genesis example/shelley/genesis.alonzo.json
        4. Add these hashes to the end of file. eg.

           ```
           ByronGenesisHash: acd0ea72270fee943b2857d53402947c21855a8fdb953281f682ada2e7cf2761
           ShelleyGenesisHash: 702533cf1011d742adc716ac4a9f6b49e82d6178834f42b2b1e7e26759d88a4e
           AlonzoGenesisHash: 19ae1f9e3c1845056c5c40cacc5a5d9c90e5102b692b5636a160f62624d65854
           EnableLogMetrics: False
           EnableLogging: True
           ```

    18. If the cardano network is running, we can now start the network from _cardano-node-sync_ repo.

        ```

        PGPASSFILE=config/pgpass-testnet cabal run cardano-db-sync -- \
            --config config/private-config.yaml \
            --socket-path ../cardano-node/example/node-bft1/node.sock \
            --state-dir ledger-state/testnet \
            --schema-dir schema
        ```

    19. If you ran into DB issues, look into step.6(8) to solve some issues.
    20. The data are not synced/stored well yet, not sure why. Try some commands shown in this doc and the data is not received.
        [https://github.com/input-output-hk/cardano-db-sync/blob/master/doc/interesting-queries.md](https://github.com/input-output-hk/cardano-db-sync/blob/master/doc/interesting-queries.md)
