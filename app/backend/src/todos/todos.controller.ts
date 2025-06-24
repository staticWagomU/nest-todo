import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType : nest.jsでエラーが発生するため
import { TodosService } from './todos.service';
// biome-ignore lint/style/useImportType : nest.jsでエラーが発生するため
import { AiService } from '../ai/ai.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly aiService: AiService
  ) {}

  @ApiOperation({ summary: '新しいTODOを作成', description: 'TODOアイテムを新規作成します' })
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 201, description: 'TODOが正常に作成されました', type: Todo })
  @ApiResponse({ status: 400, description: '不正なリクエスト' })
  @Post()
  create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todosService.create(createTodoDto);
  }

  @ApiOperation({
    summary: '全てのTODOを取得',
    description: '登録されている全てのTODOアイテムを取得します',
  })
  @ApiQuery({
    name: 'order',
    description: '作成順のソート順序',
    required: false,
    enum: ['asc', 'desc'],
    example: 'desc',
  })
  @ApiResponse({ status: 200, description: 'TODOリストが正常に取得されました', type: [Todo] })
  @Get()
  findAll(@Query('order') order?: 'asc' | 'desc'): Promise<Todo[]> {
    return this.todosService.findAll(order);
  }

  @ApiOperation({
    summary: '特定のTODOを取得',
    description: 'IDを指定してTODOアイテムを取得します',
  })
  @ApiParam({
    name: 'id',
    description: 'TODO ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'TODOが正常に取得されました', type: Todo })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Todo> {
    return this.todosService.findOne(id);
  }

  @ApiOperation({ summary: 'TODOを更新', description: 'IDを指定してTODOアイテムを部分更新します' })
  @ApiParam({
    name: 'id',
    description: 'TODO ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({ status: 200, description: 'TODOが正常に更新されました', type: Todo })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @ApiResponse({ status: 400, description: '不正なリクエスト' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
    return this.todosService.update(id, updateTodoDto);
  }

  @ApiOperation({ summary: 'TODOを削除', description: 'IDを指定してTODOアイテムを削除します' })
  @ApiParam({
    name: 'id',
    description: 'TODO ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({
    name: 'cascadeDelete',
    description: '子TODOも一緒に削除するかどうか',
    required: false,
    type: Boolean,
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'TODOが正常に削除されました',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'TODO ID「123e4567-e89b-12d3-a456-426614174000」の削除に成功しました。',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('cascadeDelete') cascadeDelete?: boolean
  ): Promise<{ message: string }> {
    return this.todosService.remove(id, cascadeDelete || false);
  }

  @ApiOperation({
    summary: '子TODOを親から切り離し',
    description: '子TODOを親から切り離し、独立したTODOにします',
  })
  @ApiParam({
    name: 'id',
    description: '子TODO ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: '子TODOが正常に切り離されました', type: Todo })
  @ApiResponse({ status: 404, description: '指定されたTODOが見つかりません' })
  @ApiResponse({ status: 400, description: 'このTODOは既に親TODOから独立しています' })
  @Patch(':id/detach')
  detachFromParent(@Param('id') id: string): Promise<Todo> {
    return this.todosService.detachFromParent(id);
  }

  @ApiOperation({
    summary: '子TODOを取得',
    description: '指定された親TODOの子TODOを全て取得します',
  })
  @ApiParam({
    name: 'id',
    description: '親TODO ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: '子TODOリストが正常に取得されました', type: [Todo] })
  @Get(':id/children')
  findChildren(@Param('id') id: string): Promise<Todo[]> {
    return this.todosService.findChildrenByParentId(id);
  }

  @ApiOperation({
    summary: 'AIで子TODOを生成',
    description: '親TODOの情報を基にAIが子TODOを自動生成し、データベースに保存します',
  })
  @ApiParam({
    name: 'id',
    description: '親TODO ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 201, description: '子TODOが正常に生成されました', type: [Todo] })
  @ApiResponse({ status: 404, description: '指定された親TODOが見つかりません' })
  @ApiResponse({ status: 400, description: '子TODOからは子TODOを生成できません' })
  @Post(':id/generate-children')
  async generateChildTodos(@Param('id') id: string): Promise<Todo[]> {
    // 親TODOの存在確認
    const parentTodo = await this.todosService.findOne(id);

    // 子TODOからは子TODOを生成できない
    if (parentTodo.parentId) {
      throw new BadRequestException('子TODOからは子TODOを生成できません');
    }

    // AI で子TODOを生成
    const childTodoInputs = await this.aiService.generateChildTodos({
      title: parentTodo.title,
      description: parentTodo.description,
      parentId: id,
    });

    // 生成された子TODOをデータベースに保存
    const createdTodos: Todo[] = [];
    for (const childTodoInput of childTodoInputs) {
      const createdTodo = await this.todosService.create(childTodoInput);
      createdTodos.push(createdTodo);
    }

    return createdTodos;
  }
}
