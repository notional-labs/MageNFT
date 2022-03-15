#!/bin/bash

#NODE="tcp://localhost:2281"
NODE="https://rpc.uni.juno.deuslabs.fi:443"
#ACCOUNT="test"
ACCOUNT="hieuvu"
CHAINID="uni-2"
CONTRACT_DIR="artifacts/cw_erc20.wasm"
SLEEP_TIME="15s"

RES=$(junod tx wasm store "$CONTRACT_DIR" --from "$ACCOUNT" -y --output json --node "$NODE" --gas 35000000 --fees 100000ujunox -y --output json)
echo $RES

if [ "$(echo $RES | jq -r .raw_log)" != "[]" ]; then
	# exit
	echo "ERROR = $(echo $RES | jq .raw_log)"
	exit 1
else
	echo "STORE SUCCESS"
fi

TXHASH=$(echo $RES | jq -r .txhash)

echo $TXHASH

# sleep for chain to update
sleep "$SLEEP_TIME"

RAW_LOG=$(junod query tx "$TXHASH" --chain-id "$CHAINID" --node "$NODE" -o json | jq -r .raw_log)

echo $RAW_LOG

CODE_ID=$(echo $RAW_LOG | jq -r .[0].events[1].attributes[0].value)

echo $CODE_ID

# INIT='{"name":"Poodle Coin","symbol":"POOD","decimals":6,"initial_balances":[{"address":"juno10c2pnvjyngmt74268tg7lnp98skgfdkj9pm8ma","amount":"12345678000"}]}'
INIT="{\"name\": \"Mage Coin\", \"symbol\": \"MAGE\", \"decimals\":6, \"initial_balances\":[{\"address\":\"$(junod keys show $ACCOUNT -a)\",\"amount\":\"12345678000\"}]}"
INIT_JSON=$(junod tx wasm instantiate "$CODE_ID" "$INIT" --from "$ACCOUNT" --label "junod-cw20" -y --node "$NODE" --gas 180000 --fees 100000ujunox -o json)

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

RAW_LOG=$(junod query tx "$(echo $INIT_JSON | jq -r .txhash)" --chain-id "$CHAINID" --node "$NODE" --output json | jq -r .raw_log)

echo "RAW_LOG = $RAW_LOG"

CONTRACT_ADDRESS=$(echo $RAW_LOG | jq -r .[0].events[0].attributes[0].value)

CONTRACT_DATA=$(junod query wasm contract "$CONTRACT_ADDRESS" --node "$NODE" -o json)

echo "CONTRACT = $CONTRACT_DATA"

sleep "$SLEEP_TIME"

BALANCE="{\"balance\":{\"address\":\"$(junod keys show $ACCOUNT -a)\"}}"

BALANCE_QUERY=$(junod query wasm contract-state smart "$CONTRACT_ADDRESS" "$BALANCE" --node "$NODE" -o json)

echo "BALANCE = $BALANCE_QUERY"



# junod query wasm contract-state smart "$CONTRACT_ADDRESS" '{"list_channels": {}}' --chain-id "$CHAINID" --node "$NODE"
