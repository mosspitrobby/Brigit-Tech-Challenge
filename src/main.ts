import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DTOValidationPipe } from './common/dto-validation.pipe';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { IncomingMessage, ServerResponse } from 'http';
import { NestFactory } from '@nestjs/core';
import { RawBodyRequest, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

(async () => {
  // app initialization
  const cors = <CorsOptions>{};
  const { CORS_ORIGINS = '' } = process.env;
  if (CORS_ORIGINS) {
    cors.origin = CORS_ORIGINS?.split(',');
    cors.credentials = true;
  }
  const app = await NestFactory.create(AppModule, {
    cors,
    rawBody: true,
  });
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new DTOValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.use(helmet());
  const rawBodyBuffer = (
    req: IncomingMessage,
    _: ServerResponse<IncomingMessage>,
    buffer: Buffer,
  ) => {
    if (buffer?.length) {
      (<RawBodyRequest<Request>>(<unknown>req)).rawBody = buffer;
    }
  };
  app.use(bodyParser.json({ verify: rawBodyBuffer, limit: '5mb' }));
  app.use(
    bodyParser.urlencoded({
      verify: rawBodyBuffer,
      limit: '5mb',
      extended: true,
    }),
  );
  const port = process.env.PORT || 8080;
  const host = process.env.HOST || '0.0.0.0';
  // swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Bridgit Technical Comptetence API')
    .setDescription(
      `This is the Swagger interface for the technical competence API.  You can use this to experiment with the API and learn about payloads and error messages for the API endpoints you will be integrating.`,
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, <SwaggerCustomOptions>{
    swaggerOptions: {
      plugins: {
        wrapComponents: {
          curl: () => () => null,
        },
      },
    },
  });
  // start server
  const server = await app.listen(port, host);
  server.keepAliveTimeout = 61 * 1000;
  server.headersTimeout = 62 * 1000;
})();
