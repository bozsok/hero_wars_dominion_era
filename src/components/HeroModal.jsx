import React, { useState, useEffect, useContext } from 'react';
import { HeroContext } from '../context/HeroContext';
import InfoModal from './InfoModal';

const Ranks = [
  'White', 'Green', 'Green+1', 'Blue', 'Blue+1', 'Blue+2',
  'Violet', 'Violet+1', 'Violet+2', 'Violet+3',
  'Orange', 'Orange+1', 'Orange+2', 'Orange+3', 'Orange+4',
  'Red', 'Red+1', 'Red+2'
];

const AscensionRanks = ['I', 'II', 'III', 'IV', 'V'];

const GlyphTypes = [
  'Health', 'Armor', 'Magic defense', 'Physical attack', 'Magic attack',
  'Dodge', 'Crit hit chance', 'Armor penetration', 'Magic penetration',
  'Strength', 'Agility', 'Intelligence'
];

const HeroModal = ({ hero, onClose }) => {
  const { updateHeroData, isViewMode } = useContext(HeroContext);
  const [heroData, setHeroData] = useState({ ...hero });
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveText, setSaveText] = useState('SAVE HERO DATA');
  const [infoType, setInfoType] = useState(null);

  useEffect(() => {
    // A HeroContext által átadott teljesen egyesített objektumot lemásoljuk a lokális state-be
    setHeroData(JSON.parse(JSON.stringify(hero)));
  }, [hero]);

  // Általános String vagy Szám kezelő bármilyen mélységhez
  const handleChange = (path, value, isNumber = true) => {
    if (isViewMode) return;
    const finalValue = isNumber ? Number(value) : value;
    
    setHeroData(prev => {
      const copy = { ...prev };
      const keys = path.split('.');
      let current = copy;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = finalValue;
      return copy;
    });
  };

  const handleArrayChange = (pathArrayName, index, value, isNumber = true) => {
    if (isViewMode) return;
    setHeroData(prev => {
      const copy = { ...prev };
      if (!copy[pathArrayName]) copy[pathArrayName] = [];
      copy[pathArrayName] = [...copy[pathArrayName]];
      copy[pathArrayName][index] = isNumber ? Number(value) : value;
      return copy;
    });
  };

  const handleSave = () => {
    if (isViewMode) return;
    setIsSaving(true);
    setSaveText('SAVING...');
    
    setTimeout(() => {
      updateHeroData(hero.id, heroData);
      setSaveText('SAVED!');
      setTimeout(() => onClose(), 800);
    }, 500);
  };

  const renderTabNavigation = () => (
    <div className="modal-tabs">
      <button className={`modal-tab ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General & Stats</button>
      <button className={`modal-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills & Skins</button>
      <button className={`modal-tab ${activeTab === 'artifacts' ? 'active' : ''}`} onClick={() => setActiveTab('artifacts')}>Artifacts & GoE</button>
      <button className={`modal-tab ${activeTab === 'glyphs' ? 'active' : ''}`} onClick={() => setActiveTab('glyphs')}>Glyphs & Ascension</button>
    </div>
  );

  const renderGeneralTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-grid">
        <div className="modal-stat-column">
          <h3 className="tab-section-title">General Info</h3>
          <div className="stat-input-group">
            <label>Level</label>
            <input type="number" className="stat-input" value={heroData.general?.level || 0} onChange={e => handleChange('general.level', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Stars (1-6)</label>
            <input type="number" className="stat-input" value={heroData.general?.stars || 1} onChange={e => handleChange('general.stars', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Soul Stones (0-300)</label>
            <input type="number" className="stat-input" value={heroData.general?.soulStones || 0} onChange={e => handleChange('general.soulStones', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Power</label>
            <input type="number" className="stat-input" value={heroData.general?.power || 0} onChange={e => handleChange('general.power', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Item Rank</label>
            <select className="stat-input" value={heroData.items?.rank || 'White'} onChange={e => handleChange('items.rank', e.target.value, false)} disabled={isViewMode}>
              {Ranks.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="modal-stat-column">
          <h3 className="tab-section-title">Base Stats</h3>
          <div className="stat-input-group">
            <label>Health</label>
            <input type="number" className="stat-input" value={heroData.stats?.health || 0} onChange={e => handleChange('stats.health', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Armor</label>
            <input type="number" className="stat-input" value={heroData.stats?.armor || 0} onChange={e => handleChange('stats.armor', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Magic Defense</label>
            <input type="number" className="stat-input" value={heroData.stats?.magicDefense || 0} onChange={e => handleChange('stats.magicDefense', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Physical Attack</label>
            <input type="number" className="stat-input" value={heroData.stats?.physicalAttack || 0} onChange={e => handleChange('stats.physicalAttack', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Magic Attack</label>
            <input type="number" className="stat-input" value={heroData.stats?.magicAttack || 0} onChange={e => handleChange('stats.magicAttack', e.target.value)} disabled={isViewMode} />
          </div>
          <div className="stat-input-group">
            <label>Dodge</label>
            <input type="number" className="stat-input" value={heroData.stats?.dodge || 0} onChange={e => handleChange('stats.dodge', e.target.value)} disabled={isViewMode} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkillsTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-grid">
        <div className="modal-stat-column">
          <h3 className="tab-section-title">Skills</h3>
          {heroData.staticSkills?.map((s, idx) => (
            <div className="stat-input-group" key={`skill-${idx}`}>
              <label>{s.name} (Max: {s.max})</label>
              <input type="number" className="stat-input" value={heroData.skills?.[idx] || 0} onChange={e => handleArrayChange('skills', idx, e.target.value)} disabled={isViewMode} />
            </div>
          ))}
        </div>
        <div className="modal-stat-column">
          <h3 className="tab-section-title">Skins</h3>
          {heroData.staticSkins?.map(skin => (
            <div className="stat-input-group" key={skin.id}>
              <label>{skin.name} - {skin.stat} (Max: {skin.max})</label>
              <input type="number" className="stat-input" value={heroData.skins?.[skin.id] || 0} onChange={e => handleChange(`skins.${skin.id}`, e.target.value)} disabled={isViewMode} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderArtifactsTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-grid">
        <div className="modal-stat-column">
          <h3 className="tab-section-title">Artifacts</h3>
          {['weapon', 'book', 'ring'].map(type => (
            <div className="stat-group-box" key={type}>
              <h4>{heroData.staticArtifacts?.[type]?.name || type.toUpperCase()}</h4>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div className="stat-input-group">
                  <label>Level (0-100)</label>
                  <input type="number" className="stat-input" value={heroData.artifacts?.[type]?.level || 0} onChange={e => handleChange(`artifacts.${type}.level`, e.target.value)} disabled={isViewMode} />
                </div>
                <div className="stat-input-group">
                  <label>Stars (0-6)</label>
                  <input type="number" className="stat-input" value={heroData.artifacts?.[type]?.stars || 0} onChange={e => handleChange(`artifacts.${type}.stars`, e.target.value)} disabled={isViewMode} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="modal-stat-column">
          <h3 className="tab-section-title">Gift of the Elements</h3>
          <div className="stat-input-group">
            <label>Level (0-30)</label>
            <input type="number" className="stat-input" value={heroData.giftOfElements || 0} onChange={e => handleChange('giftOfElements', e.target.value)} disabled={isViewMode} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderGlyphsTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-grid">
        <div className="modal-stat-column">
          <h3 className="tab-section-title">
            Glyphs
            <button className="help-icon-btn" onClick={() => setInfoType('glyphs')} title="Számolási módszer">
              <span className="material-symbols-outlined">help</span>
            </button>
          </h3>
          {heroData.staticGlyphs?.map((defaultName, idx) => {
            const currentName = heroData.glyphNames?.[idx] || defaultName;
            return (
              <div className="stat-input-group" key={`glyph-${idx}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <select 
                    className="stat-input" 
                    style={{ width: '60%', padding: '2px', fontSize: '12px' }}
                    value={currentName}
                    onChange={e => handleArrayChange('glyphNames', idx, e.target.value, false)}
                    disabled={isViewMode}
                  >
                    {GlyphTypes.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                  </select>
                  <label style={{ margin: 0, alignSelf: 'center' }}>(0-40/50)</label>
                </div>
                <input 
                  type="number" 
                  className="stat-input" 
                  value={heroData.glyphs?.[idx] || 0} 
                  onChange={e => handleArrayChange('glyphs', idx, e.target.value)} 
                  disabled={isViewMode} 
                />
              </div>
            );
          })}
        </div>
        <div className="modal-stat-column">
          <h3 className="tab-section-title">
            Ascension
            <button className="help-icon-btn" onClick={() => setInfoType('ascension')} title="Becslés és számolás">
              <span className="material-symbols-outlined">help</span>
            </button>
          </h3>
          <div className="stat-input-group">
            <label>Ascension Rank</label>
            <select className="stat-input" value={heroData.ascension?.rank || 'I'} onChange={e => handleChange('ascension.rank', e.target.value, false)} disabled={isViewMode}>
              {AscensionRanks.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="stat-input-group">
            <label>Role Branch Nodes</label>
            <input type="number" className="stat-input" value={heroData.ascension?.branch || 0} onChange={e => handleChange('ascension.branch', e.target.value)} disabled={isViewMode} />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={(e) => {
      if(e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content gold-frame">
        <div className="modal-header">
          <div className="modal-hero-info">
            <div className="mythic-border modal-hero-avatar">
              <div className="modal-hero-avatar-inner">
                <img src={hero.img} alt={hero.name} className="modal-hero-image" />
              </div>
            </div>
            <div>
              <h2 className="modal-hero-name">
                {hero.name.toUpperCase()} 
                <span style={{ color: 'var(--outline)', fontSize: '18px', marginLeft: '8px' }}>
                  #{hero.id}
                </span>
              </h2>
              <div className="modal-hero-faction">
                <span className="material-symbols-outlined modal-faction-icon">
                  {hero.faction?.includes('Honor') ? 'military_tech' : 'eco'}
                </span>
                <span className="modal-faction-text">{hero.faction?.toUpperCase() || 'UNKNOWN'}</span>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <span className="material-symbols-outlined" style={{ fontSize: '30px' }}>close</span>
          </button>
        </div>

        {renderTabNavigation()}

        <hr className="modal-divider" />

        <div className="modal-scroll-container">
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'skills' && renderSkillsTab()}
          {activeTab === 'artifacts' && renderArtifactsTab()}
          {activeTab === 'glyphs' && renderGlyphsTab()}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="modal-cancel-btn">
            {isViewMode ? 'CLOSE' : 'CANCEL'}
          </button>
          {!isViewMode && (
            <button className={`gold-gradient-btn ${isSaving ? 'saving' : ''}`} onClick={handleSave} disabled={isSaving}>
              {saveText}
            </button>
          )}
        </div>
      </div>
      
      <InfoModal isOpen={infoType === 'glyphs'} onClose={() => setInfoType(null)} title="Rúnák (Glyphs) Számolási Módszere">
        <p>A játék motorja a rúnák fejlettségét nem szintként (pl. Level 47) tárolja, hanem egyetlen összesített számként, amely a rúnába a legelső szinttől kezdve befektetett összes <strong>Rúnakövet / Tapasztalati Pontot (XP)</strong> jelöli.</p>
        <p>Egyetlen rúna 0-ról 40-es szintre történő fejlesztése összesen <strong>49 650 Rúnakőbe</strong> kerül. A szintek árai blokkonként növekednek:</p>
        <ul>
          <li><strong>1–5. szint:</strong> 750 kő (150 / szint)</li>
          <li><strong>6–10. szint:</strong> 1200 kő (240 / szint)</li>
          <li><strong>11–15. szint:</strong> 2850 kő (570 / szint)</li>
          <li><strong>16–20. szint:</strong> 3300 kő (660 / szint)</li>
          <li><strong>21–25. szint:</strong> 7800 kő (1560 / szint)</li>
          <li><strong>26–30. szint:</strong> 8850 kő (1770 / szint)</li>
          <li><strong>31–35. szint:</strong> 11 850 kő (2370 / szint)</li>
          <li><strong>36–40. szint:</strong> 13 050 kő (2610 / szint)</li>
          <li><strong>41–45. szint:</strong> 15 000 kő (3000 / szint)</li>
          <li><strong>46–50. szint:</strong> 16 500 kő (3300 / szint)</li>
        </ul>
        <p>Amikor az adatokat importálod (pl. egy kinyert CSV fájlból), az ott szereplő hatalmas számok (pl. <em>33350</em>) ezt az összesített progressziót jelölik. Az alkalmazásunk ezt a nyers értéket is el tudja tárolni, amiből a fenti táblázat alapján visszafejthető a pontos szint.</p>
      </InfoModal>

      <InfoModal isOpen={infoType === 'ascension'} onClose={() => setInfoType(null)} title="Felemelkedés (Ascension)">
        <p>A játék a Felemelkedés (Ascension) állapotát belső <strong>csomópont (node) azonosítók</strong> listájaként tárolja (pl. <em>0, 1, 2, 3, 4, 5</em>).</p>
        <p>Mivel a pontos megfeleltetés (hogy melyik ID pontosan melyik Rankhoz és Branch-hez tartozik) még nem ismert teljesen, az importáló algoritmusunk jelenleg egy <strong>közelítő becslést</strong> alkalmaz:</p>
        <ul>
          <li>A feloldott csomópontok összesített darabszámát (hosszát) veszi alapul.</li>
          <li>Minden 5. csomópont után növeli a <strong>Rankot (I-V)</strong>.</li>
          <li>A maradék csomópontokat a <strong>Branch</strong> (ág) pontokhoz adja hozzá.</li>
        </ul>
        <p><strong>Figyelem:</strong> Ez a jelenlegi számolás csak becslés! A pontos algoritmus és ID-térkép felderítése folyamatban van. Addig is lehetőséged van a becsült értékeket a felületen manuálisan felülírni a pontos adatokkal.</p>
      </InfoModal>
    </div>
  );
};

export default HeroModal;
