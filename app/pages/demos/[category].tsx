/**
 * Dynamic demo page for data.gov.rs visualizations
 * Works with GitHub Pages static export via client-side data fetching
 */

import { Box, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from '@mui/material';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { ChartVisualizer } from '@/components/demos/ChartVisualizer';
import { DemoEmpty, DemoError, DemoLayout, DemoLoading } from '@/components/demos/demo-layout';
import { ExportControls } from '@/components/demos/ExportControls';
import { SimpleChart } from '@/components/demos/simple-chart';
import { useDataGovRs } from '@/hooks/use-data-gov-rs';
import { DEMO_CONFIGS, getDemoConfig } from '@/lib/demos/config';

// Import enhanced air quality page
const AirQualityDemo = dynamic(() => import('./air-quality'), { ssr: true });

export default function DemoPage() {
  const router = useRouter();
  const { category } = router.query;
  const [activeTab, setActiveTab] = useState(0);

  // Get demo configuration
  const config = category ? getDemoConfig(category as string) : null;

  // Determine locale (default to Serbian)
  const locale = (router.locale || 'sr') as 'sr' | 'en';

  // Fetch data using custom hook (only if config exists)
  // MUST be called before any conditional returns (Rules of Hooks)
  const { dataset, resource, data, loading, error, refetch } = useDataGovRs({
    searchQuery: config?.searchQuery,
    autoFetch: !!config && category !== 'air-quality'
  });

  // Use enhanced air quality visualization
  if (category === 'air-quality') {
    return <AirQualityDemo />;
  }

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
              {Array.isArray(data) && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Broj redova:</strong> {data.length}
                </Typography>
              )}
 
            </Box>
          </Paper>

          {/* Export Controls */}
          {Array.isArray(data) && data.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <ExportControls
                targetElementId="main-chart-container"
                fileNamePrefix={`${category}-chart`}
              />
            </Box>
          )}

          {/* Chart Visualization */}
          <Paper id="main-chart-container" sx={{ p: 4, mb: 4, backgroundColor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
              📊 Vizualizacija podataka
            </Typography>

            {Array.isArray(data) && data.length > 0 ? (
              <SimpleChart
                data={data}
                chartType={config.chartType}
                width={Math.min(1000, typeof window !== 'undefined' ? window.innerWidth - 100 : 1000)}
                height={450}
              />
            ) : (
              <Typography variant="body2" color="text.secondary">
                Podaci nisu dostupni u formatu pogodnom za vizualizaciju.
              </Typography>
            )}
          </Paper>

          {/* Tabs for different views */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)}>
              <Tab label="📊 Vizualizacija" />
              <Tab label="📋 Tabela podataka" />
            </Tabs>
          </Box>

          {/* Chart View */}
          {activeTab === 0 && Array.isArray(data) && data.length > 0 && (
            <>
              <Box sx={{ mb: 3 }}>
                <ExportControls
                  targetElementId="detailed-chart-container"
                  fileNamePrefix={`${category}-detailed-chart`}
                />
              </Box>
              <Paper id="detailed-chart-container" sx={{ p: 4, mb: 4, backgroundColor: 'white' }}>
                <ChartVisualizer
                  data={data}
                  chartType={config.chartType}
                  title={`${config.chartType.charAt(0).toUpperCase() + config.chartType.slice(1)} vizualizacija`}
                />
              </Paper>
            </>
          )}

          {/* Data Table View */}
          {activeTab === 1 && (
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
                      {data.slice(0, 50).map((row: any, i: number) => (
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

              {Array.isArray(data) && data.length > 50 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  Prikazano prvih 50 od {data.length} redova
                </Typography>
              )}
            </Box>
          )}
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
