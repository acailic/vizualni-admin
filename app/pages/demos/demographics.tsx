/**
 * Serbian Demographics Visualization
 * Population pyramid and trends showing demographic challenges
 */

import { useRouter } from 'next/router';
import { Box, Paper, Typography, Alert, Grid, Card, CardContent, Chip, Divider } from '@mui/material';
import { DemoLayout } from '@/components/demos/demo-layout';
import { PopulationPyramid } from '@/components/demos/charts/PopulationPyramid';
import { PopulationTrends } from '@/components/demos/charts/PopulationTrends';
import {
  agePopulationData,
  populationTrends,
  demographicStats,
  regionalPopulation,
  dependencyRatios
} from '@/data/serbia-demographics';

export default function DemographicsDemo() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  // Calculate total population from age pyramid
  const totalMale = agePopulationData.reduce((sum, age) => sum + age.male, 0);
  const totalFemale = agePopulationData.reduce((sum, age) => sum + age.female, 0);
  const totalPopulation = (totalMale + totalFemale) * 1000; // Convert from thousands

  // Calculate demographic indicators
  const population2024 = populationTrends[14]; // 2024 is at index 14
  const populationChange2024to2050 = populationTrends[populationTrends.length - 1].total -
                                     population2024.total;
  const percentageChange = ((populationChange2024to2050 /
                            population2024.total) * 100).toFixed(1);

  const title = locale === 'sr'
    ? '👥 Demografija Srbije - Piramida starosti i trendovi'
    : '👥 Serbia Demographics - Age Pyramid and Trends';

  const description = locale === 'sr'
    ? 'Analiza strukture stanovništva Srbije po starosti i polu, sa projekcijama do 2050. godine'
    : 'Analysis of Serbia\'s population structure by age and gender, with projections to 2050';

  return (
    <DemoLayout
      title={title}
      description={description}
      datasetInfo={{
        title: locale === 'sr'
          ? 'Statistika stanovništva Republike Srbije'
          : 'Population Statistics of the Republic of Serbia',
        organization: locale === 'sr'
          ? 'Republički zavod za statistiku'
          : 'Statistical Office of the Republic of Serbia',
        updatedAt: '2024'
      }}
    >
      <Box>
        {/* Critical Demographic Warning */}
        <Alert
          severity="warning"
          sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
        >
          {locale === 'sr' ? (
            <>
              <strong>⚠️ DEMOGRAFSKO UPOZORENJE:</strong> Stanovništvo Srbije se smanjuje.
              Projekcije pokazuju pad od <strong>{Math.abs(parseFloat(percentageChange))}%</strong> do 2050. godine
              (sa {population2024.total.toFixed(2)}M na{' '}
              {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
              Medijana starosti je <strong>{demographicStats.medianAge} godina</strong>.
            </>
          ) : (
            <>
              <strong>⚠️ DEMOGRAPHIC WARNING:</strong> Serbia's population is declining.
              Projections show a decrease of <strong>{Math.abs(parseFloat(percentageChange))}%</strong> by 2050
              (from {population2024.total.toFixed(2)}M to{' '}
              {populationTrends[populationTrends.length - 1].total.toFixed(2)}M).
              Median age is <strong>{demographicStats.medianAge} years</strong>.
            </>
          )}
        </Alert>

        {/* Key Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Total Population */}
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'primary.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Ukupno stanovništvo (2024)' : 'Total Population (2024)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {(totalPopulation / 1000000).toFixed(2)}M
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? `Muški: ${((totalMale * 1000 / totalPopulation) * 100).toFixed(1)}% • Ženski: ${((totalFemale * 1000 / totalPopulation) * 100).toFixed(1)}%`
                    : `Male: ${((totalMale * 1000 / totalPopulation) * 100).toFixed(1)}% • Female: ${((totalFemale * 1000 / totalPopulation) * 100).toFixed(1)}%`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Population Change */}
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'error.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Promena do 2050' : 'Change by 2050'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.main' }}>
                  {percentageChange}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? `Pad od ~${Math.abs(populationChange2024to2050).toFixed(2)}M ljudi`
                    : `Decrease of ~${Math.abs(populationChange2024to2050).toFixed(2)}M people`
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Median Age */}
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'warning.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Medijana starosti' : 'Median Age'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {demographicStats.medianAge}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'godina' : 'years'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Dependency Ratio */}
          <Grid item xs={12} md={6} lg={3}>
            <Card
              sx={{
                height: '100%',
                borderLeft: 4,
                borderColor: 'info.main'
              }}
            >
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Racio zavisnosti starih' : 'Elderly Dependency Ratio'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {dependencyRatios.elderly}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
                    ? '65+ na 100 radno-sposobnih'
                    : '65+ per 100 working-age'
                  }
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Population Pyramid */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Piramida starosti stanovništva (2024)'
              : 'Population Age Pyramid (2024)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Distribucija stanovništva po starosti i polu pokazuje starenje populacije sa značajno manje mladih u odnosu na starije generacije.'
              : 'Population distribution by age and gender shows an aging population with significantly fewer young people compared to older generations.'
            }
          </Typography>
          <PopulationPyramid
            data={agePopulationData}
            title=""
            width={900}
            height={650}
          />
        </Paper>

        {/* Population Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Trendovi stanovništva (1950-2050)'
              : 'Population Trends (1950-2050)'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Istorijski podaci pokazuju konstantan rast do 2000-ih godina, nakon čega sledi period stagnacije i pada. Projekcije ukazuju na nastavak negativnog trenda.'
              : 'Historical data shows constant growth until the 2000s, followed by a period of stagnation and decline. Projections indicate continuation of the negative trend.'
            }
          </Typography>
          <PopulationTrends
            data={populationTrends}
            title=""
            width={950}
            height={550}
          />
        </Paper>

        {/* Regional Distribution */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Regionalna distribucija stanovništva (2024)'
              : 'Regional Population Distribution (2024)'
            }
          </Typography>
          <Grid container spacing={2}>
            {regionalPopulation.map((region) => (
              <Grid item xs={12} sm={6} md={3} key={region.region}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {locale === 'sr' ? region.region : region.regionEn}
                    </Typography>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
                      {(region.population / 1000).toFixed(2)}M
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {((region.population / (totalPopulation / 1000)) * 100).toFixed(1)}% {locale === 'sr' ? 'ukupnog stanovništva' : 'of total population'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Demographic Challenges */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? 'Ključni demografski izazovi'
              : 'Key Demographic Challenges'
            }
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={locale === 'sr' ? 'Negativna stopa rasta' : 'Negative growth rate'}
                  color="error"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `Stopa rasta: ${demographicStats.populationGrowthRate}% godišnje`
                    : `Growth rate: ${demographicStats.populationGrowthRate}% annually`
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={locale === 'sr' ? 'Niska stopa nataliteta' : 'Low birth rate'}
                  color="error"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `Natalitet: ${demographicStats.birthRate} na 1,000 stanovnika`
                    : `Birth rate: ${demographicStats.birthRate} per 1,000 population`
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={locale === 'sr' ? 'Visoka stopa mortaliteta' : 'High death rate'}
                  color="warning"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `Mortalitet: ${demographicStats.deathRate} na 1,000 stanovnika`
                    : `Death rate: ${demographicStats.deathRate} per 1,000 population`
                  }
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={locale === 'sr' ? 'Starenje stanovništva' : 'Aging population'}
                  color="warning"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `Visok racio starih: ${dependencyRatios.elderly} (65+ na 100 radno-sposobnih)`
                    : `High elderly ratio: ${dependencyRatios.elderly} (65+ per 100 working-age)`
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={locale === 'sr' ? 'Očekivani životni vek' : 'Life expectancy'}
                  color="info"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `Muškarci: ${demographicStats.lifeExpectancyMale} god. • Žene: ${demographicStats.lifeExpectancyFemale} god.`
                    : `Males: ${demographicStats.lifeExpectancyMale} yrs • Females: ${demographicStats.lifeExpectancyFemale} yrs`
                  }
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip
                  label={locale === 'sr' ? 'Urbanizacija' : 'Urbanization'}
                  color="default"
                  sx={{ mr: 1, mb: 1 }}
                />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
                    ? `${demographicStats.urbanPopulation}% stanovništva živi u gradovima`
                    : `${demographicStats.urbanPopulation}% of population lives in urban areas`
                  }
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DemoLayout>
  );
}
