import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import {
  OptionalAuth,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  createProject(
    @Session() session: UserSession,
    @Body() createProject: CreateProjectDto,
  ) {
    return this.projectsService.createProject(session.user.id, createProject);
  }

  @Get()
  getAllProjects(@Session() session: UserSession) {
    return this.projectsService.getAllProjects(session.user.id);
  }

  // GOTO: ei route ':id' route er AGE thakte hobe, nahole "trending" ke
  // UUID dhore ParseUUIDPipe 400 error dey.
  // OptionalAuth: login chhara-o kaj kore, login thakle likedByMe ashe
  @Get('trending')
  @OptionalAuth()
  getTrendingProjects(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Session() session: UserSession | null,
  ) {
    return this.projectsService.getTrendingProjects(
      limit,
      7,
      session?.user?.id,
    );
  }

  @Get(':id')
  getProjectById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Post(':id/like')
  likeProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.projectsService.likeProject(id, session.user.id);
  }

  @Delete(':id/like')
  unlikeProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.projectsService.unlikeProject(id, session.user.id);
  }

  @Patch(':id')
  updateProjectById(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    @Body()
    updateProject: UpdateProjectDto,
  ) {
    return this.projectsService.updateProjectById(
      id,
      session.user.id,
      updateProject,
    );
  }

  @Delete(':id')
  deleteProjectById(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return this.projectsService.deleteProjectById(id, session.user.id);
  }
}
