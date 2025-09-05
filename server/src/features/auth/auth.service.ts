import { Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Pool } from 'mysql2/promise'
import { DB_POOL } from '../../common/utils/db.provider'

type GoogleUser = {
	google_sub: string
	email?: string
	name?: string
	avatar_url?: string
	email_verified?: boolean
}

function ttlToMs(ttl: string | undefined, fallbackMs: number) {
	if (!ttl) return fallbackMs
	// 아주 단순 파서: 15m, 7d 형태만 처리
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
		@Inject(DB_POOL) private readonly pool: Pool
	) {}

	async upsertUser(gu: GoogleUser) {
		await this.pool.query(
			`INSERT INTO users (google_sub, email, name, avatar_url, email_verified)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        email = VALUES(email),
        name = VALUES(name),
        avatar_url = VALUES(avatar_url),
        email_verified = VALUES(email_verified),
        updated_at = CURRENT_TIMESTAMP`,
			[
				gu.google_sub,
				gu.email ?? null,
				gu.name ?? null,
				gu.avatar_url ?? null,
				gu.email_verified ? 1 : 0,
			]
		)

		const [rows] = await this.pool.query(
			`SELECT id, email, name, role FROM users WHERE google_sub = ? LIMIT 1`,
			[gu.google_sub]
		)
		const user = Array.isArray(rows) ? (rows as any[])[0] : null
		return user // { id, email, name, role }
	}

	async issueTokens(user: { id: number; email?: string; role?: 'user' | 'admin' }) {
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
