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
import { ProjectsService } from './projects.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
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

  @Get(':id')
  getProjectById(@Param('id', ParseUUIDPipe) id: string) {
    return this.projectsService.getProjectById(id);
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
