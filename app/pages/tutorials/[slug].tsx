/**
 * Dynamic tutorial page for Vizualni Admin tutorials
 * Displays step-by-step tutorials with progress tracking and interactive content
 */

import { Box, Button, Container, LinearProgress, Paper, Typography, List, ListItem, ListItemButton, ListItemText, Divider, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import { InteractiveStep } from '@/components/tutorials/InteractiveStep';
import { getTutorialConfig, getAllTutorialIds } from '@/lib/tutorials/config';
import { useTutorialProgress } from '@/hooks/useTutorialProgress';

export default function TutorialPage() {
  const router = useRouter();
  const { slug } = router.query;
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  const config = slug ? getTutorialConfig(slug as string) : null;
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Tutorial progress hook
  const { progress, markStepCompleted, isStepCompleted, isTutorialCompleted } = useTutorialProgress(config?.id || '');

  // Reset to first step when tutorial changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [slug]);

  if (!config) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" color="error">
          {locale === 'sr' ? 'Tutorial nije pronađen' : 'Tutorial not found'}
        </Typography>
        <Link href="/tutorials" passHref legacyBehavior>
          <Button component="a" sx={{ mt: 2 }}>
            {locale === 'sr' ? 'Nazad na tutorials' : 'Back to tutorials'}
          </Button>
        </Link>
      </Container>
    );
  }

  const currentStep = config.steps[currentStepIndex];
  const progressValue = ((currentStepIndex + 1) / config.steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < config.steps.length - 1) {
      markStepCompleted(currentStep.id);
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleStepClick = (index: number) => {
    setCurrentStepIndex(index);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link href="/" passHref legacyBehavior>
          <MuiLink component="a" underline="hover">
            {locale === 'sr' ? 'Početna' : 'Home'}
          </MuiLink>
        </Link>
        <Link href="/tutorials" passHref legacyBehavior>
          <MuiLink component="a" underline="hover">
            {locale === 'sr' ? 'Tutoriali' : 'Tutorials'}
          </MuiLink>
        </Link>
        <Typography color="text.primary">{config.title[locale]}</Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h3"
          component="h1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: 'grey.900'
          }}
        >
          {config.title[locale]}
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            color: 'grey.700',
            fontWeight: 400,
            mb: 3
          }}
        >
          {config.description[locale]}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progressValue}
            sx={{
              height: 12,
              borderRadius: 6,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                borderRadius: 6,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {locale === 'sr' ? 'Korak' : 'Step'} {currentStepIndex + 1} {locale === 'sr' ? 'od' : 'of'} {config.steps.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progressValue)}% {locale === 'sr' ? 'završeno' : 'completed'}
            </Typography>
          </Box>
        </Box>

        {/* Difficulty and Time */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>{locale === 'sr' ? 'Težina:' : 'Difficulty:'}</strong> {config.difficulty}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>{locale === 'sr' ? 'Procenjeno vreme:' : 'Estimated time:'}</strong> {config.estimatedTime} {locale === 'sr' ? 'minuta' : 'minutes'}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 4 }}>
        {/* Sidebar - Table of Contents */}
        <Box sx={{ width: 320, flexShrink: 0 }}>
          <Paper
            sx={{
              p: 3,
              position: 'sticky',
              top: 20,
              maxHeight: 'calc(100vh - 100px)',
              overflowY: 'auto'
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              {locale === 'sr' ? 'Sadržaj' : 'Table of Contents'}
            </Typography>
            <List>
              {config.steps.map((step, index) => (
                <ListItem key={step.id} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    selected={index === currentStepIndex}
                    onClick={() => handleStepClick(index)}
                    sx={{
                      borderRadius: 2,
                      '&.Mui-selected': {
                        backgroundColor: 'primary.light',
                        '&:hover': {
                          backgroundColor: 'primary.main'
                        }
                      }
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {isStepCompleted(step.id) && (
                            <Typography variant="body2" color="success.main">✓</Typography>
                          )}
                          <Typography variant="body2" sx={{ fontWeight: index === currentStepIndex ? 600 : 400 }}>
                            {index + 1}. {step.title[locale]}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            {isTutorialCompleted && (
              <Box sx={{ mt: 3, p: 2, backgroundColor: 'success.light', borderRadius: 2 }}>
                <Typography variant="body2" color="success.dark" sx={{ fontWeight: 600 }}>
                  {locale === 'sr' ? '🎉 Tutorial završen!' : '🎉 Tutorial completed!'}
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper sx={{ p: 4, mb: 3 }}>
            <InteractiveStep
              step={currentStep}
              locale={locale}
              onComplete={() => markStepCompleted(currentStep.id)}
            />
          </Paper>

          {/* Navigation */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 4,
              p: 3,
              backgroundColor: 'grey.50',
              borderRadius: 2
            }}
          >
            <Button
              variant="outlined"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
              sx={{ textTransform: 'none' }}
            >
              {locale === 'sr' ? 'Prethodni' : 'Previous'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {currentStepIndex + 1} / {config.steps.length}
              </Typography>
            </Box>

            <Button
              variant="contained"
              onClick={handleNext}
              disabled={currentStepIndex === config.steps.length - 1}
              sx={{ textTransform: 'none' }}
            >
              {currentStepIndex === config.steps.length - 1
                ? (locale === 'sr' ? 'Završi' : 'Finish')
                : (locale === 'sr' ? 'Sledeći' : 'Next')
              }
            </Button>
          </Box>

          {/* Back to Tutorials */}
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link href="/tutorials" passHref legacyBehavior>
              <Button component="a" variant="text" sx={{ textTransform: 'none' }}>
                ← {locale === 'sr' ? 'Nazad na tutoriale' : 'Back to tutorials'}
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

/**
 * CRITICAL: This makes it work on GitHub Pages
 * Pre-generate static pages for known tutorial slugs
 */
export async function getStaticPaths() {
  const tutorialIds = getAllTutorialIds();

  return {
    paths: tutorialIds.map((id) => ({
      params: { slug: id }
    })),
    fallback: false // Don't generate unknown routes on-demand
  };
}

/**
 * CRITICAL: Use getStaticProps (not getServerSideProps) for static export
 * Data fetching happens client-side, so we just pass the slug
 */
export async function getStaticProps({ params }: { params: { slug: string } }) {
  return {
    props: {
      slug: params.slug
    }
  };
}