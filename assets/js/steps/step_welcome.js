import { el, field, sectionHeader } from '../ui.js';

export function renderWelcomeStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 1: Welcome', 'Start with the human being before the numbers. Lock in a name, a concept, and a voice before the rest of the build starts making promises for them.'));

  const grid = el('div', { cls: 'grid-2' });
  const left = el('div', { cls: 'field-card' });
  const right = el('div', { cls: 'field-card' });

  const name = document.createElement('input');
  name.value = state.character.basics.name || '';
  name.addEventListener('input', (event) => onChange((draft) => { draft.basics.name = event.target.value; }));
  left.append(field('Name', name, 'What do people call them when the shooting starts?'));

  const concept = document.createElement('input');
  concept.value = state.character.basics.concept || '';
  concept.addEventListener('input', (event) => onChange((draft) => { draft.basics.concept = event.target.value; }));
  left.append(field('Concept', concept, 'A one-line pitch that tells the table who this person is.'));

  right.append(el('div', { cls: 'summary-card guide-card' }, [
    el('h3', { text: 'What this page is for' }),
    el('p', { text: 'This is the part where the character stops being a pile of dice and starts being somebody worth following into trouble.' }),
    el('p', { cls: 'muted', text: 'Name and concept carry forward to the finished sheet, so keep both concise and specific.' })
  ]));

  right.append(el('div', { cls: 'summary-card' }, [
    el('h3', { text: 'Greenhorn tone' }),
    el('p', { text: 'Greenhorns are not blank slates. They know some things, they want some things, and they are still one bad decision away from becoming a cautionary tale.' })
  ]));

  grid.append(left, right);
  root.append(grid);
  return root;
}
