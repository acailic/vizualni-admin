// Economic data for Serbia with real-world events and patterns

export interface EconomicIndicator {
  year: number;
  gdpGrowth: number; // percentage
  inflation: number; // percentage
  unemployment: number; // percentage
  event?: string; // notable economic event
}

export interface SectorGDP {
  sector: string;
  percentage: number;
  change: number; // year-over-year change
}

export interface TradeData {
  year: number;
  exports: number; // billions EUR
  imports: number; // billions EUR
  balance: number; // trade balance
}

export interface FDIData {
  year: number;
  amount: number; // millions EUR
  topSource?: string;
}

// Economic indicators showing Serbia's transition journey
export const economicIndicators: EconomicIndicator[] = [
  { year: 2000, gdpGrowth: 5.2, inflation: 70.0, unemployment: 26.1, event: 'Post-conflict recovery begins' },
  { year: 2001, gdpGrowth: 5.5, inflation: 91.8, unemployment: 27.8 },
  { year: 2002, gdpGrowth: 3.9, inflation: 19.5, unemployment: 24.5 },
  { year: 2003, gdpGrowth: 2.4, inflation: 11.3, unemployment: 25.1 },
  { year: 2004, gdpGrowth: 9.3, inflation: 10.1, unemployment: 23.7, event: 'Economic reforms accelerate' },
  { year: 2005, gdpGrowth: 5.5, inflation: 17.3, unemployment: 26.8 },
  { year: 2006, gdpGrowth: 4.9, inflation: 12.7, unemployment: 23.9 },
  { year: 2007, gdpGrowth: 6.9, inflation: 6.5, unemployment: 21.5, event: 'Pre-crisis boom' },
  { year: 2008, gdpGrowth: 5.4, inflation: 12.4, unemployment: 18.1, event: 'Global financial crisis begins' },
  { year: 2009, gdpGrowth: -3.1, inflation: 8.1, unemployment: 19.2, event: 'Crisis impact - first recession' },
  { year: 2010, gdpGrowth: 0.7, inflation: 6.1, unemployment: 23.0 },
  { year: 2011, gdpGrowth: 2.0, inflation: 11.1, unemployment: 26.1 },
  { year: 2012, gdpGrowth: -0.7, inflation: 7.3, unemployment: 25.5, event: 'Eurozone crisis spillover' },
  { year: 2013, gdpGrowth: 2.9, inflation: 7.7, unemployment: 24.6 },
  { year: 2014, gdpGrowth: -1.6, inflation: 2.1, unemployment: 19.7, event: 'Severe floods damage economy' },
  { year: 2015, gdpGrowth: 1.8, inflation: 1.4, unemployment: 17.7, event: 'Structural reforms begin' },
  { year: 2016, gdpGrowth: 3.3, inflation: 1.1, unemployment: 15.3 },
  { year: 2017, gdpGrowth: 2.1, inflation: 3.1, unemployment: 13.5 },
  { year: 2018, gdpGrowth: 4.5, inflation: 2.0, unemployment: 12.7, event: 'Strong FDI inflows' },
  { year: 2019, gdpGrowth: 4.2, inflation: 1.9, unemployment: 10.4 },
  { year: 2020, gdpGrowth: -0.9, inflation: 1.6, unemployment: 9.7, event: 'COVID-19 pandemic' },
  { year: 2021, gdpGrowth: 7.5, inflation: 4.0, unemployment: 11.0, event: 'Strong post-COVID recovery' },
  { year: 2022, gdpGrowth: 2.3, inflation: 11.9, unemployment: 9.4, event: 'Ukraine war impacts' },
  { year: 2023, gdpGrowth: 2.5, inflation: 12.4, unemployment: 9.2 },
];

// GDP composition by sector (latest year)
export const sectorComposition: SectorGDP[] = [
  { sector: 'Services', percentage: 51.2, change: 3.2 },
  { sector: 'Industry', percentage: 26.1, change: 5.1 },
  { sector: 'Agriculture', percentage: 9.8, change: -1.2 },
  { sector: 'Construction', percentage: 6.4, change: 4.7 },
  { sector: 'Energy', percentage: 3.8, change: 2.1 },
  { sector: 'Other', percentage: 2.7, change: 0.5 },
];

