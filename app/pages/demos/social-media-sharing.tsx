/**
 * Social Media Sharing Demo
 * Showcases how to share visualizations on LinkedIn, X.com (Twitter), and Facebook
 */

import { useRef } from "react";

import { useRouter } from "next/router";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@mui/material";

import { ChartVisualizer } from "@/components/demos/ChartVisualizer";
import {
  DemoError,
  DemoLayout,
  DemoLoading,
} from "@/components/demos/demo-layout";
import { PublishActions } from "@/components/publish-actions";
import { SocialMediaShare } from "@/components/social-media-share";
import { useDataGovRs } from "@/hooks/use-data-gov-rs";
import { Icon } from "@/icons";

export default function SocialMediaSharingDemo() {
  const router = useRouter();
  const locale = (router.locale || "en") as "en" | "sr";
  const chartWrapperRef = useRef<HTMLDivElement>(null);

  // Fetch sample data for demonstration
  const { data, loading, error } = useDataGovRs({
    searchQuery: "population",
    autoFetch: true,
  });

  if (loading) return <DemoLoading />;
  if (error) return <DemoError error={error} />;

  const sampleData = data?.slice(0, 10) || [
    { month: "Jan", value: 120 },
    { month: "Feb", value: 150 },
    { month: "Mar", value: 180 },
    { month: "Apr", value: 140 },
    { month: "May", value: 200 },
    { month: "Jun", value: 220 },
  ];

  return (
    <DemoLayout
      title="Social Media Sharing for Visualizations"
      description="Learn how to share your data visualizations on LinkedIn, X.com (Twitter), Facebook, and other social media platforms"
    >
      <Grid container spacing={4}>
        {/* Introduction */}
        <Grid item xs={12}>
          <Alert severity="info" icon={<Icon name="share" />}>
            This demo showcases social media sharing capabilities for data
            visualizations. Share your charts on LinkedIn, X.com (Twitter),
            Facebook, or download them as images for manual sharing.
          </Alert>
        </Grid>

        {/* Sample Visualization */}
        <Grid item xs={12} lg={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Sample Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              This chart demonstrates the visualization you can share on social
              media
            </Typography>

            <Box ref={chartWrapperRef}>
              <ChartVisualizer
                data={sampleData}
                title="Monthly Data Trends"
                description="Sample data showing trends over time"
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Standard Publish Actions */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Standard Share & Embed
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                The built-in share button now includes LinkedIn, X (Twitter),
                and Facebook sharing
              </Typography>
              <PublishActions
                chartWrapperRef={chartWrapperRef}
                configKey="demo-social-sharing"
                locale={locale}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Enhanced Social Media Sharing */}
        <Grid item xs={12} lg={4}>
          <Paper elevation={2} sx={{ position: "sticky", top: 20 }}>
            <SocialMediaShare
              chartWrapperRef={chartWrapperRef}
              configKey="demo-social-sharing"
              locale={locale}
              chartTitle="Monthly Data Trends"
              chartDescription="Sample visualization showing data trends over time - created with visualize.admin.ch"
            />
          </Paper>
        </Grid>

        {/* Feature Overview */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Social Media Sharing Features
            </Typography>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Icon name="linkedIn" size={32} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        LinkedIn
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Share professional data visualizations directly to your
                      LinkedIn feed with a single click
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Icon name="twitter" size={32} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        X (Twitter)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Tweet your visualizations with customizable text and
                      hashtags to reach your audience
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Icon name="facebook" size={32} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Facebook
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Post your charts to Facebook to engage with your
                      community and followers
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6} lg={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Icon name="download" size={32} />
                      <Typography variant="h6" sx={{ ml: 1 }}>
                        Download PNG
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Download high-quality PNG images with embedded metadata
                      for any platform
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Implementation Guide */}
        <Grid item xs={12}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              How to Use Social Media Sharing
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                1. Basic Sharing (Built into PublishActions)
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}
              >
                <code>
                  {`import { PublishActions } from "@/components/publish-actions";

<PublishActions
  chartWrapperRef={chartWrapperRef}
  configKey="your-chart-id"
  locale={locale}
/>`}
                </code>
              </Paper>

              <Typography variant="h6" gutterBottom>
                2. Enhanced Sharing (Standalone Component)
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, mb: 3, bgcolor: "grey.50" }}
              >
                <code>
                  {`import { SocialMediaShare } from "@/components/social-media-share";

<SocialMediaShare
  chartWrapperRef={chartWrapperRef}
  configKey="your-chart-id"
  locale={locale}
  chartTitle="Your Chart Title"
  chartDescription="Description for social sharing"
/>`}
                </code>
              </Paper>

              <Typography variant="h6" gutterBottom>
                3. Features
              </Typography>
              <ul>
                <li>
                  <Typography variant="body2">
                    <strong>Quick Share Buttons:</strong> One-click sharing to
                    LinkedIn, X (Twitter), and Facebook
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Download as PNG:</strong> Export visualizations
                    with embedded metadata
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Customizable Text:</strong> Edit share text before
                    posting
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Copy to Clipboard:</strong> Easy URL and text
                    copying
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    <strong>Email Sharing:</strong> Share via email with
                    pre-filled subject and body
                  </Typography>
                </li>
              </ul>
            </Box>
          </Paper>
        </Grid>

        {/* Best Practices */}
        <Grid item xs={12}>
          <Alert severity="success">
            <Typography variant="subtitle2" gutterBottom>
              <strong>Best Practices for Social Media Sharing:</strong>
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              <li>
                Keep titles concise and engaging (under 100 characters for
                Twitter/X)
              </li>
              <li>
                Use descriptive text that explains the key insight from your
                visualization
              </li>
              <li>Add relevant hashtags to increase discoverability</li>
              <li>
                For LinkedIn, consider adding professional context or industry
                insights
              </li>
              <li>
                Download PNG images for platforms with better image support
                (Instagram, etc.)
              </li>
              <li>Test your share on mobile devices for optimal appearance</li>
            </ul>
          </Alert>
        </Grid>
      </Grid>
    </DemoLayout>
  );
}
