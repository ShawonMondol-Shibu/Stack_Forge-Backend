import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { FollowsService } from './follows.service';

describe('FollowsService', () => {
  let service: FollowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FollowsService],
    }).compile();

    service = module.get<FollowsService>(FollowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects following yourself', async () => {
    await expect(
      service.follow('user-1', { followingId: 'user-1' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
