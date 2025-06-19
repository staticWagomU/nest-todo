import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType : nest.jsでエラーが発生するため
import { TodosService } from './todos.service';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @ApiOperation({ summary: '新しいTODOを作成', description: 'TODOアイテムを新規作成します' })
  @ApiResponse({ status: 201, description: 'TODOが正常に作成されました' })
  @ApiResponse({ status: 400, description: '不正なリクエスト' })
  @Post()
  create(@Body() body: { title: string; description?: string; completed?: boolean }) {
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

  @ApiOperation({
    summary: '全てのTODOを取得',
    description: '登録されている全てのTODOアイテムを取得します',
  })
  @ApiResponse({ status: 200, description: 'TODOリストが正常に取得されました' })
  @Get()
  findAll() {
    return this.todosService.findAll();
  }

  @ApiOperation({
    summary: '特定のTODOを取得',
    description: 'IDを指定してTODOアイテムを取得します',
  })
  @ApiParam({ name: 'id', description: 'TODO ID (UUID)' })
  @ApiResponse({ status: 200, description: 'TODOが正常に取得されました' })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @ApiOperation({ summary: 'TODOを更新', description: 'IDを指定してTODOアイテムを部分更新します' })
  @ApiParam({ name: 'id', description: 'TODO ID (UUID)' })
  @ApiResponse({ status: 200, description: 'TODOが正常に更新されました' })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @ApiResponse({ status: 400, description: '不正なリクエスト' })
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title: string; description?: string; completed?: boolean }
  ) {
    // 手動でバリデーション
    if (!body || typeof body !== 'object') {
      throw new BadRequestException('リクエストボディが必要です');
    }

    // DTOオブジェクトを手動作成
    const updateTodoDto: UpdateTodoDto = {};

    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim().length < 3) {
        throw new BadRequestException('タイトルは3文字以上で入力してください');
      }
      updateTodoDto.title = body.title.trim();
    }

    if (body.description !== undefined) {
      updateTodoDto.description = body.description;
    }

    if (body.completed !== undefined) {
      updateTodoDto.completed = body.completed;
    }

    return this.todosService.update(id, updateTodoDto);
  }

  @ApiOperation({ summary: 'TODOを削除', description: 'IDを指定してTODOアイテムを削除します' })
  @ApiParam({ name: 'id', description: 'TODO ID (UUID)' })
  @ApiResponse({ status: 200, description: 'TODOが正常に削除されました' })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
