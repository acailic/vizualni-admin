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
    chartType: 'map',
    tags: ['saobracaj', 'bezbednost', 'nezgode'],
    icon: '🚗'
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
