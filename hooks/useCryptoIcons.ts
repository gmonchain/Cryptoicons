import { useState, useEffect } from 'react';
import { CryptoIcon } from '../types';

interface UseCryptoIconsResult {
  icons: CryptoIcon[];
  loading: boolean;
  error: string | null;
}

// A helper function to format the icon data from file names
const formatIconData = (fileNames: string[]): CryptoIcon[] => {
  return fileNames.map(fileName => {
    const nameWithoutExtension = fileName.replace('.svg', '');
    let displayName = nameWithoutExtension;
    let symbol = '';

    // Attempt to parse names like "Crypto Name (SYMBOL).svg"
    const match = nameWithoutExtension.match(/(.*)\s\(([^)]+)\)$/);
    if (match) {
      displayName = match[1].trim();
      symbol = match[2].trim();
    } else {
      // Fallback for names like "crypto-name.svg"
      displayName = nameWithoutExtension.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      symbol = nameWithoutExtension.toUpperCase(); // Placeholder, might not be accurate
    }

    return {
      name: nameWithoutExtension, // Use the file name as a unique identifier
      fileName: fileName,
      path: `/icons/${fileName}`, // Correct path to the public directory
      displayName: displayName,
      symbol: symbol,
    };
  });
};

export const useCryptoIcons = (): UseCryptoIconsResult => {
  const [icons, setIcons] = useState<CryptoIcon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIcons = async () => {
      try {
        // In a real application, you would fetch this list from a backend endpoint
        // or use a build-time script to generate a manifest.
        // For this example, we'll simulate fetching file names.
        const response = await fetch('/api/icons');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const iconFileNames = data.files || [];

        // For now, I'm hardcoding a few based on the earlier list_dir output
        // 'ZKSwap (ZKS).svg',
        // 'Zilliqa (ZIL).svg',
        // 'ZEON (ZEON).svg',
        // 'Zenon (ZNN).svg',
        // 'Zelwin (ZLW).svg',
        // 'Zel (Zel).svg',
        // 'Zclassic (Zcl).svg',
        // 'Zcash (ZEC).svg',
        // 'ZB Token (ZB).svg',
        // 'Yoyow (Yoyow).svg',
        // 'yOUcash (YOUC).svg',
        // 'yearn.finance (YFI).svg',
        // 'XYO (XYO).svg',
        // 'Xtrabytes (Xby).svg',
        // 'XRP (XRP).svg'

        const formattedIcons = formatIconData(iconFileNames);
        setIcons(formattedIcons);
      } catch (err) {
        setError('Failed to load crypto icons.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIcons();
  }, []);

  return { icons, loading, error };
};