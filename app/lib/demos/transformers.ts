/**
 * Data transformation utilities for data.gov.rs demo visualizations
 *
 * These transformers convert raw CSV/JSON data from data.gov.rs
 * into formats optimized for chart components.
 */

/**
 * Transform education statistics data from data.gov.rs
 *
 * Expected CSV structure:
 * - "School Year" or "Školska godina" (e.g., "2020/2021")
 * - "Level of Education" or "Nivo obrazovanja" (e.g., "Osnovno", "Srednje", "Visoko")
 * - "Number of Students" or "Broj učenika" (numeric)
 *
 * Output format for ColumnChart:
 * [
 *   { year: "2020/2021", elementary: 500000, secondary: 300000, higher: 250000 },
 *   { year: "2021/2022", elementary: 495000, secondary: 298000, higher: 255000 },
 *   ...
 * ]
 *
 * @param rawData - Array of objects from parsed CSV
 * @param locale - 'sr' or 'en' for column name detection
 * @returns Transformed data ready for ColumnChart with multi-series support
 */
export function transformEducationData(
  rawData: Array<Record<string, any>>,
  locale: 'sr' | 'en' = 'sr'
): Array<Record<string, any>> {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  // Auto-detect column names (support both Serbian and English)
  const yearColumn = detectColumn(rawData[0], [
    'School Year', 'Školska godina', 'školska godina',
    'Year', 'Godina', 'godina'
  ]);

  const levelColumn = detectColumn(rawData[0], [
    'Level of Education', 'Nivo obrazovanja', 'nivo obrazovanja',
    'Education Level', 'Obrazovni nivo', 'Level', 'Nivo'
  ]);

  const studentsColumn = detectColumn(rawData[0], [
    'Number of Students', 'Broj učenika', 'broj učenika',
    'Students', 'Učenici', 'učenici', 'Broj studenata', 'broj studenata'
  ]);

  if (!yearColumn || !levelColumn || !studentsColumn) {
    console.error('Could not detect required columns for education data');
    console.error('Available columns:', Object.keys(rawData[0]));
    // Return raw data as fallback
    return rawData.slice(0, 20);
  }

  // Group data by year and education level
  const groupedData: Record<string, Record<string, number>> = {};

  rawData.forEach(row => {
    const year = String(row[yearColumn] || '').trim();
    const level = String(row[levelColumn] || '').trim().toLowerCase();
    const students = parseFloat(String(row[studentsColumn])) || 0;

    if (!year || !level) return;

    if (!groupedData[year]) {
      groupedData[year] = {};
    }

    // Normalize education level names
    const normalizedLevel = normalizeEducationLevel(level, locale);
    groupedData[year][normalizedLevel] = (groupedData[year][normalizedLevel] || 0) + students;
  });

  // Convert to array format for charts
  const transformedData = Object.entries(groupedData).map(([year, levels]) => ({
    year,
    ...levels
  }));

  // Sort by year
  transformedData.sort((a, b) => a.year.localeCompare(b.year));

  return transformedData;
}

/**
 * Normalize education level names to consistent format
 */
function normalizeEducationLevel(level: string, locale: 'sr' | 'en'): string {
  const normalized = level.toLowerCase();

  // Elementary/Primary education
  if (normalized.includes('osnov') || normalized.includes('elementary') ||
      normalized.includes('primary') || normalized.includes('basic')) {
    return locale === 'sr' ? 'osnovno' : 'elementary';
  }

  // Secondary education
  if (normalized.includes('sredn') || normalized.includes('secondary') ||
      normalized.includes('high school') || normalized.includes('gimnazij')) {
    return locale === 'sr' ? 'srednje' : 'secondary';
  }

  // Higher/University education
  if (normalized.includes('vis') || normalized.includes('univers') ||
      normalized.includes('higher') || normalized.includes('fakultet') ||
      normalized.includes('college')) {
    return locale === 'sr' ? 'visoko' : 'higher';
  }

  // Return normalized (lowercased) if no match
  return normalized;
}

/**
 * Simple format: year as xKey, students as yKey
 * Use this when you want a simple column chart without grouping by education level
 *
 * Output:
 * [
 *   { year: "2020/2021", students: 1050000 },
 *   { year: "2021/2022", students: 1048000 },
 *   ...
 * ]
 */
export function transformEducationDataSimple(
  rawData: Array<Record<string, any>>
): Array<{ year: string; students: number }> {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  const yearColumn = detectColumn(rawData[0], [
    'School Year', 'Školska godina', 'Year', 'Godina'
  ]);

  const studentsColumn = detectColumn(rawData[0], [
    'Number of Students', 'Broj učenika', 'Students', 'Učenici',
    'Total Students', 'Ukupno učenika'
  ]);

  if (!yearColumn || !studentsColumn) {
    console.error('Could not detect required columns');
    return [];
  }

  // Group by year and sum all students
  const yearTotals: Record<string, number> = {};

  rawData.forEach(row => {
    const year = String(row[yearColumn] || '').trim();
    const students = parseFloat(String(row[studentsColumn])) || 0;

    if (!year) return;

    if (!yearTotals[year]) {
      yearTotals[year] = 0;
    }
    yearTotals[year] += students;
  });

  // Convert to array
  const result = Object.entries(yearTotals).map(([year, students]) => ({
    year,
    students
  }));

  // Sort by year
  result.sort((a, b) => a.year.localeCompare(b.year));

  return result;
}

