import { APIModule } from './api/api.module';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLogMiddleware } from './common/request-log.middleware';
import { resolve } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [resolve('./.env')],
      isGlobal: true,
      expandVariables: true,
    }),
    APIModule,
  ],
  exports: [ConfigModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLogMiddleware).forRoutes('*');
  }
}
