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
  var PLOT_POINT_MAX = 6;
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
  function createPurchasedGearEntry(item) {
    return {
      id: makeId2(),
      catalogId: item.id,
      name: item.name,
      category: item.category,
      credits: item.credits,
      availability: item.availability,
      note: item.note || item.summary || ""
    };
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
  var CURATED_ASSETS = [
    { name: "Allure", allowedRatings: ["d2", "d4"], summary: "Adds an edge when charm and appeal genuinely matter." },
    { name: "Athlete", allowedRatings: ["d2", "d4"], summary: "A broad edge on physical action where training and body control shine." },
    { name: "Born Behind the Wheel", allowedRatings: ["d2", "d4"], summary: "A pilot or driver trait for when instinct and vehicle handling carry the day." },
    { name: "Cortex Specter", allowedRatings: ["d2", "d4"], summary: "You move through the Cortex fast and leave less trace than most." },
    { name: "Fightin\u2019 Type", allowedRatings: ["d4"], summary: "You are plainly built and trained for violence." },
    { name: "Friends in High Places", allowedRatings: ["d2"], summary: "Connections with officials, officers, or the well-heeled." },
    { name: "Friends in Low Places", allowedRatings: ["d2"], summary: "Underworld contacts, dockside rumor, and street-level help." },
    { name: "Good Name", allowedRatings: ["d2", "d4"], summary: "Your reputation opens doors with the right sort of folk." },
    { name: "Healthy as a Horse", allowedRatings: ["d2", "d4"], summary: "Your body shrugs off strain and sickness better than most." },
    { name: "Heavy Tolerance", allowedRatings: ["d2"], summary: "Drink, drugs, or poisons hit you slower than they should." },
    { name: "Highly Educated", allowedRatings: ["d2"], summary: "Formal learning, advanced study, or specialist schooling." },
    { name: "Intimidatin\u2019 Manner", allowedRatings: ["d2"], summary: "Your presence alone can put people on the back foot." },
    { name: "Leadership", allowedRatings: ["d2", "d4"], summary: "People are more willing to follow your lead under pressure." },
    { name: "Lightnin\u2019 Reflexes", allowedRatings: ["d4"], summary: "A serious edge when fractions of a second matter." },
    { name: "Math Whiz", allowedRatings: ["d2"], summary: "Numbers, calculations, and estimates come easy to you." },
    { name: "Mechanical Empathy", allowedRatings: ["d2"], summary: "Machines make sense to you in a hands-on, instinctive way." },
    { name: "Mean Left Hook", allowedRatings: ["d2"], summary: "A specific gift for hurting people up close." },
    { name: "Military Rank", allowedRatings: ["d2"], summary: "Former or current rank still carries weight in the right circles." },
    { name: "Moneyed Individual", allowedRatings: ["d4"], summary: "You have real financial backing, not just pocket change." },
    { name: "Natural Linguist", allowedRatings: ["d2"], summary: "Languages and dialects come to you faster than they should." },
    { name: "Nature Lover", allowedRatings: ["d2"], summary: "The outdoors is where your judgment and comfort improve." },
    { name: "Nose for Trouble", allowedRatings: ["d2", "d4"], summary: "You sense bad turns before they fully show themselves." },
    { name: "Reader", allowedRatings: ["d2", "d4"], summary: "Books, records, and careful study pay off for you." },
    { name: "Registered Companion", allowedRatings: ["d2"], summary: "Certified social training opens doors and shapes expectations." },
    { name: "Religiosity", allowedRatings: ["d2", "d4"], summary: "Faith gives you grounding, community, or moral force." },
    { name: "Sharp Sense", allowedRatings: ["d2"], summary: "One sense is noticeably keener than most folk get." },
    { name: "Steady Calm", allowedRatings: ["d2", "d4"], summary: "Nerves hold when panic would wreck lesser souls." },
    { name: "Sweet and Cheerful", allowedRatings: ["d2"], summary: "Warmth and optimism make people lower their guard." },
    { name: "Talented", allowedRatings: ["d2", "d4"], summary: "Pick one narrow area where you are notably better than most." },
    { name: "Things Go Smooth", allowedRatings: ["d2", "d4"], summary: "Luck or timing seems to favor you at odd moments." },
    { name: "Tough as Nails", allowedRatings: ["d2", "d4"], summary: "Hard to put down, harder to keep there." },
    { name: "Total Recall", allowedRatings: ["d4"], summary: "You remember detail with unusual completeness." },
    { name: "Trustworthy Gut", allowedRatings: ["d2", "d4"], summary: "A practiced instinct for reading danger, lies, or bad turns." },
    { name: "Two-Fisted", allowedRatings: ["d4"], summary: "You can bring both hands into a fight without losing the thread." },
    { name: "Walking Timepiece", allowedRatings: ["d2"], summary: "You keep exact time in your head with eerie reliability." },
    { name: "Wears a Badge", allowedRatings: ["d2", "d4"], summary: "Lawful authority or the look of it changes how people respond." }
  ];
  var CURATED_COMPLICATIONS = [
    { name: "Allergy", allowedRatings: ["d2", "d4"], summary: "A substance or condition can lay you low fast." },
    { name: "Amorous", allowedRatings: ["d2"], summary: "Romantic or physical temptation can turn your head at bad times." },
    { name: "Amputee", allowedRatings: ["d2"], summary: "Missing a limb changes what your body can do easily." },
    { name: "Bleeder", allowedRatings: ["d4"], summary: "Injury turns serious faster for you than it should." },
    { name: "Blind", allowedRatings: ["d4"], summary: "Lack of sight changes nearly every practical decision you make." },
    { name: "Branded", allowedRatings: ["d2", "d4"], summary: "A mark on your body or record follows you where you go." },
    { name: "Chip on the Shoulder", allowedRatings: ["d2", "d4"], summary: "You are quick to take offense and slower to let it go." },
    { name: "Combat Paralysis", allowedRatings: ["d2", "d4"], summary: "Violence can lock you up when the room turns ugly." },
    { name: "Coward", allowedRatings: ["d2"], summary: "You want to live, and fear pushes your choices." },
    { name: "Credo", allowedRatings: ["d2", "d4"], summary: "A code, belief, or promise that can cost you dearly." },
    { name: "Crude", allowedRatings: ["d2"], summary: "You lack polish, tact, or basic restraint at bad times." },
    { name: "Dead Broke", allowedRatings: ["d2"], summary: "Money trouble dogs every plan." },
    { name: "Deadly Enemy", allowedRatings: ["d2"], summary: "Someone dangerous has reason to want you hurt or dead." },
    { name: "Deaf", allowedRatings: ["d4"], summary: "Lack of hearing changes how you catch danger and meaning." },
    { name: "Dull Sense", allowedRatings: ["d2"], summary: "One sense is worse than it ought to be." },
    { name: "Easy Mark", allowedRatings: ["d4"], summary: "Sharper folk spot you as someone they can work over." },
    { name: "Ego Signature", allowedRatings: ["d2"], summary: "You leave a recognizable personal stamp on what you do." },
    { name: "Filcher", allowedRatings: ["d2"], summary: "You have a bad habit of taking things that are not yours." },
    { name: "Forked Tongue", allowedRatings: ["d2"], summary: "Lying comes too easy, even when honesty would serve better." },
    { name: "Greedy", allowedRatings: ["d2"], summary: "You reach for profit even when it is the wrong move." },
    { name: "Hero Worship", allowedRatings: ["d2"], summary: "Admiration for the wrong person can bend your judgment." },
    { name: "Hooked", allowedRatings: ["d2", "d4"], summary: "You depend on a substance, treatment, or fix." },
    { name: "Leaky Brainpan", allowedRatings: ["d4"], summary: "Your grip on reality, memory, or reason is not reliable." },
    { name: "Lightweight", allowedRatings: ["d2"], summary: "Drink, drugs, pain, or shock hit you harder than most." },
    { name: "Little Person", allowedRatings: ["d2"], summary: "Your size changes what the world assumes and how it fits you." },
    { name: "Loyal", allowedRatings: ["d2"], summary: "Your obligations to a person, family, cause, or crew can bind you hard." },
    { name: "Memorable", allowedRatings: ["d2"], summary: "People notice you, and anonymity slips through your fingers." },
    { name: "Mute", allowedRatings: ["d4"], summary: "Lack of speech changes how you communicate under pressure." },
    { name: "Non-Fightin\u2019 Type", allowedRatings: ["d2"], summary: "You are not built for violence, and it shows." },
    { name: "Overconfident", allowedRatings: ["d2"], summary: "You think you can handle more than you ought." },
    { name: "Paralyzed", allowedRatings: ["d4"], summary: "Loss of movement in part of your body sharply limits action." },
    { name: "Phobia", allowedRatings: ["d2"], summary: "One fear can seize control when it gets too close." },
    { name: "Portly", allowedRatings: ["d2", "d4"], summary: "Extra weight makes some physical demands harder to meet." },
    { name: "Prejudice", allowedRatings: ["d2", "d4"], summary: "Bias or hatred colors your judgment." },
    { name: "Sadistic", allowedRatings: ["d4"], summary: "Cruelty tempts you when you hold power over others." },
    { name: "Scrawny", allowedRatings: ["d2"], summary: "Lack of size or muscle works against you in hard labor and force." },
    { name: "Slow Learner", allowedRatings: ["d2"], summary: "New lessons take longer to stick than they should." },
    { name: "Soft", allowedRatings: ["d2"], summary: "You are not built for hardship, filth, or extended suffering." },
    { name: "Stingy", allowedRatings: ["d2"], summary: "You hate parting with money, even when it would help." },
    { name: "Straight Shooter", allowedRatings: ["d2"], summary: "You say things plain, even when tact would save blood." },
    { name: "Superstitious", allowedRatings: ["d2"], summary: "Signs, omens, and ritual can steer your choices." },
    { name: "Things Don\u2019t Go Smooth", allowedRatings: ["d2", "d4"], summary: "Luck, timing, and coincidence have a way of turning sour around you." },
    { name: "Traumatic Flashes", allowedRatings: ["d2", "d4"], summary: "The past can seize the present without warning." },
    { name: "Twitchy", allowedRatings: ["d2"], summary: "Jitters, nerves, or sudden reactions can spoil a steady moment." },
    { name: "Ugly as Sin", allowedRatings: ["d2"], summary: "Looks can work against you before you say a word." },
    { name: "Weak Stomach", allowedRatings: ["d2", "d4"], summary: "Blood, gore, or foul conditions hit you harder than most." }
  ];
  var REPEATABLE_TRAIT_NAMES = ["Loyal"];
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
  function getTraitInfo(category, trait, curated) {
    const label = category === "asset" ? "Asset" : "Complication";
    const defaultSummary = category === "asset" ? "Pick a trait to see the basic edge it gives a Greenhorn." : "Pick a trait to see the basic trouble it brings with it.";
    if (!trait) {
      return {
        title: `No ${label} selected`,
        summary: defaultSummary,
        ratings: "d2 or d4 depending on the trait."
      };
    }
    if ((trait.source || "curated") === "manual") {
      return {
        title: trait.name || `Custom ${label}`,
        summary: "Manual entry. Use Notes to record the exact effect, limit, or story hook you want the GM to remember.",
        ratings: trait.rating === "none" ? "Pick a die rating to price this custom trait." : `Current rating: ${trait.rating}.`
      };
    }
    const traitMeta = curated.find((item) => item.name === trait.name);
    if (!traitMeta) {
      return {
        title: trait.name || `Choose an ${label}`,
        summary: defaultSummary,
        ratings: "Allowed ratings appear once a curated trait is chosen."
      };
    }
    return {
      title: traitMeta.name,
      summary: traitMeta.summary,
      ratings: `Allowed ratings: ${traitMeta.allowedRatings.join(", ")}`
    };
  }
  function chooseActiveTrait(list, category) {
    const activeId = activeTraitSelection[category];
    const active = list.find((trait) => trait.id === activeId) || list.find((trait) => trait.name) || list[0] || null;
    activeTraitSelection[category] = active?.id || null;
    return active;
  }
  function getUnavailableTraitNames(stateList, currentTrait) {
    return stateList.filter((item) => item.id !== currentTrait.id && item.name && !isRepeatableTrait(item.name)).map((item) => item.name);
  }
  function getBlockedTraitNames(list, oppositeList, currentTrait) {
    const blocked = /* @__PURE__ */ new Set();
    [...list, ...oppositeList].filter((item) => item.id !== currentTrait.id && item.name).forEach((item) => {
      getMutuallyExclusiveTraits(item.name).forEach((name) => blocked.add(name));
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
    const infoRatings = el("p", { cls: "trait-info-line muted" });
    const infoBox = el("div", { cls: "trait-info-box" }, [
      el("div", { cls: "trait-info-label", text: category === "asset" ? "Asset explainer" : "Complication explainer" }),
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
      const isLegacyManual = (trait.source || "curated") === "manual";
      const traitMeta = curated.find((item) => item.name === trait.name);
      const ownSelections = getUnavailableTraitNames(list, trait);
      const blockedSelections = getBlockedTraitNames(list, oppositeList, trait);
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
          if ((ownSelections.includes(item.name) || blockedSelections.has(item.name)) && item.name !== trait.name) return;
          const opt = document.createElement("option");
          opt.value = item.name;
          opt.textContent = item.name;
          if (trait.name === item.name) opt.selected = true;
          nameInput.append(opt);
        });
      }
      nameInput.addEventListener("input", (event) => {
        activeTraitSelection[category] = trait.id;
        onChange((draft) => {
          const target = draft.traits[category === "asset" ? "assets" : "complications"].find((item) => item.id === trait.id);
          target.name = event.target.value;
          const match = curated.find((item) => item.name === target.name);
          if (match && !match.allowedRatings.includes(target.rating)) {
            target.rating = match.allowedRatings[0];
          }
        });
      });
      nameWrap.append(nameInput);
      const ratingSelect = document.createElement("select");
      const allowedRatings = traitMeta?.allowedRatings || TRAIT_OPTIONS.filter((item) => item !== "none");
      ["none", ...allowedRatings].forEach((rating) => {
        const opt = document.createElement("option");
        opt.value = rating;
        opt.textContent = rating === "none" ? "\u2014" : rating;
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
          el("small", { cls: "muted", text: `${entry.category} \u2022 ${entry.availability}${entry.note ? ` \u2022 ${entry.note}` : ""}` })
        ]),
        el("span", { cls: "points-badge", text: formatMoney(entry.credits, "\u20A1", "0 \u20A1") })
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
      meta.textContent = `${item.category} \u2022 ${formatMoney(item.credits, "\u20A1")} \u2022 ${item.availability}`;
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
        option.textContent = item.name;
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
      (entry) => el("li", { text: `${entry.name} (${formatMoney(entry.credits, "\xE2\u201A\xA1")}, ${entry.availability})` })
    ));
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
        el("p", { html: `<strong>Name:</strong> ${state2.character.basics.name || "\xE2\u20AC\u201D"}` }),
        el("p", { html: `<strong>Concept:</strong> ${state2.character.basics.concept || "\xE2\u20AC\u201D"}` }),
        state2.character.basics.quote ? el("p", { html: `<strong>Quote:</strong> ${state2.character.basics.quote}` }) : null,
        el("p", { html: `<strong>Role:</strong> ${resolveRoleLabel(state2.character.basics)}` }),
        el("p", { html: `<strong>Role Skill:</strong> ${state2.character.basics.roleSkill || "\xE2\u20AC\u201D"}` }),
        el("p", { html: `<strong>Homeworld:</strong> ${state2.character.basics.homeworld || "\xE2\u20AC\u201D"}` })
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Crew Hooks" }),
        el("p", { html: `<strong>Why the crew keeps them:</strong> ${state2.character.basics.crewValue || "\xE2\u20AC\u201D"}` }),
        el("p", { html: `<strong>Connection:</strong> ${state2.character.basics.crewConnection || "\xE2\u20AC\u201D"}` }),
        el("p", { html: `<strong>What they want:</strong> ${state2.character.basics.crewMotivation || "\xE2\u20AC\u201D"}` })
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Skills & Specialties" }),
        summarizeSkills(state2.character)
      ]),
      el("div", { cls: "summary-card" }, [
        el("h3", { text: "Gear & Money" }),
        el("p", { html: `<strong>Starting Credits:</strong> ${formatMoney(resolveStartingCredits(state2.character), "\xE2\u201A\xA1")}` }),
        el("p", { html: `<strong>Current Credits:</strong> ${formatMoney(calculateCurrentCredits(state2.character), "\xE2\u201A\xA1")}` }),
        el("p", { html: `<strong>Catalog Gear Total:</strong> ${formatMoney(getPurchasedGearTotal(state2.character.details), "\xE2\u201A\xA1", "0 \xE2\u201A\xA1")}` }),
        el("p", { html: `<strong>Platinum Pieces:</strong> ${formatMoney(state2.character.details.platinum, "p")}` }),
        el("p", { html: `<strong>Money Notes:</strong> ${state2.character.details.moneyNotes || "\xE2\u20AC\u201D"}` }),
        summarizePurchasedGear(state2.character),
        el("p", { html: `<strong>Additional Personal Gear:</strong> ${state2.character.details.gear || "\xE2\u20AC\u201D"}` }),
        el("p", { html: `<strong>Extra Notes:</strong> ${state2.character.details.notes || "\xE2\u20AC\u201D"}` })
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
      (entry) => el("li", { text: `${entry.name} (${formatMoney(entry.credits, "\u20A1")}, ${entry.availability})` })
    ));
  }
  function renderTraits(list) {
    const filtered = list.filter((item) => item.name && item.rating !== "none");
    if (!filtered.length) return el("p", { cls: "muted", text: "None selected." });
    return el("ul", { cls: "summary-list" }, filtered.map(
      (trait) => el("li", { text: `${trait.name} ${trait.rating}${trait.notes ? ` - ${trait.notes}` : ""}` })
    ));
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
    const current = clampTrackerValue(character.trackers?.plotPoints ?? 1, PLOT_POINT_MAX);
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
      el("section", { cls: "sheet-block" }, [el("h3", { text: "Assets" }), renderTraits(state2.character.traits.assets)]),
      el("section", { cls: "sheet-block" }, [el("h3", { text: "Complications" }), renderTraits(state2.character.traits.complications)])
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
