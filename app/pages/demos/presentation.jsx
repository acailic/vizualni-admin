import { Box, Button, Chip, Container, Grid, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { LineChart } from '@/components/demos/charts/LineChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import { internetAdoption, techIndustryGrowth } from '@/data/serbia-digital';
import { sectorComposition, tradeBalance } from '@/data/serbia-economy';
import { energyProduction, energyStats } from '@/data/serbia-energy';
const sectionOrder = ['hero', 'agenda', 'highlights', 'stories', 'cta'];
export default function PresentationDemo() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    const titles = {
        hero: locale === 'sr' ? 'Vizuelni Demo za Prezentacije' : 'Presentation-Ready Demo',
        heroDesc: locale === 'sr'
            ? 'Kurirana scena za pokazivanje vizualizacija otvorenih podataka uz slide navigaciju.'
            : 'A curated stage to showcase open data visualizations with slide-style navigation.',
        agenda: locale === 'sr' ? 'Agenda' : 'Agenda',
        highlights: locale === 'sr' ? 'Istaknuto' : 'Highlights',
        stories: locale === 'sr' ? 'Data priče' : 'Data Stories',
        cta: locale === 'sr' ? 'Poziv na akciju' : 'Call to Action'
    };
    const scrollToSection = useCallback((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, []);
    const agendaItems = locale === 'sr'
        ? ['Ko smo i šta smo izgradili', 'Ključni rezultati i trendovi', 'Priče iz podataka za diskusiju', 'Sledeći koraci i CTA']
        : ['What this demo delivers', 'Key results and trends', 'Data stories to discuss', 'Next steps and calls to action'];
    const highlightCards = [
        {
            label: locale === 'sr' ? 'Internet penetracija' : 'Internet penetration',
            value: `${internetAdoption[internetAdoption.length - 1].individuals}%`,
            detail: locale === 'sr' ? 'građana koristi internet' : 'of citizens online',
            tone: 'primary'
        },
        {
            label: locale === 'sr' ? 'IT izvoz' : 'IT exports',
            value: `€${techIndustryGrowth[techIndustryGrowth.length - 1].exports.toLocaleString()}M`,
            detail: locale === 'sr' ? 'rast IT industrije' : 'IT industry growth',
            tone: 'success'
        },
        {
            label: locale === 'sr' ? 'Zavisnost od uglja' : 'Coal dependency',
            value: `${energyStats.coalDependency2024}%`,
            detail: locale === 'sr' ? 'udar na energetsku tranziciju' : 'drag on transition',
            tone: 'warning'
        },
        {
            label: locale === 'sr' ? 'Izvoz vs. uvoz' : 'Exports vs imports',
            value: `${tradeBalance[tradeBalance.length - 1].exports} / ${tradeBalance[tradeBalance.length - 1].imports}`,
            detail: locale === 'sr' ? 'mld € 2023' : 'bn € 2023',
            tone: 'info'
        }
    ];
    const nextStepButtons = [
        {
            label: locale === 'sr' ? 'Pregledaj sve demo vizuale' : 'Browse all demos',
            href: '/demos'
        },
        {
            label: locale === 'sr' ? 'Kreiraj novu vizualizaciju' : 'Create a visualization',
            href: '/create'
        },
        {
            label: locale === 'sr' ? 'Podeli sa timom' : 'Share with team',
            href: '/demos/social-media-sharing'
        }
    ];
    return (<DemoLayout title={titles.hero} description={titles.heroDesc} datasetInfo={{
            title: locale === 'sr' ? 'Serbian Open Data – Kurirani set' : 'Serbian Open Data – Curated Set',
            organization: 'data.gov.rs',
            updatedAt: '2024'
        }} hideBackButton>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, py: 1, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', mb: 3 }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {sectionOrder.map((id) => (<Chip key={id} label={titles[id]} onClick={() => scrollToSection(id)} color={id === 'hero' ? 'primary' : 'default'} sx={{ fontWeight: 600 }}/>))}
          </Stack>
        </Container>
      </Box>

      <Box id="hero" sx={{ mb: 6, borderRadius: 4, overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #312e81 100%)', color: 'white', position: 'relative' }}>
        <Box sx={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 30%), radial-gradient(circle at 80% 0%, rgba(16,185,129,0.25), transparent 25%)' }}/>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center" sx={{ py: 6 }}>
            <Grid item xs={12} md={7}>
              <Typography variant="caption" sx={{ letterSpacing: 2, color: 'rgba(255,255,255,0.7)' }}>
                {locale === 'sr' ? 'Live demo za sastanke' : 'Live demo for meetings'}
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.1 }}>
                {locale === 'sr' ? 'Interaktivna prezentacija otvorenih podataka' : 'Interactive open data presentation'}
              </Typography>
              <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255,255,255,0.85)' }}>
                {locale === 'sr'
            ? 'Hero, agenda, istaknuti rezultati, priče iz podataka i CTA – spremno za projekciju ili deljenje ekrana.'
            : 'Hero, agenda, highlights, data stories, and CTA – ready to project or screen-share.'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button variant="contained" color="secondary" onClick={() => scrollToSection('agenda')} sx={{ fontWeight: 700 }}>
                  {locale === 'sr' ? 'Počni prezentaciju' : 'Start presenting'}
                </Button>
                <Button variant="outlined" color="inherit" onClick={() => scrollToSection('stories')} sx={{ fontWeight: 700 }}>
                  {locale === 'sr' ? 'Skoči na vizualizacije' : 'Jump to visuals'}
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <Stack spacing={2}>
                  {highlightCards.map((card) => (<Box key={card.label} sx={{
                p: 2.5,
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)'
            }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {card.label}
                          </Typography>
                          <Typography variant="h5" sx={{ fontWeight: 800, color: 'white' }}>
                            {card.value}
                          </Typography>
                        </Box>
                        <Chip label={card.detail} color={card.tone} size="small" sx={{ color: 'white', backgroundColor: 'rgba(255,255,255,0.12)' }}/>
                      </Stack>
                    </Box>))}
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Box id="agenda" sx={{ mb: 6 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between" sx={{ pb: 2 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {titles.agenda}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={locale === 'sr' ? 'Live ready' : 'Live ready'} color="primary"/>
              <Chip label={locale === 'sr' ? 'Responsive' : 'Responsive'} color="secondary"/>
              <Chip label="Static export"/>
            </Stack>
          </Stack>
          <Grid container spacing={3}>
            {agendaItems.map((item) => (<Grid item xs={12} md={6} key={item}>
                <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', backgroundColor: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale === 'sr'
                ? 'Kratak talking-point za slajd, sa podrškom za live skrol do narednog poglavlja.'
                : 'Short talking point with live scroll to the next chapter.'}
                  </Typography>
                </Box>
              </Grid>))}
          </Grid>
        </Container>
      </Box>

      <Box id="highlights" sx={{ mb: 6, background: 'linear-gradient(135deg, #eef2ff 0%, #f5fdf9 100%)', py: 5 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {titles.highlights}
            </Typography>
            <Button variant="contained" onClick={() => scrollToSection('stories')} sx={{ fontWeight: 700 }}>
              {locale === 'sr' ? 'Otvori priče iz podataka' : 'Open data stories'}
            </Button>
          </Stack>
          <Grid container spacing={3}>
            {highlightCards.map((card) => (<Grid item xs={12} sm={6} md={3} key={card.label}>
                <Box sx={{ p: 3, borderRadius: 3, background: 'white', border: '1px solid', borderColor: 'rgba(0,0,0,0.06)', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                  <Typography variant="caption" color="text.secondary">
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.detail}
                  </Typography>
                </Box>
              </Grid>))}
          </Grid>
        </Container>
      </Box>

      <Box id="stories" sx={{ mb: 6 }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {titles.stories}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              <Chip label={locale === 'sr' ? 'Interaktivno' : 'Interactive'} color="primary"/>
              <Chip label="D3" color="secondary"/>
              <Chip label="Responsive"/>
            </Stack>
          </Stack>

          <Box sx={{ mb: 4, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <Stack spacing={2} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {locale === 'sr' ? 'Digitalni rast (2006–2023)' : 'Digital growth (2006–2023)'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === 'sr'
            ? 'Skok internet penetracije i IT izvoza – podloga za priču o digitalnoj transformaciji.'
            : 'Internet penetration and IT export surge – backbone story for digital transformation.'}
              </Typography>
            </Stack>
            <Box sx={{ height: { xs: 320, md: 420 } }}>
              <LineChart data={internetAdoption.map((d) => ({
            year: d.year.toString(),
            Individuals: d.individuals,
            Households: d.households
        }))} xKey="year" yKey="Individuals" xLabel={locale === 'sr' ? 'Godina' : 'Year'} yLabel="%" width={900} height={380} color="#4f46e5"/>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {locale === 'sr' ? 'Sektorska struktura BDP' : 'GDP by sector'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale === 'sr'
            ? 'Servisi vode 51% BDP; industrija i poljoprivreda i dalje nose značajan deo.'
            : 'Services lead with 51% of GDP; industry and agriculture remain significant.'}
                  </Typography>
                </Stack>
                <ColumnChart data={sectorComposition.map((s) => ({ sector: s.sector, percentage: s.percentage }))} xKey="sector" yKey="percentage" xLabel={locale === 'sr' ? 'Sektor' : 'Sector'} yLabel="%" width={600} height={360}/>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {locale === 'sr' ? 'Trgovinski balans' : 'Trade balance'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {locale === 'sr'
            ? 'Izvoz raste, ali uvoz i dalje veći – okvir za diskusiju o konkurentnosti.'
            : 'Exports rise, imports higher – frame the competitiveness discussion.'}
                  </Typography>
                </Stack>
                <ColumnChart data={tradeBalance.map((t) => ({ year: t.year.toString(), exports: t.exports, imports: t.imports }))} xKey="year" yKey="exports" xLabel={locale === 'sr' ? 'Godina' : 'Year'} yLabel={locale === 'sr' ? 'Izvoz (mld €)' : 'Exports (bn €)'} width={600} height={360} colors={['#0ea5e9']}/>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 3, borderRadius: 3, border: '1px solid', borderColor: 'grey.200', backgroundColor: 'white', boxShadow: '0 10px 25px rgba(0,0,0,0.05)' }}>
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {locale === 'sr' ? 'Energetska zavisnost (2015–2024)' : 'Energy dependency (2015–2024)'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {locale === 'sr'
            ? 'Vizuelni dokaz oslanjanja na ugalj i uvoz – istakni rizik i potrebu za tranzicijom.'
            : 'Visual proof of coal reliance and imports – highlight risk and need for transition.'}
              </Typography>
            </Stack>
            <LineChart data={energyProduction.map((e) => ({
            year: e.year.toString(),
            Coal: e.coal,
            Hydropower: e.hydropower,
            SolarWind: e.solarWind
        }))} xKey="year" yKey="Coal" xLabel={locale === 'sr' ? 'Godina' : 'Year'} yLabel="%" width={900} height={380} color="#f97316"/>
          </Box>
        </Container>
      </Box>

      <Box id="cta" sx={{ mb: 6, background: 'linear-gradient(135deg, #111827 0%, #0f172a 50%, #0b1224 100%)', color: 'white', borderRadius: 4, overflow: 'hidden' }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {locale === 'sr' ? 'Spremno za prezentaciju' : 'Ready to present'}
              </Typography>
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.8)', mb: 3 }}>
                {locale === 'sr'
            ? 'Otvorite /demos/presentation u full-screen režimu, pratite agendu i koristite CTA dugmiće za sledeće korake.'
            : 'Open /demos/presentation in full screen, follow the agenda, and use CTA buttons to move next.'}
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {nextStepButtons.map((btn) => (<Link key={btn.href} href={btn.href} passHref legacyBehavior>
                    <Button component="a" variant={btn.href === '/demos' ? 'contained' : 'outlined'} color="secondary" sx={{ fontWeight: 700 }}>
                      {btn.label}
                    </Button>
                  </Link>))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700 }}>
                    {locale === 'sr' ? 'Uputstvo za prezentera' : 'Presenter notes'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                    {locale === 'sr'
            ? 'Koristi strelice ili klik na čipove za skok na sekciju. Svaka vizualizacija je interaktivna (hover).'
            : 'Use arrow keys or chips to jump between sections. Each visualization is interactive (hover).'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)' }}>
                    {locale === 'sr'
            ? 'Za hybrid sastanke: podeli ekran u 16:9, uključi tamni mod projektora.'
            : 'For hybrid meetings: screen-share at 16:9, use dark projector mode.'}
                  </Typography>
                </Stack>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </DemoLayout>);
}
export async function getStaticProps() {
    return {
        props: {}
    };
}
