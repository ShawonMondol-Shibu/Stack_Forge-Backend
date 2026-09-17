import { Controller, Post, Body, Res } from '@nestjs/common';
import {
  pipeUIMessageStreamToResponse,
  streamText,
  toUIMessageStream,
} from 'ai';
import { type Response } from 'express';
import { OpenRouterService } from './openrouter.service';

@Controller('ai')
export class AiController {
  constructor(private readonly openRouterService: OpenRouterService) {}
  @Post()
  async generateResponse(
    @Res() res: Response,
    @Body() body: { prompt: string },
  ) {
    const { prompt } = body;
    const result = streamText({
      model: this.openRouterService
        .openrouter()
        .chat('nvidia/nemotron-3.5-lightning:free'),
      prompt,
    });

    return pipeUIMessageStreamToResponse({
      response: res,
      stream: toUIMessageStream({ stream: result.stream }),
    });
  }
}
