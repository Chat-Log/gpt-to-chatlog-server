import { Module } from '@nestjs/common';
import { TopicModule } from './topic/infra/topic.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/infra/user.module';
import { ExceptionModule } from './common/exception/exception.module';
import { ModelsModule } from './ai-models/models.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'chatlog-client/build'),
      exclude: ['/api*'],
    }),

    TopicModule,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'path/to/database.sqlite',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
      // autoLoadEntities: true,
    }),
    ExceptionModule,
    ModelsModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
