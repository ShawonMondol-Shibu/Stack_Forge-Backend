import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum priorityEnum {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
}
enum statusEnum {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(priorityEnum)
  priority!: priorityEnum;

  @IsString()
  @IsNotEmpty()
  @IsEnum(statusEnum)
  status!: statusEnum;
}
