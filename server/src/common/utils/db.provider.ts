import { ConfigType } from '@nestjs/config'
import { Provider } from '@nestjs/common'
import * as mysql from 'mysql2/promise'
import databaseConfig from '../../config/database.config'

export const DB_POOL = Symbol('DB_POOL')

export const DbProvider: Provider = {
	provide: DB_POOL,
	inject: [databaseConfig.KEY],
	useFactory: async (dbCfg: ConfigType<typeof databaseConfig>) => {
		const pool = mysql.createPool({
			host: dbCfg.host,
			port: dbCfg.port,
			user: dbCfg.user,
			password: dbCfg.password,
			database: dbCfg.database,
			waitForConnections: true,
			connectionLimit: dbCfg.connectionLimit,
			queueLimit: 0,
			dateStrings: true,
		})
		return pool
	},
}
