import { createEmptyTrait, TRAIT_OPTIONS } from '../data/defaults.js';
import { CURATED_ASSETS, CURATED_COMPLICATIONS, getMutuallyExclusiveTraits, isRepeatableTrait } from '../data/traits.js';
import { el, sectionHeader } from '../ui.js';

const activeTraitSelection = {
  asset: null,
  complication: null
};

function getTraitInfo(category, trait, curated) {
  const label = category === 'asset' ? 'Asset' : 'Complication';
  const defaultSummary = category === 'asset'
    ? 'Pick a trait to see the basic edge it gives a Greenhorn.'
    : 'Pick a trait to see the basic trouble it brings with it.';

  if (!trait) {
    return {
      title: `No ${label} selected`,
      summary: defaultSummary,
      ratings: 'd2 or d4 depending on the trait.'
    };
  }

  if ((trait.source || 'curated') === 'manual') {
    return {
      title: trait.name || `Custom ${label}`,
      summary: 'Manual entry. Use Notes to record the exact effect, limit, or story hook you want the GM to remember.',
      ratings: trait.rating === 'none' ? 'Pick a die rating to price this custom trait.' : `Current rating: ${trait.rating}.`
    };
  }

  const traitMeta = curated.find((item) => item.name === trait.name);
  if (!traitMeta) {
    return {
      title: trait.name || `Choose an ${label}`,
      summary: defaultSummary,
      ratings: 'Allowed ratings appear once a curated trait is chosen.'
    };
  }

  return {
    title: traitMeta.name,
    summary: traitMeta.summary,
    ratings: `Allowed ratings: ${traitMeta.allowedRatings.join(', ')}`
  };
}

function chooseActiveTrait(list, category) {
  const activeId = activeTraitSelection[category];
  const active = list.find((trait) => trait.id === activeId)
    || list.find((trait) => trait.name)
    || list[0]
    || null;
  activeTraitSelection[category] = active?.id || null;
  return active;
}

function getUnavailableTraitNames(stateList, currentTrait) {
  return stateList
    .filter((item) => item.id !== currentTrait.id && item.name && !isRepeatableTrait(item.name))
    .map((item) => item.name);
}

function getBlockedTraitNames(list, oppositeList, currentTrait) {
  const blocked = new Set();
  [...list, ...oppositeList]
    .filter((item) => item.id !== currentTrait.id && item.name)
    .forEach((item) => {
      getMutuallyExclusiveTraits(item.name).forEach((name) => blocked.add(name));
    });
  return blocked;
}

