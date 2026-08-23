import { FsArchAppBuilder } from "@fsarch/server";
import { McpStrategy, StreamableHttpTransport } from '@rekog/mcp-nest';
import { AppModule } from "./app.module.js";
import { DATABASE_OPTIONS } from "./database/index.js";

async function bootstrap() {
  const app = await new FsArchAppBuilder(AppModule, {
    name: 'Material-Tracing-Server',
    version: '1.0.0',
  })
    .addSwagger({
      title: 'Material-Tracing-Server',
      description: 'The Material-Tracing-Server API description',
      version: '1.0',
    })
    .enableAuth()
    .setDatabase(DATABASE_OPTIONS)
    .build();

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
