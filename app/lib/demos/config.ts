/**
 * Demo configurations for data.gov.rs visualizations
 */

export interface DemoConfig {
  id: string;
  title: {
    sr: string;
    en: string;
  };
  description: {
    sr: string;
    en: string;
  };
  searchQuery: string;
  chartType: 'line' | 'bar' | 'column' | 'area' | 'pie' | 'map' | 'scatterplot';
  defaultDatasetId?: string;
  tags?: string[];
  icon: string;
}

export const DEMO_CONFIGS: Record<string, DemoConfig> = {
  'air-quality': {
    id: 'air-quality',
    title: {
      sr: '🚨 Kvalitet vazduha - Detaljno',
      en: '🚨 Air Quality - Detailed'
    },
    description: {
      sr: 'Šokantni podaci o zagađenju vazduha sa WHO upozorenjima i zdravstvenim rizicima',
      en: 'Shocking air pollution data with WHO warnings and health risks'
    },
    searchQuery: 'kvalitet vazduha',
    chartType: 'line',
    tags: ['zivotna-sredina', 'zdravlje', 'kritično'],
    icon: '🚨'
  },
  budget: {
    id: 'budget',
    title: {
      sr: 'Budžet Republike Srbije',
      en: 'Republic of Serbia Budget'
    },
    description: {
      sr: 'Interaktivna vizualizacija državnog budžeta i javnih finansija',
      en: 'Interactive visualization of state budget and public finances'
    },
    searchQuery: 'budzet',
    chartType: 'column',
    tags: ['finansije', 'javne-finansije', 'budzet'],
    icon: '💰'
  },
  environment: {
    id: 'environment',
    title: {
      sr: 'Kvalitet vazduha',
      en: 'Air Quality'
    },
    description: {
      sr: 'Praćenje kvaliteta vazduha i zagađenja u gradovima Srbije',
      en: 'Monitor air quality and pollution in Serbian cities'
    },
    searchQuery: 'kvalitet vazduha',
    chartType: 'line',
    tags: ['zivotna-sredina', 'ekologija', 'vazduh'],
    icon: '🌍'
  },
  demographics: {
    id: 'demographics',
    title: {
      sr: 'Demografija i stanovništvo',
      en: 'Demographics and Population'
    },
    description: {
      sr: 'Statistika stanovništva Srbije po regionima i demografskim grupama',
      en: 'Serbian population statistics by region and demographic groups'
    },
    searchQuery: 'stanovnistvo',
    chartType: 'bar',
    tags: ['stanovnistvo', 'statistika', 'demografija'],
    icon: '👥'
  },
  education: {
    id: 'education',
    title: {
      sr: 'Obrazovanje',
      en: 'Education'
    },
    description: {
      sr: 'Statistika obrazovanja - učenici, studenti, škole',
      en: 'Education statistics - students, schools, enrollment'
    },
    searchQuery: 'obrazovanje',
    chartType: 'column',
    tags: ['obrazovanje', 'skole', 'studenti'],
    icon: '🎓'
  },
  transport: {
    id: 'transport',
    title: {
      sr: 'Saobraćaj i bezbednost',
      en: 'Traffic and Safety'
    },
    description: {
      sr: 'Saobraćajne nezgode i statistika bezbednosti na putevima',
      en: 'Traffic accidents and road safety statistics'
    },
    searchQuery: 'saobracaj',
    chartType: 'column',
    tags: ['saobracaj', 'bezbednost', 'nezgode'],
    icon: '🚗'
  },
  healthcare: {
    id: 'healthcare',
    title: {
      sr: 'Zdravstvo i bolnice',
      en: 'Healthcare and Hospitals'
    },
    description: {
      sr: 'Kapaciteti zdravstvenih ustanova, lista čekanja i statistika pacijenata',
      en: 'Healthcare facility capacity, waiting lists and patient statistics'
    },
    searchQuery: 'zdravstvo',
    chartType: 'bar',
    tags: ['zdravstvo', 'bolnice', 'pacijenti'],
    icon: '🏥'
  },
  health: {
    id: 'health',
    title: {
      sr: 'Zdravstvo',
      en: 'Healthcare'
    },
    description: {
      sr: 'Zdravstveni podaci - bolnice, pacijenti, zdravstvene usluge',
      en: 'Healthcare data - hospitals, patients, medical services'
    },
    searchQuery: 'zdravstvo',
    chartType: 'bar',
    tags: ['zdravstvo', 'medicina', 'bolnice'],
    icon: '🏥'
  },
  employment: {
    id: 'employment',
    title: {
      sr: 'Zaposlenost i tržište rada',
      en: 'Employment and Labor Market'
    },
    description: {
      sr: 'Statistika zaposlenih, nezaposlenih i slobodnih radnih mesta',
      en: 'Statistics on employment, unemployment, and job vacancies'
    },
    searchQuery: 'zaposlenost',
    chartType: 'line',
    tags: ['zaposlenost', 'rad', 'ekonomija'],
    icon: '💼'
  },
  energy: {
    id: 'energy',
    title: {
      sr: 'Energetika',
      en: 'Energy'
    },
    description: {
      sr: 'Podaci o proizvodnji i potrošnji energije u Srbiji',
      en: 'Data on energy production and consumption in Serbia'
    },
    searchQuery: 'energija',
    chartType: 'column',
    tags: ['energija', 'elektricna-energija', 'obnovljivi-izvori'],
    icon: '⚡'
  },
  agriculture: {
    id: 'agriculture',
    title: {
      sr: 'Poljoprivreda',
      en: 'Agriculture'
    },
    description: {
      sr: 'Poljoprivredni podaci - proizvodnja, usevi, stočarstvo',
      en: 'Agricultural data - production, crops, livestock'
    },
    searchQuery: 'poljoprivreda',
    chartType: 'bar',
    tags: ['poljoprivreda', 'prehrambena-industrija', 'ruralni-razvoj'],
    icon: '🌾'
  },
  tourism: {
    id: 'tourism',
    title: {
      sr: 'Turizam',
      en: 'Tourism'
    },
    description: {
      sr: 'Turističke statistike - dolasci, noćenja, turistička potrošnja',
      en: 'Tourism statistics - arrivals, overnight stays, tourism spending'
    },
    searchQuery: 'turizam',
    chartType: 'line',
    tags: ['turizam', 'ugostiteljstvo', 'kultura'],
    icon: '✈️'
  },
  culture: {
    id: 'culture',
    title: {
      sr: 'Kultura i umetnost',
      en: 'Culture and Arts'
    },
    description: {
      sr: 'Podaci o kulturnim ustanovama, događajima i kulturnoj baštini',
      en: 'Data on cultural institutions, events, and cultural heritage'
    },
    searchQuery: 'kultura',
    chartType: 'pie',
    tags: ['kultura', 'umetnost', 'muzej'],
    icon: '🎭'
  },
  infrastructure: {
    id: 'infrastructure',
    title: {
      sr: 'Infrastruktura',
      en: 'Infrastructure'
    },
    description: {
      sr: 'Javna infrastruktura - putevi, vodovod, kanalizacija',
      en: 'Public infrastructure - roads, water supply, sewerage'
    },
    searchQuery: 'infrastruktura',
    chartType: 'column',
    tags: ['infrastruktura', 'javni-radovi', 'gradnja'],
    icon: '🏗️'
  },
  economy: {
    id: 'economy',
    title: {
      sr: 'Ekonomija i rast - Detaljno',
      en: 'Economy and Growth - Detailed'
    },
    description: {
      sr: 'Ekonomska transformacija Srbije: BDP, inflacija, nezaposlenost, spoljna trgovina i strane investicije sa ključnim ekonomskim događajima',
      en: 'Serbia\'s economic transformation: GDP, inflation, unemployment, foreign trade and investment with key economic events'
    },
    searchQuery: 'ekonomija bdp',
    chartType: 'line',
    tags: ['ekonomija', 'bdp', 'finansije', 'investicije', 'transformacija'],
    icon: '💰'
  },
  climate: {
    id: 'climate',
    title: {
      sr: 'Klimatske promene - Detaljno',
      en: 'Climate Change - Detailed'
    },
    description: {
      sr: 'Alarmantni podaci o klimatskim promenama: porast temperature, ekstremni vremenski događaji, zagađenje i prelazak na obnovljive izvore energije',
      en: 'Alarming climate change data: temperature rise, extreme weather events, pollution and renewable energy transition'
    },
    searchQuery: 'klima temperatura zivotna sredina',
    chartType: 'line',
    tags: ['klima', 'zivotna-sredina', 'temperatura', 'energija', 'kriticno'],
    icon: '🌍'
  },
  digital: {
    id: 'digital',
    title: {
      sr: 'Digitalna transformacija - Detaljno',
      en: 'Digital Transformation - Detailed'
    },
    description: {
      sr: 'Priča uspeha: eksplozivan rast IT industrije, internet penetracije, e-trgovine, digitalnih veština i 5 tech unicorna',
      en: 'Success story: explosive growth of IT industry, internet penetration, e-commerce, digital skills and 5 tech unicorns'
    },
    searchQuery: 'digitalizacija internet tehnologija',
    chartType: 'line',
    tags: ['digitalizacija', 'internet', 'IT', 'tehnologija', 'uspeh'],
    icon: '💻'
  }
};

/**
 * Get demo config by ID
 */
export function getDemoConfig(id: string): DemoConfig | null {
  return DEMO_CONFIGS[id] || null;
}

/**
 * Get all demo IDs
 */
export function getAllDemoIds(): string[] {
  return Object.keys(DEMO_CONFIGS);
}

/**
 * Get demo title in specified locale
 */
export function getDemoTitle(id: string, locale: 'sr' | 'en' = 'sr'): string {
  const config = getDemoConfig(id);
  return config?.title[locale] || id;
}

/**
 * Get demo description in specified locale
 */
export function getDemoDescription(id: string, locale: 'sr' | 'en' = 'sr'): string {
  const config = getDemoConfig(id);
  return config?.description[locale] || '';
}
