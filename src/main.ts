import { FsArchAppBuilder } from "@fsarch/server";
import { McpStrategy, StreamableHttpTransport } from '@rekog/mcp-nest';
import { AppModule } from "./app.module.js";
import { DATABASE_OPTIONS } from "./database/index.js";
import { REGISTERED_CUSTOM_RESOURCES } from "./custom-resources.config.js";

async function bootstrap() {
  const appBuilder = new FsArchAppBuilder(AppModule, {
    name: 'Material-Tracing-Server',
    version: '1.0.0',
  })
    .addSwagger({
      title: 'Material-Tracing-Server',
      description: 'The Material-Tracing-Server API description',
      version: '1.0',
    })
    .enableAuth()
    .setDatabase(DATABASE_OPTIONS);

  for (const resource of REGISTERED_CUSTOM_RESOURCES) {
    appBuilder.addCustomResource(resource);
  }

  const app = await appBuilder.build();

  const mcp = new McpStrategy({
    name: 'material-tracing-server',
    version: '1.0.0',
    capabilities: {
      tools: {},
    },
    transports: [new StreamableHttpTransport({ endpoint: '/.ai/mcp' })],
  });

  mcp.setHttpAdapter(app.getHttpAdapter());
  app.connectMicroservice({ strategy: mcp });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
