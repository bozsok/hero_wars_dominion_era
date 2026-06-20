const fs = require('fs');

let dash = fs.readFileSync('src/components/Dashboard.jsx', 'utf8');

// 1. Update the context import
dash = dash.replace(
  'const { heroes, playerProfile, playerTeams, isViewMode } = useContext(HeroContext);',
  'const { heroes, playerProfile, playerTeams, isViewMode, viewProfile } = useContext(HeroContext);\n  const displayProfile = (isViewMode && viewProfile) ? viewProfile : playerProfile;'
);

// 2. We don't want to replace `playerProfile` in the first destructuring, but we already did that above.
// Now replace all other instances of `playerProfile` with `displayProfile`.
// Since we added `const displayProfile = ... : playerProfile;`, we need to make sure we don't overwrite THAT one either.
// Let's replace ONLY usages like `playerProfile.` or `!playerProfile` or `playerProfile?.`

dash = dash.replace(/playerProfile\./g, 'displayProfile.');
dash = dash.replace(/!playerProfile/g, '!displayProfile');
dash = dash.replace(/playerProfile\?/g, 'displayProfile?');
dash = dash.replace(/\(playerProfile\)/g, '(displayProfile)');

// Wait, we need to fix the line we just added:
// `const displayProfile = (isViewMode && viewProfile) ? viewProfile : displayProfile;` -> This would happen.
// Let's revert that specific line back!
dash = dash.replace(
  'const displayProfile = (isViewMode && viewProfile) ? viewProfile : displayProfile;',
  'const displayProfile = (isViewMode && viewProfile) ? viewProfile : playerProfile;'
);

fs.writeFileSync('src/components/Dashboard.jsx', dash, 'utf8');
console.log('Dashboard refactored!');
