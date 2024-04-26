import { Db, MongoClient } from 'mongodb'
import { SETTINGS } from '../common/config/settings'
import { IUserDBModel } from '../features/users/models/user.db.model'

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
		await this.client.close()
		console.log('Connection successfully closed')
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
			usersCollection: this.getDbName().collection<IUserDBModel>('users')
		}
	}
}
