
// Load config
const config = require('../config');
import * as fs from 'fs';

// Configure NFT.storage
const base_uri = config.baseTokenUri;

// Delete all files from NFT.storage
export async function cleanMetadata() {
  const files = fs.readdirSync('metadata/');
  files.map((file) => {
      fs.unlinkSync(`metadata/${file}`);
  })
}

cleanMetadata();
