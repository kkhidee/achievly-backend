import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { setupSwagger } from './helpers/swagger.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.use(cookieParser());

  app.enableCors({
    origin: [config.get('CLIENT_URL')],
    credentials: true,
    exposedHeaders: 'set-cookie',
  });

  setupSwagger(app);

  const port = config.get('PORT') || 4000;

  await app.listen(port);

  return port;
}

bootstrap().then(port => console.log(`Server started on port ${port}`));
