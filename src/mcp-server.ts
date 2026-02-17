import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { McpService } from './mcp/mcp.service.js';
import { PinoLogger } from "./utils/logger/pino-logger.service.js";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: PinoLogger.Instance,
  });

  const mcpService = app.get(McpService);
  await mcpService.start();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    await mcpService.stop();
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await mcpService.stop();
    await app.close();
    process.exit(0);
  });
}

bootstrap();
