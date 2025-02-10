import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      dismissDefaultMessages: false,
      validationError: {
        target: false,
      },
    }),
  );

  const PORT = process.env.PORT || 3000;

  await app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
}
bootstrap();
