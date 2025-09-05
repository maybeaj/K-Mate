import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	Index,
} from 'typeorm'

// 숫자 변환기 (bigint → number)
const bigintToNumber = {
	to: (v?: number) => v,
	from: (v?: string) => (v ? Number(v) : null),
}

export type UserRole = 'user' | 'admin'

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, name: 'id' })
	id!: number

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 255, name: 'email', nullable: false, unique: true })
	email!: string

	@Column({ type: 'varchar', length: 100, name: 'name', nullable: false })
	name!: string

	@Column({ type: 'varchar', length: 512, name: 'avatar_url', nullable: true })
	avatar_url!: string | null

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 64, name: 'google_sub', unique: true })
	google_sub!: string

	@Column({ type: 'tinyint', width: 1, name: 'email_verified', default: 0 })
	email_verified!: number // boolean처럼 사용(0/1)

	@Column({ type: 'enum', enum: ['user', 'admin'], name: 'role', default: 'user' })
	role!: UserRole

	@CreateDateColumn({ type: 'datetime', name: 'created_at' })
	created_at!: Date

	@UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
	updated_at!: Date
}
