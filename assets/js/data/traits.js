const RAW_CURATED_ASSETS = [
  {
    name: 'A Moment in Time',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You are exceptionally skilled at detaching yourself from your current circumstances.',
    description: 'Whether through training, practice, or sheer nature, you can compartmentalize physical pain or emotional pain and set it aside until a more convenient moment.',
    benefits: {
      d4: 'In combat, this asset lets you keep fightin\' despite injury. In social interactions, normal Skill rolls to read your reactions or true feelings automatically fail unless you want them to succeed. A Reader suffers a -2 Skill step when trying to read you.'
    },
    note: 'You automatically resist the urge to break down upon receiving bad news, though you may still need to deal with it later. You still feel the pain, but this trait lets you ignore it until a more convenient moment to grieve arrives.'
  },
  {
    name: 'Ain\'t Got Time to Bleed',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You simply do not feel pain the way others do.',
    description: 'Whether by freakish nature, specialized training, or advanced neurosurgery, you can keep functioning through injuries that would slow most folk down.',
    benefits: {
      d4: 'When you suffer more Wound damage than half your Life Point score, you take only a -1 Attribute step to all actions instead of the normal -2.'
    }
  },
  {
    name: 'Alternate Identity',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Somewhere in the Verse there is another you, whether as a look-alike, double life, or fully fictitious identity.',
    description: 'When you meet someone who knows the other you, you are treated like that person whether you like it or not. As a Minor Asset, the identity is only modestly known. As a Major Asset, it is very well known or known for something significant.',
    benefits: {
      d2: 'This asset can give you a +2 Skill step to rolls where a second identity is helpful.',
      d4: 'As a Major Asset, the other identity is much more established and widely recognized, making its benefits and complications correspondingly larger.'
    },
    note: 'This can also represent a series of identities or a complete fictitious persona. It is most useful for maintaining the ruse, such as Covert/Disguise or Performance/Acting. If you start failing actions this trait benefits, the authorities may grow suspicious. You may also want Dark Secret if the alternate identity becomes more trouble than help.'
  },
  {
    name: 'Blastomere Implants',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Artificially grown replacement organs keep your body going when it should not.',
    description: 'Parts of your insides have been replaced with hotter-running artificial versions that make you one tough S.O.B.',
    benefits: {
      d2: 'Any time you take Stun damage, you ignore the first point, effectively giving you an Armor Rating of 1 S.',
      d4: 'At the Major level, enough of your guts have been swapped out that you also recover from Wound damage at twice the normal rate.'
    }
  },
  {
    name: 'Born in the Black',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You were born and largely raised aboard a spaceship, and space is where you make the most sense.',
    description: 'You know a great deal about space travel, space-survival, and shipboard maintenance, and you are comfortable operating basic ship systems and moving in zero-g.',
    benefits: {
      d4: 'You gain a +2 Skill step on rolls to move about in zero gravity. You also know or remember useful facts about space travel and spaceships, and can operate basic ship systems such as sensors, emergency systems, and life support.'
    },
    note: 'This does not make you a better pilot, but it does make you a better navigator. On planets, you may be a fish out of water, and if the GM uses that downside to create trouble, you should be rewarded with Plot Points.'
  },
  {
    name: 'Blue Blood',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You carry a title or family name that opens doors in the right power structures.',
    description: 'You may come across as a lily-handed dandy, but your education, lineage, or title gives you standing with nobility and officials. As a Minor Trait, your status is local or narrowly recognized. As a Major Trait, it is backed by a Verse-spanning power and respected in most places.',
    benefits: {
      d2: 'You gain a +2 Skill step to Influence rolls when dealing with the power structures that recognize your status.',
      d4: 'As a Major Trait, your status is recognized by governments and officials in most places, extending the same +2 Skill step benefit much more broadly.'
    },
    note: 'Your title or family name can also cause trouble with people who hold grudges or simply hate bluebloods. When the GM uses that downside against you, it should earn Plot Points as though it were a complication.'
  },
  {
    name: 'CompTech',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have a way with computer systems and the Cortex.',
    description: 'Whenever you are working on a program, running sensor sweeps, or hacking your way into an encrypted datapad, your knack with systems gives you an edge.',
    benefits: {
      d2: 'You gain a +2 Skill step to rolls involving computer systems, programming, sensor sweeps, or hacking.',
      d4: 'As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step.'
    },
    note: 'For example, if you spend 1 Plot Point to get a d2, it increases to a d6.'
  },
  {
    name: 'Connoisseur',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have refined tastes and deep expertise in a particular niche field.',
    description: 'Whether wine, prized hunting dogs, or award-winning geraniums, your reputation among fellow enthusiasts reaches far and opens doors in unusual places.',
    benefits: {
      d2: 'You receive a +2 Skill step when interacting with fellow enthusiasts in your chosen field, and may gain access to gatherings and social circles through that shared interest.'
    },
    note: 'You should decide with the GM what you are a connoisseur of. Maintaining that status may require serving as a speaker, judge, or expert, and the trait may stop helping once the conversation moves away from your specialty.'
  },
  {
    name: 'Fast on your Feet',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Your base movement speed is higher than normal.',
    description: 'While most folk can walk 15 feet in one round, you move faster than average and are quick to run when it matters.',
    benefits: {
      d2: 'At the Minor level, your base movement speed increases to 20 feet per round.',
      d4: 'At the Major level, your base movement speed increases to 25 feet per round.'
    }
  },
  {
    name: 'Hideout',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have a safe place that almost no one knows about.',
    description: 'Unless you lead people there, talk about it, or bring major heat down on yourself, your bolt hole stays hidden.',
    benefits: {
      d2: 'At the Minor level, your hideout has room for you and a couple of others in cramped quarters, with food, water, sparse furnishings, and the equivalent of a first-aid kit.',
      d4: 'At the Major level, your hideout can support up to a dozen crew.'
    },
    note: 'Decide with the GM where and what your Hideout is. If the campaign spends most of its time sailing the black, it may not come into play very often.'
  },
  {
    name: 'Home on the Range',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have a way with critters, whether they are livestock, pets, or pests.',
    description: 'You are good at working with animals, from training them to convincing them you are not lunch.',
    benefits: {
      d2: 'This trait grants a +2 Skill step to rolls you make when working with animals.',
      d4: 'As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step.'
    },
    note: 'For example, if you spend 1 Plot Point to get a d2, it increases to a d6.'
  },
  {
    name: 'In Plain Sight',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You fade into the background and avoid notice better than most folk.',
    description: 'Whether you are picking pockets or running corporate espionage, you are exceptionally good at keeping your whereabouts under wraps.',
    benefits: {
      d2: 'Gain a +2 Skill step to rolls to hide, avoid detection, or disguise yourself as another nonspecific person.',
      d4: 'As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step.'
    },
    note: 'For example, if you spend 1 Plot Point to get a d2, it increases to a d6.'
  },
  {
    name: 'Light Sleeper',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'The slightest disturbance wakes you, even in the middle of hard sleep.',
    description: 'It is nearly impossible to sneak up on you while you are asleep, though you may not always know what sound or change woke you.',
    benefits: {
      d2: 'You wake at the slightest noise or disturbance, even subtle changes in your surroundings.'
    },
    note: 'Because you cannot turn this off, it may cause fatigue or insomnia. If the GM uses that downside against you, it should earn Plot Points as though it were a complication.'
  },
  {
    name: 'Middleman',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have made yourself king of the hill somewhere, however small and sad that hill might be.',
    description: 'Folks come to you for work, to fence goods, or to learn what you know. This asset is strongly tied to place, contacts, and campaign circumstances, so it works best when defined closely with the GM.',
    benefits: {
      d2: 'As a Minor Trait, you are small potatoes but have enough sway to get regular work and contacts.',
      d4: 'As a Major Trait, you have fingers in a lot of pies and in more than one pie shop, and as long as you work at it you should not be hurting for things to do.'
    },
    note: 'Check with the GM before taking this trait, since it ties you to a particular area and is more about roleplaying and background circumstances than direct mechanical benefits.'
  },
  {
    name: 'Mighty Fine Hat',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have an item so tied to your identity that you are not the same without it.',
    description: 'It might be a signature hat, a uniform, a pair of sunglasses, or a well-worn pistol. The item does not work any better than a normal one, but it has style and somehow always finds its way back to you.',
    benefits: {
      d2: 'You cannot be deprived of this item for long. Even if it is lost, stolen, or badly damaged, it tends to return to you sooner or later.'
    },
    note: 'The exact item is up to you, but it should be something you could reasonably keep on your person at all times. If it is confiscated or taken, the GM should generally see to its return later.'
  },
  {
    name: 'Sawbones',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have a gift for doctoring, whether by formal training or raw knack.',
    description: 'Whether you are diagnosing illness with high-end equipment or patching folk up with a laser scalpel, you are notably good at medical work.',
    benefits: {
      d2: 'You gain a +2 Skill step on rolls involving doctoring of any kind.',
      d4: 'As a Major Trait, any bonus die you get from spending Plot Points is increased by a +2 step.'
    },
    note: 'For example, if you spend 1 Plot Point to get a d2, it increases to a d6.'
  },
  {
    name: 'Shareowner',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You are part owner in a major endeavor that gives you access you otherwise could not afford.',
    description: 'Your share could be in a ship, a business, a racehorse, a research project, or even something bigger. It does not automatically pay dividends, but it does give you privileged access to the endeavor and what comes with it.',
    benefits: {
      d4: 'You have access to something significant you could not otherwise afford, such as information, lodging, transport, or even a ship, subject to GM approval.'
    },
    note: 'You have sunk considerable personal resources into this, but you are only a part owner. Any endeavor covered by this trait has at least three partners, and the exact arrangement must be approved by the GM.'
  },
  {
    name: 'Allure',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You are physically attractive and know how to make your looks work for you.',
    description: 'Whether a handsome fellow or a lovely woman, you generally do not need to look far for companionship. Only rarely does your appearance attract the wrong sort of attention.',
    benefits: {
      d2: 'With Minor Allure, you gain a +2 step Skill die bonus on actions keyed to appearance, such as seduction, negotiation, persuasion, or winning beauty pageants.',
      d4: 'With Major Allure, any Plot Points spent on such actions are improved as if you had spent 2 additional points.'
    },
    note: 'For example, if you spend 2 Plot Points to improve a seduction attempt, your additional die is a d8 rather than a d4. If you spend 2 points after the roll is made, your final result is improved by 4 instead of 2.'
  },
  {
    name: 'Athlete',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You know how to push your body past its normal limits for certain kinds of physical activity.',
    description: 'You might pay the price in aching muscles later, but you are able to run farther, jump higher, and lift heavier than most folk.',
    benefits: {
      d2: 'Pick one Athletics Specialty. You may choose to exert yourself in the use of that Skill. If you voluntarily suffer Stun damage, you gain an extra die roll as if you had spent an equal number of Plot Points. You may spend up to the number of points that would render you unconscious, but no more.',
      d4: 'As a Major Trait, any Plot Points, not Stun, spent on physical activities are improved as if you had spent 2 additional points.'
    }
  },
  {
    name: 'Born Behind the Wheel',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You are never more at home than when you are seated at the controls of your favored type of vehicle.',
    description: 'You learned to fly or drive before you learned to walk. It is as if you and the machine unite to form a single entity.',
    benefits: {
      d2: 'Choose either land or air/space vehicles. You gain a +2 step bonus to your Agility Attribute whenever you are at the controls of your chosen vehicle type.',
      d4: 'As a Major Trait, any Plot Points spent on actions involving your chosen vehicle type improve as if you had spent 2 additional points.'
    }
  },
  {
    name: 'Cortex Specter',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'There is almost no record of you in the Cortex, and you move through the system like a ghost.',
    description: 'Simple clerical error could be the cause, or someone, perhaps yourself, went to the trouble to wipe the information clean.',
    benefits: {
      d2: 'A Cortex search will not show much about your history besides your birth. Anyone attempting to dig up information on your past has a +8 added to the difficulty of their search. Casual searches will reveal almost nothing about you.',
      d4: 'As a Major Trait, no official docket of you exists anywhere. Any Alliance, Fed, Interpol agent, or bounty hunter trying to look you up finds nothing.'
    },
    note: 'In most situations, such as applying for a liquor permit or making a purchase on credit, officials may pass it off as a computer error since everyone is supposed to be on file somewhere. There can be disadvantages: credit might be denied, you might have trouble checking into an Alliance-run hospital, and if the Alliance arrests you on serious charges it could mean a whole heap of trouble because officially you do not exist.'
  },
  { name: 'Fightinâ€™ Type', allowedRatings: ['d4'], summary: 'You are plainly built and trained for violence.' },
  {
    name: 'Friends in High Places',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You know important people who can sometimes help when you need a favor.',
    description: 'You dine with ambassadors, play golf with members of Parliament, and exchange holiday cards with an Alliance admiral. When you need a favor, you know the sort of people who might be willing to help.',
    benefits: {
      d2: 'Once per session, you can spend 1 or more Plot Points to call in a favor or secure a quick loan, either from someone known from previous play or someone who occurs to you on the spot.'
    },
    note: 'The GM must agree on the nature and position of your friend, and whether the favor is plausible. The favor should fit someone in a position of influence or authority, and your contacts may call in favors from you later.',
    plotPointTable: [
      { cost: '1-2 Plot Points', result: 'Small loan (up to 500 credits); loan of minor equipment' },
      { cost: '3-4 Plot Points', result: 'Medium loan (up to 5,000 credits); lifting a land-lock; invitation to an important event' },
      { cost: '5-6 Plot Points', result: 'Large loan (up to 10,000 credits); security clearance; use of a ship' }
    ]
  },
  {
    name: 'Friends in Low Places',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You know shady people who can help with criminal favors, street information, and black-market access.',
    description: 'Your contacts are of the criminal and underworld sort: money launderers, fencers, thieves, cartel bosses, counterfeiters, and the like. They can set you up with jobs, tip you off to the latest word on the street, and offer you first buy on recently smuggled items.',
    benefits: {
      d2: 'Once per session, you can spend 1 or more Plot Points to call in a favor from a local criminal contact, either someone known from previous play or someone you suddenly recall having met before.'
    },
    note: 'The GM must agree on the nature and position of your contact, and whether the favor is plausible for such folk. Your contacts might call in favors from you in the future.',
    plotPointTable: [
      { cost: '1-2 Plot Points', result: 'Small loan with interest (up to 500 credits); information; purchase imprinted goods' },
      { cost: '3-4 Plot Points', result: 'Medium loan with interest (up to 5,000 credits); a cut on a smuggling job' },
      { cost: '5-6 Plot Points', result: 'Large loan with interest (up to 10,000 credits); protection from a rival crime lord' }
    ]
  },
  {
    name: 'Good Name',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have a reputation that usually works in your favor.',
    description: 'You have made a name for yourself through some heroic or charitable deed, or you have real underworld credibility. One way or another, you are held in high regard within your social circle.',
    benefits: {
      d2: 'You gain a +2 step Skill bonus to any social interaction in which your good name comes into play.',
      d4: 'As a Major Trait, just about everyone in the Verse has heard of you and your bonus applies almost all the time.'
    },
    note: 'You do not get to apply this bonus to your enemies or people who see you as bie woo lohng.'
  },
  {
    name: 'Healthy as a Horse',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You just do not get sick, and your body recovers faster than most.',
    description: 'Even when the rest of the crew is down with coughs and sniffles, you feel wonderful. Serious ailments bounce off your iron constitution, and on the rare occasion you do get sick you recover quickly.',
    benefits: {
      d2: 'You gain a +2 step Vitality Attribute bonus whenever you roll to resist or shake off illness or infections.',
      d4: 'As a Major Trait, any Plot Points spent on such rolls gain a bonus as if you had spent 2 additional points, and you heal damage, both Stun and Wounds, at twice the usual rate.'
    }
  },
  {
    name: 'Heavy Tolerance',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Drugs and alcohol do not affect you the way they do most folk.',
    description: 'You can drink a slew of husky fellows right under the table, but it takes twice as much to get a decent buzz, and you often need larger doses of medication to get the desired effect.',
    benefits: {
      d2: 'You gain a +2 step Vitality Attribute bonus whenever you resist the effects of alcohol, drugs, knock-out or lethal gases, and poison.'
    }
  },
  {
    name: 'Highly Educated',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You paid attention in school and retained what you learned.',
    description: 'Your book learning comes in handy during social events and gameshow appearances, though it can also make you stand out on a Border planet.',
    benefits: {
      d2: 'You gain a +2 step Attribute bonus to Intelligence for any Knowledge-based Skill roll when you try to recall information, though it does not help when you are taking actions.'
    },
    note: 'For example, a doctor might get the bonus when matching symptoms to a disease, but not on rolls to treat the patient.'
  },
  {
    name: 'Intimidatin\' Manner',
    aliases: ['Intimidatinâ€™ Manner'],
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Something about you makes folk think twice before crossing you.',
    description: 'You have a steely-eyed stare and true grit. Security guards call you sir, punks melt under your glare, and people often confess more than they meant to when you lean on them.',
    benefits: {
      d2: 'You gain a +2 step Attribute bonus to Willpower on any action that involves intimidating, interrogating, bullying, frightening, or otherwise awing other folks.'
    },
    note: 'You can also use this bonus on your rolls to resist similar attempts made against you.'
  },
  {
    name: 'Leadership',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You inspire others and help them do what needs to be done.',
    description: 'People look to you in a crisis. You are able to motivate those around you and encourage them to work toward a shared goal.',
    benefits: {
      d2: 'Once per session, you can designate a goal for receiving your leadership bonus. Everyone working to achieve that goal gains a +2 step Skill bonus on any one action directly related to completing the task.',
      d4: 'As a Major Trait, you may also spend any number of your available Plot Points to improve the actions of one or more characters other than yourself, so long as those actions are related to your chosen goal.'
    },
    note: 'These Plot Points must be used immediately by each character who receives them in this way, and those characters may also supplement them with their own Plot Points.'
  },
  {
    name: 'Lightnin\' Reflexes',
    aliases: ['Lightninâ€™ Reflexes'],
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You react to danger quickly, and folk rarely get the drop on you.',
    description: 'In a quick-draw contest, your gun is out before the other fellow can find his holster.',
    benefits: {
      d4: 'You gain a +2 step Attribute bonus to your Agility on all Initiative rolls.'
    }
  },
  {
    name: 'Math Whiz',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You perform complex mathematical calculations effortlessly.',
    description: 'Where others quickly run out of fingers and toes, you already have the answer figured out. You can solve most mathematical problems without fail and without needing to roll the dice.',
    benefits: {
      d2: 'You gain a +2 step Attribute bonus to Intelligence for all actions related to accounting, engineering, navigation, and any situation that requires immediate mathematical interpretation.'
    }
  },
  {
    name: 'Mechanical Empathy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Machines talk to you, and you can fix them by instinct as much as training.',
    description: 'You have a way of fixing what ails machinery that goes well beyond the instruction manual, and you are happiest when covered in engine grease.',
    benefits: {
      d2: 'For a GM-set Plot Point cost, you gain intuitive knowledge of what is wrong with a particular mechanical device under your care, as well as a +2 step Skill bonus to Mechanical Engineering on actions to fix it.'
    },
    note: 'Certain unusual circumstances might block this ability, such as the machine turning out to be a hologram. In those cases, you do not spend your Plot Points.',
    plotPointTable: [
      { cost: '1-2 Plot Points', result: 'Minor problem (dead battery, slipped belt)' },
      { cost: '3-4 Plot Points', result: 'Moderate problem (corroded wiring, blown gasket)' },
      { cost: '5-6 Plot Points', result: 'Major problem (faulty catalyzer, crack in the external fuel tank)' }
    ]
  },
  {
    name: 'Mean Left Hook',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Your fists are hard as rocks, and you can do real harm bare-handed.',
    description: 'You are capable of killing a man with your bare hands.',
    benefits: {
      d2: 'Your unarmed attacks inflict Basic damage, split between Stun and Wound, instead of only Stun.'
    },
    note: 'See Chapter Five: Keep Flyin\' for more information on unarmed combat.'
  },
  {
    name: 'Military Rank',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You are a member of the armed services, or a veteran who still carries that rank and bearing.',
    description: 'You most likely fought in the war on one side or the other. Depending on whether you were Browncoat or Alliance, you earn respect in one place and take your lumps in another, but you still have the know-how and means to carry you through tough situations.',
    benefits: {
      d2: 'You are or were either enlisted or an officer. Enlisted military members or veterans gain a +2 step Attribute bonus to Willpower on all Discipline-based actions, while officers gain an equivalent bonus on all Influence-based actions.'
    }
  },
  {
    name: 'Moneyed Individual',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You are loaded, with money on hand and more tucked away for when you need it.',
    description: 'You have a nice chunk of change on hand and cash rolling in on a regular basis. You also live a wealthy lifestyle that can make you a target for people who want what you have.',
    benefits: {
      d4: 'Increase your starting credits by one-half. Once per game session, you can make an Intelligence + Influence roll, or another appropriate Specialty roll, when making a purchase to see if you can afford it by dipping into your trust fund instead of your money on hand.'
    },
    note: 'The Difficulty starts at Easy (3) for a purchase of up to 2,000 credits and increases by 4 for every additional 2,000 credits. You may spend Plot Points on the roll.',
    plotPointTable: [
      { cost: 'Difficulty 3', result: 'Item cost up to 2,000 credits' },
      { cost: 'Difficulty 7', result: 'Item cost up to 4,000 credits' },
      { cost: 'Difficulty 11', result: 'Item cost up to 6,000 credits' },
      { cost: 'Difficulty 15', result: 'Item cost up to 8,000 credits' },
      { cost: 'Difficulty 19', result: 'Item cost up to 10,000 credits' }
    ]
  },
  {
    name: 'Natural Linguist',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have an ear for languages and can learn new ones with remarkable ease.',
    description: 'You can pick up specific dialects and recreate accents with little effort. This helps you blend in with the locals, and by listening to people talk you can often tell where they are from.',
    benefits: {
      d2: 'You learn Linguist Specialties at half their normal cost. You also gain a +2 step Skill bonus to Influence or Performance, and appropriate Specialties, whenever you are trying to pass for a native by imitating or detecting specific accents and dialects.'
    }
  },
  {
    name: 'Nature Lover',
    allowedRatings: ['d2'],
    rank: 'Minor',
    summary: 'You’re in harmony with nature.',
    description: 'Even though you are forced to spend most of your time in a crowded city or on board a cramped spaceship, you feel most in tune with your surroundings when you are sleeping on the ground under starlit skies or walking amidst the trees of a forest or riding your horse across the prairies.',
    benefits: {
      d2: 'You gain a +2 step Attribute bonus to all Alertness-based rolls while in an outdoor setting, along with an equivalent bonus to a Survival-based skill die when applied to a natural environment.'
    }
  },
  {
    name: 'Nose for Trouble',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have a mental alarm that sounds when something is about to go wrong.',
    description: 'You can tell when somebody is lying through their teeth, and you get a creepy feeling when danger is waiting just out of sight.',
    benefits: {
      d2: 'You can make an Intelligence-based or Alertness-based roll to sense trouble even when circumstances might not normally permit it, and you gain a +2 step bonus to either Attribute when the circumstances warrant.',
      d4: 'As a Major Trait, you may also spend 1 Plot Point to negate all effects of surprise, sensing trouble just in time to avoid getting caught flat-footed.'
    }
  },
  {
    name: 'Reader',
    type: 'Asset',
    gmApproval: true,
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You sense the world and the thoughts of those around you with supernatural sensitivity.',
    description: 'You read more than words. This trait reflects psychic sensitivity, including awareness of thoughts and impressions around you. At stronger levels, that gift is harder to ignore and not always easy to understand.',
    benefits: {
      d2: 'As a Minor Trait, your abilities are empathic in nature, letting you learn the general feelings and moods of those around you. You gain a +2 step Attribute bonus to Alertness whenever observing someone, trying to discern the truth from a lie, and in other situations where your talents might help you understand a person.',
      d4: 'As a Major Trait, the bonus increases to +4, and once per game session you may spend Plot Points to gain clues or other information.'
    },
    note: '“Reading” someone is not as straightforward as reading a book, but rather comes across as visual or auditory information that you don’t always understand. Use of Plot Points should always grant you some idea of what the person is thinking, but the image you receive may be symbolic. The GM may also require a character with this trait to take a Complication, such as Traumatic Flashes, to go with your character’s unusual background.',
    plotPointTable: [
      { cost: '1-2 Plot Points', result: 'Minor information, trivial details, casual thoughts' },
      { cost: '3-4 Plot Points', result: 'Moderate information, private details, significant thoughts' },
      { cost: '5-6 Plot Points', result: 'Major information, vital details, closely guarded secrets' }
    ]
  },
  {
    name: 'Registered Companion',
    gmApproval: true,
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You possess an active license in the Companion Registry, which legally permits you to do business throughout the system.',
    description: 'This trait is only available with GM approval, as it may not match all campaigns.',
    benefits: {
      d2: 'Most worlds open their doors for a Registered Companion. This trait grants you a +2 step Skill bonus to Influence-based actions when dealing with those who respect your station.'
    },
    note: 'This trait reflects only your status in the Registry. To maintain it, you must meet the obligations of Guild membership. Your other training and skills are obtained normally through character creation.'
  },
  {
    name: 'Religiosity',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You follow the tenets of a particular faith, and that faith helps carry you through hard times.',
    description: 'Select a religious faith. Most folk in the ’Verse are either Buddhist or Christian, though many other faiths exist in smaller numbers.',
    benefits: {
      d2: 'As a Minor Trait, you are a faithful worshipper. Your beliefs gain you a +2 step Attribute bonus to any one Willpower-based action per game session.',
      d4: 'As a Major Trait, you are a priest, pastor, monk, rabbi, or other ordained figure and can easily be recognized as such by your garb. In addition to the minor benefits, all Plot Points spent on Influence actions when dealing with those who respect your station are resolved as if you had spent 2 additional points.'
    },
    note: 'For example, if you spend 2 Plot Points to gain an extra d4 rolled on a given action, you would actually roll a d8. Had you spent the 2 points after the roll, you would add 4 points to the result instead of 2.'
  },
  {
    name: 'Sharp Sense',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'One of your senses is especially keen, and you can use it to your advantage.',
    description: 'You might have the nose of a bloodhound, the eyes of an eagle, or the taste buds of a wine connoisseur.',
    benefits: {
      d2: 'Pick one of the five senses: Smell, Touch, Sight, Taste, or Hearing. You gain a +2 step bonus to your Alertness Attribute for any action using that sense.'
    },
    note: 'You may take this trait more than once during character creation, choosing a different sense each time.'
  },
  {
    name: 'Steady Calm',
    allowedRatings: ['d2', 'd4'],
    summary: 'You keep a clear head while all around you are losing theirs.',
    description: 'Some situations shake up normal folk, but not you. You stay steady when others are frightened, startled, or rattled.'
  },
  {
    name: 'Sweet and Cheerful',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'No power in the \'Verse can stop you from being cheerful.',
    description: 'You are so doggoned nice that most folks just can\'t help but like you.',
    benefits: {
      d2: 'You gain a +2 step Skill bonus on any action in which your sweet and likeable nature works in your favor.'
    }
  },
  {
    name: 'Talented',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Whatever it is, you are good at it.',
    description: 'You demonstrate a knack for a particular Skill and are able to perform better than others who have equivalent training.',
    benefits: {
      d2: 'Pick one Skill Specialty. You gain a +2 step Skill bonus on every use of that Skill.',
      d4: 'As a Major Trait, each progression to a higher die costs you 2 points less than normal.'
    },
    note: 'The advancement discount applies only during play, not during character creation.'
  },
  {
    name: 'Things Go Smooth',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Lady Luck has taken a liking to you, and things just seem to go your way.',
    description: 'You can wade through a swamp of go se and still come out smelling like a rose.',
    benefits: {
      d2: 'Once per session, you may re-roll any one action except Botches.',
      d4: 'As a Major Trait, you gain an additional re-roll, for two per session total, and you may use them on Botch results as well.'
    },
    note: 'Any roll, including those using Plot Points, can be redone with this trait. See Chapter Five: Keep Flyin\' for Botch rules.'
  },
  {
    name: 'Tough as Nails',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You\'re tougher than you look.',
    description: 'You can take a beating and still spit in the guy\'s eye. If you get knocked down, you bounce up again, ready for some gorram revenge.',
    benefits: {
      d2: 'You gain 2 extra Life Points over your normal total.',
      d4: 'As a Major Trait, you gain 4 points instead.'
    }
  },
  {
    name: 'Total Recall',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'Your brain stores everything you have learned within easy reach.',
    description: 'You remember just about everything you have ever seen or heard.',
    benefits: {
      d4: 'You gain a +2 step Skill bonus to any action in which this trait may come in handy. You may also spend a Plot Point to remember verbatim every detail of a past event or encounter with absolute photographic clarity.'
    },
    note: 'Some repressed memories or traumatic events might be the exception to this rule.'
  },
  {
    name: 'Trustworthy Gut',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have learned to trust your hunches.',
    description: 'Instinct helps you out of bad situations and leads you into good ones.',
    benefits: {
      d2: 'You gain a +2 step Attribute bonus to any mental Attribute roll when you are relying on intuition.',
      d4: 'As a Major Trait, you can spend 1 Plot Point to ask the GM a specific yes-or-no question related to your hunch.'
    },
    note: 'Any follow-up questions cost 1 more Plot Point each than the last. The GM can shut down the line of questioning at any time, as even hunches have their limits.'
  },
  {
    name: 'Two-Fisted',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You are a switch-hitter, able to use either hand equally well.',
    description: 'You can write, pitch, and use a weapon with either hand with equal ease, which comes in handy during softball games and shootouts.',
    benefits: {
      d4: 'You are ambidextrous. You can use weapons, write, hit, and perform other actions with either hand and incur no off-hand penalty.'
    }
  },
  {
    name: 'Walking Timepiece',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You never need to look at a watch to know what time it is.',
    description: 'You are uncannily accurate. Your friends could set their clocks by you, and a stopwatch has nothing on your internal sense of time.',
    benefits: {
      d2: 'Under normal circumstances, you know what time of day or night it is without looking at a clock. You also have a good idea of how much time has passed between one action and another.'
    },
    note: 'If you are knocked unconscious or otherwise incapacitated, it takes a full-turn Intelligence + Alertness action at Average difficulty to get your internal clock ticking again.'
  },
  {
    name: 'Wears a Badge',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You represent the Law, at least somewhere.',
    description: 'Though the badge lends you authority, it can also be a burden when those you are sworn to serve and protect actually expect service and protection, and that shiny badge makes a dandy target.',
    benefits: {
      d2: 'You have the resources and power of your agency on your side, at least within your jurisdiction. Your authority gains you a +2 step Skill bonus to all Influence-based actions when dealing with those who respect your position. As a Minor Trait, you represent local law enforcement on one planet or region.',
      d4: 'As a Major Trait, your authority covers most of the system, such as a Federal Marshal or Interpol agent.'
    }
  }
];

