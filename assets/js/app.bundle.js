(() => {
  // assets/js/data/defaults.js
  var HEROIC_LEVEL = {
    name: "Greenhorn",
    attributePoints: 42,
    traitPoints: 0,
    skillPoints: 62,
    maxAttribute: "d12",
    maxSkill: "d12"
  };
  var PLOT_POINT_MAX = 12;
  var ATTRIBUTE_LIST = [
    "Agility",
    "Strength",
    "Vitality",
    "Alertness",
    "Intelligence",
    "Willpower"
  ];
  var DIE_COSTS = {
    "-": 0,
    "none": 0,
    "d2": 2,
    "d4": 4,
    "d6": 6,
    "d8": 8,
    "d10": 10,
    "d12": 12
  };
  var SPECIALTY_DIE_COSTS = {
    "none": 0,
    "d8": 2,
    "d10": 4,
    "d12": 6
  };
  var ATTRIBUTE_OPTIONS = ["-", "d2", "d4", "d6", "d8", "d10", "d12"];
  var GENERAL_SKILL_OPTIONS = ["none", "d2", "d4", "d6"];
  var SPECIALTY_OPTIONS = ["none", "d8", "d10", "d12"];
  var TRAIT_OPTIONS = ["none", "d2", "d4"];
  function makeId() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function createDefaultCharacter() {
    return {
      basics: {
        name: "",
        quote: "",
        portraitDataUrl: "",
        concept: "",
        role: "",
        customRole: "",
        roleSkill: "",
        crewValue: "",
        crewConnection: "",
        crewMotivation: "",
        homeworld: "",
        customHomeworld: "",
        background: ""
      },
      attributes: {
        Agility: "-",
        Strength: "-",
        Vitality: "-",
        Alertness: "-",
        Intelligence: "-",
        Willpower: "-"
      },
      traits: {
        assets: [createEmptyTrait("asset")],
        complications: [createEmptyTrait("complication")]
      },
      skills: {},
      details: {
        startingCredits: "",
        currentCredits: "",
        platinum: "",
        moneyNotes: "",
        purchasedGear: [],
        starterPackageId: "",
        starterPackageNotes: "",
        gear: "",
        notes: ""
      },
      trackers: {
        plotPoints: 6,
        stun: 0,
        wounds: 0
      },
      meta: {
        characterId: makeId(),
        heroicLevel: HEROIC_LEVEL.name,
        lastUpdated: null
      }
    };
  }
  function createEmptyTrait(type = "asset") {
    return {
      id: makeId(),
      category: type,
      name: "",
      rating: "none",
      source: "curated",
      notes: ""
    };
  }
  function createEmptySpecialty() {
    return {
      id: makeId(),
      name: "",
      rating: "none"
    };
  }

  // assets/js/storage.js
  var STORAGE_KEY = "serenity_greenhorn_builder_state";
  function saveState(character) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
  }
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
  function clearState() {
    localStorage.removeItem(STORAGE_KEY);
  }
  function exportState(character) {
    const blob = new Blob([JSON.stringify(character, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(character.basics.name || "serenity-greenhorn").replace(/\s+/g, "_").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  // assets/js/handoff.js
  var GM_HANDOFF_QUEUE_KEY = "serenity_suite_gm_handoff_queue";
  var GM_HANDOFF_PREFIX = "SERENITY-HANDOFF:";
  function makeId2(prefix = "id") {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function safeParseQueue() {
    try {
      const raw = localStorage.getItem(GM_HANDOFF_QUEUE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      localStorage.removeItem(GM_HANDOFF_QUEUE_KEY);
      return [];
    }
  }
  function safeWriteQueue(queue) {
    localStorage.setItem(GM_HANDOFF_QUEUE_KEY, JSON.stringify(queue));
  }
  function encodeBase64(value) {
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return btoa(binary);
  }
  function ensureCharacterIdentity(character) {
    const draft = structuredClone(character || {});
    draft.meta = {
      ...draft.meta || {},
      characterId: draft.meta?.characterId || makeId2("character")
    };
    return draft;
  }
  function createCharacterHandoff(character) {
    const payload = ensureCharacterIdentity(character);
    const sentAt = (/* @__PURE__ */ new Date()).toISOString();
    return {
      handoffId: makeId2("handoff"),
      characterId: payload.meta.characterId,
      sentAt,
      payload,
      summary: {
        name: payload.basics?.name || "Unnamed Crew Member",
        role: payload.basics?.role || payload.basics?.customRole || "Unassigned",
        concept: payload.basics?.concept || ""
      }
    };
  }
  function queueCharacterForGM(character) {
    const handoff = createCharacterHandoff(character);
    const queue = safeParseQueue().filter((entry) => entry?.characterId !== handoff.characterId);
    queue.push(handoff);
    safeWriteQueue(queue);
    return handoff;
  }
  function encodeCharacterHandoffCode(character) {
    const handoff = createCharacterHandoff(character);
    return `${GM_HANDOFF_PREFIX}${encodeBase64(JSON.stringify(handoff))}`;
  }

  // assets/js/data/skills.js
  var SKILLS = [
    { name: "Animal Handling", specialties: ["Horses", "Livestock", "Training"] },
    { name: "Artistry", specialties: ["Drawing", "Painting", "Sculpture"] },
    { name: "Athletics", specialties: ["Climbing", "Dodge", "Lifting", "Running", "Swimming"] },
    { name: "Covert", specialties: ["Disguise", "Forgery", "Pickpocket", "Sabotage", "Stealth", "Streetwise", "Surveillance"] },
    { name: "Craft", specialties: ["Cooking", "Sewing", "Woodworking"] },
    { name: "Discipline", specialties: ["Concentration", "Interrogation", "Intimidation", "Leadership", "Mental Resistance"] },
    { name: "Guns", specialties: ["Pistols", "Rifles", "Shotguns", "SMGs", "Gunsmithing"] },
    { name: "Heavy Weapons", specialties: ["Grenade Launchers", "Rocket Launchers", "Vehicle Guns"] },
    { name: "Influence", specialties: ["Administration", "Bureaucracy", "Fast Talk", "Leadership", "Negotiation", "Persuasion", "Politics", "Seduction"] },
    { name: "Knowledge", specialties: ["Appraisal", "Business", "Culture", "History", "Law", "Medicine", "Military Regulations", "Philosophy", "Religion", "Tactics"] },
    { name: "Linguistics", specialties: ["Chinese", "Border Slang", "Trade Patois"] },
    { name: "Mechanical Engineering", specialties: ["Machinery Maintenance", "Repair", "Powerplants", "Vehicle Repair"] },
    { name: "Medical Expertise", specialties: ["First Aid", "Internal Medicine", "Neurology", "Pharmaceuticals", "Physiology", "Surgery", "Toxicology"] },
    { name: "Melee Weapon Combat", specialties: ["Clubs", "Knives", "Sword", "Axes"] },
    { name: "Performance", specialties: ["Dance", "Oratory", "Piano", "Singing"] },
    { name: "Perception", specialties: ["Deduction", "Empathy", "Hearing", "Intuition", "Investigation", "Search", "Sight", "Taste", "Tracking"] },
    { name: "Pilot", specialties: ["Astrogation", "Aerial Navigation", "Mid-Bulk Transports", "Short-Range Shuttles", "Spacecraft Gunnery"] },
    { name: "Planetary Vehicles", specialties: ["Bikes", "Cars", "Ground Vehicle Repair", "Hovermules"] },
    { name: "Scientific Expertise", specialties: ["Chemistry", "Electronics", "Forensics", "Life Sciences"] },
    { name: "Survival", specialties: ["Aquatic Survival", "Mining", "Space Survival", "Tracking", "Trapping"] },
    { name: "Technical Engineering", specialties: ["Communications", "Electronics", "Hacking", "Security Systems", "Technical Repair"] },
    { name: "Unarmed Combat", specialties: ["Aikido", "Brawling", "Karate", "Wrestling"] }
  ];

  // assets/js/data/equipment.js
  var CATEGORY_ORDER = [
    "General Store & Personal Tools",
    "Food & Sundries",
    "Protective Gear & Armor",
    "Weapons & Armory",
    "Techshop & Communications",
    "Professional Tools (Engineering/Medical)",
    "Services & Livestock"
  ];
  function makeId3() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `gear_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function formatCreditValue(value) {
    if (value === void 0 || value === null || String(value).trim() === "") return "";
    if (typeof value === "string") return value.trim();
    return Number.isInteger(value) ? String(value) : value.toFixed(1);
  }
  function gear({ id, name, category, credits, price, availability, summary, stats = "", source = "" }) {
    return { id, name, category, credits, price, availability, summary, stats, source };
  }
  function formatEquipmentPrice(item = {}) {
    if (item.price) return item.price;
    const credits = formatCreditValue(item.credits);
    return credits ? `\u20A1 ${credits}` : "\u2014";
  }
  var EQUIPMENT_CATALOG = [
    gear({ id: "multiband", name: "Multiband", category: "General Store & Personal Tools", credits: 4.8, price: "\u20A1 4.8 / 12p", source: "Core", availability: "Core", summary: "Wearable utility gear for everyday carry and quick field use." }),
    gear({ id: "patch-tape", name: "Patch Tape", category: "General Store & Personal Tools", credits: 1.2, price: "\u20A1 1.2 / 3p", source: "Core", availability: "Everywhere", summary: "Quick field patching for leaks, tears, and busted kit." }),
    gear({ id: "fire-jelly", name: "Fire Jelly", category: "General Store & Personal Tools", credits: 0.2, price: "\u20A1 0.2 / 1p", source: "Core", availability: "Everywhere", summary: "Accelerant gel for fire-starting and ugly improvisation." }),
    gear({ id: "purification-crystals", name: "Purification Crystals", category: "General Store & Personal Tools", credits: 0.4, price: "\u20A1 0.4 / 1p", source: "Core", availability: "Everywhere", summary: "Water-cleaning crystals for rough travel and bad supply lines." }),
    gear({ id: "grappler", name: "Grappler", category: "General Store & Personal Tools", credits: 8, price: "\u20A1 8 / 20p", source: "Core/SSS", availability: "Everywhere", summary: "Line launcher for climbing, hauling, and awkward approaches." }),
    gear({ id: "multi-tool", name: "Multi-Tool", category: "General Store & Personal Tools", credits: 2, price: "\u20A1 2 / 5p", source: "Core/SSS", availability: "Everywhere", summary: "Pocket repair tool with a little bit of everything." }),
    gear({ id: "forensics-kit", name: "Forensics Kit", category: "General Store & Personal Tools", credits: 20, price: "\u20A1 20 / 50p", source: "SSS", availability: "Core", summary: "Evidence collection and scene-analysis gear." }),
    gear({ id: "forgery-kit", name: "Forgery Kit", category: "General Store & Personal Tools", credits: 40, price: "\u20A1 40 / 100p", source: "SSS", availability: "Rim", summary: "Tools for forged papers, signatures, and dirty paperwork." }),
    gear({ id: "burn-gel-4-apps", name: "Burn Gel (4 apps)", category: "General Store & Personal Tools", credits: 1.8, price: "\u20A1 1.8 / 5p", source: "SSS", availability: "Illegal", summary: "Topical burn treatment with four applications." }),
    gear({ id: "fusion-torch", name: "Fusion Torch", category: "General Store & Personal Tools", credits: 2.2, price: "\u20A1 2.2 / 6p", source: "SSS", availability: "Rim", summary: "Portable cutting and welding torch." }),
    gear({ id: "generator-portable", name: "Generator, Portable", category: "General Store & Personal Tools", credits: 12, price: "\u20A1 12 / 30p", source: "SSS", availability: "Everywhere", summary: "Compact portable power source." }),
    gear({ id: "sewing-kit", name: "Sewing Kit", category: "General Store & Personal Tools", credits: 0.8, price: "\u20A1 0.8 / 2p", source: "SSS", availability: "Everywhere", summary: "Field sewing and clothing repair kit." }),
    gear({ id: "snaplink", name: "Snaplink", category: "General Store & Personal Tools", credits: 0.4, price: "\u20A1 0.4 / 1p", source: "SSS", availability: "Everywhere", summary: "Small connector hardware for straps, lines, and gear." }),
    gear({ id: "welding-tape", name: "Welding Tape (per meter)", category: "General Store & Personal Tools", credits: 0.7, price: "\u20A1 0.7 / 2p", source: "SSS", availability: "Everywhere", summary: "Heavy-duty repair tape sold by the meter." }),
    gear({ id: "cookset", name: "Cookset", category: "Food & Sundries", credits: 4, price: "\u20A1 4 / 10p", source: "SSS", availability: "Everywhere", summary: "Portable cookware for camp, bunkhouse, or galley use." }),
    gear({ id: "fresh-fruit", name: "Fresh Fruit", category: "Food & Sundries", credits: 0.1, price: "\u20A1 0.1-0.5 / 1p", source: "SSS", availability: "Core", summary: "Fresh produce with a market price that varies by world." }),
    gear({ id: "protein-chips", name: "Protein Chips", category: "Food & Sundries", credits: 0.2, price: "\u20A1 0.2-0.4 / 1p", source: "SSS", availability: "Everywhere", summary: "Cheap packaged food with a little price swing by market." }),
    gear({ id: "rotgut", name: "Rotgut", category: "Food & Sundries", credits: 0.4, price: "\u20A1 0.4 / 1p", source: "SSS", availability: "Everywhere", summary: "Bottom-shelf liquor with a reputation to match." }),
    gear({ id: "snack-bar-fruity-oaty", name: "Snack Bar (Fruity Oaty)", category: "Food & Sundries", credits: 0.1, price: "\u20A1 0.1 / 1p", source: "SSS", availability: "Everywhere", summary: "Cheap packaged snack for the road or the hold." }),
    gear({ id: "chemical-body-warmer-4", name: "Chemical Body Warmer (4)", category: "Food & Sundries", credits: 0.8, price: "\u20A1 0.8 / 2p", source: "SSS", availability: "Everywhere", summary: "Pack of disposable heat packs." }),
    gear({ id: "gas-mask", name: "Gas Mask", category: "Food & Sundries", credits: 4, price: "\u20A1 4 / 10p", source: "SSS", availability: "Everywhere", summary: "Breathing protection for smoke, gas, and bad air." }),
    gear({ id: "ocular-binoculars", name: "Ocular (Binoculars)", category: "Food & Sundries", credits: 6, price: "\u20A1 6 / 15p", source: "SSS", availability: "Everywhere", summary: "Portable magnification for scouting and overwatch." }),
    gear({ id: "radiation-detector", name: "Radiation Detector", category: "Food & Sundries", credits: 8, price: "\u20A1 8 / 20p", source: "SSS", availability: "Everywhere", summary: "Handheld detector for contaminated zones and bad salvage." }),
    gear({ id: "rucksack", name: "Rucksack", category: "Food & Sundries", credits: 2, price: "\u20A1 2 / 5p", source: "SSS", availability: "Everywhere", summary: "Basic carry pack for hauling your own trouble." }),
    gear({ id: "ships-papers-fee", name: "Ship's Papers (Fee)", category: "Food & Sundries", credits: 20, price: "\u20A1 20 / 50p", source: "SSS", availability: "Everywhere", summary: "Fee for papers needed to keep a ship legal and moving." }),
    gear({ id: "ballistic-mesh", name: "Ballistic Mesh", category: "Protective Gear & Armor", credits: 46, price: "\u20A1 46 / 115p", availability: "Core", summary: "Protective mesh armor for serious incoming fire.", stats: "Armor 1W" }),
    gear({ id: "plate-vest", name: "Plate Vest", category: "Protective Gear & Armor", credits: 30, price: "\u20A1 30 / 75p", availability: "Everywhere", summary: "Heavy plated vest for blunt, ugly protection.", stats: "Armor 4W" }),
    gear({ id: "riot-gear", name: "Riot Gear", category: "Protective Gear & Armor", credits: 92, price: "\u20A1 92 / 230p", availability: "Core", summary: "Protective gear built for organized violence and crowd control.", stats: "Armor 3W" }),
    gear({ id: "tactical-suit", name: "Tactical Suit", category: "Protective Gear & Armor", credits: 110, price: "\u20A1 110 / 275p", availability: "Illegal", summary: "High-end tactical protection for trouble you planned for.", stats: "Armor 5W" }),
    gear({ id: "vacuum-suit", name: "Vacuum Suit", category: "Protective Gear & Armor", credits: 67, price: "\u20A1 67 / 168p", availability: "Everywhere", summary: "Environmental suit for vacuum exposure and hard ship work.", stats: "Armor 2W" }),
    gear({ id: "duster-armored", name: "Duster, Armored", category: "Protective Gear & Armor", credits: 6, price: "\u20A1 6 / 15p", availability: "Rim", summary: "Long coat with hidden reinforcement and frontier style.", stats: "Armor 4W" }),
    gear({ id: "flight-suit", name: "Flight Suit", category: "Protective Gear & Armor", credits: 14, price: "\u20A1 14 / 35p", availability: "Everywhere", summary: "Pilot-ready protective suit for flying and hard duty.", stats: "Armor 2S" }),
    gear({ id: "shield-tactical", name: "Shield, Tactical", category: "Protective Gear & Armor", credits: 10, price: "\u20A1 10 / 25p", availability: "Alliance", summary: "Tactical shield for cover and controlled advance.", stats: "Armor Special" }),
    gear({ id: "pistol-standard", name: "Pistol (Standard)", category: "Weapons & Armory", credits: 22, price: "\u20A1 22 / 55p", availability: "Everywhere", summary: "Plain, practical sidearm for folk who need a gun.", stats: "Damage d6 W" }),
    gear({ id: "rifle-standard", name: "Rifle (Standard)", category: "Weapons & Armory", credits: 46, price: "\u20A1 46 / 115p", availability: "Everywhere", summary: "Long gun for distance, defense, and bad intentions.", stats: "Damage d8 W" }),
    gear({ id: "shotgun", name: "Shotgun", category: "Weapons & Armory", credits: 42, price: "\u20A1 42 / 105p", availability: "Everywhere", summary: "Brutal close-range long arm with frontier appeal.", stats: "Damage d10 W" }),
    gear({ id: "pistol-gauss", name: "Pistol, Gauss", category: "Weapons & Armory", credits: 140, price: "\u20A1 140 / 350p", availability: "Alliance", summary: "High-end magnetic sidearm with Alliance-grade pricing.", stats: "Damage d6 W" }),
    gear({ id: "rifle-gauss", name: "Rifle, Gauss", category: "Weapons & Armory", credits: 400, price: "\u20A1 400 / 1,000p", availability: "Alliance", summary: "Alliance-grade gauss rifle for very expensive trouble.", stats: "Damage d10 W" }),
    gear({ id: "knife-throwing", name: "Knife, Throwing", category: "Weapons & Armory", credits: 0.8, price: "\u20A1 0.8 / 2p", availability: "Everywhere", summary: "Light throwing blade for folk who like quiet violence.", stats: "Damage d2 W" }),
    gear({ id: "grenade-incendiary", name: "Grenade, Incendiary", category: "Weapons & Armory", credits: 2.8, price: "\u20A1 2.8 / 7p", availability: "Alliance", summary: "Incendiary grenade for turning a space into fire.", stats: "Damage 2d12 W" }),
    gear({ id: "grenade-plasma", name: "Grenade, Plasma", category: "Weapons & Armory", credits: 8.8, price: "\u20A1 8.8 / 22p", availability: "Alliance", summary: "High-yield plasma grenade for truly bad decisions.", stats: "Damage 4d10 W" }),
    gear({ id: "laser-sight", name: "Laser Sight", category: "Weapons & Armory", credits: 3.6, price: "\u20A1 3.6 / 9p", availability: "Everywhere", summary: "Weapon attachment for cleaner aiming.", stats: "+1 step" }),
    gear({ id: "silencer", name: "Silencer", category: "Weapons & Armory", credits: 5.2, price: "\u20A1 5.2 / 13p", availability: "Illegal", summary: "Illegal attachment for keeping shots quieter.", stats: "Special" }),
    gear({ id: "scope-night-vision", name: "Scope, Night-Vision", category: "Weapons & Armory", credits: 32, price: "\u20A1 32 / 80p", availability: "Core", summary: "Night-vision optic for low-light shooting and spotting.", stats: "Special" }),
    gear({ id: "commpack-long-range", name: "Commpack, Long Range", category: "Techshop & Communications", credits: 37.8, price: "\u20A1 37.8 / 95p", source: "Core", availability: "Core", summary: "Long-range portable comms for ship-to-ground and distance work." }),
    gear({ id: "commpack-short-range", name: "Commpack, Short Range", category: "Techshop & Communications", credits: 22.4, price: "\u20A1 22.4 / 56p", source: "Core", availability: "Everywhere", summary: "Short-range comms for crews, teams, and local coordination." }),
    gear({ id: "distress-beacon", name: "Distress Beacon", category: "Techshop & Communications", credits: 31, price: "\u20A1 31 / 78p", source: "Core", availability: "Core", summary: "Emergency beacon for ships, camps, and terrible days." }),
    gear({ id: "emergency-signal-ring", name: "Emergency Signal Ring", category: "Techshop & Communications", credits: 300, price: "\u20A1 300 / 750p", source: "Core", availability: "Core", summary: "High-end emergency signaling device." }),
    gear({ id: "fedband-scanner", name: "Fedband Scanner", category: "Techshop & Communications", credits: 19.8, price: "\u20A1 19.8 / 50p", source: "Core", availability: "Illegal", summary: "Illegal scanner for fedband and protected traffic." }),
    gear({ id: "debugger", name: "Debugger", category: "Techshop & Communications", credits: 20, price: "\u20A1 20 / 50p", source: "Core", availability: "Core", summary: "Diagnostics and code-tracing gear for system work." }),
    gear({ id: "fake-identcard", name: "Fake IdentCard", category: "Techshop & Communications", credits: 4e3, price: "\u20A1 4,000 / 10k p", source: "Core", availability: "Illegal", summary: "Forged identity credentials with a ruinous price tag." }),
    gear({ id: "lock-picks-mechanical", name: "Lock Picks (Mechanical)", category: "Techshop & Communications", credits: 14, price: "\u20A1 14 / 35p", source: "Core", availability: "Illegal", summary: "Manual picks for ordinary mechanical locks." }),
    gear({ id: "lock-picks-electronic", name: "Lock Picks (Electronic)", category: "Techshop & Communications", credits: 35.4, price: "\u20A1 35.4 / 88p", source: "Core", availability: "Illegal", summary: "Electronic tools for bypassing secured systems." }),
    gear({ id: "tool-kit-basic", name: "Tool Kit, Basic", category: "Professional Tools (Engineering/Medical)", credits: 14.4, price: "\u20A1 14.4 / 36p", source: "Core", availability: "Everywhere", summary: "Starter repair kit for honest mechanical work and field fixes." }),
    gear({ id: "tool-set-mechanics", name: "Tool Set, Mechanic's", category: "Professional Tools (Engineering/Medical)", credits: 284, price: "\u20A1 284 / 710p", source: "Core", availability: "Everywhere", summary: "Full mechanic set for serious machine work." }),
    gear({ id: "tool-set-electronic", name: "Tool Set, Electronic", category: "Professional Tools (Engineering/Medical)", credits: 138, price: "\u20A1 138 / 345p", source: "Core", availability: "Core", summary: "Dedicated kit for electronics diagnosis and repair." }),
    gear({ id: "cad-board", name: "CAD Board", category: "Professional Tools (Engineering/Medical)", credits: 27.2, price: "\u20A1 27.2 / 68p", source: "Core", availability: "Core", summary: "Design and drafting board for technical planning work." }),
    gear({ id: "imaging-suite", name: "Imaging Suite", category: "Professional Tools (Engineering/Medical)", credits: 2e5, price: "\u20A1 200,000", source: "SSS", availability: "Core", summary: "Heavy medical imaging equipment for top-end diagnostics." }),
    gear({ id: "doctors-bag", name: "Doctor's Bag", category: "Professional Tools (Engineering/Medical)", credits: 27.4, price: "\u20A1 27.4 / 69p", source: "Core", availability: "Rim", summary: "Field-ready medical bag for somebody with real training." }),
    gear({ id: "drug-anti-psychotic", name: "Drug, Anti-Psychotic", category: "Professional Tools (Engineering/Medical)", credits: 14, price: "\u20A1 14 / 35p", source: "SSS", availability: "Core", summary: "Medication for severe psychological symptoms." }),
    gear({ id: "drug-anti-rejection", name: "Drug, Anti-Rejection", category: "Professional Tools (Engineering/Medical)", credits: 50, price: "\u20A1 50 / 125p", source: "SSS", availability: "Core", summary: "Medication to suppress implant or transplant rejection." }),
    gear({ id: "allied-postal-service", name: "Allied Postal Service", category: "Services & Livestock", credits: 1.2, price: "\u20A1 1.2 / 3p", availability: "Core", summary: "Alliance mail service for a standard small parcel.", stats: "Up to 10 lbs" }),
    gear({ id: "companion-evening", name: "Companion (Evening)", category: "Services & Livestock", credits: 350, price: "\u20A1 350 / 875p", availability: "Core", summary: "Registered Companion service for an evening." }),
    gear({ id: "legal-counsel-major", name: "Legal Counsel, Major", category: "Services & Livestock", credits: 1e4, price: "\u20A1 10,000 / 25k p", summary: "Serious legal representation for serious criminal trouble.", stats: "Advocate for major crime" }),
    gear({ id: "horse", name: "Horse", category: "Services & Livestock", credits: 50, price: "\u20A1 50 / 110p", summary: "Standard dirt-side mount.", stats: "Standard mount" }),
    gear({ id: "cow", name: "Cow", category: "Services & Livestock", credits: 30, price: "\u20A1 30 / 66p", summary: "Ordinary livestock for milk, meat, or trade.", stats: "Livestock" }),
    gear({ id: "dog", name: "Dog", category: "Services & Livestock", credits: 6, price: "\u20A1 6 / 14p", summary: "Pet or working animal depending on what the crew needs.", stats: "Pet / Working" })
  ];
  var EQUIPMENT_GROUPS = CATEGORY_ORDER.map((category) => ({
    category,
    items: EQUIPMENT_CATALOG.filter((item) => item.category === category).sort((left, right) => left.name.localeCompare(right.name))
  }));
  function getEquipmentItemById(id = "") {
    return EQUIPMENT_CATALOG.find((item) => item.id === id) || null;
  }
  function createPurchasedGearEntry(item) {
    return {
      id: makeId3(),
      catalogId: item.id,
      name: item.name,
      category: item.category,
      credits: item.credits,
      price: item.price || formatEquipmentPrice(item),
      availability: item.availability,
      source: item.source || "",
      stats: item.stats || "",
      note: item.note || item.summary || ""
    };
  }
  function normalizePurchasedGearEntry(entry = {}) {
    const catalogMatch = getEquipmentItemById(entry.catalogId || "");
    return {
      id: entry.id || makeId3(),
      catalogId: entry.catalogId || catalogMatch?.id || "",
      name: entry.name || catalogMatch?.name || "",
      category: entry.category || catalogMatch?.category || "",
      credits: Number.parseFloat(entry.credits ?? catalogMatch?.credits ?? 0) || 0,
      price: entry.price || catalogMatch?.price || formatEquipmentPrice({ credits: entry.credits ?? catalogMatch?.credits ?? 0 }),
      availability: entry.availability || catalogMatch?.availability || "",
      source: entry.source || catalogMatch?.source || "",
      stats: entry.stats || catalogMatch?.stats || "",
      note: entry.note || catalogMatch?.summary || ""
    };
  }
  function getPurchasedGearTotal(details = {}) {
    return Number((details.purchasedGear || []).reduce((sum, item) => sum + (Number.parseFloat(item.credits) || 0), 0).toFixed(1));
  }

  // assets/js/data/specialties.js
  function getSpecialtyDisplayName(specialty = {}) {
    return String(specialty.name || specialty.label || specialty.specialty || "").trim();
  }
  function isEmptySpecialtyEntry(specialty = {}) {
    return getSpecialtyDisplayName(specialty) === "" && (specialty.rating || "none") === "none";
  }

  // assets/js/state.js
  function normalizeLegacyRole(role) {
    return role === "Registered Companion" ? "Companion" : role;
  }
  function hydrateCharacter(input) {
    const base = createDefaultCharacter();
    const character = structuredClone(base);
    if (!input) {
      SKILLS.forEach((skill) => {
        character.skills[skill.name] = { generalRating: "none", specialties: [] };
      });
      return character;
    }
    Object.assign(character.basics, input.basics || {});
    character.basics.role = normalizeLegacyRole(character.basics.role || "");
    if (typeof character.basics.portraitDataUrl !== "string") {
      character.basics.portraitDataUrl = "";
    }
    if (!character.basics.portraitDataUrl) {
      const legacyPortrait = input.basics?.portraitUrl ?? input.details?.portraitUrl;
      character.basics.portraitDataUrl = typeof legacyPortrait === "string" ? legacyPortrait : "";
    }
    delete character.basics.portraitUrl;
    Object.assign(character.attributes, input.attributes || {});
    Object.assign(character.details, input.details || {});
    delete character.details.portraitUrl;
    Object.assign(character.trackers, input.trackers || {});
    Object.assign(character.meta, input.meta || {});
    if (typeof character.meta.characterId !== "string" || !character.meta.characterId.trim()) {
      character.meta.characterId = base.meta.characterId;
    }
    character.details.purchasedGear = (input.details?.purchasedGear || []).map((item) => normalizePurchasedGearEntry(item));
    character.traits.assets = (input.traits?.assets || character.traits.assets).map((trait) => ({
      id: trait.id || (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function" ? globalThis.crypto.randomUUID() : createEmptySpecialty().id),
      category: "asset",
      name: trait.name || "",
      rating: trait.rating || "none",
      source: trait.source || "curated",
      notes: trait.notes || ""
    }));
    character.traits.complications = (input.traits?.complications || character.traits.complications).map((trait) => ({
      id: trait.id || (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function" ? globalThis.crypto.randomUUID() : createEmptySpecialty().id),
      category: "complication",
      name: trait.name || "",
      rating: trait.rating || "none",
      source: trait.source || "curated",
      notes: trait.notes || ""
    }));
    SKILLS.forEach((skill) => {
      const incoming = input.skills?.[skill.name];
      character.skills[skill.name] = {
        generalRating: incoming?.generalRating || "none",
        specialties: (incoming?.specialties || []).map((specialty) => ({
          id: specialty.id || createEmptySpecialty().id,
          name: getSpecialtyDisplayName(specialty),
          rating: specialty.rating || "none"
        })).filter((specialty) => !isEmptySpecialtyEntry(specialty))
      };
    });
    return character;
  }

  // assets/js/data/roles.js
  var ROLE_OPTIONS = [
    "Captain",
    "Pilot",
    "Mechanic / Engineer",
    "Medic",
    "Public Relations",
    "Cargo / Business",
    "Security / Watch",
    "Cook / Utility Hand",
    "Shuttle Hand / General Crew",
    "Passenger",
    "Companion",
    "Hired Specialist",
    "Drifter / Hired Hand",
    "Other"
  ];
  var ROLE_DEFAULT_SKILLS = {
    "Captain": "Influence",
    "Pilot": "Pilot",
    "Mechanic / Engineer": "Mechanical Engineering",
    "Medic": "Medical Expertise",
    "Public Relations": "Influence",
    "Cargo / Business": "Knowledge",
    "Security / Watch": "Guns",
    "Cook / Utility Hand": "Craft",
    "Shuttle Hand / General Crew": "Athletics",
    "Passenger": "Knowledge",
    "Companion": "Influence",
    "Hired Specialist": "Technical Engineering",
    "Drifter / Hired Hand": "Survival",
    "Other": ""
  };
  var ROLE_SKILL_OPTIONS = {
    "Captain": ["Influence", "Discipline", "Knowledge"],
    "Pilot": ["Pilot", "Planetary Vehicles", "Technical Engineering"],
    "Mechanic / Engineer": ["Mechanical Engineering", "Technical Engineering", "Knowledge"],
    "Medic": ["Medical Expertise", "Scientific Expertise", "Knowledge"],
    "Public Relations": ["Influence", "Perception", "Knowledge"],
    "Cargo / Business": ["Knowledge", "Influence", "Perception"],
    "Security / Watch": ["Guns", "Melee Weapon Combat", "Discipline", "Perception"],
    "Cook / Utility Hand": ["Craft", "Knowledge", "Perception"],
    "Shuttle Hand / General Crew": ["Athletics", "Mechanical Engineering", "Technical Engineering", "Perception"],
    "Passenger": ["Knowledge", "Influence", "Perception"],
    "Companion": ["Influence", "Performance", "Perception"],
    "Hired Specialist": ["Technical Engineering", "Scientific Expertise", "Medical Expertise", "Knowledge"],
    "Drifter / Hired Hand": ["Survival", "Athletics", "Perception", "Guns"],
    "Other": []
  };
  var ROLE_GUIDANCE = {
    "Captain": "You keep the outfit moving. You are the one making the call when the deck is on fire and everybody wants a different miracle.",
    "Pilot": "You put the boat where it needs to go. If things turn ugly in the black or the atmo, your hands decide whether the crew keeps breathing.",
    "Mechanic / Engineer": "You keep old machinery loyal through lies, sweat, and profanity. If the boat is still flying, you probably had a hand in the argument.",
    "Medic": "You keep folk alive long enough to regret their decisions. A ship without a medic runs out of luck fast.",
    "Public Relations": "When the crew needs charm, bluff, menace, or a smile with teeth, you are the one they put in front of strangers.",
    "Cargo / Business": "You track what is owed, what is loaded, what is legal, and which lie belongs on which form.",
    "Security / Watch": "You are here to notice trouble before it reaches the hatch, and to make trouble think twice once it does.",
    "Cook / Utility Hand": "A working boat needs more than glamour jobs. You keep the little necessities from becoming big disasters.",
    "Shuttle Hand / General Crew": "You are the spare set of hands every boat needs. Loading, patching, hauling, watching, whatever keeps the crew moving.",
    "Passenger": "You are not ship\u2019s crew, but you still need a reason the others let you stay aboard when things get tight.",
    "Companion": "You are aboard by arrangement, not duty. Your value comes from money, access, leverage, or the doors you can open.",
    "Hired Specialist": "You are here because there is one thing you do better than the rest of the crew, and somebody decided it was worth your berth.",
    "Drifter / Hired Hand": "You signed on because drifting got expensive. Maybe you are running from something, maybe toward it.",
    "Other": "Pick this only if the usual lanes do not fit. If you do, be ready to explain why the crew keeps you around."
  };
  function getAllowedRoleSkills(role) {
    if (role === "Other") return SKILLS.map((skill) => skill.name);
    return ROLE_SKILL_OPTIONS[role] || [];
  }
  function getDefaultRoleSkill(role) {
    const preferred = ROLE_DEFAULT_SKILLS[role] || "";
    const options = getAllowedRoleSkills(role);
    if (preferred && options.includes(preferred)) return preferred;
    return options[0] || "";
  }
  function getRoleGuidance(role) {
    return ROLE_GUIDANCE[role] || "Pick the lane that gives this character a reason to be aboard when the crew is under pressure.";
  }
  function resolveRoleLabel(basics) {
    if ((basics.role || "") === "Other") {
      return basics.customRole?.trim() || "Other";
    }
    return basics.role || "\u2014";
  }

  // assets/js/data/traits.js
  var RAW_CURATED_ASSETS = [
    {
      name: "A Moment in Time",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You are exceptionally skilled at detaching yourself from your current circumstances.",
      description: "Whether through training, practice, or sheer nature, you can compartmentalize physical pain or emotional pain and set it aside until a more convenient moment.",
      benefits: {
        d4: "In combat, this asset lets you keep fightin' despite injury. In social interactions, normal Skill rolls to read your reactions or true feelings automatically fail unless you want them to succeed. A Reader suffers a -2 Skill step when trying to read you."
      },
      note: "You automatically resist the urge to break down upon receiving bad news, though you may still need to deal with it later. You still feel the pain, but this trait lets you ignore it until a more convenient moment to grieve arrives."
    },
    {
      name: "Ain't Got Time to Bleed",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You simply do not feel pain the way others do.",
      description: "Whether by freakish nature, specialized training, or advanced neurosurgery, you can keep functioning through injuries that would slow most folk down.",
      benefits: {
        d4: "When you suffer more Wound damage than half your Life Point score, you take only a -1 Attribute step to all actions instead of the normal -2."
      }
    },
    {
      name: "Alternate Identity",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Somewhere in the Verse there is another you, whether as a look-alike, double life, or fully fictitious identity.",
      description: "When you meet someone who knows the other you, you are treated like that person whether you like it or not. As a Minor Asset, the identity is only modestly known. As a Major Asset, it is very well known or known for something significant.",
      benefits: {
        d2: "This asset can give you a +2 Skill step to rolls where a second identity is helpful.",
        d4: "As a Major Asset, the other identity is much more established and widely recognized, making its benefits and complications correspondingly larger."
      },
      note: "This can also represent a series of identities or a complete fictitious persona. It is most useful for maintaining the ruse, such as Covert/Disguise or Performance/Acting. If you start failing actions this trait benefits, the authorities may grow suspicious. You may also want Dark Secret if the alternate identity becomes more trouble than help."
    },
    {
      name: "Blastomere Implants",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Artificially grown replacement organs keep your body going when it should not.",
      description: "Parts of your insides have been replaced with hotter-running artificial versions that make you one tough S.O.B.",
      benefits: {
        d2: "Any time you take Stun damage, you ignore the first point, effectively giving you an Armor Rating of 1 S.",
        d4: "At the Major level, enough of your guts have been swapped out that you also recover from Wound damage at twice the normal rate."
      }
    },
    {
      name: "Born in the Black",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You were born and largely raised aboard a spaceship, and space is where you make the most sense.",
      description: "You know a great deal about space travel, space-survival, and shipboard maintenance, and you are comfortable operating basic ship systems and moving in zero-g.",
      benefits: {
        d4: "You gain a +2 Skill step on rolls to move about in zero gravity. You also know or remember useful facts about space travel and spaceships, and can operate basic ship systems such as sensors, emergency systems, and life support."
      },
      note: "This does not make you a better pilot, but it does make you a better navigator. On planets, you may be a fish out of water, and if the GM uses that downside to create trouble, you should be rewarded with Plot Points."
    },
    {
      name: "Blue Blood",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You carry a title or family name that opens doors in the right power structures.",
      description: "You may come across as a lily-handed dandy, but your education, lineage, or title gives you standing with nobility and officials. As a Minor Trait, your status is local or narrowly recognized. As a Major Trait, it is backed by a Verse-spanning power and respected in most places.",
      benefits: {
        d2: "You gain a +2 Skill step to Influence rolls when dealing with the power structures that recognize your status.",
        d4: "As a Major Trait, your status is recognized by governments and officials in most places, extending the same +2 Skill step benefit much more broadly."
      },
      note: "Your title or family name can also cause trouble with people who hold grudges or simply hate bluebloods. When the GM uses that downside against you, it should earn Plot Points as though it were a complication."
    },
    {
      name: "CompTech",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have a way with computer systems and the Cortex.",
      description: "Whenever you are working on a program, running sensor sweeps, or hacking your way into an encrypted datapad, your knack with systems gives you an edge.",
      benefits: {
        d2: "You gain a +2 Skill step to rolls involving computer systems, programming, sensor sweeps, or hacking.",
        d4: "As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step."
      },
      note: "For example, if you spend 1 Plot Point to get a d2, it increases to a d6."
    },
    {
      name: "Connoisseur",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have refined tastes and deep expertise in a particular niche field.",
      description: "Whether wine, prized hunting dogs, or award-winning geraniums, your reputation among fellow enthusiasts reaches far and opens doors in unusual places.",
      benefits: {
        d2: "You receive a +2 Skill step when interacting with fellow enthusiasts in your chosen field, and may gain access to gatherings and social circles through that shared interest."
      },
      note: "You should decide with the GM what you are a connoisseur of. Maintaining that status may require serving as a speaker, judge, or expert, and the trait may stop helping once the conversation moves away from your specialty."
    },
    {
      name: "Fast on your Feet",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Your base movement speed is higher than normal.",
      description: "While most folk can walk 15 feet in one round, you move faster than average and are quick to run when it matters.",
      benefits: {
        d2: "At the Minor level, your base movement speed increases to 20 feet per round.",
        d4: "At the Major level, your base movement speed increases to 25 feet per round."
      }
    },
    {
      name: "Hideout",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have a safe place that almost no one knows about.",
      description: "Unless you lead people there, talk about it, or bring major heat down on yourself, your bolt hole stays hidden.",
      benefits: {
        d2: "At the Minor level, your hideout has room for you and a couple of others in cramped quarters, with food, water, sparse furnishings, and the equivalent of a first-aid kit.",
        d4: "At the Major level, your hideout can support up to a dozen crew."
      },
      note: "Decide with the GM where and what your Hideout is. If the campaign spends most of its time sailing the black, it may not come into play very often."
    },
    {
      name: "Home on the Range",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have a way with critters, whether they are livestock, pets, or pests.",
      description: "You are good at working with animals, from training them to convincing them you are not lunch.",
      benefits: {
        d2: "This trait grants a +2 Skill step to rolls you make when working with animals.",
        d4: "As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step."
      },
      note: "For example, if you spend 1 Plot Point to get a d2, it increases to a d6."
    },
    {
      name: "In Plain Sight",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You fade into the background and avoid notice better than most folk.",
      description: "Whether you are picking pockets or running corporate espionage, you are exceptionally good at keeping your whereabouts under wraps.",
      benefits: {
        d2: "Gain a +2 Skill step to rolls to hide, avoid detection, or disguise yourself as another nonspecific person.",
        d4: "As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step."
      },
      note: "For example, if you spend 1 Plot Point to get a d2, it increases to a d6."
    },
    {
      name: "Light Sleeper",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "The slightest disturbance wakes you, even in the middle of hard sleep.",
      description: "It is nearly impossible to sneak up on you while you are asleep, though you may not always know what sound or change woke you.",
      benefits: {
        d2: "You wake at the slightest noise or disturbance, even subtle changes in your surroundings."
      },
      note: "Because you cannot turn this off, it may cause fatigue or insomnia. If the GM uses that downside against you, it should earn Plot Points as though it were a complication."
    },
    {
      name: "Middleman",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have made yourself king of the hill somewhere, however small and sad that hill might be.",
      description: "Folks come to you for work, to fence goods, or to learn what you know. This asset is strongly tied to place, contacts, and campaign circumstances, so it works best when defined closely with the GM.",
      benefits: {
        d2: "As a Minor Trait, you are small potatoes but have enough sway to get regular work and contacts.",
        d4: "As a Major Trait, you have fingers in a lot of pies and in more than one pie shop, and as long as you work at it you should not be hurting for things to do."
      },
      note: "Check with the GM before taking this trait, since it ties you to a particular area and is more about roleplaying and background circumstances than direct mechanical benefits."
    },
    {
      name: "Mighty Fine Hat",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have an item so tied to your identity that you are not the same without it.",
      description: "It might be a signature hat, a uniform, a pair of sunglasses, or a well-worn pistol. The item does not work any better than a normal one, but it has style and somehow always finds its way back to you.",
      benefits: {
        d2: "You cannot be deprived of this item for long. Even if it is lost, stolen, or badly damaged, it tends to return to you sooner or later."
      },
      note: "The exact item is up to you, but it should be something you could reasonably keep on your person at all times. If it is confiscated or taken, the GM should generally see to its return later."
    },
    {
      name: "Sawbones",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have a gift for doctoring, whether by formal training or raw knack.",
      description: "Whether you are diagnosing illness with high-end equipment or patching folk up with a laser scalpel, you are notably good at medical work.",
      benefits: {
        d2: "You gain a +2 Skill step on rolls involving doctoring of any kind.",
        d4: "As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step."
      },
      note: "For example, if you spend 1 Plot Point to get a d2, it increases to a d6."
    },
    {
      name: "Shareowner",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You are part owner in a major endeavor that gives you access you otherwise could not afford.",
      description: "Your share could be in a ship, a business, a racehorse, a research project, or even something bigger. It does not automatically pay dividends, but it does give you privileged access to the endeavor and what comes with it.",
      benefits: {
        d4: "You have access to something significant you could not otherwise afford, such as information, lodging, transport, or even a ship, subject to GM approval."
      },
      note: "You have sunk considerable personal resources into this, but you are only a part owner. Any endeavor covered by this trait has at least three partners, and the exact arrangement must be approved by the GM."
    },
    {
      name: "Allure",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You are physically attractive and know how to make your looks work for you.",
      description: "Whether a handsome fellow or a lovely woman, you generally do not need to look far for companionship. Only rarely does your appearance attract the wrong sort of attention.",
      benefits: {
        d2: "With Minor Allure, you gain a +2 step Skill die bonus on actions keyed to appearance, such as seduction, negotiation, persuasion, or winning beauty pageants.",
        d4: "With Major Allure, any Plot Points spent on such actions are improved as if you had spent 2 additional points."
      },
      note: "For example, if you spend 2 Plot Points to improve a seduction attempt, your additional die is a d8 rather than a d4. If you spend 2 points after the roll is made, your final result is improved by 4 instead of 2."
    },
    {
      name: "Athlete",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You know how to push your body past its normal limits for certain kinds of physical activity.",
      description: "You might pay the price in aching muscles later, but you are able to run farther, jump higher, and lift heavier than most folk.",
      benefits: {
        d2: "Pick one Athletics Specialty. You may choose to exert yourself in the use of that Skill. If you voluntarily suffer Stun damage, you gain an extra die roll as if you had spent an equal number of Plot Points. You may spend up to the number of points that would render you unconscious, but no more.",
        d4: "As a Major Trait, any Plot Points, not Stun, spent on physical activities are improved as if you had spent 2 additional points."
      }
    },
    {
      name: "Born Behind the Wheel",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You are never more at home than when you are seated at the controls of your favored type of vehicle.",
      description: "You learned to fly or drive before you learned to walk. It is as if you and the machine unite to form a single entity.",
      benefits: {
        d2: "Choose either land or air/space vehicles. You gain a +2 step bonus to your Agility Attribute whenever you are at the controls of your chosen vehicle type.",
        d4: "As a Major Trait, any Plot Points spent on actions involving your chosen vehicle type improve as if you had spent 2 additional points."
      }
    },
    {
      name: "Cortex Specter",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "There is almost no record of you in the Cortex, and you move through the system like a ghost.",
      description: "Simple clerical error could be the cause, or someone, perhaps yourself, went to the trouble to wipe the information clean.",
      benefits: {
        d2: "A Cortex search will not show much about your history besides your birth. Anyone attempting to dig up information on your past has a +8 added to the difficulty of their search. Casual searches will reveal almost nothing about you.",
        d4: "As a Major Trait, no official docket of you exists anywhere. Any Alliance, Fed, Interpol agent, or bounty hunter trying to look you up finds nothing."
      },
      note: "In most situations, such as applying for a liquor permit or making a purchase on credit, officials may pass it off as a computer error since everyone is supposed to be on file somewhere. There can be disadvantages: credit might be denied, you might have trouble checking into an Alliance-run hospital, and if the Alliance arrests you on serious charges it could mean a whole heap of trouble because officially you do not exist."
    },
    { name: "Fightin\xE2\u20AC\u2122 Type", allowedRatings: ["d4"], summary: "You are plainly built and trained for violence." },
    {
      name: "Friends in High Places",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You know important people who can sometimes help when you need a favor.",
      description: "You dine with ambassadors, play golf with members of Parliament, and exchange holiday cards with an Alliance admiral. When you need a favor, you know the sort of people who might be willing to help.",
      benefits: {
        d2: "Once per session, you can spend 1 or more Plot Points to call in a favor or secure a quick loan, either from someone known from previous play or someone who occurs to you on the spot."
      },
      note: "The GM must agree on the nature and position of your friend, and whether the favor is plausible. The favor should fit someone in a position of influence or authority, and your contacts may call in favors from you later.",
      plotPointTable: [
        { cost: "1-2 Plot Points", result: "Small loan (up to 500 credits); loan of minor equipment" },
        { cost: "3-4 Plot Points", result: "Medium loan (up to 5,000 credits); lifting a land-lock; invitation to an important event" },
        { cost: "5-6 Plot Points", result: "Large loan (up to 10,000 credits); security clearance; use of a ship" }
      ]
    },
    {
      name: "Friends in Low Places",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You know shady people who can help with criminal favors, street information, and black-market access.",
      description: "Your contacts are of the criminal and underworld sort: money launderers, fencers, thieves, cartel bosses, counterfeiters, and the like. They can set you up with jobs, tip you off to the latest word on the street, and offer you first buy on recently smuggled items.",
      benefits: {
        d2: "Once per session, you can spend 1 or more Plot Points to call in a favor from a local criminal contact, either someone known from previous play or someone you suddenly recall having met before."
      },
      note: "The GM must agree on the nature and position of your contact, and whether the favor is plausible for such folk. Your contacts might call in favors from you in the future.",
      plotPointTable: [
        { cost: "1-2 Plot Points", result: "Small loan with interest (up to 500 credits); information; purchase imprinted goods" },
        { cost: "3-4 Plot Points", result: "Medium loan with interest (up to 5,000 credits); a cut on a smuggling job" },
        { cost: "5-6 Plot Points", result: "Large loan with interest (up to 10,000 credits); protection from a rival crime lord" }
      ]
    },
    {
      name: "Good Name",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have a reputation that usually works in your favor.",
      description: "You have made a name for yourself through some heroic or charitable deed, or you have real underworld credibility. One way or another, you are held in high regard within your social circle.",
      benefits: {
        d2: "You gain a +2 step Skill bonus to any social interaction in which your good name comes into play.",
        d4: "As a Major Trait, just about everyone in the Verse has heard of you and your bonus applies almost all the time."
      },
      note: "You do not get to apply this bonus to your enemies or people who see you as bie woo lohng."
    },
    {
      name: "Healthy as a Horse",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You just do not get sick, and your body recovers faster than most.",
      description: "Even when the rest of the crew is down with coughs and sniffles, you feel wonderful. Serious ailments bounce off your iron constitution, and on the rare occasion you do get sick you recover quickly.",
      benefits: {
        d2: "You gain a +2 step Vitality Attribute bonus whenever you roll to resist or shake off illness or infections.",
        d4: "As a Major Trait, any Plot Points spent on such rolls gain a bonus as if you had spent 2 additional points, and you heal damage, both Stun and Wounds, at twice the usual rate."
      }
    },
    {
      name: "Heavy Tolerance",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Drugs and alcohol do not affect you the way they do most folk.",
      description: "You can drink a slew of husky fellows right under the table, but it takes twice as much to get a decent buzz, and you often need larger doses of medication to get the desired effect.",
      benefits: {
        d2: "You gain a +2 step Vitality Attribute bonus whenever you resist the effects of alcohol, drugs, knock-out or lethal gases, and poison."
      }
    },
    {
      name: "Highly Educated",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You paid attention in school and retained what you learned.",
      description: "Your book learning comes in handy during social events and gameshow appearances, though it can also make you stand out on a Border planet.",
      benefits: {
        d2: "You gain a +2 step Attribute bonus to Intelligence for any Knowledge-based Skill roll when you try to recall information, though it does not help when you are taking actions."
      },
      note: "For example, a doctor might get the bonus when matching symptoms to a disease, but not on rolls to treat the patient."
    },
    {
      name: "Intimidatin' Manner",
      aliases: ["Intimidatin\xE2\u20AC\u2122 Manner"],
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Something about you makes folk think twice before crossing you.",
      description: "You have a steely-eyed stare and true grit. Security guards call you sir, punks melt under your glare, and people often confess more than they meant to when you lean on them.",
      benefits: {
        d2: "You gain a +2 step Attribute bonus to Willpower on any action that involves intimidating, interrogating, bullying, frightening, or otherwise awing other folks."
      },
      note: "You can also use this bonus on your rolls to resist similar attempts made against you."
    },
    {
      name: "Leadership",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You inspire others and help them do what needs to be done.",
      description: "People look to you in a crisis. You are able to motivate those around you and encourage them to work toward a shared goal.",
      benefits: {
        d2: "Once per session, you can designate a goal for receiving your leadership bonus. Everyone working to achieve that goal gains a +2 step Skill bonus on any one action directly related to completing the task.",
        d4: "As a Major Trait, you may also spend any number of your available Plot Points to improve the actions of one or more characters other than yourself, so long as those actions are related to your chosen goal."
      },
      note: "These Plot Points must be used immediately by each character who receives them in this way, and those characters may also supplement them with their own Plot Points."
    },
    {
      name: "Lightnin' Reflexes",
      aliases: ["Lightnin\xE2\u20AC\u2122 Reflexes"],
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You react to danger quickly, and folk rarely get the drop on you.",
      description: "In a quick-draw contest, your gun is out before the other fellow can find his holster.",
      benefits: {
        d4: "You gain a +2 step Attribute bonus to your Agility on all Initiative rolls."
      }
    },
    {
      name: "Math Whiz",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You perform complex mathematical calculations effortlessly.",
      description: "Where others quickly run out of fingers and toes, you already have the answer figured out. You can solve most mathematical problems without fail and without needing to roll the dice.",
      benefits: {
        d2: "You gain a +2 step Attribute bonus to Intelligence for all actions related to accounting, engineering, navigation, and any situation that requires immediate mathematical interpretation."
      }
    },
    {
      name: "Mechanical Empathy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Machines talk to you, and you can fix them by instinct as much as training.",
      description: "You have a way of fixing what ails machinery that goes well beyond the instruction manual, and you are happiest when covered in engine grease.",
      benefits: {
        d2: "For a GM-set Plot Point cost, you gain intuitive knowledge of what is wrong with a particular mechanical device under your care, as well as a +2 step Skill bonus to Mechanical Engineering on actions to fix it."
      },
      note: "Certain unusual circumstances might block this ability, such as the machine turning out to be a hologram. In those cases, you do not spend your Plot Points.",
      plotPointTable: [
        { cost: "1-2 Plot Points", result: "Minor problem (dead battery, slipped belt)" },
        { cost: "3-4 Plot Points", result: "Moderate problem (corroded wiring, blown gasket)" },
        { cost: "5-6 Plot Points", result: "Major problem (faulty catalyzer, crack in the external fuel tank)" }
      ]
    },
    {
      name: "Mean Left Hook",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Your fists are hard as rocks, and you can do real harm bare-handed.",
      description: "You are capable of killing a man with your bare hands.",
      benefits: {
        d2: "Your unarmed attacks inflict Basic damage, split between Stun and Wound, instead of only Stun."
      },
      note: "See Chapter Five: Keep Flyin' for more information on unarmed combat."
    },
    {
      name: "Military Rank",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You are a member of the armed services, or a veteran who still carries that rank and bearing.",
      description: "You most likely fought in the war on one side or the other. Depending on whether you were Browncoat or Alliance, you earn respect in one place and take your lumps in another, but you still have the know-how and means to carry you through tough situations.",
      benefits: {
        d2: "You are or were either enlisted or an officer. Enlisted military members or veterans gain a +2 step Attribute bonus to Willpower on all Discipline-based actions, while officers gain an equivalent bonus on all Influence-based actions."
      }
    },
    {
      name: "Moneyed Individual",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You are loaded, with money on hand and more tucked away for when you need it.",
      description: "You have a nice chunk of change on hand and cash rolling in on a regular basis. You also live a wealthy lifestyle that can make you a target for people who want what you have.",
      benefits: {
        d4: "Increase your starting credits by one-half. Once per game session, you can make an Intelligence + Influence roll, or another appropriate Specialty roll, when making a purchase to see if you can afford it by dipping into your trust fund instead of your money on hand."
      },
      note: "The Difficulty starts at Easy (3) for a purchase of up to 2,000 credits and increases by 4 for every additional 2,000 credits. You may spend Plot Points on the roll.",
      plotPointTable: [
        { cost: "Difficulty 3", result: "Item cost up to 2,000 credits" },
        { cost: "Difficulty 7", result: "Item cost up to 4,000 credits" },
        { cost: "Difficulty 11", result: "Item cost up to 6,000 credits" },
        { cost: "Difficulty 15", result: "Item cost up to 8,000 credits" },
        { cost: "Difficulty 19", result: "Item cost up to 10,000 credits" }
      ]
    },
    {
      name: "Natural Linguist",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have an ear for languages and can learn new ones with remarkable ease.",
      description: "You can pick up specific dialects and recreate accents with little effort. This helps you blend in with the locals, and by listening to people talk you can often tell where they are from.",
      benefits: {
        d2: "You learn Linguist Specialties at half their normal cost. You also gain a +2 step Skill bonus to Influence or Performance, and appropriate Specialties, whenever you are trying to pass for a native by imitating or detecting specific accents and dialects."
      }
    },
    {
      name: "Nature Lover",
      allowedRatings: ["d2"],
      rank: "Minor",
      summary: "You\u2019re in harmony with nature.",
      description: "Even though you are forced to spend most of your time in a crowded city or on board a cramped spaceship, you feel most in tune with your surroundings when you are sleeping on the ground under starlit skies or walking amidst the trees of a forest or riding your horse across the prairies.",
      benefits: {
        d2: "You gain a +2 step Attribute bonus to all Alertness-based rolls while in an outdoor setting, along with an equivalent bonus to a Survival-based skill die when applied to a natural environment."
      }
    },
    {
      name: "Nose for Trouble",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have a mental alarm that sounds when something is about to go wrong.",
      description: "You can tell when somebody is lying through their teeth, and you get a creepy feeling when danger is waiting just out of sight.",
      benefits: {
        d2: "You can make an Intelligence-based or Alertness-based roll to sense trouble even when circumstances might not normally permit it, and you gain a +2 step bonus to either Attribute when the circumstances warrant.",
        d4: "As a Major Trait, you may also spend 1 Plot Point to negate all effects of surprise, sensing trouble just in time to avoid getting caught flat-footed."
      }
    },
    {
      name: "Reader",
      type: "Asset",
      gmApproval: true,
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You sense the world and the thoughts of those around you with supernatural sensitivity.",
      description: "You read more than words. This trait reflects psychic sensitivity, including awareness of thoughts and impressions around you. At stronger levels, that gift is harder to ignore and not always easy to understand.",
      benefits: {
        d2: "As a Minor Trait, your abilities are empathic in nature, letting you learn the general feelings and moods of those around you. You gain a +2 step Attribute bonus to Alertness whenever observing someone, trying to discern the truth from a lie, and in other situations where your talents might help you understand a person.",
        d4: "As a Major Trait, the bonus increases to +4, and once per game session you may spend Plot Points to gain clues or other information."
      },
      note: "\u201CReading\u201D someone is not as straightforward as reading a book, but rather comes across as visual or auditory information that you don\u2019t always understand. Use of Plot Points should always grant you some idea of what the person is thinking, but the image you receive may be symbolic. The GM may also require a character with this trait to take a Complication, such as Traumatic Flashes, to go with your character\u2019s unusual background.",
      plotPointTable: [
        { cost: "1-2 Plot Points", result: "Minor information, trivial details, casual thoughts" },
        { cost: "3-4 Plot Points", result: "Moderate information, private details, significant thoughts" },
        { cost: "5-6 Plot Points", result: "Major information, vital details, closely guarded secrets" }
      ]
    },
    {
      name: "Registered Companion",
      gmApproval: true,
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You possess an active license in the Companion Registry, which legally permits you to do business throughout the system.",
      description: "This trait is only available with GM approval, as it may not match all campaigns.",
      benefits: {
        d2: "Most worlds open their doors for a Registered Companion. This trait grants you a +2 step Skill bonus to Influence-based actions when dealing with those who respect your station."
      },
      note: "This trait reflects only your status in the Registry. To maintain it, you must meet the obligations of Guild membership. Your other training and skills are obtained normally through character creation."
    },
    {
      name: "Religiosity",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You follow the tenets of a particular faith, and that faith helps carry you through hard times.",
      description: "Select a religious faith. Most folk in the \u2019Verse are either Buddhist or Christian, though many other faiths exist in smaller numbers.",
      benefits: {
        d2: "As a Minor Trait, you are a faithful worshipper. Your beliefs gain you a +2 step Attribute bonus to any one Willpower-based action per game session.",
        d4: "As a Major Trait, you are a priest, pastor, monk, rabbi, or other ordained figure and can easily be recognized as such by your garb. In addition to the minor benefits, all Plot Points spent on Influence actions when dealing with those who respect your station are resolved as if you had spent 2 additional points."
      },
      note: "For example, if you spend 2 Plot Points to gain an extra d4 rolled on a given action, you would actually roll a d8. Had you spent the 2 points after the roll, you would add 4 points to the result instead of 2."
    },
    {
      name: "Sharp Sense",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "One of your senses is especially keen, and you can use it to your advantage.",
      description: "You might have the nose of a bloodhound, the eyes of an eagle, or the taste buds of a wine connoisseur.",
      benefits: {
        d2: "Pick one of the five senses: Smell, Touch, Sight, Taste, or Hearing. You gain a +2 step bonus to your Alertness Attribute for any action using that sense."
      },
      note: "You may take this trait more than once during character creation, choosing a different sense each time."
    },
    {
      name: "Steady Calm",
      allowedRatings: ["d2", "d4"],
      summary: "You keep a clear head while all around you are losing theirs.",
      description: "Some situations shake up normal folk, but not you. You stay steady when others are frightened, startled, or rattled."
    },
    {
      name: "Sweet and Cheerful",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "No power in the 'Verse can stop you from being cheerful.",
      description: "You are so doggoned nice that most folks just can't help but like you.",
      benefits: {
        d2: "You gain a +2 step Skill bonus on any action in which your sweet and likeable nature works in your favor."
      }
    },
    {
      name: "Talented",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Whatever it is, you are good at it.",
      description: "You demonstrate a knack for a particular Skill and are able to perform better than others who have equivalent training.",
      benefits: {
        d2: "Pick one Skill Specialty. You gain a +2 step Skill bonus on every use of that Skill.",
        d4: "As a Major Trait, each progression to a higher die costs you 2 points less than normal."
      },
      note: "The advancement discount applies only during play, not during character creation."
    },
    {
      name: "Things Go Smooth",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Lady Luck has taken a liking to you, and things just seem to go your way.",
      description: "You can wade through a swamp of go se and still come out smelling like a rose.",
      benefits: {
        d2: "Once per session, you may re-roll any one action except Botches.",
        d4: "As a Major Trait, you gain an additional re-roll, for two per session total, and you may use them on Botch results as well."
      },
      note: "Any roll, including those using Plot Points, can be redone with this trait. See Chapter Five: Keep Flyin' for Botch rules."
    },
    {
      name: "Tough as Nails",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You're tougher than you look.",
      description: "You can take a beating and still spit in the guy's eye. If you get knocked down, you bounce up again, ready for some gorram revenge.",
      benefits: {
        d2: "You gain 2 extra Life Points over your normal total.",
        d4: "As a Major Trait, you gain 4 points instead."
      }
    },
    {
      name: "Total Recall",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "Your brain stores everything you have learned within easy reach.",
      description: "You remember just about everything you have ever seen or heard.",
      benefits: {
        d4: "You gain a +2 step Skill bonus to any action in which this trait may come in handy. You may also spend a Plot Point to remember verbatim every detail of a past event or encounter with absolute photographic clarity."
      },
      note: "Some repressed memories or traumatic events might be the exception to this rule."
    },
    {
      name: "Trustworthy Gut",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have learned to trust your hunches.",
      description: "Instinct helps you out of bad situations and leads you into good ones.",
      benefits: {
        d2: "You gain a +2 step Attribute bonus to any mental Attribute roll when you are relying on intuition.",
        d4: "As a Major Trait, you can spend 1 Plot Point to ask the GM a specific yes-or-no question related to your hunch."
      },
      note: "Any follow-up questions cost 1 more Plot Point each than the last. The GM can shut down the line of questioning at any time, as even hunches have their limits."
    },
    {
      name: "Two-Fisted",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You are a switch-hitter, able to use either hand equally well.",
      description: "You can write, pitch, and use a weapon with either hand with equal ease, which comes in handy during softball games and shootouts.",
      benefits: {
        d4: "You are ambidextrous. You can use weapons, write, hit, and perform other actions with either hand and incur no off-hand penalty."
      }
    },
    {
      name: "Walking Timepiece",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You never need to look at a watch to know what time it is.",
      description: "You are uncannily accurate. Your friends could set their clocks by you, and a stopwatch has nothing on your internal sense of time.",
      benefits: {
        d2: "Under normal circumstances, you know what time of day or night it is without looking at a clock. You also have a good idea of how much time has passed between one action and another."
      },
      note: "If you are knocked unconscious or otherwise incapacitated, it takes a full-turn Intelligence + Alertness action at Average difficulty to get your internal clock ticking again."
    },
    {
      name: "Wears a Badge",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You represent the Law, at least somewhere.",
      description: "Though the badge lends you authority, it can also be a burden when those you are sworn to serve and protect actually expect service and protection, and that shiny badge makes a dandy target.",
      benefits: {
        d2: "You have the resources and power of your agency on your side, at least within your jurisdiction. Your authority gains you a +2 step Skill bonus to all Influence-based actions when dealing with those who respect your position. As a Minor Trait, you represent local law enforcement on one planet or region.",
        d4: "As a Major Trait, your authority covers most of the system, such as a Federal Marshal or Interpol agent."
      }
    }
  ];
  var ASSET_OVERRIDES = {
    "Fightin\xC3\xA2\xE2\u201A\xAC\xE2\u201E\xA2 Type": {
      name: "Fightin' Type",
      aliases: ["Fightin\xC3\xA2\xE2\u201A\xAC\xE2\u201E\xA2 Type"],
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You know how to handle yourself in almost any combat-type situation.",
      description: "Whether it is a rough-and-tumble brawl or a deadly shootin' match, you are built to handle a fight.",
      benefits: {
        d4: "You may take one non-attack action each combat turn without penalty."
      },
      note: "For example, if you move and shoot in the same turn, your shot does not suffer the normal -1 step Skill penalty."
    },
    "Nature Lover": {
      name: "Nature Lover",
      allowedRatings: ["d2"],
      rank: "Minor",
      summary: "You're in harmony with nature.",
      description: "Even though you are forced to spend most of your time in a crowded city or on board a cramped spaceship, you feel most in tune with your surroundings when you are sleeping on the ground under starlit skies or walking amidst the trees of a forest or riding your horse across the prairies.",
      benefits: {
        d2: "You gain a +2 step Attribute bonus to all Alertness-based rolls while in an outdoor setting, along with an equivalent bonus to a Survival-based skill die when applied to a natural environment."
      }
    },
    "Reader": {
      name: "Reader",
      type: "Asset",
      gmApproval: true,
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Your mind is open to the thoughts and emotions of folk nearby.",
      description: "Whether you realized your psychic potential by yourself or as part of a corporate or government program, being a reader can be both a blessing and a curse. This trait is only available with GM approval, as it may not match all campaigns.",
      benefits: {
        d2: "As a Minor Trait, your abilities are empathic in nature, letting you learn the general feelings and moods of those around you. You gain a +2 step Attribute bonus to Alertness whenever observing someone, trying to discern the truth from a lie, and in other situations where your talents might help you understand a person.",
        d4: "As a Major Trait, the bonus increases to +4, and once per game session you may spend Plot Points to gain clues or other information."
      },
      note: "'Reading' someone is not as straightforward as reading a book, but rather comes across as visual or auditory information that you do not always understand. Use of Plot Points should always grant you some idea of what the person is thinking, but the image you receive may be symbolic. The GM may also require a character with this trait to take a Complication, such as Traumatic Flashes, to go with your character's unusual background.",
      plotPointTable: [
        { cost: "1-2 Plot Points", result: "Minor information (trivial details, casual thoughts)" },
        { cost: "3-4 Plot Points", result: "Moderate information (private details, significant thoughts)" },
        { cost: "5-6 Plot Points", result: "Major information (vital details, closely guarded secrets)" }
      ]
    },
    "Religiosity": {
      name: "Religiosity",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You follow the tenets of a particular faith and are either a faithful practitioner or an ordained religious figure.",
      description: "Faith gets you through the hard times and might help in dealings with others. Select a religious faith. Most folk in the Verse are either Buddhist or Christian, though many other faiths exist in smaller numbers.",
      benefits: {
        d2: "As a Minor Trait, you are a faithful worshipper. Your beliefs gain you a +2 step Attribute bonus to any one Willpower-based action per game session.",
        d4: "As a Major Trait, you are a priest, pastor, monk, rabbi, or other ordained figure and can easily be recognized as such by your garb, robes, collar, hat, and the like. In addition to the minor benefits, all Plot Points spent on Influence actions and appropriate Specialties when dealing with those who respect your station are resolved as if you had spent 2 additional points."
      },
      note: "For example, if you spend 2 Plot Points to gain an extra d4 rolled on a given action, you would actually roll a d8. Had you spent the 2 points after the roll, you would add 4 points to the result instead of 2."
    }
  };
  var CURATED_ASSETS = RAW_CURATED_ASSETS.map((trait) => ASSET_OVERRIDES[trait.name] ? { ...ASSET_OVERRIDES[trait.name] } : trait);
  var CURATED_COMPLICATIONS = [
    {
      name: "Absent Minded",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You tend to forget things, lose focus, and get distracted at the worst times.",
      description: "Whether from too much time in the black or too much mudder's milk, you find it hard to concentrate on long or involved tasks and can be sidetracked by new ideas or shiny objects.",
      benefits: {
        d2: "The GM might impose a -2 Skill step to your rolls when distractions make it difficult for you to concentrate on a long or involved task, or when you try to remember where you put something important."
      }
    },
    {
      name: "Amnesia",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have lost part or all of your memory, and the missing pieces still shape your life.",
      description: "At the minor level, you have forgotten a significant block of time but still know who you are. At the major level, you have total amnesia and know almost nothing of your own past, even though your old skills and reflexes remain.",
      benefits: {
        d2: "As a Minor Trait, months or years of your life are a blank, though you still remember most of who you are and what came before.",
        d4: "As a Major Trait, you do not know your own name or past. You remember nothing except vague feelings stirred by memory triggers, even though you retain the skills and reflexes of your previous life."
      },
      note: "Even if you think you know what caused your memory loss, that is only your best guess. The GM may weave the truth of your amnesia into the story however they see fit."
    },
    {
      name: "Allergy",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Certain things mess with your body something fierce.",
      description: "Pick an allergy. A minor allergy might cause only a rash or a sneezing fit, while a major allergy could leave you pushin' up daisies.",
      benefits: {
        d2: "As a Minor Trait, your reaction is minor, such as hay fever, rash, or sneezes, and you suffer a -2 step penalty to your Physical Attributes, Agility, Strength, and Vitality, for all actions in its presence until you take medication.",
        d4: "As a Major Trait, you suffer a life-threatening reaction to the substance and take d2 points of Stun each turn. When you have no remaining Stun, all additional damage is suffered as both Wounds and Shock Points."
      },
      note: "You likely carry an emergency injection to use in these situations, which will stop the damage in d4 turns."
    },
    {
      name: "Amorous",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Sex might not be the only thing on your mind, but it definitely ranks near the top.",
      description: "You are always looking for intimate companionship whenever possible.",
      benefits: {
        d2: "You will make a pass at almost any person of your sexual preference, and you do not put up many barriers when someone is coming on to you. This can cause a -2 step Skill penalty to Influence-based actions when the other party is offended by your advances."
      },
      note: "You also suffer a -2 step Willpower Attribute penalty when attempting to resist the wiles of someone who is your type."
    },
    {
      name: "Amputee",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You lost an arm or a leg and make do without a proper replacement.",
      description: "Doctors could not sew it back on, and you cannot afford a fancy bionic replacement. You might have a utilitarian prosthetic meant to get the job done and nothing more.",
      benefits: {
        d2: "You are missing either an arm or a leg. If you lack an arm, you cannot perform actions that require two hands, and actions that usually take two hands suffer a -2 step penalty."
      },
      note: "If you do not have a leg, you use crutches, a cane, or a crude prosthetic to walk. Your base movement is reduced to 5 feet per turn, and you suffer a -4 step penalty on movement actions."
    },
    {
      name: "Bleeder",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "Your blood does not clot like most folk's, so injuries become more dangerous fast.",
      description: "You suffer from hemophilia or take blood thinners for another medical condition. Try not to get cut, shot, or stabbed.",
      benefits: {
        d4: "If you suffer Wound damage, you begin to bleed and suffer 1 additional Wound each turn until the bleeding is stopped."
      },
      note: "Stopping the bleeding requires a Hard Intelligence + Medical Expertise action. See Chapter Five: Keep Flyin'."
    },
    {
      name: "Blind",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You have to rely on your remaining senses to get around.",
      description: "You may have been blind since birth or since a terrible accident. You might have a trained animal to assist you, though its training has limits and you are responsible for its care.",
      benefits: {
        d4: "Your character has difficulty moving in unfamiliar surroundings and suffers a -4 step Skill penalty on any action that normally depends on vision."
      },
      note: "The GM can mitigate this for certain actions, as blind individuals can become surprisingly competent at many tasks. The penalty is doubled to -8 step for ranged combat attempts. Because you rely on other senses, you gain the Sharp Sense asset for both Touch and Hearing at no cost."
    },
    {
      name: "Branded",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You are a bad, bad person, and everyone knows it.",
      description: "You have a bad reputation, fairly earned or not, in your home region.",
      benefits: {
        d2: "You suffer a -2 step Skill penalty to any social interaction when the story of your terrible misdeeds comes into play.",
        d4: "As a Major Trait, virtually everyone in the Verse has heard bad things about you and the penalty applies almost all the time."
      },
      note: "You suffer no penalty when dealing with folks who know you personally, or those who feel you got a raw deal."
    },
    {
      name: "Chip on the Shoulder",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Your fuse is short, and violence tends to follow you around.",
      description: "You are ready for a fight at the slightest provocation and cannot walk away from insults or taunts.",
      benefits: {
        d2: "You suffer a -2 step Skill penalty to all peaceable social actions with even a hint of tension.",
        d4: "As a Major Trait, any time you suffer Wound damage you go completely berserk, concentrating only on taking down whoever hurt you until someone else tags you, then you switch targets."
      }
    },
    {
      name: "Combat Paralysis",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You tend to freeze up when bullets start flying or fists start swinging.",
      description: "Whether from fear or not knowing what to do, it takes you a moment to collect yourself when violence breaks out.",
      benefits: {
        d2: "When combat begins, you are unable to take any actions for d2 turns. You may spend Plot Points equal to the number of turns rolled to shake it off.",
        d4: "As a Major Trait, you are helpless for d4 turns and cannot even use Plot Points to act sooner."
      },
      note: "At the GM's discretion, someone with Leadership as an Asset might inspire you enough to jolt you to action."
    },
    {
      name: "Cold As the Black",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Your emotions are nearly nonexistent, and you struggle to connect with other people.",
      description: "Whether damaged, medicated, deeply stoic, or simply wired wrong, you do not laugh, cry, or share feelings like most folk do. You miss social and emotional signals and often fail to react to situations that would stir strong feelings in others.",
      benefits: {
        d2: "Depending on the circumstances, the GM might impose a -2 Skill step to social rolls when your lack of emotion causes problems."
      }
    },
    {
      name: "Coward",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You are a firm believer in living to fight another day.",
      description: "You have no desire to be a Big Damn Hero. When a fight breaks out, so do you, usually in a cold sweat.",
      benefits: {
        d2: "When danger strikes, you look for the nearest exit. You suffer a -2 step Skill penalty on all combat actions in which you are in danger and an equal Willpower Attribute penalty on any action to resist fear, intimidation, torture, or other threats."
      },
      note: "You will fight when backed into a corner, unless there is some way you can crawl through the wall."
    },
    {
      name: "Credo",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You live by a set of principles and will not deviate from them without a damn good reason.",
      description: "Your principles are likely to get you in trouble, and people who know you can use your predictable behavior against you.",
      benefits: {
        d2: "As a Minor Trait, pick a credo that will get you into minor trouble, such as always defending a lady's honor or never running from a fight.",
        d4: "As a Major Trait, your credo is a sure-fire way to put yourself in danger, such as never leaving a man behind, the Captain going down with the ship, or always protecting the weak."
      },
      note: "Even though Credo might land you in hot water, it can also pair naturally with an asset like Good Name."
    },
    {
      name: "Crude",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You prefer to tell it like it is and do not care much for normal pleasantries.",
      description: "You are a gorram bull running amok in Society's rose garden, with rough manners and colorful language no matter your social station.",
      benefits: {
        d2: "You cuss, put your elbows on the table, spit on the sidewalk, and engage in other crude behavior. You suffer a -2 step Skill penalty on Influence-based actions whenever refined social behavior is called for."
      }
    },
    {
      name: "Dark Secret",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "There is something in your past that could cause serious trouble if it comes to light.",
      description: "Work the secret out privately with the GM. A minor secret is humiliating and disruptive, while a major one could upend your life or get you killed.",
      benefits: {
        d2: "As a Minor Complication, the secret is embarrassing or troublesome, with short-term consequences if it gets out. Either way, you suffer a -2 Skill step when trying to explain yourself once the secret is exposed.",
        d4: "As a Major Complication, the secret is severe enough to be worth someone's life, most likely yours. Either way, you suffer a -2 Skill step when trying to explain yourself once the secret is exposed."
      },
      note: "Most of the time, this trait is an ongoing reason for you to be nervous. Roleplay it, and the GM may slide Plot Points your way once in a while."
    },
    {
      name: "Dead Broke",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You live in a state of perpetual poverty.",
      description: "Your pockets have holes the size of Alliance cruisers. If you have money, you will immediately spend it.",
      benefits: {
        d2: "You will never have any measurable amount of wealth. When taking this complication, cut your normal starting credits in half and spend all that you have left immediately on whatever you think you must have, whether you need it or not."
      },
      note: "Because of your debts, you must give up one-half of all your income on the first day in any town, spaceport, or other sign of civilization. The circumstances of your money disappearing vary based on your background and the GM's plans."
    },
    {
      name: "Deadly Enemy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have made yourself a dangerous enemy who wants to capture or kill you.",
      description: "Someone is out to get you. You do not have to specify the exact nature of your nemesis, though your background may provide you or the GM with ideas.",
      benefits: {
        d2: "Your enemy may be extremely powerful and dangerous, posing a direct threat every 3 to 5 adventures at the GM's discretion."
      },
      note: "You are never completely free of the danger until you buy off this complication. Even if you think you have gotten rid of your enemy, the threat remains in one form or another at the GM's discretion."
    },
    {
      name: "Deaf",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You have lost the ability to hear.",
      description: "You can sign and read lips, though your ability to speak may or may not be impaired.",
      benefits: {
        d4: "You cannot hear anything and automatically fail any Alertness-based action involving sound."
      },
      note: "As an advantage, you are immune to sonic attacks designed to injure or disable hearing individuals, and you might be able to tell what people at a distance are saying by reading their lips. You can understand sign language and receive a +2 step bonus to any use of the Perception/Read Lips Skill."
    },
    {
      name: "Dull Sense",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "One of your five senses is fried.",
      description: "It might be a chronic stuffy nose, bad eyesight, poor hearing, or desensitized skin. Whichever it is, you are best off not relying on that sense in a tight spot.",
      benefits: {
        d2: "Pick one of the five senses: Smell, Touch, Sight, Taste, or Hearing. You suffer a -2 step penalty to your Alertness Attribute for any action using that sense."
      },
      note: "You may take this trait more than once during character creation, choosing a different sense each time."
    },
    {
      name: "Easy Mark",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You generally believe what people tell you, whether it is a sob story or a get-rich-quick scheme.",
      description: "Someone once said a sucker is born every minute, and here you are.",
      benefits: {
        d4: "In situations where you are attempting to distinguish the truth from lies, you suffer a -4 step Mental Attribute penalty."
      },
      note: "As the player, you may be rewarded with Plot Points for going along with this trait."
    },
    {
      name: "Ego Signature",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You leave a token, clue, or other mark as a calling card.",
      description: "You want everyone to identify and admire your handiwork, so you consistently leave some sort of signature at the scene of your crimes.",
      benefits: {
        d2: "The clue does not always lead straight back to you and might not always be obvious, but it can help someone track you down."
      },
      note: "It can also allow someone to frame you by committing crimes and then leaving your calling card behind."
    },
    {
      name: "Filcher",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Anything not nailed down looks like it belongs to you.",
      description: "If some pretty piece catches your fancy, you will try to take it, even when committing the theft is a really dumb move.",
      benefits: {
        d2: "You do not steal out of greed, but out of compulsion."
      }
    },
    {
      name: "Forked Tongue",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You lie like an Oriental rug.",
      description: "It is your nature to weave tall tales and tell wild stories to friends and foes. You will lie even when the truth might favor you because you just cannot help yourself.",
      benefits: {
        d2: "You are a compulsive liar. You suffer a -4 step Skill penalty to all Influence-based actions when dealing with people who know you and have reason not to believe a word you say."
      }
    },
    {
      name: "Greedy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Money is the root of all happiness, as far as you are concerned.",
      description: "You will take almost any opportunity to acquire money, and what you already have is never enough.",
      benefits: {
        d2: "Your ethics become flexible if the payoff is big enough. You may sell out your friends, your crew, or anyone else if the money is right."
      }
    },
    {
      name: "Good Samaritan",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You tend to side with the underdog, even when it causes trouble for you.",
      description: "Whether out of pity or a weakness for lost causes, you habitually align yourself with whoever is losing. That can make other people see you as wishy-washy, juvenile, or immature, especially when you abandon them as soon as someone else becomes the underdog.",
      benefits: {
        d2: "When interacting with people who dislike your inconstant nature, you receive a -2 Skill step to your social rolls."
      }
    },
    {
      name: "Glass Jaw",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You go down faster than most folk when you get hit.",
      description: "You are a paper tiger who had better hope not to get hit much, because when you do, you drop a lot faster than most people.",
      benefits: {
        d2: "As a Minor Complication, take 2 Life Points off your score.",
        d4: "As a Major Complication, take 4 Life Points off your score."
      }
    },
    {
      name: "Glory Hound",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You are drawn to the spotlight and will chase dangerous attention to get it.",
      description: "You sign up first for risky missions, go all-out when someone is watching, and throw yourself toward any chance to be noticed or talked about later.",
      benefits: {
        d2: "If your attempts to gain attention turn into a bie woo lohng, you receive a -2 Skill step to social rolls involving whoever else you drag into the mess."
      },
      note: "Your showboating may also get you cited for criminal stupidity."
    },
    {
      name: "Hero Worship",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You look up to one person, living or dead, who can do no wrong in your eyes.",
      description: "You work hard to emulate your hero in dress and speech, and you may go to great lengths to feel physically connected to that person.",
      benefits: {
        d2: "This trait does not always endear you to people, sometimes causing a -2 step Skill penalty to Influence-based actions when you are with those who are not as enthralled with your hero as you are."
      }
    },
    {
      name: "Idealist",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You believe people are basically good and the Verse will work out for the best, even when evidence says otherwise.",
      description: "Your optimism is unrealistic and deeply rooted. Whether you trust the Alliance, your captain, or some broader idea of decency, you ignore ugly truths whenever you can and make excuses when you cannot.",
      benefits: {
        d2: "The GM might impose a -2 Skill step to rolls to notice or realize the truth when your judgment is clouded, or to social rolls involving people who do not share your views."
      }
    },
    {
      name: "Illiterate Backbirth",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You never learned to read properly.",
      description: "Whether from a backwater upbringing, life on the streets, or a serious neurological problem, written language is largely closed off to you.",
      benefits: {
        d2: "As a Minor Trait, you can handle only the basics, such as writing your name and recognizing common words like street signs or place names.",
        d4: "As a Major Trait, you cannot properly read at all. You may not even recognize your own name, and if you are lucky, you can scratch an X on a document if someone points to the right spot."
      }
    },
    {
      name: "Illness",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You suffer from an ongoing sickness that will not go away on its own.",
      description: "You have a disease, syndrome, or genetic condition that leaves you unwell more often than not. Depending on the symptoms, flare-ups can interfere with what you are trying to do.",
      benefits: {
        d2: "As a Minor Trait, the condition is permanent but relatively inconsequential, bothering you only some of the time. During a flare-up, usually once per session for a scene, the GM may apply a -2 Skill step to your actions.",
        d4: "As a Major Trait, your illness is progressive and will eventually leave you dead or bedridden if it is not cured. Constant treatment slows it, but during flare-ups the GM may apply a -2 Skill step to your actions."
      },
      note: "You must buy off this complication to cure it, if a cure is even possible. Check with the GM before taking it at the Major level, and if the illness cannot matter in the campaign, it should not award complication points."
    },
    {
      name: "Hooked",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You are addicted to a substance and must get your fix on a regular basis.",
      description: "It might be alcohol, tobacco, or some kind of drug. If you go without, serious problems follow.",
      benefits: {
        d2: "As a Minor Trait, you are either addicted to something not immediately dangerous or you have the problem somewhat under control. You must get a daily fix or suffer a -2 step penalty to all Attributes for one week or until you get your fix.",
        d4: "As a Major Trait, your problem is more serious. If you go into withdrawal, the penalty is -4 to all Attributes for two weeks or until you get your fix."
      },
      note: "You cannot quit your habit until you buy off this complication, and when you do, you still have to go through a long withdrawal period determined by the GM."
    },
    {
      name: "Leaky Brainpan",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You have more than a few screws loose, and your mind is not all there.",
      description: "It often wanders from one incoherent thought to the next without stopping to rest.",
      benefits: {
        d2: "As a Minor Trait, you are prone to occasional delusions and random, nonsensical outbursts. You suffer a -2 step Skill penalty to Influence-based social interactions.",
        d4: "As a Major Trait, you are completely weird and creepifying. You suffer a -4 step Skill penalty to Influence-based social interactions."
      },
      note: "For a Major Leaky Brainpan, the GM may describe your surroundings differently than what normal people are seeing to reflect your altered state of mind."
    },
    {
      name: "Lightweight",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have a delicate constitution and do not deal well with threats to your health.",
      benefits: {
        d2: "You suffer a -2 step Vitality penalty on any attempt to resist the effects of alcohol, diseases, environmental hazards, and poison."
      }
    },
    {
      name: "Little Person",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You stand about waist-high compared to most folks.",
      description: "Being smaller than most folk presents challenges, but also opportunities.",
      benefits: {
        d2: "You are only 3 to 4 feet tall. Opponents attacking you with a ranged weapon from more than 10 feet away receive a +4 to the Difficulty."
      },
      note: "Your base speed is reduced to 8 feet per turn, and you suffer a -2 step Skill penalty on movement actions. The GM may also grant other challenges or opportunities based on your size."
    },
    {
      name: "Loyal",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Certain folks known to you can count on you no matter what.",
      description: "They might be crew, war buddies, childhood friends, family, or fraternity brothers. You will go the extra mile to help and protect them.",
      benefits: {
        d2: "Pick a group that can count on your loyalty. You will do anything short of sacrificing your own life to help and protect them, and you might even do that."
      },
      note: "With the GM's permission, you can be loyal to an individual, provided this person is another Player Character or an NPC who is a constant presence in the campaign."
    },
    {
      name: "Memorable",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "There is something distinct about you that makes most folk remember you.",
      description: "It might be a large nose, a thick accent, a bushy beard, recognizable scars, striking beauty, tattoos, or peculiar mannerisms.",
      benefits: {
        d2: "You are easily identified. Others gain a +2 step Alertness Attribute bonus when attempting to spot you or recognize your likeness."
      }
    },
    {
      name: "Mute",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You cannot speak and must communicate through sign language and writing.",
      benefits: {
        d4: "You do not suffer direct action penalties, but you must rely on non-verbal communication to get your point across."
      },
      note: "Whenever this creates significant challenges, the GM should reward you with one or more Plot Points."
    },
    {
      name: "Neatfreak",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Clutter, germs, and filth bother you far more than they should.",
      description: "You are constantly cleaning, tidying, and trying to impose order on your surroundings. At the major level, your aversion to dirt and contamination interferes with daily life in a serious way.",
      benefits: {
        d2: "As a Minor Complication, a significant problem such as being forced to walk through a sewer causes you to suffer a -2 Skill step to all actions for the rest of the scene.",
        d4: "As a Major Complication, you suffer the same -2 Skill step whenever you are in an unclean environment, and dealing with something particularly disgusting can send you into hysterics."
      }
    },
    {
      name: "Nosy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You are driven to investigate mysteries, even when doing so is dangerous or unwise.",
      description: "Once a mystery presents itself, you cannot leave it alone, whether it is ordinary personal business or something that could make the wrong people very upset with you.",
      benefits: {
        d2: "When you are aware of a new or recent mystery and are trying to focus on anything else, you take a -2 Skill step to mental and social actions."
      }
    },
    {
      name: "Non-Fightin' Type",
      aliases: ["Non-Fightin\xE2\u20AC\u2122 Type", "Non-Fightin\xC3\xA2\xE2\u201A\xAC\xE2\u201E\xA2 Type"],
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You do not believe in solving disputes through violence.",
      description: "Whether from religious conviction or the way your mama raised you, you are willing to engage in violence only under the most dire circumstances.",
      benefits: {
        d2: "You will fight only for your own survival or in situations where there is no other choice. When you are forced to fight, you suffer a -2 step Skill penalty to any combat actions."
      }
    },
    {
      name: "Overconfident",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have a bold streak as wide as the Rim and know you are up for any challenge.",
      description: "Some folks call you cocky, but you are convinced you are smarter, stronger, and tougher than everyone else in the Verse.",
      benefits: {
        d2: "You will run, not walk, into deadly altercations, pick fights when outnumbered, bet everything on a single throw, and attempt dangerous actions even when you are not skilled at them."
      }
    },
    {
      name: "Paralyzed",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You do not have the use of your legs and spend most of your life in a wheelchair.",
      description: "A spinal cord injury nearly ended your life.",
      benefits: {
        d4: "Without mechanical or friendly assistance, you can crawl at a speed of only 2 feet per turn. In a manual wheelchair, your base movement is 5 feet and you suffer a -4 step penalty to movement actions."
      },
      note: "An electric wheelchair can allow you to travel up to normal movement speeds. You may have difficulty with stairs or uneven terrain. You can use ranged weapons without penalty, but suffer a -4 step penalty when fighting hand-to-hand."
    },
    {
      name: "Phobia",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Something scares the mi tian gohn out of you.",
      description: "Specify your phobia. It may be an uncommon object that produces an extreme reaction or a more common fear like needles, guns, heights, or spiders.",
      benefits: {
        d2: "You become shaken in the presence of the object of your fear, suffering a -2 step Attribute penalty on all actions."
      }
    },
    {
      name: "Portly",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "You never met a pot roast you did not like.",
      benefits: {
        d2: "As a Minor Trait, you are somewhat overweight. You suffer a -2 step Attribute penalty to all Athletics-based actions, except swimming, and to Influence-based actions dealing with fitness and physical appearance.",
        d4: "As a Major Trait, you are morbidly obese. The penalty increases to -4 steps and your base movement is reduced to 5 feet per turn."
      },
      note: "As a Major Trait, you also suffer a -2 step Skill penalty to all Covert-based actions involving disguise and hiding."
    },
    {
      name: "Prejudice",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You flat-out cannot stand a certain group of people.",
      description: "Your dislike might be ideological, socioeconomic, regional, racial, religious, or something else, and you have a hard time hiding your aversion.",
      benefits: {
        d2: "Pick a group of people with whom you could reasonably have social or business dealings. You avoid interacting with them whenever possible, and when you cannot, all Influence-based social interactions with the object of your prejudice suffer a -2 step Skill penalty."
      },
      note: "You may even go out of your way to insult them."
    },
    {
      name: "Rebellious",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You have a serious problem with authority and dislike being told what to do.",
      description: "The Alliance does not sit well with you, but neither does anyone else trying to give orders. You find ways to dodge obedience without getting shot, though the attitude can carry serious consequences inside any command structure.",
      benefits: {
        d2: "This trait can impose a -2 Skill step to certain actions, particularly whenever you are interacting with your superior officers."
      }
    },
    {
      name: "Sadistic",
      rank: "Major",
      allowedRatings: ["d4"],
      summary: "You love hurting people and do not pass up chances to express your cruelty.",
      description: "Whether from belief, taste, or sheer sickness, the sound of screams is music to your ears.",
      benefits: {
        d4: "Your cruelty knows no bounds, and you do not pass up chances to maim or torture those under your power."
      },
      note: "This is a trait usually reserved for the bad guys. No aspiring Big Damn Hero should ever take it."
    },
    {
      name: "Scrawny",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You are skin and bones, whether from missed meals or a freakish metabolism.",
      benefits: {
        d2: "You suffer a -2 step Strength Attribute penalty to all Athletics-based actions and a -2 step Skill penalty on Influence-based actions dealing with fitness and physical appearance."
      }
    },
    {
      name: "Second Class Citizen",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Your society treats you like you matter less than other people do.",
      description: "For political, regional, social, or cultural reasons, some folk look down on you and deny you the respect and consideration others might receive. At the minor level this only applies in certain places, while at the major level it follows you almost everywhere.",
      benefits: {
        d2: "As a Minor Complication, your status works against you only in certain areas, such as a few planets or one stretch of space. In social situations where it matters, you suffer a -2 Skill step on social rolls against those who look down on you.",
        d4: "As a Major Complication, you receive poor treatment almost everywhere you go. In social situations where it matters, you suffer a -2 Skill step on social rolls against those who look down on you."
      }
    },
    {
      name: "Shy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You are a wallflower who struggles when social attention turns your way.",
      description: "You have trouble talking to people, especially when you become the center of attention. Even when you have something important to say, being watched or expected to perform socially makes you deeply uncomfortable.",
      benefits: {
        d2: "When all eyes are on you and you are expected to perform socially, you suffer a -2 Skill step to your actions."
      }
    },
    {
      name: "Slow Learner",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "There are some things you are just not good at and never will be.",
      benefits: {
        d2: "Choose one general Skill. You pay 2 additional points for any improvement to that Skill or any of its Specialties during advancement, and you suffer a -2 step Skill penalty any time you try to use it."
      },
      note: "This applies to advancement only, not character creation."
    },
    { name: "Soft", allowedRatings: ["d2"], summary: "You are not built for hardship, filth, or extended suffering." },
    {
      name: "Stingy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You consider yourself practical and thrifty, but most folk just call you a tightwad.",
      description: "No matter how rich you are, you never part with money you do not absolutely have to.",
      benefits: {
        d2: "You buy off-brand merchandise, haggle down shopkeepers, stash cash in your boot, ignore charitable causes, and will only consider loans to reliable friends, with interest of course."
      }
    },
    {
      name: "Straight Shooter",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "Honesty is not always the best policy, especially in diplomacy, business, or barrooms.",
      description: "You speak the truth without regard for other people's feelings or the circumstances involved.",
      benefits: {
        d2: "You might consider telling a falsehood only in dire emergencies, and even then you suffer a -2 step Skill penalty to Influence-based actions because your lie is written all over your face."
      }
    },
    {
      name: "Superstitious",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You believe in omens and harbingers of luck, good and bad.",
      description: "You avoid black cats, dodge ladders, and take no chances with ill luck. Your superstitions affect your everyday behavior.",
      benefits: {
        d2: "Whenever you receive an omen of bad luck, you suffer a -2 penalty to all of your Attributes for a set of actions determined by the GM."
      },
      note: "The reverse is also true. When you receive an omen of good luck, the GM will determine a group of actions to receive a +2 Attribute bonus."
    },
    {
      name: "Things Don't Go Smooth",
      aliases: ["Things Don\xE2\u20AC\u2122t Go Smooth", "Things Don\xC3\xA2\xE2\u201A\xAC\xE2\u201E\xA2t Go Smooth"],
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Lady Luck hates your guts.",
      description: "For as long as you can remember, things never have gone smooth for you. Bad luck follows you around and coincidences never work in your favor.",
      benefits: {
        d2: "Once per session, the GM can force you to re-roll an action and take the lower of the two results.",
        d4: "As a Major Trait, the GM can make you re-roll two actions per session."
      }
    },
    {
      name: "Toes the Line",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You do things by the book and are deeply uncomfortable breaking rules or orders.",
      description: "You obey superiors, follow instructions to the letter, and resist bending regulations even when doing so would save trouble or even your own skin.",
      benefits: {
        d2: "You take a -2 Skill step when attempting actions that are specifically against your orders."
      }
    },
    {
      name: "Two Left Feet",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Balance and coordination do not come naturally to you.",
      description: "You bump into doors, fall down stairs, step on dance partners, and generally struggle with movement and coordination far more than most folk.",
      benefits: {
        d2: "You take a -2 Skill step to all rolls to move, catch something, throw something, or do any other action impeded by being unbalanced.",
        d4: "As a Major Trait, you suffer the same -2 Skill step and also botch such rolls more frequently, treating all 1s and 2s as a botch result instead of only all 1s."
      }
    },
    {
      name: "Traumatic Flashes",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Horrible dreams and visions overtake you and leave you shaken and unsettled.",
      description: "These flashes might be residual memories of trauma, messages from a disturbed conscience, or recurring nightmares. You do not always know what will trigger them.",
      benefits: {
        d2: "Once per game session, some trigger determined by the GM causes you to suffer a traumatic flash. You are incapable of action for d2 turns and suffer a -2 step Attribute penalty on all actions for ten minutes following the flash.",
        d4: "As a Major Trait, these flashes happen twice per session."
      },
      note: "During an episode, you are incoherent, shaking, and screaming."
    },
    {
      name: "Twitchy",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You know for a fact that everyone is out to get you.",
      description: "You spend most of your time watching your back. You trust almost no one, and even your oldest friends only to a point.",
      benefits: {
        d2: "You do not trust anyone, assume whispers are about you, and do not believe reassurance. You suffer a -2 step Skill penalty to all Influence-based actions in social situations."
      }
    },
    {
      name: "Ugly as Sin",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Either you were born ugly or life has left you looking mighty hideous.",
      description: "Scars, burns, or plain bad luck have left your appearance working against you.",
      benefits: {
        d2: "You are unattractive and suffer a -2 step Skill penalty to all actions keyed to appearance, such as seduction, negotiation, and persuasion.",
        d4: "As a Major Trait, you are ugly to the bone and all Plot Points spent on such actions cost twice the usual amount."
      }
    },
    {
      name: "Weak Stomach",
      rank: "Minor/Major",
      rankByRating: {
        d2: "Minor",
        d4: "Major"
      },
      allowedRatings: ["d2", "d4"],
      summary: "Blood, gore, and dead bodies make your knees go wobbly.",
      description: "You tend to avoid situations where blood, entrails, or corpses are likely to be present.",
      benefits: {
        d2: "You cannot stand to be in the presence of blood, entrails, and dead bodies. You suffer a -2 step penalty to all Attributes until the source of your discomfort is removed or until you leave on your own.",
        d4: "As a Major Trait, you also have to make an Average Vitality + Willpower test for each five-minute interval you are exposed to gory scenes or fall unconscious for 2d4 minutes."
      }
    },
    {
      name: "Wisecracker",
      rank: "Minor",
      allowedRatings: ["d2"],
      summary: "You cannot help cracking jokes, even when it is wildly inappropriate.",
      description: "If there is a chance to make a joke, especially at someone else's expense, you take it even when it could offend people, earn you a beating, or make a bad situation worse.",
      benefits: {
        d2: "When your wisecracks offend people, you receive a -2 Skill step to interactions with those you have offended."
      },
      note: "Sometimes the result is not a penalty so much as a punch."
    }
  ];
  var REPEATABLE_TRAIT_NAMES = ["Loyal", "Sharp Sense", "Dull Sense"];
  var MUTUALLY_EXCLUSIVE_TRAIT_PAIRS = [
    ["Moneyed Individual", "Dead Broke"],
    ["Heavy Tolerance", "Lightweight"],
    ["Portly", "Scrawny"]
  ];
  function isRepeatableTrait(name = "") {
    return REPEATABLE_TRAIT_NAMES.includes(name);
  }
  function getMutuallyExclusiveTraits(name = "") {
    return MUTUALLY_EXCLUSIVE_TRAIT_PAIRS.reduce((matches, [left, right]) => {
      if (left === name) matches.push(right);
      if (right === name) matches.push(left);
      return matches;
    }, []);
  }
  function normalizeTraitName(name = "") {
    return String(name || "").replace(/[\u2018\u2019]/g, "'").replace(/Ã¢â‚¬â„¢|ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢|â€™/g, "'");
  }
  function matchesTraitName(item, name = "") {
    const normalizedTarget = normalizeTraitName(name);
    if (normalizeTraitName(item.name) === normalizedTarget) return true;
    return (item.aliases || []).some((alias) => normalizeTraitName(alias) === normalizedTarget);
  }
  function findCuratedTrait(category = "asset", name = "") {
    const list = category === "asset" ? CURATED_ASSETS : CURATED_COMPLICATIONS;
    return list.find((item) => matchesTraitName(item, name)) || null;
  }

  // assets/js/rules.js
  var GENERAL_SKILL_STEPS = ["none", "d2", "d4", "d6"];
  var ASSIGNED_ATTRIBUTE_VALUES = ["d2", "d4", "d6", "d8", "d10", "d12"];
  function dieCost(die) {
    return DIE_COSTS[die] ?? 0;
  }
  function specialtyDieCost(die) {
    return SPECIALTY_DIE_COSTS[die] ?? 0;
  }
  function isAssignedAttributeDie(die) {
    return ASSIGNED_ATTRIBUTE_VALUES.includes(die);
  }
  function stepUpGeneralSkill(die) {
    const index = GENERAL_SKILL_STEPS.indexOf(die);
    if (index === -1) return "d2";
    return GENERAL_SKILL_STEPS[Math.min(index + 1, GENERAL_SKILL_STEPS.length - 1)];
  }
  function effectiveGeneralRating(character, skillName) {
    const purchased = character.skills?.[skillName]?.generalRating || "none";
    if ((character.basics?.roleSkill || "") === skillName) {
      return stepUpGeneralSkill(purchased);
    }
    return purchased;
  }
  function calculateAttributePoints(character) {
    return ATTRIBUTE_LIST.reduce((sum, attribute) => sum + dieCost(character.attributes[attribute]), 0);
  }
  function calculateTraitPoints(character) {
    const assetCost = character.traits.assets.reduce((sum, trait) => sum + dieCost(trait.rating), 0);
    const complicationGain = character.traits.complications.reduce((sum, trait) => sum + dieCost(trait.rating), 0);
    return HEROIC_LEVEL.traitPoints + complicationGain - assetCost;
  }
  function calculateSkillPoints(character) {
    let total = 0;
    Object.values(character.skills).forEach((skill) => {
      total += dieCost(skill.generalRating || "none");
      (skill.specialties || []).forEach((specialty) => {
        total += specialtyDieCost(specialty.rating || "none");
      });
    });
    return total;
  }
  function lifePoints(character) {
    if (!isAssignedAttributeDie(character.attributes.Vitality) || !isAssignedAttributeDie(character.attributes.Willpower)) {
      return "-";
    }
    return dieCost(character.attributes.Vitality) + dieCost(character.attributes.Willpower);
  }
  function initiative(character) {
    if (!isAssignedAttributeDie(character.attributes.Agility) || !isAssignedAttributeDie(character.attributes.Alertness)) {
      return "-";
    }
    return `${character.attributes.Agility} + ${character.attributes.Alertness}`;
  }
  function remainingBudgets(character) {
    return {
      attributes: HEROIC_LEVEL.attributePoints - calculateAttributePoints(character),
      traits: calculateTraitPoints(character),
      skills: HEROIC_LEVEL.skillPoints - calculateSkillPoints(character)
    };
  }
  function validateCharacter(character) {
    const errors = [];
    const budgets = remainingBudgets(character);
    const unassignedAttributes = ATTRIBUTE_LIST.filter((attribute) => !isAssignedAttributeDie(character.attributes[attribute]));
    if (unassignedAttributes.length > 0) {
      errors.push(`Assign all Attributes before the build can be finished. Remaining: ${unassignedAttributes.join(", ")}.`);
    }
    if (budgets.attributes !== 0) {
      errors.push(`Attribute Points must spend exactly ${HEROIC_LEVEL.attributePoints}. Current remainder: ${budgets.attributes}.`);
    }
    if (budgets.skills < 0) {
      errors.push(`Skill Points overspent by ${Math.abs(budgets.skills)}.`);
    }
    if (budgets.traits < 0) {
      errors.push(`Trait Points overspent by ${Math.abs(budgets.traits)}.`);
    }
    const assetCount = character.traits.assets.filter((trait) => trait.name && trait.rating !== "none").length;
    const complicationCount = character.traits.complications.filter((trait) => trait.name && trait.rating !== "none").length;
    const selectedTraitNames = [
      ...character.traits.assets,
      ...character.traits.complications
    ].filter((trait) => trait.name && trait.rating !== "none").map((trait) => trait.name);
    if (assetCount < 1) errors.push("At least one Asset is required.");
    if (complicationCount < 1) errors.push("At least one Complication is required.");
    if (assetCount > 5) errors.push("No more than five Assets.");
    if (complicationCount > 5) errors.push("No more than five Complications.");
    MUTUALLY_EXCLUSIVE_TRAIT_PAIRS.forEach(([left, right]) => {
      if (selectedTraitNames.includes(left) && selectedTraitNames.includes(right)) {
        errors.push(`Mutually exclusive traits cannot be taken together: ${left} and ${right}.`);
      }
    });
    Object.entries(character.skills).forEach(([skillName, skill]) => {
      const specialties = (skill.specialties || []).filter((item) => item.rating !== "none");
      if (specialties.length > 0 && effectiveGeneralRating(character, skillName) !== "d6") {
        errors.push(`${skillName} needs a final General rating of d6 before specialties can count.`);
      }
      specialties.forEach((specialty) => {
        if (!getSpecialtyDisplayName(specialty)) {
          errors.push(`${skillName} has a specialty with a die rating but no name.`);
        }
      });
    });
    if (!character.basics.name.trim()) errors.push("Character name is blank.");
    if (!character.basics.concept.trim()) errors.push("Character concept is blank.");
    if (!character.basics.role.trim()) errors.push("Role on the Crew is blank.");
    if (!character.basics.roleSkill.trim()) {
      errors.push("Role Skill is blank.");
    } else {
      const allowedRoleSkills = getAllowedRoleSkills(character.basics.role || "");
      if (allowedRoleSkills.length && !allowedRoleSkills.includes(character.basics.roleSkill)) {
        errors.push(`Role Skill ${character.basics.roleSkill} does not fit the chosen crew role.`);
      }
    }
    return {
      valid: errors.length === 0,
      errors,
      budgets,
      lifePoints: lifePoints(character),
      initiative: initiative(character)
    };
  }

  // assets/js/ui.js
  function el(tag, options = {}, children = []) {
    const node = document.createElement(tag);
    const { cls, text, html, attrs, dataset } = options;
    if (cls) node.className = cls;
    if (text !== void 0) node.textContent = text;
    if (html !== void 0) node.innerHTML = html;
    if (attrs) Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    if (dataset) Object.entries(dataset).forEach(([key, value]) => node.dataset[key] = value);
    if (!Array.isArray(children)) children = [children];
    children.filter(Boolean).forEach((child) => node.append(child));
    return node;
  }
  function field(labelText, inputNode, helpText = "") {
    const wrapper = el("div", { cls: "field-group" });
    wrapper.append(el("label", { text: labelText }));
    wrapper.append(inputNode);
    if (helpText) wrapper.append(el("small", { cls: "help", text: helpText }));
    return wrapper;
  }
  function sectionHeader(title, copy = "") {
    return el("div", {}, [
      el("h2", { cls: "step-title", text: title }),
      el("p", { cls: "step-copy", text: copy })
    ]);
  }
  function setMessage(messageBar, text = "", kind = "info") {
    if (!text) {
      messageBar.hidden = true;
      messageBar.textContent = "";
      messageBar.className = "message-bar";
      return;
    }
    messageBar.hidden = false;
    messageBar.textContent = text;
    messageBar.className = `message-bar ${kind}`;
  }

  // assets/js/steps/step_welcome.js
  function renderWelcomeStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 1: Welcome", "Start with the human being before the numbers. Lock in a name, a concept, and a voice before the rest of the build starts making promises for them."));
    const grid = el("div", { cls: "grid-2" });
    const left = el("div", { cls: "field-card" });
    const right = el("div", { cls: "field-card" });
    const name = document.createElement("input");
    name.value = state2.character.basics.name || "";
    name.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.name = event.target.value;
    }));
    left.append(field("Name", name, "What do people call them when the shooting starts?"));
    const concept = document.createElement("input");
    concept.value = state2.character.basics.concept || "";
    concept.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.concept = event.target.value;
    }));
    left.append(field("Concept", concept, "A one-line pitch that tells the table who this person is."));
    right.append(el("div", { cls: "summary-card guide-card" }, [
      el("h3", { text: "What this page is for" }),
      el("p", { text: "This is the part where the character stops being a pile of dice and starts being somebody worth following into trouble." }),
      el("p", { cls: "muted", text: "Name and concept carry forward to the finished sheet, so keep both concise and specific." })
    ]));
    right.append(el("div", { cls: "summary-card" }, [
      el("h3", { text: "Greenhorn tone" }),
      el("p", { text: "Greenhorns are not blank slates. They know some things, they want some things, and they are still one bad decision away from becoming a cautionary tale." })
    ]));
    grid.append(left, right);
    root.append(grid);
    return root;
  }

  // assets/js/steps/step_role.js
  function buildSelect(options, current) {
    const select = document.createElement("select");
    const blank = document.createElement("option");
    blank.value = "";
    blank.textContent = "Choose...";
    select.append(blank);
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      if (current === option) opt.selected = true;
      select.append(opt);
    });
    return select;
  }
  function renderRoleStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 2: Role on the Crew", "A boat runs on jobs, not vibes. Pick the lane this character fills aboard ship, then choose the one core skill that gets the free d2 training bump during creation."));
    const grid = el("div", { cls: "grid-2" });
    const left = el("div", { cls: "field-card" });
    const right = el("div", { cls: "field-card" });
    const currentRoleValue = ROLE_OPTIONS.includes(state2.character.basics.role || "") ? state2.character.basics.role || "" : state2.character.basics.role || "" ? "Other" : "";
    const roleSelect = buildSelect(ROLE_OPTIONS, currentRoleValue);
    roleSelect.addEventListener("change", (event) => onChange((draft) => {
      const nextRole = event.target.value;
      draft.basics.role = nextRole;
      const allowed = getAllowedRoleSkills(nextRole);
      if (!allowed.includes(draft.basics.roleSkill || "")) {
        draft.basics.roleSkill = getDefaultRoleSkill(nextRole);
      }
    }));
    left.append(field("Role on the Crew", roleSelect, "This is the job the crew expects you to be able to do when things go wrong."));
    const customRole = document.createElement("input");
    customRole.value = state2.character.basics.customRole || "";
    customRole.placeholder = "Only used if Role on the Crew is Other";
    customRole.disabled = (state2.character.basics.role || "") !== "Other";
    customRole.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.customRole = event.target.value;
    }));
    left.append(field("Custom Role Label", customRole, "Leave blank unless you chose Other."));
    const roleSkillOptions = getAllowedRoleSkills(currentRoleValue);
    const currentRoleSkill = roleSkillOptions.includes(state2.character.basics.roleSkill || "") ? state2.character.basics.roleSkill || "" : "";
    const roleSkillSelect = buildSelect(roleSkillOptions, currentRoleSkill);
    roleSkillSelect.disabled = !currentRoleValue;
    roleSkillSelect.addEventListener("change", (event) => onChange((draft) => {
      draft.basics.roleSkill = event.target.value;
    }));
    left.append(field("Role Skill (Free d2 at Creation)", roleSkillSelect, currentRoleValue === "Other" ? "Other lets you choose any one core skill. All listed roles are narrowed to the short skill list that actually fits the job." : "The chosen core skill gets a free d2 step during creation only. It is not a live roll bonus at the table."));
    const crewValue = document.createElement("textarea");
    crewValue.value = state2.character.basics.crewValue || "";
    crewValue.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.crewValue = event.target.value;
    }));
    left.append(field("Why the Crew Keeps You Aboard", crewValue, "One or two sentences. What do you contribute that makes your berth make sense?"));
    right.append(el("div", { cls: "summary-card guide-card" }, [
      el("h3", { text: resolveRoleLabel(state2.character.basics) === "\u2014" ? "Pick a role" : resolveRoleLabel(state2.character.basics) }),
      el("p", { text: currentRoleValue ? getRoleGuidance(currentRoleValue) : "If nobody aboard can fly, fix, patch, talk, or keep watch, the campaign gets short in ugly ways." }),
      el("p", { cls: "muted", text: roleSkillOptions.length ? `Allowed role skills: ${roleSkillOptions.join(", ")}` : "Choose a role to see the available role skills." })
    ]));
    right.append(el("div", { cls: "summary-card" }, [
      el("h3", { text: "House Rule Reminder" }),
      el("p", { text: state2.character.basics.roleSkill ? `${state2.character.basics.roleSkill} gets the free d2 training bump at creation, which makes the skill cheaper to build and helps the character fit the job they claim to do.` : "The role skill exists to keep characters from claiming a job aboard ship that their sheet cannot back up." })
    ]));
    grid.append(left, right);
    root.append(grid);
    return root;
  }

  // assets/js/steps/step_background.js
  var HOMEWORLD_UNKNOWN = "__unknown__";
  var HOMEWORLD_CUSTOM = "__custom__";
  var HOMEWORLD_GROUPS = [
    { label: "Core", worlds: ["Ariel", "Bernadette", "Bellerophon", "Londinium", "Osiris", "Sihnon"] },
    { label: "Border / Mid-Rim", worlds: ["Aberdeen", "Angel", "Ares", "Beaumonde", "Boros", "Constance", "Haven", "Hera", "Highgate", "Liann Jiun", "Miranda", "New Melbourne", "Newhall", "Paquin", "Parth", "Persephone", "Salisbury", "Santo", "Verbena"] },
    { label: "Rim", worlds: ["Athens", "Beylix", "Deadwood", "Dyton", "Ezra", "Greenleaf", "Harvest", "Higgins' Moon", "Ita", "Jiangyin", "Kerry", "Lilac", "Muir", "Pelorum", "Regina", "Shadow", "Silverhold", "St. Albans", "Three Hills", "Triumph", "Whittier", "Whitefall"] }
  ];
  var HOMEWORLD_DESCRIPTIONS = {
    Aberdeen: "A little-known world on the edge of better maps.",
    Ariel: "High-tech Core world of glass, steel, and Alliance order.",
    Angel: "A settled moon with more local character than outside fame.",
    Ares: "A little-known world on the edge of better maps.",
    Bernadette: "Old settlement world with deep colonial roots and strong ties to expansion and new beginnings.",
    Londinium: "Seat of Parliament and Alliance government, proud, powerful, and very Core.",
    Osiris: "Wealthy Core world of privilege, law, medicine, and close Alliance scrutiny.",
    Sihnon: "Ancient wealth, Eastern culture, and elite academies shape life here.",
    Beaumonde: "Industrial Rim world where factories, trade, and tight security define daily life.",
    Bellerophon: "Rich Core world of private estates, old money, and polished manners.",
    Boros: "A civilized Border world under a heavy Alliance thumb, not the kind of place smugglers find relaxing.",
    Constance: "A little-known world on the edge of better maps.",
    Haven: "A little-known world on the edge of better maps.",
    Hera: "Farming world forever marked by Serenity Valley and the scars of the Unification War.",
    Highgate: "A settled moon with more local character than outside fame.",
    "Higgins' Moon": "A settled moon with more local character than outside fame.",
    Harvest: "A frontier world where distance matters more than polish.",
    Ita: "A little-known world on the edge of better maps.",
    Kerry: "A little-known world on the edge of better maps.",
    "Liann Jiun": "A little-known world on the edge of better maps.",
    Lilac: "A frontier world where distance matters more than polish.",
    Miranda: "A dead world whose name still carries a bad kind of weight.",
    Muir: "A frontier world where distance matters more than polish.",
    "New Melbourne": "A little-known world on the edge of better maps.",
    Newhall: "New ocean world of island chains and floating stations, still feeling half-finished.",
    Paquin: "A lively world shaped by Romani culture, where carnivals, theaters, tourists, and hustlers all pass through the same dust.",
    Parth: "A little-known world on the edge of better maps.",
    Pelorum: "A frontier world where distance matters more than polish.",
    Persephone: "Civilized on the surface, but high society and the underworld live side by side.",
    Salisbury: "A little-known world on the edge of better maps.",
    Santo: "Core world in the White Sun system, civilized enough on paper, but still a place where slavers and crooks do business.",
    Verbena: "A rough Rim world reshaped by Alliance rebuilding, factory work, and the lingering wounds of the war.",
    Athens: "Border world of constant winds, hardy crops, and quarried stone, with Whitefall hanging off it like a hard luck moon.",
    Beylix: "Rim world with a smuggler's reputation and little patience for clean hands.",
    Deadwood: "A frontier world where distance matters more than polish.",
    Dyton: "A little-known world on the edge of better maps.",
    Ezra: "Border world in the Georgia system, best known for the shadow cast by Niska's Skyplex in orbit.",
    Greenleaf: "Jungle-heavy Border world of pharmaceuticals, black-market clippings, and tight enforcement.",
    Jiangyin: "Border world split between settled towns and isolated hill folk with hard customs.",
    Regina: "Hard mining world where people know sickness, labor, and the cost of survival.",
    Shadow: "Independent-minded Border world, remembered for ranch country, Browncoats, and wartime ruin.",
    Silverhold: "A settled moon with more local character than outside fame.",
    "St. Albans": "Frozen mountain world where snow, cold, and rough land shape every day.",
    "Three Hills": "A frontier world where distance matters more than polish.",
    Triumph: "Tiny backwater world where settlers live plain, old-fashioned lives far from modern comforts.",
    Whittier: "A settled moon with more local character than outside fame.",
    Whitefall: "Barely civilized frontier moon where hard bargains matter more than comfort."
  };
  var ALL_HOMEWORLDS = HOMEWORLD_GROUPS.flatMap((group) => group.worlds);
  function buildHomeworldSelect(current) {
    const select = document.createElement("select");
    [
      [HOMEWORLD_UNKNOWN, "Unknown / Not Sure"],
      [HOMEWORLD_CUSTOM, "Custom / Other"]
    ].forEach(([value, label]) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      if (current === value) opt.selected = true;
      select.append(opt);
    });
    HOMEWORLD_GROUPS.forEach((group) => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.label;
      group.worlds.forEach((world) => {
        const opt = document.createElement("option");
        opt.value = world;
        opt.textContent = world;
        if (current === world) opt.selected = true;
        optgroup.append(opt);
      });
      select.append(optgroup);
    });
    return select;
  }
  function resolveHomeworldSelection(basics) {
    const raw = (basics.homeworld || "").trim();
    if (ALL_HOMEWORLDS.includes(raw)) return raw;
    if (raw === HOMEWORLD_UNKNOWN) return HOMEWORLD_UNKNOWN;
    if (raw === HOMEWORLD_CUSTOM) return (basics.customHomeworld || "").trim() ? HOMEWORLD_CUSTOM : HOMEWORLD_UNKNOWN;
    if (raw) return HOMEWORLD_CUSTOM;
    if ((basics.customHomeworld || "").trim()) return HOMEWORLD_CUSTOM;
    return HOMEWORLD_UNKNOWN;
  }
  function getCustomHomeworldValue(basics) {
    const raw = (basics.homeworld || "").trim();
    if ((basics.customHomeworld || "").trim()) return basics.customHomeworld;
    if (raw && !ALL_HOMEWORLDS.includes(raw) && raw !== HOMEWORLD_UNKNOWN && raw !== HOMEWORLD_CUSTOM) return raw;
    return "";
  }
  function getHomeworldHelper(selection) {
    if (selection === HOMEWORLD_CUSTOM) return "Pick Custom / Other if your character comes from an obscure rock not in the starter list below.";
    if (selection === HOMEWORLD_UNKNOWN) return "New players can safely leave this unknown for now. Core worlds are richer, Border worlds are mixed, and Rim worlds are rougher.";
    return HOMEWORLD_DESCRIPTIONS[selection] || "Choose a homeworld if you know it, or leave it unknown if you are still finding the character.";
  }
  function renderBackgroundStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 3: Background & Ties", "Now decide where this person came from, what they want, and why they do not feel like a stranger squatting in the same file as everyone else."));
    const grid = el("div", { cls: "grid-2" });
    const left = el("div", { cls: "field-card" });
    const right = el("div", { cls: "field-card" });
    const homeworldSelection = resolveHomeworldSelection(state2.character.basics);
    const homeworldSelect = buildHomeworldSelect(homeworldSelection);
    homeworldSelect.addEventListener("change", (event) => onChange((draft) => {
      const next = event.target.value;
      if (next === HOMEWORLD_UNKNOWN) {
        draft.basics.homeworld = "";
      } else if (next === HOMEWORLD_CUSTOM) {
        const customValue = getCustomHomeworldValue(draft.basics) || getCustomHomeworldValue(state2.character.basics);
        draft.basics.customHomeworld = customValue;
        draft.basics.homeworld = customValue;
      } else {
        draft.basics.homeworld = next;
      }
    }));
    left.append(field("Homeworld", homeworldSelect, getHomeworldHelper(homeworldSelection)));
    const customHomeworld = document.createElement("input");
    customHomeworld.value = getCustomHomeworldValue(state2.character.basics);
    customHomeworld.placeholder = "Enter a custom world name";
    customHomeworld.disabled = homeworldSelection !== HOMEWORLD_CUSTOM;
    customHomeworld.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.customHomeworld = event.target.value;
      draft.basics.homeworld = event.target.value;
    }));
    left.append(field("Custom Homeworld", customHomeworld, "Only used if Homeworld is set to Custom / Other."));
    const background = document.createElement("textarea");
    background.value = state2.character.basics.background || "";
    background.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.background = event.target.value;
    }));
    left.append(field("Background / Notes", background, "Keep it short. Enough to know what sort of trouble they carry around."));
    const crewConnection = document.createElement("input");
    crewConnection.value = state2.character.basics.crewConnection || "";
    crewConnection.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.crewConnection = event.target.value;
    }));
    right.append(field("Connection to the Crew", crewConnection, "A debt, a favor, a shared history, a relative, a lie, a friend, a feud. Something."));
    const crewMotivation = document.createElement("textarea");
    crewMotivation.value = state2.character.basics.crewMotivation || "";
    crewMotivation.addEventListener("input", (event) => onChange((draft) => {
      draft.basics.crewMotivation = event.target.value;
    }));
    right.append(field("What They Want From This Crew", crewMotivation, "Money, belonging, a ride out, a purpose, a hiding place, revenge, redemption, whatever keeps them here."));
    root.append(el("div", { cls: "summary-card guide-card" }, [
      el("h3", { text: "Why this page matters" }),
      el("p", { text: "Crew games get stronger when characters arrive with hooks. These answers give the GM handles and give you reasons to stay aboard when the trouble starts costing blood." })
    ]));
    grid.append(left, right);
    root.append(grid);
    return root;
  }

  // assets/js/steps/step_attributes.js
  function renderAttributesStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 4: Attributes", "Attributes tell you how the character handles the world before training and experience get involved. Spend exactly 42 points and decide where they are naturally sharp, stubborn, quick, or dangerous."));
    root.append(el("div", { cls: "summary-card guide-card" }, [
      el("h3", { text: "How to think about this page" }),
      el("p", { text: "Do not build a perfect hero. Build a person. A Greenhorn should already have strengths, but there should still be holes in the hull." }),
      el("p", { cls: "muted", text: "Life Points come from Vitality and Willpower. Initiative comes from Agility and Alertness." })
    ]));
    const wrap = el("div", { cls: "table-wrap" });
    wrap.append(el("div", { cls: "attribute-row header" }, [
      el("div", { text: "Attribute" }),
      el("div", { text: "Die" }),
      el("div", { text: "Cost" }),
      el("div", { text: "What it covers" })
    ]));
    const helpText = {
      Agility: "Speed, finesse, balance, and reflexes.",
      Strength: "Lift, shove, grapple, and raw force.",
      Vitality: "Toughness, resilience, and staying power.",
      Alertness: "Notice the world before it notices you.",
      Intelligence: "Reason, training, analysis, and know-how.",
      Willpower: "Grit, nerve, and mental backbone."
    };
    ATTRIBUTE_LIST.forEach((attribute) => {
      const select = document.createElement("select");
      ATTRIBUTE_OPTIONS.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option;
        opt.textContent = option;
        if (state2.character.attributes[attribute] === option) opt.selected = true;
        select.append(opt);
      });
      select.addEventListener("change", (event) => onChange((draft) => {
        draft.attributes[attribute] = event.target.value;
      }));
      wrap.append(el("div", { cls: "attribute-row" }, [
        el("div", { text: attribute }),
        select,
        el("div", { html: `<span class="points-badge">${dieCost(state2.character.attributes[attribute])}</span>` }),
        el("div", { cls: "muted", text: helpText[attribute] })
      ]));
    });
    const summary = el("div", { cls: "grid-2" }, [
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Derived values" }),
        el("p", { html: `Life Points: <strong>${state2.computed.lifePoints}</strong>` }),
        el("p", { html: `Initiative: <strong>${state2.computed.initiative}</strong>` })
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Spend reminder" }),
        el("p", { text: "42 points, no leftovers, no mercy. Greenhorn max is d12." })
      ])
    ]);
    root.append(wrap, summary);
    return root;
  }

  // assets/js/steps/step_traits.js
  var activeTraitSelection = {
    asset: null,
    complication: null
  };
  function resolveTraitRank(traitMeta, rating = "none") {
    if (!traitMeta) return "";
    if (traitMeta.rankByRating?.[rating]) return traitMeta.rankByRating[rating];
    return traitMeta.rank || "";
  }
  function resolveCanonicalTraitName(category, name = "") {
    return findCuratedTrait(category, name)?.name || name;
  }
  function getTraitInfo(category, trait, curated) {
    const label = category === "asset" ? "Asset" : "Complication";
    const defaultSummary = category === "asset" ? "Pick a trait to see the basic edge it gives a Greenhorn." : "Pick a trait to see the basic trouble it brings with it.";
    if (!trait) {
      return {
        title: `No ${label} selected`,
        summary: defaultSummary,
        description: "",
        details: [`Type: ${label}`, "Rank varies by trait.", "Allowed ratings: d2 or d4 depending on the trait."],
        benefit: "",
        benefitLabel: "",
        note: "",
        table: []
      };
    }
    if ((trait.source || "curated") === "manual") {
      return {
        title: trait.name || `Custom ${label}`,
        summary: "Manual entry. Use Notes to record the exact effect, limit, or story hook you want the GM to remember.",
        description: "",
        details: [
          `Type: ${label}`,
          trait.rating === "none" ? "Pick a die rating to price this custom trait." : `Current rating: ${trait.rating}.`
        ],
        benefit: "",
        benefitLabel: "",
        note: "",
        table: []
      };
    }
    const traitMeta = findCuratedTrait(category, trait.name);
    if (!traitMeta) {
      return {
        title: trait.name || `Choose an ${label}`,
        summary: defaultSummary,
        description: "",
        details: [`Type: ${label}`, "Allowed ratings appear once a curated trait is chosen."],
        benefit: "",
        benefitLabel: "",
        note: "",
        table: []
      };
    }
    const details = [`Type: ${traitMeta.type || label}`];
    const resolvedRank = resolveTraitRank(traitMeta, trait.rating);
    if (resolvedRank || traitMeta.rank) details.push(`Rank: ${resolvedRank || traitMeta.rank}`);
    details.push(`Allowed ratings: ${traitMeta.allowedRatings.join(", ")}`);
    if (traitMeta.gmApproval) details.push("GM approval required");
    return {
      title: traitMeta.name,
      summary: traitMeta.summary,
      description: traitMeta.description || "",
      details,
      benefit: traitMeta.benefits?.[trait.rating] || "",
      benefitLabel: traitMeta.benefits?.[trait.rating] ? `Benefit (${resolveTraitRank(traitMeta, trait.rating) || trait.rating})` : "",
      note: traitMeta.note || "",
      table: traitMeta.plotPointTable || []
    };
  }
  function chooseActiveTrait(list, category) {
    const activeId = activeTraitSelection[category];
    const active = list.find((trait) => trait.id === activeId) || list.find((trait) => trait.name) || list[0] || null;
    activeTraitSelection[category] = active?.id || null;
    return active;
  }
  function getUnavailableTraitNames(stateList, currentTrait, category) {
    return stateList.filter((item) => item.id !== currentTrait.id && item.name && !isRepeatableTrait(item.name)).map((item) => resolveCanonicalTraitName(category, item.name));
  }
  function getBlockedTraitNames(list, oppositeList, currentTrait, category) {
    const blocked = /* @__PURE__ */ new Set();
    [...list, ...oppositeList].filter((item) => item.id !== currentTrait.id && item.name).forEach((item) => {
      getMutuallyExclusiveTraits(resolveCanonicalTraitName(category, item.name)).forEach((name) => blocked.add(name));
    });
    return blocked;
  }
  function buildTraitSection(title, list, oppositeList, curated, onChange, category) {
    const wrap = el("div", { cls: "field-card" });
    wrap.append(el("h3", { text: title }));
    const maxTraits = 5;
    const slotLine = list.length > maxTraits ? `Over the cap: ${list.length} / ${maxTraits} slots used. Remove extras.` : `Slots used: ${list.length} / ${maxTraits}`;
    wrap.append(el("p", { cls: list.length > maxTraits ? "help danger-text" : "help muted", text: slotLine }));
    const infoTitle = el("strong", { cls: "trait-info-title" });
    const infoSummary = el("p", { cls: "trait-info-copy" });
    const infoDescription = el("p", { cls: "trait-info-line" });
    const infoDetails = el("p", { cls: "trait-info-line muted" });
    const infoBenefit = el("p", { cls: "trait-info-line" });
    const infoNote = el("p", { cls: "trait-info-line muted" });
    const infoTable = el("ul", { cls: "trait-info-list muted" });
    const infoBox = el("div", { cls: "trait-info-box" }, [
      el("div", { cls: "trait-info-label", text: category === "asset" ? "Asset explainer" : "Complication explainer" }),
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
      infoDescription.textContent = info.description || "";
      infoDescription.hidden = !info.description;
      infoDetails.textContent = info.details.join(" | ");
      infoBenefit.textContent = info.benefit ? `${info.benefitLabel}: ${info.benefit}` : "";
      infoBenefit.hidden = !info.benefit;
      infoNote.textContent = info.note ? `Note: ${info.note}` : "";
      infoNote.hidden = !info.note;
      infoTable.innerHTML = "";
      infoTable.hidden = !info.table.length;
      info.table.forEach((row) => {
        infoTable.append(el("li", { text: `${row.cost}: ${row.result}` }));
      });
    };
    list.forEach((trait) => {
      const isLegacyManual = (trait.source || "curated") === "manual";
      const traitMeta = findCuratedTrait(category, trait.name);
      const canonicalTraitName = resolveCanonicalTraitName(category, trait.name);
      const ownSelections = getUnavailableTraitNames(list, trait, category);
      const blockedSelections = getBlockedTraitNames(list, oppositeList, trait, category);
      const nameWrap = el("div", { cls: "trait-name-wrap" });
      let nameInput;
      if (isLegacyManual) {
        nameInput = document.createElement("input");
        nameInput.value = trait.name;
        nameInput.placeholder = "Enter trait name";
      } else {
        nameInput = document.createElement("select");
        const blank = document.createElement("option");
        blank.value = "";
        blank.textContent = "Choose a trait";
        nameInput.append(blank);
        curated.forEach((item) => {
          if ((ownSelections.includes(item.name) || blockedSelections.has(item.name)) && item.name !== canonicalTraitName) return;
          const opt = document.createElement("option");
          opt.value = item.name;
          const optionRank = item.rankByRating ? "Minor/Major" : item.rank;
          opt.textContent = optionRank ? `${item.name} (${optionRank})` : item.name;
          opt.title = [item.summary, item.description, item.note].filter(Boolean).join(" ");
          if (canonicalTraitName === item.name || (item.aliases || []).includes(trait.name)) opt.selected = true;
          nameInput.append(opt);
        });
      }
      nameInput.addEventListener("input", (event) => {
        activeTraitSelection[category] = trait.id;
        onChange((draft) => {
          const target = draft.traits[category === "asset" ? "assets" : "complications"].find((item) => item.id === trait.id);
          target.name = event.target.value;
          const match = findCuratedTrait(category, target.name);
          if (match && !match.allowedRatings.includes(target.rating)) {
            target.rating = match.allowedRatings[0];
          }
        });
      });
      nameWrap.append(nameInput);
      const ratingSelect = document.createElement("select");
      const allowedRatings = traitMeta?.allowedRatings || TRAIT_OPTIONS.filter((item) => item !== "none");
      const ratingChoices = ["none", ...allowedRatings];
      if (trait.rating !== "none" && !ratingChoices.includes(trait.rating)) {
        ratingChoices.push(trait.rating);
      }
      ratingChoices.forEach((rating) => {
        const opt = document.createElement("option");
        opt.value = rating;
        opt.textContent = rating === "none" ? "-" : !allowedRatings.includes(rating) && rating === trait.rating ? `${rating} (legacy)` : rating;
        if (trait.rating === rating) opt.selected = true;
        ratingSelect.append(opt);
      });
      ratingSelect.addEventListener("change", (event) => {
        activeTraitSelection[category] = trait.id;
        onChange((draft) => {
          const target = draft.traits[category === "asset" ? "assets" : "complications"].find((item) => item.id === trait.id);
          target.rating = event.target.value;
        });
      });
      const notes = document.createElement("input");
      notes.value = trait.notes || "";
      notes.placeholder = "Notes";
      notes.addEventListener("input", (event) => {
        activeTraitSelection[category] = trait.id;
        onChange((draft) => {
          const target = draft.traits[category === "asset" ? "assets" : "complications"].find((item) => item.id === trait.id);
          target.notes = event.target.value;
        });
      });
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => onChange((draft) => {
        const key = category === "asset" ? "assets" : "complications";
        draft.traits[key] = draft.traits[key].filter((item) => item.id !== trait.id);
        if (draft.traits[key].length === 0) draft.traits[key].push(createEmptyTrait(category));
        if (activeTraitSelection[category] === trait.id) activeTraitSelection[category] = draft.traits[key][0]?.id || null;
      }));
      const row = el("div", { cls: "trait-row" }, [
        el("div", { cls: "trait-row-top" }, [
          nameWrap,
          ratingSelect,
          el("div", { cls: "trait-points", html: `<span class="points-badge">${trait.rating === "none" ? 0 : trait.rating.replace("d", "")}</span>` }),
          removeButton
        ]),
        el("div", { cls: "trait-row-bottom" }, [
          notes
        ])
      ]);
      [row, nameInput, ratingSelect, notes].forEach((node) => {
        node.addEventListener("focus", () => setInfo(trait), true);
        node.addEventListener("click", () => setInfo(trait));
      });
      wrap.append(row);
    });
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = `Add ${title.slice(0, -1)}`;
    addButton.disabled = list.length >= maxTraits;
    addButton.addEventListener("click", () => onChange((draft) => {
      const key = category === "asset" ? "assets" : "complications";
      if (draft.traits[key].length >= maxTraits) return;
      draft.traits[key].push(createEmptyTrait(category));
      activeTraitSelection[category] = draft.traits[key][draft.traits[key].length - 1].id;
    }));
    const sectionActions = el("div", { cls: "section-actions" }, [addButton]);
    if (list.length >= maxTraits) {
      sectionActions.append(el("small", { cls: "help muted", text: `Maximum ${maxTraits} ${title.toLowerCase()} reached.` }));
    }
    wrap.append(sectionActions);
    setInfo(chooseActiveTrait(list, category));
    return wrap;
  }
  function renderTraitsStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 5: Traits", "Assets help you, Complications haunt you. Greenhorns start with 0 Trait Points, so Complications are what fund the useful edges you can afford to keep."));
    root.append(el("div", { cls: "summary-card" }, [
      el("p", { text: "Quick rule: choose at least one Asset and one Complication. Keep the final Trait Point remainder at 0 or higher. d2 is the quick minor stand-in, d4 the rough major stand-in. You can keep up to five Assets and five Complications." })
    ]));
    const grid = el("div", { cls: "traits-stack" }, [
      buildTraitSection("Complications", state2.character.traits.complications, state2.character.traits.assets, CURATED_COMPLICATIONS, onChange, "complication"),
      buildTraitSection("Assets", state2.character.traits.assets, state2.character.traits.complications, CURATED_ASSETS, onChange, "asset")
    ]);
    root.append(grid);
    return root;
  }

  // assets/js/steps/step_skills.js
  function buildOptions(select, options, current) {
    options.forEach((option) => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option === "none" ? "\u2014" : option;
      if (current === option) opt.selected = true;
      select.append(opt);
    });
  }
  function renderSkillsStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 6: Skills", "Skills are where the role turns into reality. Buy what this character actually does, not what sounds flattering in a bar."));
    const roleSkillList = getAllowedRoleSkills(state2.character.basics.role || "");
    if (state2.character.basics.role) {
      root.append(el("div", { cls: "summary-card guide-card" }, [
        el("h3", { text: `${resolveRoleLabel(state2.character.basics)} skill lane` }),
        el("p", { text: roleSkillList.length ? `This role usually leans on ${roleSkillList.join(", ")}. You do not have to buy all of them, but if you ignore them entirely, the role may be more aspiration than truth.` : "This role does not have a fixed lane, so buy the skills that prove why the crew lets this character stay aboard." })
      ]));
    }
    if (state2.character.basics.roleSkill) {
      const purchased = state2.character.skills[state2.character.basics.roleSkill]?.generalRating || "none";
      const effective = effectiveGeneralRating(state2.character, state2.character.basics.roleSkill);
      root.append(el("div", { cls: "summary-card role-training-card" }, [
        el("h3", { text: "Role Training Bonus" }),
        el("p", { html: `<strong>${state2.character.basics.roleSkill}</strong> gets a free <strong>+d2 step</strong> during character creation only.` }),
        el("p", { cls: "muted", text: `Purchased rating: ${purchased === "none" ? "\u2014" : purchased}. Final rating after role training: ${effective}.` }),
        el("p", { cls: "muted", text: "This discount applies only to the chosen core skill. It is not a live play bonus once the character is built." })
      ]));
    }
    const wrap = el("div", { cls: "table-wrap" });
    wrap.append(el("div", { cls: "skill-row header" }, [
      el("div", { text: "Skill" }),
      el("div", { text: "Purchased" }),
      el("div", { text: "Cost" }),
      el("div", { text: "Specialties" }),
      el("div", { text: "SP" }),
      el("div", { text: "" })
    ]));
    SKILLS.forEach((skillMeta) => {
      const skill = state2.character.skills[skillMeta.name];
      const currentEffective = effectiveGeneralRating(state2.character, skillMeta.name);
      const generalSelect = document.createElement("select");
      generalSelect.style.width = "100%";
      buildOptions(generalSelect, GENERAL_SKILL_OPTIONS, skill.generalRating);
      generalSelect.addEventListener("change", (event) => onChange((draft) => {
        draft.skills[skillMeta.name].generalRating = event.target.value;
        const nextEffective = effectiveGeneralRating(draft, skillMeta.name);
        if (nextEffective !== "d6") {
          draft.skills[skillMeta.name].specialties = draft.skills[skillMeta.name].specialties.map((specialty) => ({ ...specialty, rating: "none" }));
        }
      }));
      const specialtyWrap = el("div");
      skill.specialties.forEach((specialty) => {
        const line = el("div", { cls: "inline-fields" });
        const nameInput = document.createElement("input");
        nameInput.value = getSpecialtyDisplayName(specialty);
        nameInput.placeholder = skillMeta.specialties[0] || "Specialty name";
        nameInput.addEventListener("input", (event) => onChange((draft) => {
          const target = draft.skills[skillMeta.name].specialties.find((item) => item.id === specialty.id);
          target.name = event.target.value;
        }));
        const ratingSelect = document.createElement("select");
        buildOptions(ratingSelect, SPECIALTY_OPTIONS, specialty.rating);
        ratingSelect.disabled = currentEffective !== "d6";
        ratingSelect.addEventListener("change", (event) => onChange((draft) => {
          const target = draft.skills[skillMeta.name].specialties.find((item) => item.id === specialty.id);
          target.rating = event.target.value;
        }));
        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "X";
        removeButton.addEventListener("click", () => onChange((draft) => {
          draft.skills[skillMeta.name].specialties = draft.skills[skillMeta.name].specialties.filter((item) => item.id !== specialty.id);
        }));
        line.append(nameInput, ratingSelect, removeButton);
        specialtyWrap.append(line);
      });
      const addSpecButton = document.createElement("button");
      addSpecButton.type = "button";
      addSpecButton.textContent = "Add Specialty";
      addSpecButton.disabled = currentEffective !== "d6";
      addSpecButton.addEventListener("click", () => onChange((draft) => {
        draft.skills[skillMeta.name].specialties.push(createEmptySpecialty());
      }));
      specialtyWrap.append(el("div", { cls: "section-actions" }, [addSpecButton]));
      const specialtyPoints = skill.specialties.reduce((sum, specialty) => sum + specialtyDieCost(specialty.rating), 0);
      const isRoleSkill = state2.character.basics.roleSkill === skillMeta.name;
      const roleTag = isRoleSkill ? el("span", { cls: "role-tag", text: "Role Training" }) : null;
      const purchasedText = isRoleSkill && currentEffective !== skill.generalRating ? `${skill.generalRating === "none" ? "\u2014" : skill.generalRating} \u2192 ${currentEffective}` : skill.generalRating === "none" ? "\u2014" : skill.generalRating;
      wrap.append(el("div", { cls: `skill-row${isRoleSkill ? " role-skill" : ""}` }, [
        el("div", { html: `<strong>${skillMeta.name}</strong><br><span class="muted">Examples: ${skillMeta.specialties.slice(0, 4).join(", ") || "none listed"}</span>` }, roleTag ? [roleTag] : []),
        el("div", {}, [
          generalSelect,
          isRoleSkill ? el("small", { cls: "help muted", text: `Final core rating ${currentEffective}` }) : null
        ]),
        el("div", { html: `<span class="points-badge">${dieCost(skill.generalRating)}</span>` }),
        specialtyWrap,
        el("div", { html: `<span class="points-badge">${specialtyPoints}</span>` }),
        el("div")
      ]));
    });
    root.append(wrap);
    return root;
  }

  // assets/js/data/gear_packages.js
  function hasSelectedTrait(list = [], name = "") {
    return list.some((trait) => trait.name === name && trait.rating !== "none");
  }
  function getDefaultStartingCredits(character = {}) {
    if (hasSelectedTrait(character.traits?.assets, "Moneyed Individual")) return 1125;
    if (hasSelectedTrait(character.traits?.complications, "Dead Broke")) return 375;
    return 750;
  }
  function resolveStartingCredits(character = {}) {
    const explicit = character.details?.startingCredits;
    if (explicit !== void 0 && explicit !== null && String(explicit).trim() !== "") {
      return explicit;
    }
    return String(getDefaultStartingCredits(character));
  }
  function calculateCurrentCredits(character = {}) {
    const starting = Number.parseFloat(resolveStartingCredits(character));
    if (Number.isNaN(starting)) return "";
    return Number((starting - getPurchasedGearTotal(character.details)).toFixed(1));
  }
  function formatMoney(value, suffix, fallback = "\u2014") {
    if (value === void 0 || value === null || String(value).trim() === "") return fallback;
    const num = Number.parseFloat(value);
    const display = Number.isNaN(num) ? String(value) : Number.isInteger(num) ? String(num) : num.toFixed(1);
    return `${display} ${suffix}`;
  }

  // assets/js/steps/step_details.js
  function buildPurchasedGearList(state2, onChange) {
    const entries = state2.character.details.purchasedGear || [];
    const wrap = el("div", { cls: "field-group" });
    wrap.append(el("label", { text: "Purchased Gear List" }));
    if (!entries.length) {
      wrap.append(el("p", { cls: "help muted", text: "No catalog gear added yet." }));
      return wrap;
    }
    wrap.append(el("p", { cls: "help muted", text: `Catalog gear total: ${formatMoney(getPurchasedGearTotal(state2.character.details), "\u20A1")}` }));
    const list = el("div", { cls: "purchased-gear-list" });
    entries.forEach((entry) => {
      const row = el("div", { cls: "purchased-gear-item" }, [
        el("div", { cls: "purchased-gear-main" }, [
          el("strong", { text: entry.name }),
          el("small", { cls: "muted", text: `${entry.category} \u2022 ${entry.availability}${entry.source ? ` \u2022 ${entry.source}` : ""}${entry.note ? ` \u2022 ${entry.note}` : ""}` })
        ]),
        el("span", { cls: "points-badge", text: entry.price || formatEquipmentPrice(entry) })
      ]);
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.textContent = "Remove";
      removeButton.addEventListener("click", () => onChange((draft) => {
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
    const title = el("strong", { cls: "equipment-info-title", text: "Select an item to see details." });
    const meta = el("p", { cls: "equipment-info-line muted" });
    const summary = el("p", { cls: "equipment-info-copy muted", text: "Price, availability, plain-English summary, and any weapon or armor stats will show here." });
    const stats = el("p", { cls: "equipment-info-line muted" });
    const panel = el("div", { cls: "equipment-info-panel" }, [
      el("div", { cls: "equipment-info-label", text: "Selected Item Details" }),
      title,
      meta,
      summary,
      stats
    ]);
    const sync = (item) => {
      if (!item) {
        title.textContent = "Select an item to see details.";
        meta.textContent = "";
        summary.textContent = "Price, availability, plain-English summary, and any weapon or armor stats will show here.";
        summary.className = "equipment-info-copy muted";
        stats.textContent = "";
        return;
      }
      title.textContent = item.name;
      meta.textContent = `${item.category} \u2022 ${formatEquipmentPrice(item)} \u2022 ${item.availability}${item.source ? ` \u2022 ${item.source}` : ""}`;
      summary.textContent = item.summary || "No catalog summary yet.";
      summary.className = "equipment-info-copy";
      stats.textContent = item.stats ? `Stats: ${item.stats}` : "";
    };
    return { panel, sync };
  }
  function renderDetailsStep(state2, onChange) {
    const root = el("div");
    root.append(sectionHeader("Step 7: Gear & Money", "Set the character\u2019s starting cash, shop from the curated catalog, and note what else they are carrying."));
    root.append(el("div", { cls: "summary-card guide-card" }, [
      el("h3", { text: "Greenhorn Starting Cash" }),
      el("p", { text: "Default starting credits are 750. Moneyed Individual raises that to 1125, while Dead Broke drops it to 375." }),
      el("p", { cls: "muted", text: "Starting Credits auto-fills from those traits, but you can still edit it as a GM override. Current Credits is starting cash minus catalog gear purchases." })
    ]));
    const moneyBlock = el("div", { cls: "field-card" });
    moneyBlock.append(el("h3", { text: "Money" }));
    const moneyGrid = el("div", { cls: "grid-2" });
    const startingCredits = document.createElement("input");
    startingCredits.type = "number";
    startingCredits.min = "0";
    startingCredits.step = "0.1";
    startingCredits.value = resolveStartingCredits(state2.character);
    startingCredits.placeholder = "750";
    startingCredits.addEventListener("input", (event) => onChange((draft) => {
      draft.details.startingCredits = event.target.value;
      draft.details.currentCredits = String(calculateCurrentCredits(draft));
    }));
    moneyGrid.append(field("Starting Credits (\u20A1)", startingCredits, "Defaults from traits: 750 normal, 1125 with Moneyed Individual, 375 with Dead Broke. You can override it."));
    const currentCredits = document.createElement("input");
    currentCredits.type = "number";
    currentCredits.step = "0.1";
    currentCredits.value = String(calculateCurrentCredits(state2.character));
    currentCredits.placeholder = "Current \u20A1 on hand";
    currentCredits.readOnly = true;
    moneyGrid.append(field("Current Credits (\u20A1)", currentCredits, "Read-only. This is Starting Credits minus catalog purchases."));
    const platinum = document.createElement("input");
    platinum.type = "number";
    platinum.min = "0";
    platinum.step = "0.1";
    platinum.value = state2.character.details.platinum || "";
    platinum.placeholder = "Optional Rim coin";
    platinum.addEventListener("input", (event) => onChange((draft) => {
      draft.details.platinum = event.target.value;
    }));
    moneyGrid.append(field("Platinum Pieces (p)", platinum, "Optional. Useful for Rim cash, tips, and ugly little side deals."));
    const moneyNotes = document.createElement("textarea");
    moneyNotes.value = state2.character.details.moneyNotes || "";
    moneyNotes.placeholder = "Company scrip, debt, wages due, hidden stash, or similar.";
    moneyNotes.addEventListener("input", (event) => onChange((draft) => {
      draft.details.moneyNotes = event.target.value;
    }));
    moneyGrid.append(field("Money Notes", moneyNotes, "Debt, wages, payroll share, hush money, church donation, whatever applies."));
    moneyBlock.append(moneyGrid);
    const shoppingBlock = el("div", { cls: "field-card" });
    shoppingBlock.append(el("h3", { text: "Equipment Catalog" }));
    const pickerRow = el("div", { cls: "equipment-picker-row" });
    const itemSelect = document.createElement("select");
    const blankOption = document.createElement("option");
    blankOption.value = "";
    blankOption.textContent = "Choose catalog gear";
    itemSelect.append(blankOption);
    EQUIPMENT_GROUPS.forEach((group) => {
      if (!group.items.length) return;
      const optgroup = document.createElement("optgroup");
      optgroup.label = group.category;
      group.items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.textContent = `${item.name} (${formatEquipmentPrice(item)})`;
        option.title = item.stats ? `${item.summary} ${item.stats}` : item.summary;
        optgroup.append(option);
      });
      itemSelect.append(optgroup);
    });
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.textContent = "Add to Gear";
    addButton.disabled = true;
    const { panel: selectionPanel, sync: syncSelectionInfo } = createSelectionInfoPanel();
    itemSelect.addEventListener("change", () => {
      const selectedItem = getEquipmentItemById(itemSelect.value);
      addButton.disabled = !selectedItem;
      syncSelectionInfo(selectedItem);
    });
    addButton.addEventListener("click", () => {
      const selectedItem = getEquipmentItemById(itemSelect.value);
      if (!selectedItem) return;
      onChange((draft) => {
        draft.details.purchasedGear = [...draft.details.purchasedGear || [], createPurchasedGearEntry(selectedItem)];
        draft.details.currentCredits = String(calculateCurrentCredits(draft));
      });
    });
    syncSelectionInfo(null);
    pickerRow.append(itemSelect, addButton);
    shoppingBlock.append(pickerRow, selectionPanel, buildPurchasedGearList(state2, onChange));
    const gearBlock = el("div", { cls: "field-card" });
    gearBlock.append(el("h3", { text: "Additional Gear & Notes" }));
    const gear2 = document.createElement("textarea");
    gear2.value = state2.character.details.gear || "";
    gear2.addEventListener("input", (event) => onChange((draft) => {
      draft.details.gear = event.target.value;
    }));
    gearBlock.append(field("Additional Personal Gear", gear2, "Anything not yet in the catalog, plus freebies, crew-issued gear, and GM-approved oddities."));
    const notes = document.createElement("textarea");
    notes.value = state2.character.details.notes || "";
    notes.addEventListener("input", (event) => onChange((draft) => {
      draft.details.notes = event.target.value;
    }));
    gearBlock.append(field("Extra Notes", notes, "Hooks for the GM, personal reminders, ship duty, debts, enemies."));
    root.append(moneyBlock, shoppingBlock, gearBlock);
    return root;
  }

  // assets/js/steps/step_review.js
  function resolveTraitRank2(meta, rating = "none") {
    if (!meta) return "";
    if (meta.rankByRating?.[rating]) return meta.rankByRating[rating];
    return meta.rank || "";
  }
  function summarizeSkills(character) {
    const entries = Object.entries(character.skills).map(([name, skill]) => {
      const specialties = (skill.specialties || []).filter((item) => item.rating !== "none" && getSpecialtyDisplayName(item)).map((item) => `${getSpecialtyDisplayName(item)} ${item.rating}`);
      return { name, rating: effectiveGeneralRating(character, name), specialties };
    }).filter((item) => item.rating !== "none" || item.specialties.length).sort((a, b) => ["none", "d2", "d4", "d6"].indexOf(b.rating) - ["none", "d2", "d4", "d6"].indexOf(a.rating));
    if (!entries.length) return el("p", { cls: "muted", text: "No skills bought yet." });
    return el("ul", { cls: "summary-list" }, entries.map((item) => {
      const skillText = item.rating === "none" ? item.name : `${item.name} ${item.rating}`;
      const specialtyText = item.specialties.length ? ` | Specialties: ${item.specialties.join(", ")}` : "";
      return el("li", { text: `${skillText}${specialtyText}` });
    }));
  }
  function summarizePurchasedGear(character) {
    const entries = character.details.purchasedGear || [];
    if (!entries.length) return el("p", { cls: "muted", text: "No catalog gear purchased." });
    return el("ul", { cls: "summary-list" }, entries.map(
      (entry) => el("li", { text: `${entry.name} (${entry.price || formatEquipmentPrice(entry)}, ${entry.availability}${entry.source ? `, ${entry.source}` : ""})` })
    ));
  }
  function summarizeTraits(character, category) {
    const entries = (category === "asset" ? character.traits.assets : character.traits.complications).filter((item) => item.name && item.rating !== "none");
    if (!entries.length) {
      return el("p", { cls: "muted", text: category === "asset" ? "No assets selected yet." : "No complications selected yet." });
    }
    return el("ul", { cls: "summary-list" }, entries.map((entry) => {
      const meta = findCuratedTrait(category, entry.name);
      const displayName = meta?.name || entry.name;
      const resolvedRank = resolveTraitRank2(meta, entry.rating);
      const heading = resolvedRank ? `${displayName} (${resolvedRank})` : `${displayName} ${entry.rating}`;
      const benefit = meta?.benefits?.[entry.rating] || "";
      const detail = [meta?.summary, meta?.description, benefit, meta?.gmApproval ? "GM approval required." : "", meta?.note, entry.notes].filter(Boolean);
      if (meta?.plotPointTable?.length) {
        return el("li", {}, [
          el("strong", { text: heading }),
          ...detail.map((line) => el("p", { cls: "sheet-copy", text: line })),
          el("ul", { cls: "summary-list trait-nested-list" }, meta.plotPointTable.map(
            (row) => el("li", { text: `${row.cost}: ${row.result}` })
          ))
        ]);
      }
      return el("li", { text: detail.length ? `${heading} - ${detail.join(" ")}` : heading });
    }));
  }
  function renderReviewStep(state2) {
    const root = el("div");
    root.append(sectionHeader("Step 8: Review", "Look over the character as a whole before you open the finished play sheet. This is where you catch holes in the story as well as holes in the math."));
    root.append(el("div", { cls: "summary-card guide-card" }, [
      el("h3", { text: "Questions worth asking" }),
      el("ul", { cls: "summary-list" }, [
        el("li", { text: "Does this person actually fit the role they claim aboard ship?" }),
        el("li", { text: "Do the Assets and Complications feel like the same person?" }),
        el("li", { text: "Would you know how to play them in the first five minutes of a session?" })
      ])
    ]));
    const grid = el("div", { cls: "grid-2" });
    grid.append(
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Identity" }),
        el("p", { html: `<strong>Name:</strong> ${state2.character.basics.name || "-"}` }),
        el("p", { html: `<strong>Concept:</strong> ${state2.character.basics.concept || "-"}` }),
        state2.character.basics.quote ? el("p", { html: `<strong>Quote:</strong> ${state2.character.basics.quote}` }) : null,
        el("p", { html: `<strong>Role:</strong> ${resolveRoleLabel(state2.character.basics)}` }),
        el("p", { html: `<strong>Role Skill:</strong> ${state2.character.basics.roleSkill || "-"}` }),
        el("p", { html: `<strong>Homeworld:</strong> ${state2.character.basics.homeworld || "-"}` })
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Crew Hooks" }),
        el("p", { html: `<strong>Why the crew keeps them:</strong> ${state2.character.basics.crewValue || "-"}` }),
        el("p", { html: `<strong>Connection:</strong> ${state2.character.basics.crewConnection || "-"}` }),
        el("p", { html: `<strong>What they want:</strong> ${state2.character.basics.crewMotivation || "-"}` })
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Skills & Specialties" }),
        summarizeSkills(state2.character)
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Traits" }),
        el("p", { html: "<strong>Assets:</strong>" }),
        summarizeTraits(state2.character, "asset"),
        el("p", { html: "<strong>Complications:</strong>" }),
        summarizeTraits(state2.character, "complication")
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Gear & Money" }),
        el("p", { html: `<strong>Starting Credits:</strong> ${formatMoney(resolveStartingCredits(state2.character), "\u20A1")}` }),
        el("p", { html: `<strong>Current Credits:</strong> ${formatMoney(calculateCurrentCredits(state2.character), "\u20A1")}` }),
        el("p", { html: `<strong>Catalog Gear Total:</strong> ${formatMoney(getPurchasedGearTotal(state2.character.details), "\u20A1", "0 \u20A1")}` }),
        el("p", { html: `<strong>Platinum Pieces:</strong> ${formatMoney(state2.character.details.platinum, "p")}` }),
        el("p", { html: `<strong>Money Notes:</strong> ${state2.character.details.moneyNotes || "-"}` }),
        summarizePurchasedGear(state2.character),
        el("p", { html: `<strong>Additional Personal Gear:</strong> ${state2.character.details.gear || "-"}` }),
        el("p", { html: `<strong>Extra Notes:</strong> ${state2.character.details.notes || "-"}` })
      ]),
      el("div", { cls: `validation-box${state2.computed.valid ? " ok" : ""}` }, [
        el("h3", { text: state2.computed.valid ? "Build looks legal." : "Build still needs fixing." }),
        state2.computed.valid ? el("p", { text: "If the story feels right too, open the play sheet." }) : el("ul", { cls: "summary-list" }, state2.computed.errors.map((error) => el("li", { text: error })))
      ])
    );
    root.append(grid);
    return root;
  }

  // assets/js/steps/step_sheet.js
  var damageDrawerOpen = false;
  function textOrFallback(value, fallback = "-") {
    const text = String(value ?? "").trim();
    return text || fallback;
  }
  function clampTrackerValue(value, max) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, Math.min(max, parsed));
  }
  function renderCopyBlock(label, value, fallback = "-") {
    return el("div", { cls: "sheet-copy-block" }, [
      el("span", { cls: "sheet-copy-label", text: label }),
      el("p", { cls: "sheet-copy", text: textOrFallback(value, fallback) })
    ]);
  }
  function renderMetaRow(label, value, options = {}) {
    return el("div", { cls: "sheet-meta-row" }, [
      el("span", { cls: "sheet-meta-label", text: label }),
      el("strong", { cls: "sheet-meta-value", text: textOrFallback(value, options.fallback || "-") }),
      options.note ? el("small", { cls: "muted", text: options.note }) : null
    ]);
  }
  function renderMoneyBlock(character) {
    const { details } = character;
    return el("div", { cls: "sheet-block" }, [
      el("h3", { text: "Money" }),
      el("div", { cls: "sheet-meta-list" }, [
        renderMetaRow("Current Credits", formatMoney(calculateCurrentCredits(character), "\u20A1")),
        renderMetaRow("Catalog Gear Total", formatMoney(getPurchasedGearTotal(details), "\u20A1", `0 \u20A1`)),
        renderMetaRow("Platinum Pieces", formatMoney(details.platinum, "p"))
      ]),
      renderCopyBlock("Money Notes", details.moneyNotes)
    ]);
  }
  function renderPurchasedGear(details) {
    const entries = details.purchasedGear || [];
    if (!entries.length) return el("p", { cls: "muted", text: "No catalog gear purchased." });
    return el("ul", { cls: "summary-list" }, entries.map(
      (entry) => el("li", { text: `${entry.name} (${entry.price || formatEquipmentPrice(entry)}, ${entry.availability}${entry.source ? `, ${entry.source}` : ""})` })
    ));
  }
  function resolveTraitRank3(meta, rating = "none") {
    if (!meta) return "";
    if (meta.rankByRating?.[rating]) return meta.rankByRating[rating];
    return meta.rank || "";
  }
  function renderTraits(list, category) {
    const filtered = list.filter((item) => item.name && item.rating !== "none");
    if (!filtered.length) return el("p", { cls: "muted", text: "None selected." });
    return el("ul", { cls: "summary-list" }, filtered.map((trait) => {
      const meta = findCuratedTrait(category, trait.name);
      const displayName = meta?.name || trait.name;
      const resolvedRank = resolveTraitRank3(meta, trait.rating);
      const heading = resolvedRank ? `${displayName} (${resolvedRank})` : `${displayName} ${trait.rating}`;
      const benefit = meta?.benefits?.[trait.rating] || "";
      const detail = [meta?.summary, meta?.description, benefit, meta?.gmApproval ? "GM approval required." : "", meta?.note, trait.notes].filter(Boolean);
      if (meta?.plotPointTable?.length || detail.length > 1) {
        return el("li", {}, [
          el("strong", { text: heading }),
          ...detail.map((line) => el("p", { cls: "sheet-copy", text: line })),
          meta?.plotPointTable?.length ? el("ul", { cls: "summary-list trait-nested-list" }, meta.plotPointTable.map(
            (row) => el("li", { text: `${row.cost}: ${row.result}` })
          )) : null
        ]);
      }
      return el("li", { text: detail.length ? `${heading} - ${detail.join(" ")}` : heading });
    }));
  }
  function renderSkills(character) {
    const table = el("table", { cls: "skill-table" });
    const thead = el("thead");
    thead.append(el("tr", {}, [
      el("th", { text: "Skill" }),
      el("th", { text: "General" }),
      el("th", { text: "Specialties" })
    ]));
    const tbody = el("tbody");
    Object.entries(character.skills).forEach(([skillName, skill]) => {
      const specs = (skill.specialties || []).filter((item) => item.rating !== "none" && getSpecialtyDisplayName(item)).map((item) => `${getSpecialtyDisplayName(item)} ${item.rating}`).join(", ");
      const effectiveGeneral = effectiveGeneralRating(character, skillName);
      if (effectiveGeneral === "none" && !specs) return;
      tbody.append(el("tr", {}, [
        el("td", { text: skillName }),
        el("td", { text: effectiveGeneral }),
        el("td", { text: specs || "-" })
      ]));
    });
    table.append(thead, tbody);
    return table;
  }
  function buildAttributeRollRows(character) {
    const a = character.attributes;
    const pairDice = (left, right) => isAssignedAttributeDie(left) && isAssignedAttributeDie(right) ? `${left} + ${right}` : "-";
    return [
      { name: "Burst of Strength", dice: pairDice(a.Strength, a.Strength) },
      { name: "Endurance", dice: pairDice(a.Vitality, a.Willpower) },
      { name: "Get Out of Harm's Way", dice: pairDice(a.Agility, a.Alertness) },
      { name: "Long Haul", dice: pairDice(a.Strength, a.Vitality) },
      { name: "Memorize", dice: pairDice(a.Intelligence, a.Alertness) },
      { name: "Recall", dice: pairDice(a.Intelligence, a.Willpower) },
      { name: "Resistance", dice: pairDice(a.Vitality, a.Vitality) }
    ];
  }
  function renderDerivedRolls(state2) {
    const rows = [
      { label: "Life Points", value: String(state2.computed.lifePoints) },
      { label: "Initiative", value: state2.computed.initiative },
      ...buildAttributeRollRows(state2.character).map((row) => ({ label: row.name, value: row.dice }))
    ];
    return el("div", { cls: "derived-roll-list" }, rows.map(
      (row) => el("div", { cls: "derived-roll-row" }, [
        el("span", { cls: "derived-roll-label", text: row.label }),
        el("strong", { cls: "derived-roll-value", text: row.value })
      ])
    ));
  }
  function readPortraitAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
          return;
        }
        reject(new Error("Portrait file could not be read as text."));
      });
      reader.addEventListener("error", () => reject(reader.error || new Error("Portrait file could not be read.")));
      reader.readAsDataURL(file);
    });
  }
  function renderPortraitPanel(state2, mutateCharacter2) {
    const portraitDataUrl = textOrFallback(state2.character.basics.portraitDataUrl, "");
    const fileInput = el("input", {
      cls: "hidden",
      attrs: {
        type: "file",
        accept: "image/png,image/jpeg,image/webp,image/gif"
      }
    });
    fileInput.addEventListener("change", async (event) => {
      const file = event.target.files?.[0];
      if (!file || !file.type.startsWith("image/")) {
        event.target.value = "";
        return;
      }
      try {
        const dataUrl = await readPortraitAsDataUrl(file);
        mutateCharacter2((draft) => {
          draft.basics.portraitDataUrl = dataUrl;
        });
      } catch (error) {
        console.error(error);
      } finally {
        event.target.value = "";
      }
    });
    const chooseButton = el("button", {
      text: portraitDataUrl ? "Choose New Image" : "Choose Image",
      attrs: { type: "button" }
    });
    chooseButton.addEventListener("click", () => fileInput.click());
    const clearButton = el("button", {
      text: "Clear Image",
      attrs: { type: "button" }
    });
    clearButton.addEventListener("click", () => mutateCharacter2((draft) => {
      draft.basics.portraitDataUrl = "";
    }));
    return el("section", { cls: "sheet-block portrait-panel" }, [
      el("h3", { text: "Portrait" }),
      fileInput,
      el(
        "div",
        { cls: "portrait-frame" },
        portraitDataUrl ? el("img", {
          cls: "portrait-image",
          attrs: {
            src: portraitDataUrl,
            alt: `${state2.character.basics.name || "Character"} portrait`
          }
        }) : el("div", { cls: "portrait-placeholder" }, [
          el("strong", { text: state2.character.basics.name || "No Portrait Yet" }),
          el("span", { text: "Choose an image to place it on the play sheet." })
        ])
      ),
      el("div", { cls: "portrait-controls no-print" }, [
        chooseButton,
        portraitDataUrl ? clearButton : null
      ])
    ]);
  }
  function resolveDamageMax(state2) {
    const lifePoints2 = Number.parseInt(state2.computed.lifePoints, 10);
    const currentStun = Number.parseInt(state2.character.trackers?.stun ?? 0, 10);
    const currentWounds = Number.parseInt(state2.character.trackers?.wounds ?? 0, 10);
    if (Number.isNaN(lifePoints2)) {
      return Math.max(1, currentStun || 0, currentWounds || 0);
    }
    return Math.max(1, lifePoints2);
  }
  function setDamageValue(mutateCharacter2, key, nextValue, max) {
    mutateCharacter2((draft) => {
      draft.trackers[key] = clampTrackerValue(nextValue, max);
    });
  }
  function createDamageBubble(kind, bubbleValue, filled, mutateCharacter2, current, max) {
    const button = el("button", {
      cls: `damage-bubble ${kind}${filled ? " filled" : ""}`,
      attrs: {
        type: "button",
        title: `${kind === "stun" ? "Stun" : "Wounds"} ${bubbleValue}`,
        "aria-label": `${kind === "stun" ? "Set Stun to" : "Set Wounds to"} ${bubbleValue}`
      }
    });
    button.addEventListener("click", () => {
      const nextValue = current === bubbleValue ? bubbleValue - 1 : bubbleValue;
      setDamageValue(mutateCharacter2, kind, nextValue, max);
    });
    return button;
  }
  function renderDamageBubbleTrack(label, kind, value, max, mutateCharacter2) {
    const block = el("div", { cls: `damage-bubble-track ${kind}` });
    const header = el("div", { cls: "damage-bubble-track-head" }, [
      el("strong", { text: label }),
      el("span", { cls: "muted", text: `${value} / ${max}` }),
      el("small", { cls: "muted", text: kind === "stun" ? "Top down" : "Bottom up" })
    ]);
    const clear = el("button", {
      cls: "damage-clear-button",
      text: "Clear",
      attrs: { type: "button", "aria-label": `Clear ${label}` }
    });
    clear.addEventListener("click", () => setDamageValue(mutateCharacter2, kind, 0, max));
    header.append(clear);
    const column = el("div", { cls: "damage-bubble-column" });
    for (let visualIndex = 1; visualIndex <= max; visualIndex += 1) {
      const bubbleValue = kind === "stun" ? visualIndex : max - visualIndex + 1;
      const filled = kind === "stun" ? visualIndex <= value : visualIndex > max - value;
      const row = el("div", { cls: "damage-bubble-row" }, [
        createDamageBubble(kind, bubbleValue, filled, mutateCharacter2, value, max),
        el("span", { cls: "damage-bubble-count muted", text: String(bubbleValue) })
      ]);
      column.append(row);
    }
    block.append(header, column);
    return block;
  }
  function renderDamageDrawerTab(stun, wounds, isOpen) {
    return el("button", {
      cls: "damage-drawer-tab",
      attrs: {
        type: "button",
        title: `Damage tracker: Stun ${stun}, Wounds ${wounds}`,
        "aria-expanded": isOpen ? "true" : "false",
        "aria-label": isOpen ? "Hide damage tracker" : "Show damage tracker"
      }
    }, [
      el("span", { cls: "damage-drawer-tab-label", text: "Damage" }),
      el("div", { cls: "damage-drawer-tab-summary", attrs: { "aria-hidden": "true" } }, [
        el("span", { cls: "damage-drawer-tab-pill stun", text: `S ${stun}` }),
        el("span", { cls: "damage-drawer-tab-pill wounds", text: `W ${wounds}` })
      ])
    ]);
  }
  function renderDamageDrawer(state2, mutateCharacter2) {
    const max = resolveDamageMax(state2);
    const stun = clampTrackerValue(state2.character.trackers?.stun ?? 0, max);
    const wounds = clampTrackerValue(state2.character.trackers?.wounds ?? 0, max);
    const total = stun + wounds;
    const outCold = total >= max;
    const lifePointsReady = !Number.isNaN(Number.parseInt(state2.computed.lifePoints, 10));
    const drawer = el("aside", { cls: `damage-drawer no-print${damageDrawerOpen ? " open" : ""}` });
    const tab = renderDamageDrawerTab(stun, wounds, damageDrawerOpen);
    tab.addEventListener("click", () => {
      damageDrawerOpen = !damageDrawerOpen;
      drawer.classList.toggle("open", damageDrawerOpen);
      tab.setAttribute("aria-expanded", damageDrawerOpen ? "true" : "false");
      tab.setAttribute("aria-label", damageDrawerOpen ? "Hide damage tracker" : "Show damage tracker");
    });
    const panel = el("div", { cls: "damage-drawer-panel" }, [
      el("div", { cls: "damage-drawer-head" }, [
        el("h3", { text: "Stun / Wounds" }),
        el("p", { cls: "muted", text: lifePointsReady ? "Stun fills from the top. Wounds fill from the bottom. When they meet, the character is out." : "Life Points are not finalized yet, so the drawer is temporarily sized to current marked damage." })
      ]),
      el("div", { cls: `damage-state${outCold ? " danger" : ""}` }, [
        el("span", { text: "Current Total" }),
        el("strong", { text: `${total} / ${max}` }),
        el("small", { text: outCold ? "Out cold or worse." : "Still upright." })
      ]),
      el("div", { cls: "damage-track-stack" }, [
        renderDamageBubbleTrack("Stun", "stun", stun, max, mutateCharacter2),
        renderDamageBubbleTrack("Wounds", "wounds", wounds, max, mutateCharacter2)
      ])
    ]);
    drawer.append(tab, panel);
    return drawer;
  }
  function setPlotPoints(mutateCharacter2, nextValue) {
    mutateCharacter2((draft) => {
      draft.trackers.plotPoints = clampTrackerValue(nextValue, PLOT_POINT_MAX);
    });
  }
  function createPlotPointBubble(value, current, mutateCharacter2) {
    const button = el("button", {
      cls: `plot-point-bubble${value <= current ? " filled" : ""}`,
      attrs: {
        type: "button",
        title: `Set Plot Points to ${value}`,
        "aria-label": `Set Plot Points to ${value}`
      }
    });
    button.addEventListener("click", () => {
      const nextValue = current === value ? value - 1 : value;
      setPlotPoints(mutateCharacter2, nextValue);
    });
    return button;
  }
  function renderPlotPointTracker(character, mutateCharacter2) {
    const current = clampTrackerValue(character.trackers?.plotPoints ?? 6, PLOT_POINT_MAX);
    const clear = el("button", {
      cls: "damage-clear-button",
      text: "Clear",
      attrs: { type: "button", "aria-label": "Clear plot points" }
    });
    clear.addEventListener("click", () => setPlotPoints(mutateCharacter2, 0));
    return el("div", { cls: "sheet-block" }, [
      el("h3", { text: "Plot Points" }),
      el("div", { cls: "plot-point-wrap" }, [
        el("div", { cls: "plot-point-head" }, [
          el("div", { cls: "sheet-meta-list" }, [
            renderMetaRow("Current Total", `${current} / ${PLOT_POINT_MAX}`),
            el("p", { cls: "muted sheet-copy", text: "Click bubbles to match the current table total." })
          ]),
          clear
        ]),
        el("div", { cls: "plot-point-track" }, Array.from({ length: PLOT_POINT_MAX }, (_, index) => {
          const value = index + 1;
          return el("div", { cls: "plot-point-item" }, [
            createPlotPointBubble(value, current, mutateCharacter2),
            el("span", { cls: "damage-bubble-count muted", text: String(value) })
          ]);
        }))
      ])
    ]);
  }
  function renderSheetStep(state2, mutateCharacter2) {
    const root = el("div");
    const stage = el("div", { cls: "sheet-stage" });
    const sheet = el("div", { cls: "sheet-layout", attrs: { id: "printableSheet" } });
    sheet.append(el("div", { cls: "sheet-top-layout" }, [
      el("div", { cls: "sheet-top-left" }, [
        el("section", { cls: "sheet-hero sheet-identity-panel" }, [
          el("div", { cls: "sheet-hero-copy" }, [
            el("p", { cls: "sheet-kicker", text: "Ready to Play Dossier" }),
            el("h2", { text: state2.character.basics.name || "Unnamed Greenhorn" }),
            el("p", { cls: "sheet-concept", text: textOrFallback(state2.character.basics.concept, "No concept entered yet.") })
          ])
        ]),
        el("section", { cls: "sheet-block sheet-attributes-panel" }, [
          el("h3", { text: "Attributes" }),
          el("div", { cls: "sheet-attr-grid" }, ATTRIBUTE_LIST.map(
            (attribute) => el("div", { cls: "sheet-stat" }, [
              el("span", { text: attribute }),
              el("strong", { text: state2.character.attributes[attribute] })
            ])
          ))
        ])
      ]),
      el("div", { cls: "sheet-top-aside" }, [
        el("section", { cls: "sheet-block sheet-hero-meta sheet-role-panel" }, [
          el("div", { cls: "sheet-meta-list" }, [
            renderMetaRow("Role", resolveRoleLabel(state2.character.basics)),
            renderMetaRow("Role Skill", state2.character.basics.roleSkill, {
              note: state2.character.basics.roleSkill ? "Free +d2 training is already baked into the final General rating." : ""
            }),
            renderMetaRow("Homeworld", state2.character.basics.homeworld),
            renderMetaRow("Heroic Level", state2.character.meta.heroicLevel || "Greenhorn")
          ])
        ]),
        renderPortraitPanel(state2, mutateCharacter2)
      ])
    ]));
    sheet.append(el("section", { cls: "sheet-block" }, [
      el("h3", { text: "Derived Rolls" }),
      renderDerivedRolls(state2)
    ]));
    sheet.append(el("div", { cls: "grid-2 sheet-section-grid" }, [
      el("section", { cls: "sheet-block" }, [el("h3", { text: "Assets" }), renderTraits(state2.character.traits.assets, "asset")]),
      el("section", { cls: "sheet-block" }, [el("h3", { text: "Complications" }), renderTraits(state2.character.traits.complications, "complication")])
    ]));
    sheet.append(el("section", { cls: "sheet-block" }, [
      el("h3", { text: "Skills & Specialties" }),
      renderSkills(state2.character)
    ]));
    sheet.append(el("div", { cls: "grid-2 sheet-section-grid" }, [
      renderMoneyBlock(state2.character),
      renderPlotPointTracker(state2.character, mutateCharacter2)
    ]));
    sheet.append(el("div", { cls: "grid-2 sheet-section-grid" }, [
      el("section", { cls: "sheet-block" }, [
        el("h3", { text: "Gear" }),
        el("p", { html: "<strong>Purchased Gear:</strong>" }),
        renderPurchasedGear(state2.character.details),
        renderCopyBlock("Additional Gear", state2.character.details.gear)
      ]),
      el("section", { cls: "sheet-block" }, [
        el("h3", { text: "Notes" }),
        renderCopyBlock("Character Notes", state2.character.details.notes)
      ])
    ]));
    stage.append(sheet, renderDamageDrawer(state2, mutateCharacter2));
    root.append(stage);
    return root;
  }

  // assets/js/app.js
  var steps = [
    { id: "welcome", label: "1. Welcome", render: renderWelcomeStep },
    { id: "role", label: "2. Crew Role", render: renderRoleStep },
    { id: "background", label: "3. Background", render: renderBackgroundStep },
    { id: "attributes", label: "4. Attributes", render: renderAttributesStep },
    { id: "traits", label: "5. Traits", render: renderTraitsStep },
    { id: "skills", label: "6. Skills", render: renderSkillsStep },
    { id: "details", label: "7. Gear & Money", render: renderDetailsStep },
    { id: "review", label: "8. Review", render: renderReviewStep },
    { id: "sheet", label: "9. Play Sheet", render: renderSheetStep }
  ];
  var state = {
    stepIndex: 0,
    character: hydrateCharacter(loadState())
  };
  var els = {
    appShell: document.querySelector(".app-shell"),
    stepNav: document.getElementById("stepNav"),
    stepContent: document.getElementById("stepContent"),
    attributePointsRemaining: document.getElementById("attributePointsRemaining"),
    traitPointsRemaining: document.getElementById("traitPointsRemaining"),
    skillPointsRemaining: document.getElementById("skillPointsRemaining"),
    lifePointsValue: document.getElementById("lifePointsValue"),
    initiativeValue: document.getElementById("initiativeValue"),
    backBtn: document.getElementById("backBtn"),
    nextBtn: document.getElementById("nextBtn"),
    saveBtn: document.getElementById("saveBtn"),
    exportBtn: document.getElementById("exportBtn"),
    sendToGMBtn: document.getElementById("sendToGMBtn"),
    copyGMCodeBtn: document.getElementById("copyGMCodeBtn"),
    importInput: document.getElementById("importInput"),
    resetBtn: document.getElementById("resetBtn"),
    printBtn: document.getElementById("printBtn"),
    messageBar: document.getElementById("messageBar")
  };
  [
    els.attributePointsRemaining,
    els.traitPointsRemaining,
    els.skillPointsRemaining
  ].forEach((node) => node.parentElement.classList.add("build-counter-card"));
  function captureInputFocus(root) {
    const active = document.activeElement;
    if (!active || !root.contains(active)) return null;
    if (!["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return null;
    const path = [];
    let node = active;
    while (node && node !== root) {
      const parent = node.parentElement;
      if (!parent) return null;
      path.unshift(Array.from(parent.children).indexOf(node));
      node = parent;
    }
    if (node !== root) return null;
    const snapshot = {
      path,
      tagName: active.tagName,
      value: active.value
    };
    if (typeof active.selectionStart === "number" && typeof active.selectionEnd === "number") {
      snapshot.selectionStart = active.selectionStart;
      snapshot.selectionEnd = active.selectionEnd;
      snapshot.selectionDirection = active.selectionDirection || "none";
    }
    if (typeof active.scrollTop === "number") {
      snapshot.scrollTop = active.scrollTop;
    }
    return snapshot;
  }
  function restoreInputFocus(root, snapshot) {
    if (!snapshot) return;
    let node = root;
    for (const index of snapshot.path) {
      node = node?.children?.[index];
      if (!node) return;
    }
    if (!node || node.tagName !== snapshot.tagName) return;
    if ("value" in node && node.value !== snapshot.value) return;
    node.focus({ preventScroll: true });
    if (typeof snapshot.scrollTop === "number" && typeof node.scrollTop === "number") {
      node.scrollTop = snapshot.scrollTop;
    }
    if (typeof node.setSelectionRange === "function" && typeof snapshot.selectionStart === "number" && typeof snapshot.selectionEnd === "number") {
      node.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd, snapshot.selectionDirection);
    }
  }
  function attributeStepIsValid(computed) {
    return computed.budgets.attributes === 0 && !computed.errors.some(
      (error) => error.startsWith("Assign all Attributes before the build can be finished.") || error.startsWith("Attribute Points must spend exactly")
    );
  }
  function blockInvalidAttributeAdvance() {
    setMessage(els.messageBar, "Finish Step 4 first: assign all six Attributes and spend exactly 42 points before moving on.", "warn");
  }
  function compute() {
    const validation = validateCharacter(state.character);
    return {
      ...validation,
      budgets: remainingBudgets(state.character),
      lifePoints: lifePoints(state.character),
      initiative: initiative(state.character)
    };
  }
  function updateStatus(computed) {
    els.attributePointsRemaining.textContent = computed.budgets.attributes;
    els.traitPointsRemaining.textContent = computed.budgets.traits;
    els.skillPointsRemaining.textContent = computed.budgets.skills;
    els.lifePointsValue.textContent = computed.lifePoints;
    els.initiativeValue.textContent = computed.initiative;
    for (const [key, value, node] of [
      ["attributes", computed.budgets.attributes, els.attributePointsRemaining],
      ["traits", computed.budgets.traits, els.traitPointsRemaining],
      ["skills", computed.budgets.skills, els.skillPointsRemaining]
    ]) {
      node.parentElement.style.borderColor = value < 0 || key === "attributes" && value !== 0 ? "var(--danger)" : "var(--line)";
    }
  }
  function renderNav(computed) {
    els.stepNav.innerHTML = "";
    steps.forEach((step, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = step.label;
      if (index === state.stepIndex) button.classList.add("active");
      if (step.id === "sheet" && !computed.valid) button.classList.add("invalid");
      button.addEventListener("click", () => {
        if (steps[state.stepIndex].id === "attributes" && index > state.stepIndex && !attributeStepIsValid(computed)) {
          blockInvalidAttributeAdvance();
          return;
        }
        state.stepIndex = index;
        render();
      });
      els.stepNav.append(button);
    });
  }
  function mutateCharacter(mutator) {
    const draft = structuredClone(state.character);
    mutator(draft);
    draft.meta.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
    state.character = draft;
    saveState(state.character);
    render({ preserveFocus: true });
  }
  function ensureTrackedCharacter() {
    const tracked = ensureCharacterIdentity(state.character);
    if (tracked.meta.characterId !== state.character.meta?.characterId) {
      tracked.meta.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
      state.character = tracked;
      saveState(state.character);
    }
    return tracked;
  }
  async function copyTextWithFallback(value) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const helper = document.createElement("textarea");
    helper.value = value;
    helper.setAttribute("readonly", "readonly");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    helper.style.pointerEvents = "none";
    document.body.append(helper);
    helper.select();
    helper.setSelectionRange(0, helper.value.length);
    let copied = false;
    try {
      copied = document.execCommand("copy");
    } finally {
      helper.remove();
    }
    return copied;
  }
  async function handleCopyGMCode() {
    const tracked = ensureTrackedCharacter();
    const handoffCode = encodeCharacterHandoffCode(tracked);
    try {
      const copied = await copyTextWithFallback(handoffCode);
      if (!copied) throw new Error("copy command was not accepted");
      setMessage(els.messageBar, "GM handoff code copied. If the GM is on another device or there is no network, paste it into GM Amanuensis.", "ok");
    } catch (error) {
      window.prompt("Copy this Serenity GM handoff code for the GM:", handoffCode);
      setMessage(els.messageBar, "Clipboard access was blocked, so the handoff code was opened for manual copy.", "warn");
    }
  }
  function handleSendToGM() {
    const tracked = ensureTrackedCharacter();
    const handoff = queueCharacterForGM(tracked);
    setMessage(
      els.messageBar,
      `${handoff.summary.name} is queued for GM Amanuensis. If the GM app is open in this browser, it will import automatically. Use "Copy GM Handoff Code" for another device or an offline table.`,
      "ok"
    );
  }
  function renderStep(computed) {
    els.stepContent.innerHTML = "";
    const current = steps[state.stepIndex];
    const stepState = { character: state.character, computed, heroicLevel: HEROIC_LEVEL };
    const node = current.render(stepState, mutateCharacter);
    els.stepContent.append(node);
  }
  function render(options = {}) {
    const focusSnapshot = options.preserveFocus ? captureInputFocus(els.stepContent) : null;
    const computed = compute();
    updateStatus(computed);
    renderNav(computed);
    renderStep(computed);
    restoreInputFocus(els.stepContent, focusSnapshot);
    const current = steps[state.stepIndex];
    const isPlaySheetMode = current.id === "sheet";
    els.appShell.classList.toggle("play-sheet-mode", isPlaySheetMode);
    els.backBtn.disabled = state.stepIndex === 0;
    if (current.id === "review") {
      els.nextBtn.textContent = "Open Play Sheet";
    } else if (current.id === "sheet") {
      els.nextBtn.textContent = "Export Character JSON";
    } else {
      els.nextBtn.textContent = "Next";
    }
    els.nextBtn.disabled = current.id === "sheet" ? false : state.stepIndex === steps.length - 1;
    els.printBtn.style.visibility = current.id === "sheet" ? "visible" : "hidden";
    if (current.id === "sheet") {
      setMessage(els.messageBar, "");
    } else if (current.id === "review") {
      setMessage(els.messageBar, computed.valid ? "Math looks good. Review the story pieces, then open the play sheet." : "The review step is showing you what still needs fixing before the sheet is fully ready.", computed.valid ? "ok" : "warn");
    } else {
      setMessage(els.messageBar, "");
    }
  }
  els.backBtn.addEventListener("click", () => {
    if (state.stepIndex > 0) {
      state.stepIndex -= 1;
      render();
    }
  });
  els.nextBtn.addEventListener("click", () => {
    if (steps[state.stepIndex].id === "sheet") {
      exportState(state.character);
      return;
    }
    if (state.stepIndex < steps.length - 1) {
      const computed = compute();
      if (steps[state.stepIndex].id === "attributes" && !attributeStepIsValid(computed)) {
        blockInvalidAttributeAdvance();
        return;
      }
      state.stepIndex += 1;
      render();
    }
  });
  els.saveBtn.addEventListener("click", () => {
    saveState(state.character);
    setMessage(els.messageBar, "Character saved locally in this browser.", "ok");
  });
  els.exportBtn.addEventListener("click", () => exportState(state.character));
  els.sendToGMBtn.addEventListener("click", handleSendToGM);
  els.copyGMCodeBtn.addEventListener("click", handleCopyGMCode);
  els.importInput.addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const raw = await file.text();
      const parsed = JSON.parse(raw);
      state.character = hydrateCharacter(parsed);
      state.stepIndex = 0;
      saveState(state.character);
      render();
      setMessage(els.messageBar, "Character loaded from JSON.", "ok");
    } catch (error) {
      setMessage(els.messageBar, "Could not load that JSON file. Check the file format and try again.", "warn");
    } finally {
      event.target.value = "";
    }
  });
  els.resetBtn.addEventListener("click", () => {
    if (!confirm("Start a new character and wipe the current local saved character?")) return;
    clearState();
    state.character = hydrateCharacter(null);
    state.stepIndex = 0;
    render();
    setMessage(els.messageBar, "Started a new character. Save or export when this handoff is ready.", "ok");
  });
  els.printBtn.addEventListener("click", () => {
    if (state.stepIndex !== steps.length - 1) state.stepIndex = steps.length - 1;
    render();
    window.print();
  });
  function initSplashScreen() {
    const splash = document.getElementById("splashScreen");
    if (!splash) return;
    const splashVideo = splash.querySelector("[data-splash-video]");
    document.body.classList.add("splash-active");
    if (splashVideo) {
      try {
        const playAttempt = splashVideo.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(() => {
          });
        }
      } catch (error) {
      }
    }
    window.setTimeout(() => {
      if (splashVideo) splashVideo.pause();
      splash.classList.add("is-hiding");
      document.body.classList.remove("splash-active");
      window.setTimeout(() => {
        if (typeof splash.remove === "function") splash.remove();
        else if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 850);
    }, 8e3);
  }
  render();
  initSplashScreen();
})();
