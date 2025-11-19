/**
 * Serbia Employment Crisis Data
 * Alarming statistics about youth unemployment, brain drain, and labor market challenges
 */

export interface UnemploymentData {
  year: number;
  totalUnemploymentRate: number; // percentage
  youthUnemploymentRate: number; // 15-24 years, percentage
  longTermUnemploymentRate: number; // percentage
  employmentRate: number; // percentage
}

export interface BrainDrainData {
  year: number;
  emigrantsTotal: number;
  highlyEducated: number; // with university degree
  age2535: number; // young professionals
  destination: {
    germany: number;
    austria: number;
    switzerland: number;
    usa: number;
    other: number;
  };
}

export interface WageComparison {
  sector: string;
  sectorEn: string;
  serbiaAvgMonthly: number; // in EUR
  euAvgMonthly: number; // in EUR
  difference: number; // percentage
}

export interface SkillsMismatch {
  field: string;
  fieldEn: string;
  graduates: number;
  jobOpenings: number;
  mismatch: 'surplus' | 'shortage';
}

// Unemployment trends - particularly alarming for youth
export const unemploymentTrends: UnemploymentData[] = [
  { year: 2015, totalUnemploymentRate: 17.7, youthUnemploymentRate: 43.2, longTermUnemploymentRate: 14.1, employmentRate: 52.5 },
  { year: 2016, totalUnemploymentRate: 15.3, youthUnemploymentRate: 34.9, longTermUnemploymentRate: 12.8, employmentRate: 54.2 },
  { year: 2017, totalUnemploymentRate: 13.5, youthUnemploymentRate: 31.9, longTermUnemploymentRate: 11.4, employmentRate: 55.8 },
  { year: 2018, totalUnemploymentRate: 12.7, youthUnemploymentRate: 29.7, longTermUnemploymentRate: 10.8, employmentRate: 56.9 },
  { year: 2019, totalUnemploymentRate: 10.4, youthUnemploymentRate: 27.5, longTermUnemploymentRate: 9.2, employmentRate: 58.7 },
  { year: 2020, totalUnemploymentRate: 9.0, youthUnemploymentRate: 26.8, longTermUnemploymentRate: 7.8, employmentRate: 59.3 },
  { year: 2021, totalUnemploymentRate: 11.0, youthUnemploymentRate: 28.1, longTermUnemploymentRate: 8.9, employmentRate: 57.8 },
  { year: 2022, totalUnemploymentRate: 9.4, youthUnemploymentRate: 26.3, longTermUnemploymentRate: 7.5, employmentRate: 60.1 },
  { year: 2023, totalUnemploymentRate: 9.7, youthUnemploymentRate: 25.4, longTermUnemploymentRate: 7.8, employmentRate: 60.5 },
  { year: 2024, totalUnemploymentRate: 9.2, youthUnemploymentRate: 24.8, longTermUnemploymentRate: 7.2, employmentRate: 61.2 }
];

// Brain drain - alarming emigration of young educated people
export const brainDrainData: BrainDrainData[] = [
  {
    year: 2015,
    emigrantsTotal: 38500,
    highlyEducated: 12800,
    age2535: 19200,
    destination: { germany: 15400, austria: 8900, switzerland: 4200, usa: 2800, other: 7200 }
  },
  {
    year: 2016,
    emigrantsTotal: 42100,
    highlyEducated: 14200,
    age2535: 21000,
    destination: { germany: 16800, austria: 9800, switzerland: 4600, usa: 3100, other: 7800 }
  },
  {
    year: 2017,
    emigrantsTotal: 48900,
    highlyEducated: 16800,
    age2535: 24500,
    destination: { germany: 19600, austria: 11400, switzerland: 5300, usa: 3500, other: 9100 }
  },
  {
    year: 2018,
    emigrantsTotal: 52300,
    highlyEducated: 18500,
    age2535: 26100,
    destination: { germany: 21000, austria: 12200, switzerland: 5700, usa: 3700, other: 9700 }
  },
  {
    year: 2019,
    emigrantsTotal: 56800,
    highlyEducated: 20100,
    age2535: 28400,
    destination: { germany: 22700, austria: 13200, switzerland: 6200, usa: 4000, other: 10700 }
  },
  {
    year: 2020,
    emigrantsTotal: 44200,
    highlyEducated: 15600,
    age2535: 22100,
    destination: { germany: 17700, austria: 10300, switzerland: 4800, usa: 3100, other: 8300 }
  },
  {
    year: 2021,
    emigrantsTotal: 61200,
    highlyEducated: 22400,
    age2535: 30600,
    destination: { germany: 24500, austria: 14300, switzerland: 6700, usa: 4300, other: 11400 }
  },
  {
    year: 2022,
    emigrantsTotal: 68700,
    highlyEducated: 25800,
    age2535: 34400,
    destination: { germany: 27500, austria: 16000, switzerland: 7500, usa: 4800, other: 12900 }
  },
  {
    year: 2023,
    emigrantsTotal: 72400,
    highlyEducated: 28100,
    age2535: 36200,
    destination: { germany: 29000, austria: 16900, switzerland: 7900, usa: 5100, other: 13500 }
  },
  {
    year: 2024,
    emigrantsTotal: 75900,
    highlyEducated: 30200,
    age2535: 37900,
    destination: { germany: 30400, austria: 17700, switzerland: 8300, usa: 5400, other: 14100 }
  }
];

