# Vizualni Admin - Serbian Open Data Visualization Tool 🇷🇸

A visualization tool for Serbian open data from [data.gov.rs](https://data.gov.rs). 🇷🇸

**🌐 Live Demo**: [https://acailic.github.io/vizualni-admin/](https://acailic.github.io/vizualni-admin/)

## About

This project is a fork/adaptation of other visualization tool, customized to work with Serbian open data from the [Portal otvorenih podataka](https://data.gov.rs).

The tool allows users to:
- Browse and visualize datasets from data.gov.rs
- Create interactive charts and visualizations
- Embed visualizations in websites and applications
- Export data in various formats

## Data Source

This tool is configured to work with the Serbian Open Data Portal:
- **Portal**: https://data.gov.rs
- **API**: https://data.gov.rs/api/1/
- **API Documentation**: https://data.gov.rs/apidoc/

The portal provides access to datasets from Serbian public institutions in machine-readable formats.

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Styling**: Material-UI, styled-components
- **Charts**: D3.js, Vega
- **Data Fetching**: GraphQL, REST API

## Development Environment

### Prerequisites

- Node.js (v18 or later)
- Yarn package manager
- Docker and Docker Compose (for PostgreSQL)
- PostgreSQL database

### Setting up the development environment

1. Make sure Docker is running
2. Start the PostgreSQL database:
   ```sh
   docker-compose up
   ```

3. Install dependencies and set up the project:
   ```sh
   yarn setup:dev
   ```

### Running the development server

Once the application is set up, start the development server:

```sh
yarn dev
```

For SSL (required for authentication):
```sh
yarn dev:ssl
```

The application will be available at:
- HTTP: http://localhost:3000
- HTTPS: https://localhost:3000

### Building for production

```sh
yarn build
```

### GitHub Pages Deployment

The project is configured for automatic deployment to GitHub Pages. See [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md) for details.

**Live demo**: [https://acailic.github.io/vizualni-admin/](https://acailic.github.io/vizualni-admin/)

To build for GitHub Pages locally:
```sh
NEXT_PUBLIC_BASE_PATH=/vizualni-admin yarn build:static
```

### Running tests

```sh
yarn test           # Run unit tests
yarn e2e           # Run end-to-end tests
```

## Configuration

Configuration is done through environment variables. Copy `.env.example` to `.env.local` and adjust the settings:

```sh
cp .env.example .env.local
```

Key configuration options:
- Database connection (PostgreSQL)
- API endpoints for data.gov.rs
- Authentication settings
- Internationalization settings (Serbian/English)

## Features

### Data Visualization
- Multiple chart types (line, bar, area, pie, map, etc.)
- Interactive filtering and exploration
- Responsive design for all devices
- Export to PNG, SVG, and data formats

### Data Integration
- Integration with data.gov.rs REST API
- Support for various data formats (CSV, JSON, XML)
- Real-time data updates
- Data caching and optimization

### Internationalization
- Serbian (sr) and English (en) language support
- Cyrillic and Latin script support
- Locale-specific number and date formatting

## Project Structure

```
├── app/                # Next.js application code
│   ├── pages/         # Next.js pages and routes
│   ├── components/    # React components
│   ├── charts/        # Chart components and configurations
│   ├── domain/        # Domain logic and data models
│   ├── graphql/       # GraphQL queries and mutations
│   └── locales/       # Translation files
├── embed/             # Embeddable chart widget
├── docs/              # Documentation
├── e2e/               # End-to-end tests
├── scripts/           # Build and utility scripts
└── .storybook/        # Storybook configuration
```

## License

This project is licensed under the BSD-3-Clause License - see the [LICENSE](LICENSE) file for details.

## Original Project

This project is based on similar projects like  [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool) created by the Swiss Federal Office for the Environment (FOEN).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions:
- GitHub Issues: [Create an issue](https://github.com/acailic/vizualni-admin/issues)
- Data Portal Support: [data.gov.rs](https://data.gov.rs)

## Acknowledgments

- Original project by [visualize-admin](https://github.com/visualize-admin)
- Serbian Open Data Portal team
- All contributors to the open data ecosystem
