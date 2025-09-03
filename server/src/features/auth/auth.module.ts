import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleStrategy } from "./strategies/google.strategy";

@Module({
	imports: [
		PassportModule.register({ session: false }),
		JwtModule.register({
			secret: process.env.JWT_SECRET!,
			signOptions: { expiresIn: process.env.JWT_EXPIRES_IN ?? "3600s" },
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, GoogleStrategy],
})
export class AuthModule {}
