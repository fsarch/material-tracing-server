/**
 * This file is kept for backwards compatibility.
 * MCP Server is now integrated into the main Nest.JS server and available at:
 * - GET  /.mcp/tools       - List all available tools
 * - POST /.mcp/tools/call  - Call a specific tool
 * - GET  /.mcp/health      - Health check
 *
 * The server runs directly on the main HTTP server port (default: 3000).
 *
 * You can use the main entry point (main.ts) to start the server.
 * This file is deprecated and no longer needed.
 */

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { PinoLogger } from './utils/logger/pino-logger.service.js';

async function bootstrap() {
  // Start the full Nest.JS server with integrated MCP endpoints
  const app = await NestFactory.create(AppModule, {
    logger: PinoLogger.Instance,
  });

  app.enableCors();

  await app.listen(process.env.MCP_PORT ?? process.env.PORT ?? 3000);

  console.log(
    `MCP Server is running and available at /.mcp on port ${process.env.MCP_PORT ?? process.env.PORT ?? 3000}`,
  );
}

bootstrap();


