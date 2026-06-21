import React, { useState, useEffect, useContext } from 'react';
import { HeroContext } from '../context/HeroContext';
import InfoModal from './InfoModal';
import { calculateHeroStats } from '../utils/statCalculator';
import gameDictionary from '../data/gameDictionary.json' with { type: 'json' };
import heroGameSpecs from '../data/heroGameSpecs.json' with { type: 'json' };

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

const GLYPH_XP_PER_LEVEL = [
  50, 50, 50, 50, 50, 80, 80, 80, 80, 80, 190, 190, 190, 190, 190,
  220, 220, 220, 220, 220, 520, 520, 520, 520, 520, 590, 590, 590, 590, 590,
  790, 790, 790, 790, 790, 870, 870, 870, 870, 870,
  1970, 1970, 1970, 1970, 1970, 3470, 3470, 3470, 3470, 3470
];

const HeroModal = ({ hero, onClose }) => {
  const { isViewMode } = useContext(HeroContext);
  const [heroData, setHeroData] = useState({ ...hero });
  const [activeTab, setActiveTab] = useState('info');
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

  const handleCopyData = () => {
    const calculatedStats = calculateHeroStats(hero.id, heroData);

    const cleanData = {
      id: heroData.id,
      name: heroData.name,
      mainStat: heroData.mainStat,
      roles: heroData.roles,
      general: heroData.general,
      items: heroData.items,
      skills: heroData.skills,
      artifacts: heroData.artifacts,
      skins: heroData.skins,
      glyphs: heroData.glyphs,
      giftOfElements: heroData.giftOfElements,
      ascension: heroData.ascension,
      calculatedStats: calculatedStats ? {
        power: calculatedStats.power,
        primary: calculatedStats.primary,
        secondary: calculatedStats.secondary
      } : null
    };

    navigator.clipboard.writeText(JSON.stringify(cleanData, null, 2))
      .then(() => alert('Adatok másolva a vágólapra!'))
      .catch(err => console.error('Hiba a másoláskor: ', err));
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
          <div className="modal-hero-text-wrapper" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h2 className="modal-hero-name" style={{ margin: 0 }}>
                  {hero.name}
                </h2>
                <div className="modal-hero-id" style={{ margin: 0 }}>
                  #{hero.id}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  className="action-btn btn-save"
                  style={{
                    background: 'linear-gradient(180deg, #b67532 0%, #8c521f 100%)',
                    color: '#fff',
                    border: '1px solid #feec5f',
                    padding: '6px 12px',
                    fontSize: '16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                  onClick={handleCopyData}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>content_copy</span>
                  Adatok másolása
                </button>
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: '#feec5f',
                    cursor: 'help',
                    fontSize: '28px'
                  }}
                  title="Ha csak ezen hős fejlesztésével kapcsolatban szeretnél tanácsot kérni egy AI-tól (pl. ChatGPT, Gemini), akkor nem kell a teljes exportfájlt feltöltened. Ezzel a gombbal vágólapra másolhatod a hős adatait, és közvetlenül beillesztheted a chatbe."
                >
                  info
                </span>
              </div>
            </div>

            <div className="modal-hero-roles-header" style={{ marginTop: '8px' }}>
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

        <div className="modal-hero-bottom-stats" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {/* Harcvonal */}
          <div className="bottom-stat-box" style={{ flex: '1 1 180px' }}>
            <strong className="bottom-stat-title">Harcvonal (Line)</strong>
            <span className="bottom-stat-value" style={{ color: '#fece86', fontWeight: 'bold' }}>
              {(heroGameSpecs[hero.id]?.line) || 'Fights at the middle line'}
            </span>
          </div>

          {/* Fő szerepkör */}
          <div className="bottom-stat-box" style={{ flex: '1 1 180px' }}>
            <strong className="bottom-stat-title">Fő Szerepkör</strong>
            <span className="bottom-stat-value">
              Main role: {hero.roles[0] || 'Ismeretlen'}
            </span>
          </div>

          {/* Kiegészítő szerepkör */}
          {hero.roles[1] && (
            <div className="bottom-stat-box" style={{ flex: '1 1 180px' }}>
              <strong className="bottom-stat-title">Kiegészítő Szerepkör</strong>
              <span className="bottom-stat-value">
                Additional role: {hero.roles[1]}
              </span>
            </div>
          )}

          {/* Különlegesség */}
          {heroGameSpecs[hero.id]?.special && (
            <div className="bottom-stat-box" style={{ flex: '1 1 180px' }}>
              <strong className="bottom-stat-title">Szövetség (Special)</strong>
              <span className="bottom-stat-value">
                Special: {heroGameSpecs[hero.id].special}
              </span>
            </div>
          )}

          {/* Fő statisztika */}
          <div className="bottom-stat-box" style={{ flex: '1 1 180px' }}>
            <strong className="bottom-stat-title">Fő Hős Statisztika</strong>
            <span className="bottom-stat-value">
              Main hero stat: {hero.mainStat || 'Ismeretlen'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderGuideTab = () => {
    return (
      <div className="modal-tab-content">
        <h3 className="modal-section-title" style={{
          fontSize: '28px',
          fontFamily: 'var(--font-display-lg)',
          color: 'var(--primary-fixed)',
          textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
          lineHeight: '1.3',
          paddingTop: '10px',
          marginBottom: '20px',
          borderBottom: '1px solid rgba(255, 225, 109, 0.2)',
          paddingBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          Útmutató és gyakorlati tapasztalatok
          <span
            className="material-symbols-outlined"
            style={{
              color: 'var(--primary-fixed)',
              cursor: 'help',
              fontSize: '28px',
              opacity: 0.8
            }}
            title="Ezek az útmutatók és gyakorlati tapasztalatok a https://moon-hero.site/ weboldalról származnak."
          >
            info
          </span>
        </h3>
        {isGuideLoading ? (
          <p style={{ color: 'var(--on-surface-variant)' }}>Útmutató betöltése folyamatban...</p>
        ) : guideData?.error ? (
          <p style={{ color: 'var(--error)' }}>{guideData.error}</p>
        ) : guideData?.sections ? (
          <div className="guide-sections">
            {guideData.sections.map((sec, idx) => (
              <div key={idx} className="guide-section" style={{ marginBottom: '24px' }}>
                <h4 style={{
                  color: sec.level === 1 ? 'var(--secondary)' : 'var(--primary)',
                  fontFamily: 'var(--font-title-md)',
                  fontSize: sec.level === 1 ? '22px' : '17px',
                  borderBottom: sec.level === 1 ? 'none' : '1px solid var(--surface-variant)',
                  paddingBottom: sec.level === 1 ? '0' : '6px',
                  marginBottom: '12px',
                  marginTop: sec.level === 1 ? '24px' : '12px'
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

  const renderGeneralTab = () => {
    const calculatedStats = calculateHeroStats(hero.id, heroData);

    const rankStr = heroData.items?.rank || 'White';
    let rankColorClass = 'white';
    if (rankStr.toLowerCase().includes('green')) rankColorClass = 'green';
    else if (rankStr.toLowerCase().includes('blue')) rankColorClass = 'blue';
    else if (rankStr.toLowerCase().includes('violet')) rankColorClass = 'violet';
    else if (rankStr.toLowerCase().includes('orange')) rankColorClass = 'orange';
    else if (rankStr.toLowerCase().includes('red')) rankColorClass = 'red';

    const starsCount = heroData.general?.stars || 1;

    return (
      <div className="modal-tab-content">
        <div className="modal-stat-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
          {/* Bal oszlop: Alapadatok és Power banner */}
          <div className="modal-stat-column">
            <h3 className="tab-section-title">Hős állapota</h3>

            {/* Játékbeli erő banner */}
            <div className="power-banner-card">
              <span className="premium-card-subtitle" style={{ color: '#fece86' }}>Játékbeli Erő (Power)</span>
              <div className="power-banner-value">{(heroData.general?.power || 0).toLocaleString()}</div>
              {calculatedStats && (
                <div style={{ fontSize: '12px', color: '#ccc', marginTop: '8px' }}>
                  Számított tiszta erő: {calculatedStats.power.toLocaleString()}
                </div>
              )}
            </div>

            {/* Alapadatok kártya */}
            <div className="premium-card" style={{ marginTop: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ccc' }}>Szint:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#fff' }}>{heroData.general?.level || 1}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#ccc' }}>Felszerelés Rang:</span>
                  <span className={`rank-badge-pill ${rankColorClass}`}>{rankStr}</span>
                </div>

                {/* Soul Stones progress bar */}
                <div style={{ marginTop: '4px' }}>
                  <div className="premium-progress-label">
                    <span>Lélekkövek (Soul Stones):</span>
                    <span>{starsCount === 6 ? 'MAX' : `${heroData.general?.soulStones || 0} / 300`}</span>
                  </div>
                  {starsCount < 6 && (
                    <div className="premium-progress-bar" style={{ marginTop: '4px' }}>
                      <div
                        className="premium-progress-fill"
                        style={{ width: `${((heroData.general?.soulStones || 0) / 300) * 100}%` }}
                      ></div>
                    </div>
                  )}
                </div>
              </div>
            </div>


          </div>

          {/* Jobb oszlop: Kalkulált tiszta passzív statisztikák */}
          <div className="modal-stat-column">
            <h3 className="tab-section-title">Kalkulált Tiszta Statisztikák (Felszerelések nélkül)</h3>

            {calculatedStats ? (
              <div className="premium-stat-grid-2col">
                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">favorite</span>
                    Egészség (Health)
                  </span>
                  <span className="premium-stat-value">{calculatedStats.secondary.health.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">fitness_center</span>
                    Erő (Strength)
                  </span>
                  <span className="premium-stat-value">{calculatedStats.primary.strength.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">bolt</span>
                    Ügyesség (Agility)
                  </span>
                  <span className="premium-stat-value">{calculatedStats.primary.agility.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">psychology</span>
                    Intelligencia (Int.)
                  </span>
                  <span className="premium-stat-value">{calculatedStats.primary.intelligence.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">swords</span>
                    Fizikai támadás
                  </span>
                  <span className="premium-stat-value">{calculatedStats.secondary.physicalAttack.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">auto_awesome</span>
                    Mágikus támadás
                  </span>
                  <span className="premium-stat-value">{calculatedStats.secondary.magicAttack.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">shield</span>
                    Páncél (Armor)
                  </span>
                  <span className="premium-stat-value">{calculatedStats.secondary.armor.toLocaleString()}</span>
                </div>

                <div className="premium-stat-row">
                  <span className="premium-stat-label-with-icon">
                    <span className="material-symbols-outlined premium-stat-icon">shield_moon</span>
                    Mágikus védelem
                  </span>
                  <span className="premium-stat-value">{calculatedStats.secondary.magicDefense.toLocaleString()}</span>
                </div>

                {calculatedStats.secondary.dodge > 0 && (
                  <div className="premium-stat-row">
                    <span className="premium-stat-label-with-icon">
                      <span className="material-symbols-outlined premium-stat-icon">keyboard_double_arrow_right</span>
                      Kitérés (Dodge)
                    </span>
                    <span className="premium-stat-value">{calculatedStats.secondary.dodge.toLocaleString()}</span>
                  </div>
                )}

                {calculatedStats.secondary.critHitChance > 0 && (
                  <div className="premium-stat-row">
                    <span className="premium-stat-label-with-icon">
                      <span className="material-symbols-outlined premium-stat-icon">star</span>
                      Kritikus esély
                    </span>
                    <span className="premium-stat-value">{calculatedStats.secondary.critHitChance.toLocaleString()}</span>
                  </div>
                )}

                {calculatedStats.secondary.armorPenetration > 0 && (
                  <div className="premium-stat-row">
                    <span className="premium-stat-label-with-icon">
                      <span className="material-symbols-outlined premium-stat-icon">heart_broken</span>
                      Páncéláttörés
                    </span>
                    <span className="premium-stat-value">{calculatedStats.secondary.armorPenetration.toLocaleString()}</span>
                  </div>
                )}

                {calculatedStats.secondary.magicPenetration > 0 && (
                  <div className="premium-stat-row">
                    <span className="premium-stat-label-with-icon">
                      <span className="material-symbols-outlined premium-stat-icon">auto_fix_high</span>
                      Mágikus áttörés
                    </span>
                    <span className="premium-stat-value">{calculatedStats.secondary.magicPenetration.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '15px', backgroundColor: 'var(--surface-variant)', borderRadius: '8px' }}>
                <p style={{ color: 'var(--on-surface-variant)', margin: 0 }}>
                  Ehhez a hőshöz még nincs felvéve szimulációs profil a gameDictionary.json-be.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Új, összevont infóbox a kalkulációkról és eltérésekről */}
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'rgba(30, 33, 48, 0.6)',
          border: '1px solid #3a3f58',
          borderRadius: '6px',
          fontSize: '13px',
          lineHeight: '1.5',
          color: '#ccc'
        }}>
          <strong style={{ color: '#fece86', display: 'block', fontSize: '14px', marginBottom: '8px' }}>
            ℹ️ Fontos megjegyzés a statisztikák kalkulációjáról
          </strong>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <span style={{ color: '#feec5f', fontWeight: 'bold' }}>Játékbeli Harci erő (Power):</span> Ez a bal oldalon látható érték <strong style={{ color: '#fff' }}>pontos</strong>, mert a játékszerver ezt közvetlenül elküldi a HAR-fájlban.
            </div>
            <div>
              <span style={{ color: '#feec5f', fontWeight: 'bold' }}>Kalkulált tulajdonságok / statisztikák:</span> A jobb oldali táblázatban látható értékek a nyers fejlesztési szintekből számított alapértékek. Ezek az értékek azért <strong style={{ color: '#fff' }}>alacsonyabbak a játékban látottaktól</strong>, mert nem tartalmazzák a <strong style={{ color: '#fff' }}>Céhfejlesztések (Guild Heart of Power)</strong> és a <strong style={{ color: '#fff' }}>Kisállat-pártfogók (Pet Patronage)</strong> által biztosított bónuszokat, amelyeket a szerver nem küld el a hős egyéni adataival együtt.
            </div>
            <div style={{ borderTop: '1px solid #3a3f58', paddingTop: '8px', color: '#a8ffb2' }}>
              🚀 <strong>Jövőbeli fejlesztési lehetőség:</strong> Amint bevezetésre kerül a Kisállatok (Pets) és a Céh-adatok beolvasása, a program képes lesz kiszámítani ezeket a bónuszokat is, így a kalkulált statisztikák is teljesen meg fognak egyezni a játékbeli értékekkel.
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSkinsOnlyTab = () => {
    const heroSkins = gameDictionary.heroes[heroData.id]?.skins || [];
    const defaultSkinInput = heroData.skins?.['default'] || 0;

    return (
      <div className="modal-tab-content">
        <h3 className="tab-section-title">Skins (Kinézetek)</h3>
        <div className="premium-card-grid">
          {/* Default Skin kártya */}
          <div className="premium-card">
            <div className="premium-card-header">
              <span className="premium-card-title">Default Skin</span>
              <span className="premium-card-subtitle">{heroData.mainStat || 'Fő statisztika'}</span>
            </div>
            <div className="premium-progress-container" style={{ marginTop: '12px' }}>
              <div className="premium-progress-label">
                <span>Szint: {defaultSkinInput} / 60</span>
                <span>{defaultSkinInput === 60 ? 'MAX' : ''}</span>
              </div>
              <div className="premium-progress-bar">
                <div
                  className={`premium-progress-fill ${defaultSkinInput === 60 ? 'max' : ''}`}
                  style={{ width: `${(defaultSkinInput / 60) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Egyedi skinek kártyái */}
          {heroSkins.map(skin => {
            const skinVal = heroData.skins?.[skin.name] !== undefined
              ? heroData.skins[skin.name]
              : (skin.id !== undefined && heroData.skins?.[skin.id] !== undefined ? heroData.skins[skin.id] : 0);
            const isMax = skinVal === 60;
            return (
              <div className="premium-card" key={skin.id || skin.name}>
                <div className="premium-card-header">
                  <span className="premium-card-title">{skin.name}</span>
                  <span className="premium-card-subtitle">{skin.attribute}</span>
                </div>
                <div className="premium-progress-container" style={{ marginTop: '12px' }}>
                  <div className="premium-progress-label">
                    <span>Szint: {skinVal} / 60</span>
                    <span>{isMax ? 'MAX' : ''}</span>
                  </div>
                  <div className="premium-progress-bar">
                    <div
                      className={`premium-progress-fill ${isMax ? 'max' : ''}`}
                      style={{ width: `${(skinVal / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderArtifactsOnlyTab = () => {
    const artifactWeapon = gameDictionary.heroes[heroData.id]?.artifactWeapon || {};

    const weaponLvl = heroData.artifacts?.weapon?.level || 0;
    const weaponStars = heroData.artifacts?.weapon?.stars || 0;

    const bookLvl = heroData.artifacts?.book?.level || 0;
    const bookStars = heroData.artifacts?.book?.stars || 0;
    const bookAttr1 = heroData.artifacts?.book?.attribute1 || 'armor';
    const bookAttr2 = heroData.artifacts?.book?.attribute2 || 'magicDefense';

    const ringLvl = heroData.artifacts?.ring?.level || 0;
    const ringStars = heroData.artifacts?.ring?.stars || 0;
    const ringAttr = heroData.artifacts?.ring?.attribute || heroData.mainStat || 'Strength';

    const renderStars = (count) => {
      return (
        <div className="gold-star-rating">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="gold-star" style={{ opacity: i < count ? 1 : 0.2 }}>
              ★
            </span>
          ))}
        </div>
      );
    };

    return (
      <div className="modal-tab-content">
        <h3 className="tab-section-title">Artifacts (Ereklyék)</h3>
        <div className="premium-card-grid">
          {/* Weapon (1. Ereklye) */}
          <div className="premium-card">
            <div className="premium-card-header">
              <span className="premium-card-title">Weapon (1. ereklye)</span>
              {renderStars(weaponStars)}
            </div>
            <p style={{ fontSize: '13px', margin: '4px 0 12px 0', color: 'var(--primary)' }}>
              {artifactWeapon.attribute ? `${artifactWeapon.attribute} buff a csapatnak` : 'Csapat buff'}
            </p>
            <div className="premium-progress-container">
              <div className="premium-progress-label">
                <span>Szint: {weaponLvl} / 100</span>
                <span>{weaponLvl === 100 ? 'MAX' : ''}</span>
              </div>
              <div className="premium-progress-bar">
                <div
                  className={`premium-progress-fill ${weaponLvl === 100 ? 'max' : ''}`}
                  style={{ width: `${(weaponLvl / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Book (2. Ereklye) */}
          <div className="premium-card">
            <div className="premium-card-header">
              <span className="premium-card-title">Book (2. ereklye)</span>
              {renderStars(bookStars)}
            </div>
            <p style={{ fontSize: '13px', margin: '4px 0 12px 0', color: 'var(--primary)' }}>
              Bónuszok: {bookAttr1}, {bookAttr2}
            </p>
            <div className="premium-progress-container">
              <div className="premium-progress-label">
                <span>Szint: {bookLvl} / 100</span>
                <span>{bookLvl === 100 ? 'MAX' : ''}</span>
              </div>
              <div className="premium-progress-bar">
                <div
                  className={`premium-progress-fill ${bookLvl === 100 ? 'max' : ''}`}
                  style={{ width: `${(bookLvl / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Ring (3. Ereklye) */}
          <div className="premium-card">
            <div className="premium-card-header">
              <span className="premium-card-title">Ring (3. ereklye)</span>
              {renderStars(ringStars)}
            </div>
            <p style={{ fontSize: '13px', margin: '4px 0 12px 0', color: 'var(--primary)' }}>
              Bónusz: +{ringAttr} a hősnek
            </p>
            <div className="premium-progress-container">
              <div className="premium-progress-label">
                <span>Szint: {ringLvl} / 100</span>
                <span>{ringLvl === 100 ? 'MAX' : ''}</span>
              </div>
              <div className="premium-progress-bar">
                <div
                  className={`premium-progress-fill ${ringLvl === 100 ? 'max' : ''}`}
                  style={{ width: `${(ringLvl / 100) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGoEOnlyTab = () => {
    const goeLevel = heroData.items?.goe || 0;
    const isMax = goeLevel === 30;
    return (
      <div className="modal-tab-content">
        <h3 className="tab-section-title">Gift of the Elements (Elemek ajándéka)</h3>
        <div className="premium-card" style={{ maxWidth: '450px' }}>
          <div className="premium-card-header">
            <span className="premium-card-title">Gift of the Elements</span>
            <span className="premium-card-subtitle">Fő statisztika bónusz</span>
          </div>
          <div className="premium-progress-container" style={{ marginTop: '16px' }}>
            <div className="premium-progress-label">
              <span>Szint: {goeLevel} / 30</span>
              <span>{isMax ? 'MAX' : ''}</span>
            </div>
            <div className="premium-progress-bar">
              <div
                className={`premium-progress-fill ${isMax ? 'max' : ''}`}
                style={{ width: `${(goeLevel / 30) * 100}%` }}
              ></div>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: '#ccc', marginTop: '12px', lineHeight: '1.4' }}>
            Növeli a hős összes elsődleges statisztikáját (Strength, Agility, Intelligence). A fő statisztika dupla bónuszt kap.
          </p>
        </div>
      </div>
    );
  };

  const renderSkillsOnlyTab = () => {
    const heroLevel = parseInt(heroData.general?.level) || 1;
    const maxLevels = [
      heroLevel,
      heroLevel,
      Math.max(0, heroLevel - 20),
      Math.max(0, heroLevel - 40)
    ];
    const skillNames = ['1. Képesség (White)', '2. Képesség (Green)', '3. Képesség (Blue)', '4. Képesség (Violet)'];

    return (
      <div className="modal-tab-content">
        <h3 className="tab-section-title">Képességek (Skills)</h3>
        <div className="premium-card-grid">
          {skillNames.map((name, idx) => {
            const skillLevel = heroData.skills?.[idx] || 0;
            const maxLvl = maxLevels[idx];
            const isMax = maxLvl > 0 && skillLevel >= maxLvl;
            const isUnlocked = maxLvl > 0;

            return (
              <div className="premium-card" key={idx} style={{ opacity: isUnlocked ? 1 : 0.5 }}>
                <div className="premium-card-header">
                  <span className="premium-card-title">{name}</span>
                  <span className="premium-card-subtitle">{isUnlocked ? 'Feloldva' : 'Lezárva'}</span>
                </div>
                {isUnlocked ? (
                  <div className="premium-progress-container" style={{ marginTop: '12px' }}>
                    <div className="premium-progress-label">
                      <span>Szint: {skillLevel} / {maxLvl}</span>
                      <span>{isMax ? 'MAX' : ''}</span>
                    </div>
                    <div className="premium-progress-bar">
                      <div
                        className={`premium-progress-fill ${isMax ? 'max' : ''}`}
                        style={{ width: `${maxLvl > 0 ? (skillLevel / maxLvl) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--error)', margin: '12px 0 0 0' }}>
                    A hős szintje ({heroLevel}) túl alacsony a feloldáshoz.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGlyphsOnlyTab = () => {
    const catalogHero = gameDictionary.heroes[heroData.id];
    const glyphNames = heroData.staticGlyphs || (catalogHero ? catalogHero.staticGlyphs : []);
    const glyphsXpValues = heroData.glyphs || [0, 0, 0, 0, 0];

    const getGlyphLevel = (xp) => {
      let remainingXp = xp;
      let level = 0;
      for (let i = 0; i < GLYPH_XP_PER_LEVEL.length; i++) {
        if (remainingXp >= GLYPH_XP_PER_LEVEL[i]) {
          remainingXp -= GLYPH_XP_PER_LEVEL[i];
          level = i + 1;
        } else {
          break;
        }
      }
      return level;
    };

    return (
      <div className="modal-tab-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="tab-section-title" style={{ margin: 0 }}>Rúnák (Glyphs)</h3>
          <button className="help-icon-btn" onClick={() => setInfoType('glyphs')} title="Számolási módszer">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
        <div className="premium-card-grid">
          {glyphNames.map((glyphName, idx) => {
            const rawXp = parseInt(glyphsXpValues[idx]) || 0;
            const lvl = getGlyphLevel(rawXp);
            const isMax = lvl === 50;

            return (
              <div className="premium-card" key={idx}>
                <div className="premium-card-header">
                  <span className="premium-card-title">{glyphName}</span>
                  <span className="premium-card-subtitle">Szint: {lvl} / 50</span>
                </div>
                <div className="premium-progress-container" style={{ marginTop: '12px' }}>
                  <div className="premium-progress-label">
                    <span>{rawXp.toLocaleString()} / 33,850 XP</span>
                    <span>{isMax ? 'MAX' : ''}</span>
                  </div>
                  <div className="premium-progress-bar">
                    <div
                      className={`premium-progress-fill ${isMax ? 'max' : ''}`}
                      style={{ width: `${(lvl / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAscensionOnlyTab = () => {
    const ascensionRank = heroData.ascension?.rank || '0';
    const branchLevel = parseInt(heroData.ascension?.branch) || 0;
    const activeNodes = heroData.ascension?.nodes || [];
    const activeNodesCount = activeNodes.length;

    const maxNodesPerRank = { '0': 0, 'I': 10, 'II': 11, 'III': 10, 'IV': 10, 'V': 10 };
    const maxNodes = maxNodesPerRank[ascensionRank] || 0;

    const catalogHero = gameDictionary.heroes[heroData.id];
    const roles = catalogHero?.roles || heroData.roles || [];
    const primaryRole = roles[0] || 'Ismeretlen';

    return (
      <div className="modal-tab-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 className="tab-section-title" style={{ margin: 0 }}>Ascension (Felemelkedés)</h3>
          <button className="help-icon-btn" onClick={() => setInfoType('ascension')} title="Becslés és számolás">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>

        <div className="premium-card-grid">
          {/* Felemelkedési szint és csomópontok */}
          <div className="premium-card">
            <div className="premium-card-header">
              <span className="premium-card-title">Ascension Rank</span>
              <span className="premium-card-subtitle" style={{ fontSize: '16px', fontWeight: 'bold', color: '#feec5f' }}>
                {ascensionRank === '0' ? 'Nincs' : `Rank ${ascensionRank}`}
              </span>
            </div>

            {ascensionRank !== '0' && (
              <div style={{ marginTop: '12px' }}>
                <div className="premium-progress-label">
                  <span>Csomópontok (Nodes): {activeNodesCount} / {maxNodes}</span>
                </div>
                <div className="ascension-node-indicator" style={{ marginTop: '8px' }}>
                  {[...Array(maxNodes)].map((_, i) => (
                    <div
                      key={i}
                      className={`ascension-node-dot ${i < activeNodesCount ? 'active' : ''}`}
                      title={i < activeNodesCount ? 'Feloldott csomópont' : 'Lezárt csomópont'}
                    ></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bölcsesség Fája ág */}
          <div className="premium-card">
            <div className="premium-card-header">
              <span className="premium-card-title">Bölcsesség Fája (Szerepkör)</span>
              <span className="premium-card-subtitle">{primaryRole} ág</span>
            </div>
            <div className="premium-progress-container" style={{ marginTop: '16px' }}>
              <div className="premium-progress-label">
                <span>Szint: {branchLevel} / 50</span>
                <span>{branchLevel === 50 ? 'MAX' : ''}</span>
              </div>
              <div className="premium-progress-bar">
                <div
                  className={`premium-progress-fill ${branchLevel === 50 ? 'max' : ''}`}
                  style={{ width: `${(branchLevel / 50) * 100}%` }}
                ></div>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#ccc', marginTop: '12px', lineHeight: '1.4' }}>
              A Bölcsesség Fájában a **{primaryRole}** szerepkörű hősök fejlesztései érvényesek erre a hősre.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal-outside-tabs">
          <div className={`modal-flag ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Info</div>
          <div className={`modal-flag ${activeTab === 'guide' ? 'active' : ''}`} onClick={() => setActiveTab('guide')}>Guide</div>
          <div className={`modal-flag ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills</div>
          <div className={`modal-flag ${activeTab === 'skins' ? 'active' : ''}`} onClick={() => setActiveTab('skins')}>Skins</div>
          <div className={`modal-flag ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>Stats</div>
          <div className={`modal-flag ${activeTab === 'glyphs' ? 'active' : ''}`} onClick={() => setActiveTab('glyphs')}>Glyphs</div>
          <div className={`modal-flag modal-flag-small-text ${activeTab === 'goe' ? 'active' : ''}`} onClick={() => setActiveTab('goe')}>Gift of the Elements</div>
          <div className={`modal-flag ${activeTab === 'artifacts' ? 'active' : ''}`} onClick={() => setActiveTab('artifacts')}>Artifacts</div>
          <div className={`modal-flag ${activeTab === 'ascension' ? 'active' : ''}`} onClick={() => setActiveTab('ascension')}>Ascension</div>
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
                {activeTab === 'skins' && renderSkinsOnlyTab()}
                {activeTab === 'artifacts' && renderArtifactsOnlyTab()}
                {activeTab === 'goe' && renderGoEOnlyTab()}
                {activeTab === 'skills' && renderSkillsOnlyTab()}
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
          <li>A Bölcsesség Fája szerepkör szintjét a játékszerver válaszából automatikusan beolvassuk.</li>
        </ul>
      </InfoModal>
    </div>
  );
};

export default HeroModal;
