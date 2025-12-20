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
      image: 'https://cdn.discordapp.com/attachments/795828287468601375/1451494261278244985/PLA.png?ex=694660df&is=69450f5f&hm=777266013cdf4f2249fb938847666c6f814cde345e42642a0fddfeb9201a1733&PLA.png',
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
        { name: 'Sentinel', relation: 'Best Friend & Partner' },
        { name: 'General Xi', relation: 'Trusted Subordinate' },
        { name: 'King Cenric', relation: 'Liege Lord' }
      ]
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      title: 'Archmage of the Divinity Council',
      category: 'Main Characters',
      image: 'https://cdn.discordapp.com/attachments/795828287468601375/1451494261278244985/PLA.png?ex=694660df&is=69450f5f&hm=777266013cdf4f2249fb938847666c6f814cde345e42642a0fddfeb9201a1733&PLA.png',
      infobox: {
        'Full Name': 'Sentinel',
        'Title': 'Archmage',
        'Affiliation': 'Divinity Council',
        'Magic Type': 'Gravity Magic, Violet Nihility',
        'Weapon': 'Halberd (Evolved from Katana)',
        'Race': 'Bunny-eared humanoid',
        'Status': 'Active (Ascended)'
      },
      description: `Sentinel is an Archmage serving under the Divinity Council and Astral's best friend since their academy days. Distinguished by her bunny ears, she was nearly expelled from Sovereign Saints Academy due to her inability to control elemental magic.

Her life changed when Astral stole an Ancient Gravity Scroll for her, allowing Sentinel to develop her signature Gravity Magic. During the operation against the Forsaken Executioners, she discovered the Violet Nihility and achieved Ascension.`,
      abilities: [
        'Gravity Art: Downward Spiral - Creates intense localized gravity fields',
        'Nano Singularity - Small sphere with tremendous gravitational force',
        'Mana Sword Manifestation - Creates colossal swords of pure mana',
        'Violet Nihility - Forbidden power of absolute destruction',
        'Inabsolutus Form - Ascended state with enhanced abilities'
      ],
      relationships: [
        { name: 'Astral Anemos', relation: 'Best Friend & Partner' },
        { name: 'The Archon', relation: 'Superior (Tense)' }
      ]
    },
    {
      id: 'general-xi',
      name: 'General Xi',
      title: 'General of the Imperial Aegis',
      category: 'Allies',
      image: '⚔️',
      infobox: {
        'Title': 'General',
        'Affiliation': 'Imperial Aegis',
        'Magic Type': 'Equinox Magic (Light & Dark)',
        'Status': 'Active'
      },
      description: `General Xi is one of the most trusted military officers under Grand Marshal Astral Anemos. She wields the rare Equinox Magic, allowing her to blend light and dark elemental powers.

Her ultimate technique, "Perfect Confluence," represents a perfect blend of her dual light and dark powers.`,
      abilities: [
        'Twin Equinotial Slashes - Dual light/dark sword strikes',
        'Ultimate Weapon Art: Perfect Confluence - Perfect blend of light and dark'
      ],
      relationships: [
        { name: 'Astral Anemos', relation: 'Commander' },
        { name: 'Mirai', relation: 'Fellow Officer' }
      ]
    },
    {
      id: 'pukao',
      name: 'Pukao',
      title: 'Project: Divinity',
      category: 'IDK BRO',
      image: 'https://cdn.discordapp.com/attachments/795828287468601375/1451494261278244985/PLA.png?ex=694660df&is=69450f5f&hm=777266013cdf4f2249fb938847666c6f814cde345e42642a0fddfeb9201a1733&PLA.png',
      infobox: {
        'Full Name': 'Pukao Stellaris',
        'Title': 'Author',
        'Weapon': 'Pineapple Pen',
        'Status': 'Probably not alive'
      },
      description: ``,
      abilities: [
        'Wha the dawg doing',
      ],
      relationships: [
        { name: 'Sentinel', relation: 'Creator' },
      ]
    },
    {
      id: 'thysia-asteri',
      name: 'Thysia Asteri',
      title: "Executioner's Overseer",
      category: 'Antagonists',
      image: '🩸',
      infobox: {
        'Title': 'Overseer',
        'Affiliation': 'Forsaken Executioners',
        'Magic Type': 'Sacrifice Magic',
        'Weapon': 'Corrupted Durandal Fragment',
        'Status': 'Active'
      },
      description: `Thysia Asteri is one of the four Overseers of the Forsaken Executioners, wielding the dangerous Sacrifice Magic. Her power allows her to convert damage dealt to enemies into strength for herself.

She possesses a corrupted fragment of the legendary Durandal, reforged into a dark red claymore with malevolent crimson runes.`,
      abilities: [
        'Sacrifice Magic - Converts dealt damage into personal power',
        'Ultimate Weapon Art: Rites of Annihilation - Corrupting energy slashes'
      ],
      relationships: [
        { name: 'Stellium', relation: 'Rival (Durandal wielders)' },
        { name: 'Forsaken Executioners', relation: 'Overseer' }
      ]
    }
  ],
  
  worldMap: [
    {
      id: 'royal-capital',
      name: 'The Royal Capital',
      type: 'Major City',
      image: '🏰',
      infobox: {
        'Type': 'Capital City',
        'Ruler': 'King Cenric',
        'Key Locations': 'Imperial Castle, Northern Gate',
        'Notable Events': 'Siege of the Iron Giants',
        'Status': 'Thriving'
      },
      description: `The Royal Capital serves as the heart of the kingdom, housing both the Imperial Castle where King Cenric rules and the headquarters of the Imperial Aegis.

The Imperial Castle contains the Grand Marshal's Office, an extravagant space where Astral Anemos manages the kingdom's military affairs. Following the successful defense against the Titan Series, the capital has become a symbol of the kingdom's resilience.`
    },
    {
      id: 'sovereign-saints-academy',
      name: 'Sovereign Saints Academy',
      type: 'Institution',
      image: '📚',
      infobox: {
        'Type': 'Magic Academy',
        'Purpose': 'Train Future Mages',
        'Notable Alumni': 'Astral Anemos, Sentinel',
        'Status': 'Active'
      },
      description: `Sovereign Saints Academy is the premier institution for magical education in the kingdom. The academy maintains strict standards, with students who fail to meet requirements facing expulsion.

Both Astral Anemos and Sentinel attended the academy, where their friendship began when Astral risked her future to help Sentinel master gravity magic.`
    },
    {
      id: 'forsaken-ruins',
      name: 'The Forsaken Ruins',
      type: 'Hostile Territory',
      image: '🏚️',
      infobox: {
        'Type': 'Ancient Ruins',
        'Current Occupant': 'Forsaken Executioners',
        'Atmosphere': 'Eerily Desolate',
        'Danger Level': 'Extreme'
      },
      description: `The Forsaken Ruins serve as the operational base of the Executioners. The atmosphere is described as "unnervingly eerie," with a desolate beauty that some find overwhelming and terrifying.

Within the ruins lie hidden vaults containing treasures and forbidden artifacts, including the scroll containing the Violet Nihility power.`
    }
  ],
  
  magicSystem: [
    {
      id: 'wind-magic',
      name: 'Wind Magic',
      type: 'Elemental',
      image: '💨',
      infobox: {
        'Classification': 'Elemental Magic',
        'Primary User': 'Astral Anemos',
        'Characteristics': 'Speed, Mobility, Cutting',
        'Academy Status': 'Standard Curriculum'
      },
      description: `Wind Magic is one of the fundamental elemental magics taught at institutions like Sovereign Saints Academy. Practitioners can manipulate air currents for offensive, defensive, and mobility purposes.

Astral Anemos represents the pinnacle of wind magic application, using techniques like Wind Step for instantaneous movement and Gale Javelin for high-velocity attacks.`
    },
    {
      id: 'gravity-magic',
      name: 'Gravity Magic',
      type: 'Ancient',
      image: '🌑',
      infobox: {
        'Classification': 'Ancient Magic',
        'Primary User': 'Sentinel',
        'Source': 'Ancient Gravity Scroll',
        'Rarity': 'Extremely Rare'
      },
      description: `Gravity Magic is an ancient form of magic that allows the manipulation of gravitational forces. Unlike elemental magic, it cannot be learned through standard training—it requires access to ancient knowledge.

Sentinel's mastery of Gravity Magic transformed her from a failing student into one of the most powerful Archmages in the kingdom.`
    },
    {
      id: 'shatter-magic',
      name: 'Shatter Magic',
      type: 'Forbidden',
      image: '💥',
      infobox: {
        'Classification': 'Forbidden Magic',
        'Primary User': 'Astral Anemos',
        'Source': 'Ancient Shatter Scroll',
        'Status': 'Quarantined Knowledge'
      },
      description: `Shatter Magic is a forbidden art that allows the user to "grab" vibrations in the air and crack them, creating devastating shockwaves that bypass conventional defenses.

Learning Shatter Magic is extremely dangerous—without proper anchoring, the recoil can shatter the user's own bones. Astral spent six months mastering the technique.`
    },
    {
      id: 'violet-nihility',
      name: 'Violet Nihility',
      type: 'Forbidden',
      image: '🟣',
      infobox: {
        'Classification': 'Forbidden/Transcendent',
        'Primary User': 'Sentinel',
        'Risk': 'Mental corruption, Loss of self'
      },
      description: `The Violet Nihility is a forbidden power representing absolute freedom and power beyond normal comprehension, but at the cost of potential mental corruption.

Through sheer force of will and Astral's intervention, Sentinel conquered the Violet Nihility rather than being consumed by it, achieving Ascension.`
    }
  ],
  
  history: [
    {
      id: 'academy-days',
      name: 'Academy Days: A Friendship Forged',
      era: 'Past',
      image: '🎓',
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
      image: '🤖',
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
      image: '🌟',
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
                <Scroll className="w-6 h-6 text-violet-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-violet-200 tracking-wide">Lore Wiki</h1>
                <p className="text-violet-600/60 text-xs tracking-widest uppercase">Imperial Archives</p>
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
              {groupName === 'Allies' && <Shield className="w-5 h-5 text-emerald-400" />}
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
                    <p key={i} className={`text-stone-300 leading-relaxed ${i === 0 ? 'first-letter:text-2xl first-letter:text-violet-400 first-letter:mr-1' : ''}`}>{p}</p>
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
        ::-webkit-scrollbar-thumb { background: #78350f; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #92400e; }
      `}</style>
    </div>
  );
}