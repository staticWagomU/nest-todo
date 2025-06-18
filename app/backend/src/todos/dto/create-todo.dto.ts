import { IsNotEmpty, IsOptional, MinLength, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'タイトルは必須です' })
  @IsString()
  @MinLength(3, { message: 'タイトルは3文字以上で入力してください' })
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
