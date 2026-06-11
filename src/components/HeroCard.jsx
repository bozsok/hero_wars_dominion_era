import React, { useState, useEffect } from 'react';

const HeroCard = ({ hero, onClick }) => {
  const heroLevel = hero.general?.level || 0;
  const isOwned = heroLevel > 0;
  const starsCount = hero.general?.stars || 1;



  const rankStr = hero.items?.rank || 'White';
  let baseColorClass = 'hero-rank-gray';


  if (rankStr.includes('Green')) baseColorClass = 'hero-rank-green';
  else if (rankStr.includes('Blue')) baseColorClass = 'hero-rank-blue';
  else if (rankStr.includes('Violet')) baseColorClass = 'hero-rank-violet';
  else if (rankStr.includes('Orange')) baseColorClass = 'hero-rank-orange';
  else if (rankStr.includes('Red')) baseColorClass = 'hero-rank-red';



  return (
    <div
      className={`hero-card-container ${!isOwned ? 'hero-card-inactive' : ''}`}
      onClick={() => isOwned && onClick && onClick(hero)}
    >
      <div className={`hero-card-image-wrapper ${isOwned ? baseColorClass : 'hero-rank-gray'}`}>
        {isOwned && <div className="hero-level-badge">{heroLevel}</div>}
        <div className="hero-card-image-inner">
          <img
            src={`./heroes/${hero.id}.png`}
            alt={hero.name}
            className="hero-card-image"
          />
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
      <div className="hero-card-info">
        <p className="hero-card-name">{hero.name}</p>
        <p className="hero-card-faction">{(hero.roles || []).join(', ') || ''}</p>
      </div>
    </div>
  );
};

export default HeroCard;
