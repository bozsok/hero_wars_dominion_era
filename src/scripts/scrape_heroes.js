import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import translate from 'google-translate-api-x';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_PATH = path.join(__dirname, '../data/heroesCatalog.json');
const GUIDES_DIR = path.join(__dirname, '../data/guides');
const LINKS_PATH = path.join(__dirname, 'test_links.json');

// Ensure directories exist
if (!fs.existsSync(GUIDES_DIR)) {
  fs.mkdirSync(GUIDES_DIR, { recursive: true });
}

// Simple slugifier to match URLs
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const manualMap = {
  'Astaroth': 'astarot',
  'Galahad': 'galahad',
  'Keira': 'kira',
  'Corvus': 'korvus',
  'Arachne': 'arahna',
  'Astrid and Lucas': 'astrid_i_lukas',
  'Aurora': 'avrora',
  'Andvari': 'andvari',
  'Isaac': 'izek',
  'Iris': 'iris',
  'Alvanor': 'alvanor',
  'Amira': 'amira',
  'Artemis': 'artemis',
  'Faceless': 'bezlikiy',
  'Helios': 'gelios',
  'Dante': 'dante',
  'Jet': 'jet',
  'Ginger': 'jindger',
  'Jhu': 'dju',
  'Dorian': 'dorian',
  'Ziri': 'ziri',
  'Ishmael': 'ismai',
  'Jorgen': 'iorgen',
  'Kai': 'kay',
  'K\'arkh': 'karh',
  'Kayla': 'kayla',
  'Cornelius': 'kornelius',
  'Krista': 'krista',
  'Lars': 'lars',
  'Lilith': 'lilit',
  'Lian': 'lien',
  'Luther': 'luter',
  'Maya': 'maya',
  'Markus': 'markus',
  'Martha': 'marta',
  'Mojo': 'mojo',
  'Morrigan': 'morrigan',
  'Mushy and Shroom': 'mushy_and_shroom',
  'Nebula': 'nebula',
  'Orion': 'orion',
  'Polaris': 'polyaris',
  'Peppy': 'peppi',
  'Rufus': 'rufus',
  'Satori': 'satori',
  'Sebastian': 'sebastian',
  'Celeste': 'selesta',
  'Daredevil': 'sorvigolova',
  'Judge': 'judge',
  'Dark Star': 'temnaya_zvezda',
  'Cleaver': 'tesak',
  'Thea': 'teya',
  'Tristan': 'tristan',
  'Fafnir': 'fafnir',
  'Phobos': 'fobos',
  'Fox': 'fox',
  'Heidi': 'haidi',
  'Qing Mao': 'zin_mao',
  'Chabba': 'chabba',
  'Aidan': 'aidan',
  'Elmir': 'elmir',
  'Julius': 'julius',
  'Yasmine': 'yasmin',
  'K\'arkh': 'karh',
  'K’arkh': 'karh',
  'Andavari': 'andvari',
  'Lara Croft': 'lara_croft',
  'Augustus': 'august',
  'Ninja Turtles': 'ninja_turtles'
};

async function translateText(text) {
  if (!text || text.trim() === '') return '';
  try {
    const res = await translate(text, { to: 'hu', forceBatch: false });
    return res.text;
  } catch (err) {
    console.error("Translation error:", err.message);
    try {
      console.log("Retrying translation...");
      await new Promise(r => setTimeout(r, 2000));
      const res2 = await translate(text, { to: 'hu', forceBatch: false });
      return res2.text;
    } catch (err2) {
      console.error("Retry failed:", err2.message);
      return text; // Return original Russian if translation fails completely
    }
  }
}

async function scrapeHero(hero, url) {
  console.log(`\n>>> Scraping ${hero.name} from ${url}...`);
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Moon-hero content is usually inside .entry-content
    let contentArea = $('.entry-content').length ? $('.entry-content') : $('.elementor-widget-theme-post-content');
    if (!contentArea.length) contentArea = $('article');
    
    // Remove comments, navigation, and related posts before parsing
    contentArea.find('#comments, .comments-area, nav, .nav-links, .related-posts, .crp_related').remove();
    
    let sections = [];
    let currentSection = { title: "Általános áttekintés", content: [] };
    
    // We will iterate over all headers and paragraphs
    contentArea.find('h2, h3, p, ul').each((i, el) => {
      const tagName = el.tagName.toLowerCase();
      const text = $(el).text().trim();
      
      if (!text) return;

      // Skip generic website sections
      if (text.includes("Навигация") || text.includes("Похожие статьи")) return;

      if (tagName === 'h2' || tagName === 'h3') {
        if (currentSection.content.length > 0 || currentSection.title !== "Általános áttekintés") {
          sections.push(currentSection);
        }
        currentSection = { title: text, content: [] };
      } else if (tagName === 'p') {
        currentSection.content.push(text);
      } else if (tagName === 'ul') {
        const listItems = [];
        $(el).find('li').each((j, li) => {
          listItems.push("- " + $(li).text().trim());
        });
        currentSection.content.push(listItems.join('\n'));
      }
    });
    
    if (currentSection.content.length > 0) {
      sections.push(currentSection);
    }

    console.log(`Found ${sections.length} sections. Translating...`);
    
    const translatedSections = [];
    for (const sec of sections) {
      const transTitle = await translateText(sec.title);
      const transContent = await translateText(sec.content.join('\n\n'));
      translatedSections.push({
        title: transTitle,
        content: transContent
      });
      // Small delay to prevent API rate limiting
      await new Promise(r => setTimeout(r, 1000));
    }
    
    const guideData = {
      id: hero.id.toString(),
      name: hero.name,
      sections: translatedSections
    };
    
    const filePath = path.join(GUIDES_DIR, `${hero.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(guideData, null, 2));
    console.log(`Saved guide for ${hero.name} to ${hero.id}.json!`);

  } catch (err) {
    console.error(`Failed to scrape ${hero.name}:`, err.message);
  }
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  const links = JSON.parse(fs.readFileSync(LINKS_PATH, 'utf-8'));
  
  // Create a map of slug to url
  const urlMap = {};
  for (const link of links) {
    const urlParts = link.href.split('/').filter(p => p);
    const slug = urlParts[urlParts.length - 1];
    urlMap[slug.replace(/-/g, '')] = link.href;
  }
  
  for (const hero of catalog) {
    const filePath = path.join(GUIDES_DIR, `${hero.id}.json`);
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${hero.name}, guide already exists.`);
      continue;
    }

    let targetUrl = null;
    
    if (manualMap[hero.name]) {
      const slug = manualMap[hero.name].replace(/-/g, '');
      targetUrl = urlMap[slug] || `https://moon-hero.site/${manualMap[hero.name]}/`;
    } else {
      const baseSlug = slugify(hero.name);
      if (urlMap[baseSlug]) {
        targetUrl = urlMap[baseSlug];
      }
    }
    
    if (targetUrl) {
      await scrapeHero(hero, targetUrl);
      // Wait 3 seconds between heroes to avoid ban
      await new Promise(r => setTimeout(r, 3000));
    } else {
      console.log(`No URL mapping found for ${hero.name}`);
    }
  }
  console.log("Scraping complete.");
}

main();
