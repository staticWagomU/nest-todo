import { Injectable, InternalServerErrorException } from '@nestjs/common';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import type { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>
  ) {}

  /**
   * 登録
   * @param createTodoDto
   */
  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const newTodo = await this.todoRepository
      .save({
        id: randomUUID({ disableEntropyCache: true }),
        title: createTodoDto.title,
        description: createTodoDto.description || '',
        completed: createTodoDto.completed || false,
      })
      .catch((error) => {
        throw new InternalServerErrorException(`[${error.message}]ユーザー登録に失敗しました。`);
      });

    return newTodo;
  }

  async findAll(order: 'asc' | 'desc' = 'desc'): Promise<Todo[]> {
    return this.todoRepository.find({
      order: { id: order.toUpperCase() as 'ASC' | 'DESC' },
    });
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOneOrFail({
      where: { id },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    await this.todoRepository
      .update(id, {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        completed: updateTodoDto.completed,
      })
      .catch((error) => {
        throw new InternalServerErrorException(
          `[${error.message}]ユーザーID「${id}」の更新に失敗しました。`
        );
      });

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.todoRepository.delete(id).catch((error) => {
      throw new InternalServerErrorException(
        `[${error.message}]ユーザーID「${id}」の削除に失敗しました。`
      );
    });

    return {
      message: `ユーザーID「${id}」の削除に成功しました。`,
    };
  }
}
