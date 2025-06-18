import { Test, type TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosController } from './todos.controller';
import type { TodosService } from './todos.service';

describe('TodosController', () => {
  let controller: TodosController;

  it('should be defined', () => {
    const mockTodosService = {
      create: vi.fn(),
      findAll: vi.fn(),
      findOne: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
    };

    const controller = new TodosController(mockTodosService as TodosService);
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service create method', async () => {
      const mockTodosService = {
        create: vi.fn().mockResolvedValue({ message: 'ユーザー登録に成功しました。' }),
        findAll: vi.fn(),
        findOne: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
      };

      const controller = new TodosController(mockTodosService as TodosService);
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      };

      const result = await controller.create(createTodoDto);

      expect(mockTodosService.create).toHaveBeenCalledWith(createTodoDto);
      expect(result).toEqual({ message: 'ユーザー登録に成功しました。' });
    });
  });

  describe('findAll', () => {
    it('should call service findAll method', async () => {
      const todos = [
        { id: '1', title: 'Todo 1', description: 'Desc 1', completed: false },
        { id: '2', title: 'Todo 2', description: 'Desc 2', completed: true },
      ];

      const mockTodosService = {
        create: vi.fn(),
        findAll: vi.fn().mockResolvedValue(todos),
        findOne: vi.fn(),
        update: vi.fn(),
        remove: vi.fn(),
      };

      const controller = new TodosController(mockTodosService as TodosService);
      const result = await controller.findAll();

      expect(mockTodosService.findAll).toHaveBeenCalled();
      expect(result).toBe(todos);
    });
  });

  describe('findOne', () => {
    it('should call service findOne method', async () => {
      const todo = { id: '1', title: 'Todo 1', description: 'Desc 1', completed: false };

      const mockTodosService = {
        create: vi.fn(),
        findAll: vi.fn(),
        findOne: vi.fn().mockResolvedValue(todo),
        update: vi.fn(),
        remove: vi.fn(),
      };

      const controller = new TodosController(mockTodosService as TodosService);
      const result = await controller.findOne('1');

      expect(mockTodosService.findOne).toHaveBeenCalledWith('1');
      expect(result).toBe(todo);
    });
  });

  describe('update', () => {
    it('should call service update method', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        completed: true,
      };
      const result = { message: 'ユーザーID「1」の更新に成功しました。' };

      const mockTodosService = {
        create: vi.fn(),
        findAll: vi.fn(),
        findOne: vi.fn(),
        update: vi.fn().mockResolvedValue(result),
        remove: vi.fn(),
      };

      const controller = new TodosController(mockTodosService as TodosService);
      const response = await controller.update('1', updateTodoDto);

      expect(mockTodosService.update).toHaveBeenCalledWith('1', updateTodoDto);
      expect(response).toBe(result);
    });
  });

  describe('remove', () => {
    it('should call service remove method', async () => {
      const result = { message: 'ユーザーID「1」の削除に成功しました。' };

      const mockTodosService = {
        create: vi.fn(),
        findAll: vi.fn(),
        findOne: vi.fn(),
        update: vi.fn(),
        remove: vi.fn().mockResolvedValue(result),
      };

      const controller = new TodosController(mockTodosService as TodosService);
      const response = await controller.remove('1');

      expect(mockTodosService.remove).toHaveBeenCalledWith('1');
      expect(response).toBe(result);
    });
  });
});
