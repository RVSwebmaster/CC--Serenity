const CATEGORY_ORDER = [
  'General Store',
  'Tailor',
  'Armory',
  'Techshop',
  'Medical',
  'Services',
  'Livestock / Critters'
];

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `gear_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function gear(id, name, category, credits, availability, summary, stats = '') {
  return { id, name, category, credits, availability, summary, stats };
}

export const EQUIPMENT_CATALOG = [
  gear('filtration-canteen', 'Filtration Canteen', 'General Store', 1.2, 'E', 'Portable water filter for rough dirt-side travel.'),
  gear('glowstick', 'Glowstick', 'General Store', 2, 'E', 'Cheap emergency light for dark holds, bad roads, and busted power.'),
  gear('patch-tape', 'Patch Tape', 'General Store', 1.2, 'E', 'Quick field repairs for leaks, tears, and the kind of problems that cannot wait.'),
  gear('rucksack', 'Rucksack', 'General Store', 2, 'E', 'Basic carry pack for a traveler who expects to haul their own trouble.'),
  gear('disguise-kit', 'Disguise Kit', 'Tailor', 65.6, 'C', 'Wardrobe and makeup tools for false faces and quick role changes.'),
  gear('pistol', 'Pistol', 'Armory', 18, 'E', 'Plain, practical sidearm for folk who need a gun without ceremony.', 'Damage d6 W | Range 10'),
  gear('utility-knife', 'Utility Knife', 'Armory', 0.8, 'E', 'Everyday blade that still counts when things get ugly up close.', 'Damage d2 W | Melee'),
  gear('databook', 'DataBook', 'Techshop', 30, 'C', 'Portable computing for records, planning, and Cortex access.'),
  gear('fusion-torch', 'Fusion Torch', 'Techshop', 2.2, 'C', 'Compact cutter for metalwork, repairs, and very bad ideas.'),
  gear('micro-transmitter', 'Micro Transmitter', 'Techshop', 8, 'R', 'Small transmitter for discreet communications and quiet coordination.'),
  gear('multi-tool', 'Multi-Tool', 'Techshop', 2, 'E', 'Pocket problem-solver with a dozen mediocre answers and constant use.'),
  gear('ocular', 'Ocular', 'Techshop', 6, 'C', 'Portable optics for seeing farther or closer than the naked eye.'),
  gear('ship-linked-handset', 'Ship-linked Handset', 'Techshop', 3.2, 'C', 'Short-range comms tied into a ship or local network.'),
  gear('tool-kit-basic', 'Tool Kit, Basic', 'Techshop', 14.4, 'E', 'Starter repair kit for honest mechanical work and field fixes.'),
  gear('burn-gel', 'Burn Gel', 'Medical', 1.8, 'E', 'Fast treatment for heat and flash injuries before they get worse.'),
  gear('doctors-bag', 'Doctor’s Bag', 'Medical', 27.4, 'C', 'Field-ready medical bag for somebody with actual training.'),
  gear('first-aid-kit', 'First-Aid Kit', 'Medical', 0.6, 'E', 'Bandages, antiseptic, and the bare minimum to keep someone breathing.'),
  gear('gas-mask', 'Gas Mask', 'Medical', 4, 'C', 'Breathing protection for bad air, smoke, and ugly jobs.'),
  gear('allied-postal-service', 'Allied Postal Service', 'Services', 1.2, 'E', 'Standard mail or parcel handling through respectable channels.'),
  gear('full-physical', 'Full Physical', 'Services', 8, 'E', 'Routine medical exam and paperwork-level health check.'),
  gear('minor-surgery', 'Minor Surgery', 'Services', 150, 'C', 'Clinical treatment that goes past first aid but below major reconstruction.'),
  gear('cat', 'Cat', 'Livestock / Critters', 4, 'E', 'Small shipboard hunter and a fine judge of strangers.'),
  gear('dog', 'Dog', 'Livestock / Critters', 6, 'E', 'Loyal animal, alarm system, and appetite with paws.'),
  gear('goat-or-sheep', 'Goat or Sheep', 'Livestock / Critters', 10, 'E', 'Simple livestock for milk, wool, meat, or barter.'),
  gear('horse', 'Horse', 'Livestock / Critters', 50, 'C', 'Reliable dirt-side transport when engines are not worth the fuel.')
];

export const EQUIPMENT_GROUPS = CATEGORY_ORDER.map((category) => ({
  category,
  items: EQUIPMENT_CATALOG
    .filter((item) => item.category === category)
    .sort((left, right) => left.name.localeCompare(right.name))
}));

export function getEquipmentItemById(id = '') {
  return EQUIPMENT_CATALOG.find((item) => item.id === id) || null;
}

export function createPurchasedGearEntry(item) {
  return {
    id: makeId(),
    catalogId: item.id,
    name: item.name,
    category: item.category,
    credits: item.credits,
    availability: item.availability,
    note: item.note || item.summary || ''
  };
}

export function normalizePurchasedGearEntry(entry = {}) {
  const catalogMatch = getEquipmentItemById(entry.catalogId || '');
  return {
    id: entry.id || makeId(),
    catalogId: entry.catalogId || catalogMatch?.id || '',
    name: entry.name || catalogMatch?.name || '',
    category: entry.category || catalogMatch?.category || '',
    credits: Number.parseFloat(entry.credits ?? catalogMatch?.credits ?? 0) || 0,
    availability: entry.availability || catalogMatch?.availability || '',
    note: entry.note || catalogMatch?.summary || ''
  };
}

export function getPurchasedGearTotal(details = {}) {
  return Number(((details.purchasedGear || []).reduce((sum, item) => sum + (Number.parseFloat(item.credits) || 0), 0)).toFixed(1));
}
