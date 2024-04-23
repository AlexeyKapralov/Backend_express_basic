import { MongoClient } from 'mongodb'
import { SETTINGS } from '../settings'

const url = SETTINGS.MONGO_URL

if (!url) {
	throw new Error('!!!Url database is not defined!!!')
}
const client = new MongoClient(url)

const dbName = 'social_dev'
const db = client.db(dbName)
export const blogsCollection = db.collection('blogs')
export const postsCollection = db.collection('posts')

export async function runDb() {
	try {
		await client.connect()
		console.log('Connected successfully to mongo server')
	} catch {
		console.log('!!! Cannot connect to db')
		await client.close()
	}
}
