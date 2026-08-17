import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../lib/database/db';
import { projects } from '../lib/database/schema';
import { and, eq } from 'drizzle-orm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  async createProject(createProject: CreateProjectDto) {
    const data = await db.insert(projects).values(createProject).returning();
    return { message: 'Project created successfully.', data };
  }

  async getAllProjects(userId: string) {
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));

    if (data.length == 0) {
      throw new NotFoundException('No project founded');
    }
    return { message: 'All Projects get successfully', data };
  }

  async getProjectById(id: string) {
    const data = await db.select().from(projects).where(eq(projects.id, id));
    if (data.length === 0) {
      throw new NotFoundException('Project not found');
    }
    return { message: 'Project found successfully', data };
  }

  async updateProjectById(
    id: string,
    userId: string,
    updatedProject: UpdateProjectDto,
  ) {
    const data = await db
      .update(projects)
      .set(updatedProject)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();

    if (data.length === 0) {
      throw new NotFoundException('Project not found');
    }

    return { message: 'project found successfully', data };
  }

  async deleteProjectById(id: string, userId: string) {
    const data = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();

    return { message: 'Project deleted successfully', data };
  }
}
