/**
 * Demo configurations for data.gov.rs visualizations
 */
export const DEMO_CONFIGS = {
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
            sr: '⚠️ Demografska kriza',
            en: '⚠️ Demographic Crisis'
        },
        description: {
            sr: 'Alarmantno: Stanovništvo pada za 15% do 2050. godine, medijana starosti 43.5 godina, stopa rasta -0.4%',
            en: 'Alarming: Population declining 15% by 2050, median age 43.5 years, growth rate -0.4%'
        },
        searchQuery: 'stanovnistvo',
        chartType: 'bar',
        tags: ['stanovnistvo', 'statistika', 'demografija', 'kritično'],
        icon: '⚠️'
    },
    education: {
        id: 'education',
        title: {
            sr: '🎓 Statistika obrazovanja',
            en: '🎓 Education Statistics'
        },
        description: {
            sr: 'Pregled broja učenika i studenata po nivoima obrazovanja - osnovno, srednje i visoko obrazovanje kroz godine',
            en: 'Overview of student enrollment by education level - elementary, secondary, and higher education over the years'
        },
        searchQuery: 'obrazovanje učenici studenti',
        chartType: 'column',
        tags: ['obrazovanje', 'skole', 'studenti', 'upis'],
        icon: '🎓'
    },
    transport: {
        id: 'transport',
        title: {
            sr: '🚨 Saobraćajna katastrofa',
            en: '🚨 Traffic Catastrophe'
        },
        description: {
            sr: 'Preventabilne smrti na putevima - 482 života izgubljeno 2024, 1.3 smrti DNEVNO, 98% nesreća preventabilno',
            en: 'Preventable road deaths - 482 lives lost in 2024, 1.3 deaths DAILY, 98% of accidents preventable'
        },
        searchQuery: 'saobracaj',
        chartType: 'column',
        tags: ['saobracaj', 'bezbednost', 'nezgode', 'kritično'],
        icon: '🚨'
    },
    healthcare: {
        id: 'healthcare',
        title: {
            sr: '🚨 Zdravstvena kriza',
            en: '🚨 Healthcare Crisis'
        },
        description: {
            sr: 'Alarmantni podaci o listama čekanja, odlivu lekara i kapacitetima bolnica - preko 50,000 pacijenata čeka na procedure',
            en: 'Alarming data on waiting lists, doctor exodus, and hospital capacity - over 50,000 patients waiting for procedures'
        },
        searchQuery: 'zdravstvo',
        chartType: 'bar',
        tags: ['zdravstvo', 'bolnice', 'kritično', 'liste-čekanja'],
        icon: '🚨'
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
            sr: '🚨 Odliv mladih - Brain Drain',
            en: '🚨 Youth Exodus - Brain Drain'
        },
        description: {
            sr: 'Šokantni podaci o emigraciji mladih - 75,900 ljudi napustilo zemlju 2024, nezaposlenost mladih 25%, plate 75% niže od EU',
            en: 'Shocking emigration data - 75,900 people left in 2024, youth unemployment 25%, wages 75% lower than EU'
        },
        searchQuery: 'zaposlenost',
        chartType: 'line',
        tags: ['zaposlenost', 'emigracija', 'brain-drain', 'kritično'],
        icon: '🚨'
    },
    energy: {
        id: 'energy',
        title: {
            sr: '🚨 Energetska kriza - Zavisnost od uglja',
            en: '🚨 Energy Crisis - Coal Dependency'
        },
        description: {
            sr: 'Alarmantno: 68.5% energije iz UGLJA, obnovljivi izvori samo 2%, termoelektrane stare 45+ godina, uvoz porastao za €465M',
            en: 'Alarming: 68.5% energy from COAL, renewables only 2%, plants 45+ years old, imports up €465M'
        },
        searchQuery: 'energija',
        chartType: 'column',
        tags: ['energija', 'ugalj', 'zagađenje', 'kritično'],
        icon: '🚨'
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
    },
    presentation: {
        id: 'presentation',
        title: {
            sr: '🎬 Prezentacioni mod',
            en: '🎬 Presentation Mode'
        },
        description: {
            sr: 'Kurirana scena sa interaktivnim vizualizacijama, agendom, pričama iz podataka i CTA koracima',
            en: 'Curated stage with interactive visuals, agenda, data stories, and CTA steps'
        },
        searchQuery: 'vizualizacije prezentacija',
        chartType: 'line',
        tags: ['demo', 'prezentacija', 'vizualizacije'],
        icon: '🎬'
    }
};
/**
 * Get demo config by ID
 */
export function getDemoConfig(id) {
    return DEMO_CONFIGS[id] || null;
}
/**
 * Get all demo IDs
 */
export function getAllDemoIds() {
    return Object.keys(DEMO_CONFIGS);
}
/**
 * Get demo title in specified locale
 */
export function getDemoTitle(id, locale = 'sr') {
    const config = getDemoConfig(id);
    return (config === null || config === void 0 ? void 0 : config.title[locale]) || id;
}
/**
 * Get demo description in specified locale
 */
export function getDemoDescription(id, locale = 'sr') {
    const config = getDemoConfig(id);
    return (config === null || config === void 0 ? void 0 : config.description[locale]) || '';
}
