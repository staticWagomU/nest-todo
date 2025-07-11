import { describe, expect, it } from 'vitest';
import { extractDateFromUuidv7 } from '../../utils/uuid.utils';
import { uuidv7 } from 'uuidv7';

// Todo エンティティの基本的な機能をテスト（TypeORMデコレーターを回避）
class TodoForTest {
  id!: string;
  title!: string;
  description?: string;
  completed!: boolean;
  parentId?: string | null;

  generateId() {
    this.id = uuidv7();
  }

  get createdAt(): Date {
    return extractDateFromUuidv7(this.id);
  }
}

describe('Todo Entity', () => {
  it('should create a todo entity with default values', () => {
    const todo = new TodoForTest();
    todo.title = 'Test Todo';
    todo.description = 'Test Description';

    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('Test Description');
    expect(todo.completed).toBeUndefined();
  });

  it('should allow setting completed status', () => {
    const todo = new TodoForTest();
    todo.title = 'Test Todo';
    todo.completed = true;

    expect(todo.completed).toBe(true);
  });

  it('should allow setting all properties', () => {
    const todo = new TodoForTest();
    todo.id = 'test-id';
    todo.title = 'Test Todo';
    todo.description = 'Test Description';
    todo.completed = false;

    expect(todo.id).toBe('test-id');
    expect(todo.title).toBe('Test Todo');
    expect(todo.description).toBe('Test Description');
    expect(todo.completed).toBe(false);
  });

  it('should generate UUIDv7 on generateId call', () => {
    const todo = new TodoForTest();
    todo.generateId();

    expect(todo.id).toBeDefined();
    expect(typeof todo.id).toBe('string');
    expect(todo.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    );
  });

  it('should return createdAt from UUIDv7 id', () => {
    const todo = new TodoForTest();
    todo.generateId();

    const createdAt = todo.createdAt;
    const extractedDate = extractDateFromUuidv7(todo.id);

    expect(createdAt).toBeInstanceOf(Date);
    expect(createdAt.getTime()).toBe(extractedDate.getTime());
    expect(Math.abs(Date.now() - createdAt.getTime())).toBeLessThan(1000);
  });

  it('should extract correct date from known UUIDv7', () => {
    const todo = new TodoForTest();
    // 2024-06-24T07:44:03.000Z の UUIDv7 例
    todo.id = '0190123d-c9c0-7000-8000-000000000000';

    const createdAt = todo.createdAt;
    expect(createdAt).toBeInstanceOf(Date);
    // UUIDv7の最初の48ビットから抽出された日時を確認
    expect(createdAt.getTime()).toBe(0x0190123dc9c0);
  });

  it('should handle parent-child relationships', () => {
    const parentTodo = new TodoForTest();
    parentTodo.id = 'parent-id';
    parentTodo.title = 'Parent Todo';

    const childTodo = new TodoForTest();
    childTodo.id = 'child-id';
    childTodo.title = 'Child Todo';
    childTodo.parentId = parentTodo.id;

    expect(childTodo.parentId).toBe('parent-id');
  });
});
