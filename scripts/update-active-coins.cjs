#!/usr/bin/env node

/**
 * Script to update active coins data from CoinMarketCap
 * Run manually: npm run update-active-coins
 *
 * This script:
 * 1. Reads all icon symbols from /public/icons/
 * 2. Queries CoinMarketCap API in batches
 * 3. Generates JSON files: active-coins.json, inactive-coins.json, all-coins.json
 * 4. Saves to /public/data/
 */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const BATCH_SIZE = 10;
const DELAY_MS = 2500; // 2.5 seconds between requests
const API_KEY = process.env.COINMARKETCAP_API_KEY;

// Helper: Get all icon symbols
function getAllIconSymbols() {
  const iconsDir = path.join(__dirname, '../public/icons');
  const files = fs.readdirSync(iconsDir).filter(f => f.endsWith('.svg'));

  const symbols = new Set();

  files.forEach(fileName => {
    const nameWithoutExt = fileName.replace('.svg', '');

    // Extract symbol from "Name (SYMBOL).svg"
    const match = nameWithoutExt.match(/\(([^)]+)\)$/);
    if (match) {
      const symbol = match[1].trim().toUpperCase();
      // Only alphanumeric symbols (CoinMarketCap requirement)
      if (/^[A-Z0-9]+$/.test(symbol)) {
        symbols.add(symbol);
      }
    } else {
      const symbol = nameWithoutExt.toUpperCase();
      if (/^[A-Z0-9]+$/.test(symbol)) {
        symbols.add(symbol);
      }
    }
  });

  return Array.from(symbols);
}

// Helper: Chunk array
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// Helper: Sleep
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main function
async function updateActiveCoins() {
  console.log('🚀 Starting active coins update...\n');

  if (!API_KEY || API_KEY === 'your_api_key_here') {
    console.error('❌ Error: COINMARKETCAP_API_KEY not configured in .env.local');
    process.exit(1);
  }

  // Get all symbols
  const allSymbols = getAllIconSymbols();
  console.log(`📊 Total symbols found: ${allSymbols.length}`);
  console.log(`📦 Batch size: ${BATCH_SIZE}`);

  const batches = chunkArray(allSymbols, BATCH_SIZE);
  console.log(`🔄 Number of API calls needed: ${batches.length}`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(batches.length * DELAY_MS / 1000 / 60)} minutes\n`);

  const activeSymbols = new Set();
  const inactiveSymbols = new Set();
  let successfulCalls = 0;
  let failedCalls = 0;

  // Process batches
  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const symbolsParam = batch.join(',');

    try {
      console.log(`[${i + 1}/${batches.length}] Checking: ${symbolsParam.substring(0, 50)}...`);

      const response = await fetch(
        `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${symbolsParam}&listing_status=active`,
        {
          headers: {
            'X-CMC_PRO_API_KEY': API_KEY,
            'Accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`   ❌ Batch failed ${response.status}: Retrying individually...`);
        failedCalls++;

        // Retry each symbol individually
        for (const symbol of batch) {
          try {
            await sleep(DELAY_MS);
            const singleResponse = await fetch(
              `https://pro-api.coinmarketcap.com/v1/cryptocurrency/map?symbol=${symbol}&listing_status=active`,
              {
                headers: {
                  'X-CMC_PRO_API_KEY': API_KEY,
                  'Accept': 'application/json',
                },
              }
            );

            if (singleResponse.ok) {
              const singleData = await singleResponse.json();
              if (singleData.data && Array.isArray(singleData.data)) {
                const activeCoins = singleData.data.filter(coin => coin.is_active === 1);
                if (activeCoins.length > 0) {
                  activeSymbols.add(symbol);
                  console.log(`      ✅ ${symbol} is active`);
                } else {
                  inactiveSymbols.add(symbol);
                }
              } else {
                inactiveSymbols.add(symbol);
              }
            } else {
              inactiveSymbols.add(symbol);
              console.log(`      ❌ ${symbol} failed/invalid`);
            }
          } catch (err) {
            inactiveSymbols.add(symbol);
            console.log(`      ❌ ${symbol} error: ${err.message}`);
          }
        }
      } else {
        const data = await response.json();

        // Track which symbols were found
        const foundSymbols = new Set();

        if (data.data && Array.isArray(data.data)) {
          // Filter for actually active coins
          const activeCoins = data.data.filter(coin => coin.is_active === 1);

          activeCoins.forEach(coin => {
            if (coin.symbol) {
              const symbol = coin.symbol.toUpperCase();
              activeSymbols.add(symbol);
              foundSymbols.add(symbol);
            }
          });

          console.log(`   ✅ Found ${activeCoins.length} active (out of ${data.data.length} total)`);
        }

        // Symbols not found = inactive
        batch.forEach(symbol => {
          if (!foundSymbols.has(symbol)) {
            inactiveSymbols.add(symbol);
          }
        });

        successfulCalls++;
      }

      // Delay before next request (except last one)
      if (i < batches.length - 1) {
        await sleep(DELAY_MS);
      }

    } catch (error) {
      console.error(`   ❌ Error: ${error.message}`);
      failedCalls++;

      // Add to inactive on error
      batch.forEach(symbol => inactiveSymbols.add(symbol));
    }
  }

  console.log('\n📈 Summary:');
  console.log(`   ✅ Successful API calls: ${successfulCalls}`);
  console.log(`   ❌ Failed API calls: ${failedCalls}`);
  console.log(`   🟢 Active coins: ${activeSymbols.size}`);
  console.log(`   🔴 Inactive/Unknown coins: ${inactiveSymbols.size}`);
  console.log(`   📊 Total: ${activeSymbols.size + inactiveSymbols.size}\n`);

  // Save to JSON files
  const dataDir = path.join(__dirname, '../public/data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const timestamp = new Date().toISOString();

  const allCoinsData = {
    timestamp,
    total: allSymbols.length,
    symbols: allSymbols.sort()
  };

  const activeCoinsData = {
    timestamp,
    total: activeSymbols.size,
    symbols: Array.from(activeSymbols).sort()
  };

  const inactiveCoinsData = {
    timestamp,
    total: inactiveSymbols.size,
    symbols: Array.from(inactiveSymbols).sort()
  };

  fs.writeFileSync(
    path.join(dataDir, 'all-coins.json'),
    JSON.stringify(allCoinsData, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'active-coins.json'),
    JSON.stringify(activeCoinsData, null, 2)
  );

  fs.writeFileSync(
    path.join(dataDir, 'inactive-coins.json'),
    JSON.stringify(inactiveCoinsData, null, 2)
  );

  console.log('💾 Saved JSON files to /public/data/');
  console.log('   ✅ all-coins.json');
  console.log('   ✅ active-coins.json');
  console.log('   ✅ inactive-coins.json');
  console.log('\n✨ Done! You can now commit these files to the repo.\n');
}

// Run
updateActiveCoins().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
