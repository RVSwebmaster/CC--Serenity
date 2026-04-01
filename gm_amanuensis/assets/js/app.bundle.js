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
        plotPoints: 1,
        stun: 0,
        wounds: 0
      },
      meta: {
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
    "General Store",
    "Tailor",
    "Armory",
    "Techshop",
    "Medical",
    "Services",
    "Livestock / Critters"
  ];
  function makeId2() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `gear_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
  }
  function gear(id, name, category, credits, availability, summary, stats = "") {
    return { id, name, category, credits, availability, summary, stats };
  }
  var EQUIPMENT_CATALOG = [
    gear("filtration-canteen", "Filtration Canteen", "General Store", 1.2, "E", "Portable water filter for rough dirt-side travel."),
    gear("glowstick", "Glowstick", "General Store", 2, "E", "Cheap emergency light for dark holds, bad roads, and busted power."),
    gear("patch-tape", "Patch Tape", "General Store", 1.2, "E", "Quick field repairs for leaks, tears, and the kind of problems that cannot wait."),
    gear("rucksack", "Rucksack", "General Store", 2, "E", "Basic carry pack for a traveler who expects to haul their own trouble."),
    gear("disguise-kit", "Disguise Kit", "Tailor", 65.6, "C", "Wardrobe and makeup tools for false faces and quick role changes."),
    gear("pistol", "Pistol", "Armory", 18, "E", "Plain, practical sidearm for folk who need a gun without ceremony.", "Damage d6 W | Range 10"),
    gear("utility-knife", "Utility Knife", "Armory", 0.8, "E", "Everyday blade that still counts when things get ugly up close.", "Damage d2 W | Melee"),
    gear("databook", "DataBook", "Techshop", 30, "C", "Portable computing for records, planning, and Cortex access."),
    gear("fusion-torch", "Fusion Torch", "Techshop", 2.2, "C", "Compact cutter for metalwork, repairs, and very bad ideas."),
    gear("micro-transmitter", "Micro Transmitter", "Techshop", 8, "R", "Small transmitter for discreet communications and quiet coordination."),
    gear("multi-tool", "Multi-Tool", "Techshop", 2, "E", "Pocket problem-solver with a dozen mediocre answers and constant use."),
    gear("ocular", "Ocular", "Techshop", 6, "C", "Portable optics for seeing farther or closer than the naked eye."),
    gear("ship-linked-handset", "Ship-linked Handset", "Techshop", 3.2, "C", "Short-range comms tied into a ship or local network."),
    gear("tool-kit-basic", "Tool Kit, Basic", "Techshop", 14.4, "E", "Starter repair kit for honest mechanical work and field fixes."),
    gear("burn-gel", "Burn Gel", "Medical", 1.8, "E", "Fast treatment for heat and flash injuries before they get worse."),
    gear("doctors-bag", "Doctor\u2019s Bag", "Medical", 27.4, "C", "Field-ready medical bag for somebody with actual training."),
    gear("first-aid-kit", "First-Aid Kit", "Medical", 0.6, "E", "Bandages, antiseptic, and the bare minimum to keep someone breathing."),
    gear("gas-mask", "Gas Mask", "Medical", 4, "C", "Breathing protection for bad air, smoke, and ugly jobs."),
    gear("allied-postal-service", "Allied Postal Service", "Services", 1.2, "E", "Standard mail or parcel handling through respectable channels."),
    gear("full-physical", "Full Physical", "Services", 8, "E", "Routine medical exam and paperwork-level health check."),
    gear("minor-surgery", "Minor Surgery", "Services", 150, "C", "Clinical treatment that goes past first aid but below major reconstruction."),
    gear("cat", "Cat", "Livestock / Critters", 4, "E", "Small shipboard hunter and a fine judge of strangers."),
    gear("dog", "Dog", "Livestock / Critters", 6, "E", "Loyal animal, alarm system, and appetite with paws."),
    gear("goat-or-sheep", "Goat or Sheep", "Livestock / Critters", 10, "E", "Simple livestock for milk, wool, meat, or barter."),
    gear("horse", "Horse", "Livestock / Critters", 50, "C", "Reliable dirt-side transport when engines are not worth the fuel.")
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
      availability: entry.availability || catalogMatch?.availability || "",
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
  function makeId3() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return `crew_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }
  function sanitizeText(value, fallback = "") {
    return typeof value === "string" ? value : fallback;
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
        name: "Jack",
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
    const validTabs = /* @__PURE__ */ new Set(["gm", "ship", ...crewIds]);
    const activeTab = validTabs.has(session?.activeTab) ? session.activeTab : "gm";
    const currentTurnMemberId = crewIds.has(session?.currentTurnMemberId) ? session.currentTurnMemberId : crew[0]?.id || null;
    return {
      crew,
      ship: sanitizeShipState(session?.ship),
      activeTab,
      currentTurnMemberId
    };
  }
  function makeImportedMembers(session, importedCrew) {
    const usedColors = session.crew.map((member) => member.gm.tabColor).filter(Boolean);
    return importedCrew.map((record) => {
      const tabColor = pickNextTabColor(usedColors);
      usedColors.push(tabColor);
      return normalizeCrewMember({
        id: makeId3(),
        sourceName: record.sourceName,
        importedAt: (/* @__PURE__ */ new Date()).toISOString(),
        payload: record.payload,
        gm: { tabColor }
      }, tabColor);
    }).filter(Boolean);
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
    const newMembers = makeImportedMembers(session, importedCrew);
    const nextActiveTab = session.crew.length === 0 && newMembers.length > 0 ? newMembers[0].id : session.activeTab;
    return normalizeSession({
      ...session,
      crew: [...session.crew, ...newMembers],
      activeTab: nextActiveTab,
      currentTurnMemberId: session.currentTurnMemberId || newMembers[0]?.id || null
    });
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
  function clearCrew() {
    return {
      crew: [],
      ship: createDefaultShipState(),
      activeTab: "gm",
      currentTurnMemberId: null
    };
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
  function renderJackStat(label, value) {
    return el("div", { cls: "gm-jack-stat" }, [
      el("span", { cls: "gm-jack-stat-label", text: label }),
      el("span", { cls: "gm-jack-stat-value", text: value })
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
      ])
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
    const shipTraitItems = parseShipList(ship.traits);
    const shipSkillItems = parseShipList(ship.skills);
    const shipGearField = el("textarea", {
      cls: "gm-ship-field-textarea",
      attrs: { rows: "2", placeholder: "Gear" },
      dataset: { action: "ship-field", shipField: "specifications.gear" }
    });
    shipGearField.value = ship.specifications.gear || "";
    const shipDamageField = el("textarea", {
      cls: "gm-ship-field-textarea",
      attrs: { rows: "3", placeholder: "Stress, hull damage, broken systems, jury-rigged fixes." },
      dataset: { action: "ship-field", shipField: "condition.currentDamage" }
    });
    shipDamageField.value = ship.condition.currentDamage || "";
    const shipTraitsField = el("textarea", {
      attrs: { rows: "4", placeholder: "Ship traits, quirks, complications, or edges." },
      dataset: { action: "ship-field", shipField: "traits" }
    });
    shipTraitsField.value = ship.traits || "";
    const shipSkillsField = el("textarea", {
      attrs: { rows: "4", placeholder: "Ship skills, specialties, or operational strengths." },
      dataset: { action: "ship-field", shipField: "skills" }
    });
    shipSkillsField.value = ship.skills || "";
    const shipNotesField = el("textarea", {
      attrs: { rows: "5", placeholder: "Ship notes, cargo trouble, fuel worries, docking headaches, or scene hooks." },
      dataset: { action: "ship-field", shipField: "notes" }
    });
    shipNotesField.value = ship.notes || "";
    const shipPerformanceNotesField = el("textarea", {
      attrs: { rows: "4", placeholder: "GM notes tied to thrust, handling, heat, subsystem strain, or scene performance." },
      dataset: { action: "ship-field", shipField: "condition.performanceNotes" }
    });
    shipPerformanceNotesField.value = ship.condition.performanceNotes || "";
    const jackTraitsField = el("textarea", {
      attrs: { rows: "3", placeholder: "Behavior notes, favorite ducts, habits, grudges, or tricks." },
      dataset: { action: "jack-field", shipField: "jack.traits" }
    });
    jackTraitsField.value = ship.jack.traits || "";
    const jackNotesField = el("textarea", {
      attrs: { rows: "3", placeholder: "Short GM note for Jack." },
      dataset: { action: "jack-field", shipField: "jack.notes" }
    });
    jackNotesField.value = ship.jack.notes || "";
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
            renderBadge(ship.condition.posture, "gm-badge-soft")
          ])
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
                  attrs: { type: "text", value: ship.name },
                  dataset: { action: "ship-field", shipField: "name" }
                })
              ]),
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "Class / Type" }),
                el("input", {
                  attrs: { type: "text", value: ship.className },
                  dataset: { action: "ship-field", shipField: "className" }
                })
              ]),
              el("label", { cls: "gm-form-field gm-form-field-wide" }, [
                el("span", { text: "Concept / Role Line" }),
                el("input", {
                  attrs: { type: "text", value: ship.concept },
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
                attrs: { type: "text", value: valueAtPath(ship, path) },
                dataset: { action: "ship-field", shipField: path }
              })
            ])))
          ]),
          el("section", { cls: "gm-utility-card" }, [
            el("h3", { cls: "gm-utility-title", text: "Attributes" }),
            el("div", { cls: "gm-form-grid gm-form-grid-ship-attributes" }, SHIP_ATTRIBUTE_FIELDS.map(([label, path]) => el("label", { cls: "gm-form-field" }, [
              el("span", { text: label }),
              el("input", {
                attrs: { type: "text", value: valueAtPath(ship, path) },
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
                  attrs: { type: "text", value: ship.condition.currentLife },
                  dataset: { action: "ship-field", shipField: "condition.currentLife" }
                })
              ]),
              el("label", { cls: "gm-form-field" }, [
                el("span", { text: "System State" }),
                el("input", {
                  attrs: { type: "text", value: ship.condition.systemState },
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
            el("p", { cls: "gm-jack-role", text: ship.jack.role }),
            el("p", { cls: "gm-jack-attitude", text: ship.jack.attitude }),
            el("div", { cls: "gm-jack-stat-block" }, [
              el("p", { cls: "gm-jack-block-title", text: "Attributes" }),
              el("div", { cls: "gm-jack-attribute-line", text: [
                `Agl ${ship.jack.attributes.agility}`,
                `Str ${ship.jack.attributes.strength}`,
                `Vit ${ship.jack.attributes.vitality}`,
                `Ale ${ship.jack.attributes.alertness}`,
                `Int ${ship.jack.attributes.intelligence}`,
                `Wil ${ship.jack.attributes.willpower}`
              ].join(" | ") }),
              el("div", { cls: "gm-jack-stat-row" }, [
                renderJackStat("Life", ship.jack.lifePoints),
                renderJackStat("Initiative", ship.jack.initiative)
              ])
            ]),
            el("div", { cls: "gm-jack-stat-block" }, [
              el("p", { cls: "gm-jack-block-title", text: "Key Skills" }),
              el("ul", { cls: "gm-jack-skill-list" }, ship.jack.skills.map((skill) => el("li", { cls: "gm-jack-skill-item", text: skill })))
            ]),
            el("label", { cls: "gm-form-field" }, [
              el("span", { text: "Jack Condition" }),
              el("select", {
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
          cls: `gm-tab-card gm-tab-gm ${session.activeTab === "gm" ? "is-active" : ""}`.trim(),
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
            text: "Clear Crew",
            attrs: {
              type: "button"
            },
            dataset: { action: "clear-crew" }
          })
        ])
      ]),
      renderTabRail(session),
      session.activeTab === "gm" ? renderGMUtilityPanel(session) : session.activeTab === "ship" ? renderShipPanel(session.ship) : activeMember ? renderCharacterPanel(activeMember, session) : renderEmptyCharacterState()
    ]));
    return { importInput };
  }

  // gm_amanuensis/assets/js/storage.js
  var STORAGE_KEY = "gm_amanuensis_serenity_session";
  var STORAGE_VERSION = 3;
  function saveSession(session) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      version: STORAGE_VERSION,
      savedAt: (/* @__PURE__ */ new Date()).toISOString(),
      activeTab: session.activeTab,
      currentTurnMemberId: session.currentTurnMemberId,
      ship: session.ship,
      crew: session.crew
    }));
  }
  function loadSession() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : null;
    } catch (error) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }

  // gm_amanuensis/assets/js/app.js
  function describeError(error, fallback = "Unexpected error.") {
    if (error instanceof Error && error.message) return error.message;
    return fallback;
  }
  function buildImportMessage(importedCount, rejected) {
    const parts = [];
    if (importedCount > 0) {
      parts.push(`Imported ${importedCount} crew file${importedCount === 1 ? "" : "s"} into the GM console.`);
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
      render: "Imported crew loaded, but the dashboard could not rerender"
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
    async function handleImport(event) {
      const files = event.target.files;
      if (!files || files.length === 0) return;
      try {
        const results = await importCrewFiles(files);
        let persistError = null;
        if (results.imported.length > 0) {
          try {
            session = mergeImportedCrew(session, results.imported);
          } catch (error) {
            flash = buildPipelineErrorMessage("merge", error);
            event.target.value = "";
            render();
            return;
          }
          try {
            persist();
          } catch (error) {
            persistError = error;
          }
        }
        flash = persistError ? buildPipelineErrorMessage("persist", persistError) : buildImportMessage(results.imported.length, results.rejected);
      } catch (error) {
        flash = buildPipelineErrorMessage("import", error);
      }
      event.target.value = "";
      render();
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
    root.addEventListener("click", (event) => {
      const trigger = event.target.closest("[data-action]");
      if (!trigger) return;
      const { action, memberId, field, delta, tabId } = trigger.dataset;
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
        if (!window.confirm("Clear the entire GM session roster and reset the ship board?")) return;
        commit(clearCrew(), {
          text: "Crew, ship, and Jack state reset cleanly.",
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
    render();
    return {
      getSession: () => structuredClone(session)
    };
  }
  bootGMAmanuensis();
})();
