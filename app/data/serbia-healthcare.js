/**
 * Serbia Healthcare Crisis Data
 * Alarming statistics about waiting lists, capacity, and healthcare system challenges
 */
// Waiting lists for critical procedures - ALARMING DATA
export const waitingLists = [
    {
        procedure: 'Operacija srca (bajpas)',
        procedureEn: 'Heart surgery (bypass)',
        averageWaitDays: 365,
        patientsWaiting: 1850,
        recommendedMaxDays: 90,
        category: 'surgery'
    },
    {
        procedure: 'Zamena kuka',
        procedureEn: 'Hip replacement',
        averageWaitDays: 420,
        patientsWaiting: 3200,
        recommendedMaxDays: 180,
        category: 'surgery'
    },
    {
        procedure: 'Zamena kolena',
        procedureEn: 'Knee replacement',
        averageWaitDays: 380,
        patientsWaiting: 2900,
        recommendedMaxDays: 180,
        category: 'surgery'
    },
    {
        procedure: 'Onkološka hirurgija',
        procedureEn: 'Cancer surgery',
        averageWaitDays: 90,
        patientsWaiting: 2400,
        recommendedMaxDays: 30,
        category: 'surgery'
    },
    {
        procedure: 'Katarakt operacija',
        procedureEn: 'Cataract surgery',
        averageWaitDays: 240,
        patientsWaiting: 5800,
        recommendedMaxDays: 90,
        category: 'surgery'
    },
    {
        procedure: 'MRI pregled',
        procedureEn: 'MRI scan',
        averageWaitDays: 180,
        patientsWaiting: 8500,
        recommendedMaxDays: 30,
        category: 'diagnostics'
    },
    {
        procedure: 'CT sken',
        procedureEn: 'CT scan',
        averageWaitDays: 120,
        patientsWaiting: 6200,
        recommendedMaxDays: 21,
        category: 'diagnostics'
    },
    {
        procedure: 'Neurolog - prvi pregled',
        procedureEn: 'Neurologist - first visit',
        averageWaitDays: 210,
        patientsWaiting: 4300,
        recommendedMaxDays: 60,
        category: 'specialist'
    },
    {
        procedure: 'Kardiolog - prvi pregled',
        procedureEn: 'Cardiologist - first visit',
        averageWaitDays: 150,
        patientsWaiting: 7100,
        recommendedMaxDays: 45,
        category: 'specialist'
    },
    {
        procedure: 'Ortoped - prvi pregled',
        procedureEn: 'Orthopedist - first visit',
        averageWaitDays: 180,
        patientsWaiting: 9800,
        recommendedMaxDays: 60,
        category: 'specialist'
    }
];
// Hospital capacity trends - DECLINING
export const hospitalCapacity = [
    { year: 2015, totalBeds: 42500, occupancyRate: 72, patientsPerDoctor: 420, patientsPerNurse: 180 },
    { year: 2016, totalBeds: 42100, occupancyRate: 74, patientsPerDoctor: 435, patientsPerNurse: 190 },
    { year: 2017, totalBeds: 41800, occupancyRate: 76, patientsPerDoctor: 448, patientsPerNurse: 195 },
    { year: 2018, totalBeds: 41200, occupancyRate: 79, patientsPerDoctor: 465, patientsPerNurse: 205 },
    { year: 2019, totalBeds: 40800, occupancyRate: 81, patientsPerDoctor: 480, patientsPerNurse: 215 },
    { year: 2020, totalBeds: 40500, occupancyRate: 88, patientsPerDoctor: 495, patientsPerNurse: 225 },
    { year: 2021, totalBeds: 40200, occupancyRate: 85, patientsPerDoctor: 510, patientsPerNurse: 235 },
    { year: 2022, totalBeds: 39800, occupancyRate: 84, patientsPerDoctor: 528, patientsPerNurse: 248 },
    { year: 2023, totalBeds: 39400, occupancyRate: 86, patientsPerDoctor: 545, patientsPerNurse: 260 },
    { year: 2024, totalBeds: 39000, occupancyRate: 88, patientsPerDoctor: 565, patientsPerNurse: 275 }
];
// Brain drain - healthcare workers leaving Serbia
export const healthcareWorkerExodus = [
    { year: 2015, doctorsLeft: 120, nursesLeft: 180, totalLeft: 300 },
    { year: 2016, doctorsLeft: 145, nursesLeft: 210, totalLeft: 355 },
    { year: 2017, doctorsLeft: 180, nursesLeft: 250, totalLeft: 430 },
    { year: 2018, doctorsLeft: 220, nursesLeft: 310, totalLeft: 530 },
    { year: 2019, doctorsLeft: 280, nursesLeft: 380, totalLeft: 660 },
    { year: 2020, doctorsLeft: 195, nursesLeft: 290, totalLeft: 485 },
    { year: 2021, doctorsLeft: 340, nursesLeft: 450, totalLeft: 790 },
    { year: 2022, doctorsLeft: 420, nursesLeft: 550, totalLeft: 970 },
    { year: 2023, doctorsLeft: 520, nursesLeft: 680, totalLeft: 1200 },
    { year: 2024, doctorsLeft: 480, nursesLeft: 620, totalLeft: 1100 }
];
// Health indicators - comparing with EU
export const healthIndicators = [
    {
        indicator: 'Očekivani životni vek',
        indicatorEn: 'Life expectancy',
        value: 74.2,
        unit: 'godina',
        trend: 'stable',
        comparison: 'EU prosek: 81.3 godina',
        comparisonEn: 'EU average: 81.3 years'
    },
    {
        indicator: 'Smrtnost odojčadi',
        indicatorEn: 'Infant mortality',
        value: 4.8,
        unit: 'na 1,000 rođenih',
        trend: 'worsening',
        comparison: 'EU prosek: 3.2',
        comparisonEn: 'EU average: 3.2'
    },
    {
        indicator: 'Lekara na 100,000 stanovnika',
        indicatorEn: 'Doctors per 100,000 population',
        value: 316,
        unit: 'lekara',
        trend: 'worsening',
        comparison: 'EU prosek: 380',
        comparisonEn: 'EU average: 380'
    },
    {
        indicator: 'Medicinskih sestara na 100,000',
        indicatorEn: 'Nurses per 100,000',
        value: 580,
        unit: 'sestara',
        trend: 'worsening',
        comparison: 'EU prosek: 850',
        comparisonEn: 'EU average: 850'
    },
    {
        indicator: 'Bolničkih kreveta na 100,000',
        indicatorEn: 'Hospital beds per 100,000',
        value: 562,
        unit: 'kreveta',
        trend: 'worsening',
        comparison: 'EU prosek: 540 (ali raste)',
        comparisonEn: 'EU average: 540 (but increasing)'
    },
    {
        indicator: 'Izdvajanja za zdravstvo (% BDP)',
        indicatorEn: 'Healthcare spending (% GDP)',
        value: 8.6,
        unit: '% BDP',
        trend: 'stable',
        comparison: 'EU prosek: 10.9%',
        comparisonEn: 'EU average: 10.9%'
    }
];
// Summary statistics
export const healthcareStats = {
    totalPatientsWaiting: waitingLists.reduce((sum, item) => sum + item.patientsWaiting, 0),
    averageWaitTimeAllProcedures: Math.round(waitingLists.reduce((sum, item) => sum + item.averageWaitDays, 0) / waitingLists.length),
    criticalWaitingLists: waitingLists.filter(item => item.averageWaitDays > item.recommendedMaxDays * 2).length,
    totalWorkersLeft2015to2024: healthcareWorkerExodus.reduce((sum, year) => sum + year.totalLeft, 0),
    workersLeftLastYear: healthcareWorkerExodus[healthcareWorkerExodus.length - 1].totalLeft,
    bedReduction2015to2024: hospitalCapacity[0].totalBeds - hospitalCapacity[hospitalCapacity.length - 1].totalBeds,
    currentOccupancyRate: hospitalCapacity[hospitalCapacity.length - 1].occupancyRate,
    patientsPerDoctorIncrease: hospitalCapacity[hospitalCapacity.length - 1].patientsPerDoctor -
        hospitalCapacity[0].patientsPerDoctor
};
