/**
 * LORE WIKI - Single File Version
 * * This is a bundled single-file version of the Lore Wiki
 * that can be used directly as a React artifact.
 * * For the modular multi-file version, see the /lore-wiki folder.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Users, Map, Sparkles, BookOpen, ChevronRight, 
  Menu, X, Shield, Star, Crown, Scroll, 
  Heart, Target, Home, ArrowLeft, Moon, Sun, Eye, Lock, Key
} from 'lucide-react';

// ============================================================
// CONFIGURATION
// ============================================================

// CHANGE THE PASSWORD HERE
const ACCESS_PASSWORD = "33SECONDS"; 

// ============================================================
// SECTION 1: LORE DATA
// Edit this section to add your own content
// ============================================================

const loreData = {
  characters: [
    {
      id: 'astral-anemos',
      name: 'Astral Anemos',
      title: 'Grand Marshal of the Imperial Aegis',
      category: 'Main Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Astral Anemos',
        'Title': 'Shield of The Kingdom',
        'Affiliation': 'Imperial Aegis',
        'Rank': 'Grand Marshal',
        'Magic Type': 'Wind Magic, Shatter Magic',
        'Weapon': 'Falling Up (Gravity-Enchanted Katana)',
        'Status': 'Active'
      },
      description: `Astral Anemos is the current Grand Marshal of the Imperial Aegis, the kingdom's elite military force. Known as "The Shield of the Kingdom," she rose to prominence after single-handedly destroying one of the Titan Series mechanical giants during the Siege of the Iron Giants.

Her signature weapon, "Falling Up," is a katana enchanted with permanent gravity magic by her best friend Sentinel. Beyond her wind magic abilities, Astral possesses the forbidden Shatter Magic, learned from an Ancient Shatter Scroll.

Her ultimate technique, "Shattering Heaven and Earth," allows her to fracture the very air itself, creating devastating shockwaves that bypass conventional defenses.`,
      abilities: [
        'Wind Step - High-speed movement using wind propulsion',
        'Maximus: Gale Javelin - High-velocity wind projectile attack',
        'Shatter Art: Fracture - Creates shockwaves by "breaking" the air',
        'Shattering Heaven and Earth - Ultimate technique that disintegrates targets'
      ],
      relationships: [
    { name: 'Sentinel', relation: 'Best Friend & "Ace" Partner' },
    { name: 'Luna Phantasma', relation: 'Protective Mentor & "Older Sister" figure' },
    { name: 'General Xi', relation: 'Trusted Strategist & Ally' },
    { name: 'General Mirai', relation: 'Vouched-for Subordinate' },
    { name: 'King Cenric', relation: 'Former Liege Lord' }
  ]
    },
    {
      id: 'sentinel-phantasma',
      name: 'Sentinel Phantasma',
      title: 'Violet Nihility',
      category: 'Main Characters',
      image: './sentinel.png',
      infobox: {
        'Full Name': 'Sentinel Phantasma',
        'Title': 'Violet Nihility',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council/Imperial Aegis)',
        'Rank': 'Rank 1 Cardinal Mage (éna)',
        'Magic Type': 'Gravity Magic, Nihil',
        'Weapon': 'Destiny’s Fall, Inabsolutus Halberd',
        'Status': 'Active (Rogue/Outlaw)'
      },
      description: `Sentinel Phantasma is the Kingdom's strongest and most volatile magic user, formerly known as the "Ace" of the Imperial Aegis. After deciphering a forbidden scroll, she became the vessel for "Nihil," a primordial power capable of deleting magical and physical existence.

    Following her arrest by the Archon for protecting her sister, all Cardinals of Divinity Council resigned to form the "Violet Aegis," a rogue family of misfits seeking to protect her and the world from external threats. Sentinel possesses a unique dual-nature, having eventually merged with the ancient entity Oreia to master her Vera Forma (True Form).

    Though initially limited to a thirty-three-second combat window, her connection to her sister Luna’s Aethereal magic allows her to stabilize her immense power.`,
      abilities: [
        'Gravity Art: Downward Spiral - Intensifies gravity to sink or trip targets',
        'Nano Singularity - A high-density gravity sphere used to destroy structures',
        'Ultimate Art: Oblivion - A barrage of mana blades that nullify magic circuits',
        'Umbra Sanctuarium - A cylindrical domain that imposes absolute spatial control',
        'Absolute Negation - Ultimate technique using Vera Forma to delete existence'
      ],
      relationships: [
        { name: 'Astral Anemos', relation: 'Best Friend & Partner' },
        { name: 'Luna', relation: 'Sister & Aethereal Anchor' },
        { name: 'Oreia', relation: 'Inhabiting Entity (Goddess of the Void)' },
        { name: 'Vesta Aeris', relation: 'Scientific Partner & Confidant' },
        { name: 'Zane Axios', relation: 'Partner & Double Agent' }
      ]
    },
    {
      id: 'luna-phantasma',
      name: 'Luna Phantasma',
      title: 'The Aethereal Spark',
      category: 'Main Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Luna Phantasma', 
        'Title': 'The Spark', 
        'Affiliation': 'Violet Aegis (Formerly Sovereign Saints Academy)', 
        'Rank': 'Senior Cadet',
        'Magic Type': 'Aethereal Magic (Pure Light)', 
        'Status': 'Active'
      },
      description: `Luna is the younger sister of Sentinel Phantasma and was a final-year student at Sovereign Saints Academy before joining the Violet Aegis. She wields Aethereal Magic, a rare and highly destructive form of light magic that initially caused her significant physical recoil due to its overwhelming density.

    After being kidnapped by the Monarch to serve as a light-based "power" for his void form, she was rescued by her sister and the resigned Cardinals. Luna is now recognized as the essential "White Dwarf" anchor to Sentinel's "Black Hole," as her pure light magic is the only force capable of washing out the "Red" corruption within the Nihil power.`,
      abilities: [
        'Aethereal Magic - Unstable light magic that detonates air and incinerates foes',
        'Starburst - A high-tier light spell that Luna is learning to stabilize',
        'Dual Star Orbit - A passive link with Sentinel that creates a loop of infinite, stable energy',
        'Equinox Control - Specialized techniques learned from Xi to manage high-output mana'
      ],
      relationships: [
        { name: 'Sentinel', relation: 'Older Sister & "Dual Star" Partner' },
        { name: 'Mei Xi', relation: 'Mentor' },
        { name: 'Miyu', relation: 'Friend & "Dragon Sister"' },
        { name: 'Astral Anemos', relation: 'Protective Authority Figure' }
      ]
    },
    {
      id: 'general-xi',
      name: 'Mei Xi',
      title: 'Equinox Master',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Mei Xi',
        'Title': 'The Strategist',
        'Affiliation': 'Violet Aegis (Formerly Imperial Aegis)',
        'Rank': 'General',
        'Magic Type': 'Equinox Magic (Light and Dark)',
        'Weapon': 'Dual Blades (Twin Equinoctial Slashes)',
        'Status': 'Active (Rogue)'
      },
      description: `General Xi is a coolly professional high-ranking officer formerly of the Imperial Aegis. Known for her tactical brilliance and mastery of Equinox Magic, she provides the strategic foundation that balances the more chaotic elements of the Violet Aegis. 

    She was instrumental in the recovery operations against the Executioners and was one of the first to commit to protecting Sentinel’s secret. Following the Archon's betrayal, Xi resigned her commission alongside Marshal Anemos to join the rogue Violet Aegis, eventually becoming the mentor to Luna Phantasma.`,
      abilities: [
        'Equinox Magic - A perfect blend of light and dark elements utilized in combat',
        'Twin Equinoctial Slashes - A high-speed offensive technique using dual blades',
        'Maximus: Perfect Confluence - An ultimate weapon art combining light and dark slashes to clash with high-level spells',
        'Mana Tracking - Capability to analyze and track mana signatures and data'
      ],
      relationships: [
        { name: 'Astral Anemos', relation: 'Trusted Friend & Commander' },
        { name: 'Luna Phantasma', relation: 'Student & Aethereal Mentee' },
        { name: 'Sentinel Phantasma', relation: 'Teammate & "Dual Star" Guardian' },
        { name: 'Lyra Mirai', relation: 'Fellow General & Tactical Partner' }
      ]
    },
    {
      id: 'lyra-mirai',
      name: 'Lyra Mirai',
      title: 'Imperial General',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Lyra Mirai',
        'Title': 'The Hero of the Ruins',
        'Affiliation': 'Violet Aegis (Formerly Imperial Aegis)',
        'Rank': 'General',
        'Magic Type': 'Ice Magic (Glacial Art)',
        'Status': 'Active'
      },
      description: `General Mirai is a high-speed skirmisher who rose from Vice General to General after surviving a near-fatal encounter with Sullivan Domineer. Known for her frantic energy and tendency to hyperventilate under pressure, she is nonetheless one of the fastest and most agile fighters in the kingdom.

    She was promoted by King Cenric to serve as a "new hero" to distract the public from Sentinel's existence. After being used as bait in the Whispering Canyons and rescued by the Divinity Council, she realized her true allegiance lay with her teammates, eventually joining the Violet Aegis in their exile.`,
      abilities: [
        'Ultimate Art: Glacial Zero - A wave of absolute cold that locks molecules to stop magic flow',
        'Flash Freeze - Instantaneous creation of ice structures for mobility or defense',
        'High-Mobility Skirmishing - Exceptional reaction speed used to dodge tracking death magic',
        'Rapid Response - Specialization in leading fast-strike units against guerrilla forces'
      ],
      relationships: [
        { name: 'Astral Anemos', relation: 'Commander & Mentor' },
        { name: 'Mei Xi', relation: 'Tactical Partner' },
        { name: 'Sentinel Phantasma', relation: 'Close Friend & "Cosplay" Consultant' },
        { name: 'Sullivan Domineer', relation: 'Archenemy' }
      ]
    },
    {
      id: 'stellium-choros',
      name: 'Stellium Choros',
      title: 'Rank 2 Cardinal Mage (Dio)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Stellium Choros',
        'Title': 'The Knight of the Spire',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Dio)',
        'Magic Type': 'Sacrifice Magic, Sword Arts',
        'Weapon': 'Durandal (Reforged Claymore)',
        'Status': 'Active'
      },
      description: `Cardinal Stellium is the steadfast protector and the second-highest ranking member of the Divinity Council. Known for her ironclad sense of duty, she wields the legendary blade Durandal, which she successfully reforged after years of effort. She is a master of defensive combat, often tasked with holding the line against relentlessly aggressive foes like Thysia Asteri.

    Stellium was the primary advocate for Sentinel's independence, traveling to the Astral Spire to secure divine and demonic blessings for her friend. Her loyalty to Sentinel is so absolute that she was the first to answer the call to resign and form the Violet Aegis, choosing family over the Archon's military structure.`,
      abilities: [
        'Ultimate Weapon Art: Umbral Nova - A devastating swing that releases darkness-infused slashes',
        'Durandal Resonance - Utilizing the dark runic patterns of her blade to counter legendary weapons',
        'Sacrifice Magic Defense - A specialized fighting style designed to outlast conversion-based magic',
        'Absolute Guard - Mastery of parrying and blocking that can withstand the strength of a Voidwalker'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Protective Partner & Best Friend' },
        { name: 'Astral Anemos', relation: 'Peer & Fellow Outlaw' },
        { name: 'Thysia Asteri', relation: 'Rival & Opposite "Durandal" Wielder' },
        { name: 'Polaris Lunae', relation: 'Celestial Contact' }
      ]
    },
    {
      id: 'vesta-aeris',
      name: 'Vesta Aeris',
      title: 'Rank 3 Cardinal Mage (Tria)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Vesta Aeris',
        'Title': 'The Scientist',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Tria)',
        'Magic Type': 'Spirit Magic, Magitech Engineering',
        'Status': 'Active'
      },
      description: `Cardinal Vesta is the intellectual backbone and chief engineer of the Violet Aegis. Originally a Rank 3 Cardinal of the Divinity Council, she is a specialist in Spirit Magic and high-level magitech. Vesta was the primary architect of the "Deceitful Report," creating a fake "Mana Filtration Drive" to hide Sentinel’s Nihil power from the Archon.

    She is the first to scientifically define the "Dual Star" relationship between Sentinel and Luna, recognizing their mana as a self-stabilizing orbit of consumption and emission. Vesta currently operates out of the Astral Spire, managing the group's logistics and conducting medical assessments for both allies and former enemies.`,
      abilities: [
        'Spirit Art: Phantasmal Tide - An ethereal defensive barrier used to withstand physical force',
        'Magitech Engineering - Expert capability in building detection devices, suppression visors, and mana generators',
        'Mana Signature Analysis - Scientific mapping of mana circuits and void patterns',
        'Aethereal Synchronization - Theoretical modeling of Dual Star mana systems'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Best Friend & Lab Partner' },
        { name: 'Luna Phantasma', relation: 'Technical Advisor & Subject Matter Expert' },
        { name: 'Ryusei', relation: 'Scientific Collaborator' },
        { name: 'Lilith Nacht', relation: 'Patient & Research Subject' }
      ]
    },
    {
      id: 'vespera-nox',
      name: 'Vespera Nox',
      title: 'Rank 4 Cardinal Mage (Téssera)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Vespera Nox',
        'Title': 'The Ancient Demon',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Téssera)',
        'Magic Type': 'Poison Art, Death Magic',
        'Status': 'Active'
      },
      description: `Cardinal Vespera is an ancient demon who balances a "grandmotherly warmth" with a terrifying, predatory aura. As a Rank 4 Cardinal, she represents the "Spear" of the Divinity Council. Her presence is described as an oil slick on the soul, capable of making the temperature drop through suffocating heaviness rather than cold.

    Vespera treats Sentinel as a "youngest sister" and was pivotal in the rescue mission at the Stasis Vaults. Despite her lethal capabilities, she is deeply protective of the group's "misfit" nature and often provides a calm, intimidating presence during high-stakes confrontations.`,
      abilities: [
        'Poison Art: Wither - A lethal touch that causes armor and organic matter to rust and decay instantly',
        'Demon Flight - Utilizing large, ancient wings for high-altitude mobility',
        'Dissonance Perception - Capability to sniff out lies and detect ancient, forbidden mana signatures',
        'Abyssal Presence - Passively suppressing surrounding enemies through ancient demonic energy'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Protective "Older Sister"' },
        { name: 'Miyu', relation: 'Combat Partner' },
        { name: 'Lyra Mirai', relation: 'Occasional Rescuer & Mentor' },
        { name: 'Avis', relation: 'Long-term Demonic Peer' }
      ]
    },
    {
      id: 'zane-axios',
      name: 'Zane Axios',
      title: 'Rank 5 Cardinal Mage (Pende)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Zane Axios',
        'Title': 'The Double Agent',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Pende)',
        'Magic Type': 'Spatial Magic',
        'Status': 'Active'
      },
      description: `Zane Axios is a genius Spatial Mage and the strategic "eyes" of the Violet Aegis. Originally assigned by the Archon to spy on Sentinel under "Project: SYN," Zane chose to betray the Citadel, falsifying logs and monitoring signals to protect Sentinel’s privacy.

    An arrogant but loyal operative, Zane utilizes his spatial manipulation to manage the battlefield and provide high-speed transport for the team. His betrayal was the final piece that allowed the Divinity Council to escape the Archon’s grasp, proving that he preferred his "family of misfits" over the Archon’s authority.`,
      abilities: [
        'Spatial Art: Displacement Field - High-precision teleportation and warping of multiple targets',
        'Spatial Coin - A recurring focus for his magic, often used to bridge gaps or trigger effects',
        'Internal Structure Warping - Manipulating the physical dimensions of objects to cause distortion',
        'Signal Loop/Falsification - Hacking and altering security feeds and data logs'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Partner & Field Operative' },
        { name: 'The Archon', relation: 'Former Superior (Betrayed)' },
        { name: 'Stellium Choros', relation: 'Respected Peer' },
        { name: 'Ryusei', relation: 'Tactical Partner' }
      ]
    },
    {
      id: 'modeus-exi',
      name: 'Modeus',
      title: 'Rank 6 Cardinal Mage (Éxi)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Modeus',
        'Title': 'The Pursuer',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Éxi)',
        'Magic Type': 'Stealth Magic, Shadow Manipulation',
        'Status': 'Active'
      },
      description: `Cardinal Modeus is the elite stealth operative and "Pursuer" of the group. An elven mage of few words, she specializes in infiltration, surveillance, and shadow-based extraction. She was initially tasked with monitoring Sentinel within the Citadel, but her loyalty to the team led her to assist in the "conspiracy" to hide Sentinel's recovery from the Archon.

    Modeus is responsible for maintaining the security of the Violet Aegis, often looping security feeds or creating "glitches" to hide training sessions. During the escape from the Citadel, she was instrumental in the stealth extraction of Sentinel from the Stasis Vaults.`,
      abilities: [
        'Shadow Materialization - Emerging from or disappearing into shadows instantly',
        'Stealth Extraction - Executing high-stakes prison breaks without triggering alarms',
        'Security Override - Hacking and looping magitech surveillance systems',
        'Mana Flare Detection - Sensing distant flares of mana to track allies or enemies]'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Teammate & Former Surveillance Target' },
        { name: 'Zane Axios', relation: 'Intelligence Partner' },
        { name: 'Astral Anemos', relation: 'Field Operative' }
      ]
    },
    {
      id: 'miyu-epta',
      name: 'Miyu',
      title: 'Rank 7 Cardinal Mage (Eptá)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Miyu',
        'Title': 'Hybrid Dark Angel-Dragon',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Eptá)',
        'Magic Type': 'Crystalline Flash Magic',
        'Status': 'Active'
      },
      description: `Cardinal Miyu is a hyperactive hybrid of a Dark Angel and a Dragon. Boasting manic energy and a playful demeanor, she often lightens the mood within the Violet Aegis. In combat, however, she is a terrifying force of speed and power, using her Crystalline magic to petrify enemies before shattering them.

    Miyu has a sisterly bond with Luna Phantasma and was one of the first to offer emotional support to Sentinel during her most unstable moments. Despite her child-like curiosity about eating bugs, she is an elite fighter who played a major role in breaking the Resonance Protocol at the Academy.`,
      abilities: [
        'Crystalline Flash - High-speed magic that turns enemies into crystalline statues',
        'Dragon Flight - Extreme aerial mobility using white scales and blinding light',
        'Ethereal Resonance - Ability to perceive and react to shifting mana frequencies',
        'Crystalline Shockwave - Unleashing mana upon impact to throw back armored foes'
      ],
      relationships: [
        { name: 'Luna Phantasma', relation: 'Best Friend & "Shiny Bunny" Sister' },
        { name: 'Sentinel Phantasma', relation: 'Teammate & Snack Sharer' },
        { name: 'Vespera Nox', relation: 'Doting Partner' }
      ]
    },
    {
      id: 'avis-okto',
      name: 'Avis',
      title: 'Rank 8 Cardinal Mage (Októ)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Avis',
        'Title': 'Ancient Demon of the Phoenix',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Októ)',
        'Magic Type': 'Phoenix Flame (Rebirth/Holy Fire)',
        'Status': 'Active'
      },
      description: `Cardinal Avis is an ancient Demon and the spiritual elder of the Violet Aegis. Wielding the absolute heat of the Phoenix Flame, he possesses the power of "Everything" to counter Sentinel's "Nothing". 

    He performed a pivotal role in Sentinel’s survival by using his Holy Flame to penetrate and seal the "Nihil fracture" on her face, creating a permanent brand that prevented her essence from leaking. Though he often appears as a "grumpy grandfather," his loyalty to his "misfit family" led him to burn down the Archon's vaults to free Sentinel.`,
      abilities: [
        'Phoenix Art: Solar Flare - Transforming into a massive bird of golden fire spanning 100 meters',
        'Holy Flame Seal - Creating a permanent metaphysical "plug" for mana leaks',
        'Phoenix Rebirth - Utilizing fire as a creative force to generate existence where there is none',
        'Demon Talons - Transforming limbs into swirling talons of absolute heat'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Grandfatherly Mentor & Protector' },
        { name: 'Astral Anemos', relation: 'Respected Ally' },
        { name: 'The Monarch', relation: 'Ancient Rival' }
      ]
    },
    {
      id: 'selena-enea',
      name: 'Selena',
      title: 'Rank 9 Cardinal Mage (Enéa)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Selena',
        'Title': 'The Subzero Mage',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Enéa)',
        'Magic Type': 'Subzero Magic (Absolute Cold)',
        'Status': 'Active'
      },
      description: `Cardinal Selena is a powerful cryomancer who initially harbored a cold, arrogant resentment toward Sentinel. However, upon learning of Sentinel's true burden and the Archon's manipulation, she became a vital member of the cover-up, using her magic to "freeze" evidence and add realism to their lies.

    Selena’s magic is a reactive force of equilibrium; her body automatically responds to extreme heat or void energy by dropping the local temperature to absolute zero. Despite her detached exterior, she is a reliable defender who stood shoulder-to-shoulder with her peers to resign and form the Violet Aegis.`,
      abilities: [
        'Subzero Magic - Reducing local temperatures to absolute zero to freeze air or machinery',
        'Emergency Reinforcement - Applying rapid-cooling to prevent thermal meltdowns of magitech',
        'Thermal Sensor Icing - Disabling security sensors by manipulating local heat signatures',
        'Reactive Frost - Automatic defensive mana reaction to hostile magic signatures'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Teammate & Former Rival' },
        { name: 'Ryusei', relation: 'Technical Collaborator' },
        { name: 'Vesta Aeris', relation: 'Research Assistant (Field Testing)' }
      ]
    },
    {
      id: 'ryusei-dekka',
      name: 'Ryusei',
      title: 'Rank 10 Cardinal Mage (Déka)',
      category: 'Supporting Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Ryusei',
        'Title': 'The Atomic Mage',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council)',
        'Rank': 'Cardinal Mage (Rank Déka)',
        'Magic Type': 'Atomic Magic',
        'Status': 'Active'
      },
      description: `Cardinal Ryusei is the master of Atomic Magic and the primary data analyst for the Violet Aegis. Known for his cold, logical approach and reliance on precise calculations, he was the first to realize that Sentinel’s power was not mere "filtration" but absolute deletion. 

    Despite his adherence to physics, Ryusei willingly falsified energy logs and developed mathematical models to shield the "anomaly" that is Sentinel from the Archon. He provides critical artillery support and calculated evacuations, maintaining a 98.4% success probability for the team's rogue operations.`,
      abilities: [
        'Atomic Art: Electron Cage - Beams of pure energy that form an inescapable grid',
        'Atomic Artillery - High-precision blasts capable of vaporizing Maestro-level barriers',
        'Atomic Destabilization - Weakening molecular structures by manipulating atomic bonds',
        'Probability Calculation - Real-time analysis of mission success rates and escape windows'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Subject of Study & Teammate' },
        { name: 'Vesta Aeris', relation: 'Technical Collaborator' },
        { name: 'Zane Axios', relation: 'Strategic Partner' },
        { name: 'The Archon', relation: 'Former Superior (Deceived)' }
      ]
    },
    {
  id: 'thysia-asteri',
  name: 'Thysia Asteri',
  title: 'Executioner’s Overseer',
  category: 'Antagonists',
  image: './place.png',
  infobox: {
    'Full Name': 'Thysia Asteri',
    'Title': 'The Red Berserker',
    'Affiliation': 'Forsaken Executioners',
    'Rank': 'Overseer',
    'Magic Type': 'Sacrifice Magic',
    'Weapon': 'Durandal Fragment (Dark Red Claymore)',
    'Status': 'Active (Injured)'
  },
  description: `Thysia Asteri is one of the four elite Overseers of the Forsaken Executioners. A relentlessly aggressive warrior, she wields a massive, dark red claymore made from a fragment of the legendary sword Durandal. Her Sacrifice Magic allows her to steal strength from her opponents to fuel her own strikes, making her an expert in conversion-based combat.

Driven by a fierce desire to prove her strength, she led the brutal assault on the Azure Sanctions to draw out Sentinel. Although she was forced into a truce to combat the Monarch, she remains a volatile rival to the Violet Aegis, currently recovering under their watchful eye at the Astral Spire.`,
  abilities: [
    'Ultimate Weapon Art: Rites of Annihilation - A devastating surge of corrupting energy slashes',
    'Sacrifice Magic - Converting landed strikes into stolen strength and stamina',
    'Durandal Fragment Resonance - Utilizing dark runic patterns to clash with Stellium’s Durandal',
    'Berserker Charge - A high-pressure, close-quarters combat style that ignores standard defenses'
  ],
  relationships: [
    { name: 'Stellium Choros', relation: 'Arch-Rival' },
    { name: 'Sullivan Domineer', relation: 'Fellow Overseer & Strategic Partner' },
    { name: 'Sentinel', relation: 'Respected Enemy & Temporary Ally' },
    { name: 'The Monarch', relation: 'Former Liege (Betrayed)' }
  ]
},
{
  id: 'sullivan-domineer',
  name: 'Sullivan Domineer',
  title: 'Executioner’s Overseer',
  category: 'Antagonists',
  image: './place.png',
  infobox: {
    'Full Name': 'Sullivan Domineer',
    'Title': 'The Architect of Decay',
    'Affiliation': 'Forsaken Executioners',
    'Rank': 'Overseer',
    'Magic Type': 'Death Magic (Domineer Lineage)',
    'Status': 'Active (Reforming)'
  },
  description: `Sullivan Domineer is the calculating and cold-blooded leader of the Overseers. A member of the noble Domineer family, he specializes in elegant yet devastating death curses and corrosive barriers. Sullivan is a master strategist who prioritized "eroding the foundation" of the kingdom by poisoning supply lines and exhausting Sentinel's limited energy reserves.

After realizing the Monarch viewed the Overseers merely as food, Sullivan initiated a "Phantom Gate" escape and formed a desperate truce with the Violet Aegis. He currently leads the rebranding of the Executioners into the 'Domineer Restoration Corp,' dedicated to rebuilding from the ruins of the Dark Continent.`,
  abilities: [
    'Ultimate Art: Herald of the End - A concentrated sphere of absolute decay designed to shatter the soul',
    'Binding Art: Soul Anchor - A vortex of death energy used to counter suppression and empower allies',
    'Phantom Gate - A swirling portal of corrosive shadow used for tactical retreats and spatial travel',
    'Corrosive Wards - Creating rings of energy that burn the skin of those who attempt to pass'
  ],
  relationships: [
    { name: 'Sentinel', relation: 'Former Target & Tactical Ally' },
    { name: 'Thysia Asteri', relation: 'Subordinate Overseer' },
    { name: 'General Mirai', relation: 'Former Prey' },
    { name: 'The Monarch', relation: 'Former Master (Betrayed)' }
  ]
},
{
  id: 'lilith-nacht',
  name: 'Lilith Nacht',
  title: 'Executioner’s Overseer',
  category: 'Antagonists',
  image: './place.png',
  infobox: {
    'Full Name': 'Lilith Nacht',
    'Title': 'The Balance Mage',
    'Affiliation': 'Forsaken Executioners',
    'Rank': 'Overseer',
    'Magic Type': 'Balance Magic (Equilibrium)',
    'Status': 'Active (Power Diminished)'
  },
  description: `Lilith Nacht is a calm and precise mage who specializes in perfect equilibrium. Her Balance Magic allows her to neutralize any force by conjuring its exact opposite, making her nearly untouchable by standard elemental attacks. 

During the clash in the ruins, her magic was utterly shattered by Sentinel's Oblivion blades, which deleted her magical circuits rather than countering them. Now recovering at the Astral Spire with only 42% of her functionality restored, she serves as a research subject for Cardinal Vesta as she relearns how to navigate the world without her absolute control over balance.`,
  abilities: [
    'Ultimate Art: Abyssal Hegemony - Draining surrounding mana into a giant scale to crush opponents',
    'Perfect Equilibrium - Automatically conjuring opposing elements (e.g., cold vs fire) to nullify attacks',
    'Gravitational Inertia - Using balance magic to enforce stasis on high-speed targets',
    'Structural Analysis - Identifying the "greatest instability" in magical domains to disrupt them'
  ],
  relationships: [
    { name: 'General Xi', relation: 'Former Opponent' },
    { name: 'Cardinal Vesta', relation: 'Research Monitor & Healer' },
    { name: 'Sullivan Domineer', relation: 'Former Commander' },
    { name: 'Sentinel', relation: 'The Force that Shattered Her' }
  ]
},
{
    id: 'gamma-voidwalker',
    name: 'Gamma Voidwalker',
    title: 'Executioner’s Overseer',
    category: 'Antagonists',
    image: './place.png',
    infobox: {
      'Full Name': 'Gamma Voidwalker',
      'Title': 'The Brute',
      'Affiliation': 'Forsaken Executioners',
      'Rank': 'Overseer',
      'Magic Type': 'Voidwalking (Physical Prowess)',
      'Status': 'Deceased (Executed)'
    },
    description: `Gamma was the elite "Gamma" rank of the Voidwalker clan, a notorious group known for superhuman endurance and physical power. A monstrously strong fighter with a predatory nature, he relied on overwhelming brute force and a "maelstrom of fists" to crush his enemies. 

  He was the first of the high-value targets to be permanently removed from the battlefield when Sentinel utilized Nihil. Instead of a standard death, his existence was "erased" and "nullified," leaving no trace of the vitality that defined his clan.`,
    abilities: [
      'Ultimate Martial Art: Gatling Blitz - Hundreds of concussive blows, each with the force of a cannon',
      'Superhuman Endurance - Almost inexhaustible stamina typical of the Voidwalker elite',
      'Void Speed - Impossibly fast movement for a figure of his massive size',
      'Vitality Surge - Using raw physical presence to overwhelm mana-based barriers'
    ],
    relationships: [
      { name: 'Sentinel', relation: 'Executioner' },
      { name: 'Vesta Aeris', relation: 'Former Opponent' },
      { name: 'Sullivan Domineer', relation: 'Former Ally' }
    ]
  },
  {
  id: 'the-monarch',
  name: 'The Monarch',
  title: 'Entity of the Dark Continent',
  category: 'Antagonists',
  image: './place.png',
  infobox: {
    'Full Name': 'Unknown',
    'Title': 'The Eclipse',
    'Affiliation': 'Forsaken Executioners (Leader)',
    'Magic Type': 'Void Manipulation, Aethereal Consumption',
    'Status': 'Deceased (Deleted)'
  },
  description: `The Monarch was the supreme ruler of the Dark Continent and the ultimate antagonist behind the Executioners' campaign. A being of shifting silhouettes and cosmic power, he viewed all life—including his own Overseers—as "juice" or "food" to be consumed. 

He sought to harvest Luna’s Aethereal light to stabilize his own fragile void form, temporarily ascending into a ten-foot-tall titan of obsidian armor. He was eventually erased from existence when Sentinel merged with Oreia to manifest the "Vera Forma," utilizing the blade Destiny’s Fall to delete his core entirely.`,
  abilities: [
    'Aethereal Extraction - Forcible draining of light magic to fuel a physical void form',
    'Phantom Gate Control - Creating massive portals of corrosive shadow to transport armies',
    'Dissonance Curse - A frequency-shifting spell that inverts stable magic cores into vacuums',
    'Vocal Pressure - Manifesting physical weight and destructive force through speech alone'
  ],
  relationships: [
    { name: 'Sentinel', relation: 'Targeted Vessel & Executioner' },
    { name: 'Luna Phantasma', relation: 'Stolen Power Source' },
    { name: 'Oreia', relation: 'Ancient Rival & Prey' },
    { name: 'Sullivan Domineer', relation: 'Former Subordinate (Betrayed)' }
  ]
},
{
  id: 'the-archon',
  name: 'The Archon',
  title: 'Leader of the Divinity Council',
  category: 'Antagonists',
  image: './place.png',
  infobox: {
    'Full Name': 'Unknown',
    'Title': 'Leader of the Citadel',
    'Affiliation': 'The Divinity Council (Director)',
    'Rank': 'Supreme Archon',
    'Magic Type': 'Arcane Knowledge, Suppression Arts',
    'Status': 'Active (Powerless/Isolated)'
  },
  description: `The Archon is the formidable leader of the mages within the Citadel. A man of cold, stark practicality, he views magic users as strategic assets rather than people. He branded Sentinel with the name "Violet Nihility" to isolate her as a tool of the state and attempted to imprison her once she became a political liability.

His obsession with control led to the mass resignation of his elite Cardinals and the Grand Marshal. Despite his vast arcane knowledge, he was ultimately outsmarted by Zane Axios and left ruling an empty Citadel, isolated from the very military and magical power he sought to leash.`,
  abilities: [
    'Arcane Interrogation - Using piercing gaze and pressure to extract half-truths from mages',
    'Stasis Protocol - Authority to lock "anomalous" mages in anti-magic vaults',
    'System Oversight - Monitoring the energy grid and mana fluctuations of the entire Citadel',
    'Political Manipulation - Using ranks and codenames to brand and control high-level assets'
  ],
  relationships: [
    { name: 'Sentinel', relation: 'Strategic Asset & "Prisoner"' },
    { name: 'Astral Anemos', relation: 'Former Military Peer & Rival' },
    { name: 'Zane Axios', relation: 'Former Spy (Double-Crossed By)' },
    { name: 'King Cenric', relation: 'Political Superior' }
  ]
}
  ],
  
  worldMap: [
    {
    id: 'the-citadel',
    name: 'The Citadel',
    type: 'Magical Stronghold',
    image: './place.png',
    infobox: {
      'Type': 'Magical Research & Military Hub',
      'Ruler': 'The Archon',
      'Key Locations': "Archon's Study, High Tower, Stasis Vaults, Eye (Operations Center)",
      'Notable Events': 'Sabotage of the Ley Lines, Resignation of the Divinity Council',
      'Status': 'Operational (Compromised)'
    },
    description: `The Citadel is the kingdom's center for arcane knowledge and the base of the Divinity Council. It is a severe, practical fortress designed to house and monitor the world's strongest mages.

Within its walls lies the "Eye," a tactical operations center that monitors mana fluctuations across the kingdom. The Citadel also contains the Stasis Vaults, an anti-magic prison designed to contain "Rogue Anomalies." Recently, the facility suffered significant internal damage following the mass resignation and escape of its high-ranking Cardinals.`
  },
  {
    id: 'astral-spire',
    name: 'The Astral Spire',
    type: 'Floating Sanctuary',
    image: './place.png',
    infobox: {
      'Type': 'Neutral Sanctuary / Rogue Base',
      'Rulers': 'Polaris Lunae & Aurora Glacies',
      'Key Locations': 'Observation Deck, Starlight Balcony, Vesta’s Laboratory',
      'Notable Events': 'Founding of the Violet Aegis',
      'Status': 'Hidden / Active'
    },
    description: `A neutral sanctuary floating above the clouds, the Astral Spire is constructed from starlight and frozen obsidian. It exists outside the political reach of both the Kingdom and the Dark Continent.

It serves as the current headquarters for the Violet Aegis after they fled the Citadel. The environment is rich with immense power, allowing mages to recover and train without surveillance. It is currently the only place where former enemies of the Executioners and the Imperial Aegis live and work together in common cause.`
  },
  {
    id: 'sovereign-saints-academy',
    name: 'Sovereign Saints Academy',
    type: 'Educational Institution',
    image: './place.png',
    infobox: {
      'Type': 'Mage Training Academy',
      'Headmaster': 'Headmaster Valen',
      'Key Locations': 'Headmaster’s Vault, Abandoned Training Hall, Senior Dormitories',
      'Notable Events': 'The Resonance Protocol Attack',
      'Status': 'Rebuilding'
    },
    description: `Sovereign Saints Academy (or "Saints") is the premier institution where both Astral Anemos and Sentinel Phantasma were trained. It is the site where Sentinel first received her gravity magic and where her sister, Luna, studied as a senior cadet.

The academy was recently devastated by an Executioner assault involving Resonance Towers designed to destabilize mana. Despite the destruction of its barrier and campus, it remains a symbolic home for the sisters and is currently undergoing reconstruction.`
  },
  {
    id: 'the-dark-continent',
    name: 'The Dark Continent',
    type: 'Wasteland',
    image: './place.png',
    infobox: {
      'Type': 'Corrupted Territory',
      'Former Ruler': 'The Monarch',
      'Key Locations': 'The Spire, Forsaken Executioners Base, Ash Plains',
      'Notable Events': 'Destruction of the Monarch',
      'Status': 'Under Reconstruction'
    },
    description: `A nightmare landscape of twisted obsidian spires and gray dust where the laws of physics are inverted. The atmosphere is thick with liquid mana storms that are poisonous to standard mages.

At its center stood the Spire, the throne of the Monarch. Following the Monarch's deletion by Sentinel, the continent has transitioned into a zone of recovery. The remaining Executioners, led by Sullivan Domineer, have rebranded as 'Domineer Restoration Corp' to purge the remaining corruption from their homeland.`
  },
  {
    id: 'whispering-canyons',
    name: 'The Whispering Canyons',
    type: 'Geographic Region',
    image: './place.png',
    infobox: {
      'Type': 'Canyon Sector',
      'Key Locations': 'Sector 9, Oakhaven Village',
      'Notable Events': 'Ambush of the 3rd Division, Cardinal Intervention',
      'Status': 'Secured'
    },
    description: `A dangerous geographic sector characterized by narrow passes and steep cliffs, often used by the Executioners for guerrilla warfare. It was the site of a major "Kill Box" trap set for General Mirai.

The region includes the mining town of Oakhaven, which was famously saved from green corrosive fire by Sentinel and Zane. It remains a strategic boundary between the civilized kingdom and the untamed ruins.`
  }
  ],
  
  magicSystem: [
    {
    id: 'nihil-the-void',
    name: 'Nihil (The Void)',
    type: 'Primordial',
    image: './place.png',
    infobox: {
      'Classification': 'Primordial Magic',
      'Primary User': 'Sentinel Phantasma',
      'Time Limit': '33 Seconds (Initial)',
      'Nature': 'Absolute Negation / Deletion'
    },
    description: `Nihil is an ancient, primordial power that defies the established magical hierarchy. Unlike elemental magic that creates or manipulates, Nihil reduces all magical constructs and existence to zero.

Sentinel Phantasma obtained this power by deciphering a forbidden scroll. Its usage is physically taxing, initially causing "fractures" on the user's skin. It is characterized by violet smoke and obsidian energy that "deletes" rather than destroys.`
  },
  {
    id: 'shatter-magic',
    name: 'Shatter Magic',
    type: 'Forbidden',
    image: './place.png',
    infobox: {
      'Classification': 'Forbidden Arts',
      'Primary User': 'Astral Anemos',
      'Origin': 'Ancient Shatter Scroll',
      'Characteristics': 'Vibration, Cracking, Shockwaves'
    },
    description: `Shatter Magic is a forbidden technique that focuses on grabbing the vibrations in the air to "crack" the atmosphere. It was inspired by ancient pirate legends of those who could tilt the seas.

Astral Anemos uses this magic to bypass armor and gold plating, as the vibration travels directly through physical barriers to shatter the core of the target. Her ultimate technique, "Shattering Heaven and Earth," can disintegrate massive mechanical constructs like the Titan Series.`
  },
  {
    id: 'aethereal-magic',
    name: 'Aethereal Magic',
    type: 'Ancient / Hybrid',
    image: './place.png',
    infobox: {
      'Classification': 'Celestial Light Magic',
      'Primary User': 'Luna Phantasma',
      'Stabilization': 'Dual Star Orbit',
      'Nature': 'Unstable High-Output Light'
    },
    description: `Aethereal Magic is a rare, highly destructive form of light magic described as carrying the power of a "Big Bang." Because of its immense density, it is notoriously difficult for a standard vessel to channel without causing internal damage.

When paired with Nihil, Aethereal Magic acts as a stabilizing agent. Luna Phantasma's light "washes out" the corruption of the Void, allowing for a sustainable, infinite energy loop known as the Dual Star system.`
  },
  {
    id: 'equinox-magic',
    name: 'Equinox Magic',
    type: 'Elemental Mastery',
    image: './place.png',
    infobox: {
      'Classification': 'Balanced Elementalism',
      'Primary User': 'General Xi',
      'Elements': 'Light and Dark',
      'Application': 'Synchronization, Defense'
    },
    description: `Equinox Magic is the art of perfectly balancing opposing elements of light and dark. It is a sophisticated style used to synchronize differing mana signatures and stabilize chaotic energy outputs.

General Xi uses Equinox Magic to guide those with unstable high-output magic, such as Luna Phantasma. By mastering the confluence of these forces, practitioners can create "Perfect Confluence" slashes that harmonize destructive energy.`
  },
  {
    id: 'destinys-fall',
    name: "Destiny's Fall",
    type: 'Artifact Weapon',
    image: './place.png',
    infobox: {
      'Weapon Type': 'Nihil-Infused Dagger',
      'Primary User': 'Sentinel Phantasma',
      'Core': 'Trapped White Star',
      'Form': 'Vera Forma (True Form)'
    },
    description: `Destiny's Fall is the ultimate manifestation of Sentinel's power in her Vera Forma. The weapon is a dagger crafted from deep violet crystal encased in obsidian shadow.

At the center of its crossguard sits a brilliant white star that pulses with a heartbeat. The blade drips with void energy and is used to execute "Absolute Negation," a technique that deletes the essence of a target, effectively removing them from existence.`
  },
  {
    id: 'falling-up',
    name: 'Falling Up',
    type: 'Enchanted Weapon',
    image: './place.png',
    infobox: {
      'Weapon Type': 'Gravity-Enchanted Katana',
      'Original Creator': 'Sentinel Phantasma',
      'Current User': 'Astral Anemos',
      'Enchantment': 'Permanent Gravity / Weight Manipulation'
    },
    description: `"Falling Up" is a katana that hums with a faint violet resonance. It was enchanted by Sentinel as a gift for Astral Anemos to grant her attacks the "crunch" and weight needed to cut through heavy armor.

The sword allows the wielder to manipulate the gravity of the blade itself, parrying massive limbs with "impossible weight" or anchoring the wielder's body to the ground to prevent recoil from powerful shockwave attacks.`
  }
  ],
  
  history: [
    {
      id: 'academy-days',
      name: 'Academy Days: A Friendship Forged',
      era: 'Past',
      image: './place.png',
      infobox: {
        'Time Period': 'Approximately 10 years ago',
        'Location': 'Sovereign Saints Academy',
        'Key Figures': 'Astral, Sentinel',
        'Significance': 'Birth of the legendary partnership'
      },
      description: `During their second year at Sovereign Saints Academy, Sentinel faced expulsion. Despite possessing immense mana reserves, she couldn't control elemental magic.

Astral broke into the Headmaster's vault to steal the Ancient Gravity Scroll, saying: "If you can't keep up with the elements, force them to bow to you." This act of friendship transformed Sentinel into an Archmage.`
    },
    {
      id: 'siege-of-iron-giants',
      name: 'The Siege of the Iron Giants',
      era: 'Recent Past',
      image: './place.png',
      infobox: {
        'Time Period': '3 years ago',
        'Location': 'Northern Gate, Royal Capital',
        'Outcome': "Astral's rise to Grand Marshal"
      },
      description: `The Doctors' masterpiece arrived at dawn—three Titan Series mechanical giants plated in anti-magic gold. The former Grand Marshal fell defending the gate.

Then Astral Anemos walked through the panicked soldiers. With Sentinel's gravity assist, she unleashed "Shattering Heaven and Earth" and disintegrated the Giant. Two days later, Astral rose as Grand Marshal.`
    },
    {
      id: 'sentinel-ascension',
      name: "Sentinel's Ascension",
      era: 'Present',
      image: './place.png',
      infobox: {
        'Time Period': 'Present day',
        'Location': "Executioners' Vault",
        'Outcome': 'Achievement of Inabsolutus Form'
      },
      description: `Within the Executioners' treasure vault, Sentinel discovered the Violet Nihility scroll. The power was addictive, consuming. She attacked her best friend before Astral used Shattering Fist to break the corruption.

But Sentinel had conquered it. Her power shifted from corrupted black to focused purple. She had achieved Ascension—becoming perhaps the most powerful being in the kingdom.`
    }
  ]
};

const getLoreStats = () => ({
  characters: loreData.characters.length,
  locations: loreData.worldMap.length,
  magicTypes: loreData.magicSystem.length,
  events: loreData.history.length
});

// ============================================================
// SECTION 2: UI COMPONENTS
// ============================================================

const FloatingParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animation: `float ${8 + Math.random() * 4}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 5}s`
        }}
      />
    ))}
  </div>
);

const Divider = ({ icon: Icon = Sparkles }) => (
  <div className="flex items-center gap-4">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
    <Icon className="w-4 h-4 text-violet-500/50" />
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-violet-600/40 to-transparent" />
  </div>
);

const Breadcrumb = ({ items, onNavigate }) => (
  <nav className="flex items-center space-x-2 text-sm mb-6 flex-wrap">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        {index > 0 && <ChevronRight className="w-4 h-4 text-violet-600/50" />}
        <button
          onClick={() => item.path && onNavigate(item.path)}
          className={index === items.length - 1 ? 'text-violet-300 font-medium' : 'text-violet-500/70 hover:text-violet-300 transition-colors'}
        >
          {item.label}
        </button>
      </React.Fragment>
    ))}
  </nav>
);

const Infobox = ({ title, image, data }) => (
  <div className="relative">
    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-violet-500/60 rounded-tl-lg" />
    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-violet-500/60 rounded-tr-lg" />
    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-violet-500/60 rounded-bl-lg" />
    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-violet-500/60 rounded-br-lg" />
    
    <div className="bg-gradient-to-br from-stone-900/95 via-stone-800/95 to-stone-900/95 border border-violet-700/40 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-violet-900/60 via-violet-800/40 to-violet-900/60 px-4 py-3 border-b border-violet-700/40">
        <h3 className="font-bold text-violet-200 text-center text-lg">{title}</h3>
      </div>
      <div className="p-4">
        <div className="w-full aspect-square bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg flex items-center justify-center text-6xl mb-4 border border-violet-700/30">
          <img src={image} className="rounded-lg object-cover w-full h-full" alt={title} />
        </div>
        <table className="w-full">
          <tbody>
            {Object.entries(data).map(([key, value]) => (
              <tr key={key} className="border-b border-violet-700/20 last:border-0">
                <th className="text-left py-2 pr-3 text-violet-400/80 text-sm font-medium align-top w-2/5">{key}</th>
                <td className="py-2 text-stone-300 text-sm">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const LoreCard = ({ item, onClick }) => (
  <button onClick={onClick} className="group w-full text-left relative overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
    <div className="relative bg-gradient-to-br from-stone-800/90 via-stone-800/80 to-stone-900/90 rounded-xl overflow-hidden border border-violet-700/30 group-hover:border-violet-500/50 transition-all duration-500 shadow-lg">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="flex items-start p-5 gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-violet-900/50 to-stone-900 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-500 border border-violet-700/30 overflow-hidden">
          <img src={item.image} className="rounded-lg object-cover w-full h-full" alt={item.name} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-violet-100 text-lg group-hover:text-violet-300 transition-colors truncate">{item.name}</h3>
          {item.title && <p className="text-violet-500/80 text-sm mt-0.5 italic">{item.title}</p>}
          <div className="flex flex-wrap gap-2 mt-2">
            {item.type && <span className="px-3 py-1 bg-violet-900/40 text-violet-400 text-xs rounded-full border border-violet-700/30">{item.type}</span>}
            {item.era && <span className="px-3 py-1 bg-violet-900/40 text-violet-400 text-xs rounded-full border border-violet-700/30">{item.era}</span>}
            {item.category && <span className="px-3 py-1 bg-violet-900/40 text-violet-400 text-xs rounded-full border border-violet-700/30">{item.category}</span>}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-violet-600/50 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </button>
);

const SearchBar = ({ value, onChange, onMenuClick }) => (
  <div className="flex items-center gap-3 mb-6 sticky top-0 z-30 bg-gradient-to-b from-stone-900 via-stone-900/95 to-transparent pt-4 pb-8 -mt-4 -mx-4 px-4 md:-mx-8 md:px-8">
    <button onClick={onMenuClick} className="lg:hidden p-3 bg-stone-800 rounded-xl border border-violet-700/30 hover:border-violet-600/50 transition-all">
      <Menu className="w-5 h-5 text-violet-500" />
    </button>
    <div className="relative flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-600/50" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search the ancient archives..."
        className="w-full pl-12 pr-12 py-3 bg-stone-800/80 border border-violet-700/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all placeholder-stone-500 text-stone-200"
      />
      <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-600/30" />
    </div>
  </div>
);

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="bg-gradient-to-br from-stone-800/90 to-stone-900/90 rounded-xl p-5 text-center border border-violet-700/20 hover:border-violet-600/40 transition-colors">
    <Icon className="w-8 h-8 mx-auto mb-2 text-violet-400/70" />
    <div className="text-3xl font-bold text-violet-200">{value}</div>
    <div className="text-stone-400 text-sm">{label}</div>
  </div>
);

const CategoryCard = ({ title, subtitle, description, icon: Icon, onClick }) => (
  <button onClick={onClick} className="group relative text-left overflow-hidden rounded-2xl w-full">
    <div className="relative bg-gradient-to-br from-stone-800/90 via-stone-800/80 to-stone-900/90 p-6 border border-violet-700/30 group-hover:border-violet-500/50 transition-all duration-500 rounded-2xl">
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full" />
      <div className="relative z-10 flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-violet-700/40 to-violet-900/40 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500 border border-violet-600/30">
          <Icon className="w-7 h-7 text-violet-400" />
        </div>
        <div className="flex-1">
          <p className="text-violet-500/60 text-xs font-medium tracking-widest uppercase">{subtitle}</p>
          <h3 className="text-xl font-bold text-violet-100 group-hover:text-violet-200 transition-colors">{title}</h3>
          <p className="text-stone-400 mt-1 text-sm italic">{description}</p>
        </div>
        <ChevronRight className="w-6 h-6 text-violet-600/30 group-hover:text-violet-400 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  </button>
);

// ============================================================
// SECTION 3: PAGE COMPONENTS
// ============================================================

const LockScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ACCESS_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-stone-900/50 to-stone-950 pointer-events-none" />
      <FloatingParticles />

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md">
        <div className="absolute -top-3 -left-3 w-12 h-12 border-t-2 border-l-2 border-violet-500/60 rounded-tl-xl" />
        <div className="absolute -top-3 -right-3 w-12 h-12 border-t-2 border-r-2 border-violet-500/60 rounded-tr-xl" />
        <div className="absolute -bottom-3 -left-3 w-12 h-12 border-b-2 border-l-2 border-violet-500/60 rounded-bl-xl" />
        <div className="absolute -bottom-3 -right-3 w-12 h-12 border-b-2 border-r-2 border-violet-500/60 rounded-br-xl" />

        <div className="bg-stone-900/90 backdrop-blur-xl border border-violet-700/30 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-700/30 to-violet-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-violet-500/30">
              <Lock className="w-8 h-8 text-violet-400" />
            </div>
            <h1 className="text-3xl font-bold text-purple-100 mb-2 font-cinzel tracking-wider">Restricted Access</h1>
            <p className="text-purple-500/60 text-sm uppercase tracking-widest">Aegis Archives</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-600/50" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Enter access code..."
                className={`w-full pl-12 pr-4 py-4 bg-stone-950/50 border rounded-xl focus:outline-none focus:ring-2 transition-all text-stone-200 placeholder-stone-600
                  ${error ? 'border-red-500/50 focus:ring-red-500/30' : 'border-violet-700/30 focus:ring-violet-500/30 border-violet-500/20'}
                `}
                autoFocus
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-900/10 py-2 rounded-lg border border-red-900/20 animate-pulse">
                Access Denied: Unknown Code
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-600 hover:to-purple-700 text-violet-50 font-bold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-violet-500/30 flex items-center justify-center gap-2"
            >
              <Shield className="w-5 h-5" />
              <span>Enter Archives</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-violet-800/50 text-center">
            <p className="text-stone-500 text-[14px]">
              <span className="text-violet-500/70 italic">"Only those who know the duration of the Void may enter the Spire."</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ activeCategory, onSelectCategory, isOpen, onClose }) => {
  const categories = [
    { id: 'home', name: 'Home', icon: Home },
    { id: 'characters', name: 'Characters', icon: Users },
    { id: 'worldMap', name: 'World Map', icon: Map },
    { id: 'magicSystem', name: 'Magic System', icon: Sparkles },
    { id: 'history', name: 'History', icon: BookOpen }
  ];

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex flex-col shadow-2xl border-r border-violet-800/20`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600/50 via-violet-400/50 to-violet-600/50" />
        <div className="p-6 border-b border-violet-800/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-700/50 to-violet-900/50 rounded-xl flex items-center justify-center shadow-lg border border-violet-600/30">
                <img src='../Icon_Main.png'></img>
              </div>
              <div>
                <h1 className="text-xl font-bold text-violet-200 tracking-wide">Lore Wiki</h1>
                <p className="text-violet-600/60 text-xs tracking-widest uppercase">Violet Aegis Archives</p>
              </div>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-violet-600 hover:text-violet-400 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { onSelectCategory(cat.id); onClose(); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all relative ${isActive ? 'bg-gradient-to-r from-violet-800/40 to-violet-900/20 text-violet-200 border border-violet-600/30' : 'text-stone-400 hover:bg-stone-800/50 hover:text-violet-300 border border-transparent'}`}
              >
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-violet-500 rounded-r-full" />}
                <Icon className={`w-5 h-5 ${isActive ? 'text-violet-400' : ''}`} />
                <span className="font-medium">{cat.name}</span>
                {isActive && <Sparkles className="ml-auto w-4 h-4 text-violet-500/50" />}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-violet-800/30">
          <div className="bg-stone-800/50 rounded-xl p-4 border border-violet-700/20">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-violet-500/60" />
              <span className="text-violet-400/80 text-xs font-medium">Arcane Note</span>
            </div>
            <p className="text-stone-400 text-xs">Message <code className="text-violet-400/80 bg-stone-900 px-1 rounded">pukao</code> for questions.</p>
          </div>
        </div>
      </aside>
    </>
  );
};

const HomeContent = ({ onSelectCategory }) => {
  const stats = getLoreStats();
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-900/30 via-stone-900 to-violet-900/30" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-violet-500/40 rounded-tl-xl" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-violet-500/40 rounded-tr-xl" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-violet-500/40 rounded-bl-xl" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-violet-500/40 rounded-br-xl" />
        <div className="relative p-8 md:p-12 border border-violet-700/30">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-violet-400" />
            <div className="w-16 h-px bg-gradient-to-r from-violet-400/50 to-transparent" />
            <span className="text-violet-400/80 text-sm font-medium tracking-widest uppercase">Imperial Archives</span>
            <div className="w-16 h-px bg-gradient-to-l from-violet-400/50 to-transparent" />
            <Sun className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-200 via-violet-100 to-violet-200 mb-4">The Grand Chronicle</h1>
          <p className="text-stone-300 text-lg md:text-xl max-w-2xl">Within these ancient pages lies the collected wisdom of ages past. Discover the legendary heroes, forbidden magics, and sacred lands that shape the fate of the realm.</p>
          <Divider icon={Scroll} />
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Characters" value={stats.characters} icon={Users} />
        <StatCard label="Locations" value={stats.locations} icon={Map} />
        <StatCard label="Magic Types" value={stats.magicTypes} icon={Sparkles} />
        <StatCard label="Events" value={stats.events} icon={BookOpen} />
      </div>

      <div>
        <div className="flex items-center gap-4 mb-6">
          <Crown className="w-6 h-6 text-violet-500" />
          <h2 className="text-2xl font-bold text-violet-200">Explore the Archives</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-violet-600/30 to-transparent" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <CategoryCard title="Characters" subtitle="Heroes & Villains" description="Those whose fates are written in the stars" icon={Users} onClick={() => onSelectCategory('characters')} />
          <CategoryCard title="World Map" subtitle="Lands of Mystery" description="From sacred capitals to forsaken ruins" icon={Map} onClick={() => onSelectCategory('worldMap')} />
          <CategoryCard title="Magic System" subtitle="The Arcane Arts" description="Powers that bend reality itself" icon={Sparkles} onClick={() => onSelectCategory('magicSystem')} />
          <CategoryCard title="History" subtitle="Chronicles of Ages" description="Wars fought, bonds forged, legends born" icon={BookOpen} onClick={() => onSelectCategory('history')} />
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-900/20 via-stone-900 to-violet-900/20" />
        <div className="relative p-6 border border-violet-700/30">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-violet-400" />
            <h3 className="text-lg font-bold text-violet-300">Featured: Grand Marshal Astral Anemos</h3>
          </div>
          <p className="text-stone-300 italic">"The Shield of the Kingdom" — wielder of the gravity-enchanted katana "Falling Up" and master of the forbidden Shatter Magic. Her story is one of friendship, sacrifice, and the will to protect those she loves.</p>
        </div>
      </div>
    </div>
  );
};

const CategoryContent = ({ category, searchQuery, onSelectItem }) => {
  const config = {
    characters: { title: 'Characters', subtitle: 'Heroes & Villains of the Realm', icon: Users, description: 'Those whose fates intertwine with destiny' },
    worldMap: { title: 'World Map', subtitle: 'Lands of Mystery & Wonder', icon: Map, description: 'Sacred grounds and forsaken territories' },
    magicSystem: { title: 'Magic System', subtitle: 'The Arcane Arts', icon: Sparkles, description: 'Powers that shape reality itself' },
    history: { title: 'History', subtitle: 'Chronicles of Ages Past', icon: BookOpen, description: 'Tales written in blood and glory' }
  }[category];
  
  const data = loreData[category] || [];
  const Icon = config.icon;

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query))
    );
  }, [data, searchQuery]);

  const groupedData = useMemo(() => {
    if (category !== 'characters') return null;
    const groups = {};
    filteredData.forEach(item => {
      const cat = item.category || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(item);
    });
    return groups;
  }, [category, filteredData]);

  return (
    <div>
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-violet-500/10 to-violet-500/5 rounded-2xl blur-xl" />
        <div className="relative bg-gradient-to-br from-stone-800/80 to-stone-900/80 rounded-2xl p-6 border border-violet-700/30">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-700/50 to-violet-900/50 rounded-xl flex items-center justify-center shadow-lg border border-violet-600/30">
              <Icon className="w-7 h-7 text-violet-400" />
            </div>
            <div>
              <p className="text-violet-500/60 text-sm font-medium tracking-widest uppercase">{config.subtitle}</p>
              <h1 className="text-3xl font-bold text-violet-100">{config.title}</h1>
              <p className="text-stone-400 italic mt-1">{config.description}</p>
            </div>
          </div>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="text-center py-16 bg-stone-800/50 rounded-2xl border border-violet-700/20">
          <Search className="w-12 h-12 text-violet-600/30 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">No ancient records found for "{searchQuery}"</p>
        </div>
      ) : groupedData ? (
        Object.entries(groupedData).map(([groupName, items]) => (
          <div key={groupName} className="mb-8">
            <h2 className="text-xl font-bold text-violet-300 mb-4 flex items-center gap-3">
              {groupName === 'Main Characters' && <Star className="w-5 h-5 text-violet-400" />}
              {groupName === 'Supporting Characters' && <Shield className="w-5 h-5 text-emerald-400" />}
              {groupName === 'Antagonists' && <Target className="w-5 h-5 text-rose-400" />}
              {groupName}
              <div className="flex-1 h-px bg-gradient-to-r from-violet-600/30 to-transparent" />
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map(item => <LoreCard key={item.id} item={item} onClick={() => onSelectItem(item)} />)}
            </div>
          </div>
        ))
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredData.map(item => <LoreCard key={item.id} item={item} onClick={() => onSelectItem(item)} />)}
        </div>
      )}
    </div>
  );
};

const ArticleView = ({ item, category, onBack }) => {
  const categoryNames = { characters: 'Characters', worldMap: 'World Map', magicSystem: 'Magic System', history: 'History' };
  const breadcrumbs = [
    { label: 'Home', path: 'home' },
    { label: categoryNames[category], path: category },
    { label: item.name, path: null }
  ];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-violet-500 hover:text-violet-300 mb-4 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Return to Archives</span>
      </button>
      
      <Breadcrumb items={breadcrumbs} onNavigate={(path) => path && onBack()} />
      
      <div className="flex flex-col lg:flex-row gap-8">
        <article className="flex-1 min-w-0">
          <div className="relative">
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-violet-500/40 rounded-tl-xl" />
            <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-violet-500/40 rounded-tr-xl" />
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-violet-500/40 rounded-bl-xl" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-violet-500/40 rounded-br-xl" />
            
            <div className="bg-gradient-to-br from-stone-800/95 via-stone-800/90 to-stone-900/95 rounded-2xl shadow-2xl border border-violet-700/30 overflow-hidden">
              <div className="relative bg-gradient-to-r from-violet-900/50 via-violet-800/30 to-violet-900/50 px-8 py-6 border-b border-violet-700/30">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-violet-800/60 to-stone-900 rounded-xl flex items-center justify-center text-5xl border border-violet-600/40 shadow-lg overflow-hidden">
                  <img src={item.image} className="rounded-lg object-cover w-full h-full" alt={item.name} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-violet-100 tracking-wide">{item.name}</h1>
                    {item.title && <p className="text-violet-400/80 text-lg mt-1 italic">{item.title}</p>}
                  </div>
                </div>
              </div>
              
              <div className="p-8">
                <Divider />
                <div className="mt-6 space-y-4">
                  {item.description.split('\n\n').map((p, i) => (
                    <p key={i} className={`indent-8 text-stone-300 leading-relaxed ${i === 0 ? 'first-letter:text-2xl first-letter:text-violet-400 first-letter:mr-1' : ''}`}>{p}</p>
                  ))}
                </div>
                
                {item.abilities && (
                  <div className="mt-8 pt-6 border-t border-violet-700/30">
                    <h2 className="text-xl font-bold text-violet-200 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-violet-500" /> Abilities & Techniques
                    </h2>
                    <ul className="space-y-3">
                      {item.abilities.map((ability, i) => (
                        <li key={i} className="flex items-start gap-3 text-stone-300 bg-stone-900/50 rounded-lg p-3 border border-violet-700/20">
                          <span className="w-2 h-2 bg-violet-500 rounded-full mt-2 flex-shrink-0" />
                          {ability}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {item.relationships && (
                  <div className="mt-8 pt-6 border-t border-violet-700/30">
                    <h2 className="text-xl font-bold text-violet-200 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-rose-400" /> Bonds & Connections
                    </h2>
                    <div className="grid gap-3">
                      {item.relationships.map((rel, i) => (
                        <div key={i} className="flex items-center gap-3 bg-stone-900/80 rounded-lg px-4 py-3 border border-violet-700/20">
                          <span className="font-semibold text-violet-300">{rel.name}</span>
                          <span className="text-violet-600/50">✦</span>
                          <span className="text-stone-400 italic">{rel.relation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
        
        <aside className="lg:w-80 flex-shrink-0">
          <div className="sticky top-4">
            <Infobox title={item.name} image={item.image} data={item.infobox} />
          </div>
        </aside>
      </div>
    </div>
  );
};

// ============================================================
// SECTION 4: MAIN APP
// ============================================================

export default function LoreWiki() {
  const [activeCategory, setActiveCategory] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for stored session on mount
  useEffect(() => {
    const session = sessionStorage.getItem('lore_wiki_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('lore_wiki_auth', 'true');
  };

  const handleSelectCategory = (category) => {
    setActiveCategory(category);
    setSelectedItem(null);
    setSearchQuery('');
  };

  const handleSelectItem = (item) => {
    setSelectedItem(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-200 font-serif">
         <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
          * { font-family: 'Crimson Text', serif; }
          h1, h2, h3, h4, h5, h6 { font-family: 'Cinzel', serif; }
          @keyframes float {
            0%, 100% { transform: translateY(0px); opacity: 0.3; }
            50% { transform: translateY(-20px); opacity: 0.6; }
          }
        `}</style>
        <LockScreen onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 flex relative">
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20200%20200%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cfilter%20id%3D%22noise%22%3E%3CfeTurbulence%20type%3D%22fractalNoise%22%20baseFrequency%3D%220.65%22%20numOctaves%3D%223%22%20stitchTiles%3D%22stitch%22%2F%3E%3C%2Ffilter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23noise)%22%20opacity%3D%220.03%22%2F%3E%3C%2Fsvg%3E')] pointer-events-none" />
      <FloatingParticles />
      
      <Sidebar activeCategory={activeCategory} onSelectCategory={handleSelectCategory} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-h-screen overflow-x-hidden relative z-10">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
           <SearchBar value={searchQuery} onChange={setSearchQuery} onMenuClick={() => setSidebarOpen(true)} />
          
          {selectedItem ? (
            <ArticleView item={selectedItem} category={activeCategory} onBack={() => setSelectedItem(null)} />
          ) : activeCategory === 'home' ? (
            <HomeContent onSelectCategory={handleSelectCategory} />
          ) : (
            <CategoryContent category={activeCategory} searchQuery={searchQuery} onSelectItem={handleSelectItem} />
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        * { font-family: 'Crimson Text', serif; }
        h1, h2, h3, h4, h5, h6 { font-family: 'Cinzel', serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1c1917; }
        ::-webkit-scrollbar-thumb { background: #4800b4; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4800b4; }
      `}</style>
    </div>
  );
}