import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateSkillsDto {
  @IsString()
  @Min(5)
  userId!: string;

  @IsString()
  @Min(2)
  name!: string;

  @IsNumber()
  @Min(1)
  level!: number;

  @IsNumber()
  @Min(0)
  @Max(70)
  yearsExperience!: number;
}
