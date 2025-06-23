import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TodosModule } from './todos/todos.module';
import { Todo } from './todos/entities/todo.entity';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL || 'postgresql://localhost:5432/todo_db',
      entities: [Todo],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: true,
      retryAttempts: 3,
      retryDelay: 3000,
    }),
    TodosModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
