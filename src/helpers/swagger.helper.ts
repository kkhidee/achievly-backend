import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

export const setupSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Achievly API')
    .setDescription('Swagger API documentation for Achievly app')
    .setVersion('3.1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  fs.writeFileSync('./openapi.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
};
