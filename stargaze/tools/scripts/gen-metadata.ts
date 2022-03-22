
// Load config
const config = require('../config');
import * as fs from 'fs';

// Configure NFT.storage
const base_uri = config.baseTokenUri;

// Delete all files from NFT.storage
export async function genMetadata() {
  const files = fs.readdirSync('images/');
  const baseIpfs = getBaseIpfs(base_uri);
  files.map((file) => {
      const fileName = getName(file)
      const metadata = {
        attributes: [
          // {
          //   trait_type: "hat",
          //   value: "bandana"
          // },
          // {
          //   trait_type: "glasses",
          //   value: "sunglasses"
          // },
          // {
          //   trait_type: "personality",
          //   value: "chill"
          // },
          // {
          //   trait_type: "shirt_color",
          //   value: "purple"
          // },
          {
            display_type: "number",
            trait_type: "generation",
            value: Number(fileName)
          }
        ],
        description: `Auto genesis metadata ${fileName}`,
        external_url: `https://example.com/?token_id=${fileName}`,
        image: `${baseIpfs}/images/1.png`,
        name: "Shane Stargaze"
      }
      const jsonData = JSON.stringify(metadata);
      fs.writeFileSync(`metadata/${fileName}`, jsonData);
  })
}

export function getName(dir: string): string {
    return dir.split('.')[0];
}

export function getBaseIpfs(base_uri: string): string {
    return base_uri.replace('/metadata','');
}

genMetadata();
