// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withMDX = require("@next/mdx")();
const withPreconstruct = require("@preconstruct/next");
const { withSentryConfig } = require("@sentry/nextjs");
const { IgnorePlugin } = require("webpack");

const pkg = require("../package.json");

const { defaultLocale, locales } = require("./locales/locales.json");

// Populate build-time variables from package.json
process.env.NEXT_PUBLIC_VERSION = `v${pkg.version}`;
process.env.NEXT_PUBLIC_GITHUB_REPO = pkg.repository.url.replace(
  /(\/|\.git)$/,
  ""
);
// Dynamic NEXTAUTH_URL logic
const isVercelPreview = !!process.env.VERCEL_URL;

// Dynamically set NEXTAUTH_URL
if (isVercelPreview) {
  process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

// Only log in development mode
if (process.env.NODE_ENV === 'development') {
  console.log("NEXTAUTH_URL:", process.env.NEXTAUTH_URL);
  console.log("Version", process.env.NEXT_PUBLIC_VERSION);
  console.log("Commit", process.env.NEXT_PUBLIC_COMMIT);
  console.log("GitHub Repo", process.env.NEXT_PUBLIC_GITHUB_REPO);
  console.log("Extra Certs", process.env.NODE_EXTRA_CA_CERTS);
  console.log("Prevent search bots", process.env.PREVENT_SEARCH_BOTS);
}

// GitHub Pages configuration
const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

module.exports = withPreconstruct(
  withBundleAnalyzer(
    withMDX({
      output: isGitHubPages ? "export" : "standalone",
      basePath: basePath,
      assetPrefix: basePath,
      images: {
        unoptimized: isGitHubPages,
      },
      i18n: isGitHubPages ? undefined : {
        locales,
        defaultLocale,
      },

      headers: async () => {
        const headers = [];

        headers.push({
          source: "/:path*",
          headers: [
            {
              key: "X-Content-Type-Options",
              value: "nosniff",
            },
            {
              key: "X-Frame-Options",
              value: "SAMEORIGIN",
            },
            {
              key: "X-XSS-Protection",
              value: "1; mode=block",
            },
            {
              key: "Referrer-Policy",
              value: "strict-origin-when-cross-origin",
            },
            {
              key: "Permissions-Policy",
              value: "camera=(), microphone=(), geolocation=()",
            },
          ],
        });

        // See https://content-security-policy.com/ & https://developers.google.com/tag-platform/security/guides/csp
        if (!(process.env.DISABLE_CSP && process.env.DISABLE_CSP === "true")) {
          headers[0].headers.push({
            key: "Content-Security-Policy",
            value: [
              `default-src 'self' 'unsafe-inline'${
                process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
              } https://*.sentry.io https://vercel.live/ https://vercel.com https://*.googletagmanager.com`,
              `script-src 'self' 'unsafe-inline'${
                process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""
              } https://*.sentry.io https://vercel.live/ https://vercel.com https://*.googletagmanager.com https://api.mapbox.com`,
              `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net`,
              `font-src 'self'`,
              `form-action 'self'`,

              // * to allow WMS / WMTS endpoints
              `connect-src 'self' *`,

              // * to allow loading legend images from custom WMS / WMTS endpoints and data: to allow downloading images
              `img-src 'self' * data: blob:`,
              `script-src-elem 'self' 'unsafe-inline' https://vercel.live https://vercel.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://api.mapbox.com https://cdn.jsdelivr.net`,
              `worker-src 'self' blob:`,
            ].join("; "),
          });
        }

        if (process.env.PREVENT_SEARCH_BOTS === "true") {
          headers[0].headers.push({
            key: "X-Robots-Tag",
            value: "noindex, nofollow",
          });
        }

        return headers;
      },

      pageExtensions: ["js", "ts", "tsx", "mdx"],

      // Enable SWC minifier for faster builds
      swcMinify: true,

      // Optimize production builds
      productionBrowserSourceMaps: false,

      // Experimental optimizations for faster builds
      experimental: {
        // Optimize package imports to reduce bundle size
        optimizePackageImports: ['@mui/material', '@mui/icons-material', 'date-fns', 'lodash'],
        // Enable parallel compilation
        cpus: require('os').cpus().length - 1 || 1,
      },

      // Configure logging to show only errors
      logging: {
        level: 'error',
      },

      eslint: {
        // ESLint enabled in production builds to ensure code quality
        ignoreDuringBuilds: false,
      },

      webpack(config, { dev }) {
        config.module.rules.push({
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: "graphql-tag/loader",
        });

        /* Disable source maps in production for faster builds */
        if (!dev) {
          config.devtool = false;
        }

        config.resolve.extensions.push(dev ? ".dev.ts" : ".prod.ts");
        config.resolve.alias = {
          ...config.resolve.alias,
          "mapbox-gl": "maplibre-gl",
        };
        // For some reason these need to be ignored for serverless target
        config.plugins.push(
          new IgnorePlugin({ resourceRegExp: /^(pg-native|vue)$/ })
        );

        return config;
      },

      async redirects() {
        return [
          {
            source: "/storybook",
            destination: "/storybook/index.html",
            permanent: true,
          },
        ];
      },
    })
  )
);

module.exports = withSentryConfig(
  module.exports,
  {
    silent: true,
    // Disable build-time Sentry plugins to avoid org configuration errors
    disableServerWebpackPlugin: true,
    disableClientWebpackPlugin: true,
    hideSourceMaps: true,
  }
);
