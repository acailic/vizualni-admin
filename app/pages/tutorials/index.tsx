/**
 * Tutorials landing page - showcases all available tutorials
 */

import { Box, Button, Card, CardActionArea, CardContent, Chip, Grid, Typography, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useMemo } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { DemoLayout } from '@/components/demos/demo-layout';
import { TUTORIAL_CONFIGS, TutorialConfig } from '@/lib/tutorials/config';

export default function TutorialsIndex() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const pageTitle = locale === 'sr' ? 'Tutorijali' : 'Tutorials';
  const pageDescription =
    locale === 'sr'
      ? 'Naučite kako da koristite Vizualni Admin za kreiranje vizualizacija otvorenih podataka'
      : 'Learn how to use Vizualni Admin to create visualizations of open data';

  // Flatten tutorials for filtering
  const allTutorials = useMemo(() => {
    const tutorials: TutorialConfig[] = [];
    Object.values(TUTORIAL_CONFIGS).forEach(categoryTutorials => {
      tutorials.push(...categoryTutorials);
    });
    return tutorials;
  }, []);

  // Filter tutorials based on search and filters
  const filteredTutorials = useMemo(() => {
    return allTutorials.filter(tutorial => {
      const matchesSearch = searchTerm === '' ||
        tutorial.title[locale].toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.description[locale].toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutorial.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [allTutorials, searchTerm, selectedCategory, selectedDifficulty, locale]);

  // Group filtered tutorials by category
  const tutorialsByCategory = useMemo(() => {
    const grouped: Record<string, TutorialConfig[]> = {};
    filteredTutorials.forEach(tutorial => {
      if (!grouped[tutorial.category]) {
        grouped[tutorial.category] = [];
      }
      grouped[tutorial.category].push(tutorial);
    });
    return grouped;
  }, [filteredTutorials]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'default';
    }
  };

  const getDifficultyLabel = (difficulty: string, locale: 'sr' | 'en') => {
    const labels = {
      beginner: { sr: 'Početnik', en: 'Beginner' },
      intermediate: { sr: 'Srednji', en: 'Intermediate' },
      advanced: { sr: 'Napredni', en: 'Advanced' }
    };
    return labels[difficulty as keyof typeof labels]?.[locale] || difficulty;
  };

  const getCategoryLabel = (category: string, locale: 'sr' | 'en') => {
    const labels = {
      'getting-started': { sr: 'Početak', en: 'Getting Started' },
      'creating-charts': { sr: 'Kreiranje Grafikona', en: 'Creating Charts' },
      'embedding': { sr: 'Ugrađivanje', en: 'Embedding' },
      'api-usage': { sr: 'Korišćenje API-ja', en: 'API Usage' },
      'advanced': { sr: 'Napredno', en: 'Advanced' }
    };
    return labels[category as keyof typeof labels]?.[locale] || category;
  };

  return (
    <DemoLayout title={pageTitle} description={pageDescription} hideBackButton>
      {/* Intro Section */}
      <Box
        sx={{
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
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            {locale === 'sr'
              ? '📚 Tutorijali i Vodiči'
              : '📚 Tutorials and Guides'}
          </Typography>
          <Typography variant="body1" paragraph sx={{ textAlign: 'center', fontSize: '1.1rem', opacity: 0.95 }}>
            {locale === 'sr'
              ? 'Kompletan sistem tutorijala za učenje kako da kreirate, prilagođavate i delite vizualizacije podataka.'
              : 'Complete tutorial system for learning how to create, customize, and share data visualizations.'}
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', opacity: 0.9 }}>
            {locale === 'sr'
              ? 'Od početnika do naprednih korisnika - pronađite tutorial koji vam odgovara.'
              : 'From beginners to advanced users - find the tutorial that suits you.'}
          </Typography>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={locale === 'sr' ? 'Pretraži tutorijale...' : 'Search tutorials...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{locale === 'sr' ? 'Kategorija' : 'Category'}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={locale === 'sr' ? 'Kategorija' : 'Category'}
              >
                <MenuItem value="all">{locale === 'sr' ? 'Sve' : 'All'}</MenuItem>
                <MenuItem value="getting-started">{getCategoryLabel('getting-started', locale)}</MenuItem>
                <MenuItem value="creating-charts">{getCategoryLabel('creating-charts', locale)}</MenuItem>
                <MenuItem value="embedding">{getCategoryLabel('embedding', locale)}</MenuItem>
                <MenuItem value="api-usage">{getCategoryLabel('api-usage', locale)}</MenuItem>
                <MenuItem value="advanced">{getCategoryLabel('advanced', locale)}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>{locale === 'sr' ? 'Težina' : 'Difficulty'}</InputLabel>
              <Select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                label={locale === 'sr' ? 'Težina' : 'Difficulty'}
              >
                <MenuItem value="all">{locale === 'sr' ? 'Sve' : 'All'}</MenuItem>
                <MenuItem value="beginner">{getDifficultyLabel('beginner', locale)}</MenuItem>
                <MenuItem value="intermediate">{getDifficultyLabel('intermediate', locale)}</MenuItem>
                <MenuItem value="advanced">{getDifficultyLabel('advanced', locale)}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {locale === 'sr'
            ? `Prikazano ${filteredTutorials.length} od ${allTutorials.length} tutorijala`
            : `Showing ${filteredTutorials.length} of ${allTutorials.length} tutorials`}
        </Typography>
      </Box>

      {/* Tutorials by Category */}
      {Object.entries(tutorialsByCategory).map(([category, tutorials]) => (
        <Box key={category} sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600, color: 'text.primary' }}>
            {getCategoryLabel(category, locale)}
          </Typography>
          <Grid container spacing={3}>
            {tutorials.map((tutorial) => {
              const title = tutorial.title[locale];
              const description = tutorial.description[locale];

              return (
                <Grid item xs={12} sm={6} md={4} key={tutorial.id}>
                  <Link href={`/tutorials/${tutorial.id}`} passHref legacyBehavior>
                    <Card
                      component="a"
                      sx={{
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
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          {/* Icon */}
                          <Box
                            sx={{
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
                            }}
                          >
                            {tutorial.icon}
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
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 'auto', alignItems: 'center' }}>
                            {/* Difficulty */}
                            <Chip
                              label={getDifficultyLabel(tutorial.difficulty, locale)}
                              size="small"
                              color={getDifficultyColor(tutorial.difficulty)}
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}
                            />

                            {/* Estimated Time */}
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <AccessTimeIcon sx={{ fontSize: '1rem', color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {tutorial.estimatedTime}min
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Link>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      {/* Info Section */}
      <Box
        sx={{
          mt: 8,
          p: 5,
          background: 'linear-gradient(135deg, rgba(67, 233, 123, 0.1) 0%, rgba(56, 249, 215, 0.1) 100%)',
          borderRadius: 4,
          textAlign: 'center',
          border: '2px solid',
          borderColor: 'rgba(67, 233, 123, 0.2)',
          boxShadow: '0 10px 40px rgba(67, 233, 123, 0.1)'
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
          {locale === 'sr'
            ? '🚀 O Tutorijalima'
            : '🚀 About Tutorials'}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
          {locale === 'sr'
            ? 'Tutorijali su dizajnirani da vas provedu kroz sve aspekte korišćenja Vizualni Admin platforme. Od osnovnih koncepata do naprednih tehnika, svaki tutorial sadrži praktične primere i interaktivne vežbe.'
            : 'Tutorials are designed to guide you through all aspects of using the Vizualni Admin platform. From basic concepts to advanced techniques, each tutorial contains practical examples and interactive exercises.'}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto', lineHeight: 1.8 }}>
          {locale === 'sr'
            ? 'Svi tutorijali su dostupni na srpskom i engleskom jeziku, sa statičkom generacijom za optimalne performanse na GitHub Pages.'
            : 'All tutorials are available in Serbian and English, with static generation for optimal performance on GitHub Pages.'}
        </Typography>
      </Box>

      {/* Statistics */}
      <Box sx={{ mt: 6 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
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
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {allTutorials.length}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {locale === 'sr' ? 'Dostupnih Tutorijala' : 'Available Tutorials'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
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
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                5
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {locale === 'sr' ? 'Kategorija' : 'Categories'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
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
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                {Math.round(allTutorials.reduce((sum, t) => sum + t.estimatedTime, 0) / allTutorials.length)}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, fontWeight: 500 }}>
                {locale === 'sr' ? 'Prosečno vreme (min)' : 'Avg Time (min)'}
              </Typography>
            </Box>
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