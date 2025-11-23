/**
 * Main navigation bar component
 * Provides consistent navigation across the application
 */

import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const navigationItems = [
  { label: { sr: 'Početna', en: 'Home' }, href: '/', icon: <HomeIcon /> },
  { label: { sr: 'Demo', en: 'Demos' }, href: '/demos', icon: <BarChartIcon /> },
  { label: { sr: 'Tutorijali', en: 'Tutorials' }, href: '/tutorials', icon: <MenuBookIcon /> },
  { label: { sr: 'Dokumentacija', en: 'Docs' }, href: '/docs', icon: <DescriptionIcon /> },
];

export function NavBar() {
  const router = useRouter();
  const locale = (router.locale || 'sr') as 'sr' | 'en';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const renderNavigationItems = () => {
    return navigationItems.map((item) => (
      <Link key={item.href} href={item.href} passHref legacyBehavior>
        <Button
          component="a"
          color="inherit"
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            mx: 1,
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
          startIcon={item.icon}
        >
          {item.label[locale]}
        </Button>
      </Link>
    ));
  };

  const renderMobileNavigationItems = () => {
    return navigationItems.map((item) => (
      <ListItem key={item.href} disablePadding>
        <Link href={item.href} passHref legacyBehavior>
          <ListItemButton component="a" onClick={handleMobileMenuClose}>
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label[locale]} />
          </ListItemButton>
        </Link>
      </ListItem>
    ));
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'primary.main' }}>
        <Toolbar>
          {/* Logo/Title */}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Vizualni Admin
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {renderNavigationItems()}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuToggle}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMobileMenuClose}
          onKeyDown={handleMobileMenuClose}
        >
          <List>
            {renderMobileNavigationItems()}
          </List>
        </Box>
      </Drawer>
    </>
  );
}