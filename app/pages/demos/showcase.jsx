/**
 * Curated demo showcase with multiple visualization types.
 * Uses existing chart components and sample datasets to highlight capabilities.
 */
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { ColumnChart, LineChart, PieChart } from '@/components/demos/charts';
import { DemoLayout } from '@/components/demos/demo-layout';
import { showcaseDigitalSkills, showcaseEnergyMix, showcaseRegionalGrowth, showcaseRidershipTrend } from '@/data/demo-showcase';
export default function DemoShowcasePage() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    const text = {
        title: locale === 'sr' ? 'Demo Showcase vizualizacija' : 'Demo Showcase Visualizations',
        description: locale === 'sr'
            ? 'Brzo pogledajte kako izgledaju razliciti tipovi grafikona sa reprezentativnim podacima.'
            : 'A quick look at multiple chart types using representative datasets.',
        hero: locale === 'sr'
            ? 'Snop najtrazenijih pokazatelja iz ekonomije, saobracaja, energetike i digitalizacije.'
            : 'A bundle of high-signal indicators across economy, mobility, energy, and digitalization.',
        cta: locale === 'sr' ? 'Pogledajte sve demo stranice' : 'Browse all demo pages',
        economyTitle: locale === 'sr' ? 'Regionalni rast BDP-a' : 'Regional GDP Growth',
        economyDesc: locale === 'sr'
            ? 'Uporedni rast BDP-a po regionima (godina-na-godinu).'
            : 'Year-over-year GDP growth by region.',
        transportTitle: locale === 'sr' ? 'Kretanje javnog prevoza' : 'Public Transport Momentum',
        transportDesc: locale === 'sr'
            ? 'Broj voznji u milionima – pad tokom 2020, stabilan oporavak nakon toga.'
            : 'Trips in millions – COVID dip in 2020, then a steady recovery.',
        energyTitle: locale === 'sr' ? 'Energetski miks' : 'Energy Mix Snapshot',
        energyDesc: locale === 'sr'
            ? 'Udeo proizvodnje elektricne energije po izvoru.'
            : 'Share of electricity generation by source.',
        digitalTitle: locale === 'sr' ? 'Digitalne vestine' : 'Digital Skills Gap',
        digitalDesc: locale === 'sr'
            ? 'Udeo stanovnistva sa bar osnovnim digitalnim vestinama.'
            : 'Share of population with at least basic digital skills.'
    };
    return (<DemoLayout title={text.title} description={text.description} datasetInfo={{
            title: 'Pokazatelji za showcase',
            organization: 'Primer dataset',
            updatedAt: '2024-12-31'
        }}>
      {/* Hero */}
      <Card sx={{
            mb: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #22d3ee 100%)',
            color: 'white',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.4)'
        }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.2 }}>
              {text.hero}
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ mb: 3, gap: 1.5 }}>
              <Chip label={locale === 'sr' ? 'Ekonomski puls' : 'Economic pulse'} color="primary"/>
              <Chip label={locale === 'sr' ? 'Mobilnost' : 'Mobility'} sx={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}/>
              <Chip label={locale === 'sr' ? 'Energetika' : 'Energy'} sx={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}/>
              <Chip label={locale === 'sr' ? 'Digitalizacija' : 'Digital'} sx={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}/>
            </Stack>
            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 640 }}>
              {locale === 'sr'
            ? 'Set vizualno uskladjenih grafikona sa naglasenim porukama: rast i padovi, struktura izvora i jaz u vestinama.'
            : 'A visually coherent set of charts spotlighting momentum, drops, source mix, and the skills gap.'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Grid container spacing={2}>
              {[
            { labelSr: 'BDP YoY: +4.3%', labelEn: 'GDP YoY: +4.3%', hintSr: 'Beograd vodi', hintEn: 'Belgrade leads' },
            { labelSr: 'Voznje 2023: 171M', labelEn: 'Trips 2023: 171M', hintSr: 'Stalan oporavak', hintEn: 'Steady recovery' },
            { labelSr: 'Ugalj u miksu: 64%', labelEn: 'Coal share: 64%', hintSr: 'Hitna diverzifikacija', hintEn: 'Needs diversification' }
        ].map((item, idx) => (<Grid item xs={6} sm={4} md={12} key={idx}>
                  <Card elevation={0} sx={{
                height: '100%',
                p: 2,
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)'
            }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {locale === 'sr' ? item.labelSr : item.labelEn}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {locale === 'sr' ? item.hintSr : item.hintEn}
                    </Typography>
                  </Card>
                </Grid>))}
            </Grid>
          </Grid>
        </Grid>
      </Card>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Economy */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 14px 40px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.economyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.economyDesc}
              </Typography>
              <Box sx={{ overflowX: 'auto', pb: 1 }}>
                <ColumnChart data={showcaseRegionalGrowth} xKey="region" yKey="growth" width={760} height={360} xLabel={locale === 'sr' ? 'Region' : 'Region'} yLabel={locale === 'sr' ? 'Rast (%)' : 'Growth (%)'}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Transport */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 14px 40px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.transportTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.transportDesc}
              </Typography>
              <Box sx={{ overflowX: 'auto', pb: 1 }}>
                <LineChart data={showcaseRidershipTrend} xKey="year" yKey="trips" width={760} height={360} xLabel={locale === 'sr' ? 'Godina' : 'Year'} yLabel={locale === 'sr' ? 'Miliona voznji' : 'Million trips'} color="#0ea5e9"/>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Energy mix */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 14px 40px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.energyTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.energyDesc}
              </Typography>
              <Box sx={{ overflowX: 'auto', pb: 1 }}>
                <PieChart data={showcaseEnergyMix} labelKey="source" valueKey="share" width={540} height={420}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Digital skills */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 14px 40px rgba(0,0,0,0.08)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                {text.digitalTitle}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {text.digitalDesc}
              </Typography>
              <Box sx={{ overflowX: 'auto', pb: 1 }}>
                <ColumnChart data={showcaseDigitalSkills} xKey="segment" yKey="share" width={760} height={360} xLabel={locale === 'sr' ? 'Segment' : 'Segment'} yLabel={locale === 'sr' ? 'Udeo (%)' : 'Share (%)'} colors={["#22c55e"]}/>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CTA */}
      <Card sx={{
            mt: 4,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(105deg, rgba(14,165,233,0.1), rgba(34,197,94,0.08))'
        }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" spacing={2} justifyContent="space-between">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {locale === 'sr' ? 'Zelite vise?' : 'Want more?'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locale === 'sr'
            ? 'Pogledajte celu galeriju sa vecim brojem kategorija i zivih podataka.'
            : 'Visit the full gallery for more categories and live data pulls.'}
            </Typography>
          </Box>
          <Box component="a" href="/demos" style={{
            textDecoration: 'none',
            padding: '10px 16px',
            borderRadius: '12px',
            border: '1px solid #0ea5e9',
            color: '#0e7490',
            fontWeight: 600
        }}>
            {text.cta}
          </Box>
        </Stack>
      </Card>
    </DemoLayout>);
}
/**
 * Static export friendly.
 */
export async function getStaticProps() {
    return {
        props: {}
    };
}
