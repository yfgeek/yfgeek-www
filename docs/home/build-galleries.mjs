import { readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), 'assets', 'galleries');
const imagePattern = /\.(?:avif|bmp|gif|jpe?g|png|webp)$/i;

async function listImages(directory, base = directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listImages(path, base));
    else if (imagePattern.test(entry.name)) files.push(relative(base, path));
  }
  return files.sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

const manifest = {};
for (const gallery of ['travel', 'food']) {
  const directory = resolve(root, gallery);
  manifest[gallery] = (await listImages(directory)).map(path => path.replaceAll('\\', '/'));
}

await writeFile(join(root, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Updated gallery manifest: ${manifest.travel.length} travel, ${manifest.food.length} food`);
