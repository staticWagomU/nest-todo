import { IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty({ message: 'タイトルは必須です' })
  @MinLength(3, { message: 'タイトルは3文字以上で入力してください' })
  title: string;

  @IsOptional()
  description: string;

  @IsOptional()
  completed: boolean;
}
