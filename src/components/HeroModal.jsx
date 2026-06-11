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

const FactionTranslations = {
  'Way of Nature': 'A természet útja',
  'Way of Honor': 'A becsület útja',
  'Way of Progress': 'A fejlődés útja',
  'Way of Chaos': 'A káosz útja',
  'Way of Eternity': 'Az örökkévalóság útja',
  'Way of Mystery': 'A rejtély útja'
};

const HeroModal = ({ hero, onClose }) => {
  const { updateHeroData, isViewMode } = useContext(HeroContext);
  const [heroData, setHeroData] = useState({ ...hero });
  const [activeTab, setActiveTab] = useState('info');
  const [isSaving, setIsSaving] = useState(false);
  const [saveText, setSaveText] = useState('SAVE HERO DATA');
  const [infoType, setInfoType] = useState(null);
  
  const [guideData, setGuideData] = useState(null);
  const [isGuideLoading, setIsGuideLoading] = useState(false);

  const heroLevel = heroData.general?.level || 0;
  const starsCount = heroData.general?.stars || 1;
  const rankStr = heroData.items?.rank || 'White';
  const isOwned = heroLevel > 0;

  let baseColorClass = 'hero-rank-gray';
  if (rankStr.includes('Green')) baseColorClass = 'hero-rank-green';
  else if (rankStr.includes('Blue')) baseColorClass = 'hero-rank-blue';
  else if (rankStr.includes('Violet')) baseColorClass = 'hero-rank-violet';
  else if (rankStr.includes('Orange')) baseColorClass = 'hero-rank-orange';
  else if (rankStr.includes('Red')) baseColorClass = 'hero-rank-red';

  useEffect(() => {
    // A HeroContext által átadott teljesen egyesített objektumot lemásoljuk a lokális state-be
    setHeroData({ ...hero });
  }, [hero]);

  useEffect(() => {
    if (activeTab === 'guide' && !guideData && !isGuideLoading) {
      setIsGuideLoading(true);
      import(`../data/guides/${hero.id}.json`)
        .then(module => {
          setGuideData(module.default || module);
          setIsGuideLoading(false);
        })
        .catch(err => {
          console.error("Guide load error:", err);
          setGuideData({ error: "Nincs elérhető útmutató ehhez a hőshöz (vagy a fordítás még folyamatban van)." });
          setIsGuideLoading(false);
        });
    }
  }, [activeTab, hero.id, guideData, isGuideLoading]);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
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

  const renderInfoTab = () => {
    const desc = hero.description || {};
    return (
      <div className="modal-tab-content">
        <div className="modal-hero-info">
          <div className="modal-hero-avatar-container">
            <div className={`hero-card-image-wrapper ${isOwned ? baseColorClass : 'hero-rank-gray'} modal-hero-avatar-wrapper`}>
              {isOwned && <div className="hero-level-badge">{heroLevel}</div>}
              <div className="hero-card-image-inner">
                <img src={`./heroes/${hero.id}.png`} alt={hero.name} className="hero-card-image" />
              </div>
              <img
                src={`./hero_borders/${!isOwned ? 'white' : rankStr.toLowerCase()}.png`}
                alt={`${!isOwned ? 'white' : rankStr} frame`}
                className="hero-card-frame"
              />
              {isOwned && (
                <div className="hero-card-stars">
                  {starsCount === 6 ? (
                    <img src="./hero_borders/6stars.png" alt="Absolute Star" className="hero-card-6stars" />
                  ) : (
                    [...Array(starsCount)].map((_, i) => (
                      <img key={i} src="./hero_borders/star.png" alt="Star" className="hero-card-star" />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="modal-hero-text-wrapper">
            <h2 className="modal-hero-name">
              {hero.name}
            </h2>
            <div className="modal-hero-id">
              #{hero.id}
            </div>
            <div className="modal-hero-roles-header">
              <span className="hero-role-chip">{hero.mainStat || 'Ismeretlen'}</span>
              {(hero.roles || []).map(role => (
                <span key={role} className="hero-role-chip">{role}</span>
              ))}
            </div>
          </div>
        </div>

        <p className="modal-hero-summary">
          {desc.summary || "Nincs elérhető leírás erről a hősről."}
        </p>

        <div className="modal-hero-pros-cons">
          <div className="modal-stat-column">
            <h4 className="pros-title">
              <span className="material-symbols-outlined">check_circle</span> Erősségek
            </h4>
            <ul className="pros-cons-list">
              {(desc.strengths || []).map((s, idx) => (
                <li key={idx} className="pros-cons-item">
                  <span className="pros-icon">✅</span> <span>{s}</span>
                </li>
              ))}
              {(!desc.strengths || desc.strengths.length === 0) && <li className="pros-cons-empty">Nincs adat</li>}
            </ul>
          </div>

          <div className="modal-stat-column">
            <h4 className="cons-title">
              <span className="material-symbols-outlined">cancel</span> Gyengeségek
            </h4>
            <ul className="pros-cons-list">
              {(desc.weaknesses || []).map((w, idx) => (
                <li key={idx} className="pros-cons-item">
                  <span className="cons-icon">❌</span> <span>{w}</span>
                </li>
              ))}
              {(!desc.weaknesses || desc.weaknesses.length === 0) && <li className="pros-cons-empty">Nincs adat</li>}
            </ul>
          </div>
        </div>

        <div className="modal-hero-bottom-stats">
          <div className="bottom-stat-box">
            <strong className="bottom-stat-title">Fő Statisztika</strong>
            <span className="bottom-stat-value">{hero.mainStat || 'Ismeretlen'}</span>
          </div>
          <div className="bottom-stat-box">
            <strong className="bottom-stat-title">Szerepkörök</strong>
            <span className="bottom-stat-value">{(hero.roles || []).join(', ') || 'Ismeretlen'}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderGuideTab = () => {
    return (
      <div className="modal-tab-content">
        <h3 className="modal-section-title">Útmutató és gyakorlati tapasztalatok</h3>
        {isGuideLoading ? (
          <p style={{ color: 'var(--on-surface-variant)' }}>Útmutató betöltése folyamatban...</p>
        ) : guideData?.error ? (
          <p style={{ color: 'var(--error)' }}>{guideData.error}</p>
        ) : guideData?.sections ? (
          <div className="guide-sections">
            {guideData.sections.map((sec, idx) => (
              <div key={idx} className="guide-section" style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  color: 'var(--primary)', 
                  fontFamily: 'var(--font-title-md)', 
                  fontSize: '18px', 
                  borderBottom: '1px solid var(--surface-variant)', 
                  paddingBottom: '8px', 
                  marginBottom: '12px' 
                }}>{sec.title}</h4>
                <div style={{ 
                  whiteSpace: 'pre-wrap', 
                  color: 'var(--on-surface)', 
                  lineHeight: '1.5',
                  fontSize: '14px'
                }}>
                  {sec.content}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--on-surface-variant)' }}>Kattints egy útmutató megtekintéséhez.</p>
        )}
      </div>
    );
  };

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

  const renderSkillsOnlyTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-column modal-stat-column-half">
        <h3 className="tab-section-title">Skills</h3>
        {heroData.staticSkills?.map((s, idx) => (
          <div className="stat-input-group" key={`skill-${idx}`}>
            <label>{s.name} (Max: {s.max})</label>
            <input type="number" className="stat-input" value={heroData.skills?.[idx] || 0} onChange={e => handleArrayChange('skills', idx, e.target.value)} disabled={isViewMode} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSkinsOnlyTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-column modal-stat-column-half">
        <h3 className="tab-section-title">Skins</h3>
        {heroData.staticSkins?.map(skin => (
          <div className="stat-input-group" key={skin.id}>
            <label>{skin.name} - {skin.stat} (Max: {skin.max})</label>
            <input type="number" className="stat-input" value={heroData.skins?.[skin.id] || 0} onChange={e => handleChange(`skins.${skin.id}`, e.target.value)} disabled={isViewMode} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderArtifactsOnlyTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-column modal-stat-column-half">
        <h3 className="tab-section-title">Artifacts</h3>
        {['weapon', 'book', 'ring'].map(type => (
          <div className="stat-group-box" key={type}>
            <h4>{heroData.staticArtifacts?.[type]?.name || type.toUpperCase()}</h4>
            <div className="artifact-input-row">
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
    </div>
  );

  const renderGoEOnlyTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-column modal-stat-column-half">
        <h3 className="tab-section-title">Gift of the Elements</h3>
        <div className="stat-input-group">
          <label>Level (0-30)</label>
          <input type="number" className="stat-input" value={heroData.giftOfElements || 0} onChange={e => handleChange('giftOfElements', e.target.value)} disabled={isViewMode} />
        </div>
      </div>
    </div>
  );

  const renderGlyphsOnlyTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-column modal-stat-column-half">
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
              <div className="glyph-row-header">
                <select
                  className="stat-input glyph-select"
                  value={currentName}
                  onChange={e => handleArrayChange('glyphNames', idx, e.target.value, false)}
                  disabled={isViewMode}
                >
                  {GlyphTypes.map(gt => <option key={gt} value={gt}>{gt}</option>)}
                </select>
                <label className="glyph-label-center">(0-40/50)</label>
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
    </div>
  );

  const renderAscensionOnlyTab = () => (
    <div className="modal-tab-content">
      <div className="modal-stat-column modal-stat-column-half">
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
  );

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal-outside-tabs">
          <div className={`modal-flag ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Info</div>
          <div className={`modal-flag ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>Útmutató</div>
          <div className={`modal-flag ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</div>
          <div className={`modal-flag ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills</div>
          <div className={`modal-flag ${activeTab === 'skins' ? 'active' : ''}`} onClick={() => setActiveTab('skins')}>Skins</div>
          <div className={`modal-flag ${activeTab === 'artifacts' ? 'active' : ''}`} onClick={() => setActiveTab('artifacts')}>Artifacts</div>
          <div className={`modal-flag modal-flag-small-text ${activeTab === 'goe' ? 'active' : ''}`} onClick={() => setActiveTab('goe')}>Gift of the Elements</div>
          <div className={`modal-flag ${activeTab === 'glyphs' ? 'active' : ''}`} onClick={() => setActiveTab('glyphs')}>Glyphs</div>
          <div className={`modal-flag ${activeTab === 'ascension' ? 'active' : ''}`} onClick={() => setActiveTab('ascension')}>Ascension</div>

          <div className="modal-save-container">
            {!isViewMode && (
              <button className="action-btn btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Mentés...' : 'Mentés'}
              </button>
            )}
          </div>
        </div>

        <div className="modal-content gold-frame">
          <button className="modal-close-icon" onClick={onClose}></button>
          <div className="modal-title-banner">Hős adatlap</div>
          <div className="modal-body-landscape">
            <div className="modal-panel">
              <div className="modal-scroll-container">
                {activeTab === 'info' && renderInfoTab()}
                {activeTab === 'guide' && renderGuideTab()}
                {activeTab === 'stats' && renderGeneralTab()}
                {activeTab === 'skills' && renderSkillsOnlyTab()}
                {activeTab === 'skins' && renderSkinsOnlyTab()}
                {activeTab === 'artifacts' && renderArtifactsOnlyTab()}
                {activeTab === 'goe' && renderGoEOnlyTab()}
                {activeTab === 'glyphs' && renderGlyphsOnlyTab()}
                {activeTab === 'ascension' && renderAscensionOnlyTab()}
              </div>
            </div>
          </div>
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
