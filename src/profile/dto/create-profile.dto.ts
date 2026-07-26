import { IsEnum, IsString } from 'class-validator';

export class CreateProfileDto {
  @IsString()
  userId!: string;

  @IsString()
  fullName!: string;

  @IsString()
  headline?: string;

  @IsString()
  bio?: string;

  @IsString()
  location?: string;

  @IsString()
  website?: string;

  @IsString()
  avatarUrl?: string;

  @IsString()
  coverUrl?: string;

  @IsEnum(['open', 'busy', 'unavailable'])
  availability!: 'open' | 'busy' | 'unavailable';
}
