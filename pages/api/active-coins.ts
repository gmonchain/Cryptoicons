import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

interface ActiveCoinsData {
  timestamp: string;
  total: number;
  symbols: string[];
}

type ResponseData =
  | { success: true; data: ActiveCoinsData }
  | { success: false; error: string };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const dataPath = path.join(process.cwd(), 'public', 'data', 'active-coins.json');

    // Check if file exists
    if (!fs.existsSync(dataPath)) {
      console.warn('active-coins.json not found, returning empty data');
      return res.status(200).json({
        success: true,
        data: {
          timestamp: new Date().toISOString(),
          total: 0,
          symbols: []
        }
      });
    }

    // Read and parse file
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const data: ActiveCoinsData = JSON.parse(fileContent);

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error reading active-coins.json:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to read active coins data'
    });
  }
}
