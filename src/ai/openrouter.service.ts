import { Injectable } from '@nestjs/common';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

@Injectable()
export class OpenRouterService {
  openrouter() {
    return createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
    });
  }
}
