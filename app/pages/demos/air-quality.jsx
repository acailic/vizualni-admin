/**
 * Enhanced Air Quality Visualization
 * Showcases the shocking air pollution levels in Serbian cities
 * with multiple visualizations and health warnings
 */
import { Alert, Box, Card, CardContent, Grid, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { DemoEmpty, DemoError, DemoLayout, DemoLoading } from '@/components/demos/demo-layout';
import { useDataGovRs } from '@/hooks/use-data-gov-rs';
// WHO Air Quality Guidelines (μg/m³)
const WHO_LIMITS = {
    PM25: {
        daily: 15,
        annual: 5,
        name: 'PM2.5',
        description: 'Fine particulate matter (most dangerous)'
    },
    PM10: {
        daily: 45,
        annual: 15,
        name: 'PM10',
        description: 'Respirable particulate matter'
    },
    NO2: {
        daily: 25,
        annual: 10,
        name: 'NO₂',
        description: 'Nitrogen dioxide'
    },
    SO2: {
        daily: 40,
        name: 'SO₂',
        description: 'Sulfur dioxide'
    },
    O3: {
        peak: 60,
        name: 'O₃',
        description: 'Ozone'
    }
};
export default function AirQualityDemo() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    // Fetch air quality data
    const { dataset, resource, data, loading, error, refetch } = useDataGovRs({
        searchQuery: 'kvalitet vazduha',
        autoFetch: true
    });
    // Process and analyze data
    const analysis = useMemo(() => {
        if (!data || !Array.isArray(data) || data.length === 0) {
            return null;
        }
        const readings = data;
        // Find PM2.5, PM10, and other pollutant columns
        const sampleRow = readings[0];
        const keys = Object.keys(sampleRow);
        // Auto-detect pollutant columns
        const pm25Key = keys.find(k => k.toLowerCase().includes('pm2.5') ||
            k.toLowerCase().includes('pm25') ||
            k.toLowerCase().includes('pm_25'));
        const pm10Key = keys.find(k => k.toLowerCase().includes('pm10') ||
            k.toLowerCase().includes('pm_10'));
        const no2Key = keys.find(k => k.toLowerCase().includes('no2'));
        const so2Key = keys.find(k => k.toLowerCase().includes('so2'));
        const o3Key = keys.find(k => k.toLowerCase().includes('o3'));
        // Extract numeric values
        const getNumericValue = (row, key) => {
            if (!key || !row[key])
                return null;
            const val = parseFloat(row[key]);
            return isNaN(val) ? null : val;
        };
        // Calculate statistics
        const pm25Values = readings.map(r => getNumericValue(r, pm25Key)).filter(v => v !== null);
        const pm10Values = readings.map(r => getNumericValue(r, pm10Key)).filter(v => v !== null);
        const avgPM25 = pm25Values.length > 0
            ? pm25Values.reduce((a, b) => a + b, 0) / pm25Values.length
            : null;
        const avgPM10 = pm10Values.length > 0
            ? pm10Values.reduce((a, b) => a + b, 0) / pm10Values.length
            : null;
        const maxPM25 = pm25Values.length > 0 ? Math.max(...pm25Values) : null;
        const maxPM10 = pm10Values.length > 0 ? Math.max(...pm10Values) : null;
        // Calculate exceedance
        const pm25Exceedance = avgPM25 ? ((avgPM25 / WHO_LIMITS.PM25.daily) * 100).toFixed(0) : null;
        const pm10Exceedance = avgPM10 ? ((avgPM10 / WHO_LIMITS.PM10.daily) * 100).toFixed(0) : null;
        // Days above limit
        const daysAboveLimitPM25 = pm25Values.filter(v => v > WHO_LIMITS.PM25.daily).length;
        const daysAboveLimitPM10 = pm10Values.filter(v => v > WHO_LIMITS.PM10.daily).length;
        return {
            pm25Key,
            pm10Key,
            no2Key,
            so2Key,
            o3Key,
            avgPM25,
            avgPM10,
            maxPM25,
            maxPM10,
            pm25Exceedance,
            pm10Exceedance,
            daysAboveLimitPM25,
            daysAboveLimitPM10,
            totalDays: readings.length,
            readings
        };
    }, [data]);
    const title = locale === 'sr'
        ? '🚨 Kvalitet vazduha u Srbiji - Šokantni podaci'
        : '🚨 Air Quality in Serbia - Shocking Data';
    const description = locale === 'sr'
        ? 'Istraživanje nivoa zagađenja vazduha koji direktno utiču na zdravlje građana Srbije'
        : 'Investigation of air pollution levels directly affecting the health of Serbian citizens';
    return (<DemoLayout title={title} description={description} datasetInfo={dataset
            ? {
                title: dataset.title,
                organization: dataset.organization.title || dataset.organization.name,
                updatedAt: dataset.updated_at
            }
            : undefined}>
      {/* Loading State */}
      {loading && <DemoLoading message="Učitavanje podataka o zagađenju vazduha..."/>}

      {/* Error State */}
      {error && <DemoError error={error} onRetry={refetch}/>}

      {/* Main Content */}
      {!loading && !error && analysis && (<Box>
          {/* Critical Warning Banner */}
          {analysis.avgPM25 && analysis.avgPM25 > WHO_LIMITS.PM25.daily && (<Alert severity="error" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}>
              <strong>⚠️ ZDRAVSTVENO UPOZORENJE:</strong> Prosečan nivo PM2.5 čestica je{' '}
              <strong>{analysis.pm25Exceedance}% iznad</strong> sigurne granice Svetske zdravstvene organizacije (WHO).
              Ovo predstavlja ozbiljan rizik po zdravlje, posebno za decu, starije osobe i osobe sa respiratornim problemima.
            </Alert>)}

          {/* Key Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* PM2.5 Average */}
            {analysis.avgPM25 !== null && (<Grid item xs={12} md={6} lg={3}>
                <Card sx={{
                    height: '100%',
                    borderLeft: 4,
                    borderColor: analysis.avgPM25 > WHO_LIMITS.PM25.daily ? 'error.main' : 'warning.main'
                }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Prosečan PM2.5
                    </Typography>
                    <Typography variant="h3" sx={{ my: 1, fontWeight: 700 }}>
                      {analysis.avgPM25.toFixed(1)}
                      <Typography component="span" variant="h6" color="text.secondary">
                        {' μg/m³'}
                      </Typography>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {analysis.avgPM25 > WHO_LIMITS.PM25.daily ? (<>
                          <span>🔴</span>
                          <Typography variant="body2" color="error.main">
                            {analysis.pm25Exceedance}% iznad WHO granice
                          </Typography>
                        </>) : (<>
                          <span>✅</span>
                          <Typography variant="body2" color="success.main">
                            U granicama normale
                          </Typography>
                        </>)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>)}

            {/* PM10 Average */}
            {analysis.avgPM10 !== null && (<Grid item xs={12} md={6} lg={3}>
                <Card sx={{
                    height: '100%',
                    borderLeft: 4,
                    borderColor: analysis.avgPM10 > WHO_LIMITS.PM10.daily ? 'error.main' : 'warning.main'
                }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Prosečan PM10
                    </Typography>
                    <Typography variant="h3" sx={{ my: 1, fontWeight: 700 }}>
                      {analysis.avgPM10.toFixed(1)}
                      <Typography component="span" variant="h6" color="text.secondary">
                        {' μg/m³'}
                      </Typography>
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {analysis.avgPM10 > WHO_LIMITS.PM10.daily ? (<>
                          <span>⚠️</span>
                          <Typography variant="body2" color="warning.main">
                            {analysis.pm10Exceedance}% iznad WHO granice
                          </Typography>
                        </>) : (<>
                          <span>✅</span>
                          <Typography variant="body2" color="success.main">
                            U granicama normale
                          </Typography>
                        </>)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>)}

            {/* Days Above Limit */}
            <Grid item xs={12} md={6} lg={3}>
              <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.main' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Dana iznad granice
                  </Typography>
                  <Typography variant="h3" sx={{ my: 1, fontWeight: 700 }}>
                    {analysis.daysAboveLimitPM25}
                    <Typography component="span" variant="h6" color="text.secondary">
                      {' / ' + analysis.totalDays}
                    </Typography>
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    {((analysis.daysAboveLimitPM25 / analysis.totalDays) * 100).toFixed(0)}% dana sa opasnim nivoom
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Max Reading */}
            {analysis.maxPM25 !== null && (<Grid item xs={12} md={6} lg={3}>
                <Card sx={{ height: '100%', borderLeft: 4, borderColor: 'error.dark' }}>
                  <CardContent>
                    <Typography variant="caption" color="text.secondary">
                      Maksimalan PM2.5
                    </Typography>
                    <Typography variant="h3" sx={{ my: 1, fontWeight: 700, color: 'error.main' }}>
                      {analysis.maxPM25.toFixed(1)}
                    </Typography>
                    <Typography variant="body2" color="error.dark">
                      {((analysis.maxPM25 / WHO_LIMITS.PM25.daily) * 100).toFixed(0)}x WHO granica
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>)}
          </Grid>

          {/* Timeline Chart */}
          {analysis.pm25Key && analysis.readings.length > 0 && (<Paper sx={{ p: 4, mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                📈 Vremenska serija zagađenja PM2.5
              </Typography>

              <Box sx={{ position: 'relative' }}>
                <PollutionTimelineChart data={analysis.readings} pollutantKey={analysis.pm25Key} limit={WHO_LIMITS.PM25.daily} limitLabel="WHO granica (15 μg/m³)"/>
              </Box>

              <Alert severity="info" sx={{ mt: 3 }}>
                <strong>Šta je PM2.5?</strong> Fine čestice prečnika manjeg od 2.5 mikrona koje prodiru duboko
                u pluća i krvotok. Prema WHO, dugotrajno izlaganje PM2.5 česticama uzrokuje bolesti srca,
                moždani udar, rak pluća i hronične respiratorne bolesti.
              </Alert>
            </Paper>)}

          {/* Comparison with WHO Guidelines */}
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              ⚖️ Poređenje sa WHO graničnim vrednostima
            </Typography>

            <Grid container spacing={3}>
              {analysis.avgPM25 && (<Grid item xs={12} md={6}>
                  <WHOComparisonBar pollutant="PM2.5" value={analysis.avgPM25} limit={WHO_LIMITS.PM25.daily} unit="μg/m³" description="Najopasnije čestice za zdravlje"/>
                </Grid>)}
              {analysis.avgPM10 && (<Grid item xs={12} md={6}>
                  <WHOComparisonBar pollutant="PM10" value={analysis.avgPM10} limit={WHO_LIMITS.PM10.daily} unit="μg/m³" description="Udisljive čestice prašine"/>
                </Grid>)}
            </Grid>
          </Paper>

          {/* Health Impact Warning */}
          <Paper sx={{ p: 4, mb: 4, backgroundColor: 'error.lighter' }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'error.dark' }}>
              ⚠️ Zdravstveni uticaj zagađenog vazduha
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>Kratkoročni efekti:</strong>
                </Typography>
                <ul style={{ marginTop: 0 }}>
                  <li>Iritacija očiju, nosa i grla</li>
                  <li>Pogoršanje astme i alergija</li>
                  <li>Otežano disanje</li>
                  <li>Povećan rizik od srčanih problema</li>
                </ul>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" paragraph>
                  <strong>Dugoročni efekti:</strong>
                </Typography>
                <ul style={{ marginTop: 0 }}>
                  <li>Hronične bolesti pluća (COPD)</li>
                  <li>Rak pluća</li>
                  <li>Bolesti srca i krvnih sudova</li>
                  <li>Smanjenje očekivanog životnog veka</li>
                </ul>
              </Grid>
            </Grid>

            <Alert severity="warning" sx={{ mt: 3 }}>
              <strong>Posebno ranjive grupe:</strong> Deca, starije osobe, trudnice, i osobe sa
              respiratornim i kardiovaskularnim oboljenjima su pod najvećim rizikom.
            </Alert>
          </Paper>

          {/* Dataset Information */}
          {dataset && (<Paper sx={{ p: 3, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                📊 O podacima
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Dataset:</strong> {dataset.title}
              </Typography>
              {dataset.description && (<Typography variant="body2" paragraph>
                  <strong>Opis:</strong> {dataset.description}
                </Typography>)}
              <Typography variant="body2">
                <strong>Izvor:</strong> {dataset.organization.title || dataset.organization.name} |
                <strong> Format:</strong> {(resource === null || resource === void 0 ? void 0 : resource.format) || 'N/A'} |
                <strong> Ažurirano:</strong> {new Date(dataset.updated_at).toLocaleDateString('sr-RS')}
              </Typography>
            </Paper>)}
        </Box>)}

      {/* Empty State */}
      {!loading && !error && !analysis && (<DemoEmpty message="Podaci o kvalitetu vazduha nisu dostupni. Molimo pokušajte kasnije."/>)}
    </DemoLayout>);
}
/**
 * Timeline chart component for pollution data
 */
function PollutionTimelineChart({ data, pollutantKey, limit, limitLabel }) {
    const chartData = useMemo(() => {
        return data.slice(0, 100).map((reading, index) => {
            const value = parseFloat(reading[pollutantKey]);
            return {
                index,
                value: isNaN(value) ? 0 : value,
                label: reading.date || reading.time || `#${index + 1}`
            };
        }).filter(d => d.value > 0);
    }, [data, pollutantKey]);
    const maxValue = Math.max(...chartData.map(d => d.value), limit * 2);
    const width = 1000;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    // Calculate points
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1)) * chartWidth;
        const y = chartHeight - (d.value / maxValue) * chartHeight;
        return { x, y, ...d };
    });
    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const limitY = chartHeight - (limit / maxValue) * chartHeight;
    return (<svg width={width} height={height} style={{ maxWidth: '100%', height: 'auto' }}>
      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = chartHeight * (1 - ratio);
            return (<g key={i}>
              <line x1={0} y1={y} x2={chartWidth} y2={y} stroke="#e0e0e0" strokeDasharray="4 4"/>
              <text x={-10} y={y} textAnchor="end" alignmentBaseline="middle" fontSize="12" fill="#666">
                {(maxValue * ratio).toFixed(0)}
              </text>
            </g>);
        })}

        {/* WHO Limit Line */}
        <line x1={0} y1={limitY} x2={chartWidth} y2={limitY} stroke="#d32f2f" strokeWidth={2} strokeDasharray="8 4"/>
        <text x={chartWidth - 5} y={limitY - 8} textAnchor="end" fontSize="12" fill="#d32f2f" fontWeight="bold">
          {limitLabel}
        </text>

        {/* Danger zone (above limit) */}
        <rect x={0} y={0} width={chartWidth} height={limitY} fill="#d32f2f" opacity={0.05}/>

        {/* Area under curve */}
        {points.length > 0 && (<path d={`${pathD} L ${points[points.length - 1].x} ${chartHeight} L 0 ${chartHeight} Z`} fill="#1976d2" opacity={0.1}/>)}

        {/* Line */}
        <path d={pathD} fill="none" stroke="#1976d2" strokeWidth={3}/>

        {/* Points */}
        {points.map((p, i) => (<circle key={i} cx={p.x} cy={p.y} r={p.value > limit ? 5 : 3} fill={p.value > limit ? '#d32f2f' : '#1976d2'}/>))}

        {/* Axes */}
        <line x1={0} y1={0} x2={0} y2={chartHeight} stroke="#999" strokeWidth={2}/>
        <line x1={0} y1={chartHeight} x2={chartWidth} y2={chartHeight} stroke="#999" strokeWidth={2}/>

        {/* Axis labels */}
        <text x={-45} y={chartHeight / 2} fontSize="14" fill="#666" transform={`rotate(-90, -45, ${chartHeight / 2})`} textAnchor="middle">
          μg/m³
        </text>
        <text x={chartWidth / 2} y={chartHeight + 45} fontSize="14" fill="#666" textAnchor="middle">
          Vremenska serija merenja
        </text>
      </g>
    </svg>);
}
/**
 * WHO Comparison Bar Chart
 */
