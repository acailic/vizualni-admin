/**
 * Demo gallery page - showcases all available data.gov.rs demos
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { Box, Card, CardActionArea, CardContent, Grid, Typography, Chip } from '@mui/material';
import { DemoLayout } from '@/components/demos/demo-layout';
import { DEMO_CONFIGS } from '@/lib/demos/config';

export default function DemosIndex() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  const pageTitle = locale === 'sr' ? 'Demo Vizualizacije' : 'Demo Visualizations';
  const pageDescription =
    locale === 'sr'
      ? 'Istražite različite vizualizacije otvorenih podataka iz Srbije'
      : 'Explore different visualizations of Serbian open data';

  return (
    <DemoLayout title={pageTitle} description={pageDescription} hideBackButton>
      {/* Intro Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" paragraph>
          {locale === 'sr'
            ? 'Dobrodošli u galeriju demo vizualizacija podataka sa portala data.gov.rs. Svaki demo prikazuje različite načine vizualizacije otvorenih podataka iz Republike Srbije.'
            : 'Welcome to the demo visualization gallery using data from data.gov.rs. Each demo showcases different ways to visualize open data from the Republic of Serbia.'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {locale === 'sr'
            ? 'Kliknite na bilo koji demo ispod da biste videli interaktivnu vizualizaciju sa realnim podacima.'
            : 'Click on any demo below to see an interactive visualization with real data.'}
        </Typography>
      </Box>

      {/* Demo Cards Grid */}
      <Grid container spacing={3}>
        {Object.entries(DEMO_CONFIGS).map(([key, config]) => {
          const title = config.title[locale];
          const description = config.description[locale];

          return (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Link href={`/demos/${key}`} passHref legacyBehavior>
                <Card
                  component="a"
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardActionArea
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'stretch',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Icon */}
                      <Box
                        sx={{
                          fontSize: '3rem',
                          mb: 2,
                          textAlign: 'center'
                        }}
                      >
                        {config.icon}
                      </Box>

                      {/* Title */}
                      <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                          fontWeight: 600,
                          mb: 1.5,
                          color: 'text.primary'
                        }}
                      >
                        {title}
                      </Typography>

                      {/* Description */}
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.6 }}
                      >
                        {description}
                      </Typography>

                      {/* Metadata */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto' }}>
                        {/* Chart Type */}
                        <Chip
                          label={config.chartType}
                          size="small"
                          sx={{
                            backgroundColor: 'primary.lighter',
                            color: 'primary.main',
                            fontWeight: 500
                          }}
                        />

                        {/* Tags */}
                        {config.tags && config.tags.length > 0 && (
                          <Chip
                            label={config.tags[0]}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                          />
                        )}
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>

      {/* Info Section */}
      <Box
        sx={{
          mt: 6,
          p: 4,
          backgroundColor: 'primary.lighter',
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {locale === 'sr'
            ? 'O Demo Vizualizacijama'
            : 'About Demo Visualizations'}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {locale === 'sr'
            ? 'Ove vizualizacije koriste stvarne podatke sa portala otvorenih podataka Republike Srbije (data.gov.rs). Podaci se učitavaju u realnom vremenu direktno iz API-ja.'
            : 'These visualizations use real data from the Republic of Serbia open data portal (data.gov.rs). Data is loaded in real-time directly from the API.'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {locale === 'sr'
            ? 'Projekat je razvijen sa Next.js i prilagođen za GitHub Pages deployment sa statičkim exportom.'
            : 'The project is built with Next.js and optimized for GitHub Pages deployment with static export.'}
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
              {Object.keys(DEMO_CONFIGS).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locale === 'sr' ? 'Dostupnih demoa' : 'Available Demos'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
              6,162+
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locale === 'sr' ? 'Resursa na data.gov.rs' : 'Resources on data.gov.rs'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary.main" sx={{ fontWeight: 700 }}>
              93
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {locale === 'sr' ? 'Organizacija' : 'Organizations'}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </DemoLayout>
  );
}

/**
 * CRITICAL: Use getStaticProps for static export (GitHub Pages compatibility)
 */
export async function getStaticProps() {
  return {
    props: {}
  };
}
