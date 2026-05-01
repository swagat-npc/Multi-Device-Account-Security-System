import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: ["http://localhost:3000"],
    methods: "GET, POST, PATCH, DELETE",
    credentials: true,
    allowedHeaders: "Content-Type, Accept, access-control-allow-origin, access-control-allow-credentials, access-control-allow-methods, access-control-allow-headers",
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
