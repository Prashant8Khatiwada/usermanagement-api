import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Swagger Docs')
    .setDescription('API for managing users')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurity('bearerAuth', {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  app.use(
    '/scalar',
    apiReference({
      url: '/docs-json',
      theme: 'default',
      title: 'API Reference',
      authentication: {
        preferredSecurityScheme: 'bearerAuth',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
