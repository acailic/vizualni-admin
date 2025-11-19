/**
 * Healthcare Crisis Visualization
 * Alarming data about waiting lists, capacity issues, and healthcare worker exodus
 */

import { Alert, Box, Card, CardContent, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { LineChart } from '@/components/demos/charts/LineChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import {
  healthcareStats,
  healthcareWorkerExodus,
  healthIndicators,
  hospitalCapacity,
  waitingLists
} from '@/data/serbia-healthcare';

export default function HealthcareDemo() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  const title = locale === 'sr'
    ? '🚨 Zdravstvena kriza u Srbiji'
    : '🚨 Healthcare Crisis in Serbia';

  const description = locale === 'sr'
    ? 'Alarmantni podaci o listama čekanja, kapacitetima bolnica i odlivu zdravstvenih radnika'
    : 'Alarming data on waiting lists, hospital capacity, and healthcare worker exodus';

  // Calculate worst waiting times
  const longestWait = waitingLists.reduce((max, item) =>
    item.averageWaitDays > max.averageWaitDays ? item : max
  );

  return (
    <DemoLayout
      title={title}
      description={description}
      datasetInfo={{
        title: locale === 'sr'
          ? 'Statistika zdravstvenog sistema Republike Srbije'
          : 'Healthcare System Statistics of the Republic of Serbia',
        organization: locale === 'sr'
          ? 'Republički zavod za statistiku i Ministarstvo zdravlja'
          : 'Statistical Office and Ministry of Health',
        updatedAt: '2024'
      }}
    >
      <Box>
        {/* Critical Warning Banner */}
        <Alert
          severity="error"
          sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}
        >
          {locale === 'sr' ? (
            <>
              <strong>⚠️ ZDRAVSTVENA KRIZA:</strong> Preko <strong>{healthcareStats.totalPatientsWaiting.toLocaleString()}</strong> pacijenata
              čeka na medicinske procedure. Prosečno vreme čekanja je <strong>{healthcareStats.averageWaitTimeAllProcedures} dana</strong>.
              Za {longestWait.procedure.toLowerCase()} pacijenti čekaju do <strong>{longestWait.averageWaitDays} dana</strong>
              ({(longestWait.averageWaitDays / longestWait.recommendedMaxDays).toFixed(1)}x duže od preporučenog).
            </>
          ) : (
            <>
              <strong>⚠️ HEALTHCARE CRISIS:</strong> Over <strong>{healthcareStats.totalPatientsWaiting.toLocaleString()}</strong> patients
              waiting for medical procedures. Average wait time is <strong>{healthcareStats.averageWaitTimeAllProcedures} days</strong>.
              For {longestWait.procedureEn.toLowerCase()}, patients wait up to <strong>{longestWait.averageWaitDays} days</strong>
              ({(longestWait.averageWaitDays / longestWait.recommendedMaxDays).toFixed(1)}x longer than recommended).
            </>
          )}
        </Alert>

        {/* Key Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.main' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Ukupno na listi čekanja' : 'Total on waiting lists'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.main' }}>
                  {healthcareStats.totalPatientsWaiting.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'pacijenata čeka na procedure' : 'patients waiting for procedures'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'warning.main' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Prosečno vreme čekanja' : 'Average waiting time'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {healthcareStats.averageWaitTimeAllProcedures}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'dana (~7 meseci)' : 'days (~7 months)'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.dark' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Zdravstveni radnici otišli (2024)' : 'Healthcare workers left (2024)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.dark' }}>
                  {healthcareStats.workersLeftLastYear.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'lekara i sestara' : 'doctors and nurses'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'warning.dark' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  {locale === 'sr' ? 'Smanjenje kapaciteta (2015-2024)' : 'Capacity reduction (2015-2024)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  -{healthcareStats.bedReduction2015to2024.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'bolničkih kreveta' : 'hospital beds'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Waiting Lists Visualization */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '⏰ Liste čekanja za medicinske procedure'
              : '⏰ Waiting Lists for Medical Procedures'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Uporedba stvarnog vremena čekanja sa preporučenim maksimumom. Crvena linija pokazuje kritičnu granicu.'
              : 'Comparison of actual waiting times with recommended maximum. Red line shows critical threshold.'
            }
          </Typography>

          {/* Waiting time bars with progress indicators */}
          <Box sx={{ mb: 4 }}>
            {waitingLists.map((item, index) => {
              const exceedanceRatio = item.averageWaitDays / item.recommendedMaxDays;
              const isCritical = exceedanceRatio > 2;

              return (
                <Box key={index} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" fontWeight={600}>
                      {locale === 'sr' ? item.procedure : item.procedureEn}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {item.patientsWaiting.toLocaleString()} {locale === 'sr' ? 'pacijenata' : 'patients'}
                      </Typography>
                      {isCritical && <Chip label="KRITIČNO" size="small" color="error" />}
                    </Box>
                  </Box>

                  <Box sx={{ position: 'relative' }}>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min((exceedanceRatio / 4) * 100, 100)}
                      sx={{
                        height: 28,
                        borderRadius: 1,
                        backgroundColor: 'success.lighter',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: isCritical ? 'error.main' : 'warning.main',
                          borderRadius: 1
                        }
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        left: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontWeight: 700,
                        color: exceedanceRatio > 0.5 ? 'white' : 'text.primary'
                      }}
                    >
                      {item.averageWaitDays} {locale === 'sr' ? 'dana' : 'days'}
                      {' '}({exceedanceRatio.toFixed(1)}x {locale === 'sr' ? 'duže' : 'longer'})
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        fontWeight: 600,
                        color: 'success.dark'
                      }}
                    >
                      {locale === 'sr' ? 'Max' : 'Max'}: {item.recommendedMaxDays} {locale === 'sr' ? 'dana' : 'days'}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Paper>

        {/* Healthcare Worker Exodus */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🌍 Odliv zdravstvenih radnika - "Brain Drain"'
              : '🌍 Healthcare Worker Exodus - Brain Drain'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Broj lekara i medicinskih sestara koji su napustili Srbiju po godinama. Trend je alarmantno rastući.'
              : 'Number of doctors and nurses who left Serbia by year. The trend is alarmingly increasing.'
            }
          </Typography>

          <LineChart
            data={healthcareWorkerExodus.map(item => ({
              label: item.year.toString(),
              value: item.totalLeft,
              category: locale === 'sr' ? 'Ukupno' : 'Total'
            }))}
            title=""
            width={900}
            height={400}
          />

          <Alert severity="error" sx={{ mt: 3 }}>
            <strong>{locale === 'sr' ? 'KRITIČAN TREND:' : 'CRITICAL TREND:'}</strong>{' '}
            {locale === 'sr'
              ? `Od 2015. godine, ${healthcareStats.totalWorkersLeft2015to2024.toLocaleString()} zdravstvenih radnika je napustilo Srbiju.
                 Samo 2024. godine otišlo je ${healthcareStats.workersLeftLastYear.toLocaleString()} radnika.`
              : `Since 2015, ${healthcareStats.totalWorkersLeft2015to2024.toLocaleString()} healthcare workers have left Serbia.
                 In 2024 alone, ${healthcareStats.workersLeftLastYear.toLocaleString()} workers left.`
            }
          </Alert>
        </Paper>

        {/* Hospital Capacity Decline */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '🏥 Pad kapaciteta bolničkih ustanova'
              : '🏥 Declining Hospital Capacity'
            }
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
              ? 'Smanjenje broja kreveta i povećanje opterećenja po lekaru i sestri.'
              : 'Reduction in number of beds and increasing workload per doctor and nurse.'
            }
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {locale === 'sr' ? 'Bolnički kreveti' : 'Hospital beds'}
                </Typography>
                <LineChart
                  data={hospitalCapacity.map(item => ({
                    label: item.year.toString(),
                    value: item.totalBeds,
                    category: locale === 'sr' ? 'Kreveti' : 'Beds'
                  }))}
                  title=""
                  width={450}
                  height={300}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  {locale === 'sr' ? 'Pacijenti po lekaru' : 'Patients per doctor'}
                </Typography>
                <LineChart
                  data={hospitalCapacity.map(item => ({
                    label: item.year.toString(),
                    value: item.patientsPerDoctor,
                    category: locale === 'sr' ? 'Pacijenti/Lekar' : 'Patients/Doctor'
                  }))}
                  title=""
                  width={450}
                  height={300}
                />
              </Box>
            </Grid>
          </Grid>

          <Alert severity="warning" sx={{ mt: 2 }}>
            {locale === 'sr'
              ? `Broj pacijenata po lekaru je porastao za ${healthcareStats.patientsPerDoctorIncrease}
                 (sa ${hospitalCapacity[0].patientsPerDoctor} na ${hospitalCapacity[hospitalCapacity.length - 1].patientsPerDoctor}),
                 dok je zauzetost kreveta porasla na alarmantnih ${healthcareStats.currentOccupancyRate}%.`
              : `The number of patients per doctor increased by ${healthcareStats.patientsPerDoctorIncrease}
                 (from ${hospitalCapacity[0].patientsPerDoctor} to ${hospitalCapacity[hospitalCapacity.length - 1].patientsPerDoctor}),
                 while bed occupancy rose to an alarming ${healthcareStats.currentOccupancyRate}%.`
            }
          </Alert>
        </Paper>

        {/* Health Indicators Comparison */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
              ? '📊 Zdravstveni indikatori - Poređenje sa EU'
              : '📊 Health Indicators - EU Comparison'
            }
          </Typography>

          <Grid container spacing={2}>
            {healthIndicators.map((indicator, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {locale === 'sr' ? indicator.indicator : indicator.indicatorEn}
                      </Typography>
                      <Chip
                        label={
                          indicator.trend === 'worsening'
                            ? (locale === 'sr' ? 'Pogoršanje' : 'Worsening')
                            : indicator.trend === 'improving'
                            ? (locale === 'sr' ? 'Poboljšanje' : 'Improving')
                            : (locale === 'sr' ? 'Stabilno' : 'Stable')
                        }
                        size="small"
                        color={
                          indicator.trend === 'worsening'
                            ? 'error'
                            : indicator.trend === 'improving'
                            ? 'success'
                            : 'default'
                        }
                      />
                    </Box>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
                      {indicator.value} <Typography component="span" variant="body2">{indicator.unit}</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {locale === 'sr' ? indicator.comparison : indicator.comparisonEn}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Alert severity="info" sx={{ mt: 3 }}>
            {locale === 'sr'
              ? `Većina zdravstvenih indikatora pokazuje zabrinjavajuće zaostajanje za EU prosekom,
                 posebno u broju lekara i medicinskih sestara po stanovništvu.`
              : `Most health indicators show concerning lag behind EU average,
                 especially in the number of doctors and nurses per population.`
            }
          </Alert>
        </Paper>
      </Box>
    </DemoLayout>
  );
}

/**
 * Static generation for GitHub Pages
 */
export async function getStaticProps() {
  return {
    props: {}
  };
}
