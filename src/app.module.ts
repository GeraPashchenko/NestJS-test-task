import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ServiceModule } from './service/service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as config from './ormconfig';
import { ConfigModule } from '@nestjs/config';
import appEnvs from 'src/config/config';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [
    UserModule,
    ServiceModule,
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appEnvs],
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '/service',
      method: RequestMethod.GET,
    });
  }
}