function WHOComparisonBar({ pollutant, value, limit, unit, description }) {
    const percentage = (value / limit) * 100;
    const exceedsLimit = value > limit;
    return (<Box>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {pollutant}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      <Box sx={{ position: 'relative', height: 60 }}>
        {/* WHO Limit Bar (baseline) */}
        <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: 25,
            width: '100%',
            backgroundColor: 'success.lighter',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 2
        }}>
          <Typography variant="caption" fontWeight="bold" color="success.dark">
            WHO granica: {limit} {unit}
          </Typography>
        </Box>

        {/* Actual Value Bar */}
        <Box sx={{
            position: 'absolute',
            top: 35,
            left: 0,
            height: 25,
            width: `${Math.min(percentage, 300)}%`,
            backgroundColor: exceedsLimit ? 'error.main' : 'success.main',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: 2,
            boxShadow: 2
        }}>
          <Typography variant="caption" fontWeight="bold" color="white">
            {value.toFixed(1)} {unit} ({percentage.toFixed(0)}%)
          </Typography>
        </Box>
      </Box>

      {exceedsLimit && (<Alert severity="error" sx={{ mt: 2 }}>
          <strong>{((value / limit - 1) * 100).toFixed(0)}% iznad</strong> bezbedne granice!
        </Alert>)}
    </Box>);
}
/**
 * Static generation for GitHub Pages
 */
export async function getStaticProps() {
    return {
        props: {}
    };
}
