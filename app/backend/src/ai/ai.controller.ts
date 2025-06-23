import { Controller, Post, Res } from '@nestjs/common';
// biome-ignore lint/style/useImportType : nest.jsでエラーが発生するため
import { AiService } from './ai.service';

@Controller()
export class AiController {
  constructor(private readonly aiService: AiService) {}
  @Post()
  async generateText(@Res() res: Response) {
    return await this.aiService.generateText('');
  }
}
