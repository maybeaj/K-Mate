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

@Injectable()
export class AuthService {
	constructor(
		private readonly jwt: JwtService,
		@Inject(DB_POOL) private readonly pool: Pool
	) {}

	async upsertUser(gu: GoogleUser) {
		// UNIQUE KEY(google_sub), email UNIQUE임을 활용한 upsert
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

	async issueJwt(user: { id: number; email?: string; role?: 'user' | 'admin' }) {
		const payload = {
			sub: user.id,
			email: user.email,
			role: user.role ?? 'user',
		}
		const accessToken = await this.jwt.signAsync(payload, {
			secret: process.env.JWT_SECRET!,
			expiresIn: process.env.JWT_EXPIRES_IN ?? '3600s',
		})
		return { accessToken }
	}
}
