import { config } from 'dotenv'

config()

export const SETTINGS = {
	ADMIN_AUTH: process.env.ADMIN_AUTH,
	DB_NAME: 'social_dev',
	MONGO_URL: process.env.MONGO_URL || '',
	PORT: process.env.PORT,
	EXPIRED_LIFE: { minutes: 30 },
	PATH: {
		USERS: '/users',
		BLOGS: '/blogs',
		POSTS: '/posts',
		COMMENTS: '/comments',
		AUTH: '/auth',
		TESTING: '/testing/all-data'
	},
	SECRET_JWT: process.env.SECRET_JWT || '',
	LOGIN_MAIL: process.env.LOGIN_MAIL || '',
	PASS_MAIL: process.env.PASS_MAIL || '',
}
