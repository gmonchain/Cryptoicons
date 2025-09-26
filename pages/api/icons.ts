import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Data = { files?: string[]; error?: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === 'GET') {
    const iconsDirectory = path.join(process.cwd(), 'public', 'icons');
    try {
      const files = fs.readdirSync(iconsDirectory);
      const svgFiles = files.filter(file => file.endsWith('.svg'));
      res.status(200).json({ files: svgFiles });
    } catch (error) {
      console.error('Failed to read icons directory:', error);
      res.status(500).json({ error: 'Failed to read icons directory' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