function buildTraitSection(title, list, oppositeList, curated, onChange, category) {
  const wrap = el('div', { cls: 'field-card' });
  wrap.append(el('h3', { text: title }));

  const maxTraits = 5;
  const slotLine = list.length > maxTraits
    ? `Over the cap: ${list.length} / ${maxTraits} slots used. Remove extras.`
    : `Slots used: ${list.length} / ${maxTraits}`;
  wrap.append(el('p', { cls: list.length > maxTraits ? 'help danger-text' : 'help muted', text: slotLine }));

  const infoTitle = el('strong', { cls: 'trait-info-title' });
  const infoSummary = el('p', { cls: 'trait-info-copy' });
  const infoRatings = el('p', { cls: 'trait-info-line muted' });
  const infoBox = el('div', { cls: 'trait-info-box' }, [
    el('div', { cls: 'trait-info-label', text: category === 'asset' ? 'Asset explainer' : 'Complication explainer' }),
    infoTitle,
    infoSummary,
    infoRatings
  ]);
  wrap.append(infoBox);

  const setInfo = (trait) => {
    if (trait?.id) activeTraitSelection[category] = trait.id;
    const info = getTraitInfo(category, trait, curated);
    infoTitle.textContent = info.title;
    infoSummary.textContent = info.summary;
    infoRatings.textContent = info.ratings;
  };

  list.forEach((trait) => {
    const isLegacyManual = (trait.source || 'curated') === 'manual';
    const traitMeta = curated.find((item) => item.name === trait.name);
    const ownSelections = getUnavailableTraitNames(list, trait);
    const blockedSelections = getBlockedTraitNames(list, oppositeList, trait);
    const nameWrap = el('div', { cls: 'trait-name-wrap' });

    let nameInput;
    if (isLegacyManual) {
      nameInput = document.createElement('input');
      nameInput.value = trait.name;
      nameInput.placeholder = 'Enter trait name';
    } else {
      nameInput = document.createElement('select');
      const blank = document.createElement('option');
      blank.value = '';
      blank.textContent = 'Choose a trait';
      nameInput.append(blank);
      curated.forEach((item) => {
        if ((ownSelections.includes(item.name) || blockedSelections.has(item.name)) && item.name !== trait.name) return;
        const opt = document.createElement('option');
        opt.value = item.name;
        opt.textContent = item.name;
        if (trait.name === item.name) opt.selected = true;
        nameInput.append(opt);
      });
    }
    nameInput.addEventListener('input', (event) => {
      activeTraitSelection[category] = trait.id;
      onChange((draft) => {
        const target = draft.traits[category === 'asset' ? 'assets' : 'complications'].find((item) => item.id === trait.id);
        target.name = event.target.value;
        const match = curated.find((item) => item.name === target.name);
        if (match && !match.allowedRatings.includes(target.rating)) {
          target.rating = match.allowedRatings[0];
        }
      });
    });
    nameWrap.append(nameInput);

    const ratingSelect = document.createElement('select');
    const allowedRatings = traitMeta?.allowedRatings || TRAIT_OPTIONS.filter((item) => item !== 'none');
    ['none', ...allowedRatings].forEach((rating) => {
      const opt = document.createElement('option');
      opt.value = rating;
      opt.textContent = rating === 'none' ? '—' : rating;
      if (trait.rating === rating) opt.selected = true;
      ratingSelect.append(opt);
    });
    ratingSelect.addEventListener('change', (event) => {
      activeTraitSelection[category] = trait.id;
      onChange((draft) => {
        const target = draft.traits[category === 'asset' ? 'assets' : 'complications'].find((item) => item.id === trait.id);
        target.rating = event.target.value;
      });
    });

    const notes = document.createElement('input');
    notes.value = trait.notes || '';
    notes.placeholder = 'Notes';
    notes.addEventListener('input', (event) => {
      activeTraitSelection[category] = trait.id;
      onChange((draft) => {
        const target = draft.traits[category === 'asset' ? 'assets' : 'complications'].find((item) => item.id === trait.id);
        target.notes = event.target.value;
      });
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => onChange((draft) => {
      const key = category === 'asset' ? 'assets' : 'complications';
      draft.traits[key] = draft.traits[key].filter((item) => item.id !== trait.id);
      if (draft.traits[key].length === 0) draft.traits[key].push(createEmptyTrait(category));
      if (activeTraitSelection[category] === trait.id) activeTraitSelection[category] = draft.traits[key][0]?.id || null;
    }));

    const row = el('div', { cls: 'trait-row' }, [
      el('div', { cls: 'trait-row-top' }, [
        nameWrap,
        ratingSelect,
        el('div', { cls: 'trait-points', html: `<span class="points-badge">${trait.rating === 'none' ? 0 : trait.rating.replace('d', '')}</span>` }),
        removeButton
      ]),
      el('div', { cls: 'trait-row-bottom' }, [
        notes
      ])
    ]);

    [row, nameInput, ratingSelect, notes].forEach((node) => {
      node.addEventListener('focus', () => setInfo(trait), true);
      node.addEventListener('click', () => setInfo(trait));
    });
    wrap.append(row);
  });

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = `Add ${title.slice(0, -1)}`;
  addButton.disabled = list.length >= maxTraits;
  addButton.addEventListener('click', () => onChange((draft) => {
    const key = category === 'asset' ? 'assets' : 'complications';
    if (draft.traits[key].length >= maxTraits) return;
    draft.traits[key].push(createEmptyTrait(category));
    activeTraitSelection[category] = draft.traits[key][draft.traits[key].length - 1].id;
  }));
  const sectionActions = el('div', { cls: 'section-actions' }, [addButton]);
  if (list.length >= maxTraits) {
    sectionActions.append(el('small', { cls: 'help muted', text: `Maximum ${maxTraits} ${title.toLowerCase()} reached.` }));
  }
  wrap.append(sectionActions);

  setInfo(chooseActiveTrait(list, category));
  return wrap;
}

export function renderTraitsStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 5: Traits', 'Assets help you, Complications haunt you. Greenhorns start with 0 Trait Points, so Complications are what fund the useful edges you can afford to keep.'));

  root.append(el('div', { cls: 'summary-card' }, [
    el('p', { text: 'Quick rule: choose at least one Asset and one Complication. Keep the final Trait Point remainder at 0 or higher. d2 is the quick minor stand-in, d4 the rough major stand-in. You can keep up to five Assets and five Complications.' })
  ]));

  const grid = el('div', { cls: 'traits-stack' }, [
    buildTraitSection('Complications', state.character.traits.complications, state.character.traits.assets, CURATED_COMPLICATIONS, onChange, 'complication'),
    buildTraitSection('Assets', state.character.traits.assets, state.character.traits.complications, CURATED_ASSETS, onChange, 'asset')
  ]);
  root.append(grid);
  return root;
}
