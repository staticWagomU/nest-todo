import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { TodosService } from './todos.service';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(@Body() body: any) {
    // 手動でバリデーション
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('リクエストボディが必要です');
    }

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length < 3) {
      throw new BadRequestException('タイトルは3文字以上で入力してください');
    }

    // DTOオブジェクトを手動作成
    const createTodoDto: CreateTodoDto = {
      title: body.title.trim(),
      description: body.description || '',
      completed: body.completed || false,
    };

    return this.todosService.create(createTodoDto);
  }

  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
