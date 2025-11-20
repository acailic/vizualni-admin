import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Chip, Container, Fade, Grid, IconButton, LinearProgress, Stack, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ColumnChart } from '@/components/demos/charts/ColumnChart';
import { LineChart } from '@/components/demos/charts/LineChart';
import { DemoLayout } from '@/components/demos/demo-layout';
import { internetAdoption, techIndustryGrowth } from '@/data/serbia-digital';
import { sectorComposition, tradeBalance } from '@/data/serbia-economy';
import { energyProduction, energyStats } from '@/data/serbia-energy';

const sectionOrder = ['hero', 'agenda', 'highlights', 'stories', 'cta'] as const;

export default function PresentationEnhanced() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';
  const [activeSection, setActiveSection] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['hero']));
  const observerRef = useRef<IntersectionObserver | null>(null);

  const titles = {
    hero: locale === 'sr' ? 'Vizuelni Demo za Prezentacije' : 'Presentation-Ready Demo',
    heroDesc:
      locale === 'sr'
        ? 'Kurirana scena za pokazivanje vizualizacija otvorenih podataka uz slide navigaciju.'
        : 'A curated stage to showcase open data visualizations with slide-style navigation.',
    agenda: locale === 'sr' ? 'Agenda' : 'Agenda',
    highlights: locale === 'sr' ? 'Istaknuto' : 'Highlights',
    stories: locale === 'sr' ? 'Data priče' : 'Data Stories',
    cta: locale === 'sr' ? 'Poziv na akciju' : 'Call to Action'
  };

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const index = sectionOrder.indexOf(id as any);
      if (index !== -1) setActiveSection(index);
    }
  }, []);

  const navigateSection = useCallback((direction: 'next' | 'prev') => {
    const newIndex = direction === 'next'
      ? Math.min(activeSection + 1, sectionOrder.length - 1)
      : Math.max(activeSection - 1, 0);

    if (newIndex !== activeSection) {
      scrollToSection(sectionOrder[newIndex]);
    }
  }, [activeSection, scrollToSection]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
        case 'ArrowDown':
          e.preventDefault();
          navigateSection('next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          navigateSection('prev');
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
            setIsFullscreen(false);
          }
          break;
        case 'f':
        case 'F':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            toggleFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateSection, toggleFullscreen]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionOrder.forEach((id) => {
      const element = document.getElementById(id);
      if (element && observerRef.current) {
        observerRef.current.observe(element);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const agendaItems =
    locale === 'sr'
      ? ['Ko smo i šta smo izgradili', 'Ključni rezultati i trendovi', 'Priče iz podataka za diskusiju', 'Sledeći koraci i CTA']
      : ['What this demo delivers', 'Key results and trends', 'Data stories to discuss', 'Next steps and calls to action'];

  const highlightCards = [
    {
      label: locale === 'sr' ? 'Internet penetracija' : 'Internet penetration',
      value: `${internetAdoption[internetAdoption.length - 1].individuals}%`,
      detail: locale === 'sr' ? 'građana koristi internet' : 'of citizens online',
      tone: 'primary',
      icon: '🌐'
    },
    {
      label: locale === 'sr' ? 'IT izvoz' : 'IT exports',
      value: `€${techIndustryGrowth[techIndustryGrowth.length - 1].exports.toLocaleString()}M`,
      detail: locale === 'sr' ? 'rast IT industrije' : 'IT industry growth',
      tone: 'success',
      icon: '💻'
    },
    {
      label: locale === 'sr' ? 'Zavisnost od uglja' : 'Coal dependency',
      value: `${energyStats.coalDependency2024}%`,
      detail: locale === 'sr' ? 'udar na energetsku tranziciju' : 'drag on transition',
      tone: 'warning',
      icon: '⚡'
    },
    {
      label: locale === 'sr' ? 'Izvoz vs. uvoz' : 'Exports vs imports',
      value: `${tradeBalance[tradeBalance.length - 1].exports} / ${tradeBalance[tradeBalance.length - 1].imports}`,
      detail: locale === 'sr' ? 'mld € 2023' : 'bn € 2023',
      tone: 'info',
      icon: '📊'
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
      label: locale === 'sr' ? 'Vrati se na originalni demo' : 'Back to original demo',
      href: '/demos/presentation'
    }
  ];

  const progress = ((activeSection + 1) / sectionOrder.length) * 100;

  return (
    <DemoLayout
      title={titles.hero}
      description={titles.heroDesc}
      datasetInfo={{
        title: locale === 'sr' ? 'Serbian Open Data – Enhanced Demo' : 'Serbian Open Data – Enhanced Demo',
        organization: 'data.gov.rs',
        updatedAt: '2024'
      }}
      hideBackButton
    >
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1300,
          height: 4,
          '& .MuiLinearProgress-bar': {
            transition: 'transform 0.5s ease'
          }
        }}
      />

      {/* Fullscreen Toggle */}
      <IconButton
        onClick={toggleFullscreen}
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1200,
          bgcolor: 'background.paper',
          boxShadow: 3,
          '&:hover': { bgcolor: 'grey.100' }
        }}
      >
        {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </IconButton>

      {/* Sticky Navigation */}
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        py: 1.5,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        mb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
            {sectionOrder.map((id, index) => (
              <Chip
                key={id}
                label={titles[id]}
                onClick={() => scrollToSection(id)}
                color={index === activeSection ? 'primary' : 'default'}
                variant={index === activeSection ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  transform: index === activeSection ? 'scale(1.05)' : 'scale(1)'
                }}
              />
            ))}
            <Box sx={{ flex: 1 }} />
            <Typography variant="caption" color="text.secondary">
              {locale === 'sr' ? 'Navigacija: ← → ili Space' : 'Navigation: ← → or Space'}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Hero Section */}
      <Fade in={visibleSections.has('hero')} timeout={1000}>
        <Box
          id="hero"
          sx={{
            mb: 6,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #312e81 80%, #4c1d95 100%)',
            color: 'white',
            position: 'relative',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)'
            }
          }}
        >
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.3), transparent 40%), radial-gradient(circle at 80% 10%, rgba(16,185,129,0.25), transparent 35%), radial-gradient(circle at 50% 90%, rgba(251,146,60,0.2), transparent 30%)',
            animation: 'pulse 8s ease-in-out infinite'
          }} />
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center" sx={{ py: 8 }}>
              <Grid item xs={12} md={7}>
                <Fade in timeout={1200}>
                  <Box>
                    <Typography variant="overline" sx={{ letterSpacing: 3, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                      {locale === 'sr' ? '🎯 Live demo za sastanke' : '🎯 Live demo for meetings'}
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, lineHeight: 1.1, mt: 1 }}>
                      {locale === 'sr' ? 'Interaktivna prezentacija otvorenih podataka' : 'Interactive open data presentation'}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)', fontWeight: 400 }}>
                      {locale === 'sr'
                        ? 'Hero, agenda, istaknuti rezultati, priče iz podataka i CTA – spremno za projekciju ili deljenje ekrana.'
                        : 'Hero, agenda, highlights, data stories, and CTA – ready to project or screen-share.'}
                    </Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={<KeyboardArrowDownIcon />}
                        onClick={() => scrollToSection('agenda')}
                        sx={{
                          fontWeight: 700,
                          bgcolor: 'white',
                          color: 'primary.main',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            bgcolor: 'grey.100',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {locale === 'sr' ? 'Počni prezentaciju' : 'Start presenting'}
                      </Button>
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => scrollToSection('stories')}
                        sx={{
                          fontWeight: 700,
                          borderColor: 'white',
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          '&:hover': {
                            borderColor: 'white',
                            bgcolor: 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {locale === 'sr' ? 'Skoči na vizualizacije' : 'Jump to visuals'}
                      </Button>
                    </Stack>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={5}>
                <Fade in timeout={1400}>
                  <Box sx={{ p: 3, borderRadius: 3, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <Stack spacing={2}>
                      {highlightCards.map((card, index) => (
                        <Fade in timeout={1600 + index * 200} key={card.label}>
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 2,
                              border: '1px solid rgba(255,255,255,0.15)',
                              background: 'rgba(255,255,255,0.08)',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                background: 'rgba(255,255,255,0.15)',
                                transform: 'translateX(8px)'
                              }
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography sx={{ fontSize: '1.5rem' }}>{card.icon}</Typography>
                                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
                                    {card.label}
                                  </Typography>
                                </Stack>
                                <Typography variant="h5" sx={{ fontWeight: 900, color: 'white' }}>
                                  {card.value}
                                </Typography>
                              </Box>
                              <Chip
                                label={card.detail}
                                size="small"
                                sx={{
                                  color: 'white',
                                  backgroundColor: 'rgba(255,255,255,0.18)',
                                  fontWeight: 600,
                                  fontSize: '0.7rem'
                                }}
                              />
                            </Stack>
                          </Box>
                        </Fade>
                      ))}
                    </Stack>
                  </Box>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>

      {/* Agenda Section */}
      <Fade in={visibleSections.has('agenda')} timeout={800}>
        <Box id="agenda" sx={{ mb: 6 }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="center" justifyContent="space-between" sx={{ pb: 3 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {titles.agenda}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {locale === 'sr' ? 'Vaš vodič kroz prezentaciju' : 'Your guide through the presentation'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={locale === 'sr' ? '🎬 Live ready' : '🎬 Live ready'} color="primary" variant="outlined" />
                <Chip label={locale === 'sr' ? '📱 Responsive' : '📱 Responsive'} color="secondary" variant="outlined" />
                <Chip label="⚡ Interactive" variant="outlined" />
              </Stack>
            </Stack>
            <Grid container spacing={3}>
              {agendaItems.map((item, index) => (
                <Grid item xs={12} md={6} key={item}>
                  <Fade in timeout={1000 + index * 200}>
                    <Box sx={{
                      p: 3.5,
                      borderRadius: 3,
                      border: '2px solid',
                      borderColor: 'grey.200',
                      backgroundColor: 'white',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.06)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 16px 48px rgba(0,0,0,0.12)'
                      }
                    }}>
                      <Stack direction="row" spacing={2} alignItems="flex-start">
                        <Box sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </Box>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
                            {item}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                            {locale === 'sr'
                              ? 'Kratak talking-point za slajd, sa podrškom za live skrol do narednog poglavlja.'
                              : 'Short talking point with live scroll to the next chapter.'}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Fade>

      {/* Highlights Section */}
      <Fade in={visibleSections.has('highlights')} timeout={800}>
        <Box id="highlights" sx={{ mb: 6, background: 'linear-gradient(135deg, #eff6ff 0%, #f0fdf4 50%, #fef3c7 100%)', py: 6, borderRadius: 4 }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {titles.highlights}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {locale === 'sr' ? 'Ključne metrike koje pričaju priču' : 'Key metrics that tell the story'}
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={() => scrollToSection('stories')}
                sx={{
                  fontWeight: 700,
                  px: 4,
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                  }
                }}
              >
                {locale === 'sr' ? 'Otvori priče iz podataka' : 'Open data stories'}
              </Button>
            </Stack>
            <Grid container spacing={3}>
              {highlightCards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                  <Fade in timeout={1000 + index * 150}>
                    <Box sx={{
                      p: 3.5,
                      borderRadius: 3,
                      background: 'white',
                      border: '2px solid',
                      borderColor: 'rgba(0,0,0,0.08)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
                      height: '100%',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px) scale(1.02)',
                        boxShadow: '0 20px 48px rgba(0,0,0,0.15)',
                        borderColor: 'primary.main'
                      }
                    }}>
                      <Typography sx={{ fontSize: '2.5rem', mb: 2 }}>{card.icon}</Typography>
                      <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                        {card.label}
                      </Typography>
                      <Typography variant="h3" sx={{ fontWeight: 900, my: 1.5, color: 'primary.main' }}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {card.detail}
                      </Typography>
                    </Box>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Fade>

      {/* Data Stories Section */}
      <Fade in={visibleSections.has('stories')} timeout={800}>
        <Box id="stories" sx={{ mb: 6 }}>
          <Container maxWidth="lg">
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
              <Box>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                  {titles.stories}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {locale === 'sr' ? 'Interaktivne vizualizacije koje oživljavaju podatke' : 'Interactive visualizations that bring data to life'}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip label={locale === 'sr' ? '🎨 Interaktivno' : '🎨 Interactive'} color="primary" />
                <Chip label="📈 D3.js" color="secondary" />
                <Chip label={locale === 'sr' ? '📱 Responsive' : '📱 Responsive'} />
              </Stack>
            </Stack>

            {/* Digital Growth Chart */}
            <Box sx={{
              mb: 4,
              p: 4,
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'grey.200',
              backgroundColor: 'white',
              boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ fontSize: '2rem' }}>📡</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {locale === 'sr' ? 'Digitalni rast (2006–2023)' : 'Digital growth (2006–2023)'}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {locale === 'sr'
                    ? 'Skok internet penetracije i IT izvoza – podloga za priču o digitalnoj transformaciji Srbije.'
                    : 'Internet penetration and IT export surge – backbone story for Serbia\'s digital transformation.'}
                </Typography>
              </Stack>
              <Box sx={{ height: { xs: 360, md: 460 }, mt: 3 }}>
                <LineChart
                  data={internetAdoption.map((d) => ({
                    year: d.year.toString(),
                    Individuals: d.individuals,
                    Households: d.households
                  }))}
                  xKey="year"
                  yKey="Individuals"
                  xLabel={locale === 'sr' ? 'Godina' : 'Year'}
                  yLabel="%"
                  width={900}
                  height={420}
                  color="#6366f1"
                />
              </Box>
            </Box>

            {/* Two Column Charts */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3.5,
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: 'grey.200',
                  backgroundColor: 'white',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography sx={{ fontSize: '1.75rem' }}>🏭</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {locale === 'sr' ? 'Sektorska struktura BDP' : 'GDP by sector'}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {locale === 'sr'
                        ? 'Servisi vode 51% BDP; industrija i poljoprivreda i dalje nose značajan deo.'
                        : 'Services lead with 51% of GDP; industry and agriculture remain significant.'}
                    </Typography>
                  </Stack>
                  <ColumnChart
                    data={sectorComposition.map((s) => ({ sector: s.sector, percentage: s.percentage }))}
                    xKey="sector"
                    yKey="percentage"
                    xLabel={locale === 'sr' ? 'Sektor' : 'Sector'}
                    yLabel="%"
                    width={600}
                    height={360}
                    colors={['#10b981', '#3b82f6', '#f59e0b']}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  p: 3.5,
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: 'grey.200',
                  backgroundColor: 'white',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Stack spacing={1.5} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Typography sx={{ fontSize: '1.75rem' }}>📦</Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {locale === 'sr' ? 'Trgovinski balans' : 'Trade balance'}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {locale === 'sr'
                        ? 'Izvoz raste, ali uvoz i dalje veći – okvir za diskusiju o konkurentnosti.'
                        : 'Exports rise, imports higher – frame the competitiveness discussion.'}
                    </Typography>
                  </Stack>
                  <ColumnChart
                    data={tradeBalance.map((t) => ({ year: t.year.toString(), exports: t.exports, imports: t.imports }))}
                    xKey="year"
                    yKey="exports"
                    xLabel={locale === 'sr' ? 'Godina' : 'Year'}
                    yLabel={locale === 'sr' ? 'Izvoz (mld €)' : 'Exports (bn €)'}
                    width={600}
                    height={360}
                    colors={['#0ea5e9', '#f43f5e']}
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Energy Chart */}
            <Box sx={{
              p: 4,
              borderRadius: 4,
              border: '2px solid',
              borderColor: 'grey.200',
              backgroundColor: 'white',
              boxShadow: '0 16px 48px rgba(0,0,0,0.08)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
                transform: 'translateY(-4px)'
              }
            }}>
              <Stack spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography sx={{ fontSize: '2rem' }}>⚡</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {locale === 'sr' ? 'Energetska zavisnost (2015–2024)' : 'Energy dependency (2015–2024)'}
                  </Typography>
                </Stack>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {locale === 'sr'
                    ? 'Vizuelni dokaz oslanjanja na ugalj i uvoz – istakni rizik i potrebu za tranzicijom.'
                    : 'Visual proof of coal reliance and imports – highlight risk and need for transition.'}
                </Typography>
              </Stack>
              <Box sx={{ height: { xs: 360, md: 460 }, mt: 3 }}>
                <LineChart
                  data={energyProduction.map((e) => ({
                    year: e.year.toString(),
                    Coal: e.coal,
                    Hydropower: e.hydropower,
                    SolarWind: e.solarWind
                  }))}
                  xKey="year"
                  yKey="Coal"
                  xLabel={locale === 'sr' ? 'Godina' : 'Year'}
                  yLabel="%"
                  width={900}
                  height={420}
                  color="#f97316"
                />
              </Box>
            </Box>
          </Container>
        </Box>
      </Fade>

      {/* Call to Action Section */}
      <Fade in={visibleSections.has('cta')} timeout={800}>
        <Box id="cta" sx={{
          mb: 6,
          background: 'linear-gradient(135deg, #111827 0%, #0f172a 40%, #1e293b 80%, #0b1224 100%)',
          color: 'white',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative'
        }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.2), transparent 50%)',
            animation: 'pulse 6s ease-in-out infinite'
          }} />
          <Container maxWidth="lg" sx={{ py: 7, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
                  {locale === 'sr' ? '🚀 Spremno za prezentaciju' : '🚀 Ready to present'}
                </Typography>
                <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 4, lineHeight: 1.6 }}>
                  {locale === 'sr'
                    ? 'Otvorite /demos/presentation-enhanced u full-screen režimu, koristite tastere za navigaciju, i pratite agendu za glatku prezentaciju.'
                    : 'Open /demos/presentation-enhanced in full screen, use keyboard navigation, and follow the agenda for a smooth presentation.'}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  {nextStepButtons.map((btn) => (
                    <Link key={btn.href} href={btn.href} passHref legacyBehavior>
                      <Button
                        component="a"
                        variant={btn.href === '/demos' ? 'contained' : 'outlined'}
                        size="large"
                        sx={{
                          fontWeight: 700,
                          px: 4,
                          py: 1.5,
                          bgcolor: btn.href === '/demos' ? 'white' : 'transparent',
                          color: btn.href === '/demos' ? 'primary.main' : 'white',
                          borderColor: 'white',
                          '&:hover': {
                            bgcolor: btn.href === '/demos' ? 'grey.100' : 'rgba(255,255,255,0.1)',
                            transform: 'translateY(-2px)',
                            borderColor: 'white'
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {btn.label}
                      </Button>
                    </Link>
                  ))}
                </Stack>
              </Grid>
              <Grid item xs={12} md={5}>
                <Box sx={{ p: 4, borderRadius: 3, background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                  <Stack spacing={2.5}>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.95)', fontWeight: 800 }}>
                      {locale === 'sr' ? '📝 Uputstvo za prezentera' : '📝 Presenter notes'}
                    </Typography>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, mb: 1 }}>
                        <strong>⌨️ Navigacija:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, pl: 2 }}>
                        {locale === 'sr'
                          ? '→ / Space - Sledeća sekcija | ← - Prethodna sekcija | F11/Cmd+F - Fullscreen'
                          : '→ / Space - Next section | ← - Previous section | F11/Cmd+F - Fullscreen'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, mb: 1 }}>
                        <strong>🎯 Saveti:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, pl: 2 }}>
                        {locale === 'sr'
                          ? 'Hover preko grafikona za detalje. Svaka vizualizacija je interaktivna. Progress bar prati napredak kroz prezentaciju.'
                          : 'Hover over charts for details. Each visualization is interactive. Progress bar tracks your advancement through the presentation.'}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, mb: 1 }}>
                        <strong>💡 Za hybrid sastanke:</strong>
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, pl: 2 }}>
                        {locale === 'sr'
                          ? 'Podeli ekran u 16:9 aspect ratio, uključi tamni mod projektora za bolje boje.'
                          : 'Screen-share at 16:9 aspect ratio, use dark projector mode for better colors.'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Fade>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
      `}</style>
    </DemoLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {}
  };
}
