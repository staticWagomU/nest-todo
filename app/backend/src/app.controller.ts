import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/goodbye')
  getGoodbye(): string {
    return this.appService.getGoodbye();
  }

  @Get()
  index(): string {
    return this.appService.index();
  }
}
