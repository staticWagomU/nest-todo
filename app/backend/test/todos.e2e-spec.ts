import type { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import request from 'supertest';
import type { Repository } from 'typeorm';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../src/app.module';
import { Todo } from '../src/todos/entities/todo.entity';

describe('TodosController (e2e)', () => {
  let app: INestApplication;
  let todoRepository: Repository<Todo>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api/v1');
    
    // Add global ValidationPipe to match production configuration
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    
    todoRepository = moduleFixture.get<Repository<Todo>>(getRepositoryToken(Todo));
    
    await app.init();
  });

  afterEach(async () => {
    await todoRepository.clear();
    await app.close();
  });

  describe('/api/v1/todos (POST)', () => {
    it('should create a new todo', () => {
      const createTodoDto = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      return request(app.getHttpServer())
        .post('/api/v1/todos')
        .send(createTodoDto)
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', 'ユーザー登録に成功しました。');
        });
    });

    it('should return 400 for invalid data', () => {
      const createTodoDto = {
        title: 'ab', // too short
        description: 'Test Description',
      };

      return request(app.getHttpServer())
        .post('/api/v1/todos')
        .send(createTodoDto)
        .expect(400);
    });
  });

  describe('/api/v1/todos (GET)', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/api/v1/todos')
        .expect(200)
        .expect([]);
    });

    it('should return todos after creating them', async () => {
      const todo = await todoRepository.save({
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      });

      return request(app.getHttpServer())
        .get('/api/v1/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveLength(1);
          expect(res.body[0]).toMatchObject({
            title: 'Test Todo',
            description: 'Test Description',
            completed: false,
          });
        });
    });
  });

  describe('/api/v1/todos/:id (GET)', () => {
    it('should return a specific todo', async () => {
      const todo = await todoRepository.save({
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      });

      return request(app.getHttpServer())
        .get(`/api/v1/todos/${todo.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject({
            title: 'Test Todo',
            description: 'Test Description',
            completed: false,
          });
        });
    });

    it('should return 404 for non-existent todo', () => {
      return request(app.getHttpServer())
        .get('/api/v1/todos/123e4567-e89b-12d3-a456-426614174000')
        .expect(404);
    });
  });

  describe('/api/v1/todos/:id (PATCH)', () => {
    it('should update a todo', async () => {
      const todo = await todoRepository.save({
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      });

      const updateTodoDto = {
        title: 'Updated Todo',
        completed: true,
      };

      return request(app.getHttpServer())
        .patch(`/api/v1/todos/${todo.id}`)
        .send(updateTodoDto)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', `ユーザーID「${todo.id}」の更新に成功しました。`);
        });
    });
  });

  describe('/api/v1/todos/:id (DELETE)', () => {
    it('should delete a todo', async () => {
      const todo = await todoRepository.save({
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
      });

      return request(app.getHttpServer())
        .delete(`/api/v1/todos/${todo.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('message', `ユーザーID「${todo.id}」の削除に成功しました。`);
        });
    });
  });
});
