import dotenv from 'dotenv'
dotenv.config()

export const SETTINGS = {
	MONGO_URL: process.env.MONGO_URL,
	ADMIN_AUTH: process.env.ADMIN_AUTH || '',
	DB_NAME: 'social_dev',
	PORT: 5000,
	PATH: {
		ROOT: '/',
		BLOGS: '/blogs',
		POSTS: '/posts',
		TEST_DELETE: '/testing/all-data'
	}
}
