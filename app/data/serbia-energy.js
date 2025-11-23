/**
 * Serbia Energy Crisis Data
 * Alarming statistics about fossil fuel dependency, renewable energy lag, and energy imports
 */
// Energy production mix - HEAVILY DEPENDENT ON COAL
export const energyProduction = [
    { year: 2015, totalProductionGWh: 36420, coal: 65.2, hydropower: 28.5, naturalGas: 4.8, solarWind: 0.8, other: 0.7 },
    { year: 2016, totalProductionGWh: 37890, coal: 64.8, hydropower: 29.2, naturalGas: 4.5, solarWind: 0.9, other: 0.6 },
    { year: 2017, totalProductionGWh: 38560, coal: 66.1, hydropower: 27.8, naturalGas: 4.6, solarWind: 1.0, other: 0.5 },
    { year: 2018, totalProductionGWh: 39120, coal: 67.4, hydropower: 26.5, naturalGas: 4.4, solarWind: 1.2, other: 0.5 },
    { year: 2019, totalProductionGWh: 39850, coal: 68.2, hydropower: 25.8, naturalGas: 4.2, solarWind: 1.3, other: 0.5 },
    { year: 2020, totalProductionGWh: 38240, coal: 66.5, hydropower: 27.2, naturalGas: 4.5, solarWind: 1.3, other: 0.5 },
    { year: 2021, totalProductionGWh: 40120, coal: 69.1, hydropower: 24.8, naturalGas: 4.2, solarWind: 1.4, other: 0.5 },
    { year: 2022, totalProductionGWh: 40890, coal: 70.3, hydropower: 23.5, naturalGas: 4.0, solarWind: 1.7, other: 0.5 },
    { year: 2023, totalProductionGWh: 41200, coal: 69.8, hydropower: 24.1, naturalGas: 3.9, solarWind: 1.7, other: 0.5 },
    { year: 2024, totalProductionGWh: 41560, coal: 68.5, hydropower: 25.2, naturalGas: 3.8, solarWind: 2.0, other: 0.5 }
];
// Energy imports - INCREASING DEPENDENCY
export const energyImports = [
    { year: 2015, importedGWh: 5420, importCostMillionEUR: 245, electricityImportPercentage: 12.9, gasImportPercentage: 78.5 },
    { year: 2016, importedGWh: 5890, importCostMillionEUR: 268, electricityImportPercentage: 13.5, gasImportPercentage: 79.2 },
    { year: 2017, importedGWh: 6120, importCostMillionEUR: 289, electricityImportPercentage: 13.7, gasImportPercentage: 80.1 },
    { year: 2018, importedGWh: 6450, importCostMillionEUR: 312, electricityImportPercentage: 14.2, gasImportPercentage: 81.5 },
    { year: 2019, importedGWh: 6890, importCostMillionEUR: 342, electricityImportPercentage: 14.7, gasImportPercentage: 82.8 },
    { year: 2020, importedGWh: 6240, importCostMillionEUR: 298, electricityImportPercentage: 14.0, gasImportPercentage: 81.2 },
    { year: 2021, importedGWh: 7320, importCostMillionEUR: 425, electricityImportPercentage: 15.4, gasImportPercentage: 83.5 },
    { year: 2022, importedGWh: 8120, importCostMillionEUR: 680, electricityImportPercentage: 16.6, gasImportPercentage: 85.2 },
    { year: 2023, importedGWh: 7890, importCostMillionEUR: 625, electricityImportPercentage: 16.1, gasImportPercentage: 84.8 },
    { year: 2024, importedGWh: 8340, importCostMillionEUR: 710, electricityImportPercentage: 16.7, gasImportPercentage: 86.1 }
];
// Renewable energy comparison - Serbia LAGS BEHIND
export const renewableComparison = [
    { country: 'Srbija', renewablePercentage: 27.2, year: 2024 },
    { country: 'Rumunija', renewablePercentage: 42.7, year: 2024 },
    { country: 'Hrvatska', renewablePercentage: 54.1, year: 2024 },
    { country: 'Bugarska', renewablePercentage: 35.8, year: 2024 },
    { country: 'Grčka', renewablePercentage: 48.3, year: 2024 },
    { country: 'Austrija', renewablePercentage: 78.2, year: 2024 },
    { country: 'Danska', renewablePercentage: 83.5, year: 2024 },
    { country: 'Norveška', renewablePercentage: 98.5, year: 2024 },
    { country: 'EU prosek', renewablePercentage: 44.7, year: 2024 }
];
// Emissions from energy production - VERY HIGH
export const emissions = [
    { year: 2015, co2EmissionsMillionTons: 48.5, co2PerCapitaTons: 6.8, pmEmissionsThousandTons: 145 },
    { year: 2016, co2EmissionsMillionTons: 49.2, co2PerCapitaTons: 7.0, pmEmissionsThousandTons: 148 },
    { year: 2017, co2EmissionsMillionTons: 51.3, co2PerCapitaTons: 7.3, pmEmissionsThousandTons: 156 },
    { year: 2018, co2EmissionsMillionTons: 52.8, co2PerCapitaTons: 7.6, pmEmissionsThousandTons: 162 },
    { year: 2019, co2EmissionsMillionTons: 54.1, co2PerCapitaTons: 7.8, pmEmissionsThousandTons: 168 },
    { year: 2020, co2EmissionsMillionTons: 50.2, co2PerCapitaTons: 7.3, pmEmissionsThousandTons: 158 },
    { year: 2021, co2EmissionsMillionTons: 55.6, co2PerCapitaTons: 8.1, pmEmissionsThousandTons: 174 },
    { year: 2022, co2EmissionsMillionTons: 57.2, co2PerCapitaTons: 8.4, pmEmissionsThousandTons: 182 },
    { year: 2023, co2EmissionsMillionTons: 56.8, co2PerCapitaTons: 8.4, pmEmissionsThousandTons: 180 },
    { year: 2024, co2EmissionsMillionTons: 55.9, co2PerCapitaTons: 8.3, pmEmissionsThousandTons: 176 }
];
// Energy infrastructure - OLD AND INEFFICIENT
export const energyInfrastructure = {
    coalPlants: [
        { name: 'TENT A (Obrenovac)', nameEn: 'TENT A (Obrenovac)', ageYears: 52, efficiencyPercentage: 28, capacityMW: 1650, pollutionLevel: 'very high' },
        { name: 'TENT B (Obrenovac)', nameEn: 'TENT B (Obrenovac)', ageYears: 38, efficiencyPercentage: 32, capacityMW: 1240, pollutionLevel: 'very high' },
        { name: 'TE Kostolac A', nameEn: 'TPP Kostolac A', ageYears: 55, efficiencyPercentage: 26, capacityMW: 865, pollutionLevel: 'very high' },
        { name: 'TE Kostolac B', nameEn: 'TPP Kostolac B', ageYears: 42, efficiencyPercentage: 30, capacityMW: 1250, pollutionLevel: 'very high' },
        { name: 'TE Kolubara', nameEn: 'TPP Kolubara', ageYears: 48, efficiencyPercentage: 29, capacityMW: 240, pollutionLevel: 'high' },
        { name: 'TE Morava', nameEn: 'TPP Morava', ageYears: 45, efficiencyPercentage: 27, capacityMW: 125, pollutionLevel: 'high' }
    ],
    renewableProjects: [
        { type: 'Vetroelektrane', typeEn: 'Wind farms', plannedCapacityMW: 1200, completedPercentage: 15, status: 'delayed' },
        { type: 'Solarne elektrane', typeEn: 'Solar plants', plannedCapacityMW: 800, completedPercentage: 22, status: 'in progress' },
        { type: 'Mali HE', typeEn: 'Small hydro', plannedCapacityMW: 350, completedPercentage: 58, status: 'in progress' },
        { type: 'Biomasa', typeEn: 'Biomass', plannedCapacityMW: 180, completedPercentage: 12, status: 'delayed' }
    ]
};
// Summary statistics
export const energyStats = {
    coalDependency2024: energyProduction[energyProduction.length - 1].coal,
    renewableShare2024: energyProduction[energyProduction.length - 1].hydropower +
        energyProduction[energyProduction.length - 1].solarWind,
    solarWindOnly2024: energyProduction[energyProduction.length - 1].solarWind,
    importDependency2024: energyImports[energyImports.length - 1].electricityImportPercentage,
    importCost2024: energyImports[energyImports.length - 1].importCostMillionEUR,
    importCostIncrease2015to2024: energyImports[energyImports.length - 1].importCostMillionEUR -
        energyImports[0].importCostMillionEUR,
    co2Emissions2024: emissions[emissions.length - 1].co2EmissionsMillionTons,
    co2PerCapita2024: emissions[emissions.length - 1].co2PerCapitaTons,
    euRenewableAverage: 44.7,
    renewableGapWithEU: 44.7 - 27.2,
    averagePlantAge: Math.round(energyInfrastructure.coalPlants.reduce((sum, plant) => sum + plant.ageYears, 0) /
        energyInfrastructure.coalPlants.length),
    averagePlantEfficiency: Math.round(energyInfrastructure.coalPlants.reduce((sum, plant) => sum + plant.efficiencyPercentage, 0) /
        energyInfrastructure.coalPlants.length),
    renewableProjectsDelayed: energyInfrastructure.renewableProjects.filter(p => p.status === 'delayed').length,
    totalPlannedRenewableCapacity: energyInfrastructure.renewableProjects.reduce((sum, p) => sum + p.plannedCapacityMW, 0),
    completedRenewableCapacity: Math.round(energyInfrastructure.renewableProjects.reduce((sum, p) => sum + (p.plannedCapacityMW * p.completedPercentage / 100), 0))
};
