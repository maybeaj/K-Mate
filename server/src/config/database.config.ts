import { registerAs } from '@nestjs/config'

export default registerAs('database', () => ({
	host: process.env.DB_HOST!,
	port: parseInt(process.env.DB_PORT ?? '3306', 10),
	user: process.env.DB_USER!,
	password: process.env.DB_PASS!,
	database: process.env.DB_NAME!,
	connectionLimit: parseInt(process.env.DB_CONN_LIMIT ?? '10', 10),
}))
