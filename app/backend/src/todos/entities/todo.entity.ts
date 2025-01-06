import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('todos')
export class Todo {
  @PrimaryGeneratedColumn('uuid', { comment: 'ID' })
  id: string;

  @Column('text', { comment: 'Todoのタイトル', nullable: false })
  title: string;

  @Column('text', { comment: 'Todoの説明', nullable: true })
  description: string;

  @Column('boolean', { comment: 'Todoの完了状態', nullable: false, default: false })
  completed: boolean;
}
