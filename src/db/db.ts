import { Db, MongoClient } from 'mongodb'
import { SETTINGS } from '../common/config/settings'
import { IUserDbModel } from '../features/users/models/userDb.model'
import {IBlogDbModel} from "../features/blogs/models/blogDb.model";
import {IPostDbModel} from "../features/posts/models/postDb.model";
import { ICommentDbModel } from '../features/comments/models/commentDb.model'
import {BlockListModel} from "../common/types/blockList.model";

export const db = {
	client: {} as MongoClient,

	getDbName(): Db {
		return this.client.db(SETTINGS.DB_NAME)
	},
	async run(url: string) {
		try {
			this.client = new MongoClient(url)
			await this.client.connect()
			await this.getDbName().command({ ping: 1 })
			console.log('Connected successfully to mongo server')
		} catch (e) {
			console.log('!!! Cannot connect to db', e)
			await this.client.close()
		}
	},
	async stop() {
		console.log('Connection successfully closed')
		await this.client.close()
	},
	async drop() {
		try {
			const collections = await this.getDbName().listCollections().toArray()

			for (const collection of collections) {
				await this.getDbName().collection(collection.name).deleteMany({})
			}
		} catch (error) {
			console.log('Error in drop db', error)
			await this.stop()
		}
	},
	getCollection() {
		return {
			usersCollection: this.getDbName().collection<IUserDbModel>('users'),
			blogsCollection: this.getDbName().collection<IBlogDbModel>('blogs'),
			postsCollection: this.getDbName().collection<IPostDbModel>('posts'),
			commentsCollection: this.getDbName().collection<ICommentDbModel>('comments'),
			blockListCollection: this.getDbName().collection<BlockListModel>('blockList'),
			rateLimitCollection: this.getDbName().collection<IRateLimit>('rateLimit')
		}
	}
}

