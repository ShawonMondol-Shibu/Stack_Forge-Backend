import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  createProfile(@Body() CreateProfileDto: CreateProfileDto) {
    const result = this.profileService.createProfile(CreateProfileDto);
    return result;
  }

  @Get()
  getProfile(@Session() session: UserSession) {
    return this.profileService.getProfile(session.user.id);
  }

  @Put(':id')
  updateProfile(
    @Param('id')
    id: string,
    @Session() session: UserSession,
    UpdateProfileDto: UpdateProfileDto,
  ) {
    const result = this.profileService.updateProfile(
      id,
      session.user.id,
      UpdateProfileDto,
    );
    return result;
  }
}
