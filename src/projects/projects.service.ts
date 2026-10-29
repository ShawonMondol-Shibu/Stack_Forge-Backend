import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../lib/database/db';
import { projectLikes, projects, user } from '../lib/database/schema';
import { and, count, desc, eq, sql } from 'drizzle-orm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

const MAX_TRENDING_LIMIT = 20;

@Injectable()
export class ProjectsService {
  async createProject(userId: string, createProject: CreateProjectDto) {
    const cleanProject = { ...createProject, userId };
    const [data] = await db.insert(projects).values(cleanProject).returning();
    return { message: 'Project created successfully.', data };
  }

  async getAllProjects(userId: string) {
    const data = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId));

    if (data.length === 0) {
      throw new NotFoundException('No project founded');
    }
    return { message: 'Projects retrieved successfully', data };
  }

  /**
   * Trending = gato `days` diner moddhe sobcheye beshi like paowa project.
   * Kono project e recent like na thakle newest project gulo dekhabe,
   * tai result kokhono khali hoy na.
   */
  async getTrendingProjects(limit = 10, days = 7, currentUserId?: string) {
    const safeLimit = Math.min(Math.max(limit, 1), MAX_TRENDING_LIMIT);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const recentLikes =
      sql<number>`count(${projectLikes.projectId}) filter (where ${projectLikes.createdAt} >= ${since.toISOString()})`.mapWith(
        Number,
      );

    // Logged in user er jonno: ei user ei project like korechhe kina
    const likedByMe = currentUserId
      ? sql<boolean>`coalesce(bool_or(${projectLikes.userId} = ${currentUserId}), false)`
      : sql<boolean>`false`;

    const data = await db
      .select({
        id: projects.id,
        userId: projects.userId,
        name: projects.name,
        description: projects.description,
        techStack: projects.techStack,
        image: projects.image,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        recentLikes,
        totalLikes: count(projectLikes.projectId),
        likedByMe,
      })
      .from(projects)
      .innerJoin(user, eq(projects.userId, user.id))
      .leftJoin(projectLikes, eq(projectLikes.projectId, projects.id))
      .groupBy(projects.id, user.id)
      .orderBy(desc(recentLikes), desc(projects.createdAt))
      .limit(safeLimit);

    return { message: 'Trending projects retrieved successfully', data };
  }

  async likeProject(projectId: string, userId: string) {
    const [project] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);
    if (!project) {
      throw new NotFoundException(`Project with ID "${projectId}" not found.`);
    }

    // Already liked hole kichu hoy na, error o dey na
    await db
      .insert(projectLikes)
      .values({ projectId, userId })
      .onConflictDoNothing();

    return { message: 'Project liked.', data: { id: projectId } };
  }

  async unlikeProject(projectId: string, userId: string) {
    await db
      .delete(projectLikes)
      .where(
        and(
          eq(projectLikes.projectId, projectId),
          eq(projectLikes.userId, userId),
        ),
      );

    return { message: 'Project unliked.', data: { id: projectId } };
  }

  async getProjectById(id: string) {
    const [data] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    if (!data) {
      throw new NotFoundException(`Project with ID "${id}" not found. `);
    }
    return { message: 'Project retrieved successfully', data };
  }

  async updateProjectById(
    id: string,
    userId: string,
    updatedProject: UpdateProjectDto,
  ) {
    const [data] = await db
      .update(projects)
      .set(updatedProject)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();

    if (!data) {
      throw new NotFoundException('Project not found or access denied.');
    }

    return { message: 'Project updated successfully', data };
  }

  async deleteProjectById(id: string, userId: string) {
    const [data] = await db
      .delete(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, userId)))
      .returning();
    if (!data) {
      throw new NotFoundException('Project not found or access denied.');
    }

    return { message: 'Project deleted successfully.', data: { id: data.id } };
  }
}
