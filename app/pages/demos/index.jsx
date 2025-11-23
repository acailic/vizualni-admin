/**
 * Demo gallery page - showcases all available data.gov.rs demos
 */
import { Box, Button, Card, CardActionArea, CardContent, Chip, Grid, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { DemoLayout } from '@/components/demos/demo-layout';
import { DEMO_CONFIGS } from '@/lib/demos/config';
export default function DemosIndex() {
    const router = useRouter();
    const locale = (router.locale || 'sr');
    const pageTitle = locale === 'sr' ? 'Demo Vizualizacije' : 'Demo Visualizations';
    const pageDescription = locale === 'sr'
        ? 'Istražite različite vizualizacije otvorenih podataka iz Srbije'
        : 'Explore different visualizations of Serbian open data';
    return (<DemoLayout title={pageTitle} description={pageDescription} hideBackButton>
      {/* Intro Section - Enhanced */}
      <Box sx={{
            mb: 6,
            p: 5,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            color: 'white',
            boxShadow: '0 20px 60px rgba(102, 126, 234, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                opacity: 0.4,
                zIndex: 0
            }
        }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            {locale === 'sr'
            ? '📊 Galerija Demo Vizualizacija'
            : '📊 Demo Visualization Gallery'}
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', fontSize: '1.1rem', opacity: 0.95 }}>
            {locale === 'sr'
            ? 'Dobrodošli u galeriju demo vizualizacija podataka sa portala data.gov.rs. Svaki demo prikazuje različite načine vizualizacije otvorenih podataka iz Republike Srbije.'
            : 'Welcome to the demo visualization gallery using data from data.gov.rs. Each demo showcases different ways to visualize open data from the Republic of Serbia.'}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.9 }}>
            {locale === 'sr'
            ? 'Kliknite na bilo koji demo ispod da biste videli interaktivnu vizualizaciju sa realnim podacima.'
            : 'Click on any demo below to see an interactive visualization with real data.'}
          </Typography>
        </Box>
      </Box>

      {/* Showcase CTA */}
      <Box sx={{
            mb: 5,
            p: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'linear-gradient(115deg, rgba(14,165,233,0.08), rgba(124,58,237,0.06))',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2
        }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
            {locale === 'sr' ? 'Novi Demo Showcase' : 'New Demo Showcase'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {locale === 'sr'
            ? 'Kompaktan pregled najtraženijih grafika (ekonomija, transport, energetika, digitalizacija).'
            : 'A compact set of highlight charts across economy, transport, energy, and digitalization.'}
          </Typography>
        </Box>
        <Link href="/demos/showcase" passHref legacyBehavior>
          <Button component="a" variant="contained" color="primary" sx={{ textTransform: 'none', fontWeight: 700, px: 2.5 }}>
            {locale === 'sr' ? 'Otvori showcase' : 'Open showcase'}
          </Button>
        </Link>
      </Box>

      {/* Demo Cards Grid */}
      <Grid container spacing={3}>
        {Object.entries(DEMO_CONFIGS).map(([key, config]) => {
            const title = config.title[locale];
            const description = config.description[locale];
            return (<Grid item xs={12} sm={6} md={4} key={key}>
              <Link href={`/demos/${key}`} passHref legacyBehavior>
                <Card component="a" sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    position: 'relative',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(102, 126, 234, 0.25)'
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '5px',
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                    },
                    '&:hover::before': {
                        opacity: 1
                    }
                }}>
                  <CardActionArea sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'stretch',
                    justifyContent: 'flex-start'
                }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      {/* Icon with gradient background */}
                      <Box sx={{
                    fontSize: '3rem',
                    mb: 2,
                    textAlign: 'center',
                    p: 2,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%'
                }}>
                        {config.icon}
                      </Box>

                      {/* Title */}
                      <Typography variant="h6" component="h2" sx={{
                    fontWeight: 600,
                    mb: 1.5,
                    color: 'text.primary'
                }}>
                        {title}
                      </Typography>

                      {/* Description */}
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                        {description}
                      </Typography>

                      {/* Metadata */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                        {/* Chart Type */}
                        <Chip label={config.chartType} size="small" sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}/>

                        {/* Tags */}
                        {config.tags && config.tags.length > 0 && (<Chip label={config.tags[0]} size="small" sx={{
                        fontSize: '0.75rem',
                        borderColor: '#667eea',
                        color: '#667eea',
                        fontWeight: 500
                    }} variant="outlined"/>)}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>);
        })}
      </Grid>

      {/* Info Section - Enhanced */}
      <Box sx={{
            mt: 8,
            p: 5,
            background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
            borderRadius: 4,
            textAlign: 'center',
            border: '2px solid',
            borderColor: 'rgba(67, 233, 123, 0.2)',
            boxShadow: '0 10px 40px rgba(67, 233, 123, 0.1)'
        }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
          {locale === 'sr'
            ? '💡 O Demo Vizualizacijama'
            : '💡 About Demo Visualizations'}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
          {locale === 'sr'
            ? 'Ove vizualizacije koriste stvarne podatke sa portala otvorenih podataka Republike Srbije (data.gov.rs). Podaci se učitavaju u realnom vremenu direktno iz API-ja.'
            : 'These visualizations use real data from the Republic of Serbia open data portal (data.gov.rs). Data is loaded in real-time directly from the API.'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
          {locale === 'sr'
            ? 'Projekat je razvijen sa Next.js i prilagođen za GitHub Pages deployment sa statičkim exportom.'
            : 'The project is built with Next.js and optimized for GitHub Pages deployment with static export.'}
        </Typography>
      </Box>

      {/* Statistics - Enhanced */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)'
            }
        }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {Object.keys(DEMO_CONFIGS).length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {locale === 'sr' ? 'Dostupnih demoa' : 'Available Demos'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(245, 87, 108, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)'
            }
        }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                6,162+
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {locale === 'sr' ? 'Resursa na data.gov.rs' : 'Resources on data.gov.rs'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{
            p: 4,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-5px)'
            }
        }}>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                93
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {locale === 'sr' ? 'Organizacija' : 'Organizations'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </DemoLayout>);
}
/**
 * CRITICAL: Use getStaticProps for static export (GitHub Pages compatibility)
 */
export async function getStaticProps() {
    return {
        props: {}
    };
}
