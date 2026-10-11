import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import {
  AllowAnonymous,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { FollowsService } from './follows.service';
import { CreateFollowDto } from './dto/create-follow.dto';

@Controller('follows')
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Post()
  follow(
    @Session() session: UserSession,
    @Body() createFollowDto: CreateFollowDto,
  ) {
    return this.followsService.follow(session.user.id, createFollowDto);
  }

  @Get()
  following(@Session() session: UserSession) {
    return this.followsService.getFollowing(session.user.id);
  }

  @Get('followers')
  followers(@Session() session: UserSession) {
    return this.followsService.getFollowers(session.user.id);
  }

  @Get(':userId/followers')
  @AllowAnonymous()
  userFollowers(@Param('userId') userId: string) {
    return this.followsService.getFollowers(userId);
  }

  @Get(':userId/following')
  @AllowAnonymous()
  userFollowing(@Param('userId') userId: string) {
    return this.followsService.getFollowing(userId);
  }

  @Delete(':followingId')
  unfollow(
    @Session() session: UserSession,
    @Param('followingId') followingId: string,
  ) {
    return this.followsService.unfollow(session.user.id, followingId);
  }
}
