import { Module } from '@nestjs/common';
import { TopicModule } from './topic/infra/topic.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TopicModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'path/to/database.sqlite',
      synchronize: true,
      logging: false,
      entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],
      // autoLoadEntities: true,
    }),
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
