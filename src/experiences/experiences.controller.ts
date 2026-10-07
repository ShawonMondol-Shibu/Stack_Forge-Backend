import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ExperiencesService } from './experiences.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller('experiences')
export class ExperiencesController {
  constructor(private readonly experiencesService: ExperiencesService) {}

  @Post()
  async createExperience(
    @Session() session: UserSession,
    @Body() createExperienceDto: CreateExperienceDto,
  ) {
    return await this.experiencesService.createExperience(
      session.user.id,
      createExperienceDto,
    );
  }

  @Get()
  async myExperiences(@Session() session: UserSession) {
    return await this.experiencesService.myExperiences(session.user.id);
  }

  @Get('profile/:profileId')
  @AllowAnonymous()
  async getProfileExperiences(
    @Param('profileId', ParseUUIDPipe) profileId: string,
  ) {
    return await this.experiencesService.getProfileExperiences(profileId);
  }

  @Patch(':id')
  async updateExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    @Body() updateExperienceDto: UpdateExperienceDto,
  ) {
    return await this.experiencesService.updateExperience(
      id,
      session.user.id,
      updateExperienceDto,
    );
  }

  @Delete(':id')
  async deleteExperience(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return await this.experiencesService.deleteExperience(id, session.user.id);
  }
}
