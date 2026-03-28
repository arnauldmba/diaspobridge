const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_KEY = '23929bd3b0msh0e46326691e5b91p1cc142jsn8d53d01d831d';
const API_HOST = 'wft-geo-db.p.rapidapi.com';
//const countries = ['DE', 'FR', 'CM'];
const countriesConfig = [
  { code: 'DE', minPopulation: 50000, maxCities: 200 },
  { code: 'FR', minPopulation: 50000, maxCities: 200 },
  { code: 'CM', minPopulation: 10000, maxCities: 50 }
];
const limit = 10;

// délai volontairement large pour éviter le blocage
const REQUEST_DELAY_MS = 2500;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, options, maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(url, options);
      return response;
    } catch (error) {
      const status = error.response?.status;
      const data = error.response?.data;
      const retryAfterHeader = error.response?.headers?.['retry-after'];

      const isRateLimit =
        status === 429 ||
        data?.message?.toLowerCase()?.includes('rate limit');

      if (!isRateLimit) {
        throw error;
      }

      const retryAfterSeconds = retryAfterHeader
        ? Number(retryAfterHeader)
        : null;

      const waitMs = retryAfterSeconds
        ? retryAfterSeconds * 1000
        : attempt * 3000; // backoff progressif

      console.log(
        `⏳ Rate limit atteint. Tentative ${attempt}/${maxRetries}. ` +
        `Attente ${waitMs} ms avant nouvel essai...`
      );

      await sleep(waitMs);
    }
  }

  throw new Error('Trop d’erreurs de rate limit. Réessaie plus tard.');
}

async function fetchCitiesByCountry(countryCode) {
  let allCities = [];
  let offset = 0;
  let hasMore = true;

  while (hasMore) {
    console.log(`Récupération ${countryCode} - offset ${offset}`);

    // délai AVANT chaque requête
    await sleep(REQUEST_DELAY_MS);

    const response = await fetchWithRetry(
      'https://wft-geo-db.p.rapidapi.com/v1/geo/cities',
      {
        params: {
          countryIds: countryCode,
          limit,
          offset,
          sort: '-population',
          minPopulation: 20000
        },
        headers: {
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': API_HOST
        }
      }
    );

    const data = response.data?.data || [];
    const totalCount = response.data?.metadata?.totalCount || 0;

    if (data.length === 0) {
      hasMore = false;
      break;
    }

    const cleanedCities = data.map(city => ({
      id: city.id,
      city: city.city,
      country: city.country,
      countryCode: city.countryCode,
      latitude: city.latitude,
      longitude: city.longitude,
      population: city.population
    }));

    allCities.push(...cleanedCities);

    offset += limit;

    if (offset >= totalCount) {
      hasMore = false;
    }
  }

  return allCities;
}

function removeDuplicates(cities) {
  const seen = new Set();

  return cities.filter(city => {
    const key = `${city.city}-${city.countryCode}`.toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function main() {
  try {
    let allCities = [];

    for (const country of countries) {
      console.log(`\n🌍 Début import pays: ${country}`);
      const cities = await fetchCitiesByCountry(country);
      allCities.push(...cities);

      // pause supplémentaire entre deux pays
      await sleep(4000);
    }

    allCities = removeDuplicates(allCities);

    allCities.sort((a, b) => a.city.localeCompare(b.city));

    const outputDir = path.join(__dirname, '../src/assets/data');
    const outputFile = path.join(outputDir, 'cities.json');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(allCities, null, 2), 'utf-8');

    console.log(`\n✅ Fichier créé : ${outputFile}`);
    console.log(`✅ Nombre total de villes : ${allCities.length}`);
  } catch (error) {
    console.error('❌ Erreur finale :', error.response?.data || error.message);
  }
}

main();