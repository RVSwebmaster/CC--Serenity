Character Crucible Step 11 damage tab patch

Files included:
- assets/css/app.css
- assets/js/app.bundle.js
- assets/js/steps/step_sheet.js

Notes:
- The damage drawer keeps the existing stun/wounds logic, controls, and save data behavior.
- When closed, the drawer now collapses into a slim right-edge tab instead of a full-width collapsed block.
- The closed tab shows a compact live summary with separate Stun and Wounds pills.
- Opening the tab restores the full existing damage controls and bubble interaction.
- app.bundle.js was rebuilt from assets/js/app.js with esbuild after the source change.
