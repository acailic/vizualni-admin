/**
 * Dynamic demo page for data.gov.rs visualizations
 * Works with GitHub Pages static export via client-side data fetching
 */

import { useRouter } from 'next/router';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { DemoLayout, DemoLoading, DemoError, DemoEmpty } from '@/components/demos/demo-layout';
import { DEMO_CONFIGS, getDemoConfig } from '@/lib/demos/config';
import { useDataGovRs } from '@/hooks/use-data-gov-rs';

export default function DemoPage() {
  const router = useRouter();
  const { category } = router.query;

  // Get demo configuration
  const config = category ? getDemoConfig(category as string) : null;

  // Determine locale (default to Serbian)
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  // Fetch data using custom hook (only if config exists)
  const { dataset, resource, data, loading, error, refetch } = useDataGovRs({
    searchQuery: config?.searchQuery,
    autoFetch: !!config
  });

  // Handle invalid category
  if (!config) {
    return (
      <DemoLayout
        title="Demo nije pronađen"
        description="Tražena demo kategorija ne postoji."
      >
        <DemoEmpty message="Demo sa ovim nazivom ne postoji." />
      </DemoLayout>
    );
  }

  const title = config.title[locale];
  const description = config.description[locale];

  return (
    <DemoLayout
      title={title}
      description={description}
      datasetInfo={
        dataset
          ? {
              title: dataset.title,
              organization: dataset.organization.title || dataset.organization.name,
              updatedAt: dataset.updated_at
            }
          : undefined
      }
    >
      {/* Loading State */}
      {loading && <DemoLoading />}

      {/* Error State */}
      {error && <DemoError error={error} onRetry={refetch} />}

      {/* Data Visualization */}
      {!loading && !error && dataset && data && (
        <Box>
          {/* Dataset Info Card */}
          <Paper sx={{ p: 3, mb: 4, backgroundColor: 'white' }}>
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
              {dataset.title}
            </Typography>

            {dataset.description && (
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                {dataset.description}
              </Typography>
            )}

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {dataset.tags && dataset.tags.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Tagovi:</strong> {dataset.tags.join(', ')}
                </Typography>
              )}
              {resource && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Format:</strong> {resource.format}
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Chart Placeholder */}
          <Paper sx={{ p: 4, mb: 4, backgroundColor: 'white', textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              📊 Vizualizacija ({config.chartType})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ovde će biti prikazana {config.chartType} vizualizacija.
              <br />
              Podaci su uspešno učitani i spremni za prikaz.
            </Typography>

            <Box
              sx={{
                mt: 3,
                p: 3,
                backgroundColor: 'grey.100',
                borderRadius: 1
              }}
            >
              <Typography variant="body2" color="text.secondary">
                <strong>Broj redova:</strong> {Array.isArray(data) ? data.length : 'N/A'}
              </Typography>
              {Array.isArray(data) && data.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Kolone:</strong> {Object.keys(data[0]).join(', ')}
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Data Table Preview */}
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Pregled podataka
            </Typography>

            {Array.isArray(data) && data.length > 0 ? (
              <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      {Object.keys(data[0]).map((key) => (
                        <TableCell key={key} sx={{ fontWeight: 600, backgroundColor: 'grey.100' }}>
                          {key}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.slice(0, 20).map((row: any, i: number) => (
                      <TableRow key={i} hover>
                        {Object.values(row).map((value: any, j: number) => (
                          <TableCell key={j}>
                            {value !== null && value !== undefined
                              ? String(value)
                              : '-'}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Podaci nisu dostupni u tabelarnom formatu
                </Typography>
              </Paper>
            )}

            {Array.isArray(data) && data.length > 20 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                Prikazano prvih 20 od {data.length} redova
              </Typography>
            )}
          </Box>
        </Box>
      )}

      {/* Empty State */}
      {!loading && !error && !dataset && (
        <DemoEmpty message="Podaci nisu pronađeni. Pokušajte kasnije." />
      )}
    </DemoLayout>
  );
}

/**
 * CRITICAL: This makes it work on GitHub Pages
 * Pre-generate static pages for known demo categories
 */
export async function getStaticPaths() {
  const categories = Object.keys(DEMO_CONFIGS);

  return {
    paths: categories.map((category) => ({
      params: { category }
    })),
    fallback: false // Don't generate unknown routes on-demand
  };
}

/**
 * CRITICAL: Use getStaticProps (not getServerSideProps) for static export
 * Data fetching happens client-side, so we just pass the category
 */
export async function getStaticProps({ params }: { params: { category: string } }) {
  return {
    props: {
      category: params.category
    }
  };
}
