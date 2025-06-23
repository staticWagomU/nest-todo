import { Module } from '@nestjs/common';
import { Todo } from './entities/todo.entity';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiModule } from '../ai/ai.module';

@Module({
  controllers: [TodosController],
  providers: [TodosService],
  imports: [TypeOrmModule.forFeature([Todo]), AiModule],
})
export class TodosModule {}
