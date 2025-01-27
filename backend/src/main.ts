import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';

function getLocalIpAddress() {
  const networkInterfaces = os.networkInterfaces();

  for (const interfaceNames in networkInterfaces) {
    const networkInterface = networkInterfaces[interfaceNames];

    if (networkInterface) {
      for (const network of networkInterface) {
        if (network.family === 'IPv4' && !network.internal) {
          return network.address;
        }
      }
    }
  }
}
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Local IP Address: ${getLocalIpAddress()}`);
}
bootstrap();
