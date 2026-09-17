import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { OpenRouterService } from './openrouter.service';

@Module({
  controllers: [AiController],
  providers: [OpenRouterService],
})
export class AiModule {}
