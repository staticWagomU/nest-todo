import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  getGoodbye(): string {
    return 'Goodbye!';
  }
  index(): string {
    return 'Index page';
  }
}
