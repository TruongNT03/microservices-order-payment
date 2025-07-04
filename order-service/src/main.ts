import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseIntercepter } from './commom/intercepter/response.intercepter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ResponseIntercepter());
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