/**
 * Transform data for education level comparison (current year only)
 * Good for pie charts or bar charts showing distribution
 *
 * Output:
 * [
 *   { level: "osnovno", students: 500000 },
 *   { level: "srednje", students: 300000 },
 *   { level: "visoko", students: 250000 }
 * ]
 */
export function transformEducationLevelDistribution(
  rawData: Array<Record<string, any>>,
  targetYear?: string,
  locale: 'sr' | 'en' = 'sr'
): Array<{ level: string; students: number }> {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  const yearColumn = detectColumn(rawData[0], [
    'School Year', 'Školska godina', 'Year', 'Godina'
  ]);

  const levelColumn = detectColumn(rawData[0], [
    'Level of Education', 'Nivo obrazovanja', 'Education Level'
  ]);

  const studentsColumn = detectColumn(rawData[0], [
    'Number of Students', 'Broj učenika', 'Students', 'Učenici'
  ]);

  if (!levelColumn || !studentsColumn) {
    console.error('Could not detect required columns');
    return [];
  }

  // Filter by target year if specified
  let filteredData = rawData;
  if (targetYear && yearColumn) {
    filteredData = rawData.filter(row =>
      String(row[yearColumn]).includes(targetYear)
    );
  }

  // If no year filter or no matches, use most recent year
  if (filteredData.length === 0 && yearColumn) {
    // Find most recent year
    const years = [...new Set(rawData.map(row => String(row[yearColumn])))];
    years.sort((a, b) => b.localeCompare(a));
    const mostRecentYear = years[0];
    filteredData = rawData.filter(row =>
      String(row[yearColumn]) === mostRecentYear
    );
  }

  // Group by level
  const levelTotals: Record<string, number> = {};

  filteredData.forEach(row => {
    const level = String(row[levelColumn] || '').trim();
    const students = parseFloat(String(row[studentsColumn])) || 0;

    if (!level) return;

    const normalizedLevel = normalizeEducationLevel(level, locale);

    if (!levelTotals[normalizedLevel]) {
      levelTotals[normalizedLevel] = 0;
    }
    levelTotals[normalizedLevel] += students;
  });

  // Convert to array
  const result = Object.entries(levelTotals).map(([level, students]) => ({
    level,
    students
  }));

  // Sort by student count descending
  result.sort((a, b) => b.students - a.students);

  return result;
}

/**
 * Detect which column name exists in the data
 * Returns the first matching column name or null
 */
function detectColumn(row: Record<string, any>, possibleNames: string[]): string | null {
  const columns = Object.keys(row);
  const lowerColumns = columns.map(col => col.toLowerCase());

  for (const name of possibleNames) {
    const lowerName = name.toLowerCase();
    // Try exact match first
    for (let i = 0; i < lowerColumns.length; i++) {
      if (lowerColumns[i] === lowerName) {
        return columns[i];
      }
    }
    // Then try partial match
    for (let i = 0; i < lowerColumns.length; i++) {
      if (lowerColumns[i].includes(lowerName)) {
        return columns[i];
      }
    }
  }

  return null;
}

/**
 * Generic transformer for budget/finance data
 * Expected columns: Year/Godina, Category/Kategorija, Amount/Iznos
 */
export function transformBudgetData(
  rawData: Array<Record<string, any>>,
  locale: 'sr' | 'en' = 'sr'
): Array<Record<string, any>> {
  if (!rawData || rawData.length === 0) {
    return [];
  }

  const yearColumn = detectColumn(rawData[0], [
    'Year', 'Godina', 'godina', 'Fiscal Year', 'Fiskalna godina'
  ]);

  const categoryColumn = detectColumn(rawData[0], [
    'Category', 'Kategorija', 'kategorija', 'Ministry', 'Ministarstvo',
    'Budget Category', 'Budžetska kategorija'
  ]);

  const amountColumn = detectColumn(rawData[0], [
    'Amount', 'Iznos', 'iznos', 'Budget', 'Budžet', 'budžet',
    'Allocated', 'Alocirano', 'Value', 'Vrednost'
  ]);

  if (!yearColumn || !categoryColumn || !amountColumn) {
    console.error('Could not detect required columns for budget data');
    return rawData.slice(0, 20);
  }

  // Similar grouping logic as education data
  const groupedData: Record<string, Record<string, number>> = {};

  rawData.forEach(row => {
    const year = String(row[yearColumn] || '').trim();
    const category = String(row[categoryColumn] || '').trim();
    const amount = parseFloat(String(row[amountColumn])) || 0;

    if (!year || !category) return;

    if (!groupedData[year]) {
      groupedData[year] = {};
    }

    groupedData[year][category] = (groupedData[year][category] || 0) + amount;
  });

  const transformedData = Object.entries(groupedData).map(([year, categories]) => ({
    year,
    ...categories
  }));

  transformedData.sort((a, b) => a.year.localeCompare(b.year));

  return transformedData;
}
