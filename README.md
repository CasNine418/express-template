# Express TypeScript Template Repositories

[English](https://github.com/CasNine418/express-template/blob/master/README.md) | [中文](https://github.com/CasNine418/express-template/blob/master/README_zh_CN.md)

A modern web application template built with Express and TypeScript, integrating common middleware and best practices.

## Project Features

- Built on Express 5.x and TypeScript
- Modular route controller architecture
- Integrated security middleware (Helmet, CORS)
- Request rate limiting
- Logging functionality
- Configuration management (TOML format)
- HTTPS support
- Database connection support (MySQL, PostgreSQL, etc.)
- Packaging and deployment support

## Directory Structure

```
.
├── src/
│   ├── api/                 # API controllers
│   │   ├── user/            # Example user-related controllers
│   │   └── base_controller.ts # Base controller class
│   ├── middleware/          # Custom middleware
│   ├── model/               # Data models and response formats
│   └── utils/               # Utility functions
├── app.ts                   # Application entry point
├── config.toml              # Configuration file
├── config.ts                # Configuration loader
└── ...
```

## Quick Start

### Prerequisites

- Node.js >= 14.x
- npm or pnpm

### Install Dependencies

```bash
# Using npm
npm install

# Or using pnpm
pnpm install
```

### Configuration

Edit the `config.toml` file to configure server settings:

```toml
[server.base]
port = 3000                    # Service port
cors_origin = "*"              # CORS settings
mode = "http"                  # Operation mode (http or https)
env = "development"            # Environment (development, production, test)

[server.database]
driver = "mysql"               # Database type
host = "localhost"             # Database host
port = 3306                    # Database port
user = "your_username"         # Database username
password = "your_password"     # Database password
database = "your_database"     # Database name
```

### Run the Project

```bash
# Run in development mode
npm start

# Build the project
npm run build

# Package as executable
npm run pack
```

## API Examples

The project includes an example user management controller:

```
GET    /users        # Get all users
GET    /users/:id    # Get specific user
POST   /users        # Create user
PUT    /users/:id    # Update user
DELETE /users/:id    # Delete user
```

## Deployment

### Build Project

```bash
npm run build
```

### Package as Executable

```bash
npm run pack
```

This will generate a standalone executable that can run on servers without Node.js environment.

## License

[MIT](LICENSE)
