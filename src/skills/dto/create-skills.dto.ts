import { IsArray, IsString } from 'class-validator';

export class CreateSkillsDto {
  @IsArray()
  @IsString({ each: true })
  techStack!: string[];
}
