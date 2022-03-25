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

export async function nftStorageUpload(edition_name: string, clear: boolean) {
  // Config
  console.log(
    'Deploying files to IPFS via NFT.storage using the following configuration:'
  );
  console.log(config);

  const imagesBasePath = path.join(__dirname, `../../../generative-art-nft/output/edition ${edition_name}/images`);
  const csvBasePath = path.join(__dirname, `../../../generative-art-nft/output/edition ${edition_name}/metadata.csv`);

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
  const csv = fs.readFileSync(csvBasePath);
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

  // Upload tmpFolder
  const files = await getFilesFromPath(tmpFolder);
  const result = await client.storeDirectory(files as any);

  // Project will have been uploaded into a randomly name folder
  const projectPath = tmpFolder.split('/').pop();

  // Set base token uri
  const baseTokenUri = `ipfs://${result}/${projectPath}`;

  if(clear) {
    clearImages(edition_name);
    clearMetadata();
  }

  console.log('Images ipfs uri: ', `ipfs://${imagesBaseUri}/images`)
  console.log('Set this field in your config.js file: ');
  console.log('baseTokenUri: ', baseTokenUri);

  return {
    baseTokenUri,
  };
}

export function clearImages(edition_name: string) {
  const imagesBasePath = path.join(__dirname, `../../../generative-art-nft/output/edition ${edition_name}/images`);
  const files = fs.readdirSync(imagesBasePath);
  files.map((file) => {
      fs.unlinkSync(`${imagesBasePath}/${file}`);
  })
}

export function clearMetadata() {
  const files = fs.readdirSync('metadata/');
  files.map((file) => {
      fs.unlinkSync(`metadata/${file}`);
  })
}

export function getName(dir: string): string {
  return dir.split('.')[0];
}

const args = process.argv.slice(2);
if (args.length == 0) {
  console.log('No arguments provided, need --edition');
} else if (args.length == 2 && args[0] == '--edition') {
  nftStorageUpload(args[1], false);
} else if (args.length == 3 && args[0] == '--edition' && args[2] == '--clear') {
  nftStorageUpload(args[1], true);
} 