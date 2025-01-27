import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppName(): string {
    return 'CasaCem<br> paths: localhost:3000 <br> localhost:3000/users';
  }
}
