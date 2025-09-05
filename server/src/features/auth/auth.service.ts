// src/features/auth/auth.service.ts
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, UserRole } from '../users/user.entity'

type GoogleUser = {
	google_sub: string
	email?: string
	name?: string
	avatar_url?: string
	email_verified?: boolean
}

function ttlToMs(ttl: string | undefined, fallbackMs: number) {
	if (!ttl) return fallbackMs
	const m = ttl.match(/^(\d+)([smhd])$/i)
	if (!m) return fallbackMs
	const n = Number(m[1])
	const u = m[2].toLowerCase()
	const mult = u === 's' ? 1 : u === 'm' ? 60 : u === 'h' ? 3600 : 86400
	return n * mult * 1000
}

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		@InjectRepository(User) private readonly users: Repository<User>
	) {}

	/**
	 * users(email UNIQUE, google_sub UNIQUE) 기준으로 upsert
	 * - email 키로 충돌해도 google_sub, name, avatar_url 등 최신화
	 * - 이후 google_sub 우선, 없으면 email로 조회
	 */
	async upsertUser(gu: GoogleUser) {
		if (!gu.google_sub) throw new Error('google_sub missing')

		// 스키마가 email NOT NULL이면 email이 반드시 있어야 함
		if (!gu.email) throw new Error('email missing from Google profile')

		// TypeORM upsert (MySQL은 내부적으로 ON DUPLICATE KEY UPDATE 사용)
		await this.users.upsert(
			{
				google_sub: gu.google_sub,
				email: gu.email,
				name: gu.name ?? 'User',
				avatar_url: gu.avatar_url ?? null,
				email_verified: gu.email_verified ? 1 : 0,
				role: 'user',
			},
			// conflictPaths는 MySQL에선 고유 키 기준으로 동작. 명시해도 무방.
			{ conflictPaths: ['google_sub', 'email'], skipUpdateIfNoValuesChanged: true }
		)

		// google_sub로 우선 조회, 없으면 email로 보조 조회
		const user =
			(await this.users.findOne({ where: { google_sub: gu.google_sub } })) ??
			(await this.users.findOne({ where: { email: gu.email } }))

		if (!user) throw new Error('upsert succeeded but user not found')

		return user // { id, email, name, role, ... }
	}

	async issueTokens(user: { id: number; email?: string; role?: UserRole }) {
		const payload = { sub: user.id, email: user.email, role: user.role ?? 'user' }

		const accessTtl = process.env.ACCESS_TOKEN_TTL ?? '15m'
		const refreshTtl = process.env.REFRESH_TOKEN_TTL ?? '7d'

		const access = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET!,
			expiresIn: accessTtl,
		})
		const refresh = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET!,
			expiresIn: refreshTtl,
		})

		return {
			access,
			refresh,
			accessMaxAgeMs: ttlToMs(accessTtl, 15 * 60 * 1000),
			refreshMaxAgeMs: ttlToMs(refreshTtl, 7 * 24 * 60 * 60 * 1000),
		}
	}

	async verifyRefresh(token: string) {
		return this.jwt.verifyAsync(token, { secret: process.env.JWT_SECRET! })
	}
}
