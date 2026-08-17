import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  createProfile(@Body() CreateProfileDto: CreateProfileDto) {
    const result = this.profileService.createProfile(CreateProfileDto);
    return result;
  }

  @Get()
  getMyProfile(@Session() session: UserSession) {
    return this.profileService.getMyProfile(session.user.id);
  }

  @Get('/all')
  @AllowAnonymous()
  getAllProfile() {
    return this.profileService.getAllProfile();
  }

  @Get(':id')
  getProfileById(@Param('id', ParseUUIDPipe) id: string) {
    return this.profileService.getProfileById(id);
  }

  @Put(':id')
  updateProfile(
    @Param('id', ParseUUIDPipe)
    id: string,
    @Session() session: UserSession,
    @Body()
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
