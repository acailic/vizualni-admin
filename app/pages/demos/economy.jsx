/**
 * Serbian Economy Visualization
 * Economic indicators showing Serbia's economic journey
 */
import { Alert, Box, Card, CardContent, Chip, Grid, Paper, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { LineChart } from '@/components/demos/charts/LineChart';
import { PieChart } from '@/components/demos/charts/PieChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import { economicIndicators, economicStats, fdiInflows, sectorComposition, tradeBalance } from '@/data/serbia-economy';
export default function EconomyDemo() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    // Calculate recent trends
    const latestYear = economicIndicators[economicIndicators.length - 1];
    const previousYear = economicIndicators[economicIndicators.length - 2];
    const preCovidYear = economicIndicators.find(y => y.year === 2019);
    // Calculate average GDP growth (last 5 years excluding COVID)
    const avgGrowth = economicIndicators
        .slice(-6, -1)
        .filter(y => y.year !== 2020)
        .reduce((sum, y) => sum + y.gdpGrowth, 0) / 4;
    const title = locale === 'sr'
        ? '💰 Ekonomija Srbije - Ekonomski pokazatelji i trendovi'
        : '💰 Serbia Economy - Economic Indicators and Trends';
    const description = locale === 'sr'
        ? 'Analiza ekonomskog razvoja Srbije kroz ključne makroekonomske pokazatelje: BDP, inflaciju, nezaposlenost, spoljnu trgovinu i investicije'
        : 'Analysis of Serbia\'s economic development through key macroeconomic indicators: GDP, inflation, unemployment, foreign trade, and investment';
    return (<DemoLayout title={title} description={description} datasetInfo={{
            title: locale === 'sr'
                ? 'Ekonomska statistika Republike Srbije'
                : 'Economic Statistics of the Republic of Serbia',
            organization: locale === 'sr'
                ? 'Republički zavod za statistiku, Narodna banka Srbije'
                : 'Statistical Office of the Republic of Serbia, National Bank of Serbia',
            updatedAt: '2024'
        }}>
      <Box>
        {/* Economic Overview Alert */}
        <Alert severity="info" sx={{ mb: 4, fontSize: '1.1rem', fontWeight: 500 }}>
          {locale === 'sr' ? (<>
              <strong>📊 EKONOMSKI PREGLED:</strong> Srbija je prošla kroz značajnu ekonomsku transformaciju
              od 2000. godine. Prosečan rast BDP-a poslednjih 5 godina iznosi <strong>{avgGrowth.toFixed(1)}%</strong>.
              Nezaposlenost je smanjena sa 26% (2000) na <strong>{latestYear.unemployment.toFixed(1)}%</strong> ({latestYear.year}).
            </>) : (<>
              <strong>📊 ECONOMIC OVERVIEW:</strong> Serbia has undergone significant economic transformation
              since 2000. Average GDP growth in the last 5 years is <strong>{avgGrowth.toFixed(1)}%</strong>.
              Unemployment decreased from 26% (2000) to <strong>{latestYear.unemployment.toFixed(1)}%</strong> ({latestYear.year}).
            </>)}
        </Alert>

        {/* Key Economic Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: 'primary.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'BDP po glavi stanovnika' : 'GDP per Capita'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  ${economicStats.gdpPerCapita.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'USD (2023)' : 'USD (2023)'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: latestYear.gdpGrowth > 2 ? 'success.main' : 'warning.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Rast BDP-a (2023)' : 'GDP Growth (2023)'}
                </Typography>
                <Typography variant="h4" sx={{
            fontWeight: 700,
            my: 1,
            color: latestYear.gdpGrowth > 2 ? 'success.main' : 'warning.main'
        }}>
                  {latestYear.gdpGrowth > 0 ? '+' : ''}{latestYear.gdpGrowth.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'godišnji rast' : 'annual growth'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: latestYear.unemployment < 10 ? 'success.main' : 'warning.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Nezaposlenost (2023)' : 'Unemployment (2023)'}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, my: 1 }}>
                  {latestYear.unemployment.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr'
            ? `${(latestYear.unemployment - previousYear.unemployment).toFixed(1)}p.p. vs 2022`
            : `${(latestYear.unemployment - previousYear.unemployment).toFixed(1)}pp vs 2022`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={3}>
            <Card sx={{
            height: '100%',
            borderLeft: 4,
            borderColor: latestYear.inflation > 5 ? 'error.main' : 'success.main'
        }}>
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {locale === 'sr' ? 'Inflacija (2023)' : 'Inflation (2023)'}
                </Typography>
                <Typography variant="h4" sx={{
            fontWeight: 700,
            my: 1,
            color: latestYear.inflation > 5 ? 'error.main' : 'success.main'
        }}>
                  {latestYear.inflation.toFixed(1)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {locale === 'sr' ? 'godišnja stopa' : 'annual rate'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* GDP Growth Trends */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Rast BDP-a i ekonomski događaji (2000-2023)'
            : 'GDP Growth and Economic Events (2000-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Grafikon prikazuje volatilnost ekonomskog rasta Srbije, sa značajnim recesijama 2009 (svetska finansijska kriza), 2012 (kriza evrozone), 2014 (poplave) i 2020 (COVID-19).'
            : 'Chart shows Serbia\'s economic growth volatility, with significant recessions in 2009 (global financial crisis), 2012 (eurozone crisis), 2014 (floods), and 2020 (COVID-19).'}
          </Typography>
          <Box sx={{ height: 500 }}>
            <LineChart data={economicIndicators.map(d => ({
            year: d.year.toString(),
            'GDP Growth': d.gdpGrowth,
        }))} xKey="year" yKey="GDP Growth" width={950} height={500} showZeroLine={true}/>
          </Box>
          {/* Event annotations */}
          <Box sx={{ mt: 2 }}>
            {economicIndicators
            .filter(d => d.event)
            .slice(-8)
            .map(d => (<Chip key={d.year} label={`${d.year}: ${d.event}`} size="small" sx={{ mr: 1, mb: 1 }} color={d.gdpGrowth < 0 ? 'error' : 'primary'} variant="outlined"/>))}
          </Box>
        </Paper>

        {/* Unemployment vs Inflation */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Nezaposlenost i inflacija (2000-2023)'
            : 'Unemployment and Inflation (2000-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Nezaposlenost je kontinuirano opadala posle 2013. godine zahvaljujući reformama i stranim investicijama. Inflacija je uspešno kontrolisana nakon hiperinflacije 2000-2001.'
            : 'Unemployment has continuously declined after 2013 thanks to reforms and foreign investment. Inflation was successfully controlled after hyperinflation in 2000-2001.'}
          </Typography>
          <Box sx={{ height: 500 }}>
            <LineChart data={economicIndicators.map(d => ({
            year: d.year.toString(),
            'Unemployment': d.unemployment,
            'Inflation': d.inflation > 30 ? 30 : d.inflation, // Cap at 30 for readability
        }))} xKey="year" yKey="value" width={950} height={500} multiSeries={true}/>
          </Box>
        </Paper>

        {/* GDP by Sector */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {locale === 'sr'
            ? 'BDP po sektorima (2023)'
            : 'GDP by Sector (2023)'}
              </Typography>
              <PieChart data={sectorComposition.map(s => ({
            label: locale === 'sr' ? s.sector : s.sector,
            value: s.percentage
        }))} labelKey="label" valueKey="value" width={450} height={400}/>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
                {locale === 'sr'
            ? 'Godišnja promena po sektorima'
            : 'Year-over-Year Change by Sector'}
              </Typography>
              <ColumnChart data={sectorComposition.map(s => ({
            sector: s.sector,
            change: s.change
        }))} xKey="sector" yKey="change" width={450} height={400}/>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {locale === 'sr'
            ? 'Industrijski sektor pokazuje najjači rast, dok poljoprivreda beleži pad.'
            : 'Industrial sector shows strongest growth, while agriculture records decline.'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Foreign Trade */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Spoljna trgovina (2010-2023)'
            : 'Foreign Trade (2010-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'Izvoz i uvoz rastu, ali trgovinski deficit se povećava. Izvoz je dostigao €24.1 milijardi u 2023.'
            : 'Exports and imports are growing, but trade deficit is increasing. Exports reached €24.1 billion in 2023.'}
          </Typography>
          <Box sx={{ height: 500 }}>
            <ColumnChart data={tradeBalance.map(d => ({
            year: d.year.toString(),
            'Exports': d.exports,
            'Imports': d.imports,
        }))} xKey="year" yKey="value" width={950} height={500} stacked={false}/>
          </Box>
        </Paper>

        {/* Foreign Direct Investment */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Strane direktne investicije (2010-2023)'
            : 'Foreign Direct Investment (2010-2023)'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {locale === 'sr'
            ? 'SDI su dostigle rekordnih €4.6 milijardi u 2023. Glavni izvori: Kina, Južna Koreja, EU zemlje.'
            : 'FDI reached record €4.6 billion in 2023. Main sources: China, South Korea, EU countries.'}
          </Typography>
          <Box sx={{ height: 450 }}>
            <ColumnChart data={fdiInflows.map(d => ({
            year: d.year.toString(),
            'FDI': d.amount,
        }))} xKey="year" yKey="FDI" width={950} height={450}/>
          </Box>
        </Paper>

        {/* Economic Challenges & Opportunities */}
        <Paper elevation={2} sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {locale === 'sr'
            ? 'Ekonomski izazovi i prilike'
            : 'Economic Challenges and Opportunities'}
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="error.main" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === 'sr' ? '⚠️ Izazovi' : '⚠️ Challenges'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Trgovinski deficit' : 'Trade deficit'} color="error" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? `Deficit od €${Math.abs(tradeBalance[tradeBalance.length - 1].balance).toFixed(1)}M u 2023`
            : `Deficit of €${Math.abs(tradeBalance[tradeBalance.length - 1].balance).toFixed(1)}B in 2023`}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Javni dug' : 'Public debt'} color="warning" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? `${economicStats.publicDebt}% BDP-a`
            : `${economicStats.publicDebt}% of GDP`}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Siromaštvo' : 'Poverty'} color="error" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? `${economicStats.povertyRate}% stanovništva u riziku od siromaštva`
            : `${economicStats.povertyRate}% population at risk of poverty`}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
                {locale === 'sr' ? '✅ Prilike' : '✅ Opportunities'}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Snažan rast izvoza' : 'Strong export growth'} color="success" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? 'Izvoz rastao prosečno 10% godišnje (2015-2023)'
            : 'Exports grew average 10% annually (2015-2023)'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Rekordne SDI' : 'Record FDI'} color="success" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? 'Najveće strane investicije u istoriji Srbije'
            : 'Highest foreign investment in Serbia\'s history'}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Chip label={locale === 'sr' ? 'Pad nezaposlenosti' : 'Falling unemployment'} color="success" sx={{ mr: 1, mb: 1 }}/>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {locale === 'sr'
            ? 'Najniža nezaposlenost u poslednje 2 decenije'
            : 'Lowest unemployment in 2 decades'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </DemoLayout>);
}
