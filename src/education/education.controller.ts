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
import { EducationService } from './education.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';

@Controller('education')
export class EducationController {
  constructor(private readonly educationService: EducationService) {}

  @Post()
  async createEducation(
    @Session() session: UserSession,
    @Body() createEducationDto: CreateEducationDto,
  ) {
    return await this.educationService.createEducation(
      session.user.id,
      createEducationDto,
    );
  }

  @Get()
  async myEducation(@Session() session: UserSession) {
    return await this.educationService.myEducation(session.user.id);
  }

  @Get('user/:userId')
  @AllowAnonymous()
  async getUserEducation(@Param('userId') userId: string) {
    return await this.educationService.getUserEducation(userId);
  }

  @Get(':id')
  @AllowAnonymous()
  async getOneEducation(@Param('id', ParseUUIDPipe) id: string) {
    return await this.educationService.getOneEducation(id);
  }

  @Patch(':id')
  async updateEducation(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    @Body() updateEducationDto: UpdateEducationDto,
  ) {
    return await this.educationService.updateEducation(
      id,
      session.user.id,
      updateEducationDto,
    );
  }

  @Delete(':id')
  async deleteEducation(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return await this.educationService.deleteEducation(id, session.user.id);
  }
}
