import { readdir } from 'fs/promises';

async function listFilesInDir(path = '.') {
  try {
    const files = await readdir(path);
    console.log('Files in directory:', files);
  } catch (err) {
    console.error('Error reading directory:', err);
  }
}

listFilesInDir('./'); // You can change './' to any path
