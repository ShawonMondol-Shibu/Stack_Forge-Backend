import { Controller, Post, Req, Res } from '@nestjs/common';
import {
  convertToModelMessages,
  pipeUIMessageStreamToResponse,
  streamText,
  UIMessage,
} from 'ai';
import { type Request, type Response } from 'express';
import { OpenRouterService } from './openrouter.service';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('ai')
export class AiController {
  constructor(private readonly openRouterService: OpenRouterService) {}

  @Post()
  @AllowAnonymous()
  async generateResponse(@Req() req: Request, @Res() res: Response) {
    const { messages } = req.body as {
      messages: UIMessage[];
    };

    try {
      const result = streamText({
        model: this.openRouterService.openrouter().chat('stealth/union-alpha'),
        messages: await convertToModelMessages(messages),
      });

      return pipeUIMessageStreamToResponse({
        response: res,
        stream: result.toUIMessageStream(),
      });
    } catch (error) {
      console.error('AI Generation Error:', error);

      if (!res.headersSent) {
        res.status(500).json({
          message: 'Failed to generate AI response',
        });
      }
    }
  }
}
