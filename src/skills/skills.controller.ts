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
import { SkillsService } from './skills.service';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { UpdateSkillsDto } from './dto/update-skills.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  async createSkills(
    @Body() createSkillsDto: CreateSkillsDto,
    @Session() session: UserSession,
  ) {
    return await this.skillsService.createSkills(
      createSkillsDto,
      session.user.id,
    );
  }

  @Get()
  async mySkills(@Session() session: UserSession) {
    return await this.skillsService.mySkills(session.user.id);
  }

  @Get(':id')
  async getOneSkill(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return await this.skillsService.getOneSkill(id, session.user.id);
  }

  @Patch(':id')
  async updateSkills(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    @Body() updateSkillsDto: UpdateSkillsDto,
  ) {
    return await this.skillsService.updateSkills(
      id,
      session.user.id,
      updateSkillsDto,
    );
  }

  @Delete(':id')
  async deleteSkills(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return await this.skillsService.deleteSkills(id, session.user.id);
  }
}
