import { createPurchasedGearEntry, EQUIPMENT_GROUPS, formatEquipmentPrice, getEquipmentItemById, getPurchasedGearTotal } from '../data/equipment.js';
import { calculateCurrentCredits, formatMoney, resolveStartingCredits } from '../data/gear_packages.js';
import { el, field, sectionHeader } from '../ui.js';

function buildPurchasedGearList(state, onChange) {
  const entries = state.character.details.purchasedGear || [];
  const wrap = el('div', { cls: 'field-group' });
  wrap.append(el('label', { text: 'Purchased Gear List' }));

  if (!entries.length) {
    wrap.append(el('p', { cls: 'help muted', text: 'No catalog gear added yet.' }));
    return wrap;
  }

  wrap.append(el('p', { cls: 'help muted', text: `Catalog gear total: ${formatMoney(getPurchasedGearTotal(state.character.details), '₡')}` }));

  const list = el('div', { cls: 'purchased-gear-list' });
  entries.forEach((entry) => {
    const row = el('div', { cls: 'purchased-gear-item' }, [
      el('div', { cls: 'purchased-gear-main' }, [
        el('strong', { text: entry.name }),
        el('small', { cls: 'muted', text: `${entry.category} • ${entry.availability}${entry.source ? ` • ${entry.source}` : ''}${entry.note ? ` • ${entry.note}` : ''}` })
      ]),
      el('span', { cls: 'points-badge', text: entry.price || formatEquipmentPrice(entry) })
    ]);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => onChange((draft) => {
      draft.details.purchasedGear = (draft.details.purchasedGear || []).filter((item) => item.id !== entry.id);
      draft.details.currentCredits = String(calculateCurrentCredits(draft));
    }));

    row.append(removeButton);
    list.append(row);
  });

  wrap.append(list);
  return wrap;
}

function createSelectionInfoPanel() {
  const title = el('strong', { cls: 'equipment-info-title', text: 'Select an item to see details.' });
  const meta = el('p', { cls: 'equipment-info-line muted' });
  const summary = el('p', { cls: 'equipment-info-copy muted', text: 'Price, availability, plain-English summary, and any weapon or armor stats will show here.' });
  const stats = el('p', { cls: 'equipment-info-line muted' });
  const panel = el('div', { cls: 'equipment-info-panel' }, [
    el('div', { cls: 'equipment-info-label', text: 'Selected Item Details' }),
    title,
    meta,
    summary,
    stats
  ]);

  const sync = (item) => {
    if (!item) {
      title.textContent = 'Select an item to see details.';
      meta.textContent = '';
      summary.textContent = 'Price, availability, plain-English summary, and any weapon or armor stats will show here.';
      summary.className = 'equipment-info-copy muted';
      stats.textContent = '';
      return;
    }

    title.textContent = item.name;
    meta.textContent = `${item.category} • ${formatEquipmentPrice(item)} • ${item.availability}${item.source ? ` • ${item.source}` : ''}`;
    summary.textContent = item.summary || 'No catalog summary yet.';
    summary.className = 'equipment-info-copy';
    stats.textContent = item.stats ? `Stats: ${item.stats}` : '';
  };

  return { panel, sync };
}

