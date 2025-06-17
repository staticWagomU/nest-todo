import { InternalServerErrorException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CreateTodoDto } from './dto/create-todo.dto';
import type { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  const mockRepository = {
    save: vi.fn(),
    find: vi.fn(),
    findOneOrFail: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a todo successfully', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      };

      mockRepository.save.mockResolvedValue({
        id: 'test-id',
        ...createTodoDto,
        completed: false,
      });

      const result = await service.create(createTodoDto);

      expect(mockRepository.save).toHaveBeenCalledWith({
        id: expect.any(String),
        title: createTodoDto.title,
        description: createTodoDto.description,
        completed: false,
      });
      expect(result).toEqual({
        message: 'ユーザー登録に成功しました。',
      });
    });

    it('should throw InternalServerErrorException when save fails', async () => {
      const createTodoDto: CreateTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      };

      mockRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(createTodoDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const todos = [
        { id: '1', title: 'Todo 1', description: 'Desc 1', completed: false },
        { id: '2', title: 'Todo 2', description: 'Desc 2', completed: true },
      ];

      mockRepository.find.mockResolvedValue(todos);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(todos);
    });
  });

  describe('findOne', () => {
    it('should return a todo by id', async () => {
      const todo = { id: '1', title: 'Todo 1', description: 'Desc 1', completed: false };

      mockRepository.findOneOrFail.mockResolvedValue(todo);

      const result = await service.findOne('1');

      expect(mockRepository.findOneOrFail).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(todo);
    });
  });

  describe('update', () => {
    it('should update a todo successfully', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
        description: 'Updated Description',
        completed: true,
      };

      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update('1', updateTodoDto);

      expect(mockRepository.update).toHaveBeenCalledWith('1', {
        title: updateTodoDto.title,
        description: updateTodoDto.description,
        completed: updateTodoDto.completed,
      });
      expect(result).toEqual({
        message: 'ユーザーID「1」の更新に成功しました。',
      });
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      const updateTodoDto: UpdateTodoDto = {
        title: 'Updated Todo',
      };

      mockRepository.update.mockRejectedValue(new Error('Database error'));

      await expect(service.update('1', updateTodoDto)).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });

  describe('remove', () => {
    it('should remove a todo successfully', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        message: 'ユーザーID「1」の削除に成功しました。',
      });
    });

    it('should throw InternalServerErrorException when delete fails', async () => {
      mockRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(service.remove('1')).rejects.toThrow(
        InternalServerErrorException
      );
    });
  });
});
