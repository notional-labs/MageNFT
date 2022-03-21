## Start ipfs

```sh
ipfs daemon
```

## For update all image and metadata

```sh
yarn clean-images
yarn clean-metadata
```

This outputs an address you can use to instantiate your minter contract.

## Update data in metadata folder

```sh
ipfs add -r metadata --key=<ipns key in base uri>
```


