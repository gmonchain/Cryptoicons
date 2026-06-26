import type { NextApiRequest, NextApiResponse } from 'next';

// In-memory cache
let cachedData: CoinMarketCapData | null = null;
let cacheTimestamp: number = 0;

const CACHE_DURATION = parseInt(process.env.CMC_CACHE_DURATION || '86400000'); // 24 hours default

interface CoinData {
  id: number;
  name: string;
  symbol: string;
  cmc_rank: number;
  is_active: number;
}

interface CoinMarketCapData {
  coins: CoinData[];
  timestamp: number;
}

type ResponseData =
  | { success: true; data: CoinMarketCapData; cached: boolean }
  | { success: false; error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }

  try {
    const now = Date.now();

    // Check if cache is still valid
    if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('Returning cached CoinMarketCap data');
      return res.status(200).json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    // Fetch fresh data from CoinMarketCap
    const apiKey = process.env.COINMARKETCAP_API_KEY;

    if (!apiKey || apiKey === 'your_api_key_here') {
      return res.status(200).json({
        success: false,
        error: 'API_KEY_NOT_CONFIGURED'
      });
    }

    console.log('Fetching fresh data from CoinMarketCap API...');

    const response = await fetch(
      'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=100',
      {
        headers: {
          'X-CMC_PRO_API_KEY': apiKey,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Debug: Log first coin to see available fields
    if (data.data && data.data.length > 0) {
      console.log('First coin data:', JSON.stringify(data.data[0], null, 2));
    }

    // Extract only the data we need
    const coins: CoinData[] = data.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      cmc_rank: coin.cmc_rank,
      is_active: coin.is_active !== undefined ? coin.is_active : 1, // Default to active if not provided
    }));

    // Update cache
    cachedData = {
      coins,
      timestamp: now,
    };
    cacheTimestamp = now;

    console.log(`Cached ${coins.length} coins from CoinMarketCap`);

    return res.status(200).json({
      success: true,
      data: cachedData,
      cached: false
    });

  } catch (error) {
    console.error('CoinMarketCap API error:', error);

    // If we have cached data, return it even if expired
    if (cachedData) {
      console.log('Returning stale cache due to API error');
      return res.status(200).json({
        success: true,
        data: cachedData,
        cached: true
      });
    }

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch data from CoinMarketCap'
    });
  }
}