// Wage comparison - showing why people leave
export const wageComparison: WageComparison[] = [
  {
    sector: 'IT i programiranje',
    sectorEn: 'IT and programming',
    serbiaAvgMonthly: 1400,
    euAvgMonthly: 4500,
    difference: -69
  },
  {
    sector: 'Zdravstvo - lekar',
    sectorEn: 'Healthcare - doctor',
    serbiaAvgMonthly: 900,
    euAvgMonthly: 5200,
    difference: -83
  },
  {
    sector: 'Zdravstvo - medicinska sestra',
    sectorEn: 'Healthcare - nurse',
    serbiaAvgMonthly: 550,
    euAvgMonthly: 2800,
    difference: -80
  },
  {
    sector: 'Inženjerstvo',
    sectorEn: 'Engineering',
    serbiaAvgMonthly: 950,
    euAvgMonthly: 3800,
    difference: -75
  },
  {
    sector: 'Obrazovanje - profesor',
    sectorEn: 'Education - teacher',
    serbiaAvgMonthly: 650,
    euAvgMonthly: 3200,
    difference: -80
  },
  {
    sector: 'Građevina - majstor',
    sectorEn: 'Construction - skilled worker',
    serbiaAvgMonthly: 700,
    euAvgMonthly: 2500,
    difference: -72
  },
  {
    sector: 'Trgovina - prodavac',
    sectorEn: 'Retail - salesperson',
    serbiaAvgMonthly: 450,
    euAvgMonthly: 1800,
    difference: -75
  }
];

// Skills mismatch - graduates vs job market needs
export const skillsMismatch: SkillsMismatch[] = [
  { field: 'Pravo', fieldEn: 'Law', graduates: 4200, jobOpenings: 800, mismatch: 'surplus' },
  { field: 'Ekonomija', fieldEn: 'Economics', graduates: 5800, jobOpenings: 2100, mismatch: 'surplus' },
  { field: 'IT', fieldEn: 'IT', graduates: 2100, jobOpenings: 8500, mismatch: 'shortage' },
  { field: 'Medicina', fieldEn: 'Medicine', graduates: 1200, jobOpenings: 3400, mismatch: 'shortage' },
  { field: 'Zanatstvo', fieldEn: 'Skilled trades', graduates: 800, jobOpenings: 5200, mismatch: 'shortage' },
  { field: 'Inženjerstvo', fieldEn: 'Engineering', graduates: 1800, jobOpenings: 4200, mismatch: 'shortage' },
  { field: 'Filozofija', fieldEn: 'Philosophy', graduates: 1100, jobOpenings: 200, mismatch: 'surplus' },
  { field: 'Poljoprivreda', fieldEn: 'Agriculture', graduates: 600, jobOpenings: 2800, mismatch: 'shortage' }
];

// Summary statistics
export const employmentStats = {
  currentYouthUnemployment: unemploymentTrends[unemploymentTrends.length - 1].youthUnemploymentRate,
  youthUnemploymentVsEU: 24.8 - 14.8, // Serbia vs EU average
  totalEmigratedSince2015: brainDrainData.reduce((sum, year) => sum + year.emigrantsTotal, 0),
  emigratedIn2024: brainDrainData[brainDrainData.length - 1].emigrantsTotal,
  highlyEducatedEmigrated2024: brainDrainData[brainDrainData.length - 1].highlyEducated,
  averageWageDifferenceWithEU: Math.round(
    wageComparison.reduce((sum, sector) => sum + Math.abs(sector.difference), 0) / wageComparison.length
  ),
  skillsSurplusFields: skillsMismatch.filter(s => s.mismatch === 'surplus').length,
  skillsShortageFields: skillsMismatch.filter(s => s.mismatch === 'shortage').length,
  totalGraduatesSurplus: skillsMismatch
    .filter(s => s.mismatch === 'surplus')
    .reduce((sum, s) => sum + (s.graduates - s.jobOpenings), 0),
  totalJobsShortage: skillsMismatch
    .filter(s => s.mismatch === 'shortage')
    .reduce((sum, s) => sum + (s.jobOpenings - s.graduates), 0)
};
