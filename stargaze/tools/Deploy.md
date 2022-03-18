## Setup project

```sh
git clone https://github.com/public-awesome/stargaze-tools
cd stargaze-tools
yarn install
```

## Create an account on testnet

```sh
yarn account
```

This outputs an address you can use to instantiate your minter contract.

## Get funds from faucet

Ask for funds from the `#faucet` channel in [Discord Stargaze](https://discord.gg/stargaze).

```
$request [address]
```

## Configure project

Copy `config.example.js` to `config.js`.
Edit `config.js` with your project configuration.

## Clear old image and metadata. If you still want to keep them, skip this step

```sh
yarn clean-images
yarn clean-metadata
```

## Move the images into the 'images' folder and upload to ipfs
```sh
yarn nft-storage-upload
```

## After getting the baseTokenUri from the above step, pass it to the config.js file. Modify the collection properties and run the command to initialize an NFT minting contract

```sh
yarn minter
```