const ASSET_OVERRIDES = {
  'FightinÃ¢â‚¬â„¢ Type': {
    name: 'Fightin\' Type',
    aliases: ['FightinÃ¢â‚¬â„¢ Type'],
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You know how to handle yourself in almost any combat-type situation.',
    description: 'Whether it is a rough-and-tumble brawl or a deadly shootin\' match, you are built to handle a fight.',
    benefits: {
      d4: 'You may take one non-attack action each combat turn without penalty.'
    },
    note: 'For example, if you move and shoot in the same turn, your shot does not suffer the normal -1 step Skill penalty.'
  },
  'Nature Lover': {
    name: 'Nature Lover',
    allowedRatings: ['d2'],
    rank: 'Minor',
    summary: 'You\'re in harmony with nature.',
    description: 'Even though you are forced to spend most of your time in a crowded city or on board a cramped spaceship, you feel most in tune with your surroundings when you are sleeping on the ground under starlit skies or walking amidst the trees of a forest or riding your horse across the prairies.',
    benefits: {
      d2: 'You gain a +2 step Attribute bonus to all Alertness-based rolls while in an outdoor setting, along with an equivalent bonus to a Survival-based skill die when applied to a natural environment.'
    }
  },
  'Reader': {
    name: 'Reader',
    type: 'Asset',
    gmApproval: true,
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Your mind is open to the thoughts and emotions of folk nearby.',
    description: 'Whether you realized your psychic potential by yourself or as part of a corporate or government program, being a reader can be both a blessing and a curse. This trait is only available with GM approval, as it may not match all campaigns.',
    benefits: {
      d2: 'As a Minor Trait, your abilities are empathic in nature, letting you learn the general feelings and moods of those around you. You gain a +2 step Attribute bonus to Alertness whenever observing someone, trying to discern the truth from a lie, and in other situations where your talents might help you understand a person.',
      d4: 'As a Major Trait, the bonus increases to +4, and once per game session you may spend Plot Points to gain clues or other information.'
    },
    note: '\'Reading\' someone is not as straightforward as reading a book, but rather comes across as visual or auditory information that you do not always understand. Use of Plot Points should always grant you some idea of what the person is thinking, but the image you receive may be symbolic. The GM may also require a character with this trait to take a Complication, such as Traumatic Flashes, to go with your character\'s unusual background.',
    plotPointTable: [
      { cost: '1-2 Plot Points', result: 'Minor information (trivial details, casual thoughts)' },
      { cost: '3-4 Plot Points', result: 'Moderate information (private details, significant thoughts)' },
      { cost: '5-6 Plot Points', result: 'Major information (vital details, closely guarded secrets)' }
    ]
  },
  'Religiosity': {
    name: 'Religiosity',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You follow the tenets of a particular faith and are either a faithful practitioner or an ordained religious figure.',
    description: 'Faith gets you through the hard times and might help in dealings with others. Select a religious faith. Most folk in the Verse are either Buddhist or Christian, though many other faiths exist in smaller numbers.',
    benefits: {
      d2: 'As a Minor Trait, you are a faithful worshipper. Your beliefs gain you a +2 step Attribute bonus to any one Willpower-based action per game session.',
      d4: 'As a Major Trait, you are a priest, pastor, monk, rabbi, or other ordained figure and can easily be recognized as such by your garb, robes, collar, hat, and the like. In addition to the minor benefits, all Plot Points spent on Influence actions and appropriate Specialties when dealing with those who respect your station are resolved as if you had spent 2 additional points.'
    },
    note: 'For example, if you spend 2 Plot Points to gain an extra d4 rolled on a given action, you would actually roll a d8. Had you spent the 2 points after the roll, you would add 4 points to the result instead of 2.'
  }
};

