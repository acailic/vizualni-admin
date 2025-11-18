# Quick Start Guide

This guide will help you get Vizualni Admin up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or later)
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **Yarn** (v1.22 or later)
   - Install: `npm install -g yarn`
   - Verify: `yarn --version`

3. **Docker Desktop** (for PostgreSQL database)
   - Download from https://www.docker.com/products/docker-desktop
   - Verify: `docker --version`

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/acailic/vizualni-admin.git
cd vizualni-admin
```

### 2. Start the Database

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port 5432.

### 3. Install Dependencies

```bash
yarn install
```

This may take several minutes depending on your internet connection.

### 4. Set Up Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure at minimum:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/vizualni_admin
DATA_GOV_RS_API_URL=https://data.gov.rs/api/1
```

### 5. Run Database Migrations

```bash
yarn db:migrate:dev
```

### 6. Compile Translations

```bash
yarn locales:compile
```

### 7. Start Development Server

```bash
yarn dev
```

The application will be available at http://localhost:3000

## Verify Installation

1. Open http://localhost:3000 in your browser
2. You should see the Vizualni Admin interface
3. Try browsing datasets from data.gov.rs

## Common Issues

### Port 5432 Already in Use

If you already have PostgreSQL running:
- Stop your local PostgreSQL service
- Or change the port in `docker-compose.yml`

### Port 3000 Already in Use

If port 3000 is occupied:
```bash
yarn dev -p 3001
```

### Database Connection Issues

Verify PostgreSQL is running:
```bash
docker ps
```

You should see a container named `vizualni-admin-db` or similar.

### Dependencies Installation Fails

Try clearing the cache:
```bash
yarn cache clean
yarn install
```

## Next Steps

- Read the full [README.md](README.md) for more details
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- See [docs/SERBIAN_DATA_INTEGRATION.md](docs/SERBIAN_DATA_INTEGRATION.md) for API integration details

## Getting Help

- Check existing [GitHub Issues](https://github.com/acailic/vizualni-admin/issues)
- Create a new issue if you encounter problems
- Consult the [original project documentation](https://github.com/visualize-admin/visualization-tool)

## Development Workflow

1. Make changes to the code
2. Test in the browser (hot reload is enabled)
3. Run tests: `yarn test`
4. Lint code: `yarn lint`
5. Type check: `yarn typecheck`

## Production Build

To build for production:

```bash
yarn build
yarn start
```

## Docker Deployment

Build the Docker image:

```bash
docker build -t vizualni-admin .
```

Run the container:

```bash
docker run -p 3000:3000 -e DATABASE_URL=your_db_url vizualni-admin
```

For more deployment options, see the [README.md](README.md).
