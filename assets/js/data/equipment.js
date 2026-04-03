const CATEGORY_ORDER = [
  'General Store & Personal Tools',
  'Food & Sundries',
  'Protective Gear & Armor',
  'Weapons & Armory',
  'Techshop & Communications',
  'Professional Tools (Engineering/Medical)',
  'Services & Livestock'
];

function makeId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  return `gear_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function formatCreditValue(value) {
  if (value === undefined || value === null || String(value).trim() === '') return '';
  if (typeof value === 'string') return value.trim();
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function gear({ id, name, category, credits, price, availability, summary, stats = '', source = '' }) {
  return { id, name, category, credits, price, availability, summary, stats, source };
}

export function formatEquipmentPrice(item = {}) {
  if (item.price) return item.price;
  const credits = formatCreditValue(item.credits);
  return credits ? `₡ ${credits}` : '—';
}

export const EQUIPMENT_CATALOG = [
  gear({ id: 'multiband', name: 'Multiband', category: 'General Store & Personal Tools', credits: 4.8, price: '₡ 4.8 / 12p', source: 'Core', availability: 'Core', summary: 'Wearable utility gear for everyday carry and quick field use.' }),
  gear({ id: 'patch-tape', name: 'Patch Tape', category: 'General Store & Personal Tools', credits: 1.2, price: '₡ 1.2 / 3p', source: 'Core', availability: 'Everywhere', summary: 'Quick field patching for leaks, tears, and busted kit.' }),
  gear({ id: 'fire-jelly', name: 'Fire Jelly', category: 'General Store & Personal Tools', credits: 0.2, price: '₡ 0.2 / 1p', source: 'Core', availability: 'Everywhere', summary: 'Accelerant gel for fire-starting and ugly improvisation.' }),
  gear({ id: 'purification-crystals', name: 'Purification Crystals', category: 'General Store & Personal Tools', credits: 0.4, price: '₡ 0.4 / 1p', source: 'Core', availability: 'Everywhere', summary: 'Water-cleaning crystals for rough travel and bad supply lines.' }),
  gear({ id: 'grappler', name: 'Grappler', category: 'General Store & Personal Tools', credits: 8, price: '₡ 8 / 20p', source: 'Core/SSS', availability: 'Everywhere', summary: 'Line launcher for climbing, hauling, and awkward approaches.' }),
  gear({ id: 'multi-tool', name: 'Multi-Tool', category: 'General Store & Personal Tools', credits: 2, price: '₡ 2 / 5p', source: 'Core/SSS', availability: 'Everywhere', summary: 'Pocket repair tool with a little bit of everything.' }),
  gear({ id: 'forensics-kit', name: 'Forensics Kit', category: 'General Store & Personal Tools', credits: 20, price: '₡ 20 / 50p', source: 'SSS', availability: 'Core', summary: 'Evidence collection and scene-analysis gear.' }),
  gear({ id: 'forgery-kit', name: 'Forgery Kit', category: 'General Store & Personal Tools', credits: 40, price: '₡ 40 / 100p', source: 'SSS', availability: 'Rim', summary: 'Tools for forged papers, signatures, and dirty paperwork.' }),
  gear({ id: 'burn-gel-4-apps', name: 'Burn Gel (4 apps)', category: 'General Store & Personal Tools', credits: 1.8, price: '₡ 1.8 / 5p', source: 'SSS', availability: 'Illegal', summary: 'Topical burn treatment with four applications.' }),
  gear({ id: 'fusion-torch', name: 'Fusion Torch', category: 'General Store & Personal Tools', credits: 2.2, price: '₡ 2.2 / 6p', source: 'SSS', availability: 'Rim', summary: 'Portable cutting and welding torch.' }),
  gear({ id: 'generator-portable', name: 'Generator, Portable', category: 'General Store & Personal Tools', credits: 12, price: '₡ 12 / 30p', source: 'SSS', availability: 'Everywhere', summary: 'Compact portable power source.' }),
  gear({ id: 'sewing-kit', name: 'Sewing Kit', category: 'General Store & Personal Tools', credits: 0.8, price: '₡ 0.8 / 2p', source: 'SSS', availability: 'Everywhere', summary: 'Field sewing and clothing repair kit.' }),
  gear({ id: 'snaplink', name: 'Snaplink', category: 'General Store & Personal Tools', credits: 0.4, price: '₡ 0.4 / 1p', source: 'SSS', availability: 'Everywhere', summary: 'Small connector hardware for straps, lines, and gear.' }),
  gear({ id: 'welding-tape', name: 'Welding Tape (per meter)', category: 'General Store & Personal Tools', credits: 0.7, price: '₡ 0.7 / 2p', source: 'SSS', availability: 'Everywhere', summary: 'Heavy-duty repair tape sold by the meter.' }),

  gear({ id: 'cookset', name: 'Cookset', category: 'Food & Sundries', credits: 4, price: '₡ 4 / 10p', source: 'SSS', availability: 'Everywhere', summary: 'Portable cookware for camp, bunkhouse, or galley use.' }),
  gear({ id: 'fresh-fruit', name: 'Fresh Fruit', category: 'Food & Sundries', credits: 0.1, price: '₡ 0.1-0.5 / 1p', source: 'SSS', availability: 'Core', summary: 'Fresh produce with a market price that varies by world.' }),
  gear({ id: 'protein-chips', name: 'Protein Chips', category: 'Food & Sundries', credits: 0.2, price: '₡ 0.2-0.4 / 1p', source: 'SSS', availability: 'Everywhere', summary: 'Cheap packaged food with a little price swing by market.' }),
  gear({ id: 'rotgut', name: 'Rotgut', category: 'Food & Sundries', credits: 0.4, price: '₡ 0.4 / 1p', source: 'SSS', availability: 'Everywhere', summary: 'Bottom-shelf liquor with a reputation to match.' }),
  gear({ id: 'snack-bar-fruity-oaty', name: 'Snack Bar (Fruity Oaty)', category: 'Food & Sundries', credits: 0.1, price: '₡ 0.1 / 1p', source: 'SSS', availability: 'Everywhere', summary: 'Cheap packaged snack for the road or the hold.' }),
  gear({ id: 'chemical-body-warmer-4', name: 'Chemical Body Warmer (4)', category: 'Food & Sundries', credits: 0.8, price: '₡ 0.8 / 2p', source: 'SSS', availability: 'Everywhere', summary: 'Pack of disposable heat packs.' }),
  gear({ id: 'gas-mask', name: 'Gas Mask', category: 'Food & Sundries', credits: 4, price: '₡ 4 / 10p', source: 'SSS', availability: 'Everywhere', summary: 'Breathing protection for smoke, gas, and bad air.' }),
  gear({ id: 'ocular-binoculars', name: 'Ocular (Binoculars)', category: 'Food & Sundries', credits: 6, price: '₡ 6 / 15p', source: 'SSS', availability: 'Everywhere', summary: 'Portable magnification for scouting and overwatch.' }),
  gear({ id: 'radiation-detector', name: 'Radiation Detector', category: 'Food & Sundries', credits: 8, price: '₡ 8 / 20p', source: 'SSS', availability: 'Everywhere', summary: 'Handheld detector for contaminated zones and bad salvage.' }),
  gear({ id: 'rucksack', name: 'Rucksack', category: 'Food & Sundries', credits: 2, price: '₡ 2 / 5p', source: 'SSS', availability: 'Everywhere', summary: 'Basic carry pack for hauling your own trouble.' }),
  gear({ id: 'ships-papers-fee', name: "Ship's Papers (Fee)", category: 'Food & Sundries', credits: 20, price: '₡ 20 / 50p', source: 'SSS', availability: 'Everywhere', summary: 'Fee for papers needed to keep a ship legal and moving.' }),

  gear({ id: 'ballistic-mesh', name: 'Ballistic Mesh', category: 'Protective Gear & Armor', credits: 46, price: '₡ 46 / 115p', availability: 'Core', summary: 'Protective mesh armor for serious incoming fire.', stats: 'Armor 1W' }),
  gear({ id: 'plate-vest', name: 'Plate Vest', category: 'Protective Gear & Armor', credits: 30, price: '₡ 30 / 75p', availability: 'Everywhere', summary: 'Heavy plated vest for blunt, ugly protection.', stats: 'Armor 4W' }),
  gear({ id: 'riot-gear', name: 'Riot Gear', category: 'Protective Gear & Armor', credits: 92, price: '₡ 92 / 230p', availability: 'Core', summary: 'Protective gear built for organized violence and crowd control.', stats: 'Armor 3W' }),
  gear({ id: 'tactical-suit', name: 'Tactical Suit', category: 'Protective Gear & Armor', credits: 110, price: '₡ 110 / 275p', availability: 'Illegal', summary: 'High-end tactical protection for trouble you planned for.', stats: 'Armor 5W' }),
  gear({ id: 'vacuum-suit', name: 'Vacuum Suit', category: 'Protective Gear & Armor', credits: 67, price: '₡ 67 / 168p', availability: 'Everywhere', summary: 'Environmental suit for vacuum exposure and hard ship work.', stats: 'Armor 2W' }),
  gear({ id: 'duster-armored', name: 'Duster, Armored', category: 'Protective Gear & Armor', credits: 6, price: '₡ 6 / 15p', availability: 'Rim', summary: 'Long coat with hidden reinforcement and frontier style.', stats: 'Armor 4W' }),
  gear({ id: 'flight-suit', name: 'Flight Suit', category: 'Protective Gear & Armor', credits: 14, price: '₡ 14 / 35p', availability: 'Everywhere', summary: 'Pilot-ready protective suit for flying and hard duty.', stats: 'Armor 2S' }),
  gear({ id: 'shield-tactical', name: 'Shield, Tactical', category: 'Protective Gear & Armor', credits: 10, price: '₡ 10 / 25p', availability: 'Alliance', summary: 'Tactical shield for cover and controlled advance.', stats: 'Armor Special' }),

  gear({ id: 'pistol-standard', name: 'Pistol (Standard)', category: 'Weapons & Armory', credits: 22, price: '₡ 22 / 55p', availability: 'Everywhere', summary: 'Plain, practical sidearm for folk who need a gun.', stats: 'Damage d6 W' }),
  gear({ id: 'rifle-standard', name: 'Rifle (Standard)', category: 'Weapons & Armory', credits: 46, price: '₡ 46 / 115p', availability: 'Everywhere', summary: 'Long gun for distance, defense, and bad intentions.', stats: 'Damage d8 W' }),
  gear({ id: 'shotgun', name: 'Shotgun', category: 'Weapons & Armory', credits: 42, price: '₡ 42 / 105p', availability: 'Everywhere', summary: 'Brutal close-range long arm with frontier appeal.', stats: 'Damage d10 W' }),
  gear({ id: 'pistol-gauss', name: 'Pistol, Gauss', category: 'Weapons & Armory', credits: 140, price: '₡ 140 / 350p', availability: 'Alliance', summary: 'High-end magnetic sidearm with Alliance-grade pricing.', stats: 'Damage d6 W' }),
  gear({ id: 'rifle-gauss', name: 'Rifle, Gauss', category: 'Weapons & Armory', credits: 400, price: '₡ 400 / 1,000p', availability: 'Alliance', summary: 'Alliance-grade gauss rifle for very expensive trouble.', stats: 'Damage d10 W' }),
  gear({ id: 'knife-throwing', name: 'Knife, Throwing', category: 'Weapons & Armory', credits: 0.8, price: '₡ 0.8 / 2p', availability: 'Everywhere', summary: 'Light throwing blade for folk who like quiet violence.', stats: 'Damage d2 W' }),
  gear({ id: 'grenade-incendiary', name: 'Grenade, Incendiary', category: 'Weapons & Armory', credits: 2.8, price: '₡ 2.8 / 7p', availability: 'Alliance', summary: 'Incendiary grenade for turning a space into fire.', stats: 'Damage 2d12 W' }),
  gear({ id: 'grenade-plasma', name: 'Grenade, Plasma', category: 'Weapons & Armory', credits: 8.8, price: '₡ 8.8 / 22p', availability: 'Alliance', summary: 'High-yield plasma grenade for truly bad decisions.', stats: 'Damage 4d10 W' }),
  gear({ id: 'laser-sight', name: 'Laser Sight', category: 'Weapons & Armory', credits: 3.6, price: '₡ 3.6 / 9p', availability: 'Everywhere', summary: 'Weapon attachment for cleaner aiming.', stats: '+1 step' }),
  gear({ id: 'silencer', name: 'Silencer', category: 'Weapons & Armory', credits: 5.2, price: '₡ 5.2 / 13p', availability: 'Illegal', summary: 'Illegal attachment for keeping shots quieter.', stats: 'Special' }),
  gear({ id: 'scope-night-vision', name: 'Scope, Night-Vision', category: 'Weapons & Armory', credits: 32, price: '₡ 32 / 80p', availability: 'Core', summary: 'Night-vision optic for low-light shooting and spotting.', stats: 'Special' }),

  gear({ id: 'commpack-long-range', name: 'Commpack, Long Range', category: 'Techshop & Communications', credits: 37.8, price: '₡ 37.8 / 95p', source: 'Core', availability: 'Core', summary: 'Long-range portable comms for ship-to-ground and distance work.' }),
  gear({ id: 'commpack-short-range', name: 'Commpack, Short Range', category: 'Techshop & Communications', credits: 22.4, price: '₡ 22.4 / 56p', source: 'Core', availability: 'Everywhere', summary: 'Short-range comms for crews, teams, and local coordination.' }),
  gear({ id: 'distress-beacon', name: 'Distress Beacon', category: 'Techshop & Communications', credits: 31, price: '₡ 31 / 78p', source: 'Core', availability: 'Core', summary: 'Emergency beacon for ships, camps, and terrible days.' }),
  gear({ id: 'emergency-signal-ring', name: 'Emergency Signal Ring', category: 'Techshop & Communications', credits: 300, price: '₡ 300 / 750p', source: 'Core', availability: 'Core', summary: 'High-end emergency signaling device.' }),
  gear({ id: 'fedband-scanner', name: 'Fedband Scanner', category: 'Techshop & Communications', credits: 19.8, price: '₡ 19.8 / 50p', source: 'Core', availability: 'Illegal', summary: 'Illegal scanner for fedband and protected traffic.' }),
  gear({ id: 'debugger', name: 'Debugger', category: 'Techshop & Communications', credits: 20, price: '₡ 20 / 50p', source: 'Core', availability: 'Core', summary: 'Diagnostics and code-tracing gear for system work.' }),
  gear({ id: 'fake-identcard', name: 'Fake IdentCard', category: 'Techshop & Communications', credits: 4000, price: '₡ 4,000 / 10k p', source: 'Core', availability: 'Illegal', summary: 'Forged identity credentials with a ruinous price tag.' }),
  gear({ id: 'lock-picks-mechanical', name: 'Lock Picks (Mechanical)', category: 'Techshop & Communications', credits: 14, price: '₡ 14 / 35p', source: 'Core', availability: 'Illegal', summary: 'Manual picks for ordinary mechanical locks.' }),
  gear({ id: 'lock-picks-electronic', name: 'Lock Picks (Electronic)', category: 'Techshop & Communications', credits: 35.4, price: '₡ 35.4 / 88p', source: 'Core', availability: 'Illegal', summary: 'Electronic tools for bypassing secured systems.' }),

  gear({ id: 'tool-kit-basic', name: 'Tool Kit, Basic', category: 'Professional Tools (Engineering/Medical)', credits: 14.4, price: '₡ 14.4 / 36p', source: 'Core', availability: 'Everywhere', summary: 'Starter repair kit for honest mechanical work and field fixes.' }),
  gear({ id: 'tool-set-mechanics', name: "Tool Set, Mechanic's", category: 'Professional Tools (Engineering/Medical)', credits: 284, price: '₡ 284 / 710p', source: 'Core', availability: 'Everywhere', summary: 'Full mechanic set for serious machine work.' }),
  gear({ id: 'tool-set-electronic', name: 'Tool Set, Electronic', category: 'Professional Tools (Engineering/Medical)', credits: 138, price: '₡ 138 / 345p', source: 'Core', availability: 'Core', summary: 'Dedicated kit for electronics diagnosis and repair.' }),
  gear({ id: 'cad-board', name: 'CAD Board', category: 'Professional Tools (Engineering/Medical)', credits: 27.2, price: '₡ 27.2 / 68p', source: 'Core', availability: 'Core', summary: 'Design and drafting board for technical planning work.' }),
  gear({ id: 'imaging-suite', name: 'Imaging Suite', category: 'Professional Tools (Engineering/Medical)', credits: 200000, price: '₡ 200,000', source: 'SSS', availability: 'Core', summary: 'Heavy medical imaging equipment for top-end diagnostics.' }),
  gear({ id: 'doctors-bag', name: "Doctor's Bag", category: 'Professional Tools (Engineering/Medical)', credits: 27.4, price: '₡ 27.4 / 69p', source: 'Core', availability: 'Rim', summary: 'Field-ready medical bag for somebody with real training.' }),
  gear({ id: 'drug-anti-psychotic', name: 'Drug, Anti-Psychotic', category: 'Professional Tools (Engineering/Medical)', credits: 14, price: '₡ 14 / 35p', source: 'SSS', availability: 'Core', summary: 'Medication for severe psychological symptoms.' }),
  gear({ id: 'drug-anti-rejection', name: 'Drug, Anti-Rejection', category: 'Professional Tools (Engineering/Medical)', credits: 50, price: '₡ 50 / 125p', source: 'SSS', availability: 'Core', summary: 'Medication to suppress implant or transplant rejection.' }),

  gear({ id: 'allied-postal-service', name: 'Allied Postal Service', category: 'Services & Livestock', credits: 1.2, price: '₡ 1.2 / 3p', availability: 'Core', summary: 'Alliance mail service for a standard small parcel.', stats: 'Up to 10 lbs' }),
  gear({ id: 'companion-evening', name: 'Companion (Evening)', category: 'Services & Livestock', credits: 350, price: '₡ 350 / 875p', availability: 'Core', summary: 'Registered Companion service for an evening.' }),
  gear({ id: 'legal-counsel-major', name: 'Legal Counsel, Major', category: 'Services & Livestock', credits: 10000, price: '₡ 10,000 / 25k p', summary: 'Serious legal representation for serious criminal trouble.', stats: 'Advocate for major crime' }),
  gear({ id: 'horse', name: 'Horse', category: 'Services & Livestock', credits: 50, price: '₡ 50 / 110p', summary: 'Standard dirt-side mount.', stats: 'Standard mount' }),
  gear({ id: 'cow', name: 'Cow', category: 'Services & Livestock', credits: 30, price: '₡ 30 / 66p', summary: 'Ordinary livestock for milk, meat, or trade.', stats: 'Livestock' }),
  gear({ id: 'dog', name: 'Dog', category: 'Services & Livestock', credits: 6, price: '₡ 6 / 14p', summary: 'Pet or working animal depending on what the crew needs.', stats: 'Pet / Working' })
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
    price: item.price || formatEquipmentPrice(item),
    availability: item.availability,
    source: item.source || '',
    stats: item.stats || '',
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
    price: entry.price || catalogMatch?.price || formatEquipmentPrice({ credits: entry.credits ?? catalogMatch?.credits ?? 0 }),
    availability: entry.availability || catalogMatch?.availability || '',
    source: entry.source || catalogMatch?.source || '',
    stats: entry.stats || catalogMatch?.stats || '',
    note: entry.note || catalogMatch?.summary || ''
  };
}

export function getPurchasedGearTotal(details = {}) {
  return Number(((details.purchasedGear || []).reduce((sum, item) => sum + (Number.parseFloat(item.credits) || 0), 0)).toFixed(1));
}
