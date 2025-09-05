import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	// 1) 구글 로그인 시작 → 구글 로그인 페이지로 리다이렉트
	@Get('google')
	@UseGuards(AuthGuard('google'))
	async googleAuth() {}

	// 2) 콜백 처리 → upsert → JWT 발급 → 프론트 콜백 페이지로 리다이렉트
	@Get('google/callback')
	@UseGuards(AuthGuard('google'))
	async googleCallback(@Req() req: Request, @Res() res: Response) {
		const frontend = process.env.FRONTEND_URL!
		try {
			const googleUser = req.user as any
			const appUser = await this.authService.upsertUser(googleUser)
			const { accessToken } = await this.authService.issueJwt(appUser)

			// (A-1) 쿼리스트링으로 프론트에 전달
			const url = new URL('/auth/callback', frontend)
			url.searchParams.set('token', accessToken)
			return res.redirect(url.toString())

			// (대안 A-2) HttpOnly 쿠키 사용 시:
			// res.cookie('access_token', accessToken, {
			//   httpOnly: true, secure: false, sameSite: 'lax', maxAge: 3600_000,
			// });
			// return res.redirect(frontend + '/');
		} catch (e) {
			return res.redirect(`${frontend}/login?error=oauth_failed`)
		}
	}
}
