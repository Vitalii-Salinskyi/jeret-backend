import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS.split(",");

  app.enableCors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
