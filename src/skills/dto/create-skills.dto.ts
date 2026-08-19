import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateSkillsDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  level!: number;

  @IsNumber()
  @Min(1)
  @Max(70)
  yearsExperience!: number;
}
