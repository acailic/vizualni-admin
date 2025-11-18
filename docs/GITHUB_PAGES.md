# GitHub Pages Deployment

This guide explains how to deploy Vizualni Admin to GitHub Pages.

## Overview

The project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch. The site will be available at:

`https://acailic.github.io/vizualni-admin/`

## Configuration

### Automatic Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-github-pages.yml`) that:

1. Builds the Next.js app as a static export
2. Compiles translations
3. Uploads the static files to GitHub Pages
4. Deploys to the GitHub Pages environment

### Manual Deployment

You can also trigger a deployment manually:

1. Go to the repository on GitHub
2. Navigate to **Actions** → **Deploy to GitHub Pages**
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Enabling GitHub Pages

To enable GitHub Pages for this repository:

1. Go to repository **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. Save the configuration

The next push to `main` will automatically deploy the site.

## Local Testing

To test the static export locally:

```bash
# Build the static site
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static

# Serve the output directory
cd app/out
npx serve
```

Then open `http://localhost:3000/vizualni-admin/` in your browser.

## Important Notes

### Database Features

⚠️ **Note**: GitHub Pages serves static files only. Features requiring a database will not work in the GitHub Pages deployment, including:

- Saving chart configurations
- User authentication
- Database-backed features

The GitHub Pages deployment is ideal for:
- Demonstrating the UI and chart capabilities
- Browsing static examples
- Showcasing the visualization tool

For full functionality, deploy to a platform that supports Node.js and PostgreSQL (see [DEPLOYMENT.md](DEPLOYMENT.md)).

### Base Path

The app is configured to work with the `/vizualni-admin` base path when deployed to GitHub Pages. This is handled automatically through the `NEXT_PUBLIC_BASE_PATH` environment variable.

### API Integration

When deployed to GitHub Pages, the app will connect to data.gov.rs API for fetching datasets. Make sure any API keys are properly configured as GitHub repository secrets if needed.

## Configuration Details

### Next.js Export

The `next.config.js` is configured to detect when building for GitHub Pages:

```javascript
const isGitHubPages = process.env.NEXT_PUBLIC_BASE_PATH !== undefined;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

module.exports = {
  output: isGitHubPages ? "export" : "standalone",
  basePath: basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: isGitHubPages,
  },
  // ...
}
```

### Environment Variables

GitHub Pages builds use:
- `NEXT_PUBLIC_BASE_PATH=/vizualni-admin` - Sets the base path for assets
- `NEXT_PUBLIC_VERSION` - Populated from package.json
- `NEXT_PUBLIC_GITHUB_REPO` - Populated from package.json

## Troubleshooting

### Pages Not Updating

If the site doesn't update after a push:
1. Check the **Actions** tab for workflow status
2. Look for any build errors in the workflow logs
3. Verify the `main` branch has the latest changes

### 404 Errors

If you get 404 errors:
1. Ensure GitHub Pages is enabled in repository settings
2. Check that the base path is correct
3. Verify the workflow completed successfully

### Build Failures

If the build fails:
1. Check the workflow logs in the **Actions** tab
2. Common issues:
   - Missing dependencies: Run `yarn install` locally to verify
   - TypeScript errors: Run `yarn typecheck` locally
   - Build errors: Run `yarn build:static` locally to reproduce

## Limitations

GitHub Pages deployments have some limitations compared to full deployments:

| Feature | GitHub Pages | Full Deployment |
|---------|-------------|-----------------|
| Static charts | ✅ Yes | ✅ Yes |
| Browse datasets | ✅ Yes | ✅ Yes |
| Create visualizations | ✅ Yes | ✅ Yes |
| Save configurations | ❌ No | ✅ Yes |
| User accounts | ❌ No | ✅ Yes |
| Database storage | ❌ No | ✅ Yes |
| Server-side rendering | ❌ No | ✅ Yes |
| API routes | ❌ No | ✅ Yes |

## Custom Domain

To use a custom domain with GitHub Pages:

1. Add a `CNAME` file to `app/public/` with your domain
2. Configure DNS settings for your domain
3. Enable HTTPS in repository settings

See [GitHub's custom domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) for details.

## Security

- GitHub Pages sites are always public
- Don't include sensitive data or API keys in the static export
- Use GitHub repository secrets for any sensitive environment variables

## Further Reading

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Next.js Static Export](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
