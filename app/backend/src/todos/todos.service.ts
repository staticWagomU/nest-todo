import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  /**
    * 登録
    * @param createTodoDto
    */
  async create(createTodoDto: CreateTodoDto): Promise<{ message: string }> {
    await this.todoRepository.save({
      id: randomUUID({ disableEntropyCache: true }),
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: false,
    })
    .catch((error) => {
      throw new InternalServerErrorException(
        `[${error.message}]ユーザー登録に失敗しました。`,
        
      );
    });

    return {
      message: 'ユーザー登録に成功しました。',
    };
  }

  async findAll(): Promise<Todo[]> {
    return this.todoRepository.find();
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOneOrFail({
      where: { id },
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<{ message: string }> {
    await this.todoRepository.update(id, {
      title: updateTodoDto.title,
      description: updateTodoDto.description,
      completed: updateTodoDto.completed,
    })
    .catch((error) => {
      throw new InternalServerErrorException(
        `[${error.message}]ユーザーID「${id}」の更新に失敗しました。`,
      );
    });

    return {
      message: `ユーザーID「${id}」の更新に成功しました。`,
    };
  }

  async remove(id: string) {
    await this.todoRepository.delete(id)
    .catch((error) => {
      throw new InternalServerErrorException(
        `[${error.message}]ユーザーID「${id}」の削除に失敗しました。`,
      );
    });

    return {
      message: `ユーザーID「${id}」の削除に成功しました。`,
    };
  }
}
