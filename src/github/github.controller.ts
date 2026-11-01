import { Controller, Get, Req } from '@nestjs/common';
import { GithubService } from './github.service';
import { Session, type UserSession } from '@thallesp/nestjs-better-auth';
import type { Request } from 'express';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('dashboard')
  getDashboard(@Req() request: Request, @Session() session: UserSession) {
    return this.githubService.getDashboard(session.user.id, request.headers);
  }
}