// Foreign trade evolution
export const tradeBalance: TradeData[] = [
  { year: 2010, exports: 7.4, imports: 12.9, balance: -5.5 },
  { year: 2011, exports: 8.4, imports: 14.2, balance: -5.8 },
  { year: 2012, exports: 8.7, imports: 14.6, balance: -5.9 },
  { year: 2013, exports: 10.2, imports: 15.0, balance: -4.8 },
  { year: 2014, exports: 11.2, imports: 15.5, balance: -4.3 },
  { year: 2015, exports: 11.8, imports: 15.2, balance: -3.4 },
  { year: 2016, exports: 13.1, imports: 15.9, balance: -2.8 },
  { year: 2017, exports: 13.9, imports: 17.5, balance: -3.6 },
  { year: 2018, exports: 15.3, imports: 19.6, balance: -4.3 },
  { year: 2019, exports: 16.4, imports: 21.0, balance: -4.6 },
  { year: 2020, exports: 15.9, imports: 20.1, balance: -4.2 },
  { year: 2021, exports: 19.2, imports: 25.8, balance: -6.6 },
  { year: 2022, exports: 22.4, imports: 31.2, balance: -8.8 },
  { year: 2023, exports: 24.1, imports: 33.5, balance: -9.4 },
];

// Foreign Direct Investment trends
export const fdiInflows: FDIData[] = [
  { year: 2010, amount: 860, topSource: 'Austria' },
  { year: 2011, amount: 2709, topSource: 'Austria' },
  { year: 2012, amount: 367, topSource: 'Netherlands' },
  { year: 2013, amount: 1299, topSource: 'UAE' },
  { year: 2014, amount: 1236, topSource: 'Netherlands' },
  { year: 2015, amount: 1804, topSource: 'UAE' },
  { year: 2016, amount: 1895, topSource: 'China' },
  { year: 2017, amount: 2415, topSource: 'China' },
  { year: 2018, amount: 3591, topSource: 'France' },
  { year: 2019, amount: 3772, topSource: 'China' },
  { year: 2020, amount: 2934, topSource: 'USA' },
  { year: 2021, amount: 3547, topSource: 'China' },
  { year: 2022, amount: 4277, topSource: 'South Korea' },
  { year: 2023, amount: 4558, topSource: 'China' },
];

// Key economic statistics
export const economicStats = {
  gdpPerCapita: 9420, // USD, 2023
  gdpTotal: 63.1, // billions USD
  publicDebt: 54.8, // % of GDP
  averageWage: 730, // EUR net monthly
  minimumWage: 230, // EUR net monthly
  povertyRate: 21.2, // %
  giniCoefficient: 33.3, // income inequality (0-100)
  currencyReserves: 21.4, // billions EUR
};

// Top export products (2023)
export const topExports = [
  { product: 'Electrical machinery', value: 4.2, share: 17.4 },
  { product: 'Road vehicles', value: 3.1, share: 12.9 },
  { product: 'Cereals', value: 2.8, share: 11.6 },
  { product: 'Iron and steel', value: 2.2, share: 9.1 },
  { product: 'Rubber products', value: 1.9, share: 7.9 },
  { product: 'Fruits and vegetables', value: 1.5, share: 6.2 },
  { product: 'Pharmaceuticals', value: 1.3, share: 5.4 },
  { product: 'Plastics', value: 1.2, share: 5.0 },
];

// Top import products (2023)
export const topImports = [
  { product: 'Energy and fuel', value: 5.8, share: 17.3 },
  { product: 'Electrical machinery', value: 4.1, share: 12.2 },
  { product: 'Road vehicles', value: 3.3, share: 9.9 },
  { product: 'Chemicals', value: 2.9, share: 8.7 },
  { product: 'Iron and steel', value: 2.1, share: 6.3 },
  { product: 'Pharmaceuticals', value: 1.9, share: 5.7 },
  { product: 'Plastics', value: 1.7, share: 5.1 },
  { product: 'Food products', value: 1.4, share: 4.2 },
];
