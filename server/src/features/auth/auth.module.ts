import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { GoogleStrategy } from './strategies/google.strategy'
import { JwtCookieStrategy } from './strategies/jwt-cookie.strategy'

@Module({
	imports: [
		PassportModule.register({ session: false }),
		JwtModule.register({
			secret: process.env.JWT_SECRET!,
			signOptions: { expiresIn: process.env.ACCESS_TOKEN_TTL ?? '15m' },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy, JwtCookieStrategy],
})
export class AuthModule {}
