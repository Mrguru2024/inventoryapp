import { execSync } from 'child_process';
import { existsSync } from 'fs';

export async function findChromePath(): Promise<string> {
  if (process.platform === 'darwin') {
    try {
      // Try to find Chrome using mdfind
      const path = execSync('mdfind "kMDItemCFBundleIdentifier == com.google.Chrome"').toString().trim().split('\n')[0];
      if (path && existsSync(path + '/Contents/MacOS/Google Chrome')) {
        return path + '/Contents/MacOS/Google Chrome';
      }
    } catch (e) {
      console.log('mdfind failed, trying default paths');
    }

    // Default macOS Chrome paths
    const defaultPaths = [
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      '/Applications/Chromium.app/Contents/MacOS/Chromium',
    ];

    for (const path of defaultPaths) {
      if (existsSync(path)) {
        return path;
      }
    }
  }

  throw new Error('Chrome not found');
} 