export const CURATED_ASSETS = RAW_CURATED_ASSETS.map((trait) => (
  ASSET_OVERRIDES[trait.name] ? { ...ASSET_OVERRIDES[trait.name] } : trait
));

export const CURATED_COMPLICATIONS = [
  {
    name: 'Absent Minded',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You tend to forget things, lose focus, and get distracted at the worst times.',
    description: 'Whether from too much time in the black or too much mudder\'s milk, you find it hard to concentrate on long or involved tasks and can be sidetracked by new ideas or shiny objects.',
    benefits: {
      d2: 'The GM might impose a -2 Skill step to your rolls when distractions make it difficult for you to concentrate on a long or involved task, or when you try to remember where you put something important.'
    }
  },
  {
    name: 'Amnesia',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have lost part or all of your memory, and the missing pieces still shape your life.',
    description: 'At the minor level, you have forgotten a significant block of time but still know who you are. At the major level, you have total amnesia and know almost nothing of your own past, even though your old skills and reflexes remain.',
    benefits: {
      d2: 'As a Minor Trait, months or years of your life are a blank, though you still remember most of who you are and what came before.',
      d4: 'As a Major Trait, you do not know your own name or past. You remember nothing except vague feelings stirred by memory triggers, even though you retain the skills and reflexes of your previous life.'
    },
    note: 'Even if you think you know what caused your memory loss, that is only your best guess. The GM may weave the truth of your amnesia into the story however they see fit.'
  },
  {
    name: 'Allergy',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Certain things mess with your body something fierce.',
    description: 'Pick an allergy. A minor allergy might cause only a rash or a sneezing fit, while a major allergy could leave you pushin\' up daisies.',
    benefits: {
      d2: 'As a Minor Trait, your reaction is minor, such as hay fever, rash, or sneezes, and you suffer a -2 step penalty to your Physical Attributes, Agility, Strength, and Vitality, for all actions in its presence until you take medication.',
      d4: 'As a Major Trait, you suffer a life-threatening reaction to the substance and take d2 points of Stun each turn. When you have no remaining Stun, all additional damage is suffered as both Wounds and Shock Points.'
    },
    note: 'You likely carry an emergency injection to use in these situations, which will stop the damage in d4 turns.'
  },
  {
    name: 'Amorous',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Sex might not be the only thing on your mind, but it definitely ranks near the top.',
    description: 'You are always looking for intimate companionship whenever possible.',
    benefits: {
      d2: 'You will make a pass at almost any person of your sexual preference, and you do not put up many barriers when someone is coming on to you. This can cause a -2 step Skill penalty to Influence-based actions when the other party is offended by your advances.'
    },
    note: 'You also suffer a -2 step Willpower Attribute penalty when attempting to resist the wiles of someone who is your type.'
  },
  {
    name: 'Amputee',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You lost an arm or a leg and make do without a proper replacement.',
    description: 'Doctors could not sew it back on, and you cannot afford a fancy bionic replacement. You might have a utilitarian prosthetic meant to get the job done and nothing more.',
    benefits: {
      d2: 'You are missing either an arm or a leg. If you lack an arm, you cannot perform actions that require two hands, and actions that usually take two hands suffer a -2 step penalty.'
    },
    note: 'If you do not have a leg, you use crutches, a cane, or a crude prosthetic to walk. Your base movement is reduced to 5 feet per turn, and you suffer a -4 step penalty on movement actions.'
  },
  {
    name: 'Bleeder',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'Your blood does not clot like most folk\'s, so injuries become more dangerous fast.',
    description: 'You suffer from hemophilia or take blood thinners for another medical condition. Try not to get cut, shot, or stabbed.',
    benefits: {
      d4: 'If you suffer Wound damage, you begin to bleed and suffer 1 additional Wound each turn until the bleeding is stopped.'
    },
    note: 'Stopping the bleeding requires a Hard Intelligence + Medical Expertise action. See Chapter Five: Keep Flyin\'.'
  },
  {
    name: 'Blind',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You have to rely on your remaining senses to get around.',
    description: 'You may have been blind since birth or since a terrible accident. You might have a trained animal to assist you, though its training has limits and you are responsible for its care.',
    benefits: {
      d4: 'Your character has difficulty moving in unfamiliar surroundings and suffers a -4 step Skill penalty on any action that normally depends on vision.'
    },
    note: 'The GM can mitigate this for certain actions, as blind individuals can become surprisingly competent at many tasks. The penalty is doubled to -8 step for ranged combat attempts. Because you rely on other senses, you gain the Sharp Sense asset for both Touch and Hearing at no cost.'
  },
  {
    name: 'Branded',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You are a bad, bad person, and everyone knows it.',
    description: 'You have a bad reputation, fairly earned or not, in your home region.',
    benefits: {
      d2: 'You suffer a -2 step Skill penalty to any social interaction when the story of your terrible misdeeds comes into play.',
      d4: 'As a Major Trait, virtually everyone in the Verse has heard bad things about you and the penalty applies almost all the time.'
    },
    note: 'You suffer no penalty when dealing with folks who know you personally, or those who feel you got a raw deal.'
  },
  {
    name: 'Chip on the Shoulder',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Your fuse is short, and violence tends to follow you around.',
    description: 'You are ready for a fight at the slightest provocation and cannot walk away from insults or taunts.',
    benefits: {
      d2: 'You suffer a -2 step Skill penalty to all peaceable social actions with even a hint of tension.',
      d4: 'As a Major Trait, any time you suffer Wound damage you go completely berserk, concentrating only on taking down whoever hurt you until someone else tags you, then you switch targets.'
    }
  },
  {
    name: 'Combat Paralysis',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You tend to freeze up when bullets start flying or fists start swinging.',
    description: 'Whether from fear or not knowing what to do, it takes you a moment to collect yourself when violence breaks out.',
    benefits: {
      d2: 'When combat begins, you are unable to take any actions for d2 turns. You may spend Plot Points equal to the number of turns rolled to shake it off.',
      d4: 'As a Major Trait, you are helpless for d4 turns and cannot even use Plot Points to act sooner.'
    },
    note: 'At the GM\'s discretion, someone with Leadership as an Asset might inspire you enough to jolt you to action.'
  },
  {
    name: 'Cold As the Black',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Your emotions are nearly nonexistent, and you struggle to connect with other people.',
    description: 'Whether damaged, medicated, deeply stoic, or simply wired wrong, you do not laugh, cry, or share feelings like most folk do. You miss social and emotional signals and often fail to react to situations that would stir strong feelings in others.',
    benefits: {
      d2: 'Depending on the circumstances, the GM might impose a -2 Skill step to social rolls when your lack of emotion causes problems.'
    }
  },
  {
    name: 'Coward',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You are a firm believer in living to fight another day.',
    description: 'You have no desire to be a Big Damn Hero. When a fight breaks out, so do you, usually in a cold sweat.',
    benefits: {
      d2: 'When danger strikes, you look for the nearest exit. You suffer a -2 step Skill penalty on all combat actions in which you are in danger and an equal Willpower Attribute penalty on any action to resist fear, intimidation, torture, or other threats.'
    },
    note: 'You will fight when backed into a corner, unless there is some way you can crawl through the wall.'
  },
  {
    name: 'Credo',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You live by a set of principles and will not deviate from them without a damn good reason.',
    description: 'Your principles are likely to get you in trouble, and people who know you can use your predictable behavior against you.',
    benefits: {
      d2: 'As a Minor Trait, pick a credo that will get you into minor trouble, such as always defending a lady\'s honor or never running from a fight.',
      d4: 'As a Major Trait, your credo is a sure-fire way to put yourself in danger, such as never leaving a man behind, the Captain going down with the ship, or always protecting the weak.'
    },
    note: 'Even though Credo might land you in hot water, it can also pair naturally with an asset like Good Name.'
  },
  {
    name: 'Crude',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You prefer to tell it like it is and do not care much for normal pleasantries.',
    description: 'You are a gorram bull running amok in Society\'s rose garden, with rough manners and colorful language no matter your social station.',
    benefits: {
      d2: 'You cuss, put your elbows on the table, spit on the sidewalk, and engage in other crude behavior. You suffer a -2 step Skill penalty on Influence-based actions whenever refined social behavior is called for.'
    }
  },
  {
    name: 'Dark Secret',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'There is something in your past that could cause serious trouble if it comes to light.',
    description: 'Work the secret out privately with the GM. A minor secret is humiliating and disruptive, while a major one could upend your life or get you killed.',
    benefits: {
      d2: 'As a Minor Complication, the secret is embarrassing or troublesome, with short-term consequences if it gets out. Either way, you suffer a -2 Skill step when trying to explain yourself once the secret is exposed.',
      d4: 'As a Major Complication, the secret is severe enough to be worth someone\'s life, most likely yours. Either way, you suffer a -2 Skill step when trying to explain yourself once the secret is exposed.'
    },
    note: 'Most of the time, this trait is an ongoing reason for you to be nervous. Roleplay it, and the GM may slide Plot Points your way once in a while.'
  },
  {
    name: 'Dead Broke',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You live in a state of perpetual poverty.',
    description: 'Your pockets have holes the size of Alliance cruisers. If you have money, you will immediately spend it.',
    benefits: {
      d2: 'You will never have any measurable amount of wealth. When taking this complication, cut your normal starting credits in half and spend all that you have left immediately on whatever you think you must have, whether you need it or not.'
    },
    note: 'Because of your debts, you must give up one-half of all your income on the first day in any town, spaceport, or other sign of civilization. The circumstances of your money disappearing vary based on your background and the GM\'s plans.'
  },
  {
    name: 'Deadly Enemy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have made yourself a dangerous enemy who wants to capture or kill you.',
    description: 'Someone is out to get you. You do not have to specify the exact nature of your nemesis, though your background may provide you or the GM with ideas.',
    benefits: {
      d2: 'Your enemy may be extremely powerful and dangerous, posing a direct threat every 3 to 5 adventures at the GM\'s discretion.'
    },
    note: 'You are never completely free of the danger until you buy off this complication. Even if you think you have gotten rid of your enemy, the threat remains in one form or another at the GM\'s discretion.'
  },
  {
    name: 'Deaf',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You have lost the ability to hear.',
    description: 'You can sign and read lips, though your ability to speak may or may not be impaired.',
    benefits: {
      d4: 'You cannot hear anything and automatically fail any Alertness-based action involving sound.'
    },
    note: 'As an advantage, you are immune to sonic attacks designed to injure or disable hearing individuals, and you might be able to tell what people at a distance are saying by reading their lips. You can understand sign language and receive a +2 step bonus to any use of the Perception/Read Lips Skill.'
  },
  {
    name: 'Dull Sense',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'One of your five senses is fried.',
    description: 'It might be a chronic stuffy nose, bad eyesight, poor hearing, or desensitized skin. Whichever it is, you are best off not relying on that sense in a tight spot.',
    benefits: {
      d2: 'Pick one of the five senses: Smell, Touch, Sight, Taste, or Hearing. You suffer a -2 step penalty to your Alertness Attribute for any action using that sense.'
    },
    note: 'You may take this trait more than once during character creation, choosing a different sense each time.'
  },
  {
    name: 'Easy Mark',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You generally believe what people tell you, whether it is a sob story or a get-rich-quick scheme.',
    description: 'Someone once said a sucker is born every minute, and here you are.',
    benefits: {
      d4: 'In situations where you are attempting to distinguish the truth from lies, you suffer a -4 step Mental Attribute penalty.'
    },
    note: 'As the player, you may be rewarded with Plot Points for going along with this trait.'
  },
  {
    name: 'Ego Signature',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You leave a token, clue, or other mark as a calling card.',
    description: 'You want everyone to identify and admire your handiwork, so you consistently leave some sort of signature at the scene of your crimes.',
    benefits: {
      d2: 'The clue does not always lead straight back to you and might not always be obvious, but it can help someone track you down.'
    },
    note: 'It can also allow someone to frame you by committing crimes and then leaving your calling card behind.'
  },
  {
    name: 'Filcher',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Anything not nailed down looks like it belongs to you.',
    description: 'If some pretty piece catches your fancy, you will try to take it, even when committing the theft is a really dumb move.',
    benefits: {
      d2: 'You do not steal out of greed, but out of compulsion.'
    }
  },
  {
    name: 'Forked Tongue',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You lie like an Oriental rug.',
    description: 'It is your nature to weave tall tales and tell wild stories to friends and foes. You will lie even when the truth might favor you because you just cannot help yourself.',
    benefits: {
      d2: 'You are a compulsive liar. You suffer a -4 step Skill penalty to all Influence-based actions when dealing with people who know you and have reason not to believe a word you say.'
    }
  },
  {
    name: 'Greedy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Money is the root of all happiness, as far as you are concerned.',
    description: 'You will take almost any opportunity to acquire money, and what you already have is never enough.',
    benefits: {
      d2: 'Your ethics become flexible if the payoff is big enough. You may sell out your friends, your crew, or anyone else if the money is right.'
    }
  },
  {
    name: 'Good Samaritan',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You tend to side with the underdog, even when it causes trouble for you.',
    description: 'Whether out of pity or a weakness for lost causes, you habitually align yourself with whoever is losing. That can make other people see you as wishy-washy, juvenile, or immature, especially when you abandon them as soon as someone else becomes the underdog.',
    benefits: {
      d2: 'When interacting with people who dislike your inconstant nature, you receive a -2 Skill step to your social rolls.'
    }
  },
  {
    name: 'Glass Jaw',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You go down faster than most folk when you get hit.',
    description: 'You are a paper tiger who had better hope not to get hit much, because when you do, you drop a lot faster than most people.',
    benefits: {
      d2: 'As a Minor Complication, take 2 Life Points off your score.',
      d4: 'As a Major Complication, take 4 Life Points off your score.'
    }
  },
  {
    name: 'Glory Hound',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You are drawn to the spotlight and will chase dangerous attention to get it.',
    description: 'You sign up first for risky missions, go all-out when someone is watching, and throw yourself toward any chance to be noticed or talked about later.',
    benefits: {
      d2: 'If your attempts to gain attention turn into a bie woo lohng, you receive a -2 Skill step to social rolls involving whoever else you drag into the mess.'
    },
    note: 'Your showboating may also get you cited for criminal stupidity.'
  },
  {
    name: 'Hero Worship',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You look up to one person, living or dead, who can do no wrong in your eyes.',
    description: 'You work hard to emulate your hero in dress and speech, and you may go to great lengths to feel physically connected to that person.',
    benefits: {
      d2: 'This trait does not always endear you to people, sometimes causing a -2 step Skill penalty to Influence-based actions when you are with those who are not as enthralled with your hero as you are.'
    }
  },
  {
    name: 'Idealist',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You believe people are basically good and the Verse will work out for the best, even when evidence says otherwise.',
    description: 'Your optimism is unrealistic and deeply rooted. Whether you trust the Alliance, your captain, or some broader idea of decency, you ignore ugly truths whenever you can and make excuses when you cannot.',
    benefits: {
      d2: 'The GM might impose a -2 Skill step to rolls to notice or realize the truth when your judgment is clouded, or to social rolls involving people who do not share your views.'
    }
  },
  {
    name: 'Illiterate Backbirth',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You never learned to read properly.',
    description: 'Whether from a backwater upbringing, life on the streets, or a serious neurological problem, written language is largely closed off to you.',
    benefits: {
      d2: 'As a Minor Trait, you can handle only the basics, such as writing your name and recognizing common words like street signs or place names.',
      d4: 'As a Major Trait, you cannot properly read at all. You may not even recognize your own name, and if you are lucky, you can scratch an X on a document if someone points to the right spot.'
    }
  },
  {
    name: 'Illness',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You suffer from an ongoing sickness that will not go away on its own.',
    description: 'You have a disease, syndrome, or genetic condition that leaves you unwell more often than not. Depending on the symptoms, flare-ups can interfere with what you are trying to do.',
    benefits: {
      d2: 'As a Minor Trait, the condition is permanent but relatively inconsequential, bothering you only some of the time. During a flare-up, usually once per session for a scene, the GM may apply a -2 Skill step to your actions.',
      d4: 'As a Major Trait, your illness is progressive and will eventually leave you dead or bedridden if it is not cured. Constant treatment slows it, but during flare-ups the GM may apply a -2 Skill step to your actions.'
    },
    note: 'You must buy off this complication to cure it, if a cure is even possible. Check with the GM before taking it at the Major level, and if the illness cannot matter in the campaign, it should not award complication points.'
  },
  {
    name: 'Hooked',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You are addicted to a substance and must get your fix on a regular basis.',
    description: 'It might be alcohol, tobacco, or some kind of drug. If you go without, serious problems follow.',
    benefits: {
      d2: 'As a Minor Trait, you are either addicted to something not immediately dangerous or you have the problem somewhat under control. You must get a daily fix or suffer a -2 step penalty to all Attributes for one week or until you get your fix.',
      d4: 'As a Major Trait, your problem is more serious. If you go into withdrawal, the penalty is -4 to all Attributes for two weeks or until you get your fix.'
    },
    note: 'You cannot quit your habit until you buy off this complication, and when you do, you still have to go through a long withdrawal period determined by the GM.'
  },
  {
    name: 'Leaky Brainpan',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You have more than a few screws loose, and your mind is not all there.',
    description: 'It often wanders from one incoherent thought to the next without stopping to rest.',
    benefits: {
      d2: 'As a Minor Trait, you are prone to occasional delusions and random, nonsensical outbursts. You suffer a -2 step Skill penalty to Influence-based social interactions.',
      d4: 'As a Major Trait, you are completely weird and creepifying. You suffer a -4 step Skill penalty to Influence-based social interactions.'
    },
    note: 'For a Major Leaky Brainpan, the GM may describe your surroundings differently than what normal people are seeing to reflect your altered state of mind.'
  },
  {
    name: 'Lightweight',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have a delicate constitution and do not deal well with threats to your health.',
    benefits: {
      d2: 'You suffer a -2 step Vitality penalty on any attempt to resist the effects of alcohol, diseases, environmental hazards, and poison.'
    }
  },
  {
    name: 'Little Person',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You stand about waist-high compared to most folks.',
    description: 'Being smaller than most folk presents challenges, but also opportunities.',
    benefits: {
      d2: 'You are only 3 to 4 feet tall. Opponents attacking you with a ranged weapon from more than 10 feet away receive a +4 to the Difficulty.'
    },
    note: 'Your base speed is reduced to 8 feet per turn, and you suffer a -2 step Skill penalty on movement actions. The GM may also grant other challenges or opportunities based on your size.'
  },
  {
    name: 'Loyal',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Certain folks known to you can count on you no matter what.',
    description: 'They might be crew, war buddies, childhood friends, family, or fraternity brothers. You will go the extra mile to help and protect them.',
    benefits: {
      d2: 'Pick a group that can count on your loyalty. You will do anything short of sacrificing your own life to help and protect them, and you might even do that.'
    },
    note: 'With the GM\'s permission, you can be loyal to an individual, provided this person is another Player Character or an NPC who is a constant presence in the campaign.'
  },
  {
    name: 'Memorable',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'There is something distinct about you that makes most folk remember you.',
    description: 'It might be a large nose, a thick accent, a bushy beard, recognizable scars, striking beauty, tattoos, or peculiar mannerisms.',
    benefits: {
      d2: 'You are easily identified. Others gain a +2 step Alertness Attribute bonus when attempting to spot you or recognize your likeness.'
    }
  },
  {
    name: 'Mute',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You cannot speak and must communicate through sign language and writing.',
    benefits: {
      d4: 'You do not suffer direct action penalties, but you must rely on non-verbal communication to get your point across.'
    },
    note: 'Whenever this creates significant challenges, the GM should reward you with one or more Plot Points.'
  },
  {
    name: 'Neatfreak',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Clutter, germs, and filth bother you far more than they should.',
    description: 'You are constantly cleaning, tidying, and trying to impose order on your surroundings. At the major level, your aversion to dirt and contamination interferes with daily life in a serious way.',
    benefits: {
      d2: 'As a Minor Complication, a significant problem such as being forced to walk through a sewer causes you to suffer a -2 Skill step to all actions for the rest of the scene.',
      d4: 'As a Major Complication, you suffer the same -2 Skill step whenever you are in an unclean environment, and dealing with something particularly disgusting can send you into hysterics.'
    }
  },
  {
    name: 'Nosy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You are driven to investigate mysteries, even when doing so is dangerous or unwise.',
    description: 'Once a mystery presents itself, you cannot leave it alone, whether it is ordinary personal business or something that could make the wrong people very upset with you.',
    benefits: {
      d2: 'When you are aware of a new or recent mystery and are trying to focus on anything else, you take a -2 Skill step to mental and social actions.'
    }
  },
  {
    name: 'Non-Fightin\' Type',
    aliases: ['Non-Fightinâ€™ Type', 'Non-FightinÃ¢â‚¬â„¢ Type'],
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You do not believe in solving disputes through violence.',
    description: 'Whether from religious conviction or the way your mama raised you, you are willing to engage in violence only under the most dire circumstances.',
    benefits: {
      d2: 'You will fight only for your own survival or in situations where there is no other choice. When you are forced to fight, you suffer a -2 step Skill penalty to any combat actions.'
    }
  },
  {
    name: 'Overconfident',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have a bold streak as wide as the Rim and know you are up for any challenge.',
    description: 'Some folks call you cocky, but you are convinced you are smarter, stronger, and tougher than everyone else in the Verse.',
    benefits: {
      d2: 'You will run, not walk, into deadly altercations, pick fights when outnumbered, bet everything on a single throw, and attempt dangerous actions even when you are not skilled at them.'
    }
  },
  {
    name: 'Paralyzed',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You do not have the use of your legs and spend most of your life in a wheelchair.',
    description: 'A spinal cord injury nearly ended your life.',
    benefits: {
      d4: 'Without mechanical or friendly assistance, you can crawl at a speed of only 2 feet per turn. In a manual wheelchair, your base movement is 5 feet and you suffer a -4 step penalty to movement actions.'
    },
    note: 'An electric wheelchair can allow you to travel up to normal movement speeds. You may have difficulty with stairs or uneven terrain. You can use ranged weapons without penalty, but suffer a -4 step penalty when fighting hand-to-hand.'
  },
  {
    name: 'Phobia',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Something scares the mi tian gohn out of you.',
    description: 'Specify your phobia. It may be an uncommon object that produces an extreme reaction or a more common fear like needles, guns, heights, or spiders.',
    benefits: {
      d2: 'You become shaken in the presence of the object of your fear, suffering a -2 step Attribute penalty on all actions.'
    }
  },
  {
    name: 'Portly',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'You never met a pot roast you did not like.',
    benefits: {
      d2: 'As a Minor Trait, you are somewhat overweight. You suffer a -2 step Attribute penalty to all Athletics-based actions, except swimming, and to Influence-based actions dealing with fitness and physical appearance.',
      d4: 'As a Major Trait, you are morbidly obese. The penalty increases to -4 steps and your base movement is reduced to 5 feet per turn.'
    },
    note: 'As a Major Trait, you also suffer a -2 step Skill penalty to all Covert-based actions involving disguise and hiding.'
  },
  {
    name: 'Prejudice',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You flat-out cannot stand a certain group of people.',
    description: 'Your dislike might be ideological, socioeconomic, regional, racial, religious, or something else, and you have a hard time hiding your aversion.',
    benefits: {
      d2: 'Pick a group of people with whom you could reasonably have social or business dealings. You avoid interacting with them whenever possible, and when you cannot, all Influence-based social interactions with the object of your prejudice suffer a -2 step Skill penalty.'
    },
    note: 'You may even go out of your way to insult them.'
  },
  {
    name: 'Rebellious',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You have a serious problem with authority and dislike being told what to do.',
    description: 'The Alliance does not sit well with you, but neither does anyone else trying to give orders. You find ways to dodge obedience without getting shot, though the attitude can carry serious consequences inside any command structure.',
    benefits: {
      d2: 'This trait can impose a -2 Skill step to certain actions, particularly whenever you are interacting with your superior officers.'
    }
  },
  {
    name: 'Sadistic',
    rank: 'Major',
    allowedRatings: ['d4'],
    summary: 'You love hurting people and do not pass up chances to express your cruelty.',
    description: 'Whether from belief, taste, or sheer sickness, the sound of screams is music to your ears.',
    benefits: {
      d4: 'Your cruelty knows no bounds, and you do not pass up chances to maim or torture those under your power.'
    },
    note: 'This is a trait usually reserved for the bad guys. No aspiring Big Damn Hero should ever take it.'
  },
  {
    name: 'Scrawny',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You are skin and bones, whether from missed meals or a freakish metabolism.',
    benefits: {
      d2: 'You suffer a -2 step Strength Attribute penalty to all Athletics-based actions and a -2 step Skill penalty on Influence-based actions dealing with fitness and physical appearance.'
    }
  },
  {
    name: 'Second Class Citizen',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Your society treats you like you matter less than other people do.',
    description: 'For political, regional, social, or cultural reasons, some folk look down on you and deny you the respect and consideration others might receive. At the minor level this only applies in certain places, while at the major level it follows you almost everywhere.',
    benefits: {
      d2: 'As a Minor Complication, your status works against you only in certain areas, such as a few planets or one stretch of space. In social situations where it matters, you suffer a -2 Skill step on social rolls against those who look down on you.',
      d4: 'As a Major Complication, you receive poor treatment almost everywhere you go. In social situations where it matters, you suffer a -2 Skill step on social rolls against those who look down on you.'
    }
  },
  {
    name: 'Shy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You are a wallflower who struggles when social attention turns your way.',
    description: 'You have trouble talking to people, especially when you become the center of attention. Even when you have something important to say, being watched or expected to perform socially makes you deeply uncomfortable.',
    benefits: {
      d2: 'When all eyes are on you and you are expected to perform socially, you suffer a -2 Skill step to your actions.'
    }
  },
  {
    name: 'Slow Learner',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'There are some things you are just not good at and never will be.',
    benefits: {
      d2: 'Choose one general Skill. You pay 2 additional points for any improvement to that Skill or any of its Specialties during advancement, and you suffer a -2 step Skill penalty any time you try to use it.'
    },
    note: 'This applies to advancement only, not character creation.'
  },
  { name: 'Soft', allowedRatings: ['d2'], summary: 'You are not built for hardship, filth, or extended suffering.' },
  {
    name: 'Stingy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You consider yourself practical and thrifty, but most folk just call you a tightwad.',
    description: 'No matter how rich you are, you never part with money you do not absolutely have to.',
    benefits: {
      d2: 'You buy off-brand merchandise, haggle down shopkeepers, stash cash in your boot, ignore charitable causes, and will only consider loans to reliable friends, with interest of course.'
    }
  },
  {
    name: 'Straight Shooter',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'Honesty is not always the best policy, especially in diplomacy, business, or barrooms.',
    description: 'You speak the truth without regard for other people\'s feelings or the circumstances involved.',
    benefits: {
      d2: 'You might consider telling a falsehood only in dire emergencies, and even then you suffer a -2 step Skill penalty to Influence-based actions because your lie is written all over your face.'
    }
  },
  {
    name: 'Superstitious',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You believe in omens and harbingers of luck, good and bad.',
    description: 'You avoid black cats, dodge ladders, and take no chances with ill luck. Your superstitions affect your everyday behavior.',
    benefits: {
      d2: 'Whenever you receive an omen of bad luck, you suffer a -2 penalty to all of your Attributes for a set of actions determined by the GM.'
    },
    note: 'The reverse is also true. When you receive an omen of good luck, the GM will determine a group of actions to receive a +2 Attribute bonus.'
  },
  {
    name: 'Things Don\'t Go Smooth',
    aliases: ['Things Donâ€™t Go Smooth', 'Things DonÃ¢â‚¬â„¢t Go Smooth'],
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Lady Luck hates your guts.',
    description: 'For as long as you can remember, things never have gone smooth for you. Bad luck follows you around and coincidences never work in your favor.',
    benefits: {
      d2: 'Once per session, the GM can force you to re-roll an action and take the lower of the two results.',
      d4: 'As a Major Trait, the GM can make you re-roll two actions per session.'
    }
  },
  {
    name: 'Toes the Line',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You do things by the book and are deeply uncomfortable breaking rules or orders.',
    description: 'You obey superiors, follow instructions to the letter, and resist bending regulations even when doing so would save trouble or even your own skin.',
    benefits: {
      d2: 'You take a -2 Skill step when attempting actions that are specifically against your orders.'
    }
  },
  {
    name: 'Two Left Feet',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Balance and coordination do not come naturally to you.',
    description: 'You bump into doors, fall down stairs, step on dance partners, and generally struggle with movement and coordination far more than most folk.',
    benefits: {
      d2: 'You take a -2 Skill step to all rolls to move, catch something, throw something, or do any other action impeded by being unbalanced.',
      d4: 'As a Major Trait, you suffer the same -2 Skill step and also botch such rolls more frequently, treating all 1s and 2s as a botch result instead of only all 1s.'
    }
  },
  {
    name: 'Traumatic Flashes',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Horrible dreams and visions overtake you and leave you shaken and unsettled.',
    description: 'These flashes might be residual memories of trauma, messages from a disturbed conscience, or recurring nightmares. You do not always know what will trigger them.',
    benefits: {
      d2: 'Once per game session, some trigger determined by the GM causes you to suffer a traumatic flash. You are incapable of action for d2 turns and suffer a -2 step Attribute penalty on all actions for ten minutes following the flash.',
      d4: 'As a Major Trait, these flashes happen twice per session.'
    },
    note: 'During an episode, you are incoherent, shaking, and screaming.'
  },
  {
    name: 'Twitchy',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You know for a fact that everyone is out to get you.',
    description: 'You spend most of your time watching your back. You trust almost no one, and even your oldest friends only to a point.',
    benefits: {
      d2: 'You do not trust anyone, assume whispers are about you, and do not believe reassurance. You suffer a -2 step Skill penalty to all Influence-based actions in social situations.'
    }
  },
  {
    name: 'Ugly as Sin',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Either you were born ugly or life has left you looking mighty hideous.',
    description: 'Scars, burns, or plain bad luck have left your appearance working against you.',
    benefits: {
      d2: 'You are unattractive and suffer a -2 step Skill penalty to all actions keyed to appearance, such as seduction, negotiation, and persuasion.',
      d4: 'As a Major Trait, you are ugly to the bone and all Plot Points spent on such actions cost twice the usual amount.'
    }
  },
  {
    name: 'Weak Stomach',
    rank: 'Minor/Major',
    rankByRating: {
      d2: 'Minor',
      d4: 'Major'
    },
    allowedRatings: ['d2', 'd4'],
    summary: 'Blood, gore, and dead bodies make your knees go wobbly.',
    description: 'You tend to avoid situations where blood, entrails, or corpses are likely to be present.',
    benefits: {
      d2: 'You cannot stand to be in the presence of blood, entrails, and dead bodies. You suffer a -2 step penalty to all Attributes until the source of your discomfort is removed or until you leave on your own.',
      d4: 'As a Major Trait, you also have to make an Average Vitality + Willpower test for each five-minute interval you are exposed to gory scenes or fall unconscious for 2d4 minutes.'
    }
  },
  {
    name: 'Wisecracker',
    rank: 'Minor',
    allowedRatings: ['d2'],
    summary: 'You cannot help cracking jokes, even when it is wildly inappropriate.',
    description: 'If there is a chance to make a joke, especially at someone else\'s expense, you take it even when it could offend people, earn you a beating, or make a bad situation worse.',
    benefits: {
      d2: 'When your wisecracks offend people, you receive a -2 Skill step to interactions with those you have offended.'
    },
    note: 'Sometimes the result is not a penalty so much as a punch.'
  }
];

