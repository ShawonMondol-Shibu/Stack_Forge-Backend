import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNoteDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  content!: string;

  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tag!: string[];
}
