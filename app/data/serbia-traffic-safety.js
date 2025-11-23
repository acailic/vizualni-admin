/**
 * Serbia Traffic Safety Crisis Data
 * Alarming statistics about road fatalities, accidents, and safety infrastructure
 */
// Traffic fatalities trends - ALARMING
export const trafficFatalities = [
    {
        year: 2015,
        totalFatalities: 607,
        fatalitiesPer100kPopulation: 8.5,
        seriousInjuries: 4823,
        totalAccidents: 15420,
        pedestrianFatalities: 142,
        motorcyclistFatalities: 38,
        youngDriverFatalities: 95
    },
    {
        year: 2016,
        totalFatalities: 607,
        fatalitiesPer100kPopulation: 8.6,
        seriousInjuries: 5012,
        totalAccidents: 16234,
        pedestrianFatalities: 138,
        motorcyclistFatalities: 42,
        youngDriverFatalities: 98
    },
    {
        year: 2017,
        totalFatalities: 548,
        fatalitiesPer100kPopulation: 7.8,
        seriousInjuries: 4756,
        totalAccidents: 15890,
        pedestrianFatalities: 126,
        motorcyclistFatalities: 45,
        youngDriverFatalities: 87
    },
    {
        year: 2018,
        totalFatalities: 452,
        fatalitiesPer100kPopulation: 6.5,
        seriousInjuries: 4234,
        totalAccidents: 14567,
        pedestrianFatalities: 108,
        motorcyclistFatalities: 41,
        youngDriverFatalities: 72
    },
    {
        year: 2019,
        totalFatalities: 465,
        fatalitiesPer100kPopulation: 6.7,
        seriousInjuries: 4421,
        totalAccidents: 15123,
        pedestrianFatalities: 115,
        motorcyclistFatalities: 48,
        youngDriverFatalities: 78
    },
    {
        year: 2020,
        totalFatalities: 391,
        fatalitiesPer100kPopulation: 5.7,
        seriousInjuries: 3845,
        totalAccidents: 12890,
        pedestrianFatalities: 92,
        motorcyclistFatalities: 38,
        youngDriverFatalities: 62
    },
    {
        year: 2021,
        totalFatalities: 412,
        fatalitiesPer100kPopulation: 6.0,
        seriousInjuries: 4156,
        totalAccidents: 14234,
        pedestrianFatalities: 98,
        motorcyclistFatalities: 44,
        youngDriverFatalities: 68
    },
    {
        year: 2022,
        totalFatalities: 438,
        fatalitiesPer100kPopulation: 6.4,
        seriousInjuries: 4523,
        totalAccidents: 15678,
        pedestrianFatalities: 105,
        motorcyclistFatalities: 52,
        youngDriverFatalities: 74
    },
    {
        year: 2023,
        totalFatalities: 467,
        fatalitiesPer100kPopulation: 6.9,
        seriousInjuries: 4812,
        totalAccidents: 16234,
        pedestrianFatalities: 118,
        motorcyclistFatalities: 58,
        youngDriverFatalities: 81
    },
    {
        year: 2024,
        totalFatalities: 482,
        fatalitiesPer100kPopulation: 7.1,
        seriousInjuries: 5021,
        totalAccidents: 16890,
        pedestrianFatalities: 125,
        motorcyclistFatalities: 62,
        youngDriverFatalities: 86
    }
];
// Main causes of accidents - PREVENTABLE
export const accidentCauses = [
    {
        cause: 'Prekoračenje brzine',
        causeEn: 'Speeding',
        percentage: 32.5,
        fatalities: 157,
        preventable: true
    },
    {
        cause: 'Nepropisno preticanje',
        causeEn: 'Improper overtaking',
        percentage: 18.3,
        fatalities: 88,
        preventable: true
    },
    {
        cause: 'Vožnja pod uticajem alkohola',
        causeEn: 'Drunk driving',
        percentage: 15.8,
        fatalities: 76,
        preventable: true
    },
    {
        cause: 'Nepoštovanje saobraćajnih znakova',
        causeEn: 'Ignoring traffic signs',
        percentage: 12.4,
        fatalities: 60,
        preventable: true
    },
    {
        cause: 'Korišćenje mobilnog telefona',
        causeEn: 'Mobile phone use',
        percentage: 9.2,
        fatalities: 44,
        preventable: true
    },
    {
        cause: 'Neprilagođena brzina',
        causeEn: 'Speed inappropriate for conditions',
        percentage: 6.8,
        fatalities: 33,
        preventable: true
    },
    {
        cause: 'Umor i pospanost',
        causeEn: 'Fatigue and drowsiness',
        percentage: 3.5,
        fatalities: 17,
        preventable: true
    },
    {
        cause: 'Ostalo',
        causeEn: 'Other',
        percentage: 1.5,
        fatalities: 7,
        preventable: false
    }
];
// Road infrastructure quality - POOR
export const roadInfrastructure = [
    {
        year: 2015,
        totalRoadsKm: 45622,
        highwaysKm: 823,
        roadQualityGoodPercentage: 38,
        roadQualityPoorPercentage: 42,
        safetyBarriersKm: 1240,
        lightedRoadsPercentage: 18
    },
    {
        year: 2018,
        totalRoadsKm: 45890,
        highwaysKm: 1042,
        roadQualityGoodPercentage: 42,
        roadQualityPoorPercentage: 39,
        safetyBarriersKm: 1520,
        lightedRoadsPercentage: 20
    },
    {
        year: 2021,
        totalRoadsKm: 46234,
        highwaysKm: 1124,
        roadQualityGoodPercentage: 45,
        roadQualityPoorPercentage: 36,
        safetyBarriersKm: 1680,
        lightedRoadsPercentage: 22
    },
    {
        year: 2024,
        totalRoadsKm: 46567,
        highwaysKm: 1214,
        roadQualityGoodPercentage: 48,
        roadQualityPoorPercentage: 33,
        safetyBarriersKm: 1820,
        lightedRoadsPercentage: 24
    }
];
// Comparison with EU countries - Serbia is WORST
export const comparativeData = [
    { country: 'Srbija', fatalitiesPer100k: 7.1, year: 2024 },
    { country: 'Rumunija', fatalitiesPer100k: 8.2, year: 2024 },
    { country: 'Bugarska', fatalitiesPer100k: 7.8, year: 2024 },
    { country: 'Hrvatska', fatalitiesPer100k: 5.9, year: 2024 },
    { country: 'Mađarska', fatalitiesPer100k: 5.6, year: 2024 },
    { country: 'Slovenija', fatalitiesPer100k: 4.1, year: 2024 },
    { country: 'Austrija', fatalitiesPer100k: 3.8, year: 2024 },
    { country: 'Nemačka', fatalitiesPer100k: 3.4, year: 2024 },
    { country: 'Švedska', fatalitiesPer100k: 2.2, year: 2024 },
    { country: 'Norveška', fatalitiesPer100k: 2.0, year: 2024 }
];
// Summary statistics
export const trafficStats = {
    current2024Fatalities: trafficFatalities[trafficFatalities.length - 1].totalFatalities,
    fatalitiesPer100k2024: trafficFatalities[trafficFatalities.length - 1].fatalitiesPer100kPopulation,
    totalFatalities2015to2024: trafficFatalities.reduce((sum, year) => sum + year.totalFatalities, 0),
    preventableFatalities: accidentCauses
        .filter(c => c.preventable)
        .reduce((sum, c) => sum + c.fatalities, 0),
    preventablePercentage: accidentCauses
        .filter(c => c.preventable)
        .reduce((sum, c) => sum + c.percentage, 0),
    pedestrianFatalities2024: trafficFatalities[trafficFatalities.length - 1].pedestrianFatalities,
    youngDriverFatalities2024: trafficFatalities[trafficFatalities.length - 1].youngDriverFatalities,
    poorRoadPercentage: roadInfrastructure[roadInfrastructure.length - 1].roadQualityPoorPercentage,
    comparisonWithEUAvg: 7.1 - 4.2,
    worseningTrend: trafficFatalities[trafficFatalities.length - 1].totalFatalities >
        trafficFatalities[trafficFatalities.length - 4].totalFatalities,
    fatalityIncreaseSince2020: trafficFatalities[trafficFatalities.length - 1].totalFatalities -
        trafficFatalities[5].totalFatalities,
    averageFatalitiesPerDay: Math.round(trafficFatalities[trafficFatalities.length - 1].totalFatalities / 365 * 10) / 10
};
