import * as fs from 'fs';

// Delete all files from images
export async function cleanImages() {
  const files = fs.readdirSync('images/');
  files.map((file) => {
      fs.unlinkSync(`images/${file}`);
  })
}

cleanImages();
