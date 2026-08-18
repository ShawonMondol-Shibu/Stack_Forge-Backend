import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name should not be left blank.' })
  name!: string;

  @IsString()
  description!: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'Provide your project tech stack.' })
  techStack!: string[];
}
