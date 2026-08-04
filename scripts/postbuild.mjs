import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');

await mkdir(path.join(distDir, 'server'), { recursive: true });
await mkdir(path.join(distDir, '.openai'), { recursive: true });

await copyFile(path.join(root, 'index.js'), path.join(distDir, 'server', 'index.js'));
await copyFile(path.join(root, '.openai', 'hosting.json'), path.join(distDir, '.openai', 'hosting.json'));
