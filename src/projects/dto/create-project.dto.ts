import { IsArray, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  userId!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  techStack!: string[];
}
