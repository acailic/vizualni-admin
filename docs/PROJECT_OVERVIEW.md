# Project Overview - Vizualni Admin

## What is Vizualni Admin?

Vizualni Admin is a web-based data visualization tool specifically designed for Serbian open data from the [Portal otvorenih podataka](https://data.gov.rs). It's a fork of the Swiss [visualize-admin/visualization-tool](https://github.com/visualize-admin/visualization-tool) project, adapted for the Serbian context.

## Purpose

The tool enables:
- **Citizens** to explore and understand public data
- **Journalists** to create data-driven stories
- **Researchers** to analyze government datasets
- **Developers** to build data visualizations
- **Government agencies** to publish data in accessible formats

## Key Features

### 1. Data Browsing
- Search and filter datasets from data.gov.rs
- Browse by organization, topic, or keyword
- Preview dataset metadata and resources
- View dataset statistics and update frequency

### 2. Visualization Creation
- Create interactive charts from datasets
- Support for multiple chart types:
  - Line charts (time series)
  - Bar and column charts
  - Area charts
  - Pie charts
  - Scatterplots
  - Maps (geographic data)
  - Tables
- Customize colors, labels, and formatting
- Add filters and interactive elements

### 3. Data Export
- Export charts as PNG, SVG
- Download data in various formats
- Share visualizations via URL
- Embed charts in websites

### 4. Multilingual Support
- Serbian (Cyrillic and Latin)
- English
- German, French, Italian (inherited from original)

### 5. Responsive Design
- Works on desktop, tablet, and mobile
- Touch-friendly interface
- Accessible for screen readers

## Architecture

### Technology Stack

```
Frontend:
├── Next.js 14 (React framework)
├── TypeScript (type safety)
├── Material-UI (UI components)
├── D3.js (charts and visualizations)
├── Vega (declarative visualizations)
└── styled-components (styling)

Backend:
├── Next.js API routes
├── PostgreSQL (database)
├── Prisma (ORM)
├── GraphQL (data layer)
└── REST API (data.gov.rs integration)

DevOps:
├── Docker (containerization)
├── Yarn (package management)
├── ESLint + Prettier (code quality)
└── Playwright (E2E testing)
```

### Project Structure

```
vizualni-admin/
├── app/                        # Main application code
│   ├── pages/                  # Next.js pages
│   ├── components/             # React components
│   ├── charts/                 # Chart implementations
│   ├── domain/                 # Domain logic
│   │   └── data-gov-rs/        # data.gov.rs API integration
│   ├── configurator/           # Chart configuration UI
│   ├── browse/                 # Dataset browsing
│   ├── locales/                # Translations
│   └── graphql/                # GraphQL schema and resolvers
├── docs/                       # Documentation
├── e2e/                        # End-to-end tests
├── scripts/                    # Build and utility scripts
├── .storybook/                 # Component documentation
└── embed/                      # Embeddable widget
```

## Data Flow

```
┌─────────────────┐
│  data.gov.rs    │ Serbian Open Data Portal
│   API Server    │
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│  API Client     │ app/domain/data-gov-rs/
│  (TypeScript)   │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│  GraphQL Layer  │ Data transformation
│                 │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│  React UI       │ User interface
│  Components     │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│  Chart          │ D3.js / Vega
│  Rendering      │
└─────────────────┘
```

## User Workflow

### Creating a Visualization

1. **Browse Datasets**
   - User searches data.gov.rs
   - Views dataset metadata
   - Previews available resources

2. **Select Data**
   - Choose a dataset
   - Select specific resource (CSV, JSON, etc.)
   - Preview data table

3. **Configure Chart**
   - Select chart type
   - Map data fields to chart axes
   - Add filters
   - Customize appearance

4. **Publish & Share**
   - Save configuration
   - Export as image
   - Generate embed code
   - Share URL

## Integration with data.gov.rs

### API Endpoints Used

- `GET /api/1/datasets/` - List datasets
- `GET /api/1/datasets/{id}/` - Get dataset details
- `GET /api/1/organizations/` - List organizations
- `GET /api/1/resources/{id}/` - Get resource details

### Data Formats Supported

- **CSV** - Comma-separated values
- **JSON** - JavaScript Object Notation
- **GeoJSON** - Geographic data
- **XML** - Extensible Markup Language
- **RDF** - Resource Description Framework

### Authentication

- Read operations: No authentication required
- Write operations: API key required (for future features)

## Customizations from Original

### Changes Made

1. **Branding**
   - Updated name to "Vizualni Admin"
   - Changed from Swiss to Serbian context
   - Updated logos and colors (TODO)

2. **Data Source**
   - Original: SPARQL endpoints (Swiss LINDAS)
   - New: REST API (data.gov.rs)
   - Created new API client

3. **Language**
   - Original: German (default)
   - New: Serbian (default)
   - Added Serbian translations

4. **Configuration**
   - Updated environment variables
   - Changed API endpoints
   - Modified default settings

### Retained Features

- Chart types and rendering
- UI components and layout
- Configuration workflow
- Export functionality
- Embed system
- Database structure
- Authentication system

## Development Principles

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for formatting
- Comprehensive testing (unit, integration, E2E)
- Code review process

### Performance

- Server-side rendering (SSR)
- Static generation where possible
- Image optimization
- Code splitting
- Caching strategies

### Accessibility

- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Internationalization

### Security

- Input validation
- SQL injection prevention
- XSS protection
- CSRF tokens
- Secure headers
- Environment variables for secrets

## Deployment Options

### Production Environments

- **Docker** - Containerized deployment
- **Vercel** - Serverless Next.js hosting
- **Heroku** - Platform-as-a-Service
- **AWS** - EC2, ECS, or Lambda
- **Google Cloud** - Cloud Run
- **Self-hosted** - On-premises server

### Requirements

- Node.js 18+
- PostgreSQL 12+
- 2GB RAM minimum
- 10GB storage minimum

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Areas for Contribution

- Adding Serbian translations
- Improving data.gov.rs integration
- Creating new chart types
- Bug fixes
- Documentation improvements
- Performance optimizations

## Roadmap

### Phase 1 (Current)
- [x] Fork and adapt structure
- [x] Create API client
- [x] Add Serbian language support
- [ ] Test with real data
- [ ] Update branding

### Phase 2 (Next)
- [ ] Enhanced data.gov.rs integration
- [ ] Complete Serbian translations
- [ ] UI/UX improvements for Serbian users
- [ ] Performance optimizations
- [ ] Mobile app support

### Phase 3 (Future)
- [ ] Real-time data updates
- [ ] Collaborative features
- [ ] Advanced analytics
- [ ] Custom plugins
- [ ] AI-powered insights

## Support and Community

### Getting Help

- **Documentation**: Check the docs/ folder
- **Issues**: GitHub Issues for bugs and features
- **Discussions**: GitHub Discussions for questions
- **Email**: Contact maintainers

### Resources

- [data.gov.rs](https://data.gov.rs) - Serbian Open Data Portal
- [API Documentation](https://data.gov.rs/apidoc/) - API reference
- [Original Project](https://github.com/visualize-admin/visualization-tool) - Upstream repository

## License

BSD-3-Clause License - See LICENSE file for details.

## Acknowledgments

- **Original Authors**: Federal Office for the Environment FOEN (Switzerland)
- **Serbian Open Data Team**: For maintaining data.gov.rs
- **Contributors**: All who contribute to open data ecosystem

## Contact

- **Repository**: https://github.com/acailic/vizualni-admin
- **Issues**: https://github.com/acailic/vizualni-admin/issues
- **Maintainer**: acailic

---

Last Updated: November 18, 2025
