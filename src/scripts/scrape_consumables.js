import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const API_URL = 'https://hero-wars.fandom.com/api.php?action=parse&page=Inventory&format=json';
const OUTPUT_FILE = path.join(process.cwd(), '..', 'data', 'consumablesWiki.json');

async function scrapeConsumables() {
  console.log('Fetching Inventory page from Hero Wars Wiki...');
  try {
    const response = await axios.get(API_URL);
    const htmlData = response.data.parse.text['*'];
    
    console.log('HTML adat letöltve. Elemzés...');
    const $ = cheerio.load(htmlData);
    
    const consumables = [];
    
    // Általános keresés a Wikia Inventory oldalán minden képre, amely gyanúsan egy inventory elem lehet
    $('a.image').each((i, link) => {
       const title = $(link).attr('title');
       const imgTag = $(link).find('img');
       const imgUrl = imgTag.attr('data-src') || imgTag.attr('src');
       
       if (title && imgUrl && title !== 'Inventory') {
         consumables.push({
            name: title.trim(),
            imageUrl: imgUrl.split('/revision')[0]
         });
       }
    });

    // Egyedi elemek kiszűrése (duplikátumok eltávolítása név alapján)
    const uniqueConsumables = [];
    const seenNames = new Set();
    
    consumables.forEach(item => {
      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        uniqueConsumables.push(item);
      }
    });

    console.log(`Összesen kinyert consumable/inventory elem: ${uniqueConsumables.length}`);
    
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(uniqueConsumables, null, 2));
    console.log(`Az elemek listája sikeresen mentve: ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error('Hiba a scraping során:', error.message);
  }
}

scrapeConsumables();
