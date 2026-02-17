# MCP Server Module

This module provides an MCP (Model Context Protocol) server integrated into the Material Tracing NestJS application. The MCP server enables AI assistants and other tools to query the material tracing database.

## Features

The MCP server provides tools to query the following resource types:

- **Manufacturers**: Search and get manufacturers by ID
- **Materials**: Search and get materials by ID
- **Material Types**: Search and get material types by ID
- **Parts**: Search and get parts by ID
- **Part Types**: Search and get part types by ID
- **Short Codes**: Search and get short codes by ID

## Available Tools

### Manufacturers

- `search_manufacturers`: Search manufacturers by name or external ID
  - Parameters:
    - `search` (optional): Search term for manufacturer name or external ID

- `get_manufacturer`: Get a single manufacturer by ID
  - Parameters:
    - `id` (required): Manufacturer ID

### Materials

- `search_materials`: Search materials by name or external ID
  - Parameters:
    - `search` (optional): Search term for material name or external ID
    - `status` (optional): Filter by status (`all`, `active`, `archived`, or `checked-out`)

- `get_material`: Get a single material by ID
  - Parameters:
    - `id` (required): Material ID

### Material Types

- `search_material_types`: Search material types by name or external ID
  - Parameters:
    - `search` (optional): Search term for material type name or external ID
    - `status` (optional): Filter by status (`all`, `active`, or `archived`)

- `get_material_type`: Get a single material type by ID
  - Parameters:
    - `id` (required): Material type ID

### Parts

- `search_parts`: Search parts by name or external ID
  - Parameters:
    - `search` (optional): Search term for part name or external ID
    - `status` (optional): Filter by status (`all`, `active`, `archived`, or `checked-out`)

- `get_part`: Get a single part by ID
  - Parameters:
    - `id` (required): Part ID

### Part Types

- `search_part_types`: Search part types by name or external ID
  - Parameters:
    - `search` (optional): Search term for part type name or external ID
    - `status` (optional): Filter by status (`all`, `active`, or `archived`)

- `get_part_type`: Get a single part type by ID
  - Parameters:
    - `id` (required): Part type ID

### Short Codes

- `search_short_codes`: Search short codes by code
  - Parameters:
    - `search` (optional): Search term for short code

- `get_short_code`: Get a single short code by ID
  - Parameters:
    - `id` (required): Short code ID

## Status Parameter

The `status` parameter allows filtering resources based on their state:

- `active` (default): Returns only non-archived resources
- `archived`: Returns only archived resources
- `checked-out`: Returns only checked-out resources (applicable to materials and parts)
- `all`: Returns all resources regardless of archive or checkout status

## Running the MCP Server

The MCP server runs as a separate process from the main HTTP server. To start the MCP server:

```bash
# Build the application first
npm run build

# Start the MCP server
npm run start:mcp
```

The MCP server uses stdio transport, which is suitable for integration with AI assistants like Claude Desktop.

## Configuration for Claude Desktop

To use the MCP server with Claude Desktop, add the following configuration to your Claude Desktop config file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "material-tracing-server": {
      "command": "node",
      "args": [
        "/absolute/path/to/material-tracing-server/dist/mcp-server.js"
      ],
      "env": {
        "NODE_ENV": "production",
        "CONFIG_PATH": "/absolute/path/to/your/config.yaml"
      }
    }
  }
}
```

### Configuration File

The MCP server uses the same configuration as the main application. Create a `config.yaml` file with your database configuration:

**PostgreSQL/CockroachDB Example:**

```yaml
database:
  type: postgres  # or cockroachdb
  host: localhost
  port: 5432
  username: your_username
  password: your_password
  database: material_tracing
```

**SQLite Example:**

```yaml
database:
  type: sqlite
  database: /path/to/database.sqlite
```

Set the `CONFIG_PATH` environment variable to point to your configuration file.

## Usage Examples

Once configured with Claude Desktop, you can ask questions like:

- "Search for materials containing 'steel'"
- "Get all archived part types"
- "Show me checked-out materials"
- "Find manufacturer by ID [uuid]"
- "Search for short code 'ABC123'"

## Integration

The MCP module is integrated into the main application module and uses existing repository services to access the database. This ensures consistency with the REST API and allows the MCP server to leverage the same business logic.

## Architecture

```
src/mcp/
├── mcp.module.ts       # Module definition with service imports
├── mcp.service.ts      # MCP server implementation with tool handlers
└── ../mcp-server.ts    # Entry point for running the MCP server
```

The MCP module imports repository modules for:
- ManufacturerModule
- MaterialModule
- MaterialTypeModule
- PartModule
- PartTypeModule
- ShortCodeModule

These repository services handle all database operations and business logic.
