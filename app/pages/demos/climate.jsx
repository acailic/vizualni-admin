/**
 * Serbian Climate Impact Visualization
 * Temperature trends, extreme weather events, and environmental data
 */
import { Alert, Box, Card, CardContent, Chip, Grid, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { LineChart } from '@/components/demos/charts/LineChart';
import { PieChart } from '@/components/demos/charts/PieChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import { airQualityTrends, climateStats, emissionsBySector, extremeWeatherEvents, forestationTrends, precipitationTrends, renewableEnergyTrends, temperatureTrends } from '@/data/serbia-climate';
export default function ClimateDemo() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    // Calculate statistics
    const latestTemp = temperatureTrends[temperatureTrends.length - 1];
    const earliestTemp = temperatureTrends[0];
    const tempIncrease = (latestTemp.avgTemp - earliestTemp.avgTemp).toFixed(1);
    const totalCasualties = extremeWeatherEvents.reduce((sum, e) => sum + (e.casualties || 0), 0);
    const totalDamage = extremeWeatherEvents.reduce((sum, e) => sum + (e.economicDamage || 0), 0);
    const latestRenewable = renewableEnergyTrends[renewableEnergyTrends.length - 1];
    const earliestRenewable = renewableEnergyTrends[0];
    const title = locale === 'sr'
        ? '🌍 Klimatske promene u Srbiji - Temperature i ekstremni događaji'
        : '🌍 Climate Change in Serbia - Temperature and Extreme Events';
    const description = locale === 'sr'
        ? 'Analiza klimatskih promena kroz porast temperatura, ekstremne vremenske pojave, kvalitet vazduha i prelazak na obnovljive izvore energije'
        : 'Analysis of climate change through temperature rise, extreme weather events, air quality, and transition to renewable energy';
    return (<DemoLayout title={title} description={description} datasetInfo={{
            title: locale === 'sr'
                ? 'Klimatski i ekološki podaci Republike Srbije'
                : 'Climate and Environmental Data of the Republic of Serbia',
            organization: locale === 'sr'
                ? 'Republički hidrometeorološki zavod, Agencija za zaštitu životne sredine'
                : 'Republic Hydrometeorological Service, Environmental Protection Agency',
            updatedAt: '2024'
        }}>
      <Box>
        {/* Climate Crisis Alert */}
        <Alert severity="error" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}>
          {locale === 'sr' ? (<>
              <strong>🚨 KLIMATSKO UPOZORENJE:</strong> Temperatura u Srbiji je porasla za{' '}
              <strong>{tempIncrease}°C</strong> od 1990. godine. Broj ekstremnih vremenskih događaja
              se povećao <strong>{climateStats.extremeEventIncrease}%</strong>. Od 1990. zabeleženo je{' '}
              {totalCasualties} žrtava i preko €{(totalDamage / 1000).toFixed(1)} milijardi štete.
            </>) : (<>
              <strong>🚨 CLIMATE WARNING:</strong> Temperature in Serbia increased by{' '}
              <strong>{tempIncrease}°C</strong> since 1990. Extreme weather events increased by{' '}
              <strong>{climateStats.extremeEventIncrease}%</strong>. Since 1990, recorded{' '}
              {totalCasualties} casualties and over €{(totalDamage / 1000).toFixed(1)}B in damages.
            </>)}
        </Alert>

        {/* Key Climate Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: 'error.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Porast temperature' : 'Temperature Rise'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'error.main' }}>
                  +{climateStats.avgTempIncrease}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'od 1990. godine' : 'since 1990'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: 'warning.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Ekstremni događaji (2023)' : 'Extreme Events (2023)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'warning.main' }}>
                  {latestTemp.extremeEvents}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'toplotni talasi, poplave, suše' : 'heatwaves, floods, droughts'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: 'success.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Obnovljiva energija' : 'Renewable Energy'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1, color: 'success.main' }}>
                  {latestRenewable.total.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'ukupne proizvodnje' : 'of total production'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: 'info.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'CO₂ emisije' : 'CO₂ Emissions'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {climateStats.co2Emissions}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'tona po glavi stanovnika' : 'tons per capita'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Temperature Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Trendovi temperature i temperaturna anomalija (1990-2023)'
            : 'Temperature Trends and Anomaly (1990-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Prosečna godišnja temperatura pokazuje jasan trend zagrevanja. Anomalija predstavlja odstupanje od proseka 1961-1990. Poslednjih godina beleže se rekordne temperature.'
            : 'Average annual temperature shows clear warming trend. Anomaly represents deviation from 1961-1990 baseline. Recent years record highest temperatures.'}
          </Typography>
          <Box sx={{ height: 500 }}>
            <LineChart data={temperatureTrends.map(d => ({
            year: d.year.toString(),
            'Temperature': d.avgTemp,
            'Anomaly': d.anomaly,
        }))} xKey="year" yKey="value" width={950} height={500} multiSeries={true}/>
          </Box>
        </Paper>

        {/* Extreme Weather Events Over Time */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Broj ekstremnih vremenskih događaja (1990-2023)'
            : 'Number of Extreme Weather Events (1990-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Dramatično povećanje broja ekstremnih vremenskih događaja: toplotni talasi, poplave, suše i oluje. 2022. i 2023. su rekordne godine.'
            : 'Dramatic increase in extreme weather events: heatwaves, floods, droughts, and storms. 2022 and 2023 are record years.'}
          </Typography>
          <Box sx={{ height: 450 }}>
            <ColumnChart data={temperatureTrends.map(d => ({
            year: d.year.toString(),
            'Events': d.extremeEvents || 0,
        }))} xKey="year" yKey="Events" width={950} height={450}/>
          </Box>
        </Paper>

        {/* Notable Extreme Events */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Najznačajniji ekstremni događaji'
            : 'Most Significant Extreme Events'}
          </Typography>
          <Grid container spacing={2}>
            {extremeWeatherEvents.map((event, idx) => (<Grid item xs={12} md={6} key={idx}>
                <Card variant="outlined" sx={{
                borderLeft: 4,
                borderColor: event.severity === 'Extreme' ? 'error.main' :
                    event.severity === 'Severe' ? 'warning.main' : 'info.main'
            }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {event.month} {event.year}
                      </Typography>
                      <Chip label={event.type} size="small" color={event.type === 'Heatwave' ? 'error' :
                event.type === 'Flood' ? 'primary' :
                    event.type === 'Drought' ? 'warning' : 'default'}/>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {event.impact}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      {event.casualties && event.casualties > 0 && (<Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                          ☠️ {event.casualties} {locale === 'sr' ? 'žrtava' : 'casualties'}
                        </Typography>)}
                      {event.economicDamage && (<Typography variant="caption" color="text.secondary">
                          💶 €{event.economicDamage}M {locale === 'sr' ? 'štete' : 'damage'}
                        </Typography>)}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>))}
          </Grid>
        </Paper>

        {/* Precipitation Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Trendovi padavina i meseci suše (2000-2023)'
            : 'Precipitation Trends and Drought Months (2000-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Povećana varijabilnost padavina - periode ekstremno vlažnih godina smenjuju teške suše. 2012. i 2022. su bile godine najteže suše.'
            : 'Increased precipitation variability - periods of extremely wet years alternate with severe droughts. 2012 and 2022 were years of severe drought.'}
          </Typography>
          <Box sx={{ height: 450 }}>
            <ColumnChart data={precipitationTrends.map(d => ({
            year: d.year.toString(),
            'Precipitation': d.annual,
            'Drought Months': d.droughtMonths * 40, // Scale for visibility
        }))} xKey="year" yKey="value" width={950} height={450}/>
          </Box>
        </Paper>

        {/* Air Quality Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Trendovi kvaliteta vazduha (2010-2023)'
            : 'Air Quality Trends (2010-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'PM2.5 i PM10 čestice su glavni zagađivači. Nakon poboljšanja 2020. (COVID lockdown), nivoi su ponovo porasli. Prosečno preko 140 dana godišnje prekoračuju WHO limite.'
            : 'PM2.5 and PM10 particles are main pollutants. After improvement in 2020 (COVID lockdown), levels increased again. Average over 140 days/year exceed WHO limits.'}
          </Typography>
          <Box sx={{ height: 450 }}>
            <LineChart data={airQualityTrends.map(d => ({
            year: d.year.toString(),
            'PM2.5': d.pm25,
            'PM10': d.pm10,
        }))} xKey="year" yKey="value" width={950} height={450} multiSeries={true}/>
          </Box>
        </Paper>

        {/* Renewable Energy Transition */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Prelazak na obnovljive izvore energije (2010-2023)'
            : 'Renewable Energy Transition (2010-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Vetar i solarni paneli rastu najbrže. Ukupan udeo obnovljivih izvora dostigao 38.7% u 2023. Hidro energija i dalje dominira.'
            : 'Wind and solar growing fastest. Total renewable share reached 38.7% in 2023. Hydro power still dominates.'}
          </Typography>
          <Box sx={{ height: 500 }}>
            <LineChart data={renewableEnergyTrends.map(d => ({
            year: d.year.toString(),
            'Hydro': d.hydro,
            'Wind': d.wind,
            'Solar': d.solar,
            'Total': d.total,
        }))} xKey="year" yKey="value" width={950} height={500} multiSeries={true}/>
          </Box>
        </Paper>

        {/* CO2 Emissions by Sector */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {locale === 'sr'
            ? 'CO₂ emisije po sektorima (2023)'
            : 'CO₂ Emissions by Sector (2023)'}
              </Typography>
              <PieChart data={emissionsBySector.map(s => ({
            label: locale === 'sr' ? s.sector : s.sector,
            value: s.percentage
        }))} labelKey="label" valueKey="value" width={450} height={400}/>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {locale === 'sr'
            ? 'Pošumljavanje vs. krčenje šuma'
            : 'Reforestation vs. Deforestation'}
              </Typography>
              <ColumnChart data={forestationTrends.slice(-10).map(d => ({
            year: d.year.toString(),
            'Reforested': d.reforested,
            'Deforested': -d.deforested, // Negative for visual comparison
        }))} xKey="year" yKey="value" width={450} height={400}/>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {locale === 'sr'
            ? 'Pozitivne vrednosti od 2016. pokazuju uspešno pošumljavanje.'
            : 'Positive net values since 2016 show successful reforestation.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Climate Actions & Challenges */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Klimatski izazovi i potrebne akcije'
            : 'Climate Challenges and Required Actions'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="error.main" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === 'sr' ? '🚨 Urgentni izazovi' : '🚨 Urgent Challenges'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Zagađenje vazduha' : 'Air pollution'} color="error" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? 'Preko 140 dana godišnje prekoračeni WHO limiti'
            : 'Over 140 days/year exceed WHO limits'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Ekstremni toplotni talasi' : 'Extreme heatwaves'} color="error" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? '12 ekstremnih događaja u 2023, trend raste'
            : '12 extreme events in 2023, trend increasing'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Zavisnost od uglja' : 'Coal dependency'} color="warning" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? 'Preko 60% električne energije iz termoelektrana'
            : 'Over 60% of electricity from coal power plants'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === 'sr' ? '✅ Pozitivni trendovi' : '✅ Positive Trends'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Rast obnovljivih izvora' : 'Renewable growth'} color="success" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? `Obnovljivi izvori dostigli ${latestRenewable.total.toFixed(1)}% (2023)`
            : `Renewables reached ${latestRenewable.total.toFixed(1)}% (2023)`}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Uspešno pošumljavanje' : 'Successful reforestation'} color="success" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? 'Neto pozitivno pošumljavanje od 2016. godine'
            : 'Net positive reforestation since 2016'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Zaštićena područja' : 'Protected areas'} color="info" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? `${climateStats.protectedAreas}% teritorije pod zaštitom`
            : `${climateStats.protectedAreas}% of territory protected`}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DemoLayout>);
}
