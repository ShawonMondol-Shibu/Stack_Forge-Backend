import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { SkillsService } from './skills.service';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { UpdateSkillsDto } from './dto/update-skills.dto';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Post()
  createSkills(@Body() createSkillsDto: CreateSkillsDto) {
    return this.skillsService.createSkills(createSkillsDto);
  }

  @Get()
  allSkills(@Session() session: UserSession) {
    return this.skillsService.allSkills(session.user.id);
  }

  @Get(':id')
  getOneSkill(@Param('id') id: string, @Session() session: UserSession) {
    return this.skillsService.getOneSkill(id, session.user.id);
  }

  @Put(':id')
  updateSkills(
    @Param('id') id: string,
    @Session() session: UserSession,
    @Body() updateSkillsDto: UpdateSkillsDto,
  ) {
    return this.skillsService.updateSkills(
      id,
      session.user.id,
      updateSkillsDto,
    );
  }

  @Delete(':id')
  deleteSkills(@Param('id') id: string, @Session() session: UserSession) {
    return this.skillsService.deleteSkills(id, session.user.id);
  }
}
