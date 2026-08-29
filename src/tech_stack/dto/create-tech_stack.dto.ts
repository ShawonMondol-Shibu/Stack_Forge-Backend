import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTechStackDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  image?: string;
}
