import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.enableCors({
		origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
		credentials: true, // 쿠키 쓰면 true, JWT만 쓰면 false여도 됨
	});

	app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

	const config = new DocumentBuilder()
		.setTitle("K-Mate API")
		.setDescription("K-Mate Backend API Docs")
		.setVersion("1.0.0")
		.addBearerAuth()
		.build();

	const doc = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("/docs", app, doc);

	await app.listen(process.env.APP_PORT ?? 3000);
}
bootstrap();
