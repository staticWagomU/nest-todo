import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import type { Repository } from 'typeorm';
import { uuidv7 } from 'uuidv7';

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
    // 親TODOが指定されている場合、その存在を確認
    if (createTodoDto.parentId) {
      const parentTodo = await this.todoRepository.findOne({
        where: { id: createTodoDto.parentId },
      });
      if (!parentTodo) {
        throw new BadRequestException('指定された親TODOが存在しません。');
      }
      // 子TODOから子TODOを作成することを禁止（2階層まで）
      if (parentTodo.parentId) {
        throw new BadRequestException('子TODOからは子TODOを作成できません。');
      }
    }

    const newTodo = await this.todoRepository
      .save({
        id: uuidv7(),
        title: createTodoDto.title,
        description: createTodoDto.description || '',
        completed: createTodoDto.completed || false,
        parentId: createTodoDto.parentId || null,
      })
      .catch((error) => {
        throw new InternalServerErrorException(`[${error.message}]TODO登録に失敗しました。`);
      });

    return newTodo;
  }

  async findAll(order: 'asc' | 'desc' = 'desc'): Promise<Todo[]> {
    return this.todoRepository.find({
      relations: ['children', 'parent'],
      order: { id: order.toUpperCase() as 'ASC' | 'DESC' },
    });
  }

  async findOne(id: string): Promise<Todo> {
    return this.todoRepository.findOneOrFail({
      where: { id },
      relations: ['children', 'parent'],
    });
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    // 親TODOを変更する場合、その存在を確認
    if (updateTodoDto.parentId !== undefined) {
      if (updateTodoDto.parentId === id) {
        throw new BadRequestException('自分自身を親TODOに設定することはできません。');
      }
      if (updateTodoDto.parentId) {
        const parentTodo = await this.todoRepository.findOne({
          where: { id: updateTodoDto.parentId },
        });
        if (!parentTodo) {
          throw new BadRequestException('指定された親TODOが存在しません。');
        }
        // 子TODOから子TODOを作成することを禁止（2階層まで）
        if (parentTodo.parentId) {
          throw new BadRequestException('子TODOからは子TODOを作成できません。');
        }
      }
    }

    await this.todoRepository
      .update(id, {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        completed: updateTodoDto.completed,
        parentId: updateTodoDto.parentId,
      })
      .catch((error) => {
        throw new InternalServerErrorException(
          `[${error.message}]TODO ID「${id}」の更新に失敗しました。`
        );
      });

    return this.findOne(id);
  }

  async remove(id: string, cascadeDelete = false) {
    // 削除対象のTODOを取得
    const todoToDelete = await this.todoRepository.findOne({
      where: { id },
      relations: ['children'],
    });

    if (!todoToDelete) {
      throw new NotFoundException(`TODO ID「${id}」が見つかりません。`);
    }

    // 子TODOが存在する場合の処理
    if (todoToDelete.children && todoToDelete.children.length > 0) {
      if (cascadeDelete) {
        // 子TODOも一緒に削除（cascade delete）
        for (const child of todoToDelete.children) {
          await this.todoRepository.delete(child.id);
        }
      } else {
        // 子TODOを親から切り離す（orphan化）
        await this.todoRepository.update({ parentId: id }, { parentId: null });
      }
    }

    // TODOを削除
    await this.todoRepository.delete(id).catch((error) => {
      throw new InternalServerErrorException(
        `[${error.message}]TODO ID「${id}」の削除に失敗しました。`
      );
    });

    const childAction = cascadeDelete ? '子TODOも一緒に削除されました' : '子TODOは切り離されました';
    const message =
      todoToDelete.children && todoToDelete.children.length > 0
        ? `TODO ID「${id}」の削除に成功しました。${childAction}。`
        : `TODO ID「${id}」の削除に成功しました。`;

    return {
      message,
    };
  }

  /**
   * 子TODOを親から切り離し、独立したTODOにする
   * @param id 子TODO ID
   */
  async detachFromParent(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({
      where: { id },
      relations: ['parent'],
    });

    if (!todo) {
      throw new NotFoundException(`TODO ID「${id}」が見つかりません。`);
    }

    if (!todo.parent) {
      throw new BadRequestException('このTODOは既に親TODOから独立しています。');
    }

    await this.todoRepository.update(id, { parentId: null });
    return this.findOne(id);
  }

  /**
   * 指定されたTODOの子TODOを取得
   * @param parentId 親TODO ID
   */
  async findChildrenByParentId(parentId: string): Promise<Todo[]> {
    return this.todoRepository.find({
      where: { parentId },
      relations: ['children'],
      order: { id: 'DESC' },
    });
  }
}
