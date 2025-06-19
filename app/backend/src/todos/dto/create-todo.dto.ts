import { IsNotEmpty, IsOptional, MinLength, IsString, IsBoolean } from 'class-validator';
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
}
