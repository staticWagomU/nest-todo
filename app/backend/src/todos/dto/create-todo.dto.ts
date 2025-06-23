import { IsNotEmpty, IsOptional, MinLength, IsString, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @ApiProperty({
    description: 'TODO のタイトル',
    example: '買い物リスト作成',
    minLength: 3,
  })
  @IsNotEmpty({ message: 'タイトルは必須です' })
  @IsString()
  @MinLength(3, { message: 'タイトルは3文字以上で入力してください' })
  title: string;

  @ApiProperty({
    description: 'TODO の詳細説明',
    example: '明日の夕食の材料を買いに行く',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'TODO の完了状態',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @ApiProperty({
    description: '親TODO の ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUUID(4, { message: '親TODO の ID は有効な UUID である必要があります' })
  parentId?: string;
}
