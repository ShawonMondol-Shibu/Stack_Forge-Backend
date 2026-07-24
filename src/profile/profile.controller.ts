import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  createProfile(@Body() CreateProfileDto: CreateProfileDto) {
    const result = this.profileService.createProfile(CreateProfileDto);
    return result;
  }

  @Get()
  @UseGuards(AuthGuard)
  getProfile(@Req() req: Request) {
    return this.profileService.getProfile((req as any).user.id);
  }

  @Put(':id')
  updateProfile(
    @Param('id')
    id: string,
    userId: string,
    UpdateProfileDto: UpdateProfileDto,
  ) {
    const result = this.profileService.updateProfile(
      id,
      userId,
      UpdateProfileDto,
    );
    return result;
  }
}
