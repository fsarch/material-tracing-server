# MCP Server Module

This module provides an MCP (Model Context Protocol) server integrated into the Material Tracing NestJS application. The MCP server enables AI assistants and other tools to query the material tracing database.

## Integration

The MCP server is now integrated into the main NestJS HTTP server and accessible via REST endpoints under the `/.ai` path. The server runs on the same port as the main application (default: 3000).

## Configuration

### Remote Server URL

When configuring an MCP client to connect to this server, use the following URL format:

```
http://<hostname>:<port>/.ai
```

**Examples:**

- **Local Development**: `http://localhost:3000/.ai`
- **Docker/Network**: `http://material-tracing-server:3000/.ai`
- **Production**: `https://your-domain.com/.ai` (requires reverse proxy with HTTPS)

### MCP Client Configuration

For use in Claude Desktop or other MCP clients, configure the server as:

```json
{
  "mcpServers": {
    "material-tracing": {
      "url": "http://localhost:3000/.ai",
      "type": "http"
    }
  }
}
```

## API Endpoints

The MCP server implements the following HTTP endpoints:

### 1. Initialize Server
```
POST /.ai/initialize
```

Initializes the MCP server and returns server capabilities, protocol version, and server information. This endpoint **must** be called first when establishing a connection.

**Response Example:**
```json
{
  "protocolVersion": "2024-11-05",
  "capabilities": {
    "tools": {}
  },
  "serverInfo": {
    "name": "material-tracing-server",
    "version": "1.0.0"
  }
}
```

### 2. List Available Tools
```
GET /.ai/tools
```

Returns a list of all available MCP tools with their descriptions and input schemas.

**Response Example:**
```json
{
  "tools": [
    {
      "name": "search_materials",
      "description": "Search materials by name or external ID",
      "inputSchema": {
        "type": "object",
        "properties": {
          "search": { "type": "string" },
          "status": { "type": "string" }
        }
      }
    }
  ]
}
```

### 3. List Available Resources (Optional)
```
GET /.ai/resources
```

Returns information about all available API resources and endpoints.

**Response Example:**
```json
{
  "resources": [
    {
      "uri": "/.mcp/initialize",
      "name": "Initialize Server",
      "description": "Initialize the MCP server and get server capabilities",
      "mimeType": "application/json"
    },
    {
      "uri": "/.mcp/tools",
      "name": "List Tools",
      "description": "Get all available MCP tools",
      "mimeType": "application/json"
    }
  ]
}
```

### 4. Call a Tool
```
POST /.mcp/tools/call
Content-Type: application/json

{
  "name": "tool_name",
  "arguments": { /* tool arguments */ }
}
```

Calls a specific tool with the provided arguments and returns the result.

**Request Example:**
```json
{
  "name": "search_materials",
  "arguments": {
    "search": "steel",
    "status": "active"
  }
}
```

**Response Example:**
```json
{
  "content": [
    {
      "type": "text",
      "text": "[Tool result...]"
    }
  ]
}
```

### 4. Health Check
```
GET /.mcp/health
```

Returns the health status of the MCP service.

**Response Example:**
```json
{
  "status": "ok",
  "service": "mcp-server"
}
```

## Quick Start Guide

### 1. Start the Server

```bash
npm run start
# or for development
npm run start:dev
```

The MCP server will be available at `http://localhost:3000/.mcp`

### 2. Test the Endpoints

**Initialize the server:**
```bash
curl -X POST http://localhost:3000/.mcp/initialize
```

**List available tools:**
```bash
curl http://localhost:3000/.mcp/tools
```

**Check health:**
```bash
curl http://localhost:3000/.mcp/health
```

**Call a tool:**
```bash
curl -X POST http://localhost:3000/.mcp/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "search_materials",
    "arguments": {
      "search": "steel"
    }
  }'
```

**Response Example:**
```json
{
  "status": "ok",
  "service": "mcp-server"
}
```

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

## Architecture

The MCP module follows NestJS best practices with a modular, decorator-based architecture:

### Structure

```
src/mcp/
├── decorators/
│   └── mcp-tool.decorator.ts    # @McpTool and @McpToolProvider decorators
├── core/
│   ├── base-tool-provider.ts    # Base class for tool providers
│   └── tool-registry.service.ts # Service that discovers and registers tools
├── modules/
│   ├── manufacturer-mcp.module.ts
│   ├── material-mcp.module.ts
│   ├── material-type-mcp.module.ts
│   ├── part-mcp.module.ts
│   ├── part-type-mcp.module.ts
│   └── short-code-mcp.module.ts # Sub-modules for each resource type
├── tools/
│   ├── manufacturer-tool.provider.ts
│   ├── material-tool.provider.ts
│   ├── material-type-tool.provider.ts
│   ├── part-tool.provider.ts
│   ├── part-type-tool.provider.ts
│   └── short-code-tool.provider.ts # Tool providers with decorated methods
├── mcp.module.ts                 # Main MCP module
├── mcp.service.ts                # MCP server implementation
└── ../mcp-server.ts              # Entry point for running the MCP server
```

### Key Components

**1. Decorators** (`decorators/mcp-tool.decorator.ts`)
- `@McpToolProvider()`: Marks a class as an MCP tool provider
- `@McpTool(metadata)`: Marks a method as an MCP tool with metadata

**2. Base Tool Provider** (`core/base-tool-provider.ts`)
- Provides helper methods for creating success/error responses
- Base class for all tool providers

**3. Tool Providers** (`tools/*.provider.ts`)
- Each resource type has its own tool provider class
- Methods are decorated with `@McpTool` to define MCP tools
- Similar to NestJS controllers but for MCP instead of HTTP

**4. Tool Registry** (`core/tool-registry.service.ts`)
- Automatically discovers all tool providers using reflection
- Registers all decorated methods as MCP tools
- Provides access to tool metadata and handlers

**5. Sub-Modules** (`modules/*-mcp.module.ts`)
- Each resource type has its own module
- Imports the corresponding repository module
- Exports the tool provider for dependency injection

### Example Tool Provider

```typescript
@Injectable()
@McpToolProvider()
export class ManufacturerToolProvider extends BaseToolProvider {
  constructor(private readonly manufacturerService: ManufacturerService) {
    super();
  }

  @McpTool({
    name: 'search_manufacturers',
    description: 'Search manufacturers by name or external ID',
    inputSchema: {
      type: 'object',
      properties: {
        search: { type: 'string', description: 'Search term' },
      },
    },
  })
  async searchManufacturers(args: { search?: string }) {
    const manufacturers = await this.manufacturerService.ListManufacturers(args.search);
    return this.success(manufacturers);
  }
}
```

### Benefits of This Architecture

1. **Modular**: Each resource type is in its own module, making it easy to add/remove functionality
2. **Declarative**: Uses decorators like `@McpTool` to define tools, similar to `@Get`, `@Post` in controllers
3. **Type-Safe**: Full TypeScript support with proper typing
4. **Maintainable**: Clear separation of concerns between tool providers
5. **Scalable**: Easy to add new resource types by creating new tool providers
6. **NestJS-Idiomatic**: Follows NestJS patterns and conventions

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