export const REPEATABLE_TRAIT_NAMES = ['Loyal', 'Sharp Sense', 'Dull Sense'];

export const MUTUALLY_EXCLUSIVE_TRAIT_PAIRS = [
  ['Moneyed Individual', 'Dead Broke'],
  ['Heavy Tolerance', 'Lightweight'],
  ['Portly', 'Scrawny']
];

export function isRepeatableTrait(name = '') {
  return REPEATABLE_TRAIT_NAMES.includes(name);
}

export function getMutuallyExclusiveTraits(name = '') {
  return MUTUALLY_EXCLUSIVE_TRAIT_PAIRS.reduce((matches, [left, right]) => {
    if (left === name) matches.push(right);
    if (right === name) matches.push(left);
    return matches;
  }, []);
}

function normalizeTraitName(name = '') {
  return String(name || '')
    .replace(/[\u2018\u2019]/g, '\'')
    .replace(/Ã¢â‚¬â„¢|ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢|â€™/g, '\'');
}

function matchesTraitName(item, name = '') {
  const normalizedTarget = normalizeTraitName(name);
  if (normalizeTraitName(item.name) === normalizedTarget) return true;
  return (item.aliases || []).some((alias) => normalizeTraitName(alias) === normalizedTarget);
}

export function findCuratedTrait(category = 'asset', name = '') {
  const list = category === 'asset' ? CURATED_ASSETS : CURATED_COMPLICATIONS;
  return list.find((item) => matchesTraitName(item, name)) || null;
}
