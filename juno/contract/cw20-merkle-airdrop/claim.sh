CONTRACT_ADDRESS="juno1tztaku686jpvnydc3gmu5j4agu3qhxxest8ml3xac225g76fxn3scj0xr4"
SNAP_SHOT="./testdata/airdrop_stage_2_list.json"
RECEIVER="juno10c2pnvjyngmt74268tg7lnp98skgfdkj9pm8ma"
RECEIVER_ACC="hieuvu"
SLEEP_TIME="15s"
RECEIVE_AMOUNT="100000"
MAGE_CW20="juno1hthjpmmjdeev6hkgvfzve0r2kvel5ca3ecr3x6y5t5r24xl4jprsy06v5d"
NODE="https://rpc.uni.juno.deuslabs.fi:443"
ACCOUNT="hieuvu"


##### GEN MERKLE_ROOT & MERKLE PROOF #####
MERKLE_ROOT=$(merkle-airdrop-cli generateRoot --file $SNAP_SHOT)
echo "MERKLE_ROOT = $MERKLE_ROOT"

MERKLE_PROOF=$(merkle-airdrop-cli generateProofs --file $SNAP_SHOT   --address $RECEIVER   --amount $RECEIVE_AMOUNT)
echo "MERKLE_PROOF = $MERKLE_PROOF"

##### CLAIM REWARD #####
BALANCE="{\"balance\":{\"address\":\"$RECEIVER\"}}"
BALANCE_BEFORE=$(junod query wasm contract-state smart "$MAGE_CW20" "$BALANCE" --node "$NODE" -o json)

echo "BALANCE BEFORE= $BALANCE_BEFORE"

REGIST_MESSAGE="{\"register_merkle_root\":{\"merkle_root\":\"$MERKLE_ROOT\"}}"
REGIST=$(junod tx wasm execute $CONTRACT_ADDRESS "$REGIST_MESSAGE" --from $ACCOUNT --node $NODE --gas 35000000 --fees 100000ujunox)
echo $REGIST
sleep "$SLEEP_TIME"


CLAIM_MESSAGE="{\"claim\":{\"stage\":1, \"amount\":\"$RECEIVE_AMOUNT\", \"proof\":$MERKLE_PROOF}}"
CLAIM=$(junod tx wasm execute $CONTRACT_ADDRESS "$CLAIM_MESSAGE" --from $RECEIVER_ACC --node $NODE --gas 35000000 --fees 100000ujunox)
echo $CLAIM
sleep "$SLEEP_TIME"


##### CHECK RECEIVER BALANCE #####

BALANCE="{\"balance\":{\"address\":\"$RECEIVER\"}}"

BALANCE_LATER=$(junod query wasm contract-state smart "$MAGE_CW20" "$BALANCE" --node "$NODE" -o json)

echo "BALANCE LATER= $BALANCE_LATER"