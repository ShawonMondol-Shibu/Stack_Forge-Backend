import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Project name should not be left blank.' })
  @MaxLength(100, { message: 'Project name must be 100 characters or fewer.' })
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayNotEmpty({ message: 'Provide your project tech stack.' })
  @ArrayUnique()
  techStack!: string[];

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  liveLink?: string;

  @IsOptional()
  @IsString()
  githubLink?: string;

  @IsOptional()
  @IsBoolean()
  pin?: boolean;
}
