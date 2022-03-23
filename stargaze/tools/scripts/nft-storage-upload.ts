import { getFilesFromPath } from 'files-from-path';
import fs from 'fs';
import { NFTStorage } from 'nft.storage';
import os from 'os';
import path from 'path';
import { naturalCompare } from '../src/sort';
import { checkFiles } from '../src/validation';

// Load config
const config = require('../config');

// Configure NFT.storage
const token = config.nftStorageApiKey;
const client = new NFTStorage({ token });

export async function nftStorageUpload() {
  // Config
  console.log(
    'Deploying files to IPFS via NFT.storage using the following configuration:'
  );
  console.log(config);

  const imagesBasePath = path.join(__dirname, '../images');

  // Get list of images and metadata
  const images = fs.readdirSync(imagesBasePath);
  // const metadata = fs.readdirSync(metadataBasePath);

  // Sort files (need to be in natural order)
  images.sort(naturalCompare);
  // metadata.sort(naturalCompare);

  // // Validation
  // checkFiles(images, metadata);

  // Upload images folder
  const imageFiles = await getFilesFromPath(imagesBasePath);
  const imagesBaseUri = await client.storeDirectory(imageFiles as any);

  // Create temp upload folder for metadata
  const tmpFolder = fs.mkdtempSync(path.join(os.tmpdir(), 'galaxy'));

  // Get metadata from csv file
  const csv = fs.readFileSync('csv/metadata.csv');
  const bufferString = csv.toString();
  const rows = bufferString.split('\n');
  const headers = rows[0].split(',');

  for(let i = 1; i < rows.length - 1; i++) {
    const data = rows[i].split(',');
    console.log(images[i - 1]);
    const fileName = getName(images[i - 1]);
    
    const attributes = [];
    attributes.push({
      display_type: "number",
      trait_type: "generation",
      value: i
    });
    for(let i = 1; i < headers.length; i++) {
      attributes.push({
        trait_type: headers[i],
        value: data[i]
      })
    }

    const metadata = {
      attributes: attributes,
      description: `Auto genesis metadata ${fileName}`,
      external_url: `https://example.com/?token_id=${fileName}`,
      image: `ipfs://${imagesBaseUri}/images/${images[i - 1]}`,
      name: `Collection image #${data[0]}`
    }

    const jsonData = JSON.stringify(metadata);
    fs.writeFileSync(`metadata/${fileName}`, jsonData);

    // Write updated metadata to tmp folder
    // We add 1, because token IDs start at 1
    fs.writeFileSync(`${tmpFolder}/${data[0]}`, jsonData);
  }

  // Update metadata with IPFS hashes
  // images.map(async (file, index: number) => {

  //   const fileName = getName(file)
  //   const metadata = {
  //     attributes: [
  //       {
  //         trait_type: "hat",
  //         "value": "bandana"
  //       },
  //       {
  //         trait_type: "glasses",
  //         "value": "sunglasses"
  //       },
  //       {
  //         trait_type: "personality",
  //         "value": "chill"
  //       },
  //       {
  //         trait_type: "shirt_color",
  //         "value": "purple"
  //       },
  //       {
  //         display_type: "number",
  //         trait_type: "generation",
  //         value: 1
  //       }
  //     ],
  //     description: `Auto genesis metadata ${fileName}`,
  //     external_url: `https://example.com/?token_id=${fileName}`,
  //     image: `ipfs://${imagesBaseUri}/images/${images[index]}`,
  //     name: "Shane Stargaze"
  //   }
  //   const jsonData = JSON.stringify(metadata);
  //   fs.writeFileSync(`metadata/${fileName}`, jsonData);

  //   // Write updated metadata to tmp folder
  //   // We add 1, because token IDs start at 1
  //   fs.writeFileSync(`${tmpFolder}/${index + 1}`, jsonData);
  // });

  // Upload tmpFolder
  const files = await getFilesFromPath(tmpFolder);
  const result = await client.storeDirectory(files as any);

  // Project will have been uploaded into a randomly name folder
  const projectPath = tmpFolder.split('/').pop();

  // Set base token uri
  const baseTokenUri = `ipfs://${result}/${projectPath}`;

  console.log('Images ipfs uri: ', `ipfs://${imagesBaseUri}/images`)
  console.log('Set this field in your config.js file: ');
  console.log('baseTokenUri: ', baseTokenUri);

  return {
    baseTokenUri,
  };
}

export function getName(dir: string): string {
  return dir.split('.')[0];
}

nftStorageUpload();