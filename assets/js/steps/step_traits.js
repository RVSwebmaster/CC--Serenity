import { createEmptyTrait, TRAIT_OPTIONS } from '../data/defaults.js';
import { CURATED_ASSETS, CURATED_COMPLICATIONS, findCuratedTrait, getMutuallyExclusiveTraits, isRepeatableTrait } from '../data/traits.js';
import { el, sectionHeader } from '../ui.js';

const activeTraitSelection = {
  asset: null,
  complication: null
};

function resolveTraitRank(traitMeta, rating = 'none') {
  if (!traitMeta) return '';
  if (traitMeta.rankByRating?.[rating]) return traitMeta.rankByRating[rating];
  return traitMeta.rank || '';
}

function resolveCanonicalTraitName(category, name = '') {
  return findCuratedTrait(category, name)?.name || name;
}

function getTraitInfo(category, trait, curated) {
  const label = category === 'asset' ? 'Asset' : 'Complication';
  const defaultSummary = category === 'asset'
    ? 'Pick a trait to see the basic edge it gives a Greenhorn.'
    : 'Pick a trait to see the basic trouble it brings with it.';

  if (!trait) {
    return {
      title: `No ${label} selected`,
      summary: defaultSummary,
      description: '',
      details: [`Type: ${label}`, 'Rank varies by trait.', 'Allowed ratings: d2 or d4 depending on the trait.'],
      benefit: '',
      benefitLabel: '',
      note: '',
      table: []
    };
  }

  if ((trait.source || 'curated') === 'manual') {
    return {
      title: trait.name || `Custom ${label}`,
      summary: 'Manual entry. Use Notes to record the exact effect, limit, or story hook you want the GM to remember.',
      description: '',
      details: [
        `Type: ${label}`,
        trait.rating === 'none' ? 'Pick a die rating to price this custom trait.' : `Current rating: ${trait.rating}.`
      ],
      benefit: '',
      benefitLabel: '',
      note: '',
      table: []
    };
  }

  const traitMeta = findCuratedTrait(category, trait.name);
  if (!traitMeta) {
    return {
      title: trait.name || `Choose an ${label}`,
      summary: defaultSummary,
      description: '',
      details: [`Type: ${label}`, 'Allowed ratings appear once a curated trait is chosen.'],
      benefit: '',
      benefitLabel: '',
      note: '',
      table: []
    };
  }

  const details = [`Type: ${traitMeta.type || label}`];
  const resolvedRank = resolveTraitRank(traitMeta, trait.rating);
  if (resolvedRank || traitMeta.rank) details.push(`Rank: ${resolvedRank || traitMeta.rank}`);
  details.push(`Allowed ratings: ${traitMeta.allowedRatings.join(', ')}`);
  if (traitMeta.gmApproval) details.push('GM approval required');

  return {
    title: traitMeta.name,
    summary: traitMeta.summary,
    description: traitMeta.description || '',
    details,
    benefit: traitMeta.benefits?.[trait.rating] || '',
    benefitLabel: traitMeta.benefits?.[trait.rating] ? `Benefit (${resolveTraitRank(traitMeta, trait.rating) || trait.rating})` : '',
    note: traitMeta.note || '',
    table: traitMeta.plotPointTable || []
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

function getUnavailableTraitNames(stateList, currentTrait, category) {
  return stateList
    .filter((item) => item.id !== currentTrait.id && item.name && !isRepeatableTrait(item.name))
    .map((item) => resolveCanonicalTraitName(category, item.name));
}

function getBlockedTraitNames(list, oppositeList, currentTrait, category) {
  const blocked = new Set();
  [...list, ...oppositeList]
    .filter((item) => item.id !== currentTrait.id && item.name)
    .forEach((item) => {
      getMutuallyExclusiveTraits(resolveCanonicalTraitName(category, item.name)).forEach((name) => blocked.add(name));
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
  const infoDescription = el('p', { cls: 'trait-info-line' });
  const infoDetails = el('p', { cls: 'trait-info-line muted' });
  const infoBenefit = el('p', { cls: 'trait-info-line' });
  const infoNote = el('p', { cls: 'trait-info-line muted' });
  const infoTable = el('ul', { cls: 'trait-info-list muted' });
  const infoBox = el('div', { cls: 'trait-info-box' }, [
    el('div', { cls: 'trait-info-label', text: category === 'asset' ? 'Asset explainer' : 'Complication explainer' }),
    infoTitle,
    infoSummary,
    infoDescription,
    infoDetails,
    infoBenefit,
    infoNote,
    infoTable
  ]);
  wrap.append(infoBox);

  const setInfo = (trait) => {
    if (trait?.id) activeTraitSelection[category] = trait.id;
    const info = getTraitInfo(category, trait, curated);
    infoTitle.textContent = info.title;
    infoSummary.textContent = info.summary;
    infoDescription.textContent = info.description || '';
    infoDescription.hidden = !info.description;
    infoDetails.textContent = info.details.join(' | ');
    infoBenefit.textContent = info.benefit ? `${info.benefitLabel}: ${info.benefit}` : '';
    infoBenefit.hidden = !info.benefit;
    infoNote.textContent = info.note ? `Note: ${info.note}` : '';
    infoNote.hidden = !info.note;
    infoTable.innerHTML = '';
    infoTable.hidden = !info.table.length;
    info.table.forEach((row) => {
      infoTable.append(el('li', { text: `${row.cost}: ${row.result}` }));
    });
  };

  list.forEach((trait) => {
    const isLegacyManual = (trait.source || 'curated') === 'manual';
    const traitMeta = findCuratedTrait(category, trait.name);
    const canonicalTraitName = resolveCanonicalTraitName(category, trait.name);
    const ownSelections = getUnavailableTraitNames(list, trait, category);
    const blockedSelections = getBlockedTraitNames(list, oppositeList, trait, category);
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
        if ((ownSelections.includes(item.name) || blockedSelections.has(item.name)) && item.name !== canonicalTraitName) return;
        const opt = document.createElement('option');
        opt.value = item.name;
        const optionRank = item.rankByRating ? 'Minor/Major' : item.rank;
        opt.textContent = optionRank ? `${item.name} (${optionRank})` : item.name;
        opt.title = [item.summary, item.description, item.note].filter(Boolean).join(' ');
        if (canonicalTraitName === item.name || (item.aliases || []).includes(trait.name)) opt.selected = true;
        nameInput.append(opt);
      });
    }
    nameInput.addEventListener('input', (event) => {
      activeTraitSelection[category] = trait.id;
      onChange((draft) => {
        const target = draft.traits[category === 'asset' ? 'assets' : 'complications'].find((item) => item.id === trait.id);
        target.name = event.target.value;
        const match = findCuratedTrait(category, target.name);
        if (match && !match.allowedRatings.includes(target.rating)) {
          target.rating = match.allowedRatings[0];
        }
      });
    });
    nameWrap.append(nameInput);

    const ratingSelect = document.createElement('select');
    const allowedRatings = traitMeta?.allowedRatings || TRAIT_OPTIONS.filter((item) => item !== 'none');
    const ratingChoices = ['none', ...allowedRatings];
    if (trait.rating !== 'none' && !ratingChoices.includes(trait.rating)) {
      ratingChoices.push(trait.rating);
    }
    ratingChoices.forEach((rating) => {
      const opt = document.createElement('option');
      opt.value = rating;
      opt.textContent = rating === 'none'
        ? '-'
        : (!allowedRatings.includes(rating) && rating === trait.rating ? `${rating} (legacy)` : rating);
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
