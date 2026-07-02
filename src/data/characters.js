export const characters = [
    {
      id: 'astral-anemos',
      name: 'Astral Anemos',
      title: 'Leader of the Violet Aegis',
      category: 'Main Characters',
      image: './place.png',
      infobox: {
        'Full Name': 'Astral Anemos',
        'Title': 'Shield of The Kingdom / Leader of the Violet Aegis',
        'Affiliation': 'Violet Aegis (Formerly Imperial Aegis)',
        'Rank': 'Grand Marshal (Defected)',
        'Magic Type': 'Wind Magic, Shatter Magic',
        'Weapon': 'Falling Up (Gravity-Enchanted Katana)',
        'Status': 'Active (Violet Aegis)'
      },
      description: `Astral Anemos is the former Grand Marshal of the Imperial Aegis and current leader of the Violet Aegis. Known as "The Shield of the Kingdom," she rose to military prominence after single-handedly destroying one of the Titan Series mechanical giants during the Siege of the Iron Giants—an act that earned her the Grand Marshal title at an exceptionally young age.

Her bond with Sentinel Phantasma is the emotional core of her story. A decade ago, when Sentinel faced expulsion from Sovereign Saints Academy for being unable to control elemental magic, Astral broke into the Headmaster's vault to steal the Ancient Gravity Scroll, telling her: "If you can't keep up with the elements, force them to bow to you." This act of friendship transformed Sentinel into an Archmage and defined their unbreakable partnership.

When Sentinel was arrested by the Archon for protecting her sister, Astral did not hesitate. She resigned her commission as Grand Marshal, rallied the Cardinals of the Divinity Council, and orchestrated their mass defection from the Citadel. Under her leadership, the group established the Violet Aegis—a rogue coalition operating from the Astral Spire, outside the reach of the Kingdom's authority.

In Act 2, Astral's role evolves from soldier to strategist. She leverages her encyclopedic knowledge of the Citadel's internal procedures, chain of command, and bureaucratic vulnerabilities to dismantle the Kingdom's operations from the outside. She coordinates high-risk missions including infiltrating Executioner territory alongside the unlikely alliance with Sullivan Domineer's reformed Domineer Restoration Corp. She also navigates complex new relationships with Sera Vael and Voss, integrating former adversaries into the Violet Aegis's expanding network.

Her signature weapon, "Falling Up," is a katana enchanted with permanent gravity magic by Sentinel. Beyond her natural wind magic, she wields the forbidden Shatter Magic drawn from an Ancient Shatter Scroll, capable of cracking the atmosphere itself.`,
      abilities: [
        'Wind Step - High-speed movement using wind propulsion',
        'Maximus: Gale Javelin - High-velocity wind projectile attack',
        'Shatter Art: Fracture - Creates shockwaves by vibrating and "cracking" the air',
        'Shattering Heaven and Earth - Ultimate technique that disintegrates armored targets including Titan Series giants',
        'Citadel Institutional Knowledge - Weaponizes her Grand Marshal expertise: exploits Citadel protocols, chain-of-command gaps, and procedural blind spots as tactical tools against the Kingdom'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Best Friend & Lifelong Partner — the person she defected for' },
        { name: 'Luna Phantasma', relation: 'Protective Mentor & "Older Sister" figure' },
        { name: 'General Xi', relation: 'Trusted Strategist & Ally' },
        { name: 'General Mirai', relation: 'Vouched-for Subordinate' },
        { name: 'King Cenric', relation: 'Former Liege Lord (Estranged)' },
        { name: 'Sullivan Domineer', relation: 'Uneasy Ally — negotiated truce for common cause' },
        { name: 'Sera Vael', relation: 'New Recruit & Emerging Ally (Act 2)' },
        { name: 'Voss', relation: 'Integrated Ally via Domineer Corp alliance (Act 2)' }
      ]
    },
    {
      id: 'sentinel-phantasma',
      name: 'Sentinel Phantasma',
      title: 'Violet Nihility',
      category: 'Main Characters',
      image: '/images/sentinel.png',
      infobox: {
        'Full Name': 'Sentinel Phantasma',
        'Title': 'Violet Nihility',
        'Affiliation': 'Violet Aegis (Formerly Divinity Council/Imperial Aegis)',
        'Rank': 'Rank 1 Cardinal Mage (éna)',
        'Magic Type': 'Gravity Magic, Nihil',
        'Weapon': "Destiny's Fall, Inabsolutus Halberd",
        'Status': 'Active (Violet Aegis)'
      },
      description: `Sentinel Phantasma is the Kingdom's strongest and most volatile magic user, formerly known as the "Ace" of the Imperial Aegis. Described by the Archon as a "Rogue Anomaly," she is feared not for her rank but for the nature of her power — Nihil, a primordial force that does not destroy, but deletes.

Her path to Nihil began when she deciphered a forbidden scroll hidden in the Executioners' treasure vault. The power was immediately addictive and consuming, initially causing fractures across her skin and pushing her to the edge of corruption. Before she could be lost entirely, Astral used Shattering Fist to break through — and what emerged was not the same mage. Her mana shifted from corrupted black to focused violet. She had achieved Ascension, claiming the Inabsolutus Form and becoming what many believe to be the most powerful singular entity in the kingdom.

The event that changed everything was her arrest. When Sentinel moved to protect her younger sister Luna, the Archon had her detained. In response, every Cardinal of the Divinity Council resigned their commissions. Astral Anemos personally led the defection, and together they escaped the Citadel to form the Violet Aegis — a rogue coalition headquartered at the Astral Spire, beyond the Kingdom's reach.

In Act 2, Sentinel's role deepens from weapon to cornerstone. At the Astral Spire, her bond with Luna creates the Dual Star system — Luna's Aethereal magic stabilizes the Void's corruption, allowing Sentinel to sustain her power indefinitely without the original thirty-three-second limit. She personally ends the Monarch by deletion, removing the Dark Continent's ruling threat from existence entirely.

She carries a dual nature forged between her human self and Oreia, the ancient Goddess of the Void who inhabits her. Their relationship evolves in Act 2 from tension to accord — Sentinel does not channel Oreia, she co-exists with her. The Inabsolutus Halberd is the physical expression of this merged state, manifested only when both are fully aligned.`,
      abilities: [
        'Gravity Art: Downward Spiral - Intensifies gravity to sink or immobilize targets',
        'Nano Singularity - A high-density gravity sphere capable of demolishing structures',
        'Ultimate Art: Oblivion - A barrage of mana blades that nullify and sever magic circuits',
        'Umbra Sanctuarium - A cylindrical domain imposing absolute spatial control over all within',
        'Absolute Negation - Vera Forma ultimate: deletes the essence of a target, removing them from existence',
        'Inabsolutus Form - Ascended state achieved after conquering Nihil corruption; power signature shifts to focused violet, removing the 33-second limit and unlocking the Inabsolutus Halberd',
        'Dual Star (with Luna Phantasma) - A sustained infinite energy loop where Luna\'s Aethereal light washes out Void corruption, allowing indefinite high-output combat'
      ],
      relationships: [
        { name: 'Astral Anemos', relation: 'Best Friend & the person who pulled her back from the Void' },
        { name: 'Luna Phantasma', relation: 'Sister & Aethereal Anchor — the reason she was arrested, and the reason the Violet Aegis exists' },
        { name: 'Oreia', relation: 'Co-inhabiting Entity (Goddess of the Void) — evolved from conflict to accord in Act 2' },
        { name: 'Vesta Aeris', relation: 'Scientific Partner & Confidant' },
        { name: 'Zane Axios', relation: 'Partner & Double Agent' },
        { name: 'Sullivan Domineer', relation: 'Grudging Ally — mutual enemy became shared cause after Monarch\'s deletion' },
        { name: 'Sera Vael', relation: 'New Ally (Act 2)' },
        { name: 'Voss', relation: 'New Ally via Domineer Corp alliance (Act 2)' },
        { name: 'The Monarch', relation: 'Destroyed — deleted via Absolute Negation' },
        { name: 'The Archon', relation: 'Primary Antagonist — ordered her arrest and containment in Stasis Vaults' }
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
        'Title': 'The Spark / White Dwarf',
        'Affiliation': 'Violet Aegis (Formerly Sovereign Saints Academy)',
        'Role': 'Dual Star Anchor',
        'Magic Type': 'Aethereal Magic (Pure Light)',
        'Status': 'Active (Violet Aegis)'
      },
      description: `Luna Phantasma is the younger sister of Sentinel and the essential counterpart to her power. A former final-year cadet at Sovereign Saints Academy, she was thrust into the conflict when the Monarch kidnapped her to use her Aethereal light as fuel for his void form. Her rescue by Sentinel and the resigned Cardinals was one of the catalysts that formally unified the Violet Aegis.

Her magic — Aethereal Magic — is described as carrying the energy of a "Big Bang." Pure, dense, and catastrophically destructive, it was initially too overwhelming for her own body to channel without serious internal recoil. Under the mentorship of General Xi and the Equinox Control techniques he developed for her, Luna has made steady progress toward mastering her output.

What makes Luna irreplaceable is not just her power in isolation, but what happens when it meets Sentinel's Nihil. Her pure light is the only force capable of washing out the "Red" corruption embedded in the Void. Together, they form the Dual Star system — Luna as the White Dwarf to Sentinel's Black Hole — an infinite, self-sustaining energy loop that removes Sentinel's thirty-three-second combat limit entirely. In Act 2, this system matures from an emergency measure into a reliable, battle-ready state, fundamentally changing what Sentinel is capable of sustaining in prolonged conflict.`,
      abilities: [
        'Aethereal Magic - Rare, high-density light magic capable of incinerating targets and detonating the surrounding air',
        'Starburst - High-tier light spell; still being stabilized under Xi\'s guidance',
        'Dual Star Orbit - Passive resonance link with Sentinel that creates an infinite stable energy loop, eliminating the Void\'s corruption and removing Sentinel\'s time limit',
        'Equinox Control - Specialized mana regulation techniques taught by General Xi to manage Aethereal output without self-damage'
      ],
      relationships: [
        { name: 'Sentinel Phantasma', relation: 'Older Sister & "Dual Star" Partner — the entire reason the Violet Aegis was formed' },
        { name: 'Mei Xi', relation: 'Mentor — teaching her to stabilize Aethereal output' },
        { name: 'Miyu', relation: 'Friend & "Dragon Sister"' },
        { name: 'Astral Anemos', relation: 'Protective authority figure & de facto guardian within the Violet Aegis' },
        { name: 'The Monarch', relation: 'Former captor — used her as a power source before being deleted by Sentinel' }
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

    She was instrumental in the recovery operations against the Executioners and was one of the first to commit to protecting Sentinel's secret. Following the Archon's betrayal, Xi resigned her commission alongside Marshal Anemos to join the rogue Violet Aegis, eventually becoming the mentor to Luna Phantasma.`,
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
      description: `Cardinal Vesta is the intellectual backbone and chief engineer of the Violet Aegis. Originally a Rank 3 Cardinal of the Divinity Council, she is a specialist in Spirit Magic and high-level magitech. Vesta was the primary architect of the "Deceitful Report," creating a fake "Mana Filtration Drive" to hide Sentinel's Nihil power from the Archon.

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
      description: `Zane Axios is a genius Spatial Mage and the strategic "eyes" of the Violet Aegis. Originally assigned by the Archon to spy on Sentinel under "Project: SYN," Zane chose to betray the Citadel, falsifying logs and monitoring signals to protect Sentinel's privacy.

    An arrogant but loyal operative, Zane utilizes his spatial manipulation to manage the battlefield and provide high-speed transport for the team. His betrayal was the final piece that allowed the Divinity Council to escape the Archon's grasp, proving that he preferred his "family of misfits" over the Archon's authority.`,
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
        'Mana Flare Detection - Sensing distant flares of mana to track allies or enemies'
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

    He performed a pivotal role in Sentinel's survival by using his Holy Flame to penetrate and seal the "Nihil fracture" on her face, creating a permanent brand that prevented her essence from leaking. Though he often appears as a "grumpy grandfather," his loyalty to his "misfit family" led him to burn down the Archon's vaults to free Sentinel.`,
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

    Selena's magic is a reactive force of equilibrium; her body automatically responds to extreme heat or void energy by dropping the local temperature to absolute zero. Despite her detached exterior, she is a reliable defender who stood shoulder-to-shoulder with her peers to resign and form the Violet Aegis.`,
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
      description: `Cardinal Ryusei is the master of Atomic Magic and the primary data analyst for the Violet Aegis. Known for his cold, logical approach and reliance on precise calculations, he was the first to realize that Sentinel's power was not mere "filtration" but absolute deletion.

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
      title: 'Executioner\'s Overseer',
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
        'Durandal Fragment Resonance - Utilizing dark runic patterns to clash with Stellium\'s Durandal',
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
      title: 'Executioner\'s Overseer',
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
      title: 'Executioner\'s Overseer',
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
      title: 'Executioner\'s Overseer',
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

He sought to harvest Luna's Aethereal light to stabilize his own fragile void form, temporarily ascending into a ten-foot-tall titan of obsidian armor. He was eventually erased from existence when Sentinel merged with Oreia to manifest the "Vera Forma," utilizing the blade Destiny's Fall to delete his core entirely.`,
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
];
