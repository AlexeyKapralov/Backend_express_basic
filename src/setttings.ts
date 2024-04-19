export const SETTINGS = {
	MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017',
	DB_NAME: 'social_dev',
	PORT: 5000,
	PATH: {
		ROOT: '/',
		BLOGS: '/blogs',
		POSTS: '/posts',
		TEST_DELETE: '/testing/all-data'
	}
}
