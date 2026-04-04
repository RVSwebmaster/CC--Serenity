(() => {
  // assets/js/handoff.js
  var GM_HANDOFF_QUEUE_KEY = "serenity_suite_gm_handoff_queue";
  var GM_HANDOFF_PREFIX = "SERENITY-HANDOFF:";
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
  function decodeBase64(value) {
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }
  function consumeQueuedGMHandshakes() {
    const queue = safeParseQueue();
    localStorage.removeItem(GM_HANDOFF_QUEUE_KEY);
    return queue.filter((entry) => entry && typeof entry === "object" && entry.payload);
  }
  function decodeCharacterHandoffCode(rawValue) {
    const value = String(rawValue || "").trim();
    if (!value.startsWith(GM_HANDOFF_PREFIX)) {
      throw new Error("That handoff code is not a Serenity GM handoff.");
    }
    const encoded = value.slice(GM_HANDOFF_PREFIX.length);
    const decoded = decodeBase64(encoded);
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object" || !parsed.payload) {
      throw new Error("The handoff code did not contain a valid character payload.");
    }
    return parsed;
  }
  function getGMHandoffQueueKey() {
    return GM_HANDOFF_QUEUE_KEY;
  }

  // assets/js/data/defaults.js
  var HEROIC_LEVEL = {
    name: "Greenhorn",
    attributePoints: 42,
    traitPoints: 0,
    skillPoints: 62,
    maxAttribute: "d12",
    maxSkill: "d12"
  };
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
  function makeId2() {
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
  function normalizePurchasedGearEntry(entry = {}) {
    const catalogMatch = getEquipmentItemById(entry.catalogId || "");
    return {
      id: entry.id || makeId2(),
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

  // gm_amanuensis/assets/js/crew_import.js
  function trimByteOrderMark(raw) {
    return typeof raw === "string" ? raw.replace(/^\uFEFF/, "") : raw;
  }
  function createStageError(stage, message, cause = null) {
    const error = new Error(message);
    error.stage = stage;
    if (cause) error.cause = cause;
    return error;
  }
  function validateImportedPayload(payload) {
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw createStageError("validation", "root JSON must be an object");
    }
    let character;
    try {
      character = hydrateCharacter(payload);
    } catch (error) {
      throw createStageError("hydration", "could not be hydrated as a Serenity export", error);
    }
    const hasIdentity = [
      character.basics?.name,
      character.basics?.concept,
      character.basics?.role
    ].some((value) => typeof value === "string" && value.trim());
    const hasAssignedAttributes = Object.values(character.attributes || {}).some((value) => value && value !== "-");
    if (!hasIdentity && !hasAssignedAttributes) {
      throw createStageError("validation", "does not look like a Serenity character export");
    }
    return payload;
  }
  function formatImportError(error) {
    const stage = typeof error?.stage === "string" ? error.stage : "import";
    const message = error instanceof Error ? error.message : "could not be imported";
    switch (stage) {
      case "read":
        return `file could not be read: ${message}`;
      case "parse":
        return `JSON parsing failed: ${message}`;
      case "hydration":
        return `Serenity hydration failed: ${message}`;
      case "validation":
        return `export validation failed: ${message}`;
      default:
        return message;
    }
  }
  async function importCrewFiles(fileList) {
    const imported = [];
    const rejected = [];
    for (const file of Array.from(fileList || [])) {
      try {
        let raw;
        try {
          raw = trimByteOrderMark(await file.text());
        } catch (error) {
          throw createStageError("read", "browser could not read the selected file", error);
        }
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (error) {
          throw createStageError("parse", error instanceof Error ? error.message : "invalid JSON", error);
        }
        const payload = validateImportedPayload(parsed);
        imported.push({
          payload,
          sourceName: file.name
        });
      } catch (error) {
        rejected.push({
          sourceName: file.name,
          message: formatImportError(error)
        });
      }
    }
    return { imported, rejected };
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

  // assets/js/rules.js
  var GENERAL_SKILL_STEPS = ["none", "d2", "d4", "d6"];
  var ASSIGNED_ATTRIBUTE_VALUES = ["d2", "d4", "d6", "d8", "d10", "d12"];
  function dieCost(die) {
    return DIE_COSTS[die] ?? 0;
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
  function lifePoints(character) {
    if (!isAssignedAttributeDie(character.attributes.Vitality) || !isAssignedAttributeDie(character.attributes.Willpower)) {
      return "-";
    }
    return dieCost(character.attributes.Vitality) + dieCost(character.attributes.Willpower);
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

  // gm_amanuensis/assets/js/condition_tracking.js
  var ACTION_STATES = ["Ready", "Acted", "Down"];
  function normalizeNumber(value, fallback = 0) {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  }
  function normalizeInitiativeValue(value) {
    if (value === null || value === void 0 || value === "") return "";
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? String(parsed) : "";
  }
  function createConditionState(trackers = {}, options = {}) {
    return {
      stun: normalizeNumber(trackers?.stun, 0),
      wounds: normalizeNumber(trackers?.wounds, 0),
      actionState: ACTION_STATES[0],
      notes: "",
      initiativeValue: "",
      tieBreakerRoll: null,
      tieBreakerInitiative: null,
      tabColor: options.tabColor || ""
    };
  }
  function sanitizeConditionState(input, fallback = createConditionState()) {
    const initiativeValue = normalizeInitiativeValue(input?.initiativeValue);
    return {
      stun: normalizeNumber(input?.stun, fallback.stun),
      wounds: normalizeNumber(input?.wounds, fallback.wounds),
      actionState: ACTION_STATES.includes(input?.actionState) ? input.actionState : fallback.actionState,
      notes: typeof input?.notes === "string" ? input.notes : fallback.notes,
      initiativeValue,
      tieBreakerRoll: Number.isFinite(Number(input?.tieBreakerRoll)) ? Number(input.tieBreakerRoll) : fallback.tieBreakerRoll,
      tieBreakerInitiative: initiativeValue && Number.isFinite(Number(input?.tieBreakerInitiative)) ? Number(input.tieBreakerInitiative) : fallback.tieBreakerInitiative,
      tabColor: typeof input?.tabColor === "string" ? input.tabColor : fallback.tabColor
    };
  }
  function parseInitiativeValue(value) {
    const normalized = normalizeInitiativeValue(value);
    return normalized === "" ? null : Number(normalized);
  }

  // gm_amanuensis/assets/js/tab_palette.js
  var TAB_COLOR_PALETTE = [
    "#78d0be",
    "#d7a55a",
    "#6fa8dc",
    "#d98fa8",
    "#8ecf74",
    "#c8a4ff",
    "#f08f6b",
    "#7fc3d8"
  ];
  function pickNextTabColor(existingColors = []) {
    const counts = new Map(TAB_COLOR_PALETTE.map((color) => [color, 0]));
    existingColors.forEach((color) => {
      if (counts.has(color)) {
        counts.set(color, counts.get(color) + 1);
      }
    });
    return TAB_COLOR_PALETTE.reduce((bestColor, color) => {
      if (counts.get(color) < counts.get(bestColor)) {
        return color;
      }
      return bestColor;
    }, TAB_COLOR_PALETTE[0]);
  }

  // gm_amanuensis/assets/js/session_state.js
  var DEFAULT_SHIP = Object.freeze({
    name: "Serenity",
    className: "Firefly-class transport",
    concept: "Battered free-trader, reluctant sanctuary, and getaway crate with opinions.",
    editLocked: true,
    specifications: {
      dimensions: "191 x 128 x 53 ft",
      tonnage: "Mid-bulk transport frame",
      speedClass: "4 cruise / 6 hard burn",
      crewQuarters: "24 double cabins",
      fuelCapacity: "60 tons (600 hours)",
      cargoCapacity: "Two 40-ton holds / max deck load as rig allows",
      passengerCapacity: "Variable bunks, common room overflow, and one shuttle cabin",
      gear: "Shuttle, mule, cargo crane, grapples, infirmary corner, machine shop",
      price: "48,960 credits",
      complexity: "Simple",
      maintenanceCost: "3,872 credits / year"
    },
    attributes: {
      agility: "d8",
      strength: "d12",
      vitality: "d10",
      alertness: "d6",
      intelligence: "d4",
      willpower: "d6",
      initiative: "d14",
      life: "18"
    },
    traits: "Atmospheric-capable\nSeen Better Days\nWorkhorse profile\nStubborn to kill",
    skills: "Planetary Operations d6\nMechanical Systems d8\nSensor Sweep d4\nCargo Handling d6",
    condition: {
      hull: "Nominal",
      drive: "Touchy",
      posture: "Running Cold",
      currentDamage: "Patch scars, stress fractures, and one more thing vibrating than ought to be.",
      systemState: "Running, but every subsystem has opinions.",
      currentLife: "18",
      performanceNotes: ""
    },
    notes: "",
    jack: {
      name: "Jack",
      role: "Resident Former Crewman",
      attitude: "Believes the ship is his, tolerates the crew as transport staff.",
      attributes: {
        agility: "d10",
        strength: "d2",
        vitality: "d4",
        alertness: "d8",
        intelligence: "d6",
        willpower: "d8"
      },
      lifePoints: "12",
      initiative: "d10 + d8",
      skills: [
        "Climbing d10",
        "Dodge d10",
        "Stealth d10",
        "Sleight of Hand d8",
        "Hearing d8",
        "Sight d8",
        "Bite / Scratch d6"
      ],
      condition: "Watching from the ducts",
      traits: "Knows hidden crawlspaces, judges visitors, and steals unattended snacks.",
      notes: ""
    }
  });
  var ENEMY_TRACKER_COUNT = 8;
  var ENEMY_LIFE_MAX = 20;
  function makeId3() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `crew_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
  function sanitizeText(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
  }
  function clampEnemyLife(value) {
    const parsed = Number.parseInt(value, 10);
    if (Number.isNaN(parsed)) return 0;
    return Math.max(0, Math.min(ENEMY_LIFE_MAX, parsed));
  }
  function createDefaultEnemyTrackers() {
    return Array.from({ length: ENEMY_TRACKER_COUNT }, (_, index) => ({
      id: `enemy_${index + 1}`,
      label: `Enemy ${index + 1}`,
      life: 0
    }));
  }
  function sanitizeEnemyTrackers(input) {
    const fallback = createDefaultEnemyTrackers();
    const source = Array.isArray(input) ? input : [];
    return fallback.map((entry, index) => {
      const incoming = source[index] && typeof source[index] === "object" && !Array.isArray(source[index]) ? source[index] : {};
      return {
        id: entry.id,
        label: sanitizeText(incoming.label, entry.label),
        life: clampEnemyLife(incoming.life)
      };
    });
  }
  function createDefaultShipState() {
    return structuredClone(DEFAULT_SHIP);
  }
  function sanitizeShipState(input) {
    const fallback = createDefaultShipState();
    const source = input && typeof input === "object" && !Array.isArray(input) ? input : {};
    const sourceCondition = source.condition && typeof source.condition === "object" && !Array.isArray(source.condition) ? source.condition : {};
    const sourceJack = source.jack && typeof source.jack === "object" && !Array.isArray(source.jack) ? source.jack : {};
    const sourceJackAttributes = sourceJack.attributes && typeof sourceJack.attributes === "object" && !Array.isArray(sourceJack.attributes) ? sourceJack.attributes : {};
    const sourceSpecifications = source.specifications && typeof source.specifications === "object" && !Array.isArray(source.specifications) ? source.specifications : {};
    const sourceAttributes = source.attributes && typeof source.attributes === "object" && !Array.isArray(source.attributes) ? source.attributes : {};
    return {
      name: sanitizeText(source.name, fallback.name),
      className: sanitizeText(source.className, fallback.className),
      concept: sanitizeText(source.concept, fallback.concept),
      editLocked: typeof source.editLocked === "boolean" ? source.editLocked : fallback.editLocked,
      specifications: {
        dimensions: sanitizeText(sourceSpecifications.dimensions, fallback.specifications.dimensions),
        tonnage: sanitizeText(sourceSpecifications.tonnage, fallback.specifications.tonnage),
        speedClass: sanitizeText(sourceSpecifications.speedClass, fallback.specifications.speedClass),
        crewQuarters: sanitizeText(sourceSpecifications.crewQuarters, fallback.specifications.crewQuarters),
        fuelCapacity: sanitizeText(sourceSpecifications.fuelCapacity, fallback.specifications.fuelCapacity),
        cargoCapacity: sanitizeText(sourceSpecifications.cargoCapacity, fallback.specifications.cargoCapacity),
        passengerCapacity: sanitizeText(sourceSpecifications.passengerCapacity, fallback.specifications.passengerCapacity),
        gear: sanitizeText(sourceSpecifications.gear, fallback.specifications.gear),
        price: sanitizeText(sourceSpecifications.price, fallback.specifications.price),
        complexity: sanitizeText(sourceSpecifications.complexity, fallback.specifications.complexity),
        maintenanceCost: sanitizeText(sourceSpecifications.maintenanceCost, fallback.specifications.maintenanceCost)
      },
      attributes: {
        agility: sanitizeText(sourceAttributes.agility, fallback.attributes.agility),
        strength: sanitizeText(sourceAttributes.strength, fallback.attributes.strength),
        vitality: sanitizeText(sourceAttributes.vitality, fallback.attributes.vitality),
        alertness: sanitizeText(sourceAttributes.alertness, fallback.attributes.alertness),
        intelligence: sanitizeText(sourceAttributes.intelligence, fallback.attributes.intelligence),
        willpower: sanitizeText(sourceAttributes.willpower, fallback.attributes.willpower),
        initiative: sanitizeText(sourceAttributes.initiative, fallback.attributes.initiative),
        life: sanitizeText(sourceAttributes.life, fallback.attributes.life)
      },
      traits: sanitizeText(source.traits, fallback.traits),
      skills: sanitizeText(source.skills, fallback.skills),
      condition: {
        hull: sanitizeText(sourceCondition.hull, fallback.condition.hull),
        drive: sanitizeText(sourceCondition.drive, fallback.condition.drive),
        posture: sanitizeText(sourceCondition.posture, fallback.condition.posture),
        currentDamage: sanitizeText(sourceCondition.currentDamage, fallback.condition.currentDamage),
        systemState: sanitizeText(sourceCondition.systemState, fallback.condition.systemState),
        currentLife: sanitizeText(sourceCondition.currentLife, fallback.condition.currentLife),
        performanceNotes: sanitizeText(sourceCondition.performanceNotes, fallback.condition.performanceNotes)
      },
      notes: sanitizeText(source.notes, fallback.notes),
      jack: {
        name: sanitizeText(sourceJack.name, fallback.jack.name),
        role: sanitizeText(sourceJack.role, fallback.jack.role),
        attitude: sanitizeText(sourceJack.attitude, fallback.jack.attitude),
        attributes: {
          agility: sanitizeText(sourceJackAttributes.agility, fallback.jack.attributes.agility),
          strength: sanitizeText(sourceJackAttributes.strength, fallback.jack.attributes.strength),
          vitality: sanitizeText(sourceJackAttributes.vitality, fallback.jack.attributes.vitality),
          alertness: sanitizeText(sourceJackAttributes.alertness, fallback.jack.attributes.alertness),
          intelligence: sanitizeText(sourceJackAttributes.intelligence, fallback.jack.attributes.intelligence),
          willpower: sanitizeText(sourceJackAttributes.willpower, fallback.jack.attributes.willpower)
        },
        lifePoints: sanitizeText(sourceJack.lifePoints, fallback.jack.lifePoints),
        initiative: sanitizeText(sourceJack.initiative, fallback.jack.initiative),
        skills: Array.isArray(sourceJack.skills) && sourceJack.skills.length > 0 ? sourceJack.skills.map((skill) => sanitizeText(skill)).filter(Boolean) : [...fallback.jack.skills],
        condition: sanitizeText(sourceJack.condition, fallback.jack.condition),
        traits: sanitizeText(sourceJack.traits, fallback.jack.traits),
        notes: sanitizeText(sourceJack.notes, fallback.jack.notes)
      }
    };
  }
  function agilityDieSides(character) {
    const match = /^d(\d+)$/i.exec(character.attributes?.Agility || "");
    return match ? Number.parseInt(match[1], 10) : 0;
  }
  function rollAgilityTieBreaker(payload) {
    const character = hydrateCharacter(payload);
    const sides = agilityDieSides(character);
    if (!Number.isFinite(sides) || sides <= 0) return 0;
    return Math.floor(Math.random() * sides) + 1;
  }
  function getCharacterId(payload) {
    const character = hydrateCharacter(payload);
    return typeof character.meta?.characterId === "string" && character.meta.characterId.trim() ? character.meta.characterId : null;
  }
  function normalizeCrewMember(record, fallbackColor = "") {
    if (!record || typeof record !== "object" || Array.isArray(record)) return null;
    if (!record.payload || typeof record.payload !== "object" || Array.isArray(record.payload)) return null;
    const character = hydrateCharacter(record.payload);
    const seed = createConditionState(character.trackers, {
      tabColor: record.gm?.tabColor || fallbackColor
    });
    const gm = sanitizeConditionState(record.gm, seed);
    return {
      id: typeof record.id === "string" && record.id ? record.id : makeId3(),
      sourceName: typeof record.sourceName === "string" && record.sourceName.trim() ? record.sourceName : "Imported Serenity JSON",
      importedAt: typeof record.importedAt === "string" && record.importedAt ? record.importedAt : (/* @__PURE__ */ new Date()).toISOString(),
      payload: structuredClone(record.payload),
      gm: {
        ...gm,
        tabColor: gm.tabColor || fallbackColor
      }
    };
  }
  function ensureTieBreakers(crew) {
    const groups = /* @__PURE__ */ new Map();
    const nextCrew = crew.map((member, index) => {
      const initiativeValue = parseInitiativeValue(member.gm.initiativeValue);
      const clone = structuredClone(member);
      clone.__orderIndex = index;
      clone.__initiativeValue = initiativeValue;
      if (initiativeValue !== null) {
        if (!groups.has(initiativeValue)) groups.set(initiativeValue, []);
        groups.get(initiativeValue).push(clone);
      }
      return clone;
    });
    groups.forEach((members, initiativeValue) => {
      if (members.length < 2) return;
      members.forEach((member) => {
        if (member.gm.tieBreakerInitiative !== initiativeValue || !Number.isFinite(member.gm.tieBreakerRoll)) {
          member.gm.tieBreakerInitiative = initiativeValue;
          member.gm.tieBreakerRoll = rollAgilityTieBreaker(member.payload);
        }
      });
    });
    nextCrew.sort((left, right) => {
      if (left.__initiativeValue === null && right.__initiativeValue === null) {
        return left.__orderIndex - right.__orderIndex;
      }
      if (left.__initiativeValue === null) return 1;
      if (right.__initiativeValue === null) return -1;
      if (left.__initiativeValue !== right.__initiativeValue) {
        return right.__initiativeValue - left.__initiativeValue;
      }
      const leftTie = left.gm.tieBreakerInitiative === left.__initiativeValue ? left.gm.tieBreakerRoll || 0 : 0;
      const rightTie = right.gm.tieBreakerInitiative === right.__initiativeValue ? right.gm.tieBreakerRoll || 0 : 0;
      if (leftTie !== rightTie) {
        return rightTie - leftTie;
      }
      return left.__orderIndex - right.__orderIndex;
    });
    nextCrew.forEach((member) => {
      delete member.__orderIndex;
      delete member.__initiativeValue;
    });
    return nextCrew;
  }
  function normalizeSession(session) {
    const crew = ensureTieBreakers(Array.isArray(session?.crew) ? session.crew : []);
    const crewIds = new Set(crew.map((member) => member.id));
    const validTabs = /* @__PURE__ */ new Set(["gm", "transit", "ship", ...crewIds]);
    const activeTab = validTabs.has(session?.activeTab) ? session.activeTab : "gm";
    const currentTurnMemberId = crewIds.has(session?.currentTurnMemberId) ? session.currentTurnMemberId : crew[0]?.id || null;
    return {
      crew,
      ship: sanitizeShipState(session?.ship),
      enemyTrackers: sanitizeEnemyTrackers(session?.enemyTrackers),
      activeTab,
      currentTurnMemberId
    };
  }
  function createSessionState(seed) {
    const baseCrew = Array.isArray(seed?.crew) ? seed.crew.map((member) => normalizeCrewMember(member)).filter(Boolean) : [];
    return normalizeSession({
      crew: baseCrew,
      ship: seed?.ship,
      activeTab: seed?.activeTab || "gm",
      currentTurnMemberId: seed?.currentTurnMemberId || null
    });
  }
  function mergeImportedCrew(session, importedCrew) {
    const usedColors = session.crew.map((member) => member.gm.tabColor).filter(Boolean);
    const existingByCharacterId = new Map(
      session.crew.map((member) => [getCharacterId(member.payload), member]).filter(([characterId]) => typeof characterId === "string" && characterId)
    );
    let crew = [...session.crew];
    let firstNewMemberId = null;
    let addedCount = 0;
    let replacedCount = 0;
    importedCrew.forEach((record) => {
      const characterId = getCharacterId(record.payload);
      const existing = characterId ? existingByCharacterId.get(characterId) : null;
      if (existing) {
        const replacement = normalizeCrewMember({
          ...existing,
          sourceName: record.sourceName,
          importedAt: (/* @__PURE__ */ new Date()).toISOString(),
          payload: record.payload,
          gm: existing.gm
        }, existing.gm.tabColor);
        crew = crew.map((member2) => member2.id === existing.id ? replacement : member2);
        replacedCount += 1;
        return;
      }
      const tabColor = pickNextTabColor(usedColors);
      usedColors.push(tabColor);
      const member = normalizeCrewMember({
        id: makeId3(),
        sourceName: record.sourceName,
        importedAt: (/* @__PURE__ */ new Date()).toISOString(),
        payload: record.payload,
        gm: { tabColor }
      }, tabColor);
      if (!member) return;
      if (!firstNewMemberId) firstNewMemberId = member.id;
      crew.push(member);
      if (characterId) existingByCharacterId.set(characterId, member);
      addedCount += 1;
    });
    const nextActiveTab = session.crew.length === 0 && firstNewMemberId ? firstNewMemberId : session.activeTab;
    return {
      session: normalizeSession({
        ...session,
        crew,
        activeTab: nextActiveTab,
        currentTurnMemberId: session.currentTurnMemberId || firstNewMemberId || null
      }),
      addedCount,
      replacedCount
    };
  }
  function updateCrewMember(session, memberId, mutator) {
    return normalizeSession({
      ...session,
      crew: session.crew.map((member) => member.id === memberId ? normalizeCrewMember(mutator(structuredClone(member)), member.gm.tabColor) : member).filter(Boolean)
    });
  }
  function updateShipState(session, mutator) {
    return normalizeSession({
      ...session,
      ship: mutator(structuredClone(session.ship))
    });
  }
  function removeCrewMember(session, memberId) {
    return normalizeSession({
      ...session,
      crew: session.crew.filter((member) => member.id !== memberId)
    });
  }
  function clearCrew(session = {}) {
    return normalizeSession({
      ...session,
      crew: [],
      activeTab: "gm",
      currentTurnMemberId: null
    });
  }
  function updateEnemyTracker(session, trackerId, mutator) {
    return normalizeSession({
      ...session,
      enemyTrackers: (session.enemyTrackers || []).map((tracker) => tracker.id === trackerId ? mutator(structuredClone(tracker)) : tracker)
    });
  }
  function setActiveTab(session, tabId) {
    return normalizeSession({
      ...session,
      activeTab: tabId
    });
  }
  function advanceTurn(session) {
    if (session.crew.length === 0) return normalizeSession(session);
    const currentIndex = session.crew.findIndex((member) => member.id === session.currentTurnMemberId);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % session.crew.length;
    const nextId = session.crew[nextIndex]?.id || null;
    return normalizeSession({
      ...session,
      currentTurnMemberId: nextId,
      activeTab: nextId || session.activeTab
    });
  }
  function resetRound(session) {
    const crew = session.crew.map((member) => ({
      ...structuredClone(member),
      gm: {
        ...member.gm,
        actionState: "Ready"
      }
    }));
    return normalizeSession({
      ...session,
      crew,
      currentTurnMemberId: crew[0]?.id || null
    });
  }
  function clearInitiative(session) {
    const crew = session.crew.map((member) => ({
      ...structuredClone(member),
      gm: {
        ...member.gm,
        initiativeValue: "",
        tieBreakerRoll: null,
        tieBreakerInitiative: null
      }
    }));
    return normalizeSession({
      ...session,
      crew,
      currentTurnMemberId: crew[0]?.id || null
    });
  }
  function getCrewCharacter(member) {
    return hydrateCharacter(member?.payload);
  }

  // gm_amanuensis/assets/js/transit_panel.js
  var STORAGE_KEYS = {
    ships: "verseTransitShips",
    routes: "verseTransitRoutes"
  };
  var DEFAULT_LOCATIONS = [
    { name: "Aberdeen", x: 16, y: 24 },
    { name: "Angel", x: 46, y: 20 },
    { name: "Ariel", x: 22, y: 16 },
    { name: "Athens", x: 58, y: 24 },
    { name: "Ares", x: 34, y: 12 },
    { name: "Beaumonde", x: 14, y: 12 },
    { name: "Bernadette", x: 32, y: 18 },
    { name: "Bellerophon", x: 28, y: 10 },
    { name: "Boros", x: 48, y: 24 },
    { name: "Constance", x: 8, y: 24 },
    { name: "Deadwood", x: 62, y: 20 },
    { name: "Dyton", x: 40, y: 26 },
    { name: "Ezra", x: 36, y: 28 },
    { name: "Greenleaf", x: 26, y: 14 },
    { name: "Harvest", x: 42, y: 30 },
    { name: "Haven", x: 48, y: 34 },
    { name: "Heinlein", x: 66, y: 30 },
    { name: "Hera", x: 18, y: 8 },
    { name: "Higgins' Moon", x: 42, y: 22 },
    { name: "Highgate", x: 12, y: 30 },
    { name: "Jiangyin", x: 10, y: 22 },
    { name: "Kalidasa", x: 30, y: 22 },
    { name: "Kerry", x: 24, y: 10 },
    { name: "Lilac", x: 50, y: 14 },
    { name: "Liann Jiun", x: 20, y: 28 },
    { name: "Londinium", x: 8, y: 8 },
    { name: "Miranda", x: 70, y: 10 },
    { name: "New Melbourne", x: 18, y: 30 },
    { name: "Osiris", x: 6, y: 18 },
    { name: "Paquin", x: 60, y: 10 },
    { name: "Persephone", x: 24, y: 34 },
    { name: "Regina", x: 52, y: 28 },
    { name: "Santo", x: 44, y: 6 },
    { name: "Shadow", x: 68, y: 18 },
    { name: "Sihnon", x: 4, y: 28 },
    { name: "St. Albans", x: 54, y: 18 },
    { name: "Triumph", x: 64, y: 34 },
    { name: "Whitefall", x: 34, y: 6 }
  ].sort((a, b) => a.name.localeCompare(b.name));
  function routeKey(a, b) {
    return [a, b].sort((left, right) => left.localeCompare(right)).join("::");
  }
  var DEFAULT_SHIPS = [
    {
      name: "Shuttle / Short Hauler",
      speed: 2,
      notes: "Slow, steady, cheap. Fine for short hops, not fine for patience."
    },
    {
      name: "Heavy Commercial Freighter",
      speed: 3,
      notes: "A plodding cargo beast. Carries more than it hurries."
    },
    {
      name: "Light Commercial / Private Transport",
      speed: 4,
      notes: "A good default for the Verse. Honest speed, honest trouble."
    },
    {
      name: "Fast Courier / Smuggler",
      speed: 5,
      notes: "Built to outrun bills, patrols, and second thoughts."
    },
    {
      name: "High End Yacht / Racing Pinnace",
      speed: 6,
      notes: "Rich folk velocity. More money than mercy."
    }
  ];
  var DEFAULT_ROUTE_OVERRIDES = [
    { from: "Persephone", to: "Triumph", units: 40 },
    { from: "Persephone", to: "Regina", units: 28 },
    { from: "Persephone", to: "Sihnon", units: 21 },
    { from: "Persephone", to: "Ariel", units: 19 },
    { from: "Persephone", to: "Osiris", units: 25 },
    { from: "Regina", to: "Triumph", units: 15 },
    { from: "Regina", to: "Athens", units: 11 },
    { from: "Regina", to: "Haven", units: 9 },
    { from: "Ariel", to: "Osiris", units: 16 },
    { from: "Ariel", to: "Santo", units: 18 },
    { from: "Ariel", to: "Beaumonde", units: 9 },
    { from: "Sihnon", to: "Osiris", units: 10 },
    { from: "Sihnon", to: "Londinium", units: 16 },
    { from: "Santo", to: "Whitefall", units: 11 },
    { from: "Santo", to: "Paquin", units: 18 },
    { from: "Triumph", to: "Athens", units: 12 },
    { from: "Triumph", to: "Paquin", units: 24 },
    { from: "Paquin", to: "Shadow", units: 13 },
    { from: "Bellerophon", to: "Ariel", units: 7 },
    { from: "Beaumonde", to: "Bellerophon", units: 7 }
  ].map((route) => ({ ...route, key: routeKey(route.from, route.to) }));
  function makeId4() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `transit_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function roundToTenth(value) {
    return Math.round(value * 10) / 10;
  }
  function formatDecimal(value) {
    const rounded = roundToTenth(value);
    return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
  }
  function formatTime(daysDecimal) {
    const safeDays = Math.max(0, daysDecimal);
    const wholeDays = Math.floor(safeDays);
    let hours = Math.round((safeDays - wholeDays) * 24);
    let adjustedDays = wholeDays;
    if (hours === 24) {
      adjustedDays += 1;
      hours = 0;
    }
    if (adjustedDays === 0) {
      return `${hours} hour${hours === 1 ? "" : "s"}`;
    }
    if (hours === 0) {
      return `${adjustedDays} day${adjustedDays === 1 ? "" : "s"}`;
    }
    return `${adjustedDays} day${adjustedDays === 1 ? "" : "s"}, ${hours} hour${hours === 1 ? "" : "s"}`;
  }
  function calculateStraightLineDistance(locationA, locationB) {
    const dx = locationB.x - locationA.x;
    const dy = locationB.y - locationA.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  function cloneDefaultShips() {
    return DEFAULT_SHIPS.map((ship) => ({ ...ship, id: makeId4() }));
  }
  function cloneDefaultRoutes() {
    return DEFAULT_ROUTE_OVERRIDES.map((route) => ({ ...route }));
  }
  function loadShips() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.ships) || "null");
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.filter((ship) => ship && ship.name && Number.isFinite(Number(ship.speed))).map((ship) => ({
          id: ship.id || makeId4(),
          name: String(ship.name),
          speed: Number(ship.speed),
          notes: String(ship.notes || "")
        }));
      }
    } catch (error) {
      console.warn("Could not load saved transit ships.", error);
    }
    return cloneDefaultShips();
  }
  function loadRoutes() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.routes) || "null");
      if (Array.isArray(stored) && stored.length > 0) {
        return stored.filter((route) => route && route.from && route.to && Number.isFinite(Number(route.units))).map((route) => ({
          key: routeKey(route.from, route.to),
          from: String(route.from),
          to: String(route.to),
          units: Number(route.units)
        }));
      }
    } catch (error) {
      console.warn("Could not load saved transit routes.", error);
    }
    return cloneDefaultRoutes();
  }
  function saveShips(ships) {
    localStorage.setItem(STORAGE_KEYS.ships, JSON.stringify(ships));
  }
  function saveRoutes(routes) {
    localStorage.setItem(STORAGE_KEYS.routes, JSON.stringify(routes));
  }
  function getLocationByName(name) {
    return DEFAULT_LOCATIONS.find((location) => location.name === name) || null;
  }
  function renderTransitPanel() {
    let ships = loadShips();
    let routeOverrides = loadRoutes();
    const originSelect = el("select");
    const destinationSelect = el("select");
    const shipTypeSelect = el("select");
    const routeTypeSelect = el("select", {}, [
      el("option", { attrs: { value: "1" }, text: "Standard route" }),
      el("option", { attrs: { value: "2" }, text: "Avoiding standard routes" })
    ]);
    const hardBurnCheckbox = el("input", { attrs: { type: "checkbox" } });
    const travelTimeEl = el("strong", { cls: "gm-transit-stat-value", text: "-" });
    const travelTimeDetailEl = el("small", { cls: "gm-copy gm-transit-stat-detail", text: "" });
    const distanceUnitsEl = el("strong", { cls: "gm-transit-stat-value", text: "-" });
    const distanceDetailEl = el("small", { cls: "gm-copy gm-transit-stat-detail", text: "" });
    const fuelIndexEl = el("strong", { cls: "gm-transit-stat-value", text: "-" });
    const fuelDetailEl = el("small", { cls: "gm-copy gm-transit-stat-detail", text: "" });
    const speedClassEl = el("strong", { cls: "gm-transit-stat-value", text: "-" });
    const speedDetailEl = el("small", { cls: "gm-copy gm-transit-stat-detail", text: "" });
    const routeNoteEl = el("div", { cls: "gm-transit-route-note muted" });
    const worldListEl = el("div", { cls: "gm-chip-list" });
    const shipForm = el("form", { cls: "gm-transit-form" });
    const shipEditIdInput = el("input", { attrs: { type: "hidden" } });
    const shipNameInput = el("input", { attrs: { type: "text", maxlength: "80", placeholder: "Fast Courier / Smuggler", required: "required" } });
    const shipSpeedInput = el("input", { attrs: { type: "number", min: "1", max: "12", step: "1", value: "4", required: "required" } });
    const shipNotesInput = el("input", { attrs: { type: "text", maxlength: "180", placeholder: "Built to outrun bills, patrols, and second thoughts." } });
    const clearShipBtn = el("button", { cls: "gm-button", attrs: { type: "button" }, text: "Clear form" });
    const resetShipsBtn = el("button", { cls: "gm-button", attrs: { type: "button" }, text: "Restore default ships" });
    const shipProfilesEl = el("div", { cls: "gm-editable-list" });
    const routeForm = el("form", { cls: "gm-transit-form" });
    const routeEditKeyInput = el("input", { attrs: { type: "hidden" } });
    const routeOriginSelect = el("select");
    const routeDestinationSelect = el("select");
    const routeUnitsInput = el("input", { attrs: { type: "number", min: "0.1", max: "999", step: "0.1", value: "10", required: "required" } });
    const clearRouteBtn = el("button", { cls: "gm-button", attrs: { type: "button" }, text: "Clear form" });
    const resetRoutesBtn = el("button", { cls: "gm-button", attrs: { type: "button" }, text: "Restore default routes" });
    const routeOverridesEl = el("div", { cls: "gm-editable-list" });
    function populateWorldSelect(select, selectedValue) {
      select.innerHTML = "";
      DEFAULT_LOCATIONS.forEach((location, index) => {
        const option = el("option", { attrs: { value: location.name }, text: location.name });
        option.selected = selectedValue ? location.name === selectedValue : index === 0;
        select.append(option);
      });
    }
    function renderWorldList() {
      worldListEl.innerHTML = "";
      DEFAULT_LOCATIONS.forEach((location) => {
        worldListEl.append(el("span", { cls: "gm-chip", text: location.name }));
      });
    }
    function renderShipSelect(preferredName) {
      shipTypeSelect.innerHTML = "";
      ships.slice().sort((a, b) => a.speed - b.speed || a.name.localeCompare(b.name)).forEach((ship, index) => {
        const option = el("option", {
          attrs: { value: ship.id },
          text: `${ship.name} | Speed ${ship.speed}`
        });
        option.selected = preferredName ? ship.name === preferredName : index === 2;
        shipTypeSelect.append(option);
      });
    }
    function renderRouteSelects() {
      populateWorldSelect(routeOriginSelect, routeOriginSelect.value || "Persephone");
      populateWorldSelect(routeDestinationSelect, routeDestinationSelect.value || "Triumph");
    }
    function getRouteOverride(from, to) {
      const key = routeKey(from, to);
      return routeOverrides.find((route) => route.key === key) || null;
    }
    function renderShipProfiles() {
      shipProfilesEl.innerHTML = "";
      ships.slice().sort((a, b) => a.speed - b.speed || a.name.localeCompare(b.name)).forEach((ship) => {
        shipProfilesEl.append(el("article", { cls: "gm-editable-card" }, [
          el("div", { cls: "gm-editable-card-top" }, [
            el("div", {}, [
              el("h3", { text: ship.name }),
              el("div", { cls: "gm-copy muted", text: `Cruise Speed Class ${ship.speed}` })
            ]),
            el("div", { cls: "gm-editable-card-actions" }, [
              el("button", {
                cls: "gm-button gm-button-compact",
                attrs: { type: "button" },
                text: "Edit",
                dataset: { action: "edit-ship", id: ship.id }
              }),
              el("button", {
                cls: "gm-button gm-button-compact",
                attrs: { type: "button" },
                text: "Delete",
                dataset: { action: "delete-ship", id: ship.id }
              })
            ])
          ]),
          el("p", { cls: "gm-copy", text: ship.notes || "No notes. A vessel of mystery and unpaid docking fees." })
        ]));
      });
    }
    function renderRouteOverrides() {
      routeOverridesEl.innerHTML = "";
      routeOverrides.slice().sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to)).forEach((route) => {
        routeOverridesEl.append(el("article", { cls: "gm-editable-card" }, [
          el("div", { cls: "gm-editable-card-top" }, [
            el("div", {}, [
              el("h3", { text: `${route.from} to ${route.to}` }),
              el("div", { cls: "gm-copy muted", text: `Base route ${formatDecimal(route.units)} RU` })
            ]),
            el("div", { cls: "gm-editable-card-actions" }, [
              el("button", {
                cls: "gm-button gm-button-compact",
                attrs: { type: "button" },
                text: "Edit",
                dataset: { action: "edit-route", key: route.key }
              }),
              el("button", {
                cls: "gm-button gm-button-compact",
                attrs: { type: "button" },
                text: "Delete",
                dataset: { action: "delete-route", key: route.key }
              })
            ])
          ]),
          el("p", { cls: "gm-copy", text: "When selected, this fixed value overrides straight-line map distance for both directions on this route." })
        ]));
      });
    }
    function calculateTransit() {
      const origin = getLocationByName(originSelect.value);
      const destination = getLocationByName(destinationSelect.value);
      const ship = ships.find((entry) => entry.id === shipTypeSelect.value);
      const routeMultiplier = Number(routeTypeSelect.value);
      const hardBurn = hardBurnCheckbox.checked;
      if (!origin || !destination || !ship) return;
      if (origin.name === destination.name) {
        travelTimeEl.textContent = "0 days";
        travelTimeDetailEl.textContent = "You are already there. No pilot medals for that.";
        distanceUnitsEl.textContent = "0 RU";
        distanceDetailEl.textContent = "Route Units measure the baseline lane distance.";
        fuelIndexEl.textContent = "0";
        fuelDetailEl.textContent = "No travel, no fuel, no drama.";
        speedClassEl.textContent = String(hardBurn ? ship.speed + 2 : ship.speed);
        speedDetailEl.textContent = hardBurn ? "Hard burn is available, it just has nothing to chew on." : "Cruise speed.";
        routeNoteEl.textContent = "Pick two different worlds and the Black will start whispering numbers.";
        return;
      }
      const routeOverride = getRouteOverride(origin.name, destination.name);
      const baseDistance = routeOverride ? routeOverride.units : calculateStraightLineDistance(origin, destination);
      const effectiveDistance = baseDistance * routeMultiplier;
      const effectiveSpeed = hardBurn ? ship.speed + 2 : ship.speed;
      const travelDays = effectiveDistance / effectiveSpeed;
      const fuelIndex = effectiveDistance * (hardBurn ? 2 : 1);
      const routeLabel = routeMultiplier === 1 ? "standard routes" : "non-standard routes";
      const routeSource = routeOverride ? "saved route override" : "map estimate";
      travelTimeEl.textContent = `${formatDecimal(travelDays)} days`;
      travelTimeDetailEl.textContent = formatTime(travelDays);
      distanceUnitsEl.textContent = `${formatDecimal(effectiveDistance)} RU`;
      distanceDetailEl.textContent = `Base distance ${formatDecimal(baseDistance)} RU from ${routeSource}, adjusted for ${routeLabel}.`;
      fuelIndexEl.textContent = formatDecimal(fuelIndex);
      fuelDetailEl.textContent = hardBurn ? "Fuel index doubles under hard burn. Fast costs." : "Fuel index at cruise burn.";
      speedClassEl.textContent = String(effectiveSpeed);
      speedDetailEl.textContent = hardBurn ? `Cruise ${ship.speed}, hard burn pushes it to ${effectiveSpeed}.` : `Cruise speed for ${ship.name}.`;
      routeNoteEl.textContent = `Route: ${origin.name} to ${destination.name}. Ship: ${ship.name}. Source: ${routeSource}. ${hardBurn ? "Hard burn engaged." : "Cruise burn."} ${routeMultiplier === 2 ? "Avoiding standard routes doubles effective distance, time, and fuel index." : "Standard lanes assumed."}`;
    }
    function clearShipForm() {
      shipEditIdInput.value = "";
      shipNameInput.value = "";
      shipSpeedInput.value = "4";
      shipNotesInput.value = "";
    }
    function clearRouteForm() {
      routeEditKeyInput.value = "";
      routeOriginSelect.value = "Persephone";
      routeDestinationSelect.value = "Triumph";
      routeUnitsInput.value = "10";
    }
    function resetCalculator() {
      originSelect.value = "Persephone";
      destinationSelect.value = "Triumph";
      routeTypeSelect.value = "1";
      hardBurnCheckbox.checked = false;
      const preferredShip = ships.find((ship) => ship.name === "Light Commercial / Private Transport") || ships[0];
      if (preferredShip) shipTypeSelect.value = preferredShip.id;
      calculateTransit();
    }
    function swapLocations() {
      const currentOrigin = originSelect.value;
      originSelect.value = destinationSelect.value;
      destinationSelect.value = currentOrigin;
      calculateTransit();
    }
    function restoreDefaultShips() {
      ships = cloneDefaultShips();
      saveShips(ships);
      renderShipSelect("Light Commercial / Private Transport");
      renderShipProfiles();
      clearShipForm();
      calculateTransit();
    }
    function restoreDefaultRoutes() {
      routeOverrides = cloneDefaultRoutes();
      saveRoutes(routeOverrides);
      renderRouteOverrides();
      clearRouteForm();
      calculateTransit();
    }
    shipForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = shipEditIdInput.value || makeId4();
      const name = shipNameInput.value.trim();
      const speed = Number(shipSpeedInput.value);
      const notes = shipNotesInput.value.trim();
      if (!name || !Number.isFinite(speed) || speed < 1) return;
      const profile = { id, name, speed, notes };
      const existingIndex = ships.findIndex((ship) => ship.id === id);
      if (existingIndex >= 0) {
        ships[existingIndex] = profile;
      } else {
        ships.push(profile);
      }
      saveShips(ships);
      renderShipSelect(name);
      renderShipProfiles();
      clearShipForm();
      calculateTransit();
    });
    routeForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const originalKey = routeEditKeyInput.value;
      const from = routeOriginSelect.value;
      const to = routeDestinationSelect.value;
      const units = Number(routeUnitsInput.value);
      if (!from || !to || from === to || !Number.isFinite(units) || units <= 0) return;
      const key = routeKey(from, to);
      const profile = { key, from, to, units };
      if (originalKey && originalKey !== key) {
        routeOverrides = routeOverrides.filter((route) => route.key !== originalKey);
      }
      const existingIndex = routeOverrides.findIndex((route) => route.key === key);
      if (existingIndex >= 0) {
        routeOverrides[existingIndex] = profile;
      } else {
        routeOverrides.push(profile);
      }
      saveRoutes(routeOverrides);
      renderRouteOverrides();
      clearRouteForm();
      calculateTransit();
    });
    shipProfilesEl.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const { action, id } = button.dataset;
      if (action === "edit-ship") {
        const ship = ships.find((entry) => entry.id === id);
        if (!ship) return;
        shipEditIdInput.value = ship.id;
        shipNameInput.value = ship.name;
        shipSpeedInput.value = String(ship.speed);
        shipNotesInput.value = ship.notes || "";
        shipNameInput.focus();
        return;
      }
      if (action === "delete-ship") {
        if (ships.length === 1) {
          window.alert("You need at least one ship profile. Even the Black wants a ride.");
          return;
        }
        ships = ships.filter((entry) => entry.id !== id);
        saveShips(ships);
        renderShipSelect();
        renderShipProfiles();
        clearShipForm();
        calculateTransit();
      }
    });
    routeOverridesEl.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      const { action, key } = button.dataset;
      if (action === "edit-route") {
        const route = routeOverrides.find((entry) => entry.key === key);
        if (!route) return;
        routeEditKeyInput.value = route.key;
        routeOriginSelect.value = route.from;
        routeDestinationSelect.value = route.to;
        routeUnitsInput.value = String(route.units);
        routeOriginSelect.focus();
        return;
      }
      if (action === "delete-route") {
        routeOverrides = routeOverrides.filter((entry) => entry.key !== key);
        saveRoutes(routeOverrides);
        renderRouteOverrides();
        clearRouteForm();
        calculateTransit();
      }
    });
    [originSelect, destinationSelect, shipTypeSelect, routeTypeSelect, hardBurnCheckbox].forEach((node) => {
      node.addEventListener("change", calculateTransit);
    });
    clearShipBtn.addEventListener("click", clearShipForm);
    clearRouteBtn.addEventListener("click", clearRouteForm);
    resetShipsBtn.addEventListener("click", restoreDefaultShips);
    resetRoutesBtn.addEventListener("click", restoreDefaultRoutes);
    const swapBtn = el("button", { cls: "gm-button", attrs: { type: "button" }, text: "Swap locations" });
    const resetBtn = el("button", { cls: "gm-button", attrs: { type: "button" }, text: "Reset" });
    swapBtn.addEventListener("click", swapLocations);
    resetBtn.addEventListener("click", resetCalculator);
    const panel = el("section", {
      cls: "gm-main-panel gm-transit-panel",
      attrs: { style: "--tab-accent: #86a7ff;" }
    }, [
      el("header", { cls: "gm-panel-header" }, [
        el("div", {}, [
          el("p", { cls: "gm-kicker", text: "Pinned Utility Tab" }),
          el("h2", { cls: "gm-panel-title", text: "Transit" }),
          el("p", {
            cls: "gm-panel-copy",
            text: "Estimate travel time through the Black, tune ship speed profiles, and pin house-route distances where straight-line math is too blunt."
          })
        ])
      ]),
      el("div", { cls: "gm-transit-layout" }, [
        el("section", { cls: "gm-utility-card" }, [
          el("h3", { cls: "gm-utility-title", text: "Transit Controls" }),
          el("div", { cls: "gm-form-grid" }, [
            el("label", { cls: "gm-form-field" }, [el("span", { text: "Location A" }), originSelect]),
            el("label", { cls: "gm-form-field" }, [el("span", { text: "Location B" }), destinationSelect]),
            el("label", { cls: "gm-form-field" }, [el("span", { text: "Ship Class" }), shipTypeSelect]),
            el("label", { cls: "gm-form-field" }, [el("span", { text: "Route Type" }), routeTypeSelect])
          ]),
          el("label", { cls: "gm-transit-checkbox" }, [
            hardBurnCheckbox,
            el("span", { text: "Hard burn" })
          ]),
          el("div", { cls: "gm-toolbar" }, [swapBtn, resetBtn])
        ]),
        el("section", { cls: "gm-utility-card" }, [
          el("h3", { cls: "gm-utility-title", text: "Transit Estimate" }),
          el("div", { cls: "gm-transit-results" }, [
            el("article", { cls: "gm-transit-stat-card" }, [
              el("span", { cls: "gm-stat-label", text: "Estimated Travel Time" }),
              travelTimeEl,
              travelTimeDetailEl
            ]),
            el("article", { cls: "gm-transit-stat-card" }, [
              el("span", { cls: "gm-stat-label", text: "Effective Distance" }),
              distanceUnitsEl,
              distanceDetailEl
            ]),
            el("article", { cls: "gm-transit-stat-card" }, [
              el("span", { cls: "gm-stat-label", text: "Fuel Use Index" }),
              fuelIndexEl,
              fuelDetailEl
            ]),
            el("article", { cls: "gm-transit-stat-card" }, [
              el("span", { cls: "gm-stat-label", text: "Effective Speed Class" }),
              speedClassEl,
              speedDetailEl
            ])
          ]),
          el("div", { cls: "gm-editable-card gm-transit-formula" }, [
            el("h3", { text: "House Math in Use" }),
            el("p", {
              cls: "gm-copy",
              text: "Base distance comes from a saved route override when one exists, otherwise from map distance between worlds. Standard route uses x1 distance. Avoiding standard routes uses x2 distance, which also doubles time and fuel. Hard burn uses speed class +2 and doubles fuel use. Travel time equals effective distance divided by effective speed."
            })
          ]),
          routeNoteEl
        ]),
        el("section", { cls: "gm-utility-card" }, [
          el("h3", { cls: "gm-utility-title", text: "World Catalog" }),
          el("p", { cls: "gm-copy", text: "Expanded with more Verse worlds. Route overrides let you pin house values where straight-line estimates are too blunt." }),
          worldListEl
        ]),
        el("section", { cls: "gm-utility-card" }, [
          el("div", { cls: "gm-panel-header" }, [
            el("div", {}, [
              el("h3", { cls: "gm-utility-title", text: "Ship Profiles" }),
              el("p", { cls: "gm-copy", text: "Edit, add, or delete ship classes. Changes are saved in this browser." })
            ]),
            resetShipsBtn
          ]),
          shipForm
        ]),
        shipProfilesEl,
        el("section", { cls: "gm-utility-card" }, [
          el("div", { cls: "gm-panel-header" }, [
            el("div", {}, [
              el("h3", { cls: "gm-utility-title", text: "Route Overrides" }),
              el("p", { cls: "gm-copy", text: "Use fixed base route units for common lanes or your own house canon. These values override map distance." })
            ]),
            resetRoutesBtn
          ]),
          routeForm
        ]),
        routeOverridesEl
      ])
    ]);
    shipForm.append(
      shipEditIdInput,
      el("div", { cls: "gm-form-grid gm-transit-tri-grid" }, [
        el("label", { cls: "gm-form-field" }, [el("span", { text: "Ship class name" }), shipNameInput]),
        el("label", { cls: "gm-form-field" }, [el("span", { text: "Cruise speed class" }), shipSpeedInput]),
        el("label", { cls: "gm-form-field gm-form-field-wide" }, [el("span", { text: "Notes" }), shipNotesInput])
      ]),
      el("div", { cls: "gm-toolbar" }, [
        el("button", { cls: "gm-button gm-button-primary", attrs: { type: "submit" }, text: "Save ship profile" }),
        clearShipBtn
      ])
    );
    routeForm.append(
      routeEditKeyInput,
      el("div", { cls: "gm-form-grid gm-transit-tri-grid" }, [
        el("label", { cls: "gm-form-field" }, [el("span", { text: "From" }), routeOriginSelect]),
        el("label", { cls: "gm-form-field" }, [el("span", { text: "To" }), routeDestinationSelect]),
        el("label", { cls: "gm-form-field" }, [el("span", { text: "Base route units" }), routeUnitsInput])
      ]),
      el("div", { cls: "gm-toolbar" }, [
        el("button", { cls: "gm-button gm-button-primary", attrs: { type: "submit" }, text: "Save route override" }),
        clearRouteBtn
      ])
    );
    populateWorldSelect(originSelect, "Persephone");
    populateWorldSelect(destinationSelect, "Triumph");
    renderRouteSelects();
    renderWorldList();
    renderShipSelect("Light Commercial / Private Transport");
    renderShipProfiles();
    renderRouteOverrides();
    resetCalculator();
    return panel;
  }

  // gm_amanuensis/assets/js/crew_render.js
  var DIFFICULTY_LADDER = [
    ["Trivial", "3"],
    ["Easy", "7"],
    ["Average", "11"],
    ["Hard", "15"],
    ["Formidable", "19"]
  ];
  var COMMON_PAIRINGS = [
    "Alertness + Perception",
    "Agility + Guns",
    "Agility + Athletics",
    "Intelligence + Technical Engineering",
    "Strength + Melee Weapon Combat",
    "Willpower + Discipline"
  ];
  var COMBAT_QUICK_REFERENCE = [
    "Action: roll Attribute + Skill against the target number.",
    "Step up for strong edges, step down for bad footing, cover, or pain.",
    "Stun fills first and often shakes a character out of the fight fast.",
    "Wounds are serious and should stay visible on the active tab."
  ];
  var SHIP_SELECTS = {
    hull: ["Nominal", "Scuffed", "Critical"],
    drive: ["Steady", "Touchy", "Dead Stick"],
    posture: ["Docked", "Running Cold", "Hot Exit"],
    jackCondition: ["Watching from the ducts", "Loose on the catwalks", "Raiding the galley", "Hiding from strangers"]
  };
  var SHIP_SPEC_FIELDS = [
    ["Dimensions", "specifications.dimensions"],
    ["Tonnage", "specifications.tonnage"],
    ["Speed Class", "specifications.speedClass"],
    ["Crew Quarters", "specifications.crewQuarters"],
    ["Fuel Capacity", "specifications.fuelCapacity"],
    ["Cargo Capacity / Max Deck Load", "specifications.cargoCapacity"],
    ["Passenger Capacity", "specifications.passengerCapacity"],
    ["Gear", "specifications.gear"],
    ["Price", "specifications.price"],
    ["Complexity", "specifications.complexity"],
    ["Maintenance Cost", "specifications.maintenanceCost"]
  ];
  var SHIP_ATTRIBUTE_FIELDS = [
    ["Agility", "attributes.agility"],
    ["Strength", "attributes.strength"],
    ["Vitality", "attributes.vitality"],
    ["Alertness", "attributes.alertness"],
    ["Intelligence", "attributes.intelligence"],
    ["Willpower", "attributes.willpower"],
    ["Initiative", "attributes.initiative"],
    ["Life", "attributes.life"]
  ];
  var ENEMY_LIFE_MAX2 = 20;
  function displayRole(character) {
    return character.basics.role || character.basics.customRole || "Unassigned";
  }
  function collectBoughtSkills(character) {
    return Object.entries(character.skills || {}).filter(([, skill]) => skill.generalRating && skill.generalRating !== "none" || (skill.specialties || []).some((specialty) => specialty.rating && specialty.rating !== "none")).map(([skillName, skill]) => ({
      name: skillName,
      rating: effectiveGeneralRating(character, skillName),
      specialties: (skill.specialties || []).filter((specialty) => specialty.rating && specialty.rating !== "none" && specialty.name).map((specialty) => `${specialty.name} ${specialty.rating}`)
    })).sort((left, right) => left.name.localeCompare(right.name));
  }
  function renderBadge(text, className = "") {
    return el("span", { cls: `gm-badge ${className}`.trim(), text });
  }
  function renderStat(label, value) {
    return el("div", { cls: "gm-stat" }, [
      el("span", { cls: "gm-stat-label", text: label }),
      el("span", { cls: "gm-stat-value", text: String(value || "-") })
    ]);
  }
  function renderUtilitySection(title, items) {
    return el("section", { cls: "gm-utility-card" }, [
      el("h3", { cls: "gm-utility-title", text: title }),
      el("ul", { cls: "gm-reference-list" }, items.map((item) => el("li", { text: item })))
    ]);
  }
  function renderDifficultyLadder() {
    return el("section", { cls: "gm-utility-card" }, [
      el("h3", { cls: "gm-utility-title", text: "Difficulty Ladder" }),
      el("div", { cls: "gm-difficulty-grid" }, DIFFICULTY_LADDER.map(([label, value]) => el("div", { cls: "gm-difficulty-row" }, [
        el("span", { text: label }),
        el("strong", { text: value })
      ])))
    ]);
  }
  function valueAtPath(source, path) {
    return path.split(".").reduce((value, key) => value?.[key], source) || "";
  }
  function parseShipList(value) {
    return String(value || "").split("\n").map((entry) => entry.trim()).filter(Boolean);
  }
  function renderShipTextList(items, emptyLabel) {
    if (items.length === 0) {
      return el("div", { cls: "gm-ship-list-empty", text: emptyLabel });
    }
    return el("ul", { cls: "gm-ship-sheet-list" }, items.map((item) => el("li", { cls: "gm-ship-sheet-item" }, [
      el("span", { cls: "gm-ship-sheet-item-text", text: item })
    ])));
  }
  function shipFieldAttrs(ship, extra = {}) {
    return ship.editLocked !== false ? { ...extra, disabled: "disabled" } : extra;
  }
  function renderEnemyLifeBubble(trackerId, value, current) {
    return el("button", {
      cls: `gm-enemy-life-bubble${value <= current ? " filled" : ""}`,
      attrs: {
        type: "button",
        title: `Set life to ${value}`,
        "aria-label": `Set enemy life to ${value}`
      },
      dataset: { action: "set-enemy-life", memberId: trackerId, value: String(value) }
    });
  }
  function renderEnemyTrackerRow(tracker) {
    return el("div", { cls: "gm-enemy-tracker-row" }, [
      el("div", { cls: "gm-enemy-tracker-head" }, [
        el("strong", { text: tracker.label }),
        el("div", { cls: "gm-enemy-tracker-meta" }, [
          el("span", { cls: "gm-badge gm-badge-soft", text: `${tracker.life} / ${ENEMY_LIFE_MAX2}` }),
          el("button", {
            cls: "gm-button gm-button-compact",
            text: "Clear",
            attrs: { type: "button" },
            dataset: { action: "clear-enemy-life", memberId: tracker.id }
          })
        ])
      ]),
      el("div", { cls: "gm-enemy-life-track" }, Array.from({ length: ENEMY_LIFE_MAX2 }, (_, index) => {
        const value = index + 1;
        return renderEnemyLifeBubble(tracker.id, value, tracker.life);
      }))
    ]);
  }
  function renderEnemyTrackerPanel(session) {
    return el("section", { cls: "gm-utility-card gm-enemy-tracker-panel" }, [
      el("h3", { cls: "gm-utility-title", text: "Enemy Life Trackers" }),
      el("p", {
        cls: "gm-panel-copy gm-enemy-tracker-copy",
        text: "Eight quick enemy rows, twenty life points each. Click across the row to match current damage."
      }),
      el("div", { cls: "gm-enemy-tracker-list" }, (session.enemyTrackers || []).map((tracker) => renderEnemyTrackerRow(tracker)))
    ]);
  }
  function renderGMUtilityPanel(session) {
    return el("section", { cls: "gm-main-panel gm-bridge-panel" }, [
      el("div", { cls: "gm-panel-header" }, [
        el("div", {}, [
          el("p", { cls: "gm-kicker", text: "Pinned Utility Tab" }),
          el("h2", { cls: "gm-panel-title", text: "Bridge" }),
          el("p", {
            cls: "gm-panel-copy",
            text: "Use this panel for fast rulings, initiative flow, and round control during live Serenity play."
          })
        ]),
        el("div", { cls: "gm-round-tools" }, [
          el("button", {
            cls: "gm-button gm-button-primary",
            text: "Advance Turn",
            attrs: {
              type: "button",
              ...session.crew.length === 0 ? { disabled: "disabled" } : {}
            },
            dataset: { action: "advance-turn" }
          }),
          el("button", {
            cls: "gm-button",
            text: "Reset Round",
            attrs: {
              type: "button",
              ...session.crew.length === 0 ? { disabled: "disabled" } : {}
            },
            dataset: { action: "reset-round" }
          }),
          el("button", {
            cls: "gm-button",
            text: "Clear Initiative",
            attrs: {
              type: "button",
              ...session.crew.length === 0 ? { disabled: "disabled" } : {}
            },
            dataset: { action: "clear-initiative" }
          }),
          el("button", {
            cls: "gm-button",
            text: "Open Transit Calculator",
            attrs: { type: "button" },
            dataset: { action: "select-tab", tabId: "transit" }
          })
        ])
      ]),
      el("div", { cls: "gm-utility-grid" }, [
        renderDifficultyLadder(),
        renderUtilitySection("Complex Difficulty", [
          "For layered jobs, count each moving part and step the target up from Average.",
          "If the scene is chaotic, step the job again instead of pausing play for math.",
          "Let sharp prep buy the target back down."
        ]),
        renderUtilitySection("Common Pairings", COMMON_PAIRINGS),
        renderUtilitySection("Combat Quick Reference", COMBAT_QUICK_REFERENCE),
        renderUtilitySection("Step Up / Step Down", [
          "Step up for leverage, superior position, tools, or a strong narrative edge.",
          "Step down for wounds, panic, poor footing, visibility, or rushed actions.",
          "If both apply, cancel what clearly cancels and keep the rest moving."
        ])
      ]),
      renderEnemyTrackerPanel(session)
    ]);
  }
  function renderCharacterTab(member, session) {
    const character = getCrewCharacter(member);
    const isActive = session.activeTab === member.id;
    const isCurrent = session.currentTurnMemberId === member.id;
    return el("article", {
      cls: `gm-tab-card ${isActive ? "is-active" : ""} ${isCurrent ? "is-current" : ""}`.trim(),
      attrs: { style: `--tab-accent: ${member.gm.tabColor};` },
      dataset: { action: "select-tab", tabId: member.id }
    }, [
      el("button", {
        cls: "gm-tab-select",
        attrs: { type: "button" },
        dataset: { action: "select-tab", tabId: member.id }
      }, [
        el("div", { cls: "gm-tab-topline" }, [
          el("strong", { cls: "gm-tab-name", text: character.basics.name || "Unnamed Crew Member" }),
          isCurrent ? renderBadge("Current", "gm-badge-current") : null
        ]),
        el("div", { cls: "gm-tab-badges" }, [
          renderBadge(member.gm.actionState, `gm-badge-state gm-badge-${member.gm.actionState.toLowerCase()}`),
          renderBadge(`S ${member.gm.stun}`, "gm-badge-small"),
          renderBadge(`W ${member.gm.wounds}`, "gm-badge-small")
        ])
      ]),
      el("label", { cls: "gm-tab-initiative-field" }, [
        el("span", { text: "Init" }),
        el("input", {
          cls: "gm-tab-initiative-input",
          attrs: { type: "number", placeholder: "-", value: member.gm.initiativeValue },
          dataset: { action: "initiative-input", memberId: member.id, field: "initiativeValue" }
        })
      ])
    ]);
  }
  function renderShipTab(session) {
    const isActive = session.activeTab === "ship";
    return el("article", {
      cls: `gm-tab-card gm-tab-ship ${isActive ? "is-active" : ""}`.trim(),
      attrs: { style: "--tab-accent: #d7a55a;" },
      dataset: { action: "select-tab", tabId: "ship" }
    }, [
      el("button", {
        cls: "gm-tab-select",
        attrs: { type: "button" },
        dataset: { action: "select-tab", tabId: "ship" }
      }, [
        el("div", { cls: "gm-tab-topline" }, [
          el("strong", { cls: "gm-tab-name", text: session.ship.name || "Ship" })
        ]),
        el("div", { cls: "gm-tab-badges" }, [
          renderBadge(session.ship.condition.hull, "gm-badge-soft"),
          renderBadge("Jack Aboard", "gm-badge-small")
        ])
      ]),
      el("div", { cls: "gm-tab-initiative-field" }, [
        el("span", { text: "Ship Status" }),
        el("strong", { cls: "gm-tab-static", text: session.ship.condition.posture })
      ])
    ]);
  }
  function renderCharacterPanel(member, session) {
    const character = getCrewCharacter(member);
    const boughtSkills = collectBoughtSkills(character);
    const noteField = el("textarea", {
      attrs: { rows: "4", placeholder: "Fast reminder for live play, complications, heat, or tells." },
      dataset: { action: "condition-note", memberId: member.id, field: "notes" }
    });
    noteField.value = member.gm.notes || "";
    return el("section", {
      cls: "gm-main-panel gm-character-panel",
      attrs: { style: `--tab-accent: ${member.gm.tabColor};` }
    }, [
      el("header", { cls: "gm-panel-header" }, [
        el("div", {}, [
          el("p", { cls: "gm-kicker", text: session.currentTurnMemberId === member.id ? "Current Turn" : "Character Focus" }),
          el("h2", { cls: "gm-panel-title", text: character.basics.name || "Unnamed Crew Member" }),
          el("p", { cls: "gm-panel-copy", text: character.basics.concept || "No concept provided" }),
          el("div", { cls: "gm-panel-badges" }, [
            renderBadge(displayRole(character), "gm-badge-soft"),
            renderBadge(member.gm.actionState, `gm-badge-state gm-badge-${member.gm.actionState.toLowerCase()}`),
            session.currentTurnMemberId === member.id ? renderBadge("Current", "gm-badge-current") : null
          ])
        ]),
        el("button", {
          cls: "gm-button",
          text: "Remove Character",
          attrs: { type: "button" },
          dataset: { action: "remove-member", memberId: member.id }
        })
      ]),
      el("div", { cls: "gm-character-layout" }, [
        el("div", { cls: "gm-character-column" }, [
          el("div", { cls: "gm-card-grid" }, [
            renderStat("Role", displayRole(character)),
            renderStat("Life Points", lifePoints(character)),
            renderStat("Initiative Entry", member.gm.initiativeValue || "-"),
            renderStat("Agility", character.attributes.Agility || "-")
          ]),
          el("section", { cls: "gm-section" }, [
            el("h3", { cls: "gm-section-title", text: "Attributes" }),
            el("div", { cls: "gm-attribute-grid" }, ATTRIBUTE_LIST.map((attribute) => el("div", { cls: "gm-attribute" }, [
              el("span", { cls: "gm-attribute-name", text: attribute }),
              el("span", { cls: "gm-attribute-value", text: character.attributes[attribute] || "-" })
            ])))
          ]),
          el("section", { cls: "gm-section" }, [
            el("h3", { cls: "gm-section-title", text: "Bought Skills" }),
            el("ul", { cls: "gm-skill-list" }, boughtSkills.length > 0 ? boughtSkills.map((skill) => el("li", { cls: "gm-skill-item" }, [
              el("span", { cls: "gm-skill-name", text: skill.name }),
              el("span", { cls: "gm-skill-rating", text: `Rating: ${skill.rating}` }),
              skill.specialties.length > 0 ? el("span", { cls: "gm-skill-specialties", text: `Specialties: ${skill.specialties.join(", ")}` }) : null
            ])) : [el("li", { cls: "gm-skill-item" }, [el("span", { cls: "gm-skill-name", text: "No bought skills listed" })])])
          ])
        ]),
        el("aside", { cls: "gm-character-column gm-character-side" }, [
          el("section", { cls: "gm-utility-card gm-condition-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Live Conditions" }),
            el("div", { cls: "gm-condition-row" }, [
              el("label", { text: "Stun" }),
              el("div", { cls: "gm-stepper" }, [
                el("button", {
                  text: "-",
                  attrs: { type: "button", "aria-label": `Lower stun for ${character.basics.name || "crew member"}` },
                  dataset: { action: "adjust-condition", memberId: member.id, field: "stun", delta: "-1" }
                }),
                el("input", {
                  attrs: { type: "number", min: "0", step: "1", value: String(member.gm.stun) },
                  dataset: { action: "condition-number", memberId: member.id, field: "stun" }
                }),
                el("button", {
                  text: "+",
                  attrs: { type: "button", "aria-label": `Raise stun for ${character.basics.name || "crew member"}` },
                  dataset: { action: "adjust-condition", memberId: member.id, field: "stun", delta: "1" }
                })
              ])
            ]),
            el("div", { cls: "gm-condition-row" }, [
              el("label", { text: "Wounds" }),
              el("div", { cls: "gm-stepper" }, [
                el("button", {
                  text: "-",
                  attrs: { type: "button", "aria-label": `Lower wounds for ${character.basics.name || "crew member"}` },
                  dataset: { action: "adjust-condition", memberId: member.id, field: "wounds", delta: "-1" }
                }),
                el("input", {
                  attrs: { type: "number", min: "0", step: "1", value: String(member.gm.wounds) },
                  dataset: { action: "condition-number", memberId: member.id, field: "wounds" }
                }),
                el("button", {
                  text: "+",
                  attrs: { type: "button", "aria-label": `Raise wounds for ${character.basics.name || "crew member"}` },
                  dataset: { action: "adjust-condition", memberId: member.id, field: "wounds", delta: "1" }
                })
              ])
            ]),
            el("div", { cls: "gm-condition-row" }, [
              el("label", { text: "Action State" }),
              el("select", {
                dataset: { action: "condition-select", memberId: member.id, field: "actionState" }
              }, ["Ready", "Acted", "Down"].map((state) => {
                const option = el("option", {
                  text: state,
                  attrs: { value: state }
                });
                option.selected = member.gm.actionState === state;
                return option;
              }))
            ]),
            el("div", { cls: "gm-note-field" }, [
              el("label", { text: "GM note" }),
              noteField
            ])
          ])
        ])
      ])
    ]);
  }
  function renderShipPanel(ship) {
    const isLocked = ship.editLocked !== false;
    const shipTraitItems = parseShipList(ship.traits);
    const shipSkillItems = parseShipList(ship.skills);
    const shipGearField = el("textarea", {
      cls: "gm-ship-field-textarea",
      attrs: shipFieldAttrs(ship, { rows: "2", placeholder: "Gear" }),
      dataset: { action: "ship-field", shipField: "specifications.gear" }
    });
    shipGearField.value = ship.specifications.gear || "";
    const shipDamageField = el("textarea", {
      cls: "gm-ship-field-textarea",
      attrs: shipFieldAttrs(ship, { rows: "3", placeholder: "Stress, hull damage, broken systems, jury-rigged fixes." }),
      dataset: { action: "ship-field", shipField: "condition.currentDamage" }
    });
    shipDamageField.value = ship.condition.currentDamage || "";
    const shipTraitsField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "4", placeholder: "Ship traits, quirks, complications, or edges." }),
      dataset: { action: "ship-field", shipField: "traits" }
    });
    shipTraitsField.value = ship.traits || "";
    const shipSkillsField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "4", placeholder: "Ship skills, specialties, or operational strengths." }),
      dataset: { action: "ship-field", shipField: "skills" }
    });
    shipSkillsField.value = ship.skills || "";
    const shipNotesField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "5", placeholder: "Ship notes, cargo trouble, fuel worries, docking headaches, or scene hooks." }),
      dataset: { action: "ship-field", shipField: "notes" }
    });
    shipNotesField.value = ship.notes || "";
    const shipPerformanceNotesField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "4", placeholder: "GM notes tied to thrust, handling, heat, subsystem strain, or scene performance." }),
      dataset: { action: "ship-field", shipField: "condition.performanceNotes" }
    });
    shipPerformanceNotesField.value = ship.condition.performanceNotes || "";
    const jackTraitsField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "3", placeholder: "Behavior notes, favorite ducts, habits, grudges, or tricks." }),
      dataset: { action: "jack-field", shipField: "jack.traits" }
    });
    jackTraitsField.value = ship.jack.traits || "";
    const jackNotesField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "3", placeholder: "Short GM note for Jack." }),
      dataset: { action: "jack-field", shipField: "jack.notes" }
    });
    jackNotesField.value = ship.jack.notes || "";
    const jackSkillsField = el("textarea", {
      attrs: shipFieldAttrs(ship, { rows: "6", placeholder: "One skill per line for Jack." }),
      dataset: { action: "jack-skills-field", shipField: "jack.skills" }
    });
    jackSkillsField.value = (ship.jack.skills || []).join("\n");
    return el("section", {
      cls: "gm-main-panel gm-ship-panel",
      attrs: { style: "--tab-accent: #d7a55a;" }
    }, [
      el("header", { cls: "gm-panel-header" }, [
        el("div", {}, [
          el("p", { cls: "gm-kicker", text: "Pinned Ship Tab" }),
          el("h2", { cls: "gm-panel-title", text: ship.name }),
          el("p", { cls: "gm-panel-copy", text: `${ship.className} | ${ship.concept}` }),
          el("div", { cls: "gm-panel-badges" }, [
            renderBadge(ship.condition.hull, "gm-badge-soft"),
            renderBadge(ship.condition.drive, "gm-badge-soft"),
            renderBadge(ship.condition.posture, "gm-badge-soft"),
            renderBadge(isLocked ? "Locked" : "Editing", isLocked ? "gm-badge-soft" : "gm-badge-current")
          ])
        ]),
        el("div", { cls: "gm-ship-panel-tools" }, [
          el("p", {
            cls: "gm-ship-lock-copy",
            text: isLocked ? "Ship data is locked to prevent accidental edits." : "Ship data is unlocked. Changes save immediately."
          }),
          el("button", {
            cls: `gm-button ${isLocked ? "gm-button-primary" : ""}`.trim(),
            text: isLocked ? "Unlock Ship Data" : "Lock Ship Data",
            attrs: { type: "button" },
            dataset: { action: "toggle-ship-edit-lock" }
          })
        ])
      ]),
      el("div", { cls: "gm-ship-layout" }, [
        el("div", { cls: "gm-character-column" }, [
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Ship Identity" }),
            el("div", { cls: "gm-form-grid" }, [
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "Ship Name" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.name }),
                  dataset: { action: "ship-field", shipField: "name" }
                })
              ]),
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "Class / Type" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.className }),
                  dataset: { action: "ship-field", shipField: "className" }
                })
              ]),
              el("label", { cls: "gm-form-field gm-form-field-wide" }, [
                el("span", { text: "Concept / Role Line" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.concept }),
                  dataset: { action: "ship-field", shipField: "concept" }
                })
              ])
            ])
          ]),
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Specifications" }),
            el("div", { cls: "gm-form-grid gm-form-grid-ship-specs" }, SHIP_SPEC_FIELDS.map(([label, path]) => el("label", {
              cls: `gm-form-field ${label.includes("Cargo Capacity") || label === "Gear" ? "gm-form-field-wide" : ""}`.trim()
            }, [
              el("span", { text: label }),
              label === "Gear" ? shipGearField : el("input", {
                attrs: shipFieldAttrs(ship, { type: "text", value: valueAtPath(ship, path) }),
                dataset: { action: "ship-field", shipField: path }
              })
            ])))
          ]),
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Attributes" }),
            el("div", { cls: "gm-form-grid gm-form-grid-ship-attributes" }, SHIP_ATTRIBUTE_FIELDS.map(([label, path]) => el("label", { cls: "gm-form-field" }, [
              el("span", { text: label }),
              el("input", {
                attrs: shipFieldAttrs(ship, { type: "text", value: valueAtPath(ship, path) }),
                dataset: { action: "ship-field", shipField: path }
              })
            ])))
          ]),
          el("div", { cls: "gm-ship-sheet-grid" }, [
            el("section", { cls: "gm-utility-card" }, [
              el("h3", { cls: "gm-utility-title", text: "Traits" }),
              renderShipTextList(shipTraitItems, "No ship traits listed yet."),
              el("div", { cls: "gm-note-field" }, [
                el("label", { text: "Ship traits and quirks" }),
                shipTraitsField
              ])
            ]),
            el("section", { cls: "gm-utility-card" }, [
              el("h3", { cls: "gm-utility-title", text: "Skills" }),
              renderShipTextList(shipSkillItems, "No ship skills listed yet."),
              el("div", { cls: "gm-note-field" }, [
                el("label", { text: "Ship skills and operating specialties" }),
                shipSkillsField
              ])
            ])
          ]),
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Ship Condition" }),
            el("div", { cls: "gm-form-grid" }, [
              ...Object.entries({
                "Hull State": ["condition.hull", SHIP_SELECTS.hull],
                "Drive Train": ["condition.drive", SHIP_SELECTS.drive],
                "Current Posture": ["condition.posture", SHIP_SELECTS.posture]
              }).map(([label, [path, values]]) => el("label", { cls: "gm-form-field" }, [
                el("span", { text: label }),
                el("select", {
                  attrs: shipFieldAttrs(ship),
                  dataset: { action: "ship-field", shipField: path }
                }, values.map((value) => {
                  const option = el("option", {
                    text: value,
                    attrs: { value }
                  });
                  option.selected = path === "condition.hull" ? ship.condition.hull === value : path === "condition.drive" ? ship.condition.drive === value : ship.condition.posture === value;
                  return option;
                }))
              ]))
            ]),
            el("div", { cls: "gm-form-grid gm-form-grid-ship-condition" }, [
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "Current Life" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.condition.currentLife }),
                  dataset: { action: "ship-field", shipField: "condition.currentLife" }
                })
              ]),
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "System State" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.condition.systemState }),
                  dataset: { action: "ship-field", shipField: "condition.systemState" }
                })
              ]),
              el("label", { cls: "gm-form-field gm-form-field-wide" }, [
                el("span", { text: "Current Damage / Condition Tracking" }),
                shipDamageField
              ]),
              el("div", { cls: "gm-note-field gm-form-field-wide" }, [
                el("label", { text: "Performance notes" }),
                shipPerformanceNotesField
              ])
            ])
          ]),
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Ship Notes" }),
            el("div", { cls: "gm-note-field" }, [
              el("label", { text: "GM ship notes" }),
              shipNotesField
            ])
          ]),
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Systems Bay" }),
            el("ul", { cls: "gm-reference-list" }, [
              el("li", { text: "Reserved for future cargo, fuel, heat, or component hooks." }),
              el("li", { text: "Keep this panel open for later ship mechanics without overbuilding today." })
            ])
          ])
        ]),
        el("aside", { cls: "gm-character-column gm-character-side" }, [
          el("section", { cls: "gm-utility-card gm-jack-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Jack" }),
            el("div", { cls: "gm-form-grid" }, [
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "Jack Name" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.jack.name || "" }),
                  dataset: { action: "jack-field", shipField: "jack.name" }
                })
              ]),
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "Role" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.jack.role || "" }),
                  dataset: { action: "jack-field", shipField: "jack.role" }
                })
              ]),
              el("label", { cls: "gm-form-field gm-form-field-wide" }, [
                el("span", { text: "Attitude" }),
                el("input", {
                  attrs: shipFieldAttrs(ship, { type: "text", value: ship.jack.attitude || "" }),
                  dataset: { action: "jack-field", shipField: "jack.attitude" }
                })
              ])
            ]),
            el("div", { cls: "gm-jack-stat-block" }, [
              el("p", { cls: "gm-jack-block-title", text: "Attributes" }),
              el("div", { cls: "gm-form-grid gm-form-grid-jack-attributes" }, [
                ...Object.entries({
                  Agility: "jack.attributes.agility",
                  Strength: "jack.attributes.strength",
                  Vitality: "jack.attributes.vitality",
                  Alertness: "jack.attributes.alertness",
                  Intelligence: "jack.attributes.intelligence",
                  Willpower: "jack.attributes.willpower",
                  Life: "jack.lifePoints",
                  Initiative: "jack.initiative"
                }).map(([label, path]) => el("label", { cls: "gm-form-field" }, [
                  el("span", { text: label }),
                  el("input", {
                    attrs: shipFieldAttrs(ship, { type: "text", value: valueAtPath(ship, path) }),
                    dataset: { action: "jack-field", shipField: path }
                  })
                ]))
              ])
            ]),
            el("div", { cls: "gm-jack-stat-block" }, [
              el("p", { cls: "gm-jack-block-title", text: "Key Skills" }),
              el("ul", { cls: "gm-jack-skill-list" }, ship.jack.skills.map((skill) => el("li", { cls: "gm-jack-skill-item", text: skill }))),
              el("div", { cls: "gm-note-field" }, [
                el("label", { text: "Jack skills" }),
                jackSkillsField
              ])
            ]),
            el("label", { cls: "gm-form-field" }, [
              el("span", { text: "Jack Condition" }),
              el("select", {
                attrs: shipFieldAttrs(ship),
                dataset: { action: "jack-field", shipField: "jack.condition" }
              }, SHIP_SELECTS.jackCondition.map((value) => {
                const option = el("option", {
                  text: value,
                  attrs: { value }
                });
                option.selected = ship.jack.condition === value;
                return option;
              }))
            ]),
            el("div", { cls: "gm-note-field" }, [
              el("label", { text: "Jack traits / behavior notes" }),
              jackTraitsField
            ]),
            el("div", { cls: "gm-note-field" }, [
              el("label", { text: "Jack GM note" }),
              jackNotesField
            ])
          ])
        ])
      ])
    ]);
  }
  function renderEmptyCharacterState() {
    return el("div", { cls: "gm-empty-state gm-main-panel" }, [
      el("strong", { text: "No crew loaded yet." }),
      document.createTextNode(" Import one or more Character Crucible Serenity JSON exports to populate tabs, assign colors, and start initiative tracking.")
    ]);
  }
  function renderTabRail(session) {
    return el("section", { cls: "gm-tab-shell" }, [
      el("div", { cls: "gm-tab-rail", attrs: { role: "tablist", "aria-label": "GM console tabs" } }, [
        el("article", {
          cls: `gm-tab-card gm-tab-gm ${session.activeTab === "gm" || session.activeTab === "transit" ? "is-active" : ""}`.trim(),
          attrs: { style: "--tab-accent: #78d0be;" },
          dataset: { action: "select-tab", tabId: "gm" }
        }, [
          el("button", {
            cls: "gm-tab-select",
            attrs: { type: "button" },
            dataset: { action: "select-tab", tabId: "gm" }
          }, [
            el("div", { cls: "gm-tab-topline" }, [
              el("strong", { cls: "gm-tab-name", text: "GM" })
            ]),
            el("div", { cls: "gm-tab-badges" }, [
              renderBadge(`${session.crew.length} Crew`, "gm-badge-soft")
            ])
          ])
        ]),
        ...session.crew.map((member) => renderCharacterTab(member, session)),
        renderShipTab(session)
      ])
    ]);
  }
  function renderDashboard(root, session, flash) {
    root.innerHTML = "";
    const importInput = el("input", {
      cls: "gm-file-input",
      attrs: { id: "crewImportInput", type: "file", accept: ".json,application/json", multiple: "multiple" }
    });
    const activeMember = session.crew.find((member) => member.id === session.activeTab) || null;
    root.append(el("main", { cls: "gm-shell" }, [
      el("section", { cls: "gm-topbar" }, [
        el("div", {}, [
          el("p", { cls: "gm-kicker", text: "Serenity GM Console" }),
          el("h1", { cls: "gm-title", text: "GM Amanuensis, Serenity Edition" }),
          el("p", {
            cls: "gm-copy",
            text: "Run the table from a pinned GM tab, initiative-sorted crew tabs, and a dedicated ship board with Jack nested where he belongs."
          }),
          el("div", { cls: "gm-status-row" }, [
            el("div", {
              cls: `gm-status ${flash?.kind || "info"}`,
              text: flash?.text || "Ready for crew import.",
              attrs: { "aria-live": "polite" }
            }),
            el("div", { cls: "gm-session-meta" }, [
              el("span", { cls: "gm-pill", text: `Crew Loaded: ${session.crew.length}` }),
              el("span", { cls: "gm-pill", text: session.currentTurnMemberId ? "Turn Marker: active" : "Turn Marker: standby" })
            ])
          ])
        ]),
        el("div", { cls: "gm-toolbar" }, [
          el("label", { cls: "gm-file-button", text: "Import Character JSON" }, [importInput]),
          el("button", {
            cls: "gm-button",
            text: "Paste Handoff Code",
            attrs: { type: "button" },
            dataset: { action: "paste-handoff-code" }
          }),
          el("button", {
            cls: "gm-button",
            text: "Clear Crew",
            attrs: {
              type: "button"
            },
            dataset: { action: "clear-crew" }
          })
        ])
      ]),
      renderTabRail(session),
      session.activeTab === "gm" ? renderGMUtilityPanel(session) : session.activeTab === "transit" ? renderTransitPanel() : session.activeTab === "ship" ? renderShipPanel(session.ship) : activeMember ? renderCharacterPanel(activeMember, session) : renderEmptyCharacterState()
    ]));
    return { importInput };
  }

  // gm_amanuensis/assets/js/storage.js
  var STORAGE_KEY = "gm_amanuensis_serenity_session";
  var SHIP_STORAGE_KEY = "gm_amanuensis_serenity_ship";
  var ENEMY_TRACKER_STORAGE_KEY = "gm_amanuensis_serenity_enemy_trackers";
  var STORAGE_VERSION = 5;
  function safeSetItem(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`GM Amanuensis could not persist ${key}.`, error);
      return false;
    }
  }
  function safeParseItem(key) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (error) {
      localStorage.removeItem(key);
      return null;
    }
  }
  function saveSession(session) {
    const payload = {
      version: STORAGE_VERSION,
      savedAt: (/* @__PURE__ */ new Date()).toISOString(),
      activeTab: session.activeTab,
      currentTurnMemberId: session.currentTurnMemberId,
      ship: session.ship,
      enemyTrackers: session.enemyTrackers,
      crew: session.crew
    };
    safeSetItem(STORAGE_KEY, JSON.stringify(payload));
    safeSetItem(SHIP_STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      savedAt: payload.savedAt,
      ship: session.ship
    }));
    safeSetItem(ENEMY_TRACKER_STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      savedAt: payload.savedAt,
      enemyTrackers: session.enemyTrackers
    }));
  }
  function loadSession() {
    const session = safeParseItem(STORAGE_KEY);
    const shipSnapshot = safeParseItem(SHIP_STORAGE_KEY);
    const enemyTrackerSnapshot = safeParseItem(ENEMY_TRACKER_STORAGE_KEY);
    if (!session && !shipSnapshot && !enemyTrackerSnapshot) {
      return null;
    }
    return {
      ...session || {},
      ...shipSnapshot?.ship ? { ship: shipSnapshot.ship } : {},
      ...enemyTrackerSnapshot?.enemyTrackers ? { enemyTrackers: enemyTrackerSnapshot.enemyTrackers } : {}
    };
  }

  // gm_amanuensis/assets/js/app.js
  function describeError(error, fallback = "Unexpected error.") {
    if (error instanceof Error && error.message) return error.message;
    return fallback;
  }
  function buildImportMessage(addedCount, replacedCount, rejected) {
    const parts = [];
    if (addedCount > 0) {
      parts.push(`Imported ${addedCount} crew member${addedCount === 1 ? "" : "s"} into the GM console.`);
    }
    if (replacedCount > 0) {
      parts.push(`Updated ${replacedCount} existing crew tab${replacedCount === 1 ? "" : "s"} with fresher Character Crucible data.`);
    }
    if (rejected.length > 0) {
      parts.push(`Skipped ${rejected.length}: ${rejected.map((entry) => `${entry.sourceName}: ${entry.message}`).join(" | ")}`);
    }
    if (parts.length === 0) {
      return {
        text: "No files were selected.",
        kind: "warn"
      };
    }
    return {
      text: parts.join(" "),
      kind: rejected.length > 0 ? "warn" : "ok"
    };
  }
  function buildPipelineErrorMessage(stage, error) {
    const label = {
      import: "Import failed",
      merge: "Imported crew could not be added to the session",
      persist: "Imported crew loaded, but session persistence failed",
      render: "Imported crew loaded, but the dashboard could not rerender",
      handoff: "Character handoff failed"
    }[stage] || "Import failed";
    return {
      text: `${label}: ${describeError(error)}`,
      kind: "error"
    };
  }
  function renderFatalError(root, flash, error) {
    root.innerHTML = "";
    const shell = document.createElement("main");
    shell.className = "gm-shell";
    const panel = document.createElement("section");
    panel.className = "gm-topbar gm-main-panel gm-fatal-panel";
    const kicker = document.createElement("p");
    kicker.className = "gm-kicker";
    kicker.textContent = "GM Console Error";
    const title = document.createElement("h1");
    title.className = "gm-title";
    title.textContent = "GM Amanuensis hit a blocking UI error";
    const copy = document.createElement("p");
    copy.className = "gm-copy";
    copy.textContent = flash?.text || "The dashboard could not finish rendering after the latest change.";
    const detail = document.createElement("pre");
    detail.className = "gm-fatal-detail";
    detail.textContent = describeError(error);
    panel.append(kicker, title, copy, detail);
    shell.append(panel);
    root.append(shell);
  }
  function updateNestedValue(target, path, value) {
    const [head, ...rest] = path;
    if (!head) return target;
    if (rest.length === 0) {
      target[head] = value;
      return target;
    }
    if (!target[head] || typeof target[head] !== "object" || Array.isArray(target[head])) {
      target[head] = {};
    }
    updateNestedValue(target[head], rest, value);
    return target;
  }
  function parseLineList(value) {
    return String(value || "").split("\n").map((entry) => entry.trim()).filter(Boolean);
  }
  function convertHandoffsToImportedRecords(entries) {
    return entries.map((entry) => ({
      payload: entry.payload,
      sourceName: `${entry.summary?.name || entry.payload?.basics?.name || "Crew Member"} handoff`
    }));
  }
  function bootGMAmanuensis(root = document.getElementById("app")) {
    if (!root) return null;
    let session = createSessionState(loadSession());
    let flash = {
      text: session.crew.length ? `Restored ${session.crew.length} crew member${session.crew.length === 1 ? "" : "s"} with initiative, ship state, turn state, and tab colors.` : "Import exported Serenity character JSON files to build your GM console.",
      kind: "info"
    };
    function persist() {
      saveSession(session);
    }
    function render() {
      try {
        const view = renderDashboard(root, session, flash);
        view.importInput?.addEventListener("change", handleImport);
      } catch (error) {
        renderFatalError(root, buildPipelineErrorMessage("render", error), error);
      }
    }
    function applyImportedRecords(imported, rejected = [], options = {}) {
      let addedCount = 0;
      let replacedCount = 0;
      let persistError = null;
      if (imported.length > 0) {
        try {
          const mergeOutcome = mergeImportedCrew(session, imported);
          session = mergeOutcome.session;
          addedCount = mergeOutcome.addedCount;
          replacedCount = mergeOutcome.replacedCount;
        } catch (error) {
          flash = buildPipelineErrorMessage("merge", error);
          if (options.render !== false) render();
          return { addedCount: 0, replacedCount: 0 };
        }
        try {
          persist();
        } catch (error) {
          persistError = error;
        }
      }
      flash = persistError ? buildPipelineErrorMessage("persist", persistError) : buildImportMessage(addedCount, replacedCount, rejected);
      if (options.render !== false) {
        render();
      }
      return { addedCount, replacedCount };
    }
    function importQueuedHandoffs(options = {}) {
      const queued = consumeQueuedGMHandshakes();
      if (queued.length === 0) return { addedCount: 0, replacedCount: 0 };
      return applyImportedRecords(convertHandoffsToImportedRecords(queued), [], options);
    }
    async function handleImport(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      try {
        const results = await importCrewFiles(files);
        applyImportedRecords(results.imported, results.rejected);
      } catch (error) {
        flash = buildPipelineErrorMessage("import", error);
        render();
      }
      event.target.value = "";
    }
    function commit(nextSession, nextFlash = null, options = {}) {
      session = nextSession;
      persist();
      if (nextFlash) {
        flash = nextFlash;
      }
      if (options.render !== false) {
        render();
      }
    }
    function patchCrewMember(memberId, mutator, nextFlash = null, options = {}) {
      commit(updateCrewMember(session, memberId, mutator), nextFlash, options);
    }
    function patchShip(path, value, options = {}) {
      commit(updateShipState(session, (ship) => updateNestedValue(ship, path.split("."), value)), options.flash || null, {
        render: options.render
      });
    }
    window.addEventListener("storage", (event) => {
      if (event.key !== getGMHandoffQueueKey()) return;
      importQueuedHandoffs();
    });
    root.addEventListener("click", async (event) => {
      const trigger = event.target.closest("[data-action]");
      if (!trigger) return;
      const { action, memberId, field, delta, tabId } = trigger.dataset;
      if (action === "paste-handoff-code") {
        let raw = "";
        if (navigator.clipboard && typeof navigator.clipboard.readText === "function") {
          try {
            raw = await navigator.clipboard.readText();
          } catch (error) {
          }
        }
        if (!String(raw || "").trim()) {
          raw = window.prompt("Paste the Serenity GM handoff code from Character Crucible.");
        }
        if (!raw) return;
        try {
          const handoff = decodeCharacterHandoffCode(raw);
          validateImportedPayload(handoff.payload);
          applyImportedRecords([{
            payload: handoff.payload,
            sourceName: `${handoff.summary?.name || handoff.payload?.basics?.name || "Crew Member"} handoff code`
          }], []);
        } catch (error) {
          flash = buildPipelineErrorMessage("handoff", error);
          render();
        }
        return;
      }
      if (action === "select-tab") {
        commit(setActiveTab(session, tabId || "gm"), null);
        return;
      }
      if (action === "advance-turn") {
        commit(advanceTurn(session), {
          text: "Current turn advanced in initiative order.",
          kind: "ok"
        });
        return;
      }
      if (action === "reset-round") {
        commit(resetRound(session), {
          text: "Round reset. All action states returned to Ready.",
          kind: "ok"
        });
        return;
      }
      if (action === "clear-initiative") {
        commit(clearInitiative(session), {
          text: "Initiative values cleared. Existing tab order was preserved as the new baseline.",
          kind: "ok"
        });
        return;
      }
      if (action === "clear-crew") {
        if (!window.confirm("Clear the imported crew roster and reset turn tracking? Ship data will stay as-is.")) return;
        commit(clearCrew(session), {
          text: "Crew roster cleared. Ship data and enemy trackers were left in place.",
          kind: "ok"
        });
        return;
      }
      if (action === "toggle-ship-edit-lock") {
        const nextLocked = !(session.ship?.editLocked === false);
        commit(updateShipState(session, (ship) => ({
          ...ship,
          editLocked: !nextLocked
        })), {
          text: nextLocked ? "Ship data unlocked for editing." : "Ship data locked against accidental edits.",
          kind: "ok"
        });
        return;
      }
      if (action === "remove-member" && memberId) {
        commit(removeCrewMember(session, memberId), {
          text: "Crew member removed from the active GM session.",
          kind: "ok"
        });
        return;
      }
      if (action === "set-enemy-life" && memberId) {
        const bubbleValue = Number.parseInt(trigger.dataset.value || "0", 10) || 0;
        const tracker = (session.enemyTrackers || []).find((entry) => entry.id === memberId);
        if (!tracker) return;
        const nextValue = tracker.life === bubbleValue ? bubbleValue - 1 : bubbleValue;
        commit(updateEnemyTracker(session, memberId, (entry) => ({
          ...entry,
          life: Math.max(0, nextValue)
        })), null, { render: false });
        render();
        return;
      }
      if (action === "clear-enemy-life" && memberId) {
        commit(updateEnemyTracker(session, memberId, (entry) => ({
          ...entry,
          life: 0
        })), null, { render: false });
        render();
        return;
      }
      if (action === "adjust-condition" && memberId && field) {
        const amount = Number.parseInt(delta || "0", 10);
        patchCrewMember(memberId, (member) => ({
          ...member,
          gm: {
            ...member.gm,
            [field]: Math.max(0, Number.parseInt(member.gm[field] || 0, 10) + amount)
          }
        }));
      }
    });
    root.addEventListener("change", (event) => {
      const target = event.target;
      const action = target.dataset.action;
      const memberId = target.dataset.memberId;
      const field = target.dataset.field;
      const shipField = target.dataset.shipField;
      if (shipField) {
        if (session.ship?.editLocked !== false) return;
        if (action === "jack-skills-field") {
          patchShip(shipField, parseLineList(target.value), { render: false });
          return;
        }
        patchShip(shipField, target.value, { render: false });
        return;
      }
      if (!action || !memberId || !field) return;
      if (action === "condition-number") {
        patchCrewMember(memberId, (member) => ({
          ...member,
          gm: {
            ...member.gm,
            [field]: Math.max(0, Number.parseInt(target.value || "0", 10) || 0)
          }
        }));
        return;
      }
      if (action === "condition-select") {
        patchCrewMember(memberId, (member) => ({
          ...member,
          gm: {
            ...member.gm,
            [field]: target.value
          }
        }));
        return;
      }
      if (action === "initiative-input") {
        patchCrewMember(memberId, (member) => ({
          ...member,
          gm: {
            ...member.gm,
            initiativeValue: target.value
          }
        }), {
          text: "Initiative updated. Matching totals are silently broken with hidden Agility rolls.",
          kind: "ok"
        });
      }
    });
    root.addEventListener("input", (event) => {
      const target = event.target;
      const action = target.dataset.action;
      const memberId = target.dataset.memberId;
      const field = target.dataset.field;
      const shipField = target.dataset.shipField;
      if (shipField) {
        if (session.ship?.editLocked !== false) return;
        if (action === "jack-skills-field") {
          patchShip(shipField, parseLineList(target.value), { render: false });
          return;
        }
        patchShip(shipField, target.value, { render: false });
        return;
      }
      if (action === "initiative-input" && memberId) {
        patchCrewMember(memberId, (member) => ({
          ...member,
          gm: {
            ...member.gm,
            initiativeValue: target.value
          }
        }), null);
        return;
      }
      if (action !== "condition-note" || !memberId || !field) return;
      commit(updateCrewMember(session, memberId, (member) => ({
        ...member,
        gm: {
          ...member.gm,
          [field]: target.value
        }
      })), null, { render: false });
    });
    importQueuedHandoffs({ render: false });
    render();
    return {
      getSession: () => structuredClone(session)
    };
  }
  bootGMAmanuensis();
})();
