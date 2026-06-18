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

function formatIntroText(text) {
  const lines = text.split('\n');
  const cleanedLines = [];
  
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    
    // Ads filtering
    if (line.includes('yaContextCb') || 
        line.includes('Ya.Context') || 
        line.includes('blockId:') || 
        line.includes('AdvManager') || 
        line.includes('yandex') ||
        line.includes('renderTo:')) {
      continue;
    }
    
    const lowerLine = line.toLowerCase();
    if (lowerLine === 'profik' || lowerLine === 'плюсы' || lowerLine === 'pros') {
      cleanedLines.push('\n**Előnyök**\n');
      continue;
    }
    if (lowerLine === 'минусы' || lowerLine === 'hátrányok' || lowerLine === 'cons') {
      cleanedLines.push('\n**Hátrányok**\n');
      continue;
    }

    if (line.includes('✓') || line.includes('✗')) {
      const parts = line.split(/(?=[✓✗])/);
      for (let part of parts) {
        part = part.trim();
        if (part) {
          cleanedLines.push(part);
        }
      }
    } else {
      cleanedLines.push(line);
    }
  }
  
  let result = cleanedLines.join('\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  return result.trim();
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
    const toc = $('.lwptoc');

    if (toc.length > 0) {
      console.log(`LuckyWP TOC found for ${hero.name}. Building sections from TOC...`);
      const tocItems = [];
      toc.find('a').each((j, el) => {
        const href = $(el).attr('href');
        if (!href || href === '#') return;
        const text = $(el).text().trim().replace(/\s+/g, ' ');
        const id = href.substring(1);
        
        const match = text.match(/^([0-9.]+)\s+(.+)$/);
        let titleText = text;
        let level = 1;
        if (match) {
          titleText = match[2];
          level = match[1].split('.').length;
        }
        tocItems.push({ id, title: titleText, level });
      });

      const tocIds = new Set(tocItems.map(item => item.id));

      // Extract intro section before the first TOC heading
      let introContent = [];
      let firstHeading = contentArea.find(`[id="${tocItems[0].id}"], span[id="${tocItems[0].id}"]`).first();
      if (firstHeading.length) {
        if (!firstHeading.is('h1, h2, h3, h4, h5, h6')) {
          firstHeading = firstHeading.closest('h1, h2, h3, h4, h5, h6');
        }
      }

      // Remove ads and scripts dynamically
      contentArea.find('script, style, ins, .adsbygoogle, .lwptoc_i').remove();

      let currentEl = contentArea.children().first();
      while (currentEl.length > 0) {
        if (firstHeading.length && (currentEl.is(firstHeading) || currentEl.find(firstHeading).length > 0)) {
          break;
        }
        
        if (currentEl.hasClass('lwptoc') || currentEl.find('.lwptoc').length > 0) {
          currentEl = currentEl.next();
          continue;
        }

        const tagName = currentEl.prop('tagName').toLowerCase();
        const text = currentEl.text().trim();
        
        const hasAd = text.includes('yaContextCb') || 
                      text.includes('Ya.Context') || 
                      text.includes('blockId:') || 
                      text.includes('AdvManager') || 
                      text.includes('yandex') ||
                      text.includes('renderTo:');
        if (text && !hasAd) {
          if (tagName === 'p' || tagName === 'div') {
            introContent.push(text);
          } else if (tagName === 'ul') {
            const listItems = [];
            currentEl.find('li').each((k, li) => {
              listItems.push("- " + $(li).text().trim());
            });
            introContent.push(listItems.join('\n'));
          } else if (tagName === 'figure' || tagName === 'table') {
            const table = tagName === 'table' ? currentEl : currentEl.find('table');
            if (table.length > 0) {
              const rows = [];
              table.find('tr').each((k, tr) => {
                const cells = [];
                $(tr).find('td, th').each((l, td) => {
                  const cellText = $(td).text().trim();
                  if (cellText) cells.push(cellText);
                });
                if (cells.length > 0) {
                  rows.push(cells.join(' - '));
                }
              });
              if (rows.length > 0) {
                introContent.push(rows.join('\n'));
              }
            }
          }
        }
        currentEl = currentEl.next();
      }

      if (introContent.length > 0) {
        sections.push({
          title: "Общий обзор", // Will be translated to Hungarian (Általános áttekintés)
          level: 1,
          content: [introContent.join('\n\n')],
          skillsData: null,
          upgradesData: null,
          isSkills: false,
          isUpgrades: false
        });
      }

      for (const item of tocItems) {
        let heading = contentArea.find(`[id="${item.id}"], span[id="${item.id}"]`).first();
        if (!heading.length) continue;
        if (!heading.is('h1, h2, h3, h4, h5, h6')) {
          heading = heading.closest('h1, h2, h3, h4, h5, h6');
        }
        if (!heading.length) continue;
        
        const section = {
          title: item.title,
          level: item.level,
          content: [],
          skillsData: null,
          upgradesData: null,
          isSkills: false,
          isUpgrades: false
        };
        
        let nextNode = heading.next();
        while (nextNode.length > 0) {
          // Break if we reach another heading that is in the TOC
          const nextId = nextNode.find('[id], span[id]').attr('id') || nextNode.attr('id');
          if (nextId && tocIds.has(nextId)) break;
          
          if (nextNode.is('h1, h2, h3, h4, h5, h6')) {
            const hasTocSpan = nextNode.find('span[id]').filter((idx, span) => tocIds.has($(span).attr('id'))).length > 0;
            if (hasTocSpan || (nextNode.attr('id') && tocIds.has(nextNode.attr('id')))) {
              break;
            }
          }
          
          const tagName = nextNode.prop('tagName').toLowerCase();
          const text = nextNode.text().trim();
          
          if (text) {
            if (tagName === 'p') {
              section.content.push(text);
            } else if (tagName === 'ul') {
              const listItems = [];
              nextNode.find('li').each((k, li) => {
                listItems.push("- " + $(li).text().trim());
              });
              section.content.push(listItems.join('\n'));
            } else if (tagName === 'figure' || tagName === 'table') {
              if (tagName === 'table' && nextNode.closest('figure').length > 0) {
                nextNode = nextNode.next();
                continue; // Skip table inside figure
              }
              
              const table = nextNode.find('table');
              if (table.length > 0 || tagName === 'table') {
                const targetTable = tagName === 'table' ? nextNode : table;
                
                // Case 1: Skills table
                if (item.title.includes("Умения")) {
                  const skillRows = [];
                  targetTable.find('tr').each((k, tr) => {
                    if ($(tr).find('th').length > 0) return;
                    const tds = $(tr).find('td');
                    if (tds.length >= 2) {
                      const nameText = $(tds[0]).text().trim();
                      const descText = $(tds[1]).text().trim();
                      if (nameText && descText) {
                        skillRows.push({ rawName: nameText, rawDesc: descText });
                      }
                    }
                  });
                  if (skillRows.length > 0) {
                    section.skillsData = skillRows;
                    section.isSkills = true;
                  }
                }
                // Case 2: Skill Upgrades table
                else if (item.title.includes("Прокачка умений")) {
                  const upgradeRows = [];
                  targetTable.find('tr').each((k, tr) => {
                    if ($(tr).find('th').length > 0) return;
                    const tds = $(tr).find('td');
                    if (tds.length >= 2) {
                      const descText = $(tds[1]).text().trim();
                      if (descText) {
                        upgradeRows.push({ rawDesc: descText });
                      }
                    }
                  });
                  if (upgradeRows.length > 0) {
                    section.upgradesData = upgradeRows;
                    section.isUpgrades = true;
                  }
                }
                // Case 3: Other tables
                else {
                  const rows = [];
                  targetTable.find('tr').each((k, tr) => {
                    const cells = [];
                    $(tr).find('td, th').each((l, td) => {
                      const cellText = $(td).text().trim();
                      if (cellText) cells.push(cellText);
                    });
                    if (cells.length > 0) {
                      rows.push(cells.join(' - '));
                    }
                  });
                  
                  const figcaption = nextNode.find('figcaption').text().trim();
                  if (figcaption) {
                    rows.push(figcaption);
                  }
                  
                  if (rows.length > 0) {
                    section.content.push(rows.join('\n'));
                  }
                }
              }
            }
          }
          nextNode = nextNode.next();
        }
        sections.push(section);
      }
    } else {
      console.log(`No LuckyWP TOC found for ${hero.name}. Falling back to default header loop parsing...`);
      let currentSection = { title: "Általános áttekintés", level: 1, content: [] };
      
      contentArea.find('h1, h2, h3, p, ul, figure, table').each((j, el) => {
        const tagName = el.tagName.toLowerCase();
        const text = $(el).text().trim();
        
        if (!text) return;
        if (text.includes("Навигация") || text.includes("Похожие статьи")) return;

        if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
          if (currentSection.content.length > 0 || currentSection.title !== "Általános áttekintés") {
            sections.push(currentSection);
          }
          currentSection = { 
            title: text, 
            level: tagName === 'h1' ? 1 : tagName === 'h2' ? 2 : 3,
            content: [] 
          };
        } else if (tagName === 'p') {
          currentSection.content.push(text);
        } else if (tagName === 'ul') {
          const listItems = [];
          $(el).find('li').each((k, li) => {
            listItems.push("- " + $(li).text().trim());
          });
          currentSection.content.push(listItems.join('\n'));
        } else if (tagName === 'figure' || tagName === 'table') {
          if (tagName === 'table' && $(el).closest('figure').length > 0) {
            return;
          }
          
          const table = $(el).find('table');
          if (table.length > 0 || tagName === 'table') {
            const targetTable = tagName === 'table' ? $(el) : table;
            
            if (currentSection.title.includes("Умения")) {
              const skillRows = [];
              targetTable.find('tr').each((k, tr) => {
                if ($(tr).find('th').length > 0) return;
                const tds = $(tr).find('td');
                if (tds.length >= 2) {
                  const nameText = $(tds[0]).text().trim();
                  const descText = $(tds[1]).text().trim();
                  if (nameText && descText) {
                    skillRows.push({ rawName: nameText, rawDesc: descText });
                  }
                }
              });
              if (skillRows.length > 0) {
                currentSection.skillsData = skillRows;
                currentSection.isSkills = true;
                return;
              }
            }
            
            if (currentSection.title.includes("Прокачка умений")) {
              const upgradeRows = [];
              targetTable.find('tr').each((k, tr) => {
                if ($(tr).find('th').length > 0) return;
                const tds = $(tr).find('td');
                if (tds.length >= 2) {
                  const descText = $(tds[1]).text().trim();
                  if (descText) {
                    upgradeRows.push({ rawDesc: descText });
                  }
                }
              });
              if (upgradeRows.length > 0) {
                currentSection.upgradesData = upgradeRows;
                currentSection.isUpgrades = true;
                return;
              }
            }
            
            const rows = [];
            targetTable.find('tr').each((k, tr) => {
              const cells = [];
              $(tr).find('td, th').each((l, td) => {
                const cellText = $(td).text().trim();
                if (cellText) cells.push(cellText);
              });
              if (cells.length > 0) {
                rows.push(cells.join(' - '));
              }
            });
            
            const figcaption = $(el).find('figcaption').text().trim();
            if (figcaption) {
              rows.push(figcaption);
            }

            if (rows.length > 0) {
              currentSection.content.push(rows.join('\n'));
            }
          }
        }
      });
      
      if (currentSection.content.length > 0) {
        sections.push(currentSection);
      }
    }

    console.log(`Found ${sections.length} sections. Translating...`);
    
    // Prepare texts for Hungarian translation and English translation of skill names
    const textsToTranslate = [];
    const skillNamesToTranslateEn = [];
    const translationMap = [];

    for (let j = 0; j < sections.length; j++) {
      const sec = sections[j];
      
      // Translate title to Hungarian
      textsToTranslate.push(sec.title);
      translationMap.push({ type: 'title', secIdx: j });
      
      if (sec.isSkills) {
        for (let k = 0; k < sec.skillsData.length; k++) {
          const skill = sec.skillsData[k];
          
          // Translate description to Hungarian
          textsToTranslate.push(skill.rawDesc);
          translationMap.push({ type: 'skillDesc', secIdx: j, skillIdx: k });
          
          // Translate skill name to English
          skillNamesToTranslateEn.push(skill.rawName);
        }
      } else if (sec.isUpgrades) {
        for (let k = 0; k < sec.upgradesData.length; k++) {
          const upgrade = sec.upgradesData[k];
          
          // Translate upgrade comment to Hungarian
          textsToTranslate.push(upgrade.rawDesc);
          translationMap.push({ type: 'upgradeDesc', secIdx: j, upgradeIdx: k });
        }
      } else {
        textsToTranslate.push(sec.content.join('\n\n'));
        translationMap.push({ type: 'content', secIdx: j });
      }
    }

    // 1. Translate to Hungarian
    console.log(`Translating batch of ${textsToTranslate.length} items to Hungarian for ${hero.name}...`);
    let translatedTexts = [];
    try {
      const res = await translate(textsToTranslate, { to: 'hu', forceBatch: false });
      translatedTexts = res.map(r => r.text);
    } catch (err) {
      console.error("Hungarian batch translation failed, falling back to individual translation...", err.message);
      translatedTexts = [];
      for (const text of textsToTranslate) {
        const t = await translateText(text);
        translatedTexts.push(t);
        await new Promise(r => setTimeout(r, 600));
      }
    }

    // 2. Translate skill names to English
    let translatedSkillNamesEn = [];
    if (skillNamesToTranslateEn.length > 0) {
      console.log(`Translating batch of ${skillNamesToTranslateEn.length} skill names to English for ${hero.name}...`);
      try {
        const resEn = await translate(skillNamesToTranslateEn, { to: 'en', forceBatch: false });
        translatedSkillNamesEn = resEn.map(r => r.text);
      } catch (err) {
        console.error("English batch translation failed, falling back to individual translation...", err.message);
        translatedSkillNamesEn = [];
        for (const name of skillNamesToTranslateEn) {
          try {
            const res = await translate(name, { to: 'en', forceBatch: false });
            translatedSkillNamesEn.push(res.text);
          } catch (e) {
            translatedSkillNamesEn.push(name);
          }
          await new Promise(r => setTimeout(r, 600));
        }
      }
    }

    // Reconstruct sections
    const finalSections = [];
    for (let j = 0; j < sections.length; j++) {
      finalSections.push({ title: '', content: '' });
    }

    // Apply Hungarian translations first
    for (let i = 0; i < translatedTexts.length; i++) {
      const mapItem = translationMap[i];
      const translated = translatedTexts[i];
      const secIdx = mapItem.secIdx;
      
      if (mapItem.type === 'title') {
        finalSections[secIdx].title = (translated === 'Общий обзор' || translated === 'Általános áttekintés') ? 'Általános áttekintés' : translated;
      } else if (mapItem.type === 'content') {
        if (sections[secIdx].title === 'Общий обзор') {
          finalSections[secIdx].content = formatIntroText(translated);
        } else {
          finalSections[secIdx].content = translated;
        }
      } else if (mapItem.type === 'skillDesc') {
        if (!sections[secIdx].translatedSkills) {
          sections[secIdx].translatedSkills = [];
        }
        sections[secIdx].translatedSkills[mapItem.skillIdx] = { desc: translated };
      } else if (mapItem.type === 'upgradeDesc') {
        if (!sections[secIdx].translatedUpgrades) {
          sections[secIdx].translatedUpgrades = [];
        }
        sections[secIdx].translatedUpgrades[mapItem.upgradeIdx] = { desc: translated };
      }
    }

    // Apply English skill names and build outputs
    const finalSkillNames = translatedSkillNamesEn;
    for (let j = 0; j < sections.length; j++) {
      const sec = sections[j];
      
      if (sec.isSkills && sec.translatedSkills) {
        const skillLines = [];
        for (let k = 0; k < sec.translatedSkills.length; k++) {
          const engName = finalSkillNames[k] || `Skill ${k + 1}`;
          const hungDesc = sec.translatedSkills[k].desc;
          skillLines.push(`${engName} – ${hungDesc}`);
        }
        finalSections[j].content = skillLines.join('\n\n');
      } else if (sec.isUpgrades && sec.translatedUpgrades) {
        const upgradeLines = [];
        upgradeLines.push("Röviden:\n\nKészségek – Megjegyzések");
        for (let k = 0; k < sec.translatedUpgrades.length; k++) {
          const engName = finalSkillNames[k] || `Skill ${k + 1}`;
          const hungDesc = sec.translatedUpgrades[k].desc;
          upgradeLines.push(`${engName} – ${hungDesc}`);
        }
        finalSections[j].content = upgradeLines.join('\n');
      }
    }

    const outputSections = [];
    for (let j = 0; j < sections.length; j++) {
      outputSections.push({
        title: finalSections[j].title,
        level: sections[j].level || 2,
        content: finalSections[j].content
      });
    }
    
    const filePath = path.join(GUIDES_DIR, `${hero.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify({
      id: hero.id.toString(),
      name: hero.name,
      sections: outputSections
    }, null, 2));
    console.log(`Saved guide for ${hero.name} to ${hero.id}.json!`);

  } catch (err) {
    console.error(`Failed to scrape ${hero.name}:`, err.message);
  }
}

async function main() {
  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf-8'));
  let links = [];
  if (fs.existsSync(LINKS_PATH)) {
    links = JSON.parse(fs.readFileSync(LINKS_PATH, 'utf-8'));
  }
  
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
