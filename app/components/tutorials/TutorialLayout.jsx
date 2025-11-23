/**
 * Layout component for tutorial pages
 * Provides consistent structure for step-by-step tutorials
 */
import { ChevronLeft, ChevronRight, Menu } from '@mui/icons-material';
import { Box, Button, Container, LinearProgress, List, ListItem, ListItemButton, ListItemText, Typography, Breadcrumbs, Link as MuiLink, Drawer, useMediaQuery, useTheme, IconButton, } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { Flex } from '@/components/flex';
import { Header } from '@/components/header';
export function TutorialLayout({ title, breadcrumbs, steps, currentStep, progress, onStepChange, onPrevious, onNext, previousDisabled = false, nextDisabled = false, backToTutorialsHref, }) {
    var _a;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const sidebarContent = (<Box sx={{ width: 280, p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Sadržaj
      </Typography>
      <List>
        {steps.map((step, index) => (<ListItem key={step.id} disablePadding>
            <ListItemButton selected={index === currentStep} onClick={() => onStepChange(index)} sx={{
                borderRadius: 1,
                mb: 0.5,
                '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    '&:hover': {
                        backgroundColor: 'primary.main',
                    },
                },
            }}>
              <ListItemText primary={`${index + 1}. ${step.title}`} primaryTypographyProps={{
                variant: 'body2',
                fontWeight: index === currentStep ? 600 : 400,
            }}/>
            </ListItemButton>
          </ListItem>))}
      </List>
    </Box>);
    return (<Flex sx={{ minHeight: '100vh', flexDirection: 'column' }}>
      <Header />

      <Box component="main" sx={{
            flex: 1,
            backgroundColor: 'monochrome.100',
            py: 2,
        }}>
        <Container maxWidth="xl">
          {/* Breadcrumbs */}
          <Box sx={{ mb: 2 }}>
            <Breadcrumbs aria-label="breadcrumb">
              {breadcrumbs.map((item, index) => (<Link key={index} href={item.href} passHref legacyBehavior>
                  <MuiLink underline="hover" color="inherit" sx={{ textTransform: 'none' }}>
                    {item.label}
                  </MuiLink>
                </Link>))}
              <Typography color="text.primary">{title}</Typography>
            </Breadcrumbs>
          </Box>

          {/* Header with Progress */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{
            fontWeight: 600,
            mb: 2,
            color: 'grey.900',
        }}>
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress variant="determinate" value={progress} sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: 'grey.200',
            '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                backgroundColor: 'primary.main',
            },
        }}/>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {Math.round(progress)}% završeno
              </Typography>
            </Box>
          </Box>

          {/* Main Content Area */}
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Sidebar */}
            {isMobile ? (<Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar} sx={{
                '& .MuiDrawer-paper': {
                    width: 280,
                },
            }}>
                {sidebarContent}
              </Drawer>) : (<Box sx={{
                width: 280,
                flexShrink: 0,
                display: sidebarOpen ? 'block' : 'none',
            }}>
                {sidebarContent}
              </Box>)}

            {/* Main Content */}
            <Box sx={{ flex: 1, minHeight: 400 }}>
              {isMobile && (<Box sx={{ mb: 2 }}>
                  <IconButton onClick={toggleSidebar}>
                    <Menu />
                  </IconButton>
                </Box>)}
              <Box sx={{ p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
                {(_a = steps[currentStep]) === null || _a === void 0 ? void 0 : _a.content}
              </Box>
            </Box>
          </Box>

          {/* Footer */}
          <Box sx={{
            mt: 4,
            pt: 3,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
        }}>
            <Link href={backToTutorialsHref} passHref legacyBehavior>
              <Button component="a" variant="outlined" sx={{ textTransform: 'none' }}>
                ← Nazad na tutorijale
              </Button>
            </Link>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={onPrevious} disabled={previousDisabled} startIcon={<ChevronLeft />} sx={{ textTransform: 'none' }}>
                Prethodni
              </Button>
              <Button variant="contained" onClick={onNext} disabled={nextDisabled} endIcon={<ChevronRight />} sx={{ textTransform: 'none' }}>
                Sledeći
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Flex>);
}
