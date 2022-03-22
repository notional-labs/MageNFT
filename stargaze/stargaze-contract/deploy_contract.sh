#!/bin/bash

#NODE="tcp://localhost:2281"
NODE="https://rpc.castor-1.stargaze-apis.com:443"
ACCOUNT="hieuvu"
NFT_CONTRACT_DIR="artifacts/sg721.wasm"
MINTER_CONTRACT_DIR="artifacts/minter.wasm"
SLEEP_TIME="15s"
CHAIN_ID="castor-1"

#Code id for CW721 contract on Castor testnet, no need to restore
NFT_CODE_ID="1"
#Code id for Miner contract on Castor testnet, no need to restore
MINTER_CODE_ID="2"

INIT='{
  "base_token_uri": "ipfs://bafybeifieycaar2vgo3loqi3zgkzttsg5amnr2rsplzikg236l2omumsyq/metadata",
  "num_tokens": 10,
  "sg721_code_id": 1,
  "sg721_instantiate_msg": {
    "name": "Film TOken",
    "symbol": "FILM",
    "minter": "stars1gsrq05myhsxsks8mdy4wtm2ep05qk2m8twa0y3",
    "collection_info": {
	  "creator": "stars1gsrq05myhsxsks8mdy4wtm2ep05qk2m8twa0y3",
	  "description":"For test net",
      "image": "ipfs://QmXG7jzphfwXDw5acwoW8WqAjQKmBVSeEUoUcxyME1rxmG?filename=2020-07-28%2019-23-52_5042.jpg",
      "royalty_info": {
        "payment_address": "stars1gsrq05myhsxsks8mdy4wtm2ep05qk2m8twa0y3",
        "share": "0.1"
      }
    }
  },
  "per_address_limit": 1,
  "start_time": "1647501005586088965",
  "unit_price": {
    "amount": "100000000",
    "denom": "ustars"
  }
}'
INIT_JSON=$(starsd tx wasm instantiate "$MINTER_CODE_ID" "$INIT" --from "$ACCOUNT" --label "minter nft" -y --chain-id "$CHAIN_ID" --node "$NODE" --gas 10000000 --amount 1000000000ustars --no-admin -o json)

echo "INIT_JSON = $INIT_JSON"

if [ "$(echo $INIT_JSON | jq -r .raw_log)" != "[]" ]; then
	# exit
	echo "ERROR = $(echo $INIT_JSON | jq .raw_log)"
	exit 1
else
	echo "INSTANTIATE SUCCESS"
fi

# sleep for chain to update
sleep "$SLEEP_TIME"

RAW_LOG=$(starsd query tx "$(echo $INIT_JSON | jq -r .txhash)" --chain-id "$CHAINID" --node "$NODE" --output json | jq -r .raw_log)

echo "RAW_LOG = $RAW_LOG"

CONTRACT_ADDRESS=$(echo $RAW_LOG | jq -r .[0].events[0].attributes[0].value)

CONTRACT_DATA=$(starsd query wasm contract "$CONTRACT_ADDRESS" --node "$NODE" -o json)

echo "CONTRACT = $CONTRACT_DATA"

# sleep "$SLEEP_TIME"

# BALANCE="{"balance":{"address":"$(starsd keys show $ACCOUNT -a)"}}"

# BALANCE_QUERY=$(starsd query wasm contract-state smart "$CONTRACT_ADDRESS" "$BALANCE" --node "$NODE" -o json)

# echo "BALANCE = $BALANCE_QUERY"



# starsd query wasm contract-state smart "$CONTRACT_ADDRESS" '{"list_channels": {}}' --chain-id "$CHAINID" --node "$NODE"
