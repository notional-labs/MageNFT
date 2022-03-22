
// Load config
const config = require('../config');
import * as fs from 'fs';

// Configure NFT.storage
const base_uri = config.baseTokenUri;

// Delete all files from NFT.storage
export async function convert() {
  const file = fs.readFileSync('csv/metadata.csv');
  const baseIpfs = getBaseIpfs(base_uri);
  const bufferString = file.toString();
  const rows = bufferString.split('\n');
  const headers = rows[0].split(',');
  for(let i = 1; i < rows.length; i++) {
    const data = rows[i].split(',');
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
            value: Number(data[0])
          }
        ],
        description: `Auto genesis metadata ${data[0]}`,
        external_url: `https://example.com/?token_id=${data[0]}`,
        image: `${baseIpfs}/images/1.png`,
        name: "Shane Stargaze"
      }
      const jsonData = JSON.stringify(metadata);
      fs.writeFileSync(`metadata/${data[0]}`, jsonData);
  }
  console.log(rows);
  

}

export function getBaseIpfs(base_uri: string): string {
    return base_uri.replace('/metadata','');
}

convert();
