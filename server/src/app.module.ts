import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

// feature modules
import { AuthModule } from './features/auth/auth.module'

@Module({
	imports: [
		// .env 로드 (전역)
		ConfigModule.forRoot({ isGlobal: true }),

		// TypeORM 전역 연결
		TypeOrmModule.forRootAsync({
			useFactory: () => ({
				type: 'mysql',
				host: process.env.DB_HOST,
				port: Number(process.env.DB_PORT ?? 3306),
				username: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_NAME,
				charset: 'utf8mb4',
				// 엔티티 자동 로드(각 feature 모듈 forFeature에 등록된 엔티티를 자동 포함)
				autoLoadEntities: true,
				// 개발 중에만 true 고려, 운영은 반드시 false
				synchronize: false,
				// logging: true,
			}),
		}),

		// features
		AuthModule,
		// UsersModule, PlacesModule, ... (추가 시 여기에 import)
	],
})
export class AppModule {}
