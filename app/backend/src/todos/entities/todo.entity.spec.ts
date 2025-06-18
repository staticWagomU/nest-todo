import { beforeEach, describe, expect, it } from 'vitest';
import { Todo } from './todo.entity';

describe('Todo Entity', () => {
  it('should create a todo entity with default values', () => {
    const todo = new Todo();
    todo.title = 'Test Todo';
    todo.description = 'Test Description';

    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('Test Description');
    expect(todo.completed).toBeUndefined();
  });

  it('should allow setting completed status', () => {
    const todo = new Todo();
    todo.title = 'Test Todo';
    todo.completed = true;

    expect(todo.completed).toBe(true);
  });

  it('should allow setting all properties', () => {
    const todo = new Todo();
    todo.id = 'test-id';
    todo.title = 'Test Todo';
    todo.description = 'Test Description';
    todo.completed = false;

    expect(todo.id).toBe('test-id');
    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('Test Description');
    expect(todo.completed).toBe(false);
  });
});
