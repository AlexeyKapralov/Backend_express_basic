import mongoose from 'mongoose'
import {SETTINGS} from '../common/config/settings'

export const db = {

    async run(url: string) {
        const dbName = SETTINGS.DB_NAME

        const mongoURI = `${url}${dbName}`

        try {
            await mongoose.connect(mongoURI)
            console.log('it is ok')
        } catch (e) {
            console.log(e)
            console.log('no connection')
            await mongoose.disconnect()
        }
    },


    // getDbName(): Db {
    //     return this.client.db(SETTINGS.DB_NAME)
    // },
    //
    // async run(url: string) {
    //     try {
    //         this.client = new MongoClient(url)
    //         await this.client.connect()
    //         await this.getDbName().command({ping: 1})
    //         console.log('Connected successfully to mongo server')
    //     } catch (e) {
    //         console.log('!!! Cannot connect to db', e)
    //         await this.client.close()
    //     }
    // },
    async stop() {
        await mongoose.connection.close()
        console.log('Connection successfully closed')
    },
    async drop() {
        try {
            await mongoose.connection.dropDatabase()
        } catch (error) {
            console.log('Error in drop db', error)
            await this.stop()
        }
    }
    // ,
    // getCollection() {
    //     return {
            // usersCollection: this.getDbName().collection<IUserDbModel>('users'),
            // blogsCollection: this.getDbName().collection<IBlogDbModel>('blogs'),
            // postsCollection: this.getDbName().collection<IPostDbModel>('posts'),
            // commentsCollection: this.getDbName().collection<ICommentDbModel>('comments'),
            // rateLimitCollection: this.getDbName().collection<IRateLimit>('rateLimit'),
            // devices: this.getDbName().collection<IDeviceModel>('devices')
    //     }
    // }
}



