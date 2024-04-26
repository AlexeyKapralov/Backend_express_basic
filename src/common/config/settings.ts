import { config } from 'dotenv'

config()

export const SETTINGS = {
	ADMIN_AUTH: process.env.ADMIN_AUTH,
	DB_NAME: 'social_dev',
	MONGO_URL: process.env.MONGO_URL || '',
	PORT: process.env.PORT,
	PATH: {
		USERS: '/users',
		AUTH: '/auth',
		TESTING: '/testing/all-data'
	}
}
