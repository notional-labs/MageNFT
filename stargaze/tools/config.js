/*
 * This is the main config for your NFT sale.
 *
 * Fill this out with all your project details.
 */

module.exports = {
    //// ACCOUNT INFO ////
    // The account seed phrase to use for deployment
    mnemonic:
      'bundle lawn pear joke draft antique ignore fade reunion crisp pet december useful honey balance acoustic attack coffee comfort cream artefact olive omit vessel',
    // Your STARS address
    account: 'stars1gsrq05myhsxsks8mdy4wtm2ep05qk2m8twa0y3',
  
    //// API CONFIG ////
    // The RPC endpoint for Stargaze, Big Bang Testnet
    rpcEndpoint: 'https://rpc.castor-1.stargaze-apis.com/',
    // The RPC endpoint for Stargaze, mainnet
    // rpcEndpoint: 'https://rpc.stargaze-apis.com/',
    // NFT.storage endpoint
    nftStorageEndpoint: 'https://api.nft.storage',
    // NFT.storage API key
    nftStorageApiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDZGN2ViYTJDMjRmQWQyYkQyMjhFYjg2NjQzZEY5ZkQ3N0MyZTk5ZkMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY0NzQ4Njg2MTY2NCwibmFtZSI6IlN0YXJnYXplIHRlc3QgbmV0In0.eLFsixdL6uDwBCj_nW-PBmXFKziVopZHMerbApiWfG8',
    // Pinata API Key (optional)
    pinataApiKey: '',
    // Pinata Secret Key (optional)
    pinataSecretKey: '',
  
    //// COLLECTION INFO ////
    // The name of your collection
    name: 'Kodak Film Collection',
    // The 3-7 letter ticker symbol for your collection
    symbol: 'KODAK',
    // Project description
    description: 'Photos on Kodak rolls',
    // Link to image to use as the main image for the collection.
    // Either IPFS or valid http links allowed. Gif compatible.
    // (at least 500 x 500 pixels)
    image:
      'ipfs://bafybeigi3bwpvyvsmnbj46ra4hyffcxdeaj6ntfk5jpic5mx27x6ih2qvq/images/1.png',
    // External_link is optional. Gif compatible
    //   external_link:
    // 'https://c.tenor.com/o656qFKDzeUAAAAC/rick-astley-never-gonna-give-you-up.gif',
    // The address for royalites to go to (may be the same as `account`)
    // Comment out both below if not using royalites
    royaltyPaymentAddress: 'stars1gsrq05myhsxsks8mdy4wtm2ep05qk2m8twa0y3',
    // Royalty share: 1 = 100%, 0.1 = 10%
    royaltyShare: '0.1',
  
    //// WHITELIST CONTRACT (OPTIONAL) ////
    // A list of whitelisted addresses that will be able to purchase the sale early
    // Comment out if not using a whilelist
    // whitelist: ['stars1..', 'stars1...'],
    // The date when the whitelist only purchasing period ends and everyone can buy (in ISO format)
    // whitelistStartTime: '2022-03-11T21:00:00.000Z',
    // whitelistEndTime: '2022-03-13T21:00:00.000Z',
    // The price (in STARS) for the whitelist (minimum 25 STARS)
    // whitelistPrice: 50,
    // The Per Address Limit during whitelist period this can be different than the main public limit
    // whitelistPerAddressLimit: 5,
    // The number of members in the whitelist (max 5000, each 1000 is 100 STARS)
    // whitelistMemberLimit: 100,
    // The contract address for your whitelist contract
    // Get this after running `yarn whitelist`
    // whitelistContract: 'stars1...',
  
    //// MINTER CONTRACT ////
    // The base URI to be used to programatically mint tokens
    baseTokenUri: 'ipns://k51qzi5uqu5dkf2vg52t31za1pxqsjyn5ifj6meipphr8novezbostrgu6f3xl',
    // The number of tokens to mint
    numTokens: 5,
    // The price (in STARS) for your NFTs (minimum 50 STARS)
    unitPrice: 50,
    // The max amount of NFTs an address can mint
    perAddressLimit: 1,
    // The date when the sale goes live
    // If whitelist is enabled, only whitelisted addresses will be able to purchase
    // startTime in ISO format
    startTime: '2022-03-21T15:00:00.000Z',
    // The minter contract address
    // Get this after running `yarn minter`
    minter: 'stars1...',
    // SG721 contract address
    // Get this after running `yarn minter`
    sg721: 'stars1...',
  
    //// CONTRACT CODE IDs: Big Bang Testnet ////
    // The code ID for sg721
    sg721CodeId: 1,
    // The code ID for the minter contract
    minterCodeId: 2,
    // The code ID for the whitelist contract
    whitelistCodeId: 3,
  
    // //// CONTRACT CODE IDs: Mainnet ////
    // // The code ID for sg721
    // sg721CodeId: 1,
    // // The code ID for the minter contract
    // minterCodeId: 2,
    // // The code ID for the whitelist contract
    // whitelistCodeId: 3,
  };
  