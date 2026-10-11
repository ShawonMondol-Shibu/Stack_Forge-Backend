import { IsNotEmpty, IsString } from 'class-validator';

export class CreateFollowDto {
  @IsString()
  @IsNotEmpty()
  followingId!: string;
}
