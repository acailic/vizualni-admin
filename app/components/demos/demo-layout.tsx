/**
 * Layout component for demo pages
 * Provides consistent structure for data.gov.rs visualizations
 */

import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import { Box, Button, Container, Typography } from '@mui/material';

import { Flex } from '@/components/flex';
import { Header } from '@/components/header';

interface DemoLayoutProps {
  /**
   * Page content
   */
  children: ReactNode;

  /**
   * Demo title
   */
  title: string;

  /**
   * Demo description (optional)
   */
  description?: string;

  /**
   * Dataset metadata (optional)
   */
  datasetInfo?: {
    title?: string;
    organization?: string;
    updatedAt?: string;
  };

  /**
   * Hide back button
   */
  hideBackButton?: boolean;
}

export function DemoLayout({
  children,
  title,
  description,
  datasetInfo,
  hideBackButton = false
}: DemoLayoutProps) {
  const router = useRouter();

  return (
    <Flex sx={{ minHeight: '100vh', flexDirection: 'column' }}>
      <Header />

      <Box
        component="main"
        sx={{
          flex: 1,
          backgroundColor: 'monochrome.100',
          py: 4
        }}
      >
        <Container maxWidth="xl">
          {/* Navigation */}
          {!hideBackButton && (
            <Box sx={{ mb: 3 }}>
              <Link href="/demos" passHref legacyBehavior>
                <Button
                  component="a"
                  sx={{ textTransform: 'none' }}
                >
                  ← Nazad na demo galeriju
                </Button>
              </Link>
            </Box>
          )}

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
              {title}
            </Typography>

            {description && (
              <Typography
                variant="h6"
                component="p"
                sx={{
                  color: 'grey.700',
                  fontWeight: 400,
                  mb: 2
                }}
              >
                {description}
              </Typography>
            )}

            {datasetInfo && (
              <Box
                sx={{
                  display: 'flex',
                  gap: 3,
                  mt: 2,
                  flexWrap: 'wrap'
                }}
              >
                {datasetInfo.organization && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Organizacija:</strong> {datasetInfo.organization}
                  </Typography>
                )}
                {datasetInfo.updatedAt && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Ažurirano:</strong>{' '}
                    {new Date(datasetInfo.updatedAt).toLocaleDateString('sr-RS', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                )}
              </Box>
            )}
          </Box>

          {/* Content */}
          <Box sx={{ minHeight: 400 }}>
            {children}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              mt: 6,
              pt: 4,
              borderTop: 1,
              borderColor: 'divider',
              textAlign: 'center'
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Izvor podataka:{' '}
              <Link href="https://data.gov.rs" passHref legacyBehavior>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'underline' }}
                >
                  data.gov.rs
                </a>
              </Link>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Flex>
  );
}

/**
 * Loading state component for demos
 */
export function DemoLoading({ message }: { message?: string }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          border: '4px solid',
          borderColor: 'primary.light',
          borderTopColor: 'primary.main',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          mb: 2,
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' }
          }
        }}
      />
      <Typography variant="body1" color="text.secondary">
        {message || 'Učitavanje podataka sa data.gov.rs...'}
      </Typography>
    </Box>
  );
}

/**
 * Error state component for demos
 */
export function DemoError({
  error,
  onRetry
}: {
  error: Error | string;
  onRetry?: () => void;
}) {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Box
      sx={{
        backgroundColor: 'error.lighter',
        border: 1,
        borderColor: 'error.light',
        borderRadius: 2,
        p: 4,
        textAlign: 'center'
      }}
    >
      <Typography variant="h6" color="error.main" sx={{ mb: 2 }}>
        Greška pri učitavanju podataka
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {errorMessage}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          sx={{ textTransform: 'none' }}
        >
          Pokušaj ponovo
        </Button>
      )}
    </Box>
  );
}

/**
 * Empty state component for demos
 */
export function DemoEmpty({ message }: { message?: string }) {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: 8
      }}
    >
      <Typography variant="h6" color="text.secondary">
        {message || 'Nema dostupnih podataka'}
      </Typography>
    </Box>
  );
}
