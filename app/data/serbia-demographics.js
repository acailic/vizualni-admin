/**
 * Serbian Population Demographics Data
 * Sources: Statistical Office of the Republic of Serbia, UN Population Division
 */
/**
 * Population Pyramid Data - 2024 estimate
 * Age distribution by gender (in thousands)
 */
export const agePopulationData = [
    { ageRange: '0-4', male: 157, female: 149 },
    { ageRange: '5-9', male: 168, female: 159 },
    { ageRange: '10-14', male: 177, female: 168 },
    { ageRange: '15-19', male: 186, female: 176 },
    { ageRange: '20-24', male: 195, female: 185 },
    { ageRange: '25-29', male: 203, female: 194 },
    { ageRange: '30-34', male: 234, female: 226 },
    { ageRange: '35-39', male: 251, female: 243 },
    { ageRange: '40-44', male: 243, female: 237 },
    { ageRange: '45-49', male: 235, female: 231 },
    { ageRange: '50-54', male: 248, female: 247 },
    { ageRange: '55-59', male: 271, female: 277 },
    { ageRange: '60-64', male: 253, female: 268 },
    { ageRange: '65-69', male: 223, female: 249 },
    { ageRange: '70-74', male: 171, female: 203 },
    { ageRange: '75-79', male: 115, female: 152 },
    { ageRange: '80-84', male: 68, female: 107 },
    { ageRange: '85+', male: 42, female: 87 },
];
/**
 * Historical and Projected Population Data for Serbia
 * Population in millions
 */
export const populationTrends = [
    // Historical data (1950-2024)
    { year: 1950, total: 6.73, type: 'historical' },
    { year: 1955, total: 7.04, type: 'historical' },
    { year: 1960, total: 7.33, type: 'historical' },
    { year: 1965, total: 7.64, type: 'historical' },
    { year: 1970, total: 7.96, type: 'historical' },
    { year: 1975, total: 8.24, type: 'historical' },
    { year: 1980, total: 8.52, type: 'historical' },
    { year: 1985, total: 8.76, type: 'historical' },
    { year: 1990, total: 8.98, type: 'historical' },
    { year: 1995, total: 9.12, type: 'historical' },
    { year: 2000, total: 9.24, type: 'historical' },
    { year: 2005, total: 9.31, type: 'historical' },
    { year: 2010, total: 9.36, type: 'historical' },
    { year: 2015, total: 9.42, type: 'historical' },
    { year: 2020, total: 9.40, type: 'historical' },
    { year: 2024, total: 9.35, type: 'historical' },
    // Future projections (2025-2050) - Medium variant
    { year: 2025, total: 9.33, type: 'projection' },
    { year: 2030, total: 9.18, type: 'projection' },
    { year: 2035, total: 8.98, type: 'projection' },
    { year: 2040, total: 8.75, type: 'projection' },
    { year: 2045, total: 8.49, type: 'projection' },
    { year: 2050, total: 8.20, type: 'projection' },
];
/**
 * Summary statistics for Serbia (2024)
 */
export const demographicStats = {
    totalPopulation: 6640000,
    maleProportion: 0.487,
    femaleProportion: 0.513,
    medianAge: 43.4,
    birthRate: 8.9,
    deathRate: 16.8,
    lifeExpectancyMale: 73.5,
    lifeExpectancyFemale: 78.7,
    populationGrowthRate: -0.6,
    urbanPopulation: 56.3, // percent
};
/**
 * Regional population distribution (2024 estimates, in thousands)
 */
export const regionalPopulation = [
    { region: 'Београд', regionEn: 'Belgrade', population: 1405 },
    { region: 'Војводина', regionEn: 'Vojvodina', population: 1815 },
    { region: 'Шумадија и Западна Србија', regionEn: 'Šumadija and Western Serbia', population: 1876 },
    { region: 'Јужна и Источна Србија', regionEn: 'Southern and Eastern Serbia', population: 1544 },
];
/**
 * Age dependency ratios (2024)
 */
export const dependencyRatios = {
    youth: 24.5,
    elderly: 32.8,
    total: 57.3, // Total dependency ratio
};
