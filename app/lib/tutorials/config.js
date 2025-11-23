/**
 * Tutorial configurations for Vizualni Admin tutorials
 */
export const TUTORIAL_CONFIGS = {
    'getting-started': [
        {
            id: 'your-first-visualization',
            title: {
                sr: 'Vaša prva vizualizacija',
                en: 'Your First Visualization'
            },
            description: {
                sr: 'Naučite kako da kreirate svoju prvu vizualizaciju koristeći podatke sa data.gov.rs.',
                en: 'Learn how to create your first visualization using data from data.gov.rs.'
            },
            category: 'getting-started',
            difficulty: 'beginner',
            estimatedTime: 15,
            icon: '🎯',
            tags: ['početak', 'vizualizacija', 'data.gov.rs'],
            steps: [
                {
                    id: 'intro',
                    title: {
                        sr: 'Uvod',
                        en: 'Introduction'
                    },
                    type: 'instruction',
                    content: {
                        sr: 'Dobrodošli u vaš prvi tutorial! Ovde ćemo vas provesti kroz kreiranje jednostavne vizualizacije.',
                        en: 'Welcome to your first tutorial! Here we will guide you through creating a simple visualization.'
                    }
                },
                {
                    id: 'select-data',
                    title: {
                        sr: 'Izbor podataka',
                        en: 'Selecting Data'
                    },
                    type: 'instruction',
                    content: {
                        sr: 'Izaberite skup podataka sa data.gov.rs koji vas zanima.',
                        en: 'Select a dataset from data.gov.rs that interests you.'
                    }
                },
                // Add more steps as needed
            ]
        },
        {
            id: 'exploring-demo-gallery',
            title: {
                sr: 'Istraživanje galerije demo-a',
                en: 'Exploring the Demo Gallery'
            },
            description: {
                sr: 'Saznajte kako da istražujete i koristite postojeće demo vizualizacije.',
                en: 'Learn how to explore and use existing demo visualizations.'
            },
            category: 'getting-started',
            difficulty: 'beginner',
            estimatedTime: 10,
            icon: '🖼️',
            tags: ['demo', 'galerija', 'istraživanje'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'navigating-interface',
            title: {
                sr: 'Navigacija interfejsom',
                en: 'Navigating the Interface'
            },
            description: {
                sr: 'Upoznajte se sa glavnim elementima interfejsa Vizualni Admin aplikacije.',
                en: 'Get familiar with the main elements of the Vizualni Admin application interface.'
            },
            category: 'getting-started',
            difficulty: 'beginner',
            estimatedTime: 10,
            icon: '🧭',
            tags: ['interfejs', 'navigacija', 'početak'],
            steps: [
            // Define steps
            ]
        }
    ],
    'creating-charts': [
        {
            id: 'understanding-chart-types',
            title: {
                sr: 'Razumevanje tipova grafikona',
                en: 'Understanding Chart Types'
            },
            description: {
                sr: 'Saznajte kada koristiti različite tipove grafikona i njihove prednosti.',
                en: 'Learn when to use different chart types and their advantages.'
            },
            category: 'creating-charts',
            difficulty: 'beginner',
            estimatedTime: 20,
            icon: '📊',
            tags: ['grafikoni', 'tipovi', 'vizualizacija'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'creating-bar-charts',
            title: {
                sr: 'Kreiranje bar grafikona',
                en: 'Creating Bar Charts'
            },
            description: {
                sr: 'Korak-po-korak vodič za kreiranje bar grafikona.',
                en: 'Step-by-step guide to creating bar charts.'
            },
            category: 'creating-charts',
            difficulty: 'beginner',
            estimatedTime: 15,
            icon: '📏',
            tags: ['bar', 'grafikon', 'kreiranje'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'line-charts-trends',
            title: {
                sr: 'Linijski grafikoni i trendovi',
                en: 'Line Charts and Trends'
            },
            description: {
                sr: 'Kako prikazati trendove koristeći linijske grafikone.',
                en: 'How to display trends using line charts.'
            },
            category: 'creating-charts',
            difficulty: 'intermediate',
            estimatedTime: 20,
            icon: '📈',
            tags: ['linijski', 'trendovi', 'vremenski-podaci'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'pie-charts-proportions',
            title: {
                sr: 'Pie grafikoni za proporcije',
                en: 'Pie Charts for Proportions'
            },
            description: {
                sr: 'Kada i kako koristiti pie grafikone za prikazivanje proporcija.',
                en: 'When and how to use pie charts for displaying proportions.'
            },
            category: 'creating-charts',
            difficulty: 'beginner',
            estimatedTime: 15,
            icon: '🥧',
            tags: ['pie', 'proporcije', 'deo-celine'],
            steps: [
            // Define steps
            ]
        }
    ],
    'embedding': [
        {
            id: 'basic-embedding',
            title: {
                sr: 'Osnovno ugrađivanje',
                en: 'Basic Embedding'
            },
            description: {
                sr: 'Kako da ugradite vizualizacije na vaše web stranice.',
                en: 'How to embed visualizations on your websites.'
            },
            category: 'embedding',
            difficulty: 'intermediate',
            estimatedTime: 15,
            icon: '🔗',
            tags: ['ugrađivanje', 'web', 'iframe'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'embedding-wordpress',
            title: {
                sr: 'Ugrađivanje u WordPress',
                en: 'Embedding in WordPress'
            },
            description: {
                sr: 'Specifični vodič za ugrađivanje vizualizacija u WordPress sajtove.',
                en: 'Specific guide for embedding visualizations in WordPress sites.'
            },
            category: 'embedding',
            difficulty: 'intermediate',
            estimatedTime: 20,
            icon: '📝',
            tags: ['wordpress', 'cms', 'ugrađivanje'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'responsive-embedding',
            title: {
                sr: 'Responzivno ugrađivanje',
                en: 'Responsive Embedding'
            },
            description: {
                sr: 'Kako napraviti da se ugrađene vizualizacije prilagođavaju različitim ekranima.',
                en: 'How to make embedded visualizations adapt to different screen sizes.'
            },
            category: 'embedding',
            difficulty: 'intermediate',
            estimatedTime: 15,
            icon: '📱',
            tags: ['responzivno', 'mobilni', 'prilagođavanje'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'embedding-react',
            title: {
                sr: 'Ugrađivanje u React',
                en: 'Embedding in React'
            },
            description: {
                sr: 'Integracija vizualizacija u React aplikacije.',
                en: 'Integrating visualizations into React applications.'
            },
            category: 'embedding',
            difficulty: 'advanced',
            estimatedTime: 25,
            icon: '⚛️',
            tags: ['react', 'javascript', 'integracija'],
            steps: [
            // Define steps
            ]
        }
    ],
    'api-usage': [
        {
            id: 'using-data-gov-rs-api',
            title: {
                sr: 'Korišćenje data.gov.rs API-ja',
                en: 'Using data.gov.rs API'
            },
            description: {
                sr: 'Osnovni vodič za rad sa data.gov.rs API-jem.',
                en: 'Basic guide for working with the data.gov.rs API.'
            },
            category: 'api-usage',
            difficulty: 'intermediate',
            estimatedTime: 20,
            icon: '🔍',
            tags: ['api', 'data.gov.rs', 'podaci'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'finding-datasets',
            title: {
                sr: 'Pronalaženje skupova podataka',
                en: 'Finding Datasets'
            },
            description: {
                sr: 'Kako pronaći i izabrati odgovarajuće skupove podataka.',
                en: 'How to find and select appropriate datasets.'
            },
            category: 'api-usage',
            difficulty: 'beginner',
            estimatedTime: 10,
            icon: '📂',
            tags: ['pretraga', 'skupovi-podataka', 'izbor'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'api-authentication',
            title: {
                sr: 'API autentifikacija',
                en: 'API Authentication'
            },
            description: {
                sr: 'Kako se autentifikovati i pristupiti zaštićenim podacima.',
                en: 'How to authenticate and access protected data.'
            },
            category: 'api-usage',
            difficulty: 'intermediate',
            estimatedTime: 15,
            icon: '🔐',
            tags: ['autentifikacija', 'bezbednost', 'pristup'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'handling-large-datasets',
            title: {
                sr: 'Rukovanje velikim skupovima podataka',
                en: 'Handling Large Datasets'
            },
            description: {
                sr: 'Tehnike za efikasno rukovanje velikim količinama podataka.',
                en: 'Techniques for efficiently handling large amounts of data.'
            },
            category: 'api-usage',
            difficulty: 'advanced',
            estimatedTime: 25,
            icon: '📊',
            tags: ['veliki-podaci', 'performanse', 'optimizacija'],
            steps: [
            // Define steps
            ]
        }
    ],
    'advanced': [
        {
            id: 'custom-data-transformations',
            title: {
                sr: 'Prilagođene transformacije podataka',
                en: 'Custom Data Transformations'
            },
            description: {
                sr: 'Kako primeniti prilagođene transformacije na podatke pre vizualizacije.',
                en: 'How to apply custom transformations to data before visualization.'
            },
            category: 'advanced',
            difficulty: 'advanced',
            estimatedTime: 30,
            icon: '🔧',
            tags: ['transformacije', 'podaci', 'prilagođavanje'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'custom-themes',
            title: {
                sr: 'Prilagođene teme',
                en: 'Custom Themes'
            },
            description: {
                sr: 'Kreiranje i primena prilagođenih tema za vizualizacije.',
                en: 'Creating and applying custom themes for visualizations.'
            },
            category: 'advanced',
            difficulty: 'advanced',
            estimatedTime: 25,
            icon: '🎨',
            tags: ['teme', 'dizajn', 'prilagođavanje'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'data-filtering-aggregation',
            title: {
                sr: 'Filtriranje i agregacija podataka',
                en: 'Data Filtering and Aggregation'
            },
            description: {
                sr: 'Napredne tehnike za filtriranje i agregaciju podataka.',
                en: 'Advanced techniques for filtering and aggregating data.'
            },
            category: 'advanced',
            difficulty: 'advanced',
            estimatedTime: 30,
            icon: '🔍',
            tags: ['filtriranje', 'agregacija', 'napredno'],
            steps: [
            // Define steps
            ]
        },
        {
            id: 'performance-optimization',
            title: {
                sr: 'Optimizacija performansi',
                en: 'Performance Optimization'
            },
            description: {
                sr: 'Tehnike za poboljšanje performansi velikih vizualizacija.',
                en: 'Techniques for improving performance of large visualizations.'
            },
            category: 'advanced',
            difficulty: 'advanced',
            estimatedTime: 35,
            icon: '⚡',
            tags: ['performanse', 'optimizacija', 'veliki-podaci'],
            steps: [
            // Define steps
            ]
        }
    ]
};
/**
 * Get tutorial config by ID
 */
export function getTutorialConfig(id) {
    for (const category in TUTORIAL_CONFIGS) {
        const tutorial = TUTORIAL_CONFIGS[category].find(t => t.id === id);
        if (tutorial)
            return tutorial;
    }
    return null;
}
/**
 * Get all tutorial IDs
 */
export function getAllTutorialIds() {
    const ids = [];
    for (const category in TUTORIAL_CONFIGS) {
        TUTORIAL_CONFIGS[category].forEach(tutorial => ids.push(tutorial.id));
    }
    return ids;
}
/**
 * Get tutorials by category
 */
export function getTutorialsByCategory(category) {
    return TUTORIAL_CONFIGS[category] || [];
}
/**
 * Get tutorial title in specified locale
 */
export function getTutorialTitle(id, locale = 'sr') {
    const config = getTutorialConfig(id);
    return (config === null || config === void 0 ? void 0 : config.title[locale]) || id;
}
/**
 * Get tutorial description in specified locale
 */
export function getTutorialDescription(id, locale = 'sr') {
    const config = getTutorialConfig(id);
    return (config === null || config === void 0 ? void 0 : config.description[locale]) || '';
}
