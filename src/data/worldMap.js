export const worldMap = [
  {
    id: 'the-citadel',
    name: 'The Citadel',
    type: 'Magical Stronghold',
    image: './place.png',
    map: { x: 28, y: 46 },
    connections: ['sovereign-saints-academy', 'whispering-canyons'],
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
    map: { x: 50, y: 18 },
    floating: true,
    infobox: {
      'Type': 'Neutral Sanctuary / Rogue Base',
      'Rulers': 'Polaris Lunae & Aurora Glacies',
      'Key Locations': 'Observation Deck, Starlight Balcony, Vesta\'s Laboratory',
      'Notable Events': 'Founding of the Violet Aegis',
      'Status': 'Hidden / Active'
    },
    description: `A neutral sanctuary floating above the clouds, the Astral Spire is constructed from starlight and frozen obsidian. It exists outside the political reach of both the Kingdom and the Dark Continent.

It serves as the current headquarters for the Violet Aegis after they fled [[the-citadel|the Citadel]]. The environment is rich with immense power, allowing mages to recover and train without surveillance. It is currently the only place where former enemies of the Executioners and the Imperial Aegis live and work together in common cause.`
  },
  {
    id: 'sovereign-saints-academy',
    name: 'Sovereign Saints Academy',
    type: 'Educational Institution',
    image: './place.png',
    map: { x: 17, y: 68 },
    infobox: {
      'Type': 'Mage Training Academy',
      'Headmaster': 'Headmaster Valen',
      'Key Locations': 'Headmaster\'s Vault, Abandoned Training Hall, Senior Dormitories',
      'Notable Events': 'The Resonance Protocol Attack',
      'Status': 'Rebuilding'
    },
    description: `Sovereign Saints Academy (or "Saints") is the premier institution where both [[Astral Anemos]] and [[Sentinel Phantasma]] were trained. It is the site where Sentinel first received her gravity magic and where her sister, [[Luna Phantasma|Luna]], studied as a senior cadet.

The academy was recently devastated by an Executioner assault involving Resonance Towers designed to destabilize mana. Despite the destruction of its barrier and campus, it remains a symbolic home for the sisters and is currently undergoing reconstruction.`
  },
  {
    id: 'the-dark-continent',
    name: 'The Dark Continent',
    type: 'Wasteland',
    image: './place.png',
    map: { x: 84, y: 40 },
    connections: ['whispering-canyons'],
    infobox: {
      'Type': 'Corrupted Territory',
      'Former Ruler': 'The Monarch',
      'Key Locations': 'The Spire, Forsaken Executioners Base, Ash Plains',
      'Notable Events': 'Destruction of the Monarch',
      'Status': 'Under Reconstruction'
    },
    description: `A nightmare landscape of twisted obsidian spires and gray dust where the laws of physics are inverted. The atmosphere is thick with liquid mana storms that are poisonous to standard mages.

At its center stood the Spire, the throne of [[the-monarch|the Monarch]]. Following the Monarch's deletion by [[Sentinel Phantasma|Sentinel]], the continent has transitioned into a zone of recovery. The remaining Executioners, led by [[Sullivan Domineer]], have rebranded as 'Domineer Restoration Corp' to purge the remaining corruption from their homeland.`
  },
  {
    id: 'whispering-canyons',
    name: 'The Whispering Canyons',
    type: 'Geographic Region',
    image: './place.png',
    map: { x: 58, y: 60 },
    infobox: {
      'Type': 'Canyon Sector',
      'Key Locations': 'Sector 9, Oakhaven Village',
      'Notable Events': 'Ambush of the 3rd Division, Cardinal Intervention',
      'Status': 'Secured'
    },
    description: `A dangerous geographic sector characterized by narrow passes and steep cliffs, often used by the Executioners for guerrilla warfare. It was the site of a major "Kill Box" trap set for General Mirai.

The region includes the mining town of Oakhaven, which was famously saved from green corrosive fire by [[Sentinel Phantasma|Sentinel]] and [[Zane Axios|Zane]]. It remains a strategic boundary between the civilized kingdom and the untamed ruins.`
  }
];
