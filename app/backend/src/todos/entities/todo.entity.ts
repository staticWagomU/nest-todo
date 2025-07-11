import {
  Entity,
  Column,
  PrimaryColumn,
  BeforeInsert,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { uuidv7 } from 'uuidv7';
import { extractDateFromUuidv7 } from '../../utils/uuid.utils';

@Entity('todos')
export class Todo {
  @ApiProperty({
    description: 'TODO の一意識別子',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryColumn({ comment: 'ID' })
  id: string;

  @BeforeInsert()
  generateId() {
    this.id = uuidv7();
  }

  @ApiProperty({
    description: 'TODO のタイトル',
    example: '買い物リスト作成',
  })
  @Column('text', { comment: 'Todoのタイトル', nullable: false })
  title: string;

  @ApiProperty({
    description: 'TODO の詳細説明',
    example: '明日の夕食の材料を買いに行く',
    required: false,
  })
  @Column('text', { comment: 'Todoの説明', nullable: true })
  description: string;

  @ApiProperty({
    description: 'TODO の完了状態',
    example: false,
  })
  @Column('boolean', { comment: 'Todoの完了状態', nullable: false, default: false })
  completed: boolean;

  @ApiProperty({
    description: '親TODO の ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @Column('varchar', { comment: '親TODO の ID', nullable: true })
  parentId: string | null;

  @ManyToOne(
    () => Todo,
    (todo) => todo.children,
    { nullable: true }
  )
  @JoinColumn({ name: 'parentId' })
  parent: Todo | null;

  @OneToMany(
    () => Todo,
    (todo) => todo.parent
  )
  children: Todo[];

  @ApiProperty({
    description: 'TODO の作成日時',
    example: '2024-06-24T10:30:00.000Z',
  })
  get createdAt(): Date {
    return extractDateFromUuidv7(this.id);
  }
}
