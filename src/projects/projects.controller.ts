import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async createProject(@Body() createProject: CreateProjectDto) {
    return await this.projectsService.createProject(createProject);
  }

  @Get()
  async getAllProjects(@Session() session: UserSession) {
    return await this.projectsService.getAllProjects(session.user.id);
  }

  @Get(':id')
  async getProjectById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projectsService.getProjectById(id);
  }

  @Put(':id')
  async updateProjectById(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
    updateProject: UpdateProjectDto,
  ) {
    return await this.projectsService.updateProjectById(
      id,
      session.user.id,
      updateProject,
    );
  }

  @Delete(':id')
  async deleteProjectById(
    @Param('id', ParseUUIDPipe) id: string,
    @Session() session: UserSession,
  ) {
    return await this.projectsService.deleteProjectById(id, session.user.id);
  }
}