export function renderDetailsStep(state, onChange) {
  const root = el('div');
  root.append(sectionHeader('Step 7: Gear & Money', 'Set the character’s starting cash, shop from the curated catalog, and note what else they are carrying.'));

  root.append(el('div', { cls: 'summary-card guide-card' }, [
    el('h3', { text: 'Greenhorn Starting Cash' }),
    el('p', { text: 'Default starting credits are 750. Moneyed Individual raises that to 1125, while Dead Broke drops it to 375.' }),
    el('p', { cls: 'muted', text: 'Starting Credits auto-fills from those traits, but you can still edit it as a GM override. Current Credits is starting cash minus catalog gear purchases.' })
  ]));

  const moneyBlock = el('div', { cls: 'field-card' });
  moneyBlock.append(el('h3', { text: 'Money' }));

  const moneyGrid = el('div', { cls: 'grid-2' });

  const startingCredits = document.createElement('input');
  startingCredits.type = 'number';
  startingCredits.min = '0';
  startingCredits.step = '0.1';
  startingCredits.value = resolveStartingCredits(state.character);
  startingCredits.placeholder = '750';
  startingCredits.addEventListener('input', (event) => onChange((draft) => {
    draft.details.startingCredits = event.target.value;
    draft.details.currentCredits = String(calculateCurrentCredits(draft));
  }));
  moneyGrid.append(field('Starting Credits (₡)', startingCredits, 'Defaults from traits: 750 normal, 1125 with Moneyed Individual, 375 with Dead Broke. You can override it.'));

  const currentCredits = document.createElement('input');
  currentCredits.type = 'number';
  currentCredits.step = '0.1';
  currentCredits.value = String(calculateCurrentCredits(state.character));
  currentCredits.placeholder = 'Current ₡ on hand';
  currentCredits.readOnly = true;
  moneyGrid.append(field('Current Credits (₡)', currentCredits, 'Read-only. This is Starting Credits minus catalog purchases.'));

  const platinum = document.createElement('input');
  platinum.type = 'number';
  platinum.min = '0';
  platinum.step = '0.1';
  platinum.value = state.character.details.platinum || '';
  platinum.placeholder = 'Optional Rim coin';
  platinum.addEventListener('input', (event) => onChange((draft) => { draft.details.platinum = event.target.value; }));
  moneyGrid.append(field('Platinum Pieces (p)', platinum, 'Optional. Useful for Rim cash, tips, and ugly little side deals.'));

  const moneyNotes = document.createElement('textarea');
  moneyNotes.value = state.character.details.moneyNotes || '';
  moneyNotes.placeholder = 'Company scrip, debt, wages due, hidden stash, or similar.';
  moneyNotes.addEventListener('input', (event) => onChange((draft) => { draft.details.moneyNotes = event.target.value; }));
  moneyGrid.append(field('Money Notes', moneyNotes, 'Debt, wages, payroll share, hush money, church donation, whatever applies.'));

  moneyBlock.append(moneyGrid);

  const shoppingBlock = el('div', { cls: 'field-card' });
  shoppingBlock.append(el('h3', { text: 'Equipment Catalog' }));

  const pickerRow = el('div', { cls: 'equipment-picker-row' });
  const itemSelect = document.createElement('select');
  const blankOption = document.createElement('option');
  blankOption.value = '';
  blankOption.textContent = 'Choose catalog gear';
  itemSelect.append(blankOption);
  EQUIPMENT_GROUPS.forEach((group) => {
    if (!group.items.length) return;
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.category;
    group.items.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = `${item.name} (${formatEquipmentPrice(item)})`;
      option.title = item.stats ? `${item.summary} ${item.stats}` : item.summary;
      optgroup.append(option);
    });
    itemSelect.append(optgroup);
  });

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.textContent = 'Add to Gear';
  addButton.disabled = true;

  const { panel: selectionPanel, sync: syncSelectionInfo } = createSelectionInfoPanel();

  itemSelect.addEventListener('change', () => {
    const selectedItem = getEquipmentItemById(itemSelect.value);
    addButton.disabled = !selectedItem;
    syncSelectionInfo(selectedItem);
  });
  addButton.addEventListener('click', () => {
    const selectedItem = getEquipmentItemById(itemSelect.value);
    if (!selectedItem) return;
    onChange((draft) => {
      draft.details.purchasedGear = [...(draft.details.purchasedGear || []), createPurchasedGearEntry(selectedItem)];
      draft.details.currentCredits = String(calculateCurrentCredits(draft));
    });
  });
  syncSelectionInfo(null);

  pickerRow.append(itemSelect, addButton);
  shoppingBlock.append(pickerRow, selectionPanel, buildPurchasedGearList(state, onChange));

  const gearBlock = el('div', { cls: 'field-card' });
  gearBlock.append(el('h3', { text: 'Additional Gear & Notes' }));

  const gear = document.createElement('textarea');
  gear.value = state.character.details.gear || '';
  gear.addEventListener('input', (event) => onChange((draft) => { draft.details.gear = event.target.value; }));
  gearBlock.append(field('Additional Personal Gear', gear, 'Anything not yet in the catalog, plus freebies, crew-issued gear, and GM-approved oddities.'));

  const notes = document.createElement('textarea');
  notes.value = state.character.details.notes || '';
  notes.addEventListener('input', (event) => onChange((draft) => { draft.details.notes = event.target.value; }));
  gearBlock.append(field('Extra Notes', notes, 'Hooks for the GM, personal reminders, ship duty, debts, enemies.'));

  root.append(moneyBlock, shoppingBlock, gearBlock);
  return root;
}
